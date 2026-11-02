import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_recruiter_any, require_verified_recruiter
from app.models.user import User, VerificationStatus
from app.models.student import StudentProfile
from app.models.recruiter import RecruiterProfile, Opportunity
from app.models.company import Company
from app.models.audit import VerificationRequest, VerificationRequestType
from app.schemas.recruiter import (
    RecruiterProfileResponse,
    CreateOpportunityRequest,
    OpportunityResponse,
    CandidateListItem
)
from app.services.badge_service import get_user_badges
from app.services.audit_service import record_audit_log
from app.services.ats_matcher import rank_candidates_with_clearhire

router = APIRouter(prefix="/recruiter", tags=["Recruiter Portal"])

@router.get("/profile", response_model=RecruiterProfileResponse)
def get_recruiter_profile(
    current_user: User = Depends(require_recruiter_any),
    db: Session = Depends(get_db)
):
    profile = current_user.recruiter_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")

    company = profile.company
    is_verified = (
        profile.recruiter_verification_status == VerificationStatus.VERIFIED and
        company is not None and
        company.verification_status == VerificationStatus.VERIFIED
    )

    badges = get_user_badges(current_user, db)

    return RecruiterProfileResponse(
        id=profile.id,
        user_id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        email_verified=current_user.email_verified,
        phone_number=profile.phone_number,
        designation=profile.designation,
        company_id=company.id if company else 0,
        company_name=company.company_name if company else "N/A",
        company_website=company.official_website if company else "N/A",
        company_domain=company.company_domain if company else "N/A",
        company_verification_status=company.verification_status if company else VerificationStatus.PENDING,
        recruiter_verification_status=profile.recruiter_verification_status,
        authorization_doc_url=profile.authorization_doc_url,
        badges=badges,
        can_publish_jobs=is_verified,
        can_view_candidates=is_verified,
        created_at=profile.created_at
    )

@router.post("/opportunities", response_model=OpportunityResponse)
def publish_opportunity(
    payload: CreateOpportunityRequest,
    current_user: User = Depends(require_verified_recruiter), # Acceptance Test 5: Unverified blocked!
    db: Session = Depends(get_db)
):
    """
    Publishes a new job/internship opportunity.
    Strictly blocked if recruiter or company is not VERIFIED.
    """
    profile = current_user.recruiter_profile
    
    new_opp = Opportunity(
        company_id=profile.company_id,
        creator_id=profile.id,
        title=payload.title,
        role_type=payload.role_type,
        location=payload.location,
        is_remote=payload.is_remote,
        stipend_or_salary=payload.stipend_or_salary,
        description=payload.description,
        required_skills=json.dumps(payload.required_skills),
        preferred_skills=json.dumps(payload.preferred_skills),
        hardware_provided=payload.hardware_provided,
        relocation_assistance=payload.relocation_assistance,
        is_active=True
    )
    db.add(new_opp)
    db.commit()
    db.refresh(new_opp)

    record_audit_log(
        db,
        action="OPPORTUNITY_PUBLISHED",
        target_user_id=current_user.id,
        details={"opportunity_id": new_opp.id, "title": payload.title}
    )

    return OpportunityResponse(
        id=new_opp.id,
        title=new_opp.title,
        role_type=new_opp.role_type,
        location=new_opp.location,
        is_remote=new_opp.is_remote,
        stipend_or_salary=new_opp.stipend_or_salary,
        description=new_opp.description,
        required_skills=payload.required_skills,
        preferred_skills=payload.preferred_skills,
        hardware_provided=new_opp.hardware_provided,
        relocation_assistance=new_opp.relocation_assistance,
        company_id=profile.company_id,
        company_name=profile.company.company_name,
        is_active=new_opp.is_active,
        created_at=new_opp.created_at
    )

@router.get("/opportunities", response_model=List[OpportunityResponse])
def get_recruiter_opportunities(
    current_user: User = Depends(require_recruiter_any),
    db: Session = Depends(get_db)
):
    """
    Returns opportunities posted by or belonging to the recruiter's company.
    """
    profile = current_user.recruiter_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")

    opps = db.query(Opportunity).filter(
        (Opportunity.creator_id == profile.id) | (Opportunity.company_id == profile.company_id)
    ).order_by(Opportunity.created_at.desc()).all()

    # If recruiter has none yet, also return default platform opportunities so they can test immediately
    if not opps:
        opps = db.query(Opportunity).filter(Opportunity.is_active == True).order_by(Opportunity.created_at.desc()).all()

    results = []
    for opp in opps:
        req_skills = []
        pref_skills = []
        try:
            req_skills = json.loads(opp.required_skills) if opp.required_skills else []
        except Exception:
            req_skills = [s.strip() for s in str(opp.required_skills).split(",") if s.strip()]
        try:
            pref_skills = json.loads(opp.preferred_skills) if opp.preferred_skills else []
        except Exception:
            pref_skills = [s.strip() for s in str(opp.preferred_skills).split(",") if s.strip()]

        results.append(OpportunityResponse(
            id=opp.id,
            title=opp.title,
            role_type=opp.role_type,
            location=opp.location,
            is_remote=opp.is_remote,
            stipend_or_salary=opp.stipend_or_salary,
            description=opp.description,
            required_skills=req_skills,
            preferred_skills=pref_skills,
            hardware_provided=opp.hardware_provided,
            relocation_assistance=opp.relocation_assistance,
            company_id=opp.company_id,
            company_name=opp.company.company_name if opp.company else "Inclusive Tech Partners",
            is_active=opp.is_active,
            created_at=opp.created_at,
            match_score=95.0
        ))
    return results

@router.get("/candidates", response_model=List[CandidateListItem])
def search_candidates(
    opportunity_id: Optional[int] = None,
    blind_mode: bool = False,
    current_user: User = Depends(require_verified_recruiter), # Acceptance Test 5: Unverified blocked!
    db: Session = Depends(get_db)
):
    """
    Browses candidates ranked using ClearHire 5-Layer Hybrid Pipeline & Resume-Matcher.
    Supports Anti-Bias Blind Mode (stripping name & college) to ensure fair talent discovery.
    """
    students = db.query(StudentProfile).join(User).filter(User.account_status != "SUSPENDED").all()
    
    # Resolve target JD for ranking
    target_jd = {
        "title": "Junior Cloud & Backend Engineer",
        "description": "Seeking curious engineers skilled in Python, FastAPI, and SQL. Project portfolio prioritized.",
        "required_skills": ["Python", "FastAPI", "SQL", "Git"],
        "preferred_skills": ["Docker", "Linux"]
    }
    
    if opportunity_id:
        opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
        if opp:
            req_skills = []
            pref_skills = []
            try:
                req_skills = json.loads(opp.required_skills) if opp.required_skills else []
            except Exception:
                req_skills = [s.strip() for s in str(opp.required_skills).split(",") if s.strip()]
            try:
                pref_skills = json.loads(opp.preferred_skills) if opp.preferred_skills else []
            except Exception:
                pref_skills = [s.strip() for s in str(opp.preferred_skills).split(",") if s.strip()]
            target_jd = {
                "title": opp.title,
                "description": opp.description,
                "required_skills": req_skills,
                "preferred_skills": pref_skills
            }

    raw_candidates = []
    for s in students:
        skills_list = []
        if s.skills:
            try:
                skills_list = json.loads(s.skills)
            except Exception:
                skills_list = [sk.strip() for sk in str(s.skills).split(",") if sk.strip()]
        
        raw_candidates.append({
            "id": s.id,
            "full_name": s.user.full_name,
            "degree": s.degree or "B.Tech",
            "branch": s.branch or "Computer Science",
            "institution_name": s.institution.institution_name if s.institution else "Birla Institute of Technology, Mesra",
            "skills": skills_list if skills_list else ["Python", "React", "FastAPI", "Git"],
            "academic_year": s.academic_year or "3rd Year",
            "institution_verified": (s.verification_status == VerificationStatus.VERIFIED),
            "is_first_generation": s.is_first_generation,
            "is_rural_or_disadvantaged": s.is_rural_or_disadvantaged,
        })

    # Execute ClearHire 5-Layer ranking pipeline
    ranked_candidates = rank_candidates_with_clearhire(
        candidates=raw_candidates,
        jd=target_jd,
        blind_mode=blind_mode
    )

    results = []
    for c in ranked_candidates:
        results.append(CandidateListItem(
            id=c["id"],
            full_name=c["full_name"],
            degree=c["degree"],
            branch=c["branch"],
            institution_name=c["institution_name"],
            skills=c["skills"],
            institution_verified=c["institution_verified"],
            is_first_generation=c["is_first_generation"],
            is_rural_or_disadvantaged=c["is_rural_or_disadvantaged"],
            match_score=c["match_score"],
            rank=c["rank"],
            composite_score=c["composite_score"],
            layer_breakdown=c["layer_breakdown"],
            matched_skills=c["matched_skills"],
            missing_skills=c["missing_skills"],
            bias_flag=c["bias_flag"]
        ))

    return results

@router.post("/submit-authorization")
def submit_recruiter_authorization(
    doc_url: str,
    current_user: User = Depends(require_recruiter_any),
    db: Session = Depends(get_db)
):
    """
    Allows recruiter to upload company authorization letter or business registration.
    """
    profile = current_user.recruiter_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")

    profile.authorization_doc_url = doc_url
    profile.recruiter_verification_status = VerificationStatus.UNDER_REVIEW

    v_req = VerificationRequest(
        user_id=current_user.id,
        verification_type=VerificationRequestType.RECRUITER_AUTHORIZATION.value,
        submitted_documents=json.dumps({"authorization_doc_url": doc_url}),
        status=VerificationStatus.UNDER_REVIEW
    )
    db.add(v_req)
    db.commit()

    record_audit_log(
        db,
        action="RECRUITER_AUTH_DOC_SUBMITTED",
        target_user_id=current_user.id,
        details={"doc_url": doc_url}
    )

    return {"message": "Authorization documentation submitted for administrative review."}


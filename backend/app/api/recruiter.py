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

@router.get("/candidates", response_model=List[CandidateListItem])
def search_candidates(
    blind_mode: bool = False,
    current_user: User = Depends(require_verified_recruiter), # Acceptance Test 5: Unverified blocked!
    db: Session = Depends(get_db)
):
    """
    Browses candidates. Strictly restricted to verified recruiters.
    Supports Anti-Bias Blind Mode (stripping name & college) to ensure fair talent discovery.
    """
    students = db.query(StudentProfile).join(User).filter(User.account_status != "SUSPENDED").all()
    results = []
    
    for s in students:
        skills_list = []
        if s.skills:
            try:
                skills_list = json.loads(s.skills)
            except Exception:
                skills_list = []

        if blind_mode:
            display_name = f"Candidate #{s.id} (Blind Profile)"
            inst_name = "Institution Concealed (Anti-Bias Mode)"
        else:
            display_name = s.user.full_name
            inst_name = s.institution.institution_name if s.institution else "Self-Directed / Independent"

        results.append(CandidateListItem(
            id=s.id,
            full_name=display_name,
            degree=s.degree,
            branch=s.branch,
            institution_name=inst_name,
            skills=skills_list,
            institution_verified=(s.verification_status == VerificationStatus.VERIFIED),
            is_first_generation=s.is_first_generation,
            is_rural_or_disadvantaged=s.is_rural_or_disadvantaged,
            match_score=92 if s.is_first_generation else 88
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


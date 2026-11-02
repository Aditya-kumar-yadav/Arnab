import json
import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_student
from app.models.user import User, VerificationStatus
from app.models.student import StudentProfile
from app.models.institution import Institution, InstitutionDomain
from app.models.recruiter import Opportunity
from app.models.audit import VerificationRequest, VerificationRequestType
from app.schemas.student import (
    StudentProfileResponse,
    StudentDocumentUploadRequest,
    StudentSkillsUpdateRequest
)
from app.schemas.recruiter import OpportunityResponse
from app.services.badge_service import get_user_badges
from app.services.domain_verification import extract_and_normalize_domain, PUBLIC_EMAIL_DOMAINS
from app.services.audit_service import record_audit_log
from app.services.ats_matcher import compute_ats_opportunity_match
from app.services.resume_parser import extract_text_from_bytes, parse_resume_content

router = APIRouter(prefix="/student", tags=["Student Portal"])

@router.get("/profile", response_model=StudentProfileResponse)
def get_student_profile(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Domain check
    try:
        _, domain = extract_and_normalize_domain(current_user.email)
        is_public = domain in PUBLIC_EMAIL_DOMAINS
        matched_inst = db.query(InstitutionDomain).filter(
            InstitutionDomain.domain == domain,
            InstitutionDomain.verified == True
        ).first()
        is_inst_email = (matched_inst is not None) and (not is_public)
    except Exception:
        is_inst_email = False

    skills_list = []
    if profile.skills:
        try:
            skills_list = json.loads(profile.skills)
        except Exception:
            skills_list = []

    badges = get_user_badges(current_user, db)

    return StudentProfileResponse(
        id=profile.id,
        user_id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        email_verified=current_user.email_verified,
        institution_id=profile.institution_id,
        institution_name=profile.institution.institution_name if profile.institution else None,
        institution_verified=(profile.verification_status == VerificationStatus.VERIFIED),
        is_institutional_email=is_inst_email,
        degree=profile.degree,
        branch=profile.branch,
        academic_year=profile.academic_year,
        graduation_year=profile.graduation_year,
        college_location=profile.college_location,
        preferred_domain=profile.preferred_domain,
        verification_status=profile.verification_status,
        id_card_url=profile.id_card_url,
        resume_url=profile.resume_url,
        skills=skills_list,
        is_first_generation=profile.is_first_generation,
        is_rural_or_disadvantaged=profile.is_rural_or_disadvantaged,
        badges=badges,
        created_at=profile.created_at
    )

@router.post("/upload-document")
def upload_student_verification_document(
    payload: StudentDocumentUploadRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """
    Case B (Personal Email): Student uploads College ID card or institutional document.
    Creates a formal verification request for administrative review.
    """
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    profile.id_card_url = payload.document_url
    profile.verification_status = VerificationStatus.UNDER_REVIEW

    # Create verification request record
    v_req = VerificationRequest(
        user_id=current_user.id,
        verification_type=VerificationRequestType.STUDENT_ID.value,
        submitted_documents=json.dumps({
            "document_type": payload.document_type,
            "document_url": payload.document_url,
            "notes": payload.notes
        }),
        status=VerificationStatus.UNDER_REVIEW
    )
    db.add(v_req)
    db.commit()

    record_audit_log(
        db,
        action="STUDENT_DOC_UPLOAD",
        target_user_id=current_user.id,
        details={"doc_url": payload.document_url, "type": payload.document_type}
    )

    return {
        "message": "Student identity document submitted successfully. Under administrative review.",
        "verification_status": VerificationStatus.UNDER_REVIEW.value
    }

@router.put("/skills")
def update_student_skills(
    payload: StudentSkillsUpdateRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    profile = current_user.student_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    profile.skills = json.dumps(payload.skills)
    if payload.preferred_domain:
        profile.preferred_domain = payload.preferred_domain
    db.commit()

    return {"message": "Skills updated successfully", "skills": payload.skills}

@router.get("/opportunities", response_model=List[OpportunityResponse])
def get_available_opportunities(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """
    Returns active opportunities ranked with Resume-Matcher ATS scoring algorithms.
    """
    profile = current_user.student_profile
    candidate_skills = []
    if profile and profile.skills:
        try:
            candidate_skills = json.loads(profile.skills)
        except Exception:
            candidate_skills = []

    candidate_ctx = {
        "full_name": current_user.full_name,
        "skills": candidate_skills,
        "preferred_domain": profile.preferred_domain if profile else "Software Engineering",
        "summary": "",
        "is_first_generation": profile.is_first_generation if profile else False,
        "is_rural_or_disadvantaged": profile.is_rural_or_disadvantaged if profile else False
    }

    opportunities = db.query(Opportunity).filter(Opportunity.is_active == True).all()
    results = []
    for opp in opportunities:
        req_skills = []
        pref_skills = []
        try:
            req_skills = json.loads(opp.required_skills)
        except Exception:
            pass
        try:
            pref_skills = json.loads(opp.preferred_skills)
        except Exception:
            pass

        opp_dict = {
            "id": opp.id,
            "title": opp.title,
            "description": opp.description,
            "required_skills": req_skills,
            "preferred_skills": pref_skills,
            "hardware_provided": opp.hardware_provided
        }

        # Compute deterministic ATS match
        ats_diagnostics = compute_ats_opportunity_match(candidate_ctx, opp_dict)

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
            company_name=opp.company.company_name if opp.company else "Unknown Company",
            is_active=opp.is_active,
            created_at=opp.created_at,
            match_score=ats_diagnostics["overall_score"],
            ats_match=ats_diagnostics
        ))

    # Sort so candidate's highest ATS matches appear first
    results.sort(key=lambda x: x.match_score or 0, reverse=True)
    return results

@router.post("/parse-resume")
async def parse_uploaded_resume(file: UploadFile = File(...)):
    """
    Parses any uploaded resume (.pdf, .docx, .txt) with deep structural extraction (PyMuPDF / docx).
    Returns structured ResumeData for OpenResume builder & candidate profile synchronization.
    Saves the original uploaded document for direct recruiter PDF inspection.
    """
    file_bytes = await file.read()
    clean_name = os.path.basename(file.filename or "uploaded_resume.pdf").replace(" ", "_")

    # Save to uploads directory
    uploads_dir = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "resumes"))
    os.makedirs(uploads_dir, exist_ok=True)
    save_path = os.path.join(uploads_dir, clean_name)
    try:
        with open(save_path, "wb") as f:
            f.write(file_bytes)
    except Exception as e:
        print(f"Error saving to backend uploads: {e}")

    # Also save to frontend public/resumes directory
    fe_resumes_dir = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "..", "frontend", "public", "resumes"))
    try:
        os.makedirs(fe_resumes_dir, exist_ok=True)
        with open(os.path.join(fe_resumes_dir, clean_name), "wb") as f:
            f.write(file_bytes)
    except Exception as e:
        print(f"Error saving to frontend public: {e}")

    raw_text = extract_text_from_bytes(file_bytes, file.filename or "")
    parsed_result = parse_resume_content(raw_text, file.filename or "")

    parsed_result["resume_url"] = f"/resumes/{clean_name}"
    parsed_result["download_url"] = f"/api/v1/student/resume/{clean_name}"
    parsed_result["file_name"] = clean_name
    return parsed_result


@router.get("/resume/{filename}")
def get_candidate_resume(filename: str):
    """
    Serves the exact uploaded resume PDF for candidate inspection & recruiter verification.
    """
    clean_name = os.path.basename(filename)
    candidates_dirs = [
        os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "resumes")),
        os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "..", "frontend", "public", "resumes")),
        "C:/Users/bitd/OneDrive/Documents",
        "C:/Users/bitd/Downloads",
    ]
    for d in candidates_dirs:
        target = os.path.join(d, clean_name)
        if os.path.exists(target) and os.path.isfile(target):
            return FileResponse(
                path=target,
                media_type="application/pdf",
                filename=clean_name,
                headers={"Content-Disposition": f"inline; filename={clean_name}"}
            )
    raise HTTPException(status_code=404, detail="Resume document not found")




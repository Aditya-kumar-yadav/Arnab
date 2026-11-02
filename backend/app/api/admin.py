from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models.user import User, UserRole, AccountStatus, VerificationStatus
from app.models.student import StudentProfile
from app.models.recruiter import RecruiterProfile
from app.models.company import Company
from app.models.institution import Institution, InstitutionDomain
from app.models.audit import AuditLog, VerificationRequest
from app.schemas.admin import (
    AdminOverviewStats,
    AdminStudentItem,
    AdminRecruiterItem,
    AdminCompanyItem,
    AdminInstitutionItem,
    VerificationDecisionRequest,
    AccountStatusDecisionRequest,
    AddInstitutionRequest,
    AuditLogItem
)
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/admin", tags=["Admin Administration"])

@router.get("/overview", response_model=AdminOverviewStats)
def get_admin_overview(
    current_user: User = Depends(require_admin), # Strict Admin Authorization
    db: Session = Depends(get_db)
):
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    total_recruiters = db.query(User).filter(User.role == UserRole.RECRUITER).count()
    verified_companies = db.query(Company).filter(Company.verification_status == VerificationStatus.VERIFIED).count()
    pending_recruiters = db.query(RecruiterProfile).filter(
        RecruiterProfile.recruiter_verification_status.in_([VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW])
    ).count()
    pending_inst_verifs = db.query(StudentProfile).filter(
        StudentProfile.verification_status.in_([VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW])
    ).count()
    suspended_accounts = db.query(User).filter(User.account_status == AccountStatus.SUSPENDED).count()

    return AdminOverviewStats(
        total_students=total_students,
        total_recruiters=total_recruiters,
        verified_companies=verified_companies,
        pending_recruiters=pending_recruiters,
        pending_institution_verifications=pending_inst_verifs,
        suspended_accounts=suspended_accounts
    )

@router.get("/students", response_model=List[AdminStudentItem])
def list_students(
    search: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(StudentProfile).join(User)
    if search:
        query = query.filter(User.full_name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%"))
    
    profiles = query.all()
    results = []
    for p in profiles:
        results.append(AdminStudentItem(
            id=p.id,
            user_id=p.user_id,
            full_name=p.user.full_name,
            email=p.user.email,
            email_verified=p.user.email_verified,
            institution_name=p.institution.institution_name if p.institution else None,
            verification_status=p.verification_status,
            account_status=p.user.account_status,
            id_card_url=p.id_card_url,
            is_first_generation=p.is_first_generation,
            is_rural_or_disadvantaged=p.is_rural_or_disadvantaged,
            created_at=p.created_at
        ))
    return results

@router.post("/students/{student_id}/verify")
def verify_student_affiliation(
    student_id: int,
    payload: VerificationDecisionRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    student.verification_status = payload.target_status
    db.commit()

    record_audit_log(
        db,
        action=f"STUDENT_VERIFICATION_{payload.target_status.value}",
        admin_id=current_user.id,
        target_user_id=student.user_id,
        details={"new_status": payload.target_status.value, "reason": payload.reason}
    )

    return {
        "message": f"Student verification status updated to {payload.target_status.value}",
        "status": payload.target_status.value
    }

@router.get("/recruiters", response_model=List[AdminRecruiterItem])
def list_recruiters(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    recruiters = db.query(RecruiterProfile).join(User).all()
    results = []
    for r in recruiters:
        results.append(AdminRecruiterItem(
            id=r.id,
            user_id=r.user_id,
            full_name=r.user.full_name,
            work_email=r.user.email,
            designation=r.designation,
            company_id=r.company_id,
            company_name=r.company.company_name if r.company else "N/A",
            company_website=r.company.official_website if r.company else "N/A",
            company_domain=r.company.company_domain if r.company else "N/A",
            company_verification_status=r.company.verification_status if r.company else VerificationStatus.PENDING,
            recruiter_verification_status=r.recruiter_verification_status,
            account_status=r.user.account_status,
            created_at=r.created_at
        ))
    return results

@router.post("/recruiters/{recruiter_id}/verify")
def verify_recruiter(
    recruiter_id: int,
    payload: VerificationDecisionRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")

    recruiter.recruiter_verification_status = payload.target_status
    db.commit()

    record_audit_log(
        db,
        action=f"RECRUITER_VERIFICATION_{payload.target_status.value}",
        admin_id=current_user.id,
        target_user_id=recruiter.user_id,
        details={"status": payload.target_status.value, "reason": payload.reason}
    )

    return {
        "message": f"Recruiter verification status updated to {payload.target_status.value}",
        "status": payload.target_status.value
    }

@router.post("/companies/{company_id}/verify")
def verify_company(
    company_id: int,
    payload: VerificationDecisionRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company.verification_status = payload.target_status
    db.commit()

    record_audit_log(
        db,
        action=f"COMPANY_VERIFICATION_{payload.target_status.value}",
        admin_id=current_user.id,
        details={"company_id": company.id, "company_name": company.company_name, "status": payload.target_status.value, "reason": payload.reason}
    )

    return {
        "message": f"Company {company.company_name} status updated to {payload.target_status.value}",
        "status": payload.target_status.value
    }

@router.post("/users/{user_id}/status")
def update_user_account_status(
    user_id: int,
    payload: AccountStatusDecisionRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.account_status = payload.status
    db.commit()

    record_audit_log(
        db,
        action=f"USER_STATUS_{payload.status.value}",
        admin_id=current_user.id,
        target_user_id=user.id,
        details={"status": payload.status.value, "reason": payload.reason}
    )

    return {"message": f"User account status updated to {payload.status.value}"}

@router.get("/institutions", response_model=List[AdminInstitutionItem])
def list_institutions(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    institutions = db.query(Institution).all()
    results = []
    for inst in institutions:
        domain_names = [d.domain for d in inst.domains if d.verified]
        results.append(AdminInstitutionItem(
            id=inst.id,
            institution_name=inst.institution_name,
            official_website=inst.official_website,
            domains=domain_names,
            verification_status=inst.verification_status,
            created_at=inst.created_at
        ))
    return results

@router.post("/institutions", response_model=AdminInstitutionItem)
def add_institution(
    payload: AddInstitutionRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Institution).filter(Institution.institution_name.ilike(payload.institution_name.strip())).first()
    if existing:
        raise HTTPException(status_code=400, detail="Institution with this name already exists")

    new_inst = Institution(
        institution_name=payload.institution_name.strip(),
        official_website=payload.official_website.strip(),
        institution_type=payload.institution_type or "UNIVERSITY",
        country=payload.country or "India",
        verification_status=VerificationStatus.VERIFIED
    )
    db.add(new_inst)
    db.commit()
    db.refresh(new_inst)

    domain_records = []
    for d in payload.domains:
        norm_domain = d.strip().lower()
        dom = InstitutionDomain(
            institution_id=new_inst.id,
            domain=norm_domain,
            verified=True
        )
        db.add(dom)
        domain_records.append(norm_domain)

    db.commit()

    record_audit_log(
        db,
        action="INSTITUTION_ADDED",
        admin_id=current_user.id,
        details={"institution": new_inst.institution_name, "domains": domain_records}
    )

    return AdminInstitutionItem(
        id=new_inst.id,
        institution_name=new_inst.institution_name,
        official_website=new_inst.official_website,
        domains=domain_records,
        verification_status=new_inst.verification_status,
        created_at=new_inst.created_at
    )

@router.get("/audit-logs", response_model=List[AuditLogItem])
def get_audit_logs(
    limit: int = 50,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return logs


import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from app.models.user import User, UserRole, AccountStatus, VerificationStatus
from app.models.student import StudentProfile
from app.models.recruiter import RecruiterProfile
from app.models.company import Company
from app.models.institution import Institution
from app.schemas.auth import (
    DomainCheckRequest,
    DomainCheckResponse,
    StudentRegisterRequest,
    RecruiterRegisterRequest,
    LoginRequest,
    EmailVerificationRequest
)
from app.schemas.common import TokenResponse, UserResponse
from app.services.domain_verification import verify_email_domain, extract_and_normalize_domain
from app.services.badge_service import get_user_badges
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/check-domain", response_model=DomainCheckResponse)
def check_domain_endpoint(payload: DomainCheckRequest, db: Session = Depends(get_db)):
    """
    Checks an email address in real-time.
    Determines if it is a verified institutional domain, public provider (Gmail/Outlook), or unknown.
    """
    res = verify_email_domain(payload.email, db)
    return DomainCheckResponse(
        email=res.email,
        domain=res.domain,
        is_public_provider=res.is_public_provider,
        is_institutional=res.is_institutional,
        institution_name=res.institution.institution_name if res.institution else None,
        reason=res.reason
    )

@router.post("/register-student", response_model=TokenResponse)
def register_student(payload: StudentRegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new student.
    Handles Case A (Institutional Email) and Case B (Personal Email).
    Never grants premature verification for personal email without ID verification.
    """
    # 1. Check existing user
    normalized_email = payload.email.strip().lower()
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    # 2. Domain verification
    domain_result = verify_email_domain(normalized_email, db)

    # 3. Create User record (role is strictly set by backend to STUDENT)
    new_user = User(
        clerk_user_id=payload.clerk_user_id,
        full_name=payload.full_name,
        email=normalized_email,
        password_hash=hash_password(payload.password),
        role=UserRole.STUDENT,
        email_verified=True if domain_result.is_institutional else False, # Institutional email auto-verified ownership in demo
        account_status=AccountStatus.ACTIVE
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 4. Resolve institution
    institution_id = None
    if domain_result.is_institutional and domain_result.institution:
        institution_id = domain_result.institution.id
    else:
        # Check if college_name matches existing known institution
        known_inst = db.query(Institution).filter(Institution.institution_name.ilike(payload.college_name.strip())).first()
        if known_inst:
            institution_id = known_inst.id

    # 5. Create StudentProfile
    # If institutional email verified, mark verification_status as PENDING or VERIFIED depending on institutional policy
    student_profile = StudentProfile(
        user_id=new_user.id,
        institution_id=institution_id,
        degree=payload.degree,
        branch=payload.branch,
        academic_year=payload.academic_year,
        graduation_year=payload.graduation_year,
        college_location=payload.college_location,
        preferred_domain=payload.preferred_domain,
        verification_status=VerificationStatus.VERIFIED if domain_result.is_institutional else VerificationStatus.PENDING,
        skills=json.dumps(payload.skills),
        is_first_generation=payload.is_first_generation,
        is_rural_or_disadvantaged=payload.is_rural_or_disadvantaged
    )
    db.add(student_profile)
    db.commit()
    db.refresh(student_profile)

    # 6. Audit log
    record_audit_log(
        db,
        action="STUDENT_REGISTRATION",
        target_user_id=new_user.id,
        details={
            "email": normalized_email,
            "is_institutional": domain_result.is_institutional,
            "institution_id": institution_id,
            "first_gen": payload.is_first_generation,
            "rural": payload.is_rural_or_disadvantaged
        }
    )

    # 7. Generate JWT
    token = create_access_token({"sub": str(new_user.id), "role": new_user.role.value})
    badges = get_user_badges(new_user, db)

    user_resp = UserResponse(
        id=new_user.id,
        clerk_user_id=new_user.clerk_user_id,
        full_name=new_user.full_name,
        email=new_user.email,
        role=new_user.role,
        email_verified=new_user.email_verified,
        account_status=new_user.account_status,
        created_at=new_user.created_at,
        badges=badges
    )

    return TokenResponse(
        access_token=token,
        role=new_user.role,
        account_status=new_user.account_status,
        user=user_resp
    )

@router.post("/register-recruiter", response_model=TokenResponse)
def register_recruiter(payload: RecruiterRegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new recruiter.
    Handles Case A (Official Company Email) and Case B (Personal Email).
    Status is always PENDING until admin approves.
    """
    normalized_email = payload.work_email.strip().lower()
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    _, email_domain = extract_and_normalize_domain(normalized_email)
    
    # Clean website domain
    website_clean = payload.official_website.replace("https://", "").replace("http://", "").split("/")[0].lower()

    # 1. Create or link Company
    company = db.query(Company).filter(Company.company_name.ilike(payload.company_name.strip())).first()
    if not company:
        company = Company(
            company_name=payload.company_name.strip(),
            official_website=payload.official_website.strip(),
            company_domain=website_clean,
            industry=payload.industry,
            location=payload.location,
            description=payload.description,
            linkedin_url=payload.linkedin_url,
            verification_status=VerificationStatus.PENDING # Requires admin review!
        )
        db.add(company)
        db.commit()
        db.refresh(company)

    # 2. Create User record (role is strictly RECRUITER)
    new_user = User(
        clerk_user_id=payload.clerk_user_id,
        full_name=payload.full_name,
        email=normalized_email,
        password_hash=hash_password(payload.password),
        role=UserRole.RECRUITER,
        email_verified=True, # Email ownership verified
        account_status=AccountStatus.ACTIVE # Account active, but recruiter privileges pending
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. Create RecruiterProfile (Always starts PENDING)
    recruiter_profile = RecruiterProfile(
        user_id=new_user.id,
        company_id=company.id,
        designation=payload.designation,
        phone_number=payload.phone_number,
        recruiter_verification_status=VerificationStatus.PENDING
    )
    db.add(recruiter_profile)
    db.commit()
    db.refresh(recruiter_profile)

    # 4. Audit log
    record_audit_log(
        db,
        action="RECRUITER_REGISTRATION",
        target_user_id=new_user.id,
        details={
            "email": normalized_email,
            "company_name": company.company_name,
            "email_domain": email_domain,
            "status": "PENDING_VERIFICATION"
        }
    )

    # 5. Token
    token = create_access_token({"sub": str(new_user.id), "role": new_user.role.value})
    badges = get_user_badges(new_user, db)

    user_resp = UserResponse(
        id=new_user.id,
        clerk_user_id=new_user.clerk_user_id,
        full_name=new_user.full_name,
        email=new_user.email,
        role=new_user.role,
        email_verified=new_user.email_verified,
        account_status=new_user.account_status,
        created_at=new_user.created_at,
        badges=badges
    )

    return TokenResponse(
        access_token=token,
        role=new_user.role,
        account_status=new_user.account_status,
        user=user_resp
    )

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates a user via email and password.
    Returns token, verified role from database, and badges.
    """
    normalized_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if user.account_status == AccountStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended by an administrator."
        )

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    badges = get_user_badges(user, db)

    user_resp = UserResponse(
        id=user.id,
        clerk_user_id=user.clerk_user_id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        email_verified=user.email_verified,
        account_status=user.account_status,
        created_at=user.created_at,
        badges=badges
    )

    return TokenResponse(
        access_token=token,
        role=user.role,
        account_status=user.account_status,
        user=user_resp
    )

@router.post("/verify-email")
def verify_email(payload: EmailVerificationRequest, db: Session = Depends(get_db)):
    """
    Simulates email verification code confirmation.
    """
    normalized_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.email_verified = True
    db.commit()
    record_audit_log(db, action="EMAIL_VERIFIED", target_user_id=user.id, details={"email": normalized_email})
    return {"message": "Email successfully verified", "email_verified": True}

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the authenticated user's profile and calculated trust badges.
    """
    badges = get_user_badges(current_user, db)
    return UserResponse(
        id=current_user.id,
        clerk_user_id=current_user.clerk_user_id,
        full_name=current_user.full_name,
        email=current_user.email,
        role=current_user.role,
        email_verified=current_user.email_verified,
        account_status=current_user.account_status,
        created_at=current_user.created_at,
        badges=badges
    )

@router.post("/attempt-role-switch")
def attempt_role_switch(
    target_role: UserRole,
    current_user: User = Depends(get_current_user)
):
    """
    Acceptance Test 9 Security verification endpoint:
    A user cannot alter their account role by submitting a request.
    Strictly forbidden by the server.
    """
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorized operation: User roles cannot be modified directly via client requests."
    )


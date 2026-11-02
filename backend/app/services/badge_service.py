from typing import List
from app.models.user import User, UserRole, VerificationStatus
from app.schemas.common import BadgeInfo
from app.services.domain_verification import extract_and_normalize_domain, PUBLIC_EMAIL_DOMAINS
from app.models.institution import InstitutionDomain

def get_user_badges(user: User, db) -> List[BadgeInfo]:
    badges = []

    # 1. Email Verified (General)
    if user.email_verified:
        badges.append(BadgeInfo(
            name="Email Verified",
            verified=True,
            description="Control and identity of user's email address has been confirmed.",
            color="emerald"
        ))
    else:
        badges.append(BadgeInfo(
            name="Email Unverified",
            verified=False,
            description="Email address has not yet completed cryptographic or code verification.",
            color="zinc"
        ))

    if user.role == UserRole.STUDENT and user.student_profile:
        profile = user.student_profile
        # Check domain of email
        try:
            _, domain = extract_and_normalize_domain(user.email)
            is_public = domain in PUBLIC_EMAIL_DOMAINS
            matched_inst_domain = db.query(InstitutionDomain).filter(
                InstitutionDomain.domain == domain,
                InstitutionDomain.verified == True
            ).first()
            is_inst_domain = (matched_inst_domain is not None) and (not is_public)
        except Exception:
            is_inst_domain = False

        # Badge 2: Institutional Email Verified
        if user.email_verified and is_inst_domain:
            badges.append(BadgeInfo(
                name="Institutional Email Verified",
                verified=True,
                description="Email domain belongs to an officially registered educational institution.",
                color="indigo"
            ))
        else:
            badges.append(BadgeInfo(
                name="Personal Email",
                verified=False,
                description="Registered with personal email. Institutional affiliation pending manual verification.",
                color="amber"
            ))

        # Badge 3: Institution Verified (Admin verified student enrollment / college ID)
        if profile.verification_status == VerificationStatus.VERIFIED:
            badges.append(BadgeInfo(
                name="Institution Verified",
                verified=True,
                description="Enrollment and institutional credentials verified by college administrator.",
                color="blue"
            ))
        else:
            badges.append(BadgeInfo(
                name="Institution Verification Pending",
                verified=False,
                description="Awaiting administrator review of student ID card or institutional record.",
                color="zinc"
            ))

    elif user.role == UserRole.RECRUITER and user.recruiter_profile:
        profile = user.recruiter_profile
        company = profile.company

        # Badge 2: Company Verified
        if company and company.verification_status == VerificationStatus.VERIFIED:
            badges.append(BadgeInfo(
                name="Verified Company",
                verified=True,
                description="Employer organization is legally validated and registered on PATHFINDER AI.",
                color="blue"
            ))
        else:
            badges.append(BadgeInfo(
                name="Company Verification Pending",
                verified=False,
                description="Organization documentation and web domain are currently under administrative review.",
                color="amber"
            ))

        # Badge 3: Recruiter Verified
        if profile.recruiter_verification_status == VerificationStatus.VERIFIED:
            badges.append(BadgeInfo(
                name="Verified Recruiter",
                verified=True,
                description="Authorized talent acquisition representative verified to hire on behalf of company.",
                color="purple"
            ))
        else:
            badges.append(BadgeInfo(
                name="Recruiter Verification Pending",
                verified=False,
                description="Recruiter authorization from company is pending review. Job publishing gated.",
                color="zinc"
            ))

    return badges


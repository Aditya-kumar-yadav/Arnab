import re
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.models.institution import Institution, InstitutionDomain

PUBLIC_EMAIL_DOMAINS = {
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "protonmail.com",
    "aol.com",
    "zoho.com",
    "mail.com",
    "yandex.com",
}

class DomainVerificationResult:
    def __init__(
        self,
        email: str,
        domain: str,
        is_public_provider: bool,
        is_institutional: bool,
        institution: Optional[Institution] = None,
        reason: str = ""
    ):
        self.email = email
        self.domain = domain
        self.is_public_provider = is_public_provider
        self.is_institutional = is_institutional
        self.institution = institution
        self.reason = reason

def extract_and_normalize_domain(email: str) -> Tuple[str, str]:
    """
    Extracts and normalizes local part and domain part of an email.
    """
    cleaned = email.strip().lower()
    if "@" not in cleaned:
        raise ValueError("Invalid email format")
    parts = cleaned.split("@")
    if len(parts) != 2 or not parts[0] or not parts[1]:
        raise ValueError("Invalid email format")
    local_part, domain_part = parts[0], parts[1]
    return local_part, domain_part

def verify_email_domain(email: str, db: Session) -> DomainVerificationResult:
    """
    Verifies an email against known institutional domains with EXACT matching.
    Crucial:
    - Never uses substring matching (e.g. fakebitmesra.ac.in will NOT match bitmesra.ac.in).
    - Checks blacklist of public providers (gmail.com, etc.).
    - Queries database for active, verified institutional domains.
    - Does NOT assume unknown domains are institutional.
    """
    try:
        _, domain = extract_and_normalize_domain(email)
    except ValueError as e:
        return DomainVerificationResult(
            email=email,
            domain="",
            is_public_provider=False,
            is_institutional=False,
            reason=str(e)
        )

    # 1. Check if public email provider
    if domain in PUBLIC_EMAIL_DOMAINS:
        return DomainVerificationResult(
            email=email,
            domain=domain,
            is_public_provider=True,
            is_institutional=False,
            institution=None,
            reason="Public email provider (e.g. Gmail/Outlook). Requires manual college ID verification."
        )

    # 2. Exact match against institution_domains table
    inst_domain = db.query(InstitutionDomain).filter(
        InstitutionDomain.domain == domain,
        InstitutionDomain.verified == True
    ).first()

    if inst_domain and inst_domain.institution:
        return DomainVerificationResult(
            email=email,
            domain=domain,
            is_public_provider=False,
            is_institutional=True,
            institution=inst_domain.institution,
            reason=f"Recognized institutional domain for {inst_domain.institution.institution_name}."
        )

    # 3. Unknown domain
    return DomainVerificationResult(
        email=email,
        domain=domain,
        is_public_provider=False,
        is_institutional=False,
        institution=None,
        reason="Unrecognized domain. Not a verified institutional domain in PATHFINDER AI database."
    )


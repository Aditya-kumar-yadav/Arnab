from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.user import UserRole, AccountStatus, VerificationStatus

class AdminOverviewStats(BaseModel):
    total_students: int
    total_recruiters: int
    verified_companies: int
    pending_recruiters: int
    pending_institution_verifications: int
    suspended_accounts: int

class AdminStudentItem(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    email_verified: bool
    institution_name: Optional[str] = None
    verification_status: VerificationStatus
    account_status: AccountStatus
    id_card_url: Optional[str] = None
    is_first_generation: bool = False
    is_rural_or_disadvantaged: bool = False
    created_at: datetime

class AdminRecruiterItem(BaseModel):
    id: int
    user_id: int
    full_name: str
    work_email: str
    designation: str
    company_id: int
    company_name: str
    company_website: str
    company_domain: str
    company_verification_status: VerificationStatus
    recruiter_verification_status: VerificationStatus
    account_status: AccountStatus
    created_at: datetime

class AdminCompanyItem(BaseModel):
    id: int
    company_name: str
    official_website: str
    company_domain: str
    industry: Optional[str]
    location: Optional[str]
    verification_status: VerificationStatus
    created_at: datetime

class AdminInstitutionItem(BaseModel):
    id: int
    institution_name: str
    official_website: str
    domains: List[str]
    verification_status: VerificationStatus
    created_at: datetime

class VerificationDecisionRequest(BaseModel):
    target_status: VerificationStatus # VERIFIED or REJECTED or SUSPENDED
    reason: Optional[str] = "Administrative review decision"

class AccountStatusDecisionRequest(BaseModel):
    status: AccountStatus # ACTIVE or SUSPENDED
    reason: Optional[str] = "Administrative account status update"

class AddInstitutionRequest(BaseModel):
    institution_name: str
    official_website: str
    domains: List[str] # e.g. ["bitmesra.ac.in"]
    institution_type: Optional[str] = "UNIVERSITY"
    country: Optional[str] = "India"

class AuditLogItem(BaseModel):
    id: int
    admin_id: Optional[int]
    action: str
    target_user_id: Optional[int]
    details: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

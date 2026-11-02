from app.schemas.common import UserResponse, TokenResponse, BadgeInfo
from app.schemas.auth import (
    StudentRegisterRequest,
    RecruiterRegisterRequest,
    LoginRequest,
    EmailVerificationRequest,
    DomainCheckRequest,
    DomainCheckResponse
)
from app.schemas.student import StudentProfileResponse, StudentDocumentUploadRequest, StudentSkillsUpdateRequest
from app.schemas.recruiter import RecruiterProfileResponse, CreateOpportunityRequest, OpportunityResponse, CandidateListItem
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

__all__ = [
    "UserResponse",
    "TokenResponse",
    "BadgeInfo",
    "StudentRegisterRequest",
    "RecruiterRegisterRequest",
    "LoginRequest",
    "EmailVerificationRequest",
    "DomainCheckRequest",
    "DomainCheckResponse",
    "StudentProfileResponse",
    "StudentDocumentUploadRequest",
    "StudentSkillsUpdateRequest",
    "RecruiterProfileResponse",
    "CreateOpportunityRequest",
    "OpportunityResponse",
    "CandidateListItem",
    "AdminOverviewStats",
    "AdminStudentItem",
    "AdminRecruiterItem",
    "AdminCompanyItem",
    "AdminInstitutionItem",
    "VerificationDecisionRequest",
    "AccountStatusDecisionRequest",
    "AddInstitutionRequest",
    "AuditLogItem"
]


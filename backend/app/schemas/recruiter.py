from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.user import VerificationStatus
from app.schemas.common import BadgeInfo

class RecruiterProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    email_verified: bool
    phone_number: Optional[str] = None
    designation: str
    
    company_id: int
    company_name: str
    company_website: str
    company_domain: str
    company_verification_status: VerificationStatus
    
    recruiter_verification_status: VerificationStatus
    authorization_doc_url: Optional[str] = None
    
    badges: List[BadgeInfo] = []
    can_publish_jobs: bool = False
    can_view_candidates: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CreateOpportunityRequest(BaseModel):
    title: str
    role_type: str = "INTERNSHIP" # INTERNSHIP, FULL_TIME, SKILL_PROGRAM
    location: str
    is_remote: bool = True
    stipend_or_salary: Optional[str] = "₹25,000 / month"
    description: str
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    hardware_provided: bool = True
    relocation_assistance: bool = False

class OpportunityResponse(BaseModel):
    id: int
    title: str
    role_type: str
    location: str
    is_remote: bool
    stipend_or_salary: Optional[str]
    description: str
    required_skills: List[str]
    preferred_skills: List[str]
    hardware_provided: bool
    relocation_assistance: bool
    company_id: int
    company_name: str
    is_active: bool
    created_at: datetime
    match_score: Optional[float] = 95.0
    ats_match: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)

class CandidateListItem(BaseModel):
    id: int
    full_name: str # Anonymized if blind hiring mode
    degree: Optional[str] = None
    branch: Optional[str] = None
    institution_name: Optional[str] = None # Masked if blind mode
    skills: List[str] = []
    institution_verified: bool = False
    is_first_generation: bool = False
    is_rural_or_disadvantaged: bool = False
    match_score: Optional[int] = 85
    rank: Optional[int] = 1
    composite_score: Optional[float] = 85.0
    layer_breakdown: Optional[dict] = None
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    bias_flag: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

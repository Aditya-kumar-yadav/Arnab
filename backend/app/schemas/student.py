from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.user import VerificationStatus
from app.schemas.common import BadgeInfo

class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    email_verified: bool
    institution_id: Optional[int] = None
    institution_name: Optional[str] = None
    institution_verified: bool = False
    is_institutional_email: bool = False
    
    degree: Optional[str] = None
    branch: Optional[str] = None
    academic_year: Optional[str] = None
    graduation_year: Optional[int] = None
    college_location: Optional[str] = None
    preferred_domain: Optional[str] = None
    
    verification_status: VerificationStatus
    id_card_url: Optional[str] = None
    resume_url: Optional[str] = None
    skills: List[str] = []
    
    is_first_generation: bool = False
    is_rural_or_disadvantaged: bool = False
    
    badges: List[BadgeInfo] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class StudentDocumentUploadRequest(BaseModel):
    document_type: str = "COLLEGE_ID"
    document_url: str
    notes: Optional[str] = None

class StudentSkillsUpdateRequest(BaseModel):
    skills: List[str]
    preferred_domain: Optional[str] = None

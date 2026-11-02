from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.models.user import UserRole

class DomainCheckRequest(BaseModel):
    email: EmailStr

class DomainCheckResponse(BaseModel):
    email: str
    domain: str
    is_public_provider: bool
    is_institutional: bool
    institution_name: Optional[str] = None
    reason: str

class StudentRegisterRequest(BaseModel):
    # Step 1: Personal
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str

    # Step 2: Educational
    college_name: str = Field(..., min_length=2)
    degree: str = Field(..., min_length=2)
    branch: str = Field(..., min_length=2)
    academic_year: str
    graduation_year: int
    college_location: str
    preferred_domain: Optional[str] = "Software Engineering"
    
    # Affirmative / Social equity flags
    is_first_generation: bool = False
    is_rural_or_disadvantaged: bool = False
    skills: List[str] = []

    # Optional Clerk integration
    clerk_user_id: Optional[str] = None

    @field_validator("confirm_password")
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

class RecruiterRegisterRequest(BaseModel):
    # Step 1: Personal
    full_name: str = Field(..., min_length=2, max_length=100)
    work_email: EmailStr
    phone_number: Optional[str] = None
    designation: str = Field(..., min_length=2)
    password: str = Field(..., min_length=6)

    # Step 2: Company
    company_name: str = Field(..., min_length=2)
    official_website: str = Field(..., min_length=4)
    industry: Optional[str] = "Technology"
    location: Optional[str] = "Bengaluru, India"
    description: Optional[str] = None
    linkedin_url: Optional[str] = None

    # Optional Clerk integration
    clerk_user_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ClerkSyncRequest(BaseModel):
    clerk_user_id: str
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    avatar_url: Optional[str] = None
    student_details: Optional[dict] = None
    recruiter_details: Optional[dict] = None

class EmailVerificationRequest(BaseModel):
    email: EmailStr
    code: Optional[str] = "123456" # Mock/simulated verification code for testability


from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.user import UserRole, AccountStatus, VerificationStatus

class BadgeInfo(BaseModel):
    name: str
    verified: bool
    description: str
    color: str

class UserResponse(BaseModel):
    id: int
    clerk_user_id: Optional[str] = None
    full_name: str
    email: str
    role: UserRole
    email_verified: bool
    account_status: AccountStatus
    created_at: datetime
    badges: List[BadgeInfo] = []

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    account_status: AccountStatus
    user: UserResponse

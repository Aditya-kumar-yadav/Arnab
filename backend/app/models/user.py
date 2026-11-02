import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    RECRUITER = "RECRUITER"
    ADMIN = "ADMIN"

class AccountStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    PENDING = "PENDING"
    SUSPENDED = "SUSPENDED"
    REJECTED = "REJECTED"

class VerificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    UNDER_REVIEW = "UNDER_REVIEW"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String(128), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    email_verified = Column(Boolean, default=False, nullable=False)
    account_status = Column(Enum(AccountStatus), default=AccountStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    verification_requests = relationship("VerificationRequest", foreign_keys="VerificationRequest.user_id", back_populates="user")
    audit_logs_authored = relationship("AuditLog", foreign_keys="AuditLog.admin_id", back_populates="admin")


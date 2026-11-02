from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import VerificationStatus

class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    
    designation = Column(String(100), nullable=False)
    phone_number = Column(String(50), nullable=True)
    recruiter_verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False)
    authorization_doc_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="recruiter_profile")
    company = relationship("Company", back_populates="recruiters")
    opportunities = relationship("Opportunity", back_populates="creator")

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    creator_id = Column(Integer, ForeignKey("recruiter_profiles.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    role_type = Column(String(50), default="INTERNSHIP", nullable=False) # INTERNSHIP, FULL_TIME, SKILL_PROGRAM
    location = Column(String(255), nullable=False)
    is_remote = Column(Boolean, default=True, nullable=False)
    stipend_or_salary = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=False, default="[]") # JSON list of required skills
    preferred_skills = Column(Text, nullable=True, default="[]")
    hardware_provided = Column(Boolean, default=False, nullable=False)
    relocation_assistance = Column(Boolean, default=False, nullable=False)
    
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="opportunities")
    creator = relationship("RecruiterProfile", back_populates="opportunities")

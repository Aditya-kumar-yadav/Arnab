from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import VerificationStatus

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    institution_id = Column(Integer, ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    
    degree = Column(String(100), nullable=True)
    branch = Column(String(100), nullable=True)
    academic_year = Column(String(50), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    college_location = Column(String(255), nullable=True)
    preferred_domain = Column(String(100), nullable=True)
    
    # Verification
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False)
    id_card_url = Column(String(500), nullable=True)
    resume_url = Column(String(500), nullable=True)
    
    # Skills and background context
    skills = Column(Text, nullable=True, default="[]") # JSON list of skills
    is_first_generation = Column(Boolean, default=False, nullable=False)
    is_rural_or_disadvantaged = Column(Boolean, default=False, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    institution = relationship("Institution", back_populates="students")


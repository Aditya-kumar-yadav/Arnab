from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import VerificationStatus

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    institution_name = Column(String(255), unique=True, nullable=False, index=True)
    official_website = Column(String(255), nullable=False)
    institution_type = Column(String(100), default="UNIVERSITY", nullable=False)
    country = Column(String(100), default="India", nullable=False)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.VERIFIED, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    domains = relationship("InstitutionDomain", back_populates="institution", cascade="all, delete-orphan")
    students = relationship("StudentProfile", back_populates="institution")

class InstitutionDomain(Base):
    __tablename__ = "institution_domains"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    domain = Column(String(255), unique=True, index=True, nullable=False)
    verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    institution = relationship("Institution", back_populates="domains")


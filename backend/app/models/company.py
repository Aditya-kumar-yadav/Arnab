from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import VerificationStatus

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False, index=True)
    official_website = Column(String(255), nullable=False)
    company_domain = Column(String(255), index=True, nullable=False)
    industry = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    recruiters = relationship("RecruiterProfile", back_populates="company")
    opportunities = relationship("Opportunity", back_populates="company", cascade="all, delete-orphan")


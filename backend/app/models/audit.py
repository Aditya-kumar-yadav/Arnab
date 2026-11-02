import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import VerificationStatus

class VerificationRequestType(str, enum.Enum):
    STUDENT_ID = "STUDENT_ID"
    RECRUITER_AUTHORIZATION = "RECRUITER_AUTHORIZATION"
    COMPANY_DOCUMENT = "COMPANY_DOCUMENT"
    INSTITUTION_AFFILIATION = "INSTITUTION_AFFILIATION"

class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    verification_type = Column(String(50), nullable=False)
    submitted_documents = Column(Text, nullable=False) # JSON metadata or URLs
    status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False)
    reviewed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    review_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="verification_requests")
    reviewer = relationship("User", foreign_keys=[reviewed_by])

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    target_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    details = Column(Text, nullable=False) # JSON or string description
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    admin = relationship("User", foreign_keys=[admin_id], back_populates="audit_logs_authored")
    target_user = relationship("User", foreign_keys=[target_user_id])

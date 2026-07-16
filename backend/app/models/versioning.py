import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    storage_path = Column(String, nullable=True) # Making nullable to support both raw and parsed versions
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    content_snapshot = Column(JSONB, nullable=True) # Store parsed document state
    commit_message = Column(String, nullable=True)
    labels = Column(JSONB, nullable=True) # e.g. ["v1.0", "Release Candidate"]
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class VersionComparison(Base):
    __tablename__ = "version_comparisons"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    base_version_id = Column(UUID(as_uuid=True), ForeignKey("document_versions.id", ondelete="CASCADE"), nullable=False)
    target_version_id = Column(UUID(as_uuid=True), ForeignKey("document_versions.id", ondelete="CASCADE"), nullable=False)
    diff_data = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

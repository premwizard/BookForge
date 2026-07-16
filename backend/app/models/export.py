import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class Export(Base):
    __tablename__ = "exports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    format = Column(String, nullable=False) # DOCX, PDF, EPUB, HTML, Markdown
    storage_path = Column(String, nullable=True)
    checksum = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True) # in bytes
    metadata_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ExportJob(Base):
    __tablename__ = "export_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    export_id = Column(UUID(as_uuid=True), ForeignKey("exports.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String, default="Queued") # Queued, Preparing, Rendering, Optimizing, Completed, Failed
    celery_task_id = Column(String, nullable=True, index=True)
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

class ExportVersion(Base):
    __tablename__ = "export_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    export_id = Column(UUID(as_uuid=True), ForeignKey("exports.id", ondelete="SET NULL"), nullable=True)
    version_number = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DownloadHistory(Base):
    __tablename__ = "download_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    export_id = Column(UUID(as_uuid=True), ForeignKey("exports.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    ip_address = Column(String, nullable=True)
    downloaded_at = Column(DateTime(timezone=True), server_default=func.now())

import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class Export(Base):
    __tablename__ = "exports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    format = Column(String, nullable=False) # PDF_X1A, PDF_A1B, EPUB_33, MOBI_KDP, JATS_XML, ICML, HTML5_WEB, DOCX
    profile = Column(String, default="Standard") # Press, Archival, Digital, Academic
    storage_path = Column(String, nullable=True)
    checksum = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True) # in bytes
    isbn = Column(String, nullable=True)
    doi = Column(String, nullable=True)
    cmyk_profile = Column(String, nullable=True) # Fogra39, SWOP2006, Gracol2006
    dpi = Column(Integer, default=300)
    font_subsetted = Column(Boolean, default=True)
    preflight_status = Column(String, default="PENDING") # PENDING, PASSED, WARNINGS, FAILED
    preflight_report = Column(JSONB, default=dict)
    metadata_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ExportJob(Base):
    __tablename__ = "export_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    export_id = Column(UUID(as_uuid=True), ForeignKey("exports.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String, default="Queued") # Queued, Preparing, Preflight, Rendering, Packaging, Completed, Failed
    celery_task_id = Column(String, nullable=True, index=True)
    worker_id = Column(String, nullable=True)
    progress_percent = Column(Integer, default=0)
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

class ExportVersion(Base):
    __tablename__ = "export_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    export_id = Column(UUID(as_uuid=True), ForeignKey("exports.id", ondelete="SET NULL"), nullable=True)
    version_tag = Column(String, default="v1.0.0") # v1.0.0, RC1, Final Press
    version_number = Column(Integer, nullable=False)
    release_notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ExportBundle(Base):
    __tablename__ = "export_bundles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    bundle_name = Column(String, nullable=False)
    included_formats = Column(JSONB, default=list) # ["PDF_X1A", "EPUB_33", "JATS_XML"]
    zip_storage_path = Column(String, nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    onix_manifest = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DownloadHistory(Base):
    __tablename__ = "download_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    export_id = Column(UUID(as_uuid=True), ForeignKey("exports.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    ip_address = Column(String, nullable=True)
    downloaded_at = Column(DateTime(timezone=True), server_default=func.now())


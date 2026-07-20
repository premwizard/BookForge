import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

class RenderingJob(Base):
    __tablename__ = "rendering_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    layout_document_id = Column(UUID(as_uuid=True), ForeignKey("layout_documents.id"), nullable=False)
    
    status = Column(String, default="Queued") # Queued, Building, Packaging, Validating, Completed, Failed
    celery_task_id = Column(String, nullable=True)
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    layout_document = relationship("LayoutDocument")
    rendered_document = relationship("RenderedDocument", back_populates="job", uselist=False, cascade="all, delete-orphan")
    history = relationship("RenderingHistory", back_populates="job", cascade="all, delete-orphan")
    logs = relationship("RenderingLog", back_populates="job", cascade="all, delete-orphan")

class RenderedDocument(Base):
    __tablename__ = "rendered_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("rendering_jobs.id"), nullable=False)
    
    file_path = Column(String, nullable=True) # S3 URI or local path
    file_size_bytes = Column(Integer, default=0)
    
    is_valid = Column(Boolean, default=True)
    validation_report = Column(JSON, nullable=True)
    
    job = relationship("RenderingJob", back_populates="rendered_document")
    versions = relationship("PackageVersion", back_populates="document", cascade="all, delete-orphan")

class PackageVersion(Base):
    __tablename__ = "package_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("rendered_documents.id"), nullable=False)
    
    version_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    document = relationship("RenderedDocument", back_populates="versions")

class RenderingHistory(Base):
    __tablename__ = "rendering_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("rendering_jobs.id"), nullable=False)
    
    action = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    job = relationship("RenderingJob", back_populates="history")

class RenderingLog(Base):
    __tablename__ = "rendering_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("rendering_jobs.id"), nullable=False)
    
    stage = Column(String, nullable=False) # e.g., 'XML Generation', 'Packaging', 'Validation'
    duration_ms = Column(Integer, nullable=True)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    job = relationship("RenderingJob", back_populates="logs")

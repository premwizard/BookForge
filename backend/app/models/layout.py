import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON, Float, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

class LayoutJob(Base):
    __tablename__ = "layout_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)
    transformation_job_id = Column(UUID(as_uuid=True), ForeignKey("transformation_jobs.id"), nullable=False)
    
    status = Column(String, default="Queued") # Queued, Planning, Layout, Pagination, Optimization, Completed, Failed
    celery_task_id = Column(String, nullable=True)
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    document = relationship("Document")
    transformation_job = relationship("TransformationJob")
    layout_document = relationship("LayoutDocument", back_populates="job", uselist=False, cascade="all, delete-orphan")
    history = relationship("LayoutHistory", back_populates="job", cascade="all, delete-orphan")
    pagination_history = relationship("PaginationHistory", back_populates="job", cascade="all, delete-orphan")

class LayoutDocument(Base):
    __tablename__ = "layout_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("layout_jobs.id"), nullable=False)
    
    total_pages = Column(Integer, default=0)
    overflow_count = Column(Integer, default=0)
    is_valid = Column(Boolean, default=True)
    
    job = relationship("LayoutJob", back_populates="layout_document")
    pages = relationship("LayoutPage", back_populates="document", cascade="all, delete-orphan")
    sections = relationship("LayoutSection", back_populates="document", cascade="all, delete-orphan")

class LayoutSection(Base):
    __tablename__ = "layout_sections"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("layout_documents.id"), nullable=False)
    
    name = Column(String, nullable=True)
    start_page_number = Column(Integer, nullable=False)
    
    page_width = Column(Float, nullable=False)
    page_height = Column(Float, nullable=False)
    orientation = Column(String, default="portrait") # portrait, landscape
    
    margin_top = Column(Float, nullable=False)
    margin_right = Column(Float, nullable=False)
    margin_bottom = Column(Float, nullable=False)
    margin_left = Column(Float, nullable=False)
    
    columns = Column(Integer, default=1)
    
    document = relationship("LayoutDocument", back_populates="sections")
    pages = relationship("LayoutPage", back_populates="section")

class LayoutPage(Base):
    __tablename__ = "layout_pages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("layout_documents.id"), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey("layout_sections.id"), nullable=False)
    
    page_number = Column(Integer, nullable=False)
    page_type = Column(String, default="normal") # normal, blank, cover, title, toc, chapter_start
    
    has_overflow = Column(Boolean, default=False)
    metadata_obj = Column(JSON, default=dict)
    
    document = relationship("LayoutDocument", back_populates="pages")
    section = relationship("LayoutSection", back_populates="pages")
    frames = relationship("LayoutFrame", back_populates="page", cascade="all, delete-orphan")

class LayoutFrame(Base):
    __tablename__ = "layout_frames"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    page_id = Column(UUID(as_uuid=True), ForeignKey("layout_pages.id"), nullable=False)
    
    frame_type = Column(String, nullable=False) # main, header, footer, float, margin_note
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    
    content = Column(JSON, nullable=True) # Serialized LDM nodes
    
    page = relationship("LayoutPage", back_populates="frames")

class LayoutHistory(Base):
    __tablename__ = "layout_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("layout_jobs.id"), nullable=False)
    
    action = Column(String, nullable=False)
    target_id = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    job = relationship("LayoutJob", back_populates="history")

class PaginationHistory(Base):
    __tablename__ = "pagination_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("layout_jobs.id"), nullable=False)
    
    page_number = Column(Integer, nullable=False)
    reason = Column(String, nullable=False) # e.g., 'Widow/Orphan', 'Keep With Next', 'Page Break'
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    job = relationship("LayoutJob", back_populates="pagination_history")

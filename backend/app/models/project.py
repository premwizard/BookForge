import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database.base import Base

from sqlalchemy.dialects.postgresql import UUID, JSONB

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    publisher_id = Column(UUID(as_uuid=True), ForeignKey("publishers.id", ondelete="SET NULL"), nullable=True)
    default_template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, default="General") # Academic, Fiction, Journal, Legal, Corporate
    isbn = Column(String, nullable=True)
    doi = Column(String, nullable=True)
    status = Column(String, default="Active") # Active, Formatting, In Review, Released, Archived
    favorite = Column(Boolean, default=False)
    total_documents = Column(Integer, default=0)
    total_pages = Column(Integer, default=0)
    completion_percentage = Column(Integer, default=0)
    processing_status = Column(String, default="Idle")
    tags = Column(JSONB, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    archived_at = Column(DateTime(timezone=True), nullable=True)

class ProjectMember(Base):
    __tablename__ = "project_members"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, default="EDITOR") # OWNER, MANAGING_EDITOR, LAYOUT_ARCHITECT, REVIEWER, VIEWER
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProjectMilestone(Base):
    __tablename__ = "project_milestones"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    milestone_tag = Column(String, nullable=False) # v1.0-draft, v1.5-editorial, v2.0-final-press
    release_notes = Column(String, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base

class Provider(Base):
    __tablename__ = "providers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, unique=True, index=True, nullable=False) # e.g. "openai", "gemini", "claude"
    is_active = Column(Boolean, default=True)
    config = Column(JSONB, nullable=True) # default configs for the provider
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
class PromptVersion(Base):
    __tablename__ = "prompt_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, index=True, nullable=False) # e.g. "structure_extraction"
    version = Column(Integer, nullable=False, default=1)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="CASCADE"), nullable=False)
    template = Column(String, nullable=False) # The actual prompt template
    system_message = Column(String, nullable=True)
    parameters = Column(JSONB, nullable=True) # e.g. temperature, max_tokens
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
class AIJob(Base):
    __tablename__ = "ai_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="SET NULL"), nullable=True)
    task_type = Column(String, nullable=False) # e.g. "analyze_structure", "quality_analysis"
    status = Column(String, default="Queued") # Queued, Running, Retrying, Completed, Failed
    celery_task_id = Column(String, nullable=True, index=True)
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
class AIResult(Base):
    __tablename__ = "ai_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("ai_jobs.id", ondelete="CASCADE"), nullable=False)
    prompt_version_id = Column(UUID(as_uuid=True), ForeignKey("prompt_versions.id", ondelete="SET NULL"), nullable=True)
    raw_response = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AIToken(Base):
    __tablename__ = "ai_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("ai_jobs.id", ondelete="CASCADE"), nullable=False)
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    estimated_cost = Column(Integer, default=0) # stored in cents or micro-cents to avoid float issues
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AIUsage(Base):
    """Aggregate usage per document/user"""
    __tablename__ = "ai_usage"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    total_prompt_tokens = Column(Integer, default=0)
    total_completion_tokens = Column(Integer, default=0)
    total_cost = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DocumentInsight(Base):
    __tablename__ = "document_insights"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True)
    structure_tree = Column(JSONB, nullable=True)
    content_classification = Column(JSONB, nullable=True)
    image_analysis = Column(JSONB, nullable=True)
    table_analysis = Column(JSONB, nullable=True)
    reference_analysis = Column(JSONB, nullable=True)
    style_suggestions = Column(JSONB, nullable=True)
    quality_scores = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

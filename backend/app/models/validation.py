import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class ValidationRule(Base):
    __tablename__ = "validation_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    code = Column(String, unique=True, index=True, nullable=False) # e.g. "struct_missing_chapter"
    category = Column(String, nullable=False) # Structure, Typography, Images, Tables, etc.
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    severity = Column(String, default="Medium") # Critical, High, Medium, Low, Info
    is_active = Column(Boolean, default=True)
    configurable_params = Column(JSONB, nullable=True) # Custom params for the rule
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ValidationRun(Base):
    __tablename__ = "validation_runs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String, default="Queued") # Queued, Running, Completed, Failed
    celery_task_id = Column(String, nullable=True, index=True)
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

class ValidationResult(Base):
    """Individual issue found during validation"""
    __tablename__ = "validation_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    run_id = Column(UUID(as_uuid=True), ForeignKey("validation_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    rule_id = Column(UUID(as_uuid=True), ForeignKey("validation_rules.id", ondelete="CASCADE"), nullable=False)
    
    # Context of where the issue occurred
    element_id = Column(String, nullable=True) # ID of the node in the parsed document
    location = Column(String, nullable=True) # Human readable location (e.g. "Chapter 1, Paragraph 3")
    
    # Issue details
    problem = Column(String, nullable=False)
    cause = Column(String, nullable=True)
    recommendation = Column(String, nullable=True)
    auto_fix_possible = Column(Boolean, default=False)
    severity = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class QualityScore(Base):
    __tablename__ = "quality_scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    run_id = Column(UUID(as_uuid=True), ForeignKey("validation_runs.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    formatting_score = Column(Integer, default=100)
    layout_score = Column(Integer, default=100)
    typography_score = Column(Integer, default=100)
    structure_score = Column(Integer, default=100)
    accessibility_score = Column(Integer, default=100)
    publishing_readiness_score = Column(Integer, default=100)
    overall_quality_score = Column(Integer, default=100)
    
    # JSON arrays containing detailed breakdowns (reason, confidence, suggestions)
    score_details = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ValidationHistory(Base):
    """Tracks aggregates for historical trending"""
    __tablename__ = "validation_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    run_id = Column(UUID(as_uuid=True), ForeignKey("validation_runs.id", ondelete="CASCADE"), nullable=False)
    
    total_issues = Column(Integer, default=0)
    critical_issues = Column(Integer, default=0)
    high_issues = Column(Integer, default=0)
    medium_issues = Column(Integer, default=0)
    low_issues = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List

from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON, Enum, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

class TransformationJob(Base):
    __tablename__ = "transformation_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("transformation_profiles.id"), nullable=True)
    status = Column(String, default="Queued") # Queued, Running, Completed, Failed, Retry
    celery_task_id = Column(String, nullable=True)
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    document = relationship("Document")
    profile = relationship("TransformationProfile")
    history = relationship("TransformationHistory", back_populates="job", cascade="all, delete-orphan")
    nodes = relationship("TransformationNode", back_populates="job", cascade="all, delete-orphan")
    logs = relationship("TransformationLog", back_populates="job", cascade="all, delete-orphan")

class TransformationProfile(Base):
    __tablename__ = "transformation_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    blueprint_id = Column(UUID(as_uuid=True), ForeignKey("blueprints.id"), nullable=True)
    style_mapping_id = Column(UUID(as_uuid=True), ForeignKey("mapping_profiles.id"), nullable=True)
    
    publisher_rules = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TransformationNode(Base):
    __tablename__ = "transformation_nodes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("transformation_jobs.id"), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("transformation_nodes.id"), nullable=True)
    
    node_type = Column(String, nullable=False) # Paragraph, Heading, Image, etc.
    content = Column(JSON, nullable=True) # Text, properties, etc.
    
    computed_style = Column(JSON, default=dict)
    resolved_style = Column(JSON, default=dict)
    metadata_obj = Column(JSON, default=dict) # To avoid 'metadata' reserved word
    
    validation_state = Column(String, nullable=True) # Valid, Invalid, Warning
    
    job = relationship("TransformationJob", back_populates="nodes")
    children = relationship("TransformationNode", backref="parent", remote_side=[id])

class TransformationHistory(Base):
    __tablename__ = "transformation_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("transformation_jobs.id"), nullable=False)
    node_id = Column(UUID(as_uuid=True), ForeignKey("transformation_nodes.id"), nullable=True)
    
    rule_applied = Column(String, nullable=False)
    reason = Column(String, nullable=True)
    
    before_state = Column(JSON, nullable=True)
    after_state = Column(JSON, nullable=True)
    
    user_override = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    job = relationship("TransformationJob", back_populates="history")
    node = relationship("TransformationNode")

class TransformationLog(Base):
    __tablename__ = "transformation_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("transformation_jobs.id"), nullable=False)
    
    stage = Column(String, nullable=False) # e.g., 'Document Cleanup', 'Style Resolution'
    execution_time_ms = Column(Integer, nullable=True)
    rule_count = Column(Integer, nullable=True)
    node_count = Column(Integer, nullable=True)
    memory_usage_mb = Column(Integer, nullable=True)
    
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(JSON, nullable=True)
    
    job = relationship("TransformationJob", back_populates="logs")

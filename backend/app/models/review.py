import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database.base import Base

class ReviewSession(Base):
    __tablename__ = "review_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transformation_job_id = Column(UUID(as_uuid=True), ForeignKey("transformation_jobs.id"), nullable=False)
    
    status = Column(String, default="Draft") # Draft, Reviewed, Approved, Rejected, Needs Changes, Ready For Rendering
    
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    transformation_job = relationship("TransformationJob")
    corrections = relationship("Correction", back_populates="session", cascade="all, delete-orphan")
    snapshots = relationship("ReviewSnapshot", back_populates="session", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="session", cascade="all, delete-orphan")
    logs = relationship("ReviewLog", back_populates="session", cascade="all, delete-orphan")

class Correction(Base):
    __tablename__ = "corrections"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("review_sessions.id"), nullable=False)
    
    command_type = Column(String, nullable=False) # e.g., 'CHANGE_STYLE', 'SPLIT_PARAGRAPH'
    target_node_id = Column(String, nullable=False)
    
    payload = Column(JSON, nullable=False) # The specific parameters of the command
    
    sequence_number = Column(Integer, nullable=False)
    is_undone = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ReviewSession", back_populates="corrections")

class ReviewSnapshot(Base):
    __tablename__ = "review_snapshots"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("review_sessions.id"), nullable=False)
    
    sequence_number = Column(Integer, nullable=False) # Up to which correction this snapshot includes
    ifdm_state = Column(JSON, nullable=False) # Serialized full IFDM
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ReviewSession", back_populates="snapshots")

class ReviewApproval(Base):
    __tablename__ = "review_approvals" 
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("review_sessions.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # If user system is active
    
    status = Column(String, nullable=False) # Approved, Rejected
    comments = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ReviewSession", back_populates="approvals")

class ReviewLog(Base):
    __tablename__ = "review_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("review_sessions.id"), nullable=False)
    
    action = Column(String, nullable=False) # Opened, Saved, Undid, Validated
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ReviewSession", back_populates="logs")

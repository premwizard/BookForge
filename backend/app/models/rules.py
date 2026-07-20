from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .user import User
from app.database.base import Base

class RuleState(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class RuleCategory(str, enum.Enum):
    FORMATTING = "FORMATTING"
    LAYOUT = "LAYOUT"
    TYPOGRAPHY = "TYPOGRAPHY"
    IMAGE = "IMAGE"
    TABLE = "TABLE"
    CAPTION = "CAPTION"
    REFERENCE = "REFERENCE"
    TOC = "TOC"
    HEADER_FOOTER = "HEADER_FOOTER"
    SECTION = "SECTION"
    VALIDATION = "VALIDATION"
    RENDERING = "RENDERING"
    CUSTOM = "CUSTOM"

class RuleSet(Base):
    __tablename__ = 'rule_sets'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    publisher_id = Column(Integer, ForeignKey('publisher.id'), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    rules = relationship("Rule", back_populates="rule_set", cascade="all, delete-orphan")

class Rule(Base):
    __tablename__ = 'rules'
    
    id = Column(Integer, primary_key=True, index=True)
    rule_set_id = Column(Integer, ForeignKey('rule_sets.id'), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(Enum(RuleCategory), nullable=False)
    priority = Column(Integer, default=0)
    version = Column(Integer, default=1)
    state = Column(Enum(RuleState), default=RuleState.DRAFT)
    
    conditions = Column(JSON, nullable=False)
    actions = Column(JSON, nullable=False)
    
    is_enabled = Column(Boolean, default=True)
    
    created_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    updated_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    effective_date = Column(DateTime(timezone=True), nullable=True)
    
    tags = Column(JSON, nullable=True)
    
    rule_set = relationship("RuleSet", back_populates="rules")
    created_by = relationship("User", foreign_keys=[created_by_id])
    updated_by = relationship("User", foreign_keys=[updated_by_id])
    versions = relationship("RuleVersion", back_populates="rule", cascade="all, delete-orphan")

class RuleVersion(Base):
    __tablename__ = 'rule_versions'
    
    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey('rules.id'), nullable=False)
    version = Column(Integer, nullable=False)
    state = Column(Enum(RuleState), nullable=False)
    
    conditions = Column(JSON, nullable=False)
    actions = Column(JSON, nullable=False)
    
    created_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    rule = relationship("Rule", back_populates="versions")

class RulePackage(Base):
    __tablename__ = 'rule_packages'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String(50), nullable=False)
    package_data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RuleExecution(Base):
    __tablename__ = 'rule_executions'
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, nullable=True)
    job_id = Column(Integer, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), nullable=False)
    total_rules_evaluated = Column(Integer, default=0)
    total_rules_applied = Column(Integer, default=0)
    execution_time_ms = Column(Integer, default=0)
    
    logs = relationship("RuleLog", back_populates="execution", cascade="all, delete-orphan")

class RuleLog(Base):
    __tablename__ = 'rule_logs'
    
    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(Integer, ForeignKey('rule_executions.id'), nullable=False)
    rule_id = Column(Integer, ForeignKey('rules.id'), nullable=True)
    node_id = Column(String(255), nullable=True)
    action_taken = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    level = Column(String(50), default="INFO")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    execution = relationship("RuleExecution", back_populates="logs")
    rule = relationship("Rule")

class RuleVariable(Base):
    __tablename__ = 'rule_variables'
    
    id = Column(Integer, primary_key=True, index=True)
    rule_set_id = Column(Integer, ForeignKey('rule_sets.id'), nullable=False)
    name = Column(String(255), nullable=False)
    value_type = Column(String(50), nullable=False)
    default_value = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)

class RuleTemplate(Base):
    __tablename__ = 'rule_templates'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(Enum(RuleCategory), nullable=False)
    description = Column(Text, nullable=True)
    template_conditions = Column(JSON, nullable=False)
    template_actions = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

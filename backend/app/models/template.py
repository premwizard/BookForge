from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID
from datetime import datetime
import uuid

from app.database.base import Base

class Publisher(Base):
    __tablename__ = "publishers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True, index=True)
    contact_email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    templates = relationship("Template", back_populates="publisher", cascade="all, delete-orphan")

class Template(Base):
    __tablename__ = "templates"
    __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    publisher_id = Column(UUID(as_uuid=True), ForeignKey("publishers.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    publisher = relationship("Publisher", back_populates="templates")
    versions = relationship("TemplateVersion", back_populates="template", cascade="all, delete-orphan", order_by="TemplateVersion.version_number.desc()")
    audit_logs = relationship("TemplateAuditLog", back_populates="template", cascade="all, delete-orphan")

class TemplateVersion(Base):
    __tablename__ = "template_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    storage_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # e.g., 'DOCX'
    created_at = Column(DateTime, default=datetime.utcnow)
    
    template = relationship("Template", back_populates="versions")
    styles = relationship("TemplateStyle", back_populates="template_version", cascade="all, delete-orphan")
    formatting_rules = relationship("FormattingRule", back_populates="template_version", cascade="all, delete-orphan")
    style_mappings = relationship("StyleMapping", back_populates="template_version", cascade="all, delete-orphan")

class TemplateStyle(Base):
    __tablename__ = "template_styles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_version_id = Column(UUID(as_uuid=True), ForeignKey("template_versions.id", ondelete="CASCADE"), nullable=False)
    style_name = Column(String, nullable=False, index=True)
    style_type = Column(String, nullable=False) # e.g., 'paragraph', 'character', 'table'
    properties_json = Column(JSONB, nullable=False, default={}) # Extracted fonts, margins, etc.
    
    template_version = relationship("TemplateVersion", back_populates="styles")

class FormattingRule(Base):
    __tablename__ = "formatting_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_version_id = Column(UUID(as_uuid=True), ForeignKey("template_versions.id", ondelete="CASCADE"), nullable=False)
    rule_type = Column(String, nullable=False) # e.g., 'GlobalMargin', 'PageNumbering', 'Header'
    rule_data = Column(JSONB, nullable=False, default={})
    
    template_version = relationship("TemplateVersion", back_populates="formatting_rules")

class StyleMapping(Base):
    __tablename__ = "style_mappings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_version_id = Column(UUID(as_uuid=True), ForeignKey("template_versions.id", ondelete="CASCADE"), nullable=False)
    raw_element_type = Column(String, nullable=False) # e.g., 'Heading 1', 'Caption'
    template_style_id = Column(UUID(as_uuid=True), ForeignKey("template_styles.id", ondelete="CASCADE"), nullable=False)
    is_override = Column(Boolean, default=False)
    
    template_version = relationship("TemplateVersion", back_populates="style_mappings")
    template_style = relationship("TemplateStyle")

class TemplateAuditLog(Base):
    __tablename__ = "template_audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, nullable=False) # e.g., 'Clone', 'Archive', 'Delete', 'Upload'
    details_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    template = relationship("Template", back_populates="audit_logs")

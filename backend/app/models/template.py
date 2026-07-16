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
    blueprints = relationship("Blueprint", back_populates="publisher", cascade="all, delete-orphan")
    mapping_profiles = relationship("MappingProfile", back_populates="publisher", cascade="all, delete-orphan")

class Template(Base):
    """Raw uploaded template file metadata."""
    __tablename__ = "templates"
    __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    publisher_id = Column(UUID(as_uuid=True), ForeignKey("publishers.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    storage_path = Column(String, nullable=True) # Where the DOCX template is stored
    category = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    publisher = relationship("Publisher", back_populates="templates")
    blueprints = relationship("Blueprint", back_populates="template", cascade="all, delete-orphan")
    audit_logs = relationship("TemplateAuditLog", back_populates="template", cascade="all, delete-orphan")

class Blueprint(Base):
    """The machine-readable, extracted format specification."""
    __tablename__ = "blueprints"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="CASCADE"), nullable=False)
    publisher_id = Column(UUID(as_uuid=True), ForeignKey("publishers.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    template = relationship("Template", back_populates="blueprints")
    publisher = relationship("Publisher", back_populates="blueprints")
    versions = relationship("BlueprintVersion", back_populates="blueprint", cascade="all, delete-orphan", order_by="BlueprintVersion.version_number.desc()")

class BlueprintVersion(Base):
    """Immutable snapshot of the blueprint JSON."""
    __tablename__ = "blueprint_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    blueprint_id = Column(UUID(as_uuid=True), ForeignKey("blueprints.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    blueprint_json = Column(JSONB, nullable=False) # The definitive source of truth
    created_at = Column(DateTime, default=datetime.utcnow)
    
    blueprint = relationship("Blueprint", back_populates="versions")
    styles = relationship("BlueprintStyle", back_populates="blueprint_version", cascade="all, delete-orphan")
    layouts = relationship("BlueprintLayout", back_populates="blueprint_version", cascade="all, delete-orphan")
    rules = relationship("BlueprintRule", back_populates="blueprint_version", cascade="all, delete-orphan")
    mapping_profiles = relationship("MappingProfile", back_populates="blueprint_version")

class BlueprintStyle(Base):
    """Relational cache of the styles from the JSON blueprint."""
    __tablename__ = "blueprint_styles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    blueprint_version_id = Column(UUID(as_uuid=True), ForeignKey("blueprint_versions.id", ondelete="CASCADE"), nullable=False)
    style_name = Column(String, nullable=False, index=True)
    style_type = Column(String, nullable=False) # paragraph, character, table, list
    properties_json = Column(JSONB, nullable=False, default={})
    
    blueprint_version = relationship("BlueprintVersion", back_populates="styles")

class BlueprintLayout(Base):
    """Relational cache of page layout settings."""
    __tablename__ = "blueprint_layouts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    blueprint_version_id = Column(UUID(as_uuid=True), ForeignKey("blueprint_versions.id", ondelete="CASCADE"), nullable=False)
    section_name = Column(String, nullable=False)
    properties_json = Column(JSONB, nullable=False, default={})
    
    blueprint_version = relationship("BlueprintVersion", back_populates="layouts")

class BlueprintRule(Base):
    """Validation or formatting rules extracted."""
    __tablename__ = "blueprint_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    blueprint_version_id = Column(UUID(as_uuid=True), ForeignKey("blueprint_versions.id", ondelete="CASCADE"), nullable=False)
    rule_type = Column(String, nullable=False)
    rule_data = Column(JSONB, nullable=False, default={})
    
    blueprint_version = relationship("BlueprintVersion", back_populates="rules")

class MappingProfile(Base):
    """A saved profile linking semantic tags to Blueprint styles."""
    __tablename__ = "mapping_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    publisher_id = Column(UUID(as_uuid=True), ForeignKey("publishers.id", ondelete="CASCADE"), nullable=False)
    blueprint_version_id = Column(UUID(as_uuid=True), ForeignKey("blueprint_versions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False) # e.g. "Standard Fiction Mapping"
    book_type = Column(String, nullable=True) # e.g. "Fiction", "Textbook"
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    publisher = relationship("Publisher", back_populates="mapping_profiles")
    blueprint_version = relationship("BlueprintVersion", back_populates="mapping_profiles")
    mappings = relationship("StyleMapping", back_populates="mapping_profile", cascade="all, delete-orphan")

class StyleMapping(Base):
    """Individual style mapping between raw doc and blueprint."""
    __tablename__ = "style_mappings"
    __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mapping_profile_id = Column(UUID(as_uuid=True), ForeignKey("mapping_profiles.id", ondelete="CASCADE"), nullable=False)
    raw_element_type = Column(String, nullable=False) # e.g., 'Heading 1', 'Caption'
    blueprint_style_id = Column(UUID(as_uuid=True), ForeignKey("blueprint_styles.id", ondelete="CASCADE"), nullable=False)
    confidence = Column(Integer, nullable=True) # 0-100
    is_ai_suggested = Column(Boolean, default=False)
    ai_reason = Column(String, nullable=True)
    is_approved = Column(Boolean, default=False)
    
    mapping_profile = relationship("MappingProfile", back_populates="mappings")
    blueprint_style = relationship("BlueprintStyle")

class MappingHistory(Base):
    """Audit log for mapping changes."""
    __tablename__ = "mapping_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mapping_profile_id = Column(UUID(as_uuid=True), ForeignKey("mapping_profiles.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, nullable=False) # e.g. "APPROVED_MAPPING", "MODIFIED_MAPPING"
    details = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TemplateAuditLog(Base):
    __tablename__ = "template_audit_logs"
    __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, nullable=False) 
    details_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    template = relationship("Template", back_populates="audit_logs")

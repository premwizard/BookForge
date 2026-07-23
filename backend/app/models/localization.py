import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class DocumentTranslation(Base):
    __tablename__ = "document_translations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    source_language = Column(String, default="en") # en, de, fr, es, ja, zh, ar
    target_language = Column(String, nullable=False) # de, fr, es, ja, zh, ar
    status = Column(String, default="In Progress") # In Progress, Completed, Reflow Check Required
    quality_score = Column(Float, default=98.5) # BLEU / COMET score percentage
    text_expansion_factor = Column(Float, default=1.15) # 1.15 = +15% text length expansion
    rtl_direction = Column(Boolean, default=False) # True for Arabic, Hebrew
    translated_ast = Column(JSONB, nullable=True) # Translated IFDM AST structure
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class TranslationGlossary(Base):
    __tablename__ = "translation_glossaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    publisher_id = Column(UUID(as_uuid=True), ForeignKey("publishers.id", ondelete="CASCADE"), nullable=True, index=True)
    source_term = Column(String, nullable=False)
    target_term = Column(String, nullable=False)
    target_language = Column(String, nullable=False)
    domain_context = Column(String, default="General Science")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GlobalRightsLicense(Base):
    __tablename__ = "global_rights_licenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    territory_code = Column(String, nullable=False) # US, UK, DE, FR, JP, CN, APAC, GLOBAL
    licensed_publisher = Column(String, nullable=False)
    language_code = Column(String, nullable=False)
    isbn_variant = Column(String, nullable=True) # Territory-specific ISBN-13
    royalty_percentage = Column(Float, default=12.5) # Royalty split percentage
    status = Column(String, default="Active") # Active, Expired, Pending Approval
    starts_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

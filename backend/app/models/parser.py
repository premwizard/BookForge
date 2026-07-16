from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, JSON, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID
from datetime import datetime
import uuid

from app.database.base import Base

class ParsedDocument(Base):
    __tablename__ = "parsed_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    document = relationship("Document", backref="parsed_document")
    elements = relationship("ParsedElement", back_populates="parsed_document", cascade="all, delete-orphan", order_by="ParsedElement.position")
    metadata_entries = relationship("DocumentMetadata", back_populates="parsed_document", cascade="all, delete-orphan")
    images = relationship("DocumentImage", back_populates="parsed_document", cascade="all, delete-orphan")
    tables = relationship("DocumentTable", back_populates="parsed_document", cascade="all, delete-orphan")

class ParsedElement(Base):
    __tablename__ = "parsed_elements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parsed_document_id = Column(UUID(as_uuid=True), ForeignKey("parsed_documents.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("parsed_elements.id", ondelete="CASCADE"), nullable=True)
    
    element_type = Column(String, index=True, nullable=False) # e.g., 'Chapter', 'Heading', 'Paragraph', 'Image', 'Table'
    position = Column(Integer, nullable=False) # Order within siblings or document
    page_number = Column(Integer, nullable=True)
    
    # Text content (if applicable)
    text = Column(Text, nullable=True)
    
    # Storing styles, nested attributes, relationships, etc.
    attributes = Column(JSONB, nullable=True, default={})
    
    # Self-referential relationship for tree structure
    children = relationship("ParsedElement", backref="parent", remote_side=[id], cascade="all, delete-orphan")
    parsed_document = relationship("ParsedDocument", back_populates="elements")

class DocumentImage(Base):
    __tablename__ = "document_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parsed_document_id = Column(UUID(as_uuid=True), ForeignKey("parsed_documents.id", ondelete="CASCADE"), nullable=False)
    element_id = Column(UUID(as_uuid=True), ForeignKey("parsed_elements.id", ondelete="CASCADE"), nullable=True)
    
    storage_path = Column(String, nullable=False)
    filename = Column(String, nullable=True)
    alt_text = Column(Text, nullable=True)
    caption = Column(Text, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    
    parsed_document = relationship("ParsedDocument", back_populates="images")

class DocumentTable(Base):
    __tablename__ = "document_tables"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parsed_document_id = Column(UUID(as_uuid=True), ForeignKey("parsed_documents.id", ondelete="CASCADE"), nullable=False)
    element_id = Column(UUID(as_uuid=True), ForeignKey("parsed_elements.id", ondelete="CASCADE"), nullable=True)
    
    caption = Column(Text, nullable=True)
    # The actual table grid (rows and columns) stored as JSONB for flexibility
    table_data = Column(JSONB, nullable=False) 
    
    parsed_document = relationship("ParsedDocument", back_populates="tables")

class DocumentMetadata(Base):
    __tablename__ = "document_metadata"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parsed_document_id = Column(UUID(as_uuid=True), ForeignKey("parsed_documents.id", ondelete="CASCADE"), nullable=False)
    
    key = Column(String, nullable=False, index=True)
    value = Column(String, nullable=True)
    
    parsed_document = relationship("ParsedDocument", back_populates="metadata_entries")

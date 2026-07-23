import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class EditorSession(Base):
    __tablename__ = "editor_sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    view_mode = Column(String, default="PAGED") # PAGED, SPREAD, CONTINUOUS, BOOK, FULLSCREEN, PRINT, RESPONSIVE
    current_page = Column(Integer, default=1)
    zoom_level = Column(Float, default=1.0)
    is_active = Column(Boolean, default=True)
    last_heartbeat = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EditorHistory(Base):
    __tablename__ = "editor_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(UUID(as_uuid=True), ForeignKey("editor_sessions.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    operation_type = Column(String, nullable=False) # INSERT_TEXT, DELETE_TEXT, SPLIT_PARAGRAPH, MERGE_PARAGRAPH, MOVE_NODE, FORMAT_RANGE, STYLE_APPLY
    operation_payload = Column(JSONB, nullable=False)
    inverse_payload = Column(JSONB, nullable=False) # For undo / OT compensation
    revision_number = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CursorPosition(Base):
    __tablename__ = "cursor_positions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("editor_sessions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user_name = Column(String, nullable=False)
    color_hex = Column(String, default="#3B82F6")
    page_number = Column(Integer, default=1)
    node_id = Column(String, nullable=True)
    offset = Column(Integer, default=0)
    selection_range = Column(JSONB, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class EditorSelection(Base):
    __tablename__ = "editor_selections"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("editor_sessions.id", ondelete="CASCADE"), nullable=False)
    start_node_id = Column(String, nullable=False)
    start_offset = Column(Integer, default=0)
    end_node_id = Column(String, nullable=False)
    end_offset = Column(Integer, default=0)
    selected_text = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class EditorSnapshot(Base):
    __tablename__ = "editor_snapshots"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    revision_number = Column(Integer, nullable=False)
    snapshot_name = Column(String, nullable=False)
    ifdm_data = Column(JSONB, nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FormattingChange(Base):
    __tablename__ = "formatting_changes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    target_element_id = Column(String, nullable=False)
    change_type = Column(String, nullable=False) # CHARACTER_STYLE, PARAGRAPH_STYLE, DIRECT_OVERRIDE, PAGE_LAYOUT
    old_style = Column(JSONB, nullable=True)
    new_style = Column(JSONB, nullable=False)
    applied_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=True, index=True)
    action = Column(String, nullable=False) # e.g. "DOCUMENT_EDITED", "SECURITY_LOGIN", "EXPORT_GENERATED"
    category = Column(String, default="GENERAL") # SECURITY, DOCUMENT, EXPORT, BILLING, TEMPLATE
    severity = Column(String, default="INFO") # INFO, WARNING, CRITICAL
    old_value = Column(JSONB, nullable=True)
    new_value = Column(JSONB, nullable=True)
    ip_address = Column(String, nullable=True)
    device_info = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class ApiKey(Base):
    __tablename__ = "api_keys"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    key_prefix = Column(String, nullable=False) # e.g. "sk_live_a1b2..."
    hashed_secret = Column(String, nullable=False)
    scopes = Column(JSONB, default=list) # ["read", "write", "export"]
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String, nullable=False) # e.g. "MENTION", "APPROVAL_REQUIRED", "EXPORT_READY"
    title = Column(String, nullable=False)
    message = Column(String, nullable=True)
    link = Column(String, nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


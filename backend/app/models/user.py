import uuid
from sqlalchemy import Boolean, Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Admin")  # Roles: Admin, Publisher, Editor, Author, Reviewer
    is_verified = Column(Boolean(), default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # relationships can be added later

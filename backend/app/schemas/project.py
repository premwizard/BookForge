from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from .document import DocumentResponse

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    favorite: Optional[bool] = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    favorite: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: UUID
    user_id: UUID
    status: str
    total_documents: int
    total_pages: int
    processing_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    archived_at: Optional[datetime] = None
    
    # Optional field for eager loading
    # documents: List[DocumentResponse] = []

    class Config:
        from_attributes = True

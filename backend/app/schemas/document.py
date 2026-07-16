from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    file_type: str
    mime_type: Optional[str] = None
    file_size_bytes: Optional[int] = None
    page_count: Optional[int] = None
    checksum_sha256: Optional[str] = None

class DocumentCreate(DocumentBase):
    project_id: UUID
    storage_path: str

class DocumentUpdate(BaseModel):
    status: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: UUID
    project_id: UUID
    storage_path: str
    status: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class DocumentVersionBase(BaseModel):
    version_number: int
    storage_path: str

class DocumentVersionResponse(DocumentVersionBase):
    id: UUID
    document_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class UploadLogBase(BaseModel):
    filename: str
    status: str
    error_message: Optional[str] = None

class UploadLogResponse(UploadLogBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

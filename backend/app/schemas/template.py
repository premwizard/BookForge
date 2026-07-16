from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class PublisherBase(BaseModel):
    name: str
    contact_email: Optional[str] = None
    website: Optional[str] = None

class PublisherCreate(PublisherBase):
    pass

class Publisher(PublisherBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = True
    is_default: Optional[bool] = False

class TemplateCreate(TemplateBase):
    publisher_id: Optional[UUID] = None

class TemplateUpdate(TemplateBase):
    name: Optional[str] = None

class Template(TemplateBase):
    id: UUID
    publisher_id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class BlueprintBase(BaseModel):
    name: str

class BlueprintCreate(BlueprintBase):
    template_id: UUID
    publisher_id: Optional[UUID] = None

class Blueprint(BlueprintBase):
    id: UUID
    template_id: UUID
    publisher_id: Optional[UUID] = None
    created_at: datetime
    class Config:
        orm_mode = True

class BlueprintVersionBase(BaseModel):
    version_number: int
    blueprint_json: Dict[str, Any]

class BlueprintVersionCreate(BlueprintVersionBase):
    blueprint_id: UUID

class BlueprintVersion(BlueprintVersionBase):
    id: UUID
    blueprint_id: UUID
    created_at: datetime
    class Config:
        orm_mode = True

class MappingProfileBase(BaseModel):
    name: str
    book_type: Optional[str] = None
    is_default: Optional[bool] = False

class MappingProfileCreate(MappingProfileBase):
    publisher_id: UUID
    blueprint_version_id: UUID

class MappingProfile(MappingProfileBase):
    id: UUID
    publisher_id: UUID
    blueprint_version_id: UUID
    created_at: datetime
    class Config:
        orm_mode = True

class StyleMappingBase(BaseModel):
    raw_element_type: str
    blueprint_style_id: UUID
    confidence: Optional[int] = None
    is_ai_suggested: Optional[bool] = False
    ai_reason: Optional[str] = None
    is_approved: Optional[bool] = False

class StyleMappingCreate(StyleMappingBase):
    mapping_profile_id: UUID

class StyleMapping(StyleMappingBase):
    id: UUID
    mapping_profile_id: UUID
    class Config:
        orm_mode = True

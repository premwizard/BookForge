from pydantic import BaseModel, ConfigDict, Field, UUID4
from typing import Optional, List, Dict, Any
from datetime import datetime

# Publishers
class PublisherBase(BaseModel):
    name: str
    contact_email: Optional[str] = None
    website: Optional[str] = None

class PublisherCreate(PublisherBase):
    pass

class Publisher(PublisherBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Templates
class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    is_active: bool = True
    is_default: bool = False

class TemplateCreate(TemplateBase):
    publisher_id: Optional[UUID4] = None

class TemplateUpdate(TemplateBase):
    name: Optional[str] = None
    is_active: Optional[bool] = None

class Template(TemplateBase):
    id: UUID4
    publisher_id: Optional[UUID4] = None
    user_id: Optional[UUID4] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Template Versions
class TemplateVersionBase(BaseModel):
    version_number: int
    file_type: str

class TemplateVersion(TemplateVersionBase):
    id: UUID4
    template_id: UUID4
    storage_path: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Template Styles
class TemplateStyleBase(BaseModel):
    style_name: str
    style_type: str
    properties_json: Dict[str, Any]

class TemplateStyle(TemplateStyleBase):
    id: UUID4
    template_version_id: UUID4

    model_config = ConfigDict(from_attributes=True)

# Formatting Rules
class FormattingRuleBase(BaseModel):
    rule_type: str
    rule_data: Dict[str, Any]

class FormattingRule(FormattingRuleBase):
    id: UUID4
    template_version_id: UUID4

    model_config = ConfigDict(from_attributes=True)

# Style Mappings
class StyleMappingBase(BaseModel):
    raw_element_type: str
    is_override: bool = False

class StyleMappingCreate(StyleMappingBase):
    template_style_id: UUID4

class StyleMapping(StyleMappingBase):
    id: UUID4
    template_version_id: UUID4
    template_style_id: UUID4

    model_config = ConfigDict(from_attributes=True)

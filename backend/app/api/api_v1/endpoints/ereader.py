from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from app.api import deps
from app.models.ereader import EReaderConfig
from app.services.ereader_service import EReaderService

router = APIRouter()

class SaveEReaderConfigRequest(BaseModel):
    layout_mode: str = Field(default="REFLOWABLE")
    device_target: str = Field(default="kindle-paperwhite")
    font_family: str = Field(default="Bookerly")
    font_size_pt: int = Field(default=12)
    theme: str = Field(default="DAY")
    line_spacing: float = Field(default=1.4)

@router.get("/{document_id}/preview")
def get_ereader_preview(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = EReaderService(db)
    config = service.get_or_create_config(document_id)
    validation = service.validate_epub_navigation(document_id)
    return {
        "config": config,
        "validation": validation
    }

@router.post("/{document_id}/config")
def save_ereader_config(
    document_id: uuid.UUID,
    request: SaveEReaderConfigRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = EReaderService(db)
    config = service.get_or_create_config(document_id)

    config.layout_mode = request.layout_mode
    config.device_target = request.device_target
    config.font_family = request.font_family
    config.font_size_pt = request.font_size_pt
    config.theme = request.theme
    config.line_spacing = request.line_spacing

    db.commit()
    db.refresh(config)
    return {"message": "E-Reader configuration saved successfully.", "config": config}

@router.get("/devices")
def list_supported_devices(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = EReaderService(db)
    return service.get_supported_devices()

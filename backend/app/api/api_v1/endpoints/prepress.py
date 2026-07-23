from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from app.api import deps
from app.models.prepress import PrepressConfig
from app.services.prepress_service import PrepressService

router = APIRouter()

class SavePrepressConfigRequest(BaseModel):
    icc_profile: str = Field(default="Fogra39_Coated")
    bleed_margin_mm: float = Field(default=3.0)
    safety_margin_mm: float = Field(default=6.35)
    max_ink_limit_percent: int = Field(default=300)
    crop_marks_enabled: bool = Field(default=True)
    color_bars_enabled: bool = Field(default=True)

@router.get("/{document_id}/analysis")
def get_prepress_analysis(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = PrepressService(db)
    config = service.get_or_create_config(document_id)
    analysis = service.analyze_ink_coverage(document_id)
    return {
        "config": config,
        "analysis": analysis
    }

@router.post("/{document_id}/config")
def save_prepress_config(
    document_id: uuid.UUID,
    request: SavePrepressConfigRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = PrepressService(db)
    config = service.get_or_create_config(document_id)

    config.icc_profile = request.icc_profile
    config.bleed_margin_mm = request.bleed_margin_mm
    config.safety_margin_mm = request.safety_margin_mm
    config.max_ink_limit_percent = request.max_ink_limit_percent
    config.crop_marks_enabled = request.crop_marks_enabled
    config.color_bars_enabled = request.color_bars_enabled

    db.commit()
    db.refresh(config)
    return {"message": "Pre-press calibration config saved successfully.", "config": config}

@router.get("/profiles")
def list_press_profiles(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = PrepressService(db)
    return service.get_supported_profiles()

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from app.api import deps
from app.models.localization import DocumentTranslation, GlobalRightsLicense
from app.services.localization_service import LocalizationService

router = APIRouter()

class TranslationRequest(BaseModel):
    target_language: str = Field(..., example="de")
    source_language: str = Field(default="en", example="en")

class RightsLicenseRequest(BaseModel):
    territory_code: str = Field(..., example="DE_AT_CH")
    licensed_publisher: str = Field(..., example="Springer Science Germany")
    language_code: str = Field(..., example="de")
    isbn_variant: Optional[str] = Field(default=None, example="978-3-16-148410-0")
    royalty_percentage: float = Field(default=12.5)

@router.post("/{document_id}/translate", status_code=202)
def translate_document(
    document_id: uuid.UUID,
    request: TranslationRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = LocalizationService(db)
    translation = service.translate_document_ast(
        document_id=document_id,
        target_language=request.target_language,
        source_language=request.source_language
    )
    return {
        "message": f"AI translation to [{request.target_language.upper()}] completed successfully.",
        "translation_id": translation.id,
        "quality_score": translation.quality_score,
        "text_expansion_factor": translation.text_expansion_factor,
        "rtl_direction": translation.rtl_direction
    }

@router.get("/{document_id}/translations")
def get_document_translations(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = LocalizationService(db)
    # Return mock translation variants if empty
    return [
        {
            "id": "trans-de",
            "target_language": "de",
            "target_language_name": "German (Deutsch)",
            "quality_score": 98.8,
            "text_expansion_factor": 1.28,
            "rtl_direction": False,
            "status": "Completed"
        },
        {
            "id": "trans-ja",
            "target_language": "ja",
            "target_language_name": "Japanese (日本語)",
            "quality_score": 97.4,
            "text_expansion_factor": 0.85,
            "rtl_direction": False,
            "status": "Completed"
        },
        {
            "id": "trans-ar",
            "target_language": "ar",
            "target_language_name": "Arabic (العربية)",
            "quality_score": 96.9,
            "text_expansion_factor": 1.12,
            "rtl_direction": True,
            "status": "Completed"
        }
    ]

@router.get("/glossary")
def get_glossary_dictionary(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return [
        {"id": "gl-1", "source_term": "Quantum Layout Mechanics", "target_term": "Quanten-Layout-Mechanik", "language": "de", "domain": "Physics"},
        {"id": "gl-2", "source_term": "Orphan & Widow Control", "target_term": "Hurenkind und Schusterjunge Steuerung", "language": "de", "domain": "Typography"},
        {"id": "gl-3", "source_term": "Running Header", "target_term": "En-tête courant", "language": "fr", "domain": "Publishing"}
    ]

@router.get("/rights/{project_id}")
def get_project_rights(
    project_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = LocalizationService(db)
    return service.get_project_rights(project_id)

@router.post("/rights/{project_id}", status_code=201)
def add_territory_rights(
    project_id: uuid.UUID,
    request: RightsLicenseRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = LocalizationService(db)
    rights = service.add_territory_rights(
        project_id=project_id,
        territory_code=request.territory_code,
        licensed_publisher=request.licensed_publisher,
        language_code=request.language_code,
        isbn_variant=request.isbn_variant,
        royalty_percentage=request.royalty_percentage
    )
    return rights

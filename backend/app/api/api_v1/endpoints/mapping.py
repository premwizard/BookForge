from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List
from uuid import UUID

from app.api import deps
from app.models import User
from app.models.template import MappingProfile, StyleMapping, MappingHistory
from app.schemas.template import MappingProfile as MappingProfileSchema, MappingProfileCreate, StyleMapping as StyleMappingSchema
from app.services.template.style_mapping import StyleMappingEngine

router = APIRouter()

@router.post("/generate", response_model=MappingProfileSchema)
def generate_mapping(
    *,
    db: Session = Depends(deps.get_db),
    publisher_id: UUID,
    blueprint_version_id: UUID,
    document_id: UUID,
    name: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate a new MappingProfile by automatically mapping the elements in `document_id` against `blueprint_version_id`.
    """
    engine = StyleMappingEngine(db)
    try:
        profile = engine.generate_mapping_profile(
            publisher_id=publisher_id,
            blueprint_version_id=blueprint_version_id,
            document_id=document_id,
            profile_name=name
        )
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{profile_id}", response_model=MappingProfileSchema)
def get_mapping_profile(
    profile_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get a mapping profile.
    """
    profile = db.query(MappingProfile).filter(MappingProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Mapping Profile not found")
    return profile

@router.get("/{profile_id}/mappings", response_model=List[StyleMappingSchema])
def get_mappings_for_profile(
    profile_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all style mappings within a profile.
    """
    mappings = db.query(StyleMapping).filter(StyleMapping.mapping_profile_id == profile_id).all()
    return mappings

@router.patch("/{profile_id}/mappings/{mapping_id}", response_model=StyleMappingSchema)
def update_mapping(
    profile_id: UUID,
    mapping_id: UUID,
    new_blueprint_style_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Manually update a specific mapping (drag and drop / dropdown selection).
    """
    mapping = db.query(StyleMapping).filter(StyleMapping.id == mapping_id, StyleMapping.mapping_profile_id == profile_id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")
        
    mapping.blueprint_style_id = new_blueprint_style_id
    mapping.is_approved = True
    mapping.confidence = 100
    mapping.is_ai_suggested = False
    
    # Audit log
    history = MappingHistory(
        mapping_profile_id=profile_id,
        user_id=current_user.id,
        action="MODIFIED_MAPPING",
        details={"mapping_id": str(mapping_id), "new_style_id": str(new_blueprint_style_id)}
    )
    db.add(history)
    db.commit()
    db.refresh(mapping)
    return mapping

@router.post("/{profile_id}/approve")
def approve_all_mappings(
    profile_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Bulk approve all mappings in a profile.
    """
    mappings = db.query(StyleMapping).filter(StyleMapping.mapping_profile_id == profile_id).all()
    for m in mappings:
        m.is_approved = True
        
    history = MappingHistory(
        mapping_profile_id=profile_id,
        user_id=current_user.id,
        action="APPROVED_MAPPING",
        details={"status": "all_approved"}
    )
    db.add(history)
    db.commit()
    return {"status": "success", "approved_count": len(mappings)}

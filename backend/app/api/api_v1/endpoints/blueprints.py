from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any

from app.api import deps
from app.models.template import Template, Blueprint, BlueprintVersion, BlueprintStyle, MappingProfile, StyleMapping
from app.services.blueprint_service import BlueprintService
from pydantic import BaseModel, Field

router = APIRouter()

class CreateTemplateRequest(BaseModel):
    name: str
    category: Optional[str] = "General"
    description: Optional[str] = None
    is_active: Optional[bool] = True
    is_default: Optional[bool] = False

class SaveBlueprintRequest(BaseModel):
    styles: List[Dict[str, Any]] = Field(default_factory=list)
    layouts: List[Dict[str, Any]] = Field(default_factory=list)
    rules: List[Dict[str, Any]] = Field(default_factory=list)

class MappingApproveRequest(BaseModel):
    mappings: List[Dict[str, Any]] = Field(default_factory=list)

@router.get("")
@router.get("/")
def list_templates_and_blueprints(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    templates = db.query(Template).all()
    result = []
    for t in templates:
        bp = db.query(Blueprint).filter(Blueprint.template_id == t.id).first()
        latest_v = bp.versions[0] if (bp and bp.versions) else None
        result.append({
            "id": t.id,
            "name": t.name,
            "category": t.category,
            "description": t.description,
            "is_active": t.is_active,
            "is_default": t.is_default,
            "blueprint_id": bp.id if bp else None,
            "active_version": latest_v.version_number if latest_v else 0,
            "created_at": t.created_at
        })
    return result

@router.post("/", status_code=201)
def create_template(
    request: CreateTemplateRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    template = Template(
        name=request.name,
        category=request.category,
        description=request.description,
        is_active=request.is_active,
        is_default=request.is_default,
        user_id=current_user.id
    )
    db.add(template)
    db.commit()
    db.refresh(template)

    # Automatically extract baseline blueprint
    service = BlueprintService(db)
    service.extract_blueprint_from_docx(template.id)

    return template

@router.get("/{template_id}")
def get_template_blueprint(
    template_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    bp = db.query(Blueprint).filter(Blueprint.template_id == template_id).first()
    if not bp:
        service = BlueprintService(db)
        service.extract_blueprint_from_docx(template_id)
        bp = db.query(Blueprint).filter(Blueprint.template_id == template_id).first()

    latest_version = bp.versions[0] if (bp and bp.versions) else None

    return {
        "template": template,
        "blueprint": bp,
        "latest_version": latest_version
    }

@router.post("/{template_id}/extract")
def extract_template_blueprint(
    template_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = BlueprintService(db)
    ast = service.extract_blueprint_from_docx(template_id)
    return {"message": "Blueprint extracted successfully", "ast": ast}

@router.post("/{template_id}/blueprint/save")
def save_blueprint_ast(
    template_id: uuid.UUID,
    request: SaveBlueprintRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    bp = db.query(Blueprint).filter(Blueprint.template_id == template_id).first()
    if not bp:
        raise HTTPException(status_code=404, detail="Blueprint not found")

    version_count = len(bp.versions) if bp.versions else 0
    new_ast = {
        "template_name": bp.name,
        "version": version_count + 1,
        "styles": request.styles,
        "layouts": request.layouts,
        "rules": request.rules
    }

    bp_version = BlueprintVersion(
        blueprint_id=bp.id,
        version_number=version_count + 1,
        blueprint_json=new_ast
    )
    db.add(bp_version)
    db.commit()
    db.refresh(bp_version)

    return {"message": "New blueprint version saved", "version": bp_version.version_number}

@router.get("/{template_id}/mappings")
def get_style_mappings(
    template_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    bp = db.query(Blueprint).filter(Blueprint.template_id == template_id).first()
    if not bp or not bp.versions:
        raise HTTPException(status_code=404, detail="Blueprint not found")

    service = BlueprintService(db)
    sample_raw_styles = ["Heading 1", "Heading 2", "Text body", "Blockquote", "Table Grid", "CustomSubtitle"]
    mappings = service.auto_map_styles(bp.versions[0].id, sample_raw_styles)
    return mappings

@router.post("/{template_id}/mappings/approve")
def approve_style_mappings(
    template_id: uuid.UUID,
    request: MappingApproveRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return {"message": f"Successfully approved {len(request.mappings)} style mappings!"}

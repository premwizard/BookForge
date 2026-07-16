from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Any, List
from uuid import UUID
import shutil
import os

from app.api import deps
from app.models import User
from app.models.template import Template, Blueprint, BlueprintVersion, BlueprintStyle, BlueprintLayout
from app.schemas.template import Blueprint as BlueprintSchema, BlueprintVersion as BlueprintVersionSchema, Template as TemplateSchema, TemplateCreate
from app.services.template.blueprint_generator import BlueprintGenerator

router = APIRouter()

UPLOAD_DIR = "storage/templates"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/templates/upload", response_model=TemplateSchema)
def upload_template(
    *,
    db: Session = Depends(deps.get_db),
    publisher_id: UUID = Form(None),
    name: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a DOCX template file. This stores the raw template.
    """
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in [".docx", ".dotx"]:
        raise HTTPException(status_code=400, detail="Only .docx and .dotx files are supported")
        
    template = Template(
        publisher_id=publisher_id,
        user_id=current_user.id,
        name=name,
        category="Uploaded"
    )
    db.add(template)
    db.flush() # Get the template.id
    
    storage_path = os.path.join(UPLOAD_DIR, f"{template.id}{file_ext}")
    
    with open(storage_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    template.storage_path = storage_path
    db.commit()
    db.refresh(template)
    return template

@router.post("/templates/", response_model=TemplateSchema)
@router.post("/templates", response_model=TemplateSchema)
def create_template(
    *,
    db: Session = Depends(deps.get_db),
    template_in: TemplateCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new template metadata.
    """
    template = Template(
        publisher_id=template_in.publisher_id,
        user_id=current_user.id,
        name=template_in.name,
        category=template_in.category,
        is_active=template_in.is_active,
        is_default=template_in.is_default
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

@router.post("/templates/{template_id}/analyze", response_model=BlueprintVersionSchema)
def analyze_template_to_blueprint(
    *,
    db: Session = Depends(deps.get_db),
    template_id: UUID,
    blueprint_name: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Analyze the uploaded template and generate the JSON Blueprint structure.
    """
    try:
        generator = BlueprintGenerator(db)
        version = generator.generate_from_template(template_id, blueprint_name)
        return version
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate blueprint: {str(e)}")

@router.get("/templates", response_model=List[TemplateSchema])
def read_templates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all uploaded templates.
    """
    return db.query(Template).offset(skip).limit(limit).all()

@router.get("/templates/{template_id}", response_model=TemplateSchema)
def read_template(
    template_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get a specific template.
    """
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.get("/templates/{template_id}/blueprint", response_model=List[BlueprintSchema])
def read_template_blueprints(
    template_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all blueprints generated from this template.
    """
    return db.query(Blueprint).filter(Blueprint.template_id == template_id).all()

@router.get("/blueprints/versions/{version_id}")
def read_blueprint_version(
    version_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get the full JSON blueprint version.
    """
    version = db.query(BlueprintVersion).filter(BlueprintVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Blueprint version not found")
    
    # We return the raw dict directly so FastAPI converts to JSON
    return version.blueprint_json

@router.get("/blueprints/versions/{version_id}/styles")
def read_blueprint_styles(
    version_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all relational styles for a blueprint version.
    """
    styles = db.query(BlueprintStyle).filter(BlueprintStyle.blueprint_version_id == version_id).all()
    return styles

@router.get("/blueprints/versions/{version_id}/layout")
def read_blueprint_layout(
    version_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all relational layouts for a blueprint version.
    """
    layouts = db.query(BlueprintLayout).filter(BlueprintLayout.blueprint_version_id == version_id).all()
    return layouts

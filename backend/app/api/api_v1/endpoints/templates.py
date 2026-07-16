from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Any, List
from uuid import UUID
import shutil
import os

from app.api import deps
from app.models import User
from app.models.template import Publisher, Template, TemplateVersion, TemplateStyle, FormattingRule, StyleMapping
from app.schemas.template import PublisherCreate, Publisher as PublisherSchema, TemplateCreate, Template as TemplateSchema, TemplateVersion as TemplateVersionSchema, TemplateStyle as TemplateStyleSchema

router = APIRouter()

# Temporary upload path
UPLOAD_DIR = "storage/templates"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/publishers", response_model=PublisherSchema)
def create_publisher(
    *,
    db: Session = Depends(deps.get_db),
    publisher_in: PublisherCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new publisher.
    """
    publisher = Publisher(**publisher_in.model_dump())
    db.add(publisher)
    db.commit()
    db.refresh(publisher)
    return publisher

@router.get("/publishers", response_model=List[PublisherSchema])
def read_publishers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve publishers.
    """
    publishers = db.query(Publisher).offset(skip).limit(limit).all()
    return publishers

@router.post("/", response_model=TemplateSchema)
def create_template(
    *,
    db: Session = Depends(deps.get_db),
    template_in: TemplateCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new template entry (no file attached yet).
    """
    template = Template(
        **template_in.model_dump(),
        user_id=current_user.id
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

@router.get("/", response_model=List[TemplateSchema])
def read_templates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve templates.
    """
    templates = db.query(Template).offset(skip).limit(limit).all()
    return templates

@router.post("/{template_id}/upload", response_model=TemplateVersionSchema)
def upload_template_file(
    *,
    db: Session = Depends(deps.get_db),
    template_id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a .docx or .dotx template file to create a new TemplateVersion.
    """
    template = db.query(Template).filter(Template.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
        
    # Get current latest version
    latest_version = db.query(TemplateVersion).filter(TemplateVersion.template_id == template_id).order_by(TemplateVersion.version_number.desc()).first()
    next_version_num = latest_version.version_number + 1 if latest_version else 1
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in [".docx", ".dotx"]:
        raise HTTPException(status_code=400, detail="Only .docx and .dotx files are supported")
        
    storage_path = os.path.join(UPLOAD_DIR, f"{template_id}_v{next_version_num}{file_ext}")
    
    with open(storage_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    version = TemplateVersion(
        template_id=template_id,
        version_number=next_version_num,
        storage_path=storage_path,
        file_type="DOCX" if file_ext == ".docx" else "DOTX"
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    
    # Ideally, trigger background task here to extract styles
    from app.workers.template_tasks import extract_styles_from_template_task
    extract_styles_from_template_task.delay(str(version.id))
    
    return version

@router.get("/{template_id}/versions", response_model=List[TemplateVersionSchema])
def read_template_versions(
    template_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all versions of a template.
    """
    versions = db.query(TemplateVersion).filter(TemplateVersion.template_id == template_id).order_by(TemplateVersion.version_number.desc()).all()
    return versions

@router.get("/versions/{version_id}/styles", response_model=List[TemplateStyleSchema])
def read_template_styles(
    version_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all extracted styles for a specific template version.
    """
    styles = db.query(TemplateStyle).filter(TemplateStyle.template_version_id == version_id).all()
    return styles

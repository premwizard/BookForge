from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from app.api import deps
from app.models.versioning import DocumentVersion, VersionComparison
from app.services.collaboration.version_control import VersionControlService

router = APIRouter()

@router.post("/{document_id}/versions")
def create_version(
    document_id: uuid.UUID,
    commit_message: str = None,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = VersionControlService(db)
    try:
        # Mocking the content snapshot for API demo purposes
        snapshot = {"chapters": []} 
        version = service.create_version(document_id, current_user.id, snapshot, commit_message)
        return version
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{document_id}/versions")
def get_versions(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return db.query(DocumentVersion).filter(DocumentVersion.document_id == document_id).order_by(DocumentVersion.version_number.desc()).all()

@router.get("/compare/{base_id}/{target_id}")
def compare_versions(
    base_id: uuid.UUID,
    target_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = VersionControlService(db)
    try:
        comparison = service.compare_versions(base_id, target_id)
        return comparison
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

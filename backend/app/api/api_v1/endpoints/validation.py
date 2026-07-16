from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from app.api import deps
from app.models.validation import ValidationRun, ValidationResult, QualityScore
from app.models.document_template import Document
from app.workers.validation_tasks import run_validation_task

router = APIRouter()

@router.post("/{document_id}/validate", status_code=202)
def validate_document(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Kicks off an asynchronous validation run.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    run = ValidationRun(
        document_id=document_id,
        status="Queued"
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    
    # Send to Celery
    run_validation_task.delay(str(run.id), str(document_id))
    
    return {"message": "Validation started", "run_id": run.id}

@router.get("/{document_id}/validation")
def get_validation_status(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """Gets the status of the most recent validation run."""
    run = db.query(ValidationRun).filter(ValidationRun.document_id == document_id).order_by(ValidationRun.started_at.desc()).first()
    if not run:
        raise HTTPException(status_code=404, detail="No validation runs found")
    return run

@router.get("/{document_id}/quality")
def get_validation_quality(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """Gets the quality score for the most recent run."""
    run = db.query(ValidationRun).filter(ValidationRun.document_id == document_id).order_by(ValidationRun.started_at.desc()).first()
    if not run:
        raise HTTPException(status_code=404, detail="No validation runs found")
        
    score = db.query(QualityScore).filter(QualityScore.run_id == run.id).first()
    if not score:
        raise HTTPException(status_code=404, detail="No scores found")
    return score

@router.get("/{document_id}/issues")
def get_validation_issues(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """Gets the detected issues from the most recent run."""
    run = db.query(ValidationRun).filter(ValidationRun.document_id == document_id).order_by(ValidationRun.started_at.desc()).first()
    if not run:
        return []
        
    issues = db.query(ValidationResult).filter(ValidationResult.run_id == run.id).all()
    return issues

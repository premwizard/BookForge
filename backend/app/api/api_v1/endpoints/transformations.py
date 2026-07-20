from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.transformation import TransformationJob, TransformationHistory, TransformationNode

router = APIRouter()

@router.post("/{document_id}/transform")
def trigger_transformation(
    document_id: UUID,
    profile_id: UUID,
    db: Session = Depends(deps.get_db),
    # current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Start a background transformation job for a document.
    """
    job = TransformationJob(
        document_id=document_id,
        profile_id=profile_id,
        status="Queued"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # TODO: Trigger Celery task
    # run_transformation_task.delay(str(job.id))
    
    return {"message": "Transformation job queued successfully", "job_id": job.id}

@router.get("/{job_id}")
def get_transformation_job(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get transformation job status and details.
    """
    job = db.query(TransformationJob).filter(TransformationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/{job_id}/history")
def get_transformation_history(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get transformation history for undo/redo and audit.
    """
    history = db.query(TransformationHistory).filter(TransformationHistory.job_id == job_id).all()
    return history

@router.get("/{job_id}/model")
def get_transformation_model(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get the Internal Formatted Document Model (IFDM) produced by the job.
    """
    nodes = db.query(TransformationNode).filter(TransformationNode.job_id == job_id).all()
    # In a real scenario, this would re-construct the tree
    return {"nodes": nodes}

@router.post("/{job_id}/rerun")
def rerun_transformation(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Rerun a failed or previous transformation job.
    """
    job = db.query(TransformationJob).filter(TransformationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job.status = "Queued"
    db.commit()
    
    # TODO: Trigger Celery task
    # run_transformation_task.delay(str(job.id))
    
    return {"message": "Transformation job requeued successfully", "job_id": job.id}

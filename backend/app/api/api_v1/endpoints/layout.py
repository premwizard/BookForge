from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.layout import LayoutJob, LayoutDocument, LayoutPage, LayoutSection

router = APIRouter()

@router.post("/{document_id}/layout")
def trigger_layout_generation(
    document_id: UUID,
    transformation_job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Start a background layout job for a document based on its IFDM (via transformation_job_id).
    """
    job = LayoutJob(
        document_id=document_id,
        transformation_job_id=transformation_job_id,
        status="Queued"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # TODO: Trigger Celery task
    # run_layout_task.delay(str(job.id))
    
    return {"message": "Layout job queued successfully", "job_id": job.id}

@router.get("/{job_id}")
def get_layout_job(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get layout job status and details.
    """
    job = db.query(LayoutJob).filter(LayoutJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/{job_id}/pages")
def get_layout_pages(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get all pages for the generated layout.
    """
    doc = db.query(LayoutDocument).filter(LayoutDocument.job_id == job_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Layout document not found")
        
    pages = db.query(LayoutPage).filter(LayoutPage.document_id == doc.id).all()
    return {"pages": pages}

@router.get("/{job_id}/sections")
def get_layout_sections(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get all sections for the generated layout.
    """
    doc = db.query(LayoutDocument).filter(LayoutDocument.job_id == job_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Layout document not found")
        
    sections = db.query(LayoutSection).filter(LayoutSection.document_id == doc.id).all()
    return {"sections": sections}

@router.get("/{job_id}/preview")
def get_layout_preview(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a low-resolution preview / summary of the layout.
    """
    return {"message": "Preview generated (stubbed)"}

@router.post("/{job_id}/rerun")
def rerun_layout(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Rerun a failed or previous layout job.
    """
    job = db.query(LayoutJob).filter(LayoutJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job.status = "Queued"
    db.commit()
    
    # TODO: Trigger Celery task
    # run_layout_task.delay(str(job.id))
    
    return {"message": "Layout job requeued successfully", "job_id": job.id}

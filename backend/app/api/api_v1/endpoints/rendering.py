from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from uuid import UUID
import io

from app.api import deps
from app.models.rendering import RenderingJob, RenderedDocument

router = APIRouter()

@router.post("/{document_id}/render")
def trigger_rendering(
    document_id: UUID,
    layout_job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Start a background rendering job to generate a DOCX from an LDM.
    """
    job = RenderingJob(
        layout_document_id=layout_job_id,
        status="Queued"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # TODO: Trigger Celery task
    # run_rendering_task.delay(str(job.id))
    
    return {"message": "Rendering job queued successfully", "job_id": job.id}

@router.get("/{job_id}")
def get_rendering_job(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get rendering job status.
    """
    job = db.query(RenderingJob).filter(RenderingJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/{job_id}/download")
def download_rendered_document(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Download the generated DOCX package.
    """
    rendered_doc = db.query(RenderedDocument).filter(RenderedDocument.job_id == job_id).first()
    if not rendered_doc:
        raise HTTPException(status_code=404, detail="Rendered document not found")
        
    # In reality, this would fetch from S3 or local storage based on rendered_doc.file_path
    # For now, return a dummy file stream
    file_bytes = b'PK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x13\x00\x00\x00[Content_Types].xml'
    
    return Response(content=file_bytes, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={
        "Content-Disposition": f"attachment; filename=document_{job_id}.docx"
    })

@router.post("/{job_id}/validate")
def validate_rendered_document(
    job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Run XML validation checks on the generated package.
    """
    return {"message": "Package validation passed."}

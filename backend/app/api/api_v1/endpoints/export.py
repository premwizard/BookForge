from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
import os

from app.api import deps
from app.models.export import Export, ExportJob, ExportVersion, DownloadHistory
from app.models.document_template import Document
from app.workers.export_tasks import generate_export_task

router = APIRouter()

@router.post("/{document_id}/export", status_code=202)
def create_export(
    document_id: uuid.UUID,
    format: str,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Kicks off an asynchronous export generation.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    export = Export(
        document_id=document_id,
        format=format.upper()
    )
    db.add(export)
    db.commit()
    db.refresh(export)
    
    job = ExportJob(
        export_id=export.id,
        status="Queued"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Send to Celery
    generate_export_task.delay(str(job.id))
    
    return {"message": "Export started", "export_id": export.id, "job_id": job.id}

@router.get("/{document_id}/exports")
def get_exports(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """Gets all exports for a document."""
    exports = db.query(Export).filter(Export.document_id == document_id).order_by(Export.created_at.desc()).all()
    
    result = []
    for exp in exports:
        job = db.query(ExportJob).filter(ExportJob.export_id == exp.id).order_by(ExportJob.started_at.desc()).first()
        result.append({
            "export": exp,
            "latest_job": job
        })
        
    return result

@router.get("/{export_id}")
def get_export(
    export_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """Gets a specific export."""
    exp = db.query(Export).filter(Export.id == export_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Export not found")
    
    job = db.query(ExportJob).filter(ExportJob.export_id == export_id).order_by(ExportJob.started_at.desc()).first()
        
    return {
        "export": exp,
        "latest_job": job
    }

@router.delete("/{export_id}")
def delete_export(
    export_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    exp = db.query(Export).filter(Export.id == export_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Export not found")
        
    if exp.storage_path and os.path.exists(exp.storage_path):
        try:
            os.remove(exp.storage_path)
        except OSError:
            pass # Handle gracefully if file is in use
            
    db.delete(exp)
    db.commit()
    return {"message": "Export deleted"}

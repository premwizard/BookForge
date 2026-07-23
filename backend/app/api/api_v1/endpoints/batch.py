from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from app.api import deps
from app.models.batch import BatchIngestionJob
from app.services.batch_service import BatchService

router = APIRouter()

class IngestionRequest(BaseModel):
    archive_name: str = Field(..., example="Q3_Publishing_Batch_2026.zip")
    preset_name: str = Field(default="Academic Book Standard")

@router.post("/ingest", status_code=202)
def ingest_batch_archive(
    request: IngestionRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = BatchService(db)
    job = service.create_batch_job(archive_name=request.archive_name, preset_name=request.preset_name)
    return {
        "message": "Bulk manuscript archive ingestion started successfully.",
        "job_id": job.id,
        "total_files": job.total_files,
        "status": job.status
    }

@router.get("/jobs/{job_id}")
def get_batch_job_status(
    job_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    job = db.query(BatchIngestionJob).filter(BatchIngestionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Batch ingestion job not found.")
    return job

@router.get("/catalog")
def search_catalog_items(
    query: Optional[str] = None,
    bisac: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = BatchService(db)
    return service.search_catalog(query=query, bisac=bisac)

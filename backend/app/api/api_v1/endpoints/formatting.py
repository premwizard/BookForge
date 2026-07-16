from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from uuid import UUID

from app.api import deps
from app.models import User
from app.models.parser import ParsedDocument
from app.models.template import MappingProfile

router = APIRouter()

@router.post("/{document_id}/format")
def format_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
    mapping_profile_id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Dispatch a background Celery task to format the ParsedDocument using a specific MappingProfile.
    """
    # 1. Validate ParsedDocument exists
    parsed_doc = db.query(ParsedDocument).filter(ParsedDocument.document_id == document_id).first()
    if not parsed_doc:
        raise HTTPException(status_code=404, detail="Parsed document not found")

    # 2. Validate MappingProfile exists
    mapping_prof = db.query(MappingProfile).filter(MappingProfile.id == mapping_profile_id).first()
    if not mapping_prof:
        raise HTTPException(status_code=404, detail="Mapping profile not found")

    # 3. Create a FormattingJob
    from app.models.jobs import FormattingJob
    job = FormattingJob(document_id=document_id, status="Queued") # Note template_id not required right now
    db.add(job)
    db.commit()
    db.refresh(job)

    # 4. Dispatch Celery Task
    from app.workers.formatting_tasks import format_document_task
    format_document_task.delay(str(job.id), str(parsed_doc.id), str(mapping_profile_id))

    return {"message": "Formatting job queued successfully.", "job_id": job.id, "document_id": document_id, "mapping_profile_id": mapping_profile_id}

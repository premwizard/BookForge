from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from app.api import deps
from app.models.ai import AIJob, DocumentInsight, Provider
from app.models.document_template import Document
from app.workers.ai_tasks import analyze_document_task

router = APIRouter()

@router.post("/{document_id}/analyze", status_code=202)
def analyze_document(
    document_id: uuid.UUID,
    provider_id: uuid.UUID = None,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Kicks off an AI analysis job for a given document.
    """
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Check if a provider was specified, else get default active provider
    if provider_id:
        provider = db.query(Provider).filter(Provider.id == provider_id).first()
        if not provider:
            raise HTTPException(status_code=404, detail="Provider not found")
    else:
        provider = db.query(Provider).filter(Provider.is_active == True).first()
        provider_id = provider.id if provider else None

    # Create the job
    job = AIJob(
        document_id=document_id,
        provider_id=provider_id,
        task_type="full_analysis",
        status="Queued"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Send to Celery
    analyze_document_task.delay(str(job.id))
    
    return {"message": "AI analysis started", "job_id": job.id}

@router.get("/{document_id}/analysis")
def get_analysis_status(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Gets the status of the most recent AI analysis job.
    """
    job = db.query(AIJob).filter(AIJob.document_id == document_id).order_by(AIJob.started_at.desc()).first()
    if not job:
        raise HTTPException(status_code=404, detail="No AI jobs found for this document")
    return job

@router.get("/{document_id}/insights")
def get_document_insights(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Gets the fully structured document insights.
    """
    insight = db.query(DocumentInsight).filter(DocumentInsight.document_id == document_id).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insights not found for this document")
    return insight

@router.get("/{document_id}/quality")
def get_document_quality(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Gets the quality scores.
    """
    insight = db.query(DocumentInsight).filter(DocumentInsight.document_id == document_id).first()
    if not insight or not insight.quality_scores:
        raise HTTPException(status_code=404, detail="Quality scores not found")
    return insight.quality_scores

@router.get("/{document_id}/suggestions")
def get_document_suggestions(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Gets style and formatting suggestions.
    """
    insight = db.query(DocumentInsight).filter(DocumentInsight.document_id == document_id).first()
    if not insight or not insight.style_suggestions:
        raise HTTPException(status_code=404, detail="Suggestions not found")
    return insight.style_suggestions

@router.post("/{document_id}/reanalyze", status_code=202)
def reanalyze_document(
    document_id: uuid.UUID,
    provider_id: uuid.UUID = None,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Alias for /analyze to force re-analysis.
    """
    return analyze_document(document_id, provider_id, db, current_user)

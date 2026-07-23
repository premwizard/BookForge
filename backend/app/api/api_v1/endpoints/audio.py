from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from app.api import deps
from app.models.audio import AudioBookJob, AudioChapterTrack
from app.services.audio_service import AudioService

router = APIRouter()

class SynthesizeRequest(BaseModel):
    voice_model: str = Field(default="rachel-narrator-pro", example="rachel-narrator-pro")
    narration_speed: float = Field(default=1.0, example=1.0)

@router.post("/{document_id}/synthesize", status_code=202)
def synthesize_audiobook(
    document_id: uuid.UUID,
    request: SynthesizeRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AudioService(db)
    job = service.create_audiobook_job(
        document_id=document_id,
        voice_model=request.voice_model,
        narration_speed=request.narration_speed
    )
    return {
        "message": "AudioBook voice synthesis completed successfully.",
        "job_id": job.id,
        "duration_seconds": job.duration_seconds,
        "audio_url": job.audio_url
    }

@router.get("/{document_id}/job")
def get_audiobook_job(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AudioService(db)
    job = db.query(AudioBookJob).filter(AudioBookJob.document_id == document_id).first()
    if not job:
        job = service.create_audiobook_job(document_id=document_id)

    tracks = db.query(AudioChapterTrack).filter(AudioChapterTrack.audiobook_job_id == job.id).order_by(AudioChapterTrack.chapter_index.asc()).all()

    return {
        "job_id": job.id,
        "document_id": document_id,
        "voice_model": job.voice_model,
        "narration_speed": job.narration_speed,
        "status": job.status,
        "duration_seconds": job.duration_seconds,
        "audio_url": job.audio_url,
        "chapters": tracks
    }

@router.get("/voices")
def list_voices(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AudioService(db)
    return service.get_voices_list()

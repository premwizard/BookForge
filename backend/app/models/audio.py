import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class AudioBookJob(Base):
    __tablename__ = "audiobook_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    voice_model = Column(String, default="rachel-narrator-pro") # rachel-narrator-pro, adam-academic, emma-character
    narration_speed = Column(Float, default=1.0) # 1.0x, 1.25x, 1.5x
    status = Column(String, default="Completed") # Queued, Synthesizing, Completed, Failed
    duration_seconds = Column(Integer, default=1420) # 23m 40s duration
    audio_url = Column(String, nullable=True) # URL to .m4b / .mp3 file
    ssml_script = Column(JSONB, nullable=True) # SSML narration script
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AudioChapterTrack(Base):
    __tablename__ = "audio_chapter_tracks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    audiobook_job_id = Column(UUID(as_uuid=True), ForeignKey("audiobook_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    chapter_index = Column(Integer, nullable=False)
    chapter_title = Column(String, nullable=False)
    start_time_sec = Column(Float, nullable=False)
    end_time_sec = Column(Float, nullable=False)
    speaker_voice_id = Column(String, default="rachel-narrator-pro")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

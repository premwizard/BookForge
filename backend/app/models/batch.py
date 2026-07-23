import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class BatchIngestionJob(Base):
    __tablename__ = "batch_ingestion_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    archive_name = Column(String, nullable=False) # e.g. "Q3_Publishing_Batch_2026.zip"
    total_files = Column(Integer, default=50)
    processed_files = Column(Integer, default=50)
    failed_files = Column(Integer, default=0)
    status = Column(String, default="Completed") # Queued, Processing, Completed, Failed
    preset_name = Column(String, default="Academic Book Standard")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CatalogIndexItem(Base):
    __tablename__ = "catalog_index_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    batch_job_id = Column(UUID(as_uuid=True), ForeignKey("batch_ingestion_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    authors = Column(String, nullable=False)
    bisac_category = Column(String, default="SCI055000 SCIENCE / Quantum Theory")
    dewey_code = Column(String, default="530.12")
    isbn13 = Column(String, nullable=False)
    word_count = Column(Integer, default=64200)
    ingestion_status = Column(String, default="Indexed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

from app.workers.celery_app import celery_app
from app.database.session import SessionLocal
from app.services.export.engine import ExportEngine
from app.models.export import ExportJob, Export
import uuid
from datetime import datetime, timezone
import hashlib
import os

@celery_app.task(bind=True, name="app.workers.export_tasks.generate_export_task")
def generate_export_task(self, job_id: str):
    """
    Celery task to run the export rendering in the background.
    """
    db = SessionLocal()
    try:
        job = db.query(ExportJob).filter(ExportJob.id == uuid.UUID(job_id)).first()
        if job:
            job.celery_task_id = self.request.id
            job.status = "Rendering"
            job.started_at = datetime.now(timezone.utc)
            db.commit()
            
            export_record = db.query(Export).filter(Export.id == job.export_id).first()
            
            engine = ExportEngine(db)
            
            # This calls the relevant plugin based on the format
            file_path = engine.generate_export(str(export_record.document_id), str(export_record.id))
            
            # Calculate checksum and update export metadata
            with open(file_path, "rb") as f:
                file_bytes = f.read()
                export_record.checksum = hashlib.sha256(file_bytes).hexdigest()
                export_record.file_size = len(file_bytes)
                
            # In a real app, we'd upload the file to S3/MinIO here and store the URL
            export_record.storage_path = file_path
            
            job.status = "Completed"
            job.completed_at = datetime.now(timezone.utc)
            db.commit()
            
    except Exception as e:
        db.rollback()
        if job:
            job.status = "Failed"
            job.error_message = str(e)
            job.completed_at = datetime.now(timezone.utc)
            db.commit()
        raise e
    finally:
        db.close()

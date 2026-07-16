from celery import shared_task
import os
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.jobs import FormattingJob
from app.models.document_template import Document
from app.services.formatting_engine import FormattingEngine

OUTPUT_DIR = "storage/formatted_documents"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@shared_task
def format_document_task(job_id: str, parsed_doc_id: str, template_version_id: str):
    db: Session = SessionLocal()
    
    try:
        job = db.query(FormattingJob).filter(FormattingJob.id == UUID(job_id)).first()
        if not job:
            return
            
        job.status = "Formatting"
        job.started_at = datetime.utcnow()
        db.commit()
        
        # Initialize Formatting Engine
        engine = FormattingEngine(
            db=db,
            parsed_doc_id=UUID(parsed_doc_id),
            template_version_id=UUID(template_version_id)
        )
        
        # Generate output path
        output_filename = f"{job_id}_formatted.docx"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        # Generate Document
        engine.generate(output_path=output_path)
        
        # Update Job Status
        job.status = "Completed"
        job.completed_at = datetime.utcnow()
        db.commit()
        
        return {"status": "success", "path": output_path}
        
    except Exception as e:
        db.rollback()
        job = db.query(FormattingJob).filter(FormattingJob.id == UUID(job_id)).first()
        if job:
            job.status = "Failed"
            job.ai_metadata = {"error": str(e)}
            job.completed_at = datetime.utcnow()
            db.commit()
        return {"status": "error", "error": str(e)}
    finally:
        db.close()

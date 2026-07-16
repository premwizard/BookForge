from app.workers.celery_app import celery_app
from app.database.session import SessionLocal
from app.services.ai.service import AIService
from app.models.ai import AIJob
import uuid

@celery_app.task(bind=True, name="app.workers.ai_tasks.analyze_document_task")
def analyze_document_task(self, job_id: str):
    """
    Celery task to run the AI document analysis in the background.
    """
    db = SessionLocal()
    try:
        # Update Celery Task ID in DB
        job = db.query(AIJob).filter(AIJob.id == uuid.UUID(job_id)).first()
        if job:
            job.celery_task_id = self.request.id
            db.commit()
            
            # Run the AI Service Pipeline
            ai_service = AIService(db)
            ai_service.process_document(job.id)
            
    except Exception as e:
        db.rollback()
        # Optionally log the exception here
        raise e
    finally:
        db.close()

from app.workers.celery_app import celery_app
from app.database.session import SessionLocal
from app.services.validation.rule_engine import RuleEngine
from app.models.validation import ValidationRun, QualityScore
import uuid
from datetime import datetime, timezone

@celery_app.task(bind=True, name="app.workers.validation_tasks.run_validation_task")
def run_validation_task(self, run_id: str, document_id: str):
    """
    Celery task to run the validation engine in the background.
    """
    db = SessionLocal()
    try:
        run = db.query(ValidationRun).filter(ValidationRun.id == uuid.UUID(run_id)).first()
        if run:
            run.celery_task_id = self.request.id
            run.status = "Running"
            run.started_at = datetime.now(timezone.utc)
            db.commit()
            
            engine = RuleEngine(db)
            issues = engine.run_validation(run_id, document_id)
            
            # Save issues
            for issue in issues:
                db.add(issue)
                
            # Calculate mock quality score
            score = QualityScore(
                run_id=run.id,
                formatting_score=95,
                layout_score=90,
                typography_score=85,
                structure_score=100,
                accessibility_score=80,
                publishing_readiness_score=92,
                overall_quality_score=90,
                score_details={
                    "typography": {"reason": "Minor orphan headings", "confidence": 0.9}
                }
            )
            db.add(score)
            
            run.status = "Completed"
            run.completed_at = datetime.now(timezone.utc)
            db.commit()
            
    except Exception as e:
        db.rollback()
        if run:
            run.status = "Failed"
            run.error_message = str(e)
            run.completed_at = datetime.now(timezone.utc)
            db.commit()
        raise e
    finally:
        db.close()

from celery import shared_task
from uuid import UUID
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.services.template_service import process_template_version

@shared_task
def extract_styles_from_template_task(template_version_id: str):
    db: Session = SessionLocal()
    try:
        process_template_version(db, UUID(template_version_id))
    except Exception as e:
        print(f"Error extracting styles: {e}")
    finally:
        db.close()

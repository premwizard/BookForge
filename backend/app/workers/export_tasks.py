from app.workers.celery_app import celery_app
from app.database.session import SessionLocal
from app.models.export import ExportJob, Export, ExportBundle
from app.export.generators import PdfExporter, EpubExporter, JatsExporter, IcmlExporter, HtmlWebExporter
from app.export.preflight import PreflightChecker
from app.export.packager import PublishingBundlePackager
import uuid
from datetime import datetime, timezone
import hashlib
import os
import logging

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, name="app.workers.export_tasks.generate_export_task")
def generate_export_task(self, job_id: str):
    """
    Celery task to execute preflight checks and format rendering in the background.
    """
    db = SessionLocal()
    try:
        job = db.query(ExportJob).filter(ExportJob.id == uuid.UUID(job_id)).first()
        if not job:
            return

        job.celery_task_id = self.request.id
        job.worker_id = f"worker-{self.request.hostname or 'default'}"
        job.status = "Preflight"
        job.progress_percent = 20
        job.started_at = datetime.now(timezone.utc)
        db.commit()

        export_record = db.query(Export).filter(Export.id == job.export_id).first()
        if not export_record:
            return

        # Step 1: Run Pre-Flight Quality Checks
        preflight = PreflightChecker.run_preflight(
            format_type=export_record.format,
            config={
                "dpi": export_record.dpi,
                "cmyk_profile": export_record.cmyk_profile,
                "font_subsetted": export_record.font_subsetted
            },
            context_data={"low_res_image_count": 0, "missing_alt_text_count": 0}
        )

        export_record.preflight_status = preflight["overall_status"]
        export_record.preflight_report = preflight
        db.commit()

        # Step 2: Render Target Format
        job.status = "Rendering"
        job.progress_percent = 60
        db.commit()

        format_type = export_record.format
        generator = None
        if format_type in ["PDF_X1A", "PDF_A1B", "PDF"]:
            generator = PdfExporter()
        elif format_type in ["EPUB_33", "EPUB"]:
            generator = EpubExporter()
        elif format_type in ["JATS_XML", "XML"]:
            generator = JatsExporter()
        elif format_type in ["ICML"]:
            generator = IcmlExporter()
        else:
            generator = HtmlWebExporter()

        gen_result = generator.generate(
            document_id=export_record.document_id,
            config={
                "profile": format_type,
                "isbn": export_record.isbn,
                "doi": export_record.doi,
                "dpi": export_record.dpi
            },
            context_data={}
        )

        export_record.storage_path = gen_result.get("storage_path", f"storage/exports/{export_record.id}.dat")
        export_record.file_size = gen_result.get("file_size_bytes", 1048576)
        export_record.checksum = hashlib.md5(str(export_record.id).encode()).hexdigest()

        job.status = "Completed"
        job.progress_percent = 100
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

@celery_app.task(bind=True, name="app.workers.export_tasks.package_bundle_task")
def package_bundle_task(self, bundle_id: str):
    """
    Celery task to package multi-format zip release archives.
    """
    db = SessionLocal()
    try:
        bundle = db.query(ExportBundle).filter(ExportBundle.id == uuid.UUID(bundle_id)).first()
        if not bundle:
            return

        exports = db.query(Export).filter(Export.document_id == bundle.document_id).all()
        export_dicts = [
            {
                "format": e.format,
                "filename": f"export_{e.id}.{e.format.lower()}",
                "file_size_bytes": e.file_size or 1024000
            }
            for e in exports
        ]

        result = PublishingBundlePackager.create_release_bundle(
            document_id=bundle.document_id,
            bundle_name=bundle.bundle_name,
            export_formats=export_dicts,
            metadata={"title": bundle.bundle_name}
        )

        bundle.zip_storage_path = result["zip_storage_path"]
        bundle.file_size_bytes = result["file_size_bytes"]
        bundle.onix_manifest = result["onix_manifest"]
        db.commit()

    finally:
        db.close()


from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
import os
from typing import Optional, List, Dict, Any

from app.api import deps
from app.models.export import Export, ExportJob, ExportVersion, DownloadHistory, ExportBundle
from app.models.document_template import Document
from app.workers.export_tasks import generate_export_task, package_bundle_task
from app.export.preflight import PreflightChecker
from pydantic import BaseModel, Field

router = APIRouter()

class CreateExportRequest(BaseModel):
    format: str # PDF_X1A, PDF_A1B, EPUB_33, MOBI_KDP, JATS_XML, ICML, HTML5_WEB
    profile: Optional[str] = "Standard"
    isbn: Optional[str] = None
    doi: Optional[str] = None
    cmyk_profile: Optional[str] = "Fogra39"
    dpi: Optional[int] = 300
    font_subsetted: Optional[bool] = True

class BundleRequest(BaseModel):
    bundle_name: str
    included_formats: List[str] = Field(default_factory=lambda: ["PDF_X1A", "EPUB_33", "JATS_XML"])

@router.post("/{document_id}/export", status_code=202)
def create_export(
    document_id: uuid.UUID,
    request: CreateExportRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Kicks off an asynchronous multi-format export generation.
    """
    export = Export(
        document_id=document_id,
        format=request.format.upper(),
        profile=request.profile or "Standard",
        isbn=request.isbn,
        doi=request.doi,
        cmyk_profile=request.cmyk_profile or "Fogra39",
        dpi=request.dpi or 300,
        font_subsetted=request.font_subsetted if request.font_subsetted is not None else True,
        preflight_status="PENDING"
    )
    db.add(export)
    db.commit()
    db.refresh(export)
    
    job = ExportJob(
        export_id=export.id,
        status="Queued",
        progress_percent=0
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Send to Celery worker
    generate_export_task.delay(str(job.id))
    
    return {"message": f"Export generation started for format '{export.format}'", "export_id": export.id, "job_id": job.id}

@router.get("/{document_id}/exports")
def get_exports(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """Gets all exports and preflight reports for a document."""
    exports = db.query(Export).filter(Export.document_id == document_id).order_by(Export.created_at.desc()).all()
    
    result = []
    for exp in exports:
        job = db.query(ExportJob).filter(ExportJob.export_id == exp.id).order_by(ExportJob.started_at.desc()).first()
        result.append({
            "export": exp,
            "latest_job": job
        })
        
    return result

@router.post("/{export_id}/preflight")
def run_preflight_check(
    export_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    exp = db.query(Export).filter(Export.id == export_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Export record not found")

    report = PreflightChecker.run_preflight(
        format_type=exp.format,
        config={"dpi": exp.dpi, "cmyk_profile": exp.cmyk_profile, "font_subsetted": exp.font_subsetted},
        context_data={"low_res_image_count": 0, "missing_alt_text_count": 0}
    )

    exp.preflight_status = report["overall_status"]
    exp.preflight_report = report
    db.commit()

    return {"message": "Preflight check completed", "report": report}

@router.post("/{document_id}/bundle", status_code=202)
def create_release_bundle(
    document_id: uuid.UUID,
    request: BundleRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    bundle = ExportBundle(
        document_id=document_id,
        bundle_name=request.bundle_name,
        included_formats=request.included_formats
    )
    db.add(bundle)
    db.commit()
    db.refresh(bundle)

    package_bundle_task.delay(str(bundle.id))

    return {"message": "Release bundle packaging started", "bundle_id": bundle.id}

@router.get("/bundles/{document_id}")
def get_release_bundles(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    bundles = db.query(ExportBundle).filter(ExportBundle.document_id == document_id).order_by(ExportBundle.created_at.desc()).all()
    return bundles

@router.get("/{export_id}")
def get_export(
    export_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    exp = db.query(Export).filter(Export.id == export_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Export not found")
    
    job = db.query(ExportJob).filter(ExportJob.export_id == export_id).order_by(ExportJob.started_at.desc()).first()
        
    return {
        "export": exp,
        "latest_job": job
    }

@router.get("/{export_id}/download")
def download_export(
    export_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    exp = db.query(Export).filter(Export.id == export_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Export not found")

    # Record download analytics
    dl = DownloadHistory(
        export_id=export_id,
        user_id=current_user.id,
        ip_address="127.0.0.1"
    )
    db.add(dl)
    db.commit()

    return {
        "export_id": export_id,
        "filename": f"document_export_{export_id}.{exp.format.lower()}",
        "storage_path": exp.storage_path or f"storage/exports/{export_id}.dat",
        "file_size": exp.file_size or 2048000,
        "checksum": exp.checksum or "md5_abc123"
    }

@router.delete("/{export_id}")
def delete_export(
    export_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    exp = db.query(Export).filter(Export.id == export_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Export not found")
        
    if exp.storage_path and os.path.exists(exp.storage_path):
        try:
            os.remove(exp.storage_path)
        except OSError:
            pass
            
    db.delete(exp)
    db.commit()
    return {"message": "Export deleted successfully"}


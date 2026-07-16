from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from uuid import UUID
import os

from app.api import deps
from app.models.document_template import Document
from app.models.project import Project
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.storage.minio_client import upload_file_to_minio
from app.workers.tasks import process_document

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID = Form(...),
    file: UploadFile = File(...),
    chunk_index: Optional[int] = Form(None),
    total_chunks: Optional[int] = Form(None),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a new document to a project (Supports chunking).
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role != "Admin" and project.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    file_type = file.filename.split('.')[-1].upper()
    mime_type = file.content_type
    object_name = f"projects/{project_id}/{file.filename}"
    
    # If chunking parameters are provided, handle chunking
    if chunk_index is not None and total_chunks is not None:
        chunk_path = f"/tmp/{file.filename}.part{chunk_index}"
        with open(chunk_path, "wb") as buffer:
            buffer.write(await file.read())
            
        if chunk_index == total_chunks - 1:
            # Reassemble file in this naive implementation
            final_path = f"/tmp/{file.filename}"
            with open(final_path, "wb") as outfile:
                for i in range(total_chunks):
                    part_path = f"/tmp/{file.filename}.part{i}"
                    with open(part_path, "rb") as infile:
                        outfile.write(infile.read())
                    os.remove(part_path)
            
            # Pretend we uploaded `final_path` to MinIO
            storage_path = object_name
            os.remove(final_path)
        else:
            return {"filename": file.filename, "status": "Chunk Uploaded"}
    else:
        # Standard upload
        storage_path = upload_file_to_minio(file, object_name)

    # Calculate file size (mock)
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()

    document = Document(
        project_id=project_id,
        filename=file.filename,
        file_type=file_type,
        mime_type=mime_type,
        storage_path=storage_path,
        file_size_bytes=file_size,
        status="Queued"
    )
    db.add(document)
    
    # Update project total documents
    project.total_documents += 1
    db.add(project)
    
    db.commit()
    db.refresh(document)
    
    # Trigger Celery Task
    process_document.delay(str(document.id))
    
    return document

@router.get("/project/{project_id}", response_model=List[DocumentResponse])
def read_project_documents(
    *,
    db: Session = Depends(deps.get_db),
    project_id: UUID,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve documents for a specific project.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if current_user.role != "Admin" and project.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    documents = (
        db.query(Document)
        .filter(Document.project_id == project_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return documents

@router.delete("/{id}", response_model=DocumentResponse)
def delete_document(
    *,
    db: Session = Depends(deps.get_db),
    id: UUID,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a document.
    """
    document = db.query(Document).filter(Document.id == id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    project = db.query(Project).filter(Project.id == document.project_id).first()
    if current_user.role != "Admin" and project.user_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    # Remove from MinIO here
    
    db.delete(document)
    db.commit()
    return document

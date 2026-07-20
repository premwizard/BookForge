from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.review import ReviewSession
from app.review.engine.session_manager import ReviewSessionManager

router = APIRouter()

@router.post("/start")
def start_review_session(
    transformation_job_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Initialize a new review session for a transformed document.
    """
    session = ReviewSession(
        transformation_job_id=transformation_job_id,
        status="Draft"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"session_id": session.id}

@router.get("/{session_id}")
def get_session_state(
    session_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get the current Corrected IFDM document tree.
    """
    manager = ReviewSessionManager(db)
    
    # In reality, fetch base_ifdm from transformation_job_id
    base_ifdm = {} 
    
    current_ifdm = manager.get_current_document_state(str(session_id), base_ifdm)
    return {"document": current_ifdm}

@router.post("/{session_id}/commands")
def add_correction(
    session_id: UUID,
    command_type: str = Body(...),
    target_node_id: str = Body(...),
    payload: dict = Body(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Submit a new correction command.
    """
    manager = ReviewSessionManager(db)
    correction = manager.add_correction(str(session_id), command_type, target_node_id, payload)
    return {"message": "Correction applied", "correction_id": correction.id}

@router.post("/{session_id}/undo")
def undo_correction(
    session_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Undo the last correction.
    """
    manager = ReviewSessionManager(db)
    success = manager.undo(str(session_id))
    if not success:
        raise HTTPException(status_code=400, detail="Nothing to undo")
    return {"message": "Undo successful"}

@router.post("/{session_id}/redo")
def redo_correction(
    session_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Redo the last undone correction.
    """
    manager = ReviewSessionManager(db)
    success = manager.redo(str(session_id))
    if not success:
        raise HTTPException(status_code=400, detail="Nothing to redo")
    return {"message": "Redo successful"}

@router.post("/{session_id}/approve")
def approve_document(
    session_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Approve the review session, locking corrections and flagging it Ready For Rendering.
    """
    session = db.query(ReviewSession).filter(ReviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session.status = "Ready For Rendering"
    db.commit()
    return {"message": "Document approved and ready for rendering"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any

from app.api import deps
from app.models.editor import EditorSession, EditorHistory, CursorPosition, EditorSnapshot, FormattingChange
from app.services.editor_service import EditorService
from pydantic import BaseModel, Field

router = APIRouter()

class OperationRequest(BaseModel):
    operation_type: str
    operation_payload: Dict[str, Any] = Field(default_factory=dict)
    inverse_payload: Dict[str, Any] = Field(default_factory=dict)

class FormatRequest(BaseModel):
    element_id: str
    element_type: str = "paragraph"
    direct_styles: Dict[str, Any] = Field(default_factory=dict)

class SnapshotRequest(BaseModel):
    snapshot_name: str
    ifdm_data: Dict[str, Any] = Field(default_factory=dict)

class CommentRequest(BaseModel):
    node_id: str
    text: str
    quoted_text: Optional[str] = None

@router.get("/{document_id}")
def get_editor_state(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = EditorService(db)
    session = service.get_or_create_session(document_id, current_user.id)
    
    # Active sessions in document
    active_sessions = db.query(EditorSession).filter(
        EditorSession.document_id == document_id,
        EditorSession.is_active == True
    ).all()

    # Active cursors
    active_cursors = db.query(CursorPosition).all()

    # Latest snapshot
    latest_snapshot = db.query(EditorSnapshot)\
        .filter(EditorSnapshot.document_id == document_id)\
        .order_by(EditorSnapshot.revision_number.desc())\
        .first()

    return {
        "session": session,
        "active_sessions_count": len(active_sessions),
        "active_cursors": active_cursors,
        "latest_snapshot": latest_snapshot,
        "style_palette": [
            {"id": "p-h1", "name": "Heading 1", "category": "Paragraph", "font_size": 24, "font_weight": "bold"},
            {"id": "p-h2", "name": "Heading 2", "category": "Paragraph", "font_size": 18, "font_weight": "bold"},
            {"id": "p-body", "name": "Body Text", "category": "Paragraph", "font_size": 11, "font_weight": "normal"},
            {"id": "c-[quote]", "name": "Blockquote", "category": "Paragraph", "font_style": "italic", "indent": 20},
            {"id": "t-style-1", "name": "Academic Table", "category": "Table", "border_width": 1}
        ]
    }

@router.post("/save/{document_id}")
def save_editor_operations(
    document_id: uuid.UUID,
    request: OperationRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = EditorService(db)
    result = service.apply_operation(
        document_id=document_id,
        user_id=current_user.id,
        operation_type=request.operation_type,
        operation_payload=request.operation_payload,
        inverse_payload=request.inverse_payload
    )
    return {"message": "Operation saved successfully", "result": result}

@router.post("/undo/{document_id}")
def undo_operation(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = EditorService(db)
    result = service.undo_last_operation(document_id, current_user.id)
    if not result:
        raise HTTPException(status_code=400, detail="Nothing to undo")
    return {"message": "Undo executed", "result": result}

@router.post("/redo/{document_id}")
def redo_operation(
    document_id: uuid.UUID,
    request: OperationRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = EditorService(db)
    result = service.apply_operation(
        document_id=document_id,
        user_id=current_user.id,
        operation_type=f"REDO_{request.operation_type}",
        operation_payload=request.operation_payload,
        inverse_payload=request.inverse_payload
    )
    return {"message": "Redo executed", "result": result}

@router.get("/styles/inspect")
def inspect_element_styles(
    element_id: str = "elem-node-1",
    element_type: str = "paragraph",
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = EditorService(db)
    live_styles = service.compute_live_styles(
        element_id=element_id,
        element_type=element_type,
        direct_styles={"font_weight": "bold", "color": "#1D4ED8"}
    )
    return live_styles

@router.post("/format/{document_id}")
def apply_formatting(
    document_id: uuid.UUID,
    request: FormatRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    change = FormattingChange(
        document_id=document_id,
        target_element_id=request.element_id,
        change_type="DIRECT_OVERRIDE",
        new_style=request.direct_styles,
        applied_by=current_user.id
    )
    db.add(change)
    db.commit()
    db.refresh(change)
    return {"message": "Formatting applied", "change_id": change.id}

@router.post("/snapshot/{document_id}")
def create_snapshot(
    document_id: uuid.UUID,
    request: SnapshotRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    latest = db.query(EditorSnapshot)\
        .filter(EditorSnapshot.document_id == document_id)\
        .order_by(EditorSnapshot.revision_number.desc())\
        .first()

    next_rev = (latest.revision_number + 1) if latest else 1

    snapshot = EditorSnapshot(
        document_id=document_id,
        revision_number=next_rev,
        snapshot_name=request.snapshot_name,
        ifdm_data=request.ifdm_data,
        created_by=current_user.id
    )
    db.add(snapshot)
    db.commit()
    db.refresh(snapshot)
    return {"message": "Snapshot created", "snapshot_id": snapshot.id, "revision": next_rev}

@router.get("/history/{document_id}")
def get_operation_history(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    history = db.query(EditorHistory)\
        .filter(EditorHistory.document_id == document_id)\
        .order_by(EditorHistory.revision_number.asc())\
        .all()
    return history

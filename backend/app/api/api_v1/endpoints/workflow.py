from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional

from app.api import deps
from app.models.workflow import DocumentWorkflowStatus, WorkflowState, WorkflowTransition, WorkflowTemplate, Approval
from app.services.collaboration.workflow_engine import WorkflowEngine

router = APIRouter()

@router.post("/start")
def start_workflow(
    document_id: uuid.UUID,
    template_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """Initializes a document into a workflow."""
    # Mock logic to find the first state of the given template
    first_state = db.query(WorkflowState).filter(WorkflowState.template_id == template_id).order_by(WorkflowState.order.asc()).first()
    if not first_state:
        raise HTTPException(status_code=400, detail="Invalid workflow template or empty states.")
        
    engine = WorkflowEngine(db)
    try:
        status = engine.initialize_workflow(document_id, first_state.id, current_user.id)
        return {"message": "Workflow initialized", "status_id": status.id, "current_state": first_state.name}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/transition")
def transition_workflow(
    document_id: uuid.UUID,
    target_state_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """Transitions a document to the next workflow state."""
    engine = WorkflowEngine(db)
    try:
        status = engine.transition_document(document_id, target_state_id, current_user.id)
        return {"message": "Transition successful", "current_state_id": status.current_state_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status/{document_id}")
def get_workflow_status(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    status = db.query(DocumentWorkflowStatus).filter(DocumentWorkflowStatus.document_id == document_id).first()
    if not status:
        return None
    state = db.query(WorkflowState).filter(WorkflowState.id == status.current_state_id).first()
    return {
        "status": status,
        "state": state
    }

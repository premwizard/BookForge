import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.workflow import WorkflowState, WorkflowTransition, DocumentWorkflowStatus, Approval
from app.models.document_template import Document
from app.models.audit import ActivityLog, Notification

class WorkflowEngine:
    """Handles workflow state transitions, approvals, and activity logging."""
    
    def __init__(self, db: Session):
        self.db = db

    def initialize_workflow(self, document_id: uuid.UUID, state_id: uuid.UUID, user_id: uuid.UUID) -> DocumentWorkflowStatus:
        """Starts a document on a workflow."""
        status = DocumentWorkflowStatus(
            document_id=document_id,
            current_state_id=state_id,
            updated_by=user_id
        )
        self.db.add(status)
        self._log_activity(document_id, user_id, "WORKFLOW_INITIALIZED", None, str(state_id))
        self.db.commit()
        return status

    def transition_document(self, document_id: uuid.UUID, target_state_id: uuid.UUID, user_id: uuid.UUID) -> DocumentWorkflowStatus:
        """Moves a document to a new state if rules allow."""
        status = self.db.query(DocumentWorkflowStatus).filter(DocumentWorkflowStatus.document_id == document_id).first()
        if not status:
            raise ValueError("Document is not in a workflow.")
            
        current_state_id = status.current_state_id
        
        # Check transition validity
        transition = self.db.query(WorkflowTransition).filter(
            WorkflowTransition.from_state_id == current_state_id,
            WorkflowTransition.to_state_id == target_state_id
        ).first()
        
        if not transition:
            raise ValueError("Invalid workflow transition.")
            
        # Check approvals if required by current state before leaving
        current_state = self.db.query(WorkflowState).filter(WorkflowState.id == current_state_id).first()
        if current_state and current_state.requires_approval:
            approvals = self.db.query(Approval).filter(
                Approval.document_id == document_id,
                Approval.state_id == current_state_id,
                Approval.status == "Approved"
            ).all()
            if not approvals:
                raise ValueError(f"State '{current_state.name}' requires approval before transitioning.")

        # Execute transition
        old_state_id = current_state_id
        status.current_state_id = target_state_id
        status.updated_by = user_id
        
        self._log_activity(document_id, user_id, "STATE_CHANGED", str(old_state_id), str(target_state_id))
        self.db.commit()
        
        return status

    def approve_document(self, document_id: uuid.UUID, state_id: uuid.UUID, user_id: uuid.UUID, notes: Optional[str] = None):
        """Records an approval for a document at a specific state."""
        approval = Approval(
            document_id=document_id,
            state_id=state_id,
            user_id=user_id,
            status="Approved",
            notes=notes
        )
        self.db.add(approval)
        self._log_activity(document_id, user_id, "DOCUMENT_APPROVED", None, str(state_id))
        self.db.commit()
        return approval

    def _log_activity(self, document_id: uuid.UUID, user_id: uuid.UUID, action: str, old_val: Optional[str], new_val: Optional[str]):
        """Internal helper to track audit logs."""
        log = ActivityLog(
            document_id=document_id,
            user_id=user_id,
            action=action,
            old_value={"val": old_val} if old_val else None,
            new_value={"val": new_val} if new_val else None
        )
        self.db.add(log)

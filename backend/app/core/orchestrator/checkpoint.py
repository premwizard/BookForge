from sqlalchemy.orm import Session
from app.models.workflow import WorkflowCheckpoint, WorkflowInstance, WorkflowNode, WorkflowExecution
from typing import Dict, Any, List
import uuid

class CheckpointManager:
    def __init__(self, db: Session):
        self.db = db

    def save_checkpoint(self, instance_id: uuid.UUID, node_id: uuid.UUID, state_data: Dict[str, Any], stage_name: str = "Stage Checkpoint"):
        checkpoint = WorkflowCheckpoint(
            instance_id=instance_id,
            node_id=node_id,
            stage_name=stage_name,
            state_data=state_data
        )
        self.db.add(checkpoint)
        self.db.commit()
        self.db.refresh(checkpoint)
        return checkpoint

    def get_latest_checkpoint(self, instance_id: uuid.UUID):
        return self.db.query(WorkflowCheckpoint)\
            .filter(WorkflowCheckpoint.instance_id == instance_id)\
            .order_by(WorkflowCheckpoint.created_at.desc())\
            .first()

    def get_checkpoints_for_instance(self, instance_id: uuid.UUID) -> List[WorkflowCheckpoint]:
        return self.db.query(WorkflowCheckpoint)\
            .filter(WorkflowCheckpoint.instance_id == instance_id)\
            .order_by(WorkflowCheckpoint.created_at.asc())\
            .all()

    def restore_from_checkpoint(self, instance_id: uuid.UUID, checkpoint_id: uuid.UUID):
        checkpoint = self.db.query(WorkflowCheckpoint).filter(WorkflowCheckpoint.id == checkpoint_id).first()
        if not checkpoint:
            raise ValueError("Checkpoint not found")
        
        instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == instance_id).first()
        if instance:
            instance.context_data = checkpoint.state_data
            instance.current_node_id = checkpoint.node_id
            instance.status = "RUNNING"
            
            # Reset workflow executions downstream of this node
            self.db.query(WorkflowExecution).filter(
                WorkflowExecution.instance_id == instance_id,
                WorkflowExecution.created_at > checkpoint.created_at
            ).delete()
            
            self.db.commit()
        return checkpoint


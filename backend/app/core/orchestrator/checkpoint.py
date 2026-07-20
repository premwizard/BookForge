from sqlalchemy.orm import Session
from app.models.workflow import WorkflowCheckpoint, WorkflowInstance
from typing import Dict, Any
import uuid

class CheckpointManager:
    def __init__(self, db: Session):
        self.db = db

    def save_checkpoint(self, instance_id: uuid.UUID, node_id: uuid.UUID, state_data: Dict[str, Any]):
        checkpoint = WorkflowCheckpoint(
            instance_id=instance_id,
            node_id=node_id,
            state_data=state_data
        )
        self.db.add(checkpoint)
        self.db.commit()
        return checkpoint

    def get_latest_checkpoint(self, instance_id: uuid.UUID):
        return self.db.query(WorkflowCheckpoint)\
            .filter(WorkflowCheckpoint.instance_id == instance_id)\
            .order_by(WorkflowCheckpoint.created_at.desc())\
            .first()

    def restore_from_checkpoint(self, instance_id: uuid.UUID, checkpoint_id: uuid.UUID):
        checkpoint = self.db.query(WorkflowCheckpoint).filter(WorkflowCheckpoint.id == checkpoint_id).first()
        if not checkpoint:
            raise ValueError("Checkpoint not found")
        
        instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == instance_id).first()
        if instance:
            instance.context_data = checkpoint.state_data
            instance.current_node_id = checkpoint.node_id
            self.db.commit()
        return checkpoint

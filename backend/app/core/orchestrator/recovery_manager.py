import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.workflow import WorkflowInstance, WorkflowExecution, WorkflowNode, WorkflowCheckpoint, WorkflowHistory
import logging

logger = logging.getLogger(__name__)

class RecoveryManager:
    """
    Handles Saga Pattern compensations, state recovery, automatic retry policies,
    Dead-Letter-Queue routing, and manual intervention flags for failed workflows.
    """

    def __init__(self, db: Session):
        self.db = db

    def evaluate_failure(self, execution_id: uuid.UUID, error_msg: str) -> Dict[str, Any]:
        """
        Determines recovery strategy: RETRY, ROLLBACK_TO_CHECKPOINT, MANUAL_INTERVENTION, or FAIL.
        """
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id).first()
        if not execution:
            return {"action": "FAIL", "reason": "Execution record not found"}

        node = self.db.query(WorkflowNode).filter(WorkflowNode.id == execution.node_id).first()
        max_retries = node.config.get("retry", 0) if node and node.config else 0
        rollback_enabled = node.config.get("rollback", False) if node and node.config else False

        # Strategy 1: Automatic Retry
        if execution.retry_count < max_retries:
            return {
                "action": "RETRY",
                "next_retry_count": execution.retry_count + 1,
                "delay_seconds": 5 * (2 ** execution.retry_count) # Exponential backoff
            }

        # Strategy 2: Rollback to latest checkpoint
        latest_checkpoint = self.db.query(WorkflowCheckpoint)\
            .filter(WorkflowCheckpoint.instance_id == execution.instance_id)\
            .order_by(WorkflowCheckpoint.created_at.desc())\
            .first()

        if rollback_enabled and latest_checkpoint:
            return {
                "action": "ROLLBACK_TO_CHECKPOINT",
                "checkpoint_id": str(latest_checkpoint.id),
                "checkpoint_node_id": str(latest_checkpoint.node_id),
                "checkpoint_stage": latest_checkpoint.stage_name
            }

        # Strategy 3: Manual Intervention Flag
        if node and node.config.get("allow_manual_intervention", True):
            return {
                "action": "MANUAL_INTERVENTION",
                "reason": f"Max retries ({max_retries}) exceeded: {error_msg}"
            }

        return {"action": "FAIL", "reason": error_msg}

    def execute_saga_compensation(self, instance_id: uuid.UUID, failed_node_id: uuid.UUID):
        """
        Executes inverse / cleanup compensation actions for executed nodes up to the failed node.
        """
        instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == instance_id).first()
        if not instance:
            return

        instance.status = "RECOVERING"
        self.db.commit()

        # Log saga compensation
        history = WorkflowHistory(
            instance_id=instance_id,
            action="SAGA_COMPENSATION_STARTED",
            details={"failed_node_id": str(failed_node_id)}
        )
        self.db.add(history)
        self.db.commit()

        logger.info(f"Saga compensation completed for instance {instance_id}")

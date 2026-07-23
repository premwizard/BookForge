from sqlalchemy.orm import Session
from app.models.workflow import WorkflowInstance, WorkflowNode, WorkflowExecution, WorkflowHistory, WorkflowLog, WorkflowMetric, WorkflowCheckpoint
from app.core.orchestrator.dag import DAGProcessor
from app.core.orchestrator.checkpoint import CheckpointManager
from app.core.orchestrator.scheduler import TaskScheduler
from app.core.orchestrator.dispatcher import EngineDispatcher
from app.core.orchestrator.resource_manager import ResourceManager
from app.core.orchestrator.recovery_manager import RecoveryManager
import uuid
from typing import Dict, Any, List
import datetime
import logging

logger = logging.getLogger(__name__)

class WorkflowOrchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.checkpoint_manager = CheckpointManager(db)
        self.dispatcher = EngineDispatcher()
        self.recovery_manager = RecoveryManager(db)

    def start_workflow(self, template_id: uuid.UUID, document_id: uuid.UUID, initial_context: Dict[str, Any] = None, priority: int = 5) -> WorkflowInstance:
        initial_context = initial_context or {}
        instance = WorkflowInstance(
            template_id=template_id,
            document_id=document_id,
            status="RUNNING",
            priority=priority,
            context_data=initial_context
        )
        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)

        self._log_history(instance.id, "STARTED", {"template_id": str(template_id), "priority": priority})
        
        # Trigger first nodes
        self.execute_next_nodes(instance.id)
        
        return instance

    def execute_next_nodes(self, instance_id: uuid.UUID):
        instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == instance_id).first()
        if not instance or instance.status not in ["RUNNING", "RECOVERING"]:
            return

        # Fetch all nodes for template
        nodes = self.db.query(WorkflowNode).filter(WorkflowNode.template_id == instance.template_id).all()
        nodes_dict = {str(n.id): n for n in nodes}
        nodes_data = [
            {
                "id": str(n.id),
                "dependencies": [str(dep) for dep in n.dependencies],
                "engine_type": n.engine_type,
                "conditions": n.conditions,
                "config": n.config,
                "queue_type": n.queue_type,
                "resource_reqs": n.resource_reqs
            } 
            for n in nodes
        ]
        
        dag = DAGProcessor(nodes_data)
        
        # Fetch completed and skipped executions
        completed_executions = self.db.query(WorkflowExecution).filter(
            WorkflowExecution.instance_id == instance_id,
            WorkflowExecution.status == "COMPLETED"
        ).all()
        completed_node_ids = [str(ex.node_id) for ex in completed_executions]
        
        skipped_executions = self.db.query(WorkflowExecution).filter(
            WorkflowExecution.instance_id == instance_id,
            WorkflowExecution.status == "SKIPPED"
        ).all()
        skipped_node_ids = [str(ex.node_id) for ex in skipped_executions]

        # Determine ready nodes
        ready_node_ids = dag.get_ready_nodes(completed_node_ids, skipped_node_ids)
        ready_nodes_data = [n for n in nodes_data if n["id"] in ready_node_ids]

        # Filter runnable vs skippable nodes based on conditions
        runnable_nodes, skippable_nodes = TaskScheduler.filter_runnable_nodes(ready_nodes_data, instance.context_data or {})

        # Handle skippable nodes immediately
        for skippable in skippable_nodes:
            self._record_skipped_node(instance_id, uuid.UUID(skippable["id"]))

        # Active executions
        active_executions = self.db.query(WorkflowExecution).filter(
            WorkflowExecution.instance_id == instance_id,
            WorkflowExecution.status.in_(["PENDING", "RUNNING", "RETRYING"])
        ).all()
        active_node_ids = [str(ex.node_id) for ex in active_executions]

        nodes_to_execute = [n for n in runnable_nodes if n["id"] not in active_node_ids]

        if not nodes_to_execute and not active_node_ids:
            # Check if all non-skipped nodes completed
            all_resolved = len(completed_node_ids) + len(skipped_node_ids) >= len(nodes)
            if all_resolved:
                instance.status = "COMPLETED"
                instance.completed_at = datetime.datetime.now(datetime.timezone.utc)
                self.db.commit()
                self._log_history(instance.id, "COMPLETED", {"total_executed": len(completed_node_ids)})
                return

        from app.workers.workflow_tasks import execute_node_task

        for node_data in nodes_to_execute:
            node_id_uuid = uuid.UUID(node_data["id"])
            node_obj = nodes_dict[node_data["id"]]

            # Allocate resource & queue specs
            res_info = ResourceManager.determine_queue_and_resources(
                node_engine_type=node_data["engine_type"],
                node_config=node_data["config"],
                instance_priority=instance.priority
            )

            execution = WorkflowExecution(
                instance_id=instance_id,
                node_id=node_id_uuid,
                status="PENDING",
                started_at=datetime.datetime.now(datetime.timezone.utc)
            )
            self.db.add(execution)
            self.db.commit()
            self.db.refresh(execution)

            # Dispatch Celery task to determined queue
            target_queue = res_info["queue_type"]
            task = execute_node_task.apply_async(args=[str(execution.id)], queue=target_queue)
            execution.celery_task_id = task.id
            instance.current_node_id = node_id_uuid
            self.db.commit()

    def handle_node_success(self, execution_id: uuid.UUID, output_data: Dict[str, Any]):
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id).first()
        if not execution:
            return

        execution.status = "COMPLETED"
        execution.completed_at = datetime.datetime.now(datetime.timezone.utc)

        # Update instance context
        instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == execution.instance_id).first()
        if instance:
            if instance.context_data is None:
                instance.context_data = {}
            instance.context_data.update(output_data)

        # Check if node is designated as checkpoint
        node = self.db.query(WorkflowNode).filter(WorkflowNode.id == execution.node_id).first()
        if node and node.is_checkpoint:
            self.checkpoint_manager.save_checkpoint(
                instance_id=instance.id,
                node_id=node.id,
                state_data=instance.context_data,
                stage_name=node.name
            )

        self.db.commit()
        self._log_history(instance.id, "NODE_COMPLETED", {"node_id": str(node.id), "node_name": node.name if node else "Node"})
        
        # Calculate execution latency metric
        if execution.started_at and execution.completed_at:
            delta_ms = int((execution.completed_at - execution.started_at).total_seconds() * 1000)
            metric = WorkflowMetric(
                instance_id=instance.id,
                node_id=node.id if node else None,
                metric_name="execution_time_ms",
                metric_value=delta_ms
            )
            self.db.add(metric)
            self.db.commit()

        # Trigger next downstream nodes
        self.execute_next_nodes(instance.id)

    def handle_node_failure(self, execution_id: uuid.UUID, error: str):
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id).first()
        if not execution:
            return

        recovery_decision = self.recovery_manager.evaluate_failure(execution_id, error)
        action = recovery_decision.get("action")

        node = self.db.query(WorkflowNode).filter(WorkflowNode.id == execution.node_id).first()
        instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == execution.instance_id).first()

        if action == "RETRY":
            execution.status = "RETRYING"
            execution.retry_count = recovery_decision["next_retry_count"]
            execution.error_message = error
            self.db.commit()

            from app.workers.workflow_tasks import execute_node_task
            target_queue = node.queue_type if node else "worker"
            task = execute_node_task.apply_async(args=[str(execution.id)], queue=target_queue, countdown=recovery_decision["delay_seconds"])
            execution.celery_task_id = task.id
            self.db.commit()

            self._log_history(execution.instance_id, "NODE_RETRYING", {"node_id": str(execution.node_id), "retry": execution.retry_count})

        elif action == "ROLLBACK_TO_CHECKPOINT":
            checkpoint_id = uuid.UUID(recovery_decision["checkpoint_id"])
            self.checkpoint_manager.restore_from_checkpoint(instance.id, checkpoint_id)
            self._log_history(instance.id, "CHECKPOINT_RESTORED", {"checkpoint_id": str(checkpoint_id)})
            self.execute_next_nodes(instance.id)

        else:
            execution.status = "FAILED"
            execution.error_message = error
            if instance:
                instance.status = "FAILED"

            self.db.commit()
            self._log_history(execution.instance_id, "WORKFLOW_FAILED", {"node_id": str(execution.node_id), "error": error})

    def _record_skipped_node(self, instance_id: uuid.UUID, node_id: uuid.UUID):
        existing = self.db.query(WorkflowExecution).filter(
            WorkflowExecution.instance_id == instance_id,
            WorkflowExecution.node_id == node_id
        ).first()
        if not existing:
            execution = WorkflowExecution(
                instance_id=instance_id,
                node_id=node_id,
                status="SKIPPED",
                completed_at=datetime.datetime.now(datetime.timezone.utc)
            )
            self.db.add(execution)
            self.db.commit()

    def _log_history(self, instance_id: uuid.UUID, action: str, details: Dict[str, Any]):
        history = WorkflowHistory(
            instance_id=instance_id,
            action=action,
            details=details
        )
        self.db.add(history)
        self.db.commit()


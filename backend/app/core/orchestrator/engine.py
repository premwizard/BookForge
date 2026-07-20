from sqlalchemy.orm import Session
from app.models.workflow import WorkflowInstance, WorkflowNode, WorkflowExecution, WorkflowHistory
from app.core.orchestrator.dag import DAGProcessor
from app.core.orchestrator.checkpoint import CheckpointManager
import uuid
from typing import Dict, Any

class WorkflowOrchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.checkpoint_manager = CheckpointManager(db)

    def start_workflow(self, template_id: uuid.UUID, document_id: uuid.UUID, initial_context: Dict[str, Any]) -> WorkflowInstance:
        instance = WorkflowInstance(
            template_id=template_id,
            document_id=document_id,
            status="RUNNING",
            context_data=initial_context
        )
        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)

        self._log_history(instance.id, "STARTED", {"template_id": str(template_id)})
        
        # Trigger first nodes
        self.execute_next_nodes(instance.id)
        
        return instance

    def execute_next_nodes(self, instance_id: uuid.UUID):
        instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == instance_id).first()
        if not instance or instance.status != "RUNNING":
            return

        # Fetch all nodes for template
        nodes = self.db.query(WorkflowNode).filter(WorkflowNode.template_id == instance.template_id).all()
        nodes_data = [
            {"id": n.id, "dependencies": n.dependencies, "engine_type": n.engine_type, "config": n.config} 
            for n in nodes
        ]
        
        dag = DAGProcessor(nodes_data)
        
        # Fetch completed executions
        completed_executions = self.db.query(WorkflowExecution).filter(
            WorkflowExecution.instance_id == instance_id,
            WorkflowExecution.status == "COMPLETED"
        ).all()
        
        completed_node_ids = [ex.node_id for ex in completed_executions]
        
        # Determine ready nodes
        ready_nodes = dag.get_ready_nodes(completed_node_ids)
        
        # Filter out nodes already running/pending/failed
        active_executions = self.db.query(WorkflowExecution).filter(
            WorkflowExecution.instance_id == instance_id,
            WorkflowExecution.status.in_(["PENDING", "RUNNING", "RETRYING"])
        ).all()
        active_node_ids = [ex.node_id for ex in active_executions]
        
        nodes_to_execute = [n for n in ready_nodes if n not in active_node_ids]
        
        if not nodes_to_execute and not active_node_ids:
            # Workflow completed
            instance.status = "COMPLETED"
            self.db.commit()
            self._log_history(instance.id, "COMPLETED", {})
            return
            
        from app.workers.workflow_tasks import execute_node_task
        
        for node_id in nodes_to_execute:
            execution = WorkflowExecution(
                instance_id=instance_id,
                node_id=node_id,
                status="PENDING"
            )
            self.db.add(execution)
            self.db.commit()
            self.db.refresh(execution)
            
            # Dispatch to Celery
            task = execute_node_task.apply_async(args=[str(execution.id)])
            execution.celery_task_id = task.id
            self.db.commit()

    def handle_node_success(self, execution_id: uuid.UUID, output_data: Dict[str, Any]):
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id).first()
        if not execution:
            return
            
        execution.status = "COMPLETED"
        
        # Update instance context
        instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == execution.instance_id).first()
        if instance:
            if instance.context_data is None:
                instance.context_data = {}
            instance.context_data.update(output_data)
            
        # Check if node is checkpoint
        node = self.db.query(WorkflowNode).filter(WorkflowNode.id == execution.node_id).first()
        if node and node.is_checkpoint:
            self.checkpoint_manager.save_checkpoint(instance.id, node.id, instance.context_data)
            
        self.db.commit()
        
        self._log_history(instance.id, "NODE_COMPLETED", {"node_id": str(node.id)})
        
        # Trigger next
        self.execute_next_nodes(instance.id)

    def handle_node_failure(self, execution_id: uuid.UUID, error: str):
        execution = self.db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id).first()
        if not execution:
            return
            
        node = self.db.query(WorkflowNode).filter(WorkflowNode.id == execution.node_id).first()
        max_retries = node.config.get("retry", 0) if node and node.config else 0
        
        if execution.retry_count < max_retries:
            execution.status = "RETRYING"
            execution.retry_count += 1
            execution.error_message = error
            self.db.commit()
            
            from app.workers.workflow_tasks import execute_node_task
            task = execute_node_task.apply_async(args=[str(execution.id)])
            execution.celery_task_id = task.id
            self.db.commit()
            
            self._log_history(execution.instance_id, "NODE_RETRYING", {"node_id": str(node.id), "retry": execution.retry_count})
        else:
            execution.status = "FAILED"
            execution.error_message = error
            
            instance = self.db.query(WorkflowInstance).filter(WorkflowInstance.id == execution.instance_id).first()
            if instance:
                instance.status = "FAILED"
                
            self.db.commit()
            self._log_history(execution.instance_id, "WORKFLOW_FAILED", {"node_id": str(node.id), "error": error})

    def _log_history(self, instance_id: uuid.UUID, action: str, details: Dict[str, Any]):
        history = WorkflowHistory(
            instance_id=instance_id,
            action=action,
            details=details
        )
        self.db.add(history)
        self.db.commit()

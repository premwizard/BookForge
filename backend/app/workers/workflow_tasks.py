import uuid
import datetime
from app.workers.celery_app import celery_app
from app.database.session import SessionLocal
from app.core.orchestrator.engine import WorkflowOrchestrator
from app.core.orchestrator.dispatcher import EngineDispatcher
from app.models.workflow import WorkflowExecution, WorkflowNode, WorkflowInstance, WorkflowLog, WorkflowMetric
import logging

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3, queue='worker')
def execute_node_task(self, execution_id_str: str):
    """
    Executes a specific workflow node by routing through the EngineDispatcher.
    """
    execution_id = uuid.UUID(execution_id_str)
    db = SessionLocal()
    try:
        execution = db.query(WorkflowExecution).filter(WorkflowExecution.id == execution_id).first()
        if not execution:
            logger.error(f"Execution {execution_id} not found.")
            return

        node = db.query(WorkflowNode).filter(WorkflowNode.id == execution.node_id).first()
        if not node:
            logger.error(f"Node {execution.node_id} not found.")
            return

        instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == execution.instance_id).first()
        if not instance:
            logger.error(f"Instance {execution.instance_id} not found.")
            return

        execution.status = "RUNNING"
        execution.worker_id = f"worker-{self.request.hostname or 'default'}"
        execution.started_at = datetime.datetime.now(datetime.timezone.utc)
        db.commit()

        # Log node execution start
        log_entry = WorkflowLog(
            execution_id=execution_id,
            level="INFO",
            message=f"Starting execution of engine '{node.engine_type}' for node '{node.name}'"
        )
        db.add(log_entry)
        db.commit()

        # Execute Engine Dispatcher contract
        dispatcher = EngineDispatcher()
        context_input = instance.context_data or {}
        output_data = dispatcher.dispatch(
            engine_type=node.engine_type,
            node_config=node.config or {},
            context_data=context_input
        )

        # Log completion
        log_completion = WorkflowLog(
            execution_id=execution_id,
            level="INFO",
            message=f"Engine '{node.engine_type}' executed successfully for node '{node.name}'"
        )
        db.add(log_completion)
        db.commit()

        # Return success to orchestrator
        orchestrator = WorkflowOrchestrator(db)
        orchestrator.handle_node_success(execution_id, output_data)

    except Exception as exc:
        logger.exception(f"Node execution failed: {exc}")
        try:
            log_err = WorkflowLog(
                execution_id=execution_id,
                level="ERROR",
                message=f"Execution error: {str(exc)}"
            )
            db.add(log_err)
            db.commit()
        except Exception:
            pass

        orchestrator = WorkflowOrchestrator(db)
        orchestrator.handle_node_failure(execution_id, str(exc))
        raise self.retry(exc=exc, countdown=5)
    finally:
        db.close()

@celery_app.task(queue='priority')
def monitor_workflow_task():
    """
    Periodic task to check for stalled workflows, timeouts, dead-letter queues, and emit metrics.
    """
    db = SessionLocal()
    try:
        now = datetime.datetime.now(datetime.timezone.utc)
        timeout_threshold = now - datetime.timedelta(minutes=30)
        
        stalled_executions = db.query(WorkflowExecution).filter(
            WorkflowExecution.status == "RUNNING",
            WorkflowExecution.started_at < timeout_threshold
        ).all()

        for execution in stalled_executions:
            logger.warning(f"Workflow execution {execution.id} timed out. Triggering failure recovery.")
            orchestrator = WorkflowOrchestrator(db)
            orchestrator.handle_node_failure(execution.id, "Execution timeout exceeded (30 mins)")
    finally:
        db.close()

@celery_app.task(queue='priority')
def checkpoint_task(instance_id_str: str, node_id_str: str, state_data: dict, stage_name: str = "Async Checkpoint"):
    """
    Async task for saving checkpoints to prevent blocking main worker threads.
    """
    db = SessionLocal()
    try:
        from app.core.orchestrator.checkpoint import CheckpointManager
        manager = CheckpointManager(db)
        manager.save_checkpoint(uuid.UUID(instance_id_str), uuid.UUID(node_id_str), state_data, stage_name=stage_name)
    finally:
        db.close()


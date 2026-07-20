from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import Any

from app.api import deps
from app.models.workflow import WorkflowInstance, WorkflowHistory, WorkflowNode, WorkflowExecution, WorkflowLog, WorkflowMetric
from app.core.orchestrator.engine import WorkflowOrchestrator

router = APIRouter()

# -------------------------------------------------------------------
# REST API (Fallback/Initial Load)
# -------------------------------------------------------------------

@router.get("/{id}")
def get_generation_job(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
):
    """Get overall job details (maps to WorkflowInstance)."""
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Generation job not found")
    
    return {
        "id": instance.id,
        "template_id": instance.template_id,
        "document_id": instance.document_id,
        "status": instance.status,
        "current_node_id": instance.current_node_id,
        "created_at": instance.created_at,
        "updated_at": instance.updated_at,
        "completed_at": instance.completed_at
    }

@router.get("/{id}/status")
def get_generation_status(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": instance.status, "current_node_id": instance.current_node_id}

@router.get("/{id}/timeline")
def get_generation_timeline(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db)
):
    """Returns the ordered stages and their execution status."""
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Not found")
        
    nodes = db.query(WorkflowNode).filter(WorkflowNode.template_id == instance.template_id).all()
    executions = db.query(WorkflowExecution).filter(WorkflowExecution.instance_id == id).all()
    
    exec_map = {ex.node_id: ex for ex in executions}
    
    timeline = []
    for node in nodes:
        ex = exec_map.get(node.id)
        timeline.append({
            "node_id": node.id,
            "name": node.name,
            "engine_type": node.engine_type,
            "status": ex.status if ex else "PENDING",
            "started_at": ex.started_at if ex else None,
            "completed_at": ex.completed_at if ex else None,
            "error": ex.error_message if ex else None,
            "retry_count": ex.retry_count if ex else 0
        })
    return timeline

@router.get("/{id}/logs")
def get_generation_logs(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db)
):
    """Get all logs for this job."""
    logs = db.query(WorkflowLog).join(WorkflowExecution).filter(WorkflowExecution.instance_id == id).order_by(WorkflowLog.created_at.asc()).all()
    return logs

@router.get("/{id}/metrics")
def get_generation_metrics(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db)
):
    metrics = db.query(WorkflowMetric).filter(WorkflowMetric.instance_id == id).all()
    return metrics

@router.get("/{id}/validation")
def get_generation_validation(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    validation = instance.context_data.get("validation", {}) if instance and instance.context_data else {}
    return validation

@router.get("/{id}/outputs")
def get_generation_outputs(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    outputs = instance.context_data.get("outputs", []) if instance and instance.context_data else []
    return outputs

@router.post("/{id}/pause")
def pause_generation(id: uuid.UUID, db: Session = Depends(deps.get_db)):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if instance:
        instance.status = "PAUSED"
        db.commit()
    return {"status": "PAUSED"}

@router.post("/{id}/resume")
def resume_generation(id: uuid.UUID, db: Session = Depends(deps.get_db)):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if instance:
        instance.status = "RUNNING"
        db.commit()
        WorkflowOrchestrator(db).execute_next_nodes(instance.id)
    return {"status": "RUNNING"}

@router.post("/{id}/cancel")
def cancel_generation(id: uuid.UUID, db: Session = Depends(deps.get_db)):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if instance:
        instance.status = "CANCELLED"
        db.commit()
    return {"status": "CANCELLED"}

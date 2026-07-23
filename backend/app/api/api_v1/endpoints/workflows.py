from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any

from app.api import deps
from app.models.workflow import (
    WorkflowTemplate, WorkflowInstance, WorkflowNode, WorkflowExecution,
    WorkflowCheckpoint, WorkflowHistory, WorkflowLog, WorkflowMetric
)
from app.core.orchestrator.engine import WorkflowOrchestrator
from app.core.orchestrator.dag import DAGProcessor
from app.core.orchestrator.checkpoint import CheckpointManager
from pydantic import BaseModel, Field

router = APIRouter()

class StartWorkflowRequest(BaseModel):
    document_id: uuid.UUID
    template_id: uuid.UUID
    priority: Optional[int] = 5
    initial_context: Dict[str, Any] = Field(default_factory=dict)

class NodeConfigInput(BaseModel):
    id: Optional[uuid.UUID] = None
    name: str
    engine_type: str
    dependencies: List[str] = Field(default_factory=list)
    conditions: Dict[str, Any] = Field(default_factory=dict)
    config: Dict[str, Any] = Field(default_factory=dict)
    queue_type: Optional[str] = "worker"
    resource_reqs: Dict[str, Any] = Field(default_factory=dict)
    is_checkpoint: Optional[bool] = False

class WorkflowTemplateCreate(BaseModel):
    name: str
    category: Optional[str] = "Standard"
    description: Optional[str] = None
    is_default: bool = False
    graph_data: Dict[str, Any] = Field(default_factory=dict)
    nodes: List[NodeConfigInput] = Field(default_factory=list)

class RestoreCheckpointRequest(BaseModel):
    checkpoint_id: uuid.UUID

@router.post("/start")
def start_workflow(
    request: StartWorkflowRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    orchestrator = WorkflowOrchestrator(db)
    try:
        instance = orchestrator.start_workflow(
            template_id=request.template_id, 
            document_id=request.document_id,
            initial_context=request.initial_context,
            priority=request.priority or 5
        )
        return {"message": "Workflow started successfully", "instance_id": instance.id, "status": instance.status}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/templates")
def get_templates(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    templates = db.query(WorkflowTemplate).all()
    result = []
    for t in templates:
        nodes = db.query(WorkflowNode).filter(WorkflowNode.template_id == t.id).all()
        result.append({
            "id": t.id,
            "name": t.name,
            "category": t.category,
            "description": t.description,
            "is_default": t.is_default,
            "graph_data": t.graph_data,
            "node_count": len(nodes),
            "nodes": [
                {
                    "id": str(n.id),
                    "name": n.name,
                    "engine_type": n.engine_type,
                    "dependencies": n.dependencies,
                    "conditions": n.conditions,
                    "config": n.config,
                    "queue_type": n.queue_type,
                    "is_checkpoint": n.is_checkpoint
                } for n in nodes
            ]
        })
    return result

@router.post("/templates")
def create_template(
    template_in: WorkflowTemplateCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    template = WorkflowTemplate(
        name=template_in.name,
        category=template_in.category or "Standard",
        description=template_in.description,
        is_default=template_in.is_default,
        graph_data=template_in.graph_data
    )
    db.add(template)
    db.commit()
    db.refresh(template)

    created_nodes = []
    node_id_map = {}

    for node_in in template_in.nodes:
        new_node = WorkflowNode(
            template_id=template.id,
            name=node_in.name,
            engine_type=node_in.engine_type,
            dependencies=[],
            conditions=node_in.conditions,
            config=node_in.config,
            queue_type=node_in.queue_type or "worker",
            resource_reqs=node_in.resource_reqs,
            is_checkpoint=node_in.is_checkpoint or False
        )
        db.add(new_node)
        db.commit()
        db.refresh(new_node)
        created_nodes.append((new_node, node_in.dependencies))
        if node_in.id:
            node_id_map[str(node_in.id)] = str(new_node.id)
        node_id_map[node_in.name] = str(new_node.id)

    # Remap string dependencies
    for node_obj, raw_deps in created_nodes:
        mapped_deps = []
        for dep in raw_deps:
            mapped_dep = node_id_map.get(str(dep), str(dep))
            mapped_deps.append(mapped_dep)
        node_obj.dependencies = mapped_deps
        db.commit()

    return {"message": "Template created successfully", "template_id": template.id, "nodes_created": len(created_nodes)}

@router.post("/templates/validate")
def validate_template_dag(
    nodes: List[NodeConfigInput],
    current_user = Depends(deps.get_current_active_user)
):
    nodes_data = [
        {
            "id": str(n.id or i),
            "dependencies": n.dependencies,
            "engine_type": n.engine_type
        }
        for i, n in enumerate(nodes)
    ]
    dag = DAGProcessor(nodes_data)
    validation = dag.validate_graph()
    return validation

@router.get("/instances/active")
def get_active_instances(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instances = db.query(WorkflowInstance).order_by(WorkflowInstance.created_at.desc()).limit(50).all()
    result = []
    for inst in instances:
        tmpl = db.query(WorkflowTemplate).filter(WorkflowTemplate.id == inst.template_id).first()
        executions = db.query(WorkflowExecution).filter(WorkflowExecution.instance_id == inst.id).all()
        result.append({
            "id": inst.id,
            "document_id": inst.document_id,
            "template_name": tmpl.name if tmpl else "Unknown Template",
            "status": inst.status,
            "priority": inst.priority,
            "created_at": inst.created_at,
            "updated_at": inst.updated_at,
            "completed_at": inst.completed_at,
            "execution_count": len(executions),
            "completed_node_count": sum(1 for e in executions if e.status == "COMPLETED")
        })
    return result

@router.get("/{id}")
def get_workflow(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow instance not found")
    
    template = db.query(WorkflowTemplate).filter(WorkflowTemplate.id == instance.template_id).first()
    nodes = db.query(WorkflowNode).filter(WorkflowNode.template_id == instance.template_id).all() if template else []
    executions = db.query(WorkflowExecution).filter(WorkflowExecution.instance_id == instance.id).all()
    history = db.query(WorkflowHistory).filter(WorkflowHistory.instance_id == instance.id).order_by(WorkflowHistory.created_at.desc()).all()
    checkpoints = db.query(WorkflowCheckpoint).filter(WorkflowCheckpoint.instance_id == instance.id).order_by(WorkflowCheckpoint.created_at.asc()).all()

    return {
        "instance": instance,
        "template": template,
        "nodes": nodes,
        "executions": executions,
        "history": history,
        "checkpoints": checkpoints
    }

@router.get("/{id}/status")
def get_workflow_status(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    executions = db.query(WorkflowExecution).filter(WorkflowExecution.instance_id == id).all()
    active_execution = next((e for e in executions if e.status in ["RUNNING", "PENDING"]), None)
    
    return {
        "id": instance.id,
        "status": instance.status,
        "priority": instance.priority,
        "current_node_id": instance.current_node_id,
        "active_execution": active_execution,
        "completed_steps": sum(1 for e in executions if e.status == "COMPLETED"),
        "total_steps": len(executions)
    }

@router.post("/{id}/pause")
def pause_workflow(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow not found")
    instance.status = "PAUSED"
    db.commit()
    return {"message": "Workflow paused successfully", "id": id, "status": instance.status}

@router.post("/{id}/resume")
def resume_workflow(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow not found")
    instance.status = "RUNNING"
    db.commit()
    
    orchestrator = WorkflowOrchestrator(db)
    orchestrator.execute_next_nodes(instance.id)
    return {"message": "Workflow resumed successfully", "id": id, "status": instance.status}

@router.post("/{id}/cancel")
def cancel_workflow(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow not found")
    instance.status = "CANCELLED"
    db.commit()
    return {"message": "Workflow cancelled successfully", "id": id, "status": instance.status}

@router.post("/{id}/restart")
def restart_workflow(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow not found")

    # Clear previous executions & checkpoints to restart fresh
    db.query(WorkflowExecution).filter(WorkflowExecution.instance_id == id).delete()
    db.query(WorkflowCheckpoint).filter(WorkflowCheckpoint.instance_id == id).delete()

    instance.status = "RUNNING"
    instance.context_data = {}
    db.commit()

    orchestrator = WorkflowOrchestrator(db)
    orchestrator.execute_next_nodes(instance.id)
    return {"message": "Workflow restarted from initial stage", "id": id, "status": instance.status}

@router.get("/{id}/checkpoints")
def get_workflow_checkpoints(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    manager = CheckpointManager(db)
    checkpoints = manager.get_checkpoints_for_instance(id)
    return checkpoints

@router.post("/{id}/restore")
def restore_workflow_checkpoint(
    id: uuid.UUID,
    request: RestoreCheckpointRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    manager = CheckpointManager(db)
    checkpoint = manager.restore_from_checkpoint(id, request.checkpoint_id)
    
    orchestrator = WorkflowOrchestrator(db)
    orchestrator.execute_next_nodes(id)
    return {"message": f"Workflow restored from checkpoint '{checkpoint.stage_name}'", "id": id}

@router.get("/{id}/history")
def get_workflow_history(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    history = db.query(WorkflowHistory).filter(WorkflowHistory.instance_id == id).order_by(WorkflowHistory.created_at.asc()).all()
    return history

@router.get("/metrics/dashboard")
def get_metrics_dashboard(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    total_instances = db.query(WorkflowInstance).count()
    active_instances = db.query(WorkflowInstance).filter(WorkflowInstance.status == "RUNNING").count()
    completed_instances = db.query(WorkflowInstance).filter(WorkflowInstance.status == "COMPLETED").count()
    failed_instances = db.query(WorkflowInstance).filter(WorkflowInstance.status == "FAILED").count()

    total_executions = db.query(WorkflowExecution).count()
    failed_executions = db.query(WorkflowExecution).filter(WorkflowExecution.status == "FAILED").count()
    
    failure_rate = (failed_executions / total_executions * 100) if total_executions > 0 else 0.0

    return {
        "total_instances": total_instances,
        "active_instances": active_instances,
        "completed_instances": completed_instances,
        "failed_instances": failed_instances,
        "total_executions": total_executions,
        "failure_rate_percent": round(failure_rate, 2),
        "queue_status": [
            {"queue": "priority", "active_workers": 8, "pending_jobs": 2},
            {"queue": "publisher", "active_workers": 12, "pending_jobs": 5},
            {"queue": "gpu", "active_workers": 4, "pending_jobs": 1},
            {"queue": "cpu", "active_workers": 16, "pending_jobs": 8},
            {"queue": "worker", "active_workers": 24, "pending_jobs": 14},
            {"queue": "large_doc", "active_workers": 6, "pending_jobs": 3}
        ]
    }


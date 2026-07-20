from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional

from app.api import deps
from app.models.workflow import WorkflowTemplate, WorkflowInstance
from app.core.orchestrator.engine import WorkflowOrchestrator
from pydantic import BaseModel

router = APIRouter()

class StartWorkflowRequest(BaseModel):
    document_id: uuid.UUID
    template_id: uuid.UUID
    initial_context: dict = {}

class WorkflowTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_default: bool = False

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
            initial_context=request.initial_context
        )
        return {"message": "Workflow started", "instance_id": instance.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{id}")
def get_workflow(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return instance

@router.get("/{id}/status")
def get_workflow_status(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return {"status": instance.status, "current_node_id": instance.current_node_id}

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
    return {"message": "Workflow paused"}

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
    return {"message": "Workflow resumed"}

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
    return {"message": "Workflow cancelled"}

@router.post("/{id}/restart")
def restart_workflow(
    id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    instance = db.query(WorkflowInstance).filter(WorkflowInstance.id == id).first()
    if not instance:
        raise HTTPException(status_code=404, detail="Workflow not found")
        
    orchestrator = WorkflowOrchestrator(db)
    return {"message": "Workflow restart initiated (Not fully implemented in prototype)"}

@router.get("/templates/")
def get_templates(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    templates = db.query(WorkflowTemplate).all()
    return templates

@router.post("/templates/")
def create_template(
    template_in: WorkflowTemplateCreate,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    template = WorkflowTemplate(
        name=template_in.name,
        description=template_in.description,
        is_default=template_in.is_default
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

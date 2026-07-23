import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class WorkflowTemplate(Base):
    __tablename__ = "workflow_templates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    category = Column(String, default="Standard") # Quick, Standard, Academic, Journal, Magazine, Custom, AI, Manual
    description = Column(String, nullable=True)
    is_default = Column(Boolean, default=False)
    graph_data = Column(JSONB, default=dict) # Visual canvas coordinates & edge layout
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WorkflowState(Base):
    __tablename__ = "workflow_states"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    template_id = Column(UUID(as_uuid=True), ForeignKey("workflow_templates.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False) # Draft, Uploaded, Formatting, Review, Approved, Exported
    order = Column(Integer, nullable=False)
    requires_approval = Column(Boolean, default=False)
    allowed_roles = Column(JSONB, nullable=True) # e.g. ["Editor", "Publisher"]

class WorkflowTransition(Base):
    __tablename__ = "workflow_transitions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    template_id = Column(UUID(as_uuid=True), ForeignKey("workflow_templates.id", ondelete="CASCADE"), nullable=False)
    from_state_id = Column(UUID(as_uuid=True), ForeignKey("workflow_states.id", ondelete="CASCADE"), nullable=False)
    to_state_id = Column(UUID(as_uuid=True), ForeignKey("workflow_states.id", ondelete="CASCADE"), nullable=False)

class DocumentWorkflowStatus(Base):
    __tablename__ = "document_workflow_status"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, unique=True)
    current_state_id = Column(UUID(as_uuid=True), ForeignKey("workflow_states.id", ondelete="SET NULL"), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    updated_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

class Approval(Base):
    __tablename__ = "approvals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    state_id = Column(UUID(as_uuid=True), ForeignKey("workflow_states.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, nullable=False) # Approved, Rejected, ChangesRequested
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# ---------------------------------------------------------
# Orchestration Engine Models (DAG & Saga Orchestration)
# ---------------------------------------------------------

class WorkflowInstance(Base):
    __tablename__ = "workflow_instances"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    template_id = Column(UUID(as_uuid=True), ForeignKey("workflow_templates.id", ondelete="CASCADE"), nullable=False)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="PENDING") # PENDING, RUNNING, PAUSED, COMPLETED, FAILED, CANCELLED, RECOVERING
    priority = Column(Integer, default=5) # 1 (Lowest) to 10 (Highest)
    current_node_id = Column(UUID(as_uuid=True), nullable=True) # Active WorkflowNode ID
    context_data = Column(JSONB, default=dict)
    resource_allocation = Column(JSONB, default=dict) # CPU, RAM, GPU specs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

class WorkflowNode(Base):
    __tablename__ = "workflow_nodes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    template_id = Column(UUID(as_uuid=True), ForeignKey("workflow_templates.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False) # e.g. "Parser", "Layout", "Review"
    engine_type = Column(String, nullable=False) # parser, ocr, virus_scan, blueprint, mapping, rules, transformation, validation, review, layout, pagination, rendering, export, archive, notification, approval, plugin, script
    dependencies = Column(JSONB, default=list) # Parent node IDs
    conditions = Column(JSONB, default=dict) # IF, ELSE, SWITCH, LOOPS, AI confidence thresholds
    config = Column(JSONB, default=dict) # timeout, retry, rollback, priority, inputs, outputs
    queue_type = Column(String, default="worker") # priority, publisher, org, worker, gpu, cpu, large_doc
    resource_reqs = Column(JSONB, default=dict) # {"cpu": 1, "ram_mb": 512, "gpu": False}
    is_checkpoint = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    instance_id = Column(UUID(as_uuid=True), ForeignKey("workflow_instances.id", ondelete="CASCADE"), nullable=False)
    node_id = Column(UUID(as_uuid=True), ForeignKey("workflow_nodes.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="PENDING") # PENDING, RUNNING, COMPLETED, FAILED, RETRYING, SKIPPED, ROLLBACK
    celery_task_id = Column(String, nullable=True)
    worker_id = Column(String, nullable=True)
    retry_count = Column(Integer, default=0)
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

class WorkflowHistory(Base):
    __tablename__ = "workflow_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    instance_id = Column(UUID(as_uuid=True), ForeignKey("workflow_instances.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False) # STARTED, NODE_COMPLETED, NODE_FAILED, PAUSED, RESUMED, RESTARTED, CHECKPOINT_RESTORED
    details = Column(JSONB, default=dict)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WorkflowCheckpoint(Base):
    __tablename__ = "workflow_checkpoints"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    instance_id = Column(UUID(as_uuid=True), ForeignKey("workflow_instances.id", ondelete="CASCADE"), nullable=False)
    node_id = Column(UUID(as_uuid=True), ForeignKey("workflow_nodes.id", ondelete="CASCADE"), nullable=False)
    stage_name = Column(String, nullable=False)
    state_data = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WorkflowLog(Base):
    __tablename__ = "workflow_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    execution_id = Column(UUID(as_uuid=True), ForeignKey("workflow_executions.id", ondelete="CASCADE"), nullable=False)
    level = Column(String, default="INFO") # DEBUG, INFO, WARNING, ERROR
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WorkflowMetric(Base):
    __tablename__ = "workflow_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    instance_id = Column(UUID(as_uuid=True), ForeignKey("workflow_instances.id", ondelete="CASCADE"), nullable=False)
    node_id = Column(UUID(as_uuid=True), ForeignKey("workflow_nodes.id", ondelete="CASCADE"), nullable=True)
    metric_name = Column(String, nullable=False) # execution_time_ms, queue_wait_ms, cpu_percent, memory_mb
    metric_value = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


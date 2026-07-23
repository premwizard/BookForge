# DocForge / BookForge Workflow Orchestration Engine

The **Workflow Orchestration Engine** serves as the central brain of DocForge. It coordinates every stage of the document publishing pipeline across all specialized engines without tight coupling.

---

## 1. Architecture & Core Principles

Every document processing job passes through the Workflow Orchestration Engine.

```mermaid
graph TD
    Upload([Document Upload]) --> Orchestrator[Workflow Orchestrator]
    Orchestrator --> Builder[Pipeline Builder & Templates]
    Builder --> Planner[Execution Planner & DAG Processor]
    Planner --> Resolver[Dependency Resolver]
    Resolver --> Scheduler[Task Scheduler]
    Scheduler --> Dispatcher[Engine Dispatcher Contract]
    Dispatcher --> Monitor[Progress Monitor]
    Monitor --> Recovery[Recovery Manager & Saga Engine]
    Recovery --> Checkpoints[Checkpoint Manager]
    Checkpoints --> History[(Pipeline Audit History)]
```

### Key Principles
1. **Loose Coupling**: Engines never invoke each other directly. All communications are mediated by the Workflow Orchestrator via event contracts.
2. **DAG Dependency Resolution**: Kahn's algorithm validates graph topology, eliminates circular dependencies, and identifies ready parallel stages.
3. **Saga Pattern Compensation**: Automatic retry backoffs, checkpoint state restoration, and inverse compensations on stage failures.
4. **Multi-Queue Compute Manager**: Allocates jobs to specialized queues (`priority`, `publisher`, `gpu`, `cpu`, `worker`, `large_doc`) based on resource requirements.

---

## 2. Default 16-Stage Publishing Pipeline

```mermaid
flowchart TD
    Upload([Upload]) --> VirusScan[Virus Scan]
    VirusScan --> OCR[OCR Engine]
    OCR --> Parser[Document Parser]
    Parser --> Blueprint[Blueprint Loader]
    Blueprint --> Mapping[Style Mapping]
    Mapping --> Rules[Rules Engine]
    Rules --> Transformation[Transformation Engine]
    Transformation --> Validation[Pre-Layout Validation]
    Validation --> Review[Editorial Review Gate]
    Review --> Layout[Layout Engine]
    Layout --> Pagination[Pagination Engine]
    Pagination --> Rendering[Rendering Engine]
    Rendering --> FinalValidation[Final Validation]
    FinalValidation --> Export[Export Engine]
    Export --> Archive([Archive Engine])
```

---

## 3. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    WORKFLOW_TEMPLATES ||--o{ WORKFLOW_NODES : "defines"
    WORKFLOW_TEMPLATES ||--o{ WORKFLOW_INSTANCES : "instantiates"
    WORKFLOW_INSTANCES ||--o{ WORKFLOW_EXECUTIONS : "executes"
    WORKFLOW_INSTANCES ||--o{ WORKFLOW_CHECKPOINTS : "snapshots"
    WORKFLOW_INSTANCES ||--o{ WORKFLOW_HISTORY : "audits"
    WORKFLOW_EXECUTIONS ||--o{ WORKFLOW_LOGS : "logs"

    WORKFLOW_TEMPLATES {
        uuid id PK
        string name
        string category
        string description
        boolean is_default
        jsonb graph_data
    }

    WORKFLOW_NODES {
        uuid id PK
        uuid template_id FK
        string name
        string engine_type
        jsonb dependencies
        jsonb conditions
        jsonb config
        string queue_type
        boolean is_checkpoint
    }

    WORKFLOW_INSTANCES {
        uuid id PK
        uuid template_id FK
        uuid document_id FK
        string status
        int priority
        jsonb context_data
    }

    WORKFLOW_EXECUTIONS {
        uuid id PK
        uuid instance_id FK
        uuid node_id FK
        string status
        string celery_task_id
        int retry_count
    }

    WORKFLOW_CHECKPOINTS {
        uuid id PK
        uuid instance_id FK
        uuid node_id FK
        string stage_name
        jsonb state_data
    }
```

---

## 4. REST API Endpoint Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/workflow/start` | Launch a workflow pipeline for a document |
| `GET` | `/api/v1/workflow/{id}` | Fetch instance state, topology graph, and executions |
| `GET` | `/api/v1/workflow/{id}/status` | Quick status check & active stage query |
| `POST` | `/api/v1/workflow/{id}/pause` | Pause running workflow execution |
| `POST` | `/api/v1/workflow/{id}/resume` | Resume paused workflow execution |
| `POST` | `/api/v1/workflow/{id}/cancel` | Cancel active workflow execution |
| `POST` | `/api/v1/workflow/{id}/restart` | Restart workflow from initial stage |
| `GET` | `/api/v1/workflow/templates` | List built-in and custom templates |
| `POST` | `/api/v1/workflow/templates` | Save a new custom workflow template |
| `POST` | `/api/v1/workflow/templates/validate` | Validate DAG topology (detect cycles) |
| `GET` | `/api/v1/workflow/{id}/checkpoints` | List saved state checkpoints |
| `POST` | `/api/v1/workflow/{id}/restore` | Restore state snapshot and restart pipeline |
| `GET` | `/api/v1/workflow/{id}/history` | Fetch complete audit event history |
| `GET` | `/api/v1/workflow/metrics/dashboard` | Retrieve worker queue telemetry and throughput |

---

## 5. Developer & Integration Guide

### Registering a New Engine Node

1. Define the engine type key in `EngineDispatcher` (`backend/app/core/orchestrator/dispatcher.py`).
2. Add execution contract handler method:
```python
def _execute_my_custom_engine(self, config: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    # Custom domain logic here
    return {"custom_stage_result": True}
```
3. Register the engine type in `AVAILABLE_ENGINE_TYPES` in `PipelineDesigner.tsx`.

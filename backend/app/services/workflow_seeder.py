from sqlalchemy.orm import Session
from app.models.workflow import WorkflowTemplate, WorkflowNode
import logging

logger = logging.getLogger(__name__)

DEFAULT_TEMPLATES = [
    {
        "name": "Standard Publishing Pipeline",
        "category": "Standard",
        "description": "Default 16-stage document publishing pipeline from Upload to Archive.",
        "is_default": True,
        "nodes": [
            {"name": "Virus Scan", "engine_type": "virus_scan", "dependencies": [], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 2}},
            {"name": "OCR Engine", "engine_type": "ocr", "dependencies": ["Virus Scan"], "queue_type": "gpu", "is_checkpoint": False, "config": {"retry": 1}},
            {"name": "Document Parser", "engine_type": "parser", "dependencies": ["OCR Engine"], "queue_type": "cpu", "is_checkpoint": True, "config": {"retry": 3}},
            {"name": "Blueprint Loader", "engine_type": "blueprint", "dependencies": ["Document Parser"], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 1}},
            {"name": "Style Mapping", "engine_type": "mapping", "dependencies": ["Blueprint Loader"], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 1}},
            {"name": "Rules Engine", "engine_type": "rules", "dependencies": ["Style Mapping"], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 2}},
            {"name": "Transformation Engine", "engine_type": "transformation", "dependencies": ["Rules Engine"], "queue_type": "cpu", "is_checkpoint": True, "config": {"retry": 2, "rollback": True}},
            {"name": "Pre-Layout Validation", "engine_type": "validation", "dependencies": ["Transformation Engine"], "queue_type": "worker", "is_checkpoint": True, "config": {"retry": 1}},
            {"name": "Editorial Review Gate", "engine_type": "review", "dependencies": ["Pre-Layout Validation"], "queue_type": "publisher", "is_checkpoint": True, "config": {"retry": 0}},
            {"name": "Layout Engine", "engine_type": "layout", "dependencies": ["Editorial Review Gate"], "queue_type": "cpu", "is_checkpoint": True, "config": {"retry": 2, "rollback": True}},
            {"name": "Pagination Engine", "engine_type": "pagination", "dependencies": ["Layout Engine"], "queue_type": "cpu", "is_checkpoint": False, "config": {"retry": 1}},
            {"name": "Rendering Engine", "engine_type": "rendering", "dependencies": ["Pagination Engine"], "queue_type": "gpu", "is_checkpoint": True, "config": {"retry": 2}},
            {"name": "Final Validation", "engine_type": "final_validation", "dependencies": ["Rendering Engine"], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 1}},
            {"name": "Export Engine", "engine_type": "export", "dependencies": ["Final Validation"], "queue_type": "worker", "is_checkpoint": True, "config": {"retry": 3}},
            {"name": "Archive Engine", "engine_type": "archive", "dependencies": ["Export Engine"], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 1}}
        ]
    },
    {
        "name": "Quick Formatting Pipeline",
        "category": "Fast Track",
        "description": "Fast draft processing pipeline skipping OCR and Review gates.",
        "is_default": False,
        "nodes": [
            {"name": "Document Parser", "engine_type": "parser", "dependencies": [], "queue_type": "worker", "is_checkpoint": True, "config": {"retry": 1}},
            {"name": "Style Mapping", "engine_type": "mapping", "dependencies": ["Document Parser"], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 1}},
            {"name": "Transformation Engine", "engine_type": "transformation", "dependencies": ["Style Mapping"], "queue_type": "worker", "is_checkpoint": True, "config": {"retry": 1}},
            {"name": "Rendering Engine", "engine_type": "rendering", "dependencies": ["Transformation Engine"], "queue_type": "cpu", "is_checkpoint": True, "config": {"retry": 1}},
            {"name": "Export PDF", "engine_type": "export", "dependencies": ["Rendering Engine"], "queue_type": "worker", "is_checkpoint": True, "config": {"retry": 1}}
        ]
    },
    {
        "name": "Academic Publishing Pipeline",
        "category": "Academic",
        "description": "Strict rule validation, peer review gate, citations, and PDF/A compliance.",
        "is_default": False,
        "nodes": [
            {"name": "Parser & Citations", "engine_type": "parser", "dependencies": [], "queue_type": "cpu", "is_checkpoint": True, "config": {"retry": 2}},
            {"name": "Blueprint Loader", "engine_type": "blueprint", "dependencies": ["Parser & Citations"], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 1}},
            {"name": "Rules Engine", "engine_type": "rules", "dependencies": ["Blueprint Loader"], "queue_type": "worker", "is_checkpoint": False, "config": {"retry": 1}},
            {"name": "Peer Review Gate", "engine_type": "review", "dependencies": ["Rules Engine"], "queue_type": "publisher", "is_checkpoint": True, "config": {"retry": 0}},
            {"name": "Layout Engine", "engine_type": "layout", "dependencies": ["Peer Review Gate"], "queue_type": "gpu", "is_checkpoint": True, "config": {"retry": 2}},
            {"name": "Export PDF/A & JATS XML", "engine_type": "export", "dependencies": ["Layout Engine"], "queue_type": "worker", "is_checkpoint": True, "config": {"retry": 2}}
        ]
    }
]

def seed_default_workflow_templates(db: Session):
    existing_count = db.query(WorkflowTemplate).count()
    if existing_count > 0:
        return

    logger.info("Seeding default workflow templates...")
    for tmpl_data in DEFAULT_TEMPLATES:
        tmpl = WorkflowTemplate(
            name=tmpl_data["name"],
            category=tmpl_data["category"],
            description=tmpl_data["description"],
            is_default=tmpl_data["is_default"]
        )
        db.add(tmpl)
        db.commit()
        db.refresh(tmpl)

        node_name_map = {}
        for node_info in tmpl_data["nodes"]:
            # Map parent dependencies
            parent_ids = [node_name_map[dep_name] for dep_name in node_info["dependencies"] if dep_name in node_name_map]
            
            node = WorkflowNode(
                template_id=tmpl.id,
                name=node_info["name"],
                engine_type=node_info["engine_type"],
                dependencies=parent_ids,
                config=node_info["config"],
                queue_type=node_info["queue_type"],
                is_checkpoint=node_info["is_checkpoint"]
            )
            db.add(node)
            db.commit()
            db.refresh(node)
            node_name_map[node_info["name"]] = str(node.id)

    logger.info("Default workflow templates seeded successfully.")

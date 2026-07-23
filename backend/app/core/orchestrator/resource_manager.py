from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class ResourceManager:
    """
    Manages computing resource allocations (CPU, RAM, GPU) and queue placement
    for document workflows based on document size, priority, and organization plan tier.
    """

    SUPPORTED_QUEUES = [
        "priority",
        "publisher",
        "org",
        "worker",
        "gpu",
        "cpu",
        "large_doc"
    ]

    @staticmethod
    def determine_queue_and_resources(
        node_engine_type: str,
        node_config: Dict[str, Any],
        instance_priority: int = 5,
        doc_size_mb: float = 1.0,
        org_plan: str = "standard"
    ) -> Dict[str, Any]:
        """
        Determines the optimal Celery queue and resource allocations.
        """
        queue_type = node_config.get("queue_type")
        
        # Automatic Queue Selection based on node type & doc size
        if not queue_type:
            if instance_priority >= 8 or org_plan == "enterprise_priority":
                queue_type = "priority"
            elif doc_size_mb > 50.0:
                queue_type = "large_doc"
            elif node_engine_type in ["rendering", "ocr", "layout"]:
                queue_type = "gpu" if node_config.get("gpu_required", False) else "cpu"
            elif org_plan in ["publisher", "organization"]:
                queue_type = "publisher"
            else:
                queue_type = "worker"

        # Calculate compute specs
        cpus = 1
        ram_mb = 512
        gpu_required = False

        if queue_type == "gpu" or node_engine_type in ["rendering", "ocr"]:
            gpu_required = True
            ram_mb = 4096
            cpus = 4
        elif queue_type == "large_doc" or doc_size_mb > 50.0:
            ram_mb = 2048
            cpus = 2

        return {
            "queue_type": queue_type,
            "allocated_resources": {
                "cpu_cores": cpus,
                "ram_mb": ram_mb,
                "gpu_required": gpu_required,
                "priority_level": instance_priority
            }
        }

import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.project import Project, ProjectMember, ProjectMilestone
from app.models.document_template import Document
import datetime
import logging

logger = logging.getLogger(__name__)

class ProjectService:
    """
    Core Service for Enterprise Publishing Project & Catalog Management.
    """

    def __init__(self, db: Session):
        self.db = db

    def create_project(
        self,
        user_id: uuid.UUID,
        name: str,
        description: Optional[str] = None,
        category: str = "General",
        default_template_id: Optional[uuid.UUID] = None
    ) -> Project:
        project = Project(
            user_id=user_id,
            name=name,
            description=description,
            category=category,
            default_template_id=default_template_id,
            status="Active",
            completion_percentage=10,
            processing_status="Idle"
        )
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)

        # Assign creator as OWNER
        member = ProjectMember(
            project_id=project.id,
            user_id=user_id,
            role="OWNER"
        )
        self.db.add(member)

        # Baseline milestone tag
        milestone = ProjectMilestone(
            project_id=project.id,
            milestone_tag="v1.0-draft",
            release_notes="Initial project creation workspace.",
            created_by=user_id
        )
        self.db.add(milestone)

        self.db.commit()
        return project

    def update_project_telemetry(self, project_id: uuid.UUID) -> Project:
        project = self.db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise ValueError("Project not found")

        docs = self.db.query(Document).filter(Document.project_id == project_id).all()
        project.total_documents = len(docs)
        
        # Calculate completion percentage based on document statuses
        if len(docs) == 0:
            project.completion_percentage = 10
        else:
            completed_count = sum(1 for d in docs if getattr(d, "status", "") in ["Completed", "Exported", "Released"])
            project.completion_percentage = int((completed_count / len(docs)) * 90) + 10

        self.db.commit()
        self.db.refresh(project)
        return project

    def add_member(self, project_id: uuid.UUID, user_id: uuid.UUID, role: str = "EDITOR") -> ProjectMember:
        member = ProjectMember(
            project_id=project_id,
            user_id=user_id,
            role=role.upper()
        )
        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)
        return member

    def create_milestone(self, project_id: uuid.UUID, user_id: uuid.UUID, milestone_tag: str, release_notes: Optional[str] = None) -> ProjectMilestone:
        milestone = ProjectMilestone(
            project_id=project_id,
            milestone_tag=milestone_tag,
            release_notes=release_notes,
            created_by=user_id
        )
        self.db.add(milestone)
        self.db.commit()
        self.db.refresh(milestone)
        return milestone

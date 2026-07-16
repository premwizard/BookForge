import uuid
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.versioning import DocumentVersion, VersionComparison
from app.models.document_template import Document
from app.models.audit import ActivityLog

class VersionControlService:
    """Manages immutable snapshots and document comparisons."""
    
    def __init__(self, db: Session):
        self.db = db

    def create_version(self, document_id: uuid.UUID, user_id: uuid.UUID, content_snapshot: Dict[str, Any], commit_message: Optional[str] = None) -> DocumentVersion:
        """Saves a new snapshot of the document."""
        # Find next version number
        last_version = self.db.query(DocumentVersion).filter(DocumentVersion.document_id == document_id).order_by(DocumentVersion.version_number.desc()).first()
        next_version_num = (last_version.version_number + 1) if last_version else 1
        
        version = DocumentVersion(
            document_id=document_id,
            version_number=next_version_num,
            created_by=user_id,
            content_snapshot=content_snapshot,
            commit_message=commit_message
        )
        self.db.add(version)
        
        # Log activity
        log = ActivityLog(
            document_id=document_id,
            user_id=user_id,
            action="VERSION_CREATED",
            new_value={"version_number": next_version_num}
        )
        self.db.add(log)
        
        self.db.commit()
        self.db.refresh(version)
        return version

    def get_version(self, version_id: uuid.UUID) -> Optional[DocumentVersion]:
        return self.db.query(DocumentVersion).filter(DocumentVersion.id == version_id).first()
        
    def compare_versions(self, base_id: uuid.UUID, target_id: uuid.UUID) -> VersionComparison:
        """Checks for existing comparison or calculates a new diff (mocked)."""
        existing = self.db.query(VersionComparison).filter(
            VersionComparison.base_version_id == base_id,
            VersionComparison.target_version_id == target_id
        ).first()
        
        if existing:
            return existing
            
        base = self.get_version(base_id)
        target = self.get_version(target_id)
        
        if not base or not target:
            raise ValueError("Invalid version IDs for comparison.")
            
        # MOCK DIFF LOGIC
        # In a real system, we'd use dictdiffer or a custom text comparison algorithm
        diff_data = {
            "changes": [
                {"type": "ADDED", "path": "chapters[0].paragraphs[2]", "value": "New paragraph added."},
                {"type": "MODIFIED", "path": "chapters[0].title", "old": "Old Title", "new": "New Title"}
            ]
        }
        
        comparison = VersionComparison(
            base_version_id=base_id,
            target_version_id=target_id,
            diff_data=diff_data
        )
        self.db.add(comparison)
        self.db.commit()
        return comparison

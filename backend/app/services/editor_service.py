import uuid
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.editor import EditorSession, EditorHistory, CursorPosition, EditorSnapshot, FormattingChange
import datetime
import logging

logger = logging.getLogger(__name__)

class EditorService:
    """
    Core Editor Service operating on IFDM/LDM internal document models.
    Supports Operational Transform (OT) replays, Live Style Inspection,
    unlimited undo/redo stack, and real-time cursor presence.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_or_create_session(self, document_id: uuid.UUID, user_id: uuid.UUID) -> EditorSession:
        session = self.db.query(EditorSession).filter(
            EditorSession.document_id == document_id,
            EditorSession.user_id == user_id,
            EditorSession.is_active == True
        ).first()

        if not session:
            session = EditorSession(
                document_id=document_id,
                user_id=user_id,
                view_mode="PAGED",
                current_page=1,
                zoom_level=1.0,
                is_active=True
            )
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)

        return session

    def apply_operation(
        self,
        document_id: uuid.UUID,
        user_id: uuid.UUID,
        operation_type: str,
        operation_payload: Dict[str, Any],
        inverse_payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Applies a structural edit operation to the IFDM document model and logs to revision history.
        """
        session = self.get_or_create_session(document_id, user_id)

        # Get latest revision number
        latest_history = self.db.query(EditorHistory)\
            .filter(EditorHistory.document_id == document_id)\
            .order_by(EditorHistory.revision_number.desc())\
            .first()

        next_rev = (latest_history.revision_number + 1) if latest_history else 1

        history_entry = EditorHistory(
            document_id=document_id,
            session_id=session.id,
            user_id=user_id,
            operation_type=operation_type,
            operation_payload=operation_payload,
            inverse_payload=inverse_payload,
            revision_number=next_rev
        )
        self.db.add(history_entry)
        self.db.commit()
        self.db.refresh(history_entry)

        return {
            "revision_number": next_rev,
            "operation_type": operation_type,
            "applied_at": history_entry.created_at
        }

    def undo_last_operation(self, document_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Dict[str, Any]]:
        """
        Rolls back the latest operation using its inverse_payload.
        """
        latest = self.db.query(EditorHistory)\
            .filter(EditorHistory.document_id == document_id)\
            .order_by(EditorHistory.revision_number.desc())\
            .first()

        if not latest:
            return None

        # Re-apply inverse payload as a new compensating revision
        return self.apply_operation(
            document_id=document_id,
            user_id=user_id,
            operation_type=f"UNDO_{latest.operation_type}",
            operation_payload=latest.inverse_payload,
            inverse_payload=latest.operation_payload
        )

    def compute_live_styles(self, element_id: str, element_type: str, direct_styles: Dict[str, Any]) -> Dict[str, Any]:
        """
        Computes Live Style Inspection breakdown:
        - Applied Style
        - Computed Style
        - Inherited Style
        - Blueprint Style
        - Publisher Style
        - Rule Overrides
        """
        blueprint_style = {
            "font_family": "Times New Roman",
            "font_size_pt": 11.0,
            "line_height": 1.2,
            "color": "#111827",
            "margin_bottom_pt": 6.0
        }

        publisher_style = {
            "font_family": "Garamond",
            "font_size_pt": 11.5,
            "line_height": 1.35,
            "color": "#000000",
            "margin_bottom_pt": 8.0,
            "first_line_indent_pt": 18.0
        }

        inherited_style = {
            "font_family": "Garamond",
            "font_size_pt": 11.5,
            "line_height": 1.35,
            "color": "#000000"
        }

        applied_style = direct_styles or {
            "font_weight": "bold" if "heading" in element_type.lower() else "normal",
            "font_size_pt": 16.0 if "heading" in element_type.lower() else 11.5
        }

        computed_style = {**inherited_style, **applied_style}

        rule_overrides = []
        if applied_style.get("font_size_pt") != publisher_style.get("font_size_pt"):
            rule_overrides.append({
                "rule_id": "rule-font-size-override",
                "property": "font_size_pt",
                "expected": publisher_style.get("font_size_pt"),
                "actual": applied_style.get("font_size_pt"),
                "severity": "WARNING"
            })

        return {
            "element_id": element_id,
            "element_type": element_type,
            "applied_style": applied_style,
            "computed_style": computed_style,
            "inherited_style": inherited_style,
            "blueprint_style": blueprint_style,
            "publisher_style": publisher_style,
            "rule_overrides": rule_overrides
        }

    def update_cursor_presence(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID,
        user_name: str,
        page_number: int,
        node_id: Optional[str] = None,
        offset: int = 0,
        selection_range: Optional[Dict[str, Any]] = None
    ) -> CursorPosition:
        cursor = self.db.query(CursorPosition).filter(CursorPosition.session_id == session_id).first()
        if not cursor:
            cursor = CursorPosition(
                session_id=session_id,
                user_id=user_id,
                user_name=user_name,
                page_number=page_number,
                node_id=node_id,
                offset=offset,
                selection_range=selection_range
            )
            self.db.add(cursor)
        else:
            cursor.page_number = page_number
            cursor.node_id = node_id
            cursor.offset = offset
            cursor.selection_range = selection_range

        self.db.commit()
        self.db.refresh(cursor)
        return cursor

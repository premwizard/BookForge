from typing import Any, List
from sqlalchemy.orm import Session
from app.models.review import ReviewSession, Correction, ReviewSnapshot
from .correction_engine import CorrectionEngine
from .commands import create_command_from_model

class ReviewSessionManager:
    """
    Manages loading a session, retrieving the active corrections, and orchestrating snapshots.
    """
    def __init__(self, db: Session):
        self.db = db
        self.correction_engine = CorrectionEngine()
        
    def get_current_document_state(self, session_id: str, base_ifdm: Any) -> Any:
        """
        Fetches the latest snapshot and replays subsequent commands to yield the current IFDM.
        """
        # 1. Fetch latest snapshot
        snapshot = self.db.query(ReviewSnapshot).filter(ReviewSnapshot.session_id == session_id).order_by(ReviewSnapshot.sequence_number.desc()).first()
        
        last_seq = 0
        current_state = base_ifdm
        
        if snapshot:
            current_state = snapshot.ifdm_state # Need to deserialize into IFDM objects
            last_seq = snapshot.sequence_number
            
        # 2. Fetch subsequent commands that are NOT undone
        corrections = self.db.query(Correction).filter(
            Correction.session_id == session_id,
            Correction.sequence_number > last_seq,
            Correction.is_undone == False
        ).order_by(Correction.sequence_number.asc()).all()
        
        # 3. Convert DB models to Command objects
        commands = [
            create_command_from_model(c.command_type, c.target_node_id, c.payload)
            for c in corrections
        ]
        
        # 4. Apply corrections
        corrected_ifdm = self.correction_engine.apply_corrections(current_state, commands)
        
        return corrected_ifdm
        
    def add_correction(self, session_id: str, command_type: str, target_node_id: str, payload: dict) -> Correction:
        # Determine next sequence number
        last_correction = self.db.query(Correction).filter(Correction.session_id == session_id).order_by(Correction.sequence_number.desc()).first()
        seq = (last_correction.sequence_number + 1) if last_correction else 1
        
        # Clear out any 'undone' corrections that are ahead of us, since we are branching new history
        # (Standard undo/redo tree clearing)
        self.db.query(Correction).filter(
            Correction.session_id == session_id,
            Correction.is_undone == True,
            Correction.sequence_number >= seq
        ).delete()
        
        correction = Correction(
            session_id=session_id,
            command_type=command_type,
            target_node_id=target_node_id,
            payload=payload,
            sequence_number=seq
        )
        self.db.add(correction)
        self.db.commit()
        return correction
        
    def undo(self, session_id: str) -> bool:
        """Marks the latest active correction as undone."""
        latest_active = self.db.query(Correction).filter(
            Correction.session_id == session_id,
            Correction.is_undone == False
        ).order_by(Correction.sequence_number.desc()).first()
        
        if not latest_active:
            return False
            
        latest_active.is_undone = True
        self.db.commit()
        return True
        
    def redo(self, session_id: str) -> bool:
        """Restores the earliest undone correction."""
        earliest_undone = self.db.query(Correction).filter(
            Correction.session_id == session_id,
            Correction.is_undone == True
        ).order_by(Correction.sequence_number.asc()).first()
        
        if not earliest_undone:
            return False
            
        earliest_undone.is_undone = False
        self.db.commit()
        return True

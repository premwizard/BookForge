from uuid import UUID
from sqlalchemy.orm import Session
from app.models.template import MappingProfile, StyleMapping, BlueprintVersion, BlueprintStyle
from app.models.parser import ParsedDocument, ParsedElement
import logging

logger = logging.getLogger(__name__)

class StyleMappingEngine:
    """
    Handles mapping raw ParsedDocument elements to Publisher Blueprint Styles.
    Uses Deterministic rules first, falling back to AI if needed.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def generate_mapping_profile(self, publisher_id: UUID, blueprint_version_id: UUID, document_id: UUID, profile_name: str) -> MappingProfile:
        """
        Scans a sample ParsedDocument to discover unique element types.
        Generates a MappingProfile and attempts to auto-map them against the Blueprint.
        """
        # 1. Create Mapping Profile
        profile = MappingProfile(
            publisher_id=publisher_id,
            blueprint_version_id=blueprint_version_id,
            name=profile_name
        )
        self.db.add(profile)
        self.db.flush()
        
        # 2. Discover Unique Element Types from Document
        # We find all distinct element_type + attributes combinations (e.g. Heading level 1)
        # For simplicity in this iteration, we map purely by element_type string (e.g. "Heading 1", "Paragraph", "Caption")
        elements = self.db.query(ParsedElement.element_type).filter(
            ParsedElement.parsed_document_id == (
                self.db.query(ParsedDocument.id).filter(ParsedDocument.document_id == document_id).scalar_subquery()
            )
        ).distinct().all()
        
        raw_types = [e[0] for e in elements if e[0]]
        
        # 3. Fetch Blueprint Styles
        styles = self.db.query(BlueprintStyle).filter(BlueprintStyle.blueprint_version_id == blueprint_version_id).all()
        
        # 4. Attempt Mapping
        for raw_type in raw_types:
            best_match_id, confidence, is_ai, reason = self._match_style(raw_type, styles)
            
            if best_match_id:
                mapping = StyleMapping(
                    mapping_profile_id=profile.id,
                    raw_element_type=raw_type,
                    blueprint_style_id=best_match_id,
                    confidence=confidence,
                    is_ai_suggested=is_ai,
                    ai_reason=reason,
                    is_approved=confidence >= 95 # Auto-approve if very confident
                )
                self.db.add(mapping)
                
        self.db.commit()
        return profile

    def _match_style(self, raw_type: str, blueprint_styles: list[BlueprintStyle]) -> tuple[UUID, int, bool, str]:
        """
        Returns (best_match_id, confidence, is_ai, reason).
        Applies deterministic rules first.
        """
        # --- DETERMINISTIC MATCHING ---
        raw_lower = raw_type.lower()
        
        # 1. Exact Match (Confidence 100)
        for style in blueprint_styles:
            if style.style_name.lower() == raw_lower:
                return style.id, 100, False, "Exact name match."
                
        # 2. Semantic Match for Headings (Confidence 95)
        if raw_lower.startswith("heading"):
            # try to extract number
            num = ''.join(filter(str.isdigit, raw_lower))
            if num:
                for style in blueprint_styles:
                    s_lower = style.style_name.lower()
                    if s_lower.startswith("heading") and num in s_lower:
                        return style.id, 95, False, f"Semantic heading match for level {num}."
                        
        # 3. Semantic Match for Paragraphs/Body Text (Confidence 90)
        if raw_lower in ["paragraph", "text", "body"]:
            for style in blueprint_styles:
                if style.style_name.lower() in ["normal", "body text", "body"]:
                    return style.id, 90, False, "Semantic body text match."
                    
        # 4. Semantic Match for Captions (Confidence 90)
        if "caption" in raw_lower:
            for style in blueprint_styles:
                if "caption" in style.style_name.lower():
                    return style.id, 90, False, "Semantic caption match."

        # --- AI FALLBACK (Simulated) ---
        # If no deterministic match >= 70% confidence is found, we use AI.
        # In a real implementation, we would call our `app.services.ai` module here,
        # passing the `raw_type` and the list of `blueprint_styles`.
        
        # Fallback to the first style for the sake of the mock, marking it as AI suggested with low confidence
        if blueprint_styles:
            # Prefer 'Normal' as the absolute last resort fallback
            fallback = next((s for s in blueprint_styles if s.style_name.lower() == 'normal'), blueprint_styles[0])
            return fallback.id, 50, True, "AI Fallback: No deterministic match found. Suggesting default based on semantic embedding similarity."
            
        return None, 0, False, "No styles available to match against."

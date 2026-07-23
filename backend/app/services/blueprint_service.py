import uuid
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.template import Template, Blueprint, BlueprintVersion, BlueprintStyle, BlueprintLayout, BlueprintRule, MappingProfile, StyleMapping
import datetime
import logging

logger = logging.getLogger(__name__)

class BlueprintService:
    """
    Core Service for Publisher Blueprint extraction, AI style mapping,
    versioning, and snapshot comparisons.
    """

    def __init__(self, db: Session):
        self.db = db

    def extract_blueprint_from_docx(self, template_id: uuid.UUID, storage_path: Optional[str] = None) -> Dict[str, Any]:
        """
        Parses a reference DOCX template file and extracts its typography styles,
        page geometry, and validation rules into a machine-readable JSON blueprint AST.
        """
        template = self.db.query(Template).filter(Template.id == template_id).first()
        if not template:
            raise ValueError("Template not found")

        # Mocked extracted typography styles AST
        extracted_styles = [
            {
                "style_name": "Heading 1",
                "style_type": "paragraph",
                "properties": {
                    "font_family": "Garamond",
                    "font_size_pt": 24.0,
                    "font_weight": "bold",
                    "color": "#111827",
                    "line_height": 1.2,
                    "space_before_pt": 18.0,
                    "space_after_pt": 12.0,
                    "keep_with_next": True
                }
            },
            {
                "style_name": "Heading 2",
                "style_type": "paragraph",
                "properties": {
                    "font_family": "Garamond",
                    "font_size_pt": 18.0,
                    "font_weight": "bold",
                    "color": "#1F2937",
                    "line_height": 1.25,
                    "space_before_pt": 14.0,
                    "space_after_pt": 8.0,
                    "keep_with_next": True
                }
            },
            {
                "style_name": "Body Text",
                "style_type": "paragraph",
                "properties": {
                    "font_family": "Times New Roman",
                    "font_size_pt": 11.5,
                    "font_weight": "normal",
                    "color": "#374151",
                    "line_height": 1.35,
                    "first_line_indent_pt": 18.0,
                    "space_after_pt": 6.0
                }
            },
            {
                "style_name": "Blockquote",
                "style_type": "paragraph",
                "properties": {
                    "font_family": "Inter",
                    "font_size_pt": 10.0,
                    "font_style": "italic",
                    "color": "#4B5563",
                    "left_indent_pt": 24.0,
                    "right_indent_pt": 24.0
                }
            },
            {
                "style_name": "Academic Table",
                "style_type": "table",
                "properties": {
                    "border_width_pt": 1.0,
                    "header_bg_color": "#F3F4F6",
                    "cell_padding_pt": 6.0
                }
            }
        ]

        extracted_layouts = [
            {
                "section_name": "Standard Body",
                "properties": {
                    "paper_size": "TRADE_6X9",
                    "width_in": 6.0,
                    "height_in": 9.0,
                    "margin_top_in": 1.0,
                    "margin_bottom_in": 1.0,
                    "margin_inside_in": 1.25,
                    "margin_outside_in": 1.0,
                    "columns": 1
                }
            }
        ]

        extracted_rules = [
            {"rule_type": "ORPHAN_CONTROL", "rule_data": {"min_lines": 2}},
            {"rule_type": "HEADING_KEEP_WITH_NEXT", "rule_data": {"enabled": True}},
            {"rule_type": "HYPHENATION", "rule_data": {"max_consecutive": 2}}
        ]

        blueprint_ast = {
            "template_name": template.name,
            "category": template.category or "General",
            "version": 1,
            "styles": extracted_styles,
            "layouts": extracted_layouts,
            "rules": extracted_rules,
            "extracted_at": datetime.datetime.utcnow().isoformat()
        }

        # Check or create Blueprint entity
        blueprint = self.db.query(Blueprint).filter(Blueprint.template_id == template_id).first()
        if not blueprint:
            blueprint = Blueprint(
                template_id=template_id,
                publisher_id=template.publisher_id,
                name=f"{template.name} Master Blueprint"
            )
            self.db.add(blueprint)
            self.db.commit()
            self.db.refresh(blueprint)

        # Create BlueprintVersion
        version_count = len(blueprint.versions) if blueprint.versions else 0
        bp_version = BlueprintVersion(
            blueprint_id=blueprint.id,
            version_number=version_count + 1,
            blueprint_json=blueprint_ast
        )
        self.db.add(bp_version)
        self.db.commit()
        self.db.refresh(bp_version)

        # Cache relational entries
        for st in extracted_styles:
            style_obj = BlueprintStyle(
                blueprint_version_id=bp_version.id,
                style_name=st["style_name"],
                style_type=st["style_type"],
                properties_json=st["properties"]
            )
            self.db.add(style_obj)

        for ly in extracted_layouts:
            layout_obj = BlueprintLayout(
                blueprint_version_id=bp_version.id,
                section_name=ly["section_name"],
                properties_json=ly["properties"]
            )
            self.db.add(layout_obj)

        for rl in extracted_rules:
            rule_obj = BlueprintRule(
                blueprint_version_id=bp_version.id,
                rule_type=rl["rule_type"],
                rule_data=rl["rule_data"]
            )
            self.db.add(rule_obj)

        self.db.commit()
        return blueprint_ast

    def auto_map_styles(self, blueprint_version_id: uuid.UUID, raw_styles: List[str]) -> List[Dict[str, Any]]:
        """
        AI & Fuzzy rule matcher linking raw author styles to target blueprint styles.
        """
        bp_styles = self.db.query(BlueprintStyle).filter(BlueprintStyle.blueprint_version_id == blueprint_version_id).all()
        bp_style_names = {s.style_name.lower(): s for s in bp_styles}

        mappings = []
        for raw in raw_styles:
            raw_lower = raw.lower()
            confidence = 60
            matched_style = None
            reason = "Fuzzy keyword matching"

            if raw_lower in bp_style_names:
                confidence = 98
                matched_style = bp_style_names[raw_lower]
                reason = "Exact style name match"
            elif "heading 1" in raw_lower or "h1" in raw_lower or "title" in raw_lower:
                matched_style = bp_style_names.get("heading 1")
                confidence = 92
                reason = "Semantic heading level 1 matching"
            elif "heading 2" in raw_lower or "h2" in raw_lower:
                matched_style = bp_style_names.get("heading 2")
                confidence = 90
                reason = "Semantic heading level 2 matching"
            elif "quote" in raw_lower:
                matched_style = bp_style_names.get("blockquote")
                confidence = 88
                reason = "Blockquote keyword heuristic"
            else:
                matched_style = bp_style_names.get("body text") or (bp_styles[0] if bp_styles else None)
                confidence = 75
                reason = "Default fallback to body text"

            mappings.append({
                "raw_element_type": raw,
                "target_style_id": str(matched_style.id) if matched_style else None,
                "target_style_name": matched_style.style_name if matched_style else "Body Text",
                "confidence": confidence,
                "is_ai_suggested": True,
                "ai_reason": reason,
                "is_approved": confidence >= 90
            })

        return mappings

    def compare_blueprint_versions(self, version_id_1: uuid.UUID, version_id_2: uuid.UUID) -> Dict[str, Any]:
        """
        Generates a diff comparison tree between two blueprint version snapshots.
        """
        v1 = self.db.query(BlueprintVersion).filter(BlueprintVersion.id == version_id_1).first()
        v2 = self.db.query(BlueprintVersion).filter(BlueprintVersion.id == version_id_2).first()

        if not v1 or not v2:
            raise ValueError("Blueprint version not found")

        styles_v1 = {s.get("style_name"): s for s in v1.blueprint_json.get("styles", [])}
        styles_v2 = {s.get("style_name"): s for s in v2.blueprint_json.get("styles", [])}

        modified_styles = []
        added_styles = []
        removed_styles = []

        for name, data in styles_v2.items():
            if name not in styles_v1:
                added_styles.append(name)
            elif styles_v1[name] != data:
                modified_styles.append({
                    "style_name": name,
                    "old_properties": styles_v1[name].get("properties"),
                    "new_properties": data.get("properties")
                })

        for name in styles_v1:
            if name not in styles_v2:
                removed_styles.append(name)

        return {
            "v1_version_number": v1.version_number,
            "v2_version_number": v2.version_number,
            "added_styles": added_styles,
            "removed_styles": removed_styles,
            "modified_styles": modified_styles
        }

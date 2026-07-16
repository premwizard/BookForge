from uuid import UUID
from sqlalchemy.orm import Session
from app.models.template import Blueprint, BlueprintVersion, BlueprintStyle, BlueprintLayout, BlueprintRule, Template
from app.services.template.analyzer import TemplateAnalyzer
import logging

logger = logging.getLogger(__name__)

class BlueprintGenerator:
    """
    Consumes a raw DOCX template, analyzes it, and generates the machine-readable Blueprint JSON.
    It also stores the extracted properties into relational tables for quick querying.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def generate_from_template(self, template_id: UUID, blueprint_name: str) -> BlueprintVersion:
        """
        Creates a new Blueprint and BlueprintVersion from a Template.
        """
        template = self.db.query(Template).filter(Template.id == template_id).first()
        if not template:
            raise ValueError(f"Template {template_id} not found.")
            
        if not template.storage_path:
            raise ValueError(f"Template {template_id} has no file uploaded.")

        # 1. Analyze the DOCX
        analyzer = TemplateAnalyzer(template.storage_path)
        raw_data = analyzer.analyze()
        
        # 2. Construct the definitive JSON Blueprint structure
        blueprint_json = {
            "publisher": str(template.publisher_id) if template.publisher_id else "System",
            "version": "1.0",
            "template_metadata": raw_data.get("metadata", {}),
            "styles": raw_data.get("styles", {}),
            "layout": raw_data.get("layout", []),
            "numbering": raw_data.get("numbering", {}),
            "images": {}, # Extracted specifically in future iterations
            "tables": {}, 
            "headers": {},
            "footers": {}
        }
        
        # 3. Create or Fetch the Blueprint parent
        blueprint = Blueprint(
            template_id=template.id,
            publisher_id=template.publisher_id,
            name=blueprint_name
        )
        self.db.add(blueprint)
        self.db.flush() # Get ID
        
        # 4. Create the BlueprintVersion
        version = BlueprintVersion(
            blueprint_id=blueprint.id,
            version_number=1,
            blueprint_json=blueprint_json
        )
        self.db.add(version)
        self.db.flush()
        
        # 5. Populate Relational Caches
        self._populate_caches(version.id, blueprint_json)
        
        self.db.commit()
        return version

    def _populate_caches(self, version_id: UUID, blueprint_json: dict):
        """Extract JSON data into relational tables for quick lookups."""
        
        # Styles
        styles = blueprint_json.get("styles", {})
        for style_name, properties in styles.items():
            db_style = BlueprintStyle(
                blueprint_version_id=version_id,
                style_name=style_name,
                style_type=properties.get("type", "Unknown"),
                properties_json=properties
            )
            self.db.add(db_style)
            
        # Layouts
        layouts = blueprint_json.get("layout", [])
        for section in layouts:
            idx = section.get("section_index", 0)
            db_layout = BlueprintLayout(
                blueprint_version_id=version_id,
                section_name=f"Section {idx}",
                properties_json=section
            )
            self.db.add(db_layout)
            
        # Rules (We'll extract generic rules from layout properties or numbering for now)
        # Placeholder for extracting global validation rules
        db_rule = BlueprintRule(
            blueprint_version_id=version_id,
            rule_type="Global",
            rule_data={"generated_from": "DOCX analysis"}
        )
        self.db.add(db_rule)

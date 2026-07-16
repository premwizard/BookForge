from typing import List, Dict, Any
from app.services.validation.rule_engine import ValidationPlugin
from app.models.document_template import Document
from app.models.validation import ValidationRule, ValidationResult

class StructureValidator(ValidationPlugin):
    """Validates structural elements like Chapters, Sections, Headings."""
    
    @classmethod
    def get_rules(cls) -> List[Dict[str, Any]]:
        return [
            {
                "code": "struct_missing_chapter",
                "category": "Structure",
                "name": "Missing Chapter",
                "severity": "Critical"
            },
            {
                "code": "struct_orphan_heading",
                "category": "Structure",
                "name": "Orphan Heading",
                "severity": "Medium"
            }
        ]

    def validate(self, document: Document, active_rules: List[ValidationRule]) -> List[ValidationResult]:
        issues = []
        
        rule_map = {r.code: r for r in active_rules}
        
        # Mock validation logic for demonstration
        if "struct_orphan_heading" in rule_map:
            rule = rule_map["struct_orphan_heading"]
            issue = ValidationResult(
                rule_id=rule.id,
                problem="Heading without subsequent body text.",
                cause="An H2 tag is immediately followed by another H2 tag.",
                recommendation="Add body text or remove the empty heading.",
                auto_fix_possible=False,
                severity=rule.severity,
                location="Chapter 2, Section 2.1"
            )
            issues.append(issue)
            
        return issues

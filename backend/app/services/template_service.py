import docx
from typing import Dict, Any, List
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.template import TemplateVersion, TemplateStyle

def pt_to_float(pt):
    """Convert python-docx Pt value to float, or return None."""
    if pt is not None:
        return pt.pt
    return None

def extract_styles_from_docx(storage_path: str) -> List[Dict[str, Any]]:
    """
    Extract styles from a DOCX or DOTX file using python-docx.
    Returns a list of style dictionaries containing properties.
    """
    document = docx.Document(storage_path)
    extracted_styles = []

    for style in document.styles:
        style_type = style.type.name if hasattr(style, 'type') else "Unknown"
        properties = {}

        if hasattr(style, 'font'):
            font = style.font
            properties["font"] = {
                "name": font.name,
                "size": pt_to_float(font.size) if hasattr(font, 'size') else None,
                "bold": font.bold,
                "italic": font.italic,
                "underline": font.underline,
                "color": font.color.rgb if hasattr(font.color, 'rgb') else None
            }

        if hasattr(style, 'paragraph_format'):
            pf = style.paragraph_format
            properties["paragraph"] = {
                "alignment": pf.alignment,
                "left_indent": pt_to_float(pf.left_indent) if hasattr(pf, 'left_indent') else None,
                "right_indent": pt_to_float(pf.right_indent) if hasattr(pf, 'right_indent') else None,
                "space_before": pt_to_float(pf.space_before) if hasattr(pf, 'space_before') else None,
                "space_after": pt_to_float(pf.space_after) if hasattr(pf, 'space_after') else None,
                "line_spacing": pf.line_spacing,
                "keep_together": pf.keep_together,
                "keep_with_next": pf.keep_with_next,
                "page_break_before": pf.page_break_before,
                "widow_control": pf.widow_control,
            }

        extracted_styles.append({
            "name": style.name,
            "type": style_type,
            "properties": properties
        })

    return extracted_styles

def process_template_version(db: Session, template_version_id: UUID):
    """
    Service function to process an uploaded template version and extract its styles.
    """
    version = db.query(TemplateVersion).filter(TemplateVersion.id == template_version_id).first()
    if not version:
        raise ValueError("Template Version not found")

    try:
        extracted = extract_styles_from_docx(version.storage_path)
        for s in extracted:
            style_record = TemplateStyle(
                template_version_id=version.id,
                style_name=s["name"],
                style_type=str(s["type"]),
                properties_json=s["properties"]
            )
            db.add(style_record)
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise Exception(f"Failed to extract styles: {str(e)}")

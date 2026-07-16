import docx
from docx.shared import Pt, Twips, Cm, Inches
from docx.enum.style import WD_STYLE_TYPE
import os

class TemplateAnalyzer:
    """
    Extracts styles, layouts, and configurations from a DOCX template file.
    """
    
    def __init__(self, file_path: str):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Template file not found at {file_path}")
        self.file_path = file_path
        self.doc = docx.Document(file_path)

    def _safe_float(self, length) -> float:
        """Convert a Length object (like Pt) to a float for JSON serialization."""
        if length is None:
            return None
        try:
            return float(length.pt)
        except AttributeError:
            return float(length) # if it's just an int

    def analyze(self) -> dict:
        """
        Runs the full analysis pipeline and returns the raw extracted data.
        """
        return {
            "metadata": self._extract_metadata(),
            "styles": self._extract_styles(),
            "layout": self._extract_layout(),
            "numbering": self._extract_numbering(),
        }

    def _extract_metadata(self) -> dict:
        """Extract document properties like title, author, core properties."""
        core_props = self.doc.core_properties
        return {
            "author": core_props.author,
            "title": core_props.title,
            "subject": core_props.subject,
            "language": core_props.language,
            "created": core_props.created.isoformat() if core_props.created else None,
            "modified": core_props.modified.isoformat() if core_props.modified else None,
        }

    def _extract_styles(self) -> dict:
        """Extract paragraph, character, and table styles."""
        styles = {}
        for style in self.doc.styles:
            style_data = {
                "id": style.style_id,
                "name": style.name,
                "type": style.type.name if style.type else "Unknown",
                "hidden": style.hidden,
                "quick_style": style.quick_style,
                "priority": style.priority,
            }
            
            # Extract Font properties
            if hasattr(style, 'font'):
                font = style.font
                style_data["font"] = {
                    "name": font.name,
                    "size": self._safe_float(font.size),
                    "bold": font.bold,
                    "italic": font.italic,
                    "underline": font.underline,
                    "color": font.color.rgb if hasattr(font, 'color') and hasattr(font.color, 'rgb') else None
                }

            # Extract Paragraph format
            if hasattr(style, 'paragraph_format'):
                pf = style.paragraph_format
                style_data["paragraph"] = {
                    "alignment": pf.alignment.name if pf.alignment else None,
                    "left_indent": self._safe_float(pf.left_indent),
                    "right_indent": self._safe_float(pf.right_indent),
                    "first_line_indent": self._safe_float(pf.first_line_indent),
                    "space_before": self._safe_float(pf.space_before),
                    "space_after": self._safe_float(pf.space_after),
                    "line_spacing": pf.line_spacing,
                    "keep_together": pf.keep_together,
                    "keep_with_next": pf.keep_with_next,
                    "widow_control": pf.widow_control,
                    "page_break_before": pf.page_break_before,
                }
            
            # Identify base style
            if hasattr(style, 'base_style') and style.base_style:
                style_data["based_on"] = style.base_style.name
                
            if hasattr(style, 'next_paragraph_style') and style.next_paragraph_style:
                style_data["next_style"] = style.next_paragraph_style.name

            styles[style.name] = style_data
            
        return styles

    def _extract_layout(self) -> list:
        """Extract page layout sections (margins, orientation, columns)."""
        sections = []
        for idx, section in enumerate(self.doc.sections):
            sections.append({
                "section_index": idx,
                "orientation": section.orientation.name if section.orientation else None,
                "page_width": self._safe_float(section.page_width),
                "page_height": self._safe_float(section.page_height),
                "margins": {
                    "top": self._safe_float(section.top_margin),
                    "bottom": self._safe_float(section.bottom_margin),
                    "left": self._safe_float(section.left_margin),
                    "right": self._safe_float(section.right_margin),
                    "gutter": self._safe_float(section.gutter),
                },
                "header_distance": self._safe_float(section.header_distance),
                "footer_distance": self._safe_float(section.footer_distance),
                "different_first_page_header_footer": section.different_first_page_header_footer,
            })
        return sections

    def _extract_numbering(self) -> dict:
        """Extract numbering information. (Basic extraction via python-docx limitations)"""
        # python-docx doesn't natively expose `numbering.xml` cleanly. 
        # In a production environment, we would parse the XML part directly here.
        # For now, we return a placeholder.
        return {
            "has_numbering_part": self.doc.part.numbering_part is not None,
            "formats": "XML extraction required for deep numbering analysis."
        }

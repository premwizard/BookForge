from typing import Any, List
from xml.etree.ElementTree import Element, SubElement, tostring

class ParagraphBuilder:
    """
    Constructs Open XML paragraph elements (<w:p>).
    """
    
    def build_paragraph(self, ldm_paragraph: Any) -> Element:
        p = Element('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p')
        
        # Build Paragraph Properties (Alignment, Spacing, etc.)
        pPr = self._build_properties(ldm_paragraph)
        if pPr is not None:
            p.append(pPr)
            
        # Build Runs
        for ldm_line in getattr(ldm_paragraph, 'lines', []):
            for word in getattr(ldm_line, 'words', []):
                run = self._build_run(word)
                p.append(run)
                
        return p
        
    def _build_properties(self, ldm_paragraph: Any) -> Element:
        # Stub
        return None
        
    def _build_run(self, word_data: dict) -> Element:
        r = Element('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r')
        t = SubElement(r, '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t')
        t.text = word_data.get('text', '')
        return r

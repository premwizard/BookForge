from typing import Any
from xml.etree.ElementTree import Element, SubElement

class DocumentBuilder:
    """
    Constructs the main document.xml file.
    """
    
    def __init__(self, paragraph_builder: Any):
        self.paragraph_builder = paragraph_builder
        
    def build(self, ldm_document: Any) -> bytes:
        root = Element('w:document')
        root.attrib['xmlns:w'] = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        
        body = SubElement(root, 'w:body')
        
        # Iterate over sections/pages/frames and use ParagraphBuilder, TableBuilder, etc.
        # This is a stub for the complex traversal.
        p = self.paragraph_builder.build_paragraph(None)
        body.append(p)
        
        import xml.etree.ElementTree as ET
        return ET.tostring(root, encoding='utf-8', xml_declaration=True)

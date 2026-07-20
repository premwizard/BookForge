import zipfile
import io
import os
from typing import Dict, Any

class PackageBuilder:
    """
    Directly constructs the Microsoft Office Open XML (.docx) package structure.
    Handles relationships, content types, and XML part injection.
    """
    
    def __init__(self, template_path: str = None):
        self.parts: Dict[str, bytes] = {}
        self.template_path = template_path
        
        if self.template_path and os.path.exists(self.template_path):
            self._load_from_template()
        else:
            self._init_empty_package()
            
    def _init_empty_package(self):
        """Initializes a bare-minimum DOCX structure."""
        self.add_part("[Content_Types].xml", b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"></Types>')
        self.add_part("_rels/.rels", b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>')
        
    def _load_from_template(self):
        """Loads parts from an existing DOCX template."""
        with zipfile.ZipFile(self.template_path, 'r') as z:
            for item in z.infolist():
                self.parts[item.filename] = z.read(item.filename)
                
    def add_part(self, path: str, content: bytes):
        """Adds or updates a file part inside the DOCX package."""
        self.parts[path] = content
        
    def get_part(self, path: str) -> bytes:
        return self.parts.get(path)
        
    def save(self, output_stream: io.BytesIO):
        """Writes the final DOCX package to a stream."""
        with zipfile.ZipFile(output_stream, 'w', zipfile.ZIP_DEFLATED) as z:
            for path, content in self.parts.items():
                z.writestr(path, content)

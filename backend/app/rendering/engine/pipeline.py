import io
from typing import Any
from app.rendering.xml.package_builder import PackageBuilder
from .builders.document_builder import DocumentBuilder
from .builders.style_builder import StyleBuilder
from .builders.paragraph_builder import ParagraphBuilder

class RenderingPipeline:
    """
    Orchestrates the conversion of LDM into a DOCX Package.
    """
    def __init__(self, job_id: str, ldm: Any, template_path: str = None):
        self.job_id = job_id
        self.ldm = ldm
        self.package = PackageBuilder(template_path)
        
        # Initialize builders
        self.paragraph_builder = ParagraphBuilder()
        self.document_builder = DocumentBuilder(self.paragraph_builder)
        self.style_builder = StyleBuilder()
        
    def execute(self) -> io.BytesIO:
        """
        Executes the rendering stages and returns the raw DOCX bytes stream.
        """
        # 1. Build Styles
        styles_xml = self.style_builder.build(getattr(self.ldm, 'styles', {}))
        self.package.add_part('word/styles.xml', styles_xml)
        
        # 2. Build Document Body
        document_xml = self.document_builder.build(self.ldm)
        self.package.add_part('word/document.xml', document_xml)
        
        # 3. Build media, headers, footers (stubbed)
        
        # 4. Save to stream
        out_stream = io.BytesIO()
        self.package.save(out_stream)
        out_stream.seek(0)
        
        return out_stream

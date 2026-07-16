import importlib
import pkgutil
import inspect
from typing import List, Dict, Any, Type, Optional
from app.services.export import plugins
from app.models.document_template import Document
from app.models.export import Export

class ExportRendererPlugin:
    """Base class for all format renderers."""
    
    @classmethod
    def get_supported_formats(cls) -> List[str]:
        """Return a list of formats supported by this plugin (e.g., ['DOCX'])."""
        return []
        
    def render(self, document: Document, export_record: Export, settings: Dict[str, Any]) -> str:
        """Execute the rendering logic and return the path to the generated file."""
        return ""

class ExportEngine:
    """Discovers plugins and orchestrates the export pipeline."""
    
    def __init__(self, db_session):
        self.db = db_session
        self.plugins = self._discover_plugins()
        
    def _discover_plugins(self) -> Dict[str, ExportRendererPlugin]:
        discovered = {}
        for _, module_name, _ in pkgutil.iter_modules(plugins.__path__):
            full_module_name = f"{plugins.__name__}.{module_name}"
            module = importlib.import_module(full_module_name)
            
            for _, obj in inspect.getmembers(module, inspect.isclass):
                if issubclass(obj, ExportRendererPlugin) and obj is not ExportRendererPlugin:
                    plugin_instance = obj()
                    for fmt in plugin_instance.get_supported_formats():
                        discovered[fmt.upper()] = plugin_instance
                        
        return discovered
        
    def generate_export(self, document_id: str, export_id: str, settings: Dict[str, Any] = None) -> str:
        settings = settings or {}
        
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document {document_id} not found.")
            
        export_record = self.db.query(Export).filter(Export.id == export_id).first()
        if not export_record:
            raise ValueError(f"Export record {export_id} not found.")
            
        fmt = export_record.format.upper()
        if fmt not in self.plugins:
            raise ValueError(f"Unsupported export format: {fmt}. Loaded plugins: {list(self.plugins.keys())}")
            
        plugin = self.plugins[fmt]
        
        # In a real implementation, we would apply formatting, resolve references, and TOC here
        # before passing it to the plugin to render.
        
        file_path = plugin.render(document, export_record, settings)
        
        return file_path

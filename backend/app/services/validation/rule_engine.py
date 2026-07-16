import importlib
import pkgutil
import inspect
from typing import List, Dict, Any, Type
from app.services.validation import plugins
from app.models.document_template import Document
from app.models.validation import ValidationRule, ValidationResult

class ValidationPlugin:
    """Base class for all validation plugins."""
    
    @classmethod
    def get_rules(cls) -> List[Dict[str, Any]]:
        """Return a list of rule definitions supported by this plugin."""
        return []
        
    def validate(self, document: Document, active_rules: List[ValidationRule]) -> List[ValidationResult]:
        """Execute the validation logic and return a list of found issues."""
        return []

class RuleEngine:
    """Discovers and executes validation plugins."""
    
    def __init__(self, db_session):
        self.db = db_session
        self.plugins = self._discover_plugins()
        
    def _discover_plugins(self) -> List[ValidationPlugin]:
        discovered = []
        # Iterate over modules in the plugins package
        for _, module_name, _ in pkgutil.iter_modules(plugins.__path__):
            full_module_name = f"{plugins.__name__}.{module_name}"
            module = importlib.import_module(full_module_name)
            
            # Find classes that inherit from ValidationPlugin (excluding the base class itself if imported)
            for _, obj in inspect.getmembers(module, inspect.isclass):
                if issubclass(obj, ValidationPlugin) and obj is not ValidationPlugin:
                    discovered.append(obj())
                    
        return discovered
        
    def run_validation(self, run_id: str, document_id: str) -> List[ValidationResult]:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document {document_id} not found.")
            
        # Fetch active rules for the system/project
        active_rules = self.db.query(ValidationRule).filter(ValidationRule.is_active == True).all()
        
        all_issues = []
        for plugin in self.plugins:
            # Filter active rules that belong to this plugin's supported rules
            plugin_rule_codes = [r["code"] for r in plugin.get_rules()]
            relevant_rules = [r for r in active_rules if r.code in plugin_rule_codes]
            
            if relevant_rules:
                issues = plugin.validate(document, relevant_rules)
                for issue in issues:
                    issue.run_id = run_id
                    all_issues.append(issue)
                    
        return all_issues

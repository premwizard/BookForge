from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class RuleContext(BaseModel):
    """
    Context passed to the Rules Engine for evaluating conditions and applying actions.
    """
    document_id: Optional[int] = None
    publisher_id: Optional[int] = None
    node_type: Optional[str] = None
    node_data: Dict[str, Any] = Field(default_factory=dict)
    custom_variables: Dict[str, Any] = Field(default_factory=dict)
    
    # Track actions applied during execution
    applied_actions: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Store warnings or errors raised
    warnings: List[str] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)
    
    def get_variable(self, name: str, default: Any = None) -> Any:
        return self.custom_variables.get(name, default)
    
    def set_variable(self, name: str, value: Any):
        self.custom_variables[name] = value
        
    def add_action(self, action_type: str, payload: Dict[str, Any]):
        self.applied_actions.append({"type": action_type, "payload": payload})
        
    def raise_warning(self, message: str):
        self.warnings.append(message)
        
    def raise_error(self, message: str):
        self.errors.append(message)

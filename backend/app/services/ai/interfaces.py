from abc import ABC, abstractmethod
from typing import Dict, Any, List

class AIProvider(ABC):
    """
    Abstract base class for all AI Providers.
    """
    
    @abstractmethod
    def __init__(self, api_key: str, model: str, config: Dict[str, Any] = None):
        self.api_key = api_key
        self.model = model
        self.config = config or {}

    @abstractmethod
    def analyze_structure(self, document_content: str, prompt: str) -> Dict[str, Any]:
        """Analyzes the structure of a document."""
        pass
        
    @abstractmethod
    def classify_content(self, document_content: str, prompt: str) -> Dict[str, Any]:
        """Classifies content of a document."""
        pass
        
    @abstractmethod
    def suggest_styles(self, document_content: str, prompt: str) -> Dict[str, Any]:
        """Suggests styles for the document."""
        pass

    @abstractmethod
    def score_quality(self, document_content: str, prompt: str) -> Dict[str, Any]:
        """Scores the quality of the document."""
        pass

    @abstractmethod
    def count_tokens(self, text: str) -> int:
        """Counts the number of tokens in the given text."""
        pass

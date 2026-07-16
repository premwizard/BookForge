from typing import Dict, Any
from app.services.ai.interfaces import AIProvider

class MockAIProvider(AIProvider):
    """
    A mock provider for testing or when actual API keys are not available.
    Returns deterministic JSON responses.
    """
    
    def __init__(self, api_key: str = "mock", model: str = "mock-model", config: Dict[str, Any] = None):
        super().__init__(api_key, model, config)
        
    def analyze_structure(self, document_content: str, prompt: str) -> Dict[str, Any]:
        return {
            "title": "Mock Title",
            "chapters": [
                {"title": "Chapter 1", "sections": []}
            ]
        }
        
    def classify_content(self, document_content: str, prompt: str) -> Dict[str, Any]:
        return {
            "classifications": [
                {"type": "Paragraph", "confidence": 0.95}
            ]
        }
        
    def suggest_styles(self, document_content: str, prompt: str) -> Dict[str, Any]:
        return {
            "suggestions": [
                {"issue": "Missing Heading Levels", "recommendation": "Add H2 between H1 and H3"}
            ]
        }

    def score_quality(self, document_content: str, prompt: str) -> Dict[str, Any]:
        return {
            "overall_quality": {
                "score": 85,
                "reason": "Good structure, but missing some captions.",
                "confidence": 0.9
            }
        }

    def count_tokens(self, text: str) -> int:
        # Rough mock estimation: 1 token per 4 chars
        return len(text) // 4

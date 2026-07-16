from sqlalchemy.orm import Session
from app.models.ai import PromptVersion

class PromptManager:
    """
    Manages fetching and formatting prompts for the AI module.
    """
    def __init__(self, db: Session):
        self.db = db

    def get_prompt(self, name: str, provider_id: str) -> str:
        """
        Retrieves the active prompt template by name and provider.
        """
        prompt = self.db.query(PromptVersion).filter(
            PromptVersion.name == name,
            PromptVersion.provider_id == provider_id,
            PromptVersion.is_active == True
        ).order_by(PromptVersion.version.desc()).first()
        
        if prompt:
            return prompt.template
            
        # Fallback default prompts if none in DB
        return self._get_fallback_prompt(name)
        
    def _get_fallback_prompt(self, name: str) -> str:
        if name == "analyze_structure":
            return "Extract the structure of this document (headings, chapters, etc.) into JSON."
        elif name == "classify_content":
            return "Classify each paragraph in this document into types (Body, Heading, Quote, etc.) into JSON."
        elif name == "suggest_styles":
            return "Analyze the formatting and suggest style improvements into JSON."
        elif name == "score_quality":
            return "Score the document on Structure, Readability, and Consistency into JSON."
        return "Analyze this document into JSON."

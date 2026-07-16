import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.models.ai import DocumentInsight, AIJob, AIResult, Provider, AIUsage
from app.models.parser import ParsedElement
from app.services.ai.providers.provider_factory import ProviderFactory
from app.services.ai.token_manager import TokenManager
from app.services.ai.prompt_manager import PromptManager

class AIService:
    """
    Orchestrates the AI Document Intelligence workflows.
    """
    def __init__(self, db: Session):
        self.db = db
        self.prompt_manager = PromptManager(db)
        
    def _get_provider_instance(self, provider_id: str = None) -> Any:
        if not provider_id:
            provider_record = self.db.query(Provider).filter(Provider.is_active == True).first()
        else:
            provider_record = self.db.query(Provider).filter(Provider.id == provider_id).first()
            
        if not provider_record:
            # Fallback to mock if no DB record
            return ProviderFactory.get_provider("mock", "mock-key", "mock-model")
            
        return ProviderFactory.get_provider(
            provider_record.name, 
            provider_record.config.get("api_key", "mock-key"), 
            provider_record.config.get("model", "mock-model"),
            provider_record.config
        )

    def process_document(self, job_id: str) -> None:
        """
        Main processing method called by the background worker.
        """
        job = self.db.query(AIJob).filter(AIJob.id == job_id).first()
        if not job:
            return
            
        try:
            job.status = "Running"
            self.db.commit()
            
            provider = self._get_provider_instance(job.provider_id)
            token_manager = TokenManager(provider)
            
            # Fetch document content (Mocking this part for now, would fetch ParsedElement)
            document_content = self._extract_text_from_parsed(job.document_id)
            
            # 1. Structure Analysis
            struct_prompt = self.prompt_manager.get_prompt("analyze_structure", job.provider_id)
            structure = provider.analyze_structure(document_content, struct_prompt)
            self._save_result(job.id, structure)
            
            # 2. Content Classification
            class_prompt = self.prompt_manager.get_prompt("classify_content", job.provider_id)
            classification = provider.classify_content(document_content, class_prompt)
            self._save_result(job.id, classification)
            
            # 3. Quality Scoring
            score_prompt = self.prompt_manager.get_prompt("score_quality", job.provider_id)
            scores = provider.score_quality(document_content, score_prompt)
            self._save_result(job.id, scores)
            
            # 4. Suggestions
            sugg_prompt = self.prompt_manager.get_prompt("suggest_styles", job.provider_id)
            suggestions = provider.suggest_styles(document_content, sugg_prompt)
            self._save_result(job.id, suggestions)
            
            # Update DocumentInsights
            self._update_insights(job.document_id, structure, classification, scores, suggestions)
            
            # Track Usage
            # Mock tokens for demonstration
            total_tokens = token_manager.count_tokens(document_content) * 4 
            self._update_usage(job.document_id, total_tokens)
            
            job.status = "Completed"
            self.db.commit()
            
        except Exception as e:
            job.status = "Failed"
            job.error_message = str(e)
            self.db.commit()
            raise e
            
    def _extract_text_from_parsed(self, document_id: str) -> str:
        # In a real implementation, we'd traverse the ParsedElement tree.
        # This is a stub for the mock.
        return "This is the content of the document. " * 100
        
    def _save_result(self, job_id: str, raw_response: Dict[str, Any]) -> None:
        result = AIResult(job_id=job_id, raw_response=raw_response)
        self.db.add(result)
        
    def _update_insights(self, document_id: str, structure: Dict, classification: Dict, scores: Dict, suggestions: Dict) -> None:
        insight = self.db.query(DocumentInsight).filter(DocumentInsight.document_id == document_id).first()
        if not insight:
            insight = DocumentInsight(document_id=document_id)
            self.db.add(insight)
            
        insight.structure_tree = structure
        insight.content_classification = classification
        insight.quality_scores = scores
        insight.style_suggestions = suggestions
        
    def _update_usage(self, document_id: str, tokens: int) -> None:
        usage = self.db.query(AIUsage).filter(AIUsage.document_id == document_id).first()
        if not usage:
            usage = AIUsage(document_id=document_id)
            self.db.add(usage)
            
        usage.total_prompt_tokens += tokens
        usage.total_completion_tokens += tokens // 2

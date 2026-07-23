from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import Optional, List, Dict, Any

from app.api import deps
from app.models.ai import AIJob, DocumentInsight, Provider, AISuggestion
from app.models.document_template import Document
from app.services.ai_service import AIService
from app.workers.ai_tasks import analyze_document_task

router = APIRouter()

@router.post("/{document_id}/analyze", status_code=202)
def analyze_document(
    document_id: uuid.UUID,
    provider_id: uuid.UUID = None,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Kicks off AI document structure analysis and copilot suggestion generation.
    """
    service = AIService(db)
    insight = service.analyze_document_structure(document_id)
    suggestions = service.generate_formatting_suggestions(document_id)
    
    return {
        "message": "AI analysis complete",
        "insight_id": insight.id,
        "suggestions_count": len(suggestions)
    }

@router.get("/{document_id}/insights")
def get_document_insights(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AIService(db)
    insight = service.analyze_document_structure(document_id)
    return insight

@router.get("/{document_id}/suggestions")
def get_copilot_suggestions(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AIService(db)
    suggestions = service.generate_formatting_suggestions(document_id)
    return suggestions

@router.post("/suggestions/{suggestion_id}/accept")
def accept_suggestion(
    suggestion_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    suggestion = db.query(AISuggestion).filter(AISuggestion.id == suggestion_id).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    suggestion.status = "ACCEPTED"
    db.commit()
    return {"message": "AI formatting suggestion accepted", "suggestion_id": suggestion_id}

@router.post("/suggestions/{suggestion_id}/reject")
def reject_suggestion(
    suggestion_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    suggestion = db.query(AISuggestion).filter(AISuggestion.id == suggestion_id).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    suggestion.status = "REJECTED"
    db.commit()
    return {"message": "AI suggestion rejected", "suggestion_id": suggestion_id}

@router.get("/usage/{document_id}")
def get_token_telemetry(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AIService(db)
    return service.get_token_usage_telemetry(document_id)

@router.get("/providers/list")
def list_providers(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return [
        {"id": "prov-gemini", "name": "Google Gemini 1.5 Pro", "provider": "GEMINI", "is_active": True, "context_window": "2,000,000 tokens"},
        {"id": "prov-openai", "name": "OpenAI GPT-4o", "provider": "OPENAI", "is_active": True, "context_window": "128,000 tokens"},
        {"id": "prov-claude", "name": "Anthropic Claude 3.5 Sonnet", "provider": "CLAUDE", "is_active": True, "context_window": "200,000 tokens"},
        {"id": "prov-ollama", "name": "Local Ollama Llama-3-70b", "provider": "LOCAL_OLLAMA", "is_active": False, "context_window": "8,192 tokens"}
    ]


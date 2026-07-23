from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from app.api import deps
from app.models.pod import PodChannelConfig, RoyaltySplitContract
from app.services.pod_service import PodService

router = APIRouter()

class SpineCalculationRequest(BaseModel):
    page_count: int = Field(default=280, example=280)
    paper_stock: str = Field(default="60lb Cream", example="60lb Cream")
    retail_price_usd: float = Field(default=19.99, example=19.99)
    channel_name: str = Field(default="Amazon KDP", example="Amazon KDP")

@router.post("/{document_id}/spine-calculator")
def calculate_spine_and_costs(
    document_id: uuid.UUID,
    request: SpineCalculationRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = PodService(db)
    spine = service.calculate_spine_width(page_count=request.page_count, paper_stock=request.paper_stock)
    economics = service.calculate_print_cost_and_royalty(
        page_count=request.page_count,
        retail_price_usd=request.retail_price_usd,
        channel_name=request.channel_name
    )
    return {
        "spine_calculation": spine,
        "economics": economics
    }

@router.get("/{project_id}/royalties")
def get_project_royalties(
    project_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = PodService(db)
    return service.get_project_royalties(project_id)

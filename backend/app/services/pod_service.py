import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.pod import PodChannelConfig, RoyaltySplitContract
import datetime
import logging

logger = logging.getLogger(__name__)

class PodService:
    """
    Core Service for Print-on-Demand (POD) Distribution & Royalty Analytics Engine.
    """

    def __init__(self, db: Session):
        self.db = db

    def calculate_spine_width(self, page_count: int, paper_stock: str = "60lb Cream") -> Dict[str, Any]:
        # PPI multipliers (Pages Per Inch)
        ppi_table = {
            "50lb White": 500, # 0.002 in / page
            "60lb Cream": 444, # 0.00225 in / page
            "70lb Color": 380  # 0.00263 in / page
        }
        ppi = ppi_table.get(paper_stock, 444)
        spine_in = round(page_count / ppi, 3)
        spine_mm = round(spine_in * 25.4, 2)
        total_cover_width_in = round(6.0 * 2 + spine_in + 0.25, 3) # (Trim * 2) + Spine + Bleed

        return {
            "page_count": page_count,
            "paper_stock": paper_stock,
            "ppi": ppi,
            "spine_width_in": spine_in,
            "spine_width_mm": spine_mm,
            "total_cover_width_in": total_cover_width_in
        }

    def calculate_print_cost_and_royalty(
        self,
        page_count: int,
        retail_price_usd: float = 19.99,
        channel_name: str = "Amazon KDP"
    ) -> Dict[str, Any]:
        # KDP Standard Paperback Printing: $1.00 base + $0.012 / page
        base_cost = 1.00 if "KDP" in channel_name else 1.25
        page_rate = 0.012 if "KDP" in channel_name else 0.015
        unit_print_cost = round(base_cost + (page_count * page_rate), 2)

        channel_cut_percent = 0.40 if "KDP" in channel_name else 0.45
        retailer_cut = round(retail_price_usd * channel_cut_percent, 2)
        net_royalty = round(retail_price_usd - retailer_cut - unit_print_cost, 2)

        return {
            "channel_name": channel_name,
            "retail_price_usd": retail_price_usd,
            "unit_print_cost_usd": unit_print_cost,
            "retailer_cut_usd": retailer_cut,
            "net_royalty_usd": max(0.0, net_royalty),
            "royalty_margin_percent": round((net_royalty / retail_price_usd) * 100, 1) if retail_price_usd > 0 else 0.0
        }

    def get_project_royalties(self, project_id: uuid.UUID) -> Dict[str, Any]:
        return {
            "project_id": str(project_id),
            "monthly_units_sold": 412,
            "gross_revenue_usd": 8235.88,
            "total_royalties_payout_usd": 3230.08,
            "channels": [
                {"name": "Amazon KDP", "units_sold": 280, "royalty": 2195.20, "status": "Live"},
                {"name": "IngramSpark Global", "units_sold": 132, "royalty": 1034.88, "status": "Live"}
            ],
            "splits": [
                {"contributor": "Dr. Aris Thorne", "role": "Primary Author", "share": "70%", "payout": 2261.05},
                {"contributor": "Elena Rostova", "role": "Co-Author", "share": "30%", "payout": 969.03}
            ]
        }

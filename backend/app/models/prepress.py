import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class PrepressConfig(Base):
    __tablename__ = "prepress_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    icc_profile = Column(String, default="Fogra39_Coated") # Fogra39_Coated, SWOP_2006_Web, GRACol_2013
    bleed_margin_mm = Column(Float, default=3.0) # 3.0mm standard print press bleed
    safety_margin_mm = Column(Float, default=6.35) # 6.35mm (0.25in) safe text margin
    max_ink_limit_percent = Column(Integer, default=300) # Max 300% Total Ink Coverage (TAC)
    crop_marks_enabled = Column(Boolean, default=True)
    color_bars_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class SpotColorMapping(Base):
    __tablename__ = "spot_color_mappings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    prepress_config_id = Column(UUID(as_uuid=True), ForeignKey("prepress_configs.id", ondelete="CASCADE"), nullable=False, index=True)
    pantone_name = Column(String, nullable=False) # e.g. "PANTONE 185 C"
    cmyk_fallback = Column(JSONB, nullable=False) # {"c": 0, "m": 91, "y": 76, "k": 0}
    is_varnish = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class PodChannelConfig(Base):
    __tablename__ = "pod_channel_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    channel_name = Column(String, default="Amazon KDP") # Amazon KDP, IngramSpark, Lulu Press, B&N Press
    paper_stock = Column(String, default="60lb Cream") # 50lb White, 60lb Cream, 70lb Color
    binding_type = Column(String, default="Paperback Perfect Bound") # Paperback Perfect Bound, Hardcover Dust Jacket
    trim_size = Column(String, default="6 x 9 in (152 x 229 mm)")
    page_count = Column(Integer, default=280)
    spine_width_in = Column(Float, default=0.63) # Calculated spine thickness
    retail_price_usd = Column(Float, default=19.99)
    unit_print_cost_usd = Column(Float, default=4.15)
    net_royalty_usd = Column(Float, default=7.84)
    distribution_status = Column(String, default="Live") # Draft, Submitting, Live, Suspended
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RoyaltySplitContract(Base):
    __tablename__ = "royalty_split_contracts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    contributor_name = Column(String, nullable=False)
    role = Column(String, default="Primary Author") # Primary Author, Co-Author, Illustrator, Translator
    split_percentage = Column(Float, default=70.0) # e.g. 70.0%
    payout_email = Column(String, nullable=False)
    status = Column(String, default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

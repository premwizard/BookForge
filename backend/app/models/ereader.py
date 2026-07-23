import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database.base import Base

class EReaderConfig(Base):
    __tablename__ = "ereader_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    layout_mode = Column(String, default="REFLOWABLE") # REFLOWABLE, FIXED_LAYOUT
    device_target = Column(String, default="kindle-paperwhite") # kindle-paperwhite, ipad-retina, kobo-clara, android-phone
    font_family = Column(String, default="Bookerly") # Bookerly, Garamond, Georgia, San Francisco
    font_size_pt = Column(Integer, default=12) # 10pt - 24pt
    theme = Column(String, default="DAY") # DAY, SEPIA, NIGHT, E_INK
    line_spacing = Column(Float, default=1.4)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class EpubNavigationItem(Base):
    __tablename__ = "epub_navigation_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    ereader_config_id = Column(UUID(as_uuid=True), ForeignKey("ereader_configs.id", ondelete="CASCADE"), nullable=False, index=True)
    nav_title = Column(String, nullable=False)
    content_src = Column(String, nullable=False) # e.g. "OEBPS/ch01.xhtml#sec1"
    item_order = Column(Integer, nullable=False)
    depth_level = Column(Integer, default=1)
    aria_role = Column(String, default="doc-toc")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

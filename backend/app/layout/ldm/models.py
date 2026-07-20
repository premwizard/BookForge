from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class Point(BaseModel):
    x: float
    y: float

class Size(BaseModel):
    width: float
    height: float

class Rect(BaseModel):
    x: float
    y: float
    width: float
    height: float

class Margin(BaseModel):
    top: float
    right: float
    bottom: float
    left: float

class LDMNodeBase(BaseModel):
    id: str
    node_type: str
    bounds: Rect
    metadata: Dict[str, Any] = Field(default_factory=dict)

class LDMLine(LDMNodeBase):
    node_type: str = "Line"
    text: str
    baseline: float
    words: List[Dict[str, Any]] = Field(default_factory=list) # Word, x, width

class LDMParagraphBlock(LDMNodeBase):
    node_type: str = "ParagraphBlock"
    lines: List[LDMLine] = Field(default_factory=list)

class LDMImageBox(LDMNodeBase):
    node_type: str = "ImageBox"
    src: str
    wrap_type: str = "inline"

class LDMTableBox(LDMNodeBase):
    node_type: str = "TableBox"
    # Detailed table layout geometry would go here

LDMBlock = Union[LDMParagraphBlock, LDMImageBox, LDMTableBox]

class LDMFrame(BaseModel):
    id: str
    frame_type: str # main, header, footer, float
    bounds: Rect
    blocks: List[LDMBlock] = Field(default_factory=list)

class LDMPage(BaseModel):
    id: str
    page_number: int
    page_type: str
    size: Size
    margin: Margin
    frames: List[LDMFrame] = Field(default_factory=list)

class LDMSection(BaseModel):
    id: str
    name: Optional[str] = None
    pages: List[LDMPage] = Field(default_factory=list)

class LayoutDocumentModel(BaseModel):
    document_id: str
    total_pages: int
    sections: List[LDMSection] = Field(default_factory=list)

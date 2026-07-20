from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class ComputedStyle(BaseModel):
    font_family: Optional[str] = None
    font_size: Optional[float] = None
    bold: Optional[bool] = None
    italic: Optional[bool] = None
    underline: Optional[bool] = None
    color: Optional[str] = None
    background_color: Optional[str] = None
    alignment: Optional[str] = None
    indent_left: Optional[float] = None
    indent_right: Optional[float] = None
    space_before: Optional[float] = None
    space_after: Optional[float] = None
    line_spacing: Optional[float] = None
    style_name: Optional[str] = None
    
    # Priority tracking
    resolved_from: Optional[str] = None # Manual, Rule, Mapped, Blueprint, Inherited, Default

class NodeMetadata(BaseModel):
    original_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    custom_properties: Dict[str, Any] = Field(default_factory=dict)

class IFDMNodeBase(BaseModel):
    node_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    node_type: str
    parent_id: Optional[str] = None
    computed_style: ComputedStyle = Field(default_factory=ComputedStyle)
    resolved_style: ComputedStyle = Field(default_factory=ComputedStyle)
    validation_state: str = "Valid"
    metadata: NodeMetadata = Field(default_factory=NodeMetadata)
    transformation_history: List[Dict[str, Any]] = Field(default_factory=list)

class TextRun(BaseModel):
    text: str
    style: Optional[ComputedStyle] = None

class ParagraphNode(IFDMNodeBase):
    node_type: str = "Paragraph"
    runs: List[TextRun] = Field(default_factory=list)

class HeadingNode(IFDMNodeBase):
    node_type: str = "Heading"
    level: int
    runs: List[TextRun] = Field(default_factory=list)

class ImageNode(IFDMNodeBase):
    node_type: str = "Image"
    src: str
    alt_text: Optional[str] = None
    width: Optional[float] = None
    height: Optional[float] = None
    alignment: str = "center"
    wrap: str = "inline"
    caption_id: Optional[str] = None

class TableCellNode(IFDMNodeBase):
    node_type: str = "TableCell"
    rowspan: int = 1
    colspan: int = 1
    children: List['IFDMNode'] = Field(default_factory=list)

class TableRowNode(IFDMNodeBase):
    node_type: str = "TableRow"
    is_header: bool = False
    cells: List[TableCellNode] = Field(default_factory=list)

class TableNode(IFDMNodeBase):
    node_type: str = "Table"
    rows: List[TableRowNode] = Field(default_factory=list)
    caption_id: Optional[str] = None

class ListItemNode(IFDMNodeBase):
    node_type: str = "ListItem"
    level: int = 0
    children: List['IFDMNode'] = Field(default_factory=list)

class ListNode(IFDMNodeBase):
    node_type: str = "List"
    list_type: str = "bullet" # bullet, number, roman, alpha
    items: List[ListItemNode] = Field(default_factory=list)

class SectionNode(IFDMNodeBase):
    node_type: str = "Section"
    children: List['IFDMNode'] = Field(default_factory=list)
    orientation: str = "portrait"
    columns: int = 1

class DocumentNode(IFDMNodeBase):
    node_type: str = "Document"
    children: List['IFDMNode'] = Field(default_factory=list)

# Forward refs
TableCellNode.update_forward_refs()
ListItemNode.update_forward_refs()
SectionNode.update_forward_refs()
DocumentNode.update_forward_refs()

IFDMNode = Union[
    ParagraphNode,
    HeadingNode,
    ImageNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    ListNode,
    ListItemNode,
    SectionNode,
    DocumentNode
]

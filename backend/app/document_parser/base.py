from abc import ABC, abstractmethod
from typing import Dict, Any, List

class ParsedElementDTO:
    def __init__(self, element_type: str, text: str = None, attributes: Dict[str, Any] = None):
        self.element_type = element_type
        self.text = text
        self.attributes = attributes or {}
        self.children: List['ParsedElementDTO'] = []

    def add_child(self, child: 'ParsedElementDTO'):
        self.children.append(child)
        
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.element_type,
            "text": self.text,
            "attributes": self.attributes,
            "children": [c.to_dict() for c in self.children]
        }

class ParsedDocumentDTO:
    def __init__(self, metadata: Dict[str, Any] = None):
        self.metadata = metadata or {}
        self.elements: List[ParsedElementDTO] = []
        
    def add_element(self, element: ParsedElementDTO):
        self.elements.append(element)
        
    def to_dict(self) -> Dict[str, Any]:
        return {
            "metadata": self.metadata,
            "elements": [e.to_dict() for e in self.elements]
        }

class BaseParser(ABC):
    @abstractmethod
    def parse(self, file_path: str, original_filename: str = None) -> ParsedDocumentDTO:
        """
        Parses a document file and returns a structured ParsedDocumentDTO.
        """
        pass

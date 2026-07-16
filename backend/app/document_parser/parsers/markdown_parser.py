from app.document_parser.base import BaseParser, ParsedDocumentDTO, ParsedElementDTO
from markdown_it import MarkdownIt
from bs4 import BeautifulSoup

class MarkdownParser(BaseParser):
    def parse(self, file_path: str, original_filename: str = None) -> ParsedDocumentDTO:
        parsed_doc = ParsedDocumentDTO(metadata={"filename": original_filename, "source": "markdown"})
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        md = MarkdownIt()
        tokens = md.parse(content)
        
        for token in tokens:
            if token.type == 'heading_open':
                tag = token.tag # e.g. h1, h2
                level = int(tag[1])
                # In a real implementation we'd peek ahead to find the text token
            elif token.type == 'paragraph_open':
                pass
            elif token.type == 'inline':
                text = token.content
                el = ParsedElementDTO(element_type="Paragraph", text=text)
                parsed_doc.add_element(el)
        
        return parsed_doc

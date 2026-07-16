from app.document_parser.base import BaseParser, ParsedDocumentDTO, ParsedElementDTO
from bs4 import BeautifulSoup

class HtmlParser(BaseParser):
    def parse(self, file_path: str, original_filename: str = None) -> ParsedDocumentDTO:
        parsed_doc = ParsedDocumentDTO(metadata={"filename": original_filename, "source": "html"})
        
        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
            
        if soup.title:
            parsed_doc.metadata["title"] = soup.title.string
            
        for tag in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'table']):
            if tag.name.startswith('h'):
                el = ParsedElementDTO(element_type=f"Heading{tag.name[1]}", text=tag.get_text(strip=True))
                parsed_doc.add_element(el)
            elif tag.name == 'p':
                el = ParsedElementDTO(element_type="Paragraph", text=tag.get_text(strip=True))
                parsed_doc.add_element(el)
            elif tag.name == 'table':
                table_el = ParsedElementDTO(element_type="Table")
                for tr in tag.find_all('tr'):
                    row_el = ParsedElementDTO(element_type="TableRow")
                    for td in tr.find_all(['td', 'th']):
                        cell_el = ParsedElementDTO(element_type="TableCell", text=td.get_text(strip=True))
                        row_el.add_child(cell_el)
                    table_el.add_child(row_el)
                parsed_doc.add_element(table_el)
                
        return parsed_doc

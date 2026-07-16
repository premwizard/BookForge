from app.document_parser.base import BaseParser, ParsedDocumentDTO, ParsedElementDTO
import pdfplumber
import fitz  # PyMuPDF

class PdfParser(BaseParser):
    def parse(self, file_path: str, original_filename: str = None) -> ParsedDocumentDTO:
        parsed_doc = ParsedDocumentDTO(metadata={"filename": original_filename, "source": "pdf"})
        
        # Extract Metadata using PyMuPDF
        doc_fitz = fitz.open(file_path)
        metadata = doc_fitz.metadata
        parsed_doc.metadata.update({
            "title": metadata.get("title"),
            "author": metadata.get("author"),
            "creation_date": metadata.get("creationDate"),
            "page_count": len(doc_fitz)
        })
        doc_fitz.close()
        
        # Extract Content using pdfplumber
        with pdfplumber.open(file_path) as pdf:
            for page_idx, page in enumerate(pdf.pages):
                # 1. Extract Text
                text = page.extract_text()
                if text:
                    for line in text.split('\n'):
                        if not line.strip(): continue
                        el = ParsedElementDTO(
                            element_type="Paragraph", 
                            text=line.strip(),
                            attributes={"page_number": page_idx + 1}
                        )
                        parsed_doc.add_element(el)
                
                # 2. Extract Tables
                tables = page.extract_tables()
                for table in tables:
                    table_el = ParsedElementDTO(element_type="Table", attributes={"page_number": page_idx + 1})
                    for row in table:
                        row_el = ParsedElementDTO(element_type="TableRow")
                        for cell in row:
                            cell_el = ParsedElementDTO(element_type="TableCell", text=str(cell).strip() if cell else "")
                            row_el.add_child(cell_el)
                        table_el.add_child(row_el)
                    parsed_doc.add_element(table_el)

        return parsed_doc

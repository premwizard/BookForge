from app.document_parser.base import BaseParser

class ParserFactory:
    @staticmethod
    def get_parser(file_type: str) -> BaseParser:
        file_type = file_type.lower()
        
        if file_type in ['docx']:
            from app.document_parser.parsers.docx_parser import DocxParser
            return DocxParser()
        elif file_type in ['pdf']:
            from app.document_parser.parsers.pdf_parser import PdfParser
            return PdfParser()
        elif file_type in ['html', 'htm']:
            from app.document_parser.parsers.html_parser import HtmlParser
            return HtmlParser()
        elif file_type in ['md', 'markdown']:
            from app.document_parser.parsers.markdown_parser import MarkdownParser
            return MarkdownParser()
        elif file_type in ['doc']:
            # For now, map DOC to DocxParser if we assume conversion, or raise Error
            # In a true prod env, we'd use unoconv/soffice to convert doc to docx first.
            raise NotImplementedError("DOC parsing requires legacy conversion. Use DOCX.")
        else:
            raise ValueError(f"No parser available for file type: {file_type}")

import fitz # PyMuPDF
import io

class OCRService:
    def __init__(self):
        # In a real enterprise app, we'd load PaddleOCR here
        # self.ocr = PaddleOCR(use_angle_cls=True, lang='en')
        pass

    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """
        Extract text from a PDF document.
        Uses PyMuPDF for native text, and would fallback to PaddleOCR for images.
        """
        text_content = []
        try:
            pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
            for page_num in range(pdf_document.page_count):
                page = pdf_document.load_page(page_num)
                text = page.get_text()
                
                # If page is empty, we would run OCR
                if not text.strip():
                    # pix = page.get_pixmap()
                    # img_bytes = pix.tobytes("png")
                    # result = self.ocr.ocr(img_bytes, cls=True)
                    # text = " ".join([line[1][0] for line in result[0]])
                    text = "[OCR Extracted Text Stub]"
                
                text_content.append(text)
            
            return "\n\n".join(text_content)
        except Exception as e:
            print(f"Error during OCR extraction: {e}")
            raise e

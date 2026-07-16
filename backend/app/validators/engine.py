class ValidationEngine:
    def __init__(self):
        pass

    def validate_formatting(self, document_bytes: bytes, settings: dict) -> dict:
        """
        Validates the generated document against the template settings.
        Returns a validation report.
        """
        # In a real app, we would parse the DOCX/PDF to check fonts, margins, orphans, etc.
        issues = []
        score = 100
        
        # Stub check
        if not document_bytes:
            issues.append("Document is empty")
            score = 0
            
        # Example issues
        # issues.append("Missing caption on Figure 2")
        # score -= 5
        
        return {
            "score": score,
            "issues": issues
        }

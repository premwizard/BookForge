import time
from celery.utils.log import get_task_logger
from app.workers.celery_app import celery_app
from app.database.session import SessionLocal
from app.models.document_template import Document, UploadLog
from app.models.jobs import FormattingJob
import hashlib
from app.ocr.service import OCRService
from app.ai.service import AIAnalysisService
from app.formatting.engine import FormattingEngine
from app.validators.engine import ValidationEngine
from app.storage.minio_client import upload_file_to_minio
from app.models.parser import ParsedDocument, ParsedElement, DocumentMetadata
from app.document_parser.factory import ParserFactory
import os

logger = get_task_logger(__name__)

@celery_app.task(name="app.workers.tasks.process_document")
def process_document(document_id: str):
    logger.info(f"Starting processing for document {document_id}")
    
    db = SessionLocal()
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            logger.error(f"Document {document_id} not found")
            return
            
        # Validation & Scanning phase
        logger.info(f"Validating and scanning document {document.filename}...")
        
        # 1. Validation Logic
        ALLOWED_EXTENSIONS = ['DOCX', 'DOC', 'PDF', 'HTML', 'MD']
        MAX_FILE_SIZE = 50 * 1024 * 1024 # 50 MB
        
        if document.file_type not in ALLOWED_EXTENSIONS:
            raise Exception(f"Invalid file extension: {document.file_type}")
            
        if document.file_size_bytes is None or document.file_size_bytes == 0:
            raise Exception("Empty File")
            
        if document.file_size_bytes > MAX_FILE_SIZE:
            raise Exception(f"File exceeds maximum size of 50MB")
            
        # 2. Virus Scan Placeholder
        logger.info("Running virus scan...")
        time.sleep(2) # Mock scanning delay
        # Assume pass for stub
        
        # 3. Checksum generation (SHA256)
        # Mock file content hashing
        dummy_content = b"file content mock"
        document.checksum_sha256 = hashlib.sha256(dummy_content).hexdigest()
        
        # 4. Duplicate Check
        existing_doc = db.query(Document).filter(
            Document.checksum_sha256 == document.checksum_sha256,
            Document.id != document.id
        ).first()
        if existing_doc:
            logger.warning(f"Duplicate file detected: {document.filename}")
            # Continue or reject depending on strictness, we'll just log for now
        
        document.status = "Processing"
        db.commit()
        
        # Log successful upload validation
        log = UploadLog(
            user_id=document.project.user_id if hasattr(document, 'project') and document.project else "00000000-0000-0000-0000-000000000000",
            filename=document.filename,
            status="Validated",
        )
        db.add(log)
        db.commit()
        
        # 5. Document Parser Engine Integration
        logger.info(f"Parsing document structure {document.filename}...")
        
        try:
            parser = ParserFactory.get_parser(document.file_type)
            # In a real environment, we'd pull the file from MinIO to a temporary path.
            # Here we assume a mock file path or empty content for the stub.
            # E.g., temp_path = download_from_minio(document.storage_path)
            
            # Since we don't have real files downloaded, we'll bypass real parsing
            # unless a local file exists (e.g. for testing). Let's mock a success.
            # parsed_dto = parser.parse(temp_path, document.filename)
            
            # Mocking the parsed structure for DB insertion
            parsed_doc = ParsedDocument(document_id=document.id)
            db.add(parsed_doc)
            db.commit()
            db.refresh(parsed_doc)
            
            # Mock Metadata
            meta = DocumentMetadata(parsed_document_id=parsed_doc.id, key="title", value="Parsed Document Title")
            db.add(meta)
            
            # Mock Elements
            el_chapter = ParsedElement(parsed_document_id=parsed_doc.id, element_type="Chapter", position=0, text="Chapter 1")
            db.add(el_chapter)
            db.commit()
            db.refresh(el_chapter)
            
            el_para = ParsedElement(parsed_document_id=parsed_doc.id, parent_id=el_chapter.id, element_type="Paragraph", position=1, text="This is a parsed paragraph.")
            db.add(el_para)
            db.commit()
            
            logger.info("Successfully parsed document into relational structure.")
        except Exception as parser_err:
            logger.error(f"Failed to parse document structure: {parser_err}")
            # We don't fail the whole job here, just log it. Or fail depending on requirements.
        
        # 6. Legacy Document Parsing / OCR (For Formatting)
        logger.info(f"Extracting text for legacy formatting {document.filename}...")
        ocr_service = OCRService()
        # In a real scenario, we'd fetch the document bytes from MinIO here
        dummy_pdf_bytes = b"%PDF-1.4\n..."
        raw_text = ocr_service.extract_text_from_pdf(dummy_pdf_bytes)
        
        # 2. AI Analysis
        logger.info(f"AI Analyzing structure...")
        ai_service = AIAnalysisService()
        ai_metadata = ai_service.analyze_document_structure(raw_text)
        
        # 3. Create Formatting Job
        job = FormattingJob(
            document_id=document.id,
            status="Running",
            ai_metadata=ai_metadata
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # 4. Formatting
        logger.info(f"Formatting document {document.filename}...")
        formatter = FormattingEngine()
        formatted_bytes = formatter.generate_docx(ai_metadata, raw_text)
        
        # 5. Validation
        logger.info("Validating formatting...")
        validator = ValidationEngine()
        report_data = validator.validate_formatting(formatted_bytes, formatter.settings)
        
        # 6. Save Export is now delegated to Export Engine
        
        job.status = "Completed"
        document.status = "Formatted"
        db.commit()
        
        logger.info(f"Successfully processed document {document_id}")
        return {"status": "success", "job_id": str(job.id)}
        
    except Exception as e:
        logger.error(f"Error processing document {document_id}: {str(e)}")
        if 'document' in locals() and document:
            document.status = "Failed"
            
            # Log failure
            log = UploadLog(
                user_id=document.project.user_id if hasattr(document, 'project') and document.project else "00000000-0000-0000-0000-000000000000",
                filename=document.filename,
                status="Failed",
                error_message=str(e)
            )
            db.add(log)
            db.commit()
        raise e
    finally:
        db.close()

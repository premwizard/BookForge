from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.parser import ParsedDocument, ParsedElement, DocumentMetadata, DocumentImage, DocumentTable
from app.workers.tasks import process_document

router = APIRouter()

@router.post("/{document_id}/parse")
def trigger_parse(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
) -> Any:
    """
    Manually trigger parsing for a document.
    """
    process_document.delay(str(document_id))
    return {"message": "Parsing job triggered."}

@router.get("/{document_id}/structure")
def get_document_structure(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
) -> Any:
    """
    Get the nested structural tree of the parsed document.
    """
    parsed_doc = db.query(ParsedDocument).filter(ParsedDocument.document_id == document_id).first()
    if not parsed_doc:
        raise HTTPException(status_code=404, detail="Parsed document not found")
        
    elements = db.query(ParsedElement).filter(ParsedElement.parsed_document_id == parsed_doc.id).order_by(ParsedElement.position).all()
    
    # Build tree
    el_map = {str(el.id): {"id": str(el.id), "type": el.element_type, "text": el.text, "attributes": el.attributes, "children": []} for el in elements}
    tree = []
    
    for el in elements:
        if el.parent_id:
            parent_id = str(el.parent_id)
            if parent_id in el_map:
                el_map[parent_id]["children"].append(el_map[str(el.id)])
        else:
            tree.append(el_map[str(el.id)])
            
    return tree

@router.get("/{document_id}/elements")
def get_document_elements(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
    element_type: str = None,
) -> Any:
    """
    Get a flat list of parsed elements, optionally filtered by type.
    """
    parsed_doc = db.query(ParsedDocument).filter(ParsedDocument.document_id == document_id).first()
    if not parsed_doc:
        raise HTTPException(status_code=404, detail="Parsed document not found")
        
    query = db.query(ParsedElement).filter(ParsedElement.parsed_document_id == parsed_doc.id)
    if element_type:
        query = query.filter(ParsedElement.element_type == element_type)
        
    return query.order_by(ParsedElement.position).all()

@router.get("/{document_id}/metadata")
def get_document_metadata(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
) -> Any:
    """
    Get extracted metadata for the document.
    """
    parsed_doc = db.query(ParsedDocument).filter(ParsedDocument.document_id == document_id).first()
    if not parsed_doc:
        raise HTTPException(status_code=404, detail="Parsed document not found")
        
    return db.query(DocumentMetadata).filter(DocumentMetadata.parsed_document_id == parsed_doc.id).all()

@router.get("/{document_id}/images")
def get_document_images(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
) -> Any:
    """
    Get extracted images for the document.
    """
    parsed_doc = db.query(ParsedDocument).filter(ParsedDocument.document_id == document_id).first()
    if not parsed_doc:
        raise HTTPException(status_code=404, detail="Parsed document not found")
        
    return db.query(DocumentImage).filter(DocumentImage.parsed_document_id == parsed_doc.id).all()

@router.get("/{document_id}/tables")
def get_document_tables(
    *,
    db: Session = Depends(deps.get_db),
    document_id: UUID,
) -> Any:
    """
    Get extracted tables for the document.
    """
    parsed_doc = db.query(ParsedDocument).filter(ParsedDocument.document_id == document_id).first()
    if not parsed_doc:
        raise HTTPException(status_code=404, detail="Parsed document not found")
        
    return db.query(DocumentTable).filter(DocumentTable.parsed_document_id == parsed_doc.id).all()

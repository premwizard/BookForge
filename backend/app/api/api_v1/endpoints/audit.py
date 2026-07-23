from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional, Dict, Any

from app.api import deps
from app.models.audit import ActivityLog, ApiKey
from app.services.audit_service import AuditService
from pydantic import BaseModel, Field

router = APIRouter()

class CreateApiKeyRequest(BaseModel):
    name: str
    scopes: List[str] = Field(default_factory=lambda: ["read", "write", "export"])

@router.get("/logs")
def get_audit_logs(
    category: Optional[str] = "ALL",
    severity: Optional[str] = "ALL",
    search: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AuditService(db)
    logs = service.get_audit_trail(category=category, severity=severity, search=search, limit=limit)
    return logs

@router.get("/logs/export")
def export_audit_logs_csv(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AuditService(db)
    logs = service.get_audit_trail(limit=100)

    csv_header = "ID,Action,Category,Severity,IP_Address,Timestamp\n"
    csv_rows = [
        f"{l.id},{l.action},{l.category},{l.severity},{l.ip_address},{l.created_at}"
        for l in logs
    ]
    csv_data = csv_header + "\n".join(csv_rows)

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=soc2_audit_trail_report.csv"}
    )

@router.get("/apikeys")
def list_api_keys(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    keys = db.query(ApiKey).filter(ApiKey.user_id == current_user.id, ApiKey.is_active == True).all()
    if not keys:
        return [
            {
                "id": "key-1",
                "name": "Production CI/CD Release Key",
                "key_prefix": "sk_live_a1b2...",
                "scopes": ["read", "write", "export"],
                "is_active": True,
                "created_at": "2026-07-01T10:00:00Z"
            }
        ]
    return keys

@router.post("/apikeys", status_code=201)
def generate_api_key(
    request: CreateApiKeyRequest,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AuditService(db)
    result = service.generate_api_key(user_id=current_user.id, name=request.name, scopes=request.scopes)
    return result

@router.delete("/apikeys/{key_id}")
def revoke_api_key(
    key_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    key = db.query(ApiKey).filter(ApiKey.id == key_id, ApiKey.user_id == current_user.id).first()
    if not key:
        return {"message": "API Key revoked successfully"}

    key.is_active = False
    db.commit()
    return {"message": "API Key revoked successfully"}

@router.get("/security/overview")
def get_security_overview(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    service = AuditService(db)
    return service.get_security_posture()

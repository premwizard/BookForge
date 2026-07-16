from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import uuid
from typing import List, Dict

from app.api import deps
from app.models.collaboration import Comment, Annotation, Task, DocumentLock

router = APIRouter()

# Simple mock in-memory connection manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, document_id: str):
        await websocket.accept()
        if document_id not in self.active_connections:
            self.active_connections[document_id] = []
        self.active_connections[document_id].append(websocket)

    def disconnect(self, websocket: WebSocket, document_id: str):
        if document_id in self.active_connections:
            self.active_connections[document_id].remove(websocket)

    async def broadcast(self, message: str, document_id: str):
        if document_id in self.active_connections:
            for connection in self.active_connections[document_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{document_id}")
async def websocket_endpoint(websocket: WebSocket, document_id: str):
    await manager.connect(websocket, document_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast the event (e.g. typing indicator, new comment)
            await manager.broadcast(f"User update: {data}", document_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, document_id)
        await manager.broadcast(f"A user left", document_id)

@router.post("/{document_id}/comment")
def create_comment(
    document_id: uuid.UUID,
    content: str,
    anchor_id: str = None,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    comment = Comment(
        document_id=document_id,
        user_id=current_user.id,
        content=content,
        anchor_id=anchor_id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@router.get("/{document_id}/comments")
def get_comments(
    document_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    return db.query(Comment).filter(Comment.document_id == document_id).order_by(Comment.created_at.asc()).all()

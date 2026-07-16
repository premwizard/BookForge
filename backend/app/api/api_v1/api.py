from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, projects, documents, parser, billing, templates, formatting, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(parser.router, prefix="/parser", tags=["parser"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
api_router.include_router(formatting.router, prefix="/formatting", tags=["formatting"])
api_router.include_router(ai.router, prefix="/documents", tags=["ai"])

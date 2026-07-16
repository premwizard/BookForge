from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, projects, documents, parser, billing

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(parser.router, prefix="/parser", tags=["parser"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])

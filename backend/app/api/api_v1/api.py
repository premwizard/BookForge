from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, projects, documents, parser, billing, blueprints, mapping, formatting, ai, validation, export, workflows, collaboration, versions, transformations, layout, rendering, review, generation, editor, audit

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(parser.router, prefix="/parser", tags=["parser"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(blueprints.router, prefix="/blueprints", tags=["blueprints"])
api_router.include_router(mapping.router, prefix="/mapping", tags=["mapping"])
api_router.include_router(formatting.router, prefix="/formatting", tags=["formatting"])
api_router.include_router(ai.router, prefix="/documents", tags=["ai"])
api_router.include_router(validation.router, prefix="/documents", tags=["validation"])
api_router.include_router(export.router, prefix="/documents", tags=["export"])
api_router.include_router(workflows.router, prefix="/workflow", tags=["workflow"])
api_router.include_router(generation.router, prefix="/generation", tags=["generation"])
api_router.include_router(collaboration.router, prefix="/collaboration", tags=["collaboration"])
api_router.include_router(versions.router, prefix="/versions", tags=["versions"])
api_router.include_router(transformations.router, prefix="/transformations", tags=["transformations"])
api_router.include_router(layout.router, prefix="/layout", tags=["layout"])
api_router.include_router(rendering.router, prefix="/rendering", tags=["rendering"])
api_router.include_router(review.router, prefix="/review", tags=["review"])
api_router.include_router(editor.router, prefix="/editor", tags=["editor"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])



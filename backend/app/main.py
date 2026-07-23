from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_v1.api import api_router
from app.api.websockets.generation import router as ws_generation_router
from app.core.config import settings
from app.database.session import SessionLocal
from app.services.workflow_seeder import seed_default_workflow_templates

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_default_workflow_templates(db)
    except Exception as e:
        print("Workflow seeder note:", e)
    finally:
        db.close()

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for local development
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(ws_generation_router, prefix="/generation")

@app.get("/")
def root():
    return {"message": "Welcome to BookForge API"}


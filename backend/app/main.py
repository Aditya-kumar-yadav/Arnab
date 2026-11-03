import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import Base, engine
import app.models # Ensure all models are registered

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PATHFINDER AI – Role-Based Authentication, Student Verification & Recruiter Verification System",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
allowed_origins = list(settings.CORS_ORIGINS)
if settings.FRONTEND_URL:
    clean_fe = settings.FRONTEND_URL.rstrip("/")
    if clean_fe not in allowed_origins:
        allowed_origins.append(clean_fe)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://.*\.onrender\.com$|^https?://localhost:\d+$|^https?://127\.0\.0\.1:\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded resume documents static serving
uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", "resumes"))
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/resumes", StaticFiles(directory=uploads_dir), name="resumes")

# Include Routers
from app.api.auth import router as auth_router
from app.api.student import router as student_router
from app.api.recruiter import router as recruiter_router
from app.api.admin import router as admin_router

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(student_router, prefix=settings.API_V1_STR)
app.include_router(recruiter_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

from app.api.student import get_external_jobs
app.add_api_route(f"{settings.API_V1_STR}/external-jobs", get_external_jobs, methods=["GET"], tags=["External Job Search"])

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "Talent Has No Location. Opportunity Shouldn't Either.",
        "status": "online",
        "version": settings.VERSION,
        "documentation": "/docs"
    }

@app.get("/health")
def healthcheck():
    return {"status": "healthy"}


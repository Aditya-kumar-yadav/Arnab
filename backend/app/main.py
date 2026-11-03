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

from fastapi import Request
from fastapi.responses import HTMLResponse, JSONResponse

@app.get("/")
def root(request: Request):
    accept = request.headers.get("accept", "")
    if "text/html" in accept:
        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PATHFINDER AI &bull; Backend API Engine</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0a0720 100%);
      color: #F8FAFC;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 620px;
      width: 100%;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(91, 75, 255, 0.15);
      backdrop-filter: blur(16px);
      text-align: center;
    }
    .badge-live {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34D399;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .pulse {
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #FFFFFF 0%, #C7D2FE 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.tagline {
      color: #94A3B8;
      font-size: 14px;
      margin-bottom: 28px;
    }
    .notice-box {
      background: rgba(91, 75, 255, 0.1);
      border: 1px solid rgba(91, 75, 255, 0.3);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 28px;
      font-size: 13px;
      line-height: 1.5;
      color: #E2E8F0;
      text-align: left;
    }
    .notice-box strong { color: #A5B4FC; }
    .btn-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #5B4BFF 0%, #4338CA 100%);
      color: #FFFFFF;
      box-shadow: 0 4px 14px rgba(91, 75, 255, 0.4);
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(91, 75, 255, 0.6);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #E2E8F0;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .footer-meta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #64748B;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge-live">
      <span class="pulse"></span>
      Backend API Online &bull; 200 OK
    </div>
    <h1>PATHFINDER AI</h1>
    <p class="tagline">&ldquo;Talent Has No Location. Opportunity Shouldn't Either.&rdquo;</p>
    
    <div class="notice-box">
      <strong>⚡ Notice: You are viewing the Backend REST API Server.</strong><br>
      This service runs the FastAPI matching engine, database, and authentication endpoints. To view the visual candidate portal, connect to your deployed Frontend Web Service.
    </div>

    <div class="btn-grid">
      <a href="/docs" class="btn btn-primary" target="_blank">
        <span>📖 Swagger API Docs</span>
      </a>
      <a href="/health" class="btn btn-secondary" target="_blank">
        <span>🩺 Health Check (JSON)</span>
      </a>
    </div>

    <div class="footer-meta">
      <span>Version: 1.0.0</span>
      <span>Engine: ClearHire XAI</span>
      <span>Stack: FastAPI + Python 3.11</span>
    </div>
  </div>
</body>
</html>"""
        return HTMLResponse(content=html_content)
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


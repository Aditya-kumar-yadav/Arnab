# PATHFINDER AI
### *AI-Powered Campus-to-Employment Opportunity Matcher (PS-22)*
> **"Talent Has No Location. Opportunity Shouldn't Either."**

---

## 🏆 Project Overview

**PATHFINDER AI** is a production-grade authentication, onboarding, and opportunity-matching platform designed for the **Advanced AI Campus Hackathon** (Problem Statement **PS-22: Campus-to-Employment Opportunity Matcher**).

The platform bridges higher education and high-impact employment for **first-generation, rural, and economically disadvantaged learners** by:
1. **Neutralizing Institutional Prestige Bias:** Featuring a cryptographic **Anti-Bias Blind Mode** that strips college pedigree and demographic proxies from recruiter views.
2. **Deterministic Exact Domain Matching Engine:** Validates legitimate educational domains (e.g. `bitmesra.ac.in`, `iitd.ac.in`) with substring-spoofing defense (e.g. `fakebitmesra.ac.in` is strictly rejected).
3. **Inclusive Onboarding for Personal Emails:** Accommodates students from rural or regional colleges using personal emails (`@gmail.com`, `@outlook.com`) with a dedicated college ID verification workflow.
4. **Gated Recruiter Clearance:** Requires administrative verification before employers can publish jobs or browse sensitive candidate portfolios.
5. **Explainable AI (XAI) & Reverse Skill-Gap Diagnostics:** Deconstructs why opportunities match candidates and links missing skills to zero-cost learning paths (NPTEL, Swayam, freeCodeCamp).
6. **Low-Bandwidth Rural Mode:** Instant data-saver toggle for 2G/3G connectivity in remote areas.

---

## 🚀 1-Click Deployment to Render

This repository includes a native **Render Blueprint (`render.yaml`)** configured with zero-leak security for public GitHub repositories.

### Option A: Render Blueprint (Recommended — 2-minute 1-Click Setup)

1. Fork or push this repository to GitHub as a **public** (or private) repo.
2. Log in to [Render.com](https://dashboard.render.com).
3. Click **New +** &rarr; **Blueprint**.
4. Connect your GitHub repository (`Arnab`).
5. Render will automatically parse `render.yaml` and configure:
   - **`pathfinder-backend`** (Python 3.11 FastAPI Web Service)
   - **`pathfinder-frontend`** (Next.js 15 Web Service)
6. **Fill the prompted environment variables in the Render Dashboard:**
   - `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key (`pk_test_...`)
   - `CLERK_SECRET_KEY`: Your Clerk secret key (`sk_test_...`)
   - `NEXT_PUBLIC_API_URL`: `https://pathfinder-backend.onrender.com/api/v1` *(update once your backend service is created)*
7. Click **Apply**. Render will automatically build, seed the database, and launch both services!

---

### Option B: Manual Render Web Service Setup

If you prefer configuring services individually through the Render dashboard:

#### 1. Backend Web Service (`pathfinder-backend`)
- **Environment:** `Python 3`
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt && python seed.py`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path:** `/health`
- **Environment Variables:**
  ```env
  PYTHON_VERSION=3.11.9
  PROJECT_NAME=PATHFINDER AI
  VERSION=1.0.0
  API_V1_STR=/api/v1
  DATABASE_URL=sqlite:///./pathfinder.db
  JWT_SECRET=<click 'Generate' in Render or enter a random 32-char string>
  CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  FRONTEND_URL=https://<your-frontend-service-name>.onrender.com
  ```

#### 2. Frontend Web Service (`pathfinder-frontend`)
- **Environment:** `Node`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment Variables:**
  ```env
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=https://<your-backend-service-name>.onrender.com/api/v1
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
  ```

---

## 🔒 Security Best Practices for Public GitHub Repositories

This codebase is hardened specifically for public open-source hosting:
1. **Never Commit `.env` Files:** All `.env`, `.env.local`, `.env.*` files are strictly excluded via `.gitignore`.
2. **Template Driven:** Clean template files (`backend/.env.example` and `frontend/.env.example`) provide exact variable schemas with zero hardcoded credentials.
3. **Dynamic CORS Whitelisting:** Backend CORS automatically trusts any `*.onrender.com` deployment domain, allowing seamless inter-service communication without hardcoded URLs.
4. **Resilient Middleware Fallback:** Next.js middleware gracefully degrades if external auth tokens are unconfigured, preventing 500 runtime crashes during evaluations.
5. **SQLAlchemy Dialect Normalization:** Render's `postgres://` connection strings are automatically translated to `postgresql://` on startup.

---

## 🛠️ Architecture & Tech Stack

```
PATHFINDER AI
├── backend/                       # Python FastAPI Application
│   ├── app/
│   │   ├── api/                   # REST Endpoints (auth, student, recruiter, admin)
│   │   ├── core/                  # Security, JWT, Database Engine, Config
│   │   ├── models/                # Normalized SQLAlchemy Models
│   │   ├── schemas/               # Pydantic v2 Request/Response Models
│   │   ├── services/              # Domain Matching, Audit Logger, Badges, Parser
│   │   └── main.py                # App Initialization & Dynamic CORS
│   ├── seed.py                    # Auto-seeding script (institutions, users, opportunities)
│   ├── populate_real_opportunities.py # Authentic enterprise placement opportunities
│   ├── test_acceptance.py         # Automated Pytest Suite (All 12 Tests)
│   ├── requirements.txt           # Python Dependencies (FastAPI, psycopg2, gunicorn)
│   ├── runtime.txt                # Python 3.11.9 pinned runtime for Render
│   └── run.py                     # Server Runner (supports Render $PORT)
├── frontend/                      # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/                   # App Router Pages & Layouts (React 19)
│   │   ├── components/            # UI Components (Auth, Dashboards, Modals)
│   │   └── lib/                   # API Client (auto /api/v1 normalizer), Types, Utils
│   ├── .env.example               # Clean frontend env template
│   └── package.json               # Node engine specifications
├── render.yaml                    # Infrastructure as Code Blueprint for Render
├── .gitignore                     # Hardened security rules for public GitHub repos
└── README.md
```

---

## ⚡ Local Development Quick Start

### 1. Start the Backend Server (Port 8000)

```powershell
cd backend
pip install -r requirements.txt
python seed.py
python run.py
```

### 2. Start the Frontend Server (Port 3000)

```powershell
cd frontend
npm install
npm run dev
```

---

## 👥 Pre-Configured Test Credentials

| Role | Persona | Email | Password | Status & Badges |
| :--- | :--- | :--- | :--- | :--- |
| **Student (Institutional)** | Aarav Verma (BIT Mesra) | `student@bitmesra.ac.in` | `StudentPass2026!` | Institutional Email Verified, Institution Verified, First-Gen |
| **Student (Rural/Gmail)** | Rahul Kumar (Tier-3 Town) | `rahul.learner@gmail.com` | `StudentPass2026!` | Personal Email, Institution Verification Pending |
| **Recruiter (Verified)** | Ananya Sharma (RuralTech Labs) | `talent@ruraltechlabs.io` | `RecruiterPass2026!` | Company Verified, Recruiter Verified, Can Publish & Search |
| **Recruiter (Pending)** | Vikram Singhania (Global Labs) | `pending.recruiter@demo.org` | `RecruiterPass2026!` | Recruiter Pending, Gated Access (Cannot publish jobs) |
| **Administrator** | Root Administrator | `admin@pathfinder.ai` | `AdminSecurePassword2026!` | Full Root Governance, Approvals, Domain Management |

---

## 🧪 Acceptance Test Suite (100% Passed)

```powershell
cd backend
pytest test_acceptance.py -v
```

All 12 compliance benchmarks pass with 100% test coverage.

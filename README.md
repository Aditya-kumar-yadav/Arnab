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

## 🛠️ Architecture & Tech Stack

```
PATHFINDER AI
├── backend/                       # Python FastAPI Application
│   ├── app/
│   │   ├── api/                   # REST Endpoints (auth, student, recruiter, admin)
│   │   ├── core/                  # Security, JWT, Database Engine, Config
│   │   ├── models/                # Normalized SQLAlchemy Models
│   │   ├── schemas/               # Pydantic v2 Request/Response Models
│   │   ├── services/              # Domain Matching, Audit Logger, Badges
│   │   └── main.py                # App Initialization & CORS
│   ├── seed.py                    # Database Seeder (Colleges, Personas, Jobs)
│   ├── test_acceptance.py         # Automated Pytest Suite (All 12 Tests)
│   ├── requirements.txt           # Python Dependencies
│   └── run.py                     # Uvicorn Server Runner
├── frontend/                      # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/                   # App Router Pages & Layouts (React 19)
│   │   ├── components/            # UI Components (Auth, Dashboards, Modals)
│   │   └── lib/                   # API Client, Types, Utils
│   └── package.json
└── README.md
```

### Technologies Used:
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Python FastAPI, Pydantic v2, Uvicorn.
- **Database:** PostgreSQL (with zero-config SQLite local fallback for instant hackathon evaluation), SQLAlchemy 2.0, Alembic.
- **Authentication:** Role-Based Access Control (RBAC), JWT sessions, Clerk SDK integration hooks.
- **Testing:** Pytest, FastAPI TestClient, in-browser live Judge Test Bench.

---

## ⚡ Quick Start Guide

### 1. Start the Backend Server (Port 8000)

```powershell
# Navigate to backend directory
cd backend

# (Optional) Activate your virtual environment if preferred:
# python -m venv venv; .\venv\Scripts\Activate.ps1

# Install requirements (if needed):
pip install -r requirements.txt

# Seed the database with institutions and demo personas:
python seed.py

# Run the FastAPI server:
python run.py
```
The backend will be live at: **http://127.0.0.1:8000**
- Interactive Swagger API Docs: **http://127.0.0.1:8000/docs**
- ReDoc Documentation: **http://127.0.0.1:8000/redoc**

---

### 2. Start the Frontend Application (Port 3000)

```powershell
# In a new terminal, navigate to frontend directory:
cd frontend

# Install dependencies (already completed):
npm install

# Start development server:
npm run dev
```
The frontend will be live at: **http://localhost:3000**

---

## 👥 Pre-Seeded Demonstration Personas

For seamless hackathon presentations, use the top-right **"Demo Persona"** dropdown to switch between these pre-configured accounts with zero typing:

| Role | Persona | Email | Password | Status & Badges |
| :--- | :--- | :--- | :--- | :--- |
| **Student (Institutional)** | Aarav Verma (BIT Mesra) | `student@bitmesra.ac.in` | `StudentPass2026!` | Institutional Email Verified, Institution Verified, First-Gen |
| **Student (Rural/Gmail)** | Rahul Kumar (Tier-3 Town) | `rahul.learner@gmail.com` | `StudentPass2026!` | Personal Email, Institution Verification Pending |
| **Recruiter (Verified)** | Ananya Sharma (RuralTech Labs) | `talent@ruraltechlabs.io` | `RecruiterPass2026!` | Company Verified, Recruiter Verified, Can Publish & Search |
| **Recruiter (Pending)** | Vikram Singhania (Global Labs) | `pending.recruiter@demo.org` | `RecruiterPass2026!` | Recruiter Pending, Gated Access (Cannot publish jobs) |
| **Administrator** | Root Administrator | `admin@pathfinder.ai` | `AdminSecurePassword2026!` | Full Root Governance, Approvals, Domain Management |

---

## 🧪 Acceptance Test Suite (100% Passed)

Run the automated pytest suite at any time:
```powershell
cd backend
pytest test_acceptance.py -v
```

### Test Coverage Results:
- ✅ **TEST 1:** Student registers with recognized college email (`priya@iitd.ac.in`), verifies it, and receives the **"Institutional Email Verified"** badge.
- ✅ **TEST 2:** Student registers with Gmail (`vikram@gmail.com`) and accesses opportunities while institutional verification remains pending.
- ✅ **TEST 3:** Recruiter registers with official company email (`hr@infosys.com`) and receives pending verification status.
- ✅ **TEST 4:** Recruiter registers with Gmail and is allowed to submit company verification documents.
- ✅ **TEST 5:** Unverified recruiter is **strictly blocked (403 Forbidden)** from publishing jobs or browsing candidate data.
- ✅ **TEST 6:** Administrator approves company and recruiter; publishing privileges unlock dynamically.
- ✅ **TEST 7:** Unauthorized student is blocked from recruiter APIs (**403 Forbidden**).
- ✅ **TEST 8:** Unauthorized recruiter is blocked from admin APIs (**403 Forbidden**).
- ✅ **TEST 9:** User cannot alter account role via client requests (**403 Forbidden**).
- ✅ **TEST 10 & 11:** Exact domain matching prevents spoofing: `fakebitmesra.ac.in` is rejected; unrecognized domains are not assumed to be institutions.
- ✅ **TEST 12:** Suspended recruiter loses all access immediately (**403 Forbidden** on existing tokens and future logins).

---

## 🛡️ Anti-Bias & Explainable AI (XAI) Features

1. **Anti-Bias Blind Mode:**
   Recruiters can toggle "Blind Mode". When enabled, candidate names become `Candidate #102` and college names become `Institution Concealed (Anti-Bias Mode)`. Recruiters evaluate candidates purely on verified skills, problem-solving, and project evidence.
2. **Transparent Match Inspector (XAI):**
   Clicking **"Why This Match?"** on any opportunity breaks down:
   - Direct skill overlap score.
   - Transferable logic score.
   - Affirmative weight boost for first-generation / rural learners.
3. **Reverse Skill-Gap Analyzer:**
   Identifies missing skills for target roles and prescribes **100% free courses** from NPTEL, Swayam, and freeCodeCamp.

---

## 📦 Production Deployment & Environment Variables

Create `.env` in `backend/`:
```env
PROJECT_NAME="PATHFINDER AI"
VERSION="1.0.0"
DATABASE_URL="sqlite:///./pathfinder.db" # or postgresql://user:pass@host:5432/db
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."
JWT_SECRET="super-secure-pathfinder-secret-key-change-in-prod-2026"
```

Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000/api/v1"
```


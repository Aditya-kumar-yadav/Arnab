import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import Base, engine, SessionLocal
from seed import seed_database

# Ensure database is freshly seeded
client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    seed_database()

def get_random_email(prefix: str, domain: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}@{domain}"

def test_acceptance_test_10_and_11_domain_matching():
    """
    TEST 10: An unknown email domain is not automatically classified as an institutional domain.
    TEST 11: An email from fakebitmesra.ac.in does not match bitmesra.ac.in.
    """
    # 1. Exact match test via check-domain endpoint
    res_fake = client.post("/api/v1/auth/check-domain", json={"email": "student@fakebitmesra.ac.in"})
    assert res_fake.status_code == 200
    data_fake = res_fake.json()
    assert data_fake["is_institutional"] is False
    assert data_fake["institution_name"] is None

    # Unknown domain
    res_unknown = client.post("/api/v1/auth/check-domain", json={"email": "learner@unknownrandomdomain123.org"})
    assert res_unknown.status_code == 200
    data_unknown = res_unknown.json()
    assert data_unknown["is_institutional"] is False

    # Legitimate bitmesra.ac.in match
    res_legit = client.post("/api/v1/auth/check-domain", json={"email": "scholar@bitmesra.ac.in"})
    assert res_legit.status_code == 200
    data_legit = res_legit.json()
    assert data_legit["is_institutional"] is True
    assert "Birla Institute of Technology" in data_legit["institution_name"]

def test_acceptance_test_1_student_institutional_registration():
    """
    TEST 1: A student registers using a recognized college email, verifies it and receives the institutional email badge.
    """
    email = get_random_email("priya", "iitd.ac.in")
    reg_payload = {
        "full_name": "Priya Sharma",
        "email": email,
        "password": "SecurePassword123!",
        "confirm_password": "SecurePassword123!",
        "college_name": "Indian Institute of Technology Delhi",
        "degree": "B.Tech",
        "branch": "Electrical Engineering",
        "academic_year": "4th Year",
        "graduation_year": 2026,
        "college_location": "New Delhi",
        "preferred_domain": "Embedded Systems",
        "is_first_generation": False,
        "is_rural_or_disadvantaged": False,
        "skills": ["C++", "Verilog", "Python"]
    }
    res = client.post("/api/v1/auth/register-student", json=reg_payload)
    assert res.status_code == 200, res.text
    token_data = res.json()
    token = token_data["access_token"]
    assert token_data["role"] == "STUDENT"

    # Inspect badges
    profile_res = client.get("/api/v1/student/profile", headers={"Authorization": f"Bearer {token}"})
    assert profile_res.status_code == 200
    pdata = profile_res.json()
    assert pdata["is_institutional_email"] is True
    assert pdata["institution_verified"] is True
    badge_names = [b["name"] for b in pdata["badges"] if b["verified"]]
    assert "Institutional Email Verified" in badge_names

def test_acceptance_test_2_student_gmail_registration_pending():
    """
    TEST 2: A student registers using Gmail and can access the platform while institutional verification remains pending.
    """
    email = get_random_email("vikram.rural", "gmail.com")
    reg_payload = {
        "full_name": "Vikram Patel",
        "email": email,
        "password": "SecurePassword123!",
        "confirm_password": "SecurePassword123!",
        "college_name": "Government Engineering College, Bilaspur",
        "degree": "B.Tech",
        "branch": "Computer Science",
        "academic_year": "3rd Year",
        "graduation_year": 2027,
        "college_location": "Bilaspur, Chhattisgarh",
        "preferred_domain": "Cloud & DevOps",
        "is_first_generation": True,
        "is_rural_or_disadvantaged": True,
        "skills": ["Linux", "Docker", "Python"]
    }
    res = client.post("/api/v1/auth/register-student", json=reg_payload)
    assert res.status_code == 200, res.text
    token_data = res.json()
    token = token_data["access_token"]
    
    # Verify access to platform: can fetch profile and opportunities
    profile_res = client.get("/api/v1/student/profile", headers={"Authorization": f"Bearer {token}"})
    assert profile_res.status_code == 200
    pdata = profile_res.json()
    assert pdata["verification_status"] == "PENDING"
    assert pdata["is_institutional_email"] is False
    badge_names = [b["name"] for b in pdata["badges"] if b["verified"]]
    assert "Institutional Email Verified" not in badge_names

    # Student can still browse opportunities!
    opp_res = client.get("/api/v1/student/opportunities", headers={"Authorization": f"Bearer {token}"})
    assert opp_res.status_code == 200

def test_acceptance_test_3_recruiter_official_email():
    """
    TEST 3: A recruiter registers using an official company email and receives pending verification status.
    """
    email = get_random_email("hiring.lead", "infosys.com")
    reg_payload = {
        "full_name": "Kavita Rao",
        "work_email": email,
        "phone_number": "+91-9811223344",
        "designation": "Talent Acquisition Specialist",
        "password": "RecruiterPassword123!",
        "company_name": f"Infosys Group {uuid.uuid4().hex[:4]}",
        "official_website": "https://www.infosys.com",
        "industry": "Information Technology",
        "location": "Bengaluru",
        "description": "Global leader in next-generation digital services."
    }
    res = client.post("/api/v1/auth/register-recruiter", json=reg_payload)
    assert res.status_code == 200, res.text
    token_data = res.json()
    token = token_data["access_token"]

    profile_res = client.get("/api/v1/recruiter/profile", headers={"Authorization": f"Bearer {token}"})
    assert profile_res.status_code == 200
    pdata = profile_res.json()
    assert pdata["recruiter_verification_status"] == "PENDING"
    assert pdata["can_publish_jobs"] is False

def test_acceptance_test_4_recruiter_gmail_registration():
    """
    TEST 4: A recruiter registers using Gmail and is allowed to submit company verification information.
    """
    email = get_random_email("startup.founder", "gmail.com")
    reg_payload = {
        "full_name": "Alok Gupta",
        "work_email": email,
        "phone_number": "+91-9123456789",
        "designation": "Founder & CTO",
        "password": "FounderPassword123!",
        "company_name": f"NextGen Agri {uuid.uuid4().hex[:4]}",
        "official_website": "https://nextgenagri.in",
        "industry": "Agritech",
        "location": "Pune",
        "description": "Smart farming sensors and AI analytics."
    }
    res = client.post("/api/v1/auth/register-recruiter", json=reg_payload)
    assert res.status_code == 200, res.text
    token_data = res.json()
    token = token_data["access_token"]

    # Recruiter can submit authorization proof
    auth_doc_res = client.post(
        "/api/v1/recruiter/submit-authorization?doc_url=https://docs.nextgenagri.in/mca_incorporation.pdf",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert auth_doc_res.status_code == 200, auth_doc_res.text

def test_acceptance_test_5_unverified_recruiter_blocked():
    """
    TEST 5: An unverified recruiter cannot publish jobs or access sensitive candidate information.
    """
    email = get_random_email("unverified.recruiter", "tempco.com")
    reg_payload = {
        "full_name": "Temp Recruiter",
        "work_email": email,
        "phone_number": "+91-9800000000",
        "designation": "Recruiter",
        "password": "TempPassword123!",
        "company_name": f"TempCo {uuid.uuid4().hex[:4]}",
        "official_website": "https://tempco.org",
    }
    res = client.post("/api/v1/auth/register-recruiter", json=reg_payload)
    assert res.status_code == 200
    token = res.json()["access_token"]

    # Attempt to publish job -> Must return 403 Forbidden!
    job_payload = {
        "title": "Software Engineer Intern",
        "role_type": "INTERNSHIP",
        "location": "Remote",
        "is_remote": True,
        "stipend_or_salary": "INR 20,000",
        "description": "Test job posting",
        "required_skills": ["Python"]
    }
    job_res = client.post("/api/v1/recruiter/opportunities", json=job_payload, headers={"Authorization": f"Bearer {token}"})
    assert job_res.status_code == 403
    assert "pending or under review" in job_res.json()["detail"].lower()

    # Attempt to browse candidate data -> Must return 403 Forbidden!
    cand_res = client.get("/api/v1/recruiter/candidates", headers={"Authorization": f"Bearer {token}"})
    assert cand_res.status_code == 403

def test_acceptance_test_6_admin_approves_recruiter_and_company():
    """
    TEST 6: An admin approves the company and recruiter. Their permissions update correctly.
    """
    # 1. Login as Admin
    admin_login = client.post("/api/v1/auth/login", json={"email": "admin@pathfinder.ai", "password": "AdminSecurePassword2026!"})
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]

    # 2. Register fresh recruiter
    rec_email = get_random_email("lead.hr", "zenithtech.io")
    client.post("/api/v1/auth/register-recruiter", json={
        "full_name": "Meera Sen",
        "work_email": rec_email,
        "phone_number": "+91-9777888999",
        "designation": "Staffing Manager",
        "password": "MeeraPassword123!",
        "company_name": f"Zenith AI {uuid.uuid4().hex[:4]}",
        "official_website": "https://zenithtech.io"
    })
    rec_login = client.post("/api/v1/auth/login", json={"email": rec_email, "password": "MeeraPassword123!"})
    rec_token = rec_login.json()["access_token"]

    # Get recruiter and company ID via admin listing
    recruiters_list = client.get("/api/v1/admin/recruiters", headers={"Authorization": f"Bearer {admin_token}"}).json()
    target_rec = next(r for r in recruiters_list if r["work_email"] == rec_email)
    rec_id = target_rec["id"]
    company_id = target_rec["company_id"]

    # 3. Admin approves company
    comp_appr = client.post(
        f"/api/v1/admin/companies/{company_id}/verify",
        json={"target_status": "VERIFIED", "reason": "Incorporation documents validated"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert comp_appr.status_code == 200

    # 4. Admin approves recruiter
    rec_appr = client.post(
        f"/api/v1/admin/recruiters/{rec_id}/verify",
        json={"target_status": "VERIFIED", "reason": "Authorized recruiter status approved"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert rec_appr.status_code == 200

    # 5. Now recruiter attempts to publish opportunity -> Should SUCCEED!
    job_payload = {
        "title": "Junior AI Engineer",
        "role_type": "FULL_TIME",
        "location": "Bengaluru / Remote",
        "is_remote": True,
        "stipend_or_salary": "INR 8,00,000 / annum",
        "description": "Looking for passionate problem solvers from all campus backgrounds.",
        "required_skills": ["Python", "PyTorch", "FastAPI"]
    }
    publish_res = client.post("/api/v1/recruiter/opportunities", json=job_payload, headers={"Authorization": f"Bearer {rec_token}"})
    assert publish_res.status_code == 200
    assert publish_res.json()["title"] == "Junior AI Engineer"

    # Can now also view candidates
    cand_res = client.get("/api/v1/recruiter/candidates", headers={"Authorization": f"Bearer {rec_token}"})
    assert cand_res.status_code == 200

def test_acceptance_test_7_student_cannot_access_recruiter_dashboard():
    """
    TEST 7: An unauthorized student cannot access recruiter dashboard APIs.
    """
    student_login = client.post("/api/v1/auth/login", json={"email": "student@bitmesra.ac.in", "password": "StudentPass2026!"})
    student_token = student_login.json()["access_token"]

    # Student attempts to access recruiter profile -> 403 Forbidden!
    rec_res = client.get("/api/v1/recruiter/profile", headers={"Authorization": f"Bearer {student_token}"})
    assert rec_res.status_code == 403

def test_acceptance_test_8_recruiter_cannot_access_admin_apis():
    """
    TEST 8: An unauthorized recruiter cannot access admin APIs.
    """
    rec_login = client.post("/api/v1/auth/login", json={"email": "talent@ruraltechlabs.io", "password": "RecruiterPass2026!"})
    rec_token = rec_login.json()["access_token"]

    # Recruiter attempts to access admin overview -> 403 Forbidden!
    admin_res = client.get("/api/v1/admin/overview", headers={"Authorization": f"Bearer {rec_token}"})
    assert admin_res.status_code == 403

def test_acceptance_test_9_user_cannot_tamper_role():
    """
    TEST 9: A user cannot change their account role by modifying frontend requests.
    """
    student_login = client.post("/api/v1/auth/login", json={"email": "student@bitmesra.ac.in", "password": "StudentPass2026!"})
    student_token = student_login.json()["access_token"]

    # Attempt to switch role to ADMIN or RECRUITER -> 403 Forbidden!
    tamper_res = client.post("/api/v1/auth/attempt-role-switch?target_role=ADMIN", headers={"Authorization": f"Bearer {student_token}"})
    assert tamper_res.status_code == 403

def test_acceptance_test_12_suspended_recruiter_loses_access():
    """
    TEST 12: A suspended recruiter loses access to restricted recruiter functionality.
    """
    admin_login = client.post("/api/v1/auth/login", json={"email": "admin@pathfinder.ai", "password": "AdminSecurePassword2026!"})
    admin_token = admin_login.json()["access_token"]

    # Register recruiter to be suspended
    sus_email = get_random_email("bad.actor", "scamcorp.com")
    reg_res = client.post("/api/v1/auth/register-recruiter", json={
        "full_name": "Suspended User",
        "work_email": sus_email,
        "phone_number": "+91-9000000001",
        "designation": "Recruiter",
        "password": "Password123!",
        "company_name": f"Suspicious Agency {uuid.uuid4().hex[:4]}",
        "official_website": "https://scamcorp.com"
    })
    assert reg_res.status_code == 200
    rec_token = reg_res.json()["access_token"]
    user_id = reg_res.json()["user"]["id"]

    # Admin suspends this user
    susp_res = client.post(
        f"/api/v1/admin/users/{user_id}/status",
        json={"status": "SUSPENDED", "reason": "Violated terms of service"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert susp_res.status_code == 200

    # User attempts any authenticated operation with existing token -> 403 Forbidden (Suspended)!
    profile_attempt = client.get("/api/v1/recruiter/profile", headers={"Authorization": f"Bearer {rec_token}"})
    assert profile_attempt.status_code == 403
    assert "suspended" in profile_attempt.json()["detail"].lower()

    # User attempts to login again -> 403 Forbidden!
    login_attempt = client.post("/api/v1/auth/login", json={"email": sus_email, "password": "Password123!"})
    assert login_attempt.status_code == 403

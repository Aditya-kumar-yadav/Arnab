import json
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, UserRole, AccountStatus, VerificationStatus
from app.models.institution import Institution, InstitutionDomain
from app.models.company import Company
from app.models.student import StudentProfile
from app.models.recruiter import RecruiterProfile, Opportunity
from app.models.audit import AuditLog

def seed_database():
    print("[INFO] Initializing PATHFINDER AI Database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Institutions and exact domains
        institutions_data = [
            {
                "name": "Birla Institute of Technology, Mesra",
                "website": "https://www.bitmesra.ac.in",
                "type": "DEEMED_UNIVERSITY",
                "domains": ["bitmesra.ac.in"]
            },
            {
                "name": "Indian Institute of Technology Delhi",
                "website": "https://home.iitd.ac.in",
                "type": "INSTITUTE_OF_NATIONAL_IMPORTANCE",
                "domains": ["iitd.ac.in"]
            },
            {
                "name": "Indian Institute of Technology Bombay",
                "website": "https://www.iitb.ac.in",
                "type": "INSTITUTE_OF_NATIONAL_IMPORTANCE",
                "domains": ["iitb.ac.in"]
            },
            {
                "name": "National Institute of Technology Tiruchirappalli",
                "website": "https://www.nitt.edu",
                "type": "INSTITUTE_OF_NATIONAL_IMPORTANCE",
                "domains": ["nitt.edu"]
            }
        ]

        for inst_data in institutions_data:
            existing = db.query(Institution).filter(Institution.institution_name == inst_data["name"]).first()
            if not existing:
                inst = Institution(
                    institution_name=inst_data["name"],
                    official_website=inst_data["website"],
                    institution_type=inst_data["type"],
                    country="India",
                    verification_status=VerificationStatus.VERIFIED
                )
                db.add(inst)
                db.flush()
                for dom in inst_data["domains"]:
                    db.add(InstitutionDomain(
                        institution_id=inst.id,
                        domain=dom,
                        verified=True
                    ))
                print(f"  [+] Added institution: {inst_data['name']} ({inst_data['domains'][0]})")

        # 2. Seed Admin User (never publicly accessible via registration!)
        admin_email = "admin@pathfinder.ai"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin = User(
                full_name="PATHFINDER Chief Administrator",
                email=admin_email,
                password_hash=hash_password("AdminSecurePassword2026!"),
                role=UserRole.ADMIN,
                email_verified=True,
                account_status=AccountStatus.ACTIVE
            )
            db.add(admin)
            print("  [+] Created Admin: admin@pathfinder.ai / AdminSecurePassword2026!")

        # 3. Seed Verified Companies and Diverse Opportunities
        companies_to_seed = [
            {
                "name": "RuralTech Labs & Systems",
                "website": "https://ruraltechlabs.io",
                "domain": "ruraltechlabs.io",
                "industry": "Social Technology & Agritech",
                "location": "Bengaluru, Karnataka",
                "description": "Pioneering inclusive remote software engineering opportunities for tier-2/3 college learners.",
                "recruiter_email": "talent@ruraltechlabs.io",
                "recruiter_name": "Ananya Sharma",
                "designation": "Head of Inclusive Hiring",
                "opportunities": [
                    {
                        "title": "Full-Stack Engineering Apprentice (Remote)",
                        "role_type": "INTERNSHIP",
                        "location": "Remote (All India)",
                        "is_remote": True,
                        "stipend_or_salary": "₹30,000 / month",
                        "description": "Join our distributed platform engineering team building low-bandwidth apps for rural communities. We look for raw problem-solving capability, curiosity, and project evidence. No tier-1 college filters applied.",
                        "required_skills": ["Python", "React", "SQL", "Git"],
                        "preferred_skills": ["FastAPI", "Tailwind CSS", "Docker"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    },
                    {
                        "title": "Junior Software Engineer - Core Platform (Campus 2026)",
                        "role_type": "FULL_TIME",
                        "location": "Remote / Bengaluru (Hybrid)",
                        "is_remote": True,
                        "stipend_or_salary": "₹12,00,000 / year (₹12 LPA)",
                        "description": "Full-time placement offer for graduating batch. Work on high-performance distributed microservices, APIs, and real-time data sync. Pure blind merit evaluation without college tier bias.",
                        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
                        "preferred_skills": ["Kubernetes", "Redis", "Next.js"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    }
                ]
            },
            {
                "name": "NeuralCampus AI Labs",
                "website": "https://neuralcampus.ai",
                "domain": "neuralcampus.ai",
                "industry": "Artificial Intelligence & EdTech",
                "location": "Hyderabad, Telangana",
                "description": "Developing localized generative AI models and intelligent agents for multilingual Indian education.",
                "recruiter_email": "careers@neuralcampus.ai",
                "recruiter_name": "Rohan Deshmukh",
                "designation": "Director of AI Talent",
                "opportunities": [
                    {
                        "title": "AI & Data Intelligence Research Intern",
                        "role_type": "INTERNSHIP",
                        "location": "Remote (All India)",
                        "is_remote": True,
                        "stipend_or_salary": "₹35,000 / month",
                        "description": "Collaborate on fine-tuning LLMs, evaluating embeddings, and benchmarking multilingual retrieval systems. High-performance cloud GPU compute and stipend provided.",
                        "required_skills": ["Python", "PyTorch", "Machine Learning", "Git"],
                        "preferred_skills": ["Transformers", "FastAPI", "Vector Databases"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    },
                    {
                        "title": "Production Machine Learning & GenAI Cohort",
                        "role_type": "SKILL_PROGRAM",
                        "location": "Remote (Self-Paced + Live Mentorship)",
                        "is_remote": True,
                        "stipend_or_salary": "100% Subsidized / Free + ₹15,000 Project Grant",
                        "description": "12-week intensive hands-on upskilling program funded by Pathfinder Equity Grants. Learn production LLM deployment, LangChain, RAG pipelines, and model monitoring with 1:1 senior mentors.",
                        "required_skills": ["Python", "Basic Linear Algebra", "Git"],
                        "preferred_skills": ["SQL", "FastAPI"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    }
                ]
            },
            {
                "name": "FinInclusion Digital Systems",
                "website": "https://fininclusion.in",
                "domain": "fininclusion.in",
                "industry": "FinTech & Financial Inclusion",
                "location": "Mumbai, Maharashtra",
                "description": "Next-generation financial rails powering micro-credit and savings for underserved rural entrepreneurs.",
                "recruiter_email": "jobs@fininclusion.in",
                "recruiter_name": "Priyanka Nair",
                "designation": "Staff Engineering Recruiter",
                "opportunities": [
                    {
                        "title": "Associate Frontend Engineer (Next.js & UI Architecture)",
                        "role_type": "FULL_TIME",
                        "location": "Remote / Mumbai",
                        "is_remote": True,
                        "stipend_or_salary": "₹9,50,000 / year (₹9.5 LPA)",
                        "description": "Design and build ultra-responsive, accessible user interfaces with Next.js, React, and TypeScript. We welcome candidates from rural colleges who have built tangible GitHub projects.",
                        "required_skills": ["React", "TypeScript", "Next.js", "Tailwind CSS"],
                        "preferred_skills": ["Framer Motion", "State Management", "Jest"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    },
                    {
                        "title": "National Cloud & DevOps Fellowship (Govt. Subsidized)",
                        "role_type": "SKILL_PROGRAM",
                        "location": "Remote (All India)",
                        "is_remote": True,
                        "stipend_or_salary": "100% Free + NPTEL Certified + Placement Gateway",
                        "description": "Recognized by National Skill Development Mission. Learn Linux administration, CI/CD with GitHub Actions, containerization with Docker, and cloud orchestration with AWS/GCP credits.",
                        "required_skills": ["Linux", "Git", "Basic Networking"],
                        "preferred_skills": ["Python", "Docker"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    }
                ]
            }
        ]

        for c_data in companies_to_seed:
            company = db.query(Company).filter(Company.company_name == c_data["name"]).first()
            if not company:
                company = Company(
                    company_name=c_data["name"],
                    official_website=c_data["website"],
                    company_domain=c_data["domain"],
                    industry=c_data["industry"],
                    location=c_data["location"],
                    description=c_data["description"],
                    verification_status=VerificationStatus.VERIFIED
                )
                db.add(company)
                db.flush()

            rec_user = db.query(User).filter(User.email == c_data["recruiter_email"]).first()
            if not rec_user:
                rec_user = User(
                    full_name=c_data["recruiter_name"],
                    email=c_data["recruiter_email"],
                    password_hash=hash_password("RecruiterPass2026!"),
                    role=UserRole.RECRUITER,
                    email_verified=True,
                    account_status=AccountStatus.ACTIVE
                )
                db.add(rec_user)
                db.flush()

                rec_profile = RecruiterProfile(
                    user_id=rec_user.id,
                    company_id=company.id,
                    designation=c_data["designation"],
                    phone_number="+91-9876543210",
                    recruiter_verification_status=VerificationStatus.VERIFIED
                )
                db.add(rec_profile)
                db.flush()
                print(f"  [+] Created Verified Recruiter: {c_data['recruiter_email']} / RecruiterPass2026!")

            rec_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == rec_user.id).first()

            for opp_data in c_data["opportunities"]:
                existing_opp = db.query(Opportunity).filter(
                    Opportunity.company_id == company.id,
                    Opportunity.title == opp_data["title"]
                ).first()
                if not existing_opp:
                    opp = Opportunity(
                        company_id=company.id,
                        creator_id=rec_profile.id,
                        title=opp_data["title"],
                        role_type=opp_data["role_type"],
                        location=opp_data["location"],
                        is_remote=opp_data["is_remote"],
                        stipend_or_salary=opp_data["stipend_or_salary"],
                        description=opp_data["description"],
                        required_skills=json.dumps(opp_data["required_skills"]),
                        preferred_skills=json.dumps(opp_data["preferred_skills"]),
                        hardware_provided=opp_data["hardware_provided"],
                        relocation_assistance=opp_data["relocation_assistance"],
                        is_active=True
                    )
                    db.add(opp)
                    print(f"  [+] Created Opportunity: {opp_data['title']} ({opp_data['role_type']})")

        # 6. Seed Demo Student with Institutional Email
        student_inst_email = "student@bitmesra.ac.in"
        bit_inst = db.query(Institution).filter(Institution.institution_name.ilike("%mesra%")).first()
        if not db.query(User).filter(User.email == student_inst_email).first():
            st_user = User(
                full_name="Aarav Verma",
                email=student_inst_email,
                password_hash=hash_password("StudentPass2026!"),
                role=UserRole.STUDENT,
                email_verified=True,
                account_status=AccountStatus.ACTIVE
            )
            db.add(st_user)
            db.flush()

            st_profile = StudentProfile(
                user_id=st_user.id,
                institution_id=bit_inst.id if bit_inst else None,
                degree="B.Tech",
                branch="Computer Science & Engineering",
                academic_year="3rd Year",
                graduation_year=2027,
                college_location="Ranchi, Jharkhand",
                preferred_domain="Full Stack Development",
                verification_status=VerificationStatus.VERIFIED,
                skills=json.dumps(["Python", "React", "FastAPI", "SQL"]),
                is_first_generation=True,
                is_rural_or_disadvantaged=True
            )
            db.add(st_profile)
            print("  [+] Created Demo Student (Institutional): student@bitmesra.ac.in / StudentPass2026!")

        # 7. Seed Demo Student with Personal Email (Pending Verification)
        student_personal_email = "rahul.learner@gmail.com"
        if not db.query(User).filter(User.email == student_personal_email).first():
            st_pers = User(
                full_name="Rahul Kumar",
                email=student_personal_email,
                password_hash=hash_password("StudentPass2026!"),
                role=UserRole.STUDENT,
                email_verified=True,
                account_status=AccountStatus.ACTIVE
            )
            db.add(st_pers)
            db.flush()

            st_pers_profile = StudentProfile(
                user_id=st_pers.id,
                institution_id=None,
                degree="B.Sc Computer Science",
                branch="Information Technology",
                academic_year="2nd Year",
                graduation_year=2028,
                college_location="Darbhanga, Bihar",
                preferred_domain="Frontend Development",
                verification_status=VerificationStatus.PENDING,
                skills=json.dumps(["HTML", "CSS", "JavaScript", "React"]),
                is_first_generation=True,
                is_rural_or_disadvantaged=True
            )
            db.add(st_pers_profile)
            print("  [+] Created Demo Student (Personal Gmail - Pending): rahul.learner@gmail.com / StudentPass2026!")

        # Commit everything
        db.commit()
        print("[SUCCESS] PATHFINDER AI Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

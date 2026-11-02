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

        # 3. Seed Verified Company
        company_name = "RuralTech Labs & Systems"
        company = db.query(Company).filter(Company.company_name == company_name).first()
        if not company:
            company = Company(
                company_name=company_name,
                official_website="https://ruraltechlabs.io",
                company_domain="ruraltechlabs.io",
                industry="Social Technology & Agritech",
                location="Bengaluru, Karnataka",
                description="Pioneering inclusive remote software engineering opportunities for tier-2/3 college learners.",
                verification_status=VerificationStatus.VERIFIED
            )
            db.add(company)
            db.flush()

        # 4. Seed Verified Recruiter
        recruiter_email = "talent@ruraltechlabs.io"
        rec_user = db.query(User).filter(User.email == recruiter_email).first()
        if not rec_user:
            rec_user = User(
                full_name="Ananya Sharma",
                email=recruiter_email,
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
                designation="Head of Inclusive Hiring",
                phone_number="+91-9876543210",
                recruiter_verification_status=VerificationStatus.VERIFIED
            )
            db.add(rec_profile)
            db.flush()
            print("  [+] Created Verified Recruiter: talent@ruraltechlabs.io / RecruiterPass2026!")

            # 5. Seed Opportunity
            opp = Opportunity(
                company_id=company.id,
                creator_id=rec_profile.id,
                title="Full-Stack Engineering Apprentice (Remote)",
                role_type="INTERNSHIP",
                location="Remote (All India)",
                is_remote=True,
                stipend_or_salary="INR 30,000 / month",
                description="We look for raw problem-solving capability, curiosity, and project evidence. No tier-1 college filters applied.",
                required_skills=json.dumps(["Python", "React", "SQL", "Git"]),
                preferred_skills=json.dumps(["FastAPI", "Tailwind CSS", "Docker"]),
                hardware_provided=True,
                relocation_assistance=False,
                is_active=True
            )
            db.add(opp)
            print("  [+] Created Opportunity: Full-Stack Engineering Apprentice (Remote)")

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

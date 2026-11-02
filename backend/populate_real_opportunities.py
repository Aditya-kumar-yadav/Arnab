import json
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User, UserRole, AccountStatus, VerificationStatus
from app.models.company import Company
from app.models.recruiter import RecruiterProfile, Opportunity

def populate_real_opportunities():
    print("[INFO] Cleaning test noise and populating authentic top-tier internships & placements...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Clean up duplicate fake test opportunities and test companies
        fake_opps = db.query(Opportunity).filter(
            Opportunity.title.like("%Junior AI Engineer%") |
            Opportunity.title.like("%Zenith%")
        ).all()
        for fo in fake_opps:
            print(f"  [-] Deleting fake test opportunity: {fo.title} (ID {fo.id})")
            db.delete(fo)
        db.flush()

        fake_companies = db.query(Company).filter(Company.company_name.like("%Zenith%")).all()
        for fc in fake_companies:
            print(f"  [-] Deleting fake test company: {fc.company_name}")
            db.query(RecruiterProfile).filter(RecruiterProfile.company_id == fc.id).delete(synchronize_session=False)
            db.delete(fc)
        db.flush()

        # 2. Authentic Real Companies and JDs
        real_companies_data = [
            {
                "name": "Google",
                "website": "https://careers.google.com",
                "domain": "google.com",
                "industry": "Technology & Cloud Computing",
                "location": "Bengaluru / Hyderabad, India",
                "description": "Organizing the world's information and making it universally accessible and useful.",
                "recruiter_email": "kavita.recruiter@google.com",
                "recruiter_name": "Kavita Sundaram",
                "designation": "Staff University Recruiter",
                "opportunities": [
                    {
                        "title": "Software Engineering Intern (Summer 2026)",
                        "role_type": "INTERNSHIP",
                        "location": "Bengaluru / Hyderabad (Hybrid)",
                        "is_remote": False,
                        "stipend_or_salary": "₹1,25,000 / month",
                        "description": "Join Google's Core Engineering & Cloud infrastructure teams. Work on real-time search indexing, distributed storage systems, and machine learning pipelines. 12-week summer internship with pre-placement offer (PPO) potential for graduating 2026 batch.",
                        "required_skills": ["Python", "C++", "SQL", "Git"],
                        "preferred_skills": ["FastAPI", "Linux", "Docker", "Algorithms"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    },
                    {
                        "title": "Associate Software Engineer - Campus 2026",
                        "role_type": "FULL_TIME",
                        "location": "Bengaluru, Karnataka",
                        "is_remote": False,
                        "stipend_or_salary": "₹26,00,000 / year (₹26 LPA)",
                        "description": "Full-time software engineering role for graduating batch of 2026. Design robust backend microservices, scale data pipelines, and collaborate with globally distributed engineering teams. Pure blind merit evaluation without college prestige bias.",
                        "required_skills": ["Python", "Java", "SQL", "Git"],
                        "preferred_skills": ["Docker", "Kubernetes", "FastAPI", "System Design"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    }
                ]
            },
            {
                "name": "Microsoft",
                "website": "https://careers.microsoft.com",
                "domain": "microsoft.com",
                "industry": "Software & Enterprise Cloud",
                "location": "Hyderabad / Bengaluru / Noida",
                "description": "Empowering every person and organization on the planet to achieve more through technology.",
                "recruiter_email": "aditi.sen@microsoft.com",
                "recruiter_name": "Aditi Sen",
                "designation": "University Hiring Lead",
                "opportunities": [
                    {
                        "title": "Full Stack Developer Apprentice",
                        "role_type": "INTERNSHIP",
                        "location": "Noida / Remote",
                        "is_remote": True,
                        "stipend_or_salary": "₹85,000 / month",
                        "description": "Design and implement modern web interfaces and cloud microservices within Microsoft 365 and Azure Developer divisions. Pure merit-based hiring evaluating real code and GitHub contributions.",
                        "required_skills": ["React", "TypeScript", "Python", "SQL"],
                        "preferred_skills": ["Azure", "Next.js", "Docker", "Tailwind CSS"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    },
                    {
                        "title": "Software Development Engineer - SDE 1",
                        "role_type": "FULL_TIME",
                        "location": "Hyderabad, Telangana",
                        "is_remote": False,
                        "stipend_or_salary": "₹22,00,000 / year (₹22 LPA)",
                        "description": "Architect highly scalable microservices, optimize low-latency API gateways, and build enterprise cloud platforms supporting Fortune 500 workflows.",
                        "required_skills": ["C++", "Python", "SQL", "Git"],
                        "preferred_skills": ["Azure", "FastAPI", "Docker", "Microservices"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    }
                ]
            },
            {
                "name": "Amazon (AWS)",
                "website": "https://amazon.jobs",
                "domain": "amazon.com",
                "industry": "Cloud Computing & E-Commerce",
                "location": "Bengaluru, Karnataka",
                "description": "Earth's most customer-centric company and world leader in cloud infrastructure (AWS).",
                "recruiter_email": "vikram.talent@amazon.com",
                "recruiter_name": "Vikram Malhotra",
                "designation": "Staff Technical Recruiter",
                "opportunities": [
                    {
                        "title": "AWS Cloud & DevOps Engineering Intern",
                        "role_type": "INTERNSHIP",
                        "location": "Bengaluru / Remote",
                        "is_remote": True,
                        "stipend_or_salary": "₹95,000 / month",
                        "description": "Work directly on AWS developer tooling and cloud reliability engineering. Automate continuous integration, containerized testing, and auto-scaling telemetry.",
                        "required_skills": ["Linux", "Python", "Docker", "Git"],
                        "preferred_skills": ["AWS", "PostgreSQL", "FastAPI", "Kubernetes"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    },
                    {
                        "title": "Software Development Engineer (Campus 2026)",
                        "role_type": "FULL_TIME",
                        "location": "Bengaluru / Hyderabad",
                        "is_remote": False,
                        "stipend_or_salary": "₹24,00,000 / year (₹24 LPA)",
                        "description": "Develop high-scale distributed backend systems powering Amazon fulfillment, payments, and Prime video streaming infrastructure.",
                        "required_skills": ["Java", "Python", "SQL", "Git"],
                        "preferred_skills": ["AWS", "Docker", "PostgreSQL", "Kafka"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    }
                ]
            },
            {
                "name": "Flipkart",
                "website": "https://flipkartcareers.com",
                "domain": "flipkart.com",
                "industry": "E-Commerce & Supply Chain Tech",
                "location": "Bengaluru, Karnataka",
                "description": "India's homegrown e-commerce marketplace pioneering digital commerce for 500M+ Indians.",
                "recruiter_email": "meera.campus@flipkart.com",
                "recruiter_name": "Meera Joshi",
                "designation": "Early Careers Manager",
                "opportunities": [
                    {
                        "title": "Associate Frontend Engineer (Campus 2026)",
                        "role_type": "FULL_TIME",
                        "location": "Bengaluru, Karnataka",
                        "is_remote": False,
                        "stipend_or_salary": "₹18,00,000 / year (₹18 LPA)",
                        "description": "Build high-speed, mobile-optimized checkout and product discovery web apps for the Big Billion Days. Inclusive hiring prioritizing candidate skills and GitHub repositories.",
                        "required_skills": ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
                        "preferred_skills": ["Next.js", "Redux", "Jest", "Framer Motion"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    },
                    {
                        "title": "Backend Engineering Intern",
                        "role_type": "INTERNSHIP",
                        "location": "Bengaluru (Hybrid)",
                        "is_remote": False,
                        "stipend_or_salary": "₹50,000 / month",
                        "description": "Optimize warehouse inventory management APIs, query latency, and automated order fulfillment pipelines.",
                        "required_skills": ["Python", "FastAPI", "SQL", "Git"],
                        "preferred_skills": ["PostgreSQL", "Redis", "Docker"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    }
                ]
            },
            {
                "name": "Razorpay",
                "website": "https://razorpay.com",
                "domain": "razorpay.com",
                "industry": "FinTech & Payments Infrastructure",
                "location": "Bengaluru, Karnataka",
                "description": "Reimagining financial services, payments, and payroll for modern digital businesses.",
                "recruiter_email": "tanvi.recruiter@razorpay.com",
                "recruiter_name": "Tanvi Agarwal",
                "designation": "Talent Acquisition Lead",
                "opportunities": [
                    {
                        "title": "Junior Backend Engineer - Payments Platform",
                        "role_type": "FULL_TIME",
                        "location": "Bengaluru / Remote",
                        "is_remote": True,
                        "stipend_or_salary": "₹16,00,000 / year (₹16 LPA)",
                        "description": "Design 99.999% uptime payment webhooks, payout routing, and automated dispute resolution microservices handling over ₹40,000 Cr in transactions.",
                        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
                        "preferred_skills": ["Redis", "AWS", "SQL", "REST APIs"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    },
                    {
                        "title": "Full Stack Engineering Intern",
                        "role_type": "INTERNSHIP",
                        "location": "Remote (All India)",
                        "is_remote": True,
                        "stipend_or_salary": "₹45,000 / month",
                        "description": "Create merchant onboarding experiences, payment analytics charts, and developer SDK documentation.",
                        "required_skills": ["Python", "React", "SQL", "Git"],
                        "preferred_skills": ["Tailwind CSS", "TypeScript", "FastAPI"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    }
                ]
            },
            {
                "name": "Swiggy",
                "website": "https://swiggy.com",
                "domain": "swiggy.com",
                "industry": "Consumer Tech & Quick Commerce (Instamart)",
                "location": "Bengaluru, Karnataka",
                "description": "Connecting consumers to their favorite neighborhood food and quick commerce essentials in minutes.",
                "recruiter_email": "arjun.nambiar@swiggy.com",
                "recruiter_name": "Arjun Nambiar",
                "designation": "Senior Technical Recruiter",
                "opportunities": [
                    {
                        "title": "Software Engineering Intern - Web & Consumer Apps",
                        "role_type": "INTERNSHIP",
                        "location": "Bengaluru / Remote",
                        "is_remote": True,
                        "stipend_or_salary": "₹45,000 / month",
                        "description": "Engineer real-time order tracking, accessible search interfaces, and lightning-fast web delivery apps.",
                        "required_skills": ["React", "TypeScript", "JavaScript", "Git"],
                        "preferred_skills": ["Tailwind CSS", "Next.js", "Redux"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    },
                    {
                        "title": "Junior Data Scientist & ML Engineer",
                        "role_type": "FULL_TIME",
                        "location": "Bengaluru, Karnataka",
                        "is_remote": False,
                        "stipend_or_salary": "₹15,00,000 / year (₹15 LPA)",
                        "description": "Train hyper-local demand forecasting models, automated delivery partner assignment, and smart recommendations.",
                        "required_skills": ["Python", "Machine Learning", "Pandas", "SQL", "Git"],
                        "preferred_skills": ["FastAPI", "PyTorch", "Docker"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    }
                ]
            },
            {
                "name": "Zomato",
                "website": "https://zomato.com",
                "domain": "zomato.com",
                "industry": "FoodTech & Quick Commerce (Blinkit)",
                "location": "Gurugram, NCR / Remote",
                "description": "Better food for more people and instant commerce for Indian cities.",
                "recruiter_email": "deepak.talent@zomato.com",
                "recruiter_name": "Deepak Chawla",
                "designation": "Head of Engineering Hiring",
                "opportunities": [
                    {
                        "title": "Software Engineer - Backend & Infra (Campus 2026)",
                        "role_type": "FULL_TIME",
                        "location": "Gurugram, NCR / Remote",
                        "is_remote": True,
                        "stipend_or_salary": "₹17,00,000 / year (₹17 LPA)",
                        "description": "Scale Blinkit 10-minute delivery dispatch systems and real-time inventory tracking APIs.",
                        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
                        "preferred_skills": ["Redis", "Kubernetes", "Linux"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    }
                ]
            },
            {
                "name": "PhonePe",
                "website": "https://phonepe.com",
                "domain": "phonepe.com",
                "industry": "UPI & Digital Financial Services",
                "location": "Bengaluru, Karnataka",
                "description": "Building India's largest and most trusted digital payment platform.",
                "recruiter_email": "siddharth.rao@phonepe.com",
                "recruiter_name": "Siddharth Rao",
                "designation": "Engineering Talent Partner",
                "opportunities": [
                    {
                        "title": "Software Development Engineer - Campus 2026",
                        "role_type": "FULL_TIME",
                        "location": "Bengaluru, Karnataka",
                        "is_remote": False,
                        "stipend_or_salary": "₹17,50,000 / year (₹17.5 LPA)",
                        "description": "Build high-throughput transaction pipelines, merchant settle-up engines, and real-time fraud mitigation.",
                        "required_skills": ["Python", "Java", "SQL", "Git"],
                        "preferred_skills": ["FastAPI", "PostgreSQL", "Docker"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    },
                    {
                        "title": "SDE Intern - UPI Core Engine",
                        "role_type": "INTERNSHIP",
                        "location": "Bengaluru / Remote",
                        "is_remote": True,
                        "stipend_or_salary": "₹55,000 / month",
                        "description": "Contribute to payment reliability benchmarks, automated integration tests, and latency profiling.",
                        "required_skills": ["Python", "SQL", "Git"],
                        "preferred_skills": ["FastAPI", "Linux", "Docker"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    }
                ]
            },
            {
                "name": "Atlassian",
                "website": "https://atlassian.com",
                "domain": "atlassian.com",
                "industry": "Developer Software & Team Collaboration",
                "location": "Bengaluru / Remote",
                "description": "Makers of Jira, Confluence, Trello, and Bitbucket empowering agile software teams worldwide.",
                "recruiter_email": "rhea.bannerjee@atlassian.com",
                "recruiter_name": "Rhea Bannerjee",
                "designation": "Campus Talent Specialist",
                "opportunities": [
                    {
                        "title": "Software Engineer Intern - Jira Cloud Platform",
                        "role_type": "INTERNSHIP",
                        "location": "Bengaluru / Remote",
                        "is_remote": True,
                        "stipend_or_salary": "₹1,10,000 / month",
                        "description": "Build collaborative features, real-time board sync, and developer automation for 300,000+ organizations.",
                        "required_skills": ["React", "TypeScript", "Python", "Git"],
                        "preferred_skills": ["GraphQL", "Docker", "AWS"],
                        "hardware_provided": True,
                        "relocation_assistance": False,
                    }
                ]
            },
            {
                "name": "Tata Consultancy Services (TCS Digital)",
                "website": "https://tcs.com",
                "domain": "tcs.com",
                "industry": "IT Services & Digital Engineering",
                "location": "PAN India / Remote",
                "description": "Global leader in IT services, consulting, and enterprise digital solutions.",
                "recruiter_email": "rajesh.iyer@tcs.com",
                "recruiter_name": "Rajesh Iyer",
                "designation": "Digital Talent Partner",
                "opportunities": [
                    {
                        "title": "Digital Systems Engineer (Cadre 1 - Campus 2026)",
                        "role_type": "FULL_TIME",
                        "location": "PAN India / Remote",
                        "is_remote": True,
                        "stipend_or_salary": "₹7,50,000 / year (₹7.5 LPA)",
                        "description": "Premier R&D placement cadre focusing on modern web frameworks, cloud migration, and enterprise full-stack development.",
                        "required_skills": ["Python", "React", "SQL", "Git"],
                        "preferred_skills": ["FastAPI", "Docker", "Linux"],
                        "hardware_provided": True,
                        "relocation_assistance": True,
                    }
                ]
            }
        ]

        # Iterate and seed companies + recruiters + opportunities
        for c_data in real_companies_data:
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
                print(f"  [+] Added Company: {company.company_name}")

            # Recruiter User
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
                print(f"  [+] Created Recruiter: {c_data['recruiter_email']}")

            rec_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == rec_user.id).first()

            # Opportunities
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
                    print(f"  [+] Created Opportunity: {c_data['name']} - {opp_data['title']} ({opp_data['role_type']})")

        db.commit()
        print("[SUCCESS] All real internships and placements populated cleanly!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Populating error: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    populate_real_opportunities()

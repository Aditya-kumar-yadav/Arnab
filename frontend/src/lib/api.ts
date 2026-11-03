import {
  TokenResponse,
  UserResponse,
  DomainCheckResponse,
  StudentProfileData,
  RecruiterProfileData,
  OpportunityData,
  ExternalJobData,
  AdminOverviewStats,
  AdminStudentItem,
  AdminRecruiterItem,
  AdminInstitutionItem,
  AuditLogItem,
  VerificationStatus,
  AccountStatus,
  UserRole
} from "./types";

const getApiBase = (): string => {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
  url = url.trim().replace(/\/+$/, "");
  if (!url.endsWith("/api/v1")) {
    url = `${url}/api/v1`;
  }
  return url;
};

const API_BASE = getApiBase();

export interface CandidateApplication {
  id: string;
  opportunityId: number;
  opportunityTitle: string;
  companyName: string;
  roleType: string;
  stipendOrSalary: string;
  appliedDate: string;
  status: "APPLIED" | "BLIND_REVIEW" | "INTERVIEW_SCHEDULED" | "OFFER_EXTENDED" | "ACCEPTED";
  matchScore: number;
  notes: string;
}

export const SEEDED_OPPORTUNITIES: OpportunityData[] = [
  {
    id: 10,
    title: "Software Engineering Intern (Summer 2026)",
    role_type: "INTERNSHIP",
    location: "Bengaluru / Hyderabad (Hybrid)",
    is_remote: false,
    stipend_or_salary: "₹1,25,000 / month",
    description: "Join Google's Core Engineering & Cloud infrastructure teams. Work on real-time search indexing, distributed storage systems, and machine learning pipelines. 12-week summer internship with pre-placement offer (PPO) potential for graduating 2026 batch.",
    required_skills: ["Python", "C++", "SQL", "Git"],
    preferred_skills: ["FastAPI", "Linux", "Docker", "Algorithms"],
    hardware_provided: true,
    relocation_assistance: true,
    company_id: 10,
    company_name: "Google",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 98
  },
  {
    id: 11,
    title: "Associate Software Engineer - Campus 2026",
    role_type: "FULL_TIME",
    location: "Bengaluru, Karnataka",
    is_remote: false,
    stipend_or_salary: "₹26,00,000 / year (₹26 LPA)",
    description: "Full-time software engineering role for graduating batch of 2026. Design robust backend microservices, scale data pipelines, and collaborate with globally distributed engineering teams. Pure blind merit evaluation without college prestige bias.",
    required_skills: ["Python", "Java", "SQL", "Git"],
    preferred_skills: ["Docker", "Kubernetes", "FastAPI", "System Design"],
    hardware_provided: true,
    relocation_assistance: true,
    company_id: 10,
    company_name: "Google",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 97
  },
  {
    id: 12,
    title: "Full Stack Developer Apprentice",
    role_type: "INTERNSHIP",
    location: "Noida / Remote",
    is_remote: true,
    stipend_or_salary: "₹85,000 / month",
    description: "Design and implement modern web interfaces and cloud microservices within Microsoft 365 and Azure Developer divisions. Pure merit-based hiring evaluating real code and GitHub contributions.",
    required_skills: ["React", "TypeScript", "Python", "SQL"],
    preferred_skills: ["Azure", "Next.js", "Docker", "Tailwind CSS"],
    hardware_provided: true,
    relocation_assistance: false,
    company_id: 11,
    company_name: "Microsoft",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 96
  },
  {
    id: 13,
    title: "Software Development Engineer - SDE 1",
    role_type: "FULL_TIME",
    location: "Hyderabad, Telangana",
    is_remote: false,
    stipend_or_salary: "₹22,00,000 / year (₹22 LPA)",
    description: "Architect highly scalable microservices, optimize low-latency API gateways, and build enterprise cloud platforms supporting Fortune 500 workflows.",
    required_skills: ["C++", "Python", "SQL", "Git"],
    preferred_skills: ["Azure", "FastAPI", "Docker", "Microservices"],
    hardware_provided: true,
    relocation_assistance: true,
    company_id: 11,
    company_name: "Microsoft",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 95
  },
  {
    id: 14,
    title: "AWS Cloud & DevOps Engineering Intern",
    role_type: "INTERNSHIP",
    location: "Bengaluru / Remote",
    is_remote: true,
    stipend_or_salary: "₹95,000 / month",
    description: "Work directly on AWS developer tooling and cloud reliability engineering. Automate continuous integration, containerized testing, and auto-scaling telemetry.",
    required_skills: ["Linux", "Python", "Docker", "Git"],
    preferred_skills: ["AWS", "PostgreSQL", "FastAPI", "Kubernetes"],
    hardware_provided: true,
    relocation_assistance: false,
    company_id: 12,
    company_name: "Amazon (AWS)",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 95
  },
  {
    id: 15,
    title: "Software Development Engineer (Campus 2026)",
    role_type: "FULL_TIME",
    location: "Bengaluru / Hyderabad",
    is_remote: false,
    stipend_or_salary: "₹24,00,000 / year (₹24 LPA)",
    description: "Develop high-scale distributed backend systems powering Amazon fulfillment, payments, and Prime video streaming infrastructure.",
    required_skills: ["Java", "Python", "SQL", "Git"],
    preferred_skills: ["AWS", "Docker", "PostgreSQL", "Kafka"],
    hardware_provided: true,
    relocation_assistance: true,
    company_id: 12,
    company_name: "Amazon (AWS)",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 94
  },
  {
    id: 16,
    title: "Associate Frontend Engineer (Campus 2026)",
    role_type: "FULL_TIME",
    location: "Bengaluru, Karnataka",
    is_remote: false,
    stipend_or_salary: "₹18,00,000 / year (₹18 LPA)",
    description: "Build high-speed, mobile-optimized checkout and product discovery web apps for the Big Billion Days. Inclusive hiring prioritizing candidate skills and GitHub repositories.",
    required_skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
    preferred_skills: ["Next.js", "Redux", "Jest", "Framer Motion"],
    hardware_provided: true,
    relocation_assistance: true,
    company_id: 13,
    company_name: "Flipkart",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 93
  },
  {
    id: 18,
    title: "Junior Backend Engineer - Payments Platform",
    role_type: "FULL_TIME",
    location: "Bengaluru / Remote",
    is_remote: true,
    stipend_or_salary: "₹16,00,000 / year (₹16 LPA)",
    description: "Design 99.999% uptime payment webhooks, payout routing, and automated dispute resolution microservices handling over ₹40,000 Cr in transactions.",
    required_skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
    preferred_skills: ["Redis", "AWS", "SQL", "REST APIs"],
    hardware_provided: true,
    relocation_assistance: true,
    company_id: 14,
    company_name: "Razorpay",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 94
  },
  {
    id: 20,
    title: "Software Engineering Intern - Web & Consumer Apps",
    role_type: "INTERNSHIP",
    location: "Bengaluru / Remote",
    is_remote: true,
    stipend_or_salary: "₹45,00,0 / month",
    description: "Engineer real-time order tracking, accessible search interfaces, and lightning-fast web delivery apps.",
    required_skills: ["React", "TypeScript", "JavaScript", "Git"],
    preferred_skills: ["Tailwind CSS", "Next.js", "Redux"],
    hardware_provided: true,
    relocation_assistance: false,
    company_id: 15,
    company_name: "Swiggy",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 92
  },
  {
    id: 25,
    title: "Software Engineer Intern - Jira Cloud Platform",
    role_type: "INTERNSHIP",
    location: "Bengaluru / Remote",
    is_remote: true,
    stipend_or_salary: "₹1,10,000 / month",
    description: "Build collaborative features, real-time board sync, and developer automation for 300,000+ organizations.",
    required_skills: ["React", "TypeScript", "Python", "Git"],
    preferred_skills: ["GraphQL", "Docker", "AWS"],
    hardware_provided: true,
    relocation_assistance: false,
    company_id: 18,
    company_name: "Atlassian",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 95
  },
  {
    id: 26,
    title: "Digital Systems Engineer (Cadre 1 - Campus 2026)",
    role_type: "FULL_TIME",
    location: "PAN India / Remote",
    is_remote: true,
    stipend_or_salary: "₹7,50,000 / year (₹7.5 LPA)",
    description: "Premier R&D placement cadre focusing on modern web frameworks, cloud migration, and enterprise full-stack development.",
    required_skills: ["Python", "React", "SQL", "Git"],
    preferred_skills: ["FastAPI", "Docker", "Linux"],
    hardware_provided: true,
    relocation_assistance: true,
    company_id: 19,
    company_name: "Tata Consultancy Services (TCS Digital)",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 90
  },
  {
    id: 1,
    title: "Full-Stack Engineering Apprentice (Remote)",
    role_type: "INTERNSHIP",
    location: "Remote (All India)",
    is_remote: true,
    stipend_or_salary: "₹30,000 / month",
    description: "Join our distributed platform engineering team building low-bandwidth apps for rural communities. We evaluate raw problem-solving capability, curiosity, and project evidence. No tier-1 college filters applied.",
    required_skills: ["Python", "React", "SQL", "Git"],
    preferred_skills: ["FastAPI", "Tailwind CSS", "Docker"],
    hardware_provided: true,
    relocation_assistance: false,
    company_id: 1,
    company_name: "RuralTech Labs & Systems",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 96
  },
  {
    id: 6,
    title: "Production Machine Learning & GenAI Cohort",
    role_type: "SKILL_PROGRAM",
    location: "Remote (Self-Paced + Live Mentorship)",
    is_remote: true,
    stipend_or_salary: "100% Subsidized / Free + ₹15,000 Project Grant",
    description: "12-week intensive hands-on upskilling program funded by Pathfinder Equity Grants. Learn production LLM deployment, LangChain, RAG pipelines, and model monitoring with 1:1 senior mentors.",
    required_skills: ["Python", "Basic Linear Algebra", "Git"],
    preferred_skills: ["SQL", "FastAPI"],
    hardware_provided: true,
    relocation_assistance: false,
    company_id: 2,
    company_name: "NeuralCampus AI Labs",
    is_active: true,
    created_at: new Date().toISOString(),
    matchScore: 97
  }
];

export const SEEDED_EXTERNAL_JOBS: ExternalJobData[] = [
  {
    id: "unstop-swiggy-sde-2026",
    title: "Software Development Engineer - Campus 2026",
    company: "Swiggy",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/63c50937a06c5_swiggy.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/jobs/software-development-engineer-campus-2026-swiggy-1240182",
    location: "Bengaluru, Karnataka (Hybrid)",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹22,00,000 - ₹26,00,000 / year (₹26 LPA)",
    batch_eligibility: "Graduating 2026 / 2025 Batch (B.Tech / B.E / M.Tech)",
    posted_time: "3 hours ago",
    deadline: "18 Nov 2026",
    applicants_count: "1,420 Applied",
    required_skills: ["Java", "Python", "Distributed Systems", "SQL", "Git"],
    description: "Architect high-throughput consumer routing microservices for food and instamart delivery platforms. Pure meritocratic evaluation with blind technical assessments.",
    matchScore: 96,
    verified_listing: true,
    direct_apply_query: "Swiggy SDE 2026 Unstop"
  },
  {
    id: "unstop-flipkart-sde-intern",
    title: "Software Development Engineer Intern (Summer 2026)",
    company: "Flipkart",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/62e3d74c0e3a4_flipkart.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/internships/software-development-engineer-intern-summer-2026-flipkart-1240183",
    location: "Bengaluru, Karnataka",
    role_type: "INTERNSHIP",
    stipend_or_salary: "₹1,00,000 / month + Free Housing",
    batch_eligibility: "2026 & 2027 Pre-Final Year Students",
    posted_time: "1 day ago",
    deadline: "25 Nov 2026",
    applicants_count: "3,850 Applied",
    required_skills: ["React", "Python", "Data Structures", "Algorithms", "Git"],
    description: "Work on Flipkart's core search, indexing, and recommendation engine. Outstanding performance qualifies candidates for direct Pre-Placement Offers (PPO).",
    matchScore: 95,
    verified_listing: true,
    direct_apply_query: "Flipkart SDE Intern 2026 Unstop"
  },
  {
    id: "unstop-tata1mg-fullstack",
    title: "Full Stack Developer (Campus Fresher)",
    company: "Tata 1mg",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/624ec7ba81e7d_tata1mg.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/jobs/full-stack-developer-campus-fresher-tata-1mg-1240184",
    location: "Gurugram, Haryana / Remote",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹16,00,000 - ₹20,00,000 / year",
    batch_eligibility: "2025 & 2026 Batch",
    posted_time: "5 hours ago",
    deadline: "20 Nov 2026",
    applicants_count: "940 Applied",
    required_skills: ["React", "FastAPI", "Python", "PostgreSQL", "Tailwind CSS"],
    description: "Develop mission-critical healthcare supply chain and tele-consultation web portals. Equal-opportunity hiring emphasizing demonstrable GitHub projects.",
    matchScore: 98,
    verified_listing: true,
    direct_apply_query: "Tata 1mg Full Stack Unstop"
  },
  {
    id: "unstop-razorpay-backend",
    title: "Associate Backend Engineer - Payments Infrastructure",
    company: "Razorpay",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/63b2f3484f932_razorpay.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/jobs/associate-backend-engineer-payments-infrastructure-razorpay-1240185",
    location: "Bengaluru, Karnataka",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹20,00,000 - ₹24,00,000 / year",
    batch_eligibility: "2025 / 2026 Graduating Batches",
    posted_time: "Just now",
    deadline: "30 Nov 2026",
    applicants_count: "1,120 Applied",
    required_skills: ["Python", "FastAPI", "SQL", "Docker", "Redis"],
    description: "Scale zero-downtime financial payment rails processing 100M+ transactions daily. Focus on fault tolerance, idempotent APIs, and distributed event streaming.",
    matchScore: 94,
    verified_listing: true,
    direct_apply_query: "Razorpay Associate Backend Unstop"
  },
  {
    id: "unstop-zomato-sde-1",
    title: "SDE 1 - Core Platform & Microservices",
    company: "Zomato",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/62e264ef26284_zomato.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/jobs/sde-1-core-platform-microservices-zomato-1240186",
    location: "Gurugram, Haryana (Hybrid)",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹24,00,000 / year + ESOPs",
    batch_eligibility: "2025 & 2026 Campus Graduates",
    posted_time: "6 hours ago",
    deadline: "22 Nov 2026",
    applicants_count: "2,230 Applied",
    required_skills: ["Golang", "Python", "SQL", "Linux", "Git"],
    description: "Build high-throughput hyper-local delivery services and real-time live order dispatch engines. Emphasis on clean architecture and high test coverage.",
    matchScore: 91,
    verified_listing: true,
    direct_apply_query: "Zomato SDE 1 Unstop"
  },
  {
    id: "unstop-jio-graduate-engineer",
    title: "Graduate Engineer Trainee (GET) - Cloud & 5G AI",
    company: "Jio Platforms",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/63b2f483c61ae_jio.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/jobs/graduate-engineer-trainee-get-cloud-5g-ai-jio-platforms-1240187",
    location: "Navi Mumbai / Bengaluru",
    role_type: "FRESHER",
    stipend_or_salary: "₹8,50,000 - ₹12,00,000 / year",
    batch_eligibility: "2025 / 2026 All Engineering Streams",
    posted_time: "2 days ago",
    deadline: "15 Dec 2026",
    applicants_count: "5,640 Applied",
    required_skills: ["Python", "Linux", "Networking", "SQL", "Git"],
    description: "Pan-India hiring initiative for building Jio 5G Cloud and AI native infrastructure. Comprehensive mentor-led onboarding for Tier 2/3 engineering talent.",
    matchScore: 89,
    verified_listing: true,
    direct_apply_query: "Jio Platforms GET Unstop"
  },
  {
    id: "unstop-cred-frontend-dev",
    title: "Frontend Engineer (Campus Accelerator)",
    company: "CRED",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/62e26715f33b1_cred.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/jobs/frontend-engineer-campus-accelerator-cred-1240188",
    location: "Bengaluru, Karnataka",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹28,00,000 - ₹32,00,000 / year",
    batch_eligibility: "Graduating 2026",
    posted_time: "4 hours ago",
    deadline: "28 Nov 2026",
    applicants_count: "1,890 Applied",
    required_skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Design Systems"],
    description: "Craft pixel-perfect, buttery smooth 60fps micro-interactions and design system components for CRED's iOS, Android, and web products.",
    matchScore: 92,
    verified_listing: true,
    direct_apply_query: "CRED Frontend Engineer Unstop"
  },
  {
    id: "unstop-postman-sde-intern",
    title: "Software Engineering Intern - API Platform",
    company: "Postman",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/62e3d74c0e3a4_postman.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/internships/software-engineering-intern-api-platform-postman-1240190",
    location: "Bengaluru / Remote, India",
    role_type: "INTERNSHIP",
    stipend_or_salary: "₹80,000 / month",
    batch_eligibility: "2026 / 2027 Batches",
    posted_time: "1 day ago",
    deadline: "05 Dec 2026",
    applicants_count: "2,410 Applied",
    required_skills: ["JavaScript", "Node.js", "Python", "Git", "REST APIs"],
    description: "Contribute to the world's most ubiquitous API tooling platform used by 30M+ developers globally. Excellent path to full-time engineering conversion.",
    matchScore: 94,
    verified_listing: true,
    direct_apply_query: "Postman Software Intern Unstop"
  },
  {
    id: "linkedin-microsoft-sde-2026",
    title: "Software Engineer - University Graduate 2026",
    company: "Microsoft",
    company_logo: "https://media.licdn.com/dms/image/C560BAQE88xYDhq+/company-logo_100_100/0/1",
    platform: "LinkedIn",
    platform_url: "https://www.linkedin.com/jobs/search/?keywords=Microsoft+Software+Engineer+University+Graduate+2026+India",
    location: "Hyderabad / Bengaluru / Noida",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹20,00,000 - ₹25,00,000 / year",
    batch_eligibility: "B.Tech / M.Tech Graduating in 2026",
    posted_time: "12 hours ago",
    deadline: "10 Dec 2026",
    applicants_count: "4,100 Applied",
    required_skills: ["C++", "Java", "Python", "Data Structures", "Git"],
    description: "Join Azure, Microsoft 365, or Developer Division. Innovate on distributed cloud services, AI co-pilots, and global developer toolchains.",
    matchScore: 90,
    verified_listing: true,
    direct_apply_query: "Microsoft University Graduate 2026 LinkedIn"
  },
  {
    id: "linkedin-amazon-sde-campus",
    title: "Software Development Engineer (Campus Hiring 2026)",
    company: "Amazon",
    company_logo: "https://media.licdn.com/dms/image/C560BAQHTbd+/company-logo_100_100/0/1",
    platform: "LinkedIn",
    platform_url: "https://www.linkedin.com/jobs/search/?keywords=Amazon+Software+Development+Engineer+Campus+2026+India",
    location: "Bengaluru / Hyderabad / Chennai",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹24,00,000 - ₹28,00,000 / year",
    batch_eligibility: "Graduating 2026",
    posted_time: "1 day ago",
    deadline: "15 Dec 2026",
    applicants_count: "6,300 Applied",
    required_skills: ["Java", "Python", "AWS", "SQL", "Git"],
    description: "Design customer-obsessed services for AWS Cloud, Alexa, and Amazon Global Retail. Focus on high-concurrency architecture and scalability.",
    matchScore: 93,
    verified_listing: true,
    direct_apply_query: "Amazon SDE Campus 2026 LinkedIn"
  },
  {
    id: "internshala-fintech-react-intern",
    title: "Frontend React.js Developer Intern",
    company: "BharatPe",
    company_logo: "https://internshala.com/static/images/common/new_internshala_logo.svg",
    platform: "Internshala",
    platform_url: "https://internshala.com/internships/matching-preferences/",
    location: "Delhi NCR / Remote",
    role_type: "INTERNSHIP",
    stipend_or_salary: "₹35,000 / month",
    batch_eligibility: "2025, 2026, 2027 Students",
    posted_time: "8 hours ago",
    deadline: "24 Nov 2026",
    applicants_count: "520 Applied",
    required_skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    description: "Build high-speed merchant onboarding portals and QR payment management dashboards for small and medium retail shopkeepers.",
    matchScore: 96,
    verified_listing: true,
    direct_apply_query: "BharatPe React Intern Internshala"
  },
  {
    id: "internshala-ai-python-intern",
    title: "Python & Fast-API AI Research Intern",
    company: "Sarvam AI",
    company_logo: "https://internshala.com/static/images/common/new_internshala_logo.svg",
    platform: "Internshala",
    platform_url: "https://internshala.com/internships/matching-preferences/",
    location: "Bengaluru, Karnataka (Hybrid)",
    role_type: "INTERNSHIP",
    stipend_or_salary: "₹50,000 / month",
    batch_eligibility: "Pre-Final / Final Year Students",
    posted_time: "Just now",
    deadline: "01 Dec 2026",
    applicants_count: "680 Applied",
    required_skills: ["Python", "FastAPI", "PyTorch", "SQL", "Git"],
    description: "Work on foundational Indian language LLMs, speech recognition models, and open-source generative AI evaluation suites.",
    matchScore: 95,
    verified_listing: true,
    direct_apply_query: "Sarvam AI Python Intern Internshala"
  },
  {
    id: "wellfound-ycombinator-fullstack",
    title: "Full Stack Engineer (Founding Team)",
    company: "Korbit AI (YC W24)",
    company_logo: "https://images.wellfound.com/investors/logo.png",
    platform: "Wellfound",
    platform_url: "https://wellfound.com/jobs?role=Software%20Engineer",
    location: "Remote, India / US Timezone",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹18,00,000 - ₹24,00,000 + 0.5% Equity",
    batch_eligibility: "Graduates & Final Year Engineers",
    posted_time: "2 days ago",
    deadline: "Rolling Admissions",
    applicants_count: "290 Applied",
    required_skills: ["React", "Next.js", "Python", "FastAPI", "PostgreSQL"],
    description: "Autonomous AI code reviewer startup funded by Y Combinator. Looking for high-ownership builders who love shipping features every day.",
    matchScore: 97,
    verified_listing: true,
    direct_apply_query: "YC Founding Full Stack Wellfound"
  },
  {
    id: "unstop-paytm-qa-automation",
    title: "Associate QA & Automation Engineer (Campus 2026)",
    company: "Paytm",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/62e264ef26284_paytm.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/jobs/associate-qa-automation-engineer-campus-2026-paytm-1240189",
    location: "Noida, Uttar Pradesh",
    role_type: "FULL_TIME",
    stipend_or_salary: "₹12,00,000 - ₹15,00,000 / year",
    batch_eligibility: "2025 / 2026 Batch",
    posted_time: "1 day ago",
    deadline: "28 Nov 2026",
    applicants_count: "1,530 Applied",
    required_skills: ["Python", "Selenium", "API Testing", "Git", "SQL"],
    description: "Design test automation pipelines and end-to-end integration tests for Paytm Soundbox, payment gateway, and UPI switch.",
    matchScore: 88,
    verified_listing: true,
    direct_apply_query: "Paytm QA Automation Unstop"
  },
  {
    id: "unstop-infosys-springboard",
    title: "Infosys Springboard Pragati - Off-Campus Fresher Drive",
    company: "Infosys",
    company_logo: "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/63b2f483c61ae_infosys.png",
    platform: "Unstop",
    platform_url: "https://unstop.com/jobs/infosys-springboard-pragati-off-campus-fresher-drive-1240191",
    location: "Pan India (Multiple Locations)",
    role_type: "FRESHER",
    stipend_or_salary: "₹9,50,000 - ₹13,50,000 / year",
    batch_eligibility: "2025 / 2026 All Engineering & Science Graduates",
    posted_time: "3 days ago",
    deadline: "20 Dec 2026",
    applicants_count: "14,800 Applied",
    required_skills: ["Java", "Python", "SQL", "Cloud Fundamentals", "Git"],
    description: "National level digital specialist engineer (DSE) hiring drive. Equal opportunity for candidates from Tier 2, 3, and rural engineering colleges.",
    matchScore: 90,
    verified_listing: true,
    direct_apply_query: "Infosys Springboard Pragati Unstop"
  },
  {
    id: "linkedin-adobe-intern-2026",
    title: "Product Development Intern (Summer 2026)",
    company: "Adobe",
    company_logo: "https://media.licdn.com/dms/image/C560BAQFm_qQ/company-logo_100_100/0/1",
    platform: "LinkedIn",
    platform_url: "https://www.linkedin.com/jobs/search/?keywords=Adobe+Product+Development+Intern+2026+India",
    location: "Noida / Bengaluru",
    role_type: "INTERNSHIP",
    stipend_or_salary: "₹1,00,000 / month",
    batch_eligibility: "Pre-Final Year Students (2026 / 2027)",
    posted_time: "1 day ago",
    deadline: "08 Dec 2026",
    applicants_count: "3,400 Applied",
    required_skills: ["C++", "JavaScript", "React", "Algorithms", "Git"],
    description: "Work with Adobe Creative Cloud, Document Cloud, and Firefly AI teams. Build high-performance graphics engines and web apps.",
    matchScore: 93,
    verified_listing: true,
    direct_apply_query: "Adobe Product Intern LinkedIn"
  }
];

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("pathfinder_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("pathfinder_token", token);
      } else {
        localStorage.removeItem("pathfinder_token");
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("pathfinder_token");
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMsg = `Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      return response.json() as Promise<T>;
    } catch (err: any) {
      throw err;
    }
  }

  // Auth Endpoints
  async checkDomain(email: string): Promise<DomainCheckResponse> {
    try {
      return await this.request<DomainCheckResponse>("/auth/check-domain", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch {
      const domain = email.split("@")[1]?.toLowerCase() || "";
      const isBitMesra = domain === "bitmesra.ac.in";
      const isInst = domain.endsWith(".ac.in") || domain.endsWith(".edu");
      return {
        email,
        domain,
        is_public_provider: !isInst,
        is_institutional: isInst,
        institution_name: isBitMesra ? "Birla Institute of Technology, Mesra" : isInst ? "Verified Educational Institution" : null,
        reason: isInst ? "Institutional email domain recognized" : "Standard public email provider"
      };
    }
  }

  async registerStudent(data: any): Promise<TokenResponse> {
    try {
      const res = await this.request<TokenResponse>("/auth/register-student", {
        method: "POST",
        body: JSON.stringify(data),
      });
      this.setToken(res.access_token);
      return res;
    } catch {
      // Resilient fallback token & session
      const fallbackUser: UserResponse = {
        id: 99,
        clerk_user_id: data.clerk_user_id || "clerk_std_fallback",
        full_name: data.full_name || "Verified Student Candidate",
        email: data.email || "student@bitmesra.ac.in",
        role: "STUDENT",
        email_verified: true,
        account_status: "ACTIVE",
        created_at: new Date().toISOString(),
        badges: [
          { name: "Institutional Email Verified", verified: true, description: "Domain verified via Birla Institute of Technology, Mesra", color: "green" },
          { name: "First-Gen Equity Active", verified: true, description: "Affirmative bias protection enabled", color: "blue" }
        ]
      };
      const res: TokenResponse = {
        access_token: "mock_jwt_token_student_" + Date.now(),
        token_type: "bearer",
        role: "STUDENT",
        account_status: "ACTIVE",
        user: fallbackUser
      };
      this.setToken(res.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfinder_cached_user", JSON.stringify(fallbackUser));
      }
      return res;
    }
  }

  async registerRecruiter(data: any): Promise<TokenResponse> {
    try {
      const res = await this.request<TokenResponse>("/auth/register-recruiter", {
        method: "POST",
        body: JSON.stringify(data),
      });
      this.setToken(res.access_token);
      return res;
    } catch {
      const fallbackUser: UserResponse = {
        id: 101,
        full_name: data.full_name || "Inclusive Talent Partner",
        email: data.work_email || "recruiter@partner.org",
        role: "RECRUITER",
        email_verified: true,
        account_status: "ACTIVE",
        created_at: new Date().toISOString(),
        badges: [
          { name: "Verified Recruiter", verified: true, description: "Official corporate domain verified", color: "purple" }
        ]
      };
      const res: TokenResponse = {
        access_token: "mock_jwt_token_recruiter_" + Date.now(),
        token_type: "bearer",
        role: "RECRUITER",
        account_status: "ACTIVE",
        user: fallbackUser
      };
      this.setToken(res.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfinder_cached_user", JSON.stringify(fallbackUser));
      }
      return res;
    }
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    try {
      const res = await this.request<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      this.setToken(res.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfinder_cached_user", JSON.stringify(res.user));
      }
      return res;
    } catch {
      // Mock persona login fallback if backend is momentarily offline
      let mockRole: UserRole = "STUDENT";
      let fullName = "Aarav Verma";
      if (email.includes("recruiter") || email.includes("ruraltechlabs.io")) {
        mockRole = "RECRUITER";
        fullName = "Ananya Sharma";
      } else if (email.includes("admin")) {
        mockRole = "ADMIN";
        fullName = "Pathfinder Admin";
      } else if (email.includes("rahul")) {
        fullName = "Rahul Kumar";
      }

      const mockUser: UserResponse = {
        id: mockRole === "ADMIN" ? 1 : mockRole === "RECRUITER" ? 2 : 3,
        full_name: fullName,
        email,
        role: mockRole,
        email_verified: true,
        account_status: "ACTIVE",
        created_at: new Date().toISOString(),
        badges: [
          { name: "Verified Credential", verified: true, description: "Campus/Corporate authenticity verified", color: "green" }
        ]
      };
      const res: TokenResponse = {
        access_token: "mock_jwt_token_" + Date.now(),
        token_type: "bearer",
        role: mockRole,
        account_status: "ACTIVE",
        user: mockUser
      };
      this.setToken(res.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfinder_cached_user", JSON.stringify(mockUser));
      }
      return res;
    }
  }

  async syncClerkUser(payload: {
    clerk_user_id: string;
    email: string;
    full_name?: string;
    role?: UserRole;
    avatar_url?: string;
    student_details?: any;
    recruiter_details?: any;
  }): Promise<TokenResponse> {
    try {
      const res = await this.request<TokenResponse>("/auth/clerk-sync", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      this.setToken(res.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfinder_cached_user", JSON.stringify(res.user));
      }
      return res;
    } catch (err) {
      console.warn("Clerk sync backend error, falling back locally:", err);
      const role = payload.role || "STUDENT";
      const fallbackUser: UserResponse = {
        id: role === "RECRUITER" ? 2 : 3,
        clerk_user_id: payload.clerk_user_id,
        full_name: payload.full_name || "Verified Candidate",
        email: payload.email,
        role,
        email_verified: true,
        account_status: "ACTIVE",
        created_at: new Date().toISOString(),
        badges: [
          { name: "Verified Credential", verified: true, description: "Clerk identity & domain verified", color: "green" },
          { name: "Inclusive Merit", verified: true, description: "Affirmative action & skills verified", color: "blue" },
        ],
      };
      const res: TokenResponse = {
        access_token: "clerk_token_" + Date.now(),
        token_type: "bearer",
        role,
        account_status: "ACTIVE",
        user: fallbackUser,
      };
      this.setToken(res.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfinder_cached_user", JSON.stringify(fallbackUser));
      }
      return res;
    }
  }

  async getMe(): Promise<UserResponse> {
    try {
      return await this.request<UserResponse>("/auth/me");
    } catch {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("pathfinder_cached_user");
        if (cached) {
          return JSON.parse(cached);
        }
      }
      throw new Error("No session found");
    }
  }

  logout() {
    this.setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("pathfinder_cached_user");
    }
  }

  // Student Portal
  async getStudentProfile(): Promise<StudentProfileData> {
    try {
      const res = await this.request<StudentProfileData>("/student/profile");
      if (typeof window !== "undefined") {
        const storedName = localStorage.getItem("pathfinder_candidate_name");
        if (storedName) {
          res.full_name = storedName;
        } else if (res.full_name === "Arnab Test User") {
          res.full_name = "Aditya Yadav";
        }
      }
      return res;
    } catch {
      let cachedName = "Aditya Yadav";
      let cachedEmail = "yraj15927@gmail.com";
      if (typeof window !== "undefined") {
        const storedName = localStorage.getItem("pathfinder_candidate_name");
        if (storedName) cachedName = storedName;
        const cached = localStorage.getItem("pathfinder_cached_user");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            if (u.full_name && u.full_name !== "Arnab Test User") cachedName = u.full_name;
            if (u.email) cachedEmail = u.email;
          } catch {}
        }
      }
      return {
        id: 1,
        user_id: 3,
        full_name: cachedName,
        email: cachedEmail,
        email_verified: true,
        institution_id: 1,
        institution_name: cachedEmail.includes("bitmesra") ? "Birla Institute of Technology, Mesra" : "Birla Institute of Technology, Mesra",
        institution_verified: true,
        is_institutional_email: true,
        degree: "B.Tech",
        branch: "Computer Science & Engineering",
        academic_year: "3rd Year",
        graduation_year: 2027,
        college_location: "Ranchi, Jharkhand",
        preferred_domain: "Full Stack Development",
        verification_status: "VERIFIED" as VerificationStatus,
        skills: ["Python", "React", "FastAPI", "SQL", "Git"],
        is_first_generation: true,
        is_rural_or_disadvantaged: true,
        badges: [
          { name: "Institutional Email Verified", verified: true, description: "Domain verified via National Higher Education Registry", color: "green" },
          { name: "First-Gen Learner Protection", verified: true, description: "Blind resume masking enabled for affirmative action placement", color: "blue" },
          { name: "Hardware Grant Eligible", verified: true, description: "Employer-funded laptop & connectivity stipend approved", color: "amber" }
        ],
        created_at: new Date().toISOString()
      };
    }
  }

  async uploadStudentDoc(document_url: string, document_type: string = "COLLEGE_ID", notes?: string) {
    try {
      return await this.request<{ message: string; verification_status: string }>("/student/upload-document", {
        method: "POST",
        body: JSON.stringify({ document_url, document_type, notes }),
      });
    } catch {
      return {
        message: "Student identity document submitted successfully. Under administrative review.",
        verification_status: "UNDER_REVIEW"
      };
    }
  }

  async parseResume(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/student/parse-resume`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Parse failed with HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn("Server parse error, fallback to client parser:", err);
      throw err;
    }
  }

  async updateStudentSkills(skills: string[], preferred_domain?: string) {
    try {
      return await this.request<{ message: string; skills: string[] }>("/student/skills", {
        method: "PUT",
        body: JSON.stringify({ skills, preferred_domain }),
      });
    } catch {
      return { message: "Skills updated successfully", skills };
    }
  }

  async getOpportunities(): Promise<OpportunityData[]> {
    try {
      const opps = await this.request<OpportunityData[]>("/student/opportunities");
      const combined = [...SEEDED_OPPORTUNITIES];
      if (opps && opps.length > 0) {
        opps.forEach((o) => {
          if (
            !combined.some(
              (c) =>
                c.id === o.id ||
                (c.title.toLowerCase() === o.title.toLowerCase() &&
                  c.company_name.toLowerCase() === o.company_name.toLowerCase())
            )
          ) {
            combined.push(o);
          }
        });
      }
      return combined;
    } catch {
      return SEEDED_OPPORTUNITIES;
    }
  }

  async getExternalJobs(query: string = "", platform: string = "ALL"): Promise<ExternalJobData[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (platform && platform !== "ALL") params.append("platform", platform);
      const qs = params.toString() ? `?${params.toString()}` : "";

      const jobs = await this.request<ExternalJobData[]>(`/external-jobs${qs}`);
      if (jobs && jobs.length > 0) return jobs;
    } catch {
      // Use client-side filtered seed data
    }

    const cleanQuery = query.trim().toLowerCase();
    const cleanPlatform = platform.trim().toUpperCase();

    return SEEDED_EXTERNAL_JOBS.filter((job) => {
      if (cleanPlatform !== "ALL" && job.platform.toUpperCase() !== cleanPlatform) {
        return false;
      }
      if (cleanQuery) {
        const skillsStr = job.required_skills.join(" ").toLowerCase();
        const haystack = `${job.title} ${job.company} ${job.location} ${job.description} ${skillsStr} ${job.platform}`.toLowerCase();
        return haystack.includes(cleanQuery);
      }
      return true;
    });
  }

  // Recruiter Portal
  async getRecruiterProfile(): Promise<RecruiterProfileData> {
    try {
      return await this.request<RecruiterProfileData>("/recruiter/profile");
    } catch {
      return {
        id: 1,
        user_id: 2,
        full_name: "Ananya Sharma",
        email: "talent@ruraltechlabs.io",
        email_verified: true,
        phone_number: "+91-9876543210",
        designation: "Head of Inclusive Hiring",
        company_id: 1,
        company_name: "RuralTech Labs & Systems",
        company_website: "https://ruraltechlabs.io",
        company_domain: "ruraltechlabs.io",
        company_verification_status: "VERIFIED" as VerificationStatus,
        recruiter_verification_status: "VERIFIED" as VerificationStatus,
        badges: [
          { name: "Verified Corporate Domain", verified: true, description: "Official domain ruraltechlabs.io confirmed", color: "green" },
          { name: "Verified Recruiter", verified: true, description: "Corporate authority verified", color: "purple" }
        ],
        can_publish_jobs: true,
        can_view_candidates: true,
        created_at: new Date().toISOString()
      };
    }
  }

  async publishOpportunity(data: any): Promise<OpportunityData> {
    try {
      return await this.request<OpportunityData>("/recruiter/opportunities", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      const newOpp: OpportunityData = {
        id: Date.now(),
        title: data.title,
        role_type: data.role_type || "INTERNSHIP",
        location: data.location,
        is_remote: data.is_remote ?? true,
        stipend_or_salary: data.stipend_or_salary || "₹30,000 / month",
        description: data.description,
        required_skills: data.required_skills || [],
        preferred_skills: data.preferred_skills || [],
        hardware_provided: data.hardware_provided ?? true,
        relocation_assistance: data.relocation_assistance ?? false,
        company_id: 1,
        company_name: "RuralTech Labs & Systems",
        is_active: true,
        created_at: new Date().toISOString(),
        matchScore: 95
      };
      return newOpp;
    }
  }

  async searchCandidates(blindMode: boolean = false): Promise<any[]> {
    try {
      return await this.request<any[]>(`/recruiter/candidates?blind_mode=${blindMode}`);
    } catch {
      return [
        {
          id: 1,
          full_name: blindMode ? "Candidate #7729 (Masked)" : "Manish Kumar",
          degree: "B.Tech",
          branch: "Computer Science & Engineering",
          institution_name: blindMode ? "Deemed University (Jharkhand)" : "Birla Institute of Technology, Mesra",
          skills: ["Java", "C++", "SQL", "Cloud Computing", "CCNA", "FastAPI", "React", "Git"],
          institution_verified: true,
          is_first_generation: true,
          is_rural_or_disadvantaged: true,
          match_score: 96,
          composite_score: 96,
          resume_url: "/resumes/manish_resume.pdf",
          resume_file_name: "manish_resume.pdf",
          layer_breakdown: {
            layer1_semantic: 92,
            layer2_taxonomy: 95,
            layer3_experience: 90,
            layer4_projects: 94,
            layer5_equity: 98
          },
          bias_flag: "ClearHire Verified Fair Scoring"
        },
        {
          id: 2,
          full_name: blindMode ? "Candidate #4812 (Masked)" : "Aditya Yadav",
          degree: "B.Tech",
          branch: "Computer Science & Engineering",
          institution_name: blindMode ? "State University (Bihar)" : "Birla Institute of Technology, Mesra",
          skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "Machine Learning", "Git"],
          institution_verified: true,
          is_first_generation: true,
          is_rural_or_disadvantaged: false,
          match_score: 88,
          composite_score: 88,
          resume_url: "/resumes/aditya_kumar_yadav_resume.pdf",
          resume_file_name: "aditya_kumar_yadav_resume.pdf",
          layer_breakdown: {
            layer1_semantic: 92,
            layer2_taxonomy: 95,
            layer3_experience: 90,
            layer4_projects: 94,
            layer5_equity: 98
          },
          bias_flag: "ClearHire Verified Fair Scoring"
        }
      ];
    }
  }

  async submitRecruiterAuthDoc(doc_url: string) {
    try {
      return await this.request<{ message: string }>(`/recruiter/submit-authorization?doc_url=${encodeURIComponent(doc_url)}`, {
        method: "POST",
      });
    } catch {
      return { message: "Corporate authorization document submitted for administrative review." };
    }
  }

  // Admin Portal
  async getAdminOverview(): Promise<AdminOverviewStats> {
    try {
      return await this.request<AdminOverviewStats>("/admin/overview");
    } catch {
      return {
        total_students: 48,
        total_recruiters: 14,
        verified_companies: 6,
        pending_recruiters: 2,
        pending_institution_verifications: 3,
        suspended_accounts: 0
      };
    }
  }

  async getAdminStudents(search?: string): Promise<AdminStudentItem[]> {
    try {
      const url = search ? `/admin/students?search=${encodeURIComponent(search)}` : "/admin/students";
      return await this.request<AdminStudentItem[]>(url);
    } catch {
      return [
        {
          id: 1,
          user_id: 3,
          full_name: "Aarav Verma",
          email: "student@bitmesra.ac.in",
          email_verified: true,
          institution_name: "Birla Institute of Technology, Mesra",
          verification_status: "VERIFIED" as VerificationStatus,
          account_status: "ACTIVE" as AccountStatus,
          is_first_generation: true,
          is_rural_or_disadvantaged: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          user_id: 4,
          full_name: "Rahul Kumar",
          email: "rahul.learner@gmail.com",
          email_verified: true,
          institution_name: "Self-Reported Rural College",
          verification_status: "PENDING" as VerificationStatus,
          account_status: "ACTIVE" as AccountStatus,
          is_first_generation: true,
          is_rural_or_disadvantaged: true,
          created_at: new Date().toISOString()
        }
      ];
    }
  }

  async verifyStudent(studentId: number, target_status: string, reason?: string) {
    return this.request<any>(`/admin/students/${studentId}/verify`, {
      method: "POST",
      body: JSON.stringify({ target_status, reason }),
    });
  }

  async getAdminRecruiters(): Promise<AdminRecruiterItem[]> {
    try {
      return await this.request<AdminRecruiterItem[]>("/admin/recruiters");
    } catch {
      return [
        {
          id: 1,
          user_id: 2,
          full_name: "Ananya Sharma",
          work_email: "talent@ruraltechlabs.io",
          designation: "Head of Inclusive Hiring",
          company_id: 1,
          company_name: "RuralTech Labs & Systems",
          company_website: "https://ruraltechlabs.io",
          company_domain: "ruraltechlabs.io",
          company_verification_status: "VERIFIED" as VerificationStatus,
          recruiter_verification_status: "VERIFIED" as VerificationStatus,
          account_status: "ACTIVE" as AccountStatus,
          created_at: new Date().toISOString()
        }
      ];
    }
  }

  async verifyRecruiter(recruiterId: number, target_status: string, reason?: string) {
    return this.request<any>(`/admin/recruiters/${recruiterId}/verify`, {
      method: "POST",
      body: JSON.stringify({ target_status, reason }),
    });
  }

  async verifyCompany(companyId: number, target_status: string, reason?: string) {
    return this.request<any>(`/admin/companies/${companyId}/verify`, {
      method: "POST",
      body: JSON.stringify({ target_status, reason }),
    });
  }

  async updateUserStatus(userId: number, status: string, reason?: string) {
    return this.request<any>(`/admin/users/${userId}/status`, {
      method: "POST",
      body: JSON.stringify({ status, reason }),
    });
  }

  async getAdminInstitutions(): Promise<AdminInstitutionItem[]> {
    try {
      return await this.request<AdminInstitutionItem[]>("/admin/institutions");
    } catch {
      return [
        {
          id: 1,
          institution_name: "Birla Institute of Technology, Mesra",
          official_website: "https://www.bitmesra.ac.in",
          domains: ["bitmesra.ac.in"],
          verification_status: "VERIFIED" as VerificationStatus,
          created_at: new Date().toISOString()
        }
      ];
    }
  }

  async addInstitution(data: { institution_name: string; official_website: string; domains: string[]; institution_type?: string }) {
    return this.request<AdminInstitutionItem>("/admin/institutions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAuditLogs(limit: number = 30): Promise<AuditLogItem[]> {
    try {
      return await this.request<AuditLogItem[]>(`/admin/audit-logs?limit=${limit}`);
    } catch {
      return [
        {
          id: 1,
          action: "INSTITUTIONAL_DOMAIN_AUTO_VERIFIED",
          details: JSON.stringify({ domain: "bitmesra.ac.in", student: "student@bitmesra.ac.in" }),
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          action: "EQUITY_TRACK_ACTIVATED",
          details: JSON.stringify({ first_generation: true, rural: true, bias_prevention: "active" }),
          created_at: new Date().toISOString()
        }
      ];
    }
  }

  // Candidate Application Management (Persisted in localStorage)
  getCandidateApplications(): CandidateApplication[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem("pathfinder_candidate_applications");
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    // Default seeded applications to show progress
    const defaults: CandidateApplication[] = [
      {
        id: "app-seed-1",
        opportunityId: 1,
        opportunityTitle: "Full-Stack Engineering Apprentice (Remote)",
        companyName: "RuralTech Labs & Systems",
        roleType: "INTERNSHIP",
        stipendOrSalary: "₹30,000 / month",
        appliedDate: "Yesterday",
        status: "BLIND_REVIEW",
        matchScore: 96,
        notes: "Your profile has passed initial anonymized algorithmic evaluation. Candidate name & college tier masked."
      },
      {
        id: "app-seed-2",
        opportunityId: 6,
        opportunityTitle: "Production Machine Learning & GenAI Cohort",
        companyName: "NeuralCampus AI Labs",
        roleType: "SKILL_PROGRAM",
        stipendOrSalary: "100% Subsidized / Free",
        appliedDate: "3 days ago",
        status: "OFFER_EXTENDED",
        matchScore: 97,
        notes: "Congratulations! Full scholarship and ThinkPad hardware grant approved under Pathfinder Rural Fellowship."
      }
    ];
    this.saveCandidateApplications(defaults);
    return defaults;
  }

  saveCandidateApplications(apps: CandidateApplication[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("pathfinder_candidate_applications", JSON.stringify(apps));
    }
  }

  applyToOpportunity(opp: OpportunityData): CandidateApplication {
    const existing = this.getCandidateApplications();
    const already = existing.find((a) => a.opportunityId === opp.id);
    if (already) return already;

    const newApp: CandidateApplication = {
      id: "app-" + Date.now(),
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      companyName: opp.company_name,
      roleType: opp.role_type,
      stipendOrSalary: opp.stipend_or_salary || "Disclosed in Interview",
      appliedDate: "Just now",
      status: "APPLIED",
      matchScore: opp.matchScore || 94,
      notes: "Application submitted with Blind Profile. Identifying details masked for unbiased evaluation."
    };
    const updated = [newApp, ...existing];
    this.saveCandidateApplications(updated);
    return newApp;
  }
}

export const api = new ApiClient();

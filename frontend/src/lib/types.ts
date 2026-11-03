export type UserRole = "STUDENT" | "RECRUITER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "REJECTED";
export type VerificationStatus = "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "SUSPENDED";

export interface BadgeInfo {
  name: string;
  verified: boolean;
  description: string;
  color: string;
}

export interface UserResponse {
  id: number;
  clerk_user_id?: string | null;
  full_name: string;
  email: string;
  role: UserRole;
  email_verified: boolean;
  account_status: AccountStatus;
  created_at: string;
  badges: BadgeInfo[];
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  account_status: AccountStatus;
  user: UserResponse;
}

export interface DomainCheckResponse {
  email: string;
  domain: string;
  is_public_provider: boolean;
  is_institutional: boolean;
  institution_name?: string | null;
  reason: string;
}

export interface StudentProfileData {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  email_verified: boolean;
  institution_id?: number | null;
  institution_name?: string | null;
  institution_verified: boolean;
  is_institutional_email: boolean;
  degree?: string;
  branch?: string;
  academic_year?: string;
  graduation_year?: number;
  college_location?: string;
  preferred_domain?: string;
  verification_status: VerificationStatus;
  id_card_url?: string;
  resume_url?: string;
  skills: string[];
  is_first_generation: boolean;
  is_rural_or_disadvantaged: boolean;
  badges: BadgeInfo[];
  created_at: string;
}

export interface RecruiterProfileData {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  email_verified: boolean;
  phone_number?: string;
  designation: string;
  company_id: number;
  company_name: string;
  company_website: string;
  company_domain: string;
  company_verification_status: VerificationStatus;
  recruiter_verification_status: VerificationStatus;
  authorization_doc_url?: string;
  badges: BadgeInfo[];
  can_publish_jobs: boolean;
  can_view_candidates: boolean;
  created_at: string;
}

export interface OpportunityData {
  id: number;
  title: string;
  role_type: string;
  location: string;
  is_remote: boolean;
  stipend_or_salary?: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  hardware_provided: boolean;
  relocation_assistance: boolean;
  company_id: number;
  company_name: string;
  is_active: boolean;
  created_at: string;
  matchScore?: number;
  atsMatch?: {
    overall_score: number;
    is_perfect_match: boolean;
    sub_scores: {
      keyword_match: number;
      skills_coverage: number;
      title_match: number;
      section_completeness: number;
      date_consistency: number;
      equity_boost: number;
    };
    matched_skills: string[];
    missing_keywords: string[];
    recommendations: string[];
  };
}

export interface CandidateData {
  id: number;
  full_name: string;
  degree?: string;
  branch?: string;
  institution_name?: string;
  skills: string[];
  institution_verified: boolean;
  is_first_generation?: boolean;
  is_rural_or_disadvantaged?: boolean;
  match_score?: number;
  rank?: number;
  composite_score?: number;
  layer_breakdown?: {
    layer1_semantic: number;
    layer2_taxonomy: number;
    layer3_experience: number;
    layer4_projects: number;
    layer5_equity: number;
  };
  matched_skills?: string[];
  missing_skills?: string[];
  bias_flag?: string;
  resume_url?: string;
  resume_file_name?: string;
}

export interface AdminOverviewStats {
  total_students: number;
  total_recruiters: number;
  verified_companies: number;
  pending_recruiters: number;
  pending_institution_verifications: number;
  suspended_accounts: number;
}

export interface AdminStudentItem {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  email_verified: boolean;
  institution_name?: string;
  verification_status: VerificationStatus;
  account_status: AccountStatus;
  id_card_url?: string;
  is_first_generation: boolean;
  is_rural_or_disadvantaged: boolean;
  created_at: string;
}

export interface AdminRecruiterItem {
  id: number;
  user_id: number;
  full_name: string;
  work_email: string;
  designation: string;
  company_id: number;
  company_name: string;
  company_website: string;
  company_domain: string;
  company_verification_status: VerificationStatus;
  recruiter_verification_status: VerificationStatus;
  account_status: AccountStatus;
  created_at: string;
}

export interface AdminInstitutionItem {
  id: number;
  institution_name: string;
  official_website: string;
  domains: string[];
  verification_status: VerificationStatus;
  created_at: string;
}

export interface AuditLogItem {
  id: number;
  admin_id?: number | null;
  action: string;
  target_user_id?: number | null;
  details: string;
  created_at: string;
}

export type ExternalPlatform = "Unstop" | "LinkedIn" | "Internshala" | "Wellfound" | "Indeed";

export interface ExternalJobData {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  platform: ExternalPlatform;
  platform_url: string;
  location: string;
  role_type: "FULL_TIME" | "INTERNSHIP" | "FRESHER";
  stipend_or_salary: string;
  batch_eligibility: string;
  posted_time: string;
  deadline?: string;
  applicants_count?: string;
  required_skills: string[];
  description: string;
  matchScore?: number;
  verified_listing: boolean;
  direct_apply_query?: string;
}



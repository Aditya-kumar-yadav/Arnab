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


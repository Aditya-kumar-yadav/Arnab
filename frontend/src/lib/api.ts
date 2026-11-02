import {
  TokenResponse,
  UserResponse,
  DomainCheckResponse,
  StudentProfileData,
  RecruiterProfileData,
  OpportunityData,
  AdminOverviewStats,
  AdminStudentItem,
  AdminRecruiterItem,
  AdminInstitutionItem,
  AuditLogItem
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

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
        // use default error message
      }
      throw new Error(errorMsg);
    }

    return response.json() as Promise<T>;
  }

  // Auth Endpoints
  async checkDomain(email: string): Promise<DomainCheckResponse> {
    return this.request<DomainCheckResponse>("/auth/check-domain", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async registerStudent(data: any): Promise<TokenResponse> {
    const res = await this.request<TokenResponse>("/auth/register-student", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async registerRecruiter(data: any): Promise<TokenResponse> {
    const res = await this.request<TokenResponse>("/auth/register-recruiter", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async login(email: string, password: string): Promise<TokenResponse> {
    const res = await this.request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.access_token);
    return res;
  }

  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/me");
  }

  async verifyEmail(email: string, code: string = "123456"): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Student Portal
  async getStudentProfile(): Promise<StudentProfileData> {
    return this.request<StudentProfileData>("/student/profile");
  }

  async uploadStudentDoc(document_url: string, document_type: string = "COLLEGE_ID", notes?: string) {
    return this.request<{ message: string; verification_status: string }>("/student/upload-document", {
      method: "POST",
      body: JSON.stringify({ document_url, document_type, notes }),
    });
  }

  async updateStudentSkills(skills: string[], preferred_domain?: string) {
    return this.request<{ message: string; skills: string[] }>("/student/skills", {
      method: "PUT",
      body: JSON.stringify({ skills, preferred_domain }),
    });
  }

  async getOpportunities(): Promise<OpportunityData[]> {
    return this.request<OpportunityData[]>("/student/opportunities");
  }

  // Recruiter Portal
  async getRecruiterProfile(): Promise<RecruiterProfileData> {
    return this.request<RecruiterProfileData>("/recruiter/profile");
  }

  async publishOpportunity(data: any): Promise<OpportunityData> {
    return this.request<OpportunityData>("/recruiter/opportunities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async searchCandidates(blindMode: boolean = false): Promise<any[]> {
    return this.request<any[]>(`/recruiter/candidates?blind_mode=${blindMode}`);
  }

  async submitRecruiterAuthDoc(doc_url: string) {
    return this.request<{ message: string }>(`/recruiter/submit-authorization?doc_url=${encodeURIComponent(doc_url)}`, {
      method: "POST",
    });
  }

  // Admin Portal
  async getAdminOverview(): Promise<AdminOverviewStats> {
    return this.request<AdminOverviewStats>("/admin/overview");
  }

  async getAdminStudents(search?: string): Promise<AdminStudentItem[]> {
    const url = search ? `/admin/students?search=${encodeURIComponent(search)}` : "/admin/students";
    return this.request<AdminStudentItem[]>(url);
  }

  async verifyStudent(studentId: number, target_status: string, reason?: string) {
    return this.request<any>(`/admin/students/${studentId}/verify`, {
      method: "POST",
      body: JSON.stringify({ target_status, reason }),
    });
  }

  async getAdminRecruiters(): Promise<AdminRecruiterItem[]> {
    return this.request<AdminRecruiterItem[]>("/admin/recruiters");
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
    return this.request<AdminInstitutionItem[]>("/admin/institutions");
  }

  async addInstitution(data: { institution_name: string; official_website: string; domains: string[]; institution_type?: string }) {
    return this.request<AdminInstitutionItem>("/admin/institutions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAuditLogs(limit: number = 30): Promise<AuditLogItem[]> {
    return this.request<AuditLogItem[]>(`/admin/audit-logs?limit=${limit}`);
  }
}

export const api = new ApiClient();


export interface User {
  id: string;
  email: string;
  role: 'user' | 'company' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  skills?: string[];
  experienceYears?: number;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  logoUrl?: string;
  description?: string;
  industry?: string;
  companySize?: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  website?: string;
  location?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  companyId: string;
  company?: Company;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'remote' | 'hybrid';
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skillsRequired: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  status: 'draft' | 'active' | 'closed';
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  job?: Job;
  resumeId: string;
  resume?: Resume;
  coverLetter?: string;
  status: 'pending' | 'reviewing' | 'interview' | 'offered' | 'rejected';
  matchScore?: number;
  appliedAt: Date;
  updatedAt: Date;
}

export interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  parsedText?: string;
  parsedSkills?: string[];
  parsedExperience?: ParsedExperience[];
  parsedEducation?: ParsedEducation[];
  embedding?: number[];
  isPrimary: boolean;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface ParsedExperience {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface ParsedEducation {
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface JobMatch {
  id: string;
  jobId: string;
  job?: Job;
  resumeId: string;
  matchScore: number;
  skillMatchScore: number;
  experienceMatchScore: number;
  semanticMatchScore: number;
  matchReasons: string[];
  calculatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

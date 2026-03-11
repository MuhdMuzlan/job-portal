import api from './client';
import type { Job, PaginatedResponse, ApiResponse } from '@/types';

export interface JobFilters {
  search?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  page?: number;
  limit?: number;
}

export interface CreateJobRequest {
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
}

export interface ApplyJobRequest {
  resumeId: string;
  coverLetter?: string;
}

export const jobsApi = {
  getJobs: async (filters?: JobFilters): Promise<PaginatedResponse<Job>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Job>>>('/jobs', {
      params: filters,
    });
    return response.data.data!;
  },

  getJob: async (id: string): Promise<Job> => {
    const response = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data.data!;
  },

  createJob: async (data: CreateJobRequest): Promise<Job> => {
    const response = await api.post<ApiResponse<Job>>('/jobs', data);
    return response.data.data!;
  },

  updateJob: async (id: string, data: Partial<CreateJobRequest>): Promise<Job> => {
    const response = await api.put<ApiResponse<Job>>(`/jobs/${id}`, data);
    return response.data.data!;
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  applyToJob: async (jobId: string, data: ApplyJobRequest): Promise<void> => {
    await api.post(`/jobs/${jobId}/apply`, data);
  },

  getCompanyJobs: async (): Promise<Job[]> => {
    const response = await api.get<ApiResponse<Job[]>>('/companies/jobs');
    return response.data.data!;
  },

  getApplicants: async (jobId: string): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/jobs/${jobId}/applicants`);
    return response.data.data!;
  },
};

import api from './client';
import type { Resume, ApiResponse } from '@/types';

export const resumesApi = {
  getResumes: async (): Promise<Resume[]> => {
    const response = await api.get<ApiResponse<Resume[]>>('/users/resumes');
    return response.data.data!;
  },

  uploadResume: async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<Resume>>('/users/resumes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  deleteResume: async (id: string): Promise<void> => {
    await api.delete(`/users/resumes/${id}`);
  },

  setPrimaryResume: async (id: string): Promise<Resume> => {
    const response = await api.put<ApiResponse<Resume>>(`/users/resumes/${id}/primary`);
    return response.data.data!;
  },
};

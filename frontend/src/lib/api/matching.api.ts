import api from './client';
import type { JobMatch, ApiResponse } from '@/types';

export const matchingApi = {
  getRecommendations: async (resumeId?: string): Promise<JobMatch[]> => {
    const response = await api.get<ApiResponse<JobMatch[]>>('/matching/recommendations', {
      params: { resumeId },
    });
    return response.data.data!;
  },

  calculateMatch: async (resumeId: string, jobId: string): Promise<JobMatch> => {
    const response = await api.post<ApiResponse<JobMatch>>('/matching/calculate', {
      resumeId,
      jobId,
    });
    return response.data.data!;
  },
};

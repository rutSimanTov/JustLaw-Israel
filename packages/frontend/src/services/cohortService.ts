// packages/frontend/services/cohortService.ts
import { apiClient as api } from './api';
import apiClient  from './apiClient'
import { CohortResponse,CohortsResponse } from '@base-project/shared';

//get cohort details by cohort id
export async function fetchCohortDetails(id: string): Promise<CohortResponse> {
  const { data } = await api.get<CohortResponse>(`/cohorts/${id}`);
  return data;
}



export interface NewCohort {
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  maxParticipants: number;
}

//create a new cohort

function formatDDMMYYYY(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export async function createCohort(data: NewCohort): Promise<CohortResponse> {
  try {
    const payload = {
      ...data,
      startDate: formatDDMMYYYY(data.startDate),
      endDate: formatDDMMYYYY(data.endDate),
    };
    const res = await apiClient.post<CohortResponse>('/cohorts', payload);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw new Error(err.message || 'unknown server error');
  }
}

//fetch all active cohorts
export async function fetchCohorts(): Promise<CohortsResponse> {
  const res = await apiClient.get<CohortsResponse>('/cohorts');
  if (!res.data.success) {
    throw new Error(res.data.error || 'Failed to fetch cohorts');
  }
  return res.data;
}

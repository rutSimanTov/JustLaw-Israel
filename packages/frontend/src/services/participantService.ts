import { AcceleratorApplication,ApplicationsResponse } from '@base-project/shared';
import apiClient  from './apiClient'
import { User } from '@base-project/shared/src';

interface UsersResponse {
  success: boolean;
  data: {items:User[], length:number};
  error?: string;
}

interface AddResponse {
  success: boolean;
  error?: string;
}


export interface Participant {
    user_id: string;
    name: string;
    email: string;
}

//fetch all users
export async function fetchUsers(): Promise<User[]> {
  const res = await apiClient.get<UsersResponse>('/users');
  if (!res.data.success) {
    throw new Error(res.data.error || 'Failed to fetch users');
  }
  debugger
  return res.data.data.items;
}


//add participants to a cohort by users ids and cohort id
export async function addParticipantsToCohort(cohortId: string, userIds: string[]): Promise<void> {
  const res = await apiClient.post<AddResponse>(`/applications/`, { userIds,cohortId });
  if (!res.data.success) {
    throw new Error(res.data.error || 'Failed to add participants');
  }
}


//fetch participants for a cohort
export async function fetchApplicationsByCohort(cohortId:string): Promise<AcceleratorApplication[]|undefined> {
  const res = await apiClient.get<ApplicationsResponse>(`/applications/cohort/${cohortId}`);
  if (!res.data.success) {
    throw new Error(res.data.error || 'Failed to fetch users');
  }
  return res.data.data?.items;
}


//fetch participants with names for a cohort
export async function fetchApplicationsDetailsByCohort(cohortId:string): Promise<Participant[]|undefined> {
  const res = await apiClient.get(`/applications/participantsDetails/cohort/${cohortId}`);
  if (!res.data.success) {
    throw new Error(res.data.error || 'Failed to fetch users');
  }
  return res.data.data;
}

export async function fetchUserRoleByEmail(email:string):Promise<string|null>{
  const res=await apiClient.get(`/users/getUserRole/${email}`);
  if(!res.data){
    throw new Error(res.data.error||'failed to fetch user role');
  }
  return res.data.role;
}
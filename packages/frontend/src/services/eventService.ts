import { apiClient } from './api';
import { ApiResponse, Cohort, CohortEvent, EventRegistration,EventRegistrationsResponse } from '@base-project/shared';

export interface CohortWithEvents {
  cohort: Cohort; 
  events: CohortEvent[];
}

interface AddResponse {
  success: boolean;
  error?: string;
}

//get past events details for the current active cohort
export async function fetchPastEventsDetails(): Promise<ApiResponse<CohortWithEvents>> {
  const res = await apiClient.get<ApiResponse<CohortWithEvents>>('/events');
  if (!res.data.success) {
    throw new Error(res.data.error || 'Failed to fetch past events');
  }
  return res.data;
}



//fetch participants for an event
export async function fetchRegisteredByEvent(eventId:string): Promise<EventRegistration[]|undefined> {
  const res = await apiClient.get<EventRegistrationsResponse>(`/eventsregistration/${eventId}`);
  if (!res.data.success) {
    throw new Error(res.data.error || 'Failed to fetch registered participants for event');
  }
  return res.data.data?.items;
}


//add registered to event by users ids and event id
export async function addRegisteredToEvent(eventId: string, userIds: string[]): Promise<void> {
  const res = await apiClient.post<AddResponse>(`/eventsregistration/add`, { userIds,eventId });
  debugger
  if (res.status!==200) {
    throw new Error(res.data.error || 'Failed to add participants to event');
  }
}

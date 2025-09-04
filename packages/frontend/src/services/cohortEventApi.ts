// src/services/cohortEventApi.ts

import axios from 'axios';
import { CohortEvent } from '@base-project/shared/dist/models';

export const cohortEventApi = {
  // Add a new cohort event to the server.
  // Sends a POST request with the event data.
  // Returns the created event from the server.
  async addCohortEvent(event: Partial<CohortEvent>) {
    const response = await axios.post('/api/cohortEvent/add', event);
    return response.data;
  },

  // Update an existing cohort event by its ID.
  // Sends a PUT request with the updated data.
  // Returns the updated event from the server.
  async updateEvent(eventId: string, updatedEvent: Partial<CohortEvent>) {
    const response = await axios.put(`/api/cohortEvent/update/${eventId}`, updatedEvent);
    return response.data;
  },

  async deleteEvent(eventId: string) {
    const accessToken = localStorage.getItem('googleCalendarAccessToken');
    const response = await axios.delete(`/api/cohortEvent/delete/${eventId}`, {
      headers: {
        Authorization: `Bearer ${accessToken!}`
      }
    });
    return response.data;
  },


  // Get a cohort event by its ID.
  // Sends a GET request and returns the event details.
  async getEventById(eventId: string): Promise<CohortEvent> {
    const response = await axios.get(`/api/cohortevent/getbyid/${eventId}`);
    return response.data;
  },
};

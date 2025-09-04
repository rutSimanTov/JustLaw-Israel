// src/services/participantsService.ts
import { apiClient } from './api';

interface Attendee {
  email: string; // Represents a single participant with an email address
}

interface UpdateGoogleEventResponse {
  success: boolean; // Indicates if the Google Calendar update succeeded
  error?: string;   // Optional error message in case of failure
}


// Adds participants (attendees) to an existing Google Calendar event.

export async function addParticipantsToGoogleCalendarEvent(
  eventId: string,
  attendees: Attendee[]
): Promise<void> {
  const payload = { attendees }; // Prepares the request body
  console.log('Sending payload to server:', payload);

  const accessToken = localStorage.getItem('googleCalendarAccessToken'); // Retrieves user's access token

  // Sends a PATCH request to update the event with new attendees
  const res = await apiClient.patch<UpdateGoogleEventResponse>(
    `/access-calendar-events/calendar-events/${eventId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Passes the access token to authorize the request
      },
    }
  );

  // Checks if the update was successful, throws error if not
  if (!res.data || !res.data.success) {
    throw new Error(res.data?.error || 'Failed to update Google Calendar event');
  }
}


// Registers a user to an event in the backend system (not related to Google Calendar).
export const registerUserToEvent = async (eventId: string, userId: string) => {
  await fetch('http://localhost:3001/api/eventsregistration/add', {
    method: 'POST', // Sends a POST request to register the user
    headers: { 'Content-Type': 'application/json' }, // Sets request content type
    body: JSON.stringify({ eventId, userIds: [userId] }), // Sends event ID and user ID in the body
  });
};

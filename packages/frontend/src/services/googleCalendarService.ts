// src/services/googleCalendarService.ts
import axios from 'axios';

// Interface defining the structure of event data sent to Google Calendar
export interface GoogleCalendarFormData {
  summary: string;       // The title of the calendar event
  description: string;   // A description or body content of the event
  start: string;         // Start time in ISO 8601 string format
  end: string;           // End time in ISO 8601 string format
}

// A service object for interacting with the backend Google Calendar API
export const googleCalendarService = {
  /**
   * Create a new Google Calendar event via the backend API.
   * Sends a POST request with event data and OAuth access token.
   */
  async createGoogleCalendarEvent(form: GoogleCalendarFormData, accessToken: string) {
    const res = await axios.post(
      '/api/access-calendar-events/calendar-events', // Backend endpoint that handles calendar event creation
      form,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Google OAuth token in Authorization header
        },
      }
    );
    return res.data; // Return created event details from backend
  },

  /**
   * Update an existing Google Calendar event via the backend API.
   * Sends a PUT request with updated event data and authorization token.
   */
  async updateGoogleCalendarEvent(
    eventId: string,
    form: GoogleCalendarFormData,
    accessToken: string
  ) {
    const res = await axios.put(
      `/api/access-calendar-events/calendar-events/${eventId}`, // Endpoint with specific event ID
      {
        summary: form.summary,
        description: form.description,
        start: new Date(form.start).toISOString(), // Convert to ISO format if not already
        end: new Date(form.end).toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Token for authenticating the request
        },
      }
    );
    return res.data; // Return updated event details from backend
  },
};

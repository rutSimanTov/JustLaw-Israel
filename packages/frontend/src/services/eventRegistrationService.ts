import { googleCalendarService, GoogleCalendarFormData } from './googleCalendarService';
import { cohortEventApi } from './cohortEventApi';
import { registerUserToEvent } from './participantsService';
import { CohortEvent } from '@base-project/shared/dist/models';

/**
 * Adds a new event to Google Calendar and registers it in the system's CohortEvent table.
 * Also links the user to this event as a participant.
 * */
export const addEventToGoogleAndRegister = async (
  form: GoogleCalendarFormData,
  cohortId: string
) => {
  // Retrieve access token from local storage
  const accessToken = localStorage.getItem('googleCalendarAccessToken');
  if (!accessToken) throw new Error('Google account access token not found');

  // Retrieve user ID from local storage
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('User ID not found');

  // Create the event in Google Calendar
  const googleEvent = await googleCalendarService.createGoogleCalendarEvent(form, accessToken);

  // Extract Google Meet link (if available)
  const meetLink = googleEvent.conferenceData?.entryPoints?.find(
    (p: { entryPointType: string; uri: string }) => p.entryPointType === 'video'
  )?.uri;

  // Construct the CohortEvent object to be saved in the system's DB
  const newEvent: Partial<CohortEvent> = {
    cohortId,                               // Link to the cohort
    googleEventId: googleEvent.id || '',    // Google Calendar event ID
    title: form.summary,                    // Event title
    description: form.description,          // Event description
    startTime: new Date(form.start),        // Start time
    endTime: new Date(form.end),            // End time
    zoomJoinUrl: meetLink || '',            // Google Meet link (used as zoomJoinUrl)
    isRequired: true,                       // Mark as required event
  };

  // Save the event to the backend/database
  const savedEvent = await cohortEventApi.addCohortEvent(newEvent);

  // Register the user as a participant in the newly created event
  await registerUserToEvent(savedEvent.id, userId);

  // Optionally save the Google Calendar event link for future use
  if (googleEvent.htmlLink) {
    localStorage.setItem('googleEventLink', googleEvent.htmlLink);
  }

  // Return success details
  return {
    message: 'Event added successfully!',
    eventId: savedEvent.id,
    cohortId,
    googleEventId: savedEvent.googleEventId,
    googleEventLink: googleEvent.htmlLink
  };
};

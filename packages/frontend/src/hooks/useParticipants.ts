// src/hooks/useParticipants.ts

import { useCallback, useState } from 'react';
import { addParticipantsToGoogleCalendarEvent } from '../services/participantsService';

interface Attendee {
  email: string;
}

// Custom hook to add participants (attendees) to a Google Calendar event
export function useAddGoogleParticipants(eventId: string) {
  // State to track if the request is in progress
  const [loading, setLoading] = useState(false);

  // State to hold any error messages
  const [error, setError] = useState<string | null>(null);

  // State to know if the operation finished successfully
  const [done, setDone] = useState(false);

  // Function to add a list of attendees to the given event
  const addParticipants = useCallback(async (attendees: Attendee[]) => {
    setLoading(true);  // Start loading
    setError(null);    // Clear previous errors
    setDone(false);    // Reset done flag

    try {
      // Call the service to add participants to the event
      console.log('Adding attendees:', attendees);
      debugger;
      await addParticipantsToGoogleCalendarEvent(eventId, attendees);
      setDone(true); // Mark operation as successful
    } catch (err: any) {
      // Set error message if something goes wrong
      setError(err.message || 'Unknown error');
    } finally {
      // Stop loading regardless of success/failure
      setLoading(false);
    }
  }, [eventId]);

  // Return the function and state values to the component
  return { addParticipants, loading, error, done };
}

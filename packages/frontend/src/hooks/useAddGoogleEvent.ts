import { useState } from 'react';
import { GoogleCalendarFormData } from '../services/googleCalendarService';
import { addEventToGoogleAndRegister } from '../services/eventRegistrationService';

// This hook provides logic for adding an event to Google Calendar and registering it in the system
export const useAddGoogleEvent = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [googleEventLink, setGoogleEventLink] = useState<string | null>(null);

  const addEvent = async (form: GoogleCalendarFormData, cohortId: string) => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Pass cohortId explicitly
      const result = await addEventToGoogleAndRegister(form, cohortId);
      setGoogleEventLink(result.googleEventLink)
      setMessage(result.message);
      return result;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while adding the event.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    addEvent,
    loading,
    message,
    error,
    googleEventLink
  };
};

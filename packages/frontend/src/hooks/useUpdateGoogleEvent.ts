// src/hooks/useUpdateGoogleEvent.ts

import { useEffect, useState } from 'react';
import { googleCalendarService } from '../services/googleCalendarService';
import { cohortEventApi } from '../services/cohortEventApi';
import { CohortEvent } from '@base-project/shared/dist/models';

/**
 * Custom hook to manage updating a Google Calendar event
 * and syncing it with the local CohortEvent in the database.
 *
 * @param eventId - The ID of the event to be updated
 */
export const useUpdateGoogleEvent = (eventId: string) => {
  // Form state for editing the event
  const [form, setForm] = useState({
    summary: '',
    description: '',
    start: '',
    end: '',
    cohortId: '',
  });

  // State for the fetched event object
  const [event, setEvent] = useState<CohortEvent | null>(null);

  // UI feedback state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch the event data from the backend and prefill the form
   */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await cohortEventApi.getEventById(eventId);
        setEvent(fetchedEvent);
        setForm({
          summary: fetchedEvent.title,
          description: fetchedEvent.description || '',
          start: new Date(fetchedEvent.startTime).toISOString().slice(0, 16),
          end: new Date(fetchedEvent.endTime).toISOString().slice(0, 16),
          cohortId: fetchedEvent.cohortId
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load event details.');
      }
    };

    fetchEvent();
  }, [eventId]);

  /**
   * Handle input changes in the form
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission to update both Google Calendar and backend event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    let updatedEvent: Partial<CohortEvent> | null = null;

    try {
      setLoading(true);

      const accessToken = localStorage.getItem('googleCalendarAccessToken');
      if (!accessToken) {
        setError('Google account access token not found');
        return;
      }

      // Update event in Google Calendar
      await googleCalendarService.updateGoogleCalendarEvent(event?.googleEventId!, form, accessToken);

      // Prepare and send update to backend
      updatedEvent = {
        id: eventId,
        cohortId: event?.cohortId,
        googleEventId: event?.googleEventId,
        title: form.summary,
        description: form.description,
        startTime: new Date(form.start),
        endTime: new Date(form.end),
        zoomJoinUrl: event?.zoomJoinUrl || '',
        isRequired: event?.isRequired ?? true,
      };

      await cohortEventApi.updateEvent(eventId, updatedEvent);

      setMessage('Event updated successfully!');

    } catch (err) {
      console.error('Update error:', err);
      setError('An error occurred while updating the event.');
    } finally {
      setLoading(false);
    }
    return updatedEvent;
  };



  // Validate form fields before submission
  const isFormValid = form.summary && form.start && form.end;

  return {
    form,
    event,
    loading,
    message,
    error,
    handleChange,
    handleSubmit,
    isFormValid,
  };
};

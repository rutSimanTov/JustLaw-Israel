import { Request, Response } from 'express';
import {
  addEventToGoogleCalendar,
  updateGoogleCalendarEventById,
  deleteGoogleCalendarEventById,
  getGoogleCalendarEventById,
  updateEventAttendees 
} from '../services/calendarEventsService';

/**
 * Creates a new event in the user's Google Calendar.
 * Receives event details (title, description, start, end) and sends to Google.
 */
export const createCalendarEvent = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const accessToken = authHeader.split(' ')[1];
  const { summary, description, start, end } = req.body;

  try {
    const event = await addEventToGoogleCalendar({
      accessToken,
      summary,
      description,
      start,
      end,
    });

    res.status(201).json(event); // Success - returns created event
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    res.status(500).json({ error: 'Failed to add event to Google Calendar' });
  }
};

/**
 * Updates an existing event by ID in the user's Google Calendar.
 * Receives updated event details and sends update to Google.
 */
export const updateCalendarEvent = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const accessToken = authHeader.split(' ')[1];
  const { id } = req.params;
  const { summary, description, start, end, attendees } = req.body;

  if (!start || isNaN(Date.parse(start))) {
    return res.status(400).json({ error: 'Invalid or missing start time' });
  }

  if (!end || isNaN(Date.parse(end))) {
    return res.status(400).json({ error: 'Invalid or missing end time' });
  }
  try {
    const updatedEvent = await updateGoogleCalendarEventById({
      accessToken,
      id,
      summary,
      description,
      start,
      end,
      attendees,
    });
    res.status(200).json(updatedEvent); // Returns event after update
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update Google Calendar event' });
  }
};

/**
 * Deletes an event by ID from the user's Google Calendar.
 */
export const deleteCalendarEvent = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const accessToken = authHeader.split(' ')[1];
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing event ID' });
  }

  try {
    await deleteGoogleCalendarEventById({ accessToken, id });
    res.status(204).send(); // Success - no content to return
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete Google Calendar event' });
  }
};

/**
 * Retrieves event details by ID from the user's Google Calendar.
 */
export const getCalendarEventById = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const accessToken = authHeader.split(' ')[1];
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing event ID' });
  }

  try {
    const event = await getGoogleCalendarEventById({ accessToken, id });
    res.status(200).json(event); // Returns event details
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to get Google Calendar event' });
  }
};

/**
 * Updates only the attendees list of a specific event.
 */
export const patchUpdateEventAttendees = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const accessToken = authHeader.split(' ')[1];
  const { id: eventId } = req.params;
  const { attendees } = req.body;

  if (!attendees || !Array.isArray(attendees)) {
    return res.status(400).json({ error: 'Missing or invalid attendees array' });
  }

  try {
    const updatedEvent = await updateEventAttendees({ accessToken, eventId, attendees });
    res.status(200).json({ success: true, data: updatedEvent }); // Returns event with updated attendees
  } catch (error: any) {
    console.error('Error updating attendees:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to update attendees' });
  }
};

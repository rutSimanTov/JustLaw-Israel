import { google } from 'googleapis';

interface EventInput {
  accessToken: string;
  summary: string;
  description: string;
  start: string;
  end: string;
}
/**
 * Add a new event to Google Calendar.
 * Creates an event with title, description, start and end times.
 */
export const addEventToGoogleCalendar = async ({
  accessToken,
  summary,
  description,
  start,
  end,
}: EventInput) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const event = {
    summary,
    description,
    start: {
      dateTime: new Date(start).toISOString(),
      timeZone: 'Asia/Jerusalem',
    },
    end: {
      dateTime: new Date(end).toISOString(),
      timeZone: 'Asia/Jerusalem',
    },
    conferenceData: {
      createRequest: {
        requestId: `${Date.now()}`,
      },
    },
  };
  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
  });
  return response.data;
};

interface UpdateEventInput extends EventInput {
  id: string;
}

interface Attendee {
  email: string;
}

interface UpdateEventInput extends EventInput {
  id: string;
  attendees?: Attendee[];
}
/**
 * Update an existing event by ID.
 * Update title, description, times, and add new attendees without duplicates.
 */
export const updateGoogleCalendarEventById = async ({
  accessToken,
  id,
  summary,
  description,
  start,
  end,
  attendees = [],
}: UpdateEventInput) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // 🔹 שלב 1: שלוף את האירוע הקיים
  const existingEvent = await calendar.events.get({
    calendarId: 'primary',
    eventId: id,
  });

  const existingAttendees = existingEvent.data.attendees || [];

  // 🔹 שלב 2: מיזוג משתתפים קיימים עם חדשים (ללא כפילויות לפי אימייל)
  const allAttendees = [
    ...existingAttendees,
    ...attendees.filter(
      (newA) => !existingAttendees.some((oldA) => oldA.email === newA.email)
    ),
  ];

  // 🔹 שלב 3: עדכון האירוע עם הרשימה המשולבת
  const eventUpdate = {
    summary,
    description,
    start: {
      dateTime: new Date(start).toISOString(),
      timeZone: 'Asia/Jerusalem',
    },
    end: {
      dateTime: new Date(end).toISOString(),
      timeZone: 'Asia/Jerusalem',
    },
    attendees: allAttendees,
  };

  const response = await calendar.events.update({
    calendarId: 'primary',
    eventId: id,
    requestBody: eventUpdate,
    sendUpdates: 'all', // שלח הזמנות למשתתפים החדשים
  });

  return response.data;
};
/**
 * Delete an event by ID from Google Calendar.
 * Sends cancellation notices to attendees.
 */
export const deleteGoogleCalendarEventById = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId: id,
    sendUpdates: 'all', // אופציונלי: שלח עדכון למשתתפים על הביטול
  });
};

/**
 * Get an event by ID from Google Calendar.
 * Returns event details.
 */
export const getGoogleCalendarEventById = async ({
  accessToken,
  id,
}: {
  accessToken: string;
  id: string;
}) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const response = await calendar.events.get({
    calendarId: 'primary',
    eventId: id,
  });

  return response.data;
};

interface UpdateAttendeesInput {
  accessToken: string;
  eventId: string;
  attendees: Attendee[];
}
/**
 * Update only the attendees list of an event.
 * Adds new attendees and sends updates to all.
 */
export const updateEventAttendees = async ({
  accessToken,
  eventId,
  attendees,
}: UpdateAttendeesInput) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // שליפת האירוע הקיים
  const existingEvent = await calendar.events.get({
    calendarId: 'primary',
    eventId,
  });

  // מיזוג משתתפים קיימים עם החדשים, ללא כפילויות (לפי אימייל)
  const existingAttendees = existingEvent.data.attendees || [];
  const allAttendees = [
    ...existingAttendees,
    ...attendees.filter(
      (newA) => !existingAttendees.some((oldA) => oldA.email === newA.email)
    ),
  ];

  // עדכון האירוע עם המשתתפים המעודכנים
  const eventUpdate = {
    attendees: allAttendees,
  };

  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: eventUpdate,
    sendUpdates: 'all', // לשלוח הזמנות למשתתפים החדשים
  });

  return response.data;
};

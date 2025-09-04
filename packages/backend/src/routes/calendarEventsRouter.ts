import express from 'express';
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarEventById,
  patchUpdateEventAttendees
} from '../controllers/calendarEventsController';

const router = express.Router();
console.log('📅 calendarEventsRouter loaded');

router.post('/calendar-events', createCalendarEvent);
router.put('/calendar-events/:id', updateCalendarEvent);
router.delete('/calendar-events/:id', deleteCalendarEvent);
router.get('/calendar-events/:id', getCalendarEventById);
router.patch('/calendar-events/:id', patchUpdateEventAttendees);

export default router;


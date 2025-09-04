// src/routes/eventRoutes.ts
import { Router } from 'express';
import { eventController } from '../controllers/event.controller';
import  authMiddleware  from '../middlewares/authMiddleware';
import { eventValidator } from '../validators/event.validator';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const router = Router();

// router.get('/', eventController.listEventsForUserCohort);
router.get('/',eventController.listPastEventsForActiveCohort)
router.post(
  '/',
  authMiddleware,
  eventValidator.validateCreateEvent,
  handleValidationErrors,
  eventController.createEvent
);
router.get('/:id', authMiddleware, eventController.getEventById);
router.put(
  '/:id',
  authMiddleware,
  eventValidator.validateUpdateEvent,
  handleValidationErrors,
  eventController.updateEvent
);


export default router;

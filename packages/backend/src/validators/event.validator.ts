import { body, param } from 'express-validator';

export const eventValidator = {
  // For creating an event
  validateCreateEvent: [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('start_time').isISO8601().withMessage('Start time must be a valid date'),
    body('end_time').isISO8601().withMessage('End time must be a valid date'),
    body('cohort_id').isUUID().withMessage('Cohort ID must be a valid UUID'),
    // Add more validations as needed
  ],

  // For updating an event
  validateUpdateEvent: [
    param('id').isUUID().withMessage('Event ID must be a valid UUID'),
    body('title').optional().isString(),
    body('start_time').optional().isISO8601(),
    body('end_time').optional().isISO8601(),
    // Add more validations as needed
  ],
};
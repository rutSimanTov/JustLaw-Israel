// src/validators/cohortValidator.ts
import { Request, Response, NextFunction } from 'express';

export const cohortValidator = {
    validateCreateCohort: (req: Request, res: Response, next: NextFunction) => {
        const { name, startDate, endDate, currentParticipants } = req.body;
        console.log('DEBUG: Incoming startDate:', startDate, 'endDate:', endDate);
        if (!name || !startDate || !endDate) {
            return res.status(400).json({ error: 'Missing required fields: name, startDate, endDate' });
        }
        // Validate date format (dd/MM/yyyy)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            return res.status(400).json({ error: 'Invalid date format. Use dd/MM/yyyy.' });
        }
        // Parse date from dd/MM/yyyy
        const parseDate = (str: string) => {
            const [day, month, year] = str.split('/').map(Number);
            return new Date(year, month - 1, day);
        };
        const sd = parseDate(startDate);
        const ed = parseDate(endDate);
        if (isNaN(sd.getTime()) || isNaN(ed.getTime())) {
            return res.status(400).json({ error: 'Invalid date value.' });
        }
        if (sd > ed) {
            return res.status(400).json({ error: 'Start date must be before end date.' });
        }
        // Validate currentParticipants > 0 if present
        if (currentParticipants !== undefined && (typeof currentParticipants !== 'number' || currentParticipants < 0)) {
            return res.status(400).json({ error: 'currentParticipants must be a non-negative number.' });
        }
        next();
    },

    validateUpdateCohort: (req: Request, res: Response, next: NextFunction) => {
        const { name, startDate, endDate, currentParticipants } = req.body;
        console.log('DEBUG: Incoming startDate:', startDate, 'endDate:', endDate);
        if (!name && !startDate && !endDate && currentParticipants === undefined) {
            return res.status(400).json({ error: 'At least one field is required to update' });
        }
        // If both dates are present, validate their order and format (dd/MM/yyyy)
        if (startDate && endDate) {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
                return res.status(400).json({ error: 'Invalid date format. Use dd/MM/yyyy.' });
            }
            const parseDate = (str: string) => {
                const [day, month, year] = str.split('/').map(Number);
                return new Date(year, month - 1, day);
            };
            const sd = parseDate(startDate);
            const ed = parseDate(endDate);
            if (isNaN(sd.getTime()) || isNaN(ed.getTime())) {
                return res.status(400).json({ error: 'Invalid date value.' });
            }
            if (sd > ed) {
                return res.status(400).json({ error: 'Start date must be before end date.' });
            }
        }
        // Validate currentParticipants > 0 if present
        if (currentParticipants !== undefined && (typeof currentParticipants !== 'number' || currentParticipants <= 0)) {
            return res.status(400).json({ error: 'currentParticipants must be a positive number.' });
        }
        next();
    }
};

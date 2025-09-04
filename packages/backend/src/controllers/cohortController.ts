import { Request, Response } from 'express';
import { cohortService } from '../services/cohortService';
import { data } from 'react-router-dom';

export const cohortController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const data = await cohortService.getAll();
            res.json(data);
        } catch (error) {
            console.error('Error in cohortController.getAll:', error);
            res.status(500).json({ message: "Internal server error" });
        }

    },
    add: async (req: Request, res: Response) => {
        try {
            const cohort = req.body;
            if (!cohort || !cohort.name || !cohort.startDate) {
                return res.status(400).json({ message: "Invalid cohort data" });
            }
            const data = await cohortService.add(cohort);
            res.status(200).json(data);
        } catch (error) {
            console.error('Error in cohortController.add:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    delete: async (req: Request, res: Response) => {
        const success = await cohortService.delete(req.params.id)
        success
            ? res.status(200).json(true)
            : res.status(404).json({ massege: "Registration not found" })
    },
    update: async (req: Request, res: Response) => {
        try {
            const data = await cohortService.update(req.params.id, req.body)
            res.json(data)
        } catch (error) {
            console.error('Error in cohortController.update:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
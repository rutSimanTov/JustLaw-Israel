import { Request, Response } from "express"
import { cohortEventService } from "../services/cohortEventService"
import { update } from "./profileController"

export const cohortEventController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const data = await cohortEventService.getAll()
            res.json(data)
        } catch (error) {
            console.error('Error in cohortEventController.getAll:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "Missing id parameter" });
            }
            const event = await cohortEventService.getById(id);
            // if (!event) {
            //     return res.status(404).json({ message: "Cohort event not found" });
            // }
            res.status(200).json(event);
        } catch (error) {
            console.error('Error in cohortEventController.getById:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    add: async (req: Request, res: Response) => {
        try {
            const cohortEvent = req.body;
            if (!cohortEvent || !cohortEvent.cohortId) {
                return res.status(400).json({ message: "Invalid cohort event data" })
            }
            const data = await cohortEventService.add(cohortEvent)
            res.status(200).json(data)
        } catch (error) {
            console.error('Error in cohortEventController.add:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const accessToken = req.headers['authorization']?.toString().replace('Bearer ', '');
            const deleted = await cohortEventService.delete(req.params.id, accessToken);
            res.status(200).json(deleted);
        } catch (error) {
            console.error(':x: Error in cohortEventController.delete:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const data = await cohortEventService.update(req.params.id, req.body);
            res.json(data)
        } catch (error) {
            console.error('Error in cohortController.update:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    }


}
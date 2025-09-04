import { eventRegistrationService } from "../services/eventRegistrationService"
import { Request, Response } from 'express';
import { EventRegistration } from '@base-project/shared/src/models/EventRegistration';
import { update } from "./profileController";
import { EventRegistrationsResponse } from "@base-project/shared";
export const eventRegistrationController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const data = await eventRegistrationService.getAll();
      res.json(data);
    } catch (error) {
      console.error('Error in eventRegistrationController.getAll:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getByUserId: async (req: Request, res: Response) => {
    try {
      const data = await eventRegistrationService.getByUserId(req.params.userId);
      res.json(data);
    } catch (err) {
      console.error('Error in eventRegistrationController.getByUserId:', err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //fetch all registered by eventId
  async getRegisteredByEventId(req: Request, res: Response) {
    const { eventId } = req.params;
    try {
      const registered = await eventRegistrationService.getRegisteredByEvent(eventId);
      const response: EventRegistrationsResponse = {
        success: !!registered,
        data: { items: registered || undefined, total: registered?.length | 0 },
        error: registered ? undefined : 'Application not found'
      };
      res.status(registered ? 200 : 404).json(response);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as EventRegistrationsResponse);
    }
  },

  add: async (req: Request, res: Response) => {
    try {
      const registration = req.body;
      if (!registration || !registration.eventId || !registration.userIds) {
        return res.status(400).json({ message: "Invalid registration data" });
      }
      const data = await eventRegistrationService.submitRegistrations(registration);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error in eventRegistrationController.add:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  delete: async (req: Request, res: Response) => {
    const success = await eventRegistrationService.delete(req.params.id);
    success
      ? res.status(204).send(true)
      : res.status(404).json({ message: "Registration not found" });
  },
  update: async (req: Request, res: Response) => {
    try {
      const data = await eventRegistrationService.update(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      console.error('Error in eventRegistrationController.update:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
      deleteByEventId: async (req: Request, res: Response) => {
  const { eventId } = req.params;
  try {
    const deletedCount = await eventRegistrationService.deleteByEventId(eventId);
    res.status(200).json({
      success: true,
      deletedCount,
    });
  } catch (error) {
    console.error('Error in eventRegistrationController.deleteByEventId:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
}
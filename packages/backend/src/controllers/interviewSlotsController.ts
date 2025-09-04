// import { Request, Response } from 'express';
// import { interviewSlotsService } from '../services/interviewSlotsService';
// import { InterviewSlot } from '@base-project/shared/src/models/InterviewSlot';

// export const interviewSlotsController = {
//     getAll: async (req: Request, res: Response) => {
//         try {
//             const data = await interviewSlotsService.getAll();
//             res.json(data);
//         } catch (error) {
//             console.error('Error in interviewSlotsController.getAll:', error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     },
//     add: async (req: Request, res: Response) => {
//         try {
//             const interSlot: InterviewSlot = req.body;
//             if (!interSlot || !interSlot.applicationId || !interSlot.interviewerUserId) {
//                 return res.status(400).json({ message: "Invalid interview slot data" });
//             }
//             const data = await interviewSlotsService.add(interSlot);
//             res.status(200).json(data);
//         } catch (error) {
//             console.error('Error in interviewSlotsController.add:', error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     },
//     delete: async (req: Request, res: Response) => {
//         const success = await interviewSlotsService.delete(req.params.id);
//         success
//             ? res.status(204).send(true)
//             : res.status(404).json({ message: "Interview slot not found" });
//     },
//     update: async (req: Request, res: Response) => {
//         try {
//             const data = await interviewSlotsService.update(req.params.id, req.body);
//             res.json(data);
//         } catch (error) {
//             console.error('Error in interviewSlotsController.update:', error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     }
// }
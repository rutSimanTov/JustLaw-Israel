// src/routes/applicationRoutes.ts
import { Router } from 'express';
import { applicationController } from '../controllers/application.controller';
import  authMiddleware  from '../middlewares/authMiddleware';

import { isAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware, applicationController.submitApplication);
router.get('/:id', authMiddleware, applicationController.getApplicationById);
router.get('/cohort/:id', authMiddleware, applicationController.fetchApplicationsByCohortId);
router.get('/participantsDetails/cohort/:id', authMiddleware, applicationController.getParticipantsNamesByCohort);
router.put('/:id', authMiddleware, applicationController.updateApplication);
router.get('/', authMiddleware, isAdmin, applicationController.listAllApplications); // admin only
router.post('/:id/approve', authMiddleware, isAdmin, applicationController.approveApplication); // admin only
router.post('/:id/reject', authMiddleware, isAdmin, applicationController.rejectApplication); // admin only

export default router;

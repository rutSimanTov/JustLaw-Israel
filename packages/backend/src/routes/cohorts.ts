// src/routes/cohortRoutes.ts
import { Router } from 'express';
import { cohortController } from '../controllers/cohort.controller';
import { cohortValidator } from '../validators/cohort.validator';
import {authMiddleware} from '../middlewares/auth.middleware'

// import { isAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, cohortController.listCohorts); // list active
router.post('/', authMiddleware, cohortValidator.validateCreateCohort, cohortController.createCohort); // admin only
router.get('/:id', cohortController.getCohortById); // details
router.put('/:id', authMiddleware, cohortValidator.validateUpdateCohort, cohortController.updateCohort); // admin only
router.delete('/:id', authMiddleware, cohortController.archiveCohort); // admin only

export default router;

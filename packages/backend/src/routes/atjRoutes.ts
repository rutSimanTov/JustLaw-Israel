import express from 'express';
import * as atjController from '../controllers/atjController';

const router = express.Router();

// יצירת רשומות חדשות
router.post('/individual', atjController.createATJ);
router.post('/organization', atjController.createATJOrg);

// קבלת כל הרשומות
router.get('/individuals', atjController.getAllATJ);
router.get('/organizations', atjController.getAllATJOrg);
router.get('/signatories', atjController.getAllSignatories);

// קבלת רשומה לפי ID
router.get('/individual/:id', atjController.getATJById);
router.get('/organization/:id', atjController.getATJOrgById);

export default router;

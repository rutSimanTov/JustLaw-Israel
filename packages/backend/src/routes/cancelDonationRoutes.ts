
import express from 'express';
import { requestCancellationCode, verifyCodeAndCancel } from '../controllers/cancelDonationFlowController';
const router = express.Router();
//בקשת קוד אימות
router.post('/request-code', requestCancellationCode);
//נתיב לאימות קוד וביטול הו"ק
router.post('/verify-and-cancel', verifyCodeAndCancel);
export default router;

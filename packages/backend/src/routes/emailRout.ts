import { Router } from 'express';
import { sendReportEmail } from '../controllers/emailController';

const router: Router = Router();

router.post('/', sendReportEmail); 

export default router;



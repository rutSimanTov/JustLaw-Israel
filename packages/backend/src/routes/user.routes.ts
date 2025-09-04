
import { Router } from 'express';
import { register, login, resetPasswordController,listUsers, getUserRoleController } from '../controllers/user.controller';
import {authMiddleware} from '../middlewares/auth.middleware'
import { supabase } from '../services/supabaseClient';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPasswordController);
router.get('/',authMiddleware, listUsers);
router.get('/getUserRole/:email', getUserRoleController);


export default router;
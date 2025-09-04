import express from 'express';
import * as zoomController from '../controllers/zoomController';
import * as middleware from '../middlewares/middleware'

const router = express.Router();


router.post('/All',middleware.authenticateToken, zoomController.getAllUserEvent1);

export default router;

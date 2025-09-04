import express from 'express';
import * as loggercontroller from '../controllers/loggerController';
import * as middleware from '../middlewares/middleware'

const router = express.Router();


router.post('/',middleware.authenticateToken,loggercontroller.logError);

export default router;

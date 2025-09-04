import express from 'express';
import multer from 'multer';
import { uploadImageHandler } from '../controllers/uploadController';

const router = express.Router();
const upload = multer(); // העלאה לזיכרון בלבד

router.post('/upload-image', upload.single('file'), uploadImageHandler);

export default router;

import express from 'express';
import { indexArticles } from '../controllers/indexContentController'; 

const router = express.Router();

// Route for indexing articles
router.post('/index', indexArticles);

export default router;
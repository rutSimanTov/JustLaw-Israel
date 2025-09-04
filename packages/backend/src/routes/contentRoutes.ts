import express from 'express';
import { saveContent } from '../controllers/UserController';
import { authenticateJWT } from '../middlewares/auth';
import * as contentController from '../controllers/contentController';
import { downloadArticlePdf } from '../controllers/downloadArticlePdfController';
import { createContent } from '../controllers/contentController';

const router = express.Router();
// קבלת תוכן לפי שם קטגוריה
router.post('/category/names', contentController.getByCategoryName);

//get all categories
router.get('/categories', contentController.getAllCategories);

// הגדרת המסלול לשמירת תוכן עם Middleware לאימות
//router.post('/', authenticateJWT, saveContent);
// קבלת כל התכנים
router.get('/', contentController.getAllContent);

// קבלת תוכן לפי מזהה
router.get('/:id', contentController.getContentById);

// יצירת תוכן חדש (למנהל)
router.post('/', contentController.createContent);

// עדכון תוכן לפי מזהה (למנהל)
router.put('/:id', contentController.updateContent);

// delete content by ID 
router.delete('/:id', contentController.deleteContent);


// הורדת PDF של מאמר לפי מזהה
router.get('/:id/pdf', downloadArticlePdf);

export default router;



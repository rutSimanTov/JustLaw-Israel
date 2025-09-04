import express from 'express';
import * as profileController from '../controllers/profileController';

const router = express.Router();

// 🔄 עדכון פרופיל – מזהה לבד אם יש טוקן
// 🔄 עדכון פרופיל – מזהה לבד אם יש טוקן
router.put('/:id', profileController.update);

// ❌ מחיקת פרופיל – עם או בלי טוקן

// ❌ מחיקת פרופיל – עם או בלי טוקן
router.delete('/:id', profileController.remove);

// 🔍 שליפה לפי מזהה – עם או בלי טוקן
router.get('/:id', profileController.getById);

// 📋 שליפה של כל הפרופילים – Admin בלבד
router.get('/', profileController.getAll);

// 📝 הוספת פרופיל – עם או בלי טוקן:
router.post('/', profileController.create);


export default router;

// backend/src/routes/authRoutes.ts

import { Router } from 'express';
import { verifyGoogleTokenAndCreateJwt } from '../services/authService'; // ייבוא הפונקציה מהשירות החדש

const router = Router(); // יצירת מופע של Express Router

// הגדרת ה-Endpoint לטיפול בהתחברות גוגל
router.post('/google', async (req, res) => {
const { token } = req.body; // חילוץ ה-ID Token מגוף הבקשה מה-Frontend

 // בדיקה בסיסית אם הטוקן התקבל
 if (!token) {
  console.warn('Received /auth/google request without an ID token.');
  return res.status(400).json({ success: false, message: 'ID token is missing.' });
 }

 try {
 // קריאה לשירות האימות שהפרדנו. הוא יבצע את אימות גוגל ויצור JWT.
 const { user, token: jwtToken } = await verifyGoogleTokenAndCreateJwt(token);

// שליחת תגובת הצלחה ל-Frontend עם פרטי המשתמש וה-JWT החדש
 res.status(200).json({
 success: true,
 message: 'Login successful (JWT issued without database interaction)', // הודעה מעודכנת
 user: user,
 token: jwtToken 
 });

 } catch (error: any) {
 console.error('Error in /auth/google route:', error);
 // טיפול בשגיאות שהגיעו מהשירות (verifyGoogleTokenAndCreateJwt)
 if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.message.includes('Invalid ID Token') || error.message.includes('Critical user information missing')) {
return res.status(401).json({ success: false, message: 'Authentication failed: Invalid or expired token or missing user data.' });
}
// שגיאה כללית
 res.status(500).json({ success: false, message: 'Authentication failed due to server error. Please try again.' });
 }
});

export default router; // ייצוא הראוטר

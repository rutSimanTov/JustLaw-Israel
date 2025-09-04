// import express from 'express';
// import { findUserByEmail, resetPassword } from '../services/user.service';
// import { generateResetCode, verifyResetCode } from '../services/resetService';
// import { sendResetEmail } from '../utils/email';

// const router = express.Router();

// // נתיב POST לבקשת קוד איפוס סיסמה.
// // מאתר משתמש, מייצר ושולח קוד אימות למייל.
// router.post('/request-reset', async (req, res) => {
//     const { email } = req.body;
//     const user = await findUserByEmail(email);
//     if (!user) return res.status(404).json({ error: 'משתמש לא נמצא' });

//     const code = await generateResetCode(email);
//     await sendResetEmail(email, code);

//     res.json({ message: 'קוד נשלח למייל' });
// });

// // נתיב POST לאימות קוד האיפוס.
// // בודק אם הקוד שהוזן תקין.
// router.post('/verify-code', async (req, res) => {
//     const { email, code } = req.body;
//     const valid = await verifyResetCode(email, code);
//     if (!valid) return res.status(400).json({ error: 'קוד שגוי או שפג תוקפו' });
//     res.json({ message: 'הקוד אומת בהצלחה' });
// });

// // נתיב POST לאיפוס הסיסמה בפועל.
// // מעדכן את הסיסמה למשתמש לאחר אימות קוד מוצלח.
// router.post('/reset-password', async (req, res) => {
//     const { email, newPassword } = req.body;
//     const result = await resetPassword(email, newPassword);
//     if (!result) return res.status(400).json({ error: 'שגיאה באיפוס הסיסמה' });
//     res.json({ message: 'הסיסמה אופסה בהצלחה' });
// });

// export default router;












// אחרי עדכון לאותיות קטנות


// import express from 'express';
// // וודאי ששמות השירותים נכונים
// import { findUserByEmail, resetPassword } from '../services/user.service';
// import { generateResetCode, verifyResetCode } from '../services/resetService'; // וודאי שזה השם הנכון של השירות
// import { sendResetEmail } from '../utils/email'; // אם זה המיקום של שירות שליחת המייל

// const router = express.Router();

// // נתיב POST לבקשת קוד איפוס סיסמה.
// // מאתר משתמש, מייצר ושולח קוד אימות למייל.
// router.post('/request-reset', async (req, res) => {
//     const { email } = req.body;
//     const processedEmail = email ? email.toLowerCase() : ''; // *** המרה לאותיות קטנות כאן ***

//     // וודאי שהמייל לא ריק לאחר העיבוד
//     if (!processedEmail) {
//         return res.status(400).json({ error: 'כתובת מייל חסרה.' });
//     }

//     const user = await findUserByEmail(processedEmail);
//     if (!user) {
//         // רצוי להחזיר תגובה כללית למנוע זיהוי מיילים קיימים
//         return res.status(200).json({ message: 'אם כתובת המייל קיימת, קוד איפוס נשלח.' });
//     }

//     try {
//         const code = await generateResetCode(processedEmail);
//         await sendResetEmail(processedEmail, code);
//         res.json({ message: 'קוד נשלח למייל' });
//     } catch (error) {
//         console.error('Error in /request-reset:', error);
//         res.status(500).json({ error: 'שגיאה בעת בקשת קוד איפוס.' });
//     }
// });

// // נתיב POST לאימות קוד האיפוס.
// // בודק אם הקוד שהוזן תקין.
// router.post('/verify-code', async (req, res) => {
//     const { email, code } = req.body;
//     const processedEmail = email ? email.toLowerCase() : ''; // *** המרה לאותיות קטנות כאן ***

//     if (!processedEmail || !code) {
//         return res.status(400).json({ error: 'מייל או קוד חסרים.' });
//     }

//     try {
//         const valid = await verifyResetCode(processedEmail, code);
//         if (!valid) {
//             return res.status(400).json({ error: 'קוד שגוי או שפג תוקפו' });
//         }
//         res.json({ message: 'הקוד אומת בהצלחה' });
//     } catch (error) {
//         console.error('Error in /verify-code:', error);
//         res.status(500).json({ error: 'שגיאה בעת אימות הקוד.' });
//     }
// });

// // נתיב POST לאיפוס הסיסמה בפועל.
// // מעדכן את הסיסמה למשתמש לאחר אימות קוד מוצלח.
// router.post('/reset-password', async (req, res) => {
//     const { email, newPassword } = req.body;
//     const processedEmail = email ? email.toLowerCase() : ''; // *** המרה לאותיות קטנות כאן ***

//     if (!processedEmail || !newPassword) {
//         return res.status(400).json({ error: 'מייל או סיסמה חדשה חסרים.' });
//     }

//     try {
//         const result = await resetPassword(processedEmail, newPassword);
//         if (!result) {
//             return res.status(400).json({ error: 'שגיאה באיפוס הסיסמה. ייתכן שהמשתמש לא נמצא או בעיה אחרת.' });
//         }
//         res.json({ message: 'הסיסמה אופסה בהצלחה' });
//     } catch (error) {
//         console.error('Error in /reset-password:', error);
//         res.status(500).json({ error: 'שגיאה בעת איפוס הסיסמה.' });
//     }
// });

// export default router;













// הקוד שדאג שהמייל נכנס באותיות קטנות וגם שומר את הקודים בטבלה במסד נתונים ולא בגייסון

import express, { Router } from 'express';
// ודאי ששמות השירותים נכונים ומיקומי הקבצים תקינים.
// הפונקציה sendResetEmail עברה כעת לתוך user.service.ts, אז נביא אותה משם.
import { findUserByEmail, resetPassword, sendResetEmail } from '../services/user.service';
import { generateResetCode, verifyResetCode } from '../services/resetService'; // ייבוא מהשירות החדש

const router:Router = express.Router();

// נתיב POST לבקשת קוד איפוס סיסמה.
// מאתר משתמש, מייצר ושולח קוד אימות למייל.
// router.post('/request-reset', async (req, res) => {
//     const { email } = req.body;
//     // *** המרה לאותיות קטנות כאן - נקודת הכניסה של הבקשה ***
//     const processedEmail = email ? email.toLowerCase() : ''; 

//     // ודאי שהמייל לא ריק לאחר העיבוד
//     if (!processedEmail) {
//         return res.status(400).json({ error: 'כתובת מייל חסרה.' });
//     }

//     try {
//         const user = await findUserByEmail(processedEmail);
//         if (!user) {
//             // רצוי להחזיר תגובה כללית למנוע זיהוי מיילים קיימים (לשיפור אבטחה).
//             return res.status(200).json({ message: 'אם כתובת המייל קיימת, קוד איפוס נשלח.' });
//         }

//         const code = await generateResetCode(processedEmail);
//         await sendResetEmail(processedEmail, code); // קריאה ל-sendResetEmail מ-user.service
//         res.json({ message: 'קוד נשלח למייל' });
//     } catch (error) {
//         console.error('Error in /request-reset:', error);
//         res.status(500).json({ error: 'שגיאה בעת בקשת קוד איפוס.' });
//     }
// });



router.post('/request-reset', async (req, res) => {
    // שלב 1: קבלת כתובת המייל מגוף הבקשה
    const { email } = req.body;
    // המרת המייל לאותיות קטנות כדי למנוע בעיות של רגישות לאותיות גדולות/קטנות
    const processedEmail = email ? email.toLowerCase() : ''; 

    // שלב 2: ודא שכתובת המייל סופקה בבקשה
    if (!processedEmail) {
        // אם המייל חסר, החזר שגיאת 400 (Bad Request)
        return res.status(400).json({ error: 'Email address is missing.' }); 
    }

    try {
        // שלב 3: חפש את המשתמש במסד הנתונים לפי המייל
        const user = await findUserByEmail(processedEmail);
        
        // שלב 4: אם המשתמש לא נמצא במערכת
        if (!user) {
            // החזר שגיאת 404 (Not Found) עם הודעה ברורה
            // זה מונע שליחת קוד למייל שאינו קיים ומודיע למשתמש על כך.
            return res.status(404).json({ error: 'User not found in the system.' }); 
        }

        // שלב 5: אם המשתמש קיים, צור קוד איפוס סיסמה חדש
        const code = await generateResetCode(processedEmail);
        
        // שלב 6: שלח את קוד האיפוס למייל של המשתמש
        await sendResetEmail(processedEmail, code);
        
        // שלב 7: החזר הודעת הצלחה
        res.json({ message: 'Reset code sent to email.' }); 
    } catch (error) {
        // טיפול בשגיאות שעלולות לקרות במהלך התהליך (לדוגמה, בעיות עם שליחת מייל)
        console.error('Error in /request-reset:', error);
        // החזר שגיאת שרת 500 (Internal Server Error)
        res.status(500).json({ error: 'Error during password reset request.' }); 
    }
});



// נתיב POST לאימות קוד האיפוס.
// מטפל באימות הקוד שנשלח למשתמש לאיפוס סיסמה.
router.post('/verify-code', async (req, res) => {
    // שלב 1: קבלת המייל והקוד מגוף הבקשה
    const { email, code } = req.body;
    // המרת המייל לאותיות קטנות לאחידות בחיפוש
    const processedEmail = email ? email.toLowerCase() : ''; 

    // שלב 2: ודא שמייל וקוד סופקו
    if (!processedEmail || !code) {
        // אם אחד מהם חסר, החזר שגיאת 400 (Bad Request)
        return res.status(400).json({ error: 'Email or code is missing.' }); // הודעה באנגלית
    }

    try {
        // שלב 3: אמת את הקוד מול מסד הנתונים
        const valid = await verifyResetCode(processedEmail, code);
        
        // שלב 4: אם הקוד אינו תקף או שפג תוקפו
        if (!valid) {
            // החזר שגיאת 400 (Bad Request) עם הודעה מתאימה
            return res.status(400).json({ error: 'Invalid or expired verification code.' }); // הודעה באנגלית
        }
        
        // שלב 5: אם הקוד אומת בהצלחה
        res.json({ message: 'Code verified successfully.' }); // הודעה באנגלית
    } catch (error) {
        // טיפול בשגיאות בלתי צפויות שעלולות להתרחש
        console.error('Error in /verify-code:', error);
        // החזר שגיאת שרת 500 (Internal Server Error)
        res.status(500).json({ error: 'Error during code verification.' }); // הודעה באנגלית
    }
});

// נתיב POST לאיפוס הסיסמה בפועל.
// מעדכן את הסיסמה למשתמש לאחר אימות קוד מוצלח.
router.post('/reset-password', async (req, res) => {
    // שלב 1: קבלת כתובת המייל והסיסמה החדשה מגוף הבקשה
    const { email, newPassword } = req.body;
    // המרת המייל לאותיות קטנות לאחידות בחיפוש
    const processedEmail = email ? email.toLowerCase() : ''; 

    // שלב 2: ודא שמייל וסיסמה חדשה סופקו
    if (!processedEmail || !newPassword) {
        // אם אחד מהם חסר, החזר שגיאת 400 (Bad Request)
        return res.status(400).json({ error: 'Email or new password is missing.' }); // הודעה באנגלית
    }

    try {
        // שלב 3: בצע את איפוס הסיסמה בפועל באמצעות השירות
        const result = await resetPassword(processedEmail, newPassword);
        
        // שלב 4: אם איפוס הסיסמה נכשל (לדוגמה, המשתמש לא נמצא או בעיה אחרת)
        if (!result) {
            // החזר שגיאת 400 (Bad Request) עם הודעה כללית
            return res.status(400).json({ error: 'Password reset failed. User might not be found or another issue occurred.' }); // הודעה באנגלית
        }
        
        // שלב 5: אם הסיסמה אופסה בהצלחה
        res.json({ message: 'Password has been reset successfully.' }); // הודעה באנגלית
    } catch (error) {
        // טיפול בשגיאות בלתי צפויות שעלולות להתרחש במהלך איפוס הסיסמה
        console.error('Error in /reset-password:', error);
        // החזר שגיאת שרת 500 (Internal Server Error)
        res.status(500).json({ error: 'Error during password reset.' }); // הודעה באנגלית
    }
});

export default router;
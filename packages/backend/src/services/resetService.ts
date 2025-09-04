// import fs from 'fs/promises';
// import path from 'path';

// const RESET_CODES_FILE = path.join(__dirname, '../../data/resetCodes.json');

// interface ResetEntry {
//   email: string;
//   code: string;
//   createdAt: string;
// }


// // פונקציה זו קוראת את נתוני קודי האיפוס מקובץ JSON שנקרא resetCodes.json
// async function readResetCodes(): Promise<ResetEntry[]> {
//   try {
//     const data = await fs.readFile(RESET_CODES_FILE, 'utf-8');
//     return JSON.parse(data);
//   } catch {
//     return [];
//   }
// }


// // פונקציה זו כותבת (שומרת) מערך של קודי איפוס חזרה לקובץ resetCodes.json.
// async function writeResetCodes(codes: ResetEntry[]): Promise<void> {
//   await fs.writeFile(RESET_CODES_FILE, JSON.stringify(codes, null, 2), 'utf-8');
// }


// // פונקציה זו יוצרת קוד איפוס חדש עבור כתובת אימייל ספציפית ושומרת אותו.
// export async function generateResetCode(email: string): Promise<string> {
//   const codes = await readResetCodes();
//   const code = Math.floor(100000 + Math.random() * 900000).toString(); // קוד בן 6 ספרות
//   const newEntry: ResetEntry = { email, code, createdAt: new Date().toISOString() };

//   const filtered = codes.filter(c => c.email !== email);
//   filtered.push(newEntry);
//   await writeResetCodes(filtered);

//   return code;
// }



// // פונקציה זו מאמתת האם קוד איפוס שסופק על ידי משתמש תקין ותקף.
// export async function verifyResetCode(email: string, code: string): Promise<boolean> {
//   const codes = await readResetCodes();
//   const entry = codes.find(c => c.email === email && c.code === code);

//   if (!entry) return false;

//   const now = new Date();
//   const created = new Date(entry.createdAt);
//   const diff = (now.getTime() - created.getTime()) / 1000;

//   return diff < 600; // תקף לעשר דקות
// }












// קוד מעודכן שאמר לבדוק ולוודאות שהמייל הוכנס האותיות קטנות
// זה אומר שגם אם משהו יכניס את המייל שלו באותיות גדולות הוא יזהה אותו כאותיות קטנות אבל זה עדיין שומר בקבצי גייסון
// packages\backend\src\services\resetCodeService.ts
// import fs from 'fs/promises';
// import path from 'path';

// const RESET_CODES_FILE = path.join(__dirname, '../../data/resetCodes.json');

// interface ResetEntry {
//   email: string;
//   code: string;
//   createdAt: string;
// }

// // פונקציה זו קוראת את נתוני קודי האיפוס מקובץ JSON שנקרא resetCodes.json
// async function readResetCodes(): Promise<ResetEntry[]> {
//   try {
//     const data = await fs.readFile(RESET_CODES_FILE, 'utf-8');
//     return JSON.parse(data);
//   } catch {
//     return [];
//   }
// }

// // פונקציה זו כותבת (שומרת) מערך של קודי איפוס חזרה לקובץ resetCodes.json.
// async function writeResetCodes(codes: ResetEntry[]): Promise<void> {
//   await fs.writeFile(RESET_CODES_FILE, JSON.stringify(codes, null, 2), 'utf-8');
// }

// // פונקציה זו יוצרת קוד איפוס חדש עבור כתובת אימייל ספציפית ושומרת אותו.
// export async function generateResetCode(email: string): Promise<string> {
//   const processedEmail = email.toLowerCase(); // *** המרת המייל לאותיות קטנות ***

//   const codes = await readResetCodes();
//   const code = Math.floor(100000 + Math.random() * 900000).toString(); // קוד בן 6 ספרות
//   // *** שמירת המייל באותיות קטנות ***
//   const newEntry: ResetEntry = { email: processedEmail, code, createdAt: new Date().toISOString() };

//   // *** סינון כל הרשומות הישנות של אותו מייל (ללא קשר לרישיות שהוזנה במקור) ***
//   const filtered = codes.filter(c => c.email !== processedEmail);
//   filtered.push(newEntry);
//   await writeResetCodes(filtered);

//   return code;
// }

// // פונקציה זו מאמתת האם קוד איפוס שסופק על ידי משתמש תקין ותקף.
// export async function verifyResetCode(email: string, code: string): Promise<boolean> {
//   const processedEmail = email.toLowerCase(); // *** המרת המייל לאותיות קטנות לצורך אימות ***

//   const codes = await readResetCodes();
//   // *** חיפוש הרשומה התואמת לפי מייל באותיות קטנות וקוד ***
//   const entry = codes.find(c => c.email === processedEmail && c.code === code);

//   if (!entry) return false;

//   const now = new Date();
//   const created = new Date(entry.createdAt);
//   const diff = (now.getTime() - created.getTime()) / 1000;

//   return diff < 600; // תקף לעשר דקות (600 שניות)
// }



















// הקוד שנעדכן את האותיות להיות קטנות וגם דואג שהסיסמא שנשלחת תתאחסן במסד נתונים ולא בקובץ גייסון
// packages\backend\src\services\resetCodeService.ts

// הסרנו את הייבוא של 'fs' ו-'path' כי אנחנו עוברים ל-Supabase.
// import fs from 'fs/promises';
// import path from 'path';

import { createClient } from '@supabase/supabase-js'; // ייבוא לקוח Supabase

// הגדרת משתני סביבה של Supabase.
// ודאי שמשתנים אלה מוגדרים בקובץ .env שלך בתיקיית ה-backend.
const SUPABASE_URL = process.env.SUPABASE_URL!;
// *** חשוב: השתמש ב-SERVICE_ROLE_KEY כאן ***
// פעולות כתיבה/מחיקה בטבלה זו דורשות הרשאות גבוהות.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!);

/**
 * פונקציה זו יוצרת קוד איפוס חדש ושומרת אותו בטבלת reset_codes ב-Supabase.
 * היא גם מוחקת קודים קודמים לאותו מייל כדי למנוע כפילויות של קודים פעילים.
 * @param email כתובת האימייל עבורה נוצר הקוד.
 * @returns הקוד שנוצר.
 */
export async function generateResetCode(email: string): Promise<string> {
    const processedEmail = email.toLowerCase(); // המרת המייל לאותיות קטנות.

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // קוד בן 6 ספרות.
    // הערה: created_at יוגדר אוטומטית אם הגדרת default value `now()` בטבלה ב-Supabase.
    // אם לא הגדרת, תצטרכי לשלוח: created_at: new Date().toISOString() כחלק מהאובייקט למטה.

    try {
        // 1. נקה קודים ישנים עבור המייל הזה מטבלת Supabase.
        // זה מבטיח שאף משתמש לא יוכל לבקש אינסוף קודים מבלי שהקודמים יפונו.
        const { error: deleteError } = await supabase
            .from('password_reset_codes') // ודאי שזה שם הטבלה שלך ב-Supabase (לרוב זה 'reset_codes').
            .delete()
            .eq('user_email', processedEmail); // מוחק רשומות קודמות עם אותו מייל (ללא קשר לרישיות שהוזנה במקור).

        if (deleteError) {
            console.error('Error clearing old reset codes from Supabase:', deleteError);
            // אם זה קריטי, אפשר לזרוק כאן שגיאה, אחרת רק לרשום.
        }

        // 2. הוסף את הקוד החדש לטבלת Supabase.
        const { data, error: insertError } = await supabase
            .from('password_reset_codes') // ודאי שזה שם הטבלה שלך ב-Supabase.
            .insert({
                user_email: processedEmail, // שמירת המייל באותיות קטנות.
                code: code,
                // אם אין לך default value `now()` לעמודת created_at בטבלה:
                // created_at: new Date().toISOString()
            })
            .select() // מחזיר את הרשומה שהוכנסה, כולל ה-id וה-created_at.
            .single(); // מצפה לרשומה אחת.

        if (insertError) {
            console.error('Error inserting new reset code into Supabase:', insertError);
            throw new Error('Failed to generate reset code.');
        }

        return code;
    } catch (error) {
        console.error('An unexpected error occurred in generateResetCode:', error);
        throw error;
    }
}

/**
 * פונקציה זו מאמתת האם קוד איפוס שסופק על ידי משתמש תקין ותקף מטבלת Supabase.
 * לאחר אימות מוצלח, הקוד נמחק מהטבלה כדי למנוע שימוש חוזר.
 * @param email כתובת האימייל של המשתמש.
 * @param code קוד האיפוס שהוזן על ידי המשתמש.
 * @returns true אם הקוד תקף, false אחרת.
 */
export async function verifyResetCode(email: string, code: string): Promise<boolean> {
    const processedEmail = email.toLowerCase(); // המרת המייל לאותיות קטנות לצורך אימות.

    try {
        const { data: entry, error } = await supabase
            .from('password_reset_codes') // ודאי שזה שם הטבלה שלך ב-Supabase.
            .select('id, created_at') // בחר רק את השדות הנחוצים (אופטימיזציה).
            .eq('user_email', processedEmail) // חיפוש לפי מייל באותיות קטנות.
            .eq('code', code)
            .maybeSingle(); // מצפה ל-0 או 1 רשומות.

        if (error) {
            console.error('Error fetching reset code for verification from Supabase:', error);
            return false;
        }

        if (!entry) return false; // קוד או מייל לא נמצאו בטבלה.

        const now = new Date();
        const created = new Date(entry.created_at); // שימוש בשם העמודה שהגדרת ב-Supabase.
        const diff = (now.getTime() - created.getTime()) / 1000; // הפרש בשניות.

        // בדוק אם הקוד עדיין תקף (פחות מ-10 דקות - 600 שניות).
        if (diff < 600) {
            // *** חשוב: מחק את הקוד מיד לאחר שימוש מוצלח כדי למנוע שימוש חוזר! ***
            const { error: deleteError } = await supabase
                .from('password_reset_codes')
                .delete()
                .eq('id', entry.id); // מחיקת הקוד הספציפי שאומת לפי ה-ID שלו.

            if (deleteError) {
                console.error('Error deleting used reset code from Supabase:', deleteError);
                // לא לזרוק שגיאה כאן, כי האימות כבר הצליח. רק לרשום בלוג.
            }
            return true; // הקוד תקף ואומת בהצלחה.
        }

        // הקוד פג תוקף.
        return false;
    } catch (error) {
        console.error('An unexpected error occurred in verifyResetCode:', error);
        throw error; // או return false; בהתאם למדיניות טיפול השגיאות שלך.
    }
}













































// קו של נאוה
// // backend/src/services/authService.ts
// import { OAuth2Client } from 'google-auth-library';
// import jwt from 'jsonwebtoken';
// import { upsertUser } from '../services/user.service';
// import bcrypt from 'bcryptjs';
// // Google Client ID validation.
// if (!process.env.GOOGLE_CLIENT_ID) {
//     console.error('ERROR: GOOGLE_CLIENT_ID est non definitum in .env archivo pro authService!');
//     process.exit(1);
// }
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
// // JWT Secret validation.
// if (!process.env.JWT_SECRET) {
//     console.error('ERROR: JWT_SECRET est non definitum in .env archivo pro authService!');
//     process.exit(1);
// }
// const JWT_SECRET = process.env.JWT_SECRET as string;

// // הגדרת מבנה הנתונים עבור אובייקט משתמש לצורך אימות.
// // User data interface definition.
// interface UserAuthData {
//     id: string;
//     email: string;
//     name: string;
//     password: string;
//     emailVerified?: boolean;
// }
// /**
//  * Functio principalis ad processus authentificationis Google ID Token, nunc inclusa interactione cum DB.
//  * Hoc verificat ID Token, extrahit informationes usoris, processus usorem in DB (addit/renovat), et creat JWT.
//  * @param {string} googleIdToken ID Token receptum a Frontend post nexum Google.
//  * @returns {Promise<{ user: UserAuthData, token: string }>} Obiectum continens informationes usoris (ex DB) et JWT generatum.
//  * @throws {Error} Si authentificatio deficit, notitia deficit, vel est error generalis servitoris.
//  */


// export const verifyGoogleTokenAndCreateJwt = async (googleIdToken: string) => {
//     try {
//         // 1. Verifying the ID Token with Google servers
//         // אימות טוקן הזיהוי מול שרתי גוגל כדי לוודא את תקינותו.
//         const ticket = await client.verifyIdToken({
//             idToken: googleIdToken,
//             audience: process.env.GOOGLE_CLIENT_ID as string,
//         });
//         // 2. Extracting user information from the token's payload
//         // חילוץ פרטי המשתמש מהטוקן המאומת (לדוגמה: id, אימייל, שם).
//         const payload = ticket.getPayload();
//         // בדיקה שפרטי משתמש קריטיים קיימים בטוקן.
//         if (!payload || !payload.sub || !payload.email || !payload.name) {
//             console.error('Critical user information missing from Google ID token payload:', payload);
//             throw new Error('Critical user information missing from Google ID token payload.');
//         }
//         const googleId = payload.sub;
//         // const email = payload.email;
//         const email = payload.email.toLowerCase(); // המרת המייל לאותיות קטנות מיד עם קבלתו מגוגל
//         const name = payload.name;
//         const emailVerified = payload.email_verified;
//         // *** 3. הוספת הלוגיקה של בדיקה והוספה/עדכון של המשתמש במסד הנתונים מבוסס JSON ***
//         // כששולחים ל-upsertUser, אנחנו יכולים לכלול את הסיסמה (שהיא המייל).

//         // עדכון או יצירת רשומת משתמש במסד הנתונים.
//         const userRecord = await upsertUser({ googleId, email, name, password: email });

//         console.log('Google user successfully verified and processed with JSON DB:', userRecord.email);
//         // 4. Creating a JWT (JSON Web Token) for the user
//         // יצירת טוקן JWT עבור המשתמש המאומת, שישמש לאימות בבקשות עתידיות.
//         const jwtToken = jwt.sign(
//             {
//                 id: userRecord.id,
//                 email: userRecord.email,
//                 username: userRecord.username
//             },
//             JWT_SECRET,
//             {
//                 expiresIn: '7d'// הטוקן מגדר ל7 ימים
//             }
//         );

//         // 5. Returning the results (including password from userRecord)
//         // החזרת אובייקט המכיל את פרטי המשתמש ואת טוקן ה-JWT.
//         return {
//             user: {
//                 id: userRecord.id,
//                 email: userRecord.email,
//                 username: userRecord.username,
//                 emailVerified: emailVerified,
//             },
//             token: jwtToken
//         };

//     } catch (error: any) {
//         // טיפול בשגיאות שעלולות להתרחש במהלך תהליך האימות או הטיפול בנתונים.
//         console.error('Error in authService.verifyGoogleTokenAndCreateJwt:', error);
//         throw error;
//     }
// };












// קוד של נעה

// import { OAuth2Client } from 'google-auth-library';
// import jwt from 'jsonwebtoken';
// import { upsertUser } from '../services/user.service';
// import bcrypt from 'bcryptjs';
// // Google Client ID validation.
// if (!process.env.GOOGLE_CLIENT_ID) {
//     console.error('ERROR: GOOGLE_CLIENT_ID est non definitum in .env archivo pro authService!');
//     process.exit(1);
// }
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
// // JWT Secret validation.
// if (!process.env.JWT_SECRET) {
//     console.error('ERROR: JWT_SECRET est non definitum in .env archivo pro authService!');
//     process.exit(1);
// }
// const JWT_SECRET = process.env.JWT_SECRET as string;
// // User data interface definition.
// interface UserAuthData {
//     id: string;
//     email: string;
//     username: string;
//     password: string; // <--- שינוי כאן: הוספת שדה סיסמה
//     emailVerified?: boolean;
// }
// /**
//  * Functio principalis ad processus authentificationis Google ID Token, nunc inclusa interactione cum DB.
//  * Hoc verificat ID Token, extrahit informationes usoris, processus usorem in DB (addit/renovat), et creat JWT.
//  * @param {string} googleIdToken ID Token receptum a Frontend post nexum Google.
//  * @returns {Promise<{ user: UserAuthData, token: string }>} Obiectum continens informationes usoris (ex DB) et JWT generatum.
//  * @throws {Error} Si authentificatio deficit, notitia deficit, vel est error generalis servitoris.
//  */
// export const verifyGoogleTokenAndCreateJwt = async (googleIdToken: string) => {
//     try {
//         // 1. Verifying the ID Token with Google servers
//         const ticket = await client.verifyIdToken({
//             idToken: googleIdToken,
//             audience: process.env.GOOGLE_CLIENT_ID as string,
//         });
//         // 2. Extracting user information from the token's payload
//         const payload = ticket.getPayload();
//         if (!payload || !payload.sub || !payload.email || !payload.name) {
//             console.error('Critical user information missing from Google ID token payload:', payload);
//             throw new Error('Critical user information missing from Google ID token payload.');
//         }
//         const googleId = payload.sub;
//         const email = payload.email;
//         const name = payload.name;
//         const emailVerified = payload.email_verified;
//         // *** 3. הוספת הלוגיקה של בדיקה והוספה/עדכון של המשתמש במסד הנתונים מבוסס JSON ***
//         // כששולחים ל-upsertUser, אנחנו יכולים לכלול את הסיסמה (שהיא המייל).
//         const userRecord = await upsertUser({ googleId, email, name, password: email }); // <--- שינוי כאן: העברת password: email
//         console.log('Google user successfully verified and processed with JSON DB:', userRecord.user.email);
//         // 4. Creating a JWT (JSON Web Token) for the user
//         const jwtToken = jwt.sign(
//             {
//                 id: userRecord.user.id,
//                 email: userRecord.user.email,
//                 username: userRecord.user.username
//             },
//             JWT_SECRET,
//             {
//                 expiresIn: '7d'
//             }
//         );
//         // 5. Returning the results (including password from userRecord)
//         return {
//             user: {
//                 id: userRecord.user.id,
//                 email: userRecord.user.email,
//                 //name: userRecord.username,
//                 username: userRecord.user.username, // ← משנה מ-name ל-username
//                 // password: userRecord.passwordHash, // <--- שינוי כאן: החזרת שדה הסיסמה
//                 emailVerified: emailVerified,
//             },
//             token: jwtToken
//         };
//     } catch (error: any) {
//         console.error('Error in authService.verifyGoogleTokenAndCreateJwt:', error);
//         throw error;
//     }
// };







// קוד משולב// backend/src/services/authService.ts
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
// חשוב לוודא שייבוא זה מתייחס לגרסת ה-user.service.ts המחוברת ל-Supabase.
import { upsertUser } from '../services/user.service';
import bcrypt from 'bcryptjs';
// Google Client ID validation.
if (!process.env.GOOGLE_CLIENT_ID) {
    console.error('ERROR: GOOGLE_CLIENT_ID est non definitum in .env archivo pro authService!');
    process.exit(1);
}
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
// JWT Secret validation.
if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET est non definitum in .env archivo pro authService!');
    process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET as string;

// הגדרת מבנה הנתונים עבור אובייקט משתמש לצורך אימות.
interface UserAuthData {
    id: string;
    email: string;
    username: string;
    emailVerified?: boolean;
}
/**
 * פונקציה ראשית לתהליך אימות ה-Google ID Token.
 * זו מאמתת את ה-ID Token, מחלצת את פרטי המשתמש,
 * מטפלת במשתמש במסד הנתונים (מוסיפה/מעדכנת), ויוצרת JWT.
 * @param {string} googleIdToken ה-ID Token שהתקבל מה-Frontend לאחר התחברות לגוגל.
 * @returns {Promise<{ user: UserAuthData, token: string }>} אובייקט המכיל את פרטי המשתמש (ממסד הנתונים) ואת ה-JWT שנוצר.
 * @throws {Error} אם האימות נכשל, נתונים חסרים, או שיש שגיאת שרת כללית.
 */
export const verifyGoogleTokenAndCreateJwt = async (googleIdToken: string) => {
    try {
        // 1. אימות טוקן הזיהוי מול שרתי גוגל כדי לוודא את תקינותו.
        const ticket = await client.verifyIdToken({
            idToken: googleIdToken,
            audience: process.env.GOOGLE_CLIENT_ID as string,
        });

        // 2. חילוץ פרטי המשתמש מהטוקן המאומת (id, אימייל, שם).
        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email || !payload.name) {
            console.error('Critical user information missing from Google ID token payload:', payload);
            throw new Error('Critical user information missing from Google ID token payload.');
        }
        const googleId = payload.sub;
        // *** כאן מתבצעת המרת המייל לאותיות קטנות, כפי שביקשת! ***
        const email = payload.email.toLowerCase();
        const name = payload.name;
        const emailVerified = payload.email_verified;

        
        // 3. עדכון או יצירת רשומת משתמש במסד הנתונים באמצעות upsertUser
        // שימו לב: user.service.ts (גרסת Supabase) מצפה ל-password עבור גיבוב.
        // עבור התחברות גוגל, אנו משתמשים באימייל כסיסמה "מדומה" שתגוּבָּב.
        // *** הקריאה ל-upsertUser מתאימה לגרסת Supabase המחזירה { user: User } ***

        const userRecordResult = await upsertUser({ googleId, email, name });
        // const userRecordResult = await upsertUser({ googleId, email, name, password: email });

        const userRecord = userRecordResult.user; // גישה לאובייקט ה-User מתוך התגובה של upsertUser

        console.log('Google user successfully verified and processed with Supabase DB:', userRecord.email);

        // 4. יצירת טוקן JWT עבור המשתמש
        const jwtToken = jwt.sign(
            {
                id: userRecord.id,
                email: userRecord.email,
                username: userRecord.username
            },
            JWT_SECRET,
            {
                expiresIn: '7d' // הטוקן תקף ל-7 ימים
            }
        );

        // 5. החזרת התוצאות
        return {
            user: {
                id: userRecord.id,
                email: userRecord.email,
                //name: userRecord.username,
                username: userRecord.username, // ← משנה מ-name ל-username
                // password: userRecord.passwordHash, // <--- שינוי כאן: החזרת שדה הסיסמה
                emailVerified: emailVerified,
            },
            token: jwtToken
        };
    } catch (error: any) {
        console.error('Error in authService.verifyGoogleTokenAndCreateJwt:', error);
        throw error;
    }
};
// גרסה של נאוה
 // packages\backend\src\services\user.service.ts
// import fs from 'fs/promises';
// import path from 'path';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { UserRole } from '@base-project/shared/src/types';
// import { User } from '@base-project/shared/src/types';




// //אופציה לגשת לניתוב מכל מקום
// const USERS_FILE = path.join(__dirname, '../../data/users.json');





// //משתנה לטוקן
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';



// // קוראת את כל המשתמשים מקובץ ה-JSON.
// async function readUsers(): Promise<User[]> {
//   try {
//     const data = await fs.readFile(USERS_FILE, 'utf-8');
//     return JSON.parse(data);
//   } catch {
//     /**if (error.code === 'ENOENT' || error.name === 'SyntaxError') {
//      console.warn('users.json לא נמצא או ריק. מאותחל עם מערך ריק.');*/

//     return [];
//   }
// }




// //פונקצית כתיבת משתמש - הכנסת משתמש
// async function writeUsers(users: User[]): Promise<void> {
//   await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
// }



// // מחפשת משתמש לפי כתובת אימייל (לא תלוי רישיות)
// export const findUserByEmail = async (email: string): Promise<User | undefined> => {
//   const users = await readUsers();
//   const searchEmail = email.toLowerCase(); // המרת המייל הנכנס ל-lowercase
//   return users.find(user => user.email.toLowerCase() === searchEmail); // השוואה בין שני מיילים ב-lowercase
// };




// //*** */
// /**
//  * מוסיף משתמש חדש או מעדכן משתמש קיים ב"מסד הנתונים" מבוסס ה-JSON.
//  * @param userData אובייקט המכיל את נתוני המשתמש (googleId, email, name, ולצורך זה גם password).
//  * @returns Promise של אובייקט User (החדש או המעודכן).
//  */


// // מוסיפה משתמש חדש (לרוב מ-Google) או מעדכנת קיים
// export const upsertUser = async (userData: { googleId: string; email: string;
//   name: string; password?: string;}): Promise<User> => {
//   const users = await readUsers();
//   const now = new Date();
//    const processedEmail = userData.email.toLowerCase(); // המרת המייל הנכנס ל-lowercase כאן
//   const existingUserIndex = users.findIndex(
//     u => u.email.toLowerCase() === processedEmail // שימוש במייל המעובד
//   );
//   if (existingUserIndex !== -1) {
//     // === משתמש קיים ===
//     const existingUser = users[existingUserIndex];

//     const updatedUser: User = {
//       ...existingUser,
//       id: "", // תמיד ריק
//       // email: userData.email,
//       email: processedEmail,
//       username: userData.name,
//       updatedAt: now,
//       googleId: existingUser.googleId || userData.googleId, // שמור את הקיים, או עדכן אם ריק
//       // שומר את הסיסמה הקיימת — לא משנה כלום!
//       passwordHash: existingUser.passwordHash,
//     };
//     users[existingUserIndex] = updatedUser;
//     await writeUsers(users);
//     return updatedUser;
//   } else {
//     // === משתמש חדש (כלומר התחברות ראשונה דרך גוגל) ===
//     const newUser: User = {
//       id: "", // ריק תמיד
//       // email: userData.email,
//       email: processedEmail,
//       username: userData.name,
//       passwordHash: userData.email, // רק במקרה הזה: סיסמה = אימייל
//       googleId: userData.googleId,
//       role: UserRole.USER,
//       createdAt: now,
//       updatedAt: now,
//     };
//     users.push(newUser);
//     await writeUsers(users);
//     return newUser;
//   }
// };



// //*** */


// // רושמת משתמש חדש במערכת; מחזירה null אם המייל כבר קיים
// export async function registerUser(username: string, email: string, password: string): Promise<User | null> {
//   const users = await readUsers();

//   // if (users.find(u => u.email === email)) {
//   const processedEmail = email.toLowerCase(); // המרת המייל הנכנס ל-lowercase
//   if (users.find(u => u.email.toLowerCase() === processedEmail)) { // השוואה למייל שגם הוא ב-lowercase
//     return null; // המשתמש כבר קיים
//   }

//   const passwordHash = password; // אם תשתמשי ב־bcrypt עדכני גם כאן
//   const now = new Date();

//   const newUser: User = {
//     id: "", // ✅ תמיד ריק
//     username,
//     email: processedEmail, // שמירת המייל באותיות קטנות בלבד
//     passwordHash,
//     googleId: "", // ✅ אין גוגל ID
//     role: UserRole.USER,
//     createdAt: now,
//     updatedAt: now,
//   };

//   users.push(newUser);
//   await writeUsers(users);
//   return newUser;
// }






// //פונקציית התחברות
// export async function loginUser(email: string, password: string): Promise<{ token: string, user: User } | null> {
//   // const users = await readUsers();
//   // const user = users.find(u => u.email === email);
//   const users = await readUsers();
//   const loginEmail = email.toLowerCase(); // המרת המייל הנכנס ל-lowercase
//   const user = users.find(u => u.email.toLowerCase() === loginEmail); // חיפוש לפי מייל ב-lowercase

//   if (!user) return null;

//   const isValid = password === user.passwordHash; // אם תחזרי ל-bcrypt שימי לב גם פה
//   if (!isValid) return null;

//   const token = jwt.sign(
//     { id: user.id, username: user.username, email: user.email },
//     JWT_SECRET,
//     { expiresIn: '7d' }
//   );

//   return { token, user };
// }









// //  מחלצת פרטי משתמש מטוקן JWT.
// export async function getUserFromToken(token: string): Promise<User | null> {
//   try {
//     const payload = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
//     const users = await readUsers();
//     return users.find(u => u.id === payload.id) || null;
//   } catch {
//     return null;
//   }
// }



// // מאפסת סיסמה למשתמש קיים ומחזירה טוקן חדש
// export async function resetPassword(email: string, newPassword: string) {


//   const users = await readUsers();
//   const searchEmail = email.toLowerCase(); // המרת המייל הנכנס ל-lowercase
//   const index = users.findIndex(user => user.email.toLowerCase() === searchEmail); // חיפוש לפי מייל ב-lowercase


//   if (index === -1) return null;

//   //const hashedPassword = await bcrypt.hash(newPassword, 10);
//   const hashedPassword = newPassword;
//   users[index].passwordHash = hashedPassword;
//   users[index].updatedAt = new Date();


//   await writeUsers(users);


//   const token = jwt.sign(
//     { id: users[index].id, username: users[index].username, email: users[index].email },
//     JWT_SECRET,
//     { expiresIn: "1h" }
//   );

//   return { token };
// }











// גרסה של נעה
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { UserRole } from '@base-project/shared/src/types';
// import { User } from '@base-project/shared/src/types';
// import { v4 as uuidv4 } from 'uuid';
// import { createClient } from '@supabase/supabase-js';
// const SUPABASE_URL = process.env.SUPABASE_URL!;
// const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!);
// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
// const TABLE_NAME = 'users';
// //אנחנו צריכות להבין מה קורה פה???
// //משתנה לטוקן
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// //*** */
// /**
//  * מחפש משתמש קיים לפי כתובת הID שלו.
//  */
// export const findUserByEmail = async (email: string): Promise<User | null> => {
//   try {
//     const { data, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', email)
//       .maybeSingle();
//     if (error) throw error;
//     return data || null;
//   } catch (error) {
//     console.error('Error in findUserById:', error);
//     return null;
//   }
// };
// /**
//  * מוסיף משתמש חדש או מעדכן משתמש קיים ב"מסד הנתונים" מבוסס ה-JSON.
//  * @param userData אובייקט המכיל את נתוני המשתמש (googleId, email, name, ולצורך זה גם password).
//  * @returns Promise של אובייקט User (החדש או המעודכן).
//  */
// export const upsertUser = async (userData: {
//   googleId: string;
//   email: string;
//   name: string;
//    password?: string;
// }): Promise<{ user: User;  }> => {
//   const now = new Date().toISOString();
//   // בדיקה אם המשתמש כבר קיים
//   const { data: existingUser, error: fetchError } = await supabase
//     .from('users')
//     .select('*')
//     .eq('email', userData.email)
//     .maybeSingle();
//   if (fetchError) throw fetchError;
//   let user: User;
//   if (existingUser) {
//   const updateData: any = {
//     username: userData.name,
//     updated_at: now,
//     google_id: existingUser.google_id || userData.googleId,
//   };
//   if (userData.password) {
//     updateData.password_hash = await bcrypt.hash(userData.password, 10);
//   }
//   const { data: updatedUser, error: updateError } = await supabase
//     .from('users')
//     .update(updateData)
//     .eq('id', existingUser.id)
//     .select()
//     .single()
//     if (updateError) throw updateError;
//     user = updatedUser;
//   } else {
//     // === משתמש חדש ===
//     const passwordHash = await bcrypt.hash(userData.email, 10); // סיסמה "מדומה"
//     const newUser = {
//       id: uuidv4(),
//       email: userData.email,
//       username: userData.name,
//       password_hash: passwordHash,
//       google_id: userData.googleId,
//       role: UserRole.USER,
//       created_at: now,
//       updated_at: now,
//     };
//     const { data: insertedUser, error: insertError } = await supabase
//       .from('users')
//       .insert(newUser)
//       .select()
//       .single();
//     if (insertError) throw insertError;
//     user = insertedUser;
//   }
//   return { user };
// };
// //*** הרשמה*/
// export async function registerUser(
//   username: string,
//   email: string,
//   password: string
// ): Promise<any | null> {
//   try {
//     const { data: existingUser, error: fetchError } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', email)
//       .maybeSingle();
//     if (fetchError) throw fetchError;
//     if (existingUser) return null;
//     const now = new Date().toISOString();
//     const password_hash = await bcrypt.hash(password, 10);
//     const userToSave = {
//       id: uuidv4(),
//       email,
//       username,
//       password_hash, // לשימוש ב-JSON
//       google_id: null,
//       role: UserRole.USER,
//       created_at: new Date(now),
//       updated_at: new Date(now),
//     };
//     //  הוספה ל-Supabase
//     const { data: newUser, error: insertError } = await supabase
//       .from('users')
//       .insert({
//         ...userToSave,
//         password_hash: password_hash,
//         google_id: '',
//         created_at: now,
//         updated_at: now,
//       })
//       .select()
//       .single();
//     if (insertError) throw insertError;
//     ;
//     return newUser;
//   } catch (error) {
//     console.error('Error in registerUser:', error);
//     throw error;
//   }
// }
// //התחברות
// export async function loginUser(email: string, password: string): Promise<{ token: string, user: User } | null> {
//   try {
//     // מחפש משתמש לפי אימייל בדאטה
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', email)
//       .maybeSingle();
//     if (error) throw error;
//     if (!user) return null;
//     // בדיקת סיסמה עם הצפנה
//     const isValid = await bcrypt.compare(password, user.password_hash);
//     if (!isValid) return null;
//     // יצירת טוקן
//     const token = jwt.sign(
//       { id: user.id, username: user.username, email: user.email },
//       JWT_SECRET,
//       { expiresIn: '7d' }
//     );
//     return { token, user };
//   } catch (error) {
//     console.error('Error in loginUser:', error);
//     return null;
//   }
// }
// //חיפוש משתמש על פי טוקן
// export async function getUserFromToken(token: string): Promise<User | null> {
//   try {
//     const payload = jwt.verify(token, JWT_SECRET) as { id: string; username?: string };
//     // חיפוש משתמש ב-Supabase לפי id מתוך הטוקן
//     const { data, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('id', payload.id)
//       .maybeSingle();
//     if (error) throw error;
//     return data || null;
//   } catch (error) {
//     console.error('Error in getUserFromToken:', error);
//     return null;
//   }
// }
// //איפוס סיסמא
// export async function resetPassword(email: string, newPassword: string) {
//   const { data: user, error: fetchError } = await supabase
//     .from('users')
//     .select('*')
//     .ilike('email', email)
//     .maybeSingle();
//   if (fetchError) throw fetchError;
//   if (!user) return null;
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   const { data: updatedUser, error: updateError } = await supabase
//     .from('users')
//     .update({
//       password_hash: hashedPassword,
//       updated_at: new Date().toISOString()
//     })
//     .eq('id', user.id)
//     .select()
//     .single();
//   if (updateError) throw updateError;
//   // החזרת טוקן חדש
//   const token = jwt.sign(
//     {
//       id: updatedUser.id,
//       username: updatedUser.username,
//       email: updatedUser.email,
//     },
//     JWT_SECRET,
//     { expiresIn: '1h' }
//   );
//   return { token };
// }
// import nodemailer from 'nodemailer';
// export async function sendResetEmail(to: string, code: string) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
//   try { // <--- התחלת בלוק try
//     await transporter.sendMail({
//       from: `"JustLaw" <${process.env.EMAIL_USER}>`, // נשאר "JustLawIsrael" כי זו זהות השולח
//       to,
//       subject: 'Password Reset Code', // שונה לאנגלית
//       text: `Hello! Your password reset verification code is: ${code}. It is valid for 10 minutes.`, // שונה לאנגלית
//     });
//     console.log('Email sent successfully to:', to); // הודעת הצלחה
//   } catch (error) { // <--- התחלת בלוק catch
//     console.error('Failed to send email. Error details:', error); // הדפסת השגיאה המלאה
//     throw error; // זרוק את השגיאה מחדש
//   }
// }












// גרסה משולבת


// packages\backend\src\services\user.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@base-project/shared/src/types';
import { User } from '@base-project/shared/src/types';
import { v4 as uuidv4 } from 'uuid';
import { createClient,SupabaseClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer'; // ייבוא Nodemailer
import camelcaseKeys from 'camelcase-keys';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// יצירת לקוח סופאבייס לגישה רחבה יותר (למשל, מחיקת משתמשים) - כפי שמופיע בקוד ששלחת
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!);
// יצירת לקוח סופאבייס סטנדרטי לפעולות יומיומיות
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// הגדרת Transport עבור שליחת מיילים (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail', // או שירות אחר שתגדיר/י
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * מחפש משתמש קיים לפי כתובת אימייל (לא תלוי רישיות).
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const processedEmail = email.toLowerCase(); // המרה לאותיות קטנות לחיפוש
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', processedEmail) // חיפוש לפי המייל באותיות קטנות
      .maybeSingle();
    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error in findUserByEmail:', error);
    return null;
  }
};

// /**
//  * מוסיף משתמש חדש או מעדכן משתמש קיים במסד הנתונים ב-Supabase.
//  * @param userData אובייקט המכיל את נתוני המשתמש (googleId, email, name, password).
//  * @returns Promise של אובייקט User (החדש או המעודכן).
//  */
// export const upsertUser = async (userData: {
//   googleId: string;
//   email: string;
//   name: string;
//   password?: string;
// }): Promise<{ user: User }> => {
//   const now = new Date().toISOString();
//   const processedEmail = userData.email.toLowerCase(); // המרה לאותיות קטנות לפני טיפול

//   // בדיקה אם המשתמש כבר קיים באמצעות המייל המעובד
//   const { data: existingUser, error: fetchError } = await supabase
//     .from('users')
//     .select('*')
//     .eq('email', processedEmail)
//     .maybeSingle();

//   if (fetchError) throw fetchError;

//   let user: User;

//   if (existingUser) {
//     // === משתמש קיים ===
//     const updateData: any = {
//       username: userData.name,
//       updated_at: now,
//       google_id: existingUser.google_id || userData.googleId, // שמור את הקיים, או עדכן
//     };
//     if (userData.password) {
//       updateData.password_hash = await bcrypt.hash(userData.password, 10);
//     }
    
//     // ודא שה-id של המשתמש תואם את ה-id של השורה שאתה רוצה לעדכן
//     const { data: updatedUser, error: updateError } = await supabase
//       .from('users')
//       .update(updateData)
//       .eq('id', existingUser.id) // עדכון לפי ה-ID של המשתמש הקיים
//       .select()
//       .single();

//     if (updateError) throw updateError;
//     user = updatedUser;
//   } else {
//     // === משתמש חדש (לרוב התחברות ראשונה דרך גוגל) ===
//     const passwordHash = await bcrypt.hash(userData.email, 10); // גיבוב האימייל כסיסמה ראשונית
//     const newUser = {
//       id: uuidv4(),
//       email: processedEmail, // שמירת המייל באותיות קטנות
//       username: userData.name,
//       password_hash: passwordHash,
//       google_id: userData.googleId,
//       role: UserRole.USER,
//       created_at: now,
//       updated_at: now,
//     };

//     const { data: insertedUser, error: insertError } = await supabase
//       .from('users')
//       .insert(newUser)
//       .select()
//       .single();

//     if (insertError) throw insertError;
//     user = insertedUser;
//   }
//   return { user };
// };


// זוהי רק הפונקציה upsertUser המעודכנת. יש להשלים אותה לתוך הקובץ user.service.ts
// ולוודא שכל הייבואים והקבועים (כמו SupabaseClient, uuidv4, bcrypt, UserRole) זמינים.

/**
 * Adds a new user or updates an existing user in the Supabase database.
 * Crucially, prevents overwriting password_hash for existing Google logins.
 * @param userData Object containing user data (googleId, email, name, password).
 * @returns Promise of a User object (new or updated).
 */
export const upsertUser = async (userData: {
  googleId: string;
  email: string;
  name: string;
  password?: string; // Only present if explicitly provided (e.g., manual password set/reset)
}): Promise<{ user: User }> => {
  const now = new Date().toISOString();
  const processedEmail = userData.email.toLowerCase();
  console.log(`[upsertUser] Called for email: ${processedEmail}, googleId: ${userData.googleId || 'N/A'}`);

  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', processedEmail)
    .maybeSingle();

  if (fetchError) {
    console.error(`[upsertUser] Error fetching existing user ${processedEmail}:`, fetchError);
    throw fetchError;
  }

  let user: User;

  if (existingUser) {
    // === משתמש קיים ===
    console.log(`[upsertUser] Existing user found: ${processedEmail} (ID: ${existingUser.id}). Preparing update data.`);

    const updateData: {
        username: string;
        updated_at: string;
        google_id?: string;
        password_hash?: string;
    } = {
        username: userData.name,
        updated_at: now,
    };

    // Update google_id only if it's new or different
    if (userData.googleId && userData.googleId !== existingUser.google_id) {
        updateData.google_id = userData.googleId;
        console.log(`[upsertUser] Updating google_id for ${processedEmail} from ${existingUser.google_id || 'N/A'} to ${userData.googleId}.`);
    } else if (existingUser.google_id) {
        // Ensure google_id remains if already set and not changed
        updateData.google_id = existingUser.google_id;
    }


    // **הנקודה הקריטית:** הוסף password_hash רק אם הוא סופק ב-userData
    // For Google logins, userData.password will be undefined.
    if (userData.password) {
        console.log(`[upsertUser] 'password' field found in userData. Hashing and updating password_hash for ${processedEmail}.`);
        updateData.password_hash = await bcrypt.hash(userData.password, 10);
    } else {
        console.log(`[upsertUser] No 'password' field in userData. password_hash will NOT be updated for ${processedEmail}.`);
    }

    
    // Execute the update only if there's actual data to update (beyond just the ID)
    // This check can prevent unnecessary DB writes if only the Google ID is the same and no password/username changed.
    const hasChanges = Object.keys(updateData).some(key => {
        // Simple check: if a key is present in updateData and its value is different from existingUser
        if (key === 'username' && updateData.username !== existingUser.username) return true;
        if (key === 'google_id' && updateData.google_id !== existingUser.google_id) return true;
        if (key === 'password_hash' && updateData.password_hash !== existingUser.password_hash) return true;
        return false;
    });
    
    // We *always* update updated_at, so if there's *any* change, we update.
    // Or if updateData has more than just updated_at, we update.
    if (Object.keys(updateData).length > 1 || (Object.keys(updateData).length === 1 && updateData.updated_at)) {
        console.log(`[upsertUser] Executing DB update for existing user ${processedEmail} with data:`, updateData);
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', existingUser.id)
            .select()
            .single();

        if (updateError) {
            console.error('[upsertUser] Error updating existing user:', updateError);
            throw updateError;
        }
        user = updatedUser;
        console.log(`[upsertUser] Successfully updated user: ${user.email}`);
    } else {
        console.log(`[upsertUser] No significant changes detected for existing user ${processedEmail}. Returning existing user.`);
        user = existingUser; // No update needed, return the existing user data
    }


  } else {
    // === משתמש חדש (לרוב התחברות ראשונה דרך גוגל) ===
    console.log(`[upsertUser] New user detected: ${processedEmail}. Creating with email as initial password hash.`);
    const passwordHash = await bcrypt.hash(userData.email, 10); // Hash the email as initial password
    const newUser = {
      id: uuidv4(),
      email: processedEmail, // Store email in lowercase
      username: userData.name,
      password_hash: passwordHash, // Initial password is the hashed email
      google_id: userData.googleId,
      role: UserRole.USER,
      created_at: now,
      updated_at: now,
    };

    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (insertError) {
      console.error('[upsertUser] Error inserting new user:', insertError);
      throw insertError;
    }
    user = insertedUser;
    console.log(`[upsertUser] Successfully created new user: ${user.email}`);
  }
  return { user };
};

/**
 * רושם משתמש חדש במערכת; מחזיר null אם המייל כבר קיים (לא תלוי רישיות).
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<User | null> {
  try {
    const processedEmail = email.toLowerCase(); // המרה לאותיות קטנות לחיפוש ושמירה

    // בדיקה אם המשתמש כבר קיים באמצעות המייל המעובד
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', processedEmail) // חיפוש לפי המייל באותיות קטנות
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (existingUser) return null; // המשתמש כבר קיים

    const now = new Date().toISOString();
    const password_hash = await bcrypt.hash(password, 10); // גיבוב הסיסמה

    const userToSave = {
      id: uuidv4(),
      email: processedEmail, // שמירת המייל באותיות קטנות
      username,
      password_hash,
      google_id: null, // אין Google ID בהרשמה רגילה
      role: UserRole.USER,
      created_at: now, // נשמור כ-ISO string
      updated_at: now, // נשמור כ-ISO string
    };

    // הוספה ל-Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(userToSave)
      .select()
      .single();

    if (insertError) throw insertError;
    return newUser;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
}

/**
 * פונקציית התחברות עם מנגנון חסימה לאחר ניסיונות כושלים.
 * @param email - מייל המשתמש
 * @param password - סיסמה
 * @returns token, user, error, attemptsLeft, blockedFor
 */
export async function loginUser(email: string, password: string): Promise<{
  token?: string,
  user?: User,
  error?: string,
  attemptsLeft?: number,
  blockedFor?: number // שניות עד סיום חסימה
} | null> {
  try {
    const loginEmail = email.toLowerCase();

    // חיפוש משתמש לפי מייל
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', loginEmail)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      // משתמש לא קיים
      return { error: "This user does not exist in the system." };
    }

    // בדיקת חסימה
    const now = new Date();
    if (user.blocked_until && new Date(user.blocked_until) > now) {
      // המשתמש חסום
      const blockedFor = Math.ceil((new Date(user.blocked_until).getTime() - now.getTime()) / 1000);
      return {
        error: "Your account is blocked",
        blockedFor
      };
    }

    // בדיקת סיסמה
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      // עדכון מונה כשלונות
      let failedAttempts = (user.failed_login_attempts || 0) + 1;
      let updates: any = { failed_login_attempts: failedAttempts };
      let errorMsg = "Incorrect password.";
      let attemptsLeft = 7 - failedAttempts;

      if (failedAttempts < 6) {
        // 1-5 כשלונות
        // errorMsg נשאר
      } else if (failedAttempts === 6) {
        // ניסיון 6
        errorMsg = "Incorrect password.\nOne last attempt left before your account is blocked  ⚠️";
      } else if (failedAttempts >= 7) {
        // ניסיון 7 - חסימה
        const blockedUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 דקות קדימה
        updates.blocked_until = blockedUntil.toISOString();
        updates.failed_login_attempts = 0; // איפוס מונה
        errorMsg = "Your account has been temporarily blocked due to multiple requests\nPlease try again in 05:00";
        attemptsLeft = 0;
      }//

      // עדכון ב-db
      await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      return {
        error: errorMsg,
        attemptsLeft
      };
    }

    // התחברות מוצלחת - איפוס מונה וחסימה
    await supabase
      .from('users')
      .update({
        failed_login_attempts: 0,
        blocked_until: null
      })
      .eq('id', user.id);

    // יצירת טוקן
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user };
  } catch (error) {
    console.error('Error in loginUser:', error);
    return { error: "Server error" };
  }
}

/**
 * מחלצת פרטי משתמש מטוקן JWT.
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; username?: string };

    // חיפוש משתמש ב-Supabase לפי id מתוך הטוקן
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.id)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error in getUserFromToken:', error);
    return null;
  }
}

/**
 * מאפסת סיסמה למשתמש קיים ומחזירה טוקן חדש.
 */
export async function resetPassword(email: string, newPassword: string) {
  const searchEmail = email.toLowerCase(); // המרה לאותיות קטנות לחיפוש

  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', searchEmail) // חיפוש לפי המייל באותיות קטנות
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!user) return null; // משתמש לא נמצא

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({
      password_hash: hashedPassword,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id) // עדכון לפי ה-ID של המשתמש
    .select()
    .single();

  if (updateError) throw updateError;

  // החזרת טוקן חדש
  const token = jwt.sign(
    {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  return { token };
}

/**
 * שולח מייל איפוס סיסמה.
 */
export async function sendResetEmail(to: string, code: string) {
  try {
    await transporter.sendMail({
      from: `"JustLawIsrael" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset Code',
      text: `Hello! Your password reset verification code is: ${code}. It is valid for 10 minutes.`,
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Failed to send email. Error details:', error);
    throw error;
  }
}


export class UserService{
private readonly tableName = 'users'
  private supabase: SupabaseClient | null = null

  private getClient(): SupabaseClient {
    if (!this.supabase) {
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration. Please check your environment variables.')
      }
      this.supabase = createClient(supabaseUrl, supabaseKey)
    }
    return this.supabase;
  }

   canInitialize(): boolean {
    return this.getClient() !== null;
  }


async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: true })
      if (error) {
        console.error('DB error fetching users:', error)
        throw new Error('Failed to fetch users from database.')
      }
      return (data || []).map(row => camelcaseKeys(row, { deep: true })) as unknown as User[]
    }
    catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

}
export const userService = new UserService()
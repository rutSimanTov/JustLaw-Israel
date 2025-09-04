import { Request, Response } from 'express';
import * as profileService from '../services/profileService';
import { Profile } from '@base-project/shared/src/models/Profile';
import validateProfileData from '../validators/profileValidation';


/**
 * ✅ Update user profile
 * עדכון פרופיל – מזהה לבד אם יש טוקן או לא
 * 
 * HTTP Statuses:
 * 200 OK - ✅ העדכון בוצע בהצלחה
 * 400 Bad Request - ❌ נתונים שגויים בבקשה
 * 500 Internal Server Error - ❌ שגיאת שרת
 */
// 
/**
 * ✅ Update user profile
 * עדכון פרופיל – מזהה לבד אם יש טוקן או לא
 *
 * HTTP Statuses:
 * 200 OK - ✅ העדכון בוצע בהצלחה
 * 400 Bad Request - ❌ שדות חסרים
 * 404 Not Found - ❌ המשתמש לא נמצא
 * 500 Internal Server Error - ❌ שגיאת שרת
 */


export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id || req.body.user_id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" }); // 400
    }
    const { valid, errors } = validateProfileData(req.body);
    if (!valid) {
      console.log('❌ Validation errors:', errors);
      return res.status(400).json({
        error: "Validation failed",
        errors: errors,
      });
      }
    const updateData: Partial<Profile> = req.body;
    const accessToken = req.headers.authorization?.split(' ')[1];

    try {
      // Update via token or admin
      // עדכון דרך משתמש רגיל או אדמין
      if (accessToken) {
        await profileService.updateProfileUser(userId, updateData, accessToken);
      } else {
        await profileService.updateProfileAdmin(userId, updateData);
      }
    } catch (err: any) {
      // User not found
      // המשתמש לא נמצא
      if (err?.message?.toLowerCase().includes("not found")) {
        return res.status(404).json({ success: false, message: "User not found" }); // 404
      }
      throw err;
    }

    return res.status(200).json({ success: true }); // 200 OK
  } catch (err) {
    console.error('❌ Error in update:', err);
    return res.status(500).json({ success: false, error: 'Failed to update profile' }); // 500
  }
};
/**

 * ✅ Delete user profile
 */
export const remove = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const accessToken = req.headers.authorization?.split(' ')[1];

    try {
      if (accessToken) {
        // שלב 1: שליפת הפרופיל
        const profile = await profileService.getProfileByIdService(userId, accessToken);

        if (!profile) {
          return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // שלב 2: שליפת userId מהטוקן
      // const accessToken = req.headers.authorization?.split(' ')[1];

        // שלב 3: בדיקת התאמה
        if (profile.userId !== accessToken) {
          return res.status(403).json({ success: false, message: "Unauthorized to delete this profile" });
        }

        // שלב 4: מחיקה
        await profileService.deleteProfileUser(userId, accessToken);
      } else {
        // Admin deletion
        await profileService.deleteProfileAdmin(userId);
      }

      return res.status(200).json({ success: true });
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("not found")) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      throw err;
    }
  } catch (err) {
    console.error('❌ Error in remove:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete profile' });
  }
};


/**
 * ✅ Get user profile by ID
 * שליפת פרופיל לפי user_id – גם עם טוקן וגם Admin
 * 
 * HTTP Statuses:
 * 200 OK - ✅ הפרופיל נשלף בהצלחה
 * 400 Bad Request - ❌ חסר user_id
 * 404 Not Found - ❌ המשתמש לא נמצא
 * 500 Internal Server Error - ❌ שגיאת שרת
 */
export const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id || req.params.id;
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" }); // 400
    }

    let profile: Profile | null = null;

    if (accessToken) {
      profile = await profileService.getProfileByIdService(userId, accessToken);
    } else {
      profile = await profileService.getProfileByIdAdmin(userId);
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' }); // 404
    }

    return res.status(200).json({ success: true, data: profile }); // 200
  } catch (error) {
    console.error('❌ Error in getById:', error);
    return res.status(500).json({ success: false, message: 'Server error' }); // 500
  }
};

/**
 * ✅ Get all profiles (Admin only)
 * שליפת כל הפרופילים – ADMIN בלבד
 * 
 * HTTP Statuses:
 * 200 OK - ✅ רשימת הפרופילים נשלפה בהצלחה
 * 500 Internal Server Error - ❌ שגיאת שרת
 */
export const getAll = async (_req: Request, res: Response) => {
  try {
    const profiles = await profileService.getAllProfilesAdmin();
    return res.status(200).json({ success: true, data: profiles }); // 200
  } catch (error) {
    console.error('❌ Error in getAll:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch profiles' }); // 500
  }
};

/**
 * ✅ Create user profile
 * יצירת פרופיל – גם עם טוקן וגם Admin
 * 
 * HTTP Statuses:
 * 201 Created - ✅ פרופיל נוצר בהצלחה
 * 400 Bad Request - ❌ שדות חסרים / לא תקינים
 * 409 Conflict - ❌ כתובת מייל כבר קיימת
 * 500 Internal Server Error - ❌ שגיאת שרת
 */
export const create = async (req: Request, res: Response) => {
  try {
    const { valid, errors } = validateProfileData(req.body);
    if (!valid) {
      console.log('❌ Validation errors:', errors);
      return res.status(400).json({
        error: "Validation failed",
        errors: errors,
      });
      }

    const userId = req.body.user_id;
    const existing = await profileService.getProfileByIdAdmin(userId);
    if (existing) {
      return res.status(409).json({ success: false, message: "Profile already exists" }); // 409
    }

    const profileData: Partial<Profile> = req.body;
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (accessToken) {
      await profileService.createProfileUser(profileData, accessToken);
    } else {
      await profileService.createProfileAdmin(profileData);
    }

    return res.status(201).json({ success: true }); // 201
  } catch (err: any) {
    console.error('❌ Error creating profile:', err , err.stack);

    if (err?.code === 'EMAIL_EXISTS') {
      return res.status(409).json({ success: false, message: 'Email already exists' }); // 409
    }

    return res.status(500).json({ success: false, message: 'Failed to create profile' }); // 500
  }
};



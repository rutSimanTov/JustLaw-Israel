import { Router } from "express";
import { profileSearchHandler } from "../controllers/profileSearchController";
import { verifyAccessToken } from "../utils/auth";

const router = Router();

// ✅ הגדרת הנתיב עם אימות
router.get("/search", verifyAccessToken, profileSearchHandler);

export default router;

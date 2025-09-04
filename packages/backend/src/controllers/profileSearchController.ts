import { Request, Response } from "express";
import { performProfileSearch } from "../services/profileSearchService";

/**
 * חיפוש פרופילים – בהתאם להרשאות
 */
export const profileSearchHandler = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";
    const country = (req.query.country as string) || undefined;
    const connection_types = req.query.connection_types as string[] | undefined;
    const engagement_types = req.query.engagement_types as string[] | undefined;
    const keywords = req.query.keywords as string[] | undefined;
    
    


    const role_description = (req.query.role_description as string) || undefined;

    // const page = parseInt(req.query.page as string) || 1; // ✅ תמיכה בפרמטר page
    // const pageSize = parseInt(req.query.pageSize as string) || 20; // ✅ תמיכה בפרמטר pageSize


    const filters = {
      keyword: q,
      country_region: country,
      role_description,
      connection_types,
      engagement_types,
      keywords,
      // page,
      // pageSize
    };

    const isAuthenticated = !!req.user;
    const isAdmin = req.user?.role === "admin";

    const results = await performProfileSearch(isAuthenticated, isAdmin, filters);

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("❌ Error in profile search:", error);
    return res.status(500).json({ success: false, message: "Search failed" });
  }
};


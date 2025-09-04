import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_ANON_KEY:", supabaseKey);

// export const performProfileSearch = async (
//   isAuthenticated: boolean,
//   isAdmin: boolean,
//   filters: {
//     keyword?: string;
//     country_region?: string;
//     connection_types?: string[];
//     engagement_types?: string[];
//     keywords?: string[];

//     // ✅ הוספה לצורך פיצ'ר 6 – תמיכה בפאגינציה:
//     page?: number;
//     pageSize?: number;
//   }
// ): Promise<any> => {
//   const supabase = createClient(supabaseUrl, supabaseKey);

//   const selectFields = isAdmin
//     ? "*" // הכל לאדמין
//     : isAuthenticated

// ?' user_id, full_name, role_description, country_region, value_sentence, keywords, current_challenge, connection_types, engagement_types, contact_info, project_link, other_connection_text, is_visible, created_at, updated_at, image, contact_phone_visible, contact_linkedin_visible, contact_website_visible, contact_other_visible'
//        :'user_id, full_name, role_description, country_region, value_sentence, keywords, current_challenge, connection_types, engagement_types, contact_info, project_link, other_connection_text, is_visible, created_at, updated_at, image, contact_phone_visible, contact_linkedin_visible, contact_website_visible, contact_other_visible'

//   let query = supabase
//     .from("profile")
//     .select(selectFields, { count: "exact" })
//   if (filters.keyword) {
//     query = query.ilike("full_name", `%${filters.keyword}%`);
//   }

//   if (filters.country_region) {
//     query = query.eq("country_region", filters.country_region);
//   }

//   if (filters.connection_types?.length) {
//     query = query.contains("connection_types", filters.connection_types);
//   }

//   if (filters.engagement_types?.length) {
//     query = query.contains("engagement_types", filters.engagement_types);
//   }

//   if (filters.keywords?.length) {
//     query = query.contains("keywords", filters.keywords);
//   }

//   // ✅ חישוב טווח לפאגינציה – לפי page ו־pageSize
//   const page = filters.page || 1; // ברירת מחדל – עמוד ראשון
//   const pageSize = filters.pageSize || 20; // ברירת מחדל – 20 תוצאות לעמוד
//   const from = (page - 1) * pageSize;
//   const to = from + pageSize - 1;

//   // ⬅️ עדכון טווח עם from/to במקום טווח קבוע של 0–19
//   query = query.order("created_at", { ascending: false }).range(from, to);

//   const { data, count, error } = await query;
//   if (error) throw error;

//   return {
//     profiles: data,
//     total_count: count || 0,

//     // ✅ החזרת פרטי הפאגינציה בתוצאה
//     page,
//     page_size: data?.length || 0,
//   };
// };



//לאחר הורדת שימוש בפגיאנציה

export const performProfileSearch = async (
  isAuthenticated: boolean,
  isAdmin: boolean,
  filters: {
    keyword?: string;
    role_description?: string;
    country_region?: string;
    keywords?: string[];
    connection_types?: string[];
    engagement_types?: string[];
    
  }
): Promise<any> => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const selectFields = isAdmin
    ? "*"
    : 'user_id, full_name, role_description, country_region, value_sentence, keywords, current_challenge, connection_types, engagement_types, contact_info, project_link, other_connection_text, is_visible, created_at, updated_at, image, contact_phone_visible, contact_linkedin_visible, contact_website_visible, contact_other_visible';

  let query = supabase
    .from("profile")
    .select(selectFields, { count: "exact" });

  // שם
  if (filters.keyword) {
    query = query.ilike("full_name", `%${filters.keyword}%`);
  }

  // תיאור תפקיד
  if (filters.role_description) {
    query = query.ilike("role_description", `%${filters.role_description}%`);
  }

  // מדינה
  if (filters.country_region) {
    query = query.ilike("country_region", `%${filters.country_region}%`);
  }

  // סוגי קשר
  if (filters.connection_types?.length) {
    query = query.contains("connection_types", filters.connection_types);
  }

  // סוגי מעורבות
  if (filters.engagement_types?.length) {
    query = query.contains("engagement_types", filters.engagement_types);
  }


   //הצגת התגיות 
  if (filters.keywords && typeof filters.keywords === 'string') {
    filters.keywords = (filters.keywords as string).split(",").map(k => k.trim()).filter(Boolean);
  }

  // חיפוש חכם במילות מפתח (keywords)
  if (filters.keywords?.length) {
    const keywordOrFilters = filters.keywords.map(k =>
      `keywords.cs.{${k}}`

    ).join(",");
    query = query.or(keywordOrFilters);
  }

  


  query = query.order("created_at", { ascending: false });



  const { data, count, error } = await query;
  if (error) throw error;

  return {
    profiles: data,
    total_count: count || 0,
    page_size: data?.length || 0,
  };
};

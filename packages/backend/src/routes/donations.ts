import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import {supabase} from '../services/supabaseClient'

const router = Router();
// const supabaseurl = process.env.SUPABASE_URL+"";
// const supabaseKey = process.env.SUPABASE_ANON_KEY+"";

// const supabase = createClient(
// supabaseurl, // שימי את כתובת הפרויקט שלך
// supabaseKey  // מפתח ציבורי
// );

router.get("/get", async (req, res) => {
  const { data, error } = await supabase
    .from("donations")
    .select(`
      amount,
      type,
      donors (
        donor_name,
        created_at
      )
    `)
    .order("donation_id", { ascending: true });

  if (error) {
    console.error("שגיאה ב-Supabase:", error.message);
    return res.status(500).json({ error });
  }

  const formatted = data.map((d: any) => ({
    name: d.donors?.donor_name ?? "לא ידוע",
    date: d.donors?.created_at?.split("T")[0] ?? "",
    amount: d.amount,
    type: d.type
  }));

  res.json(formatted);
});

export default router;
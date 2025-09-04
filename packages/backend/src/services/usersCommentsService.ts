import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { boolean } from "joi";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export interface comments {
    id: number;
    article_id: string;
    user_id: string;
    content: string;
    created_at: string;
    is_anonymous: boolean;
    display_name?: string;      // שם מוצג
       
}

export const writeComment = async (
  content: string,
  userId: string,
  articleId: string,
  isAnonymous: boolean,
  displayName?: string
): Promise<comments> => {
  if (!userId) throw new Error("User must be logged in to write a comment");
  if (!articleId) throw new Error("Missing article id");
  const now = new Date().toISOString();
  const insertObj = {
    content,
    created_at: now,
    article_id: articleId,
    user_id: userId,
    is_anonymous: isAnonymous,
    display_name: isAnonymous ? "Anonymous" : displayName || "משתמש",
  };
  const resp = await supabase
    .from("comments")
    .insert([insertObj])
    .select()
    .single();
    console.log("isAnonymous:", isAnonymous, "displayName:", displayName);
  if (resp.error) throw resp.error;
  return resp.data as comments;
};

export const getComments = async (articleId: string): Promise<comments[]> => {
  if (!articleId) throw new Error("Missing article id");
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return data as comments[];

}

// עדכון תגובה
export const updateComment = async (id: number, userId: string, content: string) => {
  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// מחיקת תגובה
export const deleteComment = async (id: number, userId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};


//for commit

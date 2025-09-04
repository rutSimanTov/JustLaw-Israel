

import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export interface Drafts {
  id: number;
  content: string;
  created_at: string;
  updated_at: string | null;
  version_id: number;
  user?: string; // uuid
}

export interface VersionHistory {
  id: number;
  draft_id: number;
  content: string;
  timestamp: string;
  user?: string; // uuid
}

/**
 * יצירת טיוטה חדשה
 */
export const createDraft = async (
  content: string,
  userId: string
): Promise<Drafts> => {
  if (!userId) throw new Error("User must be logged in to create a draft");
  const now = new Date().toISOString();
  const insertObj: any = {
    content,
    created_at: now,
    updated_at: now,
    version_id: 1,
    user: userId,
  };
  const resp = await supabase
    .from("drafts")
    .insert([insertObj])
    .select()
    .single();
  if (resp.error) throw resp.error;
  return resp.data as Drafts;
};

/**
 * עדכון טיוטה קיימת (פנימי)
 */
const updateDraftWithVersion = async (
  draftId: number,
  content: string,
  version_id: number
): Promise<Drafts> => {
  const now = new Date().toISOString();
  const resp = await supabase
    .from("drafts")
    .update({ content, updated_at: now, version_id })
    .eq("id", draftId)
    .select()
    .single();
  if (resp.error) throw resp.error;
  return resp.data as Drafts;
};

/**
 * שליפת טיוטה לפי מזהה
 */
export const getDraftById = async (
  draftId: number
): Promise<Drafts | null> => {
  const resp = await supabase
    .from("drafts")
    .select("*")
    .eq("id", draftId)
    .single();
  return resp.data ?? null;
};

/**
 * מחיקת טיוטה (עם שמירת גרסה)
 */
export const deleteDraft = async (draftId: number): Promise<boolean> => {
  const existing = await getDraftById(draftId);
  if (!existing) return false;
  await saveToVersionHistory(draftId, existing.content);
  const resp = await supabase.from("drafts").delete().eq("id", draftId);
  if (resp.error) throw resp.error;
  return true;
};

/**
 * שמירת טיוטה עם קונפליקט
 */
export const saveDraftWithConflict = async (
  draftId: number,
  content: string,
  lastUpdated: string,
  override: boolean,
  userId: string
) => {
  const existing = await getDraftById(draftId);
  // בדיקת קונפליקט
  if (existing && !override && existing.updated_at !== lastUpdated) {
    return { conflict: true, serverDraft: existing };
  }
  if (existing) {
    // שמור לגרסאות רק אם override (דריסה)
    if (override) {
      await saveToVersionHistory(existing.id, existing.content);
    }
    const updated = await updateDraftWithVersion(
      draftId,
      content,
      existing.version_id + 1
    );
    return { conflict: false, lastUpdated: updated.updated_at };
  }
  // אם לא קיימת טיוטה - יוצרת חדשה
  const created = await createDraft(content, userId);
  return { conflict: false, lastUpdated: created.updated_at };
};

/**
 * שמירה לגרסה (כולל ניקוי)
 */
export const saveToVersionHistory = async (
  draftId: number,
  content: string
): Promise<void> => {
  await cleanupOldVersions();

  // שליפת הטיוטה כדי לקבל את ה-user
  const draft = await getDraftById(draftId);
  const user = draft?.user || null;

  const { data: versions } = await supabase
    .from("version_history")
    .select("*")
    .eq("draft_id", draftId)
    .order("timestamp", { ascending: true });
  if (versions && versions.length >= 2) {
    const oldest = versions[0];
    await supabase.from("version_history").delete().eq("id", oldest.id);
  }
  const now = new Date().toISOString();
  const resp = await supabase
    .from("version_history")
    .insert([{ draft_id: draftId, content, timestamp: now, user }]);
  if (resp.error) throw resp.error;
};

/**
 * שליפת היסטוריית גרסאות (סל מחזור)
 */
export const getDraftHistory = async (
  draftId: number
): Promise<VersionHistory[]> => {
  const resp = await supabase
    .from("version_history")
    .select("*")
    .eq("draft_id", draftId)
    .order("timestamp", { ascending: false });
  if (resp.error) throw resp.error;
  return resp.data as VersionHistory[];
};

/**
 * שחזור טיוטה
 */
export const restoreDraftFromVersion = async (
  draftId: number,
  versionId: number
): Promise<Drafts> => {
  const versionResp = await supabase
    .from("version_history")
    .select("*")
    .eq("id", versionId)
    .eq("draft_id", draftId)
    .single();
  if (versionResp.error || !versionResp.data) {
    throw new Error("גרסה לא קיימת");
  }
  await saveToVersionHistory(draftId, versionResp.data.content);
  const updated = await updateDraftWithVersion(
    draftId,
    versionResp.data.content,
    (await getDraftById(draftId))!.version_id + 1
  );
  return updated;
};

/**
 * שליפת טיוטות לפי משתמש
 */
export const getDraftsByUserId = async (userId: string): Promise<Drafts[]> => {
  const resp = await supabase
    .from("drafts")
    .select("*")
    .eq("user", userId);
  if (resp.error) throw resp.error;
  return resp.data as Drafts[];
};

/**
 * ניקוי טיוטות ישנות (30 יום)
 */
export const cleanupOldDrafts = async () => {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("drafts").delete().lt("updated_at", cutoff);
};

/**
 * ניקוי גרסאות ישנות (90 יום)
 */
export const cleanupOldVersions = async () => {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from("version_history")
    .delete()
    .lt("timestamp", cutoff);
};



export const getAllVersionsByUserId = async (userId: string): Promise<VersionHistory[]> => {
  // שליפת כל הגרסאות מהיסטוריית הגרסאות ששייכות למשתמש
  const versionsResp = await supabase
    .from("version_history")
    .select("*")
    .eq("user", userId)
    .order("timestamp", { ascending: false });

  if (versionsResp.error) throw versionsResp.error;
  return versionsResp.data as VersionHistory[];
};

export const createDraftFromVersion = async (userId: string, versionId: number) => {
  // שלוף את הגרסה מהיסטוריית הגרסאות
  const versionResp = await supabase
    .from("version_history")
    .select("*")
    .eq("id", versionId)
    .single();
  if (versionResp.error || !versionResp.data) throw versionResp.error || new Error("Version not found");

  // צור טיוטה חדשה עם התוכן מהגרסה
  const draftResp = await supabase
    .from("drafts")
    .insert([
      {
        user: userId,
        content: versionResp.data.content,
        version_id: 1
      }
    ])
    .select()
    .single();
  if (draftResp.error) throw draftResp.error;

  // מחק את הגרסה מהסל
  await supabase.from("version_history").delete().eq("id", versionId);

  return draftResp.data;
};
// export const cleanupAllDraftsAndVersions = async () => {
//   await supabase.from("drafts").delete();
//   await supabase.from("version_history").delete();
// };
//

export const DeleteDraftPermanently = async (versionId: number) => {
   const resp=await supabase
    .from("version_history")
    .delete()
    .eq("id", versionId);
    if (resp.error) throw resp.error;
    return true;
}



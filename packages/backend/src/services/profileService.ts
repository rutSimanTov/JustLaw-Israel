import { createClient } from '@supabase/supabase-js';
import { Profile } from '@base-project/shared/src/models/Profile';

// 🌍 Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TABLE_NAME = 'profile';

// 🔐 Authenticated client
function createSupabaseClientWithToken(token: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
// 👑 Admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ------------------------------------------------------------------
// 👑 Admin functions
// ------------------------------------------------------------------

export async function createProfileAdmin(data: Partial<Profile>) {
  console.log('2 🔍 Creating profile with data:', data);
  const { data: createdProfile, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .insert([{ ...data, created_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw error;
  return createdProfile;
}

export async function updateProfileAdmin(userId: string, data: Partial<Profile>) {
  const { error } = await supabaseAdmin
    .from(TABLE_NAME)
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

export async function deleteProfileAdmin(userId: string) {
  const { error } = await supabaseAdmin
    .from(TABLE_NAME)
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

export async function getProfileByIdAdmin(userId: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error(`⚠️ שגיאה בשליפת פרופיל ID: ${userId}`, error.message);
    throw error;
  }

  if (!data) {
    console.warn(`⚠️ לא נמצא פרופיל עם user_id: ${userId}`);
    return null;
  }

  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: data.updated_at ? new Date(data.updated_at) : null,
  } as Profile;
}

export async function getAllProfilesAdmin(): Promise<Profile[]> {
  const { data, error } = await supabaseAdmin
    .from(TABLE_NAME)
    .select('*');

  if (error) throw error;

  return data.map((profile) => ({
    ...profile,
    created_at: new Date(profile.created_at),
    updated_at: profile.updated_at ? new Date(profile.updated_at) : null,
  })) as Profile[];
}

// ------------------------------------------------------------------
// 🔐 Authenticated user functions
// ------------------------------------------------------------------

export async function updateProfileUser(userId: string, data: Partial<Profile>, accessToken: string) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data: existing, error: fetchError } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId);

  if (fetchError) throw fetchError;
  if (!existing || existing.length === 0) return { success: false, message: 'Profile not found' };

  const { error: updateError } = await supabase
    .from(TABLE_NAME)
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (updateError) throw updateError;
  return { success: true };
}

export async function deleteProfileUser(userId: string, accessToken: string) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

export async function getProfileByIdService(userId: string, accessToken: string): Promise<Profile | null> {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('❌ שגיאת שליפה:', error.message);
    return null;
  }

  if (!data) {
    console.warn('⚠️ לא נמצא פרופיל עבור המשתמש:', userId);
    return null;
  }

  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: data.updated_at ? new Date(data.updated_at) : null,
  } as Profile;
}

export async function createProfileUser(data: Partial<Profile>, accessToken: string) {
  console.log('1 🔍 Creating profile with data:', data);
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data: createdProfile, error } = await supabase
    .from(TABLE_NAME)
    .insert([{ ...data, created_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw error;
  return createdProfile;
}
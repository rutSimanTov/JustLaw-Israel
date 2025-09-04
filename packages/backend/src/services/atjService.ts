import { supabaseAdmin } from './supabaseClient';

// ATJ Types - defined locally to avoid import issues
interface ATJ {
  id: number;
  name: string;
  country: string;
  created_at?: Date;
  updated_at?: Date;
}

interface CreateATJRequest {
  name: string;
  country: string;
}

interface ATJOrg {
  id: number;
  name: string;
  country: string;
  "Representative's_name": string;  // שם העמודה האמיתי
  "Representative's_title": string; // שם העמודה האמיתי
  created_at?: Date;
  updated_at?: Date;
}

interface CreateATJOrgRequest {
  name: string;
  country: string;
  "Representative's_name": string;
  "Representative's_title": string;
}

export const createATJ = async (data: CreateATJRequest): Promise<ATJ> => {
  const { data: result, error } = await supabaseAdmin
    .from('ATJ')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create ATJ record: ${error.message}`);
  }

  return result;
};

export const createATJOrg = async (data: CreateATJOrgRequest): Promise<ATJOrg> => {
  // שימוש ב-service_role key במקום anon key כדי לעקוף RLS
  const { data: result, error } = await supabaseAdmin
    .from('ATJ_org')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to create ATJ Organization record: ${error.message}`);
  }

  return result;
};

export const getAllATJ = async (): Promise<ATJ[]> => {
  const { data, error } = await supabaseAdmin
    .from('ATJ')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch ATJ records: ${error.message}`);
  }

  return data || [];
};

export const getAllATJOrg = async (): Promise<ATJOrg[]> => {
  const { data, error } = await supabaseAdmin
    .from('ATJ_org')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch ATJ Organization records: ${error.message}`);
  }

  return data || [];
};

export const getATJById = async (id: number): Promise<ATJ | null> => {
  const { data, error } = await supabaseAdmin
    .from('ATJ')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch ATJ record: ${error.message}`);
  }

  return data;
};

export const getATJOrgById = async (id: number): Promise<ATJOrg | null> => {
  const { data, error } = await supabaseAdmin
    .from('ATJ_org')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch ATJ Organization record: ${error.message}`);
  }

  return data;
};

// קבלת כל החתומים - שילוב מטבלאות ATJ ו-ATJ_org
export const getAllSignatories = async () => {
  try {
    console.log('🔍 getAllSignatories: Fetching from ATJ and ATJ_org tables...');
    console.log('🔑 Using regular supabase client (with RLS)');

    // שליפת נתונים מטבלאות ATJ ו-ATJ_org במקביל
    const [atjResult, atjOrgResult] = await Promise.allSettled([
      supabaseAdmin.from('ATJ').select('*').order('id', { ascending: false }),
      supabaseAdmin.from('ATJ_org').select('*').order('id', { ascending: false })
    ]);

    let combinedData: any[] = [];

    // הוספת נתונים מטבלת ATJ (אנשים פרטיים)
    if (atjResult.status === 'fulfilled') {
      console.log('📋 ATJ query result:', atjResult.value);
      if (!atjResult.value.error) {
        const individuals = (atjResult.value.data || []).map((individual: any) => ({
          id: individual.id,
          name: individual.name,
          country: individual.country,
          type: 'individual',
          representative_name: null,
          representative_title: null,
          created_at: individual.created_at,
          source_table: 'ATJ'
        }));
        combinedData = [...combinedData, ...individuals];
        console.log('✅ ADDED FROM ATJ TABLE:', individuals.length, 'individuals');
        if (individuals.length > 0) {
          console.log('📊 Sample ATJ data:', individuals[0]);
          console.log('📊 Raw individual data:', atjResult.value.data[0]);
        }
      } else {
        console.log('❌ ATJ table error:', atjResult.value.error);
      }
    } else {
      console.log('❌ ATJ query rejected:', atjResult.reason);
    }

    // הוספת נתונים מטבלת ATJ_org (ארגונים)
    if (atjOrgResult.status === 'fulfilled') {
      console.log('📋 ATJ_org query result:', atjOrgResult.value);
      if (!atjOrgResult.value.error) {
        const organizations = (atjOrgResult.value.data || []).map((org: any) => ({
          id: org.id + 10000, // להבטיח שאין התנגשות ID
          name: org.organization_name || org.name, // נבדוק שני שמות אפשריים
          country: org.country,
          type: 'organization',
          representative_name: org["Representative's_name"] || org.representative_name, // נבדוק שני שמות אפשריים
          representative_title: org["Representative's_title"] || org.representative_title, // נבדוק שני שמות אפשריים
          created_at: org.createdAt || org.created_at,
          source_table: 'ATJ_org'
        }));
        combinedData = [...combinedData, ...organizations];
        console.log('✅ ADDED FROM ATJ_org TABLE:', organizations.length, 'organizations');
        if (organizations.length > 0) {
          console.log('📊 Sample ATJ_org data:', organizations[0]);
          console.log('📊 Raw org data:', atjOrgResult.value.data[0]);
        }
      } else {
        console.log('❌ ATJ_org table error:', atjOrgResult.value.error);
      }
    } else {
      console.log('❌ ATJ_org query rejected:', atjOrgResult.reason);
    }

    console.log('🎯 FINAL RESULT - COMBINED DATA:', combinedData.length, 'total records');
    console.log('� Breakdown:', combinedData.filter(item => item.type === 'individual').length, 'individuals +', combinedData.filter(item => item.type === 'organization').length, 'organizations');
    
    return combinedData;

  } catch (error: any) {
    console.error('❌ Error in getAllSignatories:', error);
    throw new Error(`Failed to fetch signatories: ${error.message}`);
  }
};

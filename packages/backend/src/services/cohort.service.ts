import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Cohort } from '@base-project/shared'
 import camelcaseKeys from 'camelcase-keys'
  import snakecaseKeys from 'snakecase-keys'
export class CohortService {
  private readonly tableName = 'cohort'
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

  //fetch all active cohorts
  async getAllCohorts(): Promise<Cohort[]> {
  try {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select('*')
      // .eq('is_active', true)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('DB error fetching cohorts:', error);
      throw new Error('Failed to fetch cohorts from database.');
    }

    //convert to camelcase keys Cohort[]
    return (data || []).map(row => camelcaseKeys(row, { deep: true })) as unknown as Cohort[];
  } catch (error) {
    console.error('Error in getAllCohorts:', error);
    throw error;
  }
}

//fetch cohort details by cohort id
async getCohortById(id: string): Promise<Cohort | null> {
  try {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('DB error fetching cohort:', error);
      throw new Error('Failed to fetch cohort from database');
    }

    //convert to camelCase
    return data ? camelcaseKeys(data, { deep: true }) as unknown as Cohort : null;
  } catch (error) {
    console.error('Error in getCohortById:', error);
    throw error;
  }
}
  
//create a new cohort
  async createCohort(cohort: Omit<Cohort, 'id'>): Promise<Cohort|undefined> {
    try {
      // Convert dd/MM/yyyy string to YYYY-MM-DD string for DB
      const parseDDMMYYYY = (str: string): string => {
        const [day, month, year] = str.split('/').map(Number);
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      };
      const payload = snakecaseKeys({
        ...cohort,
        startDate: typeof cohort.startDate === 'string' ? parseDDMMYYYY(cohort.startDate) : cohort.startDate,
        endDate: typeof cohort.endDate === 'string' ? parseDDMMYYYY(cohort.endDate) : cohort.endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { deep: true });
      console.log('DB payload:', payload);
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Database error creating cohort:', error);
        throw new Error('Failed to create cohort in database');
      }

      //convert to camelCase
      return data ? camelcaseKeys(data, { deep: true }) as unknown as Cohort : undefined;
    } catch (error) {
      console.error('Error in createCohort:', error);
      throw error;
    }
  }

  //update a cohort details
  async updateCohort(id: string, updates: Partial<Cohort>): Promise<Cohort | null> {
    try {
      // Convert dd/MM/yyyy string to YYYY-MM-DD string for DB
      const parseDDMMYYYY = (str: string): string => {
        const [day, month, year] = str.split('/').map(Number);
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      };
      const payload = snakecaseKeys({
        ...updates,
        startDate: typeof updates.startDate === 'string' ? parseDDMMYYYY(updates.startDate) : updates.startDate,
        endDate: typeof updates.endDate === 'string' ? parseDDMMYYYY(updates.endDate) : updates.endDate,
        updatedAt: new Date(),
      }, { deep: true });
      console.log('DB payload:', payload);
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`DB error updating cohort ${id}:`, error)
        throw new Error(`Failed to update cohort ${id}.`)
      }
      return data;
    }
    catch (error) {
      console.error('Error in updateCohort:', error)
      throw error
    }
  }

  //delete a cohort
  async deleteCohort(id: string) {
    const { error } = await this.getClient()
        .from(this.tableName)
        .delete()
        .eq('id', id);

    if (error) throw error;

    return { success: true };
}

}

export const cohortService = new CohortService()





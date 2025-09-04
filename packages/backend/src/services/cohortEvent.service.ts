import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Cohort, CohortEvent } from '@base-project/shared'
import { log } from 'console'
import { join } from 'path'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

export class CohortEventService {
  private readonly tableName = 'cohort_event'
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

  async getEventsByCohort(cohortId: string): Promise<CohortEvent[]> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .eq('cohort_id', cohortId)
        .order('start_time', { ascending: true })

      if (error) {
        console.error('DB error listing events:', error)
        throw new Error('Failed to fetch events')
      }
      return data || []
    } catch (e) {
      console.error('Error in getEventsByCohort:', e)
      throw e
    }
  }
//fetch all past recordings for the active cohort
async fetchActiveCohortEvents(): Promise<{ cohort: Cohort; events: CohortEvent[] }> {
  try {
    const { data, error } = await this.getClient()
      .from('cohort')
      .select(`
          *,
          cohort_events ( 
          id, google_event_id, title, description, start_time, end_time, zoom_meeting_id, zoom_join_url, zoom_password, is_required )
      `)
      .eq('is_active', true)
      .limit(1) // Limits to only one result
      .single(); // assuming there is only one active cohort

    if (error) {
      console.error('DB error listing cohort:', error);
      throw new Error('Failed to fetch cohort');
    }

    const { cohort_events, ...cohort } = data;

    // calculate the date in month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // current date
    const now = new Date();

    // Filtering events from the last month and the past
    const events = (cohort_events || []).filter((event: any) => {
      const eventStartTime = new Date(event.start_time);
      return eventStartTime >= oneMonthAgo && eventStartTime < now; // events from the last month
    }).map((row: any) => camelcaseKeys(row, { deep: true })) as unknown as CohortEvent[];

    return {
      cohort: camelcaseKeys(cohort, { deep: true }) as unknown as Cohort,
      events: events,
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

  async getCohortEventById(id: string): Promise<CohortEvent | null> {
    try{
      console.log('Fetching cohort event with ID:', id);
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
            return null; 
        }
        console.error('DB error fetching cohort event:', error)
        throw new Error('Failed to fetch cohort event from database');
      }
      return data;
    }
    catch(error){
      console.error('Error in getCohortEventById:', error);
      throw error;
    }
  }


  async createCohortEvent(cohortEvent: Omit<CohortEvent, 'id'>): Promise<CohortEvent> {
    try {
      const now=new Date();
      const payload={...cohortEvent, createdAt:now,updatedAt:now}
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Database error creating cohort event:', error);
        throw new Error('Failed to create cohort event in database');
      }

      return data;
    } catch (error) {
      console.error('Error in createCohortEvent:', error);
      throw error;
    }
  }

  async updateCohrtEvent(id: string, updates: Partial<CohortEvent>): Promise<CohortEvent | null> {
    try {
      const payload={...updates,updatedAt:new Date()}
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .update(payload)        
        .eq('id', id)                
        .single()                      

      if (error) {
        console.error(`DB error updating cohort event ${id}:`, error)
        throw new Error(`Failed to update cohort event ${id}.`)
      }
      return data
    }
    catch (error) {
      console.error('Error in updateCohortEvent:', error)
      throw error
    }
  }

  
}

export const cohortEventService = new CohortEventService()

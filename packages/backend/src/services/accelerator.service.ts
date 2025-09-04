import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { AcceleratorApplication, ApplicationStatus } from '@base-project/shared'
import camelcaseKeys from 'camelcase-keys'

interface Participant {
    user_id: string;
    name: string;
    email: string;
}

export class AcceleratorService {
  private readonly tableName = 'accelerator_applications'
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

  //fetch all applications
  async getAllApplications(): Promise<AcceleratorApplication[]> {
    try{
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .order('createdAt', { ascending: true })

      if (error) {
        console.error('DB error fetching applications:', error)
        throw new Error('Failed to fetch applications from database.')
      }
      return data || []
    }
    catch(error)
    {
      console.error('Error in getAllApplications:',error);
      throw error;
    }
  }


    //fetch all applications by cohort
  async getApplicationsByCohort(cohortId:string): Promise<AcceleratorApplication[]> {
    try{
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .eq('cohort_id', cohortId)
        .order('created_at', { ascending: true })
        
      if (error) {
        console.error('DB error fetching applications for cohort:', error)
        throw new Error('Failed to fetch applications for cohorts from database.')
      }
      return (data || []).map(row => 
        camelcaseKeys(row, { deep: true })) as unknown as AcceleratorApplication[]
    }
    catch(error)
    {
      console.error('Error in getApplicationsByCohort:',error);
      throw error;
    }
  }

async getApplicationsNamesByCohortId(cohortId: string): Promise<Participant[]> {
    try {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select(`
                user_id,
                users: user_id (username, email)
            `)
            .eq('cohort_id', cohortId);

        if (error) {
            throw new Error(error.message);
        }

        return data.map((item: any) => ({
            user_id: item.user_id,
            name: item.users.username,
            email: item.users.email
        })) as Participant[];
    } catch (error) {
        console.error('Error in getApplicationsNamesByCohortId:', error);
        throw error;
    }
}



  //fetch an application by id
  async getApplicationById(id: string): Promise<AcceleratorApplication | null> {
    try{
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
            return null; 
        }
        console.error('DB error fetching application:', error)
        throw new Error('Failed to fetch application from database');
      }
      return data;
    }
    catch(error){
      console.error('Error in getApplicationById:', error);
      throw error;
    }
  }

// create new applications
async submitApplication(input: { userIds: string[], cohortId: string }): Promise<AcceleratorApplication[]> {
  try {
    // check the current participants and max participants
    const { data: cohortData, error: cohortError } = await this.getClient()
      .from('cohort')
      .select('current_participants, max_participants')
      .eq('id', input.cohortId)
      .single();

    if (cohortError || !cohortData) {
      console.error('DB error fetching cohort:', cohortError);
      throw new Error('Failed to fetch cohort data');
    }
    const currentParticipants = cohortData.current_participants;
    const maxParticipants = cohortData.max_participants;

    // confirm that the current participants is smaller than max participants
    if (currentParticipants + input.userIds.length > maxParticipants) {
      throw new Error('Cannot add more participants than the maximum allowed');
    }

    // add the participants to applications
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .insert(input.userIds.map(participant => ({
        user_id: participant,
        cohort_id: input.cohortId,
        application_data: {}
      })))
      .select();

    if (error) {
      console.error('DB error submitting application:', error);
      throw new Error('Failed to submit application');
    }

    // update the current participants in cohorts
    const updatedCurrentParticipants = currentParticipants + input.userIds.length;
    await this.getClient()
      .from('cohort')
      .update({ current_participants: updatedCurrentParticipants })
      .eq('id', input.cohortId);

    return data!;
  } catch (e) {
    console.error('Error in submitApplication:', e);
    throw e;
  }
}


//update an application details by id
  async updateApplication(id: string, updates: Partial<AcceleratorApplication>): Promise<AcceleratorApplication | null> {
    try {
      const payload={...updates, updatedAt: new Date()}
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .update(payload)        
        .eq('id', id)                
        .single()                      

      if (error) {
        console.error(`DB error updating application ${id}:`, error)
        throw new Error(`Failed to update application ${id}.`)
      }
      return data
    }
    catch (error) {
      console.error('Error in updateCohort:', error)
      throw error
    }
  }

  //update a status application to be approved
  async approveApplication(id: string,adminId: string ): Promise<AcceleratorApplication> {
    try {
      const now = new Date()
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .update({
          status: ApplicationStatus.APPROVED,
          approvedAt: now,
          approvedBy: adminId,
          updatedAt: now
        })
        .eq('id', id)
        .single()

      if (error) {
        console.error('DB error approving application:', error)
        throw new Error('Failed to approve application')
      }
      return data!
    } catch (e) {
      console.error('Error in approveApplication:', e)
      throw e
    }
  }

   //update a status application to be rejected
  async rejectApplication(id: string,reason: string,adminId: string): Promise<AcceleratorApplication> {
    try {
      const now = new Date()
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .update({
          status: ApplicationStatus.REJECTED,
          rejectionReason: reason,
          approvedBy: adminId,
          updatedAt: now
        })
        .eq('id', id)
        .single()

      if (error) {
        console.error('DB error rejecting application:', error)
        throw new Error('Failed to reject application')
      }
      return data!
    } catch (e) {
      console.error('Error in rejectApplication:', e)
      throw e
    }
  }
}

export const acceleratorService = new AcceleratorService()

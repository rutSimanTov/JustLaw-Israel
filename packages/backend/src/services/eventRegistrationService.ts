import { EventRegistration } from '@base-project/shared/src/models/EventRegistration'
import { camelToSnake, snakeToCamel } from '../utils/convertCase'
import snakecaseKeys from "snakecase-keys";
import { supabase } from './supabaseClient';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';
export class EventRegistrationService {
    private readonly tableName = 'event_registrations';
    private supabase: SupabaseClient | null = null;
    private getClient(): SupabaseClient {
        if (!this.supabase) {
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
            if (!supabaseUrl || !supabaseKey) {
                throw new Error('Missing Supabase configuration. Please check your environment variables.')
            }
            this.supabase = createClient(supabaseUrl, supabaseKey);
        }
        return this.supabase;
    }
    canInitioalize(): boolean {
        return this.getClient() != null;
    }
    async getAll(): Promise<EventRegistration[]> {
        try {
            const { data, error } = await this.getClient()
                .from(this.tableName)
                .select("*");
            if (error) {
                console.error('DB error fetching attendance:', error)
                throw new Error('Failed to fetch attendance')
            }
            return data || [];
        } catch (error) {
            console.error('Error in getEventAttendance:', error);
            throw error;
        }
    }

    //fetch all registered by eventId
    async getRegisteredByEvent(eventId: string): Promise<EventRegistration[]> {
        try {
            const { data, error } = await this.getClient()
                .from(this.tableName)
                .select('*')
                .eq('event_id', eventId)

            if (error) {
                console.error('DB error fetching registered for event:', error)
                throw new Error('Failed to fetch registered for event from database.')
            }
            return (data || []).map(row => camelcaseKeys(row, { deep: true })) as unknown as EventRegistration[]
        }
        catch (error) {
            console.error('Error in getRegisteredByEvent:', error);
            throw error;
        }
    }


    async getByUserId(userId: string): Promise<EventRegistration[]> {
        const d = new Date();
        const upperBound = new Date(d);
        upperBound.setDate(d.getDate() + 30)
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq('user_id', userId);
        if (error) {
            console.error("Error fetching event registrations:", error);
            throw new Error("❌ Failed to fetch event registrations");
        }
        if (!data || data.length == 0) {
            console.warn("⚠️ No event registrations found for user:", userId, " within the next 30 days.");
            return [];
        }
        const camelData = (data || []).map(snakeToCamel) as EventRegistration[];
        console.log("✔️ Fetched event registrations:", camelData);
        return camelData;
    }

    async add(registration: EventRegistration): Promise<EventRegistration> {
        const payload = snakecaseKeys(registration as unknown as Record<string, unknown>, { deep: true })
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .insert(payload)
            .select()
            .single();
        if (error) throw error;
        return snakeToCamel(data) as EventRegistration;
    }

        async delete(id: string): Promise<EventRegistration | null> {
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .delete()
            .eq('event_id', id)
            .select();
        if (error) throw error;
        return data ? snakeToCamel(data) as EventRegistration : null;
    }
    async update(id: string, registration: EventRegistration): Promise<EventRegistration | null> {
        const payload = snakecaseKeys(registration as unknown as Record<string, unknown>, { deep: true });
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .update(payload)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data ? snakeToCamel(data) as EventRegistration : null;
    }
// create new event registrations
async submitRegistrations(input: { userIds: string[], eventId: string }): Promise<EventRegistration[]> {
  try {
    const now = new Date().toISOString();
    const payload = input.userIds.map(userId => ({
      event_id: input.eventId,
      user_id: userId,
      registered_at: now,
      attendance_status: 'registered',
    }));
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .insert(payload)
      .select();
    if (error) {
      console.error('DB error submitting registrations:', error);
      throw new Error('Failed to submit registrations');
    }
    const camelData = (data || []).map(snakeToCamel) as EventRegistration[];
    return camelData;
  } catch (e) {
    console.error(':x: Error in submitRegistrations:', e);
    throw e;
  }
}
async deleteByEventId(eventId: string): Promise<number> {
  const { data, error } = await this.getClient()
    .from(this.tableName)
    .delete()
    .eq('event_id', eventId)
    .select('*'); // מחזיר את הרשומות שנמחקו בפועל

  if (error) {
    console.error('DB error deleting registrations by eventId:', error);
    throw new Error('Failed to delete registrations by eventId');
  }

  return data?.length || 0;
}


}
export const eventRegistrationService = new EventRegistrationService();
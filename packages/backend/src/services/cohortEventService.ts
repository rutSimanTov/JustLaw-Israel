import { snakeToCamel } from "../utils/convertCase";
import { CohortEvent } from "@base-project/shared/src/models/CohortEvent"
import snakecaseKeys from "snakecase-keys";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class CohortEventService {
    private readonly tableName = 'cohort_events';
    private supabase: SupabaseClient | null = null;
    private getClient(): SupabaseClient {
        if (!this.supabase) {
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
            if (!supabaseUrl || !supabaseKey) {
                throw new Error('❌ Missing Supabase configuration. Please check your environment variables.')
            }
            this.supabase = createClient(supabaseUrl, supabaseKey);
        }
        return this.supabase;
    }

    canInitioalize(): boolean {
        return this.getClient() != null;
    }

    async getAll(): Promise<CohortEvent[]> {
        try {
            const { data, error } = await this.getClient()
                .from(this.tableName)
                .select("*");
            if (error) {
                console.error('❌ Error fetching cohort events:', error);
                throw error;
            }
            if (!data || data.length == 0) {
                console.warn("⚠️ No cohort events found.");
            }
            const camelData = (data || []).map(snakeToCamel) as CohortEvent[];
            return camelData;
        } catch (err) {
            console.error('❌ Error in getAll:', err);
            throw err;
        }

    }

    async getById(id: string): Promise<CohortEvent | null> {
        const d = new Date();
        const d2 = new Date(d);
        d2.setDate(d.getDate() + 30);
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .select("*")
            .eq('id', id)
            .gte('start_time', d.toISOString())
            .lt('start_time', d2.toISOString())
            .single();
        if (data == null || data.length == 0) {
            console.warn("⚠️ No cohort event found with id:", id);
            return null;
        }
        if (error) {
            console.error('❌ Error fetching cohort event:', error);
            throw error;
        }

        return snakeToCamel(data) as CohortEvent | null;
    }
    async add(cohortEvent: CohortEvent): Promise<CohortEvent> {
        // ✅ מוסיפים 3 שעות לזמנים לפני ההמרה ל-UTC
        const offsetMs = 3 * 60 * 60 * 1000;

        const adjustedEvent = {
            ...cohortEvent,
            startTime: new Date(new Date(cohortEvent.startTime).getTime() + offsetMs).toISOString(),
            endTime: new Date(new Date(cohortEvent.endTime).getTime() + offsetMs).toISOString(),
            // createdAt: new Date(Date.now() + offsetMs).toISOString(),
        };

        const payload = snakecaseKeys(adjustedEvent as unknown as Record<string, unknown>, { deep: true });

        const { data, error } = await this.getClient()
            .from(this.tableName)
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('❌ Error adding cohort event:', error);
            throw error;
        }
        console.log(data);

        return snakeToCamel(data) as CohortEvent;
    }

    async delete(id: string, accessToken?: string): Promise<CohortEvent> {
        // שליפת האירוע לצורך גישה ל-googleEventId
        const event = await this.getById(id);
        if (!event) {
            throw new Error(`:x: Event with ID ${id} not found.`);
        }
        const googleEventId = event.googleEventId;
        try {
            // מחיקת האירוע מיומן Google (אם יש googleEventId וטוקן)
            if (googleEventId && accessToken) {
                await fetch(`http://localhost:3001/api/access-calendar-events/calendar-events/${googleEventId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            }
            // מחיקת ההרשמות לאירוע
            await fetch(`http://localhost:3001/api/eventsregistration/delete-by-event/${id}`, {
                method: 'DELETE'
            });
        } catch (err) {
            console.error(':warning: External deletion failed:', err);
            // ממשיכים למחיקה ב-DB גם אם יש שגיאה חיצונית
        }
        // מחיקה מ-Supabase
        const { data, error } = await this.getClient()
            .from(this.tableName)
            .delete()
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('❌ Error deleting cohort event:', error);
            throw error;
        }
        return snakeToCamel(data) as CohortEvent;
    }

    async update(id: string, cohortEvent: CohortEvent): Promise<CohortEvent> {
        const offsetMs = 3 * 60 * 60 * 1000;
        // const end_time = new Date(new Date(cohortEvent.endTime).getTime() - offsetMs).toISOString();
        // const start_time = new Date(new Date(cohortEvent.startTime).getTime() - offsetMs).toISOString()
        // console.log("start_time: ", cohortEvent.startTime, "end_time: ", cohortEvent.endTime);
        // console.log("UTC+3: start_time: ", start_time, "end_time: ", end_time);
        const adjustedEvent = {
            ...cohortEvent,
            startTime: new Date(new Date(cohortEvent.startTime).getTime() + offsetMs).toISOString(),
            endTime: new Date(new Date(cohortEvent.endTime).getTime() + offsetMs).toISOString(),
            updatedAt: new Date(Date.now() + offsetMs).toISOString(),
        };

        const payload = snakecaseKeys(adjustedEvent as unknown as Record<string, unknown>, { deep: true });

        const { data, error } = await this.getClient()
            .from(this.tableName)
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("❌ Error updating cohort event ", id, ": ", error);
            throw error;
        }

        return snakeToCamel(data) as CohortEvent;
    }
}

export const cohortEventService = new CohortEventService();
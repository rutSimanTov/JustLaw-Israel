import { createClient } from '@supabase/supabase-js';
import { UUID } from 'crypto';
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const EVENTS = 'cohort_events';
const USER_AT_EVENTS = 'event_registrations';

export async function getAllUserEvent(id: UUID) {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: registrations, error: regError } = await supabaseAdmin
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', id);
    if (regError) {
        console.error('Error fetching registrations:', regError);
        throw regError;
    }
    const eventIds = registrations?.map(r => r.event_id) || [];
    if (eventIds.length === 0) return null;

    const nowUtc = new Date().toISOString(); // always UTC
    const endOfDayUtc = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        23, 59, 59
    )).toISOString();

    const { data: events, error } = await supabaseAdmin
        .from('cohort_events')
        .select('*')
        .in('id', eventIds)
        .gte('start_time', nowUtc) // from now UTC
        .order('start_time', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        throw error;
    }

    return events && events.length > 0 ? events : null;
}

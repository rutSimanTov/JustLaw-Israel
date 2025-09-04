import { useEffect, useState,useCallback  } from 'react';
import { ApiResponse, Cohort, CohortEvent } from '@base-project/shared';
import { fetchPastEventsDetails,fetchRegisteredByEvent,addRegisteredToEvent } from '../services/eventService';
import {cohortEventApi} from '../services/cohortEventApi'
import { EventRegistration } from '@base-project/shared/src';

export interface CohortWithEvents {
  cohort: Cohort; 
  events: CohortEvent[];
}

//fetch past events details for current active cohort
export function usePastEvents() {
  const [events, setEvents] = useState<CohortEvent[] | null>(null);
  const [cohort, setCohort]=useState<Cohort|null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
useEffect(() => {
    setLoading(true);
    fetchPastEventsDetails()
      .then((res: ApiResponse<CohortWithEvents>) => {
        if (!res.success) {
          throw new Error(res.error ?? 'Unknown server error');
        }
        setEvents(res.data?.events!);
        setCohort(res.data?.cohort!)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
},[])
  return { events,cohort, loading, error };
}


//fetch registered participants for an event by eventId
export function useEventsRegisteredByEvent(eventId:string) {
  const [data, setData] = useState<EventRegistration[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if(eventId){
      setLoading(true);
      fetchRegisteredByEvent(eventId!)
        .then(participants => setData(participants))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
      }
    }, [eventId]);

  return { data, loading, error };
}


//add participants to event by users ids and event id
export function useAddParticipantsToEvent(eventId:string) {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<boolean>(false);

  const addParticipants = useCallback(async ( eventId:string,userIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
    await addRegisteredToEvent(eventId, userIds);
      setData(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { addParticipants, isLoading, error, data };
}


//delete event
export function useDeleteEvent(eventId:string) {
  const [data, setData] = useState<CohortEvent[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if(eventId){
      setLoading(true);
      cohortEventApi.deleteEvent(eventId!)
        .then(participants => setData(participants))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
      }
    }, [eventId]);

  return { data, loading, error };
}

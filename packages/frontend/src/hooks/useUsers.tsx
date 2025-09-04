import { useState, useEffect,useCallback } from 'react';
import { User } from '@base-project/shared/src';
import { fetchUsers,addParticipantsToCohort ,fetchApplicationsByCohort,fetchApplicationsDetailsByCohort,fetchUserRoleByEmail} from '../services/participantService';
import { AcceleratorApplication } from '@base-project/shared';

interface Participant {
    user_id: string;
    name: string;
    email: string;
}

export type {Participant}
//fetch users
export function useUsers() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(users => setData(users))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

//add participants to a cohort by users ids and cohort id
export function useAddParticipants() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<boolean>(false);

  const addParticipants = useCallback(async (cohortId: string, userIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
    await addParticipantsToCohort(cohortId, userIds);
      setData(true);
    } catch (e: any) {
      setError(e?.response?.data?.error!||e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { addParticipants, isLoading, error, data };
}


//fetch applications by cohort
export function useApplicationsByCohort(cohortId:string) {
  const [data, setData] = useState<AcceleratorApplication[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if(cohortId){
      setLoading(true);
      fetchApplicationsByCohort(cohortId!)
        .then(applications => setData(applications))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
      }
    }, [cohortId]);

  return { data, loading, error };
}

interface Participant {
    user_id: string;
    name: string;
    email:string;
}

//fetch applications by cohort
export function useApplicationsDetailsByCohort(cohortId:string) {
  const [data, setData] = useState<Participant[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if(cohortId){
      setLoading(true);
      fetchApplicationsDetailsByCohort(cohortId!)
        .then(applications => setData(applications))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
      }
    }, [cohortId]);

  return { data, loading, error };
}

//fetch user role by email
export function useUserRoleByEmail(email:string) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if(email){
      setLoading(true);
      fetchUserRoleByEmail(email!)
        .then(data => setRole(data))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
      }
    }, [email]);

  return { role, loading, error };
}
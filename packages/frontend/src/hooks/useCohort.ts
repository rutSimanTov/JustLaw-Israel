// packages/frontend/hooks/useCohortDetails.ts
import { useEffect, useState,useCallback  } from 'react';
import { Cohort, CohortResponse,CohortsResponse } from '@base-project/shared';
import { fetchCohortDetails,NewCohort, createCohort as apiCreate,fetchCohorts } from '../services/cohortService';

//fetch cohort details by cohort id
export function useCohortDetails(id: string) {
  const [data, setData] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(id)
    {
    setLoading(true);
    fetchCohortDetails(id)
      .then((res: CohortResponse) => {
        if (!res.success) {
          throw new Error(res.error ?? 'Unknown server error');
        }
        setData(res.data!);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
    }
  }, [id]);

  return { data, loading, error };
}

//create cohort
export function useCreateCohort() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Cohort | null>(null);

  const create = useCallback(async (input: NewCohort) => {
    setLoading(true);
    setError(null);
    apiCreate(input)
    .then((res:CohortResponse)=>{
      if (!res.success) 
        throw new Error(res.error || 'unknown server error');
      setData(res.data!);
    })
    .catch((e: any) => setError(e.message))
    .finally(() => setLoading(false));
  }, []);

  return { create, isLoading, error, data };
}

//fetch all active cohorts
export function useCohorts() {
  const [data, setData] = useState<Cohort[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    setLoading(true);
    fetchCohorts()
      .then((res: CohortsResponse) => {
        if (!res.success) {
          throw new Error(res.error ?? 'Unknown server error');
        }
        setData(res.data?.items!);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
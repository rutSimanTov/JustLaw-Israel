import { Cohort } from "@base-project/shared/src/models/Cohort";
import snakecaseKeys from "snakecase-keys";
import { update } from "../controllers/profileController";
import { snakeToCamel } from "../utils/convertCase";
import { supabase } from "./supabaseClient";

export const cohortService = {
    getAll: async () => {
        // try {
        const { data, error } = await supabase.from('cohort').select('*');
        if(error){
            console.error('Error fetching cohorts:', error);
            throw error;
        }
        const camelData = (data || []).map(snakeToCamel) as Cohort[];
        return camelData;
        // } catch (error) {
        //     console.error('Error fetching cohorts:', error);
        //     throw error;
        // }
    },
    add: async (cohort: Cohort) => {
        try {
            const payload = snakecaseKeys(cohort as unknown as Record<string, unknown>, { deep: true });
            const { data, error } = await supabase
                .from('cohort')
                .insert(payload)
                .select()
                .single();
            return data ? snakeToCamel(data) as Cohort : null;
        } catch (error) {
            console.error('Error adding cohort:', error);
            throw error;
        }
    },
    delete: async (id: string) => {
        const { data, error } = await supabase
            .from('cohort')
            .delete()
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error deleting interview cohort:', error);
            throw error;
        }
        return data ? snakeToCamel(data) as Cohort : null;
    },
    update: async (id: string, cohort: Cohort) => {
        const payload = snakecaseKeys(cohort as unknown as Record<string, unknown>, { deep: true })
        const { data, error } = await supabase
            .from('cohort')
            .update(payload)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            console.error('Error updating interview cohort:', error);
            throw error;
        }
        return data ? snakeToCamel(data) as Cohort : null;
    }
}
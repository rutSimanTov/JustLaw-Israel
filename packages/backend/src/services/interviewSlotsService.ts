import { snakeToCamel } from "../utils/convertCase";
import { InterviewSlot } from "@base-project/shared/src/models/InterviewSlot";
import { supabase } from "./supabaseClient";
import snakecaseKeys from "snakecase-keys";

// export const interviewSlotsService = {
//     getAll: async () => {
//         const { data, error } = await supabase.from('interview_slots').select('*');
//         if (error) {
//             console.error('Error fetching interview slots:', error);
//             throw error;
//         }
//         const camelData = (data || []).map(snakeToCamel) as InterviewSlot[];
//         return camelData;
//     },
//     add: async (slot: InterviewSlot) => {
//         // const payload = snakecaseKeys(registration as unknown as Record<string, unknown>, { deep: true })
//         const payload = snakecaseKeys(slot as unknown as Record<string, unknown>, { deep: true });
//         const { data, error } = await supabase
//             .from('interview_slots')
//             .insert(payload)
//             .select()
//             .single();
//         if (error) {
//             console.error('Error adding interview slot:', error);
//             throw error;
//         }
//         return data ? snakeToCamel(data) as InterviewSlot : null;
//     },
//     delete: async (id: string) => {
//         const { data, error } = await supabase
//             .from('interview_slots')
//             .delete()
//             .eq('id', id)
//             .select()
//             .single();
//         if (error) {
//             console.error('Error deleting interview slot:', error);
//             throw error;
//         }
//         return data ? snakeToCamel(data) as InterviewSlot : null;
//     },
//     update: async (id: string, slot: InterviewSlot) => {
//         const payload = snakecaseKeys(slot as unknown as Record<string, unknown>, { deep: true });
//         const { data, error } = await supabase
//             .from('interview_slots')
//             .update(payload)
//             .eq('id', id)
//             .select()
//             .single();
//         if (error) {
//             console.error('Error updating interview slot:', error);
//             throw error;
//         }
//         return data ? snakeToCamel(data) as InterviewSlot : null;
//     }
// }
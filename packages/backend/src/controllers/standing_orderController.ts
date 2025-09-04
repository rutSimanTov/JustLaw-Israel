import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { standing_order, typeDonation } from '@base-project/shared/dist/models/donations';

const now = new Date();
const isoDate = now.toISOString(); // המרת התאריך לפורמט ISO




//קונטרולר לעדכון תרומה בהוראת קבע
 export const updateActualTimes = async (req: Request, res: Response) => {
    const { standing_order_id } = req.params;
    try {
        // קודם כל, נקבל את הערך הנוכחי של actual_times
        const { data: standingOrder, error: fetchError } = await supabase
            .from('standing_order')
            .select('actual_times')
            .eq('standing_order_id', standing_order_id) // הנחתי שהמזהה של הוראת הקבע הוא 'id'
            .single();

        if (fetchError) {
        
            return res.status(400).json({ error: "standing_order is not defind" });
    }
        // אם לא נמצא, נחזיר שגיאה
        if (!standingOrder) return res.status(404).json({ error: 'Standing order not found' });

        // עדכון actual_times לפלוס 1
        const updatedActualTimes = standingOrder.actual_times + 1;

        const { data, error } = await supabase
            .from('standing_order')
            .update({ actual_times: updatedActualTimes })
            .eq('standing_order_id', standing_order_id)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json("standing order updated successfully");
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

//קונטרולר לעדכון כל ההוראות קבע שעברו להם התאריך ללא פעילות
 export const updateStandingOrders = async (req: Request, res: Response) => {
    try {
        // קבלת התאריך הנוכחי
        const now = new Date();
        const isoDate = now.toISOString(); // המרת התאריך לפורמט ISO

        // עדכון כל ההוראות קבע שעברו להם התאריך ללא פעילות
        const { data, error } = await supabase
            .from('standing_order')
            .update({ is_active: false })
            .lte('end_date', isoDate) // בודק שהתאריך סיום עבר
            .select('*');

        if (error) {
            console.error('Error updating standing orders:', error);
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
 }


 //קונטרולר לביטול הוראת קבע
 export const cancelStandingOrder= async (req: Request, res: Response) => {
    const {donor_email}=req.params
    try {
        // בדיקת קיום תורם
        const { data: donorData, error: donorError } = await supabase
            .from('donors')
            .select('donor_id')
            .eq('donor_email', donor_email)
            .maybeSingle();

        if (donorError) {
            return res.status(400).json({ error: donorError.message });
        }

        if (!donorData) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        //קבלת כל המזההים של ההוראות קבע של התורם ע"פ שדה type
        const { data: standingOrders, error: standingOrderError } = await supabase
            .from('donations')
            .select(`standing_order_id,
                standing_order (
                    standing_order_id,
                    start_date,
                    end_date,
                    day_in_month,
                    is_active,
                    several_times
                )
                `)
            .eq('donor_id', donorData.donor_id)
            .eq('type', typeDonation['recurring'])
            .gt('standing_order.end_date', isoDate) 
            .not('standing_order', 'is', null);
        if (standingOrderError) {
            return res.status(400).json({ error: standingOrderError.message });
        }
        if (!standingOrders || standingOrders.length === 0) {
            return res.status(404).json({ error: 'No standing orders found for this donor' });
        }
        if( standingOrders){
          //עדכון שההוראת קבע נגמרה 
            const { data, error } = await supabase
                .from('standing_order')
                .update({end_date: new Date() }) // עדכון התאריך סיום להיום
                .in('standing_order_id', standingOrders.map(order => order.standing_order_id));

            if (error) {
                console.error('Error updating standing orders:', error);
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json({ message: 'Standing orders cancelled successfully', data });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}







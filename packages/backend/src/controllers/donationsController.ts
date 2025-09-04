
import { supabase } from '../services/supabaseClient'
import { Request, Response } from 'express';

import { typeDonation  } from '@base-project/shared/dist/models/donations';

 
// קונטרולר לקבלת  כל התרומות
export const getAllDonations = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('donations')
            .select(`
                *,
                standing_order (
                    standing_order_id,
                    start_date,
                    end_date,
                    day_in_month,
                    is_active,
                    several_times,
                    actual_times
                )
            `);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



// קונטרולר לעדכון תרומה קיימת לפי מזהה תרומה
export const updateDonation = async (req: Request, res: Response) => {
    const { donation_id } = req.params;
    const updates = req.body;
    if( 'donor_id' in updates || 'type' in updates||'standing_order_id' in updates )
        return res.status(400).json({ error: 'donor_id, type and standing_order_id cannot be updated' });
    try {
        const { data, error } = await supabase
            .from('donations')
            .update(updates)
            .eq('donation_id', donation_id)
            .single();
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// קונטרולר למחיקת תרומה לפי מזהה תרומה
// אם התרומה היא הוראת קבע, נמחק גם את ההוראה
export const deleteDonation = async (req: Request, res: Response) => {
    const { donation_id } = req.params;

    try {
        // שליפת התרומה כדי לבדוק אם היא recurring
        const { data: donation, error: fetchError } = await supabase
            .from('donations')
            .select('type, standing_order_id')
            .eq('donation_id', donation_id)
            .maybeSingle();

        if (fetchError) return res.status(400).json({ error: fetchError.message });
        if (!donation) return res.status(404).json({ error: 'Donation not found' });

        // מחיקת התרומה עצמה
        const { error: deleteDonationError } = await supabase
            .from('donations')
            .delete()
            .eq('donation_id', donation_id);

        if (deleteDonationError) return res.status(400).json({ error: deleteDonationError.message });
console.log(donation.standing_order_id,donation.type,(donation.standing_order_id));
        // אם זו תרומה בהוראת קבע – מוחקים גם את ההוראה
        if (donation.type == typeDonation['recurring'] && donation.standing_order_id) {
            console.log(`Deleting standing order with ID: ${donation.standing_order_id}`);
            const { error: deleteStandingError } = await supabase
                .from('standing_order')
                .delete()
                .eq('standing_order_id', donation.standing_order_id);

            if (deleteStandingError) return res.status(400).json({ error: deleteStandingError.message });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};







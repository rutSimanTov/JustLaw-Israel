import { log } from "console";
import { supabase } from "../services/supabaseClient";
import { Request, Response } from 'express';

// קונטרולר לקבלת תורמים
export const getDonors = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('donors')
            .select('*');

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

//קונטרולר לקבלת תורם לפי דוא"ל
export const getDonorByEmail = async (req: Request, res: Response) => {
    const donor_email = req.params.donor_email;

    try {
        const { data, error } = await supabase
            .from('donors')
            .select('*')
            .eq('donor_email', donor_email)
            .maybeSingle();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Donor not found' });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// קונטרולר לעדכון תורם לפי דוא"ל
// אם מתבצע ניסיון לעדכן את המייל, בודק אם המייל כבר קיים אצל תורם אחר
// אם המייל קיים, מחזיר שגיאה
export const updateDonor = async (req: Request, res: Response) => {
    const { donor_email } = req.params;
    const updates = req.body;

    console.log(`Updating donor with email: ${donor_email} with updates:`, updates);
if ('donor_id' in updates || 'is_anonymous' in updates
)
    return res.status(400).json({ error: 'donor_id and is_anonymous cannot be updated' });
    try {
        // אם מתבצע ניסיון לעדכן את המייל
        if (updates.donor_email) {
            // בדיקה אם המייל כבר קיים אצל תורם אחר
            const { data: existingDonor, error: existingError } = await supabase
                .from('donors')
                .select('donor_id')
                .eq('donor_email', updates.donor_email)
                .limit(1)
                .neq('donor_email', donor_email) // לוודא שזה לא אותו תורם
                .maybeSingle();

            if (existingError) {
                console.log('Error checking existing donor:', existingError);
                return res.status(400).json({ error: existingError.message });
            }

            if (existingDonor) {
                return res.status(400).json({ error: 'Email already exists in another donor' });
            }
        }

        // עדכון התורם
        const { data, error } = await supabase
            .from('donors')
            .update(updates)
            .eq('donor_email', donor_email)
            .single();

        if (error) return res.status(400).json({ error: 'Donor not found or update failed or no good update object' });

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



// קונטרולר למחיקת תורם אם אין לו תרומות או הוראות קבע
// אם יש לו תרומות או הוראות קבע, מחזיר שגיאה
export const deleteDonorIfNoRelationsByEmail = async (req: Request, res: Response) => {
    const { donor_email } = req.params;

    try {
        // שליפת donor_id לפי מייל
        const { data: donorData, error: fetchDonorError } = await supabase
            .from('donors')
            .select('donor_id')
            .eq('donor_email', donor_email)
            .maybeSingle();

        if (fetchDonorError) return res.status(400).json({ error: fetchDonorError.message });
        if (!donorData) return res.status(404).json({ error: 'Donor not found' });

        const donor_id = donorData.donor_id;

        // בדיקת תרומות
        const { count: donationsCount, error: donationsError } = await supabase
            .from('donations')
            .select('donation_id', { count: 'exact', head: true })
            .eq('donor_id', donor_id);

        if (donationsError) return res.status(400).json({ error: donationsError.message });
        if (donationsCount && donationsCount > 0) {
            return res.status(400).json({ error: 'Cannot delete donor with existing donations.' });
        }
        // מחיקת התורם
        const { error: deleteError } = await supabase
            .from('donors')
            .delete()
            .eq('donor_id', donor_id);

        if (deleteError) return res.status(400).json({ error: deleteError.message });

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

import { AddDonation, typeDonation } from "@base-project/shared/dist/models/donations";
import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient'
import { create } from "domain";


//פונקציה להוספת חודשים לתאריך
// פונקציה זו מקבלת תאריך ומספר חודשים ומחזירה את התאריך החדש
function addMonths(add:AddDonation, months: number | undefined): Date {
    const newDate = add.created_at ? new Date(add.created_at) : new Date();
    if (months)
        newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}




// קונטרולר להוספת תרומה
export const addDonation = async (req: Request, res: Response) => {
    try {
        const add = req.body as AddDonation;
        console.log(
            add
        );
        // בדיקת קיום תורם  
        let donor_id = null;
        if (add.donor_email || add.donor_name || add.is_anonymous) {
            //חיפוש תורם לפי דוא"ל 
            const { data: donorData, error: donorError } = await supabase
                .from('donors')
                .select('donor_id')
                .eq('donor_email', add.donor_email)
                .maybeSingle()

            if (donorError) {
                console.error('Error fetching donor:', donorError);
                return res.status(400).json({ error: donorError.message });
            }

            if (donorData) {
                donor_id = donorData.donor_id;
            } else {
                if(add.is_anonymous===undefined){
                    add.is_anonymous = false; // אם לא צוין, נניח שזה לא תורם אנונימי
                }
                //בדיקה האם שדות החובה של התורם מלאים
                if ((!add.donor_email || !add.donor_name) && !add.is_anonymous) {
                    const missingFields = [];
                    if (!add.donor_email) missingFields.push('add.donor_email');
                    if (!add.donor_name) missingFields.push('add.donor_name');
                    return res.status(400).json({ error: `Missing required donor information: ${missingFields.join(' and ')} is required unless the donor is anonymous.` });
                }
                // אם לא נמצא תורם, ניצור אחד חדש
                const { data: newDonor, error: newDonorError } = await supabase
                    .from('donors')
                    .insert([{ donor_name: add.donor_name, donor_email: add.donor_email, is_anonymous: add.is_anonymous }])
                    .select('donor_id')
                    .single();

                if (newDonorError) {
                    console.error('Error creating new donor:', newDonorError);
                    return res.status(400).json({ error: newDonorError.message });
                }

                donor_id = newDonor.donor_id;
                console.log('New donor created with ID:', donor_id);
            }
        }
        else {
            console.error('Missing donor information');
        }
        //הוספת תרומה עם פרטי התורם
        // בדיקת שדות חובה
        const requiredFields = [
            { key: 'amount', value: add.amount },
            { key: 'currency', value: add.currency },
            { key: 'type', value: add.type },
            { key: 'status', value: add.status },
            { key: 'payment_provider_id', value: add.payment_provider_id }
        ];
       if (add.type === typeDonation['recurring']) {
              console.log('recurring');

        requiredFields.push({ key: 'times', value: add.times ||1});
         requiredFields.push({ key: 'day_in_month', value: add.day_in_month||1 });
        if(add.day_in_month&&(add.day_in_month<1|| add.day_in_month>28)){
            return res.status(400).json({ error: 'day_in_month must be between 1 and 28.' });
        }
   
    }
        
        const missing = requiredFields.filter(f => f.value === null || f.value === undefined);
        if (missing.length > 0) {
            const missingKeys = missing.map(f => f.key).join(', ');
            return res.status(400).json({ error: `Missing required fields: ${missingKeys} are null or undefined.` });
        }

 
    

        //הוספת תרומה אם זה לא הוראת קבע
        if (add.type ===typeDonation['one-time']) {
            const { data, error } = await supabase
                .from('donations')
                .insert([{
                    donor_id,
                    amount: add.amount,
                    currency: add.currency,
                    type: add.type,
                    status: add.status,
                    payment_provider_id: add.payment_provider_id,
                    metadata: add.metadata,
                    created_at: add.created_at ? new Date(add.created_at):new Date()
                }]);

            if (error) {
                console.log('Supabase error:', error, data); // הוספת הדפסת השגיאה
                return res.status(400).json({ error: error.message });
            }
            return res.status(201).json("one-time donation added successfully");
        }
        else if (add.type === typeDonation['recurring']) {
            //הוספת תרומה אם זה הוראת קבע  

            //הוספה לטבלת הוראות קבע
            const { data, error } = await supabase
                .from('standing_order')
                .insert([{
                    start_date: add.created_at? add.created_at:new Date(),
                    end_date: addMonths(add,add.times),
                    several_times: add.times,
                    day_in_month: add.day_in_month
                }]).select('standing_order_id').single()
                ;

            if (error) {
                console.log('Supabase error:', error, data); // הוספת הדפסת השגיאה
                return res.status(400).json({ error: error.message });
            }
            const standing_order_id = data.standing_order_id;


            if (standing_order_id) {
console.log(`Standing order created with ID: ${standing_order_id}`); 
                // הוספת תרומה עם הוראת קבע
                const { data, error } = await supabase
                    .from('donations')
                    .insert([{
                        donor_id,
                        amount: add.amount,
                        currency: add.currency,
                        type: add.type,
                        status: add.status,
                        payment_provider_id: add.payment_provider_id,
                        metadata: add.metadata,
                        standing_order_id: standing_order_id,
                        created_at:add.created_at ? new Date(add.created_at):new Date()
                    }]);

                if (error) {
                    console.log('Supabase error:', error, data); // הוספת הדפסת השגיאה
                    return res.status(400).json({ error: error.message });
                }
                return res.status(201).json("recurring donation added successfully");
            }
            else {
                console.error('Standing order ID is null');
                return res.status(400).json({ error: 'Failed to create standing order' });
            }
        }

    } catch (error) {
        console.error('Internal Server Error:', error); // הוספת הדפסת שגיאה כללית
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
 const now = new Date();
    const isoDate = now.toISOString(); // המרת התאריך לפורמט ISO




    //קונטרולר לקבלת כל התרומות הפעילות 
    // בהוראת קבע עבור שימוש של pay pal
    //כולל פרטי התורם ופרטי הוראת הקבע
    export const getActiveRecurringDonations = async (req: Request, res: Response) => {
       
        try {
            const { data, error } = await supabase
                .from('donations')
                .select(`
                    donation_id,
                    
                    amount,
                    currency,
                    standing_order_id,
                     donor:donors (
                            donor_email,
                            donor_name
                        ),
                    standing_order (
                        start_date,
                        end_date,
                        day_in_month,
                        is_active,  
                        several_times
                    )
                        
                `)
                .eq('type', typeDonation['recurring'])
                .gt('standing_order.end_date', isoDate) // בודק שהתאריך סיום עדיין לא עבר
                .not('standing_order', 'is', null);
    
            if (error) {
                console.error('Error fetching active recurring donations:', error);
                return res.status(400).json({ error: error.message });
            }
            return res.status(200).json(data)
        } catch (error) {
            console.error('Internal Server Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
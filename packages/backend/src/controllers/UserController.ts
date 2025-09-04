import DOMPurify from 'dompurify';
import Joi from 'joi';
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// טען את משתני הסביבה
dotenv.config();

// אתחול Supabase
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const schema = Joi.object({
    title: Joi.string().max(100).required(),
    body: Joi.string().required(),
});

const saveContent = async (req: Request, res: Response): Promise<void> => {
    // סינון התוכן
    const dirtyBody = req.body.body;
    const cleanBody = DOMPurify.sanitize(dirtyBody);

    // אימות הקלט
    const { error, value } = schema.validate({
        title: req.body.title,
        body: cleanBody,
    });

    if (error) {
        console.error('Validation error details:', error.details);
        res.status(400).json({ message: 'Invalid input', details: error.details.map(err => err.message) });
        return; // פשוט יוצאים מהפונקציה, אין צורך להחזיר ערך
    }

    try {
        // שמירת התוכן בבסיס הנתונים באמצעות Supabase
        const { data, error: dbError } = await supabase
            .from('your_table_name') // החלף בשם הטבלה שלך
            .insert([{ title: value.title, body: value.body }]);

        if (dbError) {
            console.error('Database error details:', dbError.details);
            res.status(500).json({ message: 'Failed to save content to database', details: dbError.message });
            return; // יוצאים מהפונקציה במקרה של שגיאה
        }

        res.status(201).json({ message: 'Content saved successfully', content: data });
    } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = (error as Error).message; // Type assertion
    res.status(500).json({ message: 'An unexpected error occurred', details: errorMessage });
}

};

export { saveContent };

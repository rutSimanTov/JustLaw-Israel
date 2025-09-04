// src/utils/sendVerificationEmail.ts
import { sendEmail as existingSendEmail } from '../services/emailService'; // מייבא את פונקציית המייל הקיימת
import dotenv from 'dotenv';

dotenv.config();

/**
 * שליחת קוד אימות במייל
 * @param to - כתובת המייל
 * @param code - קוד אימות
 */
export async function sendVerificationCodeEmail(to: string, code: string): Promise<void> {
    const subject = 'Verification Code for Cancelling Standing Order';

    // טקסט פשוט למייל
    const text = `Hello! Your verification code for cancelling your standing order is: ${code}. This code is valid for 10 minutes.\n\nIf you did not request to cancel a standing order, please ignore this email.\n\nBest regards,\nThe Donations Team`;

    // HTML לא בשימוש, רק להמחשה:
    // const html = `
    //     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    //         <h2>Hello!</h2>
    //         <p>You received this email because you requested to cancel a standing order.</p>
    //         <p>Your verification code is: <strong>${code}</strong></p>
    //         <p>This code is valid for 10 minutes only.</p>
    //         <p>If you did not request to cancel, please ignore this email.</p>
    //         <p>Best regards,<br>The Donations Team</p>
    //     </div>
    // `;

    try {
        // שליחה דרך פונקציית המייל הקיימת
        await existingSendEmail(to, subject, text);
        console.log(`✅ Verification code successfully sent to ${to}`);
    } catch (error) {
        console.error('❌ Error sending verification code via existing function:', error);
        throw error;
    }
}

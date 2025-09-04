
// import nodemailer from 'nodemailer';

// //פונקציה ששולחת קוד אימות במייל
// export async function sendResetEmail(to: string, code: string) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   try { // <--- התחלת בלוק try
//     await transporter.sendMail({
//       from: `"JustLaw" <${process.env.EMAIL_USER}>`, // נשאר "JustLawIsrael" כי זו זהות השולח
//       to,
//       subject: 'Password Reset Code', // שונה לאנגלית
//       text: `Hello! Your password reset verification code is: ${code}. It is valid for 10 minutes.`, // שונה לאנגלית
//     });
//     console.log('Email sent successfully to:', to); // הודעת הצלחה
//   } catch (error) { // <--- התחלת בלוק catch
//     console.error('Failed to send email. Error details:', error); // הדפסת השגיאה המלאה
//     throw error; // זרוק את השגיאה מחדש
//   }
// }

import nodemailer from 'nodemailer'; // ייבוא ספריית nodemailer לשליחת מיילים.
import { generateReceiptHTML, generateReceiptPDF, ReceiptDetails } from './receipt';

import path from 'path';


// פונקציה ששולחת קוד אימות במייל
// הפונקציה אסינכרונית ומקבלת כתובת מייל (to) וקוד אימות (code).
export async function sendResetEmail(to: string, code: string) {
  // יצירת אובייקט טרנספורטר (אמצעי שינוע) באמצעות nodemailer.
  // הוא מוגדר לשלוח מיילים דרך שירות Gmail.
  const transporter = nodemailer.createTransport({
    service: 'gmail', // מוגדר להשתמש בשרתי Gmail.
    auth: {
      user: process.env.EMAIL_USER, // שם המשתמש למייל, נלקח ממשתני הסביבה (לדוגמה, כתובת המייל השולחת).
      pass: process.env.EMAIL_PASS, // הסיסמה של המשתמש, נלקחת ממשתני הסביבה (או סיסמת האפליקציה אם הוגדרה).
    },
  });

  try { // <--- התחלת בלוק try לטיפול בשגיאות.
    // שליחת המייל בפועל.
    await transporter.sendMail({
      from: `"JustLaw" <${process.env.EMAIL_USER}>`, // הגדרת שולח המייל, מופיע כ"JustLaw" עם כתובת המייל השולחת.
      to, // כתובת הנמען (המייל אליו יישלח קוד האימות).
      subject: 'Password Reset Code', // נושא המייל.
      text: `Hello! Your password reset verification code is: ${code}. It is valid for 10 minutes.`, // גוף המייל כטקסט פשוט, כולל את קוד האימות וזמן תוקפו.
    });
    // הודעה לקונסול במקרה של שליחה מוצלחת.
    console.log('Email sent successfully to:', to);
  } catch (error) { // <--- בלוק catch לטיפול בשגיאות שעלולות לקרות במהלך השליחה.
    // הודעת שגיאה לקונסול במקרה של כשלון בשליחה, עם פרטי השגיאה המלאים.
    console.error('Failed to send email. Error details:', error);
    throw error; // זריקת השגיאה מחדש כדי שתוכל להיות מטופלת ברמה גבוהה יותר בקוד אם יש צורך.
  }


}


export async function sendReceiptEmail(
  to: string,
  details: ReceiptDetails,
  asPdf: boolean = false
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const html = generateReceiptHTML(details);

  const mailOptions: any = {
    from: `"JustLawIsrael" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Donation Receipt',
    html,
    text: 'Thank you for your donation! Please find your receipt attached.',
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../../picture/logo.png'),
        cid: 'logo-img',
      },
    ],
  };

  if (asPdf) {
    const pdfBuffer = await generateReceiptPDF(details);
    mailOptions.attachments.push({
      filename: `receipt-${details.receiptNumber}.pdf`,
      content: pdfBuffer,
    });
    mailOptions.text = 'Thank you for your donation! Your receipt is attached as a PDF.';
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Receipt email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Failed to send receipt email. Error details:', error);
    throw error;
  }
}
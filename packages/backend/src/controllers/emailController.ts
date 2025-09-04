import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';

export const sendReportEmail = (req: Request, res: Response) => {
  const to = process.env.EMAIL_USER;
  const { category, text } = req.body;

  if (!category || !text) {
    console.error('❌ Missing category or text in request body:', req.body);
    return res.status(400).send({ error: 'Missing category or text' });
  }

  const subject = `Report on content type: ${category}`;
  const body = text;

  res.status(202).send({ message: 'Report received. Email is being sent.' });

  sendEmail(to!, subject, body)
    .then(() => {
      console.log(`✅ Report email sent to ${to} with subject: ${subject}`);
    })
    .catch(error => {
      console.error('❌ Failed to send report email:', error);
      console.error('Request body was:', req.body);
    });
};



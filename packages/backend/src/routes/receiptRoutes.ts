
// packages/backend/src/routes/receipt.ts
import { Router, Request, Response } from 'express';
import { sendReceiptEmail } from '../utils/email';

const router = Router();

async function handleSendReceipt(req: Request, res: Response) {
    try {
        const {
            donorEmail,
            donorName,
            amount,
            date,
            receiptNumber,
            transactionId,
            isAnonymous,
            currency,
            timeZone
        } = req.body;

        if (!donorEmail) {
            return res.status(400).json({ success: false, message: 'donorEmail is required' });
        }

        const allowedCurrencies = ['ILS', 'USD', 'EUR'];
        if (!allowedCurrencies.includes(currency)) {
            return res.status(400).json({ success: false, message: 'Invalid currency' });
        }

        await sendReceiptEmail(donorEmail, {
            donorName,
            amount: parseFloat(amount),
            date,
            receiptNumber,
            transactionId,
            isAnonymous,
            currency,
            timeZone
        }, true);

        res.json({ success: true, message: 'Receipt sent!' });
    } catch (error) {
        console.error('Error sending receipt email:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, error: message });
    }
}

router.post('/', handleSendReceipt);

export default router;

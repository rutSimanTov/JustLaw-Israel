// // packages/backend/src/utils/paypal.webhook.ts
import axios from 'axios';
import { Request, Response } from 'express';

export const handlePayPalWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    console.log('Received PayPal Webhook:', event.event_type);

    if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
      const subscriptionId = event.resource.id;
      console.log(`Subscription ${subscriptionId} was cancelled`);
    }

    if (event.event_type === 'PAYMENT.SALE.DENIED') {
      const subscriptionId = event.resource.billing_agreement_id;
      console.log(`Payment failed for subscription ${subscriptionId}`);
    }
    if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
      const saleId = event.resource.id;
      console.log(`Payment completed successfully for sale ${saleId}`);
      const subscriptionId = event.resource.billing_agreement_id;
      await axios.put(`http://localhost:3000/api/donations//updateActualTime/${subscriptionId}`);

    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.sendStatus(500);
  }
};

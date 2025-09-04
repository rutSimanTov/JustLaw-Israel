// // packages/backend/src/controllers/subscription.controller.ts
import { Request, Response } from 'express';
import {
  getAccessToken,
  createProduct,
  createPlan,
  createSubscription,
  cancelSubscription,
} from '../services/paypal.service';



export const createDonationSubscription = async (req: Request, res: Response) => {
  try {
    const { amount, currency, times, dateStart } = req.body;
    const accessToken = await getAccessToken();
    console.log('Access token:', accessToken);
    const productId = await createProduct(accessToken);
    const planId = await createPlan(accessToken, productId, amount, currency, times); 
    console.log('dateStart:', dateStart);
    const {subscriptionId, approvalUrl} = await createSubscription(planId, accessToken, dateStart);
    res.json({ subscriptionId: subscriptionId, approvalUrl: approvalUrl });
  
  } catch (error: any) {
    console.error("subscribe error:", error);
    res.status(500).json({ message: error.message || "Subscription failed" });
  }
};

export const cancelDonationSubscription = async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.body;
    const accessToken = await getAccessToken();
    await cancelSubscription(subscriptionId, accessToken);
    res.status(200).json({ message: 'Subscription cancelled' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

import express from 'express';
import {
  createDonationSubscription,
  cancelDonationSubscription,
  // createSubscriptionPlan,
} from '../controllers/subscription.controller';

const router = express.Router();

// router.post("/create-plan", createSubscriptionPlan);
router.post('/subscribe', createDonationSubscription);
router.post('/cancel', cancelDonationSubscription);

export default router;

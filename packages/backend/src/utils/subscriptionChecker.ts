// packages/backend/src/utils/subscriptionChecker.ts
// This utility checks for expired subscriptions and cancels them if necessary
import axios from 'axios';
import { cancelSubscription } from "../services/paypal.service";


export const checkAndCancelExpiredSubscriptions = async () => {
    try {
        const now = new Date();
        // Retrieve recurring activity donations by calling the existing API
        const { data: activeSubs } = await axios.get('http://localhost:3000/api/donations//getActiveRecurringDonations');

        for (const sub of activeSubs) {
            const { created_at, payment_provider_id, standing_order } = sub;
            const times = standing_order?.several_times;

            if (!created_at || !times || !payment_provider_id || !standing_order?.standing_order_id) continue;

            const startDate = new Date(created_at);
            const monthsPassed =
                (now.getFullYear() - startDate.getFullYear()) * 12 +
                now.getMonth() - startDate.getMonth();

            if (monthsPassed >= times) {
                console.log(`🔔 Cancelling subscription ${payment_provider_id} after ${monthsPassed} months`);

                try {
                    await cancelSubscription(payment_provider_id);
                    // Call to the API that marks the standing order as completed
                    await axios.put(`http://localhost:3000/api/donations/cancelStandingOrder/${standing_order.donor_email}`);

                    console.log(`✅ Marked standing_order ${standing_order.standing_order_id} as inactive`);
                } catch (err) {
                    console.error(`❌ Failed to cancel subscription ${payment_provider_id}`, err);
                }
            }
        }
    } catch (err) {
        console.error('❌ Failed to fetch active subscriptions or process them:', err);
    }
};

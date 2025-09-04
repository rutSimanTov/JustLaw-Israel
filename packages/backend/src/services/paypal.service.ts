// packages/backend/src/services/paypal.service.ts
import axios from 'axios';
import { number } from 'joi';

const PAYPAL_API = process.env.PAYPAL_API_BASE_URL;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

export async function getAccessToken(): Promise<string> {
  console.log('Getting PayPal access token...');
  const response = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  console.log('Access token received', response.data.access_token);
  return response.data.access_token;
}

export async function createProduct(accessToken: string): Promise<string> {
  console.log('Creating PayPal product...');
  const response = await axios.post(
    `${PAYPAL_API}/v1/catalogs/products`,
    {
      name: 'Recurring Donation',
      description: 'Donation product',
      type: 'SERVICE',
      category: 'CHARITY',
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('Product created:', response.data.id);
  return response.data.id;
}

export async function cancelSubscription(subscriptionId: string, accessToken?: string): Promise<void> {
  try {
    const token = accessToken || await getAccessToken();

    console.log(`🔄 Cancelling PayPal subscription ${subscriptionId}...`);

    await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      { reason: "Cancelled after end of scheduled months" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Subscription ${subscriptionId} cancelled successfully.`);
  } catch (error: any) {
    const message = error.response?.data || error.message;
    console.error(`❌ Failed to cancel subscription ${subscriptionId}:`, message);
    throw new Error(`Failed to cancel subscription: ${JSON.stringify(message)}`);
  }
}


export async function createSubscription(planId: string, accessToken: string, startTime: string)
  : Promise<{ subscriptionId: string, approvalUrl: string }> {
  console.log(`Creating subscription with plan ${planId}, start_time: ${startTime}`);

  const response = await axios.post(
    `${PAYPAL_API}/v1/billing/subscriptions`,
    {
      plan_id: planId,
      start_time: new Date(startTime).toISOString(), // Ensure start_time is in ISO format
      subscriber: {
        name: { given_name: "John", surname: "Doe" },
        email_address: "john@example.com",
      },
      application_context: {
        brand_name: "Test Store",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: `http://localhost:3000/donation-page?status=success`,
        cancel_url: `http://localhost:3000/donation-page?status=cancel`,

      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return {
    subscriptionId: response.data.id,
    approvalUrl: response.data.links.find((link: any) => link.rel === 'approve')?.href || ''
  };
}

export async function createPlan(
  accessToken: string,
  productId: string,
  amount: number,
  currency: string,
  totalCycles: number
): Promise<string> {
  console.log(`Creating PayPal plan for ${amount} ${currency} with ${totalCycles} cycles...`);

  const response = await axios.post(
    `${PAYPAL_API}/v1/billing/plans`,
    {
      product_id: productId,
      name: `Recurring Plan - ${amount} ${currency}`,
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: totalCycles, // Total number of cycles for the plan
          pricing_scheme: {
            fixed_price: {
              value: amount,
              currency_code: currency,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 1,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('Plan created:', response.data.id);
  return response.data.id;
}

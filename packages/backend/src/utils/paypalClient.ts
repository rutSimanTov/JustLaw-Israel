
// src/utils/paypalClient.ts
import * as paypal from '@paypal/checkout-server-sdk';
import { PayPalHttpClient } from '@paypal/checkout-server-sdk/lib/core/paypal_http_client';
import { OrdersCreateRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';
import { OrdersCaptureRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';

class PayPalClient {
    public client: paypal.core.PayPalHttpClient; 

    constructor() {
        this.client = this.setupClient();
    }

    private setupClient(): paypal.core.PayPalHttpClient {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('PayPal Client ID and Secret must be defined in environment variables.');
        }
        const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        return new paypal.core.PayPalHttpClient(environment);
    }

    async createOrder(amount: string, currency: string, options?: any) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        
        const requestBody: any = {
            intent: options?.intent || 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: amount,
                    },
                },
            ],
            ...(options?.payment_source && { payment_source: options.payment_source }),
            application_context: {
                return_url: 'http://localhost:3000/success',
                cancel_url: 'http://localhost:3000/cancel',
                shipping_preference: 'NO_SHIPPING',
            },
        };

        request.requestBody(requestBody);

        try {
            const response = await this.client.execute(request);
            return response.result;
        } catch (e) {
            console.error("Failed to create order:", e);
            throw e;
        }
    }

    async captureOrder(orderId: string) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.prefer('return=representation');
        
        try {
            const response = await this.client.execute(request);
            return response.result;
        } catch (e) {
            console.error(`Failed to capture order ${orderId}:`, e);
            throw e;
        }
    }
}

let paypalClientInstance: PayPalClient | null = null;

function getPaypalClient(): PayPalClient {
    if (!paypalClientInstance) {
        paypalClientInstance = new PayPalClient();
    }
    return paypalClientInstance;
}

export default getPaypalClient;
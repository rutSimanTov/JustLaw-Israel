

// // src/routes/donationRoutes.ts
// import { Router } from 'express';
// import * as paypal from '@paypal/checkout-server-sdk';
// import PayPalClient from '../utils/paypalClient';


// const createDonationRouter = (paypalClientInstance: ReturnType<typeof PayPalClient>) => {
//     const router = Router();

//     router.post('/create-order', async (req, res) => {
//         try {
//             const { amount, currency } = req.body;

//             const request = new paypal.orders.OrdersCreateRequest();
//             request.prefer('return=representation');

//             // <--- שינוי כאן: עוטפים את ה-requestBody באובייקט מסוג 'any'
//             request.requestBody({
//                 intent: 'CAPTURE',
//                 purchase_units: [
//                     {
//                         amount: {
//                             currency_code: req.body.currency,
//                             value: amount,
//                         },
//                     },
//                 ],
//                 // הוספת payment_source - זה בסדר עם ה-'as any'
//                 payment_source: {
//                     paypal: {}
//                 },
//                 application_context: {
//                     return_url: 'http://localhost:3000/success',
//                     cancel_url: 'http://localhost:3000/cancel',
//                     shipping_preference: 'NO_SHIPPING',
//                 },
//             } as any); // <--- השינוי הוא ב-'as any' בסוף האובייקט

//             const response = await paypalClientInstance.client.execute(request);
//         res.status(200).json({ id: response.result.id });
//             console.log('PayPal Order Created:', response.result.id);

//             // if (response.result.status === 'COMPLETED' || response.result.status === 'APPROVED') {
//             //     console.log(`PayPal Order Created and ${response.result.status}:`, response.result.id);
//             //     res.status(200).json(response.result);
//             // } else {
//             //     console.log('PayPal Order Created but not completed:', response.result.status, response.result.id);
//             //     res.status(200).json(response.result);
//             // }

//         } catch (error: any) {
//             console.error('Error creating PayPal order:', error.message);
//             if (error.statusCode && error.message) {
//                 console.error('PayPal Error Details:', error.statusCode, error.message, error.debug_id);
//                 return res.status(error.statusCode).json({
//                     error: 'Failed to create PayPal order.',
//                     details: error.message,
//                     debug_id: error.debug_id
//                 });
//             }
//             res.status(500).json({ error: 'Failed to create PayPal order.', details: error.message });
//         }
//     });

//     // ...existing code...

// // Route ללכידת תשלום (Capture Order)
// router.post('/one-time', async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         console.log('Received orderId for capture:', orderId);
//         if (!orderId) {
//             return res.status(400).json({ error: 'Order ID is required.' });
//         }

//         // קריאה אמיתית ל-capture
//         const capture = await paypalClientInstance.captureOrder(orderId);

//         console.log('PayPal Capture successful:', capture);
//         res.status(200).json({ message: 'Donation processed successfully!', capture });
//     } catch (error: any) {
//         console.error('Error capturing PayPal order:', error.message);
//         if (error.statusCode && error.message) {
//             console.error('PayPal Error Details:', error.statusCode, error.message, error.debug_id);
//             return res.status(error.statusCode).json({
//                 error: 'Failed to capture PayPal order.',
//                 details: error.message,
//                 debug_id: error.debug_id
//             });
//         }
//         res.status(500).json({ error: 'Failed to capture PayPal order.', details: error.message });
//     }
// });

// // ...existing code...
//     return router;
// };

// export default createDonationRouter;


import { Router } from 'express';
import * as paypal from '@paypal/checkout-server-sdk';
import PayPalClient from '../utils/paypalClient';

const createDonationRouter = (paypalClientInstance: ReturnType<typeof PayPalClient>) => {
    const router = Router();

    // Create PayPal Order
    router.post('/create-order', async (req, res) => {
        try {
            const { amount, currency } = req.body;
            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer('return=representation');
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: amount,
                        },
                    },
                ],
                payment_source: { paypal: {} },
                application_context: {
                    return_url: 'http://localhost:3000/success',
                    cancel_url: 'http://localhost:3000/cancel',
                    shipping_preference: 'NO_SHIPPING',
                },
            } as any);

            const response = await paypalClientInstance.client.execute(request);
            const orderId = response.result.id;
            const status = response.result.status;
            console.log('PayPal Order Created:', orderId, 'Status:', status);

            if (!orderId) {
                return res.status(500).json({ error: 'Failed to create PayPal order. No ID returned.' });
            }

            // מחזירים גם סטטוס ל-debug
            res.status(200).json({ id: orderId, status });
        } catch (error: any) {
            console.error('Error creating PayPal order:', error.message);
            if (error.statusCode && error.message) {
                console.error('PayPal Error Details:', error.statusCode, error.message, error.debug_id);
                return res.status(error.statusCode).json({
                    error: 'Failed to create PayPal order.',
                    details: error.message,
                    debug_id: error.debug_id
                });
            }
            res.status(500).json({ error: 'Failed to create PayPal order.', details: error.message });
        }
    });

    // Capture PayPal Order
    router.post('/one-time', async (req, res) => {
        try {
            const { orderId } = req.body;
            console.log('Received orderId for capture:', orderId);
            if (!orderId) {
                return res.status(400).json({ error: 'Order ID is required.' });
            }

            const capture = await paypalClientInstance.captureOrder(orderId);

            // לוג נוסף ל-debug
            if (capture?.result?.status) {
                console.log('PayPal Capture status:', capture.result.status);
            }
            console.log('PayPal Capture successful:', capture);

            res.status(200).json({ message: 'Donation processed successfully!', capture });
        } catch (error: any) {
            console.error('Error capturing PayPal order:', error.message);
            if (error.statusCode && error.message) {
                console.error('PayPal Error Details:', error.statusCode, error.message, error.debug_id);
                return res.status(error.statusCode).json({
                    error: 'Failed to capture PayPal order.',
                    details: error.message,
                    debug_id: error.debug_id
                });
            }
            res.status(500).json({ error: 'Failed to capture PayPal order.', details: error.message });
        }
    });

    return router;
};

export default createDonationRouter;
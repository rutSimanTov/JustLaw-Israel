// controllers/cancelDonationFlowController.ts

import { Request, Response } from 'express';
import crypto from 'crypto';
import { storeCode, retrieveCode, deleteCode } from '../utils/tempCodeStore';
import { cancelStandingOrder } from './standing_orderController';
import { sendVerificationCodeEmail } from '../utils/sendVerificationEmail';
import { supabase } from '../services/supabaseClient';

const RECURRING_DONATION_TYPE = 1;

interface DonorData {
    donor_id: string;
}

interface SupabaseStandingOrder {
    standing_order_id: string;
    end_date: string;
    is_active: boolean;
}

interface DonationData {
    standing_order_id: string | null;
    type: number;
    standing_order: SupabaseStandingOrder | SupabaseStandingOrder[] | null;
}

type StandingOrderStatusResult =
    | { status: 'no_donor' }
    | { status: 'db_error'; message: string; details?: any }
    | { status: 'already_cancelled' }
    | { status: 'active_standing_order'; donorId: string };

const getStandingOrderStatus = async (email: string): Promise<StandingOrderStatusResult> => {
    try {
        const { data: donorData, error: donorError } = await supabase
            .from('donors')
            .select('donor_id')
            .eq('donor_email', email)
            .maybeSingle<DonorData>();

        if (donorError) {
            console.error(`[getStandingOrderStatus] DB error while fetching donor for ${email}:`, donorError.message);
            return { status: 'db_error', message: `DB error while fetching donor: ${donorError.message}`, details: donorError };
        }

        if (!donorData) {
            console.log(`[getStandingOrderStatus] No donor found for email ${email}.`);
            return { status: 'no_donor' };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: donations, error: donationError } = await supabase
            .from('donations')
            .select(`
                standing_order_id,
                type,
                standing_order (
                    standing_order_id,
                    end_date,
                    is_active
                )
            `)
            .eq('donor_id', donorData.donor_id)
            .eq('type', RECURRING_DONATION_TYPE)
            .not('standing_order', 'is', null)
            .returns<DonationData[]>();

        if (donationError) {
            console.error(`[getStandingOrderStatus] DB error while fetching standing orders for donor ${donorData.donor_id}:`, donationError.message);
            return { status: 'db_error', message: `DB error while fetching standing orders: ${donationError.message}`, details: donationError };
        }

        if (!donations || donations.length === 0) {
            console.log(`[getStandingOrderStatus] No standing orders found for ${email}.`);
            return { status: 'already_cancelled' };
        }

        let hasAnyActiveStandingOrder = false;

        for (const donation of donations) {
            const so = Array.isArray(donation.standing_order)
                ? donation.standing_order[0] ?? null
                : donation.standing_order;

            if (!so || typeof so.end_date !== 'string') {
                console.warn(`[getStandingOrderStatus] Invalid standing order data:`, so);
                continue;
            }

            const endDate = new Date(so.end_date);
            endDate.setHours(0, 0, 0, 0);
            const isActive = !!so.is_active;

            console.log(`Checking standing order: endDate=${endDate.toISOString().split('T')[0]}, isActive=${isActive}`);

            if (!isNaN(endDate.getTime()) && endDate >= today && isActive) {
                console.log(`✅ Active standing order found (ID: ${so.standing_order_id})`);
                hasAnyActiveStandingOrder = true;
                break;
            }
        }

        return hasAnyActiveStandingOrder
            ? { status: 'active_standing_order', donorId: donorData.donor_id }
            : { status: 'already_cancelled' };

    } catch (error: any) {
        console.error('[getStandingOrderStatus] General error:', error.message);
        return { status: 'db_error', message: `General error: ${error.message}`, details: error };
    }
};

// Send verification code
export const requestCancellationCode = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    const statusResult = await getStandingOrderStatus(email);

    switch (statusResult.status) {
        case 'no_donor':
            return res.status(404).json({ message: 'Email not found in the system.' });

        case 'db_error':
            return res.status(500).json({ message: 'Internal error checking standing order status.' });

        case 'already_cancelled':
            return res.status(400).json({ message: 'No active standing order for this email. No code was sent.' });

        case 'active_standing_order':
            const existing = retrieveCode(email);
            if (existing) {
                await sendVerificationCodeEmail(email, existing.code);
                return res.status(200).json({ message: 'A verification code has already been sent. Check your inbox.' });
            }

            const code = crypto.randomInt(100000, 999999).toString();
            storeCode(email, code);
            await sendVerificationCodeEmail(email, code);
            return res.status(200).json({ message: 'Verification code sent to your email.' });
    }
};

// Verify code and cancel standing order
export const verifyCodeAndCancel = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and verification code are required.' });
    }

    const statusResult = await getStandingOrderStatus(email);

    if (statusResult.status === 'db_error') {
        return res.status(500).json({ message: 'Error checking standing order status.' });
    }

    if (statusResult.status === 'no_donor' || statusResult.status === 'already_cancelled') {
        return res.status(400).json({ message: 'No active standing order found or email is not registered.' });
    }

    const trimmedCode = code.trim();
    const trimmedEmail = email.trim();
    const stored = retrieveCode(trimmedEmail);

    console.log(`User code: ${trimmedCode}, Stored code: ${stored?.code}`);

    if (!stored || stored.code !== trimmedCode) {
        return res.status(401).json({ message: 'Invalid or incorrect verification code.' });
    }

    deleteCode(trimmedEmail);

    try {
        const fakeReq = { params: { donor_email: email } } as unknown as Request;
        await cancelStandingOrder(fakeReq, res);
    } catch (error: any) {
        console.error('[verifyCodeAndCancel] Error during cancellation:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error occurred while cancelling standing order. Please try again.' });
        }
    }
};

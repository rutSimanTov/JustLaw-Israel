
import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { toast } from "../components/UI/use-toast"; // Correct toast import
import { Button } from "../components/UI/Button/button"; // Correct Button import
import { typeDonation, statusDonation, AddDonation } from '@base-project/shared/dist/models/donations';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";



interface PayPalButtonProps {
    amount: string;
    currency: string;
    onSuccess: () => void;
    onCancel: () => void;
    onError: () => void;
    validateParentForm: () => Promise<boolean>;
    donationData: {
        amount: string;
        currency: string;
        type: typeDonation;
        isAnonymous: boolean;
        donorName?: string; // Optional
        donorEmail?: string; // Optional
        phone?: string; // Optional
        message: string; // From DonationPage, this is always a string (can be empty)
        // --- FIX START: Corrected type for billingDay and added created_at ---
        billingDay?: number; // Changed from `number | ''` to `number | undefined`
        // as DonationPage sends `undefined` when not applicable.
        created_at: string;  // Added this property, which was missing
        timeZone: string | null;
        numberOfMonths: number;// Matches what DonationPage sends

    };
}

const PayPalTestPage: React.FC<PayPalButtonProps> = ({
    amount,
    currency,
    onSuccess,
    onCancel,
    onError,
    validateParentForm,
    donationData
}) => {
    const [isProcessing, setIsProcessing] = useState(false);




    function getNextAvailableDate(dayNumber: number): string {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // שים לב: 0 = ינואר
        const today = now.getDate();

        let targetDate: Date;
        // Check if today is already past the month or if it is today
        if (dayNumber <= today) {
            // Moves to the next month
            const nextMonth = new Date(currentYear, currentMonth + 1, 1);
            const nextMonthYear = nextMonth.getFullYear();
            const nextMonthIndex = nextMonth.getMonth();

            const daysInNextMonth = new Date(nextMonthYear, nextMonthIndex + 1, 0).getDate();
            const safeDay = Math.min(dayNumber, daysInNextMonth); // To prevent dates like February 31st

            targetDate = new Date(nextMonthYear, nextMonthIndex, safeDay, 9, 0, 0);
        } else {
            // Current month
            const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const safeDay = Math.min(dayNumber, daysInCurrentMonth); // Protecting 31 for a short month

            targetDate = new Date(currentYear, currentMonth, safeDay, 9, 0, 0);
        }

        return targetDate.toISOString();// Compatible with PayPal format: YYYY-MM-DDTHH:mm:ssZ
    }


    const createSubscription = async () => {
        setIsProcessing(true);

        // Validate the parent form before creating the subscription
        const isValid = await validateParentForm();
        if (!isValid) {
            toast({
                title: "Please fill in all required fields correctly before payment.",
                variant: "destructive"
            });
            setIsProcessing(false);
            throw new Error("Form validation failed"); // Throwing an error stops the PayPal flow
        }
        try {
            const response = await fetch("http://localhost:3001/api/subscriptions/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency: currency,
                    times: donationData.numberOfMonths,
                    dateStart: getNextAvailableDate(donationData.billingDay!)// או להשתמש ב־numberOfMonths
                }),
            });
            const data = await response.json();
            if (!response.ok || !data.approvalUrl) {
                console.error("Error from server:", data);
                throw new Error(data.message || "Failed to create subscription");
            }
            const donationPayload: AddDonation = {
                donor_email: donationData.donorEmail,
                donor_name: donationData.isAnonymous ? undefined : donationData.donorName,
                amount: parseFloat(donationData.amount),
                currency: donationData.currency,
                type: donationData.type,
                metadata: donationData.message,
                is_anonymous: donationData.isAnonymous,
                created_at: new Date(donationData.created_at),
                status: statusDonation.success,
                times: donationData.type === typeDonation.recurring ? donationData.numberOfMonths : undefined, // Set times if recurring;
                payment_provider_id: data.subscriptionId, // Use the subscription ID from the response
                day_in_month: donationData.timeZone ? donationData.billingDay : undefined, // Use billingDay if applicable


            };
            console.log("PayPalTestPage: Saving donation to DB with payload:", donationPayload);
            localStorage.setItem("donationPayload", JSON.stringify(donationPayload)); // Store donation data in session storage
            window.location.href = data.approvalUrl; // Redirect to PayPal for approval
        } catch (err) {
            console.error("createSubscription error:", err);
            toast({
                title: "Error during subscription process.",
                variant: "destructive"
            });
            setIsProcessing(false);
            throw err;
        }
    }


    const createOrder = async () => {
        setIsProcessing(true);

        // Validate the parent form before creating the order
        const isValid = await validateParentForm();
        if (!isValid) {
            toast({
                title: "Please fill in all required fields correctly before payment.",
                variant: "destructive"
            });
            setIsProcessing(false);
            throw new Error("Form validation failed"); // Throwing an error stops the PayPal flow
        }

        try {
            const response = await fetch('http://localhost:3001/api/donations/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency: currency
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to create PayPal order:", errorData);
                toast({
                    title: "Error creating PayPal order.",
                    description: "Please try again.",
                    variant: "destructive"
                });
                throw new Error(errorData.message || 'Failed to create PayPal order');
            }

            const data = await response.json();
            setIsProcessing(false);
            return data.id;
        } catch (error) {
            console.error("Error in createOrder:", error);
            toast({
                title: "Error during order creation.",
                description: "Please try again.",
                variant: "destructive"
            });
            setIsProcessing(false);
            throw error; // Re-throw to ensure PayPalButtons handles it as an error
        }
    };



    const onApprove = async (data: any, actions: any) => {
        setIsProcessing(true);
        try {
            // 1. Capture the payment in PayPal
            const details = await actions.order.capture();
            console.log('PayPal capture details:', details);

            const transactionId = details.id || 'N/A';
            const payerEmailFromPayPal = details.payer?.email_address || 'N/A';
            const donationDate = new Date().toISOString(); // Using current date for receipt, consistent with created_at

            // Metadata object to include all additional data from donationData and PayPal response
            // const metadata = {
            //     amount: parseFloat(donationData.amount),
            //     currency: donationData.currency,
            //     isAnonymous: donationData.isAnonymous,
            //     donorName: donationData.isAnonymous ? undefined : donationData.donorName,
            //     donorEmail: donationData.isAnonymous ? payerEmailFromPayPal : donationData.donorEmail || payerEmailFromPayPal, // Use PayPal email if anonymous, otherwise preferred or PayPal
            //     phone: donationData.phone,
            //     message: donationData.message,
            //     billingDay: (donationData.type === typeDonation.recurring && typeof donationData.billingDay === 'number') ? donationData.billingDay : undefined, // Ensure number or undefined
            //     timeZone: donationData.timeZone,
            //     payerId: details.payer?.payer_id || 'N/A',
            //     paymentProcessor: "PayPal",
            //     paypalResponse: details,
            // };

            // The payload sent to the backend
            const donationPayload: AddDonation = {
                donor_email: donationData.isAnonymous ? payerEmailFromPayPal : donationData.donorEmail,
                donor_name: donationData.isAnonymous ? undefined : donationData.donorName,
                amount: parseFloat(donationData.amount),
                currency: donationData.currency,
                type: donationData.type,
                metadata: donationData.message,
                is_anonymous: donationData.isAnonymous,
                created_at: new Date(donationData.created_at),
                status: statusDonation.success,
                times: donationData.type === typeDonation.recurring ? 1 : undefined, // Set times if recurring;
                payment_provider_id: transactionId,
                day_in_month: donationData.timeZone ? donationData.billingDay : undefined, // Use billingDay if applicable


            };

            console.log("PayPalTestPage: Saving donation to DB with payload:", donationPayload);

            // 2. Save the donation to the DB
            try {
                const saveDonationResponse = await axios.post("http://localhost:3001/api/donations/add", donationPayload);
                console.log("Donation saved to DB:", saveDonationResponse.data);

                // 3. Send receipt email (if not anonymous and email exists)
                // Use the donorEmail from donationData, falling back to PayPal's if anonymous
                const finalDonorEmailForReceipt = donationData.isAnonymous ? payerEmailFromPayPal : donationData.donorEmail;

                if (finalDonorEmailForReceipt) { // Only send if an email is available
                    const receiptPayload = {
                        donorEmail: finalDonorEmailForReceipt,
                        donorName: donationData.isAnonymous ? "Anonymous Donor" : donationData.donorName, // Provide a name for anonymous receipts
                        amount: donationData.amount,
                        currency: donationData.currency,
                        date: donationDate, // Use the date from PayPal capture or current date
                        receiptNumber: Math.floor(Math.random() * 1000000).toString(),
                        transactionId: transactionId,
                        isAnonymous: donationData.isAnonymous,
                        timeZone: donationData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
                    };
                    console.log("PayPalTestPage: Sending receipt email with payload:", receiptPayload);

                    try {
                        const receiptResponse = await axios.post('http://localhost:3001/api/donations/receipt', receiptPayload);
                        console.log('PayPalTestPage: Receipt email sent response:', receiptResponse.data);

                        if (receiptResponse.data.success) {
                            toast({
                                title: "✉️ A receipt has been sent to your email!",
                                description: "",
                            });
                        } else {
                            toast({
                                title: "⚠️ Payment received, but there was an issue sending the receipt email.",
                                description: "Please contact support.",
                                variant: "destructive"
                            });
                        }
                    } catch (receiptError: any) {
                        console.error('PayPalTestPage: Error sending receipt email:', receiptError);
                        toast({
                            title: "⚠️ Payment received, but a technical error occurred while sending the receipt email.",
                            description: "Please contact support.",
                            variant: "destructive"
                        });
                    }
                }

                // Call the parent component's success function
                onSuccess();

            } catch (dbError: any) {
                console.error("PayPalTestPage: Error saving donation to DB:", dbError);
                toast({
                    title: "Payment went through, but an error occurred saving donation details to the database.",
                    description: "Please contact support.",
                    variant: "destructive"
                });
                onError(); // Call onError for the parent to handle
            }
        } catch (err: any) {
            console.error('❌ PayPalTestPage: Critical error during payment approval process (capture/PayPal):', err);
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            toast({
                title: "❌ Payment failed",
                description: errorMessage,
                variant: "destructive"
            });
            onError(); // Call onError for the parent to handle
        } finally {
            setIsProcessing(false);
        }
    };

    const onCancelCallback = (data: any) => {
        console.log('PayPalTestPage: PayPal transaction cancelled:', data);
        toast({
            title: "Payment canceled."
        });
        onCancel(); // Call parent's onCancel
        setIsProcessing(false);
    };

    const onErrorCallback = (err: any) => {
        console.error('PayPalTestPage: PayPal transaction error:', err);
        toast({
            title: "A technical error occurred with PayPal payment.",
            variant: "destructive"
        });
        onError(); // Call parent's onError
        setIsProcessing(false);
    };


    return (
        <>
            {donationData.type === typeDonation['one-time'] && <PayPalScriptProvider options={{ clientId: 'sb', currency: currency }}>
                <PayPalButtons
                    style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onCancel={onCancelCallback}
                    onError={onErrorCallback}
                    disabled={isProcessing || parseFloat(amount) <= 0}
                />
                {isProcessing && (
                    <div className="text-center mt-2 text-gray-600">
                        Processing payment...
                    </div>
                )}
            </PayPalScriptProvider>}
            {donationData.type === typeDonation.recurring && <Button
                onClick={createSubscription}
                disabled={isProcessing}
                className="bg-[#0070BA] hover:bg-[#0063AD] !important text-white font-semibold rounded-sm px-8 py-6 w-[320px]"
            >
                Monthly donation with PayPal
            </Button>}
        </>


    );
};

export default PayPalTestPage;


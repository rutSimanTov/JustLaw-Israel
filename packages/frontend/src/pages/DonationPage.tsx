
// src/pages/DonationPage.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PayPalTestPage from "./payPalButton"; 
import { toast } from "../components/UI/use-toast";
import { typeDonation } from "@base-project/shared/dist/models/donations"; 
import { Button } from "../tempSH/button";
import { ArrowLeft } from "lucide-react";
import useFormValidation from "../hooks/useFormValidation";
import DonationForm from "../components/DonationForm";
import axios from "axios";
import { AddDonation } from '../../../shared/src/models/donations';





const DonationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- State Variables (Managed by DonationPage) ---
    const [customAmount, setCustomAmount] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('amount') || "";
    });
    const [currency, setCurrency] = useState("USD");
    const [donationType, setDonationType] = useState<typeDonation>(typeDonation["one-time"]);
    const [billingDay, setBillingDay] = useState<number | ''>('');
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [timeZone, setTimeZone] = useState<string | null>(null);
    const [numberOfMonths, setNumberOfMonths] = useState<number | ''>('');

    // --- Error States (Managed by DonationPage and updated by useFormValidation) ---
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const [amountError, setAmountError] = useState("");
    const [billingDayError, setBillingDayError] = useState("");
    const [numberOfMonthsError, ] = useState("");

    // --- Refs for Scrolling (Managed by DonationPage, passed to DonationForm) ---
    const amountRef = useRef<HTMLInputElement | null>(null);
    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const billingDayRef = useRef<HTMLInputElement | null>(null);
    const numberOfMonthsRef = useRef<HTMLInputElement | null>(null);

    // --- PayPal Button Visibility State ---
    const [showPayPalButtons, setShowPayPalButtons] = useState(false);

    // --- Use custom validation hook ---
    const { validateEmail, validateName, validateFormAndGetValidity } = useFormValidation(
        customAmount,
        fullName,
        email,
        donationType,
        billingDay,
        isAnonymous,
        { setAmountError, setNameError, setEmailError, setBillingDayError }
    );
    
    // --- Effects ---
    useEffect(() => {
        window.scrollTo(0, 0);
        const params = new URLSearchParams(location.search);
        const status = params.get("status");
        const subscriptionId = params.get("subscription_id");
        const storedData = localStorage.getItem("donationPayload");
        const donationData = storedData ? JSON.parse(storedData) : null;

        try {
            setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        } catch (error) {
            console.error("Failed to determine time zone:", error);
            setTimeZone(null);
        }
        if (status === "success" && subscriptionId && donationData) {
            saveDetailsSubscription(subscriptionId, donationData)
                .then(() => {
                    toast({
                        title: "Donation successful!",
                        description: "Thank you for your support ❤️",
                    });
                    localStorage.removeItem("donationData");
                })
                .catch((err) => {
                    console.error("Error saving subscription:", err);
                    toast({
                        title: "Donation saved failed",
                        description: "Payment succeeded, but saving failed.",
                        variant: "destructive",
                    });
                })
                .finally(() => {
                    navigate("/donation-page", { replace: true });
                });
        } else if (status === "cancel") {
            toast({
                title: "Donation canceled",
                description: "You canceled the PayPal process.",
                variant: "destructive",
            });
            localStorage.removeItem("donationData");
            navigate("/donation-page", { replace: true });

        }
    }, []);





    // --- Function to save donation details ---


    const saveDetailsSubscription = async (subscriptionId: string, donationPayload: AddDonation) => {
        // setIsProcessing(true);
        try {

            const donationDate = new Date().toISOString(); // Using current date for receipt, consistent with created_at

            console.log("PayPalTestPage: Saving donation to DB with payload:", donationPayload);

            // 2. Save the donation to the DB
            try {
                donationPayload.payment_provider_id = subscriptionId;  // Add subscription ID to payload
                const saveDonationResponse = await axios.post("http://localhost:3001/api/donations/add", donationPayload);
                console.log("Donation saved to DB:", saveDonationResponse.data);

                // 3. Send receipt email (if not anonymous and email exists)
                // Use the donorEmail from donationData, falling back to PayPal's if anonymous
                const finalDonorEmailForReceipt = donationPayload.donor_email;

                if (finalDonorEmailForReceipt) { // Only send if an email is available
                    const receiptPayload = {
                        donorEmail: finalDonorEmailForReceipt,
                        donorName: donationPayload.donor_name, // Provide a name for anonymous receipts
                        amount: donationPayload.amount,
                        currency: donationPayload.currency,
                        date: donationDate, // Use the date from PayPal capture or current date
                        receiptNumber: Math.floor(Math.random() * 1000000).toString(),
                        transactionId: subscriptionId, // Use a placeholder or actual transaction ID if available
                        isAnonymous: donationPayload.is_anonymous,
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    };
                    console.log("PayPalTestPage: Sending receipt email with payload:", receiptPayload);

                    try {
                        const receiptResponse = await axios.post('http://localhost:3001/api/donations/receipt', receiptPayload);
                        console.log('PayPalTestPage: Receipt email sent response:', receiptResponse.data);

                        if (receiptResponse.data.success) {
                            // toast({
                            //     title: "✉️ A receipt has been sent to your email!",
                            //     description: "",
                            // });
                        } else {
                            // toast({
                            //     title: "⚠️ Payment received, but there was an issue sending the receipt email.",
                            //     description: "Please contact support.",
                            //     variant: "destructive"
                            // });
                            console.error('PayPalTestPage: Error sending receipt email:', receiptResponse.data.message);
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

            } catch (dbError: any) {
                console.error("PayPalTestPage: Error saving donation to DB:", dbError);
                toast({
                    title: "Payment went through, but an error occurred saving donation details to the database.",
                    description: "Please contact support.",
                    variant: "destructive"
                });
            }
        } catch (err: any) {
            console.error('❌ PayPalTestPage: Critical error during payment approval process (capture/PayPal):', err);
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            toast({
                title: "❌ Payment failed",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };
    // --- Event Handlers ---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = await validateFormAndGetValidity();

        if (!isValid) {
            let firstInvalidRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

            // Recalculate errors for specific field focus
            const currentAmountErr = parseFloat(customAmount) <= 0 ? "Please enter a valid amount" : "";
            const currentNameErr = isAnonymous ? "" : validateName(fullName);
            const currentEmailErr = isAnonymous ? "" : await validateEmail(email);
            const currentBillingDayErr = (!isAnonymous && donationType === typeDonation.recurring && (!billingDay || billingDay < 1 || billingDay > 28)) ? "Please select a valid day (1-28)" : "";
            const currentNumberOfMonthsErr = (donationType === typeDonation.recurring && (typeof numberOfMonths !== 'number' || numberOfMonths <= 0)) ? "Please select a valid number of months" : "";

            if (currentAmountErr && amountRef.current) { firstInvalidRef = amountRef; }
            else if (!isAnonymous && currentNameErr && nameRef.current) { firstInvalidRef = nameRef; }
            else if (!isAnonymous && currentEmailErr && emailRef.current) { firstInvalidRef = emailRef; }
            else if (!isAnonymous && donationType === typeDonation.recurring && currentBillingDayErr && billingDayRef.current) { firstInvalidRef = billingDayRef; }
            else if (!isAnonymous && donationType === typeDonation.recurring && currentNumberOfMonthsErr && numberOfMonthsRef.current) { firstInvalidRef = numberOfMonthsRef; }

            if (firstInvalidRef && firstInvalidRef.current) {
                firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidRef.current.focus();
            }
            setShowPayPalButtons(false);
            toast({
                title: "Validation Error",
                description: "Please correct the errors in the form before proceeding.",
                variant: "destructive",
                duration: 5000,
            });
            return;
        }

        setShowPayPalButtons(true);
    };

    const handlePayPalTransactionComplete = async () => {
        // Reset form fields after successful donation
        setCustomAmount('');
        setFullName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setIsAnonymous(true); // Reset to anonymous by default
        setDonationType(typeDonation["one-time"]);
        setBillingDay('');
        setNumberOfMonths(1);
        setShowPayPalButtons(false); // Hide PayPal buttons
        window.scrollTo(0, 0); // Scroll to top

        // Display success toast
        if (!isAnonymous && email) {
            toast({
                title: "Success! 🎉",
                description: "Your donation has been received successfully! A receipt has been sent to your email.",
                duration: 7000,
            });
        } else {
            toast({
                title: "Success! 🎉",
                description: "Your donation has been received successfully! Thank you for your support.",
                duration: 7000,
            });
        }
    };

    const handlePayPalCancel = useCallback(() => {
        setShowPayPalButtons(false);
        toast({
            title: "Payment Canceled",
            description: "Your PayPal payment was canceled.",
            duration: 5000,
        });
    }, []);

    const handlePayPalError = useCallback(() => {
        setShowPayPalButtons(false);
        toast({
            title: "Payment Error",
            description: "A technical error occurred during the PayPal payment. Please try again.",
            variant: "destructive",
            duration: 8000,
        });
    }, []);

    // function getRecurringStartDate(billingDay: number): string {
    //     const today = new Date();
    //     const currentYear = today.getFullYear();
    //     const currentMonth = today.getMonth(); // 0-based
    //     const currentDate = today.getDate();

    //     let year = currentYear;
    //     let month = currentMonth;

    //     // אם היום כבר עבר החודש - נלך לחודש הבא
    //     if (billingDay <= currentDate) {
    //         month += 1;
    //         if (month > 11) {
    //             month = 0;
    //             year += 1;
    //         }
    //     }

    //     // נבנה תאריך תקין
    //     const paddedMonth = String(month + 1).padStart(2, '0');
    //     const paddedDay = String(billingDay).padStart(2, '0');
    //     return `${year}-${paddedMonth}-${paddedDay}T00:00:00.000Z`;
    // }
    // const recurringStartDate = (
    //     donationType === typeDonation.recurring && typeof billingDay === 'number'
    // ) ? getRecurringStartDate(billingDay) : undefined;

    return (
        <div className="donation-page min-h-screen bg-white text-black flex flex-col items-center p-6">
            {/* Inline styles can be moved to a CSS file if preferred */}
            <style>{`
                .donation-page input:focus,
                .donation-page textarea:focus,
                .donation-page select:focus,
                .donation-page button:focus {
                    outline: none !important;
                    box-shadow: 0 0 0 2px #60A5FA !important;
                    border-color: #60A5FA !important;
                }
                .donation-page button:hover {
                    background-color: white !important;
                    color: black !important;
                    border-color: #3B82F6 !important;
                }
                .btn-toggle-active {
                    background-color: #BFDBFE !important;
                    color: black !important;
                    border: 1px solid #93C5FD !important;
                    box-shadow: 0 0 0 2px #60A5FA !important;
                }
                .btn-toggle-inactive {
                    background-color: white !important;
                    color: black !important;
                    border: 1px solid #D1D5DB !important;
                }
            `}</style>

            <button onClick={() => navigate("/")} className="flex items-center text-gray-600 hover:text-gray-800 mb-6 self-start">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>

            <form onSubmit={handleSubmit} className={`w-full rounded-lg shadow-lg bg-white transition-all duration-500 ease-in-out ${isAnonymous ? "max-w-md mx-auto p-8" : "max-w-6xl mx-auto p-12"}`}>
                <DonationForm
                    customAmount={customAmount}
                    setCustomAmount={setCustomAmount}
                    currency={currency}
                    setCurrency={setCurrency}
                    donationType={donationType}
                    setDonationType={setDonationType}
                    billingDay={billingDay}
                    setBillingDay={setBillingDay}
                    numberOfMonths={numberOfMonths}
                    setNumberOfMonths={setNumberOfMonths}
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    message={message}
                    setMessage={setMessage}
                    isAnonymous={isAnonymous}
                    setIsAnonymous={setIsAnonymous}
                    emailError={emailError}
                    nameError={nameError}
                    amountError={amountError}
                    billingDayError={billingDayError}
                    numberOfMonthsError={numberOfMonthsError}
                    // Pass individual validation functions as needed for blur events
                    validateEmail={validateEmail}
                    validateName={validateName}
                    amountRef={amountRef}
                    nameRef={nameRef}
                    emailRef={emailRef}
                    billingDayRef={billingDayRef}
                    numberOfMonthsRef={numberOfMonthsRef}
                />

                <div className="mt-8 max-w-xs w-full mx-auto">
                    {showPayPalButtons ? (
                        <PayPalTestPage
                            amount={customAmount}
                            currency={currency}
                            onSuccess={handlePayPalTransactionComplete}
                            onCancel={handlePayPalCancel}
                            onError={handlePayPalError}
                            validateParentForm={validateFormAndGetValidity}
                            donationData={{
                                amount: customAmount,
                                currency: currency,
                                type: donationType,
                                isAnonymous: isAnonymous,
                                donorName: isAnonymous ? undefined : fullName,
                                donorEmail: isAnonymous ? undefined : email,
                                phone: isAnonymous ? undefined : phone,
                                message: message,
                                billingDay: (donationType === typeDonation.recurring && typeof billingDay === 'number' && billingDay >= 1 && billingDay <= 28)
                                    ? billingDay
                                    : undefined, // Ensure billingDay is a number between 1 and 28
                                timeZone: timeZone,
                                created_at: new Date().toISOString(),
                                numberOfMonths: (donationType === typeDonation.recurring && typeof numberOfMonths === 'number' && numberOfMonths > 0)
                                    ? numberOfMonths
                                    : 1, // Default to 1 month if not set
                            }}
                        />
                    ) : (
                        // <Button
                        //     type="submit"
                        //     className="w-64 bg-primary text-white rounded-full flex items-center justify-center gap-2 border border-primary"
                        //     style={{ minHeight: "45px", maxWidth: "256px", margin: "0 auto" }}
                        // >
                        //     Continue to Payment
                        // </Button>
                        // <Button
                        //     type="submit"
                        //     className="w-64 bg-white text-blue-600 rounded-full flex items-center justify-center gap-2 border border-blue-600 font-semibold"
                        //     style={{ minHeight: "45px", maxWidth: "256px", margin: "0 auto" }}
                        // >
                        //     Pay With
                        //     <img
                        //         src="/logoPayPal.png"
                        //         alt="PayPal"
                        //         className="h-5"
                        //     />
                        // </Button>
                        <Button
                            type="submit"
                            className="w-64 bg-white text-blue-700 rounded-full flex items-center justify-center gap-2 border border-blue-700 font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                            style={{ minHeight: "48px", maxWidth: "256px", margin: "0 auto" }}
                        >
                            <span className="tracking-wide">Pay with</span>
                            <img
                                src="/logoPayPal.png"
                                alt="PayPal"
                                className="h-5"
                            />

                        </Button>


                    )}
                </div>
            </form>
        </div>
    );
};

export default DonationPage;


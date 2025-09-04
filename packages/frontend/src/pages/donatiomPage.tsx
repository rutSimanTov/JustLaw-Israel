// // src/pages/DonationPage.tsx
// import { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import PayPalTestPage from "../pages/payPalButton"; // וודא שהנתיב נכון לקומפוננטת פייפאל
// import { toast } from "../components/UI/use-toast";
// // import DonationForm from "../components/donationForm"; // נייבא את קומפוננטת הטופס החדשה
// // import useFormValidation from "../hooks/useFormValidation"; // נייבא את ה-hook החדש לולידציה
// import { typeDonation } from "@base-project/shared/dist/models/donations"; // וודא שהנתיב נכון
// import { Button } from "../tempSH/button";
// import { ArrowLeft } from "lucide-react";
// import useFormValidation from "../hooks/useFormValidation";
// import DonationForm from "../components/DonationForm";

// const DonationPage = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // --- State Variables (Managed by DonationPage) ---
//     const [customAmount, setCustomAmount] = useState(() => {
//         const params = new URLSearchParams(location.search);
//         return params.get('amount') || "";
//     });
//     const [currency, setCurrency] = useState("USD");
//     const [donationType, setDonationType] = useState<typeDonation>(typeDonation["one-time"]);
//     const [billingDay, setBillingDay] = useState<number | ''>('');
//     const [fullName, setFullName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [message, setMessage] = useState("");
//     const [isAnonymous, setIsAnonymous] = useState(true);
//     const [timeZone, setTimeZone] = useState<string | null>(null);

//     // --- Error States (Managed by DonationPage and updated by useFormValidation) ---
//     const [emailError, setEmailError] = useState("");
//     const [nameError, setNameError] = useState("");
//     const [amountError, setAmountError] = useState("");
//     const [billingDayError, setBillingDayError] = useState("");

//     // --- Refs for Scrolling (Managed by DonationPage, passed to DonationForm) ---
//     const amountRef = useRef<HTMLInputElement | null>(null);
//     const nameRef = useRef<HTMLInputElement | null>(null);
//     const emailRef = useRef<HTMLInputElement | null>(null);
//     const billingDayRef = useRef<HTMLInputElement | null>(null);

//     // --- PayPal Button Visibility State ---
//     const [showPayPalButtons, setShowPayPalButtons] = useState(false);

//     // --- Use custom validation hook ---
//     const { validateEmail, validateName, validateFormAndGetValidity } = useFormValidation(
//         customAmount,
//         fullName,
//         email,
//         donationType,
//         billingDay,
//         isAnonymous,
//         { setAmountError, setNameError, setEmailError, setBillingDayError }
//     );

//     // --- Effects ---
//     useEffect(() => {
//         window.scrollTo(0, 0);
//         try {
//             setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
//         } catch (error) {
//             console.error("Failed to determine time zone:", error);
//             setTimeZone(null);
//         }
//     }, []);

//     // --- Event Handlers ---
//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         const isValid = await validateFormAndGetValidity();

//         if (!isValid) {
//             let firstInvalidRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

//             // Recalculate errors for specific field focus
//             const currentAmountErr = parseFloat(customAmount) <= 0 ? "Please enter a valid amount" : "";
//             const currentNameErr = isAnonymous ? "" : validateName(fullName);
//             const currentEmailErr = isAnonymous ? "" : await validateEmail(email);
//             const currentBillingDayErr = (!isAnonymous && donationType === typeDonation.recurring && (!billingDay || billingDay < 1 || billingDay > 28)) ? "Please select a valid day (1-28)" : "";

//             if (currentAmountErr && amountRef.current) { firstInvalidRef = amountRef; }
//             else if (!isAnonymous && currentNameErr && nameRef.current) { firstInvalidRef = nameRef; }
//             else if (!isAnonymous && currentEmailErr && emailRef.current) { firstInvalidRef = emailRef; }
//             else if (!isAnonymous && donationType === typeDonation.recurring && currentBillingDayErr && billingDayRef.current) { firstInvalidRef = billingDayRef; }

//             if (firstInvalidRef && firstInvalidRef.current) {
//                 firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                 firstInvalidRef.current.focus();
//             }
//             setShowPayPalButtons(false);
//             toast({
//                 title: "Validation Error",
//                 description: "Please correct the errors in the form before proceeding.",
//                 variant: "destructive",
//                 duration: 5000,
//             });
//             return;
//         }

//         setShowPayPalButtons(true);
//     };

//     const handlePayPalTransactionComplete = async () => {
//         // Reset form fields after successful donation
//         setCustomAmount('');
//         setFullName('');
//         setEmail('');
//         setPhone('');
//         setMessage('');
//         setIsAnonymous(true); // Reset to anonymous by default
//         setDonationType(typeDonation["one-time"]);
//         setBillingDay('');
//         setShowPayPalButtons(false); // Hide PayPal buttons
//         window.scrollTo(0, 0); // Scroll to top

//         // Display success toast
//         if (!isAnonymous && email) {
//             toast({
//                 title: "Success! 🎉",
//                 description: "Your donation has been received successfully! A receipt has been sent to your email.",
//                 duration: 7000,
//             });
//         } else {
//             toast({
//                 title: "Success! 🎉",
//                 description: "Your donation has been received successfully! Thank you for your support.",
//                 duration: 7000,
//             });
//         }
//     };

//     const handlePayPalCancel = useCallback(() => {
//         setShowPayPalButtons(false);
//         toast({
//             title: "Payment Canceled",
//             description: "Your PayPal payment was canceled.",
//             duration: 5000,
//         });
//     }, []);

//     const handlePayPalError = useCallback(() => {
//         setShowPayPalButtons(false);
//         toast({
//             title: "Payment Error",
//             description: "A technical error occurred during the PayPal payment. Please try again.",
//             variant: "destructive",
//             duration: 8000,
//         });
//     }, []);

//     return (
//         <div className="donation-page min-h-screen bg-white text-black flex flex-col items-center p-6">
//             {/* Inline styles can be moved to a CSS file if preferred */}
//             <style>{`
//                 .donation-page input:focus,
//                 .donation-page textarea:focus,
//                 .donation-page select:focus,
//                 .donation-page button:focus {
//                     outline: none !important;
//                     box-shadow: 0 0 0 2px #60A5FA !important;
//                     border-color: #60A5FA !important;
//                 }
//                 .donation-page button:hover {
//                     background-color: white !important;
//                     color: black !important;
//                     border-color: #3B82F6 !important;
//                 }
//                 .btn-toggle-active {
//                     background-color: #BFDBFE !important;
//                     color: black !important;
//                     border: 1px solid #93C5FD !important;
//                     box-shadow: 0 0 0 2px #60A5FA !important;
//                 }
//                 .btn-toggle-inactive {
//                     background-color: white !important;
//                     color: black !important;
//                     border: 1px solid #D1D5DB !important;
//                 }
//             `}</style>

//             <button onClick={() => navigate("/")} className="flex items-center text-gray-600 hover:text-gray-800 mb-6 self-start">
//                 <ArrowLeft className="w-5 h-5 mr-2" /> Back
//             </button>

//             <form onSubmit={handleSubmit} className={`w-full rounded-lg shadow-lg bg-white transition-all duration-500 ease-in-out ${isAnonymous ? "max-w-md mx-auto p-8" : "max-w-6xl mx-auto p-12"}`}>
//                 <DonationForm
//                     customAmount={customAmount}
//                     setCustomAmount={setCustomAmount}
//                     currency={currency}
//                     setCurrency={setCurrency}
//                     donationType={donationType}
//                     setDonationType={setDonationType}
//                     billingDay={billingDay}
//                     setBillingDay={setBillingDay}
//                     fullName={fullName}
//                     setFullName={setFullName}
//                     email={email}
//                     setEmail={setEmail}
//                     phone={phone}
//                     setPhone={setPhone}
//                     message={message}
//                     setMessage={setMessage}
//                     isAnonymous={isAnonymous}
//                     setIsAnonymous={setIsAnonymous}
//                     emailError={emailError}
//                     nameError={nameError}
//                     amountError={amountError}
//                     billingDayError={billingDayError}
//                     // Pass individual validation functions as needed for blur events
//                     validateEmail={validateEmail}
//                     validateName={validateName}
//                     amountRef={amountRef}
//                     nameRef={nameRef}
//                     emailRef={emailRef}
//                     billingDayRef={billingDayRef}
//                 />

//                 <div className="mt-8 max-w-xs w-full mx-auto">
//                     {showPayPalButtons ? (
//                         <PayPalTestPage
//                             amount={customAmount}
//                             currency={currency}
//                             onSuccess={handlePayPalTransactionComplete}
//                             onCancel={handlePayPalCancel}
//                             onError={handlePayPalError}
//                             validateParentForm={validateFormAndGetValidity}
//                             donationData={{
//                                 amount: customAmount,
//                                 currency: currency,
//                                 type: donationType,
//                                 isAnonymous: isAnonymous,
//                                 donorName: isAnonymous ? undefined : fullName,
//                                 donorEmail: isAnonymous ? undefined : email,
//                                 phone: isAnonymous ? undefined : phone,
//                                 message: message,
//                                 billingDay: (donationType === typeDonation.recurring && typeof billingDay === 'number' && billingDay >= 1 && billingDay <= 28)
//                                     ? billingDay
//                                     : undefined,
//                                 created_at: new Date().toISOString(),
//                                 timeZone: timeZone,
//                             }}
//                         />
//                     ) : (
//                         <Button
//                             type="submit"
//                             className="w-64 bg-primary text-white rounded-full flex items-center justify-center gap-2 border border-primary"
//                             style={{ minHeight: "45px", maxWidth: "256px", margin: "0 auto" }}
//                         >
//                             Continue to Payment
//                         </Button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default DonationPage;
export {}
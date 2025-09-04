// src/components/DonationForm.tsx
import React, { RefObject } from 'react';
import { Button } from "./UI/Button/button";
import { Input } from "./UI/Input/input";
import { Label } from "./UI/label";
import { typeDonation } from "@base-project/shared/dist/models/donations"; // וודא שהנתיב נכון

interface DonationFormProps {
    customAmount: string;
    setCustomAmount: (value: string) => void;
    currency: string;
    setCurrency: (value: string) => void;
    donationType: typeDonation;
    setDonationType: (type: typeDonation) => void;
    billingDay: number | '';
    setBillingDay: (value: number | '') => void;
    numberOfMonths: number | '';
    setNumberOfMonths: (value: number | 0) => void;
    fullName: string;
    setFullName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    message: string;
    setMessage: (value: string) => void;
    isAnonymous: boolean;
    setIsAnonymous: (value: boolean) => void;
    emailError: string;
    nameError: string;
    amountError: string;
    billingDayError: string;
    numberOfMonthsError: string;
    validateEmail: (emailValue: string) => Promise<string>;
    validateName: (nameValue: string) => string;
    amountRef: RefObject<HTMLInputElement | null>;
    nameRef: RefObject<HTMLInputElement | null>;
    emailRef: RefObject<HTMLInputElement | null>;
    billingDayRef: RefObject<HTMLInputElement | null>;
    numberOfMonthsRef: RefObject<HTMLInputElement | null>;
}

const DonationForm: React.FC<DonationFormProps> = ({
    customAmount, setCustomAmount,
    currency, setCurrency,
    donationType, setDonationType,
    billingDay, setBillingDay,
    fullName, setFullName,
    email, setEmail,
    phone, setPhone,
    message, setMessage,
    isAnonymous, setIsAnonymous,
    emailError, nameError, amountError, billingDayError,
    validateEmail, validateName,
    amountRef, nameRef, emailRef, billingDayRef,
    numberOfMonths, setNumberOfMonths,
    numberOfMonthsError,
    numberOfMonthsRef,

}) => {

    const handleChangeCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value);
    };
    const handleAmountBlur = () => {
        // Validation logic for amount is primarily in useFormValidation,
        // but simple blur feedback can be added if needed here.
        // For now, it relies on the parent's validateFormAndGetValidity on submit.
    };

    const handleChangeFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value);
    };
    const handleNameBlur = () => {
        // Validation handled by parent via useFormValidation
    };

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handleEmailBlur = async () => {
        // Validation handled by parent via useFormValidation
    };

    const handleChangeBillingDay = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setBillingDay(isNaN(value) ? '' : value);
    };
    const handleBillingDayBlur = () => {
        // Validation handled by parent via useFormValidation
    };

    // const handleChangeNumberOfMonths = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = parseInt(e.target.value);
    //     setNumberOfMonths(value);
    // };
    const handleNumberOfMonthsBlur = () => {
        // Validation יכול להיות כאן או דרך hook חיצוני
    };

    const handleChangeIsAnonymous = (value: boolean) => {
        setIsAnonymous(value);
        if (value) {
            setFullName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setDonationType(typeDonation["one-time"]);
            setBillingDay('');
        }
    };

    return (
        <div className={`flex flex-col ${isAnonymous ? "" : "md:flex-row md:items-start md:gap-8"}`}>
            <div className={`flex flex-col items-start mb-6 ${isAnonymous ? "w-full" : "w-1/2"}`}>
                <img src="/logoJLM.png" alt="Logo" className="w-20 mb-2" />
                <p className="text-sm black mb-6">Made in Jerusalem R.A.<br /><br /></p>
                
                <h1 className="text-2xl font-bold mb-4">
                    Funding the Future of Justice 🖤<br></br> Your support
                    helps us accelerate <br />technological solutions for justice
                    worldwide.
                </h1>
                <div className="space-y-6 w-full">
                    <div>
                        <Label>Amount *</Label>
                        <div className={`flex items-center border rounded-lg shadow-sm ${amountError ? "border-red-700" : "border-gray-300"}`}>
                            <input
                                type="text"
                                value={customAmount}
                                onBlur={handleAmountBlur}
                                onChange={handleChangeCustomAmount}
                                placeholder="E.g.: 75.00"
                                className="flex-grow p-3 rounded-l-lg outline-none bg-white text-black"
                                ref={amountRef}
                            />
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="p-3 bg-gray-50 border-l border-gray-300 rounded-r-lg outline-none text-black"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="ILS">ILS</option>
                            </select>
                        </div>
                        {amountError && (
                            <p className="text-red-700 font-semibold text-sm mt-1">
                                {amountError}
                            </p>
                        )}
                    </div>
                    {!isAnonymous && (
                        // <div>
                        //     <Label>Donation Type</Label>
                        //     <div className="flex gap-4 mt-2">
                        //         <Button
                        //             type="button"
                        //             onClick={() => { setDonationType(typeDonation["one-time"]); setBillingDay(''); }}
                        //             className={donationType === typeDonation["one-time"] ? "btn-toggle-active" : "btn-toggle-inactive"}
                        //         >
                        //             One-time
                        //         </Button>
                        //         <Button
                        //             type="button"
                        //             onClick={() => setDonationType(typeDonation.recurring)}
                        //             className={donationType === typeDonation.recurring ? "btn-toggle-active" : "btn-toggle-inactive"}
                        //         >
                        //             Monthly
                        //         </Button>
                        //     </div>
                        // </div>
                        <div>
  <Label>Donation Type</Label>
  <div className="flex gap-4 mt-2">
    <button
      type="button"
      onClick={() => { setDonationType(typeDonation["one-time"]); setBillingDay(''); }}
      className={`w-32 py-2 rounded-md border ${
        donationType === typeDonation["one-time"]
          ? "bg-gray-200 text-black border-black"
          : "bg-white text-black border-gray-300"
      }`}
    >
      One-time
    </button>
    <button
      type="button"
      onClick={() => setDonationType(typeDonation.recurring)}
      className={`w-32 py-2 rounded-md border ${
        donationType === typeDonation.recurring
          ? "bg-gray-200 text-black border-black"
          : "bg-white text-black border-gray-300"
      }`}
    >
      Monthly
    </button>
  </div>
</div>

                    )}
                    {!isAnonymous && donationType === typeDonation.recurring && (
                        <div>
                            <Label>Monthly Billing Day (1-28)</Label>
                            <Input
                                type="number"
                                value={billingDay}
                                onBlur={handleBillingDayBlur}
                                onChange={handleChangeBillingDay}
                                placeholder="E.g.: 15"
                                min="1"
                                max="28"
                                className={`bg-white text-black border p-3 w-full ${billingDayError ? "border-red-700" : "border-gray-300"}`}
                                ref={billingDayRef}
                            />
                            {billingDayError && (
                                <p className="text-red-700 font-semibold text-sm mt-1">
                                    {billingDayError}
                                </p>
                            )}
                        </div>


                    )}
                    {!isAnonymous && donationType === typeDonation.recurring && (
                        <div>
                            <Label>Number of Months *</Label>
                            <Input
                                type="number"
                                value={numberOfMonths}
                                onChange={(e) => setNumberOfMonths(Number(e.target.value))}
                                onBlur={handleNumberOfMonthsBlur}
                                placeholder="e.g. 12"
                                min="1"
                                max="60"
                                className={`bg-white text-black border p-3 w-full ${numberOfMonthsError ? "border-red-700" : "border-gray-300"}`}
                                ref={numberOfMonthsRef}
                            />
                            {numberOfMonthsError && (
                                <p className="text-red-700 font-semibold text-sm mt-1">
                                    {numberOfMonthsError}
                                </p>
                            )}
                        </div>

                    )}
                    {/* <div>
                        <Label>Donate anonymously?</Label>
                        <div className="flex gap-4 mt-2">
                            <Button
                                type="button"
                                onClick={() => handleChangeIsAnonymous(true)}
                                className={isAnonymous ? "btn-toggle-active" : "btn-toggle-inactive"}
                            >
                                Yes
                            </Button>
                            <Button
                                type="button"
                                onClick={() => handleChangeIsAnonymous(false)}
                                className={!isAnonymous ? "btn-toggle-active" : "btn-toggle-inactive"}
                            >
                                No
                            </Button>
                        </div>
                    </div> */}
<div>
  <Label>Donate anonymously?</Label>
  <div className="flex gap-4 mt-2">
    <Button
      type="button"
      onClick={() => handleChangeIsAnonymous(true)}
      className={`w-32 py-2 rounded-md border ${
        isAnonymous ? "bg-gray-200 text-black border-black" : "bg-white text-black border-gray-300"
      }`}
    >
      Yes
    </Button>
    <Button
      type="button"
      onClick={() => handleChangeIsAnonymous(false)}
      className={`w-32 py-2 rounded-md border ${
        !isAnonymous ? "bg-gray-200 text-black border-black" : "bg-white text-black border-gray-300"
      }`}
    >
      No
    </Button>
  </div>
</div>


                </div>
            </div>
            {/* {!isAnonymous && (
                <div className="flex flex-col w-full md:w-1/2 space-y-6 p-6 bg-gray-50 rounded self-start"> */}
                    {!isAnonymous && (
//  <div className="flex flex-col w-full md:w-1/2 space-y-6 p-6 bg-white  border-l   border-black shadow-sm self-start">
<div 

className="flex flex-col w-full md:w-1/2 space-y-6 p-6 bg-white border-l  border-black shadow-none self-start pl-6">
  {/* תוכן הטופס */}


    <h2 className="text-xl font-semibold mb-4">A few more details and you're set</h2>

                    <div>
                        <Label>Full Name *</Label>
                        <Input
                            type="text"
                            value={fullName}
                            placeholder='Full Name'
                            onBlur={handleNameBlur}
                            onChange={handleChangeFullName}
                            className={`bg-white text-black border p-3 w-full ${nameError ? "border-red-700" : "border-gray-300"}`}
                            ref={nameRef}
                        />
                        {nameError && (
                            <p className="text-red-700 font-semibold text-sm mt-1">
                                {nameError}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label>Email *</Label>
                        <Input
                            type="email"
                            value={email}
                            placeholder='Email'
                            onBlur={handleEmailBlur}
                            onChange={handleChangeEmail}
                            className={`bg-white text-black border p-3 w-full ${emailError ? "border-red-700" : "border-gray-300"}`}
                            ref={emailRef}
                        />
                        {emailError && (
                            <p className="text-red-700 font-semibold text-sm mt-1">
                                {emailError}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label>Phone</Label>
                        <Input
                            type="text"
                            placeholder='Phone'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-white text-black border border-gray-300 p-3 w-full"
                        />
                    </div>
                    <div>
                        <Label>Message</Label>
                        <textarea
                            className="w-full p-3 rounded border border-gray-300 bg-white text-black"
                            rows={4}
                            value={message}
                            placeholder='Your message to us'
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationForm;
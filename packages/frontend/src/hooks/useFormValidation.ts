// src/hooks/useFormValidation.ts
import {  useCallback } from "react";
import { typeDonation } from "@base-project/shared/dist/models/donations"; // וודא שהנתיב נכון

interface ErrorSetters {
    setAmountError: (msg: string) => void;
    setNameError: (msg: string) => void;
    setEmailError: (msg: string) => void;
    setBillingDayError: (msg: string) => void;
}

const useFormValidation = (
    customAmount: string,
    fullName: string,
    email: string,
    donationType: typeDonation,
    billingDay: number | '',
    isAnonymous: boolean,
    errorSetters: ErrorSetters
) => {
    const { setAmountError, setNameError, setEmailError, setBillingDayError } = errorSetters;

    const validateEmail = useCallback(async (emailValue: string): Promise<string> => {
        if (!emailValue.trim()) return "Required field";
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(emailValue)) {
            return "Invalid email format (e.g.: user@example.com)";
        }
        return "";
    }, []);

    const validateName = useCallback((nameValue: string): string => {
        if (!nameValue.trim()) return "Required field";
        const regex = /^[a-zA-Z\s-]+$/;
        if (!regex.test(nameValue)) return "Name can only contain English letters, spaces, and hyphens.";
        return "";
    }, []);

    const validateFormAndGetValidity = useCallback(async (): Promise<boolean> => {
        let currentAmountErr = "";
        const amountNum = parseFloat(customAmount);
        if (isNaN(amountNum) || amountNum <= 0) {
            currentAmountErr = "Please enter a valid amount";
        }
        setAmountError(currentAmountErr);

        let currentNameErr = "";
        let currentEmailErr = "";
        let currentBillingDayErr = "";

        if (!isAnonymous) {
            currentNameErr = validateName(fullName);
            setNameError(currentNameErr);

            currentEmailErr = email.trim() === "" ? "Required field" : await validateEmail(email);
            setEmailError(currentEmailErr);

            if (donationType === typeDonation.recurring) {
                if (!billingDay || billingDay < 1 || billingDay > 28) {
                    currentBillingDayErr = "Please select a valid day (1-28)";
                }
            }
            setBillingDayError(currentBillingDayErr);
        } else {
            setNameError("");
            setEmailError("");
            setBillingDayError("");
        }

        const formIsValid = !currentAmountErr &&
            (isAnonymous || (!currentNameErr && !currentEmailErr &&
                (donationType === typeDonation["one-time"] || (donationType === typeDonation.recurring && !currentBillingDayErr))));
        return formIsValid;
    }, [
        customAmount, isAnonymous, fullName, email, donationType, billingDay,
        validateEmail, validateName,
        setAmountError, setNameError, setEmailError, setBillingDayError
    ]);

    return {
        validateEmail,
        validateName,
        validateFormAndGetValidity,
    };
};

export default useFormValidation;
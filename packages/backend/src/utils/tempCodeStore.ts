// tempCodeStore.ts

interface VerificationCode {
    code: string;
    expiresAt: Date;
}

// Object to store verification codes. The key is the email, the value is a VerificationCode object.
const verificationCodes: { [email: string]: VerificationCode } = {};

// Verification code expiration time in minutes
const CODE_EXPIRATION_MINUTES = 10;

/**
 * Stores a verification code for a specific email with an expiration time.
 * @param email - The email address.
 * @param code - The verification code to store.
 */
export const storeCode = (email: string, code: string): void => {
    const expiresAt = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);
    verificationCodes[email] = { code, expiresAt };
    console.log(`Verification code ${code} stored for ${email}, expires at ${expiresAt.toISOString()}`);
};

/**
 * Retrieves a stored verification code for a given email, if it exists and is still valid.
 * @param email - The email address.
 * @returns VerificationCode | undefined - The code and expiration date, or undefined if not found or expired.
 */
export const retrieveCode = (email: string): VerificationCode | undefined => {
    const storedData = verificationCodes[email];
    if (storedData && new Date() < storedData.expiresAt) {
        return storedData;
    }
    // Delete expired or non-existing code
    if (storedData) {
        delete verificationCodes[email];
    }
    return undefined;
};

/**
 * Deletes a verification code after successful (or failed) use.
 * @param email - The email address.
 */
export const deleteCode = (email: string): void => {
    if (verificationCodes[email]) {
        delete verificationCodes[email];
        console.log(`Verification code for ${email} has been deleted.`);
    }
};

// עם הדפסים באנגלית


// Component for verifying an authentication code sent to email as part of password reset

import React, { useState } from 'react';
import axios from 'axios';

interface VerifyCodeProps {
  email: string; // The email to which the code was sent
  onCodeVerified: () => void; // Callback after successful verification (move to next step)
  onResendCode: (email: string) => void; // Callback to request a new code be sent
  onBackToForgot: () => void; // Callback to go back to the forgot password request page
}


const VerifyCode: React.FC<VerifyCodeProps> = ({ email, onCodeVerified, onResendCode, onBackToForgot }) => {
  // States for managing the verification code, messages, loading status, etc.
  const [code, setCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  // Handles submitting the code for verification to the server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/reset/verify-code', { email, code });

      setMessage(response.data.message || 'Code verified successfully!');
      setError('');
      onCodeVerified(); // Move to the next step in password reset

    } catch (err: any) {
      // Handle communication or server errors
      if (err.response) {
        setError(err.response.data.error || 'Failed to verify code. Please try again.');
      } else if (err.request) {
        setError('Could not connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred.');
      }
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  // Sends a request to resend a new verification code to the email
  const handleResendCode = async () => {
    setResendLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:3001/api/reset/request-reset', { email });
      setMessage('New verification code sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    // Responsive structure: outer container with adaptive padding for different screens
    <div className="min-h-[auto] flex flex-col items-center bg-background px-4 sm:px-6 lg:px-8 pt-24 pb-48 sm:pt-0 sm:pb-16 sm:min-h-screen">
      {/* Inner container for the form with max width settings and padding */}
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-8 p-0 sm:p-8 md:p-10 bg-card border border-border rounded-lg shadow-xl text-card-foreground">

        {/* Logo and title */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img
                src="/company_logo.png"
                alt="JustLaw Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">JustLaw</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Verify Code</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
            A verification code has been sent to **{email}**. Please enter it below.
          </p>
        </div>

        {/* Form for entering the verification code */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm sm:text-base font-medium mb-1 sm:mb-2">Verification Code:</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g.: 123456"
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || code.length === 0}
            className="w-full h-9 sm:h-10 px-4 py-2 sm:px-5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-md disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors text-base sm:text-lg"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        {/* Buttons for resending and going back */}
        <div className="flex justify-between items-center mt-4 sm:mt-6">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-primary hover:text-primary/90 text-sm sm:text-base underline disabled:text-primary/50 disabled:cursor-not-allowed"
          >
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </button>
          <button
            type="button"
            onClick={onBackToForgot}
            className="text-muted-foreground hover:text-foreground text-sm sm:text-base underline"
          >
            Back to Forgot Password page
          </button>
        </div>

        {/* Success and error messages */}
        {message && <p className="text-center text-green-600 mt-3 sm:mt-4 text-sm sm:text-base"> {message}</p>}
        {error && <p className="text-center text-white-600 mt-3 sm:mt-4 text-sm sm:text-base"> {error}</p>}
      </div>
    </div>
  );
};

export default VerifyCode;
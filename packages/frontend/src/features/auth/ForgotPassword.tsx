// קומפוננטה להזנת מייל לצורך שליחת קוד איפוס סיסמה


import React, { useState } from 'react';
import axios from 'axios';

interface ForgotPasswordProps {
  onCodeSent: (email: string) => void; // פונקציה לעדכון השלב הבא אחרי שליחת קוד
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onCodeSent }) => {
  const [email, setEmail] = useState<string>(''); // ערך שדה המייל
  const [message, setMessage] = useState<string>(''); // הודעת הצלחה
  const [error, setError] = useState<string>(''); // הודעת שגיאה
  const [isLoading, setIsLoading] = useState<boolean>(false); // מציין אם הבקשה נשלחת

  // שליחת בקשה לשרת לשלוח קוד איפוס
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/reset/request-reset', { email });

      setMessage(response.data.message || 'Verification code sent to your email.');
      setError('');
      onCodeSent(email); // מעבר לשלב הבא (אימות קוד)
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to request password reset. Please try again.');
      } else if (err.request) {
        setError('Could not connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred.');
      }
      setMessage('');
    } finally {
      setIsLoading(false); // סיום טעינה
    }
  };

  return (
    // קונטיינר ראשי עם רספונסיביות
    <div className="min-h-[auto] flex flex-col items-center bg-background px-4 sm:px-6 lg:px-8 pt-24 pb-52 sm:pt-0 sm:pb-16 sm:min-h-screen">
      {/* קופסת הטופס עם עיצוב וגבול */}
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-8 p-0 sm:p-8 md:p-10 bg-card border border-border rounded-lg shadow-xl text-card-foreground">

        {/* לוגו + כותרת */}
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
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Forgot Password</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
            Please enter your email address below to receive a verification code.
          </p>
        </div>

        {/* טופס שליחת המייל */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm sm:text-base font-medium mb-1 sm:mb-2">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // עדכון ערך המייל
              placeholder="e.g., example@domain.com"
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
            />
          </div>

          {/* כפתור שליחה */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 sm:h-10 px-4 py-2 sm:px-5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-md disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors text-base sm:text-lg"
          >
            {isLoading ? 'Sending Request...' : 'Send Verification Code'}
          </button>
        </form>

        {/* הודעות הצלחה/שגיאה */}
        {message && <p className="text-center text-green-600 mt-3 sm:mt-4 text-sm sm:text-base"> {message}</p>}
        {error && <p className="text-center text-'white'-600 mt-3 sm:mt-4 text-sm sm:text-base"> {error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;

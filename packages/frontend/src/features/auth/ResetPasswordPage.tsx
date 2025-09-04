// קומפוננטת דף איפוס סיסמה - ניהול שלבי תהליך האיפוס (שליחה, אימות, סיסמה חדשה, הצלחה)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import VerifyCode from './VerifyCode';
import SetNewPassword from './SetNewPassword';

// סוג לשלבים השונים בתהליך האיפוס
type ResetPasswordStep = 'request' | 'verifyCode' | 'setNewPassword' | 'success';

function ResetPasswordPage() {
  // שלב נוכחי בתהליך
  const [currentStep, setCurrentStep] = useState<ResetPasswordStep>('request');

  // אימייל של המשתמש שנשלח לו קוד
  const [emailForReset, setEmailForReset] = useState<string>('');

  const navigate = useNavigate();

  // מעבר לשלב אימות קוד
  const handleCodeSent = (email: string) => {
    setEmailForReset(email);
    setCurrentStep('verifyCode');
  };

  // מעבר לשלב הגדרת סיסמה חדשה
  const handleCodeVerified = () => {
    setCurrentStep('setNewPassword');
  };

  // מעבר לשלב הצלחה
  const handlePasswordReset = () => {
    setCurrentStep('success');
  };

  return (
    // מעטפת רספונסיבית לכל הדף
    <div className="min-h-[auto] sm:min-h-screen flex flex-col items-center sm:justify-center bg-background px-4 sm:px-6 lg:px-8 pt-0 pb-0 sm:pt-0 sm:pb-8">
      <div className="w-full flex justify-center">

        {/* שלב ראשון: שליחת בקשה לאיפוס סיסמה */}
        {currentStep === 'request' && (
          <ForgotPassword onCodeSent={handleCodeSent} />
        )}

        {/* שלב שני: הזנת קוד שנשלח למייל */}
        {currentStep === 'verifyCode' && (
          <VerifyCode
            email={emailForReset}
            onCodeVerified={handleCodeVerified}
            onResendCode={handleCodeSent}
            onBackToForgot={() => setCurrentStep('request')}
          />
        )}

        {/* שלב שלישי: הזנת סיסמה חדשה */}
        {currentStep === 'setNewPassword' && (
          <SetNewPassword
            email={emailForReset}
            onPasswordReset={handlePasswordReset}
          />
        )}

        {/* שלב רביעי: הודעה על הצלחת שינוי הסיסמה */}
        {currentStep === 'success' && (
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg space-y-6 sm:space-y-8 p-8 sm:p-8 md:p-10 bg-card border border-border rounded-lg shadow-xl text-card-foreground mt-16 mb-32">

            {/* כותרת עם לוגו והודעת הצלחה */}
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
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-green-500">Password Reset Successful!</h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
            </div>
            {/* סיום כותרת */}

            {/* כפתור מעבר לדף התחברות */}
            <button
              onClick={() => navigate('/login')}
              className="w-full h-9 sm:h-10 px-4 py-2 sm:px-5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors text-base sm:text-lg"
            >
              
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;

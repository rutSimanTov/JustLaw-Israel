// קומפוננטה להזנת סיסמה חדשה כחלק מתהליך איפוס סיסמה

import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // <--- ודאי שזו השורה הזו (או הוסיפי אותה)


// ביטוי רגולרי לבדיקה שהסיסמה עומדת בדרישות חוזק
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

interface SetNewPasswordProps {
  email: string; // כתובת האימייל של המשתמש
  onPasswordReset: () => void; // פעולה לביצוע לאחר איפוס מוצלח
}

const SetNewPassword: React.FC<SetNewPasswordProps> = ({ email, onPasswordReset }) => {
  // סטייטים להזנת סיסמאות, הודעות שגיאה, טעינה וכו'
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);


    // <--- הוספות חדשות כאן
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);     // סטייט לסיסמה החדשה
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); // סטייט לאימות הסיסמה


  // פונקציה לבדיקת חוזק הסיסמה ולשליחת הודעה מתאימה
  const getPasswordStrengthError = (password: string): string => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must include at least one lowercase letter.';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must include at least one uppercase letter.';
    if (!/(?=.*\d)/.test(password)) return 'Password must include at least one number.';
    if (!/(?=.*[!@#$%^&*()_+])/.test(password)) return 'Password must include at least one special character (!@#$%^&*()_+).';
    return '';
  };


    // פונקציות אלו משנות את הסטייט של הצגת הסיסמה בין true ל-false
  const toggleNewPasswordVisibility = () => { // <--- הוספה זו
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => { // <--- הוספה זו
    setShowConfirmPassword(!showConfirmPassword);
  };

  // שליחת הטופס לשרת לאיפוס סיסמה
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      setIsLoading(false);
      return;
    }

    const strengthError = getPasswordStrengthError(newPassword);
    if (strengthError) {
      setError(strengthError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/reset/reset-password', {
        email,
        newPassword
      });

      setMessage(response.data.message || 'Your password has been successfully reset!');
      setError('');
      onPasswordReset(); // מעבר לשלב הבא
    } catch (err: any) {
      // טיפול בשגיאות מהשרת או מתקשורת
      if (err.response) {
        setError(err.response.data.error || 'Failed to set new password. Please try again.');
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

  return (
    // תצוגה רספונסיבית של טופס איפוס הסיסמה
    <div className="min-h-[auto] flex flex-col items-center bg-background px-4 sm:px-6 lg:px-8 pt-8 pb-52 sm:pt-0 sm:pb-16 sm:min-h-screen">
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-8 p-0 sm:p-8 md:p-10 bg-card border border-border rounded-lg shadow-xl text-card-foreground">

        {/* לוגו וכותרת הדף */}
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
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Set New Password</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
            Please enter and confirm your new password for <strong>{email}</strong>.
          </p>
        </div>

        {/* דרישות סיסמה */}
        <p className="text-sm sm:text-base text-muted-foreground mb-4 text-center">
          <strong>Password Requirements:</strong> At least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*()_+).
        </p>

        {/* טופס להזנת הסיסמה החדשה */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
 {/* **התחלת קטע קוד ל-New Password** */}
          <div>
            <label htmlFor="newPassword" className="block text-sm sm:text-base font-medium mb-1 sm:mb-2">New Password:</label>
            <div style={{ position: 'relative' }}> {/* עוטף את האינפוט והכפתור */}
              <input
                // <--- שינוי חשוב כאן: סוג האינפוט תלוי בסטייט showNewPassword
                type={showNewPassword ? 'text' : 'password'} 
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                // <--- הוספת padding-right (pr-10) כדי לפנות מקום לאייקון
                className="w-full pr-10 px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
              />
              {/* <--- כפתור/אייקון העין עבור New Password */}
              <button
                type="button" 
                onClick={toggleNewPasswordVisibility} // מפעיל את הפונקציה המתאימה
                style={{
                  position: 'absolute', 
                  right: '10px',        
                  top: '50%',           
                  transform: 'translateY(-50%)', 
                  background: 'none',   
                  border: 'none',       
                  cursor: 'pointer',    
                  padding: '0',
                  color: 'gray' // צבע את האייקון לאפור כדי להתאים לעיצוב
                }}
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {/* הצגת אייקון עין פתוחה או סגורה */}
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {/* **סוף קטע קוד ל-New Password** */}
  {/* **התחלת קטע קוד ל-Confirm New Password** */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-medium mb-1 sm:mb-2">Confirm New Password:</label>
            <div style={{ position: 'relative' }}> {/* עוטף את האינפוט והכפתור */}
              <input
                // <--- שינוי חשוב כאן: סוג האינפוט תלוי בסטייט showConfirmPassword
                type={showConfirmPassword ? 'text' : 'password'} 
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
                // <--- הוספת padding-right (pr-10) כדי לפנות מקום לאייקון
                className="w-full pr-10 px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
              />
              {/* <--- כפתור/אייקון העין עבור Confirm New Password */}
              <button
                type="button" 
                onClick={toggleConfirmPasswordVisibility} // מפעיל את הפונקציה המתאימה
                style={{
                  position: 'absolute', 
                  right: '10px',        
                  top: '50%',           
                  transform: 'translateY(-50%)', 
                  background: 'none',   
                  border: 'none',       
                  cursor: 'pointer',    
                  padding: '0',
                  color: 'gray' // צבע את האייקון לאפור כדי להתאים לעיצוב
                }}
                aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
              >
                {/* הצגת אייקון עין פתוחה או סגורה */}
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {/* **סוף קטע קוד ל-Confirm New Password** */}

          {/* כפתור שליחה */}
          <button
            type="submit"
            disabled={isLoading || !newPassword || newPassword !== confirmPassword || !passwordRegex.test(newPassword)}
            className="w-full h-9 sm:h-10 px-4 py-2 sm:px-5 sm:py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-md disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors text-base sm:text-lg"
          >
            {isLoading ? 'Setting Password...' : 'Set New Password'}
          </button>
        </form>

        {/* הודעות הצלחה או שגיאה */}
        {message && <p className="text-center text-green-600 mt-3 sm:mt-4 text-sm sm:text-base"> {message}</p>}
        {error && <p className="text-center text-white-600 mt-3 sm:mt-4 text-sm sm:text-base"> {error}</p>}
      </div>
    </div>
  );
};

export default SetNewPassword;

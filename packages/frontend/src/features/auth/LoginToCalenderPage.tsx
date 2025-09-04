import React, { useState } from 'react';
import GoogleCalendarAccessPage from '../../components/Button/GoogleCalendarAccessPage';

/**
 * This page allows the user to sign in to Google Calendar using OAuth.
 * After successful login, the user is redirected to the "Add Event" page.
 */
interface Props {
  onLogin: (generalAccessToken: string | null) => void;
}
const LoginToCalenderPage: React.FC<Props> = ({ onLogin }) => {
  const [message, ] = useState<string | null>(null); // Optional message to display
  const [error, ] = useState<string | null>(null);     // Optional error to display

  /**
   * This function is called after successful login.
   * It navigates the user to the "Add Event" page.
   */
  const handleLoginSuccess = () => {
    console.log("Login successful! Navigating to home.");
    onLogin(localStorage.getItem('googleCalendarAccessToken'))
  };

  return (
    <div className="h-[50vh] flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full space-y-8">
        {/* Page title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign in to your calendar</h2>
        </div>

        {/* Google sign-in button */}
        <div className="text-center">
          <GoogleCalendarAccessPage onLoginSuccess={handleLoginSuccess} />
        </div>

        {/* Show message if available */}
        {message && (
          <div className="text-center text-white font-bold"> {message}</div>
        )}

        {/* Show error if available */}
        {error && (
          <div className="text-center text-white font-bold"> {error}</div>
        )}
      </div>
    </div>
  );
}

export default LoginToCalenderPage;

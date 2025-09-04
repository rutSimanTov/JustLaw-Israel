import React, { useEffect } from 'react';

/**
 * This component renders a button that lets the user sign in with Google
 * and give permission to access their Google Calendar.
 *
 * When the user clicks the button, a Google OAuth flow starts,
 * and if successful, the access token is stored in localStorage.
 */
const GoogleCalendarAccessPage = ({ onLoginSuccess }) => {
  useEffect(() => {
    /**
     * Loads Google's OAuth2 script dynamically.
     * When the script finishes loading, it calls the init function.
     */
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => initGoogleOAuth();
    };

    /**
     * Initializes the Google OAuth2 client.
     * Sets up the button to trigger the OAuth2 access token request.
     */
    const initGoogleOAuth = () => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: '198388485493-734husv9s3smoj8na951thts9ph8v1kf.apps.googleusercontent.com', 
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.events', 
          callback: async (tokenResponse) => {
            const accessToken = tokenResponse.access_token;
            const expiresIn = tokenResponse.expires_in; 
            console.log('✅ get access token:', accessToken);
            
            // Store the access token in localStorage
            localStorage.setItem('googleCalendarAccessToken', accessToken);
          if (expiresIn) {
              const expiryTime = Date.now() + expiresIn * 1000;
              localStorage.setItem('googleCalendarAccessTokenExpiry', expiryTime.toString());
            }
            // Call a callback if provided (e.g. to move to the next step in the app)
            if (onLoginSuccess) onLoginSuccess();
          },
        });

        // When the user clicks the button, request an access token
        document.getElementById('google-calendar-login-btn')?.addEventListener('click', () => {
          tokenClient.requestAccessToken();
        });
      }
    };

    // Load the Google OAuth script when the component mounts
    loadGoogleScript();
  }, [onLoginSuccess]);

  return (
    <button
      id="google-calendar-login-btn"
      className="w-full h-10 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-md"
    >
      Sign in with Google (Calendar Access)
    </button>
  );
};

export default GoogleCalendarAccessPage;


import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../../components/Button/GoogleSignInButton';
import DoneIcon from '@mui/icons-material/Done';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // וודאי שזו השורה!



function LoginPage() {
  // const [username, setUsername] = useState(''); // Not currently in use
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null); // Success message
  const [error, setError] = useState<string | null>(null); // Error message
  const [loading, setLoading] = useState(false); // Is loading
  const [blockedFor, setBlockedFor] = useState<number | null>(null); // Seconds until block ends
  const [blockedEmail, setBlockedEmail] = useState<string | null>(null); // Blocked email for timer display
  // const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null); // Number of attempts left
  const [showPassword, setShowPassword] = useState(false); // <--- הוספה זו: סטייט לשליטה בהצגת הסיסמה
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();

  // Reset timer/messages when email changes
  useEffect(() => {
    setBlockedFor(null);
    setBlockedEmail(null);
    setError(null);
    // setAttemptsLeft(null);
  }, [email]);

  // Block timer updates only if blockedFor exists
  useEffect(() => {
    if (blockedFor && blockedFor > 0) {
      if (timerRef.current) clearInterval(timerRef.current); // Clear previous timer
      timerRef.current = setInterval(() => {
        setBlockedFor((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else if (blockedFor === 0) {
      setError(null);
      setBlockedFor(null);
      setBlockedEmail(null);
      // setAttemptsLeft(null);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [blockedFor]);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const handleLoginSuccess = () => {
    console.log("Login successful! Navigating to home.");
    navigate('/'); // Navigate to home page after successful login
  };

  // פונקציה זו משנה את הסטייט showPassword בין true ל-false בכל לחיצה
  const togglePasswordVisibility = () => { // <--- הוספה זו
    setShowPassword(!showPassword);
  };


  // Submit form to server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    // setAttemptsLeft(null);
    // Don't reset blockedFor/blockedEmail here to show timer after a blocked attempt

    if (!email || !password) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle all server statuses
        if (data.blockedFor) {
          setBlockedFor(data.blockedFor);
          setBlockedEmail(email); // Save the blocked email
          setError(
            data.error + (data.blockedFor > 0 ? `\nPlease try again in ${formatTime(data.blockedFor)} (mm:ss)` : '')
          );
        } else {
          // Handle specific server errors
          if (response.status === 401) {
            // שרהלה
            // Check if it's a user not found error or incorrect password
            if (data.error && data.error.includes('does not exist')) {
              setError('User not registered in the system.');
            } else {
              // שרהלה
              // Show the exact error message from server instead of generic message
              setError(data.error || 'Incorrect email or password.');
            }
          }
          else if (response.status === 403 && data?.error === 'AccountBlocked') setError('Your account is blocked. Please contact the administrator.');
          else if (response.status === 403 && data?.error === 'TokenExpired') setError('Your session has expired. Please log in again.');
          else if (response.status >= 500) setError('Server error. Please try again later.');
          else setError(data.error || 'An unknown error occurred during login.');
        }
        // setAttemptsLeft(data.attemptsLeft ?? null);
      } else {
        // Successful login
        setMessage('Successfully logged in!');
        // setUsername('');
        setEmail('');
        setPassword('');
        setBlockedFor(null);
        setBlockedEmail(null);
        // setAttemptsLeft(null);

        // Save user data to localStorage
        localStorage.setItem('jwtToken', data.token);
        if (data.user) {
          localStorage.setItem('userId', data.user.id);
          localStorage.setItem('userName', data.user.username);
          localStorage.setItem('userEmail', data.user.email);
        }

        setTimeout(() => navigate('/'), 2000); // Navigate home after a short delay
      }
    } catch (err) {
      setError('Server connection error. Please ensure the server is running.'); // Communication error
    } finally {
      setLoading(false); // End loading
    }
  };







  return (
    // Responsive page structure
    <div className="min-h-screen flex flex-col items-center bg-background px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-8 sm:pb-12">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-screen-md 2xl:max-w-screen-lg space-y-6 sm:space-y-8 p-6 sm:p-8 md:p-10 rounded-lg shadow-xl bg-card text-card-foreground">

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
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Sign in to your account</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Welcome back to JustLaw</p>
        </div>

        {/* Login form */}
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 sm:mb-2">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

     {/* **התחלת קטע קוד הסיסמה המעודכן** */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 sm:mb-2">Password</label>
            {/* עוטף את שדה הסיסמה ואת כפתור העין כדי למקם את הכפתור בתוכו */}
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                // <--- שינוי חשוב כאן: סוג האינפוט תלוי בסטייט showPassword
                type={showPassword ? 'text' : 'password'} 
                required
                // <--- הוספת padding-right (pr-10) כדי לפנות מקום לאייקון העין
                className="w-full pr-10 px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <--- כפתור/אייקון העין החדש */}
              <button
                type="button" // חשוב: type="button" כדי למנוע שליחת טופס בלחיצה על הכפתור
                onClick={togglePasswordVisibility} // מפעיל את פונקציית החשיפה/הסתרה
                style={{
                  position: 'absolute', // מיקום אבסולוטי בתוך ה-div העוטף
                  right: '10px',        // 10px מהקצה הימני
                  top: '50%',           // 50% מהחלק העליון
                  transform: 'translateY(-50%)', // ממקם במדויק באמצע אנכית
                  background: 'none',   // ללא רקע
                  border: 'none',       // ללא גבול
                  cursor: 'pointer',    // סמן עכבר כ-pointer בלחיצה
                  padding: '0'          // ללא ריפוד פנימי
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'} // חשוב לנגישות
              >
                {/* הצגת אייקון עין פתוחה או סגורה בהתאם לסטייט showPassword */}
                {showPassword ? <FaEyeSlash /> : <FaEye />}
                {/* אם אין לך react-icons, תוכלי להשתמש בטקסט פשוט: */}
                {/* {showPassword ? 'Hide' : 'Show'} */}
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/reset-password')} // Navigate to reset password page
              className="mt-1 sm:mt-2 text-primary hover:text-primary/90 text-xs sm:text-sm underline"
            >
              Forgot password?
            </button>
          </div>
          {/* **סוף קטע קוד הסיסמה המעודכן** */}


          {/* Sign in button */}
          <button
            type="submit"
            disabled={loading || !email || !password || (blockedFor !== null && blockedFor > 0 && blockedEmail === email)}
            className="w-full h-9 sm:h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-colors duration-200 text-base sm:text-lg"
          >
            {loading ? 'Loading...' : 'Sign in'}
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="text-center">
          <GoogleSignInButton onLoginSuccess={handleLoginSuccess} />
        </div>

        {/* Success or error messages */}
        {message && (
          <div className="text-center font-bold text-sm sm:text-base" style={{ color: 'white', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <DoneIcon style={{ color: 'white', fontSize: 28, verticalAlign: 'middle' }} />
            {message}
          </div>
        )}
        {(blockedFor && blockedEmail === email && blockedFor > 0) ? (
          <div className="text-center font-bold text-sm sm:text-base" style={{ color: 'white', marginTop: '15px', whiteSpace: 'pre-line' }}>
            Your account has been temporarily locked
            <div className="mt-2">Please try again in {formatTime(blockedFor)} (mm:ss)</div>
          </div>
        ) : (
          error && (
            <div
              className="text-center font-bold text-sm sm:text-base"
              style={
                error && (error.includes('Server connection error') || error.includes('Server error'))
                  ? { color: 'red', marginTop: '15px', whiteSpace: 'pre-line' }
                  : { color: 'white', marginTop: '15px', whiteSpace: 'pre-line' }
              }
            >
              {error}
            </div>
          )
        )}

        {/* Sign up link */}
        <div className="text-center text-sm sm:text-base">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-primary hover:text-primary/90"
          >
            Don't have an account? Sign up
          </button>
        </div>

        {/* Back to Home button */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 sm:h-10 px-4 py-2 w-full rounded-md text-muted-foreground transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
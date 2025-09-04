
//בלי ררוחים מלמעלה ומלמטה
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // <--- הוספה זו


function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // <--- הוספה זו: סטייט לשליטה בהצגת הסיסמה


  const navigate = useNavigate();


  // Regex for strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Helper function for detailed password strength error messages
  const getPasswordStrengthError = (pwd: string): string => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return 'Password must include at least one lowercase letter.';
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return 'Password must include at least one uppercase letter.';
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return 'Password must include at least one number.';
    }
    if (!/(?=.*[!@#$%^&*()_+])/.test(pwd)) {
      return 'Password must include at least one special character (!@#$%^&*()_+).';
    }
    return ''; // No error
  };


  // פונקציה זו משנה את הסטייט showPassword בין true ל-false בכל לחיצה
  const togglePasswordVisibility = () => { // <--- הוספה זו
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Check if all fields are filled
    if (!username || !email || !password) {
      setError('Please fill in username, email, and password.');
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      return;
    }

    // Validate password strength using the helper function
    const passwordStrengthError = getPasswordStrengthError(password);
    if (passwordStrengthError) {
      setError(passwordStrengthError);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'General registration error');
      } else {
        setMessage('Registration successful!');
        setUsername('');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          navigate('/login');
        }, 2000); // 2000 milliseconds = 2 seconds

      }
    } catch (err) {
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  // Determine if the form is valid to enable the button (beyond just filled fields)
  // This now includes the full password regex validation
  const isFormValid = username && emailRegex.test(email) && passwordRegex.test(password);

  return (
    // Changed pb-8 sm:pb-12 to pb-4 sm:pb-8 to reduce bottom padding for mobile.
    // The top padding (pt-4 sm:pt-8) remains the same for consistency with the LoginPage.
    <div className="min-h-screen flex flex-col items-center bg-background px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-8">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-screen-md 2xl:max-w-screen-lg space-y-5 sm:space-y-7 p-6 sm:p-8 md:p-10 rounded-lg shadow-xl bg-card text-card-foreground">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img
                src="/company_logo.png"
                alt="JustLaw Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">JustLaw</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">Create your account</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Join JustLaw today!</p>
        </div>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1 sm:mb-2">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 sm:mb-2">Email:</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
              placeholder="Enter your email"
            />
          </div>
        {/* **התחלת קטע קוד הסיסמה המעודכן** */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 sm:mb-2">Password:</label>
            {/* עוטף את שדה הסיסמה ואת כפתור העין כדי למקם את הכפתור בתוכו */}
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                // <--- שינוי חשוב כאן: סוג האינפוט תלוי בסטייט showPassword
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // <--- הוספת padding-right (pr-10) כדי לפנות מקום לאייקון העין
                className="w-full pr-10 px-3 py-2 sm:px-4 sm:py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-base sm:text-lg"
                placeholder="Create a strong password"
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
                  padding: '0',         // ללא ריפוד פנימי
                  color: 'gray'         // צבע את האייקון לאפור כדי להתאים לעיצוב
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'} // חשוב לנגישות
              >
                {/* הצגת אייקון עין פתוחה או סגורה בהתאם לסטייט showPassword */}
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
              Password must be at least 8 characters, with uppercase, lowercase, number, and special character.
            </p>
          </div>
          {/* **סוף קטע קוד הסיסמה המעודכן** */}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full h-9 sm:h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors duration-200 text-base sm:text-lg"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>

        {message && (
          <div className="text-center text-green-500 font-semibold text-sm sm:text-base mt-3 sm:mt-4">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-semibold text-sm sm:text-base mt-3 sm:mt-4">
            ❌ {error}
          </div>
        )}

        <div className="text-center text-sm sm:text-base mt-4 sm:mt-6">
          <button type="button"
            onClick={() => navigate('/login')}
            className="text-primary hover:text-primary/90">
            Already have an account? Sign in
          </button>
        </div>
        <div className="text-center mt-3 sm:mt-4">
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

export default RegisterPage;


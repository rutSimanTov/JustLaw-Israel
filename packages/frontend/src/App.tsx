// import React, { useState, useEffect } from 'react';
// import './App.css';
// import { apiService } from './services/api';
// import Home from './pages/Home';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [healthStatus, setHealthStatus] = useState<string>('checking...');

//     const checkHealth = async () => {
//     try {
//       const health = await apiService.checkHealth();
//       setHealthStatus(health.success ? 'healthy' : 'unhealthy');
//     } catch (err) {
//       setHealthStatus('unhealthy');
//     }
//   };

//   useEffect(() => {
//     checkHealth();
//   }, []);

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('jwtToken');
//       setIsLoggedIn(!!token);
//     };
//     checkAuth();
//     window.addEventListener('storage', checkAuth);
//     const interval = setInterval(checkAuth, 500);
//     return () => {
//       window.removeEventListener('storage', checkAuth);
//       clearInterval(interval);
//     };
//   }, [setIsLoggedIn,isLoggedIn]);
   
//   return (
//     <div className="App">
//       {healthStatus==='healthy'&&<Home />}
//     </div>
   
//   );
// }
// export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import { apiService } from './services/api';
import Home from './pages/Home';
const LoadingDots: React.FC = () => (
    <div className="flex justify-center items-center gap-3 py-10">
        {[0, 1, 2].map((i) => (
            <span key={i} className="dot" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
        <style>{`
      .dot {
        width: 12px;
        height: 12px;
        background-color: white;
        border-radius: 50%;
        transform: scale(1);
        animation: pulseScale 1.2s infinite ease-in-out;
      }
      @keyframes pulseScale {
        0%, 100% {
          transform: scale(0.8);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.8);
          opacity: 1;
        }
      }
    `}</style>
    </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string>('checking...');

  const checkHealth = async (interval = 2000, maxAttempts = 10) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const health = await apiService.checkHealth();
        if (health.success) {
          setHealthStatus('healthy');
          return; // יציאה מהלולאה אם השרת פעיל
        }
      } catch (err) {
        // במקרה של שגיאה, לא עושים כלום
      }
      setHealthStatus('checking...');
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    setHealthStatus('unhealthy'); // אם לא הצלחנו להתחבר לאחר מספר ניסיונות
  };

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwtToken');
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 200);
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, [setIsLoggedIn, isLoggedIn]);

  return (
    <div className="App">
      {healthStatus === 'healthy' ?( <Home />)
      :(<LoadingDots/>)}
    </div>
  );
}

export default App;

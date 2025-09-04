import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ניקוי כל הנתונים מה-localStorage
    const userId = localStorage.getItem('userId');
    // ניקוי נתוני פרופיל אם יש
    if (userId) {
      const draftKey = `profile_form_draft_${userId}`;
      localStorage.removeItem(draftKey);
      localStorage.removeItem(`${draftKey}_last_saved`);
      localStorage.removeItem(`${draftKey}_backup`);
      localStorage.removeItem(`${draftKey}_deleted`);
      console.log(`🗑️ נוקה נתוני פרופיל בעת logout עבור ${draftKey}`);
    }
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    // הפניה חזרה לדף התחברות
    navigate('/login');
  }, [navigate]);

  return null; // אין צורך ברנדר, הכל קורה אוטומטית
};

export default Logout;

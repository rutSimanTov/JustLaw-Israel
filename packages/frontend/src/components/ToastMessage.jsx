import React from 'react';
import ReactDOM from 'react-dom';

// קומפוננטת ToastMessage להצגת הודעות קופצות (טוסטים) למשתמש.
// מקבלת: message (תוכן ההודעה), type (סוג ההודעה: 'success', 'error', 'default'),
// isFirstLogin (האם זו התחברות ראשונה, משנה סגנון), onClose (פונקציה לסגירת הטוסט).
const ToastMessage = ({ message, type, isFirstLogin, onClose }) => {
    // אם אין הודעה, הקומפוננטה לא מציגה דבר.
    if (!message) {
        return null;
    }

    // הגדרות סגנון בסיסיות לאלמנט הטוסט.
    const toastStyle = {
        position: 'fixed', // ממוקם באופן קבוע על המסך.
        bottom: '20px',    // 20 פיקסלים מהחלק התחתון.
        right: '20px',     // 20 פיקסלים מהצד הימני.
        padding: '15px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        textAlign: 'right', // יישור טקסט לימין (עבור עברית).
        maxWidth: '300px',
        zIndex: 1000,      // וודא שהטוסט יופיע מעל אלמנטים אחרים.
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        direction: 'rtl',  // כיוון כתיבה מימין לשמאל (עבור עברית).
    };

    // התאמת סגנון הטוסט בהתאם לסוג ההודעה (success, error, default).
    switch (type) {
        case 'success':
            // צבעים שונים להצלחה, עם התאמה מיוחדת להתחברות ראשונה.
            toastStyle.backgroundColor = isFirstLogin ? '#e6f7ff' : '#d4edda';
            toastStyle.color = isFirstLogin ? '#0056b3' : '#155724';
            toastStyle.border = isFirstLogin ? '1px solid #99daff' : '1px solid #c3e6cb';
            break;
        case 'error':
            // צבעים אדומים לשגיאה.
            toastStyle.backgroundColor = '#f8d7da';
            toastStyle.color = '#721c24';
            toastStyle.border = '1px solid #f5c6cb';
            break;
        default:
            // צבעים ניטרליים לסוג ברירת מחדל.
            toastStyle.backgroundColor = '#f0f0f0';
            toastStyle.color = '#333';
            toastStyle.border = '1px solid #ccc';
    }

    // סגנון כפתור הסגירה של הטוסט.
    const closeButtonStyle = {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        fontWeight: 'bold',
        color: toastStyle.color, // צבע הכפתור זהה לצבע הטקסט של הטוסט.
        marginLeft: '10px',
        padding: '0',
        lineHeight: '1',
    };

    // שימוש ב-ReactDOM.createPortal כדי לרנדר את הטוסט מחוץ להיררכיית ה-DOM הרגילה של הקומפוננטה,
    // ישירות לתוך ה-body של המסמך. זה מבטיח שהטוסט תמיד יהיה מעל שאר התוכן.
    return ReactDOM.createPortal(
        <div style={toastStyle}>
            {/* **השינוי כאן: שימוש ב-dangerouslySetInnerHTML** */}
            {/* מאפשר להציג תוכן HTML בתוך ההודעה. יש לנקוט בזהירות רבה עם זה כדי למנוע התקפות XSS. */}
            <span dangerouslySetInnerHTML={{ __html: message }}></span>
            {/* כפתור סגירה עם אירוע לחיצה שמפעיל את פונקציית onClose. */}
            <button onClick={onClose} style={closeButtonStyle}>
                &times; {/* תו X לסגירה */}
            </button>
        </div>,
        document.body // האלמנט שאליו הטוסט ירונדר.
    );
};

export default ToastMessage; // ייצוא הקומפוננטה לשימוש בקבצים אחרים.
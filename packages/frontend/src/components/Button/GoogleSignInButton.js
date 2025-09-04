
// import React, { useEffect, useRef, useState } from 'react';
// import ToastMessage from '../ToastMessage.jsx'; // ודאי שהנתיב הזה תקין, כולל ה-.jsx בסוף

// const GoogleSignInButton = ({ onLoginSuccess }) => {
//     const googleButtonRef = useRef(null);
//     const [message, setMessage] = useState('');
//     const [isFirstLogin, setIsFirstLogin] = useState(false);
//     const [messageType, setMessageType] = useState('');

//     console.log("Current message state:", message, messageType, isFirstLogin);

//     // אפקט React לטיפול בהיעלמות ההודעה (זה של הטוסט עצמו)
//     useEffect(() => {
//         let timer;
//         if (message) {
//             timer = setTimeout(() => {
//                 handleCloseMessage();
//             }, 10000);
//         }

//         return () => {
//             if (timer) {
//                 clearTimeout(timer);
//             }
//         };
//     }, [message]);

//     // פונקציה לסגירת ההודעה
//     const handleCloseMessage = () => {
//         setMessage('');
//         setIsFirstLogin(false);
//         setMessageType('');
//     };

//     useEffect(() => {
//         if (window.google) {
//             window.handleCredentialResponse = async (response) => {
//                 const idToken = response.credential;
//                 console.log("Received ID Token from Google:", idToken);

//                 handleCloseMessage();

//                 try {
//                     const res = await fetch('http://localhost:3001/auth/google', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ token: idToken }),
//                     });

//                     const data = await res.json();
//                     console.log('Server response (Backend):', data);

//                     if (data.success) {
//                         if (data.token) {
//                             localStorage.setItem('jwtToken', data.token);
//                             console.log('JWT Token saved to localStorage.');

//                             localStorage.setItem('userId', data.user.id);
//                             localStorage.setItem('userEmail', data.user.email);
//                             localStorage.setItem('userName', data.user.username);
//                         }

//                         const user = data.user;

//                         // **השינוי כאן: כל הטקסט באנגלית**
//                         setMessage(
//                             `Welcome, ${user.username}! If this is your first time here, your password is your email. ` +
//                             `It is highly recommended that you reset your password and choose a more secure one. ` +
//                             `<a href="/reset-password" style="color: #0056b3; text-decoration: underline; font-weight: bold;">Click here to reset your password</a>`
//                         );
//                         setIsFirstLogin(true); // או false, לפי העדפה לצבע הטוסט
//                         setMessageType('success');


//                         setTimeout(() => {
//                             if (onLoginSuccess) {
//                                 onLoginSuccess();
//                             }
//                         }, 10000);

//                     } else {
//                         console.error('Login failed (Server responded with error):', data.message);
//                         setMessage('Login failed: ' + data.message); // גם הודעת שגיאה באנגלית
//                         setMessageType('error');
//                         setIsFirstLogin(false);

//                         setTimeout(() => {
//                             if (onLoginSuccess) {
//                                 onLoginSuccess();
//                             }
//                         }, 5000);
//                     }
//                 } catch (error) {
//                     console.error('Error during Google login process (Frontend fetch):', error);
//                     setMessage('An error occurred during login. Please try again.'); // וגם כאן
//                     setMessageType('error');
//                     setIsFirstLogin(false);

//                     setTimeout(() => {
//                         if (onLoginSuccess) {
//                             onLoginSuccess();
//                         }
//                     }, 5000);
//                 }
//             };

//             window.google.accounts.id.initialize({
//                 client_id: "942278766033-h1531cin8bhufben94gkrivkvh4a08s9.apps.googleusercontent.com",
//                 callback: window.handleCredentialResponse,
//             });

//             window.google.accounts.id.renderButton(
//                 googleButtonRef.current,
//                 {
//                     theme: "outline",
//                     size: "large",
//                     text: "continue_with",
//                     shape: "rectangular",
//                     logo_alignment: "left"
//                 }
//             );

//         }
//     }, [onLoginSuccess]);

//     return (
//         <div>
//             <div ref={googleButtonRef}></div>

//             <ToastMessage
//                 message={message}
//                 type={messageType}
//                 isFirstLogin={isFirstLogin}
//                 onClose={handleCloseMessage}
//             />
//         </div>
//     );
// };

// export default GoogleSignInButton;








import React, { useEffect, useRef, useState } from 'react';
import ToastMessage from '../ToastMessage.jsx'; // ודאי שהנתיב הזה תקין, כולל ה-.jsx בסוף

// קומפוננטת GoogleSignInButton לניהול כפתור ההתחברות של גוגל וטיפול בתהליך האימות.
const GoogleSignInButton = ({ onLoginSuccess }) => {
    const googleButtonRef = useRef(null); // רפרנס לאלמנט ה-DOM של כפתור גוגל.
    const [message, setMessage] = useState(''); // סטייט להודעה שתוצג בטוסט.
    const [isFirstLogin, setIsFirstLogin] = useState(false); // סטייט לסימון האם זו התחברות ראשונה (משפיע על סגנון הטוסט).
    const [messageType, setMessageType] = useState(''); // סטייט לסוג ההודעה (success/error).

    console.log("Current message state:", message, messageType, isFirstLogin); // לוג של מצב ההודעה.

    // אפקט React לטיפול בהיעלמות אוטומטית של הודעת הטוסט.
    useEffect(() => {
        let timer;
        if (message) {
            timer = setTimeout(() => {
                handleCloseMessage(); // סגירת ההודעה לאחר 10 שניות.
            }, 10000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer); // ניקוי הטיימר בעת הסרת הקומפוננטה או שינוי ההודעה.
            }
        };
    }, [message]); // מופעל מחדש בכל שינוי בסטייט message.

    // פונקציה לאיפוס הסטייטים הקשורים להודעה ולסגירת הטוסט.
    const handleCloseMessage = () => {
        setMessage('');
        setIsFirstLogin(false);
        setMessageType('');
    };

    // אפקט React המטפל באתחול כפתור ההתחברות של גוגל ובלוגיקת האימות.
    useEffect(() => {
        if (window.google) { // וודא שאובייקט google זמין בחלון (נטען מהסקריפט של גוגל).
            // הגדרת פונקציית callback לטיפול בתגובת האימות מגוגל.
            window.handleCredentialResponse = async (response) => {
                const idToken = response.credential; // שליפת ה-ID Token מתגובת גוגל.
                console.log("Received ID Token from Google:", idToken);

                handleCloseMessage(); // סגירת כל הודעה קודמת לפני תחילת תהליך חדש.

                try {
                    // שליחת ה-ID Token לשרת הבאקאנד לצורך אימות ויצירת JWT.
                    const res = await fetch('http://localhost:3001/auth/google', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: idToken }),
                    });

                    const data = await res.json(); // קבלת התגובה מהשרת.
                    console.log('Server response (Backend):', data);

                    if (data.success) { // אם ההתחברות הצליחה.
                        if (data.token) {
                            // שמירת טוקן ה-JWT ופרטי המשתמש ב-localStorage.
                            localStorage.setItem('jwtToken', data.token);
                            console.log('JWT Token saved to localStorage.');
                            localStorage.setItem('userId', data.user.id);
                            localStorage.setItem('userEmail', data.user.email);
                            localStorage.setItem('userName', data.user.username);
                        }

                        const user = data.user;
                        // הגדרת הודעת הצלחה למשתמש (כולל הודעה מיוחדת להתחברות ראשונה).
                        setMessage(
                            `Welcome, ${user.username}! If this is your first time here, your password is your email. ` +
                            `It is highly recommended that you reset your password and choose a more secure one. ` +
                            `<a href="/reset-password" style="color: #0056b3; text-decoration: underline; font-weight: bold;">Click here to reset your password</a>`
                        );
                        setIsFirstLogin(true); // סימון שהיא התחברות ראשונה.
                        setMessageType('success'); // הגדרת סוג ההודעה כהצלחה.

                        // השהייה לפני הפעלת callback ההצלחה, כדי לאפשר למשתמש לראות את הטוסט.
                        setTimeout(() => {
                            if (onLoginSuccess) {
                                onLoginSuccess(); // הפעלת callback חיצוני במקרה של התחברות מוצלחת.
                            }
                        }, 10000); // 10 שניות.

                    } else { // אם ההתחברות נכשלה (מהשרת).
                        console.error('Login failed (Server responded with error):', data.message);
                        setMessage('Login failed: ' + data.message); // הודעת שגיאה.
                        setMessageType('error'); // הגדרת סוג ההודעה כשגיאה.
                        setIsFirstLogin(false);

                        setTimeout(() => {
                            if (onLoginSuccess) {
                                onLoginSuccess();
                            }
                        }, 5000); // 5 שניות.
                    }
                } catch (error) { // טיפול בשגיאות תקשורת או אחרות בצד הלקוח.
                    console.error('Error during Google login process (Frontend fetch):', error);
                    setMessage('An error occurred during login. Please try again.'); // הודעת שגיאה כללית.
                    setMessageType('error');
                    setIsFirstLogin(false);

                    setTimeout(() => {
                        if (onLoginSuccess) {
                            onLoginSuccess();
                        }
                    }, 5000);
                }
            };

            // אתחול ספריית Google Identity Services.
            window.google.accounts.id.initialize({
                client_id: "942278766033-h1531cin8bhufben94gkrivkvh4a08s9.apps.googleusercontent.com", // Client ID של אפליקציית גוגל.
                callback: window.handleCredentialResponse, // פונקציית ה-callback שתופעל לאחר קבלת Credential.
            });

            // רינדור כפתור ההתחברות של גוגל באלמנט ה-DOM המתאים.
            window.google.accounts.id.renderButton(
                googleButtonRef.current, // אלמנט ה-DOM שבו ירונדר הכפתור.
                {
                    theme: "outline", // סגנון הכפתור.
                    size: "large",    // גודל הכפתור.
                    text: "continue_with", // טקסט הכפתור.
                    shape: "rectangular", // צורת הכפתור.
                    logo_alignment: "left" // יישור לוגו גוגל.
                }
            );
        }
    }, [onLoginSuccess]); // מופעל פעם אחת בעת טעינת הקומפוננטה או כש-onLoginSuccess משתנה.

    return (
        <div>
            {/* אלמנט ה-div שישמש כקונטיינר לכפתור ההתחברות של גוגל. */}
            <div ref={googleButtonRef}></div>

            {/* קומפוננטת הטוסט להצגת הודעות למשתמש. */}
            <ToastMessage
                message={message}
                type={messageType}
                isFirstLogin={isFirstLogin}
                onClose={handleCloseMessage}
            />
        </div>
    );
};

export default GoogleSignInButton; // ייצוא הקומפוננטה לשימוש במקומות אחרים.
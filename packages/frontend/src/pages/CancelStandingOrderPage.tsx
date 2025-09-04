// import React, { useState } from 'react';

// const CancelStandingOrderPage: React.FC = () => {
//     const [email, setEmail] = useState<string>('');
//     const [code, setCode] = useState<string>('');
//     const [codeSent, setCodeSent] = useState<boolean>(false);
//     const [message, setMessage] = useState<string>('');
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const handleRequestCode = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!email) {
//             setMessage('Please enter your email address.');
//             return;
//         }

//         setIsLoading(true);
//         setMessage('');

//         try {
//             const response = await fetch("http://localhost:3001/api/cancel-standing-order/request-code", {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email }),
//             });

//             const data = await response.json();

//             // Display accurate message from the server
//             if (response.ok) {
//                 setMessage(data.message || 'Request was successful.');
//                 setCodeSent(true);
//             } else {
//                 setMessage(data.message || data.error || 'Error requesting verification code. Please try again.');
//                 setCodeSent(false);
//             }
//         } catch (error) {
//             setMessage('Network error. Please try again later.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleVerifyAndCancel = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!email || !code) {
//             setMessage('Please enter both email and verification code.');
//             return;
//         }

//         setIsLoading(true);
//         setMessage('');

//         try {
//             const response = await fetch('http://localhost:3001/api/cancel-standing-order/verify-and-cancel', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, code }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 setMessage(data.message || 'Standing order has been successfully canceled!');
//                 setTimeout(() => {
//                     window.location.href = '/';
//                 }, 2000);
//             } else {
//                 setMessage(data.message || data.error || 'Error verifying code or cancelling the standing order.');
//             }
//         } catch (error) {
//             setMessage('Network error. Please try again later.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const isErrorMessage =
//         message.toLowerCase().includes('error') ||
//         message.toLowerCase().includes('not found') ||
//         message.toLowerCase().includes('שגיאה') || // Optional: remove Hebrew check if fully English
//         message.toLowerCase().includes('לא נמצאה');

//     return (
//         <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
//             <h2 className="text-2xl font-bold text-center text-primary mb-6">Cancel Standing Order</h2>

//             {message && (
//                 <div
//                     className={`mb-4 px-4 py-3 rounded-lg text-center font-bold ${
//                         isErrorMessage
//                             ? 'bg-red-100 text-red-700 border border-red-300'
//                             : 'bg-green-100 text-green-700 border border-green-300'
//                     }`}
//                 >
//                     {message}
//                 </div>
//             )}

//             {!codeSent ? (
//                 <form onSubmit={handleRequestCode} className="space-y-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Enter your email address to receive a verification code:
//                     </label>
//                     <input
//                         type="email"
//                         placeholder="Your email address"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     />
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className={`w-full py-2 rounded-lg font-semibold transition ${
//                             isLoading
//                                 ? 'bg-gray-300 cursor-not-allowed'
//                                 : 'bg-primary text-white hover:bg-primary/90'
//                         }`}
//                     >
//                         {isLoading ? 'Sending...' : 'Send Verification Code'}
//                     </button>
//                 </form>
//             ) : (
//                 <form onSubmit={handleVerifyAndCancel} className="space-y-4">
//                     <div className="text-sm text-gray-700 mb-2">
//                         Verification code was sent to: <span className="font-bold text-primary">{email}</span>
//                     </div>
//                     <input
//                         type="text"
//                         placeholder="Verification Code"
//                         value={code}
//                         onChange={(e) => setCode(e.target.value)}
//                         required
//                         maxLength={6}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     />
//                     <div className="flex gap-2">
//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className={`flex-1 py-2 rounded-lg font-semibold transition ${
//                                 isLoading
//                                     ? 'bg-gray-300 cursor-not-allowed'
//                                     : 'bg-primary text-white hover:bg-primary/90'
//                             }`}
//                         >
//                             {isLoading ? 'Verifying...' : 'Verify & Cancel'}
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setCodeSent(false);
//                                 setMessage('');
//                                 setCode('');
//                             }}
//                             disabled={isLoading}
//                             className="flex-1 py-2 rounded-lg font-semibold bg-gray-400 text-white hover:bg-gray-500 transition"
//                         >
//                             Back
//                         </button>
//                     </div>
//                 </form>
//             )}
//         </div>
//     );
// };

// export default CancelStandingOrderPage;
import React, { useState } from 'react';

const CancelStandingOrderPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [codeSent, setCodeSent] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMessage('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch("http://localhost:3001/api/cancel-standing-order/request-code", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            // Display accurate message from the server
            if (response.ok) {
                setMessage(data.message || 'Request was successful.');
                setCodeSent(true);
            } else {
                setMessage(data.message || data.error || 'Error requesting verification code. Please try again.');
                setCodeSent(false);
            }
        } catch (error) {
            setMessage('Network error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndCancel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !code) {
            setMessage('Please enter both email and verification code.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:3001/api/cancel-standing-order/verify-and-cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Standing order has been successfully canceled!');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            // קריאה לשרת שלך לביטול הוראת קבע בפייפאל
            try {
                const paypalRes = await fetch('http://localhost:3001/api/subscriptions/cancel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                const paypalData = await paypalRes.json();
                // אפשר להציג הודעה נוספת אם תרצה:
                setMessage(prev => prev + "\n" + (paypalData.message || "PayPal subscription canceled."));
            } catch (err) {
                // אפשר להציג שגיאה נוספת אם תרצה:
                setMessage(prev => prev + "\n" + "Failed to cancel PayPal subscription.");
            }

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            setMessage(data.message || data.error || 'Error verifying code or cancelling the standing order.');
        }
        } catch (error) {
            setMessage('Network error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const isErrorMessage =
        message.toLowerCase().includes('error') ||
        message.toLowerCase().includes('not found') ||
        message.toLowerCase().includes('שגיאה') || // Optional: remove Hebrew check if fully English
        message.toLowerCase().includes('לא נמצאה');

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">Cancel Standing Order</h2>

            {message && (
                <div
                    className={`mb-4 px-4 py-3 rounded-lg text-center font-bold ${
                        isErrorMessage
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-green-100 text-green-700 border border-green-300'
                    }`}
                >
                    {message}
                </div>
            )}

            {!codeSent ? (
                <form onSubmit={handleRequestCode} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your email address to receive a verification code:
                    </label>
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-lg font-semibold transition ${
                            isLoading
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                    >
                        {isLoading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyAndCancel} className="space-y-4">
                    <div className="text-sm text-gray-700 mb-2">
                        Verification code was sent to: <span className="font-bold text-primary">{email}</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 py-2 rounded-lg font-semibold transition ${
                                isLoading
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Cancel'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCodeSent(false);
                                setMessage('');
                                setCode('');
                            }}
                            disabled={isLoading}
                            className="flex-1 py-2 rounded-lg font-semibold bg-gray-400 text-white hover:bg-gray-500 transition"
                        >
                            Back
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CancelStandingOrderPage;
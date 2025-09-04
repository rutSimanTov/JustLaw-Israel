import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor - שליחת טוקן אם קיים
apiClient.interceptors.request.use(
    (config) => {
        // תיקון: אתחול headers אם לא קיים
        // if (!config.headers) {
        //     config.headers = {};
        // }
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // הוספת הרשאת admin לפי user ב-localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj.role === 'admin' || userObj.role === 'Admin') {
                    config.headers['x-user-role'] = userObj.role;
                }
            } catch {}
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Interceptor - טיפול ב־401 + ניתוב לדף התחברות
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userGoogleId');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            window.location.href = '/';
            alert('ההתחברות שלך פגה. אנא התחבר/י מחדש.');
        }
        return Promise.reject(error);
    }
);

export default apiClient;


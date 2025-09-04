// src/context/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth'; // ודאי שהנתיב הזה נכון למיקום הוק ה-useAuth שלך

// הגדרת סוג (Type) עבור הערך שהקונטקסט יספק
interface AuthContextType {
  user: ReturnType<typeof useAuth>['user'];
  session: ReturnType<typeof useAuth>['session'];
  loading: ReturnType<typeof useAuth>['loading'];
  signOut: ReturnType<typeof useAuth>['signOut'];
}

// יצירת הקונטקסט
// חשוב לתת ערך התחלתי שיתאים לסוג. `undefined` כברירת מחדל ואז בדיקה בהוק.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ה-Provider שיעטוף את האפליקציה שלך
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth(); // קוראים להוק useAuth שלך
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// הוק מותאם אישית לצריכת נתוני האימות בקומפוננטות
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
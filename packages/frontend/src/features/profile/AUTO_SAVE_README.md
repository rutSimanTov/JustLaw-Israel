# מערכת שמירה אוטומטית לטופס הפרופיל

## 🎯 מטרה
מערכת שמירה אוטומטית שמאפשרת למשתמשים למלא טופס פרופיל מרובה שלבים עם שמירה אוטומטית כל 30 שניות, כך שהנתונים ישרדו רענון דף.

## 🔧 איך זה עובד

### 1. Hook מותאם אישית - `useAutoSave`
- **מיקום**: `src/hooks/useAutoSave.ts`
- **תפקיד**: מנהל שמירה וטעינה אוטומטית של נתונים ב-localStorage

### 2. תכונות עיקריות
- ✅ **שמירה אוטומטית כל 30 שניות**
- ✅ **Debounce של 1 שנייה** - מונע שמירות מיותרות
- ✅ **טעינה אוטומטית** בעת פתיחת הטופס
- ✅ **שמירה מיידית** בעת סגירת הדף
- ✅ **גיבוי אחד בלבד** - מונע יצירת קבצים מיותרים
- ✅ **ניקוי אוטומטי** של timers
- ✅ **ניקוי localStorage** בעת שמירת פרופיל, מחיקת פרופיל ו-logout
- ✅ **בדיקת פרופיל קיים** בשרת לפני טעינה מ-localStorage
- ✅ **Flag למחיקת פרופיל** - מונע טעינת נתונים ישנים אחרי מחיקה

### 3. שימוש בטופס הראשי
```typescript
// שרהלה
const { data: formData, setData: setFormData } = useAutoSave(initialFormData, {
  key: "profile_form_draft",
  interval: 30000, // 30 שניות
  debounceMs: 1000, // 1 שנייה
})
```

## 📁 מבנה הקבצים

```
src/
├── hooks/
│   └── useAutoSave.ts          # Hook לשמירה אוטומטית
├── features/profile/
│   ├── MainFormCeateProfile.tsx    # טופס ראשי עם שמירה אוטומטית
│   ├── Step1-BasicInfo.tsx         # שלב 1 - מידע בסיסי
│   ├── Step2-TheValueYouBring.tsx  # שלב 2 - הערך שלך
│   ├── Step3-theconnectionYouAreSeeking.tsx # שלב 3 - חיבורים
│   └── step4-ReviewAndSubmitStep.tsx # שלב 4 - סקירה ושליחה
├── services/
│   └── deleteProfile.tsx        # מחיקת פרופיל עם ניקוי localStorage
└── features/auth/
    └── LogoutPage.tsx          # logout עם ניקוי localStorage
```

## 🚀 איך להשתמש

### למפתחים
1. **ייבוא ה-hook**:
```typescript
import { useAutoSave } from "../../hooks/useAutoSave"
```

2. **הגדרת נתונים ראשוניים**:
```typescript
const initialData = {
  name: "",
  email: "",
  // ... שאר השדות
}
```

3. **שימוש ב-hook**:
```typescript
const { data, setData, saveNow, clearSaved } = useAutoSave(initialData, {
  key: "my_form_key",
  interval: 30000, // אופציונלי - ברירת מחדל 30 שניות
  debounceMs: 1000, // אופציונלי - ברירת מחדל 1 שנייה
})
```

### למשתמשים
- **מלא/י את הטופס** - הנתונים נשמרים אוטומטית
- **רענן/י את הדף** - הנתונים יטענו אוטומטית
- **סגור/י את הדף** - הנתונים יישמרו מיידית
- **שמור/י פרופיל** - localStorage ינוקה אוטומטית
- **מחק/י פרופיל** - localStorage ינוקה אוטומטית
- **צא/י מהמערכת** - localStorage ינוקה אוטומטית

## 🔍 Debugging

### Console Logs
המערכת מדפיסה הודעות console עם אייקונים:
- 🔄 `טוען נתונים שמורים` - בעת טעינת נתונים
- 💾 `נשמר ל-localStorage` - בעת שמירה
- ⏰ `שמירה אוטומטית כל 30 שניות` - שמירה תקופתית
- 🗑️ `נוקה localStorage` - בעת ניקוי
- 📋 `נמצא פרופיל קיים בשרת - לא נטען מ-localStorage` - בעת יצירת פרופיל חדש
- 📋 `טוען טיוטה מ-localStorage` - בעת טעינת טיוטה

### בדיקת localStorage
```javascript
// בדיקה ב-Console של הדפדפן
console.log(localStorage.getItem("profile_form_draft"))
```

## ⚙️ הגדרות מתקדמות

### שינוי מרווח השמירה
```typescript
const { data, setData } = useAutoSave(initialData, {
  key: "my_form",
  interval: 60000, // שמירה כל דקה
  debounceMs: 2000, // debounce של 2 שניות
})
```

### שמירה מיידית
```typescript
const { data, setData, saveNow } = useAutoSave(initialData, {
  key: "my_form"
})

// שמירה מיידית
saveNow()
```

### ניקוי נתונים שמורים
```typescript
const { data, setData, clearSaved } = useAutoSave(initialData, {
  key: "my_form"
})

// ניקוי הנתונים השמורים
clearSaved()
```

## 🐛 פתרון בעיות

### הנתונים לא נטענים
1. בדוק/י שה-key זהה
2. בדוק/י console לשגיאות
3. וודא/י שה-localStorage פעיל

### שמירה לא עובדת
1. בדוק/י שיש מקום ב-localStorage
2. וודא/י שהנתונים לא גדולים מדי
3. בדוק/י console לשגיאות

### נתונים ישנים מופיעים אחרי מחיקת פרופיל
1. המערכת בודקת אם יש פרופיל קיים בשרת
2. אם יש פרופיל בשרת - לא נטען מ-localStorage
3. אם אין פרופיל בשרת - נטען מ-localStorage אם יש
4. **Flag למחיקת פרופיל** - כשפרופיל נמחק, נוצר flag `_deleted` ב-localStorage
5. **בדיקת Flag** - כשמנסים ליצור פרופיל חדש, המערכת בודקת אם יש flag `_deleted`
6. **ניקוי אוטומטי** - אם יש flag, הטופס יהיה ריק וה-flag יימחק

### ביצועים
- המערכת משתמשת ב-debounce למניעת שמירות מיותרות
- Timers מתנקים אוטומטית בעת unmount
- שמירה תקופתית רק אם יש שינויים
- **גיבוי אחד בלבד** - מונע יצירת קבצים מיותרים ב-localStorage

## 📝 הערות חשובות

1. **מפתח ייחודי**: כל טופס צריך מפתח ייחודי ב-localStorage
2. **גודל נתונים**: localStorage מוגבל ל-5-10MB
3. **פרטיות**: הנתונים נשמרים רק במחשב המקומי
4. **תאימות**: עובד בכל הדפדפנים המודרניים
5. **ניקוי אוטומטי**: localStorage ינוקה בעת שמירת פרופיל, מחיקת פרופיל ו-logout

## 🔄 עדכונים עתידיים

- [ ] שמירה בענן (Supabase)
- [ ] גיבוי אוטומטי
- [ ] היסטוריית שינויים
- [ ] שמירה חלקית (per-step) 
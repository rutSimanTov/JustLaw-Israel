// שרהלה
// קובץ debug לבדיקת מערכת השמירה האוטומטית

export const debugAutoSave = {
  // בדיקת localStorage
  checkLocalStorage: () => {
    console.log("🔍 בדיקת localStorage:");
    
    const keys = Object.keys(localStorage);
    console.log("כל המפתחות:", keys);
    
    const profileKey = "profile_form_draft";
    const profileData = localStorage.getItem(profileKey);
    const backupKey = `${profileKey}_backup`;
    const backupData = localStorage.getItem(backupKey);
    
    if (profileData) {
      try {
        const parsed = JSON.parse(profileData);
        console.log("📋 נתוני פרופיל שמורים:", parsed);
        console.log("📏 גודל הנתונים:", new Blob([profileData]).size, "bytes");
        console.log("🕐 זמן שמירה:", new Date().toLocaleString());
      } catch (error) {
        console.error("❌ שגיאה בפענוח נתוני הפרופיל:", error);
      }
    } else {
      console.log("📭 אין נתוני פרופיל שמורים");
    }
    
    if (backupData) {
      console.log("💾 קיים גיבוי לפרופיל");
    } else {
      console.log("📭 אין גיבוי לפרופיל");
    }
  },

  // מעקב אחר שינויים ב-localStorage
  watchLocalStorage: () => {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;

    localStorage.setItem = function(key: string, value: string) {
      console.log(`🔔 localStorage.setItem: ${key} =`, value);
      if (key === "profile_form_draft") {
        console.log("⚠️ מישהו שינה את נתוני הפרופיל!");
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.removeItem = function(key: string) {
      console.log(`🗑️ localStorage.removeItem: ${key}`);
      if (key === "profile_form_draft") {
        console.log("❌ מישהו מחק את נתוני הפרופיל!");
      }
      return originalRemoveItem.call(this, key);
    };

    localStorage.clear = function() {
      console.log("🧹 localStorage.clear - כל הנתונים נמחקו!");
      return originalClear.call(this);
    };

    console.log("👀 מעקב אחר localStorage מופעל");
  },

  // בדיקת זיכרון localStorage
  checkStorageQuota: () => {
    try {
      const testKey = "storage_test";
      const testData = "x".repeat(1024 * 1024); // 1MB
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      console.log("✅ יש מספיק מקום ב-localStorage");
    } catch (error) {
      console.error("❌ localStorage מלא או לא זמין:", error);
    }
  },

  // בדיקת אירועים שעלולים למחוק נתונים
  checkPotentialIssues: () => {
    console.log("🔍 בדיקת בעיות פוטנציאליות:");
    
    // בדיקה אם יש קוד שמנקה localStorage
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script, index) => {
      if (script.textContent && script.textContent.includes('localStorage.clear')) {
        console.log(`⚠️ נמצא localStorage.clear בסקריפט ${index}`);
      }
      if (script.textContent && script.textContent.includes('profile_form_draft')) {
        console.log(`ℹ️ נמצא התייחסות לנתוני פרופיל בסקריפט ${index}`);
      }
    });

    // בדיקת event listeners
    console.log("📋 בדיקת event listeners...");
  },

  // ניקוי נתונים שמורים
  clearProfileData: () => {
    localStorage.removeItem("profile_form_draft");
    localStorage.removeItem("profile_form_draft_backup");
    console.log("🗑️ נוקו נתוני הפרופיל והגיבוי");
  },

  // בדיקת זמינות localStorage
  checkLocalStorageAvailability: () => {
    try {
      const test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      console.log("✅ localStorage זמין");
      return true;
    } catch (error) {
      console.error("❌ localStorage לא זמין:", error);
      return false;
    }
  },

  // הדמיית שמירה
  simulateSave: (data: any) => {
    try {
      localStorage.setItem("profile_form_draft", JSON.stringify(data));
      console.log("💾 הדמיית שמירה הצליחה:", data);
    } catch (error) {
      console.error("❌ שגיאה בהדמיית שמירה:", error);
    }
  },

  // בדיקת ביצועים
  performanceTest: () => {
    const start = performance.now();
    const testData = {
      step1: { name: "Test User", projectLink: "https://test.com" },
      step2: { role_description: "Test Role", countryRegion: "Israel" },
      step3: { connectionTypes: ["test"], contactInfo: { phone: "123" } }
    };
    
    localStorage.setItem("test_performance", JSON.stringify(testData));
    const end = performance.now();
    
    console.log(`⚡ זמן שמירה: ${(end - start).toFixed(2)}ms`);
    localStorage.removeItem("test_performance");
  },

  // בדיקה מלאה
  fullCheck: () => {
    console.log("🚀 בדיקה מלאה של מערכת השמירה האוטומטית");
    console.log("=".repeat(50));
    
    debugAutoSave.checkLocalStorageAvailability();
    debugAutoSave.checkStorageQuota();
    debugAutoSave.checkLocalStorage();
    debugAutoSave.checkPotentialIssues();
    debugAutoSave.performanceTest();
    
    console.log("=".repeat(50));
    console.log("✅ בדיקה הושלמה");
  },

  // בדיקה מתמשכת
  continuousWatch: () => {
    console.log("👀 מתחיל מעקב מתמשך...");
    debugAutoSave.watchLocalStorage();
    
    // בדיקה כל 10 שניות
    setInterval(() => {
      debugAutoSave.checkLocalStorage();
    }, 10000);
  }
};

// הוספה ל-window לבדיקה מה-Console
if (typeof window !== 'undefined') {
  (window as any).debugAutoSave = debugAutoSave;
  console.log("🔧 כלי Debug זמינים ב-window.debugAutoSave");
  console.log("💡 השתמש/י ב-debugAutoSave.fullCheck() לבדיקה מלאה");
  console.log("👀 השתמש/י ב-debugAutoSave.continuousWatch() למעקב מתמשך");
} 
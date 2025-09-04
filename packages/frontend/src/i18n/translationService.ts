import axios from "axios";

// טוען את התרגומים הקיימים
import en from "./translations/en.json";
import he from "./translations/he.json";
import fr from "./translations/fr.json";
import es from "./translations/es.json";
import ar from "./translations/ar.json";

// הגדירי את רשימת השפות הנתמכות
export type Language = "en" | "he" | "fr" | "es" | "ar";

// אובייקט המרכז את כל התרגומים
const translations: Record<Language, Record<string, string>> = {
  en,
  he,
  fr,
  es,
  ar,
};

// פונקציה ראשית לקבלת תרגום (כולל שליחה לשרת אם צריך)
export async function getTranslation(
  text: string,
  targetLang: Language
): Promise<string> {
  // בדיקה אם התרגום כבר קיים
  const existing = translations[targetLang]?.[text];
  if (existing) return existing;

  try {
    // שלח בקשת תרגום לשרת שלך
    const res = await axios.post("http://localhost:5001/translate", {
      text,
      to: targetLang,
    });

    const translatedText = res.data?.translatedText || "";

    // עדכון בזיכרון (לא שומר לקובץ – זה ייעשה בשרת)
    translations[targetLang][text] = translatedText;

    // שליחת בקשת שמירה לשרת
    await axios.post("http://localhost:5001/save", {
      lang: targetLang,
      key: text,
      value: translatedText,
    });

    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // fallback להצגת הטקסט המקורי
  }
}
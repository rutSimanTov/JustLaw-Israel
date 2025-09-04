type TranslationsMap = Record<string, string>;

let currentLang = 'en';
let translations: TranslationsMap = {};

export async function loadLanguage(lang: string) {
  currentLang = lang;
  try {
    const data = await import(`./translations/${lang}.json`);
    translations = data.default || data;
    console.log(`✅ Loaded translations for "${lang}"`);
  } catch (err) {
    console.error(`❌ Failed to load translations for "${lang}"`, err);
    translations = {};
  }
}

export function translate(text: string): string {
  return translations[text] || text;
}

export function getCurrentLanguage() {
  return currentLang;
}

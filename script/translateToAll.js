const fs = require('fs-extra');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

const languages = ['he', 'ar', 'fr', 'es'];

async function translateTo(lang) {
  const enPath = path.resolve(__dirname, '../packages/frontend/src/i18n/translations/en.json');
  const targetPath = path.resolve(__dirname, `../packages/frontend/src/i18n/translations/${lang}.json`);

  const en = await fs.readJson(enPath);
  const target = fs.existsSync(targetPath) ? await fs.readJson(targetPath) : {};

  const missing = Object.keys(en).filter((key) =>
    !target[key] &&
    key.trim() !== '' &&
    !/\s{2,}/.test(key) // לא מחרוזת עם רווחים כפולים
  );

  console.log(`🔍 Translating to ${lang}: ${missing.length} missing strings`);

  for (const text of missing) {
    if (target[text]?.trim()) continue;
    try {
      const res = await fetch('http://localhost:5001/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'en', to: lang, text }),
      });

      const data = await res.json();

      if (data.translatedText) {
        target[text] = data.translatedText;
        console.log(`✅ ${lang}: "${text}" ➜ "${data.translatedText}"`);
      } else {
        console.warn(`⚠️ ${lang}: No translation for "${text}"`);
      }
    } catch (err) {
      console.error(`❌ ${lang}: Error translating "${text}":`, err.message);
    }
  }

  await fs.writeJson(targetPath, target, { spaces: 2 });
  console.log(`💾 Saved to ${targetPath}`);
}

async function main() {
  for (const lang of languages) {
    await translateTo(lang);
  }
}

main();

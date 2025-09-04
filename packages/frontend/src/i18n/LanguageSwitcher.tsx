import React from 'react';
import { runLiveTranslation } from '../i18n/liveTranslator'; 

function LanguageSwitcher() {
  const currentLang = localStorage.getItem('lang') || 'en';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    localStorage.setItem('lang', newLang);
    runLiveTranslation(newLang); // ⬅️ תרגם מיידית
  };

  return (
    <select
      onChange={handleChange}
      defaultValue={currentLang}
      className="
    appearance-none
    bg-transparent
    text-white
    border border-white
    px-3 py-1.5
    rounded-md
    pr-10
    transition-colors duration-300
    hover:bg-pink-500
    focus:bg-background
    focus:border-white
    hover:border-pink-500
    cursor-pointer
    focus:outline-none
  "
    >
      <option value="en">English</option>
      <option value="he">עברית</option>
      <option value="fr">Français</option>
      <option value="ar">العربية</option>
      <option value="es">Español</option>
    </select>
  );
}

export default LanguageSwitcher;
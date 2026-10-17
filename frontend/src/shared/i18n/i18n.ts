import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_LANGUAGE,
  detectInitialLanguage,
  directionFor,
  isLanguage,
  type Language,
} from './languages';
import { ar } from './locales/ar';
import { en } from './locales/en';

const STORAGE_KEY = 'pharmacy.language';

function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage can be blocked; the choice then lasts for the session only
  }
}

function applyToDocument(language: string): void {
  const resolved = isLanguage(language) ? language : DEFAULT_LANGUAGE;
  document.documentElement.lang = resolved;
  document.documentElement.dir = directionFor(resolved);
}

/** Switch the UI language, flip the document direction, and remember the choice. */
export async function setLanguage(language: Language): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // see readStoredLanguage
  }
  await i18n.changeLanguage(language);
}

i18n.on('languageChanged', applyToDocument);

void i18n.use(initReactI18next).init({
  initAsync: false, // resources are bundled, so initialisation is synchronous
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: detectInitialLanguage(readStoredLanguage(), navigator.language),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: ['en', 'ar'],
  interpolation: { escapeValue: false }, // React already escapes
});
applyToDocument(i18n.language);

export default i18n;

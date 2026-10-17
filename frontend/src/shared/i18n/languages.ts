export const LANGUAGES = ['en', 'ar'] as const;
export type Language = (typeof LANGUAGES)[number];
export type Direction = 'ltr' | 'rtl';

export const DEFAULT_LANGUAGE: Language = 'en';

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language === value);
}

export function directionFor(language: Language): Direction {
  return language === 'ar' ? 'rtl' : 'ltr';
}

/** A stored choice wins; otherwise follow the browser language; otherwise English. */
export function detectInitialLanguage(
  stored: string | null,
  browserLanguage: string | undefined,
): Language {
  if (isLanguage(stored)) {
    return stored;
  }
  const primary = browserLanguage?.toLowerCase().split('-')[0];
  return isLanguage(primary) ? primary : DEFAULT_LANGUAGE;
}

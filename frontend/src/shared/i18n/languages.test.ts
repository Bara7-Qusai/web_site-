import { describe, expect, it } from 'vitest';

import { detectInitialLanguage, directionFor, isLanguage } from './languages';

describe('directionFor', () => {
  it('is right-to-left for Arabic and left-to-right for English', () => {
    expect(directionFor('ar')).toBe('rtl');
    expect(directionFor('en')).toBe('ltr');
  });
});

describe('isLanguage', () => {
  it('accepts supported codes only', () => {
    expect(isLanguage('ar')).toBe(true);
    expect(isLanguage('fr')).toBe(false);
    expect(isLanguage(null)).toBe(false);
  });
});

describe('detectInitialLanguage', () => {
  it('prefers a stored choice over the browser language', () => {
    expect(detectInitialLanguage('en', 'ar-SD')).toBe('en');
  });

  it('follows the browser language, ignoring region', () => {
    expect(detectInitialLanguage(null, 'ar-SD')).toBe('ar');
  });

  it('falls back to English for unsupported or missing languages', () => {
    expect(detectInitialLanguage('xx', 'fr-FR')).toBe('en');
    expect(detectInitialLanguage(null, undefined)).toBe('en');
  });
});

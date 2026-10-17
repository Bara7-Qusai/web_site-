import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

import { setLanguage } from '@/shared/i18n';

beforeEach(async () => {
  localStorage.clear();
  await setLanguage('en');
});

afterEach(() => {
  cleanup();
});

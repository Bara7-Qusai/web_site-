import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('switches to Arabic: right-to-left document, Arabic labels, choice remembered', async () => {
    render(<LanguageSwitcher />);
    expect(document.documentElement.dir).toBe('ltr');

    await userEvent.selectOptions(screen.getByRole('combobox'), 'ar');

    await waitFor(() => {
      expect(document.documentElement.dir).toBe('rtl');
    });
    expect(document.documentElement.lang).toBe('ar');
    expect(screen.getByText('اللغة')).toBeInTheDocument();
    expect(localStorage.getItem('pharmacy.language')).toBe('ar');
  });

  it('switches back to English: left-to-right document', async () => {
    render(<LanguageSwitcher />);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'ar');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'en');

    await waitFor(() => {
      expect(document.documentElement.dir).toBe('ltr');
    });
    expect(screen.getByText('Language')).toBeInTheDocument();
  });
});

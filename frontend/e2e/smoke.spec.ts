import { expect, test } from '@playwright/test';

// Runs the built app against a real FastAPI process (see playwright.config.ts).

test('start page reports the backend as reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Backend status' })).toBeVisible();
  await expect(page.getByText('The backend is reachable.')).toBeVisible();
});

test('switching to Arabic flips the page to right-to-left', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

  await page.getByRole('combobox').selectOption('ar');

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.getByRole('heading', { name: 'حالة الخادم' })).toBeVisible();
});

test('unknown paths show the not-found page', async ({ page }) => {
  await page.goto('/definitely/not/a/page');
  await expect(page.getByRole('alert')).toContainText('Page not found');
});

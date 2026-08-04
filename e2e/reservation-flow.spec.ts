import { expect, test } from '@playwright/test';

test('registers, restores session, books, cancels, and logs out', async ({ page }) => {
  const unique = Date.now();
  const email = `browser-e2e-${unique}@example.com`;
  const password = 'BrowserPass123';

  await page.goto('/auth/register');
  await page.getByPlaceholder('Full Name').fill('Browser E2E User');
  await page.getByPlaceholder('Email Address').fill(email);
  await page.getByPlaceholder('Password', { exact: true }).fill(password);
  await page.getByPlaceholder('Confirm Password').fill(password);
  await page.locator('select[formControlName="userType"]').selectOption('freelancer');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('registered successfully');
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

  // The access token is memory-only. Reload must recover through the rotated
  // HttpOnly refresh cookie instead of redirecting to login.
  await page.reload();
  await page.waitForURL('**/dashboard');
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

  await page.goto('/dashboard/booking');
  await expect(page.getByRole('heading', { name: 'Choose Your Workspace' })).toBeVisible();

  const sharedDesk = page.locator('app-space-card').filter({ hasText: 'Shared Desk' });
  await expect(sharedDesk).toBeVisible();
  await sharedDesk.click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForURL('**/dashboard/booking/dates');

  // Choose a future-day slot so booking creation cannot fail as a past time.
  const tomorrowRow = page.locator('.grid-row').nth(1);
  const availableSlot = tomorrowRow.locator('.slot-cell.available').first();
  await expect(availableSlot).toBeVisible();
  await availableSlot.click();

  await expect(page.locator('.price-summary')).toBeVisible();
  const dateNext = page.getByRole('button', { name: 'Next' });
  await expect(dateNext).toBeEnabled();
  await dateNext.click();

  await page.waitForURL('**/dashboard/booking/summary');
  await expect(page.getByRole('heading', { name: 'Booking Summary' })).toBeVisible();
  await expect(page.getByText('Shared Desk')).toBeVisible();
  await page.getByRole('button', { name: /Proceed to Checkout/ }).click();

  await page.waitForURL('**/dashboard/booking/checkout');
  await expect(page.getByRole('heading', { name: 'Confirm Your Booking' })).toBeVisible();
  await expect(page.getByText('Pay at Venue')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm Booking' }).click();

  await page.waitForURL('**/dashboard');
  const bookingRow = page.locator('tbody tr').filter({ hasText: 'Shared Desk' }).first();
  await expect(bookingRow).toBeVisible();
  await expect(bookingRow).toContainText('Upcoming');

  // A reload proves the row comes from the backend rather than component state.
  await page.reload();
  const persistedRow = page.locator('tbody tr').filter({ hasText: 'Shared Desk' }).first();
  await expect(persistedRow).toBeVisible();

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Cancel booking');
    await dialog.accept();
  });
  await persistedRow.getByRole('button', { name: 'Cancel' }).click();

  const cancelledRow = page.locator('tbody tr').filter({ hasText: 'Shared Desk' }).first();
  await expect(cancelledRow).toContainText('Cancelled');

  await page.getByRole('button', { name: 'Logout' }).click();
  await page.waitForURL('**/auth/login');

  await page.goto('/dashboard');
  await page.waitForURL('**/auth/login');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

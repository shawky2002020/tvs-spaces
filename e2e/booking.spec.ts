import { test, expect } from '@playwright/test';

test.describe('TVS Spaces Booking E2E Flow', () => {
  test('should register, select workspace, place hourly booking, verify on dashboard, and cancel it', async ({ page }) => {
    // Console debugging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // 1. Register a new user
    const email = `e2e-tester-${Date.now()}@example.com`;
    await page.goto('/auth/register');
    await page.fill('input[placeholder="Full Name"]', 'E2E Tester');
    await page.fill('input[placeholder="Email Address"]', email);
    await page.fill('input[placeholder="Password"]', 'E2EPassword123!');
    await page.fill('input[placeholder="Confirm Password"]', 'E2EPassword123!');
    await page.selectOption('select', 'freelancer');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    // 2. Navigate to Spaces selection
    await page.click('aside a[href="/dashboard/booking"]');
    await expect(page).toHaveURL(/\/dashboard\/booking$/);

    // Select Shared Desk
    await page.locator('app-space-card').filter({ hasText: 'Shared Desk' }).first().click();
    await page.click('button.next-btn');
    await expect(page).toHaveURL(/\/dashboard\/booking\/dates$/);

    // 3. Configure Hourly Booking
    // Select plan Hourly
    await page.click('button:has-text("Hourly")');

    // Open Datepicker Calendar
    await page.click('mat-datepicker-toggle button');
    await page.waitForSelector('mat-calendar');

    // Click Next Month button to ensure the chosen date is 100% in the future
    await page.click('button.mat-calendar-next-button');

    // Choose the first available cell in the future month
    await page.locator('button.mat-calendar-body-cell:not([aria-disabled="true"])').first().click();

    // Select Start Time: 10:00 AM
    await page.click('mat-select[placeholder="Start Time"]');
    await page.click('mat-option:has-text("10:00 AM")');

    // Select End Time: 1:00 PM
    await page.click('mat-select[placeholder="End Time"]');
    await page.click('mat-option:has-text("1:00 PM")');

    // Wait for price calculation and availability validation
    await page.waitForSelector('.price-breakdown-details');
    await expect(page.locator('.total-price')).toContainText('EGP');

    // Click Continue
    await page.click('button.btn-continue');
    await expect(page).toHaveURL(/\/dashboard\/booking\/summary$/);

    // 4. Booking Summary
    await expect(page.locator('.item-value').first()).toContainText('Shared Desk');
    await expect(page.locator('.item-value').nth(1)).toContainText('Hourly');
    await page.click('button:has-text("Proceed to Checkout")');
    await expect(page).toHaveURL(/\/dashboard\/booking\/checkout$/);

    // 5. Checkout and Confirm
    // Select Credit/Debit Card payment method
    await page.click('text="Credit/Debit Card"');

    // Click pay now / place booking
    await page.click('button:has-text("Complete Payment")');

    // Wait for auto redirect back to dashboard
    await page.waitForURL(/\/dashboard$/, { timeout: 10000 });

    // 6. Verify on Dashboard and Cancel
    // Expect the booking to be in the table
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('Shared Desk');
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('CONFIRMED');

    // Setup dialog handler to accept cancellation confirm prompt
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('cancel this booking');
      await dialog.accept();
    });

    // Click Cancel
    await page.locator('table.bookings-table tbody tr').first().locator('button:has-text("Cancel")').click();

    // Verify booking updates to CANCELLED
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('CANCELLED');
  });
});

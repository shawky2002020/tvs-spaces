import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const DESKTOP_DIR = 'c:/dev/web/tvs-spaces-project/artifacts/demo/screenshots/desktop';
const MOBILE_DIR = 'c:/dev/web/tvs-spaces-project/artifacts/demo/screenshots/mobile';
const CLIENT_DOCS_DIR = 'c:/dev/web/tvs-spaces-project/client/docs/screenshots/client';

const DEMO_USER = {
  email: 'omar.hassan@demo.local',
  password: 'DemoPassword123!',
  name: 'Omar Hassan',
};

test.describe('Portfolio Screenshot Suite', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(DESKTOP_DIR, { recursive: true });
    fs.mkdirSync(MOBILE_DIR, { recursive: true });
    fs.mkdirSync(CLIENT_DOCS_DIR, { recursive: true });
  });

  test('Capture Desktop Suite (1440x900)', async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 1440, height: 900 });

    // 01 - Landing Desktop
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '01-landing-desktop.webp'), fullPage: false });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'landing-desktop.webp'), fullPage: false });

    // 02 - Shared Desk Detail Desktop
    await page.goto('/desks/shared-desk', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '02-shared-desk-detail-desktop.webp'), fullPage: false });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'desk-detail-desktop.webp'), fullPage: false });

    // 03 - Room Detail Desktop
    await page.goto('/rooms/team-room', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '03-room-detail-desktop.webp'), fullPage: false });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'room-detail-desktop.webp'), fullPage: false });

    // 04 - Gallery Lightbox Desktop
    const firstPolaroid = page.locator('.polaroid').first();
    if (await firstPolaroid.isVisible()) {
      await firstPolaroid.click();
      await page.waitForSelector('.image-lightbox', { state: 'visible' });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '04-gallery-lightbox-desktop.webp') });
      await page.click('.image-lightbox');
      await page.waitForTimeout(300);
    }

    // 05 - Login Desktop
    await page.goto('/auth/login', { waitUntil: 'networkidle' });
    await page.fill('input[placeholder="Email Address"]', DEMO_USER.email);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '05-login-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'login-desktop.webp') });

    // 06 - Register Desktop
    await page.goto('/auth/register', { waitUntil: 'networkidle' });
    await page.fill('input[placeholder="Full Name"]', DEMO_USER.name);
    await page.fill('input[placeholder="Email Address"]', 'omar.freelance@demo.local');
    await page.selectOption('select', 'freelancer');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '06-register-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'register-desktop.webp') });

    // Log in as Omar Hassan
    await page.goto('/auth/login', { waitUntil: 'networkidle' });
    await page.fill('input[placeholder="Email Address"]', DEMO_USER.email);
    await page.fill('input[placeholder="Password"]', DEMO_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(600);

    // 07 - Dashboard Desktop (Initial Seeded History)
    await page.screenshot({ path: path.join(DESKTOP_DIR, '07-dashboard-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'dashboard-desktop.webp') });

    // 08 - Booking Selector Desktop
    await page.click('aside a[href="/dashboard/booking"]');
    await page.waitForURL('**/dashboard/booking');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '08-booking-selector-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'booking-selector-desktop.webp') });

    // Select Shared Desk and proceed
    await page.locator('app-space-card').filter({ hasText: 'Shared Desk' }).first().click();
    await page.click('button.next-btn');
    await page.waitForURL('**/dashboard/booking/dates');
    await page.waitForTimeout(500);

    // 09 - Booking Plan Desktop
    await page.screenshot({ path: path.join(DESKTOP_DIR, '09-booking-plan-desktop.webp') });

    // 10 - Booking Calendar Desktop
    await page.click('mat-datepicker-toggle button');
    await page.waitForSelector('mat-calendar');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '10-booking-calendar-desktop.webp') });

    // Pick future date
    await page.click('button.mat-calendar-next-button');
    await page.waitForTimeout(300);
    await page.locator('button.mat-calendar-body-cell:not([aria-disabled="true"])').first().click();
    await page.waitForTimeout(300);

    // 11 - Booking Time Desktop
    await page.click('mat-select[placeholder="Start Time"]');
    await page.waitForSelector('mat-option');
    await page.click('mat-option:has-text("10:00 AM")');

    await page.click('mat-select[placeholder="End Time"]');
    await page.waitForSelector('mat-option');
    await page.click('mat-option:has-text("1:00 PM")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '11-booking-time-desktop.webp') });

    // 12 - Booking Price Breakdown Desktop
    await page.waitForSelector('.price-breakdown-details');
    await expect(page.locator('.total-price')).toContainText('EGP');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '12-booking-price-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'booking-dates-desktop.webp') });

    // 13 - Booking Summary Desktop
    await page.click('button.btn-continue');
    await page.waitForURL('**/dashboard/booking/summary');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '13-booking-summary-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'booking-summary-desktop.webp') });

    // 14 - Checkout Desktop
    await page.click('button:has-text("Proceed to Checkout")');
    await page.waitForURL('**/dashboard/booking/checkout');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '14-checkout-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'booking-checkout-desktop.webp') });

    // Select Pay at Venue & Confirm
    await page.click('text="Pay at Venue"');
    await page.click('button:has-text("Confirm Booking")');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.waitForTimeout(600);

    // 15 - Booking Confirmed Dashboard Desktop
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('Shared Desk');
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('Upcoming');
    await page.screenshot({ path: path.join(DESKTOP_DIR, '15-booking-confirmed-dashboard-desktop.webp') });

    // Setup cancellation dialog handler
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    // 16 - Booking Cancelled Desktop
    await page.locator('table.bookings-table tbody tr').first().locator('button:has-text("Cancel")').click();
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('Cancelled');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '16-booking-cancelled-desktop.webp') });

    // 17 - Profile Desktop
    await page.click('aside a[href="/dashboard/profile"]');
    await page.waitForURL('**/dashboard/profile');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '17-profile-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'profile-desktop.webp') });

    // 18 - Facilities Desktop
    await page.click('aside a[href="/dashboard/facilities"]');
    await page.waitForURL('**/dashboard/facilities');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '18-facilities-desktop.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'facilities-desktop.webp') });
  });

  test('Capture Mobile Suite (390x844)', async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 390, height: 844 });

    // 01 - Landing Mobile
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(MOBILE_DIR, '01-landing-mobile.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'landing-mobile.webp') });

    // 02 - Mobile Nav
    await page.click('button.burger');
    await page.waitForSelector('div.sheet.is-open', { state: 'visible' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(MOBILE_DIR, '02-mobile-nav-mobile.webp') });
    await page.click('button.sheet__close');
    await page.waitForTimeout(300);

    // 03 - Desk Detail Mobile
    await page.goto('/desks/shared-desk', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(MOBILE_DIR, '03-desk-detail-mobile.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'desk-detail-mobile.webp') });

    // 04 - Room Detail Mobile
    await page.goto('/rooms/team-room', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(MOBILE_DIR, '04-room-detail-mobile.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'room-detail-mobile.webp') });

    // Log in as Omar Hassan for mobile protected views
    await page.goto('/auth/login', { waitUntil: 'networkidle' });
    await page.fill('input[placeholder="Email Address"]', DEMO_USER.email);
    await page.fill('input[placeholder="Password"]', DEMO_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(500);

    // 08 - Dashboard Mobile
    await page.screenshot({ path: path.join(MOBILE_DIR, '08-dashboard-mobile.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'dashboard-mobile.webp') });

    // 05 - Booking Selector Mobile
    await page.goto('/dashboard/booking', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(MOBILE_DIR, '05-booking-selector-mobile.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'booking-selector-mobile.webp') });

    // Select Shared Desk
    await page.locator('app-space-card').filter({ hasText: 'Shared Desk' }).first().click();
    await page.click('button.next-btn');
    await page.waitForURL('**/dashboard/booking/dates');
    await page.waitForTimeout(500);

    // Configure date & time
    await page.click('mat-datepicker-toggle button');
    await page.waitForSelector('mat-calendar');
    await page.click('button.mat-calendar-next-button');
    await page.locator('button.mat-calendar-body-cell:not([aria-disabled="true"])').first().click();

    await page.click('mat-select[placeholder="Start Time"]');
    await page.click('mat-option:has-text("10:00 AM")');

    await page.click('mat-select[placeholder="End Time"]');
    await page.click('mat-option:has-text("1:00 PM")');
    await page.waitForTimeout(400);

    // 06 - Booking Dates Mobile
    await page.screenshot({ path: path.join(MOBILE_DIR, '06-booking-dates-mobile.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'booking-dates-mobile.webp') });

    // 07 - Booking Summary Mobile
    await page.click('button.btn-continue');
    await page.waitForURL('**/dashboard/booking/summary');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(MOBILE_DIR, '07-booking-summary-mobile.webp') });
    await page.screenshot({ path: path.join(CLIENT_DOCS_DIR, 'booking-summary-mobile.webp') });
  });
});

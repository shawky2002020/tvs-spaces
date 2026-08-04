import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const DOCS_DIR = path.join(__dirname, '..', 'docs', 'screenshots', 'client');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

test.describe('Comprehensive Documentation Screenshot Capture', () => {
  test.beforeAll(() => {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  });

  for (const vp of VIEWPORTS) {
    test(`capture public pages - ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Landing Page
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `landing-${vp.name}.webp`) });

      // 2. Room Detail Page
      await page.goto('/rooms/team-room', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `room-detail-${vp.name}.webp`) });

      // 3. Desk Detail Page
      await page.goto('/desks/shared-desk', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `desk-detail-${vp.name}.webp`) });

      // 4. Auth Login
      await page.goto('/auth/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `login-${vp.name}.webp`) });

      // 5. Auth Register
      await page.goto('/auth/register', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `register-${vp.name}.webp`) });

      // 6. 404 Page
      await page.goto('/not-found-page-test', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `not-found-${vp.name}.webp`) });
    });

    test(`capture authenticated pages - ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Sign up or log in
      const testEmail = `testdocs_${Date.now()}@example.com`;
      await page.goto('/auth/register', { waitUntil: 'networkidle' });
      await page.fill('input[type="email"], input[formcontrolname="email"]', testEmail);
      await page.fill('input[type="password"], input[formcontrolname="password"]', 'Password123!');
      
      const usernameInput = page.locator('input[formcontrolname="username"]');
      if (await usernameInput.isVisible()) {
        await usernameInput.fill('DocTester');
      }

      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // 7. Dashboard
      await page.goto('/dashboard', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `dashboard-${vp.name}.webp`) });

      // 8. Booking Flow - Resource Selector
      await page.goto('/dashboard/booking', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `booking-selector-${vp.name}.webp`) });

      // 9. Booking Flow - Dates & Plan
      await page.goto('/dashboard/booking/dates', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `booking-dates-${vp.name}.webp`) });

      // 10. Booking Flow - Summary
      await page.goto('/dashboard/booking/summary', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `booking-summary-${vp.name}.webp`) });

      // 11. Booking Flow - Checkout
      await page.goto('/dashboard/booking/checkout', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `booking-checkout-${vp.name}.webp`) });

      // 12. Profile Page
      await page.goto('/dashboard/profile', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `profile-${vp.name}.webp`) });

      // 13. Facilities & Help Page
      await page.goto('/dashboard/facilities', { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(DOCS_DIR, `facilities-${vp.name}.webp`) });
    });
  }
});

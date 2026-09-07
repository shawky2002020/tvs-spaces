import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const RAW_DIR = 'c:/dev/web/tvs-spaces-project/artifacts/demo/video/raw';

const DEMO_USER = {
  email: 'omar.hassan@demo.local',
  password: 'DemoPassword123!',
  name: 'Omar Hassan',
};

test.describe('Portfolio Video Recording Pipeline', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(RAW_DIR, { recursive: true });
  });

  test('Record Full CV Walkthrough (1920x1080)', async ({ browser }) => {
    test.setTimeout(180000);

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: RAW_DIR,
        size: { width: 1920, height: 1080 },
      },
    });

    const page = await context.newPage();

    // Helper: inject virtual cursor
    await page.addInitScript(() => {
      const initCursor = () => {
        if (document.getElementById('demo-virtual-cursor')) return;
        const cursor = document.createElement('div');
        cursor.id = 'demo-virtual-cursor';
        cursor.innerHTML = `
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.45));">
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="#0f172a" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
          <div id="demo-click-ripple" style="position: absolute; left: -10px; top: -10px; width: 26px; height: 26px; border-radius: 50%; border: 2px solid rgba(59, 130, 246, 0.85); opacity: 0; pointer-events: none; transition: all 0.35s ease-out;"></div>
        `;
        cursor.style.position = 'fixed';
        cursor.style.left = '960px';
        cursor.style.top = '540px';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '99999999';
        cursor.style.transform = 'translate(-3px, -2px)';
        cursor.style.transition = 'left 0.42s cubic-bezier(0.25, 1, 0.5, 1), top 0.42s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.appendChild(cursor);

        (window as any).__moveCursor = (x: number, y: number, durationMs = 420) => {
          cursor.style.transition = `left ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1), top ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
          cursor.style.left = `${x}px`;
          cursor.style.top = `${y}px`;
        };

        (window as any).__clickRipple = () => {
          const ripple = document.getElementById('demo-click-ripple');
          if (ripple) {
            ripple.style.transform = 'scale(0.2)';
            ripple.style.opacity = '1';
            ripple.style.borderColor = 'rgba(59, 130, 246, 0.95)';
            setTimeout(() => {
              ripple.style.transform = 'scale(2.4)';
              ripple.style.opacity = '0';
            }, 30);
          }
        };
      };

      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initCursor);
      } else {
        initCursor();
      }
    });

    // Helper functions for human-like interaction
    const moveAndClick = async (selector: string, pauseBeforeClick = 300, pauseAfterClick = 500) => {
      const loc = page.locator(selector).first();
      await loc.waitFor({ state: 'visible', timeout: 15000 });
      const box = await loc.boundingBox();
      if (box) {
        const targetX = box.x + box.width / 2;
        const targetY = box.y + box.height / 2;
        await page.evaluate(({ x, y }) => (window as any).__moveCursor?.(x, y, 400), { x: targetX, y: targetY });
        await page.waitForTimeout(pauseBeforeClick);
        await page.evaluate(() => (window as any).__clickRipple?.());
        await loc.click({ force: true });
        await page.waitForTimeout(pauseAfterClick);
      } else {
        await loc.click();
      }
    };

    const moveCursorTo = async (selector: string, duration = 400, pauseAfter = 300) => {
      const loc = page.locator(selector).first();
      if (await loc.isVisible()) {
        const box = await loc.boundingBox();
        if (box) {
          const targetX = box.x + box.width / 2;
          const targetY = box.y + box.height / 2;
          await page.evaluate(({ x, y, dur }) => (window as any).__moveCursor?.(x, y, dur), { x: targetX, y: targetY, dur: duration });
          await page.waitForTimeout(pauseAfter);
        }
      }
    };

    const smoothScroll = async (deltaY: number, steps = 15, delay = 25) => {
      for (let i = 0; i < steps; i++) {
        await page.evaluate((d) => window.scrollBy(0, d), deltaY / steps);
        await page.waitForTimeout(delay);
      }
    };

    // ==========================================
    // 1. OPENING HERO & BRANDING (0:00 - 0:08)
    // ==========================================
    await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Subtle cursor hover on nav brand and items
    await moveCursorTo('.site-header .brand', 500, 500);
    await moveCursorTo('.site-header a:has-text("Spaces")', 400, 450);
    await moveCursorTo('.site-header a:has-text("Rates")', 400, 450);

    // Hover on CTA button
    await moveCursorTo('a.btn-primary:has-text("See spaces and prices")', 450, 600);

    // Smooth scroll down to browse spaces section
    await smoothScroll(650, 20, 25);
    await page.waitForTimeout(800);

    // ==========================================
    // 2. BROWSE SPACES & SPACE DETAILS (0:08 - 0:22)
    // ==========================================
    // Hover across lead and cards
    await moveCursorTo('.spaces__lead-title', 450, 500);
    await moveCursorTo('.spaces__lead-rates', 450, 600);

    // Click Shared Desk CTA link
    await moveAndClick('a.spaces__lead-cta, a.spaces__lead-plate', 400, 800);
    await page.waitForURL('**/desks/shared-desk');
    await page.waitForTimeout(800);

    // View Shared Desk page specs & amenities
    await moveCursorTo('.detail-header h1', 400, 400);
    await moveCursorTo('.amenities-list', 400, 500);
    await smoothScroll(450, 15, 25);
    await page.waitForTimeout(600);

    // Inspect Polaroid Gallery & Open Lightbox
    const polaroid = page.locator('.polaroid').first();
    if (await polaroid.isVisible()) {
      await moveAndClick('.polaroid:first-child', 400, 1000);
      await page.waitForSelector('.image-lightbox', { state: 'visible' });
      await page.waitForTimeout(1200); // Admire high-res space photo

      // Close Lightbox using explicit close button
      await moveAndClick('.lightbox-close', 350, 600);
      await page.waitForSelector('.image-lightbox', { state: 'hidden' });
      await page.waitForTimeout(400);
    }

    // Scroll up slightly and click Check Availability
    await smoothScroll(-250, 10, 20);
    await page.waitForTimeout(400);
    await moveAndClick('.pricing-card button:has-text("Check Availability")', 400, 800);

    // ==========================================
    // 3. AUTHENTICATION (0:22 - 0:30)
    // ==========================================
    // User is redirected to login page due to auth guard
    await page.waitForURL('**/auth/login**');
    await page.waitForTimeout(600);

    // Move to email input and fill realistically
    await moveAndClick('input[placeholder="Email Address"]', 300, 200);
    await page.fill('input[placeholder="Email Address"]', DEMO_USER.email);
    await page.waitForTimeout(300);

    // Move to password input and fill
    await moveAndClick('input[placeholder="Password"]', 300, 200);
    await page.fill('input[placeholder="Password"]', DEMO_USER.password);
    await page.waitForTimeout(350);

    // Submit login form
    await moveAndClick('button[type="submit"]', 350, 800);
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(1000);

    // ==========================================
    // 4. WORKSPACE SELECTION (0:30 - 0:38)
    // ==========================================
    // Click "New Booking" button on dashboard
    await moveAndClick('a:has-text("New Booking"), button:has-text("New Booking")', 400, 800);
    await page.waitForURL('**/dashboard/booking');
    await page.waitForTimeout(800);

    // Select Shared Desk
    await moveAndClick('app-space-card:has-text("Shared Desk")', 450, 600);
    await moveAndClick('button.next-btn', 400, 800);
    await page.waitForURL('**/dashboard/booking/dates');
    await page.waitForTimeout(800);

    // ==========================================
    // 5. HERO: PLAN, DATE, TIME & LIVE PRICE (0:38 - 0:54)
    // ==========================================
    // Select Hourly plan
    await moveAndClick('button:has-text("Hourly")', 400, 600);

    // Open datepicker
    await moveAndClick('mat-datepicker-toggle button', 350, 500);
    await page.waitForSelector('mat-calendar');
    await page.waitForTimeout(500);

    // Navigate to next month to ensure future availability
    await moveAndClick('button.mat-calendar-next-button', 350, 500);

    // Select first valid cell in future month
    const validDay = page.locator('button.mat-calendar-body-cell:not([aria-disabled="true"])').first();
    await validDay.click();
    await page.waitForTimeout(600);

    // Select Start Time: 10:00 AM
    await moveAndClick('mat-select[placeholder="Start Time"]', 350, 400);
    await page.waitForSelector('mat-option');
    await moveAndClick('mat-option:has-text("10:00 AM")', 350, 500);

    // Select End Time: 1:00 PM
    await moveAndClick('mat-select[placeholder="End Time"]', 350, 400);
    await page.waitForSelector('mat-option');
    await moveAndClick('mat-option:has-text("1:00 PM")', 350, 600);

    // Wait for server-authoritative pricing calculation
    await page.waitForSelector('.price-breakdown-details');
    await expect(page.locator('.total-price')).toContainText('EGP');
    await page.waitForTimeout(600);

    // Hover over calculated price card to highlight 120 EGP total
    await moveCursorTo('.status-price-card .total-price', 500, 1500);

    // Click Continue
    await moveAndClick('button.btn-continue', 400, 800);
    await page.waitForURL('**/dashboard/booking/summary');
    await page.waitForTimeout(800);

    // ==========================================
    // 6. BOOKING SUMMARY & CHECKOUT (0:54 - 1:05)
    // ==========================================
    // Review summary items
    await moveCursorTo('.summary-container, .booking-summary-card', 400, 800);
    await moveAndClick('button:has-text("Proceed to Checkout")', 400, 800);
    await page.waitForURL('**/dashboard/booking/checkout');
    await page.waitForTimeout(800);

    // Select Pay at Venue option
    await moveAndClick('text="Pay at Venue"', 400, 600);

    // Click Confirm Booking
    await moveAndClick('button:has-text("Confirm Booking")', 400, 1200);

    // Wait for auto redirect back to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.waitForTimeout(1000);

    // ==========================================
    // 7. DASHBOARD CONFIRMATION & STATS (1:05 - 1:14)
    // ==========================================
    // Verify confirmed booking in table
    const firstRow = page.locator('table.bookings-table tbody tr').first();
    await expect(firstRow).toContainText('Shared Desk');
    await expect(firstRow).toContainText('Upcoming');

    // Hover over the newly confirmed booking row
    await moveCursorTo('table.bookings-table tbody tr:first-child', 500, 1200);

    // Hover over stats overview cards
    await moveCursorTo('.stats-grid', 450, 1000);

    // ==========================================
    // 8. MANAGEMENT: CANCELLATION FLOW (1:14 - 1:22)
    // ==========================================
    // Set up dialog accept
    page.once('dialog', async (dialog) => {
      await page.waitForTimeout(400);
      await dialog.accept();
    });

    // Click Cancel on upcoming booking
    await moveAndClick('table.bookings-table tbody tr:first-child button:has-text("Cancel")', 400, 1200);

    // Verify status dynamically updates to Cancelled
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('Cancelled');
    await page.waitForTimeout(1000);

    // Hover over the updated status badge
    await moveCursorTo('table.bookings-table tbody tr:first-child', 400, 800);

    // ==========================================
    // 9. PRODUCT BREADTH: PROFILE & FACILITIES (1:22 - 1:30)
    // ==========================================
    // View Profile
    await moveAndClick('aside a[href="/dashboard/profile"]', 400, 800);
    await page.waitForURL('**/dashboard/profile');
    await page.waitForTimeout(1000);
    await moveCursorTo('.profile-wrapper', 450, 800);

    // View Facilities
    await moveAndClick('aside a[href="/dashboard/facilities"]', 400, 800);
    await page.waitForURL('**/dashboard/facilities');
    await page.waitForTimeout(1000);
    await smoothScroll(300, 10, 25);
    await page.waitForTimeout(800);

    // Return to Dashboard for final clean hero state
    await moveAndClick('aside a[href="/dashboard"]', 400, 800);
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(1500); // Clean hold on final state

    // Close page and context to flush video
    await page.close();
    await context.close();
  });
});

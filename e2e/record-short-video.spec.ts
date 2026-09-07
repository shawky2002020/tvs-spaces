import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const RAW_DIR = 'c:/dev/web/tvs-spaces-project/artifacts/demo/video/raw';

const DEMO_USER = {
  email: 'omar.hassan@demo.local',
  password: 'DemoPassword123!',
  name: 'Omar Hassan',
};

test.describe('Short Recruiter Video Recording Pipeline', () => {
  test('Record Short Teaser Walkthrough (1920x1080)', async ({ browser }) => {
    test.setTimeout(120000);

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: RAW_DIR,
        size: { width: 1920, height: 1080 },
      },
    });

    const page = await context.newPage();

    // Inject virtual cursor
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
        cursor.style.transition = 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1), top 0.35s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.appendChild(cursor);

        (window as any).__moveCursor = (x: number, y: number, durationMs = 350) => {
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

    const moveAndClick = async (selector: string, pauseBeforeClick = 200, pauseAfterClick = 350) => {
      const loc = page.locator(selector).first();
      await loc.waitFor({ state: 'visible', timeout: 15000 });
      const box = await loc.boundingBox();
      if (box) {
        const targetX = box.x + box.width / 2;
        const targetY = box.y + box.height / 2;
        await page.evaluate(({ x, y }) => (window as any).__moveCursor?.(x, y, 320), { x: targetX, y: targetY });
        await page.waitForTimeout(pauseBeforeClick);
        await page.evaluate(() => (window as any).__clickRipple?.());
        await loc.click({ force: true });
        await page.waitForTimeout(pauseAfterClick);
      } else {
        await loc.click();
      }
    };

    const moveCursorTo = async (selector: string, duration = 300, pauseAfter = 200) => {
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

    const smoothScroll = async (deltaY: number, steps = 12, delay = 20) => {
      for (let i = 0; i < steps; i++) {
        await page.evaluate((d) => window.scrollBy(0, d), deltaY / steps);
        await page.waitForTimeout(delay);
      }
    };

    // 1. Landing Hero (0:00 - 0:05)
    await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await moveCursorTo('.site-header .brand', 350, 400);
    await smoothScroll(600, 15, 20);
    await page.waitForTimeout(600);

    // 2. Space Detail (0:05 - 0:10)
    await moveAndClick('a.spaces__lead-cta, a.spaces__lead-plate', 300, 600);
    await page.waitForURL('**/desks/shared-desk');
    await page.waitForTimeout(600);
    await moveCursorTo('.detail-header h1', 300, 300);
    await moveAndClick('.pricing-card button:has-text("Check Availability")', 350, 600);

    // 3. Fast Login (0:10 - 0:15)
    await page.waitForURL('**/auth/login**');
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="Email Address"]', DEMO_USER.email);
    await page.fill('input[placeholder="Password"]', DEMO_USER.password);
    await moveAndClick('button[type="submit"]', 300, 600);
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(600);

    // 4. Date & Plan Stepper (0:15 - 0:24)
    await moveAndClick('a:has-text("New Booking"), button:has-text("New Booking")', 300, 500);
    await page.waitForURL('**/dashboard/booking');
    await moveAndClick('app-space-card:has-text("Shared Desk")', 300, 400);
    await moveAndClick('button.next-btn', 300, 600);
    await page.waitForURL('**/dashboard/booking/dates');
    await page.waitForTimeout(500);

    // Configure Hourly, Date, 10 AM - 1 PM
    await moveAndClick('button:has-text("Hourly")', 300, 400);
    await moveAndClick('mat-datepicker-toggle button', 300, 400);
    await page.waitForSelector('mat-calendar');
    await moveAndClick('button.mat-calendar-next-button', 300, 400);
    const validDay = page.locator('button.mat-calendar-body-cell:not([aria-disabled="true"])').first();
    await validDay.click();
    await page.waitForTimeout(400);

    await moveAndClick('mat-select[placeholder="Start Time"]', 300, 300);
    await moveAndClick('mat-option:has-text("10:00 AM")', 300, 400);
    await moveAndClick('mat-select[placeholder="End Time"]', 300, 300);
    await moveAndClick('mat-option:has-text("1:00 PM")', 300, 500);

    // Price calculation pause
    await page.waitForSelector('.price-breakdown-details');
    await expect(page.locator('.total-price')).toContainText('EGP');
    await moveCursorTo('.status-price-card .total-price', 400, 1000);

    // 5. Summary (0:24 - 0:28)
    await moveAndClick('button.btn-continue', 300, 600);
    await page.waitForURL('**/dashboard/booking/summary');
    await moveCursorTo('.summary-container, .booking-summary-card', 300, 600);
    await moveAndClick('button:has-text("Proceed to Checkout")', 300, 600);

    // 6. Confirm Booking (0:28 - 0:32)
    await page.waitForURL('**/dashboard/booking/checkout');
    await moveAndClick('text="Pay at Venue"', 300, 400);
    await moveAndClick('button:has-text("Confirm Booking")', 350, 1000);

    // 7. Confirmed Dashboard (0:32 - 0:36)
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('Shared Desk');
    await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('Upcoming');
    await moveCursorTo('table.bookings-table tbody tr:first-child', 400, 1200);
    await page.waitForTimeout(1500); // Final hold

    await page.close();
    await context.close();
  });
});

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Screenshot harness for the landing-page rebuild.
 * Run with LANDING_SHOT_DIR=docs/landing-rebuild/before (or /after).
 */
const VIEWPORTS = [
  { name: '0390x844', width: 390, height: 844 },
  { name: '0768x1024', width: 768, height: 1024 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

const OUT_DIR = process.env['LANDING_SHOT_DIR'] || 'docs/landing-rebuild/before';

test.describe('landing page screenshots', () => {
  for (const vp of VIEWPORTS) {
    test(`capture ${vp.name}`, async ({ page }) => {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/', { waitUntil: 'networkidle' });

      // Section entry motion is driven by IntersectionObserver, so a full-page
      // screenshot would capture everything below the fold in its pre-reveal
      // state. Walk the page once to trigger every observer, then return.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        // `behavior: 'instant'` matters: the page sets `scroll-behavior: smooth`,
        // and animated scrolling never reaches the lower sections in time.
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      });
      // Let fonts settle and any entry motion finish before capturing.
      await page.waitForTimeout(1200);

      // Horizontal-overflow probe, recorded alongside each capture.
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      fs.appendFileSync(
        path.join(OUT_DIR, 'overflow.txt'),
        `${vp.name}: scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth} overflow=${
          overflow.scrollWidth > overflow.clientWidth
        }\n`
      );

      await page.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-full.png`),
        fullPage: true,
      });
      await page.screenshot({
        path: path.join(OUT_DIR, `${vp.name}-fold.png`),
        fullPage: false,
      });

      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  }
});

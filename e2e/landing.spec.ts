import { test, expect, Page } from '@playwright/test';

const API = process.env['E2E_API_URL'] || 'http://localhost:8080/api';

/** Walk the page so IntersectionObserver-driven section entry has run. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  });
}

test.describe('TVS Spaces landing page', () => {
  test('1. loads, with the document title and one h1', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('A desk for an hour');
  });

  test('2. hero content is visible immediately, without waiting for motion', async ({ page }) => {
    // No settle() and no timeout: the hero must be readable on first paint.
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(page.getByRole('link', { name: 'See spaces and prices' }).first()).toBeVisible();
    // The hero image is eager and above the fold.
    await expect(page.locator('tvs-landing-hero img').first()).toBeVisible();
  });

  test('3. primary CTA moves the visitor to the catalogue', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'See spaces and prices' }).first().click();
    await expect(page).toHaveURL(/#spaces$/);
    await expect(page.locator('#spaces')).toBeVisible();
  });

  test('4. mobile menu opens, traps focus, closes on Escape and restores focus', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();

    const sheet = page.locator('#mobile-menu');
    await expect(sheet).toBeInViewport();
    await expect(sheet).not.toHaveAttribute('inert', /.*/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Focus moved into the panel.
    await expect
      .poll(async () => page.evaluate(() => document.activeElement?.closest('.sheet') !== null))
      .toBe(true);

    await page.keyboard.press('Escape');
    // The closed panel is off-canvas and inert: out of the tab order, out of
    // the accessibility tree, and out of the viewport.
    await expect(sheet).toHaveAttribute('inert', '');
    await expect(sheet).not.toBeInViewport();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // Focus came back to the control that opened it.
    await expect(toggle).toBeFocused();
  });

  test('4b. the open mobile menu traps Tab inside the panel', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();

    // Tab well past the number of controls in the panel; focus must never
    // escape to the page behind it.
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(
        () => document.activeElement?.closest('#mobile-menu') !== null
      );
      expect(inside, `focus escaped the panel on tab ${i + 1}`).toBe(true);
    }
  });

  test('5. workspace data comes from the backend', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/bookings/spaces') && r.status() === 200),
      page.goto('/'),
    ]);

    const spaces = (await response.json()) as Array<{ name: string; slug: string }>;
    expect(spaces.length).toBeGreaterThan(0);

    await settle(page);
    // Every space the API returned is named on the page.
    for (const space of spaces) {
      await expect(page.getByText(space.name, { exact: true }).first()).toBeVisible();
    }
  });

  test('5b. exactly one catalogue request serves the whole page', async ({ page }) => {
    const calls: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('/bookings/spaces')) calls.push(r.url());
    });
    await page.goto('/');
    await settle(page);
    expect(calls).toHaveLength(1);
  });

  test('6. a catalogue card opens the real detail page', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const card = page.locator('tvs-space-card a.card__link').first();
    const name = (await card.textContent())?.trim() ?? '';
    await card.click();

    await expect(page).toHaveURL(/\/(desks|rooms)\/[a-z0-9-]+$/);
    await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
  });

  test('7. the hero plan controls really re-weight the catalogue', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const halfDay = page.getByRole('button', { name: /Half day/ }).first();
    await expect(halfDay).toHaveAttribute('aria-pressed', 'false');
    await halfDay.click();
    await expect(halfDay).toHaveAttribute('aria-pressed', 'true');

    // The selected plan is now marked on the space cards, not just in the hero.
    await expect(page.locator('tvs-space-card .card__rate.is-selected').first()).toBeVisible();
    await expect(page.locator('#spaces')).toBeInViewport();

    // Pressing again clears it.
    await halfDay.click();
    await expect(halfDay).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('tvs-space-card .card__rate.is-selected')).toHaveCount(0);
  });

  test('7b. scenario actions route into real space pages', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const action = page.locator('tvs-work-scenarios a.scenario__action').first();
    await action.scrollIntoViewIfNeeded();
    await action.click();
    await expect(page).toHaveURL(/\/(desks|rooms)\/[a-z0-9-]+$/);
  });

  test('8. sign in and create account links work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign in' }).first().click();
    await expect(page).toHaveURL(/\/auth\/login$/);

    await page.goto('/');
    await page.getByRole('link', { name: 'Create account' }).first().click();
    await expect(page).toHaveURL(/\/auth\/register$/);
  });

  test('9. authenticated header renders the signed-in variation', async ({ page, request }) => {
    // Real signup against the running backend, then reuse the cached-user shape
    // the app itself persists.
    const email = `e2e-landing-${Date.now()}@example.com`;
    const signup = await request.post(`${API}/auth/signup`, {
      data: { username: 'E2E Landing', email, password: 'Passw0rd23', type: 'freelancer' },
    });
    expect(signup.ok(), `signup failed: ${signup.status()} ${await signup.text()}`).toBeTruthy();
    const body = await signup.json();

    await page.goto('/');
    await page.evaluate((user) => localStorage.setItem('user', JSON.stringify(user)), body.user);
    await page.reload();

    const headerActions = page.locator('.site-header .actions');
    await expect(headerActions.getByRole('link', { name: 'Your bookings' })).toBeVisible();
    await expect(headerActions.getByRole('button', { name: 'Sign out' })).toBeVisible();
    await expect(headerActions.getByText('E2E Landing')).toBeVisible();
    // The signed-out pair is gone from the bar. The footer keeps its own
    // account links, which is intentional, so the assertion is scoped.
    await expect(headerActions.getByRole('link', { name: 'Create account' })).toHaveCount(0);
    await expect(headerActions.getByRole('link', { name: 'Sign in' })).toHaveCount(0);
  });

  test('10. an API failure shows a recoverable state, and retry recovers it', async ({ page }) => {
    await page.route('**/bookings/spaces', (route) => route.abort('failed'));
    await page.goto('/');

    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('did not load');

    // Let the request through and retry in place.
    await page.unroute('**/bookings/spaces');
    await page.getByRole('button', { name: 'Try again' }).click();

    await expect(page.locator('tvs-space-card').first()).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
  });

  test('11. a missing image falls back instead of showing a broken image', async ({ page }) => {
    await page.route('**/assets/imgs/**', (route) => route.abort('failed'));
    await page.goto('/');
    await settle(page);

    const fallback = page.locator('tvs-image .plate__fallback').first();
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAttribute('role', 'img');
    // The fallback still carries the description the photo would have had.
    expect(await fallback.getAttribute('aria-label')).toBeTruthy();
  });

  test('12. keyboard reaches the header actions and the first card', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const reached: string[] = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      reached.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el) return '';
          return (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60);
        })
      );
    }

    expect(reached.some((label) => /Spaces/i.test(label))).toBeTruthy();
    expect(reached.some((label) => /Sign in/i.test(label))).toBeTruthy();
    expect(reached.some((label) => /See spaces and prices/i.test(label))).toBeTruthy();

    // Focus is visibly indicated. The card link deliberately draws its ring on
    // the card plate rather than the anchor, so an ancestor counts too.
    const indicated = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      for (let node: HTMLElement | null = el; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) return true;
      }
      return false;
    });
    expect(indicated, 'the focused element had no visible focus indicator').toBe(true);
  });

  test('12b. every landing action shows a focus ring when focused by keyboard', async ({
    page,
  }) => {
    await page.goto('/');
    await settle(page);

    const targets = [
      '.nav__link',
      '.actions__primary',
      '.hero__cta',
      '.rule__button',
      'tvs-space-card a.card__link',
      '.scenario__action',
      '.close__cta',
    ];

    for (const selector of targets) {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded();
      // `Tab` from the preceding element is how :focus-visible is granted.
      await el.evaluate((node: HTMLElement) => node.focus());
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');

      const indicated = await el.evaluate((node: HTMLElement) => {
        for (let n: HTMLElement | null = node; n; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) return true;
        }
        return false;
      });
      expect(indicated, `${selector} had no focus ring`).toBe(true);
    }
  });

  test('13. reduced motion leaves every section readable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    // Deliberately no scroll walk: with motion reduced, nothing may be hidden
    // waiting for an observer.
    await page.waitForResponse((r) => r.url().includes('/bookings/spaces'));
    await page.waitForTimeout(400);

    for (const selector of [
      'tvs-space-card',
      'tvs-work-scenarios .scenario',
      'tvs-booking-process .step',
      'tvs-time-based-booking table',
      'tvs-trust-section .point',
    ]) {
      const first = page.locator(selector).first();
      await expect(first).toHaveCount(1);
      const opacity = await first.evaluate((el) => getComputedStyle(el).opacity);
      expect(Number(opacity), `${selector} was hidden under reduced motion`).toBe(1);
    }
  });

  const VIEWPORTS = [
    { w: 320, h: 568 },
    { w: 390, h: 844 },
    { w: 430, h: 932 },
    { w: 768, h: 1024 },
    { w: 1024, h: 768 },
    { w: 1280, h: 800 },
    { w: 1366, h: 768 },
    { w: 1440, h: 900 },
    { w: 1920, h: 1080 },
    { w: 2560, h: 1440 },
  ];

  for (const vp of VIEWPORTS) {
    test(`14. no horizontal overflow at ${vp.w}x${vp.h}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto('/');
      await settle(page);

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `overflow at ${vp.w}px`).toBeLessThanOrEqual(clientWidth + 1);
    });
  }

  test('15. no two links or buttons share an ambiguous accessible name', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const named = await page.evaluate(() => {
      const results: Array<{ name: string; target: string }> = [];
      const nodes = document.querySelectorAll<HTMLElement>('a[href], button');
      nodes.forEach((node) => {
        if (node.closest('.sheet')) return; // mobile panel is inert at desktop
        const name = (
          node.getAttribute('aria-label') ||
          node.innerText ||
          ''
        )
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
        if (!name) return;
        const target =
          node.tagName === 'A' ? (node as HTMLAnchorElement).getAttribute('href') || '' : 'button';
        results.push({ name, target });
      });
      return results;
    });

    // The same name is only acceptable when it leads to the same place.
    const byName = new Map<string, Set<string>>();
    for (const { name, target } of named) {
      if (!byName.has(name)) byName.set(name, new Set());
      byName.get(name)!.add(target);
    }

    const ambiguous = [...byName.entries()]
      .filter(([, targets]) => targets.size > 1)
      .map(([name, targets]) => `"${name}" -> ${[...targets].join(' | ')}`);

    expect(ambiguous, `ambiguous accessible names:\n${ambiguous.join('\n')}`).toEqual([]);
  });
});

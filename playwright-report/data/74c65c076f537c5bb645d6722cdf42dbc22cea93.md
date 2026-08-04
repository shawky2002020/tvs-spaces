# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> TVS Spaces Booking E2E Flow >> should register, select workspace, place hourly booking, verify on dashboard, and cancel it
- Location: e2e\booking.spec.ts:4:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dashboard$/
Received string:  "https://client-three-zeta-29.vercel.app/auth/register"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × locator resolved to <html lang="en" data-beasties-container="">…</html>
       - unexpected value "https://client-three-zeta-29.vercel.app/auth/register"

```

```yaml
- main:
  - link "Logo":
    - /url: /
    - img "Logo"
  - navigation:
    - link "Home":
      - /url: "#home"
    - link "About":
      - /url: "#about"
    - link "Spaces":
      - /url: "#desks"
    - link "Contact":
      - /url: "#contact"
  - link "Get Started":
    - /url: /auth/login
    - button "Get Started"
  - img "Logo"
  - button
  - navigation:
    - link "Home":
      - /url: "#home"
    - link "About":
      - /url: "#about"
    - link "Spaces":
      - /url: "#desks"
    - link "Contact":
      - /url: "#contact"
  - link "Sign In":
    - /url: /auth/login
    - button "Sign In"
  - link "Get Started":
    - /url: /auth/register
    - button "Get Started"
  - main:
    - heading "Join TVS Spaces!" [level=1]
    - paragraph: Start Fresh. Grow Fast. Belong Here.
    - paragraph: Create your account and unlock a world of productivity and community.
    - text: Sign Up
    - textbox "Full Name": E2E Tester
    - textbox "Email Address": e2e-tester-1785859464830@example.com
    - textbox "Password": E2EPassword123!
    - textbox "Confirm Password": E2EPassword123!
    - combobox:
      - option "Select your type"
      - option "Student"
      - option "Freelancer" [selected]
      - option "Entrepreneur"
      - option "Remote Worker"
      - option "Startup"
      - option "Other"
    - button "Register"
    - text: Already have an account?
    - link "Sign In":
      - /url: /auth/login
  - img "TVS Spaces Logo"
  - paragraph: Inspiring workspaces and vibrant communities for professionals in Cairo. Experience productivity in style.
  - link "Facebook":
    - /url: "#"
  - link "Twitter":
    - /url: "#"
  - link "LinkedIn":
    - /url: "#"
  - link "Instagram":
    - /url: "#"
  - heading "Workspace Solutions" [level=4]
  - list:
    - listitem:
      - link "Shared Desk":
        - /url: "#"
    - listitem:
      - link "Solo Desk":
        - /url: "#"
    - listitem:
      - link "PC Station":
        - /url: "#"
    - listitem:
      - link "Hot Desking":
        - /url: "#"
  - heading "Meeting Spaces" [level=4]
  - list:
    - listitem:
      - link "Team Room":
        - /url: "#"
    - listitem:
      - link "Big Meeting Room":
        - /url: "#"
    - listitem:
      - link "Conference Hall":
        - /url: "#"
    - listitem:
      - link "Private Office":
        - /url: "#"
  - heading "Quick Links" [level=4]
  - list:
    - listitem:
      - link "Book Now":
        - /url: "#"
    - listitem:
      - link "Pricing":
        - /url: "#"
    - listitem:
      - link "Virtual Tour":
        - /url: "#"
    - listitem:
      - link "Support":
        - /url: "#"
  - heading "Get In Touch" [level=4]
  - text: Visit Us
  - link "Office 9, 94 Fareed Smeika Heliopolis, Cairo":
    - /url: https://maps.app.goo.gl/8TNft7sHgBKcCM9D9
  - text: Call Us
  - link "+201 055 066 838":
    - /url: tel:+201055066838
  - text: Email Us
  - link "support@tvsspaces.com":
    - /url: mailto:support@tvsspaces.com
  - paragraph: © 2025 TVS Spaces. All rights reserved.
  - link "Privacy Policy":
    - /url: "#"
  - text: •
  - link "Terms of Service":
    - /url: "#"
  - text: •
  - link "Cookie Policy":
    - /url: "#"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('TVS Spaces Booking E2E Flow', () => {
  4  |   test('should register, select workspace, place hourly booking, verify on dashboard, and cancel it', async ({ page }) => {
  5  |     // Console debugging
  6  |     page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  7  |     page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  8  | 
  9  |     // 1. Register a new user
  10 |     const email = `e2e-tester-${Date.now()}@example.com`;
  11 |     await page.goto('/auth/register');
  12 |     await page.fill('input[placeholder="Full Name"]', 'E2E Tester');
  13 |     await page.fill('input[placeholder="Email Address"]', email);
  14 |     await page.fill('input[placeholder="Password"]', 'E2EPassword123!');
  15 |     await page.fill('input[placeholder="Confirm Password"]', 'E2EPassword123!');
  16 |     await page.selectOption('select', 'freelancer');
  17 |     await page.click('button[type="submit"]');
  18 | 
  19 |     // Wait for redirect to dashboard
> 20 |     await expect(page).toHaveURL(/\/dashboard$/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  21 | 
  22 |     // 2. Navigate to Spaces selection
  23 |     await page.click('aside a[href="/dashboard/booking"]');
  24 |     await expect(page).toHaveURL(/\/dashboard\/booking$/);
  25 | 
  26 |     // Select Shared Desk
  27 |     await page.locator('app-space-card').filter({ hasText: 'Shared Desk' }).first().click();
  28 |     await page.click('button.next-btn');
  29 |     await expect(page).toHaveURL(/\/dashboard\/booking\/dates$/);
  30 | 
  31 |     // 3. Configure Hourly Booking
  32 |     // Select plan Hourly
  33 |     await page.click('button:has-text("Hourly")');
  34 | 
  35 |     // Open Datepicker Calendar
  36 |     await page.click('mat-datepicker-toggle button');
  37 |     await page.waitForSelector('mat-calendar');
  38 | 
  39 |     // Click Next Month button to ensure the chosen date is 100% in the future
  40 |     await page.click('button.mat-calendar-next-button');
  41 | 
  42 |     // Choose the first available cell in the future month
  43 |     await page.locator('button.mat-calendar-body-cell:not([aria-disabled="true"])').first().click();
  44 | 
  45 |     // Select Start Time: 10:00 AM
  46 |     await page.click('mat-select[placeholder="Start Time"]');
  47 |     await page.click('mat-option:has-text("10:00 AM")');
  48 | 
  49 |     // Select End Time: 1:00 PM
  50 |     await page.click('mat-select[placeholder="End Time"]');
  51 |     await page.click('mat-option:has-text("1:00 PM")');
  52 | 
  53 |     // Wait for price calculation and availability validation
  54 |     await page.waitForSelector('.price-breakdown-details');
  55 |     await expect(page.locator('.total-price')).toContainText('EGP');
  56 | 
  57 |     // Click Continue
  58 |     await page.click('button.btn-continue');
  59 |     await expect(page).toHaveURL(/\/dashboard\/booking\/summary$/);
  60 | 
  61 |     // 4. Booking Summary
  62 |     await expect(page.locator('.item-value').first()).toContainText('Shared Desk');
  63 |     await expect(page.locator('.item-value').nth(1)).toContainText('Hourly');
  64 |     await page.click('button:has-text("Proceed to Checkout")');
  65 |     await expect(page).toHaveURL(/\/dashboard\/booking\/checkout$/);
  66 | 
  67 |     // 5. Checkout and Confirm
  68 |     // Select Credit/Debit Card payment method
  69 |     await page.click('text="Credit/Debit Card"');
  70 | 
  71 |     // Click pay now / place booking
  72 |     await page.click('button:has-text("Complete Payment")');
  73 | 
  74 |     // Wait for auto redirect back to dashboard
  75 |     await page.waitForURL(/\/dashboard$/, { timeout: 10000 });
  76 | 
  77 |     // 6. Verify on Dashboard and Cancel
  78 |     // Expect the booking to be in the table
  79 |     await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('Shared Desk');
  80 |     await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('CONFIRMED');
  81 | 
  82 |     // Setup dialog handler to accept cancellation confirm prompt
  83 |     page.on('dialog', async (dialog) => {
  84 |       expect(dialog.message()).toContain('cancel this booking');
  85 |       await dialog.accept();
  86 |     });
  87 | 
  88 |     // Click Cancel
  89 |     await page.locator('table.bookings-table tbody tr').first().locator('button:has-text("Cancel")').click();
  90 | 
  91 |     // Verify booking updates to CANCELLED
  92 |     await expect(page.locator('table.bookings-table tbody tr').first()).toContainText('CANCELLED');
  93 |   });
  94 | });
  95 | 
```
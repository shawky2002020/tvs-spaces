# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reservation-flow.spec.ts >> registers, restores session, books, cancels, and logs out
- Location: e2e\reservation-flow.spec.ts:3:5

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 45000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - generic:
      - generic [ref=e7]:
        - link [ref=e8] [cursor=pointer]:
          - /url: /
          - img "Logo" [ref=e10]
        - navigation [ref=e11]:
          - link "Home" [ref=e12] [cursor=pointer]:
            - /url: "#home"
          - link "About" [ref=e13] [cursor=pointer]:
            - /url: "#about"
          - link "Spaces" [ref=e14] [cursor=pointer]:
            - /url: "#desks"
          - link "Contact" [ref=e15] [cursor=pointer]:
            - /url: "#contact"
        - link [ref=e17] [cursor=pointer]:
          - /url: /auth/login
          - button "Get Started" [ref=e18]
      - generic [ref=e20]:
        - generic [ref=e21]:
          - img "Logo" [ref=e23]
          - button [ref=e24] [cursor=pointer]
        - navigation [ref=e26]:
          - link "Home" [ref=e27] [cursor=pointer]:
            - /url: "#home"
          - link "About" [ref=e28] [cursor=pointer]:
            - /url: "#about"
          - link "Spaces" [ref=e29] [cursor=pointer]:
            - /url: "#desks"
          - link "Contact" [ref=e30] [cursor=pointer]:
            - /url: "#contact"
        - generic [ref=e31]:
          - link [ref=e32] [cursor=pointer]:
            - /url: /auth/login
            - button "Sign In" [ref=e33]
          - link [ref=e34] [cursor=pointer]:
            - /url: /auth/register
            - button "Get Started" [ref=e35]
    - main [ref=e36]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - heading "Join TVS Spaces!" [level=1] [ref=e40]
          - paragraph [ref=e41]: Start Fresh. Grow Fast. Belong Here.
          - paragraph [ref=e42]: Create your account and unlock a world of productivity and community.
        - generic [ref=e43]:
          - generic [ref=e44]: Sign Up
          - generic [ref=e45]:
            - textbox "Full Name" [ref=e47]: Browser E2E User
            - textbox "Email Address" [ref=e49]: browser-e2e-1785859481407@example.com
            - textbox "Password" [ref=e51]: BrowserPass123
            - textbox "Confirm Password" [ref=e53]: BrowserPass123
            - combobox [ref=e55]:
              - option "Select your type"
              - option "Student"
              - option "Freelancer" [selected]
              - option "Entrepreneur"
              - option "Remote Worker"
              - option "Startup"
              - option "Other"
            - button "Register" [active] [ref=e57] [cursor=pointer]
          - generic [ref=e58]:
            - text: Already have an account?
            - link "Sign In" [ref=e59] [cursor=pointer]:
              - /url: /auth/login
    - generic [ref=e62]:
      - generic [ref=e63]:
        - generic [ref=e65]:
          - img "TVS Spaces Logo" [ref=e67]
          - paragraph [ref=e68]: Inspiring workspaces and vibrant communities for professionals in Cairo. Experience productivity in style.
          - generic [ref=e69]:
            - link "Facebook" [ref=e70] [cursor=pointer]:
              - /url: "#"
            - link "Twitter" [ref=e72] [cursor=pointer]:
              - /url: "#"
            - link "LinkedIn" [ref=e74] [cursor=pointer]:
              - /url: "#"
            - link "Instagram" [ref=e76] [cursor=pointer]:
              - /url: "#"
        - generic [ref=e78]:
          - generic [ref=e79]:
            - heading "Workspace Solutions" [level=4] [ref=e80]
            - list [ref=e81]:
              - listitem [ref=e82]:
                - link "Shared Desk" [ref=e83] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e84]:
                - link "Solo Desk" [ref=e85] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e86]:
                - link "PC Station" [ref=e87] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e88]:
                - link "Hot Desking" [ref=e89] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e90]:
            - heading "Meeting Spaces" [level=4] [ref=e91]
            - list [ref=e92]:
              - listitem [ref=e93]:
                - link "Team Room" [ref=e94] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e95]:
                - link "Big Meeting Room" [ref=e96] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e97]:
                - link "Conference Hall" [ref=e98] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e99]:
                - link "Private Office" [ref=e100] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e101]:
            - heading "Quick Links" [level=4] [ref=e102]
            - list [ref=e103]:
              - listitem [ref=e104]:
                - link "Book Now" [ref=e105] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e106]:
                - link "Pricing" [ref=e107] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e108]:
                - link "Virtual Tour" [ref=e109] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e110]:
                - link "Support" [ref=e111] [cursor=pointer]:
                  - /url: "#"
        - generic [ref=e112]:
          - heading "Get In Touch" [level=4] [ref=e113]
          - generic [ref=e114]:
            - generic [ref=e118]:
              - generic [ref=e119]: Visit Us
              - link "Office 9, 94 Fareed Smeika Heliopolis, Cairo" [ref=e120] [cursor=pointer]:
                - /url: https://maps.app.goo.gl/8TNft7sHgBKcCM9D9
                - text: Office 9, 94 Fareed SmeikaHeliopolis, Cairo
            - generic [ref=e124]:
              - generic [ref=e125]: Call Us
              - link "+201 055 066 838" [ref=e126] [cursor=pointer]:
                - /url: tel:+201055066838
            - generic [ref=e130]:
              - generic [ref=e131]: Email Us
              - link "support@tvsspaces.com" [ref=e132] [cursor=pointer]:
                - /url: mailto:support@tvsspaces.com
      - generic [ref=e134]:
        - paragraph [ref=e135]: © 2025 TVS Spaces. All rights reserved.
        - generic [ref=e136]:
          - link "Privacy Policy" [ref=e137] [cursor=pointer]:
            - /url: "#"
          - generic [ref=e138]: •
          - link "Terms of Service" [ref=e139] [cursor=pointer]:
            - /url: "#"
          - generic [ref=e140]: •
          - link "Cookie Policy" [ref=e141] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | test('registers, restores session, books, cancels, and logs out', async ({ page }) => {
  4  |   const unique = Date.now();
  5  |   const email = `browser-e2e-${unique}@example.com`;
  6  |   const password = 'BrowserPass123';
  7  | 
  8  |   await page.goto('/auth/register');
  9  |   await page.getByPlaceholder('Full Name').fill('Browser E2E User');
  10 |   await page.getByPlaceholder('Email Address').fill(email);
  11 |   await page.getByPlaceholder('Password', { exact: true }).fill(password);
  12 |   await page.getByPlaceholder('Confirm Password').fill(password);
  13 |   await page.locator('select[formControlName="userType"]').selectOption('freelancer');
  14 | 
  15 |   page.once('dialog', async (dialog) => {
  16 |     expect(dialog.message()).toContain('registered successfully');
  17 |     await dialog.accept();
  18 |   });
  19 |   await page.getByRole('button', { name: 'Register' }).click();
> 20 |   await page.waitForURL('**/dashboard');
     |              ^ Error: page.waitForURL: Test timeout of 45000ms exceeded.
  21 |   await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  22 | 
  23 |   // The access token is memory-only. Reload must recover through the rotated
  24 |   // HttpOnly refresh cookie instead of redirecting to login.
  25 |   await page.reload();
  26 |   await page.waitForURL('**/dashboard');
  27 |   await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  28 | 
  29 |   await page.goto('/dashboard/booking');
  30 |   await expect(page.getByRole('heading', { name: 'Choose Your Workspace' })).toBeVisible();
  31 | 
  32 |   const sharedDesk = page.locator('app-space-card').filter({ hasText: 'Shared Desk' });
  33 |   await expect(sharedDesk).toBeVisible();
  34 |   await sharedDesk.click();
  35 |   await page.getByRole('button', { name: 'Next', exact: true }).click();
  36 |   await page.waitForURL('**/dashboard/booking/dates');
  37 | 
  38 |   // Choose a future-day slot so booking creation cannot fail as a past time.
  39 |   const tomorrowRow = page.locator('.grid-row').nth(1);
  40 |   const availableSlot = tomorrowRow.locator('.slot-cell.available').first();
  41 |   await expect(availableSlot).toBeVisible();
  42 |   await availableSlot.click();
  43 | 
  44 |   await expect(page.locator('.price-summary')).toBeVisible();
  45 |   const dateNext = page.getByRole('button', { name: 'Proceed to next step' });
  46 |   await expect(dateNext).toBeEnabled();
  47 |   await dateNext.click();
  48 | 
  49 |   await page.waitForURL('**/dashboard/booking/summary');
  50 |   await expect(page.getByRole('heading', { name: 'Booking Summary' })).toBeVisible();
  51 |   await expect(page.getByText('Shared Desk')).toBeVisible();
  52 |   await page.getByRole('button', { name: /Proceed to Checkout/ }).click();
  53 | 
  54 |   await page.waitForURL('**/dashboard/booking/checkout');
  55 |   await expect(page.getByRole('heading', { name: 'Confirm Your Booking' })).toBeVisible();
  56 |   await expect(page.getByText('Pay at Venue')).toBeVisible();
  57 |   await page.getByRole('button', { name: 'Confirm Booking' }).click();
  58 | 
  59 |   await page.waitForURL('**/dashboard');
  60 |   const bookingRow = page.locator('tbody tr').filter({ hasText: 'Shared Desk' }).first();
  61 |   await expect(bookingRow).toBeVisible();
  62 |   await expect(bookingRow).toContainText('Upcoming');
  63 | 
  64 |   // A reload proves the row comes from the backend rather than component state.
  65 |   await page.reload();
  66 |   const persistedRow = page.locator('tbody tr').filter({ hasText: 'Shared Desk' }).first();
  67 |   await expect(persistedRow).toBeVisible();
  68 | 
  69 |   page.once('dialog', async (dialog) => {
  70 |     expect(dialog.message()).toContain('Cancel booking');
  71 |     await dialog.accept();
  72 |   });
  73 |   await persistedRow.getByRole('button', { name: 'Cancel' }).click();
  74 | 
  75 |   const cancelledRow = page.locator('tbody tr').filter({ hasText: 'Shared Desk' }).first();
  76 |   await expect(cancelledRow).toContainText('Cancelled');
  77 | 
  78 |   await page.getByRole('button', { name: 'Logout' }).click();
  79 |   await page.waitForURL('**/auth/login');
  80 | 
  81 |   await page.goto('/dashboard');
  82 |   await page.waitForURL('**/auth/login');
  83 |   await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  84 | });
  85 | 
```
const { test, expect } = require('@playwright/test');

test.describe('QR Code Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays navigation bar with app icon and title', async ({ page }) => {
    const navBar = page.locator('.nav-bar');
    await expect(navBar).toBeVisible();

    const appIcon = navBar.locator('.app-icon');
    await expect(appIcon).toBeVisible();

    const title = navBar.locator('.nav-title', { hasText: 'QR Code Generator' });
    await expect(title).toBeVisible();
  });

  test('app icon navigates to home when on shared URL', async ({ page }) => {
    await page.goto('/?text=dGVzdA%3D%3D&size=200');
    expect(page.url()).toContain('?text=');

    await page.locator('.app-icon-link').click();
    expect(page.url()).not.toContain('?');
  });

  test('generates QR code from text input', async ({ page }) => {
    const textarea = page.locator('#text');
    await textarea.fill('https://example.com');

    await page.locator('#generate-btn').click();

    const canvas = page.locator('#qrcode canvas');
    await expect(canvas).toBeVisible();
  });

  test('download and share buttons are disabled until QR is generated', async ({ page }) => {
    await expect(page.locator('#download-btn')).toBeDisabled();
    await expect(page.locator('#share-btn')).toBeDisabled();

    await page.locator('#text').fill('test');
    await page.locator('#generate-btn').click();

    await expect(page.locator('#download-btn')).toBeEnabled();
    await expect(page.locator('#share-btn')).toBeEnabled();
  });

  test('loads content from URL params and auto-generates', async ({ page }) => {
    const encodedText = btoa(encodeURIComponent('hello'));
    await page.goto(`/?text=${encodedText}&size=200`);

    await expect(page.locator('#text')).toHaveValue('hello');
    await expect(page.locator('#qrcode canvas')).toBeVisible();
  });
});

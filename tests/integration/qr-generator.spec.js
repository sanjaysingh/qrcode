import { test, expect } from '@playwright/test';

test.describe('QR Code Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the main UI elements', async ({ page }) => {
    await expect(page.locator('.nav-bar .nav-title')).toHaveText('QR Code Generator');
    await expect(page.locator('#text')).toBeVisible();
    await expect(page.locator('#generate-btn')).toBeVisible();
    await expect(page.locator('#qrcode')).toBeVisible();
  });

  test('displays navigation bar with app icon and title', async ({ page }) => {
    const navBar = page.locator('.nav-bar');
    await expect(navBar).toBeVisible();
    await expect(navBar.locator('.app-icon')).toBeVisible();
    await expect(navBar.locator('.nav-title', { hasText: 'QR Code Generator' })).toBeVisible();
  });

  test('app icon navigates to home when on shared URL', async ({ page }) => {
    await page.goto('/?text=dGVzdA%3D%3D&size=200');
    expect(page.url()).toContain('?text=');

    await page.locator('.app-icon-link').click();
    expect(page.url()).not.toContain('?');
  });

  test('generate button is disabled when text is empty', async ({ page }) => {
    await expect(page.locator('#generate-btn')).toBeDisabled();
  });

  test('generate button is enabled when text is entered', async ({ page }) => {
    await page.locator('#text').fill('Hello World');
    await expect(page.locator('#generate-btn')).toBeEnabled();
  });

  test('generates QR code when clicking generate', async ({ page }) => {
    await page.locator('#text').fill('https://example.com');
    await page.locator('#generate-btn').click();

    await expect(page.locator('#qrcode canvas')).toBeVisible({ timeout: 5000 });
  });

  test('download and share buttons are disabled before generating', async ({ page }) => {
    await expect(page.locator('#download-btn')).toBeDisabled();
    await expect(page.locator('#share-btn')).toBeDisabled();
  });

  test('download and share buttons are enabled after generating', async ({ page }) => {
    await page.locator('#text').fill('Test content');
    await page.locator('#generate-btn').click();

    await expect(page.locator('#qrcode canvas')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#download-btn')).toBeEnabled();
    await expect(page.locator('#share-btn')).toBeEnabled();
  });

  test('updates URL with encoded content after generating', async ({ page }) => {
    await page.locator('#text').fill('Share me');
    await page.locator('#generate-btn').click();

    await expect(page.locator('#qrcode canvas')).toBeVisible({ timeout: 5000 });

    const url = page.url();
    expect(url).toContain('?text=');
    expect(url).toContain('&size=');
  });

  test('loads content from URL parameters', async ({ page }) => {
    const encodedText = Buffer.from(encodeURIComponent('Preloaded content')).toString('base64');
    await page.goto(`/?text=${encodedText}&size=200`);

    await expect(page.locator('#qrcode canvas')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#text')).toHaveValue('Preloaded content');
  });

  test('size selector changes QR code dimensions', async ({ page }) => {
    await page.locator('#text').fill('Size test');
    await page.locator('#size').selectOption('512');
    await page.locator('#generate-btn').click();

    await expect(page.locator('#qrcode canvas')).toBeVisible({ timeout: 5000 });
    const canvas = page.locator('#qrcode canvas');
    await expect(canvas).toHaveAttribute('width', '512');
    await expect(canvas).toHaveAttribute('height', '512');
  });

  test('clears previous QR code when generating new one', async ({ page }) => {
    await page.locator('#text').fill('First');
    await page.locator('#generate-btn').click();
    await expect(page.locator('#qrcode canvas')).toBeVisible({ timeout: 5000 });

    await page.locator('#text').fill('Second');
    await page.locator('#generate-btn').click();
    await expect(page.locator('#qrcode canvas')).toHaveCount(1);
  });
});

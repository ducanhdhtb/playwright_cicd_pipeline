const { test, expect } = require('@playwright/test');

test('home page shows project title and login link', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Automation Demo Home/);
  await expect(page.getByRole('heading', { name: 'Playwright CI/CD Demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Đi tới login' })).toBeVisible();
});

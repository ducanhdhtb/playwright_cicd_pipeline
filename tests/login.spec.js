const { test, expect } = require('@playwright/test');
const users = require('../test-data/users.json');

test('valid user can login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill(users[0].username);
  await page.getByLabel('Password').fill(users[0].password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText(`Welcome, ${users[0].username}`)).toBeVisible();
  await expect(page.getByText('Status: authenticated')).toBeVisible();
});

test('invalid password shows error message', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill(users[0].username);
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/login\?error=/);
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});

test('dashboard redirects to login when user is missing', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/login\?error=Please/);
  await expect(page.getByText('Please login first')).toBeVisible();
});

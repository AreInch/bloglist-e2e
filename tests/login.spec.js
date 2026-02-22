import { test, expect } from '@playwright/test';
import axios from 'axios';

test.describe('Login flow', () => {
  const apiUrl = 'http://localhost:3001/api';

  test.beforeEach(async () => {
    await axios.post(`${apiUrl}/testing/reset`);

    await axios.post(`${apiUrl}/users`, {
      username: 'testuser',
      name: 'Test User',
      password: 'secret',
    });
  });

  test('application displays login form by default', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/login to application/i)).toBeVisible();

    const inputs = page.locator('input');
    await expect(inputs.nth(0)).toBeVisible();
    await expect(inputs.nth(1)).toBeVisible();

    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('succeeds with correct credentials', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('input');
    await inputs.nth(0).fill('testuser');
    await inputs.nth(1).fill('secret');

    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByText(/testuser logged in/i)).toBeVisible();
  });

  test('fails with wrong credentials', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('input');
    await inputs.nth(0).fill('testuser');
    await inputs.nth(1).fill('wrongpassword');

    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByText(/wrong username or password/i)).toBeVisible();

    await expect(page.getByText(/testuser logged in/i)).not.toBeVisible();
  });
});
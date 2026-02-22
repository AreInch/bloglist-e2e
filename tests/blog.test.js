import { test, expect } from '@playwright/test'
import axios from 'axios'

test.beforeEach(async ({ page }) => {
  await axios.post('http://localhost:3001/api/testing/reset')

  await axios.post('http://localhost:3001/api/users', {
    username: 'testuser',
    name: 'Test User',
    password: 'secret'
  })

  await page.goto('http://localhost:5173') 
})

test('logged in user can create a blog, see it in list, like the blog and delete his/her blog', async ({ page }) => {
  const inputs = page.locator('input');
  await inputs.nth(0).fill('testuser');
  await inputs.nth(1).fill('secret');
  await page.getByRole('button', { name: /login/i }).click();

  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('title').fill('Playwright Test Blog')
  await page.getByPlaceholder('author').fill('AreInch')
  await page.getByPlaceholder('url').fill('http://testblog.com')
  await page.getByRole('button', { name: 'create' }).click()

  const blogItem = page.getByText('Playwright Test Blog AreInch')
  await expect(blogItem).toBeVisible()

  await page.getByRole("button", {name: "view" }).click()
  await page.getByRole("button", {name: "like" }).click()
  await expect(page.getByText('likes 1')).toBeVisible()

  page.once('dialog', async dialog => {
        await dialog.accept()   
    })
   await page.getByRole("button", { name: "delete" }).click();

  await expect(page.getByText("Playwright Test Blog AreInch")).not.toBeVisible()
})

import { test, expect } from '@playwright/test'
import axios from 'axios'

test.beforeEach(async ({ page }) => {
  await axios.post('http://localhost:3001/api/testing/reset')

  await axios.post('http://localhost:3001/api/users', {
    username: 'testuser',
    name: 'Test User',
    password: 'secret'
  })

  await axios.post('http://localhost:3001/api/users', {
    username: 'otheruser',
    name: 'Other User',
    password: 'secret'
  })

  await page.goto('http://localhost:5173')
})

test('only blog creator sees delete button', async ({ page }) => {
  await page.getByPlaceholder('username').fill('testuser')
  await page.getByPlaceholder('password').fill('secret')
  await page.getByRole('button', { name: /login/i }).click()

  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('title').fill('Ownership Test Blog')
  await page.getByPlaceholder('author').fill('AreInch')
  await page.getByPlaceholder('url').fill('http://ownershiptest.com')
  await page.getByRole('button', { name: 'create' }).click()

  const blogItem = page.getByText('Ownership Test Blog AreInch')
  await expect(blogItem).toBeVisible()

  await page.getByRole('button', { name: /logout/i }).click()

  await page.getByPlaceholder('username').fill('otheruser')
  await page.getByPlaceholder('password').fill('secret')
  await page.getByRole('button', { name: /login/i }).click()

  await page.getByRole('button', { name: 'view' }).click()

  await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)
})
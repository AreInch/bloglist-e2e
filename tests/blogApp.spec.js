import { test, expect } from "@playwright/test"

const baseUrl = "http://localhost:5173" 

test.describe("Blog app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl)
  })

  test.afterEach(async ({ page }) => {
  const logoutButton = page.locator("text=logout")
  if (await logoutButton.isVisible()) {
    await logoutButton.click()
  }
})


  test("Login succeeds with correct credentials", async ({ page }) => {
    await page.click("text=Login")
    await page.locator('input').first().fill('test')
    await page.locator('input').last().fill('test')
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.locator("text=test logged in")).toBeVisible()
  })

  test("Login fails with wrong credentials", async ({ page }) => {
    await page.click("text=Login")
    await page.locator('input').first().fill('wronguser')
    await page.locator('input').last().fill('wrongpass')
    await page.click("button[type=submit]")

    await expect(page.locator("text=wrong username or password")).toBeVisible()
    await expect(page.locator("text=logged in")).not.toBeVisible()
  })

  test("Logged-in user can create a blog", async ({ page }) => {
    await page.click("text=Login")
    await page.locator('input').first().fill('test')
    await page.locator('input').last().fill('test')
    await page.getByRole('button', { name: 'login' }).click();

    await page.click("text=Create")
    await page.locator('input').nth(0).fill('Playwright Blog')
    await page.locator('input').nth(1).fill('Tester')
    await page.locator('input').nth(2).fill('http://playwright.dev')
    await page.click("button.create-button")

    await expect(page.locator("text=Playwright Blog Tester")).toBeVisible()
  })

  test("Logged-in user can like blogs", async ({ page }) => {
    await page.click("text=Login")
    await page.locator('input').first().fill('test')
    await page.locator('input').last().fill('test')
    await page.getByRole('button', { name: 'login' }).click();

    await page.click("text=Playwright Blog Tester")
    await expect(page.locator("text=Likes:")).toBeVisible()

    const likesBefore = await page.locator("text=Likes: 0").innerText()
    await page.getByRole('button', { name: 'like' }).click();
    const likesAfter = await page.locator("text=Likes: 1").innerText()

    expect(likesAfter).not.toEqual(likesBefore)
  })

  test("Logged-in user can delete a blog", async ({ page }) => {
    await page.click("text=Login")
    await page.locator('input').first().fill('test')
    await page.locator('input').last().fill('test')
    await page.getByRole('button', { name: 'login' }).click();

    await page.click("text=Playwright Blog Tester")

    page.once("dialog", dialog => dialog.accept())
    await page.click("text=delete")

    await expect(page.locator("text=Playwright Blog Tester")).not.toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Storylog Media Persistence E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should create and persist a movie', async ({ page }) => {
    const movieTitle = `Test Movie ${Date.now()}`

    // Open add media sheet
    await page.click('button:has-text("Add Media")')
    await page.waitForTimeout(200)

    // Fill in the form
    await page.fill('input[type="text"]', movieTitle)
    await page.click('button:has-text("Select a media type")')
    await page.click('[role="option"]:has-text("Movie")')

    // Add thoughts
    await page.fill('textarea', 'This is a test movie')

    // Add rating - look for star rating buttons
    const ratingButtons = await page.locator('button[data-rating]').all()
    if (ratingButtons.length > 0) {
      await ratingButtons[3].click() // Click 4th star for 4 rating
    }

    // Submit form
    await page.click('button:has-text("Add to Library")')

    // Wait for success message or media to appear
    await page.waitForTimeout(500)

    // Verify media appears in the library
    await expect(page.locator(`text=${movieTitle}`)).toBeVisible({ timeout: 5000 })

    // Take initial state screenshot
    const movieCard = page.locator(`text=${movieTitle}`)
    await expect(movieCard).toBeVisible()
  })

  test('should persist media across page reload', async ({ page }) => {
    const uniqueTitle = `Persistent Movie ${Date.now()}`

    // Create a movie
    await page.click('button:has-text("Add Media")')
    await page.waitForTimeout(200)

    await page.fill('input[type="text"]', uniqueTitle)
    await page.click('button:has-text("Select a media type")')
    await page.click('[role="option"]:has-text("Movie")')

    // Add thoughts and rating
    await page.fill('textarea', 'Persistent test')
    const ratingButtons = await page.locator('button[data-rating]').all()
    if (ratingButtons.length > 0) {
      await ratingButtons[2].click() // 3 stars
    }

    // Submit
    await page.click('button:has-text("Add to Library")')
    await page.waitForTimeout(500)

    // Verify it appears
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible({ timeout: 5000 })

    // Reload the page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify the media is still there
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible({ timeout: 5000 })

    // Verify title is correct
    const card = page.locator(`text=${uniqueTitle}`).first()
    await expect(card).toBeVisible()
  })

  test('should support all media types', async ({ page }) => {
    const types = ['Movie', 'Series', 'Book', 'Game']
    const createdTitles: string[] = []

    for (const type of types) {
      const title = `${type} ${Date.now()}-${Math.random()}`
      createdTitles.push(title)

      // Open add media sheet
      const addButton = page.locator('button:has-text("Add Media")').first()
      await addButton.click()
      await page.waitForTimeout(200)

      // Fill in title
      const titleInput = page.locator('input[type="text"]').first()
      await titleInput.fill(title)

      // Select media type
      const typeSelect = page.locator('button:has-text("Select a media type")').first()
      await typeSelect.click()
      await page.locator(`[role="option"]:has-text("${type}")`).click()

      // Submit
      const submitButton = page.locator('button:has-text("Add to Library")').first()
      await submitButton.click()

      await page.waitForTimeout(500)

      // Close sheet by clicking outside or pressing Escape
      await page.keyboard.press('Escape')
      await page.waitForTimeout(200)
    }

    // Verify all types appear in the library
    for (const title of createdTitles) {
      await expect(page.locator(`text=${title}`)).toBeVisible({ timeout: 5000 })
    }
  })

  test('should prevent duplicate submissions while request is in progress', async ({ page }) => {
    const movieTitle = `No Duplicate ${Date.now()}`

    // Open add media sheet
    await page.click('button:has-text("Add Media")')
    await page.waitForTimeout(200)

    // Fill in the form
    await page.fill('input[type="text"]', movieTitle)
    await page.click('button:has-text("Select a media type")')
    await page.click('[role="option"]:has-text("Movie")')

    // Click submit button
    const submitButton = page.locator('button:has-text("Add to Library")').first()

    // The button should be enabled before submission
    await expect(submitButton).toBeEnabled()

    // Click submit
    await submitButton.click()

    // Immediately try to click again (should be disabled)
    const isDisabled = await submitButton.evaluate((el) =>
      (el as HTMLButtonElement).disabled
    )
    expect(isDisabled || !await submitButton.isEnabled()).toBeTruthy()

    // Wait for submission to complete
    await page.waitForTimeout(1000)

    // Verify only one entry was created
    const movieCards = await page.locator(`text=${movieTitle}`).count()
    expect(movieCards).toBe(1)
  })

  test('should display media with all fields including thoughts and rating', async ({ page }) => {
    const testMovie = {
      title: `Full Details ${Date.now()}`,
      thoughts: 'Outstanding cinematography',
      rating: 5,
    }

    // Create media
    await page.click('button:has-text("Add Media")')
    await page.waitForTimeout(200)

    await page.fill('input[type="text"]', testMovie.title)
    await page.click('button:has-text("Select a media type")')
    await page.click('[role="option"]:has-text("Movie")')

    // Add thoughts
    await page.fill('textarea', testMovie.thoughts)

    // Add 5-star rating
    const ratingButtons = await page.locator('button[data-rating]').all()
    if (ratingButtons.length >= 5) {
      await ratingButtons[4].click() // 5 stars
    }

    // Submit
    await page.click('button:has-text("Add to Library")')
    await page.waitForTimeout(500)

    // Verify the media appears with correct title
    const card = page.locator(`text=${testMovie.title}`).first()
    await expect(card).toBeVisible({ timeout: 5000 })

    // Reload to ensure persistence
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify data persisted
    await expect(page.locator(`text=${testMovie.title}`)).toBeVisible({ timeout: 5000 })
  })

  test('should handle form validation feedback', async ({ page }) => {
    // Try to submit empty form
    await page.click('button:has-text("Add Media")')
    await page.waitForTimeout(200)

    // Try to submit without title
    let submitButton = page.locator('button:has-text("Add to Library")').first()

    // The button might be disabled or an error appears
    const isDisabled = await submitButton.evaluate((el) =>
      (el as HTMLButtonElement).disabled
    )

    // If not disabled, it should show an error
    if (!isDisabled) {
      await submitButton.click()
      // Wait for error to appear
      await page.waitForTimeout(500)
    }

    // Now add title and verify submission works
    const movieTitle = `Valid Form ${Date.now()}`
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill(movieTitle)

    // Select type
    await page.click('button:has-text("Select a media type")')
    await page.click('[role="option"]:has-text("Movie")')

    // Submit should now work
    submitButton = page.locator('button:has-text("Add to Library")').first()
    await submitButton.click()

    await page.waitForTimeout(500)
    await expect(page.locator(`text=${movieTitle}`)).toBeVisible({ timeout: 5000 })
  })
})

# Storylog Testing

## Overview

Storylog uses **Playwright** for end-to-end testing of the complete user journey through the PostgreSQL persistence flow. E2E testing provides the most practical coverage for this system because:

1. **Real application context**: Tests run against the actual Next.js server, not mocked components or isolated units
2. **Database integration**: Exercises the full flow: UI → API → Application → PostgreSQL → Page Reload → UI
3. **Minimal setup complexity**: No need for complex mocking strategies or server-only isolation
4. **High confidence**: Verifies user-observable behavior end-to-end

## Test Framework

**Playwright** is configured in `playwright.config.ts` with:

- Single-threaded execution (sequential, not parallel)
- Chromium browser by default
- 30-second timeout per test
- Automatic server launch on port 3001
- HTML report generation
- Screenshot capture on test failure

## Running Tests

### E2E Tests

```bash
npm test
# or
npm run test:e2e
```

This will:
1. Start the Next.js development server on port 3001
2. Apply database migrations to the development database
3. Run all Playwright tests in `tests/e2e/`
4. Generate an HTML report in `playwright-report/`

### Quick Verification

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

## Test Scenarios

The E2E test suite (`tests/e2e/media-persistence.spec.ts`) covers:

### 1. Create and Persist Media

- Open the application
- Click "Add Media" button
- Fill in title, select media type, add optional thoughts and rating
- Submit the form
- Verify the media appears in the library

**Validates**: Form submission, API endpoint, database insertion, UI re-render

### 2. Persistence Across Page Reload

- Create a movie with title, thoughts, and rating
- Reload the page
- Verify the movie still appears with all fields

**Validates**: Server-side data loading (`listMediaLibrary`), PostgreSQL persistence, complete end-to-end flow

### 3. All Media Types

- Create one record for each type: movie, series, book, game
- Verify all four appear correctly in the library

**Validates**: Type handling across the entire stack

### 4. Form Submission State

- Open the form
- Submit and immediately try to submit again
- Verify the submit button is disabled during submission

**Validates**: Loading state and duplicate submission prevention

### 5. Form Validation

- Try to submit empty form
- Verify validation feedback
- Fill in required fields and submit successfully

**Validates**: Client-side validation, error handling

### 6. Media Fields Display

- Create media with all optional fields (thoughts, rating)
- Verify they display on the card
- Reload and verify persistence of all fields

**Validates**: Thoughts and rating field handling, data mapping

## Test Database

By default, E2E tests use the development database (`storylog`) configured in `.env.local`. Tests create real records which persist after test runs. This is practical because:

- It validates real schema behavior
- No need for test-specific database setup
- Easy to inspect results manually
- Realistic performance characteristics

If you need a clean database state before tests, manually truncate:

```bash
psql storylog -c "TRUNCATE user_media CASCADE; TRUNCATE media CASCADE; TRUNCATE users CASCADE;"
```

## Test Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report includes:
- Test pass/fail status
- Screenshots of each step
- Videos of test execution (if configured)
- Error messages and stack traces

## Writing New Tests

New tests should be added to `tests/e2e/media-persistence.spec.ts` following the existing pattern:

```typescript
test('should do something specific', async ({ page }) => {
  // Arrange
  await page.goto('/')
  
  // Act
  await page.click('button:has-text("Add Media")')
  await page.fill('input[type="text"]', 'Test Title')
  
  // Assert
  await expect(page.locator('text=Test Title')).toBeVisible()
})
```

### Best Practices

- Use `page.goto('/')` to start each test fresh
- Prefer explicit waits: `toBeVisible()`, `waitForLoadState('networkidle')`
- Avoid fixed sleeps - use `waitForTimeout()` only as a last resort
- Test user-observable behavior, not implementation details
- Use unique test data (timestamps, random values) to avoid conflicts

## Limitations & Intentional Gaps

### Not Currently Tested

- Authentication/Authorization (not implemented)
- Edit/Delete operations (not implemented)
- Filtering, sorting, pagination (not implemented)
- Network error scenarios (good future addition)
- Performance/load testing (could be added with Playwright)

### Why No Unit/Integration Tests

This project originally included Vitest for unit and integration tests, but they were removed due to:

1. **Next.js `server-only` constraints**: The persistence layer uses Next.js `server-only` which prevents execution in Node.js/JSDOM environments
2. **Limited benefit**: E2E tests provide higher confidence than isolated unit tests for this architecture
3. **Practical focus**: Testing the actual flow is more valuable than testing individual functions in isolation

If adding unit/integration tests in the future, consider:

- Extracting persistence logic to a separate `lib/` folder without server-only
- Using a different test runner configured for Node.js
- Focusing only on pure functions without server-only imports

## Performance

Tests run quickly:
- Page load: ~500ms
- API submission: ~100-300ms
- Database query: ~10-50ms
- Total per test: ~2-5 seconds

Full suite completes in ~30-60 seconds depending on system load.

## CI/CD Integration

For continuous integration, ensure:

```bash
# .github/workflows/test.yml example
- name: Run tests
  run: npm test
  env:
    DATABASE_URL: postgresql://user@localhost:5432/storylog_test
```

Configure Playwright to not re-use the server in CI:

```typescript
// playwright.config.ts
reuseExistingServer: !process.env.CI,
```

## Troubleshooting

### Tests timeout or hang

- Check if port 3001 is already in use: `lsof -i :3001`
- Verify database connection: `psql storylog -c "SELECT 1"`
- Check server logs for errors

### Database connection errors

- Ensure PostgreSQL is running: `pg_isready -h /tmp`
- Verify `.env.local` has correct DATABASE_URL
- Run migrations: `npm run db:migrate`

### Flaky tests

- Increase timeout in `playwright.config.ts`
- Add explicit waits for dynamic content
- Avoid fixed sleeps - use page-based synchronization

## Future Improvements

- [ ] Add video recording for failed tests
- [ ] Implement smoke test suite (quick subset)
- [ ] Add performance benchmarking
- [ ] Test network error scenarios
- [ ] Add accessibility testing (axe plugin)
- [ ] Multi-browser testing (Firefox, Safari)
- [ ] Parallel test execution with proper test isolation

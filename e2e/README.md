# E2E Testing with Playwright

This directory contains end-to-end tests for the Polymarket Insider Trading Detector application using [Playwright](https://playwright.dev/).

## Overview

The test suite covers:

- **Homepage & UI Tests** (`homepage.spec.ts`) - Tests for page loading, responsive design, accessibility, and performance
- **API Tests** (`api.spec.ts`) - Tests for all API endpoints including `/api/stats`, `/api/trades`, and `/api/analyze`
- **Integration Tests** (`integration.spec.ts`) - Full workflow tests including trade analysis, stats updates, and user interactions

## Prerequisites

Before running tests, ensure you have:

1. Node.js installed (v18 or higher recommended)
2. All dependencies installed: `npm install`
3. Playwright browsers installed: `npx playwright install`

## Running Tests

### Basic Commands

```bash
# Run all E2E tests (headless mode)
npm run test:e2e

# Run tests with visible browser
npm run test:e2e:headed

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Open test report
npm run test:e2e:report

# Generate new tests using Playwright codegen
npm run test:e2e:codegen
```

Note: The main `npm test` command runs unit tests. Use `npm run test:e2e` for end-to-end tests.

### Advanced Usage

```bash
# Run a specific test file
npx playwright test e2e/homepage.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests matching a pattern
npx playwright test --grep "should load"

# Run tests with verbose output
npx playwright test --reporter=list

# Run tests in parallel (default)
npx playwright test --workers=4

# Run tests serially (one at a time)
npx playwright test --workers=1
```

## Test Structure

### Directory Layout

```
e2e/
├── fixtures/
│   ├── mock-data.ts        # Mock data for testing
│   └── test-fixtures.ts    # Custom Playwright fixtures
├── utils/
│   └── test-helpers.ts     # Reusable test utilities
├── homepage.spec.ts        # Homepage and UI tests
├── api.spec.ts            # API endpoint tests
├── integration.spec.ts    # Integration tests
└── README.md             # This file
```

### Test Files

#### `homepage.spec.ts`

Tests the main user interface:
- Page loading and rendering
- Responsive design across viewports
- Accessibility compliance
- Performance metrics
- Console error detection
- Stats dashboard display
- Trades table rendering
- Keyboard navigation

#### `api.spec.ts`

Tests all API endpoints:
- `/api/stats` - Statistics retrieval
- `/api/trades` - Trade listing with filtering (limit, minScore, offset)
- `/api/analyze` - Trade analysis triggering
- Error handling and validation
- Response structure verification
- Performance and concurrency

#### `integration.spec.ts`

Tests complete user workflows:
- End-to-end trade analysis flow
- Stats updates after analysis
- Trade table interactions
- Empty state handling
- External link behavior
- Real-time updates
- Loading states

### Utilities and Helpers

#### `test-helpers.ts`

Provides reusable functions:
- `waitForElement()` - Wait for elements to appear
- `expectPageToLoad()` - Verify page loading
- `waitForApiResponse()` - Intercept API calls
- `expectTableToHaveRows()` - Validate table data
- `mockApiEndpoint()` - Mock API responses
- `retryWithBackoff()` - Retry flaky operations
- And more...

#### `mock-data.ts`

Contains mock data:
- Sample suspicious trades
- Statistics data
- Polymarket market data
- API responses

#### `test-fixtures.ts`

Custom Playwright fixtures:
- `mockApis` - Auto-mocks all APIs with data
- `mockEmptyApis` - Mocks APIs with empty state

## Configuration

The Playwright configuration is in `playwright.config.ts` at the project root.

### Key Settings

- **Base URL**: `http://localhost:3000` (can be overridden with `BASE_URL` env var)
- **Test Directory**: `./e2e`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Enabled by default
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **Traces**: Captured on first retry

### Web Server

The configuration automatically:
- Starts the Next.js dev server (`npm run dev`)
- Waits for `http://localhost:3000` to be ready
- Reuses existing server if already running
- Shuts down server after tests complete (unless reusing)

## Writing Tests

### Example Test

```typescript
import { test, expect } from './fixtures/test-fixtures';
import { waitForElement } from './utils/test-helpers';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await waitForElement(page, 'h1');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
```

### Using Mock Fixtures

```typescript
import { test, expect } from './fixtures/test-fixtures';

test.describe('With Mocked APIs', () => {
  test.use({ mockApis: undefined });

  test('should display mocked data', async ({ page, mockApis }) => {
    await page.goto('/');
    // APIs are automatically mocked with data from mock-data.ts
  });
});
```

### Best Practices

1. **Use page object pattern** for complex pages
2. **Leverage test fixtures** to reduce boilerplate
3. **Mock external APIs** to avoid flakiness
4. **Use waitFor methods** instead of fixed timeouts
5. **Write descriptive test names** that explain intent
6. **Group related tests** with `test.describe()`
7. **Clean up after tests** if they modify state
8. **Use data-testid** attributes for stable selectors
9. **Test accessibility** with built-in checks
10. **Keep tests independent** - each test should run in isolation

## Debugging Tests

### Visual Debugging

```bash
# Run with headed browser to see what's happening
npm run test:e2e:headed

# Use UI mode for interactive debugging
npm run test:e2e:ui

# Use debug mode with Playwright Inspector
npm run test:e2e:debug
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots (in `test-results/`)
- Videos (in `test-results/`)
- Traces (in `test-results/`)

View traces with:
```bash
npx playwright show-trace test-results/path-to-trace.zip
```

### Console Logs

Add console logs in tests:
```typescript
console.log('Current URL:', page.url());
console.log('Element text:', await element.textContent());
```

### Verbose Output

Run with list reporter for detailed output:
```bash
npx playwright test --reporter=list
```

## Continuous Integration

### CI Configuration

The test suite is optimized for CI:
- Runs in headless mode
- Uses 1 worker for stability
- Retries failed tests 2 times
- Captures full traces on failure
- Generates HTML report

### Example CI Script

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## Environment Variables

- `BASE_URL` - Override the base URL (default: `http://localhost:3000`)
- `CI` - Automatically set by CI systems (enables CI-specific behavior)

Example:
```bash
BASE_URL=http://localhost:4000 npm run test:e2e
```

## Troubleshooting

### Tests Timeout

- Increase timeout in `playwright.config.ts`
- Check if dev server is running properly
- Look for network issues or slow API responses

### Flaky Tests

- Use `test.retry()` for flaky tests
- Add proper wait conditions
- Mock external dependencies
- Use `page.waitForLoadState('networkidle')`

### Browser Installation Issues

```bash
# Reinstall browsers
npx playwright install --force

# Install system dependencies (Linux)
npx playwright install-deps
```

### Port Already in Use

If port 3000 is busy:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
BASE_URL=http://localhost:4000 npm run test:e2e
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

## Contributing

When adding new tests:

1. Follow existing patterns and structure
2. Add tests to appropriate spec file
3. Update this README if adding new patterns
4. Ensure tests pass locally before committing
5. Keep tests focused and independent
6. Use meaningful test descriptions
7. Add comments for complex logic

## Support

For issues or questions:
- Check Playwright documentation
- Review existing tests for examples
- Open an issue in the repository

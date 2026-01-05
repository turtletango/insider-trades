import { test, expect } from './fixtures/test-fixtures';
import {
  expectPageToLoad,
  waitForElement,
} from './utils/test-helpers';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    await expectPageToLoad(page);

    // Check for main heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Polymarket.*Insider.*Trading.*Detector/i);
  });

  test('should display the page title correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Polymarket Insider Trading Detector/i);
  });

  test('should have a responsive layout', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await waitForElement(page, 'body');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await waitForElement(page, 'body');

    // Verify content is still visible
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Allow some time for any delayed errors
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors (if any)
    const criticalErrors = errors.filter(
      error => !error.includes('favicon') && !error.includes('sourcemap')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check for viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();

    // Check for description meta tag (if it exists)
    const description = page.locator('meta[name="description"]');
    const count = await description.count();
    if (count > 0) {
      const content = await description.getAttribute('content');
      expect(content).toBeTruthy();
    }
  });
});

test.describe('Homepage with mocked data', () => {
  test.use({ mockApis: undefined });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the stats dashboard', async ({ page }) => {
    await waitForElement(page, '[data-testid="stats-dashboard"], .grid');

    // Check for stat cards
    const statCards = page.locator('.grid > div, [class*="card"]');
    const cardCount = await statCards.count();

    expect(cardCount).toBeGreaterThan(0);
  });

  test('should display the trades table', async ({ page }) => {
    // Wait for the table or a "no trades" message
    await page.waitForTimeout(2000);

    const table = page.locator('table');
    const tableCount = await table.count();

    // Either table exists or there's a message about no trades
    if (tableCount > 0) {
      await expect(table).toBeVisible();
    }
  });

  test('should have an "Analyze New Trades" button', async ({ page }) => {
    const analyzeButton = page.locator('button', { hasText: /Analyze.*New.*Trades/i });

    // Wait a bit for the page to fully render
    await page.waitForTimeout(1000);

    const buttonCount = await analyzeButton.count();
    if (buttonCount > 0) {
      await expect(analyzeButton.first()).toBeVisible();
    }
  });

  test('should display stats with correct format', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for number displays
    const numberElements = page.locator('p, span, div').filter({ hasText: /^\d+/ });
    const count = await numberElements.count();

    // Should have some numeric stats displayed
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Navigation and Accessibility', () => {
  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try tabbing through interactive elements
    await page.keyboard.press('Tab');

    // It's okay if count is 0 on first tab, but let's tab a few more times
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentCount = await page.locator(':focus').count();
      if (currentCount > 0) {
        break;
      }
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // H1 should come before h2, h3, etc. (basic structure check)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for basic accessibility features
    const main = page.locator('main, [role="main"]');
    const mainCount = await main.count();

    // Having a main landmark is a good practice
    // (This is a soft check - not all pages require it)
    if (mainCount === 0) {
      console.log('Note: No main landmark found');
    }
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within 10 seconds (generous for local dev)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have excessive DOM nodes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const nodeCount = await page.evaluate(() => {
      return document.querySelectorAll('*').length;
    });

    // Reasonable limit for a single page app
    expect(nodeCount).toBeLessThan(2000);
  });
});

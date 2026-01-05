import { test, expect } from './fixtures/test-fixtures';
import { expectPageToLoad, waitForElement } from './utils/test-helpers';

/**
 * Visual Snapshot Tests
 *
 * These tests capture screenshots and compare them against baseline images
 * to detect unintended visual regressions.
 *
 * To update snapshots: npx playwright test --update-snapshots
 */

test.describe('Visual Snapshots - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expectPageToLoad(page);
  });

  test('should match homepage snapshot on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for animations

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match homepage snapshot on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match homepage snapshot on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match heading section snapshot', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    await expect(heading).toHaveScreenshot('heading-section.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Snapshots - With Mocked Data', () => {
  test.use({ mockApis: undefined });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for data to load
  });

  test('should match stats dashboard snapshot', async ({ page }) => {
    await waitForElement(page, '[data-testid="stats-dashboard"], .grid, main');

    // Find the stats container
    const statsContainer = page.locator('[data-testid="stats-dashboard"], .grid').first();
    const count = await statsContainer.count();

    if (count > 0) {
      await expect(statsContainer).toHaveScreenshot('stats-dashboard.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match trades table snapshot', async ({ page }) => {
    const table = page.locator('table');
    const tableCount = await table.count();

    if (tableCount > 0) {
      await expect(table).toHaveScreenshot('trades-table.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match full page with data snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-with-data.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match stat cards snapshot', async ({ page }) => {
    // Look for stat cards in the grid
    const statCards = page.locator('.grid > div, [class*="card"]').first();
    const cardCount = await statCards.count();

    if (cardCount > 0) {
      await expect(statCards).toHaveScreenshot('stat-card.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Snapshots - Empty State', () => {
  test.use({ mockEmptyApis: undefined });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should match empty state snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-empty-state.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match empty stats dashboard snapshot', async ({ page }) => {
    const statsContainer = page.locator('[data-testid="stats-dashboard"], .grid').first();
    const count = await statsContainer.count();

    if (count > 0) {
      await expect(statsContainer).toHaveScreenshot('stats-dashboard-empty.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Snapshots - Component States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should match analyze button snapshot', async ({ page }) => {
    const analyzeButton = page.locator('button', { hasText: /Analyze.*New.*Trades/i });
    const buttonCount = await analyzeButton.count();

    if (buttonCount > 0) {
      await expect(analyzeButton.first()).toHaveScreenshot('analyze-button.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match analyze button hover state', async ({ page }) => {
    const analyzeButton = page.locator('button', { hasText: /Analyze.*New.*Trades/i });
    const buttonCount = await analyzeButton.count();

    if (buttonCount > 0) {
      await analyzeButton.first().hover();
      await page.waitForTimeout(200); // Wait for hover animation

      await expect(analyzeButton.first()).toHaveScreenshot('analyze-button-hover.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Snapshots - Table Components', () => {
  test.use({ mockApis: undefined });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should match table header snapshot', async ({ page }) => {
    const table = page.locator('table');
    const tableCount = await table.count();

    if (tableCount > 0) {
      const thead = page.locator('table thead');
      await expect(thead).toHaveScreenshot('table-header.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match first table row snapshot', async ({ page }) => {
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();

    if (rowCount > 0) {
      const firstRow = rows.first();
      await expect(firstRow).toHaveScreenshot('table-row.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match risk level badges snapshot', async ({ page }) => {
    const badges = page.locator('[class*="badge"], [class*="pill"], [class*="tag"]');
    const badgeCount = await badges.count();

    if (badgeCount > 0) {
      const firstBadge = badges.first();
      await expect(firstBadge).toHaveScreenshot('risk-badge.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Snapshots - Responsive Layout', () => {
  const viewports = [
    { name: 'desktop-large', width: 1920, height: 1080 },
    { name: 'desktop-medium', width: 1366, height: 768 },
    { name: 'tablet-landscape', width: 1024, height: 768 },
    { name: 'tablet-portrait', width: 768, height: 1024 },
    { name: 'mobile-large', width: 414, height: 896 },
    { name: 'mobile-medium', width: 375, height: 667 },
    { name: 'mobile-small', width: 320, height: 568 },
  ];

  for (const viewport of viewports) {
    test(`should match layout at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot(`layout-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});

test.describe('Visual Snapshots - Dark Mode', () => {
  test('should match dark mode snapshot if supported', async ({ page }) => {
    // Set dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match light mode snapshot', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-light-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Snapshots - Accessibility States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should match focused button state', async ({ page }) => {
    const analyzeButton = page.locator('button', { hasText: /Analyze.*New.*Trades/i });
    const buttonCount = await analyzeButton.count();

    if (buttonCount > 0) {
      await analyzeButton.first().focus();
      await page.waitForTimeout(200);

      await expect(analyzeButton.first()).toHaveScreenshot('button-focused.png', {
        animations: 'disabled',
      });
    }
  });

  test('should match keyboard navigation state', async ({ page }) => {
    // Tab through elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const focusedElement = page.locator(':focus');
    const count = await focusedElement.count();

    if (count > 0) {
      await expect(focusedElement).toHaveScreenshot('keyboard-focus.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Snapshots - Cross-Browser Consistency', () => {
  test('should have consistent appearance across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // This will create browser-specific snapshots
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should have consistent button rendering across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const analyzeButton = page.locator('button', { hasText: /Analyze.*New.*Trades/i });
    const buttonCount = await analyzeButton.count();

    if (buttonCount > 0) {
      await expect(analyzeButton.first()).toHaveScreenshot(`button-${browserName}.png`, {
        animations: 'disabled',
      });
    }
  });
});

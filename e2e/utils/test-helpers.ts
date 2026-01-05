import { expect, Page } from '@playwright/test';

/**
 * Wait for a specific element to be visible on the page
 */
export async function waitForElement(page: Page, selector: string, timeout = 10000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Check if the page has loaded successfully
 */
export async function expectPageToLoad(page: Page, expectedTitle?: string) {
  await page.waitForLoadState('networkidle');
  if (expectedTitle) {
    await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }
}

/**
 * Wait for API response and return the response data
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  trigger?: () => Promise<void>
) {
  const responsePromise = page.waitForResponse(urlPattern);
  if (trigger) {
    await trigger();
  }
  const response = await responsePromise;
  return {
    response,
    data: await response.json().catch(() => null),
    status: response.status(),
  };
}

/**
 * Check if a table has at least one row
 */
export async function expectTableToHaveRows(page: Page, tableSelector: string) {
  const rows = page.locator(`${tableSelector} tbody tr`);
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
  return count;
}

/**
 * Get text content from an element
 */
export async function getTextContent(page: Page, selector: string): Promise<string> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  return (await element.textContent()) || '';
}

/**
 * Check if element contains specific text
 */
export async function expectElementToContainText(
  page: Page,
  selector: string,
  text: string | RegExp
) {
  const element = page.locator(selector);
  await expect(element).toContainText(text);
}

/**
 * Wait for navigation after clicking a link
 */
export async function clickAndWaitForNavigation(
  page: Page,
  selector: string,
  options?: { timeout?: number }
) {
  await Promise.all([
    page.waitForLoadState('networkidle', options),
    page.locator(selector).click(),
  ]);
}

/**
 * Mock API endpoint with custom response
 */
export async function mockApiEndpoint(
  page: Page,
  urlPattern: string | RegExp,
  response: any,
  status = 200
) {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Retry an action with exponential backoff
 */
export async function retryWithBackoff<T>(
  action: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Check if element is visible
 */
export async function isVisible(page: Page, selector: string): Promise<boolean> {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the count of elements matching a selector
 */
export async function getElementCount(page: Page, selector: string): Promise<number> {
  return await page.locator(selector).count();
}

import { test as base } from '@playwright/test';
import { mockApiEndpoint } from '../utils/test-helpers';
import {
  mockStats,
  mockAnalyzeResponse,
  mockEmptyStats,
} from './mock-data';

/**
 * Extended test fixtures with common setup
 */
export const test = base.extend<{
  /**
   * Automatically mocks API endpoints with default data
   */
  mockApis: void;

  /**
   * Mocks API endpoints with empty data (for testing empty states)
   */
  mockEmptyApis: void;
}>({
  mockApis: async ({ page }, use) => {
    // Mock the stats API
    await mockApiEndpoint(page, '**/api/stats', mockStats);

    // Mock the analyze API
    await mockApiEndpoint(page, '**/api/analyze*', mockAnalyzeResponse);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use();
  },

  mockEmptyApis: async ({ page }, use) => {
    // Mock the stats API with empty data
    await mockApiEndpoint(page, '**/api/stats', mockEmptyStats);

    // Mock the analyze API with empty response
    await mockApiEndpoint(page, '**/api/analyze*', {
      success: true,
      analyzed: 100,
      suspicious: 0,
      trades: [],
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use();
  },
});

export { expect } from '@playwright/test';

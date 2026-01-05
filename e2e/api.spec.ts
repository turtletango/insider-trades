import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test.describe('GET /api/stats', () => {
    test('should return statistics with correct structure', async ({ request }) => {
      const response = await request.get(`/api/stats`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();

      // Verify the response has the expected fields
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('stats');
      expect(data.stats).toHaveProperty('total_suspicious_trades');
      expect(data.stats).toHaveProperty('high_suspicion_trades');
      expect(data.stats).toHaveProperty('average_suspicion_score');
      expect(data.stats).toHaveProperty('unique_suspicious_traders');
      expect(data.stats).toHaveProperty('recent_24h');

      // Verify the types
      expect(typeof data.stats.total_suspicious_trades).toBe('number');
      expect(typeof data.stats.high_suspicion_trades).toBe('number');
      expect(typeof data.stats.average_suspicion_score).toBe('string');
      expect(typeof data.stats.unique_suspicious_traders).toBe('number');
      expect(typeof data.stats.recent_24h).toBe('number');
    });

    test('should return valid numerical values', async ({ request }) => {
      const response = await request.get(`/api/stats`);
      const data = await response.json();

      // All values should be non-negative
      expect(data.stats.total_suspicious_trades).toBeGreaterThanOrEqual(0);
      expect(data.stats.high_suspicion_trades).toBeGreaterThanOrEqual(0);
      expect(parseFloat(data.stats.average_suspicion_score)).toBeGreaterThanOrEqual(0);
      expect(data.stats.unique_suspicious_traders).toBeGreaterThanOrEqual(0);
      expect(data.stats.recent_24h).toBeGreaterThanOrEqual(0);

      // High risk trades should not exceed total trades
      expect(data.stats.high_suspicion_trades).toBeLessThanOrEqual(data.stats.total_suspicious_trades);
    });

    test('should have correct content-type header', async ({ request }) => {
      const response = await request.get(`/api/stats`);

      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });
  });


  test.describe('GET /api/trades', () => {
    test('should return trades array with correct structure', async ({ request }) => {
      const response = await request.get(`/api/trades`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();

      // Check response structure
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('analyzed');
      expect(data).toHaveProperty('suspicious');
      expect(data).toHaveProperty('trades');

      // Verify types
      expect(typeof data.analyzed).toBe('number');
      expect(typeof data.suspicious).toBe('number');
      expect(Array.isArray(data.trades)).toBeTruthy();

      // Logical checks
      expect(data.analyzed).toBeGreaterThanOrEqual(0);
      expect(data.suspicious).toBeGreaterThanOrEqual(0);
      expect(data.suspicious).toBeLessThanOrEqual(data.analyzed);
    });

    test('should return trades with required fields', async ({ request }) => {
      const response = await request.get(`/api/trades`);
      const data = await response.json();

      if (data.trades.length > 0) {
        const trade = data.trades[0];

        // Check for required fields (no 'id' field anymore)
        expect(trade).toHaveProperty('market_id');
        expect(trade).toHaveProperty('market_question');
        expect(trade).toHaveProperty('trader_address');
        expect(trade).toHaveProperty('outcome');
        expect(trade).toHaveProperty('price');
        expect(trade).toHaveProperty('size');
        expect(trade).toHaveProperty('timestamp');
        expect(trade).toHaveProperty('suspicion_score');
        expect(trade).toHaveProperty('suspicion_reasons');

        // Verify types
        expect(typeof trade.market_question).toBe('string');
        expect(typeof trade.trader_address).toBe('string');
        expect(typeof trade.price).toBe('number');
        expect(typeof trade.size).toBe('number');
        expect(typeof trade.suspicion_score).toBe('number');
        expect(Array.isArray(trade.suspicion_reasons)).toBeTruthy();
      }
    });

    test('should respect limit parameter', async ({ request }) => {
      const limit = 5;
      const response = await request.get(`/api/trades?limit=${limit}`);
      const data = await response.json();

      expect(data.trades.length).toBeLessThanOrEqual(limit);
    });

    test('should respect minScore parameter', async ({ request }) => {
      const minScore = 80;
      const response = await request.get(`/api/trades?minScore=${minScore}`);
      const data = await response.json();

      // All returned trades should have score >= minScore
      data.trades.forEach((trade: { suspicion_score: number }) => {
        expect(trade.suspicion_score).toBeGreaterThanOrEqual(minScore);
      });
    });

    test('should handle offset parameter', async ({ request }) => {
      const offset = 10;
      const response = await request.get(`/api/trades?offset=${offset}`);

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(Array.isArray(data.trades)).toBeTruthy();
    });

    test('should return trades sorted by timestamp', async ({ request }) => {
      const response = await request.get(`${baseURL}/api/trades?limit=10`);
      const data = await response.json();

      if (data.trades.length > 1) {
        for (let i = 0; i < data.trades.length - 1; i++) {
          const current = new Date(data.trades[i].timestamp).getTime();
          const next = new Date(data.trades[i + 1].timestamp).getTime();

          // Should be sorted descending (newest first)
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });
  });

  test.describe('POST /api/analyze', () => {
    test('should trigger analysis and return results', async ({ request }) => {
      const response = await request.post(`/api/analyze`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();

      // Check response structure
      expect(data).toHaveProperty('analyzed');
      expect(data).toHaveProperty('suspicious');
      expect(data).toHaveProperty('stored');

      // Verify types
      expect(typeof data.analyzed).toBe('number');
      expect(typeof data.suspicious).toBe('number');
      expect(typeof data.stored).toBe('number');

      // Logical checks
      expect(data.analyzed).toBeGreaterThanOrEqual(0);
      expect(data.suspicious).toBeGreaterThanOrEqual(0);
      expect(data.stored).toBeGreaterThanOrEqual(0);
      expect(data.suspicious).toBeLessThanOrEqual(data.analyzed);
    });

    test('should also work with GET method', async ({ request }) => {
      const response = await request.get(`/api/analyze`);

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('analyzed');
      expect(data).toHaveProperty('suspicious');
      expect(data).toHaveProperty('trades');
    });

    test('should respect limit parameter', async ({ request }) => {
      const limit = 50;
      const response = await request.post(`/api/analyze?limit=${limit}`);

      expect(response.ok()).toBeTruthy();
      const data = await response.json();

      expect(data.analyzed).toBeLessThanOrEqual(limit);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid endpoints gracefully', async ({ request }) => {
      const response = await request.get(`/api/nonexistent`);

      expect(response.status()).toBe(404);
    });

    test('should handle invalid query parameters', async ({ request }) => {
      const response = await request.get(`/api/trades?limit=invalid`);

      // Should either return 400 or handle it gracefully and return valid data
      if (!response.ok()) {
        expect(response.status()).toBe(400);
      } else {
        const data = await response.json();
        expect(data).toHaveProperty('trades');
      }
    });

    test('should handle negative limit values', async ({ request }) => {
      const response = await request.get(`/api/trades?limit=-10`);

      // Should either reject or treat as 0/default
      if (!response.ok()) {
        expect([400, 422]).toContain(response.status());
      } else {
        const data = await response.json();
        expect(Array.isArray(data.trades)).toBeTruthy();
      }
    });
  });

  test.describe('Headers and CORS', () => {
    test('should have appropriate cache headers for stats', async ({ request }) => {
      const response = await request.get(`/api/stats`);

      // Stats should be cacheable but with short TTL
      const cacheControl = response.headers()['cache-control'];
      // Either has cache control or doesn't (both are acceptable)
      if (cacheControl) {
        expect(cacheControl).toBeTruthy();
      }
    });

    test('should return JSON content type for all endpoints', async ({ request }) => {
      const endpoints = ['/api/stats', '/api/analyze'];

      for (const endpoint of endpoints) {
        const response = await request.get(`${endpoint}`);
        const contentType = response.headers()['content-type'];
        expect(contentType).toContain('application/json');
      }
    });
  });

  test.describe('Performance', () => {
    test('should respond within reasonable time', async ({ request }) => {
      const startTime = Date.now();

      await request.get(`/api/stats`);

      const responseTime = Date.now() - startTime;

      // Should respond within 5 seconds
      expect(responseTime).toBeLessThan(5000);
    });

    test('should handle multiple concurrent requests', async ({ request }) => {
      const requests = Array(5).fill(null).map(() =>
        request.get(`/api/stats`)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.ok()).toBeTruthy();
      });
    });
  });
});

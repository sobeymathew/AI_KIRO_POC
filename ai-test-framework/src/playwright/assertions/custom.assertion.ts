import { expect, Locator, Page } from '@playwright/test';

/**
 * Custom assertions for domain-specific validations.
 * Extends Playwright's built-in assertions with framework-specific checks.
 */
export class CustomAssertions {
  /** Assert that a page has no console errors */
  static async assertNoConsoleErrors(page: Page): Promise<void> {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a moment for any async errors
    await page.waitForTimeout(500);

    expect(errors, 'Expected no console errors').toHaveLength(0);
  }

  /** Assert that the page loaded within acceptable time */
  static async assertPageLoadTime(page: Page, maxMs: number = 3000): Promise<void> {
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return nav.loadEventEnd - nav.startTime;
    });
    expect(timing, `Page load time ${timing}ms exceeds ${maxMs}ms`).toBeLessThan(maxMs);
  }

  /** Assert that an element has a specific attribute value */
  static async assertAttribute(
    locator: Locator,
    attribute: string,
    expectedValue: string
  ): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, expectedValue);
  }

  /** Assert element count within a container */
  static async assertElementCount(
    locator: Locator,
    expectedCount: number
  ): Promise<void> {
    await expect(locator).toHaveCount(expectedCount);
  }

  /** Assert that a URL matches expected pattern */
  static async assertUrl(page: Page, expectedPattern: string | RegExp): Promise<void> {
    await expect(page).toHaveURL(expectedPattern);
  }

  /** Assert toast/notification message */
  static async assertNotification(
    page: Page,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ): Promise<void> {
    const notification = page.getByTestId(`notification-${type}`);
    await expect(notification).toBeVisible();
    await expect(notification).toContainText(message);
  }

  /** Assert that a form field has a validation error */
  static async assertFieldError(
    page: Page,
    fieldTestId: string,
    errorMessage: string
  ): Promise<void> {
    const errorLocator = page.getByTestId(`${fieldTestId}-error`);
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toHaveText(errorMessage);
  }
}

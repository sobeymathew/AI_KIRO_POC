import { expect, Locator, Page } from '@playwright/test';

/**
 * Custom assertions for ITSM domain-specific validations.
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

    await page.waitForTimeout(500);
    expect(errors, 'Expected no console errors').toHaveLength(0);
  }

  /** Assert that the page loaded within acceptable time */
  static async assertPageLoadTime(page: Page, maxMs: number = 5000): Promise<void> {
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

  /** Assert that a Salesforce success toast message is visible */
  static async assertSuccessMessage(page: Page, messagePattern?: string | RegExp): Promise<void> {
    const toast = page.locator('.toastMessage, .slds-notify__content');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
    if (messagePattern) {
      if (typeof messagePattern === 'string') {
        await expect(toast.first()).toContainText(messagePattern);
      } else {
        await expect(toast.first()).toHaveText(messagePattern);
      }
    }
  }

  /** Assert that a Salesforce form field has a validation error */
  static async assertFieldValidationError(page: Page, fieldLabel: string): Promise<void> {
    const errorLocator = page.locator(
      `.slds-form-element__help, [aria-label="${fieldLabel}"] ~ .slds-form-element__help`
    );
    await expect(errorLocator.first()).toBeVisible();
  }

  /** Assert that an ITSM ticket number was generated (INC-XXXXX format) */
  static async assertIncidentNumberGenerated(page: Page): Promise<void> {
    const incidentNumber = page.getByText(/INC-\d+/);
    await expect(incidentNumber).toBeVisible({ timeout: 15000 });
  }

  /** Assert that a service request number was generated */
  static async assertRequestNumberGenerated(page: Page): Promise<void> {
    const requestNumber = page.getByText(/REQ-\d+|SR-\d+/);
    await expect(requestNumber).toBeVisible({ timeout: 15000 });
  }

  /** Assert page contains specific text (useful for confirmation messages) */
  static async assertPageContainsText(page: Page, text: string | RegExp): Promise<void> {
    if (typeof text === 'string') {
      await expect(page.getByText(text)).toBeVisible({ timeout: 10000 });
    } else {
      await expect(page.getByText(text)).toBeVisible({ timeout: 10000 });
    }
  }

  /** Assert no application error pages are displayed */
  static async assertNoErrorPage(page: Page): Promise<void> {
    const errorIndicators = page.locator(
      'text="An error has occurred", text="Page not found", text="500"'
    );
    await expect(errorIndicators).toHaveCount(0);
  }
}

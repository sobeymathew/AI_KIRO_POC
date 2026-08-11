import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger.util';

/**
 * Base Page Object class providing common functionality for all page objects.
 * All page objects in the framework must extend this class.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  /** Get the current page URL */
  get currentUrl(): string {
    return this.page.url();
  }

  /** Get the page title */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /** Wait for the page to be fully loaded */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /** Wait for a specific URL pattern */
  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  /** Navigate to a specific path */
  async goto(path: string): Promise<void> {
    this.logger.info(`Navigating to: ${path}`);
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /** Take a screenshot with a descriptive name */
  async takeScreenshot(name: string): Promise<Buffer> {
    const screenshot = await this.page.screenshot({
      fullPage: true,
      path: `src/reporting/artifacts/screenshots/${name}-${Date.now()}.png`,
    });
    this.logger.info(`Screenshot captured: ${name}`);
    return screenshot;
  }

  /** Check if an element is visible on the page */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /** Wait for an element to be visible */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /** Scroll to a specific element */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /** Get all console errors on the page */
  async getConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  /** Reload the current page */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /** Go back to the previous page */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }
}

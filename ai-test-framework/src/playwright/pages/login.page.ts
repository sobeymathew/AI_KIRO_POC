import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Salesforce ITSM Login page.
 * Handles all user authentication interactions.
 *
 * URL: /itsm/s/ (login component embedded in the portal page)
 * Repository: src/playwright/object-repository/pages/login-page.repo.json
 * Verified: 2026-08-06
 */
export class LoginPage extends BasePage {
  // Form elements (verified locators from object repository)
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // Feedback elements
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Verified Salesforce locators from login-page.repo.json
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.locator('button:has-text("Log in")');

    // Error feedback
    this.errorMessage = page.locator('.error-message, .slds-notify--alert, [data-aura-class="forceFormMessageQueue"]');
  }

  /** Navigate to the login page */
  async navigate(): Promise<void> {
    this.logger.info('Navigating to Salesforce ITSM login page');
    // BASE_URL is the login page directly: /itsm/s/login/
    await this.page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Wait for Salesforce to render the login form dynamically
    await this.page.waitForTimeout(5000);
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  /** Perform login with username and password */
  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Logging in as: ${username}`);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Wait for navigation after login
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Check if login form is displayed */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.usernameInput.isVisible();
  }

  /** Get the error message text */
  async getErrorText(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.errorMessage.textContent()) ?? '';
  }

  /** Check if error message is visible */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}

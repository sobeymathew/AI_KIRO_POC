import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Salesforce Sandbox Login page.
 * Handles two-step login (username → password) for the Salesforce backend.
 *
 * URL: https://milestoneitsm--itsmcopy.sandbox.my.salesforce.com/
 * Verified: 2026-08-14 via Playwright MCP healer
 *
 * Note: Salesforce sandbox login is two-step:
 *   Step 1: Enter username → click "Log In to Sandbox"
 *   Step 2: Password field appears → enter password → click "Log In to Sandbox" again
 *   Step 3: MFA/identity verification may appear (requires manual handling or pre-approved device)
 */
export class SfSandboxLoginPage extends BasePage {
  // --- Login form elements (verified) ---
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // --- Verification page elements ---
  readonly verifyIdentityHeader: Locator;

  constructor(page: Page) {
    super(page);

    // Two-step login form - verified locators from live inspection
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#Login');

    // MFA verification page detection
    this.verifyIdentityHeader = page.locator('#header:has-text("Verify Your Identity")');
  }

  /** Navigate to the Salesforce sandbox login page */
  async navigate(): Promise<void> {
    const sfUrl = process.env.SF_SANDBOX_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.salesforce.com/';
    this.logger.info(`Navigating to Salesforce sandbox: ${sfUrl}`);
    await this.page.goto(sfUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForTimeout(3000);
  }

  /**
   * Perform two-step login to Salesforce sandbox.
   * Step 1: Enter username and submit
   * Step 2: Wait for password field, enter password and submit
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Logging into Salesforce sandbox as: ${username}`);

    // Step 1: Enter username
    await this.usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.usernameInput.fill(username);
    await this.loginButton.click();

    // Step 2: Wait for password field to appear (two-step flow)
    await this.passwordInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // Wait for either the home page or MFA verification page
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await this.page.waitForTimeout(5000);
  }

  /** Check if MFA verification page is shown */
  async isMfaVerificationRequired(): Promise<boolean> {
    try {
      return await this.verifyIdentityHeader.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Wait for MFA to be resolved (manually or via pre-approved device).
   * This gives time for the user to complete MFA verification externally.
   */
  async waitForMfaResolution(timeoutMs: number = 60000): Promise<void> {
    this.logger.info('Waiting for MFA verification to be resolved...');
    // Wait until the URL no longer contains the verification path
    await this.page.waitForURL(
      (url) => !url.pathname.includes('verification') && !url.pathname.includes('identity'),
      { timeout: timeoutMs }
    );
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);
  }

  /** Check if login was successful (landed on home/setup page) */
  async isLoggedIn(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('lightning') || url.includes('home') || url.includes('setup');
  }
}

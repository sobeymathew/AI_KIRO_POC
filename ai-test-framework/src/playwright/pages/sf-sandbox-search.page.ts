import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for Salesforce Lightning Global Search.
 * Handles searching for incidents and verifying they exist in the Salesforce backend.
 *
 * URL: https://milestoneitsm--itsmcopy.sandbox.lightning.force.com/
 * Verified: 2026-08-14 via Playwright MCP healer
 *
 * Salesforce Lightning global search flow (verified):
 *   1. Click button[aria-label="Search"] in the header (opens search dialog)
 *   2. Fill input[type="search"][placeholder="Search..."] inside the dialog
 *   3. Press Enter to execute search
 *   4. Results page shows matching records as links with title="INC-XXXXXXXXX"
 */
export class SfSandboxSearchPage extends BasePage {
  // --- Global Search trigger (verified) ---
  readonly searchButton: Locator;

  // --- Search dialog input (verified - appears after clicking search button) ---
  readonly searchDialogInput: Locator;

  // --- Search Results elements (verified) ---
  readonly searchResultLinks: Locator;

  constructor(page: Page) {
    super(page);

    // Global search button in the Lightning header (verified 2026-08-14)
    this.searchButton = page.locator('button[aria-label="Search"]');

    // Search input inside the dialog panel (verified 2026-08-14)
    // Appears after clicking the search button
    this.searchDialogInput = page.locator('[role="dialog"] input[type="search"][placeholder="Search..."]');

    // Search result links on the results page (verified 2026-08-14)
    this.searchResultLinks = page.locator('a[data-refid="recordId"], a[title*="INC-"]');
  }

  /**
   * Perform a global search in Salesforce Lightning.
   * Clicks the search button to open the dialog, types the query, and submits.
   */
  async searchGlobal(searchTerm: string): Promise<void> {
    this.logger.info(`Searching Salesforce for: ${searchTerm}`);

    // Step 1: Click the search button to open the search dialog
    await this.searchButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);

    // Step 2: Fill the search input in the dialog
    await this.searchDialogInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchDialogInput.fill(searchTerm);
    await this.page.waitForTimeout(500);

    // Step 3: Press Enter to execute the search
    await this.searchDialogInput.press('Enter');

    // Wait for search results to load
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(5000);
  }

  /**
   * Check if the search results contain a specific incident number.
   * Looks for a link with the incident number in its title attribute.
   */
  async isIncidentInResults(incidentNumber: string): Promise<boolean> {
    this.logger.info(`Checking if incident ${incidentNumber} appears in search results`);

    // Wait for page to settle
    await this.page.waitForTimeout(2000);

    // Look for a link with the incident number in its title (verified pattern)
    const incidentLink = this.page.locator(`a[title="${incidentNumber}"]`);

    try {
      await incidentLink.first().waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      // Fallback: check if the text appears anywhere on the page
      const textMatch = this.page.locator(`text=${incidentNumber}`);
      try {
        await textMatch.first().waitFor({ state: 'visible', timeout: 5000 });
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Get the incident link text from search results.
   * Returns the matching result text, or empty string if not found.
   */
  async getIncidentFromResults(incidentNumber: string): Promise<string> {
    this.logger.info(`Getting incident ${incidentNumber} from search results`);

    const incidentLink = this.page.locator(`a[title="${incidentNumber}"]`);

    try {
      await incidentLink.first().waitFor({ state: 'visible', timeout: 15000 });
      return (await incidentLink.first().getAttribute('title')) ?? '';
    } catch {
      // Fallback: try text content match
      const textMatch = this.page.locator(`text=${incidentNumber}`);
      try {
        await textMatch.first().waitFor({ state: 'visible', timeout: 5000 });
        return (await textMatch.first().textContent()) ?? '';
      } catch {
        return '';
      }
    }
  }

  /**
   * Click on an incident in the search results to open it.
   */
  async openIncidentFromResults(incidentNumber: string): Promise<void> {
    this.logger.info(`Opening incident ${incidentNumber} from search results`);

    const incidentLink = this.page.locator(`a[title="${incidentNumber}"]`);
    await incidentLink.first().waitFor({ state: 'visible', timeout: 15000 });
    await incidentLink.first().click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);
  }

  /** Get the current page visible text (for debugging) */
  async getPageText(): Promise<string> {
    return await this.page.locator('body').innerText();
  }
}

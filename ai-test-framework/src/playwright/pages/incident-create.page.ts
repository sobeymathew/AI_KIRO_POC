import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Incident Creation form.
 * Handles all interactions for creating a new incident in the ITSM module.
 *
 * Flow: Home → Click "Incident" menu → Click "Create Incident" → Fill Form → Submit
 * Verified: 2026-08-10 via Playwright MCP healer
 * Repository: src/web-scraping/object-repository/pages/incident-create-page.repo.json
 * Jira: KD-7
 */
export class IncidentCreatePage extends BasePage {
  // --- Navigation (verified) ---
  readonly incidentMenuLink: Locator;
  readonly createIncidentButton: Locator;

  // --- Form Fields (verified via Playwright MCP) ---
  readonly requestedByLookup: Locator;
  readonly requestedForLookup: Locator;
  readonly urgencyDropdown: Locator;
  readonly categoryDropdown: Locator;
  readonly subCategoryDropdown: Locator;
  readonly briefDescriptionInput: Locator;
  readonly detailedDescriptionTextarea: Locator;
  readonly attachmentUpload: Locator;

  // --- Buttons ---
  readonly submitButton: Locator;
  readonly finishButton: Locator;

  // --- Feedback (verified) ---
  readonly successMessageText: Locator;
  readonly incidentNumberText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation — verified locators
    this.incidentMenuLink = page.locator('a[href="/itsm/s/My-Incidents"]');
    this.createIncidentButton = page.locator('a[href="/itsm/s/Incident-Form"]');

    // Form fields — all verified via Playwright MCP live inspection
    this.requestedByLookup = page.locator('[aria-label="Requested By"]');
    this.requestedForLookup = page.locator('[aria-label="Requested For"]');
    this.urgencyDropdown = page.locator('select[name="Urgency"]');
    this.categoryDropdown = page.locator('[aria-label="Category"]').first();
    this.subCategoryDropdown = page.locator('[aria-label="Sub Category"]').first();
    this.briefDescriptionInput = page.locator('input[name="Briefly_describe_your_issue_or_request"]');
    this.detailedDescriptionTextarea = page.locator('textarea');
    this.attachmentUpload = page.locator('input[type="file"]').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');
    this.finishButton = page.locator('button:has-text("Finish"), a:has-text("Finish")');

    // Success feedback — after submit, page shows "Incident Created Sucessfully:" + INC number
    this.successMessageText = page.getByText('Incident Created');
    this.incidentNumberText = page.getByText(/INC-\d+/);
  }

  /** Navigate: Click Incident menu → Click Create Incident */
  async navigate(): Promise<void> {
    this.logger.info('Clicking on Incident menu');
    await this.incidentMenuLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(2000);

    this.logger.info('Clicking Create Incident button');
    await this.createIncidentButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.createIncidentButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);
  }

  /** Select a value from the Urgency dropdown (native <select>) */
  async selectUrgency(value: string): Promise<void> {
    this.logger.info(`Selecting Urgency: ${value}`);
    await this.urgencyDropdown.selectOption(value);
  }

  /** Select a value from the Category combobox (custom Salesforce dropdown) */
  async selectCategory(value: string): Promise<void> {
    this.logger.info(`Selecting Category: ${value}`);
    await this.categoryDropdown.click();
    await this.page.waitForTimeout(500);
    await this.page.locator(`[data-value="${value}"]`).click();
  }

  /** Select a value from the Sub Category combobox (dependent on Category) */
  async selectSubCategory(value: string): Promise<void> {
    this.logger.info(`Selecting Sub Category: ${value}`);
    await this.subCategoryDropdown.click();
    await this.page.waitForTimeout(500);
    await this.page.locator(`[data-value="${value}"]`).click();
  }

  /** Enter the Brief Description text */
  async enterBriefDescription(text: string): Promise<void> {
    this.logger.info('Entering Brief Description');
    await this.briefDescriptionInput.fill(text);
  }

  /** Enter the Detailed Description text */
  async enterDetailedDescription(text: string): Promise<void> {
    this.logger.info('Entering Detailed Description');
    await this.detailedDescriptionTextarea.fill(text);
  }

  /** Click the Submit button */
  async submit(): Promise<void> {
    this.logger.info('Submitting incident creation form');
    await this.submitButton.click();
  }

  /**
   * Fill all mandatory fields and submit.
   * Note: Requested By is auto-populated. Requested For is pre-filled with logged-in user.
   */
  async createIncident(data: IncidentFormData): Promise<void> {
    this.logger.info('Creating incident with all mandatory fields');
    await this.selectUrgency(data.urgency);
    await this.selectCategory(data.category);
    await this.selectSubCategory(data.subCategory);
    await this.enterBriefDescription(data.briefDescription);
    await this.enterDetailedDescription(data.detailedDescription);
    await this.submit();
  }

  /** Get the success message text */
  async getSuccessMessageText(): Promise<string> {
    await this.successMessageText.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.successMessageText.textContent()) ?? '';
  }

  /** Get the generated Incident Number (e.g., INC-000001168) */
  async getIncidentNumber(): Promise<string> {
    await this.incidentNumberText.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.incidentNumberText.textContent()) ?? '';
  }

  /** Check if the success message is visible */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessageText.isVisible();
  }
}

/** Data interface for incident creation form */
export interface IncidentFormData {
  requestedBy: string;
  requestedFor: string;
  urgency: string;
  category: string;
  subCategory: string;
  briefDescription: string;
  detailedDescription: string;
  attachment?: string;
}

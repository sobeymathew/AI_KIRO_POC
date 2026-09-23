import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the ITSM Create Incident form.
 * Flow: Home → Create Incident (quick link) → Fill mandatory fields → Submit
 * Verified: 2026-09-15 via Playwright MCP healer (created real incident INC-000001557)
 * Azure DevOps Work Item: 47
 * Repository: src/playwright/object-repository/pages/incident-create-page.repo.json
 *
 * Notes:
 * - Requested By / Requested For are auto-populated with the logged-in user.
 * - Category and Sub Category are mandatory custom comboboxes; options carry a
 *   data-value while their visible text is empty (Shadow DOM). Sub Category is
 *   disabled until a Category is selected, and its options depend on the Category.
 * - The success confirmation uses the application's spelling: "Sucessfully".
 */
export class IncidentCreationPage extends BasePage {
  // --- Navigation (verified) ---
  readonly createIncidentQuickLink: Locator;

  // --- Form Fields (verified) ---
  readonly requestedForInput: Locator;
  readonly urgencySelect: Locator;
  readonly categoryCombobox: Locator;
  readonly subCategoryCombobox: Locator;
  readonly briefDescriptionInput: Locator;
  readonly detailedDescriptionTextarea: Locator;

  // --- Buttons ---
  readonly submitButton: Locator;
  readonly finishButton: Locator;

  // --- Feedback (verified) ---
  readonly successMessageText: Locator;
  readonly incidentNumberText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation — verified locator
    this.createIncidentQuickLink = page.locator('a[href="/itsm/s/Incident-Form"]');

    // Form fields — all verified via Playwright MCP (2026-09-15)
    this.requestedForInput = page.locator('input[aria-label="Requested For"]');
    this.urgencySelect = page.locator('select[name="Urgency"]');
    this.categoryCombobox = page.locator('button[aria-label="Category"]');
    this.subCategoryCombobox = page.locator('button[aria-label="Sub Category"]');
    this.briefDescriptionInput = page.locator('input[name="Briefly_describe_your_issue_or_request"]');
    this.detailedDescriptionTextarea = page.locator('textarea').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');
    this.finishButton = page.locator('button:has-text("Finish")');

    // Success feedback (application spells it "Sucessfully")
    this.successMessageText = page.getByText(/Incident Created Sucessfully/i);
    this.incidentNumberText = page.getByText(/INC-\d+/);
  }

  /** Navigate to the Create Incident form via the Home quick link */
  async navigate(): Promise<void> {
    this.logger.info('Navigating to Create Incident form');
    await this.createIncidentQuickLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.createIncidentQuickLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(4000);
    await this.urgencySelect.waitFor({ state: 'visible', timeout: 20000 });
  }

  /** Select an Urgency by its visible label */
  async selectUrgency(label: string): Promise<void> {
    this.logger.info(`Selecting Urgency: ${label}`);
    await this.urgencySelect.selectOption({ label });
  }

  /** Select a value from a custom combobox (Category / Sub Category) by data-value */
  private async selectCombobox(trigger: Locator, dataValue: string): Promise<void> {
    await trigger.click();
    const option = this.page.locator(`[role="option"][data-value="${dataValue}"]`);
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    await this.page.waitForTimeout(500);
  }

  /** Select a Category value (enables Sub Category) */
  async selectCategory(dataValue: string): Promise<void> {
    this.logger.info(`Selecting Category: ${dataValue}`);
    await this.selectCombobox(this.categoryCombobox, dataValue);
  }

  /** Select a Sub Category value (must select a Category first) */
  async selectSubCategory(dataValue: string): Promise<void> {
    this.logger.info(`Selecting Sub Category: ${dataValue}`);
    await this.selectCombobox(this.subCategoryCombobox, dataValue);
  }

  /** Fill the brief description (min 20 characters) */
  async fillBriefDescription(text: string): Promise<void> {
    this.logger.info(`Filling brief description: ${text}`);
    await this.briefDescriptionInput.fill(text);
  }

  /** Fill the detailed description (min 20 characters) */
  async fillDetailedDescription(text: string): Promise<void> {
    this.logger.info('Filling detailed description');
    await this.detailedDescriptionTextarea.fill(text);
  }

  /** Click Submit */
  async submit(): Promise<void> {
    this.logger.info('Submitting incident form');
    await this.submitButton.click();
  }

  /** Fill all mandatory fields and submit the incident */
  async createIncident(data: IncidentFormData): Promise<void> {
    this.logger.info('Creating incident with all mandatory fields');
    await this.selectUrgency(data.urgency);
    await this.selectCategory(data.category);
    await this.selectSubCategory(data.subCategory);
    await this.fillBriefDescription(data.briefDescription);
    await this.fillDetailedDescription(data.detailedDescription);
    await this.submit();
  }

  /** Get the generated Incident Number (e.g., INC-000001557) */
  async getIncidentNumber(): Promise<string> {
    await this.incidentNumberText.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.incidentNumberText.textContent()) ?? '';
  }
}

/** Incident creation form data (all mandatory fields) */
export interface IncidentFormData {
  /** Urgency dropdown label, e.g. "High - Productivity Stopped" */
  urgency: string;
  /** Category combobox data-value, e.g. "Network & Connectivity" */
  category: string;
  /** Sub Category combobox data-value, e.g. "Wi-Fi/LAN" */
  subCategory: string;
  /** Brief description (min 20 chars) */
  briefDescription: string;
  /** Detailed description (min 20 chars) */
  detailedDescription: string;
}

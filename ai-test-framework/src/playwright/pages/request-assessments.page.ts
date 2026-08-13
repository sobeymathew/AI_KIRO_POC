import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Request Assessments form.
 * Flow: Service Request → Service Catalog → Request Assessments → Fill Form → Submit
 * Verified: 2026-08-11 via Playwright MCP healer
 * Story ID: SR-EXP-001
 */
export class RequestAssessmentsPage extends BasePage {
  // --- Navigation (verified) ---
  readonly serviceRequestMenu: Locator;
  readonly serviceCatalogLink: Locator;
  readonly requestAssessmentsButton: Locator;

  // --- Form Fields (verified) ---
  readonly subcategoryDropdown: Locator;
  readonly typeDropdown: Locator;
  readonly clientNameInput: Locator;
  readonly detailedDescriptionInput: Locator;
  readonly fileUpload: Locator;

  // --- Buttons ---
  readonly submitButton: Locator;

  // --- Feedback (verified) ---
  readonly successMessageText: Locator;
  readonly requestNumberText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.serviceRequestMenu = page.locator('button:has-text("Service Request")');
    this.serviceCatalogLink = page.locator('a[href="/itsm/s/service-catalog"]');
    // Request Assessments is the 4th "Request" button (index 3)
    this.requestAssessmentsButton = page.locator('.slds-button.slds-button_outline-brand').nth(3);

    // Form fields — Category is auto-selected & disabled (Security Assessments)
    this.subcategoryDropdown = page.locator('select[name="Subcategory_m"]');
    this.typeDropdown = page.locator('select[name="Type_ThirdPartyAssessment"]');
    this.clientNameInput = page.locator('input[name="Client_Name"]');
    this.detailedDescriptionInput = page.locator('input[name="Detailed_Description"]');
    this.fileUpload = page.locator('input[type="file"]').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');

    // Success feedback
    this.successMessageText = page.getByText('Service Request Created Successfully');
    this.requestNumberText = page.getByText(/RQ-\d+/);
  }

  /** Navigate: Service Request → Service Catalog → Request Assessments */
  async navigate(): Promise<void> {
    this.logger.info('Clicking Service Request menu');
    await this.serviceRequestMenu.click();
    await this.page.waitForTimeout(1000);

    this.logger.info('Clicking Service Catalog');
    await this.serviceCatalogLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);

    this.logger.info('Clicking Request Assessments button');
    await this.requestAssessmentsButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.requestAssessmentsButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(5000);
  }

  /** Select Subcategory (triggers additional fields) */
  async selectSubcategory(value: string): Promise<void> {
    this.logger.info(`Selecting Subcategory: ${value}`);
    await this.subcategoryDropdown.selectOption(value);
    await this.page.waitForTimeout(2000);
  }

  /** Select Type dropdown (appears after Subcategory) */
  async selectType(value: string): Promise<void> {
    this.logger.info(`Selecting Type: ${value}`);
    await this.typeDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.typeDropdown.selectOption(value);
  }

  /** Fill Client Name */
  async fillClientName(name: string): Promise<void> {
    this.logger.info(`Filling Client Name: ${name}`);
    await this.clientNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.clientNameInput.fill(name);
  }

  /** Fill Detailed Description */
  async fillDescription(text: string): Promise<void> {
    this.logger.info('Filling Detailed Description');
    await this.detailedDescriptionInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.detailedDescriptionInput.fill(text);
  }

  /** Click Submit */
  async submit(): Promise<void> {
    this.logger.info('Submitting Request Assessments form');
    await this.submitButton.click();
  }

  /** Fill all mandatory fields and submit */
  async submitRequestAssessment(data: AssessmentFormData): Promise<void> {
    this.logger.info('Submitting Request Assessment with all mandatory fields');
    await this.selectSubcategory(data.subcategory);
    await this.selectType(data.type);
    await this.fillClientName(data.clientName);
    await this.fillDescription(data.description);
    await this.submit();
  }

  /** Get Request Number */
  async getRequestNumber(): Promise<string> {
    await this.requestNumberText.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.requestNumberText.textContent()) ?? '';
  }
}

/** Assessment form data interface */
export interface AssessmentFormData {
  subcategory: string;
  type: string;
  clientName: string;
  description: string;
}

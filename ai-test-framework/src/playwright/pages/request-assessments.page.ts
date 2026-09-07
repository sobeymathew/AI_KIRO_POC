import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Request Assessments form.
 * Flow: Service Request → Service Catalog → Request Assessments → Fill → Submit
 * Verified: 2026-09-02 via Playwright MCP healer (RQ-000002872)
 * Azure DevOps Work Item: 8
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

  // --- Feedback ---
  readonly successMessageText: Locator;
  readonly requestNumberText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation — verified locators (button class updated 2026-09-02)
    this.serviceRequestMenu = page.locator('button:has-text("Service Request")');
    this.serviceCatalogLink = page.locator('a[href="/itsm/s/service-catalog"]');
    // Request Assessments is the 5th "Request" button (index 4) in the catalog
    this.requestAssessmentsButton = page.locator('.slds-button_neutral.cpq-button').nth(4);

    // Form fields — Category is auto-selected (Security Assessments) & disabled
    this.subcategoryDropdown = page.locator('select[name="Subcategory_m"]');
    this.typeDropdown = page.locator('select[name="Type_ThirdPartyAssessment"]');
    this.clientNameInput = page.locator('input[name="Client_Name"]');
    this.detailedDescriptionInput = page.locator('input[name="Detailed_Description"]');
    this.fileUpload = page.locator('input[type="file"]').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');

    // Feedback
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
    await this.page.waitForTimeout(4000);

    this.logger.info('Clicking Request Assessments button');
    await this.requestAssessmentsButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.requestAssessmentsButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(5000);
  }

  /** Fill all mandatory fields and submit */
  async submitRequestAssessment(data: AssessmentFormData): Promise<void> {
    this.logger.info('Submitting Request Assessment');
    await this.subcategoryDropdown.selectOption(data.subcategory);
    await this.page.waitForTimeout(2000);

    await this.typeDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.typeDropdown.selectOption(data.type);

    await this.clientNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.clientNameInput.fill(data.clientName);
    await this.detailedDescriptionInput.fill(data.description);
    await this.submitButton.click();
    // Wait for the confirmation page to render (Salesforce flow transition)
    await this.page.waitForTimeout(6000);
  }

  /** Get the full confirmation-page text (used for both success and error detection) */
  private async getResultPageText(): Promise<string> {
    return await this.page.evaluate(() => document.body.innerText || '');
  }

  /**
   * Returns the generated RQ number, or empty string if not found.
   */
  async getRequestNumber(): Promise<string> {
    const pageText = await this.getResultPageText();
    const match = pageText.match(/RQ-\d+/);
    return match ? match[0] : '';
  }

  /** Verify submission was successful (success text or RQ number present) */
  async isSubmissionSuccessful(): Promise<boolean> {
    const pageText = await this.getResultPageText();
    return pageText.includes('Created Successfully') || /RQ-\d+/.test(pageText);
  }

  /** Detect an application-side system error on the confirmation page */
  async hasApplicationError(): Promise<boolean> {
    const pageText = await this.getResultPageText();
    return pageText.includes('Something went wrong') || pageText.includes('system issue');
  }
}

/** Assessment form data interface */
export interface AssessmentFormData {
  subcategory: string;
  type: string;
  clientName: string;
  description: string;
}

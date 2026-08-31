import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Security Exception Request form.
 * Flow: Service Request → Service Catalog → Security Exception Request → Fill → Submit
 * Verified: 2026-08-20 via Playwright MCP healer
 * Jira: KD-10
 */
export class SecurityExceptionRequestPage extends BasePage {
  // --- Navigation ---
  readonly serviceRequestMenu: Locator;
  readonly serviceCatalogLink: Locator;
  readonly securityExceptionButton: Locator;

  // --- Form Fields (verified) ---
  readonly subcategoryDropdown: Locator;
  readonly durationDropdown: Locator;
  readonly descriptionInput: Locator;
  readonly businessReasonInput: Locator;
  readonly mitigatingControlInput: Locator;
  readonly businessJustificationInput: Locator;
  readonly fileUpload: Locator;

  // --- Buttons ---
  readonly submitButton: Locator;

  // --- Feedback ---
  readonly successMessageText: Locator;
  readonly requestNumberText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.serviceRequestMenu = page.locator('button:has-text("Service Request")');
    this.serviceCatalogLink = page.locator('a[href="/itsm/s/service-catalog"]');
    // Security Exception Request is the 5th button (index 4)
    this.securityExceptionButton = page.locator('.slds-button.slds-button_outline-brand').nth(4);

    // Form fields — Category is pre-selected & disabled
    this.subcategoryDropdown = page.locator('select[name="Subcategory_m"]');
    this.durationDropdown = page.locator('select[name="Duration_of_Exception"]');
    this.descriptionInput = page.locator('input[name="Description_of_the_Exception"]');
    this.businessReasonInput = page.locator('input[name="Business_reason_for_the_Exception"]');
    this.mitigatingControlInput = page.locator('input[name="Mitigating_Control_if_any"]');
    this.businessJustificationInput = page.locator('input[name="Business_Justification"]');
    this.fileUpload = page.locator('input[type="file"]').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');

    // Feedback
    this.successMessageText = page.getByText('Service Request Created Successfully');
    this.requestNumberText = page.getByText(/RQ-\d+/);
  }

  /** Navigate: Service Request → Service Catalog → Security Exception Request */
  async navigate(): Promise<void> {
    this.logger.info('Clicking Service Request menu');
    await this.serviceRequestMenu.click();
    await this.page.waitForTimeout(1000);

    this.logger.info('Clicking Service Catalog');
    await this.serviceCatalogLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);

    this.logger.info('Clicking Security Exception Request button');
    await this.securityExceptionButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.securityExceptionButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(5000);
  }

  /** Fill all mandatory fields and submit */
  async submitSecurityException(data: SecurityExceptionFormData): Promise<void> {
    this.logger.info('Submitting Security Exception Request');
    await this.subcategoryDropdown.selectOption(data.subcategory);
    await this.page.waitForTimeout(2000);

    await this.durationDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.durationDropdown.selectOption(data.duration);

    await this.descriptionInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.descriptionInput.fill(data.description);
    await this.businessReasonInput.fill(data.businessReason);
    await this.mitigatingControlInput.fill(data.mitigatingControl);
    await this.businessJustificationInput.fill(data.businessJustification);
    await this.submitButton.click();
  }

  /** Get Request Number */
  async getRequestNumber(): Promise<string> {
    await this.requestNumberText.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.requestNumberText.textContent()) ?? '';
  }
}

/** Security Exception form data interface */
export interface SecurityExceptionFormData {
  subcategory: string;
  duration: string;
  description: string;
  businessReason: string;
  mitigatingControl: string;
  businessJustification: string;
}

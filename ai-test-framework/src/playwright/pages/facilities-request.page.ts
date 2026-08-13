import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Facilities Request form.
 * Flow: Service Request → Service Catalog → Facilities Request → Fill Form → Submit
 * Pattern: Same as Expense/COI (Service Catalog form)
 * Jira: KD-9
 */
export class FacilitiesRequestPage extends BasePage {
  // --- Navigation ---
  readonly serviceRequestMenu: Locator;
  readonly serviceCatalogLink: Locator;
  readonly facilitiesRequestButton: Locator;

  // --- Form Fields ---
  readonly requestedByInput: Locator;
  readonly requestedForInput: Locator;
  readonly categoryDropdown: Locator;
  readonly subcategoryDropdown: Locator;
  readonly additionalComments: Locator;
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
    // Facilities Request is the 3rd "Request" button in the catalog (index 2)
    this.facilitiesRequestButton = page.locator('.slds-button.slds-button_outline-brand').nth(2);

    // Form fields (same pattern as Expense Request)
    this.requestedByInput = page.locator('input[name="Requested_By"]');
    this.requestedForInput = page.locator('[aria-label="Requested For"]');
    this.categoryDropdown = page.locator('select[name="Category"]');
    this.subcategoryDropdown = page.locator('select[name="Subcategory"]');
    this.additionalComments = page.locator('input[name="Please_provide_additional_comments_here"]');
    this.fileUpload = page.locator('input[type="file"]').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');

    // Success feedback
    this.successMessageText = page.getByText('Service Request Created Successfully');
    this.requestNumberText = page.getByText(/RQ-\d+/);
  }

  /** Navigate: Service Request menu → Service Catalog → Facilities Request */
  async navigate(): Promise<void> {
    this.logger.info('Clicking Service Request menu');
    await this.serviceRequestMenu.click();
    await this.page.waitForTimeout(1000);

    this.logger.info('Clicking Service Catalog');
    await this.serviceCatalogLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(5000);

    this.logger.info('Clicking Facilities Request button');
    await this.facilitiesRequestButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.facilitiesRequestButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);
  }

  /** Select a value from the Category dropdown */
  async selectCategory(value: string): Promise<void> {
    this.logger.info(`Selecting Category: ${value}`);
    await this.categoryDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.categoryDropdown.selectOption(value);
    await this.page.waitForTimeout(1000);
  }

  /** Select a value from the Subcategory dropdown (appears after Category) */
  async selectSubcategory(value: string): Promise<void> {
    this.logger.info(`Selecting Subcategory: ${value}`);
    await this.subcategoryDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.subcategoryDropdown.selectOption(value);
    await this.page.waitForTimeout(1000);
  }

  /** Click Submit */
  async submit(): Promise<void> {
    this.logger.info('Submitting Facilities Request form');
    await this.submitButton.click();
  }

  /** Check if Requested By is read-only */
  async isRequestedByReadOnly(): Promise<boolean> {
    return await this.requestedByInput.evaluate((el) => (el as HTMLInputElement).readOnly);
  }

  /** Fill mandatory fields and submit */
  async submitFacilitiesRequest(data: FacilitiesFormData): Promise<void> {
    this.logger.info('Submitting Facilities Request with mandatory fields');
    await this.selectCategory(data.category);
    if (data.subcategory) {
      await this.selectSubcategory(data.subcategory);
    }
    await this.submit();
  }

  /** Get the success message text */
  async getSuccessText(): Promise<string> {
    await this.successMessageText.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.successMessageText.textContent()) ?? '';
  }

  /** Get the generated Request Number */
  async getRequestNumber(): Promise<string> {
    await this.requestNumberText.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.requestNumberText.textContent()) ?? '';
  }
}

/** Facilities form data interface */
export interface FacilitiesFormData {
  category: string;
  subcategory?: string;
}

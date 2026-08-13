import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Expense Request form.
 * Flow: Service Request → Service Catalog → Expense Request → Fill Form → Submit
 * Verified: 2026-08-11 via Playwright MCP healer
 * Story ID: SR-EXP-001
 */
export class ExpenseRequestPage extends BasePage {
  // --- Navigation (verified) ---
  readonly serviceRequestMenu: Locator;
  readonly serviceCatalogLink: Locator;
  readonly expenseRequestButton: Locator;

  // --- Form Fields (verified) ---
  readonly requestedByInput: Locator;
  readonly requestedForInput: Locator;
  readonly categoryDropdown: Locator;
  readonly subcategoryDropdown: Locator;
  readonly additionalComments: Locator;
  readonly businessJustification: Locator;
  readonly fileUpload: Locator;

  // --- Buttons ---
  readonly submitButton: Locator;
  readonly finishButton: Locator;

  // --- Feedback (verified) ---
  readonly successMessageText: Locator;
  readonly requestNumberText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.serviceRequestMenu = page.locator('button:has-text("Service Request")');
    this.serviceCatalogLink = page.locator('a[href="/itsm/s/service-catalog"]');
    // Expense Request is the 2nd "Request" button in the catalog (index 1)
    this.expenseRequestButton = page.locator('.slds-button.slds-button_outline-brand').nth(1);

    // Form fields — verified via Playwright MCP
    this.requestedByInput = page.locator('input[name="Requested_By"]');
    this.requestedForInput = page.locator('[aria-label="Requested For"]');
    this.categoryDropdown = page.locator('select[name="Category"]');
    this.subcategoryDropdown = page.locator('select[name="Subcategory"]');
    this.additionalComments = page.locator('input[name="Please_provide_additional_comments_here"]');
    this.businessJustification = page.locator('input[name="Business_Justification"]');
    this.fileUpload = page.locator('input[type="file"]').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');
    this.finishButton = page.locator('button:has-text("Finish"), a:has-text("Finish")');

    // Success feedback - flexible to handle variations
    this.successMessageText = page.getByText(/Service Request Created|Request Created Successfully|Created Successfully/i);
    this.requestNumberText = page.getByText(/RQ[-]?\d+/);
  }

  /** Navigate: Service Request menu → Service Catalog → Expense Request */
  async navigate(): Promise<void> {
    this.logger.info('Clicking Service Request menu');
    await this.serviceRequestMenu.click();
    await this.page.waitForTimeout(2000);

    this.logger.info('Clicking Service Catalog');
    await this.serviceCatalogLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(5000);

    this.logger.info('Clicking Expense Request button');
    await this.expenseRequestButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.expenseRequestButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    // Wait for the Salesforce Flow to fully render the form
    await this.page.waitForTimeout(10000);

    // Wait for the Category dropdown or Submit button to confirm form is loaded
    this.logger.info('Waiting for Expense Request form to load');
    await this.submitButton.waitFor({ state: 'visible', timeout: 30000 });
  }

  /** Select a value from the Category dropdown (native select) */
  async selectCategory(value: string): Promise<void> {
    this.logger.info(`Selecting Category: ${value}`);
    await this.categoryDropdown.selectOption(value);
    await this.page.waitForTimeout(1000);
  }

  /** Select a value from the Subcategory dropdown (appears after Category selection) */
  async selectSubcategory(value: string): Promise<void> {
    this.logger.info(`Selecting Subcategory: ${value}`);
    await this.subcategoryDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.subcategoryDropdown.selectOption(value);
    await this.page.waitForTimeout(1000);
  }

  /** Fill the Business Justification field (appears after Subcategory selection) */
  async fillBusinessJustification(text: string): Promise<void> {
    this.logger.info('Filling Business Justification');
    await this.businessJustification.waitFor({ state: 'visible', timeout: 10000 });
    await this.businessJustification.fill(text);
  }

  /** Fill additional comments */
  async fillComments(text: string): Promise<void> {
    this.logger.info('Filling additional comments');
    await this.additionalComments.fill(text);
  }

  /** Click Submit */
  async submit(): Promise<void> {
    this.logger.info('Submitting Expense Request form');
    await this.submitButton.click();
  }

  /** Check if Requested By is read-only */
  async isRequestedByReadOnly(): Promise<boolean> {
    return await this.requestedByInput.evaluate((el) => (el as HTMLInputElement).readOnly);
  }

  /** Get the Requested By value */
  async getRequestedByValue(): Promise<string> {
    return await this.requestedByInput.inputValue();
  }

  /** Fill all mandatory fields and submit */
  async submitExpenseRequest(data: ExpenseFormData): Promise<void> {
    this.logger.info('Submitting Expense Request with all mandatory fields');
    await this.selectCategory(data.category);
    await this.selectSubcategory(data.subcategory);
    await this.fillBusinessJustification(data.businessJustification);
    await this.page.waitForTimeout(2000);
    await this.submit();
    // Wait for Salesforce to process submission
    await this.page.waitForTimeout(10000);
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

/** Expense form data interface */
export interface ExpenseFormData {
  category: string;
  subcategory: string;
  businessJustification: string;
  comments?: string;
}

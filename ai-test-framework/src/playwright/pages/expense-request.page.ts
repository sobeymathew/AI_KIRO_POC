import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Expense Request form (Service Catalog).
 * Flow: Service Request → Service Catalog → Expense Request → Fill (cascading) → Submit
 *
 * The form is cascading:
 *   Category → reveals Subcategory → reveals Additional Comments + Business Justification.
 * "Requested By" and "Requested For" are read-only and auto-populated with the logged-in user.
 *
 * Verified: 2026-09-02 via Playwright MCP healer
 * Azure DevOps Work Item: 14
 */
export class ExpenseRequestPage extends BasePage {
  // --- Navigation ---
  readonly serviceRequestMenu: Locator;
  readonly serviceCatalogLink: Locator;
  readonly expenseRequestButton: Locator;

  // --- Form Fields (verified) ---
  readonly requestedByInput: Locator;
  readonly requestedForInput: Locator;
  readonly categoryDropdown: Locator;
  readonly subcategoryDropdown: Locator;
  readonly additionalCommentsInput: Locator;
  readonly businessJustificationInput: Locator;
  readonly fileUpload: Locator;

  // --- Buttons ---
  readonly submitButton: Locator;

  // --- Feedback ---
  readonly successMessageText: Locator;
  readonly requestNumberText: Locator;
  readonly systemErrorText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.serviceRequestMenu = page.locator('button:has-text("Service Request")');
    this.serviceCatalogLink = page.locator('a[href="/itsm/s/service-catalog"]');
    // Expense Request is the 2nd "Request" button in the catalog (index 1)
    this.expenseRequestButton = page.getByRole('button', { name: 'Request', exact: true }).nth(1);

    // Form fields — all verified via Playwright MCP (2026-09-02)
    this.requestedByInput = page.locator('input[name="Requested_By"]');
    this.requestedForInput = page.locator('input[aria-label="Requested For"]');
    this.categoryDropdown = page.locator('select[name="Category"]');
    this.subcategoryDropdown = page.locator('select[name="Subcategory"]');
    this.additionalCommentsInput = page.locator(
      'input[name="Please_provide_additional_comments_here"]'
    );
    this.businessJustificationInput = page.locator('input[name="Business_Justification"]');
    this.fileUpload = page.locator('input[type="file"]').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');

    // Feedback
    this.successMessageText = page.getByText('Service Request Created Successfully');
    this.requestNumberText = page.getByText(/RQ-\d+/);
    this.systemErrorText = page.getByText('Something went wrong');
  }

  /** Navigate: Service Request menu → Service Catalog → Expense Request */
  async navigate(): Promise<void> {
    this.logger.info('Clicking Service Request menu');
    await this.serviceRequestMenu.click();
    await this.page.waitForTimeout(1000);

    this.logger.info('Clicking Service Catalog');
    await this.serviceCatalogLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);

    this.logger.info('Clicking Expense Request button');
    await this.expenseRequestButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.expenseRequestButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(5000);
  }

  /** Get the read-only Requested By value (auto-populated with logged-in user) */
  async getRequestedByValue(): Promise<string> {
    await this.requestedByInput.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.requestedByInput.inputValue()) ?? '';
  }

  /** Whether the Requested By field is read-only */
  async isRequestedByReadOnly(): Promise<boolean> {
    return (await this.requestedByInput.getAttribute('readonly')) !== null;
  }

  /**
   * Fill all mandatory fields (cascading) and submit.
   * Each selection reveals the next dependent field, so waits are applied between steps.
   */
  async submitExpenseRequest(data: ExpenseFormData): Promise<void> {
    this.logger.info('Submitting Expense Request with all mandatory fields');

    await this.categoryDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.categoryDropdown.selectOption(data.category);
    await this.page.waitForTimeout(2000);

    await this.subcategoryDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.subcategoryDropdown.selectOption(data.subcategory);
    await this.page.waitForTimeout(2000);

    await this.businessJustificationInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.businessJustificationInput.fill(data.businessJustification);

    if (data.additionalComments) {
      await this.additionalCommentsInput.fill(data.additionalComments);
    }

    await this.submitButton.click();
  }

  /** Get the success message text */
  async getSuccessText(): Promise<string> {
    await this.successMessageText.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.successMessageText.textContent()) ?? '';
  }

  /** Get the generated Request Number (e.g., RQ-000002872) */
  async getRequestNumber(): Promise<string> {
    await this.requestNumberText.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.requestNumberText.textContent()) ?? '';
  }
}

/** Expense Request form data interface */
export interface ExpenseFormData {
  /** Category option value, e.g. "Choice_Corporate_Card_Category" */
  category: string;
  /** Subcategory option value, e.g. "Choice_New_Credit_Card_Subcategory" */
  subcategory: string;
  /** Mandatory business justification */
  businessJustification: string;
  /** Optional additional comments */
  additionalComments?: string;
}

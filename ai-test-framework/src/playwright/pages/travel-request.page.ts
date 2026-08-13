import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Travel Request form.
 * Flow: Service Request → Service Catalog → Travel category → Travel Request → Fill Form → Submit
 * Story ID: SR-TRV-001
 * Feature: src/test-case-management/features/istm/travel-request.feature
 */
export class TravelRequestPage extends BasePage {
  // --- Navigation ---
  readonly serviceRequestMenu: Locator;
  readonly serviceCatalogLink: Locator;
  readonly travelCategory: Locator;
  readonly travelRequestButton: Locator;

  // --- Form Fields ---
  readonly categoryDropdown: Locator;
  readonly subcategoryDropdown: Locator;
  readonly departureCityInput: Locator;
  readonly arrivalCityInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly estimatedCostInput: Locator;
  readonly purposeOfVisitInput: Locator;
  readonly additionalComments: Locator;

  // --- Buttons ---
  readonly submitButton: Locator;

  // --- Feedback ---
  readonly successMessageText: Locator;
  readonly requestNumberText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.serviceRequestMenu = page.locator('button:has-text("Service Request")');
    this.serviceCatalogLink = page.locator('a[href="/itsm/s/service-catalog"]').first();
    // Travel category link in the service catalog
    this.travelCategory = page.getByText('Travel', { exact: true });
    // Request button under Travel Request
    this.travelRequestButton = page.locator('.slds-button.slds-button_outline-brand').first();

    // Form fields — based on actual page structure (combobox elements)
    this.categoryDropdown = page.getByRole('combobox', { name: 'Category' });
    this.subcategoryDropdown = page.getByRole('combobox', { name: /Sub\s?[Cc]ategory/ });
    this.departureCityInput = page.getByRole('textbox', { name: /Departure/i });
    this.arrivalCityInput = page.getByRole('textbox', { name: /Arrival/i });
    this.startDateInput = page.getByRole('textbox', { name: /Start\s?Date/i });
    this.endDateInput = page.getByRole('textbox', { name: /End\s?Date/i });
    this.estimatedCostInput = page.getByRole('spinbutton', { name: /Estimated Cost/i });
    this.purposeOfVisitInput = page.getByRole('textbox', { name: /Purpose of the Visit/i });
    this.additionalComments = page.getByRole('textbox', { name: /additional comments/i });

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');

    // Success feedback
    this.successMessageText = page.getByText(/Service Request Created|Request Created Successfully|Created Successfully/i);
    this.requestNumberText = page.getByText(/RQ[-]?\d+/);
  }

  /** Navigate: Service Request → Service Catalog → Travel → Travel Request */
  async navigate(): Promise<void> {
    this.logger.info('Clicking Service Request menu');
    await this.serviceRequestMenu.click();
    await this.page.waitForTimeout(2000);

    this.logger.info('Clicking Service Catalog');
    await this.serviceCatalogLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(5000);

    this.logger.info('Clicking Travel category');
    await this.travelCategory.waitFor({ state: 'visible', timeout: 15000 });
    await this.travelCategory.click();
    await this.page.waitForTimeout(3000);

    this.logger.info('Clicking Travel Request button');
    await this.travelRequestButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.travelRequestButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    // Wait for Salesforce Flow to render the form
    await this.page.waitForTimeout(10000);

    this.logger.info('Waiting for Travel Request form to load');
    await this.submitButton.waitFor({ state: 'visible', timeout: 30000 });
  }

  /** Select Category (Salesforce combobox) */
  async selectCategory(value: string): Promise<void> {
    this.logger.info(`Selecting Category: ${value}`);
    await this.categoryDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.categoryDropdown.selectOption({ label: value });
    await this.page.waitForTimeout(3000); // Wait for dependent fields to load
  }

  /** Select Sub Category (appears after Category selection) */
  async selectSubcategory(value: string): Promise<void> {
    this.logger.info(`Selecting Sub Category: ${value}`);
    await this.subcategoryDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.subcategoryDropdown.selectOption({ label: value });
    await this.page.waitForTimeout(3000); // Wait for dependent fields to load
  }

  /** Enter Departure City */
  async enterDepartureCity(city: string): Promise<void> {
    this.logger.info(`Entering Departure City: ${city}`);
    await this.departureCityInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.departureCityInput.fill(city);
  }

  /** Enter Arrival City */
  async enterArrivalCity(city: string): Promise<void> {
    this.logger.info(`Entering Arrival City: ${city}`);
    await this.arrivalCityInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.arrivalCityInput.fill(city);
  }

  /** Enter Start Date (format: MM/DD/YYYY) */
  async enterStartDate(date: string): Promise<void> {
    this.logger.info(`Entering Start Date: ${date}`);
    await this.startDateInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.startDateInput.fill(date);
  }

  /** Enter End Date (format: MM/DD/YYYY) */
  async enterEndDate(date: string): Promise<void> {
    this.logger.info(`Entering End Date: ${date}`);
    await this.endDateInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.endDateInput.fill(date);
  }

  /** Enter Estimated Cost */
  async enterEstimatedCost(amount: string): Promise<void> {
    this.logger.info(`Entering Estimated Cost: ${amount}`);
    await this.estimatedCostInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.estimatedCostInput.fill(amount);
  }

  /** Enter Purpose of Visit */
  async enterPurposeOfVisit(purpose: string): Promise<void> {
    this.logger.info(`Entering Purpose of Visit: ${purpose}`);
    await this.purposeOfVisitInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.purposeOfVisitInput.fill(purpose);
  }

  /** Enter Additional Comments */
  async enterComments(text: string): Promise<void> {
    this.logger.info('Entering additional comments');
    await this.additionalComments.waitFor({ state: 'visible', timeout: 10000 });
    await this.additionalComments.fill(text);
  }

  /** Click Submit */
  async submit(): Promise<void> {
    this.logger.info('Submitting Travel Request form');
    await this.submitButton.click();
  }

  /** Fill all mandatory fields and submit the travel request */
  async submitTravelRequest(data: TravelFormData): Promise<void> {
    this.logger.info('Submitting Travel Request with all mandatory fields');
    await this.selectCategory(data.category);
    await this.selectSubcategory(data.subcategory);
    await this.enterDepartureCity(data.departureCity);
    await this.enterArrivalCity(data.arrivalCity);
    await this.enterStartDate(data.startDate);
    await this.enterEndDate(data.endDate);
    await this.enterEstimatedCost(data.estimatedCost);
    await this.enterPurposeOfVisit(data.purposeOfVisit);
    if (data.comments) {
      await this.enterComments(data.comments);
    }
    await this.page.waitForTimeout(2000);
    await this.submit();
    // Wait for Salesforce to process submission
    await this.page.waitForTimeout(10000);
  }

  /** Get the success message text */
  async getSuccessText(): Promise<string> {
    await this.successMessageText.waitFor({ state: 'visible', timeout: 30000 });
    return (await this.successMessageText.textContent()) ?? '';
  }

  /** Get the generated Request Number */
  async getRequestNumber(): Promise<string> {
    await this.requestNumberText.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.requestNumberText.textContent()) ?? '';
  }
}

/** Travel form data interface */
export interface TravelFormData {
  category: string;
  subcategory: string;
  departureCity: string;
  arrivalCity: string;
  startDate: string;
  endDate: string;
  estimatedCost: string;
  purposeOfVisit: string;
  comments?: string;
}

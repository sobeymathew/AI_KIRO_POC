import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Certificate of Insurance (COI) Request form.
 * Flow: Service Request → Service Catalog → COI Request → Fill Form → Submit
 * Verified: 2026-08-11 via Playwright MCP healer
 * Jira: KD-8
 */
export class CoiRequestPage extends BasePage {
  // --- Navigation (verified) ---
  readonly serviceRequestMenu: Locator;
  readonly serviceCatalogLink: Locator;
  readonly coiRequestButton: Locator;

  // --- Form Fields (verified) ---
  readonly certificateHolderName: Locator;
  readonly certificateHolderAddress: Locator;
  readonly generalCoverage: Locator;
  readonly workersCompCoverage: Locator;
  readonly autoCoverage: Locator;
  readonly umbrellaCoverage: Locator;
  readonly cyberEoCoverage: Locator;
  readonly crimeCoverage: Locator;
  readonly additionalComments: Locator;
  readonly fileUpload: Locator;

  // --- Buttons ---
  readonly submitButton: Locator;
  readonly finishButton: Locator;
  readonly backButton: Locator;

  // --- Feedback (verified) ---
  readonly successMessageText: Locator;
  readonly requestNumberText: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation — verified locators
    this.serviceRequestMenu = page.locator('button:has-text("Service Request")');
    this.serviceCatalogLink = page.locator('a[href="/itsm/s/service-catalog"]');
    // COI Request button is the first "Request" button in the catalog
    this.coiRequestButton = page.locator('.slds-button.slds-button_outline-brand').first();

    // Form fields — all verified via Playwright MCP (2026-08-11)
    this.certificateHolderName = page.locator('input[name="Certificate_holders_name"]');
    this.certificateHolderAddress = page.locator('input[name="Certificate_holders_address"]');
    this.generalCoverage = page.locator('input[name="General"]');
    this.workersCompCoverage = page.locator('input[name="Workers_Compensation"]');
    this.autoCoverage = page.locator('input[name="Auto"]');
    this.umbrellaCoverage = page.locator('input[name="Umbrella"]');
    this.cyberEoCoverage = page.locator('input[name="Cyber_E_O"]');
    this.crimeCoverage = page.locator('input[name="Crime"]');
    this.additionalComments = page.locator('input[name="Please_provide_additional_comments_here"]');
    this.fileUpload = page.locator('input[type="file"]').first();

    // Buttons
    this.submitButton = page.locator('button:has-text("Submit")');
    this.finishButton = page.locator('button:has-text("Finish"), a:has-text("Finish")');
    this.backButton = page.locator('button:has-text("Back"), a:has-text("Back")');

    // Success feedback
    this.successMessageText = page.getByText('Service Request Created Successfully');
    this.requestNumberText = page.getByText(/RQ-\d+/);
  }

  /** Navigate: Service Request menu → Service Catalog → COI Request */
  async navigate(): Promise<void> {
    this.logger.info('Clicking Service Request menu');
    await this.serviceRequestMenu.click();
    await this.page.waitForTimeout(1000);

    this.logger.info('Clicking Service Catalog');
    await this.serviceCatalogLink.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);

    this.logger.info('Clicking COI Request button');
    await this.coiRequestButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.coiRequestButton.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForTimeout(3000);
  }

  /** Fill Certificate Holder's Name */
  async fillHolderName(name: string): Promise<void> {
    this.logger.info(`Filling Certificate Holder Name: ${name}`);
    await this.certificateHolderName.fill(name);
  }

  /** Fill Certificate Holder's Address */
  async fillHolderAddress(address: string): Promise<void> {
    this.logger.info(`Filling Certificate Holder Address: ${address}`);
    await this.certificateHolderAddress.fill(address);
  }

  /** Fill all coverage amounts */
  async fillCoverageAmounts(data: CoiCoverageData): Promise<void> {
    this.logger.info('Filling coverage amounts');
    await this.generalCoverage.fill(data.general);
    await this.workersCompCoverage.fill(data.workersComp);
    await this.autoCoverage.fill(data.auto);
    await this.umbrellaCoverage.fill(data.umbrella);
    await this.cyberEoCoverage.fill(data.cyberEo);
    await this.crimeCoverage.fill(data.crime);
  }

  /** Fill additional comments */
  async fillComments(text: string): Promise<void> {
    this.logger.info('Filling additional comments');
    await this.additionalComments.fill(text);
  }

  /** Click Submit */
  async submit(): Promise<void> {
    this.logger.info('Submitting COI request form');
    await this.submitButton.click();
  }

  /** Fill all mandatory fields and submit */
  async submitCoiRequest(data: CoiFormData): Promise<void> {
    this.logger.info('Submitting COI request with all mandatory fields');
    await this.fillHolderName(data.holderName);
    await this.fillHolderAddress(data.holderAddress);
    await this.fillCoverageAmounts(data.coverage);
    if (data.comments) {
      await this.fillComments(data.comments);
    }
    await this.submit();
  }

  /** Get the success message text */
  async getSuccessText(): Promise<string> {
    await this.successMessageText.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.successMessageText.textContent()) ?? '';
  }

  /** Get the generated Request Number (e.g., RQ-000002865) */
  async getRequestNumber(): Promise<string> {
    await this.requestNumberText.waitFor({ state: 'visible', timeout: 15000 });
    return (await this.requestNumberText.textContent()) ?? '';
  }
}

/** Coverage amounts interface */
export interface CoiCoverageData {
  general: string;
  workersComp: string;
  auto: string;
  umbrella: string;
  cyberEo: string;
  crime: string;
}

/** Full COI form data interface */
export interface CoiFormData {
  holderName: string;
  holderAddress: string;
  coverage: CoiCoverageData;
  comments?: string;
}

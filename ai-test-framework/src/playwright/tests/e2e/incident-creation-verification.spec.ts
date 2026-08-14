import { test, expect } from '../../fixtures/base.fixture';
import { IncidentFormData } from '../../pages/incident-create.page';
import path from 'path';
import fs from 'fs';

/**
 * E2E Test: Incident Creation and Salesforce Verification
 * Jira: KD-7
 * Requirement: REQ-0002
 * Feature: src/test-case-management/features/e2e/incident-creation-verification.feature
 *
 * Flow:
 *   1. Create an incident in the ITSM portal (same as smoke test)
 *   2. Login to Salesforce sandbox using saved session (bypasses MFA)
 *   3. Search for the incident number using global search
 *   4. Verify the incident exists in Salesforce
 *
 * Prerequisites:
 *   - Run `npm run auth:sf-sandbox` once to capture an authenticated session
 *   - The session file is saved at src/playwright/auth/.sf-sandbox-storageState.json
 *   - Re-run the auth script whenever the session expires
 *
 * Run command:
 *   npx playwright test src/playwright/tests/e2e/incident-creation-verification.spec.ts --project=chromium --headed
 */

// Path to the saved Salesforce sandbox storage state
const SF_STORAGE_STATE_PATH = path.resolve(
  __dirname, '../../auth/.sf-sandbox-storageState.json'
);

test.describe('Incident Creation & Salesforce Verification - E2E @e2e', () => {
  // Extended timeout for E2E flow (incident creation + Salesforce navigation + search)
  test.setTimeout(180000);

  // Test data for incident creation
  const incidentData: IncidentFormData = {
    requestedBy: '',  // Auto-populated by system
    requestedFor: '', // Pre-filled with logged-in user
    urgency: 'Medium - Productivity Impacted',
    category: 'Network & Connectivity',
    subCategory: 'VPN / ZTNA',
    briefDescription: 'E2E verification - incident to Salesforce',
    detailedDescription:
      'Automated E2E test verifying incident creation flows to Salesforce sandbox. Created via Playwright automation.',
  };

  test('should create incident and verify it exists in Salesforce sandbox @e2e @p0', async ({
    page,
    incidentCreatePage,
    sfSandboxSearchPage,
    browser,
  }) => {
    // ═══════════════════════════════════════════════════════════
    // STEP 1: Login to ITSM Portal and Create Incident
    // ═══════════════════════════════════════════════════════════

    const baseUrl = process.env.BASE_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.site.com/itsm/s/login/';
    const appUsername = process.env.APP_USERNAME || 'jithinportaluser@milestone.tech.prod.itsmcopy';
    const appPassword = process.env.APP_PASSWORD || 'Jithinjose@itsm1';

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const usernameField = page.getByPlaceholder('Username');
    await usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await usernameField.fill(appUsername);
    await page.getByPlaceholder('Password').fill(appPassword);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await page.waitForTimeout(3000);

    // Navigate to Incident Creation form
    await incidentCreatePage.navigate();

    // Fill all mandatory fields and submit
    await incidentCreatePage.createIncident(incidentData);

    // Assert success and capture incident number
    await expect(incidentCreatePage.successMessageText).toBeVisible({ timeout: 20000 });
    await expect(incidentCreatePage.incidentNumberText).toBeVisible({ timeout: 15000 });

    const incidentNumber = await incidentCreatePage.getIncidentNumber();
    expect(incidentNumber).toMatch(/INC[-]?\d+/);
    console.log(`✅ Step 1 Complete - Incident created: ${incidentNumber}`);

    // ═══════════════════════════════════════════════════════════
    // STEP 2: Login to Salesforce Sandbox (Using Saved Session)
    // ═══════════════════════════════════════════════════════════

    // Check if the storage state file exists
    if (!fs.existsSync(SF_STORAGE_STATE_PATH)) {
      throw new Error(
        `Salesforce session file not found at: ${SF_STORAGE_STATE_PATH}\n` +
        `Run 'npm run auth:sf-sandbox' first to capture an authenticated session.`
      );
    }

    // Create a new browser context with the saved Salesforce session
    const sfContext = await browser.newContext({
      storageState: SF_STORAGE_STATE_PATH,
    });
    const sfPage = await sfContext.newPage();

    // Navigate to Salesforce — should be already authenticated (no MFA needed)
    const sfUrl = process.env.SF_SANDBOX_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.salesforce.com/';
    await sfPage.goto(sfUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await sfPage.waitForTimeout(5000);

    // Verify we're logged in (URL should contain lightning or home)
    const currentUrl = sfPage.url();
    expect(
      currentUrl.includes('lightning') || currentUrl.includes('home') ||
      currentUrl.includes('setup') || currentUrl.includes('one/one.app')
    ).toBe(true);

    console.log(`✅ Step 2 Complete - Logged into Salesforce sandbox (session reused)`);

    // ═══════════════════════════════════════════════════════════
    // STEP 3: Search for the Incident Number in Salesforce
    // ═══════════════════════════════════════════════════════════

    // Use global search on the Salesforce page
    // Create a temporary SfSandboxSearchPage bound to the SF context page
    const { SfSandboxSearchPage } = await import('../../pages/sf-sandbox-search.page');
    const sfSearch = new SfSandboxSearchPage(sfPage);

    await sfSearch.searchGlobal(incidentNumber);
    console.log(`✅ Step 3 Complete - Searched for: ${incidentNumber}`);

    // ═══════════════════════════════════════════════════════════
    // STEP 4: Verify Incident Exists in Salesforce
    // ═══════════════════════════════════════════════════════════

    // Verify the incident appears in search results
    const incidentFound = await sfSearch.isIncidentInResults(incidentNumber);
    expect(incidentFound).toBe(true);

    // Get the incident text from results for additional validation
    const resultText = await sfSearch.getIncidentFromResults(incidentNumber);
    expect(resultText).toContain(incidentNumber);

    console.log(`✅ Step 4 Complete - Incident ${incidentNumber} verified in Salesforce sandbox`);
    console.log(`🎉 E2E Test PASSED: Incident creation → Salesforce verification successful`);

    // Cleanup the Salesforce context
    await sfContext.close();
  });
});

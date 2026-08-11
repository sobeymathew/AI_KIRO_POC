import { test, expect } from '../../fixtures/base.fixture';
import { IncidentFormData } from '../../pages/incident-create.page';

/**
 * Smoke Tests: Incident Creation
 * Jira: KD-7
 * Requirement: REQ-0002
 * Zephyr: KD-T23
 * Feature: src/test-case-management/features/istm/incident-creation.feature
 */
test.describe('Incident Creation - Smoke @smoke', () => {
  // Increase timeout for Salesforce (slow loading)
  test.setTimeout(120000);
  // Test data for incident creation (values verified from live Salesforce form 2026-08-10)
  const incidentData: IncidentFormData = {
    requestedBy: '',  // Auto-populated by system
    requestedFor: '', // Pre-filled with logged-in user (Julia)
    urgency: 'Medium - Productivity Impacted',
    category: 'Network & Connectivity',
    subCategory: 'VPN / ZTNA',
    briefDescription: 'Automated smoke test - incident creation validation test case',
    detailedDescription:
      'This is an automated test incident created to verify the incident creation workflow is functioning correctly end to end.',
  };

  test.beforeEach(async ({ page }) => {
    // Background: Login to the application using verified locators from login-page.repo.json
    const baseUrl = process.env.BASE_URL || 'https://milestoneitsm--fullcopy.sandbox.my.site.com/itsm/s/';
    const username = process.env.APP_USERNAME || 'juliaand@mtiitsm.com';
    const password = process.env.APP_PASSWORD || 'Test@123';

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Use verified locators from object-repository/pages/login-page.repo.json
    const usernameField = page.getByPlaceholder('Username');
    await usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await usernameField.fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    // Wait for login to complete — use domcontentloaded since Salesforce has persistent network activity
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await page.waitForTimeout(3000);
  });

  test('should create incident successfully with all mandatory fields @smoke @p0', async ({
    incidentCreatePage,
  }) => {
    // Arrange - Navigate: Incident Menu → Create Incident
    await incidentCreatePage.navigate();

    // Act - Fill all mandatory fields and submit
    await incidentCreatePage.createIncident(incidentData);

    // Assert - Verify "Incident Created Successfully" message
    await expect(incidentCreatePage.successMessageText).toBeVisible({ timeout: 20000 });

    // Verify Incident Number is generated (format: INC-XXXXXXXXX)
    await expect(incidentCreatePage.incidentNumberText).toBeVisible({ timeout: 15000 });
    const incidentNumber = await incidentCreatePage.getIncidentNumber();
    expect(incidentNumber).toMatch(/INC-\d+/);
    console.log(`✅ Incident created successfully: ${incidentNumber}`);
  });
});

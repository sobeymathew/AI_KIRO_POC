import { test, expect } from '../../fixtures/base.fixture';
import { IncidentFormData } from '../../pages/incident-creation.page';

/**
 * Smoke Tests: Incident Creation
 * Azure DevOps Work Item: 47
 * Test Case: #48 (E2E: Successful incident creation with all mandatory fields)
 * Feature: src/test-case-management/features/istm/incident-creation.feature
 */
test.describe('Incident Creation - Smoke @smoke', () => {
  test.setTimeout(120000);

  // Test data (verified from live form 2026-09-15 — created real incident INC-000001557)
  const incidentData: IncidentFormData = {
    urgency: 'High - Productivity Stopped',
    category: 'Network & Connectivity',
    subCategory: 'Wi-Fi/LAN',
    briefDescription: 'Test incident for validation',
    detailedDescription: 'This is a test incident created to verify the creation workflow',
  };

  test.beforeEach(async ({ page }) => {
    // Background: Login to the ITSM portal
    const baseUrl =
      process.env.BASE_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.site.com/itsm/s/login/';
    const username = process.env.APP_USERNAME || '';
    const password = process.env.APP_PASSWORD || '';

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const usernameField = page.getByPlaceholder('Username');
    await usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await usernameField.fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await page.waitForTimeout(4000);
  });

  test('should create an incident successfully with all mandatory fields @smoke @p0 @e2e', async ({
    incidentCreationPage,
  }) => {
    // Arrange - Navigate to the Create Incident form
    await incidentCreationPage.navigate();

    // Act - Fill all mandatory fields and submit
    await incidentCreationPage.createIncident(incidentData);

    // Assert - Success confirmation is displayed
    await expect(incidentCreationPage.successMessageText).toBeVisible({ timeout: 20000 });

    // Assert - A unique Incident Number (INC-XXXXX) is generated and displayed
    await expect(incidentCreationPage.incidentNumberText).toBeVisible({ timeout: 20000 });
    const incidentNumber = await incidentCreationPage.getIncidentNumber();
    expect(incidentNumber).toMatch(/INC-\d+/);
    console.log(`✅ Incident created successfully: ${incidentNumber}`);
  });
});

import { test, expect } from '../../fixtures/base.fixture';
import { CoiFormData } from '../../pages/coi-request.page';

/**
 * Smoke Tests: Certificate of Insurance (COI) Request
 * Jira: KD-8
 * Requirement: REQ-0003
 * Zephyr: KD-T31
 * Feature: src/test-case-management/features/istm/coi-request.feature
 */
test.describe('COI Request - Smoke @smoke', () => {
  test.setTimeout(120000);

  // Test data (verified from live form 2026-08-11)
  const coiData: CoiFormData = {
    holderName: 'Test Corp Ltd',
    holderAddress: '123 Test Street, Suite 100, New York, NY 10001',
    coverage: {
      general: '1000000',
      workersComp: '500000',
      auto: '250000',
      umbrella: '2000000',
      cyberEo: '1000000',
      crime: '500000',
    },
    comments: 'Automated smoke test - COI request submission KD-8',
  };

  test.beforeEach(async ({ page }) => {
    // Background: Login
    const baseUrl = process.env.BASE_URL || 'https://milestoneitsm--fullcopy.sandbox.my.site.com/itsm/s/';
    const username = process.env.APP_USERNAME || 'juliaand@mtiitsm.com';
    const password = process.env.APP_PASSWORD || 'Test@123';

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const usernameField = page.getByPlaceholder('Username');
    await usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await usernameField.fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await page.waitForTimeout(3000);
  });

  test('should submit COI request successfully with all mandatory fields @smoke @p0', async ({
    coiRequestPage,
  }) => {
    // Arrange - Navigate: Service Request → Service Catalog → COI Request
    await coiRequestPage.navigate();

    // Act - Fill all mandatory fields and submit
    await coiRequestPage.submitCoiRequest(coiData);

    // Assert - Verify "Service Request Created Successfully"
    await expect(coiRequestPage.successMessageText).toBeVisible({ timeout: 20000 });

    // Verify Request Number is generated (format: RQ-XXXXXXXXX)
    await expect(coiRequestPage.requestNumberText).toBeVisible({ timeout: 15000 });
    const requestNumber = await coiRequestPage.getRequestNumber();
    expect(requestNumber).toMatch(/RQ-\d+/);
    console.log(`✅ COI request submitted successfully: ${requestNumber}`);
  });
});

import { test, expect } from '../../fixtures/base.fixture';
import { FacilitiesFormData } from '../../pages/facilities-request.page';

/**
 * Smoke Tests: Facilities Request
 * Jira: KD-9
 * Story ID: SR-FAC-001
 * Zephyr: KD-T34
 * Feature: src/test-case-management/features/istm/facilities-request.feature
 */
test.describe('Facilities Request - Smoke @smoke', () => {
  test.setTimeout(120000);

  // Test data — Category to be verified via healer on first run
  const facilitiesData: FacilitiesFormData = {
    category: 'Office Supplies',
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

  test('should submit facilities request successfully with mandatory fields @smoke @p0', async ({
    facilitiesRequestPage,
  }) => {
    // Arrange - Navigate: Service Request → Service Catalog → Facilities Request
    await facilitiesRequestPage.navigate();

    // Act - Fill mandatory fields and submit
    await facilitiesRequestPage.submitFacilitiesRequest(facilitiesData);

    // Assert - Verify "Service Request Created Successfully"
    await expect(facilitiesRequestPage.successMessageText).toBeVisible({ timeout: 20000 });

    // Verify Request Number is generated (format: RQ-XXXXXXXXX)
    await expect(facilitiesRequestPage.requestNumberText).toBeVisible({ timeout: 15000 });
    const requestNumber = await facilitiesRequestPage.getRequestNumber();
    expect(requestNumber).toMatch(/RQ-\d+/);
    console.log(`✅ Facilities request submitted successfully: ${requestNumber}`);
  });
});

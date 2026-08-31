import { test, expect } from '../../fixtures/base.fixture';
import { SecurityExceptionFormData } from '../../pages/security-exception-request.page';

/**
 * Smoke Tests: Security Exception Request
 * Jira: KD-10
 * Zephyr: KD-T36
 * Feature: src/test-case-management/features/istm/security-exception-request.feature
 */
test.describe('Security Exception Request - Smoke @smoke', () => {
  test.setTimeout(120000);

  const formData: SecurityExceptionFormData = {
    subcategory: 'Subcategory_URLwhitelisting',
    duration: 'Choice_7_30_business_days_Temporary_project_need_Duration_of_Exception',
    description: 'Need URL whitelisting for external vendor portal access during project integration',
    businessReason: 'Vendor integration requires access to external API endpoint for data sync',
    mitigatingControl: 'Access restricted to project team only with VPN requirement',
    businessJustification: 'Automated smoke test - Security Exception Request for URL whitelisting',
  };

  test.beforeEach(async ({ page }) => {
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

  test('should submit security exception request successfully @smoke @p0', async ({
    securityExceptionPage,
  }) => {
    // Arrange
    await securityExceptionPage.navigate();

    // Act
    await securityExceptionPage.submitSecurityException(formData);

    // Assert
    await expect(securityExceptionPage.successMessageText).toBeVisible({ timeout: 20000 });
    await expect(securityExceptionPage.requestNumberText).toBeVisible({ timeout: 15000 });
    const requestNumber = await securityExceptionPage.getRequestNumber();
    expect(requestNumber).toMatch(/RQ-\d+/);
    console.log(`✅ Security Exception Request submitted: ${requestNumber}`);
  });
});

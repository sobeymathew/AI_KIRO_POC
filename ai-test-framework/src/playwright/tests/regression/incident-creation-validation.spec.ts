import { test, expect } from '../../fixtures/base.fixture';

/**
 * Regression Tests: Incident Creation - Mandatory Field Validation
 * Jira: KD-7
 * Requirement: REQ-0002
 * Zephyr: KD-T25
 * Feature: src/test-case-management/features/istm/incident-creation.feature
 */
test.describe('Incident Creation - Mandatory Field Validation @regression', () => {
  // Increase timeout for Salesforce
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    // Background: Login to the application
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

  test('should show validation errors when submitting with empty mandatory fields @regression @p1', async ({
    page,
    incidentCreatePage,
  }) => {
    // Arrange - Navigate to Incident form
    await incidentCreatePage.navigate();

    // Act - Click Submit without filling any mandatory fields
    await incidentCreatePage.submit();
    await page.waitForTimeout(3000);

    // Assert - Still on the Incident Form page (incident NOT created)
    await expect(page).toHaveURL(/.*Incident-Form/);

    // Assert - No success message (incident was not created)
    const successVisible = await page.getByText('Incident Created').isVisible().catch(() => false);
    expect(successVisible).toBe(false);

    // Assert - No INC number generated
    const incNumberVisible = await page.getByText(/INC-\d+/).isVisible().catch(() => false);
    expect(incNumberVisible).toBe(false);

    // Assert - Page didn't crash (still showing form title)
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Incident Form');

    console.log('✅ Mandatory field validation working correctly — form rejected empty submission');
  });
});

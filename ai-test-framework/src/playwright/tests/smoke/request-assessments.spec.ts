import { test, expect } from '../../fixtures/base.fixture';
import { AssessmentFormData } from '../../pages/request-assessments.page';

/**
 * Smoke Tests: Request Assessments
 * Azure DevOps Work Item: 8
 * Feature: src/test-case-management/features/istm/request-assessments.feature
 */
test.describe('Request Assessments - Smoke @smoke', () => {
  test.setTimeout(120000);

  const assessmentData: AssessmentFormData = {
    subcategory: 'Choice_Subcategory_Third_Party_Assessment',
    type: 'Third Party Assessment',
    clientName: 'Test Client Corp',
    description: 'Automated smoke test - Request Assessment for third party security review (Work Item 8)',
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

  test('should submit request assessment successfully @smoke @p0', async ({
    requestAssessmentsPage,
  }) => {
    // Arrange - Navigate: Service Request → Service Catalog → Request Assessments
    await requestAssessmentsPage.navigate();

    // Act - Fill mandatory fields and submit
    await requestAssessmentsPage.submitRequestAssessment(assessmentData);

    // Guard - Fail clearly if the application returned a system error (not a test defect)
    const appError = await requestAssessmentsPage.hasApplicationError();
    expect(
      appError,
      'Application returned a system error on submission (server-side issue, not a test defect)'
    ).toBe(false);

    // Assert - Verify submission succeeded and a request number was generated
    const requestNumber = await requestAssessmentsPage.getRequestNumber();
    expect(requestNumber).toMatch(/RQ-\d+/);
    console.log(`✅ Request Assessment submitted: ${requestNumber}`);
  });
});

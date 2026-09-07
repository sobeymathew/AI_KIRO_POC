import { test, expect } from '../../fixtures/base.fixture';
import { ExpenseFormData } from '../../pages/expense-request.page';

/**
 * Smoke Test: Expense Request (Service Catalog)
 * Azure DevOps Work Item: 14
 * Test Cases: 16 (E2E happy path), 17 (validation), 18 (Requested By read-only), 19 (file negative)
 * Feature: src/test-case-management/features/istm/expense-request.feature
 *
 * The Expense Request form is cascading:
 *   Category → Subcategory → Additional Comments + Business Justification.
 * "Requested By" / "Requested For" are read-only, auto-populated with the logged-in user.
 */
test.describe('Expense Request - Smoke @smoke', () => {
  test.setTimeout(120000);

  // Test data (option values verified from live form 2026-09-02)
  const expenseData: ExpenseFormData = {
    category: 'Choice_Corporate_Card_Category',
    subcategory: 'Choice_New_Credit_Card_Subcategory',
    businessJustification: 'New corporate credit card required for business travel expenses.',
    additionalComments: 'Automated smoke test - Expense Request submission (Work Item 14)',
  };

  test.beforeEach(async ({ page }) => {
    // Background: Login
    const baseUrl =
      process.env.BASE_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.site.com/itsm/s/login/';
    const username = process.env.APP_USERNAME || 'jithinportaluser@milestone.tech.prod.itsmcopy';
    const password = process.env.APP_PASSWORD || 'Jithinjose@itsm2';

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const usernameField = page.getByPlaceholder('Username');
    await usernameField.waitFor({ state: 'visible', timeout: 30000 });
    await usernameField.fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await page.waitForTimeout(3000);
  });

  test('should submit Expense Request successfully with all mandatory fields @smoke @p0 @e2e', async ({
    expenseRequestPage,
  }) => {
    // Arrange - Navigate: Service Request → Service Catalog → Expense Request
    await expenseRequestPage.navigate();

    // Assert (AC) - Requested By is auto-populated and read-only
    const requestedBy = await expenseRequestPage.getRequestedByValue();
    expect(requestedBy.trim().length).toBeGreaterThan(0);
    expect(await expenseRequestPage.isRequestedByReadOnly()).toBe(true);

    // Act - Fill the cascading mandatory fields and submit
    await expenseRequestPage.submitExpenseRequest(expenseData);

    // Assert - Verify success and a generated Request Number (format: RQ-XXXXXXXXX)
    await expect(expenseRequestPage.requestNumberText).toBeVisible({ timeout: 20000 });
    const requestNumber = await expenseRequestPage.getRequestNumber();
    expect(requestNumber).toMatch(/RQ-\d+/);
    console.log(`✅ Expense Request submitted successfully: ${requestNumber}`);
  });
});

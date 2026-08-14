import { test, expect } from '../../fixtures/base.fixture';
import { ExpenseFormData } from '../../pages/expense-request.page';

/**
 * Smoke Tests: Expense Request
 * Story ID: SR-EXP-001
 * Source: Expense-Request-User-Story.docx
 * User Story: src/test-case-management/user-stories/expense-request.md
 * Feature: src/test-case-management/features/istm/expense-request.feature
 */
test.describe('Expense Request - Smoke @smoke', () => {
  test.setTimeout(120000);

  // Test data (verified from live form 2026-08-11)
  const expenseData: ExpenseFormData = {
    category: 'Corporate Card',
    subcategory: 'New Credit Card',
    businessJustification: 'Automated smoke test - Expense request submission for corporate card',
  };

  test.beforeEach(async ({ page }) => {
    // Background: Login
    const baseUrl = process.env.BASE_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.site.com/itsm/s/login/';
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

  test('should submit expense request successfully with mandatory fields @smoke @p0', async ({
    expenseRequestPage,
  }) => {
    // Arrange - Navigate: Service Request → Service Catalog → Expense Request
    await expenseRequestPage.navigate();

    // Act - Fill mandatory fields and submit
    await expenseRequestPage.submitExpenseRequest(expenseData);

    // Check for portal error (Salesforce Flow errors)
    const errorMessage = expenseRequestPage.page.getByText('Something went wrong');
    const hasError = await errorMessage.isVisible().catch(() => false);
    if (hasError) {
      const errorText = await expenseRequestPage.page.locator('main').textContent();
      throw new Error(`Portal returned a system error after submission: ${errorText?.trim()}`);
    }

    // Assert - Verify success message (flexible matching)
    await expect(expenseRequestPage.successMessageText).toBeVisible({ timeout: 30000 });

    // Verify Request Number is generated (format: RQ-XXXXXXXXX or RQXXXXXXXXX)
    await expect(expenseRequestPage.requestNumberText).toBeVisible({ timeout: 20000 });
    const requestNumber = await expenseRequestPage.getRequestNumber();
    expect(requestNumber).toMatch(/RQ[-]?\d+/);
    console.log(`Expense request submitted successfully: ${requestNumber}`);
  });
});

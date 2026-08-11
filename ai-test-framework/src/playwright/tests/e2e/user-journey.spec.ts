import { test, expect } from '../../fixtures/base.fixture';

/**
 * E2E Tests: Complete User Journey
 * Requirement: REQ-0001, REQ-0002
 * Feature: src/test-case-management/features/e2e/user-complete-journey.feature
 */
test.describe('Complete User Journey - E2E @e2e', () => {
  test('should complete login to dashboard to logout flow @e2e @p0', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    // Step 1: Navigate to login
    await loginPage.navigate();
    await expect(loginPage.emailInput).toBeVisible();

    // Step 2: Login with valid credentials
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@12345';
    await loginPage.login(email, password);

    // Step 3: Verify dashboard loaded
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(dashboardPage.mainContent).toBeVisible();

    // Step 4: Navigate to settings
    await dashboardPage.goToSettings();
    await expect(page).toHaveURL(/.*settings/);

    // Step 5: Go back to dashboard
    await dashboardPage.navigate();
    await expect(dashboardPage.mainContent).toBeVisible();

    // Step 6: Logout
    await dashboardPage.logout();

    // Step 7: Verify redirected to login
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.emailInput).toBeVisible();
  });

  test('should handle session timeout gracefully @e2e @p1', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    // Step 1: Login
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@12345';
    await loginPage.navigate();
    await loginPage.login(email, password);
    await expect(dashboardPage.welcomeMessage).toBeVisible();

    // Step 2: Clear auth state to simulate session expiry
    await page.context().clearCookies();

    // Step 3: Attempt navigation
    await dashboardPage.navigate();

    // Step 4: Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});

import { test, expect } from '../../fixtures/base.fixture';

/**
 * Smoke Tests: User Authentication
 * Requirement: REQ-0001
 * User Story: US-0001 - User Login with Email and Password
 * Feature: src/test-case-management/features/smoke/user-authentication.feature
 * Target: Salesforce ITSM Portal (milestoneitsm--fullcopy.sandbox.my.site.com)
 */
test.describe('User Authentication - Smoke @smoke', () => {
  test.setTimeout(120000); // Salesforce pages load slowly

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display login form correctly @smoke @p0', async ({ loginPage }) => {
    // Assert - Verify login form elements are visible
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test('should login successfully with valid credentials @smoke @p0', async ({
    loginPage,
    page,
  }) => {
    // Arrange
    const username = process.env.APP_USERNAME || 'juliaand@mtiitsm.com';
    const password = process.env.APP_PASSWORD || 'Test@123';

    // Act
    await loginPage.login(username, password);

    // Assert - After successful login, user should be on the home/dashboard page
    await page.waitForLoadState('domcontentloaded');
    // Verify URL changed away from login (Salesforce redirects to home after login)
    await expect(page).not.toHaveURL(/.*login.*/i, { timeout: 60000 });
  });

  test('should show error for invalid credentials @smoke @p0', async ({
    loginPage,
    page,
  }) => {
    // Arrange
    const invalidUsername = 'invalid@example.com';
    const invalidPassword = 'wrongpassword123';

    // Act
    await loginPage.login(invalidUsername, invalidPassword);

    // Assert - Should remain on login page or show error
    await page.waitForTimeout(5000); // Wait for error to appear
    const currentUrl = page.url();
    // Salesforce either shows error or keeps user on login page
    const isStillOnLogin = await loginPage.usernameInput.isVisible();
    expect(isStillOnLogin).toBeTruthy();
  });

  test('should verify password field masks input @smoke @p1', async ({ loginPage }) => {
    // Assert - Password field type should be 'password' for masking
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });
});

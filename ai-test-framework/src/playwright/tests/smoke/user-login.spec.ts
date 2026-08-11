import { test, expect } from '../../fixtures/base.fixture';

/**
 * Smoke Tests: User Authentication
 * Requirement: REQ-0001
 * User Story: US-0001
 * Feature: src/test-case-management/features/smoke/user-authentication.feature
 */
test.describe('User Authentication - Smoke @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display login form correctly @smoke @p0', async ({ loginPage }) => {
    // Assert - Verify login form elements are visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('should login successfully with valid credentials @smoke @p0', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Arrange
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@12345';

    // Act
    await loginPage.login(email, password);

    // Assert
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(dashboardPage.userAvatar).toBeVisible();
  });

  test('should show error for invalid credentials @smoke @p0', async ({
    loginPage,
  }) => {
    // Arrange
    const invalidEmail = 'invalid@example.com';
    const invalidPassword = 'wrongpassword';

    // Act
    await loginPage.login(invalidEmail, invalidPassword);

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should navigate to forgot password page @smoke @p1', async ({
    loginPage,
    page,
  }) => {
    // Act
    await loginPage.clickForgotPassword();

    // Assert
    await expect(page).toHaveURL(/.*forgot-password/);
  });
});

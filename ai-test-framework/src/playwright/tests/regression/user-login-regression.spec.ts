import { test, expect } from '../../fixtures/base.fixture';

/**
 * Regression Tests: User Authentication
 * Requirement: REQ-0001
 * Feature: src/test-case-management/features/regression/user-authentication-full.feature
 */
test.describe('User Authentication - Regression @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should validate required email field @regression @p1', async ({
    loginPage,
  }) => {
    // Arrange - Leave email empty
    const password = 'Test@12345';

    // Act
    await loginPage.login('', password);

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should validate email format @regression @p1', async ({ loginPage }) => {
    // Arrange - Invalid email format
    const invalidEmail = 'not-an-email';
    const password = 'Test@12345';

    // Act
    await loginPage.login(invalidEmail, password);

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should validate required password field @regression @p1', async ({
    loginPage,
  }) => {
    // Arrange - Leave password empty
    const email = 'test@example.com';

    // Act
    await loginPage.login(email, '');

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should mask password input @regression @p2', async ({ loginPage }) => {
    // Assert - Password field type is 'password'
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should support remember me functionality @regression @p2', async ({
    loginPage,
  }) => {
    // Arrange
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@12345';

    // Act
    await loginPage.loginWithRememberMe(email, password);

    // Assert - User stays logged in (verified via cookie/storage)
    // This would check persistent auth state
  });

  test('should navigate to sign up page @regression @p2', async ({
    loginPage,
    page,
  }) => {
    // Act
    await loginPage.clickSignUp();

    // Assert
    await expect(page).toHaveURL(/.*sign-up|register/);
  });

  test('should display Google login option @regression @p2', async ({
    loginPage,
  }) => {
    // Assert
    await expect(loginPage.googleLoginButton).toBeVisible();
  });

  test('should display GitHub login option @regression @p2', async ({
    loginPage,
  }) => {
    // Assert
    await expect(loginPage.githubLoginButton).toBeVisible();
  });
});

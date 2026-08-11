import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Login page.
 * Handles all user authentication interactions.
 * 
 * URL: /login
 * Repository: src/web-scraping/object-repository/pages/login-page.repo.json
 */
export class LoginPage extends BasePage {
  // Form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly rememberMeCheckbox: Locator;

  // Links
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  // Feedback elements
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly loadingSpinner: Locator;

  // Social login
  readonly googleLoginButton: Locator;
  readonly githubLoginButton: Locator;

  constructor(page: Page) {
    super(page);

    // Form elements
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.submitButton = page.getByTestId('login-submit');
    this.rememberMeCheckbox = page.getByLabel('Remember me');

    // Links
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });

    // Feedback elements
    this.errorMessage = page.getByTestId('login-error');
    this.successMessage = page.getByTestId('login-success');
    this.loadingSpinner = page.getByTestId('login-loading');

    // Social login
    this.googleLoginButton = page.getByTestId('login-google');
    this.githubLoginButton = page.getByTestId('login-github');
  }

  /** Navigate to the login page */
  async navigate(): Promise<void> {
    await this.goto('/login');
  }

  /** Perform login with email and password */
  async login(email: string, password: string): Promise<void> {
    this.logger.info(`Logging in as: ${email}`);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /** Perform login with remember me checked */
  async loginWithRememberMe(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.rememberMeCheckbox.check();
    await this.submitButton.click();
  }

  /** Click the forgot password link */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /** Click the sign up link */
  async clickSignUp(): Promise<void> {
    await this.signUpLink.click();
  }

  /** Login with Google OAuth */
  async loginWithGoogle(): Promise<void> {
    await this.googleLoginButton.click();
  }

  /** Login with GitHub OAuth */
  async loginWithGitHub(): Promise<void> {
    await this.githubLoginButton.click();
  }

  /** Get the error message text */
  async getErrorText(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /** Check if login form is displayed */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.emailInput.isVisible();
  }
}

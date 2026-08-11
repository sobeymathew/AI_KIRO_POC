import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

/**
 * Authentication fixture that provides a pre-authenticated browser context.
 * Uses storage state to skip login for tests that require authenticated state.
 */
type AuthFixtures = {
  authenticatedPage: DashboardPage;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    // Create a new context with stored auth state
    const context = await browser.newContext({
      storageState: 'src/test-data/environments/.auth-state.json',
    });
    const page = await context.newPage();
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
    await context.close();
  },
});

export { expect } from '@playwright/test';

/**
 * Global setup to create authentication state.
 * Run once before test suite to generate .auth-state.json
 */
export async function globalAuthSetup(
  baseURL: string,
  email: string,
  password: string
): Promise<void> {
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/login`);
  const loginPage = new LoginPage(page);
  await loginPage.login(email, password);
  await page.waitForURL('**/dashboard');

  // Save authentication state
  await page.context().storageState({
    path: 'src/test-data/environments/.auth-state.json',
  });

  await browser.close();
}

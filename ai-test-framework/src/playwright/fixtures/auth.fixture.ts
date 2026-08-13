import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/**
 * Authentication fixture that provides a pre-authenticated browser context.
 * Uses Salesforce ITSM portal authentication via username/password.
 */
type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'src/playwright/fixtures/.auth-state.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';

/**
 * Global setup to create ITSM portal authentication state.
 * Run once before test suite to generate .auth-state.json
 */
export async function globalAuthSetup(
  baseURL: string,
  username: string,
  password: string
): Promise<void> {
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL);
  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);

  // Wait for portal home page to load after login
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Save authentication state
  await page.context().storageState({
    path: 'src/playwright/fixtures/.auth-state.json',
  });

  await browser.close();
}

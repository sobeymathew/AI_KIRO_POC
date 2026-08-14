import { Page } from '@playwright/test';

/**
 * Shared helper utilities for Agentforce test specs.
 * Eliminates login duplication across smoke, regression, e2e, and coverage gap specs.
 */

/**
 * Login to the ITSM portal as a portal user (requestor).
 * Uses credentials from .env.dev (BASE_URL, APP_USERNAME, APP_PASSWORD).
 */
export async function loginToPortal(page: Page): Promise<void> {
  const baseUrl = process.env.BASE_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.site.com/itsm/s/login/';
  const username = process.env.APP_USERNAME || 'jithinportaluser@milestone.tech.prod.itsmcopy';
  const password = process.env.APP_PASSWORD || 'Jithinjose@itsm1';

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const usernameField = page.getByPlaceholder('Username');
  await usernameField.waitFor({ state: 'visible', timeout: 30000 });
  await usernameField.fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  await page.waitForTimeout(5000);
}

/**
 * Login to Salesforce sandbox as fulfiller/admin.
 * Two-step login: username → password.
 * Uses credentials from .env.dev (SF_SANDBOX_URL, SF_SANDBOX_USERNAME, SF_SANDBOX_PASSWORD).
 * Note: MFA may block this — use stored session (npm run auth:sf-sandbox) for MFA bypass.
 */
export async function loginToSalesforce(page: Page): Promise<void> {
  const sfUrl = process.env.SF_SANDBOX_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.salesforce.com/';
  const username = process.env.SF_SANDBOX_USERNAME || 'jithin.fulfiller@milestone.tech.itsmcopy';
  const password = process.env.SF_SANDBOX_PASSWORD || 'Jithinjose@itsm1';

  await page.goto(sfUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Step 1: Enter username
  const usernameInput = page.locator('#username');
  await usernameInput.waitFor({ state: 'visible', timeout: 30000 });
  await usernameInput.fill(username);
  await page.locator('#Login').click();

  // Step 2: Enter password
  const passwordInput = page.locator('#password');
  await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
  await passwordInput.fill(password);
  await page.locator('#Login').click();

  await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  await page.waitForTimeout(5000);
}

/**
 * Get Agentforce response timeout from env or default.
 */
export function getAgentforceTimeout(): number {
  return parseInt(process.env.AGENTFORCE_RESPONSE_TIMEOUT || '15000', 10);
}

/**
 * Get Agentforce panel timeout from env or default.
 */
export function getPanelTimeout(): number {
  return parseInt(process.env.AGENTFORCE_PANEL_TIMEOUT || '10000', 10);
}

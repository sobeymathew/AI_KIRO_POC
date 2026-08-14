import { chromium } from '@playwright/test';
import path from 'path';

/**
 * Salesforce Sandbox Authentication Setup Script
 *
 * This script opens a headed browser to the Salesforce sandbox login page.
 * You manually log in and complete the MFA/passkey challenge.
 * Once logged in, the browser's storage state (cookies + localStorage) is saved
 * to a JSON file that subsequent tests can reuse — bypassing MFA on every run.
 *
 * Usage:
 *   npx ts-node src/playwright/auth/sf-sandbox-auth.setup.ts
 *   OR
 *   npm run auth:sf-sandbox
 *
 * After running:
 *   - Complete the login + MFA in the browser window that opens
 *   - Once you see the Salesforce home page, press Enter in this terminal
 *   - The session will be saved to: src/playwright/auth/.sf-sandbox-storageState.json
 *
 * The saved session is valid until Salesforce expires it (typically 2-12 hours).
 * Re-run this script whenever the session expires.
 */

const SF_SANDBOX_URL = process.env.SF_SANDBOX_URL || 'https://milestoneitsm--itsmcopy.sandbox.my.salesforce.com/';
const STORAGE_STATE_PATH = path.resolve(__dirname, '.sf-sandbox-storageState.json');

async function setupSfSandboxAuth(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Salesforce Sandbox - Authentication Setup                   ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  A browser window will open. Please:                         ║');
  console.log('║    1. Enter your username and click "Log In to Sandbox"      ║');
  console.log('║    2. Enter your password and click "Log In to Sandbox"      ║');
  console.log('║    3. Complete the MFA/passkey verification                  ║');
  console.log('║    4. Wait until you see the Salesforce home page            ║');
  console.log('║    5. Come back here and press ENTER to save the session     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Launch a headed browser so the user can interact
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // Navigate to Salesforce sandbox login
  console.log(`🌐 Navigating to: ${SF_SANDBOX_URL}`);
  await page.goto(SF_SANDBOX_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Pre-fill the username if available
  const sfUsername = process.env.SF_SANDBOX_USERNAME || 'jithin.fulfiller@milestone.tech.itsmcopy';
  try {
    const usernameInput = page.locator('#username');
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await usernameInput.fill(sfUsername);
    console.log(`📝 Pre-filled username: ${sfUsername}`);
    console.log('');
  } catch {
    console.log('⚠️  Could not pre-fill username. Please enter it manually.');
  }

  console.log('👉 Complete the login + MFA in the browser window...');
  console.log('');

  // Wait for the user to press Enter after completing login
  await waitForEnter('Press ENTER here after you see the Salesforce home page...');

  // Verify we're logged in by checking the URL
  const currentUrl = page.url();
  console.log(`📍 Current URL: ${currentUrl}`);

  if (currentUrl.includes('lightning') || currentUrl.includes('home') || currentUrl.includes('setup') || currentUrl.includes('one/one.app')) {
    console.log('✅ Login confirmed! Saving session...');
  } else {
    console.log('⚠️  URL doesn\'t look like a logged-in page, but saving state anyway.');
    console.log('   If tests fail, re-run this script and ensure you\'re fully logged in.');
  }

  // Save the storage state (cookies + localStorage)
  await context.storageState({ path: STORAGE_STATE_PATH });
  console.log(`💾 Session saved to: ${STORAGE_STATE_PATH}`);
  console.log('');
  console.log('🎉 Done! Your tests will now reuse this session to bypass MFA.');
  console.log('   Re-run this script if the session expires.');

  // Cleanup
  await browser.close();
}

/** Helper: Wait for the user to press Enter in the terminal */
function waitForEnter(message: string): Promise<void> {
  return new Promise((resolve) => {
    console.log(message);
    process.stdin.setRawMode?.(false);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.pause();
      resolve();
    });
  });
}

// Run the setup
setupSfSandboxAuth().catch((error) => {
  console.error('❌ Auth setup failed:', error.message);
  process.exit(1);
});

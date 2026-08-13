import { test, expect } from '../../fixtures/base.fixture';
import { TravelFormData } from '../../pages/travel-request.page';

/**
 * Smoke Tests: Travel Request
 * Story ID: SR-TRV-001
 * Source: Direct user story (chat)
 * Feature: src/test-case-management/features/istm/travel-request.feature
 */
test.describe('Travel Request - Smoke @smoke', () => {
  test.setTimeout(120000);

  // Generate future dates for travel
  const today = new Date();
  const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const endDate = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
  const formatDate = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;

  const travelData: TravelFormData = {
    category: 'Travel Approval',
    subcategory: 'Domestic Billable',
    departureCity: 'New York',
    arrivalCity: 'San Francisco',
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    estimatedCost: '2500',
    purposeOfVisit: 'Client meeting for Q3 project review and planning session',
    comments: 'Automated smoke test - Travel request submission for domestic travel',
  };

  test.beforeEach(async ({ page }) => {
    // Background: Login
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
    await page.waitForTimeout(3000);
  });

  test('should submit travel request successfully with mandatory fields @smoke @p0', async ({
    travelRequestPage,
  }) => {
    // Arrange - Navigate: Service Request → Service Catalog → Travel → Travel Request
    await travelRequestPage.navigate();

    // Act - Fill mandatory fields and submit
    await travelRequestPage.submitTravelRequest(travelData);

    // Assert - Verify success message
    await expect(travelRequestPage.successMessageText).toBeVisible({ timeout: 30000 });

    // Verify Request Number is generated
    await expect(travelRequestPage.requestNumberText).toBeVisible({ timeout: 20000 });
    const requestNumber = await travelRequestPage.getRequestNumber();
    expect(requestNumber).toMatch(/RQ[-]?\d+/);
    console.log(`Travel request submitted successfully: ${requestNumber}`);
  });
});

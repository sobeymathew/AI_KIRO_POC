import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { IncidentCreatePage } from '../pages/incident-create.page';
import { CoiRequestPage } from '../pages/coi-request.page';
import { ExpenseRequestPage } from '../pages/expense-request.page';
import { TravelRequestPage } from '../pages/travel-request.page';
import { FacilitiesRequestPage } from '../pages/facilities-request.page';
import { RequestAssessmentsPage } from '../pages/request-assessments.page';

/**
 * Extended test fixtures providing ITSM page objects.
 * Import this instead of @playwright/test in all test files.
 */
type PageFixtures = {
  loginPage: LoginPage;
  incidentCreatePage: IncidentCreatePage;
  coiRequestPage: CoiRequestPage;
  expenseRequestPage: ExpenseRequestPage;
  travelRequestPage: TravelRequestPage;
  facilitiesRequestPage: FacilitiesRequestPage;
  requestAssessmentsPage: RequestAssessmentsPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  incidentCreatePage: async ({ page }, use) => {
    await use(new IncidentCreatePage(page));
  },
  coiRequestPage: async ({ page }, use) => {
    await use(new CoiRequestPage(page));
  },
  expenseRequestPage: async ({ page }, use) => {
    await use(new ExpenseRequestPage(page));
  },
  travelRequestPage: async ({ page }, use) => {
    await use(new TravelRequestPage(page));
  },
  facilitiesRequestPage: async ({ page }, use) => {
    await use(new FacilitiesRequestPage(page));
  },
  requestAssessmentsPage: async ({ page }, use) => {
    await use(new RequestAssessmentsPage(page));
  },
});

export { expect } from '@playwright/test';

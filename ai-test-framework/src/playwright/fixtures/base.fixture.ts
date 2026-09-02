import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { IncidentCreatePage } from '../pages/incident-create.page';
import { CoiRequestPage } from '../pages/coi-request.page';
import { RequestAssessmentsPage } from '../pages/request-assessments.page';
import { SecurityExceptionRequestPage } from '../pages/security-exception-request.page';
import { ExpenseRequestPage } from '../pages/expense-request.page';

/**
 * Extended test fixtures providing ITSM page objects.
 * Import this instead of @playwright/test in all test files.
 */
type PageFixtures = {
  loginPage: LoginPage;
  incidentCreatePage: IncidentCreatePage;
  coiRequestPage: CoiRequestPage;
  requestAssessmentsPage: RequestAssessmentsPage;
  securityExceptionPage: SecurityExceptionRequestPage;
  expenseRequestPage: ExpenseRequestPage;
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
  requestAssessmentsPage: async ({ page }, use) => {
    await use(new RequestAssessmentsPage(page));
  },
  securityExceptionPage: async ({ page }, use) => {
    await use(new SecurityExceptionRequestPage(page));
  },
  expenseRequestPage: async ({ page }, use) => {
    await use(new ExpenseRequestPage(page));
  },
});

export { expect } from '@playwright/test';

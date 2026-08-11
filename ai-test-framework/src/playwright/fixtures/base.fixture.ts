import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { IncidentCreatePage } from '../pages/incident-create.page';
import { CoiRequestPage } from '../pages/coi-request.page';
import { HeaderNavComponent } from '../components/header-nav.component';

/**
 * Extended test fixtures providing page objects and components.
 * Import this instead of @playwright/test in all test files.
 */
type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  incidentCreatePage: IncidentCreatePage;
  coiRequestPage: CoiRequestPage;
  headerNav: HeaderNavComponent;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  incidentCreatePage: async ({ page }, use) => {
    const incidentCreatePage = new IncidentCreatePage(page);
    await use(incidentCreatePage);
  },

  coiRequestPage: async ({ page }, use) => {
    const coiRequestPage = new CoiRequestPage(page);
    await use(coiRequestPage);
  },

  headerNav: async ({ page }, use) => {
    const headerNav = new HeaderNavComponent(page);
    await use(headerNav);
  },
});

export { expect } from '@playwright/test';

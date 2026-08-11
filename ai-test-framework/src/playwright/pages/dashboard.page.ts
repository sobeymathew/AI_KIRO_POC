import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Dashboard page.
 * Main landing page after successful authentication.
 * 
 * URL: /dashboard
 * Repository: src/web-scraping/object-repository/pages/dashboard-page.repo.json
 */
export class DashboardPage extends BasePage {
  // Header elements
  readonly welcomeMessage: Locator;
  readonly userAvatar: Locator;
  readonly notificationBell: Locator;
  readonly logoutButton: Locator;

  // Navigation
  readonly sideNav: Locator;
  readonly settingsLink: Locator;
  readonly profileLink: Locator;

  // Content
  readonly mainContent: Locator;
  readonly statsWidget: Locator;
  readonly recentActivity: Locator;

  constructor(page: Page) {
    super(page);

    // Header elements
    this.welcomeMessage = page.getByTestId('dashboard-welcome');
    this.userAvatar = page.getByTestId('user-avatar');
    this.notificationBell = page.getByTestId('notification-bell');
    this.logoutButton = page.getByTestId('logout-button');

    // Navigation
    this.sideNav = page.getByTestId('side-navigation');
    this.settingsLink = page.getByRole('link', { name: 'Settings' });
    this.profileLink = page.getByRole('link', { name: 'Profile' });

    // Content
    this.mainContent = page.getByTestId('main-content');
    this.statsWidget = page.getByTestId('stats-widget');
    this.recentActivity = page.getByTestId('recent-activity');
  }

  /** Navigate to the dashboard */
  async navigate(): Promise<void> {
    await this.goto('/dashboard');
  }

  /** Get the welcome message text */
  async getWelcomeText(): Promise<string> {
    return (await this.welcomeMessage.textContent()) ?? '';
  }

  /** Click logout button */
  async logout(): Promise<void> {
    this.logger.info('Logging out');
    await this.logoutButton.click();
  }

  /** Navigate to settings */
  async goToSettings(): Promise<void> {
    await this.settingsLink.click();
  }

  /** Navigate to profile */
  async goToProfile(): Promise<void> {
    await this.profileLink.click();
  }

  /** Check if dashboard is loaded */
  async isDashboardLoaded(): Promise<boolean> {
    return await this.mainContent.isVisible();
  }

  /** Get notification count */
  async getNotificationCount(): Promise<number> {
    const badge = this.page.getByTestId('notification-count');
    const text = await badge.textContent();
    return parseInt(text ?? '0', 10);
  }
}

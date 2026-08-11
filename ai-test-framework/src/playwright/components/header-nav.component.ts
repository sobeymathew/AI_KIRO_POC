import { Page, Locator } from '@playwright/test';

/**
 * Reusable component for the header navigation bar.
 * Used across multiple pages.
 */
export class HeaderNavComponent {
  private readonly page: Page;

  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly userMenu: Locator;
  readonly userMenuDropdown: Locator;
  readonly helpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId('app-logo');
    this.searchInput = page.getByTestId('global-search');
    this.userMenu = page.getByTestId('user-menu-trigger');
    this.userMenuDropdown = page.getByTestId('user-menu-dropdown');
    this.helpLink = page.getByRole('link', { name: 'Help' });
  }

  /** Click the application logo to go home */
  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  /** Search for content globally */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  /** Open the user menu dropdown */
  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
    await this.userMenuDropdown.waitFor({ state: 'visible' });
  }

  /** Navigate to help page */
  async goToHelp(): Promise<void> {
    await this.helpLink.click();
  }

  /** Check if header is visible */
  async isVisible(): Promise<boolean> {
    return await this.logo.isVisible();
  }
}

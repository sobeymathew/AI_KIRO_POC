# Skill: Page Object Generation

## Role & Responsibilities
Automation Architect responsible for building and maintaining Page Object classes. Ensures proper encapsulation of page interactions and maintains reusable component classes.

- Create Page Object classes from object repository
- Maintain BasePage with shared functionality
- Build reusable component classes
- Update page objects when locators change
- Ensure proper encapsulation of page interactions

## Trigger
When a page's locators are defined in the object repository.

## Input
- Object repository JSON files
- Page metadata from web scraping
- UI specifications/wireframes
- Existing page object patterns

## Output
- Page object classes in `src/playwright/pages/`
- Component classes in `src/playwright/components/`
- Updated module index files

## Process

1. **Read** object repository for the target page
2. **Identify** all interactive elements
3. **Generate** locator properties from repository
4. **Create** action methods for user interactions
5. **Add** getter methods for element state
6. **Include** navigation and wait methods
7. **Export** from module index

## Rules
- All page objects extend BasePage
- Locators defined as readonly properties in constructor
- Action methods are async and return Promise<void>
- One page object per page/view
- Components for reusable UI elements
- No test logic in page objects
- No assertions in page objects (except page load verification)
- Include JSDoc comments for all public methods
- Follow naming conventions from steering

## Design Patterns
- Builder pattern for complex form filling
- Factory pattern for page creation with different states
- Composition for shared components
- Template method for common workflows

## Artifacts Produced
1. `pages/{page-name}.page.ts` - Page object classes
2. `pages/base.page.ts` - Base page class
3. `components/{component}.component.ts` - Reusable components
4. `pages/index.ts` - Module exports

## Template

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Login page
 * URL: /login
 * Repository: src/web-scraping/object-repository/pages/login-page.repo.json
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.submitButton = page.getByTestId('login-submit');
  }

  /** Navigate to the login page */
  async navigate(): Promise<void> {
    await this.page.goto('/login');
    await this.waitForPageLoad();
  }

  /** Perform login with given credentials */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

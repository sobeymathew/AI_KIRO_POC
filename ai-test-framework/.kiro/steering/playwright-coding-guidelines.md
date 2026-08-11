# Playwright Coding Guidelines

## Core Principles

1. **No hard-coded waits** - Never use `page.waitForTimeout()`. Use Playwright's auto-waiting or explicit wait conditions.
2. **Prefer data-testid** - Always prefer `[data-testid]` locators over CSS/XPath.
3. **Page Object Model** - All page interactions go through page objects.
4. **Centralized locators** - Locators defined in object repository, consumed by page objects.

## Locator Strategy (Priority Order)

1. `data-testid` attribute → `page.getByTestId('submit-btn')`
2. Role-based → `page.getByRole('button', { name: 'Submit' })`
3. Text-based → `page.getByText('Welcome')`
4. Label-based → `page.getByLabel('Email')`
5. Placeholder → `page.getByPlaceholder('Enter email')`
6. CSS selector → `page.locator('.login-form')` (last resort)

## Page Object Pattern

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // Locators as readonly properties
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.submitButton = page.getByTestId('login-submit');
  }

  // Actions as async methods
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## Error Handling

- Use try-catch for known failure scenarios
- Log meaningful error messages with context
- Capture screenshots on assertion failures (automatic via config)
- Never swallow exceptions silently

## Performance

- Minimize browser context creation
- Reuse authentication state where possible
- Use API calls for test data setup when faster
- Parallelize independent tests

## Fixtures

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type TestFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});
```

## Forbidden Patterns

- ❌ `page.waitForTimeout(5000)`
- ❌ Hard-coded URLs in tests
- ❌ Direct DOM manipulation for assertions
- ❌ Shared mutable state between tests
- ❌ `page.$eval()` for simple interactions
- ❌ Index-based locators (`nth-child(3)`)

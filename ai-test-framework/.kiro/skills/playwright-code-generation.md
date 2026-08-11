# Skill: Playwright Code Generation

## Role & Responsibilities
Senior Automation Engineer responsible for building Playwright test automation code. Generates executable tests from feature files, implements fixtures, utilities, and custom assertions.

- Generate Playwright test files from feature files
- Implement reusable fixtures and hooks
- Build utility libraries
- Implement custom assertions
- Maintain test infrastructure code

## Trigger
When feature files are ready and page objects exist.

## Input
- Feature files (Gherkin)
- Page objects (existing or to be created)
- Object repository locators
- Test data specifications

## Output
- Test spec files in `src/playwright/tests/{category}/`
- Utility functions in `src/playwright/utils/`
- Fixtures in `src/playwright/fixtures/`
- Custom assertions in `src/playwright/assertions/`

## Process

1. **Parse** feature file scenarios
2. **Map** steps to page object methods
3. **Generate** test file with proper imports
4. **Add** fixtures and hooks
5. **Include** assertions and verifications
6. **Tag** tests with metadata annotations

## Rules
- Must follow Playwright coding guidelines from steering
- No hard-coded waits (zero tolerance)
- All tests must use fixtures for page objects
- Tests must be independent and parallelizable
- Must include proper test annotations
- Must use centralized test data
- Must follow AAA pattern (Arrange-Act-Assert)

## Code Quality Standards
- TypeScript strict mode compliance
- No `any` types
- All public methods documented with JSDoc
- Maximum cyclomatic complexity: 10
- Test files < 200 lines

## Artifacts Produced
1. `tests/{category}/{feature}.spec.ts` - Test files
2. `fixtures/{name}.fixture.ts` - Test fixtures
3. `utils/{name}.util.ts` - Utility libraries
4. `assertions/{name}.assertion.ts` - Custom assertions
5. `hooks/global-setup.ts` - Global hooks

## Interaction Pattern
```
Input: Feature Files + Page Objects + Test Data →
  Process: Parse → Map → Generate → Validate →
    Output: Executable Playwright Tests
      → Feeds: Test Execution → Reporting
```

## Template

```typescript
import { test, expect } from '../../fixtures/base.fixture';
import { testData } from '@test-data/static/auth.data';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should login successfully with valid credentials @smoke @p0', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Arrange
    const { email, password } = testData.validUser;

    // Act
    await loginPage.login(email, password);

    // Assert
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(dashboardPage.userAvatar).toBeVisible();
  });
});
```

# Naming Conventions

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Page Objects | `kebab-case.page.ts` | `login-page.page.ts` |
| Components | `kebab-case.component.ts` | `header-nav.component.ts` |
| Tests | `kebab-case.spec.ts` | `user-login.spec.ts` |
| Fixtures | `kebab-case.fixture.ts` | `auth-user.fixture.ts` |
| Utilities | `kebab-case.util.ts` | `date-formatter.util.ts` |
| Feature Files | `kebab-case.feature` | `user-authentication.feature` |
| Config Files | `kebab-case.config.ts` | `browser-options.config.ts` |
| Types | `kebab-case.types.ts` | `test-result.types.ts` |
| Object Repository | `kebab-case.repo.json` | `login-page.repo.json` |

## Class Naming

- Page Objects: `PascalCase` + `Page` suffix → `LoginPage`
- Components: `PascalCase` + `Component` suffix → `HeaderNavComponent`
- Fixtures: `PascalCase` + `Fixture` suffix → `AuthUserFixture`
- Utilities: `PascalCase` + `Util` suffix → `DateFormatterUtil`

## Variable and Method Naming

- Variables: `camelCase` → `userEmail`, `loginButton`
- Methods: `camelCase` with verb prefix → `clickLoginButton`, `getUserName`
- Constants: `UPPER_SNAKE_CASE` → `MAX_RETRIES`, `BASE_URL`
- Enums: `PascalCase` → `TestStatus`, `BrowserType`

## Locator Naming

- Format: `pageName_elementType_elementName`
- Examples: `login_button_submit`, `header_link_home`, `form_input_email`

## Test Tags

- Smoke: `@smoke`
- Sanity: `@sanity`
- Regression: `@regression`
- E2E: `@e2e`
- Priority: `@p0`, `@p1`, `@p2`, `@p3`

## Branch Naming

- Feature: `feature/TICKET-123-description`
- Bugfix: `bugfix/TICKET-456-description`
- Test: `test/TICKET-789-description`

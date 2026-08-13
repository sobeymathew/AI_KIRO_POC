# Onboarding Guide

## Welcome to the ITSM QA Platform

This guide helps you get started contributing to the Salesforce ITSM test automation framework.

## Prerequisites

1. **Node.js** >= 18.0.0 (LTS recommended)
2. **Kiro IDE** — AI-powered development environment
3. **Git** — Version control
4. **Docker** (optional) — For containerized execution
5. **Access** — Salesforce ITSM sandbox credentials

## Setup Steps

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-test-framework
npm install
npx playwright install
```

### 2. Configure Environment

Environment files are in `src/config/`:
- `.env.dev` — Development sandbox (default)
- `.env.staging` — Staging sandbox

Key variables:
```
BASE_URL=https://milestoneitsm--itsmcopy.sandbox.my.site.com/itsm/s/
APP_USERNAME=your-salesforce-username
APP_PASSWORD=your-salesforce-password
```

### 3. Verify Setup

```bash
# Run smoke tests to verify everything works
npm run test:smoke -- --project=chromium --headed
```

### 4. Explore the Structure

Use Kiro to explore the framework:
- Read `.kiro/steering/` for workflow standards
- Review existing page objects in `src/playwright/pages/`
- Check feature files in `src/test-case-management/features/`

## How to Add a New ITSM Module Test

### Step 1: Create Feature File
Write Gherkin scenarios in `src/test-case-management/features/istm/`

### Step 2: Discover Locators
Use the Playwright MCP healer to navigate the live page and verify locators:
- Login to the ITSM portal
- Navigate to the target page
- Inspect elements (piercing Shadow DOM)
- Verify interactions work (fill/click/select)

### Step 3: Create Page Object
Add page class to `src/playwright/pages/{module}.page.ts` extending `BasePage`:
- Use ONLY verified locators from Step 2
- Group: navigation → form fields → buttons → feedback
- Store locators in `src/playwright/object-repository/pages/`

### Step 4: Register in Fixtures
Update `src/playwright/fixtures/base.fixture.ts` to add the new page object.

### Step 5: Create Test Spec
Write Playwright test in `src/playwright/tests/{category}/{module}.spec.ts`:
- Import from `fixtures/base.fixture.ts` (never directly from `@playwright/test`)
- Use `test.setTimeout(120000)` for Salesforce pages
- Use `domcontentloaded` wait strategy
- Follow Arrange-Act-Assert pattern

### Step 6: Update Barrel Export
Add the new page to `src/playwright/pages/index.ts`

## Salesforce-Specific Guidelines

### Locator Priority (for this portal)
1. `[aria-label="..."]` — Form fields
2. `a[href="..."]` — Navigation links
3. `select[name="..."]` — Native dropdowns
4. `input[name="..."]` — Named inputs
5. `[data-value="..."]` — Combobox options
6. `button:has-text("...")` — Buttons
7. `getByText(/regex/)` — Dynamic text

### Common Patterns
- **No `networkidle`** — Salesforce keeps background requests running
- **No `data-testid`** — Salesforce doesn't use them
- **Shadow DOM** — Use Playwright's native piercing or `deepQuery`
- **Comboboxes** — Click trigger button, then select `[data-value]`

### Timeouts
- Test timeout: 120,000ms (Salesforce pages load slowly)
- Action timeout: 15,000ms
- Navigation timeout: 30,000ms

## Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:smoke` | Run smoke suite |
| `npm run test:regression` | Run regression suite |
| `npm run test:e2e` | Run E2E journeys |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Run with Playwright Inspector |
| `npm run report` | Open HTML report |
| `npm run report:allure` | Generate and open Allure report |
| `npm run traceability` | Generate RTM |
| `npm run lint` | Check code style |
| `npm run format` | Format code with Prettier |

## Key Conventions

- All page objects extend `BasePage`
- Tests import from `base.fixture.ts`, never `@playwright/test` directly
- Feature files include traceability headers (Jira, Zephyr refs)
- One class per file; filename matches the primary export
- Tests are tagged: `@smoke`, `@regression`, `@e2e` + priority `@p0`, `@p1`, `@p2`

# ITSM QA Platform

Enterprise-grade, AI-orchestrated test automation platform for IT Service Management (ITSM) applications. Built with Kiro, Playwright, and TypeScript, targeting Salesforce Experience Cloud ITSM portals.

## Target Application

**Salesforce ITSM Portal** — Milestone Technologies IT Service Management platform hosted on Salesforce Experience Cloud.

- **URL**: `https://milestoneitsm--itsmcopy.sandbox.my.site.com/itsm/s/`
- **Platform**: Salesforce Lightning Web Components (LWC) + Shadow DOM
- **Modules**: Incident Management, Service Catalog, Agentforce AI Assistant

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm
- Kiro IDE

### Installation

```bash
cd ai-test-framework
npm install
npx playwright install
```

### Run Tests

```bash
# Smoke tests (Chromium only, fast feedback ~2 min)
npm run test:smoke

# Regression tests (full validation ~10 min)
npm run test:regression

# E2E tests (business journeys ~5 min)
npm run test:e2e

# All tests
npm test

# Headed mode (visible browser for debugging)
npm run test:headed

# Debug mode (Playwright Inspector)
npm run test:debug
```

### View Reports

```bash
# Playwright HTML report
npm run report

# Allure report
npm run report:allure
```

## ITSM Modules Covered

| Module | Page Object | Test Spec | Feature File |
|--------|-------------|-----------|--------------|
| Login (Salesforce Auth) | `login.page.ts` | `user-login.spec.ts` | — |
| Incident Creation | `incident-create.page.ts` | `incident-creation.spec.ts` | `incident-creation.feature` |
| COI Request | `coi-request.page.ts` | `coi-request.spec.ts` | `coi-request.feature` |
| Expense Request | `expense-request.page.ts` | `expense-request.spec.ts` | `expense-request.feature` |
| Facilities Request | `facilities-request.page.ts` | `facilities-request.spec.ts` | `facilities-request.feature` |
| Travel Request | `travel-request.page.ts` | `travel-request.spec.ts` | `travel-request.feature` |
| Request Assessments | `request-assessments.page.ts` | `request-assessments.spec.ts` | `request-assessments.feature` |
| Agentforce AI Assistant | — | — | `agentforce-ai-assistant.feature` |

## Project Structure

```
ai-test-framework/
├── src/
│   ├── config/                         # Environment configs (.env.dev, .env.staging)
│   ├── playwright/                     # Automation layer
│   │   ├── pages/                      # Page Object classes (extend BasePage)
│   │   ├── fixtures/                   # Test fixtures (DI for page objects)
│   │   ├── hooks/                      # Global setup/teardown
│   │   ├── utils/                      # Utilities (logger, retry, API)
│   │   ├── assertions/                 # Custom ITSM assertion helpers
│   │   ├── object-repository/pages/    # Verified locator store (JSON)
│   │   └── tests/                      # Test specs by suite
│   │       ├── smoke/
│   │       ├── regression/
│   │       └── e2e/
│   ├── test-case-management/           # Test design & traceability
│   │   ├── features/                   # Gherkin .feature files
│   │   │   ├── istm/                   # ITSM module features
│   │   │   ├── smoke/                  # Smoke test features
│   │   │   ├── regression/             # Regression features
│   │   │   └── e2e/                    # E2E journey features
│   │   ├── step-definitions/           # Cucumber step definitions
│   │   ├── requirements/               # Requirement specs
│   │   ├── user-stories/               # User stories
│   │   └── traceability/               # RTM
│   ├── reporting/                      # Reports & analytics
│   └── test-data/                      # Test data management
├── docker/                             # Docker + Compose
├── docs/                               # Documentation
├── .github/workflows/                  # CI/CD pipelines
├── playwright.config.ts                # Playwright configuration
└── package.json                        # Dependencies
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     KIRO AI ORCHESTRATION                         │
│           Steering Documents │ Skills │ Hooks                     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Test Case      │  │  Locator         │  │   Playwright     │
│  Management     │  │  Discovery       │  │   Automation     │
│                 │  │                  │  │                  │
│ • Requirements  │  │ • MCP Healer     │  │ • Page Objects   │
│ • User Stories  │  │ • Shadow DOM     │  │ • Test Specs     │
│ • Gherkin       │  │ • Object Repo    │  │ • Fixtures       │
│ • Traceability  │  │ • Self-Healing   │  │ • Assertions     │
└────────┬────────┘  └──────────────────┘  └────────┬─────────┘
         │                                          │
         └────────────────┐    ┌───────────────────┘
                          ▼    ▼
                  ┌──────────────────┐
                  │   Reporting &    │
                  │   Analytics      │
                  │                  │
                  │ • Allure Reports │
                  │ • HTML Dashboard │
                  │ • Trend Data     │
                  └──────────────────┘
```

## Salesforce-Specific Patterns

This framework handles Salesforce-specific challenges:

- **Shadow DOM** — Uses `deepQuery` and Playwright's built-in piercing
- **Locator Priority** — `aria-label` > `a[href]` > `select[name]` > `input[name]` > `[data-value]` > `button:has-text`
- **Auto-waiting** — No hard-coded waits; uses `domcontentloaded` instead of `networkidle`
- **Timeouts** — Extended to 120s for Salesforce page loads
- **Comboboxes** — Custom handling via `[data-value]` for LWC components

## CI/CD

- **GitHub Actions** — Full pipeline with sharding (4 parallel workers)
- **Docker** — Containerized execution with Allure reporting
- **Nightly Regression** — Scheduled at 2 AM UTC

## Environment Configuration

Environment files in `src/config/`:
- `.env.dev` — Development sandbox
- `.env.staging` — Staging sandbox

Key variables: `BASE_URL`, `APP_USERNAME`, `APP_PASSWORD`

## Contributing

1. Follow steering documents in `.kiro/steering/`
2. All page objects extend `BasePage`
3. Import test fixtures from `base.fixture.ts`, never directly from `@playwright/test`
4. Use `domcontentloaded` wait strategy for Salesforce pages
5. Locators must be verified via Playwright MCP healer before use
6. Run `npm run lint` before committing

## License

Enterprise - Internal Use Only

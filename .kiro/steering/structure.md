# Project Structure

```
ai-test-framework/
├── .kiro/                              # Kiro AI orchestration (steering, skills, prompts)
├── src/
│   ├── config/                         # Environment configs (.env.dev, .env.staging)
│   ├── test-case-management/           # Test design & traceability
│   │   ├── requirements/               # Raw requirements
│   │   ├── user-stories/               # User stories (INVEST format)
│   │   ├── acceptance-criteria/        # Acceptance criteria
│   │   ├── features/                   # Gherkin .feature files
│   │   │   ├── smoke/
│   │   │   ├── sanity/
│   │   │   ├── regression/
│   │   │   ├── e2e/
│   │   │   └── istm/                   # ITSM-specific features
│   │   └── traceability/               # Requirement Traceability Matrix
│   ├── playwright/                     # Automation layer
│   │   ├── pages/                      # Page Object classes (extend BasePage)
│   │   ├── components/                 # Reusable UI components
│   │   ├── fixtures/                   # Test fixtures (DI for page objects)
│   │   ├── hooks/                      # Global setup/teardown
│   │   ├── utils/                      # Utilities (logger, retry, API)
│   │   ├── assertions/                 # Custom assertion helpers
│   │   ├── object-repository/          # Verified locator store (JSON)
│   │   │   └── pages/                  # Per-page locator repos
│   │   └── tests/                      # Test specs
│   │       ├── smoke/
│   │       ├── sanity/
│   │       ├── regression/
│   │       └── e2e/
│   ├── reporting/                      # Reporting & analytics
│   │   ├── allure/
│   │   ├── html/
│   │   ├── dashboards/
│   │   ├── analytics/
│   │   └── artifacts/ (screenshots, videos, traces, logs)
│   └── test-data/                      # Test data management
│       ├── static/                     # Fixed data
│       ├── dynamic/                    # Data factories
│       ├── mocks/                      # API mocks
│       └── environments/               # Env-specific data
├── docker/                             # Docker + Compose config
├── docs/                               # Documentation
├── .github/workflows/                  # CI pipelines
├── playwright.config.ts
└── package.json
```

## Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Page Object | `{name}.page.ts` | `login.page.ts` |
| Component | `{name}.component.ts` | `header-nav.component.ts` |
| Fixture | `{name}.fixture.ts` | `auth.fixture.ts` |
| Utility | `{name}.util.ts` | `logger.util.ts` |
| Test Spec | `{name}.spec.ts` | `incident-creation.spec.ts` |
| Feature File | `{name}.feature` | `incident-creation.feature` |
| Assertion | `{name}.assertion.ts` | `custom.assertion.ts` |
| Object Repo | `{page}-page.repo.json` | `incident-create-page.repo.json` |

## Architectural Rules

- All Page Objects extend `BasePage` (`src/playwright/pages/base.page.ts`)
- Tests import fixtures from `base.fixture.ts`, never directly from `@playwright/test`
- One class per file; file name matches the primary export
- **Locator discovery uses Playwright MCP healer** (not web scraping) — pierces Shadow DOM
- Locator priority: `aria-label` > `a[href]` > `select[name]` > `input[name]` > `data-value` > `button:has-text` > `getByText`
- Tests are organized into suite folders matching their tag (`smoke/`, `regression/`, etc.)
- Each feature file maps to a corresponding test spec file
- Barrel exports via `index.ts` in module directories
- Object repository lives inside `src/playwright/object-repository/` (co-located with automation code)

## Locator Discovery Flow

```
Feature File → Playwright MCP navigates live page →
  Inspects elements (pierces Shadow DOM) →
    Tests interactions (fill/click/select) →
      Stores verified locators in object-repository →
        Builds Page Object → Writes Test Spec
```

# AI-Driven End-to-End Test Automation Framework

An enterprise-grade, AI-orchestrated test automation framework built with Kiro, Playwright, and TypeScript. This framework automates the complete testing lifecycle from requirements analysis through execution, reporting, and defect management.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     KIRO AI ORCHESTRATION                         │
│           Steering Documents │ Skills │ Prompts                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Test Case      │  │  Web Scraping &  │  │   Playwright     │
│  Management     │  │  Object Repo     │  │   Automation     │
│                 │  │                  │  │                  │
│ • Requirements  │  │ • Site Crawling  │  │ • Page Objects   │
│ • User Stories  │  │ • DOM Analysis   │  │ • Test Specs     │
│ • Features      │  │ • Locator Gen    │  │ • Fixtures       │
│ • Traceability  │  │ • Object Repo    │  │ • Utilities      │
└────────┬────────┘  └──────────────────┘  └────────┬─────────┘
         │                                          │
         └────────────────┐    ┌───────────────────┘
                          ▼    ▼
                  ┌──────────────────┐
                  │   Reporting &    │
                  │   Analytics      │
                  │                  │
                  │ • Allure Reports │
                  │ • Dashboards     │
                  │ • Failure Anal.  │
                  │ • Trend Data     │
                  └──────────────────┘
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Kiro IDE

### Installation

```bash
cd ai-test-framework
npm install
npx playwright install
```

### Run Tests

```bash
# Smoke tests
npm run test:smoke

# Regression tests
npm run test:regression

# E2E tests
npm run test:e2e

# All tests
npm test

# Headed mode (see browser)
npm run test:headed
```

### View Reports

```bash
# Playwright HTML report
npm run report

# Allure report
npm run report:allure
```

## Folder Structure

```
ai-test-framework/
├── .kiro/                          # Kiro AI Orchestration Layer
│   ├── steering/                   # Framework standards & guidelines
│   ├── skills/                     # AI skill definitions (with role & responsibilities)
│   └── prompts/                    # Reusable prompt templates
├── src/
│   ├── test-case-management/       # Module 1: Test Design
│   │   ├── requirements/           # Requirement repository
│   │   ├── user-stories/           # User story repository
│   │   ├── acceptance-criteria/    # AC repository
│   │   ├── features/              # Gherkin feature files
│   │   │   ├── smoke/
│   │   │   ├── sanity/
│   │   │   ├── regression/
│   │   │   └── e2e/
│   │   └── traceability/          # RTM and mapping
│   ├── web-scraping/              # Module 2: Discovery
│   │   ├── crawlers/              # Site crawling scripts
│   │   ├── extractors/            # Locator extraction
│   │   ├── object-repository/     # Centralized locator store
│   │   │   ├── pages/
│   │   │   └── components/
│   │   ├── screenshots/           # Page captures
│   │   └── metadata/             # Page metadata
│   ├── playwright/                # Module 3: Automation
│   │   ├── pages/                 # Page Object classes
│   │   ├── components/            # Reusable components
│   │   ├── fixtures/              # Test fixtures
│   │   ├── hooks/                 # Global setup/teardown
│   │   ├── utils/                 # Utility libraries
│   │   ├── assertions/            # Custom assertions
│   │   └── tests/                 # Test specifications
│   │       ├── smoke/
│   │       ├── sanity/
│   │       ├── regression/
│   │       └── e2e/
│   ├── reporting/                 # Module 4: Reporting
│   │   ├── allure/               # Allure configuration
│   │   ├── html/                 # HTML report output
│   │   ├── dashboards/           # Dashboard generators
│   │   ├── analytics/            # Trend & analytics data
│   │   └── artifacts/            # Test artifacts
│   │       ├── screenshots/
│   │       ├── videos/
│   │       ├── traces/
│   │       └── logs/
│   ├── test-data/                # Module 5: Test Data
│   │   ├── static/              # Fixed test data
│   │   ├── dynamic/             # Data factories
│   │   ├── mocks/               # API mocks
│   │   └── environments/        # Environment configs
│   └── config/                   # Shared configuration
├── .github/workflows/            # CI/CD pipelines
├── docker/                       # Docker configuration
├── docs/                         # Documentation
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies
```

## Kiro AI Skills

The framework is orchestrated by specialized skills, each combining role responsibilities with process guidance:

| Skill | Responsibility |
|-------|---------------|
| Requirement Analysis | Parse and structure raw requirements |
| User Story Analysis | Decompose requirements into INVEST stories |
| Test Scenario Generation | Generate scenarios with test design techniques |
| Test Case Generation | Create detailed executable test cases |
| Gherkin Feature Generation | Write BDD feature files |
| Playwright Code Generation | Generate automation code from features |
| Page Object Generation | Build and maintain page objects |
| Locator Generation | Generate, validate, and heal locators |
| Test Data Generation | Manage all test data strategy |
| Web Scraping | Crawl and discover application pages |
| Reporting | Generate reports and dashboards |
| Failure Analysis | Analyze failures, track defects |

## End-to-End Workflow

```
1. Requirements → Requirement Analysis skill
2. User Stories → User Story Analysis skill
3. Test Scenarios → Test Scenario Generation skill
4. Feature Files → Gherkin Feature Generation skill
5. Application Crawl → Web Scraping skill
6. Object Repository → Locator Generation skill
7. Page Objects → Page Object Generation skill
8. Test Code → Playwright Code Generation skill
9. Test Data → Test Data Generation skill
10. Execution → Playwright Test Runner
11. Reports → Reporting skill
12. Failure Analysis → Failure Analysis skill
```

## Environment Setup

Copy the template and configure:

```bash
cp src/test-data/environments/.env.template src/config/.env.dev
# Edit with your values
```

## CI/CD

The framework supports:
- **GitHub Actions** - Full pipeline with sharding
- **Docker** - Containerized execution
- **Azure DevOps** - Adaptable YAML pipeline
- **Jenkins** - Pipeline-as-code compatible

## Key Design Decisions

- **TypeScript** for type safety and IDE support
- **Page Object Model** for maintainability
- **data-testid** as primary locator strategy
- **No hard-coded waits** - Playwright auto-waiting
- **Fixtures** for dependency injection
- **Centralized object repository** for locator management
- **Allure + HTML** for comprehensive reporting
- **Factory pattern** for dynamic test data

## Contributing

1. Follow the steering documents in `.kiro/steering/`
2. Use the naming conventions defined in the framework
3. All new pages must have an object repository entry
4. All tests must link to a requirement via traceability
5. Run `npm run lint` before committing

## License

Enterprise - Internal Use Only

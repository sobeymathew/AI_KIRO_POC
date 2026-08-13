# Architecture Documentation

## System Architecture

The ITSM QA Platform is built on four pillars optimized for Salesforce Experience Cloud testing:

### 1. Kiro AI Orchestration Layer

The intelligence layer. Kiro steering documents define standards, and workflows automate the full testing lifecycle from Jira ticket to passing tests.

**Structure:**
- `steering/` — Framework standards, workflows, and constraints
- `hooks/` — Event-driven automation (file saves, task completion)
- `skills/` — Reusable capability definitions

**Workflow:**
```
Jira Ticket → Kiro reads steering → Creates Zephyr test cases →
  Generates feature file → Discovers locators via MCP Healer →
    Builds page object → Writes test spec → Runs & heals → Reports
```

### 2. Test Case Management Module

Manages the complete test design lifecycle:
- Receives requirements from Jira (via MCP integration)
- Creates test cases in Zephyr Scale
- Generates Gherkin feature files with traceability
- Maintains bidirectional requirement traceability matrix (RTM)

**Key integrations:**
- Jira Cloud (project KD)
- Zephyr Scale (test case management)
- Feature files → Playwright test specs

### 3. Playwright Automation Module

Executes tests against Salesforce ITSM portal:
- **Page Object Model** with `BasePage` abstract class
- **Fixture-based DI** for page object injection
- **Auto-waiting** — no hard-coded waits
- **Shadow DOM piercing** for LWC components
- **Self-healing locators** via Playwright MCP healer

**Locator Discovery:**
```
Feature File → Playwright MCP navigates live page →
  Inspects elements (pierces Shadow DOM) →
    Tests interactions (fill/click/select) →
      Stores verified locators in object-repository →
        Builds Page Object → Writes Test Spec
```

### 4. Reporting & Analytics Module

Provides visibility into test health:
- Allure reports with full execution history
- HTML dashboards for stakeholder visibility
- Trend analysis across test runs
- Artifact management (screenshots, videos, traces on failure)

## Integration Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   Jira   │────▶│  Zephyr  │────▶│ Feature  │
│  (KD-X)  │     │  Scale   │     │  Files   │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
┌──────────┐     ┌──────────┐         │
│Salesforce│────▶│ MCP      │         │
│ITSM Portal    │ Healer   │         │
└──────────┘     └────┬─────┘         │
                      │               │
                      ▼               ▼
              ┌──────────────────────────┐
              │     Object Repository    │
              │    + Page Objects         │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │    Playwright Tests       │
              │  (Smoke/Regression/E2E)  │
              └────────────┬─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │  Allure  │ │  HTML    │ │  CI/CD   │
       │  Report  │ │  Report  │ │  Output  │
       └──────────┘ └──────────┘ └──────────┘
```

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Language | TypeScript (strict) | Type safety, IDE support, ecosystem |
| Test Runner | Playwright ^1.45 | Modern, fast, auto-wait, Shadow DOM |
| Reporting | Allure + Playwright HTML | Rich UI + integrated reports |
| Locator Discovery | Playwright MCP Healer | Live page inspection, Shadow DOM piercing |
| Logging | Winston | Structured, configurable logging |
| CI/CD | GitHub Actions | Native integration, matrix sharding |
| Container | Docker / Docker Compose | Reproducible environments |
| Linting | ESLint + Prettier | Code consistency |
| Test Design | Gherkin (BDD) | Business-readable scenarios |
| Test Management | Zephyr Scale (Cloud) | Enterprise test case management |
| Project Tracking | Jira Cloud | Requirement traceability |

## Salesforce-Specific Architecture Decisions

| Challenge | Solution |
|-----------|----------|
| Shadow DOM (LWC) | `deepQuery` function + Playwright's native piercing |
| Slow page loads | `domcontentloaded` strategy + 120s test timeout |
| Dynamic comboboxes | Click trigger → select `[data-value]` option |
| No `data-testid` | `aria-label` > `a[href]` > `select[name]` > `input[name]` priority |
| Network-heavy pages | Avoid `networkidle`, use element visibility waits |
| Session management | Salesforce-managed auth via username/password |

## Scalability

- **Horizontal**: GitHub Actions matrix sharding (4 workers)
- **Vertical**: Configurable worker count per environment
- **Modularity**: Each ITSM module is a self-contained page object + spec
- **Extensibility**: New modules follow the same pattern (page → fixture → spec)
- **Self-healing**: MCP healer detects and fixes broken locators

## ITSM Modules

| Module | Status | Jira | Verified |
|--------|--------|------|----------|
| Incident Creation | Active | KD-7 | 2026-08-10 |
| COI Request | Active | KD-8 | 2026-08-11 |
| Facilities Request | Active | KD-9 | 2026-08-11 |
| Expense Request | Active | — | 2026-08-11 |
| Travel Request | Active | — | 2026-08-11 |
| Request Assessments | Active | — | 2026-08-11 |
| Agentforce AI Assistant | Design | — | — |

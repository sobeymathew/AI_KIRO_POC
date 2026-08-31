# Framework Documentation
## AI-Driven Test Automation Framework for Web Applications

**Version:** 1.0
**Date:** August 2026

---

## 1. Overview

A general-purpose, AI-orchestrated test automation framework built with **Kiro**, **Playwright**, and **TypeScript**. It automates functional testing for **any web application** — from public websites and SPAs to complex enterprise platforms like Salesforce.

The framework handles the full testing lifecycle from requirement to reporting, with self-healing locators that adapt to any DOM structure (standard HTML, Shadow DOM, iframes, dynamic SPAs).

---

## 2. Supported Application Types

| Type | Support | Notes |
|------|---------|-------|
| Public websites | ✅ | Any HTML/CSS/JS site |
| SPAs (React, Angular, Vue) | ✅ | Handles dynamic rendering |
| Salesforce / Lightning | ✅ | Proven — Shadow DOM support |
| Customer portals | ✅ | Auth flows, dashboards |
| E-commerce | ✅ | Checkout, cart, search |
| Mobile web | ✅ | Responsive / device emulation |
| Multi-browser | ✅ | Chromium, Firefox, WebKit |

---

## 3. Technology Stack

| Layer | Technology |
|-------|-----------|
| AI Orchestration | Kiro IDE + Steering Documents |
| Test Runner | Playwright (`@playwright/test` ^1.45) |
| Locator Discovery | Playwright MCP (live page inspection) |
| Test Management | Zephyr Scale / Azure Test Plans (pluggable) |
| Project Tracking | Jira / Azure DevOps (pluggable) |
| Language | TypeScript (strict mode) |
| Reporting | Allure + Playwright HTML |
| Logging | Winston |
| CI/CD | GitHub Actions |
| Runtime | Node.js >= 18 |

---

## 4. Project Structure

```
ai-test-framework/
├── .kiro/
│   └── steering/                  # AI behavior guides
├── src/
│   ├── config/                    # Environment configs
│   ├── test-case-management/
│   │   ├── features/              # Gherkin feature files
│   │   └── user-stories/          # Structured user stories
│   ├── playwright/
│   │   ├── pages/                 # Page Objects (POM)
│   │   ├── components/            # Reusable UI components
│   │   ├── fixtures/              # Test dependency injection
│   │   ├── hooks/                 # Global setup/teardown
│   │   ├── utils/                 # Logger, retry, API helpers
│   │   ├── assertions/            # Custom assertions
│   │   ├── object-repository/     # Verified locators (JSON)
│   │   └── tests/
│   │       ├── smoke/
│   │       ├── regression/
│   │       ├── sanity/
│   │       └── e2e/
│   └── reporting/                 # Reports & artifacts
├── docs/                          # Documentation & deliverables
├── playwright.config.ts
└── package.json
```

---

## 5. Core Design — Page Object Model

The framework uses the industry-standard **Page Object Model (POM)**:

- Every page/view has a Page Object class extending `BasePage`
- Locators defined once in the constructor
- Action methods encapsulate interactions
- Tests use fixtures for dependency injection
- Shared UI (headers, nav) as reusable components

This structure works identically whether testing a simple website or a complex enterprise app.

---

## 6. Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Page Object | `{name}.page.ts` | `login.page.ts` |
| Test Spec | `{name}.spec.ts` | `checkout.spec.ts` |
| Feature File | `{name}.feature` | `checkout.feature` |
| Fixture | `{name}.fixture.ts` | `base.fixture.ts` |
| Object Repo | `{page}-page.repo.json` | `login-page.repo.json` |

---

## 7. Architectural Rules

- All Page Objects extend `BasePage`
- Tests import from `base.fixture.ts` (never directly from `@playwright/test`)
- One class per file; file name matches primary export
- Locator discovery via Playwright MCP (handles any DOM)
- Tests organized by suite tag (`smoke/`, `regression/`, `e2e/`)
- Each feature file maps to a test spec

---

## 8. Handling Complex DOM Structures

The framework's locator strategy adapts to any application:

| DOM Type | Strategy |
|----------|----------|
| Standard HTML | `getByRole`, `getByLabel`, `getByTestId` |
| Shadow DOM (Web Components) | Playwright native piercing + deep query |
| iframes | Frame locators |
| Dynamic SPAs | Auto-waiting + explicit visibility waits |
| Custom widgets | Attribute-based (`data-value`, `aria-label`) |
| Native dropdowns | `selectOption()` |

### Locator Priority (General)
1. `data-testid` — most stable
2. `getByRole` + accessible name
3. `getByLabel` — form fields
4. `getByPlaceholder`
5. Attribute selectors (`[name]`, `[data-value]`)
6. Text-based (`getByText`)
7. CSS/XPath — last resort

---

## 9. Setup Guide

### Prerequisites
- Node.js >= 18
- Kiro IDE

### Installation
```bash
cd ai-test-framework
npm install
npx playwright install
```

### Configuration
Edit `src/config/.env.dev`:
```
BASE_URL=https://your-application-url
APP_USERNAME=your-username
APP_PASSWORD=your-password
```

> **Tip:** Use application-specific env var names (e.g., `APP_USERNAME`) to avoid conflicts with system environment variables.

---

## 10. Running Tests

```bash
# By suite
npm run test:smoke
npm run test:regression
npm run test:e2e

# Specific spec
npx playwright test src/playwright/tests/smoke/login.spec.ts --project=chromium

# Headed mode (debugging)
npx playwright test --project=chromium --grep @smoke --headed

# View report
npx playwright show-report
```

---

## 11. Coding Standards

- TypeScript strict mode; avoid `any`
- Async/await over `.then()` chaining
- JSDoc on all public Page Object methods
- Playwright auto-waiting assertions
- One logical assertion per behavior

---

## 12. Extending to a New Application

To automate any new web application:
1. Update `BASE_URL` in the env config
2. Provide the requirement (Jira ticket, document, or chat)
3. Kiro follows the appropriate workflow (see `4-workflow-walkthrough.md`)
4. New Page Object + test spec are created automatically
5. Register in `fixtures/base.fixture.ts` and `pages/index.ts`

The framework requires no structural change to target a different application — only the URL and credentials.

---

## 13. General Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Wrong credentials filled | System env var conflict | Use app-specific var names |
| `networkidle` timeout | App has persistent background requests | Use `domcontentloaded` |
| Locator not found | Element in Shadow DOM / iframe | Use deep query / frame locator |
| Widget option not clickable | Custom widget, no text | Use attribute selector |
| Missing browsers | Not installed | `npx playwright install` |
| Dynamic field not found | Appears after another action | Add `waitFor` before interaction |

---

## 14. Security Considerations

- Kiro runs **locally** — code never leaves your machine
- Credentials in `.env` files (gitignored)
- Use **test/sandbox** environments, not production
- Use **synthetic test data**, never real customer PII
- Rotate access tokens regularly

---

## Appendix: Case Study Reference

For a real-world example of the framework in action against a challenging application (Salesforce Experience Cloud), see `1-case-study-pov.md`.

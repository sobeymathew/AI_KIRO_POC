# Folder Ownership and Responsibilities

## Module Ownership

| Folder | Skill Owner | Responsibility |
|--------|-------------|---------------|
| `.kiro/` | Framework Architect | AI orchestration, standards |
| `src/test-case-management/` | Requirement Analysis / Test Scenario Generation | Requirements, stories, features |
| `src/web-scraping/` | Web Scraping / Locator Generation | Crawling, locators, object repo |
| `src/playwright/` | Playwright Code Generation / Page Object Generation | Automation code, page objects |
| `src/reporting/` | Reporting / Failure Analysis | Reports, dashboards, analytics |
| `src/test-data/` | Test Data Generation | Data management, fixtures |
| `src/config/` | Framework Architect | Environment, shared config |
| `.github/` | DevOps | CI/CD pipelines |
| `docker/` | DevOps | Containerization |
| `docs/` | All | Documentation |

## Modification Rules

- Only the owning skill/team should modify files in their directory
- Cross-module changes require review from both owners
- Shared types in `src/config/types/` require architect approval
- Configuration changes affect all modules - require full review

## File Creation Rules

- New pages → `src/playwright/pages/`
- New components → `src/playwright/components/`
- New test files → `src/playwright/tests/{category}/`
- New features → `src/test-case-management/features/{category}/`
- New locator repos → `src/web-scraping/object-repository/pages/`
- New test data → `src/test-data/{type}/`
- New reports → `src/reporting/{type}/`

## Dependencies Between Modules

```
Test Case Management → produces → Feature Files
Web Scraping → produces → Object Repository
Object Repository → consumed by → Playwright Pages
Feature Files → drives → Playwright Tests
Playwright Tests → produce → Execution Results
Execution Results → consumed by → Reporting
Reporting → produces → Dashboards & Analytics
```

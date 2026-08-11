# Architecture Documentation

## System Architecture

The AI-Driven Test Automation Framework is built on four pillars:

### 1. Kiro AI Orchestration Layer

The brain of the framework. Kiro steering documents define standards, and skills provide both role context and detailed process guidance for each capability.

**Structure:**
- `steering/` — Always-active standards and constraints
- `skills/` — Capability definitions with role, process, rules, and templates
- `prompts/` — Reusable prompt templates for common tasks

**Data Flow:**
```
User Input → Kiro reads steering + relevant skills → Executes process → Artifact Generation
```

### 2. Test Case Management Module

Manages the complete test design lifecycle:
- Receives requirements (manual or from Jira/Confluence)
- Decomposes into user stories
- Generates test scenarios using test design techniques
- Creates Gherkin feature files
- Maintains bidirectional traceability

### 3. Web Scraping & Object Repository Module

Provides application intelligence:
- Crawls target applications to discover pages
- Extracts interactive elements from DOM
- Generates scored locator strategies
- Maintains centralized object repository
- Supports locator healing when elements change

### 4. Playwright Automation Module

Executes tests with modern best practices:
- Page Object Model for maintainability
- Fixture-based dependency injection
- Auto-waiting assertions (no hard-coded waits)
- Parallel execution with sharding
- Multi-browser and mobile testing

### 5. Reporting & Analytics Module

Provides visibility into test health:
- Real-time execution dashboards
- Historical trend analysis
- Failure root cause analysis
- Flaky test detection and quarantine
- Artifact management (screenshots, videos, traces)

## Integration Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   Jira   │────▶│  RTM     │────▶│ Feature  │
│  Tickets │     │ Generator│     │  Files   │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
┌──────────┐     ┌──────────┐         │
│  App     │────▶│ Crawler  │         │
│  (AUT)   │     │ /Scraper │         │
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
              │  (Smoke/Sanity/Reg/E2E)  │
              └────────────┬─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │  Allure  │ │  HTML    │ │  CI/CD   │
       │  Report  │ │  Dash    │ │  Output  │
       └──────────┘ └──────────┘ └──────────┘
```

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | TypeScript | Type safety, IDE support, ecosystem |
| Test Runner | Playwright | Modern, fast, multi-browser, auto-wait |
| Reporting | Allure + Custom | Rich UI + customizable dashboards |
| Scraping | Playwright + Cheerio | Reuse browser engine, static parse |
| CI/CD | GitHub Actions | Native integration, matrix support |
| Container | Docker | Reproducible environments |

## Scalability Considerations

- **Horizontal**: Shard tests across CI workers
- **Vertical**: Increase worker count per machine
- **Data**: JSON files scale, migrate to DB if needed
- **Reports**: Historical data pruned after 90 days
- **Crawling**: Rate-limited, incremental updates supported

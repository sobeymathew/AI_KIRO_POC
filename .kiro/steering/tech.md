# Technology & Build

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (strict mode) |
| Test Runner | Playwright (`@playwright/test` ^1.45) |
| Reporting | Allure (`allure-playwright`) + Playwright HTML reporter |
| Locator Discovery | Playwright MCP Healer (live page inspection) |
| Logging | Winston |
| Validation | Ajv (JSON Schema) |
| CI/CD | GitHub Actions |
| Containerization | Docker / Docker Compose |
| Linting | ESLint + Prettier |
| Runtime | Node.js >= 18 |

## Common Commands

```bash
# Install dependencies
npm install
npx playwright install

# Run tests by suite
npm test                   # All tests
npm run test:smoke         # @smoke tagged
npm run test:sanity        # @sanity tagged
npm run test:regression    # @regression tagged
npm run test:e2e           # @e2e tagged

# Debug / headed
npm run test:headed        # Browser visible
npm run test:debug         # Playwright Inspector

# Reports
npm run report             # Open Playwright HTML report
npm run report:allure      # Generate and open Allure report

# Utilities
npm run generate:report    # Generate custom dashboard
npm run traceability       # Generate RTM

# Code quality
npm run lint               # ESLint
npm run format             # Prettier
```

## Environment Configuration

- Config files live in `src/config/` as `.env.{ENV}` (e.g. `.env.dev`, `.env.staging`)
- The active environment is selected via the `ENV` variable (defaults to `dev`)
- Playwright config reads from `src/config/.env.${ENV}`

## Key Playwright Config

- `testDir`: `./src/playwright/tests`
- `testIdAttribute`: `data-testid`
- Parallel execution enabled (`fullyParallel: true`)
- CI retries: 2, CI workers: 4
- Traces, screenshots, and video captured on failure
- Projects: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

# Execution Guide

## Local Execution

### Basic Execution

```bash
# All tests (default: headless chromium)
npm test

# Specific test category
npm run test:smoke
npm run test:sanity
npm run test:regression
npm run test:e2e
```

### Browser Options

```bash
# Run with visible browser
npm run test:headed

# Debug with Playwright Inspector
npm run test:debug

# Specific browser
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=mobile-chrome
```

### Filtering Tests

```bash
# By file
npx playwright test src/playwright/tests/smoke/user-login.spec.ts

# By test name
npx playwright test -g "should login successfully"

# By tag
npx playwright test --grep @p0
npx playwright test --grep @smoke

# Exclude tag
npx playwright test --grep-invert @flaky
```

### Parallel Execution

```bash
# Control worker count
npx playwright test --workers=4

# Fully parallel
npx playwright test --fullyParallel

# Sequential (debugging)
npx playwright test --workers=1
```

### Sharding (for CI)

```bash
# Run 1st quarter of tests
npx playwright test --shard=1/4

# Run 2nd quarter
npx playwright test --shard=2/4
```

## Environment Targeting

```bash
# Development
ENV=dev npm test

# Staging
ENV=staging npm test

# Production (careful!)
ENV=production npm run test:smoke
```

## Docker Execution

```bash
# Build and run
cd docker
docker compose up --build

# Run specific suite
docker compose run test-runner npm run test:regression
```

## CI/CD Execution

### GitHub Actions
- Push to `main`/`develop` → Smoke tests
- Nightly schedule → Full regression
- Manual dispatch → Choose suite and environment

### Trigger Manual Run
Go to Actions → Test Automation Pipeline → Run workflow → Select options

## Reporting

```bash
# Open HTML report (after execution)
npm run report

# Generate Allure report
npm run report:allure

# Generate dashboard
npm run generate:report
```

## Troubleshooting

### Tests fail with "browser not found"
```bash
npx playwright install --with-deps
```

### Tests timeout on CI
- Check BASE_URL is accessible from CI
- Increase `navigationTimeout` in playwright.config.ts
- Verify network connectivity

### Flaky tests
- Check for race conditions
- Verify test data isolation
- Review timing-dependent assertions
- Use `test.describe.configure({ mode: 'serial' })` if order matters

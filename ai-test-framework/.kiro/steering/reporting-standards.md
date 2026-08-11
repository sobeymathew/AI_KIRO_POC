# Reporting Standards

## Report Types

### Execution Report
- Generated after every test run
- Contains pass/fail/skip counts
- Includes execution duration
- Links to failure artifacts

### Historical Trend Report
- Generated weekly
- Shows pass rate over time
- Identifies flaky tests
- Highlights stability trends

### Coverage Report
- Maps tests to requirements
- Shows untested requirements
- Identifies coverage gaps
- Links to traceability matrix

## Artifact Management

### Screenshots
- Captured automatically on failure
- Stored in `src/reporting/artifacts/screenshots/`
- Named: `{testName}_{timestamp}.png`
- Linked in failure reports

### Videos
- Recorded on failure (configurable for all)
- Stored in `src/reporting/artifacts/videos/`
- Named: `{testName}_{timestamp}.webm`
- Maximum retention: 30 days

### Traces
- Captured on failure
- Stored in `src/reporting/artifacts/traces/`
- Viewable via Playwright Trace Viewer
- Contains network, console, DOM snapshots

### Logs
- Structured JSON logging
- Stored in `src/reporting/artifacts/logs/`
- Levels: ERROR, WARN, INFO, DEBUG
- Rotated daily, retained 14 days

## Dashboard Metrics

- **Pass Rate**: (passed / total) * 100
- **Failure Rate**: (failed / total) * 100
- **Flakiness Index**: (intermittent failures / total runs) * 100
- **Execution Duration**: Total wall-clock time
- **Coverage Percentage**: (automated / total requirements) * 100

## Integration Requirements

- Allure: Full integration via allure-playwright
- HTML: Custom dashboard with charts
- CI/CD: JUnit XML for pipeline integration
- Notifications: Slack/Teams webhook on failure

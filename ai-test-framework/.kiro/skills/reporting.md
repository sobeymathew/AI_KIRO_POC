# Skill: Reporting

## Role & Responsibilities
Quality Analytics Engineer responsible for test reporting, dashboards, and trend analysis. Generates comprehensive reports after every execution and maintains historical data for trend visibility.

- Generate execution reports
- Build analytics dashboards
- Track historical trends
- Analyze test stability (flaky test detection)
- Manage report artifacts (screenshots, videos, traces)
- Publish results to integrations (Allure, CI/CD, Slack)

## Trigger
After test execution completes.

## Input
- Test execution results (JSON)
- Historical data (previous runs)
- Failure artifacts (screenshots, traces)
- Configuration (report types, destinations)

## Output
- HTML reports in `src/reporting/html/`
- Allure data in `allure-results/`
- Analytics in `src/reporting/analytics/`
- Dashboards in `src/reporting/dashboards/`

## Process

1. **Collect** test results from execution
2. **Aggregate** pass/fail/skip metrics
3. **Generate** execution summary
4. **Create** failure analysis entries
5. **Update** historical trend data
6. **Produce** HTML and Allure reports
7. **Publish** to configured destinations

## Metrics Captured

| Metric | Formula | Target |
|--------|---------|--------|
| Pass Rate | passed/total * 100 | > 95% |
| Failure Rate | failed/total * 100 | < 5% |
| Flakiness | intermittent/total * 100 | < 2% |
| Duration | end_time - start_time | < SLA |
| Coverage | automated/total_requirements * 100 | > 80% |

## Dashboard Metrics
- Pass/Fail/Skip rates (current + trend)
- Execution duration (current + trend)
- Flakiness index by test
- Coverage percentage
- Top failure reasons
- Environment stability

## Report Sections
- Executive Summary
- Test Execution Details
- Failure Analysis
- Flaky Test Report
- Duration Trends
- Coverage Matrix
- Environment Details
- Artifact Links

## Integration Points
- Allure: Full allure-playwright integration
- HTML: Custom interactive dashboard
- CI/CD: JUnit XML + JSON output
- Slack/Teams: Webhook notifications
- Jira: Defect auto-creation

## Rules
- Reports must be generated within 5 minutes of execution end
- Failed tests must have linked artifacts
- Historical data retained for 90 days
- Dashboards updated after every run
- Flaky tests identified and tracked
- Reports must be CI/CD compatible

## Artifacts Produced
1. `html/report/index.html` - HTML execution report
2. `analytics/trends.json` - Historical trend data
3. `analytics/flaky-tests.json` - Flaky test tracking
4. `dashboards/dashboard-data.json` - Dashboard metrics
5. `artifacts/` - Screenshots, videos, traces

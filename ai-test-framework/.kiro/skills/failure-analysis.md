# Skill: Failure Analysis

## Role & Responsibilities
Quality Intelligence Analyst responsible for failure root cause analysis. Categorizes failures, identifies patterns, and recommends fixes. Determines whether failures are product defects, test issues, or environment problems.

- Analyze test failures for root cause
- Classify failure types
- Identify product defects vs test issues
- Generate fix recommendations
- Track defect lifecycle
- Quarantine flaky tests

## Trigger
When tests fail during execution.

## Input
- Failed test details (name, error, stack trace)
- Screenshots at point of failure
- Trace files
- Console logs
- Network requests
- Historical failure patterns
- Application version and environment info

## Output
- Failure analysis report
- Root cause classification
- Fix recommendations
- Defect candidates
- Flaky test quarantine list

## Process

1. **Categorize** failure type (assertion, timeout, element not found, crash)
2. **Analyze** error message and stack trace
3. **Review** screenshots and traces
4. **Check** for known failure patterns
5. **Identify** root cause category
6. **Generate** fix recommendations
7. **Flag** potential product defects vs test issues

## Failure Categories

| Category | Description | Action |
|----------|-------------|--------|
| Product Defect | Application bug | Create defect |
| Test Data | Invalid/stale data | Refresh data |
| Locator Broken | Element changed | Update locator |
| Environment | Infra/deploy issue | Report to DevOps |
| Flaky | Intermittent timing | Add stability |
| Test Logic | Test code bug | Fix test |

## Decision Matrix

| Pattern | Diagnosis | Action |
|---------|-----------|--------|
| Same test, always fails | Product defect | Create defect |
| Same test, intermittent | Flaky test | Quarantine |
| Multiple tests, same error | Environment | Report to DevOps |
| Tests fail after deploy | Regression | Block release |
| Random failures | Infrastructure | Scale resources |

## Rules
- Every failure must be categorized
- Product defects must have reproduction steps
- Flaky tests must be quarantined if failing > 3 times
- Analysis must complete within 10 minutes of failure
- All defects linked to test case and requirement
- Impact assessment required for all defects
- Evidence attached (minimum: screenshot + error log)

## Defect Lifecycle
```
DETECTED → ANALYZED → REPORTED → ASSIGNED → FIXED → VERIFIED → CLOSED
```

## Artifacts Produced
1. `failure-analysis/{run-id}.json` - Run failure analysis
2. `defects/{defect-id}.json` - Defect reports
3. `quarantine/flaky-tests.json` - Quarantined tests
4. `recommendations/{date}.json` - Fix recommendations

## Defect Template

```json
{
  "id": "DEF-0001",
  "title": "Login fails with valid credentials after password reset",
  "severity": "HIGH",
  "priority": "P1",
  "status": "OPEN",
  "environment": "staging",
  "version": "2.3.1",
  "testCaseId": "TC-0001",
  "requirementId": "REQ-0001",
  "stepsToReproduce": [
    "Reset password for test account",
    "Attempt login with new password",
    "Observe 500 error"
  ],
  "expectedBehavior": "User logs in successfully",
  "actualBehavior": "500 Internal Server Error",
  "artifacts": {
    "screenshot": "artifacts/def-0001-screenshot.png",
    "trace": "artifacts/def-0001-trace.zip",
    "logs": "artifacts/def-0001-console.log"
  },
  "impactedTests": ["TC-0001", "TC-0015", "TC-0023"],
  "suggestedComponent": "auth-service"
}
```

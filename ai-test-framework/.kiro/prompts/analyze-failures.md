# Prompt: Analyze Test Failures

## Usage
Use this prompt after a test execution to analyze failures.

## Template

```
Analyze the following test execution failures:

Results File: src/reporting/artifacts/logs/test-results.json
Run ID: {{RUN_ID}}
Environment: {{ENVIRONMENT}}
Application Version: {{VERSION}}

Tasks:
1. Categorize each failure (product defect, test issue, environment, flaky)
2. Identify root cause for each failure
3. Check for known failure patterns
4. Generate fix recommendations
5. Create defect entries for product bugs
6. Update flaky test quarantine list
7. Generate failure analysis report

For each failure, provide:
- Error category
- Root cause
- Impact assessment
- Recommended action
- Evidence links

Follow standards from:
- .kiro/steering/error-handling.md
- .kiro/steering/reporting-standards.md

Output to:
- src/reporting/analytics/failure-analysis-{{RUN_ID}}.json
- src/test-case-management/defects/ (if product bugs found)
```

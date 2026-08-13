# Test Execution & Reporting Workflow

## When to Use

When asked to run a test suite and report results. This flow executes tests, collects results, and posts a structured summary.

## Trigger Phrases

- "Run all smoke tests"
- "Execute regression suite"
- "Run the incident tests"
- "Execute all tests and report"
- "Run tests for KD-7"
- "Run smoke and post results on Jira"

---

## End-to-End Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  1. DETERMINE SCOPE                                          │
│     → Which suite/tests to run (smoke, regression, e2e, all) │
├─────────────────────────────────────────────────────────────┤
│  2. EXECUTE TESTS                                            │
│     → Run Playwright with appropriate flags                  │
├─────────────────────────────────────────────────────────────┤
│  3. COLLECT RESULTS                                          │
│     → Parse output: passed, failed, skipped, duration        │
├─────────────────────────────────────────────────────────────┤
│  4. GENERATE REPORT SUMMARY                                  │
│     → Structured markdown with pass/fail details             │
├─────────────────────────────────────────────────────────────┤
│  5. POST RESULTS                                             │
│     → Jira comment and/or display in chat                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Detail

### Step 1: Determine Scope

Based on the user's request, identify:

| Request | Command | Scope |
|---------|---------|-------|
| "Run smoke tests" | `--grep @smoke` | All @smoke tagged tests |
| "Run regression" | `--grep @regression` | All @regression tagged tests |
| "Run e2e tests" | `--grep @e2e` | All @e2e tagged tests |
| "Run all tests" | (no grep) | Full suite |
| "Run incident tests" | `--grep incident` | Tests matching "incident" |
| "Run COI tests" | specific spec file | `tests/smoke/coi-request.spec.ts` |
| "Run tests for KD-7" | specific spec file(s) | Files linked to KD-7 |

### Step 2: Execute Tests

Run using Playwright CLI with these standard flags:

```bash
# Smoke suite (Chromium only, fast feedback)
npx playwright test --project=chromium --grep @smoke

# Regression suite
npx playwright test --project=chromium --grep @regression

# E2E suite
npx playwright test --project=chromium --grep @e2e

# All tests
npx playwright test --project=chromium

# Specific spec file
npx playwright test src/playwright/tests/smoke/incident-creation.spec.ts --project=chromium
```

**Standard flags:**
- `--project=chromium` — Run on Chromium only (fastest, most reliable for Salesforce)
- `--retries=0` — No retries for first run (see actual failures)
- `--reporter=list` — Console output for parsing

**For CI/full validation:**
- `--retries=2` — Retry flaky tests
- Remove `--project` to run all browsers

### Step 3: Collect Results

Parse the Playwright output to extract:

```
Total tests: X
Passed: X ✅
Failed: X ❌
Skipped: X ⏭️
Duration: Xs
```

For each failure, capture:
- Test name
- Error message (first line)
- File location

### Step 4: Generate Report Summary

Format as structured markdown:

```markdown
## Test Execution Report

### Summary
| Metric | Value |
|--------|-------|
| Suite | Smoke |
| Total | 3 |
| Passed | 2 ✅ |
| Failed | 1 ❌ |
| Duration | 45.2s |
| Browser | Chromium |
| Date | 2026-08-11 |

### Results
| # | Test | Status | Duration |
|---|------|--------|----------|
| 1 | Incident creation @smoke @p0 | ✅ PASS | 31.6s |
| 2 | COI request @smoke @p0 | ✅ PASS | 34.8s |
| 3 | Expense request @smoke @p0 | ❌ FAIL | 22.1s |

### Failures
#### ❌ Expense request @smoke @p0
- **Error:** TimeoutError: waiting for locator
- **File:** tests/smoke/expense-request.spec.ts:47
- **Action:** Healer investigation needed
```

### Step 5: Post Results

**Option A: Post to Jira** (if a ticket is specified)
- Add comment on the Jira ticket with the execution report
- Follow `jira-comments.md` format

**Option B: Display in chat** (default)
- Show the summary table in chat
- Highlight failures with error details
- Suggest next actions (heal, re-run, investigate)

**Option C: Both**
- If user says "run and post on KD-7", do both

---

## Run Commands Reference

```bash
# Smoke (quick feedback, ~2 min)
npx playwright test --project=chromium --grep @smoke

# Regression (full validation, ~10 min)
npx playwright test --project=chromium --grep @regression

# E2E (business journeys, ~5 min)
npx playwright test --project=chromium --grep @e2e

# Single spec
npx playwright test src/playwright/tests/smoke/incident-creation.spec.ts --project=chromium

# All tests, all browsers
npx playwright test

# Headed mode (debugging)
npx playwright test --project=chromium --grep @smoke --headed

# Generate HTML report after run
npx playwright show-report
```

---

## After Execution

Based on results:

| Outcome | Action |
|---------|--------|
| All passed ✅ | Post success summary. Done. |
| Some failed ❌ | Identify failure type → If locator issue, apply healer. If logic issue, report to user. |
| All failed ❌ | Likely environment/login issue. Check credentials and connectivity first. |

---

## Example Interactions

**User:** "Run all smoke tests"
**Kiro:**
1. Runs `npx playwright test --project=chromium --grep @smoke`
2. Collects results
3. Posts summary table in chat

**User:** "Run smoke and post results on KD-7"
**Kiro:**
1. Runs smoke tests
2. Collects results
3. Posts summary in chat
4. Adds Jira comment on KD-7 with execution report

**User:** "Execute regression suite"
**Kiro:**
1. Runs `npx playwright test --project=chromium --grep @regression`
2. Collects results
3. If failures → shows error details + offers to heal

---

## Integration with Other Flows

- **If tests fail due to locators** → Suggest healer (`playwright-healer.md`)
- **If user wants to automate more** → Point to `automation-workflow.md` or `userstory-to-automation.md`
- **If user wants Zephyr update** → Can update test execution status in Zephyr after run

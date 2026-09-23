# Implementation Overview — Jira & Azure DevOps Automation
## AI-Driven Test Automation Framework

**Version:** 1.0
**Date:** September 2026
**Status:** Current implementation

---

## 1. Purpose

This document describes the **current, working implementation** of the AI-orchestrated test automation framework, covering **both** requirements-management integrations:

- **Jira + Zephyr Scale** — the original integration
- **Azure DevOps (Boards + Test Cases)** — the newer integration

It is a companion to the framework documentation (`5-framework-documentation.md`) and the workflow walkthrough (`4-workflow-walkthrough.md`), focused on what is actually built and running today, including a live worked example (Azure DevOps Work Item 14 — Expense Request).

---

## 2. Two Integrations, One Framework

The automation engine (Kiro + Playwright + TypeScript + Page Object Model) is identical for both tracking systems. Only the **requirements source** and **test-case store** differ.

| Concern | Jira Path | Azure DevOps Path |
|---------|-----------|-------------------|
| Requirement source | Jira issue (e.g., `KD-7`) | ADO work item (e.g., `#14`) |
| Test case store | Zephyr Scale | ADO Test Case work items (Child links) |
| Test-case linkage | Zephyr `issue_links` | `System.LinkTypes.Hierarchy-Forward` (Child) |
| Progress updates | Jira comment | Work item comment |
| Failure evidence | Comment / attachment | Work item attachment (screenshot) |
| Traceability | Jira + Zephyr | Native ADO work item links |

Everything downstream — feature files, locator discovery, Page Objects, test specs, execution, reporting — is shared.

---

## 3. MCP Servers in Use

Configured in `.kiro/settings/mcp.json`:

| MCP Server | Purpose | State |
|------------|---------|-------|
| `azure-devops` (`@azure-devops/mcp`) | Work items, test cases, links, comments | Enabled |
| `playwright` (`@executeautomation/playwright-mcp-server`) | Live locator discovery & healing | Enabled |
| `atlassian` (`mcp.atlassian.com`) | Jira issues & comments | Available (toggle) |
| `zephyr` (`zephyr-scale-mcp-server`) | Zephyr Scale test cases | Available (toggle) |

> Credentials/tokens live in the MCP config and `.env` files (gitignored). Use sandbox environments and synthetic data only.

---

## 4. Connection Details

### Azure DevOps
- **Organization:** `Westpoint-MTI-Lab` (`https://dev.azure.com/Westpoint-MTI-Lab`)
- **Project:** `Westpoint-KiroAI Integration POC`
- **Test cases:** created as `Test Case` work items, linked as **Child** of the parent story
- **Auth:** PAT via `AZURE_DEVOPS_EXT_PAT`

### Jira / Zephyr
- **Cloud ID:** `74bddaaa-afcf-407f-a20f-e93afc663c84`
- **Site:** `milestone-team-a63qhc1b.atlassian.net`
- **Project Key:** `KD` (Kiro-Dev)
- **Zephyr:** EU API, folders by module, test cases `STEP_BY_STEP` linked via `issue_links`

---

## 5. End-to-End Pipelines

### 5.1 Jira + Zephyr Pipeline (`automation-workflow.md`)

```
1. Read Jira ticket          → getJiraIssue
2. Create Zephyr test cases  → STEP_BY_STEP, linked to ticket
3. Generate feature file     → Gherkin with tags + traceability header
4. Discover & verify locators→ Playwright MCP healer (live page)
5. Build Page Object         → extends BasePage
6. Write test spec           → imports from base.fixture.ts
7. Run & heal                → execute, fix, re-run
8. Post Jira comment         → structured results
```

**Trigger:** `"Automate KD-7"`

### 5.2 Azure DevOps Pipeline (`azure-devops-workflow.md`)

```
1. Read work item            → wit_work_item (get)
2. Create ALL manual test    → Test Case work items (Child), created sequentially
   cases (happy/validation/
   negative/e2e)
3. Generate feature file     → Gherkin with tags + traceability header
4. Discover & verify locators→ Playwright MCP healer (live page)
5. Build Page Object         → extends BasePage
6. Write test spec           → imports from base.fixture.ts
7. Run & heal (2-attempt rule)→ execute, fix, re-run
8. Update work item          → comment (PASS/FAIL) + screenshot attachment
```

**Trigger:** `"Automate work item 14"`

### Key differences enforced today
- **Sequential test-case creation** in ADO — parallel creation causes parent-link revision conflicts.
- **2-attempt retry rule** in ADO — on repeated failure, the *actual* on-screen result is reported and classified (test defect / application error / environment).
- **Failure screenshots** are uploaded and linked to the ADO work item as attachments.

---

## 6. Worked Example — ADO Work Item 14 (Expense Request)

A complete run of the Azure DevOps pipeline.

### 6.1 Requirement
**Work Item 14 — "Create Expense Request"** (User Story, Sprint 1, Priority 2)
As an employee, submit an Expense Request via the Service Catalog so the Expense Team can process it. Requested By is auto-populated and read-only; Requested For and Category are mandatory; file uploads limited to 4 MB with a defined format list; a unique request number is generated on success.

### 6.2 Test Cases Created (Children of #14)

| ID | Title | Priority | Category |
|----|-------|:--------:|----------|
| #16 | E2E: Create and submit Expense Request successfully with all mandatory fields | 1 | Happy / E2E |
| #17 | Verify mandatory field validation (Requested For & Category empty) | 2 | Validation |
| #18 | Verify Requested By is auto-populated and read-only | 2 | Field behavior |
| #19 | Verify file upload rejects unsupported format or file > 4 MB | 3 | Negative / boundary |

### 6.3 Form Behavior Discovered (live, via Playwright MCP)

The Expense Request form is **cascading/progressive** — later fields appear only after earlier selections:

| Field | Type | Mandatory | Notes |
|-------|------|:---------:|-------|
| Requested By | text (read-only) | — | Auto-populated with logged-in user |
| Requested For | lookup (read-only) | Yes | Auto-populated with logged-in user |
| Category | dropdown | Yes | None / Corporate Card / Workday expense / Expense Policy |
| Subcategory | dropdown | Yes | Revealed after Category |
| Additional comments | text | — | Revealed after Subcategory |
| Business Justification | text | Yes | Revealed after Subcategory |
| Upload Files | file | No | Max 4 MB; png, pdf, jpg, jpeg, doc, docx, xls, xlsx, pst, ost, txt, csv, eml, msg |

### 6.4 Artifacts Produced

| Artifact | Path |
|----------|------|
| Feature file | `src/test-case-management/features/istm/expense-request.feature` |
| Page Object | `src/playwright/pages/expense-request.page.ts` |
| Test spec | `src/playwright/tests/smoke/expense-request.spec.ts` |
| Object repository | `src/playwright/object-repository/pages/expense-request-page.repo.json` |
| Fixture registration | `src/playwright/fixtures/base.fixture.ts` |
| Barrel export | `src/playwright/pages/index.ts` |

### 6.5 Execution Result

- **Attempt 1:** FAILED (~47.5s) — application returned "Something went wrong. We couldn't complete your request due to a system issue."
- **Attempt 2:** FAILED (~50.1s) — same system error.
- **Classification:** **Application error** — not a test or locator defect. The automation navigated, verified the read-only Requested By, filled all cascading mandatory fields, and submitted correctly; the backend failed.
- **Reported back:** a structured FAILED comment was posted on Work Item 14, and the failure screenshot (`test-failed-1.png`) was uploaded and linked as a work item attachment.

This example demonstrates the framework's value even on a failing flow: it discovered undocumented cascading behavior, produced reusable assets, and returned precise, classified evidence to the tracker.

---

## 7. Traceability

### Azure DevOps
```
User Story (#14)
  └─ Child → Test Case work items (#16, #17, #18, #19)
       └─ referenced in → Feature file header (work item + TC IDs)
            └─ Page Object + Test Spec (traceability comment header)
                 └─ Execution result → work item comment + screenshot attachment
```

### Jira + Zephyr
```
Jira ticket (KD-X)
  └─ Zephyr test cases (issue_links)
       └─ referenced in → Feature file header (Jira + Zephyr refs)
            └─ Page Object + Test Spec
                 └─ Execution result → Jira comment
```

Every feature file carries a traceability header; every test spec carries a comment header linking back to its source.

---

## 8. Reusable Salesforce Locator Patterns (verified)

The healer has proven these on the ITSM Experience Cloud app; they are reused across request forms:

| Element | Locator strategy |
|---------|------------------|
| Navigation menu | `button:has-text("Service Request")` |
| Catalog link | `a[href="/itsm/s/service-catalog"]` |
| Native dropdown | `select[name="..."]` + `selectOption()` |
| Named input | `input[name="..."]` |
| Lookup field | `input[aria-label="..."]` |
| Combobox option | `[data-value="..."]` |
| Submit | `button:has-text("Submit")` |
| Success / ID | `getByText('Service Request Created Successfully')`, `getByText(/RQ-\d+/)` |
| System error | `getByText('Something went wrong')` |

---

## 9. Running & Reporting

```bash
# Smoke suite (fast feedback)
npx playwright test --project=chromium --grep @smoke

# Single spec (headed for debugging)
npx playwright test src/playwright/tests/smoke/expense-request.spec.ts --project=chromium --headed

# Reports
npx playwright show-report
npm run report:allure
```

On failure, Playwright captures a screenshot, video, and trace under
`src/reporting/artifacts/traces/...`. For ADO, the screenshot is attached to the work item; for Jira, results are posted as a comment.

---

## 10. Current Coverage Snapshot

| Feature / Form | Source | Spec | Status |
|----------------|--------|------|--------|
| User Login | — | `tests/smoke/user-login.spec.ts` | Automated |
| COI Request | Jira KD-8 | `tests/smoke/coi-request.spec.ts` | Automated |
| Request Assessments | Jira | `tests/smoke/request-assessments.spec.ts` | Automated |
| Security Exception Request | Jira KD-10 | `tests/smoke/security-exception-request.spec.ts` | Automated |
| Expense Request | ADO #14 | `tests/smoke/expense-request.spec.ts` | Automated (blocked by app error) |

---

## 11. Steering Documents (behavior guides)

| Doc | Covers |
|-----|--------|
| `product.md` | Product context & principles |
| `tech.md` | Stack, commands, config |
| `structure.md` | Folder layout, naming, architecture |
| `automation-workflow.md` | Jira master flow |
| `azure-devops-workflow.md` | Azure DevOps master flow |
| `azure-devops-setup.md` | ADO MCP connection setup |
| `jira-comments.md` | Jira connection & comment format |
| `zephyr-testcases.md` | Zephyr test case rules |
| `feature-file-generation.md` | Gherkin format & tagging |
| `playwright-healer.md` | Locator discovery & self-healing |
| `userstory-to-automation.md` | Chat/document → automation |
| `story-to-jira-automation.md` | Story → Jira → Zephyr → automation |
| `test-execution-reporting.md` | Run suites & report |

---

## 12. Summary

- One AI-orchestrated framework serves **both** Jira/Zephyr and Azure DevOps with no engine changes.
- The Azure DevOps path is fully implemented: read work item → create linked test cases → feature file → live locator discovery → Page Object → spec → 2-attempt run → work-item comment + screenshot attachment.
- The Expense Request (Work Item 14) run is a concrete, end-to-end demonstration — including honest failure classification and evidence attachment.
- All assets are traceable end-to-end and reusable across the ITSM application's request forms.

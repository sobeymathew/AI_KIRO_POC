# Azure DevOps Automation Workflow — Master Flow

## Purpose

This document defines the end-to-end automation workflow when using **Azure DevOps** (instead of Jira) for requirements management and **manual test cases created via the "Add Test" option** on each work item (instead of Zephyr Scale).

It covers the full lifecycle: requirements → manual test cases → feature files → automation → execution → traceability.

## When to Use

When asked to automate an Azure DevOps work item.

## Trigger Keywords

Use any of these phrases to run the **full end-to-end pipeline** (Steps 1–8):

- **`Automate work item <ID>`** — primary keyword (e.g., "Automate work item 8")
- `Automate ADO work item <ID>`
- `Automate the <name> user story` (e.g., "Automate the Login Page user story")
- `Run Azure DevOps automation for work item <ID>`

**Partial-flow keywords** (run a single step on demand):
- `Create test cases for work item <ID>` → Step 2 only (create ALL manual test cases)
- `Generate feature file for work item <ID>` → Step 3 only
- `Discover locators for <page>` → Step 4 only (Playwright healer)
- `Run and report work item <ID>` → Steps 7–8 (execute + update work item)

When a trigger keyword is used, execute the full pipeline unless a partial-flow keyword is specified.

## Connection Details

- **Organization:** `Westpoint-MTI-Lab`
- **Organization URL:** `https://dev.azure.com/Westpoint-MTI-Lab`
- **Project:** `Westpoint-KiroAI Integration POC`
- **MCP Server:** `azure-devops` (configured in `.kiro/settings/mcp.json`)

---

## End-to-End Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  1. READ AZURE DEVOPS WORK ITEM                              │
│     → get_work_item (summary, description, acceptance)       │
├─────────────────────────────────────────────────────────────┤
│  2. CREATE ALL MANUAL TEST CASES (Add link → New item)       │
│     → Full set (happy/validation/negative/e2e) as Children   │
├─────────────────────────────────────────────────────────────┤
│  3. GENERATE FEATURE FILE                                    │
│     → feature-file-generation.md (Gherkin, tags, save)       │
├─────────────────────────────────────────────────────────────┤
│  4. DISCOVER & VERIFY LOCATORS                               │
│     → playwright-healer.md (navigate, inspect, verify)       │
├─────────────────────────────────────────────────────────────┤
│  5. BUILD PAGE OBJECT                                        │
│     → structure.md (naming, BasePage, fixtures)              │
├─────────────────────────────────────────────────────────────┤
│  6. WRITE TEST SPEC                                          │
│     → tech.md (Playwright patterns, test structure)          │
├─────────────────────────────────────────────────────────────┤
│  7. RUN & HEAL                                               │
│     → playwright-healer.md (fix failures, re-run)            │
├─────────────────────────────────────────────────────────────┤
│  8. UPDATE WORK ITEM & TRACEABILITY                          │
│     → Comment on work item + update test case outcomes       │
└─────────────────────────────────────────────────────────────┘
```

---

## Roles & Responsibilities

| Role | Responsibility |
|------|---------------|
| **Business Analyst / Product Owner** | Authors the work item (User Story / Issue) with clear acceptance criteria in Azure DevOps |
| **QA Engineer** | Reviews the work item, creates manual test cases via "Add Test", defines steps and expected results |
| **Automation Engineer (Kiro-assisted)** | Generates feature files, discovers locators, builds Page Objects, writes and runs automation |
| **Kiro (AI)** | Orchestrates the workflow — reads work items, drafts test cases, generates code, runs tests, updates traceability |
| **Reviewer / Lead** | Validates test coverage, reviews automation, approves before merge |

---

## Step-by-Step Detail

### Step 1: Read Azure DevOps Work Item

- Use `get_work_item` with the work item ID (e.g., 2)
- Extract: title, description, acceptance criteria, priority, state, iteration
- Identify test scenarios by category (smoke / regression / e2e)
- Confirm the target application URL for automation

**Requirements Management Best Practices:**
- Every work item should follow the "As a / I want / So that" format
- Acceptance criteria should be written as Given/When/Then scenarios
- Business rules and Definition of Done should be explicit
- Priority and story points should be set

### Step 2: Create Manual Test Cases (via "Add link → New item")

In Azure DevOps, manual test cases are created **directly from the work item** using the **Related Work → Add link → New item** option, creating a **Test Case** work item linked as a **Child**.

**Process (UI):**
1. Open the parent work item (User Story / Issue)
2. In the right-hand panel, find the **Related Work** section
3. Click **Add link** → select **New item**
4. In the "Add link" dialog:
   - **Link type:** `Child`
   - **Work Item Type:** `Test Case`
   - **Title:** descriptive (e.g., "Verify successful login with valid credentials")
   - **Comment:** optional
5. Click **Add link** — this creates a new Test Case linked to the parent as a Child
6. Open the created Test Case and fill in the **Steps** grid (action + expected result per row)
7. Set **Priority** (1 = critical, 2 = important, 3 = nice-to-have) and save

**Via MCP (Kiro-assisted):**
- Use `create_work_item` with `workItemType: "Test Case"`, setting `title`, `priority`, `parentId`, and steps in the `Microsoft.VSTS.TCM.Steps` field (HTML/XML format)
- Set `areaPath` and `iterationPath` to inherit from the parent
- **Create test cases ONE AT A TIME (sequentially), never in parallel** — parallel creation causes revision conflicts on the parent link and fails

**⚠️ CRITICAL — Create ALL possible test cases (not just one):**
Do NOT stop after the happy-path test case. From the work item's acceptance criteria, business rules, and the live form, derive and create the **complete set** of test cases. At minimum cover:

| Category | Priority | Example |
|----------|----------|---------|
| Happy path | 1–2 | Successful submission with all mandatory fields |
| Mandatory field validation | 2 | Submit with empty required fields → validation errors |
| Field behavior | 2 | Read-only / auto-populated fields (e.g., Requested By) |
| Dependent fields | 2 | Selecting one field reveals/updates dependent fields |
| Negative / boundary | 3 | Unsupported or oversized file upload, invalid input |
| E2E journey | 1 | Full flow: navigate → fill → submit → verify record |

**Test Case Creation Best Practices:**
- One test case per scenario — create the FULL set, not a single case
- Steps must be atomic and have clear expected results
- Start titles with "Verify..." for validation, "E2E:" for journeys
- Link every test case as a **Child** of the parent work item for traceability

**Handling MCP `create_work_item` failures:**
- If create returns a generic "Failed to create work item":
  1. Confirm reads work (`get_work_item`) — if yes, the session is alive
  2. Retry the create **sequentially** (one at a time), not in parallel
  3. If it still fails, the create endpoint may have dropped — **reconnect the `azure-devops` MCP server** (MCP panel → Reconnect), then retry
  4. Fallback: create test cases manually via the UI (Related Work → Add link → New item → Child → Test Case) using the derived titles and step tables

### Step 3: Generate Feature File

- Follow `feature-file-generation.md` for Gherkin format, tags, and rules
- Write scenarios matching the manual test cases
- Include traceability header referencing the Azure DevOps work item and test case IDs
- Save to `src/test-case-management/features/{category}/`

```gherkin
# Azure DevOps Work Item: 2
# Test Cases: TC-101, TC-102, TC-103
# Requirement: Login Page

@smoke @authentication
Feature: User Login
  ...
```

### Step 4: Discover & Verify Locators

- Use **Playwright MCP healer** (`playwright-healer.md`) to navigate the live application
- Login → Navigate to target page → Inspect elements
- Use `deepQuery` for Shadow DOM, `get_visible_text` for page content
- Actually interact with each element (fill/click/select) to confirm
- Store verified locators in `src/playwright/object-repository/pages/`

### Step 5: Build Page Object

- Create `src/playwright/pages/{name}.page.ts` extending `BasePage`
- Use ONLY verified locators from Step 4
- Group: navigation locators → form fields → buttons → feedback
- Add action methods with JSDoc
- Register in `fixtures/base.fixture.ts` and `pages/index.ts`

### Step 6: Write Test Spec

- Create `src/playwright/tests/{category}/{name}.spec.ts`
- Import from `fixtures/base.fixture.ts` (never directly from `@playwright/test`)
- Follow Arrange-Act-Assert pattern
- Use `test.setTimeout(120000)` for Salesforce (slow loading)
- Use `domcontentloaded` instead of `networkidle`
- Include traceability comment header linking to work item + test case IDs

### Step 7: Run & Heal (with 2-attempt retry rule)

- Run: `npx playwright test {spec} --project=chromium --retries=0 --headed`
- If a **locator** fails → apply the healer process (inspect live page, try alternatives, fix) and re-run
- **Retry rule:** Attempt the run up to **2 times**.
  - If it passes on attempt 1 or 2 → proceed to Step 8 with a PASS result
  - If it still fails after 2 attempts → proceed to Step 8 and post the **actual result** (failure details) as a comment on the work item
- **Distinguish failure types before commenting:**
  - **Locator/test defect** → fix via healer, don't count as a real failure
  - **Application/system error** (e.g., "Something went wrong", server issue) → this is a genuine product failure; capture the actual on-screen message and report it
  - **Environment issue** (login/credentials) → note it separately

### Step 8: Update Work Item & Traceability (always, pass OR fail)

Always post a comment on the work item after execution — **whether the test passed or failed after 2 attempts.**

Use `add_work_item_comment` (or `wit_work_item_comment_write`) with:
  - Test execution status (PASS / FAIL)
  - **Actual result** — for a failure, include the exact error/message observed on screen (e.g., "Application returned: 'Something went wrong — system issue'")
  - Attempts made (e.g., "Failed after 2 attempts")
  - Manual test case IDs created
  - Feature file path and automation test spec path
  - Root-cause classification (test defect / application error / environment)
  - Next steps

Also:
- Update the linked Test Case outcome (Passed/Failed) to reflect the automated run
- Optionally move the work item state (e.g., To Do → In Progress → Done)

**Comment format for a failure:**
```markdown
## ❌ Automated Test Result — FAILED (after 2 attempts)

**Test:** {spec path}
**Scenario:** {scenario name}

### Actual Result
{Exact message/behavior observed — e.g., "Application returned: Something went wrong. We couldn't complete your request due to a system issue."}

### Attempts
- Attempt 1: {result}
- Attempt 2: {result}

### Classification
{Application error | Test defect | Environment issue}

### Artifacts
- Feature file: {path}
- Test spec: {path}
- Screenshot/trace: {path}

### Next Steps
{recommendation}
```

**Comment format for a pass:**
```markdown
## ✅ Automated Test Result — PASSED

**Test:** {spec path}
**Result:** {e.g., RQ-000002872 created successfully}
**Attempts:** 1
```

---

## Test Execution in Azure DevOps

Manual and automated test results can be tracked in Azure DevOps:

| Approach | How |
|----------|-----|
| **Manual execution** | Run test cases via the Test tab; mark each step Pass/Fail |
| **Automated execution** | Playwright runs the spec; results updated on the linked test case |
| **Test Plans (optional)** | Group test cases into a Test Plan/Suite for a release or sprint |

**Execution Best Practices:**
- Run smoke tests on every build; regression nightly/on-demand
- Record actual results against expected for each step
- Attach screenshots/traces for failures
- Keep automated and manual outcomes in sync on the work item

---

## Traceability

Full traceability chain in Azure DevOps:

```
Work Item (User Story / Issue)
   │  ← Child link
   ▼
Test Case work items (created via "Add link → New item")
   │  ← referenced in
   ▼
Feature File (Gherkin, with work item + TC IDs in header)
   │
   ▼
Page Object + Test Spec (comment header links back)
   │
   ▼
Execution Results (updated on the Test Case + work item comment)
```

**Traceability Best Practices:**
- Every test case is linked as a **Child** of the parent work item
- Every feature file header lists the work item ID and test case IDs
- Every automation spec includes a traceability comment header
- Execution results are posted back to the work item for a closed loop

---

## Quick Reference — MCP Tools (Azure DevOps)

| Action | Tool |
|--------|------|
| Read work item | `get_work_item` |
| List work items | `list_work_items` / `search_work_items` |
| Create test case | `create_work_item` (type: "Test Case") |
| Update work item | `update_work_item` |
| Link test case ↔ work item | `manage_work_item_link` (Child: `System.LinkTypes.Hierarchy-Forward`) |
| Add comment | `add_work_item_comment` |
| List projects | `list_projects` |

---

## Differences from the Jira Workflow

| Aspect | Jira Workflow (`automation-workflow.md`) | This Azure DevOps Workflow |
|--------|------------------------------------------|----------------------------|
| Requirements source | Jira ticket | Azure DevOps work item |
| Test case management | Zephyr Scale | Manual test cases via "Add link → New item" on work item |
| Test case linkage | Zephyr `issue_links` | Child work item relationship |
| Progress updates | Jira comment | Work item comment + test case outcomes |
| Traceability | Jira + Zephyr | Native Azure DevOps work item links |

---

## Steering Doc Reference

| Doc | Covers |
|-----|--------|
| `product.md` | Product context and principles |
| `tech.md` | Stack, commands, config |
| `structure.md` | Folder layout, naming, architectural rules |
| `azure-devops-setup.md` | Azure DevOps MCP connection setup |
| `feature-file-generation.md` | Gherkin feature file format |
| `playwright-healer.md` | Locator discovery & healing |
| `azure-devops-workflow.md` | This doc — Azure DevOps master flow |

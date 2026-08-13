# Story to Jira + Zephyr + Automation Workflow

## When to Use

When a user provides a story/requirement in chat (or document) and wants the **full pipeline**: create the Jira ticket, generate Zephyr test cases, and automate with Playwright.

## Trigger Phrases

- "Create this story in Jira and automate it: ..."
- "Write this user story to Jira, create test cases, and automate"
- "Push this to Jira and Zephyr, then automate"

---

## End-to-End Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  1. PARSE INPUT                                              │
│     → Extract requirement from chat text or document         │
├─────────────────────────────────────────────────────────────┤
│  2. CREATE JIRA TICKET                                       │
│     → Write user story as a Jira issue in KD project         │
├─────────────────────────────────────────────────────────────┤
│  3. CREATE ZEPHYR TEST CASES                                 │
│     → Generate test cases linked to the Jira ticket          │
├─────────────────────────────────────────────────────────────┤
│  4. GENERATE FEATURE FILE                                    │
│     → Create Gherkin scenarios from the user story           │
├─────────────────────────────────────────────────────────────┤
│  5. DISCOVER & VERIFY LOCATORS                               │
│     → Use Playwright MCP healer on live page                 │
├─────────────────────────────────────────────────────────────┤
│  6. BUILD PAGE OBJECT                                        │
│     → Create/update PO with verified locators                │
├─────────────────────────────────────────────────────────────┤
│  7. WRITE TEST SPEC                                          │
│     → Playwright test following the feature file             │
├─────────────────────────────────────────────────────────────┤
│  8. RUN & HEAL                                               │
│     → Execute, fix failures, iterate until green             │
├─────────────────────────────────────────────────────────────┤
│  9. POST JIRA COMMENT                                        │
│     → Update the Jira ticket with automation results         │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Detail

### Step 1: Parse Input

Accept input from chat text or document. Extract:
- Title / summary
- User story (As a / I want / So that)
- Acceptance criteria
- Fields, validations, business rules
- Module / navigation path

### Step 2: Create Jira Ticket

Use `createJiraIssue` to create the ticket:

```
cloudId: 74bddaaa-afcf-407f-a20f-e93afc663c84
projectKey: KD
issueTypeName: Story (or Task/Incident depending on context)
summary: [Title from parsed input]
description: [Full user story + acceptance criteria in markdown]
```

**Description format:**
```markdown
### Summary
[One-liner description]

### Context
As a [role], I want to [action] so that [benefit].

### Acceptance Criteria
* [criterion 1]
* [criterion 2]
* ...

### Fields
* Field 1 (type, mandatory/optional)
* Field 2 (type, mandatory/optional)

### Business Rules
* [rule 1]
* [rule 2]
```

After creation, capture the returned **issue key** (e.g., KD-9) for linking.

### Step 3: Create Zephyr Test Cases

Follow `zephyr-testcases.md` steering:
- Create folder if needed
- Create STEP_BY_STEP test cases
- Link all to the newly created Jira ticket
- Post comment on Jira with test case keys

### Step 4: Generate Feature File

Follow `feature-file-generation.md` steering:
- Write Gherkin with proper tags
- Include traceability header linking to the Jira ticket and Zephyr test cases
- Save to `src/test-case-management/features/istm/`

### Step 5: Discover & Verify Locators

Follow `playwright-healer.md` steering:
- Login via Playwright MCP
- Navigate to target page
- Inspect and interact with elements
- Verify locators work

### Step 6: Build Page Object

- Create `src/playwright/pages/{name}.page.ts` extending BasePage
- Use ONLY verified locators
- Register in fixtures and barrel export

### Step 7: Write Test Spec

- Create `src/playwright/tests/{category}/{name}.spec.ts`
- Import from `base.fixture.ts`
- `test.setTimeout(120000)` for Salesforce
- Use `domcontentloaded` instead of `networkidle`

### Step 8: Run & Heal

```bash
npx playwright test {spec} --project=chromium --retries=0
```

If locator fails → healer process → fix → re-run.

### Step 9: Post Jira Comment

Post structured comment on the created Jira ticket with:
- Test execution result (pass/fail)
- Automation artifacts created
- Zephyr test case keys
- Run command

---

## Jira Ticket Creation Details

**Connection:**
- Cloud ID: `74bddaaa-afcf-407f-a20f-e93afc663c84`
- Project Key: `KD`
- Site: `milestone-team-a63qhc1b.atlassian.net`

**Issue types to use:**
- `Story` — For user stories / feature requests
- `Task` — For generic work items
- `Incident` — For ITSM-related tickets

**Fields to set:**
- `summary` — Short title
- `description` — Full user story in markdown
- `contentFormat` — "markdown"
- `issueTypeName` — "Story" (default)

---

## Example Interaction

**User says:**
> "Create this in Jira and automate: As an employee, I want to submit a Travel Request from the Service Catalog so that the Travel Team can book my trip."

**Kiro does:**
1. Parses → Travel Request, Service Catalog, Travel Team
2. Creates Jira ticket KD-9 with full description
3. Creates Zephyr test cases (KD-T34, KD-T35) linked to KD-9
4. Generates `features/istm/travel-request.feature`
5. Healer discovers locators on live page
6. Builds `pages/travel-request.page.ts`
7. Writes `tests/smoke/travel-request.spec.ts`
8. Runs → passes ✅
9. Posts comment on KD-9 with results

---

## Differences from Other Flows

| Aspect | This Flow | `automation-workflow.md` | `userstory-to-automation.md` |
|--------|-----------|--------------------------|------------------------------|
| Input | Chat text / document | Existing Jira ticket | Chat text / document |
| Creates Jira ticket | ✅ Yes (new) | ❌ No (reads existing) | ❌ No |
| Creates Zephyr TCs | ✅ Yes | ✅ Yes | ❌ Optional |
| Posts Jira comment | ✅ Yes | ✅ Yes | ❌ No |
| Automates | ✅ Yes | ✅ Yes | ✅ Yes |

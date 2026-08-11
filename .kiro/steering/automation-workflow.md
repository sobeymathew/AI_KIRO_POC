# Automation Workflow — Master Flow

## End-to-End Pipeline

When asked to automate a Jira ticket, follow these steps in order:

```
┌─────────────────────────────────────────────────────────────┐
│  1. READ JIRA TICKET                                         │
│     → jira-comments.md (connection, read, analyze)           │
├─────────────────────────────────────────────────────────────┤
│  2. CREATE ZEPHYR TEST CASES                                 │
│     → zephyr-testcases.md (folder, test cases, link)         │
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
│  8. POST JIRA COMMENT                                        │
│     → jira-comments.md (structured update on ticket)         │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Detail

### Step 1: Read Jira Ticket
- Use `getJiraIssue` with cloud ID `74bddaaa-afcf-407f-a20f-e93afc663c84`
- Extract: summary, acceptance criteria, test steps, priority
- Identify test scenarios by category (smoke/regression/e2e)

### Step 2: Create Zephyr Test Cases
- Create folder if needed (by module/feature)
- Create `STEP_BY_STEP` test cases with objectives and preconditions
- Link all to source Jira ticket
- Post comment on Jira with test case keys

### Step 3: Generate Feature File
- Write Gherkin with proper tags (`@smoke @p0`, `@regression @p1`, etc.)
- Include traceability header (Jira, Requirement, Zephyr refs)
- Save to `src/test-case-management/features/{category}/`

### Step 4: Discover & Verify Locators
- Use **Playwright MCP healer** to navigate the live application
- Login → Navigate to target page → Inspect elements
- Use `deepQuery` for Shadow DOM, `get_visible_text` for page content
- **Actually interact** with each element (fill/click/select) to confirm
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
- Include traceability comment header

### Step 7: Run & Heal
- Run: `npx playwright test {spec} --project=chromium --retries=0 --headed`
- If locator fails → Apply healer process (inspect live page, try alternatives, fix)
- Iterate until test passes

### Step 8: Post Jira Comment
- Post structured comment with:
  - Feature file path
  - Test case keys
  - Test execution status
  - Next steps

## Quick Commands

```bash
# Run specific test (headed for debugging)
npx playwright test src/playwright/tests/smoke/incident-creation.spec.ts --project=chromium --headed

# Run smoke suite
npm run test:smoke

# Run with specific project only
npx playwright test --project=chromium --grep @smoke

# Debug mode
npx playwright test --debug
```

## Steering Doc Reference

| Doc | Covers |
|-----|--------|
| `product.md` | What the app is, target system, key principles |
| `tech.md` | Stack, commands, env config, Playwright settings |
| `structure.md` | Folder layout, naming conventions, architectural rules |
| `jira-comments.md` | Jira connection, reading tickets, posting comments |
| `zephyr-testcases.md` | Creating test cases in Zephyr Scale |
| `feature-file-generation.md` | Gherkin feature file format and rules |
| `playwright-healer.md` | Locator discovery, healing, Salesforce patterns |
| `automation-workflow.md` | This doc — master flow tying everything together |

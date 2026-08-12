# User Story to Automation Workflow

## When to Use

When a user story or requirement is provided **directly in chat** or via a **Word document / attachment** — NOT from a Jira ticket. This is a standalone flow separate from the Jira-based `automation-workflow.md`.

## Trigger Phrases

- "Here's the user story: ..."
- "Automate this requirement: ..."
- User pastes text describing a feature/flow
- User attaches a Word/PDF document with requirements

---

## End-to-End Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  1. PARSE INPUT                                              │
│     → Extract requirement from chat text or document         │
├─────────────────────────────────────────────────────────────┤
│  2. STRUCTURE AS USER STORY                                  │
│     → Convert to proper user story format (As a/I want/So)   │
├─────────────────────────────────────────────────────────────┤
│  3. GENERATE FEATURE FILE                                    │
│     → Create Gherkin scenarios from user story               │
├─────────────────────────────────────────────────────────────┤
│  4. DISCOVER & VERIFY LOCATORS                               │
│     → Use Playwright MCP healer on live page                 │
├─────────────────────────────────────────────────────────────┤
│  5. BUILD PAGE OBJECT                                        │
│     → Create/update PO with verified locators                │
├─────────────────────────────────────────────────────────────┤
│  6. WRITE TEST SPEC                                          │
│     → Playwright test following the feature file             │
├─────────────────────────────────────────────────────────────┤
│  7. RUN & HEAL                                               │
│     → Execute, fix failures, iterate until green             │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Detail

### Step 1: Parse Input

Accept input from:
- **Chat text** — User pastes requirement description directly
- **Word document (.docx)** — Extract text content from the attached document
- **PDF** — Extract text content from the attached PDF
- **Image** — Read requirement text from screenshot/image

Extract:
- What the user wants to do (action)
- Who is performing it (role)
- What the expected outcome is (result)
- Any specific fields, validations, or constraints mentioned

### Step 2: Structure as User Story

Convert the raw input into a structured user story:

```markdown
## User Story: [Title]

**As a** [role]
**I want to** [action]
**So that** [benefit]

### Acceptance Criteria
1. [criterion 1]
2. [criterion 2]
3. ...

### Test Scenarios
| # | Scenario | Category | Priority |
|---|----------|----------|----------|
| 1 | Happy path | Smoke | P0 |
| 2 | Validation | Regression | P1 |
| 3 | Full journey | E2E | P0 |
```

Save the user story to: `src/test-case-management/user-stories/{name}.md`

**Rules:**
- Extract ALL acceptance criteria from the input
- If criteria are vague, infer reasonable ones and confirm with user
- Identify mandatory fields, navigation paths, expected messages
- Classify scenarios by category (smoke/regression/e2e)

### Step 3: Generate Feature File

Convert the structured user story into a Gherkin feature file.

Follow `feature-file-generation.md` steering for format, tags, and rules.

Save to: `src/test-case-management/features/istm/{feature-name}.feature`

Include traceability header:
```gherkin
# Source: Direct user story (chat/document)
# User Story: src/test-case-management/user-stories/{name}.md
```

### Step 4: Discover & Verify Locators

Follow `playwright-healer.md` steering:
1. Login via Playwright MCP
2. Navigate to the target page
3. Inspect all form elements (deepQuery for Shadow DOM)
4. Actually interact with each element to confirm locators work
5. Store verified locators

### Step 5: Build Page Object

Create `src/playwright/pages/{name}.page.ts`:
- Extend `BasePage`
- Use ONLY verified locators from Step 4
- Group: navigation → form fields → buttons → feedback
- Add action methods
- Register in fixtures and barrel export

### Step 6: Write Test Spec

Create `src/playwright/tests/{category}/{name}.spec.ts`:
- Import from `base.fixture.ts`
- `test.setTimeout(120000)` for Salesforce
- Use `domcontentloaded` instead of `networkidle`
- Follow Arrange-Act-Assert pattern
- Include traceability comment header

### Step 7: Run & Heal

```bash
npx playwright test {spec} --project=chromium --retries=0 --headed
```

If locator fails → Apply healer (navigate live page, try alternatives, fix, re-run).

---

## User Story Output Format

When structuring the user story, save it as markdown:

**File:** `src/test-case-management/user-stories/{kebab-case-name}.md`

```markdown
# User Story: [Title]

## Story
**As a** [role]
**I want to** [action]
**So that** [benefit]

## Source
- Type: Chat / Document / Image
- Date: YYYY-MM-DD

## Acceptance Criteria
1. User is logged in
2. User can navigate to [module]
3. User can fill [fields]
4. User can submit
5. [Expected outcome]

## Test Scenarios
| # | Scenario | Category | Priority |
|---|----------|----------|----------|
| 1 | ... | Smoke | P0 |

## Fields Identified
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| ... | ... | ... | ... |
```

---

## Differences from Jira Workflow

| Aspect | This Flow | Jira Flow (`automation-workflow.md`) |
|--------|-----------|-------------------------------------|
| Input source | Chat text / document | Jira ticket (KD-X) |
| Step 1 | Parse raw text | Read Jira ticket |
| Zephyr | Optional (can skip) | Always creates test cases |
| Jira comment | Not applicable | Always posts comment |
| User story storage | `user-stories/{name}.md` | Jira ticket is the source |
| Traceability | Links to user story file | Links to Jira + Zephyr |

---

## Example Usage

**User says:**
> "As a user, I want to submit a VPN access request from the service catalog. I need to select the VPN type, provide justification, and submit."

**Kiro does:**
1. Parses → identifies: Service Catalog, VPN request, fields: VPN type + justification
2. Structures user story → saves to `user-stories/vpn-access-request.md`
3. Generates feature file → `features/istm/vpn-access-request.feature`
4. Healer navigates live page → discovers form locators
5. Builds Page Object → `pages/vpn-access-request.page.ts`
6. Writes test spec → `tests/smoke/vpn-access-request.spec.ts`
7. Runs → heals → passes ✅

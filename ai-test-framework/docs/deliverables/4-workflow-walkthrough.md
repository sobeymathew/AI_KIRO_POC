# Workflow Walkthrough
## AI-Driven Test Automation Framework for Web Applications

**Date:** August 2026

This document walks through the four automation workflows. They apply to **any web application** — the examples use a Salesforce case study, but the workflows are application-agnostic. Each workflow has a dedicated steering document that guides Kiro's behavior.

---

## Overview of the 4 Workflows

| # | Workflow | Trigger | Creates Jira | Creates Zephyr | Automates |
|---|----------|---------|:---:|:---:|:---:|
| 1 | Jira Automation | "Automate KD-7" | ❌ | ✅ | ✅ |
| 2 | User Story Automation | Paste story / attach doc | ❌ | ❌ | ✅ |
| 3 | Story → Jira → Zephyr → Test | "Create in Jira and automate" | ✅ | ✅ | ✅ |
| 4 | Test Execution & Reporting | "Run smoke tests" | ❌ | ❌ | Runs existing |

---

## Workflow 1: Automate from Jira

**Steering:** `automation-workflow.md`

**Trigger:** `"Automate KD-7"`

### Steps
```
1. Read Jira ticket          → getJiraIssue
2. Create Zephyr test cases  → linked to ticket
3. Generate feature file     → Gherkin with tags
4. Discover locators         → Playwright MCP healer (live page)
5. Build Page Object         → extends BasePage
6. Write test spec           → uses fixtures
7. Run & heal                → execute, fix, re-run
8. Post Jira comment         → results summary
```

### Example
> **User:** "Automate KD-7"
> **Result:** Incident Creation test → INC-000001171 created → passing → Jira updated

---

## Workflow 2: User Story to Automation

**Steering:** `userstory-to-automation.md`

**Trigger:** Paste a requirement in chat, or attach a Word/PDF document

### Steps
```
1. Parse input              → extract from text/document
2. Structure user story     → save to user-stories/
3. Generate feature file    → Gherkin
4. Discover locators        → Playwright MCP healer
5. Build Page Object        → extends BasePage
6. Write test spec          → uses fixtures
7. Run & heal               → execute, fix, re-run
```

### Example
> **User:** [attaches Expense-Request-User-Story.docx]
> **Result:** Expense Request test → RQ-000002868 created → passing

---

## Workflow 3: Story → Jira → Zephyr → Automation

**Steering:** `story-to-jira-automation.md`

**Trigger:** `"Create this in Jira and automate: [story]"`

### Steps
```
1. Parse input              → extract requirement
2. Create Jira ticket       → createJiraIssue (new ticket)
3. Create Zephyr test cases → linked to new ticket
4. Generate feature file    → Gherkin
5. Discover locators        → Playwright MCP healer
6. Build Page Object        → extends BasePage
7. Write test spec          → uses fixtures
8. Run & heal               → execute, fix, re-run
9. Post Jira comment        → results summary
```

The most comprehensive flow — from a conversation to a fully tracked, tested, and reported feature.

---

## Workflow 4: Test Execution & Reporting

**Steering:** `test-execution-reporting.md`

**Trigger:** `"Run all smoke tests"` / `"Execute regression suite"`

### Steps
```
1. Determine scope          → smoke / regression / e2e / specific
2. Execute tests            → Playwright CLI
3. Collect results          → pass/fail/duration
4. Generate report          → structured markdown
5. Post results             → chat and/or Jira comment
```

### Commands
```bash
npx playwright test --project=chromium --grep @smoke
npx playwright test --project=chromium --grep @regression
npx playwright test --project=chromium --grep @e2e
```

---

## Supporting Steering Documents

Beyond the 4 workflow docs, these steering docs provide shared conventions:

| Doc | Purpose |
|-----|---------|
| `product.md` | Product context & principles |
| `tech.md` | Stack, commands, config |
| `structure.md` | Folder layout & naming |
| `jira-comments.md` | Jira connection & comment format |
| `zephyr-testcases.md` | Test case creation rules |
| `feature-file-generation.md` | Gherkin format & tagging |
| `playwright-healer.md` | Locator discovery & self-healing |
| `azure-devops-setup.md` | Azure DevOps MCP integration |

---

## The Common Thread

All workflows share the **Playwright MCP Healer** for locator discovery. Instead of guessing selectors, Kiro navigates the live application, interacts with each element, and confirms the locator works before writing the test. This works for any web application — standard HTML, SPAs, Shadow DOM, or iframes. The Salesforce case study proves it handles even the hardest DOM structures on the first run.

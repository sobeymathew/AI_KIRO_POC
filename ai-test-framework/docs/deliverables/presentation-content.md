# AI-Driven Test Automation Framework — Presentation

---

## Slide 1: Title

**AI-Driven End-to-End Test Automation Framework**

Powered by Kiro + Playwright + Salesforce ITSM

Milestone Technologies | August 2026

---

## Slide 2: Problem Statement

### Challenges with Traditional Test Automation

- Manual test case creation is **slow** (days per user story)
- Salesforce Lightning uses **Shadow DOM** — standard locators fail
- Locators **break frequently** with Salesforce updates
- No single workflow from **requirement → working test**
- Test maintenance consumes **60%+ of automation effort**

---

## Slide 3: Our Solution

### AI-Orchestrated Test Automation with Kiro

- **Kiro IDE** as the AI orchestration engine
- **Playwright** for browser automation (pierces Shadow DOM)
- **Self-healing locators** via live page inspection
- **End-to-end pipeline**: Jira ticket → Zephyr test cases → Feature file → Working test
- **4 automation workflows** covering different entry points

---

## Slide 4: Architecture Overview

```
┌──────────────────────────────────────────────┐
│           KIRO AI ORCHESTRATION               │
│    Steering Documents │ Skills │ Workflows    │
└─────────────────────┬────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
┌─────────┐   ┌──────────────┐   ┌─────────────┐
│  Jira   │   │  Playwright  │   │  Zephyr     │
│  + MCP  │   │  MCP Healer  │   │  Scale      │
└─────────┘   └──────────────┘   └─────────────┘
    │                 │                 │
    └─────────────────┼─────────────────┘
                      ▼
         ┌────────────────────────┐
         │  Automated Test Suite  │
         │  (Salesforce ITSM)     │
         └────────────────────────┘
```

---

## Slide 5: Key Innovation — Self-Healing Locators

### The Playwright MCP Healer

| Traditional Approach | Our Approach |
|---------------------|--------------|
| Write locators from DevTools | Healer navigates live page |
| Breaks with DOM changes | Self-heals by re-inspecting |
| Can't pierce Shadow DOM | Pierces Shadow DOM natively |
| Manual fix when locators break | Auto-discovers alternatives |
| Guess-based CSS selectors | Verified via actual interaction |

**Result:** Locators that actually work on Salesforce Lightning

---

## Slide 6: The 4 Automation Workflows

| # | Workflow | Input | Output |
|---|---------|-------|--------|
| 1 | Automate from Jira | "Automate KD-7" | Working test + Jira comment |
| 2 | Automate from User Story | Paste text / attach doc | Working test |
| 3 | Story → Jira → Zephyr → Test | Paste story | Jira ticket + Zephyr TCs + test |
| 4 | Execute & Report | "Run smoke tests" | Execution report |

---

## Slide 7: Workflow 1 — Automate from Jira

```
"Automate KD-7"
     │
     ▼
Read Jira Ticket → Create Zephyr Test Cases →
Generate Feature File → Discover Locators (Healer) →
Build Page Object → Write Test Spec → Run & Heal →
Post Results on Jira
```

**Demo: KD-7 (Incident Creation) — Fully automated in one command**

---

## Slide 8: Workflow 2 — User Story to Automation

```
Paste requirement (or attach Word doc)
     │
     ▼
Parse Input → Structure User Story →
Generate Feature File → Discover Locators →
Build Page Object → Write Test Spec → Run & Heal
```

**Demo: Expense Request — From Word doc to passing test**

---

## Slide 9: Case Study — KD-7 Incident Creation

### Journey

| Step | Time | Artifact |
|------|------|----------|
| Read Jira ticket | 5 sec | Requirement analysis |
| Create Zephyr test cases | 15 sec | 7 test cases (KD-T23 to KD-T29) |
| Generate feature file | 10 sec | `incident-creation.feature` |
| Discover locators (healer) | 3 min | Verified Salesforce locators |
| Build Page Object | 30 sec | `incident-create.page.ts` |
| Write test spec | 20 sec | `incident-creation.spec.ts` |
| Run & heal | 2 min | Test passing ✅ |

**Total: ~6 minutes from Jira ticket to passing test**

---

## Slide 10: Case Study — KD-8 COI Request

### Result

- **Input:** Jira ticket KD-8
- **Output:** Fully automated test creating COI request
- **Verified:** RQ-000002866 created successfully
- **Duration:** 34.8 seconds per test run
- **Artifacts:** Feature file + Page Object + Test Spec + Jira comment

---

## Slide 11: Case Study — Expense Request (From Document)

### Result

- **Input:** Word document (Expense-Request-User-Story.docx)
- **Output:** User story file + Feature file + Page Object + Test Spec
- **Verified:** RQ-000002868 created successfully
- **Duration:** 33.3 seconds per test run
- **Flow used:** User Story to Automation (no Jira ticket needed)

---

## Slide 12: Metrics Report

### Test Automation Metrics

| Metric | Value |
|--------|-------|
| Modules Automated | 3 (Incident, COI, Expense) |
| Total Test Cases (Zephyr) | 10+ |
| Smoke Tests | 3 (100% pass rate) |
| Regression Tests | 1 (100% pass rate) |
| Average Test Duration | 31-35 seconds |
| Time to Automate New Story | 6-10 minutes |
| Locator Healing Success | 100% (after healer) |
| Salesforce Shadow DOM Support | ✅ Full |

---

## Slide 13: Metrics — Time Savings

### Traditional vs AI-Driven

| Activity | Traditional | AI-Driven | Savings |
|----------|-------------|-----------|---------|
| Understand requirement | 30 min | 5 sec (reads Jira) | 99% |
| Create test cases | 2 hours | 15 sec (Zephyr auto) | 99% |
| Write feature file | 1 hour | 10 sec | 99% |
| Find locators | 4 hours | 3 min (healer) | 98% |
| Build Page Object | 2 hours | 30 sec | 99% |
| Write test spec | 2 hours | 20 sec | 99% |
| Fix broken locators | 1-4 hours | 2 min (healer) | 97% |
| **Total per story** | **1-2 days** | **6-10 min** | **95%+** |

---

## Slide 14: Technology Stack

| Layer | Technology |
|-------|-----------|
| AI Orchestration | Kiro IDE + Steering Documents |
| Test Runner | Playwright (auto-wait, Shadow DOM) |
| Browser Inspection | Playwright MCP (live page interaction) |
| Test Management | Zephyr Scale (Jira integrated) |
| Project Tracking | Jira (Atlassian Cloud) |
| Language | TypeScript (strict mode) |
| Reporting | Allure + Playwright HTML |
| CI/CD | GitHub Actions |
| Target App | Salesforce Experience Cloud (ITSM) |

---

## Slide 15: Steering Documents — The Brain

### 10 Steering Docs Guiding AI Behavior

| Doc | Purpose |
|-----|---------|
| `product.md` | Product context & principles |
| `tech.md` | Stack & commands |
| `structure.md` | Folder layout & naming |
| `jira-comments.md` | Jira integration |
| `zephyr-testcases.md` | Test case creation |
| `feature-file-generation.md` | Gherkin format |
| `playwright-healer.md` | Locator discovery & healing |
| `automation-workflow.md` | Master Jira automation flow |
| `userstory-to-automation.md` | Direct story automation |
| `story-to-jira-automation.md` | Full pipeline (story → Jira → test) |
| `test-execution-reporting.md` | Run & report flow |

---

## Slide 16: Salesforce-Specific Learnings

### Shadow DOM Challenges Solved

| Challenge | Solution |
|-----------|----------|
| Standard locators can't pierce Shadow DOM | Playwright's native locator engine |
| `document.querySelector` fails | `deepQuery` recursive Shadow DOM search |
| Dropdown options have empty text | Use `[data-value="..."]` attribute |
| Combobox needs click before options appear | Click trigger → wait → select by data-value |
| `networkidle` never fires | Use `domcontentloaded` + explicit waits |
| Dynamic form fields appear after selections | Wait for element visibility before filling |

---

## Slide 17: Framework Structure

```
ai-test-framework/
├── .kiro/steering/          ← AI behavior rules
├── .kiro/skills/            ← Capability definitions
├── src/
│   ├── playwright/
│   │   ├── pages/           ← Page Objects (POM)
│   │   ├── fixtures/        ← Test DI
│   │   ├── tests/smoke/     ← Smoke tests
│   │   ├── tests/regression/← Regression tests
│   │   └── object-repository/ ← Verified locators
│   ├── test-case-management/
│   │   ├── features/        ← Gherkin files
│   │   └── user-stories/    ← Structured stories
│   └── config/              ← Environment configs
└── docs/                    ← Documentation
```

---

## Slide 18: Live Demo Plan

### Demo Flow (5 minutes)

1. **Show Jira ticket KD-8** → Say "Automate KD-8" → Watch pipeline execute
2. **Show expense-request.docx** → Paste in chat → Watch user story → feature → test
3. **Say "Run all smoke tests"** → Watch execution → Show report
4. **Break a locator intentionally** → Watch healer fix it

---

## Slide 19: Roadmap / Next Steps

### Immediate
- Add more ITSM modules (Travel, Facilities, Security)
- Integrate Slack notifications for test reports
- Add CI/CD pipeline (GitHub Actions)

### Short-term
- Bulk automation from Jira sprints
- Test data management workflow
- Cross-browser validation (Firefox, Safari)

### Long-term
- Visual regression testing
- API test automation integration
- AI-powered failure root cause analysis

---

## Slide 20: Key Takeaways

1. **AI reduces test automation time by 95%** (days → minutes)
2. **Self-healing locators** eliminate the #1 maintenance cost
3. **Salesforce Shadow DOM** is fully supported via Playwright MCP
4. **4 flexible workflows** cover any entry point (Jira, document, chat)
5. **Steering documents** make the AI's behavior repeatable and auditable
6. **End-to-end traceability** from requirement → Jira → Zephyr → Feature → Test

---

## Slide 21: Questions?

**Contact:**
- Framework: `ai-test-framework/`
- Steering: `.kiro/steering/`
- Run: `npx playwright test --project=chromium --grep @smoke`

---

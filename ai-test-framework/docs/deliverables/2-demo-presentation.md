# Demo / Presentation
## AI-Driven Test Automation Framework for Web Applications

**Client Presentation | August 2026**

> Convert each section below into a slide (PowerPoint, Google Slides, or Marp).

---

## Slide 1: Title

**AI-Driven Test Automation Framework for Web Applications**
Powered by Kiro + Playwright

Milestone Technologies | August 2026

---

## Slide 2: The Problem

### Web App Test Automation is Slow & Fragile

- Manual test authoring: **1–2 days** per user story
- Complex DOM (SPAs, Shadow DOM, iframes) breaks standard locators
- Locators break with **every UI update**
- **60%+** of effort spent on test maintenance
- Fragmented: requirement → test needs 5+ handoffs

---

## Slide 3: The Solution

### AI-Orchestrated Automation with Kiro

- **Kiro** as the AI automation engineer
- **Playwright** for browser automation (pierces Shadow DOM)
- **Self-healing locators** via live page inspection
- **End-to-end**: requirement → Zephyr → feature → test → report
- **4 flexible workflows** for any entry point

---

## Slide 4: Architecture

```
┌──────────────────────────────────────────────┐
│           KIRO AI ORCHESTRATION               │
│    Steering Documents │ 4 Workflows           │
└─────────────────────┬────────────────────────┘
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
┌─────────┐   ┌──────────────┐   ┌─────────────┐
│  Jira   │   │  Playwright  │   │  Zephyr     │
│  + MCP  │   │  MCP Healer  │   │  Scale      │
└─────────┘   └──────────────┘   └─────────────┘
                      ▼
         ┌────────────────────────┐
         │  Automated Test Suite  │
         │  Salesforce ITSM       │
         └────────────────────────┘
```

---

## Slide 5: Key Innovation — Self-Healing Locators

| Traditional | Our Approach |
|-------------|--------------|
| Guess from DevTools | Healer navigates live page |
| Breaks with DOM changes | Self-heals by re-inspecting |
| Can't pierce Shadow DOM | Pierces Shadow DOM natively |
| Manual fixes | Auto-discovers alternatives |
| Guess-based selectors | Verified via real interaction |

**Result:** Tests pass on the first run against Salesforce Lightning

---

## Slide 6: The 4 Workflows

| # | Workflow | Trigger |
|---|----------|---------|
| 1 | Automate from Jira | "Automate KD-7" |
| 2 | User Story to Automation | Paste story / attach doc |
| 3 | Story → Jira → Zephyr → Test | "Create in Jira and automate" |
| 4 | Test Execution & Reporting | "Run smoke tests" |

---

## Slide 7: Workflow in Action

```
Requirement (Jira / Document / Chat)
     │
     ▼
Read → Create Test Cases → Generate Feature File →
Discover Locators (Healer) → Build Page Object →
Write Test → Run & Heal → Report Results
```

**~6–10 minutes** from requirement to passing test

---

## Slide 8: Proof of Value — Salesforce Case Study

We tested against Salesforce Experience Cloud — a worst-case difficulty (Shadow DOM, dynamic forms).

| Scenario | Status |
|----------|--------|
| Incident Creation | ✅ |
| COI Request | ✅ |
| Expense Request | ✅ |
| Request Assessments | ✅ |
| Facilities Request | ✅ |
| Security Exception | ✅ |

**100% pass rate** — if it works on Salesforce, it works on your web app

---

## Slide 9: Time Savings

| Activity | Traditional | AI-Driven |
|----------|-------------|-----------|
| Understand requirement | 30 min | 5 sec |
| Create test cases | 2 hours | 15 sec |
| Discover locators | 4 hours | 3 min |
| Build Page Object | 2 hours | 30 sec |
| Write test | 2 hours | 20 sec |
| **Total per story** | **1–2 days** | **6–10 min** |

**~95% reduction**

---

## Slide 10: Technology Stack

- **Kiro IDE** — AI orchestration
- **Playwright** — auto-wait, Shadow DOM, multi-browser
- **Playwright MCP** — live page inspection & healing
- **Zephyr Scale** — test management
- **Jira** — project tracking
- **TypeScript** — type safety
- **Allure** — reporting

---

## Slide 11: Complex DOM Handled (Any Web App)

| Challenge | Solution |
|-----------|----------|
| Shadow DOM (Web Components) | Playwright native + deep query |
| iframes | Frame locators |
| Dynamic SPAs | Auto-wait + visibility waits |
| Custom widgets (no text) | Attribute selectors |
| Persistent network activity | `domcontentloaded` + waits |

---

## Slide 12: Live Demo Plan

1. **"Automate KD-10"** → watch full pipeline execute
2. **Attach a user story doc** → watch it become a test
3. **"Run all smoke tests"** → watch execution report
4. **Break a locator** → watch the healer fix it

---

## Slide 13: Roadmap

**Immediate:** More ITSM modules, Slack notifications, CI/CD
**Short-term:** Bulk sprint automation, test data management, cross-browser
**Long-term:** Visual regression, API testing, Azure DevOps integration

---

## Slide 14: Key Takeaways

1. **95% faster** — days to minutes
2. **Self-healing** locators eliminate #1 maintenance cost
3. **Salesforce Shadow DOM** fully supported
4. **4 flexible workflows** for any entry point
5. **Full traceability** — requirement to test to report
6. **Production-ready** and extensible

---

## Slide 15: Questions?

**Framework:** `ai-test-framework/`
**Docs:** `docs/deliverables/`
**Run:** `npx playwright test --project=chromium --grep @smoke`

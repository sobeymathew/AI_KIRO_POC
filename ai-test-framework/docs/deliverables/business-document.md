# AI-Powered Test Automation Across the Full Lifecycle
## Requirement to Result — Proof of Concept Outcome

**Prepared for:** Management / Leadership
**Prepared by:** QA Automation Team
**Date:** September 2026
**Status:** PoC Complete — Validated

---

## 1. Executive Summary

We set out to answer one question: **can AI meaningfully speed up and simplify web application testing?** The Proof of Concept confirms it can.

We built a general-purpose automation framework using **Kiro (AI) and Playwright** that turns a requirement into a working, self-maintaining automated test in minutes instead of days. It covers the **entire testing lifecycle** — from reading the requirement, through test case creation, code generation, and execution, to publishing results back to the source system.

The framework integrates with both **Jira + Zephyr Scale** and **Azure DevOps**, so teams keep their existing tools with no change to the automation engine. To prove it works on a hard problem, we validated it on **Salesforce Experience Cloud**, one of the most complex platforms to automate.

**Result:** a 100% pass rate and roughly a 95% reduction in automation effort.

---

## 2. Business Value at a Glance

| Outcome | Detail |
|---------|--------|
| **100% pass rate** | Every test confirmed by creating a real record in the application |
| **~95% less effort** | Automating a user story dropped from 1–2 days to about 6–10 minutes |
| **Self-healing** | The framework repairs broken locators automatically when the UI changes |
| **Dual ALM support** | Runs end-to-end from both Jira and Azure DevOps |
| **Application-agnostic** | Works on virtually any web application, proven on the hardest case |

---

## 3. The Problem

Traditional test automation is slow and fragile, regardless of the application:

- Manual test authoring takes 1–2 days per user story.
- Locators break with every UI change, and fixing them consumes the majority of automation effort.
- Complex modern applications (single-page apps, Shadow DOM, iframes) defeat standard tooling.
- Getting from a requirement to a working test involves multiple manual handoffs across several tools.

These challenges apply to any modern web application — customer portals, banking and insurance platforms, e-commerce, and enterprise systems alike.

---

## 4. The Solution — A Complete, AI-Driven Lifecycle

The framework acts as an AI automation engineer that runs the full process end to end:

1. **Reads the requirement** — from a Jira User Story, an Azure DevOps Work Item, or a document.
2. **Creates test cases** — in Zephyr Scale (Jira) or as linked Test Case work items (Azure DevOps).
3. **Generates detailed test steps** — as business-readable Gherkin scenarios.
4. **Discovers elements on the live application** — AI navigates the real app and verifies each element by interacting with it.
5. **Generates Playwright automation code** — following the industry-standard Page Object Model.
6. **Executes the tests** — verifying success by creating a real record in the application.
7. **Publishes results back** — to Jira or Azure DevOps, including screenshots on failure.

This delivers **complete traceability from requirement to result** with minimal manual effort.

---

## 5. Key Innovation — Self-Healing Locators

The breakthrough is that the framework does not guess how to find elements. It navigates the live application, inspects the real page (including Shadow DOM and iframes), and confirms each locator by actually using it.

When the UI changes and a locator breaks, the framework re-inspects the live page and repairs itself — dramatically reducing the maintenance burden that normally dominates automation work.

| Traditional Approach | Our Approach |
|----------------------|--------------|
| Guess locators from developer tools | AI interacts with the live page |
| Struggles with Shadow DOM and complex apps | Handles Shadow DOM, iframes, dynamic content |
| Breaks on UI changes | Self-heals by re-inspecting |
| Manual fixes needed | Automatically finds working alternatives |

---

## 6. Proof of Value — Salesforce Case Study

We deliberately chose **Salesforce Experience Cloud** because it represents a worst-case difficulty for automation: deeply nested Shadow DOM, dynamic dependent form fields, custom dropdowns with no accessible text, and constant background network activity.

Business workflows automated end-to-end:

| Scenario | Source | Status |
|----------|--------|--------|
| Certificate of Insurance Request | Jira ticket | Passing |
| Expense Request | Document | Passing |
| Request Assessments | Document | Passing |
| Facilities Request | Document | Passing |
| Security Exception Request | Jira ticket | Passing |

**The takeaway:** if the framework handles Salesforce, it can handle virtually any web application.

---

## 7. Business Impact

| Activity | Traditional | AI-Driven | Improvement |
|----------|-------------|-----------|-------------|
| Understand requirement | 30 min | seconds | ~99% |
| Create test cases | 2 hours | seconds | ~99% |
| Discover locators | 4 hours | ~3 min | ~98% |
| Build automation | 4 hours | ~1 min | ~99% |
| Heal a broken locator | 1–4 hours | ~2 min | ~97% |
| **Total per user story** | **1–2 days** | **6–10 min** | **~95%** |

---

## 8. Demonstrations Delivered

The framework was presented in two sessions:

- **TechExchange** — internal technical showcase.
- **WestPoint** — client demonstration.

Both demonstrated the complete requirement-to-result flow on a live application.

---

## 9. Next Steps

The framework is ready to extend to additional applications and modules. Planned enhancements:

- **API test automation** integration.
- **SQL / database validation** integration.

---

## 10. Conclusion

This PoC demonstrates a reusable, general-purpose framework that automates the entire testing lifecycle for any web application. The Salesforce case study proves it handles even the most challenging environments. The efficiency gains — a 100% pass rate and roughly 95% less effort — translate directly into faster delivery, lower maintenance cost, and higher confidence in quality.

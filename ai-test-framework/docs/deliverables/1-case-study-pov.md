# Case Study / Point of View
## AI-Driven Test Automation Framework for Web Applications

**Prepared for:** Client Stakeholders
**Prepared by:** Milestone Technologies — QA Automation Team
**Date:** August 2026

---

## Executive Summary

We built a **general-purpose, AI-orchestrated test automation framework** using **Kiro** and **Playwright** that automates functional testing for **any web application**. The framework converts requirements — from Jira tickets, user stories, or documents — into working, self-healing automated tests in minutes rather than days.

To prove its capability, we applied it to one of the hardest automation targets in the industry: a **Salesforce Experience Cloud application**. This case study demonstrates that if the framework can handle Salesforce's complex Shadow DOM, it can handle virtually any web application.

---

## The Problem (Universal Across Web Apps)

Traditional test automation is slow and fragile regardless of the application:

| Challenge | Impact |
|-----------|--------|
| Manual test authoring | 1–2 days per user story |
| Fragile locators | Tests break with every UI change |
| Complex DOM (SPAs, Shadow DOM, iframes) | Standard locators fail |
| Fragmented tooling | Requirement → test involves 5+ manual handoffs |
| Maintenance burden | 60%+ of automation effort spent fixing broken tests |

These challenges apply to **any modern web application** — e-commerce, banking portals, insurance platforms, SaaS products, or enterprise systems.

---

## The Solution (Application-Agnostic)

An AI-orchestrated pipeline where Kiro acts as the automation engineer for any web app:

1. **Reads the requirement** — from Jira, a document, or chat
2. **Creates test cases** — in the test management tool (Zephyr, Azure Test Plans, etc.)
3. **Generates the feature file** — business-readable Gherkin
4. **Discovers locators live** — Playwright navigates the real application, inspects the DOM (including Shadow DOM and iframes), and verifies each locator by interacting with it
5. **Builds the automation** — Page Object + test spec following industry-standard POM
6. **Runs and self-heals** — executes the test; if a locator breaks, it re-inspects the live page and fixes itself
7. **Reports back** — posts results to the tracking tool

---

## Key Innovation: The Self-Healing Locator

The breakthrough works for **any web application** — instead of generating code from guesswork, Kiro navigates the live application to discover and confirm locators.

| Traditional Approach | Our Approach |
|---------------------|--------------|
| Guess locators from DevTools | Kiro interacts with the live page |
| Struggles with Shadow DOM / SPAs | Handles Shadow DOM, iframes, dynamic content |
| Breaks on UI changes | Self-heals by re-inspecting |
| Manual fixes needed | Auto-discovers working alternatives |

---

## Proof of Value: Salesforce ITSM Example

We chose Salesforce Experience Cloud as our test case because it represents a **worst-case difficulty** for automation:
- Lightning Web Components with deeply nested Shadow DOM
- Dynamic, dependent form fields
- Custom comboboxes with no accessible text
- Persistent background network activity

### Results

| # | Scenario | Source | Status |
|---|----------|--------|--------|
| 1 | Incident Creation | Jira ticket | ✅ Passing |
| 2 | Certificate of Insurance Request | Jira ticket | ✅ Passing |
| 3 | Expense Request | Word document | ✅ Passing |
| 4 | Request Assessments | Word document | ✅ Passing |
| 5 | Facilities Request | Word document | ✅ Passing |
| 6 | Security Exception Request | Jira ticket | ✅ Passing |

All scenarios automated end-to-end with a **100% pass rate**, verified by creating real records.

> **The takeaway:** If it works on Salesforce, it works on your web application — whether that's a public website, a customer portal, an internal tool, or a SaaS product.

---

## What the Framework Can Automate

| Application Type | Supported |
|------------------|-----------|
| Public websites & marketing sites | ✅ |
| Single Page Applications (React, Angular, Vue) | ✅ |
| Salesforce & other Lightning apps | ✅ (proven) |
| Customer portals & dashboards | ✅ |
| E-commerce & checkout flows | ✅ |
| Banking / insurance web platforms | ✅ |
| Mobile web (responsive) | ✅ |
| Multi-browser (Chromium, Firefox, WebKit) | ✅ |

---

## Business Impact

| Metric | Traditional | AI-Driven | Improvement |
|--------|-------------|-----------|-------------|
| Time per user story | 1–2 days | 6–10 minutes | ~95% faster |
| Locator maintenance | 1–4 hours per break | 2 minutes (auto-heal) | ~97% faster |
| Requirement → test | Multiple handoffs | Single conversation | Streamlined |
| First-run pass rate | Low | High (verified live) | Significantly higher |

---

## Conclusion

This is a **reusable, general-purpose framework** for automating any web application. The Salesforce ITSM work is a demonstration — proof that the approach handles even the most challenging DOM structures. For any client web application, the same framework, workflows, and self-healing approach apply out of the box.

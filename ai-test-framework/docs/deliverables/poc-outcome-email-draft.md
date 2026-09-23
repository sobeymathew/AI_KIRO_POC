# Email Draft — AI Test Automation POC Outcome

---

**Subject:** Successful POC Outcome — AI-Driven Test Automation Framework

---

Hi [Name],

I'm pleased to share the successful outcome of our proof of concept for an AI-driven test automation framework. The goal was to evaluate whether AI could meaningfully speed up and simplify our web application testing — and the results are very encouraging.

**What we built**

A general-purpose automation framework using **Kiro (AI)** and **Playwright** that takes a requirement and turns it into a working, self-maintaining automated test in minutes. It works for any web application.

The framework integrates with **both Jira + Zephyr Scale and Azure DevOps**, so it fits into whichever tracking system a team already uses — with no change to the underlying automation engine.

To validate it against a difficult target, we tested it on a **Salesforce Experience Cloud** application — one of the hardest platforms to automate in the industry.

**Key results**

- Automated **5 real business scenarios** end-to-end:
  - Certificate of Insurance
  - Expense Requests
  - Facilities Requests
  - Request Assessments
  - Security Exception Requests
- Achieved a **100% pass rate**, with every test validated by creating a real record in the application.
- Delivered approximately a **95% reduction in automation effort**, reducing the time required to automate a user story from 1–2 days to approximately 6–10 minutes.
- Implemented **self-healing capabilities**, enabling the framework to automatically re-inspect the application and repair broken locators when UI changes occur, significantly reducing maintenance effort.
- Completed **Azure DevOps integration** — the framework now drives the full lifecycle directly from Azure DevOps work items, in addition to Jira.

**How it works**

To validate the framework, we automated key business workflows end-to-end. An example of one workflow is attached for reference.

The process begins with a requirement — either a **user story in Jira** or a **work item in Azure DevOps**. The framework then:

1. Automatically creates test cases — in **Zephyr Scale** (Jira) or as linked **Test Case work items** (Azure DevOps).
2. Generates detailed test steps.
3. Uses AI to identify and interact with elements in the live application.
4. Generates Playwright automation code.
5. Executes the tests.
6. Publishes results back to the source — **Jira/Zephyr Scale** or the **Azure DevOps work item** (including a screenshot on failure).

This provides complete traceability from requirement to execution result while minimizing manual effort.

**Latest — Azure DevOps end-to-end (Expense Request)**

As part of the most recent work, we ran the complete flow from an Azure DevOps work item (Expense Request via the Service Catalog). The framework read the work item, created four linked test cases (happy path, validation, field behavior, and negative), generated the feature file, discovered the form's locators on the live application — including undocumented cascading fields — built the automation, and executed it. It then posted the result and a screenshot back to the work item automatically. This confirms the Azure DevOps integration works end-to-end with full traceability.

**Why this matters**

- **Faster releases** — Automation keeps pace with development cycles.
- **Lower QA costs** — Engineers can focus on strategic testing rather than repetitive scripting and maintenance.
- **Higher resilience** — Self-healing capabilities address one of the largest automation maintenance challenges.
- **Flexible adoption** — Supports Jira and Azure DevOps, plus documents and plain-text requirements as inputs.

**Next steps**

The framework is ready to be extended to additional applications and modules. Planned enhancements include:

- API test automation integration
- SQL/database validation integration

I've attached the detailed deliverables, including the case study, performance metrics, and framework documentation, for your review.

I look forward to your feedback.

Best regards,
[Your Name]
[Your Title]

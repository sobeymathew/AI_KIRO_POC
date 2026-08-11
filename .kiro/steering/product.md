# Product Overview

An enterprise-grade, AI-orchestrated end-to-end test automation framework. It automates the complete testing lifecycle — from requirements analysis through test design, execution, reporting, and defect management.

## Target Application

The framework currently tests a Salesforce-based ITSM (IT Service Management) application hosted on Salesforce Experience Cloud (site: `milestoneitsm--fullcopy.sandbox.my.site.com`).

## Core Capabilities

- **Test Case Management**: Requirements → User Stories → Test Scenarios → Gherkin Features → Traceability
- **Web Scraping & Object Repository**: Automated page discovery, DOM extraction, locator generation, and centralized locator store
- **Playwright Automation**: Page Object Model tests with fixtures, auto-waiting, multi-browser and mobile support
- **Reporting & Analytics**: Allure reports, HTML dashboards, trend analysis, failure root-cause analysis

## Key Principles

- Every test must link to a requirement via traceability
- Locators are managed centrally in the object repository
- No hard-coded waits — rely on Playwright auto-waiting
- Tests are tagged by suite type (`@smoke`, `@sanity`, `@regression`, `@e2e`) and priority (`@p0`, `@p1`, `@p2`)
- AI (Kiro) orchestrates generation of test artifacts using steering rules and skills

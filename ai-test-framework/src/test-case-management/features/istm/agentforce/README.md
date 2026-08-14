# Agentforce AI Assistant — Feature File Index

## Overview

All Agentforce test scenarios are organized across the standard suite folders.
This README serves as the central index linking to the correct feature files.

## Feature File Locations

| Suite | File | Test Cases | Tests |
|-------|------|------------|-------|
| **Smoke** | `features/smoke/agentforce-ai-assistant.feature` | TC-0006 to TC-0017 | 11 |
| **Regression (Core)** | `features/regression/agentforce-ai-assistant-full.feature` | TC-0018 to TC-0035 | 16 |
| **Regression (Coverage Gaps)** | `features/regression/agentforce-coverage-gaps.feature` | TC-0046 to TC-0068 | 21 |
| **E2E Journeys** | `features/e2e/agentforce-ai-assistant-journeys.feature` | TC-0040 to TC-0045 | 5 |

**Total:** 53 automated scenarios across 4 feature files

## Corresponding Test Specs

| Feature File | Playwright Spec |
|-------------|-----------------|
| `agentforce-ai-assistant.feature` | `tests/smoke/agentforce-assistant.spec.ts` |
| `agentforce-ai-assistant-full.feature` | `tests/regression/agentforce-assistant-regression.spec.ts` |
| `agentforce-coverage-gaps.feature` | `tests/regression/agentforce-coverage-gaps.spec.ts` |
| `agentforce-ai-assistant-journeys.feature` | `tests/e2e/agentforce-journeys.spec.ts` |

## Run Commands

```bash
# All Agentforce tests (53 tests, ~25-30 min)
npm run test:agentforce

# Smoke only (11 tests, ~7 min)
npm run test:agentforce:smoke

# Core regression (16 tests, ~14 min)
npm run test:agentforce:regression

# Coverage gap regression (21 tests, ~20 min)
npm run test:agentforce:coverage

# E2E journeys (5 tests, ~6 min)
npm run test:agentforce:e2e

# Headed mode (visible browser)
npm run test:agentforce:headed
```

## Prerequisites

1. Environment configured: `src/config/.env.dev`
2. For Salesforce fulfiller tests: Run `npm run auth:sf-sandbox` to capture MFA session
3. Browsers installed: `npx playwright install chromium`

## Tags

All Agentforce tests use `@agentforce` tag. Additional tags:
- `@smoke`, `@regression`, `@e2e` — suite level
- `@p0`, `@p1`, `@p2` — priority
- `@access`, `@nlp`, `@knowledge`, `@incident-creation`, `@classification` — functional area
- `@ticket-status`, `@ticket-update`, `@categorization`, `@routing` — feature area
- `@performance`, `@session`, `@accessibility`, `@security`, `@mobile` — non-functional

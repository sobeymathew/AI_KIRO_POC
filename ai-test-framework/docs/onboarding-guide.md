# Onboarding Guide

## Welcome to the AI Test Automation Framework

This guide will help you get started contributing to the framework.

## Prerequisites

1. **Node.js** >= 18.0.0 (LTS recommended)
2. **Kiro IDE** - AI-powered development environment
3. **Git** - Version control
4. **Docker** (optional) - For containerized execution

## Setup Steps

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-test-framework
npm install
npx playwright install
```

### 2. Configure Environment

```bash
# Copy template
cp src/test-data/environments/.env.template src/config/.env.dev

# Edit with your values
# At minimum, set BASE_URL
```

### 3. Verify Setup

```bash
# Run a quick test to verify everything works
npm run test:smoke -- --headed
```

### 4. Explore the Structure

Use Kiro to explore the framework:
- Read `.kiro/steering/` documents for standards
- Review `.kiro/skills/` for available capabilities and roles
- Check `.kiro/prompts/` for reusable prompt templates

## How to Add a New Test

### Step 1: Create/Update Requirements
Add requirement JSON to `src/test-case-management/requirements/`

### Step 2: Create Feature File
Write Gherkin scenarios in `src/test-case-management/features/{category}/`

### Step 3: Create/Update Object Repository
If testing a new page, add locators to `src/web-scraping/object-repository/pages/`

### Step 4: Create Page Object
Add page class to `src/playwright/pages/` extending BasePage

### Step 5: Create Test Spec
Write Playwright test in `src/playwright/tests/{category}/`

### Step 6: Update Traceability
Run `npm run traceability` to update the RTM

## Using Kiro AI

### Generate Tests from Requirements
Use the prompt: `.kiro/prompts/analyze-requirement.md`

### Generate Page Objects
Use the prompt: `.kiro/prompts/generate-page-object.md`

### Analyze Failures
Use the prompt: `.kiro/prompts/analyze-failures.md`

## Key Conventions

- **No hard-coded waits** - Use Playwright auto-waiting
- **data-testid first** - Preferred locator strategy
- **Page Object Model** - All interactions via page objects
- **Fixtures** - Use for page object injection
- **AAA Pattern** - Arrange, Act, Assert in every test

## Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:smoke` | Run smoke suite |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Run with Playwright Inspector |
| `npm run report` | Open HTML report |
| `npm run crawl` | Crawl target application |
| `npm run traceability` | Generate RTM |
| `npm run lint` | Check code style |

## Getting Help

- Framework standards: `.kiro/steering/`
- Skill documentation: `.kiro/skills/`
- Reusable prompts: `.kiro/prompts/`

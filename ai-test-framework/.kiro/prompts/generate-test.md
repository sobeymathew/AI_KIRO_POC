# Prompt: Generate Playwright Test

## Usage
Use this prompt when you need to create a Playwright test file from a feature file.

## Template

```
Generate a Playwright test file for the following feature:

Feature File: src/test-case-management/features/{{CATEGORY}}/{{FEATURE_FILE}}
Category: {{CATEGORY}} (smoke|sanity|regression|e2e)

Available Page Objects:
{{LIST_OF_PAGE_OBJECTS}}

Available Test Data:
{{LIST_OF_DATA_FILES}}

Requirements:
1. Follow AAA pattern (Arrange-Act-Assert)
2. Use fixtures for page object injection
3. Include proper test annotations (@smoke, @p0, etc.)
4. No hard-coded waits
5. Use auto-waiting assertions
6. Reference test data from centralized sources

Follow standards from:
- .kiro/steering/playwright-coding-guidelines.md
- .kiro/steering/test-design-standards.md
- .kiro/steering/naming-conventions.md

Output to: src/playwright/tests/{{CATEGORY}}/{{test-name}}.spec.ts
```

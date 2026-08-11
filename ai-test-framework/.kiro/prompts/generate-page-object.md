# Prompt: Generate Page Object

## Usage
Use this prompt when you need to create a new page object from an object repository entry.

## Template

```
Generate a Playwright Page Object class for the following page:

Page: {{PAGE_NAME}}
URL: {{PAGE_URL}}
Object Repository: src/web-scraping/object-repository/pages/{{REPO_FILE}}

Requirements:
1. Extend BasePage class
2. Define all locators as readonly properties
3. Create action methods for all interactions
4. Add JSDoc documentation
5. Export from pages/index.ts

Follow standards from:
- .kiro/steering/playwright-coding-guidelines.md
- .kiro/steering/naming-conventions.md
- .kiro/steering/locator-management.md

Output to: src/playwright/pages/{{page-name}}.page.ts
```

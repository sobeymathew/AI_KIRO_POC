# Locator Management Standards

## Object Repository Structure

All locators are stored in JSON-based object repository files:

```
src/web-scraping/object-repository/
├── pages/
│   ├── login-page.repo.json
│   ├── dashboard-page.repo.json
│   └── settings-page.repo.json
└── components/
    ├── header-nav.repo.json
    └── footer.repo.json
```

## Repository File Format

```json
{
  "pageName": "LoginPage",
  "url": "/login",
  "locators": {
    "emailInput": {
      "testId": "login-email",
      "css": "input[name='email']",
      "xpath": "//input[@name='email']",
      "role": { "type": "textbox", "name": "Email" },
      "description": "Email input field on login form",
      "priority": "data-testid"
    }
  }
}
```

## Locator Priority Matrix

| Priority | Strategy | Use When |
|----------|----------|----------|
| 1 | data-testid | Always preferred |
| 2 | Role + Name | Accessibility-first apps |
| 3 | Label/Text | Form elements |
| 4 | CSS Selector | Legacy apps |
| 5 | XPath | Complex DOM traversal |

## Locator Healing

When a locator fails, the framework should:
1. Log the failure with DOM context
2. Attempt alternative locator strategies
3. Flag for human review if all strategies fail
4. Suggest updated locator based on current DOM

## Naming Rules

- Use `camelCase` for locator keys
- Prefix with element type: `btnSubmit`, `inputEmail`, `linkHome`
- Keep names descriptive and unique within page scope
- Group related locators with common prefix

## Maintenance Rules

- Update object repository when DOM changes
- Run locator validation weekly
- Remove unused locators quarterly
- Version control all repository changes
- Never duplicate locators across pages (use components)

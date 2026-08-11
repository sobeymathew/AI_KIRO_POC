# Reusability Standards

## Core Reusability Principles

1. **Single Responsibility** - Each module/class does one thing well
2. **Composition Over Inheritance** - Use mixins and composition patterns
3. **Configuration Over Code** - Drive behavior through config
4. **Interface-Driven Design** - Program to interfaces, not implementations

## Reusable Components

### Page Object Base Class
All page objects extend `BasePage` which provides:
- Common navigation methods
- Wait helpers
- Screenshot capture
- Logging integration

### Shared Fixtures
- Authentication fixtures (logged-in user states)
- Test data fixtures (pre-populated data)
- Page object fixtures (page instance creation)
- API fixtures (backend data setup)

### Utility Libraries
- Date/time utilities
- String manipulation
- Random data generation
- File I/O operations
- API request helpers

### Shared Assertions
- Custom matchers for domain-specific validation
- Collection assertions
- API response assertions
- Visual comparison assertions

## Code Reuse Checklist

Before writing new code, check:
- [ ] Does a similar utility already exist?
- [ ] Can an existing page object be extended?
- [ ] Is there a shared fixture that covers this?
- [ ] Can this be a reusable component?
- [ ] Should this go in the utility library?

## Anti-Patterns to Avoid

- ❌ Copy-pasting test setup between files
- ❌ Duplicating locators across page objects
- ❌ Reimplementing common waits
- ❌ Hard-coding values that could be config
- ❌ Creating god objects that do everything

## Module Boundaries

Each module exposes a public API through index.ts:
```typescript
// src/playwright/pages/index.ts
export { LoginPage } from './login.page';
export { DashboardPage } from './dashboard.page';
export { BasePage } from './base.page';
```

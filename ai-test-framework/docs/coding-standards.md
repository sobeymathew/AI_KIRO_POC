# Coding Standards

## TypeScript Standards

### Strict Mode
All code must compile under `strict: true` TypeScript configuration.

### No `any` Types
Avoid `any` type. Use `unknown` and narrow with type guards when needed.

### Async/Await
Always use async/await over raw Promises. Never use `.then()` chaining.

### Error Handling
```typescript
// Good
try {
  await riskyOperation();
} catch (error) {
  if (error instanceof SpecificError) {
    // Handle specific case
  }
  throw error; // Re-throw if unhandled
}

// Bad - never swallow errors
try {
  await riskyOperation();
} catch (e) {
  // empty catch
}
```

### Imports
- Use explicit named imports
- Group imports: external → internal → types
- Use path aliases (`@pages/*`, `@utils/*`)

### Functions
- Maximum 20 lines per function
- Single responsibility
- Descriptive names with verb prefix
- JSDoc for all public methods

## Playwright Standards

### Locators
```typescript
// Good - Salesforce ITSM patterns (no data-testid in Salesforce)
page.locator('[aria-label="Category"]')
page.locator('a[href="/itsm/s/Incident-Form"]')
page.locator('select[name="Urgency"]')
page.locator('button:has-text("Submit")')

// Bad - fragile, non-specific
page.locator('div > div > button')
page.locator('.btn-primary')
```

### Assertions
```typescript
// Good - auto-waiting assertions
await expect(element).toBeVisible();
await expect(element).toHaveText('Welcome');

// Bad - manual checks
const isVisible = await element.isVisible();
expect(isVisible).toBe(true);
```

### Waits
```typescript
// Good - condition-based wait
await page.waitForResponse(resp => resp.url().includes('/api/login'));
await expect(element).toBeVisible();

// Bad - time-based wait
await page.waitForTimeout(3000);
```

## File Organization

- One class per file
- File name matches primary export
- Index files for module exports
- Tests mirror source structure

## Git Commit Messages

Format: `type(scope): description`

Types: feat, fix, test, refactor, docs, chore

Examples:
- `feat(pages): add ProfilePage page object`
- `test(smoke): add user registration smoke tests`
- `fix(locators): update dashboard nav locators`
- `refactor(utils): extract retry logic to utility`

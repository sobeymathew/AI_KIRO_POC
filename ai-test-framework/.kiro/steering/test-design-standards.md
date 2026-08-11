# Test Design Standards

## Test Structure

Every test must follow the Arrange-Act-Assert (AAA) pattern:

```typescript
test('should perform expected behavior', async ({ page }) => {
  // Arrange - Set up test preconditions
  await loginPage.navigate();
  
  // Act - Perform the action under test
  await loginPage.login(testData.validUser);
  
  // Assert - Verify expected outcome
  await expect(dashboardPage.welcomeMessage).toBeVisible();
});
```

## Test Independence

- Each test must be independent and self-contained
- No test should depend on the execution order of other tests
- Tests must clean up after themselves
- Use fixtures for shared setup/teardown

## Test Categories

### Smoke Tests (@smoke)
- Critical path validation
- Maximum 15 minutes execution
- Run on every deployment
- Cover core business flows

### Sanity Tests (@sanity)
- Feature-level validation
- Maximum 30 minutes execution
- Run after builds
- Verify recent changes

### Regression Tests (@regression)
- Complete feature coverage
- Maximum 2 hours execution
- Run nightly or on-demand
- Full functional validation

### E2E Tests (@e2e)
- Business workflow validation
- Cross-module integration
- Real-world user journeys
- Maximum 4 hours execution

## Test Data Strategy

- Never hard-code test data in tests
- Use data fixtures or test data files
- Support multiple environments
- Sensitive data stored in environment variables

## Assertions

- Use Playwright's built-in assertions (auto-waiting)
- One logical assertion per test (multiple expects OK if testing one behavior)
- Custom assertions for complex validations
- Always assert positive and negative cases

## Gherkin Standards

```gherkin
Feature: [Feature Name]
  As a [role]
  I want to [action]
  So that [benefit]

  Background:
    Given [common precondition]

  @smoke @p0
  Scenario: [Descriptive scenario name]
    Given [precondition]
    When [action]
    Then [expected result]
    And [additional verification]
```

## Traceability

Every test must link to:
- Requirement ID
- User Story ID
- Test Case ID
- Feature File reference

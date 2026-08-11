# Skill: Incident Test Case Generation

## Role & Responsibilities

Generate comprehensive test cases, Gherkin features, Page Objects, and Playwright test specs for the ITSM Incident module.

- Analyze incident-related requirements from Jira tickets
- Generate test scenarios covering create, read, update, and search workflows
- Produce Gherkin feature files for the Incident module
- Generate Playwright test specs with proper fixtures
- Create/update Page Objects for Incident module pages
- Ensure traceability back to Jira ticket and requirement IDs

## Trigger

When a Jira ticket related to Incident module functionality is provided (e.g., KD-7).

## Input

- Jira ticket details (summary, description, acceptance criteria)
- Existing Incident feature files in `src/test-case-management/features/istm/`
- Existing Page Objects in `src/playwright/pages/`
- Object repository entries in `src/web-scraping/object-repository/pages/`
- Steering context from `itsm-incident.md`

## Output

- Feature files in `src/test-case-management/features/istm/`
- Test specs in `src/playwright/tests/` (appropriate category folder)
- Page Objects in `src/playwright/pages/`
- Fixture updates in `src/playwright/fixtures/`
- Test data in `src/test-data/static/` or `src/test-data/dynamic/`
- Requirement entry in `src/test-case-management/requirements/`

## Process

1. **Read** the Jira ticket and extract acceptance criteria
2. **Analyze** the requirement for testable conditions
3. **Identify** test scenarios:
   - Happy path (create incident successfully)
   - Validation scenarios (mandatory field checks)
   - Negative scenarios (invalid data, errors)
   - E2E journey (create → search → verify)
4. **Generate** Gherkin feature file with proper tags
5. **Generate** or update Page Object for Incident pages
6. **Generate** Playwright test spec using fixtures
7. **Create** test data entries for required test inputs
8. **Map** traceability (Jira ticket → Requirement → Feature → Test)

## Rules

- All tests must follow Arrange-Act-Assert pattern
- Page Objects must extend `BasePage`
- Tests must import from `base.fixture.ts`, never directly from `@playwright/test`
- Use `data-testid` as primary locator strategy
- No hard-coded waits — use Playwright auto-waiting
- Salesforce dropdown interactions require: click trigger → wait for listbox visible → select option
- Tag tests appropriately: `@smoke`, `@regression`, `@e2e` + priority `@p0`, `@p1`, `@p2`
- Feature files go in `features/istm/` for ITSM-specific scenarios
- One feature per file, max 10 scenarios per file
- Test data must not be hard-coded in specs — use fixtures or env vars

## Incident-Specific Patterns

### Salesforce Form Interaction Pattern
```typescript
// Dropdown selection in Salesforce Lightning
async selectDropdownValue(trigger: Locator, value: string): Promise<void> {
  await trigger.click();
  await this.page.getByRole('option', { name: value }).click();
}

// User lookup field
async setUserLookup(field: Locator, searchText: string): Promise<void> {
  await field.fill(searchText);
  await this.page.getByRole('option', { name: searchText }).waitFor();
  await this.page.getByRole('option', { name: searchText }).click();
}
```

### Incident Verification Pattern
```typescript
// After creation, verify incident in list
async verifyIncidentCreated(incidentId: string): Promise<void> {
  await this.searchInput.fill(incidentId);
  await this.page.keyboard.press('Enter');
  await expect(this.page.getByText(incidentId)).toBeVisible();
}
```

## Quality Gates

- Every generated test must compile without TypeScript errors
- Feature files must pass Gherkin lint
- Page Objects must have JSDoc on all public methods
- Tests must have traceability comment header linking to Jira ticket
- Smoke tests must complete within 2 minutes per scenario
- All mandatory field validation scenarios must be covered

## Artifacts Produced

1. `features/istm/{feature-name}.feature` — Gherkin scenarios
2. `tests/{category}/incident-*.spec.ts` — Playwright test specs
3. `pages/incident-*.page.ts` — Page Object(s)
4. `requirements/REQ-XXXX.json` — Structured requirement
5. `test-data/static/incident-test-data.json` — Test data (if needed)

## Interaction Pattern

```
Jira Ticket (KD-7) →
  Read: itsm-incident.md steering →
    Analyze: Extract acceptance criteria →
      Generate: Feature + Page Object + Test Spec + Test Data →
        Verify: TypeScript compile + traceability links
          → Feeds: Reporting, Failure Analysis
```

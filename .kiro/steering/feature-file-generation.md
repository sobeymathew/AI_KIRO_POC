# Feature File Generation

## When to Use

When asked to create a Gherkin feature file based on a Jira ticket or user story (e.g., "create feature file for KD-7").

## Process

1. **Read the Jira ticket** — Follow `jira-comments.md` for connection details. Use `getJiraIssue` to fetch full details.
2. **Analyze** — Extract the user story context (As a / I want / So that), acceptance criteria, and test steps.
3. **Determine category** — Based on the ticket content, decide the appropriate folder:
   - `smoke/` — Core happy-path critical flows
   - `sanity/` — Feature-level quick checks
   - `regression/` — Full coverage including validations and edge cases
   - `e2e/` — Multi-step business journeys
   - `istm/` — ITSM module-specific features
4. **Generate the feature file** — Write Gherkin using the format and rules below.
5. **Save** — Place the file in `ai-test-framework/src/test-case-management/features/{category}/`
6. **Post Jira comment** — Add a comment on the ticket referencing the feature file created (follow `jira-comments.md`).

## Feature File Location

```
src/test-case-management/features/
├── smoke/          — Critical path scenarios
├── sanity/         — Feature-level validation
├── regression/     — Full functional coverage
├── e2e/            — End-to-end user journeys
└── istm/           — ITSM module-specific features
```

## Naming Convention

- Use kebab-case: `{feature-name}.feature`
- Be descriptive: `incident-creation.feature`, `user-authentication.feature`
- One feature per file

## Gherkin Format

```gherkin
@{category} @{module}
Feature: {Feature Title}
  As a {role}
  I want to {action}
  So that {benefit}

  Background:
    Given {common precondition shared by all scenarios}

  @{category} @{priority}
  Scenario: {Descriptive scenario name}
    Given {precondition}
    When {action}
    Then {expected result}
    And {additional verification}

  @{category} @{priority}
  Scenario Outline: {Name for data-driven test}
    When I enter "<field>" with value "<value>"
    Then I should see "<result>"

    Examples:
      | field | value | result |
      | ...   | ...   | ...    |
```

## Tagging Rules

- **Category tags:** `@smoke`, `@sanity`, `@regression`, `@e2e`
- **Priority tags:** `@p0` (critical), `@p1` (important), `@p2` (nice-to-have)
- **Module tags:** `@incident`, `@authentication`, `@dashboard`, etc.
- Feature-level tags apply to all scenarios in the file
- Scenario-level tags override or supplement feature-level tags

## Writing Rules

- Feature description must include As a / I want / So that
- Use Background for preconditions shared across ALL scenarios in the file
- Steps must be reusable — avoid scenario-specific wording in step definitions
- Use Scenario Outline with Examples table when 3+ data variations exist
- Maximum 10 scenarios per feature file — split into multiple files if needed
- Steps should be business-readable, not implementation-specific
- Use double quotes for parameterized values: `"test@example.com"`
- Each scenario must be independent and self-contained

## Traceability

Include a comment block at the top of the feature file linking to the source:

```gherkin
# Jira: KD-7
# Requirement: REQ-XXXX
# Zephyr Test Cases: KD-T23, KD-T24, ...
```

## After Creation

- Post a Jira comment on the source ticket referencing the feature file path
- Update the `itsm-incident.md` steering doc (or relevant module steering) if new domain context was discovered

# Zephyr Scale Test Case Creation

## When to Use

When asked to create test cases in Zephyr (e.g., "create test cases for KD-7 in Zephyr"), follow this process.

## Connection

- **Project Key:** `KD`
- **Jira Cloud ID:** `74bddaaa-afcf-407f-a20f-e93afc663c84` (for linking issues)

## Process

1. **Read the Jira ticket** — Use `getJiraIssue` with the cloud ID and issue key to fetch full details (summary, description, acceptance criteria).
2. **Analyze acceptance criteria** — Identify test scenarios by category:
   - Smoke (P0): Core happy-path flows
   - Regression (P1): Validation, field dependencies, edge cases
   - Regression (P2): Optional features, lower-priority coverage
   - E2E (P0): Full end-to-end user journeys
3. **Create folder** (if needed) — Use `create_folder` with a meaningful path by module/feature.
4. **Create test cases** — Use `create_test_case` for each identified scenario.
5. **Link to Jira** — Use the `issue_links` parameter to connect each test case to the source ticket.
6. **Post comment on Jira** — After creation, add a comment on the ticket with test case keys and coverage mapping (follow `jira-comments.md` steering).

## Folder Structure

```
/Incident Management        — ITSM Incident module tests
/Service Requests           — Service Catalog request tests
/Agentforce AI              — AI Assistant tests
```

Create new folders by module or feature when needed. Keep folder names concise and descriptive.

## Test Case Creation Rules

- **Type:** Always use `STEP_BY_STEP` with clear `description` and `expectedResult` per step
- **Linking:** Always link to the source Jira ticket via `issue_links: ["KD-7"]`
- **Labels:** Tag with category, priority, module, and ticket key: `["smoke", "p0", "incident", "KD-7"]`
- **Priority mapping:**
  - `High` → P0 (critical path)
  - `Normal` → P1 (important coverage)
  - `Low` → P2 (nice-to-have)
- **Objective:** Always include a clear test objective
- **Precondition:** Include when the test has setup requirements
- **Project key:** `KD`

## Test Case Naming Convention

- Start with "Verify..." for validation tests
- Start with "E2E:" for end-to-end journey tests
- Be descriptive but concise

Examples:
- `Verify successful incident creation with all mandatory fields`
- `Verify mandatory field validations on incident creation form`
- `E2E: Full incident creation to verification journey`

## After Creation

Always post a structured Jira comment (per `jira-comments.md`) containing:
- Table of created test case keys and names
- Acceptance criteria → test case coverage mapping
- Zephyr folder path
- Next steps

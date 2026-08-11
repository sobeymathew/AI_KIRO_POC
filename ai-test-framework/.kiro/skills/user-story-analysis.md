# Skill: User Story Analysis

## Role & Responsibilities
Convert requirements into well-formed user stories with comprehensive acceptance criteria. Part of the test design workflow responsible for decomposing structured requirements into INVEST-compliant user stories.

- Decompose requirements into user-facing stories
- Define acceptance criteria using Given-When-Then
- Estimate complexity and identify edge cases
- Link stories to parent requirements

## Trigger
When a requirement is ready for user story decomposition.

## Input
- Requirement entry (from requirement repository)
- User personas/roles
- Business rules

## Output
- User story file in `src/test-case-management/user-stories/`
- Linked acceptance criteria
- Edge cases and boundary conditions

## Process

1. **Decompose** requirements into user-facing stories
2. **Write** stories in standard format (As a... I want... So that...)
3. **Define** acceptance criteria using Given-When-Then format
4. **Estimate** complexity and identify edge cases
5. **Link** stories back to parent requirements

## Rules
- Each story must be INVEST compliant (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- Stories must reference parent requirement ID
- Acceptance criteria must be in Given-When-Then format
- Maximum 5-8 acceptance criteria per story

## Artifacts Produced
1. `user-stories/{story-id}.json` - Structured user stories
2. Linked acceptance criteria entries

## Template

```json
{
  "id": "US-0001",
  "requirementId": "REQ-0001",
  "title": "User logs in with valid credentials",
  "story": "As a registered user, I want to log in with my email and password, so that I can access my account",
  "acceptanceCriteria": [
    {
      "id": "AC-0001",
      "given": "I am on the login page",
      "when": "I enter valid email and password and click submit",
      "then": "I am redirected to the dashboard"
    }
  ],
  "edgeCases": [
    "Empty email field",
    "Invalid email format",
    "SQL injection attempt"
  ],
  "priority": "P0",
  "complexity": "MEDIUM"
}
```

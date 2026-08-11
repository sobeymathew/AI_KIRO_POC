# Skill: Test Scenario Generation

## Role & Responsibilities
Part of the test design workflow. Responsible for generating comprehensive test scenarios from user stories, covering positive, negative, and edge cases. Also classifies scenarios by test type and maintains requirement traceability.

- Generate test scenarios from acceptance criteria
- Classify tests by type (smoke, sanity, regression, e2e)
- Apply test design techniques (EP, BVA, Decision Table, State Transition)
- Maintain 100% requirement coverage

## Trigger
When user stories are finalized and ready for test design.

## Input
- User story with acceptance criteria
- Business rules and constraints
- Known edge cases

## Output
- Test scenarios mapped to user stories
- Classification by test type
- Priority assignment

## Process

1. **Analyze** user story and acceptance criteria
2. **Generate** positive scenarios (happy path)
3. **Generate** negative scenarios (error paths)
4. **Generate** boundary value scenarios
5. **Generate** edge case scenarios
6. **Classify** scenarios by test type (smoke, sanity, regression, e2e)

## Techniques Applied
- Equivalence Partitioning
- Boundary Value Analysis
- Decision Table Testing
- State Transition Testing
- Error Guessing

## Rules
- Every acceptance criterion must have at least one positive scenario
- Every acceptance criterion must have at least one negative scenario
- Critical flows must have boundary value scenarios
- Scenarios must be independent and atomic
- Must link every scenario to a requirement
- Must generate both positive and negative scenarios

## Artifacts Produced
1. `features/{category}/{feature}.feature` - Gherkin files
2. `traceability/rtm.json` - Traceability matrix entries

## Interaction Pattern
```
Input: User Stories + Acceptance Criteria →
  Process: Analyze → Design → Generate → Classify →
    Output: Test Scenarios + Feature Files + RTM
      → Feeds: Test Case Generation, Playwright Code Generation
```

## Template

```json
{
  "storyId": "US-0001",
  "scenarios": [
    {
      "id": "TS-0001",
      "title": "Successful login with valid credentials",
      "type": "POSITIVE",
      "category": "smoke",
      "priority": "P0",
      "preconditions": ["User account exists", "User is on login page"],
      "steps": ["Enter valid email", "Enter valid password", "Click submit"],
      "expectedResult": "User redirected to dashboard"
    }
  ]
}
```

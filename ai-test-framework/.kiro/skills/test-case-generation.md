# Skill: Test Case Generation

## Role & Responsibilities
Convert test scenarios into detailed, executable test cases with precise steps and expected results. Ensures every test case is traceable, classified, and ready for automation.

- Expand scenarios into detailed test steps
- Define precise expected results
- Identify required test data
- Assign test case metadata

## Trigger
When test scenarios are approved and ready for detailed design.

## Input
- Approved test scenarios
- Application behavior specifications
- Test data requirements

## Output
- Detailed test cases in `src/test-case-management/`
- Test data requirements
- Linked traceability entries

## Process

1. **Expand** each scenario into detailed test steps
2. **Define** precise expected results for each step
3. **Identify** required test data
4. **Specify** preconditions and postconditions
5. **Assign** test case metadata (ID, priority, category)

## Rules
- Each test case must have a unique ID (TC-XXXX)
- Steps must be atomic and unambiguous
- Expected results must be verifiable
- Test data must be specified or referenced
- Preconditions must be complete
- Maximum 10 scenarios per feature file

## Artifacts Produced
1. Test case JSON files
2. Test data requirement specifications
3. RTM linkage entries

## Template

```json
{
  "id": "TC-0001",
  "scenarioId": "TS-0001",
  "storyId": "US-0001",
  "requirementId": "REQ-0001",
  "title": "Verify successful login with valid email and password",
  "priority": "P0",
  "category": "smoke",
  "preconditions": [
    "User account exists with email: test@example.com",
    "Browser is open on login page"
  ],
  "steps": [
    { "step": 1, "action": "Enter 'test@example.com' in email field", "expected": "Email is displayed in field" },
    { "step": 2, "action": "Enter valid password in password field", "expected": "Password is masked" },
    { "step": 3, "action": "Click 'Sign In' button", "expected": "Loading indicator appears" },
    { "step": 4, "action": "Wait for navigation", "expected": "Dashboard page is displayed" }
  ],
  "testData": { "email": "test@example.com", "password": "{{ENV.TEST_PASSWORD}}" },
  "postconditions": ["User is logged in", "Session token is created"],
  "automationStatus": "READY"
}
```

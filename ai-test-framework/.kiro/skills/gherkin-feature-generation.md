# Skill: Gherkin Feature Generation

## Role & Responsibilities
Generate Gherkin feature files from test cases following BDD best practices. Bridges the gap between business-readable specifications and automation code.

- Group related test cases into features
- Write scenarios with Given-When-Then steps
- Apply proper tagging for categorization
- Create data-driven Scenario Outlines

## Trigger
When test cases are ready for BDD representation.

## Input
- Test cases (grouped by feature)
- Test data variations
- Business context

## Output
- Feature files in `src/test-case-management/features/{category}/`
- Tagged and categorized scenarios

## Process

1. **Group** related test cases by feature
2. **Write** Feature description with business context
3. **Create** Background for shared preconditions
4. **Write** Scenarios with Given-When-Then steps
5. **Add** Scenario Outlines for data-driven tests
6. **Tag** scenarios with category and priority

## Rules
- One feature per file
- Background for shared Given steps only
- Maximum 10 scenarios per feature file
- Use Scenario Outline for 3+ data variations
- Tags must include category and priority
- Steps must be reusable across scenarios

## Artifacts Produced
1. `features/{category}/{feature-name}.feature` - Feature files

## Template

```gherkin
@regression @authentication
Feature: User Authentication
  As a registered user
  I want to log in to the application
  So that I can access my personalized content

  Background:
    Given the application is accessible
    And I am on the login page

  @smoke @p0
  Scenario: Successful login with valid credentials
    Given I have a valid user account
    When I enter my email "test@example.com"
    And I enter my password
    And I click the sign in button
    Then I should be redirected to the dashboard
    And I should see my username in the header

  @regression @p1
  Scenario Outline: Login validation for invalid inputs
    When I enter email "<email>"
    And I enter password "<password>"
    And I click the sign in button
    Then I should see error message "<error>"

    Examples:
      | email | password | error |
      | invalid | pass123 | Invalid email format |
      | test@example.com | wrong | Invalid credentials |
      | | pass123 | Email is required |
```

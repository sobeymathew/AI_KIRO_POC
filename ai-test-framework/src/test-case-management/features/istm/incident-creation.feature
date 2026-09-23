# Azure DevOps Work Item: 47
# Test Cases: #48 (E2E happy path), #49 (mandatory validation), #50 (dependent Sub Category)
# Requirement: Successful Incident Creation with All Mandatory Fields
# Page Object: src/playwright/pages/incident-creation.page.ts
# Spec: src/playwright/tests/smoke/incident-creation.spec.ts

@smoke @incident
Feature: Incident Creation
  As a Service Desk User
  I want to create an incident by providing all mandatory details
  So that the incident is logged in the system and assigned a unique incident number for tracking

  Background:
    Given the user is logged in to the ITSM portal
    And the user has access to the Incident Management module

  @smoke @p0 @e2e
  Scenario: Successful incident creation with all mandatory fields
    When the user navigates to the Incident menu and selects Create Incident
    And enters a valid value in the "Requested For" field
    And selects a valid "Urgency" value
    And selects a valid "Category" value
    And selects a valid "Sub Category" value
    And enters "Test incident for validation" as the Brief Description
    And enters "This is a test incident created to verify the creation workflow" as the Detailed Description
    And clicks the Submit button
    Then the system should successfully create the incident
    And a success confirmation message should be displayed
    And a unique Incident Number should be generated and displayed to the user
    And no application errors should be displayed

  @regression @p1
  Scenario: Mandatory field validations on incident creation form
    When the user navigates to the Incident menu and selects Create Incident
    And leaves all mandatory fields empty
    And clicks the Submit button
    Then validation messages should be displayed for each empty mandatory field
    And the incident should not be created

  @regression @p1
  Scenario: Sub Category options depend on the selected Category
    When the user navigates to the Incident menu and selects Create Incident
    And selects a "Category" value
    Then the "Sub Category" options should reflect the selected Category
    When the user selects a different "Category" value
    Then the "Sub Category" options should update to match the newly selected Category

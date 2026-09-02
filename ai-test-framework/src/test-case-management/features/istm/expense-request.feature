# Azure DevOps Work Item: 14
# Test Cases: 16 (E2E happy path), 17 (mandatory validation), 18 (Requested By read-only), 19 (file upload negative)
# Requirement: Create Expense Request via Service Catalog

@smoke @istm @expense
Feature: Expense Request
  As an employee
  I want to create and submit an Expense Request through the Service Catalog
  So that the Expense Team can review and process my expense-related request efficiently

  Background:
    Given I am logged in to the ITSM portal

  @smoke @p0 @e2e
  Scenario: Create an Expense Request successfully with all mandatory fields
    Given I click on the "Service Request" menu
    And I click on "Service Catalog"
    And I click "Request" under "Expense Request"
    Then the "Expense Request" form should be displayed
    And the "Requested By" field should be auto-populated with the logged-in user's name
    And the "Requested By" field should be read-only
    When I enter a valid user in the "Requested For" field
    And I select a value from the "Category" dropdown
    And I upload a supported file of size less than or equal to 4 MB
    And I click the "Submit" button
    Then the Expense Request should be created successfully
    And a success confirmation message should be displayed
    And a unique request number should be generated

  @regression @p1
  Scenario: Mandatory field validation on Expense Request form
    Given the "Expense Request" form is displayed
    When I leave the "Requested For" and "Category" fields empty
    And I click the "Submit" button
    Then validation errors should be displayed for the mandatory fields
    And the request should not be submitted

  @regression @p1
  Scenario: Requested By field is auto-populated and read-only
    Given the "Expense Request" form is displayed
    Then the "Requested By" field should show the logged-in user's name
    And the "Requested By" field should be read-only

  @regression @p2
  Scenario: File upload rejects unsupported format or file larger than 4 MB
    Given the "Expense Request" form is displayed
    When I upload a file larger than 4 MB
    Then the file should be rejected with a size-limit error
    When I upload a file of an unsupported format
    Then the file should be rejected with an unsupported-format error

# Source: Direct user story (Word document)
# User Story: src/test-case-management/user-stories/expense-request.md
# Story ID: SR-EXP-001

@istm @service-request @expense
Feature: Expense Request
  As an employee
  I want to create and submit an Expense Request through the Service Catalog
  So that the Expense Team can review and process my expense-related request efficiently

  Background:
    Given the application is accessible
    And I am logged into the application

  @smoke @p0
  Scenario: Successful expense request submission with mandatory fields
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Expense Request"
    Then the "Expense Request" form should be displayed
    And the "Requested By" field should be auto-populated with the logged-in user
    And the "Requested By" field should be read-only
    When I enter a valid user in the "Requested For" field
    And I select a value from the "Category" dropdown
    And I click the "Submit" button
    Then the request should be submitted successfully
    And a success confirmation message should be displayed
    And a unique request number should be generated

  @regression @p1
  Scenario: Mandatory field validation - submit with empty fields
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Expense Request"
    When I leave all mandatory fields empty
    And I click the "Submit" button
    Then I should see validation errors for mandatory fields
    And the request should not be submitted

  @regression @p1
  Scenario: Verify Requested By field is read-only
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Expense Request"
    Then the "Requested By" field should display the logged-in user's name
    And the "Requested By" field should not be editable

  @e2e @p0
  Scenario: Full expense request submission and verification journey
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Expense Request"
    When I enter a valid user in the "Requested For" field
    And I select a value from the "Category" dropdown
    And I upload a supported file of size less than 4 MB
    And I click the "Submit" button
    Then the request should be submitted successfully
    And a success confirmation message should be displayed
    And a unique request number should be generated
    And no application errors should be displayed during the workflow

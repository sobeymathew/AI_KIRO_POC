# Jira: KD-9
# Story ID: SR-FAC-001
# Zephyr Test Cases: KD-T34, KD-T35

@istm @service-request @facilities
Feature: Facilities Request
  As an employee
  I want to create and submit a Facilities Request through the Service Catalog
  So that the Facilities Team can review and process my facilities-related request efficiently

  Background:
    Given the application is accessible
    And I am logged into the application

  @smoke @p0
  Scenario: Successful Facilities Request submission with mandatory fields
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Facilities Request"
    Then the "Facilities Request" form should be displayed
    And the "Requested By" field should be auto-populated with the logged-in user
    And the "Requested By" field should be read-only
    When I select a value from the "Category" dropdown
    And I click the "Submit" button
    Then the request should be submitted successfully
    And a success confirmation message should be displayed
    And a unique request number should be generated

  @regression @p1
  Scenario: Mandatory field validation - submit with empty fields
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Facilities Request"
    When I leave all mandatory fields empty
    And I click the "Submit" button
    Then I should see validation errors for mandatory fields
    And the request should not be submitted

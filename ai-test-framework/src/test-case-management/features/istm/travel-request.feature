# Source: Direct user story (chat)
# User Story: src/test-case-management/user-stories/travel-request.md
# Story ID: SR-TRV-001

@istm @service-request @travel
Feature: Travel Request
  As an employee
  I want to create and submit a Travel Request through the Service Catalog
  So that I can get travel approval for my business trip

  Background:
    Given the application is accessible
    And I am logged into the application

  @smoke @p0
  Scenario: Successful travel request submission with mandatory fields
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click on the "Travel" category
    And I click "Request" under "Travel Request"
    Then the "Travel Request" form should be displayed
    When I select "Category" as "Travel Approval"
    And I select "Sub Category" as "Domestic Billable"
    And I enter "Departure City" with a valid city
    And I enter "Arrival City" with a valid city
    And I enter "Start Date" with a future date
    And I enter "End Date" with a date after start date
    And I enter "Estimated Cost" with a valid amount
    And I enter "Purpose of Visit" with a valid description
    And I enter "Please provide additional comments here" with additional details
    And I click the "Submit" button
    Then the request should be submitted successfully
    And a success confirmation message should be displayed
    And a unique request number should be generated

  @regression @p1
  Scenario: Mandatory field validation - submit with empty fields
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click on the "Travel" category
    And I click "Request" under "Travel Request"
    When I leave all mandatory fields empty
    And I click the "Submit" button
    Then I should see validation errors for mandatory fields
    And the request should not be submitted

  @regression @p1
  Scenario: Verify end date must be after start date
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click on the "Travel" category
    And I click "Request" under "Travel Request"
    When I fill in all mandatory fields with valid data
    And I enter "End Date" with a date before the start date
    And I click the "Submit" button
    Then I should see a date validation error
    And the request should not be submitted

  @e2e @p0
  Scenario: Full travel request submission and verification journey
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click on the "Travel" category
    And I click "Request" under "Travel Request"
    When I select "Category" as "Travel Approval"
    And I select "Sub Category" as "Domestic Billable"
    And I enter "Departure City" with "New York"
    And I enter "Arrival City" with "San Francisco"
    And I enter "Start Date" with a future date
    And I enter "End Date" with a date 3 days after start date
    And I enter "Estimated Cost" with "2500"
    And I enter "Purpose of Visit" with "Client meeting for Q3 project review"
    And I enter "Please provide additional comments here" with "Flight and hotel booking required"
    And I click the "Submit" button
    Then the request should be submitted successfully
    And a success confirmation message should be displayed
    And a unique request number should be generated
    And no application errors should be displayed during the workflow

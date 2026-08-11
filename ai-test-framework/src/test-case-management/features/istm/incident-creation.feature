# Jira: KD-7
# Requirement: REQ-0002
# Zephyr Test Cases: KD-T23, KD-T24, KD-T25, KD-T26, KD-T27, KD-T28, KD-T29

@istm @incident
Feature: Incident Creation
  As an end user
  I want to create a new incident through the Incident module
  So that I can report an issue and confirm it is saved successfully

  Background:
    Given the application is accessible
    And I am logged into the application

  @smoke @p0
  Scenario: Successful incident creation with all mandatory fields
    Given I click on the "Incident" Menu
    And I click on "Create Incident" button
    And I fill in "Requested For" with a valid user
    And I select "Urgency" from the dropdown
    And I select "Category" from the dropdown
    And I select "Sub Category" from the dropdown
    And I enter "Brief Description" with "Test incident for validation"
    And I enter "Detailed Description" with "This is a test incident created to verify the creation workflow"
    And I click the "Submit" button
    Then I should see a success confirmation message
    And an Incident Number should be generated
    And no application errors should be displayed

  @e2e @p0
  Scenario: Verify created incident is visible in Incident list
    Given I have created an incident with all mandatory fields
    And I have captured the generated Incident ID
    When I navigate to the Incident list
    And I search for the Incident ID
    Then the incident should appear in the search results
    And the incident details should match the submitted information


  @regression @p1
  Scenario: Mandatory field validation - submit with empty fields
    Given I click on the "Incident" Menu
    And I click on "Create Incident" button
    Given I click on "Create Incident"
    When I leave all mandatory fields empty
    And I click the "Submit" button
    Then I should see validation errors for mandatory fields
    And the incident should not be created
    And no application errors should be displayed

  @regression @p2
  Scenario Outline: Individual mandatory field validation
    Given I click on "Create Incident"
    And I fill in all mandatory fields with valid data
    When I clear the "<field>" field
    And I click the "Submit" button
    Then I should see a validation error for "<field>"

    Examples:
      | field               |
      | Requested By        |
      | Requested For       |
      | Urgency             |
      | Category            |
      | Sub Category        |
      | Brief Description   |
      | Detailed Description|

  @regression @p3
  Scenario: Category and Sub Category dependency
    Given I click on "Create Incident"
    When I select "Category" as "Hardware"
    Then the "Sub Category" dropdown should show options related to "Hardware"
    When I change "Category" to "Software"
    Then the "Sub Category" dropdown should update to show options related to "Software"

  @regression @p4
  Scenario: Incident creation with optional attachment
    Given I click on "Create Incident"
    When I fill in all mandatory fields with valid data
    And I upload an attachment file
    And I click the "Submit" button
    Then I should see a success confirmation message
    And an Incident Number should be generated
    When I open the created incident from the Incident list
    Then the attachment should be visible in the incident details

  @smoke @p5
  Scenario: No application errors during incident creation workflow
    Given I click on "Create Incident"
    When I interact with all form fields
    And I fill in all mandatory fields with valid data
    And I click the "Submit" button
    Then no JavaScript console errors should be present
    And no application error pages should be displayed
    And the workflow should complete without unexpected behavior

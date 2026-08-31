# Jira: KD-10
# Zephyr Test Cases: KD-T36

@istm @service-request @security-exception
Feature: Security Exception Request
  As an employee
  I want to submit a Security Exception Request through the Service Catalog
  So that the security team can review and process my exception request

  Background:
    Given the application is accessible
    And I am logged into the application

  @smoke @p0
  Scenario: Successful security exception request submission
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Security Exception Request"
    Then the "Security Exception Request" form should be displayed
    And the "Requested By" field should be auto-populated with the logged-in user
    And the "Requested By" field should be read-only
    When I select a value from the "Category" dropdown
    And I fill all mandatory fields
    And I click the "Submit" button
    Then the request should be submitted successfully
    And a success confirmation message should be displayed
    And a unique request number should be generated

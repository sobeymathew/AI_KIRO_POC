# Azure DevOps Work Item: 8
# Requirement: Create Request Assessments
# Test Case: Add manually via Related Work → Add link → New item → Child → Test Case

@istm @service-request @assessments
Feature: Request Assessments
  As an employee
  I want to create and submit a Request Assessment through the Service Catalog
  So that the security team can review and process my assessment request

  Background:
    Given the application is accessible
    And I am logged into the application

  @smoke @p0
  Scenario: Successful request assessment submission
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Request Assessments"
    Then the "Request Assessments" form should be displayed
    And the "Requested By" field should be auto-populated with the logged-in user
    And the "Requested By" field should be read-only
    When I select a Subcategory
    And I select a Type
    And I enter the Client Name
    And I enter the Detailed Description
    And I click the "Submit" button
    Then the request should be submitted successfully
    And a success confirmation message should be displayed
    And a unique request number should be generated

# Jira: KD-8
# Requirement: REQ-0003
# Zephyr Test Cases: KD-T31, KD-T32, KD-T33

@istm @service-request @coi
Feature: Certificate of Insurance (COI) Request
  As a logged-in user
  I want to complete and submit a COI Request form from the Service Catalog
  So that I can request a certificate of insurance for a certificate holder

  Background:
    Given the application is accessible
    And I am logged into the application

  @smoke @p0
  Scenario: Successful COI request submission with all mandatory fields
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Certificate of Insurance Request"
    When I fill in "Requested For" with a valid user
    And I fill in "Certificate Holder's Name" with "Test Corp Ltd"
    And I fill in "Certificate Holder's Address" with "123 Test Street, Suite 100"
    And I fill in "General Coverage Amount" with "1000000"
    And I fill in "Workers Compensation Coverage Amount" with "500000"
    And I fill in "Auto Coverage Amount" with "250000"
    And I fill in "Umbrella Coverage Amount" with "2000000"
    And I fill in "Cyber/E&O Coverage Amount" with "1000000"
    And I fill in "Crime Coverage Amount" with "500000"
    And I click the "Submit" button
    Then the request should be submitted successfully
    And no application errors should be displayed

  @regression @p1
  Scenario: Mandatory field validation - submit with empty fields
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Certificate of Insurance Request"
    When I leave all mandatory fields empty
    And I click the "Submit" button
    Then I should see validation errors for mandatory fields
    And the request should not be submitted

  @e2e @p0
  Scenario: Full COI request submission and verification journey
    Given I click on the "Service Request" Menu
    And I click on "Service Catalog"
    And I click "Request" under "Certificate of Insurance Request"
    When I fill in all mandatory COI fields with valid data
    And I add an optional comment "Automated test - COI request"
    And I click the "Submit" button
    Then the request should be submitted successfully
    And no application errors should be displayed during the entire workflow

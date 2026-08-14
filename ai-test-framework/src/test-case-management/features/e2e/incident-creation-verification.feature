# Jira: KD-7
# Requirement: REQ-0002
# Source: Direct user story (chat)
# Description: E2E test that creates an incident via the ITSM portal and verifies
#              it exists in the Salesforce sandbox backend.

@e2e @incident @p0
Feature: Incident Creation and Salesforce Verification
  As a QA engineer
  I want to create an incident in the ITSM portal and verify it exists in Salesforce
  So that I can confirm the incident is persisted correctly in the backend system

  Background:
    Given the ITSM portal is accessible
    And the Salesforce sandbox is accessible

  @e2e @p0
  Scenario: Create incident and verify it exists in Salesforce sandbox
    # Step 1: Create incident in ITSM portal
    Given I am logged into the ITSM portal
    And I navigate to the Incident Creation form
    When I fill in all mandatory fields:
      | Field                | Value                                      |
      | Urgency              | Medium - Productivity Impacted             |
      | Category             | Network & Connectivity                     |
      | Sub Category         | VPN / ZTNA                                 |
      | Brief Description    | E2E verification - incident to Salesforce  |
      | Detailed Description | Automated E2E test verifying incident creation flows to Salesforce sandbox |
    And I submit the incident form
    Then I should see a success confirmation message
    And I should capture the generated Incident Number

    # Step 2: Login to Salesforce sandbox
    When I login to the Salesforce sandbox application
    Then I should be on the Salesforce home page

    # Step 3: Search the incident number in Salesforce
    When I search for the captured Incident Number in Salesforce global search
    Then the search results should display the incident

    # Step 4: Verify incident exists
    And the Incident Number in Salesforce should match the created incident
    And no application errors should be displayed

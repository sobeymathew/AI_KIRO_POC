# Requirement: REQ-0002
# Execution Date: 2026-08-14
# Incident Created: INC-000001518
# Report: docs/agentforce-e2e-execution-report.md
# Environment: milestoneitsm--itsmcopy.sandbox

@e2e @agentforce @incident-management
Feature: Agentforce E2E Incident Management Workflow
  As a QA engineer
  I want to validate the complete Agentforce Incident Management lifecycle
  So that I can verify incident creation, verification, and fulfiller follow-up

  # ═══════════════════════════════════════════════════════════════
  # SCENARIO 1: PORTAL USER CREATES INCIDENT USING AGENTFORCE
  # ═══════════════════════════════════════════════════════════════

  @e2e @p0 @portal @incident-creation
  Scenario: Portal user creates incident via Agentforce conversational flow
    Given I am logged into the ITSM portal as a portal user
    And I am on the home page
    When I click the Agentforce icon to open the chat panel
    And I request "I need to create an incident. My laptop is showing a blue screen error every time I open Microsoft Outlook. It started this morning after the Windows update."
    And Agentforce asks for the category and I select "Software"
    And Agentforce asks for the subcategory and I select "Productivity Suite"
    And Agentforce asks for a brief description and I provide "Blue screen error when opening Microsoft Outlook after Windows update"
    And Agentforce asks for a detailed description and I provide the full issue details
    Then Agentforce confirms the incident is created
    And an incident number in format INC-XXXXXXXXX is displayed
    And the conversation completes without errors

  @e2e @p0 @portal @verification
  Scenario: Verify created incident exists in Salesforce backend
    Given an incident was created via Agentforce with number "INC-000001518"
    When I login to the Salesforce sandbox as a fulfiller
    And I search for "INC-000001518" in the global search
    Then the incident record is found
    And the Short Description matches "Blue screen error when opening Microsoft Outlook after Windows update"
    And the Description contains the full detailed description provided
    And the Category is "Software"
    And the Sub Category is "Productivity Suite"
    And the State is "New"
    And the Caller is "Jithin Portal user"

  # ═══════════════════════════════════════════════════════════════
  # NEGATIVE TEST CASES
  # ═══════════════════════════════════════════════════════════════

  @e2e @p0 @portal @negative
  Scenario: TC-NEG-01 - Incomplete information triggers detail request
    Given I am logged into the ITSM portal and Agentforce is open
    When I say "I want to create an incident but I don't know what category to use"
    Then Agentforce asks me to describe the issue so it can help select the category
    And no incident is created

  @e2e @p0 @portal @negative
  Scenario: TC-NEG-02 - Vague description triggers clarification
    Given I am logged into the ITSM portal and Agentforce is open
    When I say "something is not working"
    Then Agentforce asks me to describe the issue in more detail
    And no incident is created

  @e2e @p0 @portal @negative
  Scenario: TC-NEG-03 - Cancel midway prevents ticket creation
    Given I am logged into the ITSM portal and Agentforce is open
    When I say "I want to create an incident for a printer issue"
    And then I say "Actually never mind, I don't want to create a ticket. Cancel it please."
    Then Agentforce confirms no ticket was created
    And offers further assistance

  @e2e @p0 @portal @negative @bug
  Scenario: TC-NEG-04 - Long description with upfront category causes confirmation loop
    Given I am logged into the ITSM portal and Agentforce is open
    When I say "I need to create an incident. Category: Hardware. Subcategory: Laptop/Desktop."
    And I provide the brief description when asked
    And I provide a very long detailed description (500+ characters)
    And Agentforce asks "Reply yes to proceed" and I reply "yes"
    Then Agentforce should create the incident
    # ACTUAL RESULT: BUG - Agent loops asking "Reply yes" repeatedly without creating

  @e2e @p0 @portal @negative
  Scenario: TC-NEG-05 - Short description below minimum is rejected
    Given I am logged into the ITSM portal and Agentforce is open
    When I say "Create incident. Category: Email & Collaboration. Subcategory: Collaboration Tool. Short description: fix it"
    Then Agentforce enforces the 20-character minimum
    And asks for a proper detailed description
    And no incident is created

  # ═══════════════════════════════════════════════════════════════
  # SCENARIO 2: FULFILLER FOLLOWS UP INCIDENT USING AGENTFORCE
  # ═══════════════════════════════════════════════════════════════

  @e2e @p0 @fulfiller @blocked
  Scenario: Fulfiller uses Agentforce to summarize incident
    Given I am logged into Salesforce as a fulfiller
    And I am viewing incident "INC-000001518"
    When I open the Agentforce panel from the header
    And I ask "Summarize incident INC-000001518"
    Then Agentforce should retrieve and display the incident summary
    # ACTUAL RESULT: BLOCKED - "I do not currently have access to the details of this incident"

  @e2e @p0 @fulfiller @blocked
  Scenario: Fulfiller uses Agentforce to update incident status
    Given I am logged into Salesforce as a fulfiller
    And I am viewing incident "INC-000001518"
    When I ask Agentforce to "Change status of INC-000001518 to In Progress"
    Then Agentforce should update the incident status
    # ACTUAL RESULT: BLOCKED - Data access restriction prevents all fulfiller operations

  @e2e @p0 @fulfiller @blocked
  Scenario: Fulfiller uses Agentforce to add work notes
    Given I am logged into Salesforce as a fulfiller
    And I am viewing incident "INC-000001518"
    When I ask Agentforce to "Add work notes to INC-000001518: Investigating the Windows update KB5039211 compatibility with Outlook"
    Then Agentforce should add the work notes to the incident
    # ACTUAL RESULT: BLOCKED - Data access restriction

  @e2e @p0 @fulfiller @blocked
  Scenario: Fulfiller uses Agentforce to resolve incident
    Given I am logged into Salesforce as a fulfiller
    And I am viewing incident "INC-000001518" with status "In Progress"
    When I ask Agentforce to "Resolve INC-000001518 with resolution: Rolled back Windows update KB5039211. Outlook now opens without BSOD."
    Then Agentforce should resolve the incident
    And resolution notes are captured
    # ACTUAL RESULT: BLOCKED - Data access restriction

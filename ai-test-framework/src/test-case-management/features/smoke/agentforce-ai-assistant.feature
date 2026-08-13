# Requirement: REQ-0002
# User Stories: US-0002, US-0003, US-0004, US-0005, US-0006
# Epic: Agentforce AI Assistant for Self-Service Portal and Service Management

@smoke @agentforce
Feature: Agentforce AI Assistant - Smoke Tests
  As a requestor
  I want to access and interact with the Agentforce AI Assistant on the self-service portal
  So that I can receive assistance, resolve issues, and raise tickets conversationally

  Background:
    Given I am logged in to the self-service portal
    And I am on the home page
    And the Agentforce icon is displayed on the home page

  # --- US-0002: Access AI Assistant from Self-Service Portal ---

  @smoke @p0 @access
  Scenario: Agentforce icon is visible on home page after login
    When the home page loads
    Then the Agentforce icon is displayed
    And the icon is clickable

  @smoke @p0 @access
  Scenario: AI Assistant opens and greets user when icon is clicked
    When I click the Agentforce icon on the home page
    Then the AI Assistant panel opens
    And the assistant greets me with a welcome message
    And the assistant explains its capabilities

  @smoke @p0 @access
  Scenario: User identity is recognized when interacting with assistant
    When I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    Then my identity is automatically recognized
    And the assistant addresses me by name

  # --- US-0003: Natural Language Issue Understanding ---

  @smoke @p0 @nlp
  Scenario: Assistant identifies intent from natural language input
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe my issue as "My laptop cannot connect to the VPN"
    Then the assistant identifies the intent as a connectivity issue
    And the assistant offers relevant assistance options

  @smoke @p0 @nlp
  Scenario: Assistant asks clarifying questions on low confidence
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe my issue as "something is broken"
    Then the assistant asks clarifying questions to understand the issue
    And the conversation context is maintained

  # --- US-0004: Knowledge Article Resolution ---

  @smoke @p0 @knowledge
  Scenario: Assistant resolves issue with knowledge article
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I ask "How do I reset my password"
    Then the assistant retrieves a relevant knowledge article
    And the source knowledge article is displayed with the response

  @smoke @p0 @knowledge
  Scenario: Assistant offers ticket creation when knowledge is insufficient
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe an issue that has no matching knowledge article
    Then the assistant informs me that no relevant knowledge is available
    And the assistant offers to create a ticket for further assistance

  # --- US-0005: Conversational Incident Creation ---

  @smoke @p0 @incident-creation
  Scenario: Assistant creates incident after gathering information and confirmation
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I have described my issue as "My email is not working since this morning"
    And the assistant has gathered all required information
    When the assistant presents a summary for my review
    And I confirm the incident creation
    Then an incident is created successfully
    And the incident number is displayed
    And a link to the incident record is provided

  @smoke @p0 @incident-creation
  Scenario: Assistant requests missing mandatory details
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I have described my issue briefly as "network issue"
    When the assistant prepares to create an incident
    Then the assistant requests the missing mandatory details
    And it does not create the incident until all required fields are provided

  # --- US-0006: Record Type Classification ---

  @smoke @p0 @classification
  Scenario: Failure or outage is classified as Incident
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe "The CRM application is down and I cannot access any records"
    Then the assistant classifies the request as an Incident

  @smoke @p0 @classification
  Scenario: Request for access is classified as Service Request
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe "I need access to the Finance shared drive"
    Then the assistant classifies the request as a Service Request

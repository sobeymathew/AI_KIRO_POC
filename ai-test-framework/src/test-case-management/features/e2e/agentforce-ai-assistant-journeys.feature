# Requirement: REQ-0002
# User Stories: US-0002, US-0003, US-0004, US-0005, US-0006, US-0007, US-0008, US-0012
# Test Cases: TC-0040 through TC-0045

@e2e @agentforce
Feature: Agentforce AI Assistant - End-to-End User Journeys
  As a requestor or fulfiller
  I want to complete full workflows through the AI Assistant
  So that I can resolve issues, create tickets, and manage my requests end-to-end

  Background:
    Given I am logged in to the self-service portal
    And I am on the home page

  @e2e @p0 @knowledge-deflection
  Scenario: E2E - Requestor resolves issue through knowledge article without ticket creation
    When I click the Agentforce icon
    And the AI Assistant panel opens with greeting
    And I ask "How do I connect to the corporate VPN from home"
    And the assistant provides a knowledge article response
    And I confirm "Yes that resolved my issue"
    Then no ticket is created
    And the interaction is logged as a deflection
    And the assistant offers further assistance

  @e2e @p0 @incident-creation
  Scenario: E2E - Requestor creates an incident through conversational interaction
    When I click the Agentforce icon
    And I describe "My email application has been crashing every time I open it since this morning"
    And the assistant classifies the request as an Incident
    And I provide details "It affects Outlook on my Windows laptop, error code 0x800CCC0E"
    And I confirm the incident creation
    Then an incident is created successfully
    And the incident number and link are displayed
    And the ticket has Source = Agentforce and Channel = Portal

  @e2e @p0 @ticket-management
  Scenario: E2E - Requestor checks ticket status and adds information
    When I click the Agentforce icon
    And I ask "What is the status of my tickets?"
    And the assistant displays ticket information
    And I request to add a comment to my latest ticket
    And I provide "The issue is now affecting 5 more users on the same floor"
    Then the comment is saved successfully
    And the assistant confirms the update

  @e2e @p0 @clarification
  Scenario: E2E - Ambiguous request requires clarification before ticket creation
    When I click the Agentforce icon
    And I say "I have a problem with my account"
    And the assistant asks clarifying questions
    And I clarify "I cannot log in to the HR system"
    And I further clarify "I am getting an error saying my account is locked"
    And the assistant classifies as Incident
    And I confirm creation
    Then an incident is created with full conversation context

  @e2e @p0 @knowledge-to-ticket
  Scenario: E2E - Knowledge article insufficient leads to incident creation
    When I click the Agentforce icon
    And I ask "How do I fix the printer error on the 3rd floor"
    And the assistant provides a knowledge article
    And I say "That didn't help, the issue is still there"
    And the assistant offers to create a ticket
    And I confirm and provide details
    Then an incident is created with knowledge article interaction in history
    And the incident number and link are displayed

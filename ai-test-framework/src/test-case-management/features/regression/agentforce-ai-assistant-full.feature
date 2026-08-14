# Requirement: REQ-0002
# User Stories: US-0003, US-0004, US-0005, US-0006, US-0007, US-0008, US-0010, US-0011
# Test Cases: TC-0018 through TC-0038

@regression @agentforce
Feature: Agentforce AI Assistant - Full Regression Coverage
  As a requestor
  I want the AI Assistant to handle edge cases, maintain context, and manage tickets correctly
  So that I can rely on it for all my IT service needs

  Background:
    Given I am logged in to the self-service portal
    And I am on the home page
    And I click the Agentforce icon to open the AI Assistant

  # --- US-0003: NLP Edge Cases ---

  @regression @p1 @nlp
  Scenario: Out-of-scope request is identified with escalation path
    When I ask "What is the stock price of our company today?"
    Then the assistant identifies the request as out-of-scope
    And appropriate escalation paths are provided

  @regression @p1 @nlp
  Scenario: Conversation context is maintained across multiple turns
    When I say "I have a VPN issue"
    And I follow up with "It started after the update yesterday"
    Then the assistant response incorporates both VPN and update context

  @regression @p1 @nlp
  Scenario: Assistant handles input with typos and grammatical errors
    When I type "my compter is not wrking and i cant acess email"
    Then the assistant identifies the intent as a computer/email issue
    And relevant assistance is provided

  # --- US-0004: Knowledge Deflection ---

  @regression @p1 @knowledge @deflection
  Scenario: User confirms resolution via knowledge article - ticket deflection
    When I ask "How do I connect to VPN from home"
    And the assistant provides a knowledge article answer
    And I confirm "Yes that answers my question"
    Then no ticket is created
    And the interaction is logged as a deflection

  # --- US-0005: Incident Cancel Flow ---

  @regression @p1 @incident-creation
  Scenario: User cancels during incident confirmation - no ticket created
    When I describe "My laptop is overheating and shutting down"
    And I say "No, don't create a ticket"
    Then no incident is created
    And the assistant asks if further assistance is needed

  # --- US-0006: Classification Edge Cases ---

  @regression @p1 @classification
  Scenario: Ambiguous request triggers clarification for ticket type
    When I say "I need something done with my account"
    Then the assistant asks clarifying questions
    When I clarify "I am locked out of my account"
    Then the assistant classifies this as an Incident

  @regression @p1 @classification
  Scenario: User can correct proposed ticket type before submission
    When I say "I need help with my email"
    And I correct "Actually this is an incident, my email stopped working"
    Then the assistant updates the classification to Incident

  # --- US-0007: Ticket Status ---

  @regression @p1 @ticket-status
  Scenario: User views list of open tickets via assistant
    When I ask "What are my open tickets?"
    Then the assistant displays ticket information or indicates no tickets

  @regression @p1 @ticket-status
  Scenario: User requests details for a specific ticket
    When I ask "What is the status of my latest ticket?"
    Then the assistant provides ticket status details

  @regression @p1 @ticket-status @security
  Scenario: Unauthorized ticket information is not disclosed
    When I ask "What is the status of INC-99998?"
    Then the assistant does not disclose any unauthorized ticket details

  @regression @p1 @ticket-status
  Scenario: Clear message when user has no open tickets
    When I ask "Show me my tickets"
    Then the assistant provides a clear response about ticket status

  # --- US-0008: Ticket Update ---

  @regression @p1 @ticket-update
  Scenario: Adding comment to existing open ticket via assistant
    When I say "I want to add information to my latest ticket"
    Then the assistant prompts for the information to add

  @regression @p1 @ticket-update
  Scenario: Attempt to update closed ticket provides explanation
    When I say "I want to update a ticket that was already closed"
    Then the assistant explains the limitation and offers alternatives

  # --- US-0010: Auto-categorization ---

  @regression @p1 @categorization
  Scenario: Short Description and Description are generated from conversation
    When I describe "My laptop keeps showing blue screen errors whenever I open Outlook. It started 2 days ago after the Windows update."
    Then the assistant processes and acknowledges the detailed issue

  @regression @p1 @categorization
  Scenario: High-confidence classification populates Category and Subcategory
    When I describe "I cannot connect to the corporate VPN from my laptop. Error: connection timeout."
    Then the assistant identifies this as a network/VPN issue with high confidence

  @regression @p1 @categorization
  Scenario: Low-confidence classification leaves fields for manual triage
    When I describe "Something is wrong with my system, not sure if it's hardware or software"
    Then the assistant asks for clarification due to low confidence

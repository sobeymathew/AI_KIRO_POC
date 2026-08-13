# Requirement: REQ-0002
# User Stories: US-0002, US-0003, US-0004, US-0005, US-0006, US-0007, US-0008, US-0009, US-0010, US-0011, US-0012
# Epic: Agentforce AI Assistant for Self-Service Portal and Service Management

@e2e @agentforce
Feature: Agentforce AI Assistant - End-to-End User Journeys
  As a requestor or fulfiller
  I want to complete full workflows using the Agentforce AI Assistant
  So that business processes are validated from start to finish

  # --- Journey 1: Self-Service Resolution via Knowledge ---

  @e2e @p0 @knowledge-deflection
  Scenario: E2E: Requestor resolves issue through knowledge article without ticket creation
    Given I am logged in to the self-service portal
    And I am on the home page
    And the Agentforce icon is displayed on the home page
    When I click the Agentforce icon on the home page
    Then the AI Assistant panel opens
    And the assistant greets me and explains its capabilities
    And my identity is automatically recognized
    When I describe my issue as "How do I connect to the corporate VPN from home"
    Then the assistant identifies my intent as a VPN connectivity question
    And the assistant retrieves a relevant knowledge article
    And the source knowledge article is displayed with the response
    When I confirm that the article resolved my issue
    Then no ticket is created
    And the interaction is logged as a ticket deflection
    And the assistant asks if I need further assistance

  # --- Journey 2: Incident Creation from Conversation ---

  @e2e @p0 @incident-creation
  Scenario: E2E: Requestor creates an incident through conversational interaction
    Given I am logged in to the self-service portal
    And I am on the home page
    And the Agentforce icon is displayed on the home page
    When I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I describe "My email application has been crashing every time I open it since this morning"
    Then the assistant identifies the intent as a system failure
    And the assistant classifies the request as an Incident
    When the assistant asks for additional details
    And I provide "It affects Outlook on my Windows laptop, error code 0x800CCC0E"
    Then the assistant maintains the conversation context
    And gathers all required information
    When the assistant presents a summary including description, category, and classification
    And I review and confirm the incident creation
    Then an incident is created successfully
    And the incident number in format "INC-XXXXX" is displayed
    And a link to the incident record is provided
    And the ticket has Source set to "Agentforce" and channel set to "Portal"
    And the Short Description and Description are generated from conversation content
    And Category and Subcategory are populated based on AI classification
    And the ticket is routed to the appropriate resolver queue

  # --- Journey 3: Service Request Creation ---

  @e2e @p0 @service-request
  Scenario: E2E: Requestor creates a service request for new equipment
    Given I am logged in to the self-service portal
    And I am on the home page
    And the Agentforce icon is displayed on the home page
    When I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I describe "I need a new external monitor for my workstation"
    Then the assistant identifies this as a request for equipment
    And classifies it as a Service Request
    When the assistant asks for specifications
    And I provide "27 inch, 4K resolution, USB-C connectivity"
    And the assistant asks for justification
    And I provide "Current monitor is broken and under warranty replacement"
    Then the assistant presents a service request summary
    When I confirm the creation
    Then a Service Request is created successfully
    And the request number is displayed with a link to the record
    And the ticket is categorized and routed to the Hardware Provisioning queue

  # --- Journey 4: Knowledge Failure Leading to Ticket Creation ---

  @e2e @p0 @knowledge-to-ticket
  Scenario: E2E: Knowledge article insufficient leads to incident creation
    Given I am logged in to the self-service portal
    And I am on the home page
    And the Agentforce icon is displayed on the home page
    When I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I ask "How do I fix the printer error on the 3rd floor"
    Then the assistant retrieves a relevant knowledge article about printer troubleshooting
    When I indicate the article did not resolve my issue
    Then the assistant offers to create a ticket
    When I confirm I want to create a ticket
    And the assistant gathers the remaining required details
    And presents a summary for confirmation
    And I confirm the incident creation
    Then an incident is created with the conversation history as context
    And the incident number and link are displayed
    And the knowledge article interaction is recorded in the ticket history

  # --- Journey 5: Ticket Status Check and Update ---

  @e2e @p0 @ticket-management
  Scenario: E2E: Requestor checks ticket status and adds information
    Given I am logged in to the self-service portal
    And I am on the home page
    And I have an existing open incident "INC-12345"
    And the Agentforce icon is displayed on the home page
    When I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I ask "What is the status of my tickets?"
    Then the assistant displays a list of my open tickets including "INC-12345"
    When I ask "Tell me more about INC-12345"
    Then the assistant displays the detailed status and assignment information
    When I say "I want to add information to INC-12345"
    And I provide "The issue is now affecting 5 more users on the same floor"
    Then the information is saved as a customer-visible comment
    And the assigned fulfiller receives a notification of the update
    And the assistant confirms the update was added successfully

  # --- Journey 6: Ambiguous Request with Clarification Flow ---

  @e2e @p0 @clarification
  Scenario: E2E: Ambiguous request requires clarification before ticket creation
    Given I am logged in to the self-service portal
    And I am on the home page
    And the Agentforce icon is displayed on the home page
    When I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I describe "I have a problem with my account"
    Then the assistant has low confidence in the intent
    And asks clarifying questions about the nature of the problem
    When I respond "I cannot log in to the HR system"
    Then the assistant identifies this as an access/authentication issue
    And asks whether I am experiencing an error or need new access
    When I respond "I am getting an error saying my account is locked"
    Then the assistant classifies this as an Incident
    And gathers remaining details
    And presents a complete summary for confirmation
    When I confirm the incident creation
    Then the incident is created with the full conversation context
    And it is routed to the Identity and Access Management queue

  # --- Journey 7: Fulfiller Proactive Assistance Journey ---

  @e2e @p0 @proactive-assist
  Scenario: E2E: Fulfiller uses Proactive Assistance to investigate and resolve incident
    Given I am an authorized fulfiller
    And I have an assigned incident about a recurring application crash
    When I navigate to the Incident page
    Then the Proactive Assistance panel is available
    And the page performance is not negatively impacted
    When I access the Proactive Assistance panel
    And I ask "Are there similar incidents reported recently?"
    Then the Agent responds within performance expectations
    And provides relevant information about similar incidents
    When I ask "What knowledge articles relate to this issue?"
    Then the Agent returns relevant and accurate knowledge article references
    When I ask about unavailable information
    Then an appropriate message is shown explaining the limitation

  # --- Journey 8: Multi-Issue Conversation ---

  @e2e @p1 @multi-issue
  Scenario: E2E: Requestor resolves one issue via knowledge and creates ticket for another
    Given I am logged in to the self-service portal
    And I am on the home page
    And the Agentforce icon is displayed on the home page
    When I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I describe "I have two issues - my VPN keeps disconnecting and I need access to the Marketing shared drive"
    Then the assistant identifies two separate intents
    And asks which issue I would like to address first
    When I choose to address the VPN issue first
    Then the assistant retrieves a relevant knowledge article for VPN disconnection
    When I confirm the VPN issue is resolved
    Then the interaction is logged as a ticket deflection
    When the assistant asks about my second issue
    And I confirm I need access to the Marketing shared drive
    Then the assistant classifies it as a Service Request
    And gathers required details including justification
    And presents a summary for confirmation
    When I confirm
    Then a Service Request is created and details are displayed

  # --- Journey 9: Closed Ticket Update Redirects to New Ticket ---

  @e2e @p1 @ticket-lifecycle
  Scenario: E2E: Requestor attempts to update closed ticket and creates new one
    Given I am logged in to the self-service portal
    And I am on the home page
    And I have a previously closed incident "INC-99999"
    And the Agentforce icon is displayed on the home page
    When I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I say "I want to update ticket INC-99999"
    Then the assistant informs me that INC-99999 is closed
    And explains that updates cannot be added to closed tickets
    And offers the option to create a new ticket
    When I confirm I want to create a new ticket
    And I describe "The same issue from INC-99999 has reoccurred"
    Then the assistant gathers details and references the original ticket
    And presents a summary for confirmation
    When I confirm
    Then a new incident is created with reference to the original ticket
    And the incident number and link are displayed

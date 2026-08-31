# Requirement: REQ-0002
# User Stories: US-0002, US-0003, US-0004, US-0005, US-0006, US-0007, US-0008, US-0009, US-0010, US-0011, US-0012
# Epic: Agentforce AI Assistant for Self-Service Portal and Service Management

@regression @agentforce
Feature: Agentforce AI Assistant - Regression Tests
  As a requestor or fulfiller
  I want the Agentforce AI Assistant to handle all validation scenarios and edge cases
  So that the system behaves correctly under all conditions

  Background:
    Given I am logged in to the self-service portal
    And I am on the home page
    And the Agentforce icon is displayed on the home page

  # --- US-0002: Access & Availability Edge Cases ---

  @regression @p1 @access
  Scenario: Fallback message when AI Assistant is unavailable
    Given the Agentforce AI Assistant service is unavailable
    When I click the Agentforce icon on the home page
    Then I receive a clear unavailability message
    And I am provided an alternative method for raising a ticket

  @regression @p1 @access
  Scenario: Agentforce icon loads correctly on slow network connection
    Given I am on a slow network connection
    When the home page loads
    Then the Agentforce icon loads within acceptable timeout
    And a loading indicator is displayed while the assistant initializes

  @regression @p2 @access
  Scenario: Multiple browser tabs do not create session conflicts
    Given I have the portal open in multiple browser tabs
    When I click the Agentforce icon and interact with the assistant in one tab
    Then the session in the other tab is not affected

  @regression @p1 @access
  Scenario: Session timeout during assistant interaction
    Given I have clicked the Agentforce icon and have an active conversation
    When my portal session times out
    Then I am notified about the session expiry
    And I am prompted to re-authenticate

  # --- US-0003: NLP Validation & Edge Cases ---

  @regression @p1 @nlp
  Scenario: Out-of-scope request is identified with escalation path
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe a request that is outside the assistant's capabilities
    Then the assistant clearly identifies it as out-of-scope
    And provides appropriate escalation paths

  @regression @p1 @nlp
  Scenario: Conversation context is maintained across multiple turns
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe "I have a VPN issue"
    And the assistant asks for clarification
    And I respond "It started after the update yesterday"
    Then the assistant maintains context from previous messages
    And provides assistance relevant to both messages combined

  @regression @p2 @nlp
  Scenario Outline: Assistant handles various input quality scenarios
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe my issue as "<input>"
    Then the assistant responds with "<expected_behavior>"

    Examples:
      | input                                      | expected_behavior                  |
      | help                                       | asks clarifying questions          |
      | asdkjfhasdf                                | asks the user to rephrase          |
      | My laptop is broken AND I need new monitor | identifies multiple intents        |
      | The printer on 3rd floor is jammed again!! | identifies intent despite emotion  |

  @regression @p1 @nlp
  Scenario: Assistant handles input with typos and grammatical errors
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe my issue as "my compter is not wrking and i cant acess email"
    Then the assistant identifies the intent despite language errors
    And provides relevant assistance

  @regression @p2 @nlp
  Scenario: Assistant handles very long description
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe my issue with a message exceeding 1000 characters
    Then the assistant processes the entire description
    And responds with a relevant summary and next steps

  # --- US-0004: Knowledge Resolution Edge Cases ---

  @regression @p1 @knowledge
  Scenario: Multiple knowledge articles match the query
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I ask a question that matches multiple knowledge articles
    Then the assistant presents the most relevant article first
    And offers additional related articles

  @regression @p1 @knowledge
  Scenario: User confirms resolution via knowledge article - ticket deflection
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And the assistant has provided a knowledge article answer
    When I confirm that my issue is resolved
    Then no ticket is created
    And the interaction is logged as a ticket deflection

  @regression @p2 @knowledge
  Scenario: User rejects knowledge article and proceeds to ticket creation
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And the assistant has provided a knowledge article answer
    When I indicate the issue is not resolved
    Then the assistant offers to create a ticket
    And maintains the conversation context for ticket details

  @regression @p2 @knowledge
  Scenario: User explicitly requests ticket despite available knowledge
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I ask "How do I reset my password"
    And the assistant provides a knowledge article
    And I say "Just create a ticket for me"
    Then the assistant proceeds with ticket creation

  # --- US-0005: Incident Creation Validations ---

  @regression @p1 @incident-creation
  Scenario: User cancels during incident confirmation
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And the assistant has gathered information and presents a summary
    When I cancel the incident creation
    Then no incident is created
    And the assistant asks if I need further assistance

  @regression @p1 @incident-creation
  Scenario: Incident number and link displayed on successful creation
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I have confirmed incident creation
    When the incident is created successfully
    Then the incident number in format "INC-XXXXX" is displayed
    And a clickable link to the incident record is provided

  @regression @p2 @incident-creation
  Scenario: User modifies details during confirmation step
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And the assistant presents a summary for my review
    When I request changes to the summary details
    Then the assistant updates the summary with my corrections
    And presents the revised summary for confirmation

  # --- US-0006: Classification Validations ---

  @regression @p1 @classification
  Scenario: Ambiguous request triggers clarification
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe "I need something done with my account"
    Then the assistant asks clarifying questions to determine if it is an Incident or Service Request

  @regression @p1 @classification
  Scenario: User can correct proposed ticket type
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And the assistant classifies my request as a Service Request
    When I indicate it should be an Incident
    Then the assistant updates the classification to Incident
    And proceeds with the corrected ticket type

  @regression @p1 @classification
  Scenario Outline: Correct classification for various request types
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I describe "<description>"
    Then the assistant classifies it as "<ticket_type>"

    Examples:
      | description                                        | ticket_type      |
      | The application keeps crashing when I open reports | Incident         |
      | I need a new monitor for my workstation            | Service Request  |
      | VPN is down for the entire office                  | Incident         |
      | Please provision a new laptop for a new joiner     | Service Request  |
      | Cannot print to the shared printer since yesterday | Incident         |

  # --- US-0007: Ticket Status Inquiry Validations ---

  @regression @p1 @ticket-status
  Scenario: User views list of open tickets
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I have open tickets in the system
    When I ask "What are my open tickets?"
    Then the assistant displays a list of my open tickets
    And each ticket shows the ticket number and current status

  @regression @p1 @ticket-status
  Scenario: User requests details for a specific ticket
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I have an open ticket "INC-12345"
    When I ask "What is the status of INC-12345?"
    Then the assistant displays the details for that specific ticket

  @regression @p1 @ticket-status
  Scenario: Unauthorized ticket information is not disclosed
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    When I ask about a ticket that belongs to another user
    Then the assistant does not disclose any information
    And informs me that I do not have access to that ticket

  @regression @p1 @ticket-status
  Scenario: Clear message when user has no open tickets
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I have no open tickets in the system
    When I ask about my tickets
    Then the assistant provides a clear message that I have no open tickets

  # --- US-0008: Update Existing Tickets ---

  @regression @p1 @ticket-update
  Scenario: Add comment to existing open ticket
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I have an open ticket "INC-12345"
    When I say "I want to add information to INC-12345"
    And I provide "The issue is now affecting all users on the 3rd floor"
    Then the information is saved as a customer-visible comment on the ticket
    And the assigned fulfiller receives a notification

  @regression @p1 @ticket-update
  Scenario: Attempt to update a closed ticket
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I have a closed ticket "INC-99999"
    When I attempt to add information to that ticket
    Then the assistant explains that the ticket is closed
    And offers the option to create a new ticket

  # --- US-0009: Ticket Source Tracking ---

  @regression @p1 @source-tracking
  Scenario: Agentforce-created ticket is marked with correct source
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I create a ticket through the AI Assistant on the portal
    When the ticket is created
    Then the ticket has Source field set to "Agentforce"
    And the originating channel is stored as "Portal"

  @regression @p2 @source-tracking
  Scenario: Agentforce tickets can be filtered in reports
    Given tickets exist that were created by Agentforce
    When a fulfiller filters tickets by Source = Agentforce
    Then only Agentforce-created tickets are displayed

  # --- US-0010: AI-Powered Categorization ---

  @regression @p1 @categorization
  Scenario: Short Description and Description generated from conversation
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I describe "My laptop keeps showing blue screen errors whenever I open Outlook"
    When the assistant creates a ticket
    Then the Short Description is generated from conversation content
    And the full Description captures the conversation details

  @regression @p1 @categorization
  Scenario: High-confidence classification populates Category and Subcategory
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I describe a clear network connectivity issue
    When the assistant creates a ticket with high classification confidence
    Then Category and Subcategory are populated automatically

  @regression @p1 @categorization
  Scenario: Low-confidence classification leaves fields for manual triage
    Given I click the Agentforce icon on the home page
    And the AI Assistant panel opens
    And I describe an ambiguous issue spanning multiple categories
    When the assistant creates a ticket with low classification confidence
    Then classification fields remain blank or are flagged for manual triage

  @regression @p1 @categorization
  Scenario: Fulfiller can override AI-generated classifications
    Given a ticket was created with AI-populated Category and Subcategory
    When a fulfiller reviews the ticket
    Then they can override the AI-generated classifications

  # --- US-0011: Intelligent Ticket Routing ---

  @regression @p1 @routing
  Scenario: Ticket matching routing keywords is assigned to correct queue
    Given a ticket is created with content matching "VPN" routing keywords
    When the routing engine processes the ticket
    Then the ticket is assigned to the Network Support resolver queue

  @regression @p1 @routing
  Scenario: Multiple matching rules applies highest-priority rule
    Given a ticket matches both "Network" and "Security" routing keywords
    When the routing engine processes the ticket
    Then the highest-priority routing rule is applied

  @regression @p1 @routing
  Scenario: No matching rule assigns to default queue
    Given a ticket does not match any configured routing keywords
    When the routing engine processes the ticket
    Then the ticket is assigned to the default queue

  @regression @p2 @routing
  Scenario: Routing decision is visible to fulfillers
    Given a ticket has been auto-routed by the AI
    When a fulfiller views the ticket
    Then the routing decision and reason are visible

  # --- US-0012: Proactive Assistance for Fulfillers ---

  @regression @p1 @proactive-assist
  Scenario: Authorized fulfiller accesses Proactive Assistance
    Given I am an authorized fulfiller on an Incident page
    When I access the Proactive Assistance panel
    Then the Agent is available for interaction
    And I can ask questions about the incident

  @regression @p1 @proactive-assist
  Scenario: Agent responds within performance expectations
    Given I am interacting with the Agent on an Incident page
    When I ask a question
    Then the Agent responds within agreed performance expectations

  @regression @p1 @proactive-assist
  Scenario: Appropriate message when information is unavailable
    Given I am interacting with the Agent on an Incident page
    When I ask about information the Agent cannot provide
    Then an appropriate message is shown explaining unavailability

  @regression @p1 @proactive-assist
  Scenario: Unauthorized user cannot access Proactive Assistance
    Given I am not an authorized fulfiller
    When I attempt to access Proactive Assistance on an Incident page
    Then access is restricted
    And I cannot interact with the Agent

  @regression @p1 @proactive-assist
  Scenario: Incident page performance is not impacted by Proactive Assistance
    Given Proactive Assistance is enabled on the Incident page
    When the Incident page loads
    Then the page performance and loading behavior are not negatively impacted

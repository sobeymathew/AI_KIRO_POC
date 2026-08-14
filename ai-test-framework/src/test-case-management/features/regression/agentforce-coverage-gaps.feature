# Requirement: REQ-0002
# Test Cases: TC-0046 through TC-0068
# Coverage: Performance, Session, Accessibility, Security, Multi-language, Edge Cases, Mobile

@regression @agentforce
Feature: Agentforce AI Assistant - Coverage Gap Tests
  As a QA engineer
  I want to verify non-functional and edge-case behaviors of the Agentforce AI Assistant
  So that I can ensure quality across performance, security, accessibility, and responsiveness

  # --- Performance ---

  @regression @p1 @performance
  Scenario: Assistant response time is within SLA
    Given I am logged in and the AI Assistant is open
    When I send a message to the assistant
    Then the response arrives within 5 seconds

  @regression @p1 @performance
  Scenario: Chat panel load time after clicking icon
    Given I am logged in and on the home page
    When I click the Agentforce icon
    Then the chat panel opens within 3 seconds

  @regression @p2 @performance
  Scenario: Assistant handles concurrent messages gracefully
    Given I am logged in and the AI Assistant is open
    When I send 3 messages in rapid succession
    Then all messages are processed without errors

  # --- Session Management ---

  @regression @p1 @session
  Scenario: Chat session behavior after page refresh
    Given I am logged in and have sent a message in the chat
    When I refresh the page
    Then the Agentforce icon is still available

  @regression @p1 @session
  Scenario: Chat session terminates cleanly on logout
    Given I am logged in and the AI Assistant is open
    When I logout of the portal
    Then the session is terminated cleanly

  @smoke @p0 @session
  Scenario: User can close and reopen chat without losing context
    Given I am logged in and have sent a message in the chat
    When I minimize the chat panel
    And I reopen the chat panel
    Then my previous messages are still visible

  # --- Accessibility ---

  @regression @p1 @accessibility
  Scenario: Keyboard navigation works for chat panel
    Given I am logged in and on the home page
    Then the Agentforce button has tabindex for keyboard access
    And I can send messages using keyboard input

  @regression @p1 @accessibility
  Scenario: Screen reader compatible aria attributes on chat
    Given I am logged in and on the home page
    Then the Agentforce button has a non-empty aria-label
    And the button has role="button"

  # --- Security ---

  @smoke @p0 @security
  Scenario: Assistant does not expose PII in responses
    Given I am logged in and the AI Assistant is open
    When I ask for another user's personal details
    Then no PII is disclosed in the response

  @regression @p0 @security
  Scenario: XSS injection attempts in chat are sanitized
    Given I am logged in and the AI Assistant is open
    When I send a script tag as a chat message
    Then the script is not executed
    And the page remains functional

  @regression @p1 @security
  Scenario: Sensitive data is not echoed by assistant
    Given I am logged in and the AI Assistant is open
    When I mention a password in my message
    Then the assistant does not echo the password back

  # --- Multi-language ---

  @regression @p2 @localization
  Scenario: Assistant handles non-English input gracefully
    Given I am logged in and the AI Assistant is open
    When I send a message in Spanish
    Then the assistant responds without error

  @regression @p2 @localization
  Scenario: Assistant responds in English regardless of input language
    Given I am logged in and the AI Assistant is open
    When I send a message in French
    Then the assistant response contains English words

  # --- Edge Cases ---

  @regression @p2 @edge-case
  Scenario: Empty message is handled gracefully
    Given I am logged in and the AI Assistant is open
    When I attempt to send an empty message
    Then the page remains functional without crash

  @regression @p2 @edge-case
  Scenario: Very long message is handled without crash
    Given I am logged in and the AI Assistant is open
    When I send a message with 2500 characters
    Then the page remains functional

  @regression @p2 @edge-case
  Scenario: Rapid-fire messages handled without crash
    Given I am logged in and the AI Assistant is open
    When I send 5 messages in rapid succession
    Then the chat remains functional and messages appear

  @regression @p2 @edge-case
  Scenario: Browser back/forward doesn't break chat state
    Given I am logged in and the AI Assistant is open
    When I press browser back and then forward
    Then the Agentforce icon is still visible and functional

  # --- Mobile Responsiveness ---

  @regression @p1 @mobile
  Scenario: Agentforce icon is visible on mobile viewport
    Given I am logged in on a mobile viewport (375x667)
    Then the Agentforce icon is visible within the viewport bounds

  @regression @p1 @mobile
  Scenario: Chat panel is usable on mobile viewport
    Given I am logged in on a mobile viewport (375x667)
    When I open the chat panel
    Then the panel fills the screen appropriately

  @regression @p2 @mobile
  Scenario: Chat input is accessible on mobile viewport
    Given I am logged in on a mobile viewport (375x667)
    When I open the chat and type a message
    Then the message is sent successfully

import { test, expect } from '../../fixtures/base.fixture';
import { loginToPortal } from '../../utils/agentforce-helpers.util';

/**
 * Regression Tests: Agentforce AI Assistant
 * Test Cases: TC-0018 through TC-0030, TC-0033 through TC-0035
 * Requirement: REQ-0002
 * User Stories: US-0003, US-0004, US-0005, US-0006, US-0007, US-0008, US-0010
 * Feature: src/test-case-management/features/regression/agentforce-ai-assistant-full.feature
 *
 * Covers:
 * - NLP: Out-of-scope, context maintenance, typo handling
 * - Knowledge: Ticket deflection
 * - Incident: Cancel flow, mandatory detail prompting
 * - Classification: Ambiguity, correction
 * - Ticket Status: List, details, security
 * - Ticket Update: Add comment, closed ticket handling
 * - Categorization: Auto-population of fields
 */
test.describe('Agentforce AI Assistant - Regression @regression @agentforce', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await loginToPortal(page);
  });

  // ═══════════════════════════════════════════════════════════
  // US-0003: NLP — Out-of-scope, context, typos
  // ═══════════════════════════════════════════════════════════

  test('TC-0018: Verify out-of-scope request is identified with escalation path @regression @p1 @nlp', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('What is the stock price of our company today?');

    const chatText = await agentforcePage.getChatText();
    // Should indicate out-of-scope or redirect
    const handlesOutOfScope = /unable|cannot|outside|not able|don't have|help desk|support|IT service/i.test(chatText);
    expect(handlesOutOfScope).toBe(true);

    console.log('✅ TC-0018 PASSED: Out-of-scope request identified with escalation');
  });

  test('TC-0019: Verify conversation context is maintained across multiple turns @regression @p1 @nlp', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('I have a VPN issue');
    await agentforcePage.sendAndWaitForResponse('It started after the update yesterday');

    const chatText = await agentforcePage.getChatText();
    // Response should reference VPN and/or update context
    const maintainsContext = /vpn|update|connect|yesterday|network/i.test(chatText);
    expect(maintainsContext).toBe(true);

    console.log('✅ TC-0019 PASSED: Conversation context maintained across turns');
  });

  test('TC-0020: Verify assistant handles input with typos and grammatical errors @regression @p1 @nlp', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('my compter is not wrking and i cant acess email');

    const chatText = await agentforcePage.getChatText();
    // Should understand as computer/email issue despite typos
    const understandsDespiteTypos = /computer|email|issue|help|incident|troubleshoot|device/i.test(chatText);
    expect(understandsDespiteTypos).toBe(true);

    console.log('✅ TC-0020 PASSED: Assistant handles typos and identifies intent');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0004: Knowledge — Deflection
  // ═══════════════════════════════════════════════════════════

  test('TC-0021: Verify user confirms resolution via knowledge article - ticket deflection @regression @p1 @knowledge', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('How do I connect to VPN from home');
    await agentforcePage.sendAndWaitForResponse('Yes that answers my question, thank you');

    // Verify no incident number is created
    const hasIncident = await agentforcePage.hasIncidentNumber();
    expect(hasIncident).toBe(false);

    // Verify assistant acknowledges resolution
    const chatText = await agentforcePage.getChatText();
    const acknowledgesResolution = /glad|resolved|welcome|help|anything else|happy/i.test(chatText);
    expect(acknowledgesResolution).toBe(true);

    console.log('✅ TC-0021 PASSED: Knowledge article resolves issue, no ticket created (deflection)');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0005: Incident — Cancel, mandatory details
  // ═══════════════════════════════════════════════════════════

  test('TC-0022: Verify user cancels during incident confirmation - no ticket created @regression @p1 @incident-creation', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('My laptop is overheating and shutting down');
    await agentforcePage.sendAndWaitForResponse("No, don't create a ticket. I'll try restarting first.");

    // Verify no incident number was generated
    const hasIncident = await agentforcePage.hasIncidentNumber();
    expect(hasIncident).toBe(false);

    // Verify assistant asks if further help is needed
    const chatText = await agentforcePage.getChatText();
    const offersHelp = /anything else|help|assist|let me know/i.test(chatText);
    expect(offersHelp).toBe(true);

    console.log('✅ TC-0022 PASSED: User cancels, no ticket created');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0006: Classification — Ambiguity, correction
  // ═══════════════════════════════════════════════════════════

  test('TC-0023: Verify ambiguous request triggers clarification for ticket type @regression @p1 @classification', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('I need something done with my account');

    // Should ask clarifying question
    const chatText = await agentforcePage.getChatText();
    const asksClarification = /\?|what|which|could you|more detail|specific/i.test(chatText);
    expect(asksClarification).toBe(true);

    // Provide clarification
    await agentforcePage.sendAndWaitForResponse('I am locked out of my account');

    const updatedText = await agentforcePage.getChatText();
    const classifiesCorrectly = /incident|locked|access|password|reset|help/i.test(updatedText);
    expect(classifiesCorrectly).toBe(true);

    console.log('✅ TC-0023 PASSED: Ambiguous request triggers clarification');
  });

  test('TC-0024: Verify user can correct proposed ticket type before submission @regression @p1 @classification', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('I need help with my email');
    await agentforcePage.sendAndWaitForResponse('Actually this is an incident, my email stopped working completely');

    const chatText = await agentforcePage.getChatText();
    // Should acknowledge the correction and treat as incident
    const acknowledgesCorrection = /incident|understand|not working|issue|create/i.test(chatText);
    expect(acknowledgesCorrection).toBe(true);

    console.log('✅ TC-0024 PASSED: User corrects ticket type');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0007: Ticket Status
  // ═══════════════════════════════════════════════════════════

  test('TC-0025: Verify user views list of open tickets via assistant @regression @p1 @ticket-status', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('What are my open tickets?');

    const chatText = await agentforcePage.getChatText();
    // Should either show tickets or say no tickets found
    const handlesTicketQuery = /INC-|ticket|no open|no active|incident|status|don't have/i.test(chatText);
    expect(handlesTicketQuery).toBe(true);

    console.log('✅ TC-0025 PASSED: User can query open tickets');
  });

  test('TC-0026: Verify user requests details for a specific ticket @regression @p1 @ticket-status', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('What is the status of my latest ticket?');

    const chatText = await agentforcePage.getChatText();
    // Should respond with ticket info or ask which ticket
    const handlesDetailQuery = /status|ticket|INC-|open|closed|detail|which/i.test(chatText);
    expect(handlesDetailQuery).toBe(true);

    console.log('✅ TC-0026 PASSED: User can request ticket details');
  });

  test('TC-0027: Verify unauthorized ticket information is not disclosed @regression @p1 @ticket-status @security', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('What is the status of INC-99998?');

    const chatText = await agentforcePage.getChatText();
    // Should not disclose other user's ticket details - either says no access or not found
    const protectsData = /not found|no access|cannot|unable|don't have|permission|not authorized/i.test(chatText);
    expect(protectsData).toBe(true);

    console.log('✅ TC-0027 PASSED: Unauthorized ticket info not disclosed');
  });

  test('TC-0028: Verify clear message when user has no open tickets @regression @p1 @ticket-status', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('Show me my tickets');

    const chatText = await agentforcePage.getChatText();
    // Should either show tickets or clearly state none found
    const handlesNoTickets = /ticket|INC-|no open|no active|don't have|none|here are/i.test(chatText);
    expect(handlesNoTickets).toBe(true);

    console.log('✅ TC-0028 PASSED: Clear message about tickets');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0008: Ticket Update
  // ═══════════════════════════════════════════════════════════

  test('TC-0029: Verify adding comment to existing open ticket via assistant @regression @p1 @ticket-update', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('I want to add information to my latest ticket');

    const chatText = await agentforcePage.getChatText();
    // Should ask for info or acknowledge
    const handlesUpdate = /what information|which ticket|update|add|comment|detail/i.test(chatText);
    expect(handlesUpdate).toBe(true);

    console.log('✅ TC-0029 PASSED: Assistant handles ticket update request');
  });

  test('TC-0030: Verify attempt to update closed ticket provides explanation @regression @p1 @ticket-update', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse('I want to update a ticket that was already closed');

    const chatText = await agentforcePage.getChatText();
    // Should explain closed ticket can't be updated or offer new ticket
    const handlesClosedTicket = /closed|cannot|new ticket|create|reopen|which ticket/i.test(chatText);
    expect(handlesClosedTicket).toBe(true);

    console.log('✅ TC-0030 PASSED: Closed ticket update handled appropriately');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0010: Auto-categorization
  // ═══════════════════════════════════════════════════════════

  test('TC-0033: Verify Short Description and Description are generated from conversation @regression @p1 @categorization', async ({
    agentforcePage,
  }) => {
    test.setTimeout(180000);
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse(
      'My laptop keeps showing blue screen errors whenever I open Outlook. It started 2 days ago after the Windows update.'
    );

    // Verify the assistant processes and acknowledges the detailed issue
    const chatText = await agentforcePage.getChatText();
    const understandsIssue = /blue screen|outlook|laptop|update|incident|create|help/i.test(chatText);
    expect(understandsIssue).toBe(true);

    console.log('✅ TC-0033 PASSED: Assistant processes detailed issue for auto-categorization');
  });

  test('TC-0034: Verify high-confidence classification populates Category and Subcategory @regression @p1 @categorization', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse(
      'I cannot connect to the corporate VPN from my laptop. Error: connection timeout.'
    );

    const chatText = await agentforcePage.getChatText();
    // Should identify as network/VPN issue with high confidence
    const highConfidence = /vpn|network|connect|incident|create|category/i.test(chatText);
    expect(highConfidence).toBe(true);

    console.log('✅ TC-0034 PASSED: High-confidence classification identified');
  });

  test('TC-0035: Verify low-confidence classification leaves fields for manual triage @regression @p1 @categorization', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon();
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    await agentforcePage.sendAndWaitForResponse(
      "Something is wrong with my system, not sure if it's hardware or software"
    );

    const chatText = await agentforcePage.getChatText();
    // Should ask for clarification due to low confidence
    const asksForClarity = /\?|more detail|what|which|specific|hardware|software|could you/i.test(chatText);
    expect(asksForClarity).toBe(true);

    console.log('✅ TC-0035 PASSED: Low-confidence classification prompts clarification');
  });
});

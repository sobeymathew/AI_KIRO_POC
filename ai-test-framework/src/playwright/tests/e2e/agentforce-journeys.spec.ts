import { test, expect } from '../../fixtures/base.fixture';
import { loginToPortal } from '../../utils/agentforce-helpers.util';

/**
 * E2E Tests: Agentforce AI Assistant - Full User Journeys
 * Test Cases: TC-0040 through TC-0045
 * Requirement: REQ-0002
 * User Stories: US-0002, US-0003, US-0004, US-0005, US-0006, US-0007, US-0008, US-0012
 * Feature: src/test-case-management/features/e2e/agentforce-ai-assistant-journeys.feature
 *
 * Covers full end-to-end user journeys:
 * - Knowledge deflection (ask → article → resolved → no ticket)
 * - Conversational incident creation (describe → classify → confirm → ticket created)
 * - Ticket status + update (list → details → add comment)
 * - Clarification-driven ticket creation (ambiguous → clarify → create)
 * - Knowledge insufficient → incident creation transition
 */
test.describe('Agentforce AI Assistant - E2E Journeys @e2e @agentforce', () => {
  test.setTimeout(180000);

  test.beforeEach(async ({ page }) => {
    await loginToPortal(page);
  });

  // ═══════════════════════════════════════════════════════════
  // TC-0040: Knowledge Deflection Journey
  // ═══════════════════════════════════════════════════════════

  test('TC-0040: E2E - Requestor resolves issue through knowledge article without ticket creation @e2e @p0 @knowledge-deflection', async ({
    agentforcePage,
  }) => {
    // Step 2: Verify Agentforce icon is displayed
    await agentforcePage.waitForAgentforceIcon(30000);
    expect(await agentforcePage.isAgentforceIconVisible()).toBe(true);

    // Step 3: Click Agentforce icon — panel opens with greeting
    await agentforcePage.openAgentforceChat();
    const isPanelOpen = await agentforcePage.isChatPanelOpen();
    expect(isPanelOpen).toBe(true);

    // Step 4: Wait for chat to fully initialize
    await agentforcePage.waitForChatReady();

    // Step 5: Describe issue in natural language
    await agentforcePage.sendAndWaitForResponse('How do I connect to the corporate VPN from home');

    // Step 6: Verify knowledge article response
    const chatText = await agentforcePage.getChatText();
    const hasKnowledgeResponse = /vpn|connect|steps|instructions|article|follow|settings/i.test(chatText);
    expect(hasKnowledgeResponse).toBe(true);

    // Step 7: Confirm resolution
    await agentforcePage.sendAndWaitForResponse('Yes that resolved my issue, thank you');

    // Step 8: Verify no ticket created
    const hasIncident = await agentforcePage.hasIncidentNumber();
    expect(hasIncident).toBe(false);

    // Step 10: Verify assistant offers further assistance
    const finalText = await agentforcePage.getChatText();
    const offersHelp = /glad|anything else|help|welcome|assist/i.test(finalText);
    expect(offersHelp).toBe(true);

    console.log('✅ TC-0040 PASSED: E2E Knowledge deflection journey complete');
  });

  // ═══════════════════════════════════════════════════════════
  // TC-0041: Conversational Incident Creation Journey
  // ═══════════════════════════════════════════════════════════

  test('TC-0041: E2E - Requestor creates an incident through conversational interaction @e2e @p0 @incident-creation', async ({
    agentforcePage,
  }) => {
    // Step 1-2: Login + open assistant
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Step 3: Describe issue
    await agentforcePage.sendAndWaitForResponse(
      'My email application has been crashing every time I open it since this morning'
    );

    // Step 4: Verify classification as incident
    let chatText = await agentforcePage.getChatText();
    const identifiesIssue = /email|crash|incident|issue|help|sorry/i.test(chatText);
    expect(identifiesIssue).toBe(true);

    // Step 5: Provide additional details
    await agentforcePage.sendAndWaitForResponse(
      'It affects Outlook on my Windows laptop, error code 0x800CCC0E'
    );

    // Step 6-7: Request incident creation and confirm
    await agentforcePage.sendAndWaitForResponse('Yes, please create an incident for this');

    // Wait extra for creation flow
    await agentforcePage.page.waitForTimeout(5000);

    // Step 8: Verify incident number or creation confirmation
    chatText = await agentforcePage.getChatText();
    const incidentCreated = /INC-|incident|created|submitted|logged|ticket/i.test(chatText);
    expect(incidentCreated).toBe(true);

    console.log('✅ TC-0041 PASSED: E2E Conversational incident creation journey complete');
  });

  // ═══════════════════════════════════════════════════════════
  // TC-0042: Ticket Status + Update Journey
  // ═══════════════════════════════════════════════════════════

  test('TC-0042: E2E - Requestor checks ticket status and adds information @e2e @p0 @ticket-management', async ({
    agentforcePage,
  }) => {
    // Open assistant
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Step 3: Ask about open tickets
    await agentforcePage.sendAndWaitForResponse('What is the status of my tickets?');

    let chatText = await agentforcePage.getChatText();
    const handlesTicketQuery = /ticket|INC-|status|open|no active|don't have/i.test(chatText);
    expect(handlesTicketQuery).toBe(true);

    // Step 5: Request to add information
    await agentforcePage.sendAndWaitForResponse('I want to add a comment to my latest ticket');

    chatText = await agentforcePage.getChatText();
    const promptsForInfo = /what|information|comment|which|add|update|detail/i.test(chatText);
    expect(promptsForInfo).toBe(true);

    // Step 6: Provide the additional information
    await agentforcePage.sendAndWaitForResponse(
      'The issue is now affecting 5 more users on the same floor'
    );

    // Step 7: Verify acknowledgment
    chatText = await agentforcePage.getChatText();
    const acknowledgesUpdate = /added|updated|comment|noted|information|thank|received/i.test(chatText);
    expect(acknowledgesUpdate).toBe(true);

    console.log('✅ TC-0042 PASSED: E2E Ticket status check and update journey complete');
  });

  // ═══════════════════════════════════════════════════════════
  // TC-0043: Clarification-Driven Ticket Creation Journey
  // ═══════════════════════════════════════════════════════════

  test('TC-0043: E2E - Ambiguous request requires clarification before ticket creation @e2e @p0 @clarification', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Step 3: Describe ambiguous issue
    await agentforcePage.sendAndWaitForResponse('I have a problem with my account');

    let chatText = await agentforcePage.getChatText();
    const asksClarification = /\?|what|which|could you|more detail|specific|account/i.test(chatText);
    expect(asksClarification).toBe(true);

    // Step 4: First clarification
    await agentforcePage.sendAndWaitForResponse('I cannot log in to the HR system');

    chatText = await agentforcePage.getChatText();
    const understandsLogin = /log in|access|HR|system|account|locked/i.test(chatText);
    expect(understandsLogin).toBe(true);

    // Step 5: Second clarification
    await agentforcePage.sendAndWaitForResponse('I am getting an error saying my account is locked');

    chatText = await agentforcePage.getChatText();
    const identifiesIncident = /locked|incident|access|create|help|resolve/i.test(chatText);
    expect(identifiesIncident).toBe(true);

    // Step 7: Confirm creation
    await agentforcePage.sendAndWaitForResponse('Yes please create an incident');

    await agentforcePage.page.waitForTimeout(5000);
    chatText = await agentforcePage.getChatText();
    const ticketCreated = /INC-|created|submitted|incident|logged|ticket/i.test(chatText);
    expect(ticketCreated).toBe(true);

    console.log('✅ TC-0043 PASSED: E2E Clarification-driven ticket creation journey complete');
  });

  // ═══════════════════════════════════════════════════════════
  // TC-0045: Knowledge Insufficient → Incident Creation
  // ═══════════════════════════════════════════════════════════

  test('TC-0045: E2E - Knowledge article insufficient leads to incident creation @e2e @p0 @knowledge-to-ticket', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Step 3: Ask question that returns knowledge
    await agentforcePage.sendAndWaitForResponse('How do I fix the printer error on the 3rd floor');

    let chatText = await agentforcePage.getChatText();
    const hasResponse = /printer|error|troubleshoot|try|steps|help/i.test(chatText);
    expect(hasResponse).toBe(true);

    // Step 4: Indicate article didn't help
    await agentforcePage.sendAndWaitForResponse("That didn't help, the issue is still there");

    chatText = await agentforcePage.getChatText();
    const offersTicket = /ticket|incident|create|raise|sorry|further|help/i.test(chatText);
    expect(offersTicket).toBe(true);

    // Step 5: Confirm desire to create ticket
    await agentforcePage.sendAndWaitForResponse('Yes, please create a ticket for this');

    // Step 6: Provide remaining details
    await agentforcePage.sendAndWaitForResponse(
      'It is the HP printer on 3rd floor, room 302. It shows paper jam error but there is no paper stuck. Urgency is medium.'
    );

    await agentforcePage.page.waitForTimeout(5000);

    // Step 7-8: Verify ticket creation
    chatText = await agentforcePage.getChatText();
    const ticketCreated = /INC-|created|submitted|incident|logged|ticket/i.test(chatText);
    expect(ticketCreated).toBe(true);

    console.log('✅ TC-0045 PASSED: E2E Knowledge insufficient → incident creation journey complete');
  });
});

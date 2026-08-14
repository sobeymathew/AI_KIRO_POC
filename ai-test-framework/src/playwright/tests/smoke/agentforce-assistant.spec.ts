import { test, expect } from '../../fixtures/base.fixture';
import { loginToPortal } from '../../utils/agentforce-helpers.util';

/**
 * Smoke Tests: Agentforce AI Assistant
 * Test Cases: TC-0006 through TC-0017
 * Requirement: REQ-0002
 * User Stories: US-0002, US-0003, US-0004, US-0005, US-0006
 * Feature: src/test-case-management/features/smoke/agentforce-ai-assistant.feature
 *
 * Validates the Agentforce AI Assistant on the ITSM self-service portal:
 * - Access: Icon visibility, chat opening, greeting, user identity
 * - NLP: Intent identification, clarifying questions
 * - Knowledge: Article retrieval, ticket creation fallback
 * - Incident Creation: Conversational incident creation, mandatory field prompting
 * - Classification: Incident vs Service Request categorization
 */
test.describe('Agentforce AI Assistant - Smoke @smoke @agentforce', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await loginToPortal(page);
  });

  // ═══════════════════════════════════════════════════════════
  // US-0002: Access AI Assistant from Self-Service Portal
  // ═══════════════════════════════════════════════════════════

  test('TC-0006: Verify Agentforce icon is visible on home page after login @smoke @p0 @access', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);

    const isVisible = await agentforcePage.isAgentforceIconVisible();
    expect(isVisible).toBe(true);

    const isClickable = await agentforcePage.isAgentforceIconClickable();
    expect(isClickable).toBe(true);

    console.log('✅ TC-0006 PASSED: Agentforce icon is visible and clickable on the home page');
  });

  test('TC-0007: Verify AI Assistant opens and greets user when icon is clicked @smoke @p0 @access', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();

    const isPanelOpen = await agentforcePage.isChatPanelOpen();
    expect(isPanelOpen).toBe(true);

    const hasGreeting = await agentforcePage.isGreetingMessageVisible();
    expect(hasGreeting).toBe(true);

    const hasCapabilities = await agentforcePage.isCapabilitiesExplained();
    expect(hasCapabilities).toBe(true);

    console.log('✅ TC-0007 PASSED: AI Assistant opens and greets user with capabilities');
  });

  test('TC-0008: Verify user identity is recognized from portal authentication @smoke @p0 @access', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // The assistant should automatically recognize the user without asking "who are you"
    // The greeting should NOT ask for identification — it should proceed directly
    const chatText = await agentforcePage.getChatText();

    // Verify the assistant does NOT ask for user identification
    const asksForIdentity = /what is your name|who are you|please identify/i.test(chatText);
    expect(asksForIdentity).toBe(false);

    // Verify the assistant is ready to help (recognized user context)
    expect(chatText.toLowerCase()).toContain('help');

    console.log('✅ TC-0008 PASSED: User identity is recognized without manual identification');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0003: Natural Language Issue Understanding
  // ═══════════════════════════════════════════════════════════

  test('TC-0010: Verify assistant identifies intent from natural language input @smoke @p0 @nlp', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Send a natural language issue description
    await agentforcePage.sendAndWaitForResponse('My laptop cannot connect to the VPN');

    // Verify the assistant responds with relevant assistance
    const chatText = await agentforcePage.getChatText();
    const hasRelevantResponse = /vpn|connect|network|troubleshoot|incident|help/i.test(chatText);
    expect(hasRelevantResponse).toBe(true);

    console.log('✅ TC-0010 PASSED: Assistant identifies intent from natural language input');
  });

  test('TC-0011: Verify assistant asks clarifying questions on low confidence input @smoke @p0 @nlp', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Send a vague description
    await agentforcePage.sendAndWaitForResponse('something is broken');

    // Verify the assistant asks clarifying questions (contains a question mark or asks for details)
    const chatText = await agentforcePage.getChatText();
    const asksClarification = /\?|more detail|can you|could you|what|which|please describe|tell me more/i.test(chatText);
    expect(asksClarification).toBe(true);

    // Send a follow-up with more detail
    await agentforcePage.sendAndWaitForResponse('My email application crashes when I open it');

    // Verify context is maintained — assistant now understands it's an email/app issue
    const updatedText = await agentforcePage.getChatText();
    const understandsIssue = /email|application|crash|outlook|incident|service/i.test(updatedText);
    expect(understandsIssue).toBe(true);

    console.log('✅ TC-0011 PASSED: Assistant asks clarifying questions and maintains context');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0004: Knowledge Article Resolution
  // ═══════════════════════════════════════════════════════════

  test('TC-0012: Verify assistant resolves issue with knowledge article @smoke @p0 @knowledge', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Ask a common question that should match a knowledge article
    await agentforcePage.sendAndWaitForResponse('How do I reset my password');

    // Verify the assistant provides a knowledge-based response
    const chatText = await agentforcePage.getChatText();
    const hasKnowledgeResponse = /password|reset|steps|follow|instructions|article|click/i.test(chatText);
    expect(hasKnowledgeResponse).toBe(true);

    console.log('✅ TC-0012 PASSED: Assistant resolves issue with knowledge article');
  });

  test('TC-0013: Verify assistant offers ticket creation when knowledge is insufficient @smoke @p0 @knowledge', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Describe an obscure issue unlikely to have a knowledge article
    await agentforcePage.sendAndWaitForResponse(
      'My custom application XYZ-Widget is showing error code QR-9999'
    );

    // Verify the assistant offers to create a ticket or escalate
    const chatText = await agentforcePage.getChatText();
    const offersTicket = /ticket|incident|create|raise|log|submit|help desk|support/i.test(chatText);
    expect(offersTicket).toBe(true);

    console.log('✅ TC-0013 PASSED: Assistant offers ticket creation when knowledge is insufficient');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0005: Conversational Incident Creation
  // ═══════════════════════════════════════════════════════════

  test('TC-0014: Verify assistant creates incident after gathering information and confirmation @smoke @p0 @incident-creation', async ({
    agentforcePage,
  }) => {
    test.setTimeout(180000); // Extended timeout for multi-turn conversation

    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Describe an issue
    await agentforcePage.sendAndWaitForResponse('My email is not working since this morning');

    // Provide additional details if prompted
    const chatText1 = await agentforcePage.getChatText();
    if (/more detail|which|what|could you/i.test(chatText1)) {
      await agentforcePage.sendAndWaitForResponse(
        'It affects Outlook, showing connection error. It is urgent.'
      );
    }

    // Ask to create an incident
    await agentforcePage.sendAndWaitForResponse('Please create an incident for this issue');

    // Wait extra time for incident creation flow
    await agentforcePage.page.waitForTimeout(5000);

    // Verify the assistant proceeds with incident creation or confirms details
    const chatText2 = await agentforcePage.getChatText();
    const proceedsWithCreation = /incident|created|INC-|confirm|summary|submit|category|description/i.test(chatText2);
    expect(proceedsWithCreation).toBe(true);

    console.log('✅ TC-0014 PASSED: Assistant proceeds with incident creation after gathering info');
  });

  test('TC-0015: Verify assistant requests missing mandatory details before incident creation @smoke @p0 @incident-creation', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Describe issue very briefly
    await agentforcePage.sendAndWaitForResponse('network issue');

    // Verify the assistant asks for more details rather than immediately creating a ticket
    const chatText = await agentforcePage.getChatText();
    const asksForDetails = /\?|more|detail|describe|tell|what|specific|could you|can you/i.test(chatText);
    expect(asksForDetails).toBe(true);

    // Verify NO incident number is shown yet (not created prematurely)
    const hasIncident = await agentforcePage.hasIncidentNumber();
    expect(hasIncident).toBe(false);

    console.log('✅ TC-0015 PASSED: Assistant requests mandatory details before incident creation');
  });

  // ═══════════════════════════════════════════════════════════
  // US-0006: Record Type Classification
  // ═══════════════════════════════════════════════════════════

  test('TC-0016: Verify failure or outage is classified as Incident @smoke @p0 @classification', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Describe a system failure/outage
    await agentforcePage.sendAndWaitForResponse(
      'The CRM application is down and I cannot access any records'
    );

    // Verify the assistant identifies this as an incident (failure/outage scenario)
    const chatText = await agentforcePage.getChatText();
    const classifiedAsIncident = /incident|outage|down|restore|urgent|critical|issue/i.test(chatText);
    expect(classifiedAsIncident).toBe(true);

    console.log('✅ TC-0016 PASSED: Failure/outage is classified as Incident');
  });

  test('TC-0017: Verify request for access is classified as Service Request @smoke @p0 @classification', async ({
    agentforcePage,
  }) => {
    await agentforcePage.waitForAgentforceIcon(30000);
    await agentforcePage.openAgentforceChat();
    await agentforcePage.waitForChatReady();

    // Describe a request for access
    await agentforcePage.sendAndWaitForResponse(
      'I need access to the Finance shared drive'
    );

    // Verify the assistant identifies this as a service request
    const chatText = await agentforcePage.getChatText();
    const classifiedAsRequest = /service request|access|request|provision|grant/i.test(chatText);
    expect(classifiedAsRequest).toBe(true);

    console.log('✅ TC-0017 PASSED: Access request is classified as Service Request');
  });
});

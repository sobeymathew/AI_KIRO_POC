import { Page, Locator, FrameLocator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for the Agentforce AI Assistant on the ITSM self-service portal.
 * Handles interactions with the embedded messaging (chat) icon and panel.
 *
 * URL: /itsm/s/ (home page after login)
 * Verified: 2026-08-14 via Playwright MCP healer
 *
 * Locator hierarchy (main page):
 *   #embedded-messaging
 *     └── button#embeddedMessagingConversationButton (aria-label="Hello, have a question? Let's chat.")
 *           └── #embeddedMessagingIconContainer → svg#embeddedMessagingIconChat
 *
 * After click (iframe):
 *   iframe#embeddedMessagingFrame (class includes "isMaximized")
 *     └── Shadow DOM:
 *         - textarea[aria-label="Start a new chat..."] (chat input)
 *         - button[title="Send message"] (appears after typing)
 *         - button[title="Minimize chat window"]
 *         - Messages contain "IT Service Employee" agent responses
 */
export class AgentforcePage extends BasePage {
  // --- Agentforce Icon/Button (verified) ---
  readonly agentforceButton: Locator;
  readonly agentforceIcon: Locator;
  readonly agentforceIconContainer: Locator;

  // --- Chat Panel (iframe-based, verified) ---
  readonly chatFrame: Locator;
  readonly embeddedMessagingContainer: Locator;

  constructor(page: Page) {
    super(page);

    // The floating Agentforce button (verified 2026-08-14)
    this.agentforceButton = page.locator('#embeddedMessagingConversationButton');
    this.agentforceIcon = page.locator('#embeddedMessagingIconChat');
    this.agentforceIconContainer = page.locator('#embeddedMessagingIconContainer');

    // The chat panel iframe that opens after clicking the button
    this.chatFrame = page.locator('#embeddedMessagingFrame');
    this.embeddedMessagingContainer = page.locator('#embedded-messaging');
  }

  // ═══════════════════════════════════════════════════════════
  // ICON / BUTTON METHODS
  // ═══════════════════════════════════════════════════════════

  /** Wait for the Agentforce icon to be visible on the home page */
  async waitForAgentforceIcon(timeout: number = 30000): Promise<void> {
    this.logger.info('Waiting for Agentforce icon to be visible');
    await this.agentforceButton.waitFor({ state: 'visible', timeout });
  }

  /** Check if the Agentforce icon is visible */
  async isAgentforceIconVisible(): Promise<boolean> {
    this.logger.info('Checking if Agentforce icon is visible');
    return await this.agentforceButton.isVisible();
  }

  /** Check if the Agentforce icon/button is clickable (enabled) */
  async isAgentforceIconClickable(): Promise<boolean> {
    this.logger.info('Checking if Agentforce icon is clickable');
    return await this.agentforceButton.isEnabled();
  }

  /** Get the aria-label of the Agentforce button */
  async getButtonAriaLabel(): Promise<string> {
    return (await this.agentforceButton.getAttribute('aria-label')) ?? '';
  }

  // ═══════════════════════════════════════════════════════════
  // CHAT PANEL METHODS
  // ═══════════════════════════════════════════════════════════

  /** Get the chat frame locator for interacting with elements inside the iframe */
  get chatFrameLocator(): FrameLocator {
    return this.page.frameLocator('#embeddedMessagingFrame');
  }

  /** Click the Agentforce icon to open the chat panel */
  async openAgentforceChat(): Promise<void> {
    this.logger.info('Opening Agentforce chat panel');
    await this.agentforceButton.click();
    await this.page.waitForTimeout(3000);
  }

  /** Check if the chat panel is open (iframe visible and maximized) */
  async isChatPanelOpen(): Promise<boolean> {
    this.logger.info('Checking if Agentforce chat panel is open');
    try {
      await this.chatFrame.waitFor({ state: 'visible', timeout: 10000 });
      const classList = await this.chatFrame.getAttribute('class') ?? '';
      return classList.includes('isMaximized');
    } catch {
      return false;
    }
  }

  /** Wait for the chat panel to fully load (iframe + input visible) */
  async waitForChatReady(timeout: number = 20000): Promise<void> {
    this.logger.info('Waiting for chat panel to be ready');
    await this.chatFrame.waitFor({ state: 'visible', timeout });
    await this.page.waitForTimeout(3000);
  }

  // ═══════════════════════════════════════════════════════════
  // GREETING / MESSAGE VERIFICATION METHODS
  // ═══════════════════════════════════════════════════════════

  /** Check if the assistant greeting message is visible */
  async isGreetingMessageVisible(): Promise<boolean> {
    this.logger.info('Checking if assistant greeting message is visible');
    try {
      const greeting = this.chatFrameLocator.getByText(/IT Service Employee Agent/i);
      await greeting.first().waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Get the greeting message text */
  async getGreetingMessageText(): Promise<string> {
    this.logger.info('Getting assistant greeting message text');
    try {
      const greeting = this.chatFrameLocator.getByText(/IT Service Employee Agent, an AI assistant/i);
      await greeting.first().waitFor({ state: 'visible', timeout: 15000 });
      return (await greeting.first().textContent()) ?? '';
    } catch {
      return '';
    }
  }

  /** Check if the assistant explains its capabilities */
  async isCapabilitiesExplained(): Promise<boolean> {
    this.logger.info('Checking if assistant explains its capabilities');
    try {
      const capabilities = this.chatFrameLocator.getByText(/troubleshoot IT issues|create incidents|service requests/i);
      await capabilities.first().waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CHAT INTERACTION METHODS
  // ═══════════════════════════════════════════════════════════

  /** Send a message in the chat */
  async sendMessage(message: string): Promise<void> {
    this.logger.info(`Sending message: ${message}`);

    // The textarea is inside Shadow DOM within the iframe.
    // Use page.evaluate to pierce through iframe + shadow DOM.
    await this.page.evaluate((msg) => {
      const iframe = document.getElementById('embeddedMessagingFrame') as HTMLIFrameElement;
      if (!iframe?.contentDocument) throw new Error('Chat iframe not found');
      const doc = iframe.contentDocument;

      function deepQuery(root: DocumentFragment | Element, selector: string): Element | null {
        const result = root.querySelector(selector);
        if (result) return result;
        const allEls = root.querySelectorAll('*');
        for (const el of allEls) {
          if (el.shadowRoot) {
            const found = deepQuery(el.shadowRoot as unknown as DocumentFragment, selector);
            if (found) return found;
          }
        }
        return null;
      }

      const textarea = deepQuery(doc.body, 'textarea') as HTMLTextAreaElement;
      if (!textarea) throw new Error('Chat textarea not found in shadow DOM');

      // Set value and dispatch events to trigger change detection
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      )?.set;
      nativeInputValueSetter?.call(textarea, msg);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }, message);

    await this.page.waitForTimeout(1000);

    // Click the send button (also in shadow DOM)
    await this.page.evaluate(() => {
      const iframe = document.getElementById('embeddedMessagingFrame') as HTMLIFrameElement;
      if (!iframe?.contentDocument) return;
      const doc = iframe.contentDocument;

      function deepQuery(root: DocumentFragment | Element, selector: string): Element | null {
        const result = root.querySelector(selector);
        if (result) return result;
        const allEls = root.querySelectorAll('*');
        for (const el of allEls) {
          if (el.shadowRoot) {
            const found = deepQuery(el.shadowRoot as unknown as DocumentFragment, selector);
            if (found) return found;
          }
        }
        return null;
      }

      const sendBtn = deepQuery(doc.body, 'button[title="Send message"]') as HTMLButtonElement;
      if (sendBtn) {
        sendBtn.click();
      }
    });

    await this.page.waitForTimeout(2000);
  }

  /**
   * Wait for the assistant to respond after sending a message.
   * Waits for a new "IT Service Employee" message to appear.
   */
  async waitForAssistantResponse(timeout: number = 30000): Promise<void> {
    this.logger.info('Waiting for assistant response...');
    // Wait for the typing indicator to appear and disappear, or a new message to show
    await this.page.waitForTimeout(5000);
    // Wait for "IT Service Employee" agent name to appear in a new message
    const agentMessage = this.chatFrameLocator.getByText(/IT Service Employee/);
    await agentMessage.last().waitFor({ state: 'visible', timeout });
  }

  /**
   * Get all visible text from the chat panel (including Shadow DOM).
   * Uses page.evaluate to pierce into the iframe's shadow roots.
   */
  async getChatText(): Promise<string> {
    this.logger.info('Getting full chat text content');
    const text = await this.page.evaluate(() => {
      const iframe = document.getElementById('embeddedMessagingFrame') as HTMLIFrameElement;
      if (!iframe?.contentDocument) return '';
      const doc = iframe.contentDocument;
      function deepText(root: Node): string {
        let text = '';
        if ((root as Element).shadowRoot) {
          text += deepText((root as Element).shadowRoot!);
        }
        for (const child of root.childNodes) {
          if (child.nodeType === 3) text += child.textContent;
          else if (child.nodeType === 1) text += deepText(child);
        }
        return text;
      }
      return deepText(doc.body);
    });
    return text;
  }

  /**
   * Get the last assistant response text from the chat.
   * Extracts the most recent response from the IT Service Employee agent.
   */
  async getLastAssistantResponse(): Promise<string> {
    this.logger.info('Getting last assistant response');
    const fullText = await this.getChatText();
    // Split by "IT Service Employee" to find the last response
    const parts = fullText.split(/IT Service Employee\s*•/);
    if (parts.length < 2) return fullText;
    // Get the last agent response (before the next timestamp or end)
    const lastPart = parts[parts.length - 1];
    // Clean up: remove timestamps and trailing noise
    const cleaned = lastPart.replace(/\d{1,2}:\d{2}\s*(AM|PM)/g, '').trim();
    return cleaned.substring(0, 500);
  }

  /**
   * Check if the assistant response contains specific text (case-insensitive).
   */
  async responseContains(text: string): Promise<boolean> {
    const chatText = await this.getChatText();
    return chatText.toLowerCase().includes(text.toLowerCase());
  }

  /**
   * Check if the chat contains a specific pattern (regex match on full chat text).
   */
  async chatMatchesPattern(pattern: RegExp): Promise<boolean> {
    const chatText = await this.getChatText();
    return pattern.test(chatText);
  }

  /**
   * Send a message and wait for the assistant to respond.
   * Combines sendMessage + waitForAssistantResponse.
   */
  async sendAndWaitForResponse(message: string, timeout: number = 30000): Promise<string> {
    await this.sendMessage(message);
    await this.waitForAssistantResponse(timeout);
    // Extra wait for full response to render
    await this.page.waitForTimeout(3000);
    return await this.getLastAssistantResponse();
  }

  /**
   * Check if the assistant response contains an incident number (INC-XXXXX pattern).
   */
  async hasIncidentNumber(): Promise<boolean> {
    const chatText = await this.getChatText();
    return /INC[-]?\d+/.test(chatText);
  }

  /**
   * Extract incident number from chat text.
   */
  async getIncidentNumber(): Promise<string> {
    const chatText = await this.getChatText();
    const match = chatText.match(/INC[-]?\d+/);
    return match ? match[0] : '';
  }

  /**
   * Check if the chat contains a link (href or clickable element).
   */
  async hasLink(): Promise<boolean> {
    try {
      const link = this.chatFrameLocator.locator('a[href]');
      return await link.first().isVisible();
    } catch {
      return false;
    }
  }
}

import { APIRequestContext, request } from '@playwright/test';

/**
 * API utility for test data setup and backend interactions.
 * Use API calls for faster test data creation instead of UI flows.
 */
export class ApiUtil {
  private context: APIRequestContext | null = null;
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string = '') {
    this.baseURL = baseURL;
    this.token = token;
  }

  /** Initialize the API context */
  async init(): Promise<void> {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        Authorization: this.token ? `Bearer ${this.token}` : '',
        'Content-Type': 'application/json',
      },
    });
  }

  /** Make a GET request */
  async get<T>(path: string): Promise<T> {
    if (!this.context) await this.init();
    const response = await this.context!.get(path);
    if (!response.ok()) {
      throw new Error(`GET ${path} failed: ${response.status()} ${response.statusText()}`);
    }
    return await response.json();
  }

  /** Make a POST request */
  async post<T>(path: string, data: Record<string, unknown>): Promise<T> {
    if (!this.context) await this.init();
    const response = await this.context!.post(path, { data });
    if (!response.ok()) {
      throw new Error(`POST ${path} failed: ${response.status()} ${response.statusText()}`);
    }
    return await response.json();
  }

  /** Make a PUT request */
  async put<T>(path: string, data: Record<string, unknown>): Promise<T> {
    if (!this.context) await this.init();
    const response = await this.context!.put(path, { data });
    if (!response.ok()) {
      throw new Error(`PUT ${path} failed: ${response.status()} ${response.statusText()}`);
    }
    return await response.json();
  }

  /** Make a DELETE request */
  async delete(path: string): Promise<void> {
    if (!this.context) await this.init();
    const response = await this.context!.delete(path);
    if (!response.ok()) {
      throw new Error(`DELETE ${path} failed: ${response.status()} ${response.statusText()}`);
    }
  }

  /** Dispose of the API context */
  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
    }
  }
}

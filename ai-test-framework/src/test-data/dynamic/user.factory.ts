import { v4 as uuid } from 'uuid';

/**
 * Dynamic user data factory.
 * Generates unique test data to prevent conflicts between parallel tests.
 */
export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  const uniqueId = uuid().substring(0, 8);
  const firstName = `Test${uniqueId}`;
  const lastName = 'User';

  return {
    email: `test-${uniqueId}@automation.example.com`,
    password: `Pass@${uniqueId}`,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    ...overrides,
  };
}

export function createMultipleUsers(count: number): TestUser[] {
  return Array.from({ length: count }, () => createTestUser());
}

/**
 * Generate a unique email that won't conflict with other test runs.
 */
export function uniqueEmail(prefix: string = 'test'): string {
  return `${prefix}-${uuid().substring(0, 8)}@automation.example.com`;
}

/**
 * Generate a random strong password.
 */
export function randomPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Static test data for authentication tests.
 * Uses environment variables for sensitive values.
 */
export const authTestData = {
  validUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'Test@12345',
    name: 'Test User',
    role: 'user',
  },
  adminUser: {
    email: process.env.ADMIN_USER_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_USER_PASSWORD || 'Admin@12345',
    name: 'Admin User',
    role: 'admin',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  lockedUser: {
    email: 'locked@example.com',
    password: 'any-password',
    lockReason: 'Too many failed attempts',
  },
  newUser: {
    email: 'newuser@example.com',
    password: 'NewUser@12345',
    name: 'New User',
  },
};

export const validationTestData = {
  invalidEmails: [
    '',
    'not-an-email',
    '@example.com',
    'user@',
    'user@.com',
    'user @example.com',
  ],
  invalidPasswords: [
    '',
    'short',
    'nouppercase1!',
    'NOLOWERCASE1!',
    'NoSpecialChar1',
    'No Numbers!',
  ],
  securityInputs: [
    "admin' OR '1'='1",
    '<script>alert("xss")</script>',
    '${7*7}',
    '{{constructor.constructor("return this")()}}',
  ],
};

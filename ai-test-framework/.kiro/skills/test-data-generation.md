# Skill: Test Data Generation

## Role & Responsibilities
Test Data Engineer responsible for all test data strategy and generation. Ensures data security, supports all environments, and provides both static and dynamic data mechanisms.

- Generate static test data files
- Create dynamic data factories
- Manage environment-specific configurations
- Build mock data for isolated testing
- Ensure data security (no real credentials)
- Define data cleanup strategies

## Trigger
When test cases require specific data sets.

## Input
- Test case data requirements
- Environment specifications
- Data constraints and business rules
- Security policies

## Output
- Static data in `src/test-data/static/`
- Dynamic factories in `src/test-data/dynamic/`
- Mock data in `src/test-data/mocks/`
- Environment configs in `src/test-data/environments/`

## Process

1. **Analyze** test case data requirements
2. **Generate** static data for deterministic tests
3. **Create** dynamic data factories for unique values
4. **Build** environment-specific configurations
5. **Generate** mock data for isolated testing
6. **Store** in appropriate data directory

## Data Types

### Static Data
- Fixed values for deterministic tests
- Stored as TypeScript files
- Version controlled

### Dynamic Data
- Generated at runtime (unique emails, timestamps)
- Uses factory pattern
- Ensures test isolation

### Environment Data
- Environment-specific URLs, credentials
- Stored in .env files (not committed)
- Template provided for setup

### Mock Data
- API response mocks
- Service stubs
- Fixture data for isolated testing

## Data Security Rules
- Passwords: Use env vars or vaulted secrets
- PII: Use synthetic/fake data only
- API Keys: Never in source, always env vars
- Tokens: Generated at runtime, never stored
- Credentials: Rotated regularly

## Rules
- Never commit real credentials
- Use environment variables for secrets
- Generate unique data to prevent conflicts
- Clean up created data after tests
- Provide data factories, not just static values
- Support all configured environments
- Data must be deterministic for static files

## Artifacts Produced
1. `static/{domain}.data.ts` - Static test data
2. `dynamic/{domain}.factory.ts` - Data factories
3. `mocks/{service}.mock.ts` - API mocks
4. `environments/.env.template` - Environment template

## Template

```typescript
// src/test-data/static/auth.data.ts
export const authTestData = {
  validUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'Test@12345',
    name: 'Test User',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

// src/test-data/dynamic/user.factory.ts
import { v4 as uuid } from 'uuid';

export function createTestUser(overrides = {}) {
  return {
    email: `test-${uuid()}@example.com`,
    password: 'Test@12345',
    name: `User ${Date.now()}`,
    ...overrides,
  };
}
```

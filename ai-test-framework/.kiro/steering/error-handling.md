# Error Handling Guidelines

## Principles

1. **Fail Fast** - Detect issues early and report immediately
2. **Meaningful Messages** - Every error should explain what went wrong and context
3. **Recovery Strategy** - Attempt recovery before failing when possible
4. **No Silent Failures** - Never swallow exceptions without logging

## Error Categories

### Test Failures
- Assertion failures → Report with expected vs actual
- Element not found → Report locator and page state
- Timeout → Report action and timeout duration
- Network errors → Report URL and response status

### Framework Errors
- Configuration errors → Validate config at startup
- Data errors → Validate test data before use
- Environment errors → Check connectivity before execution

### Infrastructure Errors
- Browser crash → Retry with fresh context
- Network timeout → Retry with exponential backoff
- Resource exhaustion → Scale down parallelism

## Error Handling Pattern

```typescript
import { Logger } from '../utils/logger.util';

export async function safeAction<T>(
  action: () => Promise<T>,
  context: string,
  retries: number = 0
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await action();
    } catch (error) {
      Logger.error(`[${context}] Attempt ${attempt + 1} failed`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      if (attempt === retries) throw error;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw new Error(`[${context}] All retries exhausted`);
}
```

## Retry Strategy

| Error Type | Max Retries | Backoff |
|-----------|-------------|---------|
| Network Timeout | 3 | Exponential |
| Element Not Found | 1 | Linear |
| Browser Crash | 2 | Fixed 5s |
| Assertion Failure | 0 | None |

## Logging Requirements

- Log level: ERROR for failures, WARN for retries, INFO for actions
- Include timestamp, test name, step, and page URL
- Attach page screenshot on ERROR
- Include DOM snapshot for locator failures

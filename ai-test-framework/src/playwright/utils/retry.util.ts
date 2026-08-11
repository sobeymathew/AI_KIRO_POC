import { Logger } from './logger.util';

const logger = new Logger('RetryUtil');

export interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  backoff: 'linear' | 'exponential';
  context: string;
}

const defaultOptions: RetryOptions = {
  maxRetries: 3,
  delayMs: 1000,
  backoff: 'exponential',
  context: 'unknown',
};

/**
 * Retry utility with configurable backoff strategy.
 * Use for operations that may fail due to timing or transient issues.
 */
export async function retry<T>(
  action: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (attempt === opts.maxRetries) {
        logger.error(`[${opts.context}] All ${opts.maxRetries} retries exhausted`, {
          error: errorMessage,
        });
        throw error;
      }

      const delay =
        opts.backoff === 'exponential'
          ? opts.delayMs * Math.pow(2, attempt)
          : opts.delayMs * (attempt + 1);

      logger.warn(
        `[${opts.context}] Attempt ${attempt + 1} failed, retrying in ${delay}ms`,
        { error: errorMessage }
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`[${opts.context}] Unexpected retry loop exit`);
}

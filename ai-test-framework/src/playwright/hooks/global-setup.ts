import { FullConfig } from '@playwright/test';
import { Logger } from '../utils/logger.util';
import dotenv from 'dotenv';
import path from 'path';

const logger = new Logger('GlobalSetup');

/**
 * Global setup runs once before all tests.
 * Use for environment validation, auth state setup, and test data preparation.
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const env = process.env.ENV || 'dev';
  logger.info(`Starting global setup for environment: ${env}`);

  // Load environment configuration
  dotenv.config({
    path: path.resolve(__dirname, `../../config/.env.${env}`),
  });

  // Validate required environment variables
  const requiredVars = ['BASE_URL'];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  logger.info('Environment validated successfully');
  logger.info(`Base URL: ${process.env.BASE_URL}`);
  logger.info(`Workers: ${config.workers}`);

  // Create authentication state if needed
  if (process.env.AUTH_SETUP === 'true') {
    logger.info('Setting up authentication state...');
    // Auth setup would go here
  }

  logger.info('Global setup complete');
}

export default globalSetup;

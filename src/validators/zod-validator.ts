import type { Validator, ValidatorResult } from '../types';
import type { z, ZodError } from 'zod';
import { logger } from '../logger';

export class ZodValidator implements Validator {
  async validate(
    env: Record<string, string>,
    schema: z.ZodSchema
  ): Promise<ValidatorResult[]> {
    logger.info('🔍 Validating environment variables with Zod...');

    try {
      const zodSchema = schema;
      const result = zodSchema.safeParse(env);

      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
          logger.error(`  - ${path}: ${issue.message}`);
        }
        logger.error(
          `Environment validation failed with error: ${result.error.message}`
        );
        process.exit(1);
      }

      logger.success('Environment validation successful!');

      return Object.entries(result.data as Record<string, unknown>).map(
        ([key, value]) => ({
          key,
          value,
        })
      );
    } catch (err: unknown) {
      const error = err as ZodError;

      logger.error(
        `Environment validation failed with error: ${error.message}`
      );
      process.exit(1);
    }
  }
}

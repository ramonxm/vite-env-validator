import type { Validator, ValidatorResult } from '../types';
import type { Schema } from 'joi';
import type { ValidationError } from 'joi';
import { logger } from '../logger';

export class JoiValidator implements Validator {
  async validate(
    env: Record<string, string>,
    schema: Schema
  ): Promise<ValidatorResult[]> {
    logger.info('🔍 Validating environment variables with Joi...');

    try {
      const joiSchema = schema;
      const result = await joiSchema.validateAsync(env, { abortEarly: false });

      logger.success('Environment validation successful!');

      return Object.entries(result).map(([key, value]) => ({ key, value }));
    } catch (err: unknown) {
      const error = err as ValidationError;

      if (error.details) {
        for (const detail of error.details) {
          logger.error(`  - ${detail.path.join('.')}: ${detail.message}`);
        }
      } else {
        logger.error(`  - ${error.message}`);
      }
      logger.error(
        `Environment validation failed with error: ${error.message}`
      );
      process.exit(1);
    }
  }
}

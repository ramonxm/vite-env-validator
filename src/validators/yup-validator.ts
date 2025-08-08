import type { Validator, ValidatorResult } from '../types';
import type { ObjectSchema, ValidationError } from 'yup';
import { logger } from '../logger';

export class YupValidator implements Validator {
  async validate(
    env: Record<string, string>,
    schema: ObjectSchema<Record<string, unknown>>
  ): Promise<ValidatorResult[]> {
    logger.info('🔍 Validating environment variables with Yup...');

    try {
      const yupSchema = schema;
      const result = await yupSchema.validate(env, { abortEarly: false });

      logger.success('Environment validation successful!');

      return Object.entries(result).map(([key, value]) => ({
        key,
        value,
      }));
    } catch (err: unknown) {
      const error = err as ValidationError;

      if (error.inner) {
        for (const validationError of error.inner) {
          logger.error(
            `  - ${validationError.path}: ${validationError.message}`
          );
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

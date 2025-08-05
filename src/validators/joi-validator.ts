import type { Validator, ValidatorResult } from '../types';

export class JoiValidator implements Validator {
  async validate(
    env: Record<string, string>,
    schema: unknown
  ): Promise<ValidatorResult[]> {
    console.log('🔍 Validating environment variables with Joi...');

    try {
      const joiSchema = schema as any;
      const result = await joiSchema.validateAsync(env, { abortEarly: false });

      console.log('✅ Environment validation successful!');

      return Object.entries(result).map(([key, value]) => ({
        key,
        value,
      }));
    } catch (error: any) {
      if (error.details) {
        for (const detail of error.details) {
          console.error(`  - ${detail.path.join('.')}: ${detail.message}`);
        }
      } else {
        console.error(`  - ${error.message}`);
      }
      console.error(
        '❌ Environment validation failed with error:',
        error.message
      );
      process.exit(1);
    }
  }
}

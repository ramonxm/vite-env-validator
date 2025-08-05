import type { Validator, ValidatorResult } from '../types';

export class YupValidator implements Validator {
  async validate(env: Record<string, string>, schema: unknown): Promise<ValidatorResult[]> {
    console.log('🔍 Validating environment variables with Yup...');

    try {
      const yupSchema = schema as any;
      const result = await yupSchema.validate(env, { abortEarly: false });

      console.log('✅ Environment validation successful!');
      
      return Object.entries(result).map(([key, value]) => ({
        key,
        value
      }));
    } catch (error: any) {
      if (error.inner) {
        for (const validationError of error.inner) {
          console.error(`  - ${validationError.path}: ${validationError.message}`);
        }
      } else {
        console.error(`  - ${error.message}`);
      }
      console.error('❌ Environment validation failed with error:', error.message);
      process.exit(1);
    }
  }
} 
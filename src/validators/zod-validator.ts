import type { Validator, ValidatorResult } from '../types';

export class ZodValidator implements Validator {
  async validate(
    env: Record<string, string>,
    schema: unknown
  ): Promise<ValidatorResult[]> {
    console.log('🔍 Validating environment variables with Zod...');

    try {
      const zodSchema = schema as any;
      const result = zodSchema.safeParse(env);

      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
          console.error(`  - ${path}: ${issue.message}`);
        }
        console.error(
          '❌ Environment validation failed with error:',
          result.error.message
        );
        process.exit(1);
      }

      console.log('✅ Environment validation successful!');

      return Object.entries(result.data).map(([key, value]) => ({
        key,
        value,
      }));
    } catch (error: any) {
      console.error(
        '❌ Environment validation failed with error:',
        error.message
      );
      process.exit(1);
    }
  }
}

import { Plugin } from 'vite';
import { z } from 'zod';
import { ObjectSchema } from 'yup';
import { Schema } from 'joi';

interface ZodValidationOptions {
    validator: 'zod';
    schema: z.ZodSchema;
}
interface YupValidationOptions {
    validator: 'yup';
    schema: ObjectSchema<Record<string, unknown>>;
}
interface JoiValidationOptions {
    validator: 'joi';
    schema: Schema;
}
type ValidationOptions = ZodValidationOptions | YupValidationOptions | JoiValidationOptions;

declare const validateEnv: (options: ValidationOptions) => Plugin;

export { type ValidationOptions, validateEnv };

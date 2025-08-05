import type { z } from 'zod';
import type { ObjectSchema } from 'yup';
import type { Schema } from 'joi';
import type { ZodValidationOptions, YupValidationOptions, JoiValidationOptions } from './types';

export { validateEnv } from './validate-env';
export type { ValidationOptions } from './types';

export const withZod = (schema: z.ZodSchema): ZodValidationOptions => ({
  validator: 'zod',
  schema
});

export const withYup = (schema: ObjectSchema<any>): YupValidationOptions => ({
  validator: 'yup',
  schema
});

export const withJoi = (schema: Schema): JoiValidationOptions => ({
  validator: 'joi',
  schema
});
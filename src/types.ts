import type { z } from 'zod';
import type { ObjectSchema } from 'yup';
import type { Schema } from 'joi';

export interface ValidatorResult {
  key: string;
  value: unknown;
}

export interface Validator {
  validate(
    env: Record<string, string>,
    schema: unknown
  ): Promise<ValidatorResult[]>;
}

export interface ZodValidationOptions {
  validator: 'zod';
  schema: z.ZodSchema;
}

export interface YupValidationOptions {
  validator: 'yup';
  schema: ObjectSchema<Record<string, unknown>>;
}

export interface JoiValidationOptions {
  validator: 'joi';
  schema: Schema;
}

export type ValidationOptions =
  | ZodValidationOptions
  | YupValidationOptions
  | JoiValidationOptions;

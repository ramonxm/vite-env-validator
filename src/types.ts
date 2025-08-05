import type { z } from 'zod';
import type { ObjectSchema } from 'yup';
import type { Schema } from 'joi';

export interface ValidatorResult {
  key: string;
  value: unknown;
}

export interface Validator {
  validate(env: Record<string, string>, schema: unknown): Promise<ValidatorResult[]>;
}

// Tipos específicos para cada validador
export interface ZodValidationOptions {
  validator: 'zod';
  schema: z.ZodSchema;
}

export interface YupValidationOptions {
  validator: 'yup';
  schema: ObjectSchema<any>;
}

export interface JoiValidationOptions {
  validator: 'joi';
  schema: Schema;
}

// Union type para todas as opções
export type ValidationOptions = ZodValidationOptions | YupValidationOptions | JoiValidationOptions; 
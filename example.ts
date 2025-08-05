import { defineConfig } from 'vite';
import { validateEnv, withZod, withYup, withJoi } from './src/index';
import { z } from 'zod';
import * as yup from 'yup';
import Joi from 'joi';

// Exemplo com Zod - Full autocomplete e type safety
const zodOptions = withZod(
  z.object({
    VITE_API_URL: z.string().url(),
    VITE_API_KEY: z.string().min(1),
    VITE_DEBUG: z.boolean().default(false),
  })
);
// ✅ zodOptions.validator é tipado como 'zod'
// ✅ zodOptions.schema é tipado como z.ZodSchema

// Exemplo com Yup - Agora com type safety real
const yupOptions = withYup(
  yup.object({
    VITE_API_URL: yup.string().url().required(),
    VITE_API_KEY: yup.string().min(1).required(),
    VITE_DEBUG: yup.boolean().default(false),
  })
);
// ✅ yupOptions.validator é tipado como 'yup'
// ✅ yupOptions.schema é tipado como ObjectSchema<any>
// ✅ Autocomplete completo para métodos do Yup

// Exemplo com Joi - Agora com type safety real
const joiOptions = withJoi(
  Joi.object({
    VITE_API_URL: Joi.string().uri().required(),
    VITE_API_KEY: Joi.string().min(1).required(),
    VITE_DEBUG: Joi.boolean().default(false),
  })
);
// ✅ joiOptions.validator é tipado como 'joi'
// ✅ joiOptions.schema é tipado como Schema
// ✅ Autocomplete completo para métodos do Joi

export default defineConfig({
  plugins: [
    validateEnv(zodOptions),
  ],
}); 
# Vite Env Validator

A Vite plugin for environment variable validation with support for multiple validation libraries.

## Features

- 🔧 **Multiple Validators**: Support for Zod, Yup, and Joi
- 🎯 **Type Safety**: Full TypeScript support with autocomplete
- ⚡ **Zero Config**: Works out of the box with sensible defaults
- 🚀 **Fast**: Lightweight and performant

## Installation

First, install the plugin:

```bash
npm install @rxm/vite-env-validator
# or
pnpm add @rxm/vite-env-validator
# or
yarn add @rxm/vite-env-validator
```

Then, install at least one of the validation libraries you want to use:

### For Zod (Recommended)
```bash
npm install zod
# or
pnpm add zod
# or
yarn add zod
```

### For Yup
```bash
npm install yup
# or
pnpm add yup
# or
yarn add yup
```

### For Joi
```bash
npm install joi
# or
pnpm add joi
# or
yarn add joi
```

**Note**: You only need to install the validation library you plan to use. The plugin uses peer dependencies, so you can choose which validator fits your needs best.

### How it works

The plugin dynamically loads only the validation libraries that are installed in your project. This means:

- ✅ **Install only what you need**: If you only install Zod, only Zod will be available
- ✅ **No bundle bloat**: Unused validators won't be included in your bundle
- ✅ **Graceful fallback**: If you try to use a validator that isn't installed, you'll get a clear error message
- ✅ **Type safety**: Full TypeScript support for your chosen validator

## Usage

### Basic Usage

```typescript
import { defineConfig } from 'vite';
import { validateEnv, withZod, withYup, withJoi } from '@rxm/vite-env-validator';
import { z } from 'zod';

export default defineConfig({
  plugins: [
    validateEnv(
      withZod(
        z.object({
          VITE_API_URL: z.string().url(),
          VITE_API_KEY: z.string().min(1),
          VITE_DEBUG: z.boolean().default(false),
        })
      )
    ),
  ],
});
```

### With Yup

```typescript
import { defineConfig } from 'vite';
import { validateEnv, withYup } from '@rxm/vite-env-validator';
import * as yup from 'yup';

export default defineConfig({
  plugins: [
    validateEnv(
      withYup(
        yup.object({
          VITE_API_URL: yup.string().url().required(),
          VITE_API_KEY: yup.string().min(1).required(),
          VITE_DEBUG: yup.boolean().default(false),
        })
      )
    ),
  ],
});
```

### With Joi

```typescript
import { defineConfig } from 'vite';
import { validateEnv, withJoi } from '@rxm/vite-env-validator';
import Joi from 'joi';

export default defineConfig({
  plugins: [
    validateEnv(
      withJoi(
        Joi.object({
          VITE_API_URL: Joi.string().uri().required(),
          VITE_API_KEY: Joi.string().min(1).required(),
          VITE_DEBUG: Joi.boolean().default(false),
        })
      )
    ),
  ],
});
```

## Type Safety

The plugin provides full TypeScript support with autocomplete for all validators:

### Zod - Full Type Safety

```typescript
import { withZod } from '@rxm/vite-env-validator';
import { z } from 'zod';

// ✅ Full autocomplete and type safety
const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_API_KEY: z.string().min(1),
});

const options = withZod(schema);
// options.validator is typed as 'zod'
// options.schema is typed as z.ZodSchema
```

### Yup - Full Type Safety

```typescript
import { withYup } from '@rxm/vite-env-validator';
import * as yup from 'yup';

const options = withYup(
  yup.object({
    VITE_API_URL: yup.string().url().required(),
    VITE_API_KEY: yup.string().min(1).required(),
    VITE_DEBUG: yup.boolean().default(false),
  })
);
// ✅ options.validator is typed as 'yup'
// ✅ options.schema is typed as ObjectSchema<any>
// ✅ Full autocomplete for all Yup methods
```

### Joi - Full Type Safety

```typescript
import { withJoi } from '@rxm/vite-env-validator';
import Joi from 'joi';

const options = withJoi(
  Joi.object({
    VITE_API_URL: Joi.string().uri().required(),
    VITE_API_KEY: Joi.string().min(1).required(),
    VITE_DEBUG: Joi.boolean().default(false),
  })
);
// ✅ options.validator is typed as 'joi'
// ✅ options.schema is typed as Schema
// ✅ Full autocomplete for all Joi methods
```

## Configuration

The plugin supports configuration via:

1. **Inline options** (recommended)
2. **Configuration file** (`env.ts`, `env.js`, etc.)

### Configuration File

Create an `env.ts` file in your project root:

```typescript
import { withZod } from '@rxm/vite-env-validator';
import { z } from 'zod';

export default withZod(
  z.object({
    VITE_API_URL: z.string().url(),
    VITE_API_KEY: z.string().min(1),
    VITE_DEBUG: z.boolean().default(false),
  })
);
```

## Environment Variables

The plugin will validate environment variables and make them available to your application:

```typescript
// These will be validated and typed
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_API_KEY);
console.log(import.meta.env.VITE_DEBUG);
```

## Error Handling

If validation fails, the plugin will:

1. Log detailed error messages
2. Exit the build process
3. Provide helpful debugging information

### Supported Versions

- **Zod**: `^3.0.0 || ^4.0.0`
- **Yup**: `^1.0.0`
- **Joi**: `^17.0.0`

## License

MIT 
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
npm install vite-plugin-env-validator -D
# or
pnpm add vite-plugin-env-validator -D
# or
yarn add vite-plugin-env-validator -D
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
import { validateEnv } from 'vite-plugin-env-validator';
import { z } from 'zod';

export default defineConfig({
  plugins: [
    validateEnv({
      validator: 'zod',
      schema: z.object({
        VITE_API_URL: z.string().url(),
        VITE_API_KEY: z.string().min(1),
        VITE_DEBUG: z.boolean().default(false),
      }),
    }),
  ],
});
```

### With Yup

```typescript
import { defineConfig } from 'vite';
import { validateEnv } from 'vite-plugin-env-validator';
import * as yup from 'yup';

export default defineConfig({
  plugins: [
    validateEnv({
      validator: 'yup',
      schema: yup.object({
        VITE_API_URL: yup.string().url().required(),
        VITE_API_KEY: yup.string().min(1).required(),
        VITE_DEBUG: yup.boolean().default(false),
      }),
    }),
  ],
});
```

### With Joi

```typescript
import { defineConfig } from 'vite';
import { validateEnv } from 'vite-plugin-env-validator';
import Joi from 'joi';

export default defineConfig({
  plugins: [
    validateEnv({
      validator: 'joi',
      schema: Joi.object({
        VITE_API_URL: Joi.string().uri().required(),
        VITE_API_KEY: Joi.string().min(1).required(),
        VITE_DEBUG: Joi.boolean().default(false),
      }),
    }),
  ],
});
```

## Getting Better Autocomplete

For the best TypeScript experience with full autocomplete, you can import the specific types from the validation libraries in your project:

### Enhanced Type Safety with Zod

```typescript
import { defineConfig } from 'vite';
import { validateEnv } from 'vite-plugin-env-validator';
import { z } from 'zod';


const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_API_KEY: z.string().min(1),
});

export default defineConfig({
  plugins: [
    validateEnv({
      validator: 'zod',
      schema,
    }),
  ],
});
```

### Enhanced Type Safety with Yup

```typescript
import { defineConfig } from 'vite';
import { validateEnv } from 'vite-plugin-env-validator';
import * as yup from 'yup';


const schema = yup.object({
  VITE_API_URL: yup.string().url().required(),
  VITE_API_KEY: yup.string().min(1).required(),
});

export default defineConfig({
  plugins: [
    validateEnv({
      validator: 'yup',
      schema,
    }),
  ],
});
```

### Enhanced Type Safety with Joi

```typescript
import { defineConfig } from 'vite';
import { validateEnv } from 'vite-plugin-env-validator';
import Joi from 'joi';


const schema = Joi.object({
  VITE_API_URL: Joi.string().uri().required(),
  VITE_API_KEY: Joi.string().min(1).required(),
});

export default defineConfig({
  plugins: [
    validateEnv({
      validator: 'joi',
      schema,
    }),
  ],
});
```

## Environment Variables

The plugin will validate environment variables and make them available to your application:


## Error Handling

If validation fails, the plugin will:

1. Log detailed error messages
2. Exit the build process
3. Provide helpful debugging information

### Supported Versions

- **Node.js**: `>=20.0.0`
- **Zod**: `^3.0.0 || ^4.0.0`
- **Yup**: `^1.0.0`
- **Joi**: `^17.0.0`

## License

MIT 
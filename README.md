# Vite Plugin Env Validator

A Vite plugin for environment variable validation with support for multiple validation libraries.

> **Perfect for**: Vite projects that need type-safe environment variable validation at build time
> 
> **Supports**: Zod, Yup, and Joi validation libraries
> 
> **Features**: TypeScript support, zero config, lightweight, build-time validation

[![npm version](https://img.shields.io/npm/v/vite-plugin-env-validator.svg)](https://www.npmjs.com/package/vite-plugin-env-validator)
[![npm downloads](https://img.shields.io/npm/dm/vite-plugin-env-validator.svg)](https://www.npmjs.com/package/vite-plugin-env-validator)
[![License](https://img.shields.io/npm/l/vite-plugin-env-validator.svg)](https://github.com/ramonxm/vite-env-validator/blob/main/LICENSE)

## Features

- 🔧 **Multiple Validators**: Support for Zod, Yup, and Joi
- 🎯 **Type Safety**: Full TypeScript support with autocomplete
- ⚡ **Zero Config**: Works out of the box with sensible defaults
- 🚀 **Fast**: Lightweight and performant
- 🛡️ **Build-time Validation**: Catch environment errors early
- 📦 **Peer Dependencies**: Only install what you need
- 🎯 **Clear Error Messages**: Helpful debugging information

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

## Why use this plugin?

- **Type Safety**: Get full TypeScript support for your environment variables
- **Build-time Validation**: Catch missing or invalid environment variables before deployment
- **Multiple Validators**: Choose the validation library you prefer (Zod, Yup, or Joi)
- **Zero Bundle Impact**: Only includes the validators you actually use
- **Clear Errors**: Get helpful error messages when validation fails

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

The plugin will validate environment variables and make them available to your application. Invalid or missing environment variables will cause the build to fail with clear error messages.

### Example Error Output

```
❌ Environment variable validation failed!

Missing required environment variables:
  - VITE_API_URL
  - VITE_API_KEY

Invalid environment variables:
  - VITE_DEBUG: Expected boolean, received "true" (string)
```


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

## Related

- [vite-plugin-env](https://github.com/liximomo/vite-plugin-env) - Environment variable loading for Vite
- [vite-plugin-dotenv](https://github.com/fi3ework/vite-plugin-dotenv) - Load environment variables from .env files
- [zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation
- [yup](https://github.com/jquense/yup) - Object schema validation
- [joi](https://github.com/hapijs/joi) - Object schema description language and validator

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Ramon Xavier](https://github.com/ramonxm) 
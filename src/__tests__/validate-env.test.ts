import { validateEnv } from '../validate-env';
import { withZod } from '../index';
import { z } from 'zod';

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock('unconfig', () => ({
  createConfigLoader: jest.fn().mockReturnValue({
    load: jest.fn().mockResolvedValue({
      config: {
        validator: 'zod',
        schema: z.object({
          VITE_API_URL: z.string().url(),
        }),
      },
    }),
  }),
}));

jest.mock('vite', () => ({
  normalizePath: jest.fn((path) => path),
  loadEnv: jest.fn(() => ({
    VITE_API_URL: 'https://api.example.com',
    VITE_DEBUG: 'true',
  })),
}));

jest.mock('../validators', () => ({
  getValidators: jest.fn().mockResolvedValue({
    zod: {
      validate: jest.fn().mockResolvedValue([
        { key: 'VITE_API_URL', value: 'https://api.example.com' },
        { key: 'VITE_DEBUG', value: true },
      ]),
    },
  }),
}));

describe('validateEnv Plugin', () => {
  describe('validateEnv', () => {
    it('should create a plugin with correct name', () => {
      const schema = z.object({
        VITE_API_URL: z.string().url(),
      });

      const plugin = validateEnv(withZod(schema));

      expect(plugin.name).toBe('vite-env-validator');
      expect(plugin.config).toBeDefined();
    });

    it('should validate environment variables and return define object', async () => {
      const schema = z.object({
        VITE_API_URL: z.string().url(),
        VITE_DEBUG: z.boolean().default(false),
      });

      const plugin = validateEnv(withZod(schema));
      const config = {};
      const env = { mode: 'development' };

      const result = await (plugin.config as any)(config, env);

      expect(result).toEqual({
        define: {
          'import.meta.env.VITE_API_URL': '"https://api.example.com"',
          'import.meta.env.VITE_DEBUG': 'true',
        },
      });
    });

    it('should handle validation errors', async () => {
      const { getValidators } = require('../validators');
      getValidators.mockResolvedValue({
        zod: {
          validate: jest.fn().mockRejectedValue(new Error('Validation failed')),
        },
      });

      const schema = z.object({
        VITE_API_URL: z.string().url(),
      });

      const plugin = validateEnv(withZod(schema));
      const config = {};
      const env = { mode: 'development' };

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      await expect((plugin.config as any)(config, env)).rejects.toThrow(
        'process.exit called'
      );

      mockExit.mockRestore();
    });

    it('should handle unsupported validator', async () => {
      const { getValidators } = require('../validators');
      getValidators.mockResolvedValue({});

      const schema = z.object({
        VITE_API_URL: z.string().url(),
      });

      const plugin = validateEnv(withZod(schema));
      const config = {};
      const env = { mode: 'development' };

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      await expect((plugin.config as any)(config, env)).rejects.toThrow(
        'process.exit called'
      );

      mockExit.mockRestore();
    });

    it('should handle custom root directory', async () => {
      const schema = z.object({
        VITE_API_URL: z.string().url(),
      });

      const plugin = validateEnv(withZod(schema));
      const config = { root: '/custom/path' };
      const env = { mode: 'development' };

      const result = await (plugin.config as any)(config, env);

      expect(result).toBeDefined();
    });

    it('should handle custom env directory', async () => {
      const schema = z.object({
        VITE_API_URL: z.string().url(),
      });

      const plugin = validateEnv(withZod(schema));
      const config = { envDir: '/custom/env/path' };
      const env = { mode: 'development' };

      const result = await (plugin.config as any)(config, env);

      expect(result).toBeDefined();
    });

    it('should handle custom env prefix', async () => {
      const schema = z.object({
        CUSTOM_API_URL: z.string().url(),
      });

      const plugin = validateEnv(withZod(schema));
      const config = { envPrefix: 'CUSTOM_' };
      const env = { mode: 'development' };

      const result = await (plugin.config as any)(config, env);

      expect(result).toBeDefined();
    });
  });
});

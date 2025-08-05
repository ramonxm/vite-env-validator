import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ZodValidator } from '../validators/zod-validator';
import { z } from 'zod';

describe('ZodValidator', () => {
  let validator: ZodValidator;

  beforeEach(() => {
    validator = new ZodValidator();
  });

  describe('validate', () => {
    it('should validate environment variables successfully', async () => {
      const schema = z.object({
        VITE_API_URL: z.string().url(),
        VITE_API_KEY: z.string().min(1),
        VITE_DEBUG: z.boolean().default(false),
      });

      const env = {
        VITE_API_URL: 'https://api.example.com',
        VITE_API_KEY: 'secret-key',
        VITE_DEBUG: 'true',
      };

      const result = await validator.validate(env, schema);

      expect(result).toEqual([
        { key: 'VITE_API_URL', value: 'https://api.example.com' },
        { key: 'VITE_API_KEY', value: 'secret-key' },
        { key: 'VITE_DEBUG', value: true },
      ]);
    });

    it('should handle validation errors', async () => {
      const schema = z.object({
        VITE_API_URL: z.string().url(),
        VITE_API_KEY: z.string().min(1),
      });

      const env = {
        VITE_API_URL: 'invalid-url',
        VITE_API_KEY: '',
      };

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      await expect(validator.validate(env, schema)).rejects.toThrow(
        'process.exit called'
      );

      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });

    it('should handle missing required fields', async () => {
      const schema = z.object({
        VITE_API_URL: z.string().url(),
        VITE_API_KEY: z.string().min(1),
      });

      const env = {
        VITE_API_URL: 'https://api.example.com',
        // Missing VITE_API_KEY
      };

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      await expect(validator.validate(env, schema)).rejects.toThrow(
        'process.exit called'
      );

      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });

    it('should handle default values', async () => {
      const schema = z.object({
        VITE_API_URL: z.string().url(),
        VITE_DEBUG: z.boolean().default(false),
      });

      const env = {
        VITE_API_URL: 'https://api.example.com',
        // VITE_DEBUG not provided, should use default
      };

      const result = await validator.validate(env, schema);

      expect(result).toEqual([
        { key: 'VITE_API_URL', value: 'https://api.example.com' },
        { key: 'VITE_DEBUG', value: false },
      ]);
    });

    it('should handle boolean conversion', async () => {
      const schema = z.object({
        VITE_DEBUG: z.boolean(),
      });

      const env = {
        VITE_DEBUG: 'true',
      };

      const result = await validator.validate(env, schema);

      expect(result).toEqual([{ key: 'VITE_DEBUG', value: true }]);
    });
  });
});

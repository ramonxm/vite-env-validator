import { JoiValidator } from '../validators/joi-validator';
import Joi from 'joi';

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('JoiValidator', () => {
  let validator: JoiValidator;

  beforeEach(() => {
    validator = new JoiValidator();
  });

  describe('validate', () => {
    it('should validate environment variables successfully', async () => {
      const schema = Joi.object({
        VITE_API_URL: Joi.string().uri().required(),
        VITE_API_KEY: Joi.string().min(1).required(),
        VITE_DEBUG: Joi.boolean().default(false),
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
      const schema = Joi.object({
        VITE_API_URL: Joi.string().uri().required(),
        VITE_API_KEY: Joi.string().min(1).required(),
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
      const schema = Joi.object({
        VITE_API_URL: Joi.string().uri().required(),
        VITE_API_KEY: Joi.string().min(1).required(),
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
      const schema = Joi.object({
        VITE_API_URL: Joi.string().uri().required(),
        VITE_DEBUG: Joi.boolean().default(false),
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
      const schema = Joi.object({
        VITE_DEBUG: Joi.boolean(),
      });

      const env = {
        VITE_DEBUG: 'true',
      };

      const result = await validator.validate(env, schema);

      expect(result).toEqual([{ key: 'VITE_DEBUG', value: true }]);
    });

    it('should handle number conversion', async () => {
      const schema = Joi.object({
        VITE_PORT: Joi.number().default(3000),
      });

      const env = {
        VITE_PORT: '8080',
      };

      const result = await validator.validate(env, schema);

      expect(result).toEqual([{ key: 'VITE_PORT', value: 8080 }]);
    });

    it('should handle string validation', async () => {
      const schema = Joi.object({
        VITE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
      });

      const env = {
        VITE_ENV: 'development',
      };

      const result = await validator.validate(env, schema);

      expect(result).toEqual([{ key: 'VITE_ENV', value: 'development' }]);
    });
  });
});

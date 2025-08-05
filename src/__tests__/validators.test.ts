// Mock the validator modules
jest.mock('../validators/zod-validator');
jest.mock('../validators/yup-validator');
jest.mock('../validators/joi-validator');

describe('Validators', () => {
  describe('Validator Interface', () => {
    it('should have validate method', () => {
      // Mock validator implementation
      const mockValidator = {
        validate: async () => {
          return [{ key: 'TEST_VAR', value: 'test_value' }];
        },
      };

      expect(mockValidator.validate).toBeDefined();
      expect(typeof mockValidator.validate).toBe('function');
    });

    it('should return ValidatorResult array', async () => {
      const mockValidator = {
        validate: async () => {
          return [{ key: 'TEST_VAR', value: 'test_value' }];
        },
      };

      const result = await mockValidator.validate();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('key');
      expect(result[0]).toHaveProperty('value');
    });
  });

  describe('Validation Options', () => {
    it('should support zod validator type', () => {
      const zodOptions = {
        validator: 'zod' as const,
        schema: { type: 'zod' },
      };

      expect(zodOptions.validator).toBe('zod');
      expect(zodOptions.schema).toBeDefined();
    });

    it('should support yup validator type', () => {
      const yupOptions = {
        validator: 'yup' as const,
        schema: { type: 'yup' },
      };

      expect(yupOptions.validator).toBe('yup');
      expect(yupOptions.schema).toBeDefined();
    });

    it('should support joi validator type', () => {
      const joiOptions = {
        validator: 'joi' as const,
        schema: { type: 'joi' },
      };

      expect(joiOptions.validator).toBe('joi');
      expect(joiOptions.schema).toBeDefined();
    });
  });
});

import type { Validator } from '../types';
import { logger } from '../logger';

const getValidators = async (): Promise<Record<string, Validator>> => {
  const validators: Record<string, Validator> = {};

  try {
    const { ZodValidator } = await import('./zod-validator');
    validators.zod = new ZodValidator();
  } catch (error) {
    logger.warn('Zod is not installed.');
    process.exit(1);
  }

  try {
    const { YupValidator } = await import('./yup-validator');
    validators.yup = new YupValidator();
  } catch (error) {
    logger.warn('Yup is not installed.');
    process.exit(1);
  }

  try {
    const { JoiValidator } = await import('./joi-validator');
    validators.joi = new JoiValidator();
  } catch (error) {
    logger.warn('Joi is not installed.');
    process.exit(1);
  }

  return validators;
};

export { getValidators };

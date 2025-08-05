import path from 'node:path';
import { cwd } from 'node:process';
import { createConfigLoader } from 'unconfig';
import { type ConfigEnv, type Plugin, type UserConfig } from 'vite';
import { getValidators } from './validators';
import type { ValidationOptions } from './types';

const { log, error } = console;

async function loadOptions(rootDir: string, inlineConfig: ValidationOptions) {
  log(`📁 Loading configuration from directory: ${rootDir}`);

  const source = 'env';

  const loader = createConfigLoader({
    cwd: rootDir,
    defaults: inlineConfig,
    sources: [
      { files: source, extensions: ['ts', 'cts', 'mts', 'js', 'cjs', 'mjs'] },
    ],
  });

  const result = await loader.load();
  const config = result.config;

  if (!config) {
    error('❌ Missing configuration for vite-plugin-env-validator');
    process.exit(1);
  }

  log('✅ Configuration loaded successfully');
  return config;
}

async function validateEnvConfig(
  userConfig: UserConfig,
  envConfig: ConfigEnv,
  inlineOptions: ValidationOptions
) {
  log(`🔄 Starting environment validation for mode: ${envConfig.mode}`);

  const { normalizePath, loadEnv } = await import('vite');
  const rootDir = userConfig.root || cwd();

  const resolvedRoot = normalizePath(
    userConfig.root ? path.resolve(userConfig.root) : process.cwd()
  );

  const envDir = userConfig.envDir
    ? normalizePath(path.resolve(resolvedRoot, userConfig.envDir))
    : resolvedRoot;

  log(`📂 Loading environment from: ${envDir}`);
  const env = loadEnv(envConfig.mode, envDir, userConfig.envPrefix);
  log(`🔢 Found ${Object.keys(env).length} environment variables`);

  const options = (await loadOptions(
    rootDir,
    inlineOptions
  )) as ValidationOptions;

  const validators = await getValidators();
  const validator = validators[options.validator];
  if (!validator) {
    error(`❌ Unsupported validator: ${options.validator}`);
    error(`Available validators: ${Object.keys(validators).join(', ')}`);
    process.exit(1);
  }

  const variables = await validator.validate(env, options.schema);

  if (!variables) {
    error('❌ Environment validation failed - no variables returned');
    process.exit(1);
  }

  const variableDefinitions = (
    Array.isArray(variables) ? variables : []
  ).reduce<Record<string, unknown>>((acc, variable) => {
    const { key, value } = variable as { key: string; value: unknown };
    if (key && value) {
      acc[`import.meta.env.${key}`] = JSON.stringify(value);
    }
    return acc;
  }, {});

  return { define: variableDefinitions };
}

export const validateEnv = (options: ValidationOptions): Plugin => {
  return {
    name: 'vite-plugin-env-validator',
    config: (config, env) => validateEnvConfig(config, env, options),
  };
};

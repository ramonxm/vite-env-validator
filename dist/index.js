var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/logger.ts
var ConsoleLogger, logger;
var init_logger = __esm({
  "src/logger.ts"() {
    "use strict";
    ConsoleLogger = class {
      info(message) {
        console.log(`\u2139\uFE0F ${message}`);
      }
      warn(message) {
        console.warn(`\u26A0\uFE0F ${message}`);
      }
      error(message) {
        console.error(`\u274C ${message}`);
      }
      success(message) {
        console.log(`\u2705 ${message}`);
      }
    };
    logger = new ConsoleLogger();
  }
});

// src/validators/zod-validator.ts
var zod_validator_exports = {};
__export(zod_validator_exports, {
  ZodValidator: () => ZodValidator
});
var ZodValidator;
var init_zod_validator = __esm({
  "src/validators/zod-validator.ts"() {
    "use strict";
    init_logger();
    ZodValidator = class {
      async validate(env, schema) {
        logger.info("\u{1F50D} Validating environment variables with Zod...");
        try {
          const zodSchema = schema;
          const result = zodSchema.safeParse(env);
          if (!result.success) {
            for (const issue of result.error.issues) {
              const path2 = issue.path.length > 0 ? issue.path.join(".") : "root";
              logger.error(`  - ${path2}: ${issue.message}`);
            }
            logger.error(
              `Environment validation failed with error: ${result.error.message}`
            );
            process.exit(1);
          }
          logger.success("Environment validation successful!");
          return Object.entries(result.data).map(
            ([key, value]) => ({
              key,
              value
            })
          );
        } catch (err) {
          const error = err;
          logger.error(
            `Environment validation failed with error: ${error.message}`
          );
          process.exit(1);
        }
      }
    };
  }
});

// src/validators/yup-validator.ts
var yup_validator_exports = {};
__export(yup_validator_exports, {
  YupValidator: () => YupValidator
});
var YupValidator;
var init_yup_validator = __esm({
  "src/validators/yup-validator.ts"() {
    "use strict";
    init_logger();
    YupValidator = class {
      async validate(env, schema) {
        logger.info("\u{1F50D} Validating environment variables with Yup...");
        try {
          const yupSchema = schema;
          const result = await yupSchema.validate(env, { abortEarly: false });
          logger.success("Environment validation successful!");
          return Object.entries(result).map(([key, value]) => ({
            key,
            value
          }));
        } catch (err) {
          const error = err;
          if (error.inner) {
            for (const validationError of error.inner) {
              logger.error(
                `  - ${validationError.path}: ${validationError.message}`
              );
            }
          } else {
            logger.error(`  - ${error.message}`);
          }
          logger.error(
            `Environment validation failed with error: ${error.message}`
          );
          process.exit(1);
        }
      }
    };
  }
});

// src/validators/joi-validator.ts
var joi_validator_exports = {};
__export(joi_validator_exports, {
  JoiValidator: () => JoiValidator
});
var JoiValidator;
var init_joi_validator = __esm({
  "src/validators/joi-validator.ts"() {
    "use strict";
    init_logger();
    JoiValidator = class {
      async validate(env, schema) {
        logger.info("\u{1F50D} Validating environment variables with Joi...");
        try {
          const joiSchema = schema;
          const result = await joiSchema.validateAsync(env, { abortEarly: false });
          logger.success("Environment validation successful!");
          return Object.entries(result).map(([key, value]) => ({ key, value }));
        } catch (err) {
          const error = err;
          if (error.details) {
            for (const detail of error.details) {
              logger.error(`  - ${detail.path.join(".")}: ${detail.message}`);
            }
          } else {
            logger.error(`  - ${error.message}`);
          }
          logger.error(
            `Environment validation failed with error: ${error.message}`
          );
          process.exit(1);
        }
      }
    };
  }
});

// src/validate-env.ts
import path from "path";
import { cwd } from "process";
import { createConfigLoader } from "unconfig";

// src/validators/index.ts
init_logger();
var getValidators = async () => {
  const validators = {};
  try {
    const { ZodValidator: ZodValidator2 } = await Promise.resolve().then(() => (init_zod_validator(), zod_validator_exports));
    validators.zod = new ZodValidator2();
  } catch (error) {
    logger.warn("Zod is not installed.");
    process.exit(1);
  }
  try {
    const { YupValidator: YupValidator2 } = await Promise.resolve().then(() => (init_yup_validator(), yup_validator_exports));
    validators.yup = new YupValidator2();
  } catch (error) {
    logger.warn("Yup is not installed.");
    process.exit(1);
  }
  try {
    const { JoiValidator: JoiValidator2 } = await Promise.resolve().then(() => (init_joi_validator(), joi_validator_exports));
    validators.joi = new JoiValidator2();
  } catch (error) {
    logger.warn("Joi is not installed.");
    process.exit(1);
  }
  return validators;
};

// src/validate-env.ts
init_logger();
async function loadOptions(rootDir, inlineConfig) {
  logger.info(`\u{1F4C1} Loading configuration from directory: ${rootDir}`);
  const source = "env";
  const loader = createConfigLoader({
    cwd: rootDir,
    defaults: inlineConfig,
    sources: [
      { files: source, extensions: ["ts", "cts", "mts", "js", "cjs", "mjs"] }
    ]
  });
  const result = await loader.load();
  const config = result.config;
  if (!config) {
    logger.error("Missing configuration for vite-plugin-env-validator");
    process.exit(1);
  }
  logger.success("Configuration loaded successfully");
  return config;
}
async function validateEnvConfig(userConfig, envConfig, inlineOptions) {
  logger.info(`\u{1F504} Starting environment validation for mode: ${envConfig.mode}`);
  const { normalizePath, loadEnv } = await import("vite");
  const rootDir = userConfig.root || cwd();
  const resolvedRoot = normalizePath(
    userConfig.root ? path.resolve(userConfig.root) : process.cwd()
  );
  const envDir = userConfig.envDir ? normalizePath(path.resolve(resolvedRoot, userConfig.envDir)) : resolvedRoot;
  logger.info(`\u{1F4C2} Loading environment from: ${envDir}`);
  const env = loadEnv(envConfig.mode, envDir, userConfig.envPrefix);
  logger.info(`\u{1F522} Found ${Object.keys(env).length} environment variables`);
  const options = await loadOptions(
    rootDir,
    inlineOptions
  );
  const validators = await getValidators();
  const validator = validators[options.validator];
  if (!validator) {
    logger.error(`Unsupported validator: ${options.validator}`);
    logger.error(`Available validators: ${Object.keys(validators).join(", ")}`);
    process.exit(1);
  }
  const variables = await validator.validate(env, options.schema);
  if (!variables) {
    logger.error("Environment validation failed - no variables returned");
    process.exit(1);
  }
  const variableDefinitions = (Array.isArray(variables) ? variables : []).reduce((acc, variable) => {
    const { key, value } = variable;
    if (key && value) {
      acc[`import.meta.env.${key}`] = JSON.stringify(value);
    }
    return acc;
  }, {});
  return { define: variableDefinitions };
}
var validateEnv = (options) => {
  return {
    name: "vite-plugin-env-validator",
    config: (config, env) => validateEnvConfig(config, env, options)
  };
};
export {
  validateEnv
};
//# sourceMappingURL=index.js.map
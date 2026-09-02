/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     16_environment/config.js
 *
 * Topic:
 *     Centralized Application Configuration
 *
 * ============================================================
 *
 * WHY DO WE NEED config.js?
 * ============================================================
 *
 * In a small application, you might access environment variables
 * directly:
 *
 *     process.env.PORT
 *     process.env.DATABASE_URL
 *     process.env.JWT_SECRET
 *
 *
 * But as the application grows, accessing process.env everywhere
 * becomes difficult to maintain.
 *
 *
 * Instead:
 *
 *
 *     Environment Variables
 *             ↓
 *        config.js
 *             ↓
 *       Application
 *
 *
 * config.js becomes the single place responsible for:
 *
 *     - Reading environment variables
 *     - Applying defaults
 *     - Converting types
 *     - Validating configuration
 *     - Organizing configuration
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Load environment variables
 * ============================================================
 *
 * If you use dotenv:
 *
 *     npm install dotenv
 *
 *
 * You can load it with:
 *
 *     import "dotenv/config";
 *
 *
 * This should happen before configuration values are read.
 *
 * ============================================================
 */

import "dotenv/config";

/*
 * ============================================================
 * 2. Read basic configuration
 * ============================================================
 */

const port = Number(process.env.PORT) || 3000;

const nodeEnv = process.env.NODE_ENV || "development";

console.log("Port:", port);
console.log("Environment:", nodeEnv);

/*
 * ============================================================
 * 3. Why not export process.env directly?
 * ============================================================
 *
 * Avoid spreading this throughout the application:
 *
 *
 *     process.env.PORT
 *     process.env.PORT
 *     process.env.PORT
 *
 *
 * Instead:
 *
 *
 *     config.port
 *
 *
 * This gives us one controlled configuration interface.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Basic config object
 * ============================================================
 */

const config = {
  port,
  nodeEnv,
};

console.log("Configuration:", config);

/*
 * ============================================================
 * 5. Export configuration
 * ============================================================
 *
 * In a real application:
 *
 *
 *     export const config = {
 *       ...
 *     };
 *
 *
 * Other modules can then use:
 *
 *
 *     import { config } from "./config.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Application configuration
 * ============================================================
 *
 * A backend commonly needs configuration for:
 *
 *
 *     app
 *     server
 *     database
 *     authentication
 *     logging
 *     Redis
 *     external APIs
 *
 *
 * We can organize these into nested objects.
 *
 * ============================================================
 */

const applicationConfig = {
  app: {
    name: process.env.APP_NAME || "Node.js Application",

    environment: process.env.NODE_ENV || "development",
  },

  server: {
    host: process.env.HOST || "localhost",

    port: Number(process.env.PORT) || 3000,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
};

console.log("\nApplication configuration:");

console.log(applicationConfig);

/*
 * ============================================================
 * 7. Do not log secrets
 * ============================================================
 *
 * The configuration object above contains:
 *
 *
 *     jwtSecret
 *
 *
 * In a real application, do NOT print the complete object.
 *
 *
 * BAD:
 *
 *
 *     console.log(applicationConfig);
 *
 *
 * because it may expose secrets.
 *
 *
 * Instead, log only safe information.
 *
 * ============================================================
 */

console.log({
  environment: applicationConfig.app.environment,

  port: applicationConfig.server.port,

  databaseConfigured: Boolean(applicationConfig.database.url),

  jwtConfigured: Boolean(applicationConfig.auth.jwtSecret),
});

/*
 * ============================================================
 * 8. Configuration defaults
 * ============================================================
 *
 * Some values can safely have defaults.
 *
 *
 * Example:
 *
 *
 *     PORT
 *
 * Default:
 *
 *
 *     3000
 *
 *
 * Example:
 */

const serverPort = Number(process.env.PORT) || 3000;

console.log("Server port:", serverPort);

/*
 * ============================================================
 * 9. Required configuration
 * ============================================================
 *
 * Some values should NOT have a fake default.
 *
 *
 * Example:
 *
 *
 *     DATABASE_URL
 *     JWT_SECRET
 *
 *
 * If these are required and missing, the application should
 * fail during startup.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. requireEnv()
 * ============================================================
 *
 * Create a reusable helper.
 *
 * ============================================================
 */

function requireEnv(name) {
  const value = process.env[name];

  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/*
 * ============================================================
 * 11. Example required configuration
 * ============================================================
 *
 * Uncomment these only when the variables exist.
 *
 *
 *     const databaseUrl =
 *       requireEnv("DATABASE_URL");
 *
 *
 *     const jwtSecret =
 *       requireEnv("JWT_SECRET");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Why fail fast?
 * ============================================================
 *
 * Suppose the application starts:
 *
 *
 *     Server started
 *         ↓
 *     Request arrives
 *         ↓
 *     Database connection attempted
 *         ↓
 *     DATABASE_URL missing
 *         ↓
 *     Request fails
 *
 *
 * This is undesirable.
 *
 *
 * Better:
 *
 *
 *     Application starts
 *         ↓
 *     Validate configuration
 *         ↓
 *     DATABASE_URL missing
 *         ↓
 *     Application stops immediately
 *
 *
 * This is called "fail fast".
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Type conversion
 * ============================================================
 *
 * Environment variables are strings.
 *
 *
 * Example:
 *
 *
 *     PORT=5000
 *
 *
 * process.env.PORT:
 *
 *
 *     "5000"
 *
 *
 * Convert it:
 *
 *
 *     Number(process.env.PORT)
 *
 * ============================================================
 */

const parsedPort = Number(process.env.PORT);

console.log("Parsed port:", parsedPort);

console.log("Parsed port type:", typeof parsedPort);

/*
 * ============================================================
 * 14. Boolean conversion
 * ============================================================
 *
 * Do NOT:
 *
 *
 *     Boolean(process.env.DEBUG)
 *
 *
 * because:
 *
 *
 *     Boolean("false")
 *     // true
 *
 *
 * Instead:
 */

const debugEnabled = process.env.DEBUG === "true";

console.log("Debug enabled:", debugEnabled);

/*
 * ============================================================
 * 15. Helper for boolean values
 * ============================================================
 */

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return value === "true";
}

const debug = parseBoolean(process.env.DEBUG);

console.log("Debug:", debug);

/*
 * ============================================================
 * 16. Helper for integer values
 * ============================================================
 */

function parseInteger(value, defaultValue) {
  if (value === undefined || value === "") {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new Error(`Expected integer but received: ${value}`);
  }

  return parsed;
}

const configuredPort = parseInteger(process.env.PORT, 3000);

console.log("Configured port:", configuredPort);

/*
 * ============================================================
 * 17. Validate port range
 * ============================================================
 */

function parsePort(value, defaultValue = 3000) {
  const port = parseInteger(value, defaultValue);

  if (port < 1 || port > 65535) {
    throw new Error(`Invalid port: ${port}`);
  }

  return port;
}

const validPort = parsePort(process.env.PORT);

console.log("Valid port:", validPort);

/*
 * ============================================================
 * 18. Environment-specific configuration
 * ============================================================
 *
 * Common environments:
 *
 *
 *     development
 *     test
 *     production
 *
 * ============================================================
 */

const environment = process.env.NODE_ENV || "development";

if (environment === "development") {
  console.log("Development configuration");
}

if (environment === "test") {
  console.log("Test configuration");
}

if (environment === "production") {
  console.log("Production configuration");
}

/*
 * ============================================================
 * 19. Validate environment name
 * ============================================================
 */

const allowedEnvironments = ["development", "test", "production"];

if (!allowedEnvironments.includes(environment)) {
  throw new Error(`Invalid NODE_ENV: ${environment}`);
}

/*
 * ============================================================
 * 20. Freeze configuration
 * ============================================================
 *
 * Object.freeze() prevents direct modification of the top-level
 * configuration object.
 *
 * ============================================================
 */

const frozenConfig = Object.freeze({
  environment,
  port: validPort,
});

console.log("Frozen configuration:", frozenConfig);

/*
 * ============================================================
 * 21. Export the configuration
 * ============================================================
 *
 * This is the pattern you will commonly use in a real Node.js
 * project.
 *
 * ============================================================
 */

export const config = Object.freeze({
  app: {
    name: process.env.APP_NAME || "Node.js Application",

    environment,
  },

  server: {
    host: process.env.HOST || "localhost",

    port: validPort,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
  },

  redis: {
    url: process.env.REDIS_URL,
  },
});

/*
 * ============================================================
 * 22. Safe configuration summary
 * ============================================================
 *
 * Never print secrets.
 *
 * Instead:
 */

export const configSummary = {
  environment: config.app.environment,

  host: config.server.host,

  port: config.server.port,

  databaseConfigured: Boolean(config.database.url),

  jwtConfigured: Boolean(config.auth.jwtSecret),

  redisConfigured: Boolean(config.redis.url),

  logLevel: config.logging.level,
};

console.log("\nSafe configuration summary:");

console.log(configSummary);

/*
 * ============================================================
 * 23. Importing config from another file
 * ============================================================
 *
 * Example:
 *
 *
 *     import { config } from "./config.js";
 *
 *
 * Then:
 *
 *
 *     console.log(config.server.port);
 *
 *
 *     config.database.url
 *
 *
 *     config.app.environment
 *
 *
 * This is much cleaner than accessing process.env throughout
 * the application.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Configuration architecture
 * ============================================================
 *
 *
 * .env / Runtime Environment
 *             │
 *             ↓
 *        process.env
 *             │
 *             ↓
 *        config.js
 *             │
 *      ┌──────┼──────┐
 *      ↓      ↓      ↓
 *    server database auth
 *      │      │      │
 *      └──────┼──────┘
 *             ↓
 *       Application
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Good configuration design
 * ============================================================
 *
 * A good config module should:
 *
 *
 *     1. Load environment variables
 *
 *     2. Parse values
 *
 *     3. Apply safe defaults
 *
 *     4. Validate required values
 *
 *     5. Validate allowed values
 *
 *     6. Export a clean configuration object
 *
 *     7. Avoid exposing secrets in logs
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Bad architecture
 * ============================================================
 *
 * Imagine:
 *
 *
 *     controllers/user.js
 *
 *         process.env.DATABASE_URL
 *
 *
 *     services/user.js
 *
 *         process.env.DATABASE_URL
 *
 *
 *     middleware/auth.js
 *
 *         process.env.JWT_SECRET
 *
 *
 *     routes/user.js
 *
 *         process.env.PORT
 *
 *
 * Configuration becomes scattered throughout the codebase.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Better architecture
 * ============================================================
 *
 *
 *                 config.js
 *                     │
 *          ┌──────────┼──────────┐
 *          ↓          ↓          ↓
 *      database      auth      server
 *          │          │          │
 *          └──────────┼──────────┘
 *                     ↓
 *                application
 *
 *
 * Each module consumes configuration rather than interpreting
 * environment variables itself.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Example real-world config
 * ============================================================
 *
 * A production backend might have:
 *
 *
 *     config.app.name
 *
 *     config.app.environment
 *
 *     config.server.host
 *
 *     config.server.port
 *
 *     config.database.url
 *
 *     config.auth.jwtSecret
 *
 *     config.auth.accessTokenExpiration
 *
 *     config.redis.url
 *
 *     config.logging.level
 *
 *
 * Later sections of this repository will expand these patterns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Configuration is not business logic
 * ============================================================
 *
 * config.js should answer:
 *
 *
 *     "What configuration is the application running with?"
 *
 *
 * It should generally not contain:
 *
 *
 *     User registration logic
 *     Database queries
 *     HTTP route handlers
 *     Authentication workflows
 *
 *
 * Keep configuration separate from business logic.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Configuration validation boundary
 * ============================================================
 *
 *
 *             process.env
 *                  │
 *                  ↓
 *              config.js
 *                  │
 *              validate
 *                  │
 *                  ↓
 *          trusted application config
 *
 *
 * After this boundary, the rest of the application can work
 * with known types and validated values.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Example .env
 * ============================================================
 *
 *     APP_NAME=Node Backend
 *     NODE_ENV=development
 *     HOST=localhost
 *     PORT=5000
 *
 *     DATABASE_URL=mongodb://localhost:27017/app
 *
 *     JWT_SECRET=development-secret
 *
 *     REDIS_URL=redis://localhost:6379
 *
 *     LOG_LEVEL=debug
 *
 *
 * The application reads these through config.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Production example
 * ============================================================
 *
 * Production should supply configuration through the deployment
 * environment or an appropriate secret/configuration manager.
 *
 *
 * Conceptually:
 *
 *
 *     Production environment
 *             ↓
 *     process.env
 *             ↓
 *         config.js
 *             ↓
 *        application
 *
 *
 * The source code remains the same.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Configuration checklist
 * ============================================================
 *
 * Before starting the application:
 *
 *
 *     ✓ Environment loaded
 *
 *     ✓ Required variables present
 *
 *     ✓ Numbers parsed
 *
 *     ✓ Booleans parsed
 *
 *     ✓ URLs validated
 *
 *     ✓ Environment validated
 *
 *     ✓ Safe defaults applied
 *
 *     ✓ Secrets not logged
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                    ENVIRONMENT
 *                         │
 *                         ↓
 *                    process.env
 *                         │
 *                         ↓
 *                      config.js
 *                         │
 *              ┌──────────┼──────────┐
 *              ↓          ↓          ↓
 *           server     database     auth
 *              │          │          │
 *              └──────────┼──────────┘
 *                         ↓
 *                    APPLICATION
 *
 *
 * Main principle:
 *
 *
 *     Read environment variables once.
 *
 *     Parse and validate them centrally.
 *
 *     Export a clean configuration object.
 *
 *     Let the rest of the application consume config.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     16_environment/development.js
 *
 * ============================================================
 */

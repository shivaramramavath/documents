/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     16_environment/development.js
 *
 * Topic:
 *     Development Environment Configuration
 *
 * ============================================================
 *
 * WHAT IS A DEVELOPMENT ENVIRONMENT?
 * ============================================================
 *
 * The development environment is where we build, debug, test,
 * and modify the application locally.
 *
 * Typical characteristics:
 *
 *     - Detailed logs
 *     - Debugging enabled
 *     - Automatic restart
 *     - Local database
 *     - Development API keys
 *     - Relaxed security settings
 *     - Source maps
 *     - Fast feedback
 *
 *
 * Development should NOT use production secrets or production
 * databases.
 *
 * ============================================================
 *
 * ENVIRONMENT FLOW
 * ============================================================
 *
 *     .env
 *       ↓
 *     process.env
 *       ↓
 *     config.js
 *       ↓
 *     development.js
 *       ↓
 *     application
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Load environment variables
 * ============================================================
 */

import "dotenv/config";

/*
 * ============================================================
 * 2. Identify the environment
 * ============================================================
 */

const environment = process.env.NODE_ENV || "development";

console.log("Current environment:", environment);

/*
 * ============================================================
 * 3. Ensure this file is used for development
 * ============================================================
 *
 * This configuration should not accidentally be loaded while
 * running production.
 *
 * ============================================================
 */

if (environment !== "development") {
  console.warn(`development.js loaded while NODE_ENV="${environment}"`);
}

/*
 * ============================================================
 * 4. Development server configuration
 * ============================================================
 */

const server = {
  host: process.env.HOST || "localhost",

  port: Number(process.env.PORT) || 3000,
};

console.log("Development server:", server);

/*
 * ============================================================
 * 5. Debug mode
 * ============================================================
 *
 * Development applications commonly enable debugging.
 *
 * Environment variable:
 *
 *     DEBUG=true
 *
 * ============================================================
 */

const debug = process.env.DEBUG === "true";

/*
 * ============================================================
 * 6. Development logging
 * ============================================================
 *
 * Development usually benefits from verbose logs.
 *
 * Example:
 *
 *     LOG_LEVEL=debug
 *
 * ============================================================
 */

const logging = {
  level: process.env.LOG_LEVEL || "debug",

  pretty: process.env.LOG_PRETTY !== "false",
};

console.log("Development logging:", logging);

/*
 * ============================================================
 * 7. Database configuration
 * ============================================================
 *
 * Development should normally use a separate database from
 * production.
 *
 * Example:
 *
 *     DATABASE_URL=mongodb://localhost:27017/myapp_dev
 *
 * ============================================================
 */

const database = {
  url: process.env.DATABASE_URL,
};

console.log({
  databaseConfigured: Boolean(database.url),
});

/*
 * ============================================================
 * 8. Do not hard-code production credentials
 * ============================================================
 *
 * BAD:
 *
 *     DATABASE_URL =
 *       "production-database-url";
 *
 *
 * Development configuration should read its values from the
 * development environment.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. CORS configuration
 * ============================================================
 *
 * During development, the frontend may run on another local
 * port.
 *
 * Example:
 *
 *     http://localhost:5173
 *
 * ============================================================
 */

const cors = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

console.log("Development CORS origin:", cors.origin);

/*
 * ============================================================
 * 10. Development authentication configuration
 * ============================================================
 *
 * Development may use a development-only JWT secret.
 *
 * IMPORTANT:
 *
 * Never reuse a development secret in production.
 *
 * ============================================================
 */

const auth = {
  jwtSecret: process.env.JWT_SECRET,
};

console.log({
  jwtConfigured: Boolean(auth.jwtSecret),
});

/*
 * ============================================================
 * 11. Development feature flags
 * ============================================================
 *
 * Feature flags allow functionality to be enabled or disabled
 * through configuration.
 *
 * Example:
 *
 *     ENABLE_SWAGGER=true
 *     ENABLE_DEBUG_ROUTES=true
 *
 * ============================================================
 */

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return value === "true";
}

const features = {
  swagger: parseBoolean(process.env.ENABLE_SWAGGER, true),

  debugRoutes: parseBoolean(process.env.ENABLE_DEBUG_ROUTES, true),
};

console.log("Development features:", features);

/*
 * ============================================================
 * 12. Hot reload / watch mode
 * ============================================================
 *
 * Development applications often use watch mode.
 *
 *
 * Example:
 *
 *     node --watch src/server.js
 *
 *
 * Or a development tool such as nodemon can restart the
 * application when source files change.
 *
 * This behavior normally belongs in package.json scripts rather
 * than application configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Development source maps
 * ============================================================
 *
 * When using TypeScript or transpilation tools, source maps help
 * debugging by mapping generated code back to source code.
 *
 * The exact configuration depends on the toolchain.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Development error handling
 * ============================================================
 *
 * Development can expose detailed errors because developers need
 * stack traces for debugging.
 *
 *
 * Development:
 *
 *     detailed error
 *     stack trace
 *
 *
 * Production:
 *
 *     generic safe error
 *
 *
 * Never expose sensitive information in production errors.
 *
 * ============================================================
 */

const errors = {
  exposeDetails: true,
};

console.log("Expose detailed errors:", errors.exposeDetails);

/*
 * ============================================================
 * 15. Development API configuration
 * ============================================================
 *
 * Frontend and backend may communicate through a local API.
 *
 * Example:
 *
 *
 *     API_URL=http://localhost:3000
 *
 * ============================================================
 */

const api = {
  url: process.env.API_URL || `http://${server.host}:${server.port}`,
};

console.log("Development API:", api.url);

/*
 * ============================================================
 * 16. Redis development configuration
 * ============================================================
 */

const redis = {
  url: process.env.REDIS_URL || "redis://localhost:6379",
};

console.log("Redis configured:", Boolean(redis.url));

/*
 * ============================================================
 * 17. Complete development configuration
 * ============================================================
 */

export const developmentConfig = Object.freeze({
  environment: "development",

  app: {
    name: process.env.APP_NAME || "Node.js Development App",

    debug,
  },

  server,

  logging,

  database,

  redis,

  cors,

  auth,

  api,

  features,

  errors,
});

/*
 * ============================================================
 * 18. Safe configuration summary
 * ============================================================
 *
 * Never print the complete configuration because it can contain
 * secrets.
 *
 * ============================================================
 */

export const developmentSummary = {
  environment: developmentConfig.environment,

  app: developmentConfig.app.name,

  debug: developmentConfig.app.debug,

  host: developmentConfig.server.host,

  port: developmentConfig.server.port,

  logLevel: developmentConfig.logging.level,

  databaseConfigured: Boolean(developmentConfig.database.url),

  redisConfigured: Boolean(developmentConfig.redis.url),

  swagger: developmentConfig.features.swagger,

  debugRoutes: developmentConfig.features.debugRoutes,
};

console.log("\nDevelopment configuration summary:");

console.log(developmentSummary);

/*
 * ============================================================
 * 19. Example .env for development
 * ============================================================
 *
 * Example `.env`:
 *
 *
 *     NODE_ENV=development
 *
 *     APP_NAME=Node Backend
 *
 *     HOST=localhost
 *     PORT=3000
 *
 *     DEBUG=true
 *
 *     LOG_LEVEL=debug
 *     LOG_PRETTY=true
 *
 *     DATABASE_URL=mongodb://localhost:27017/node_dev
 *
 *     REDIS_URL=redis://localhost:6379
 *
 *     JWT_SECRET=development-only-secret
 *
 *     CORS_ORIGIN=http://localhost:5173
 *
 *     API_URL=http://localhost:3000
 *
 *     ENABLE_SWAGGER=true
 *     ENABLE_DEBUG_ROUTES=true
 *
 *
 * These values are examples. Real secrets should never be
 * committed to source control.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Development vs production
 * ============================================================
 *
 * Development:
 *
 *     verbose logs
 *     debugging
 *     local services
 *     detailed errors
 *     development database
 *
 *
 * Production:
 *
 *     optimized logs
 *     restricted errors
 *     production database
 *     production secrets
 *     stricter security
 *
 *
 * Example:
 *
 *
 *       DEVELOPMENT
 *            │
 *            ├── DEBUG=true
 *            ├── LOG_LEVEL=debug
 *            ├── local DB
 *            └── detailed errors
 *
 *
 *       PRODUCTION
 *            │
 *            ├── DEBUG=false
 *            ├── LOG_LEVEL=info
 *            ├── production DB
 *            └── safe errors
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Why separate development configuration?
 * ============================================================
 *
 * Without separation, code can become filled with:
 *
 *
 *     if (NODE_ENV === "development") {
 *       ...
 *     }
 *
 *     if (NODE_ENV === "production") {
 *       ...
 *     }
 *
 *
 * everywhere.
 *
 *
 * Instead:
 *
 *
 *     environment
 *          ↓
 *     environment-specific config
 *          ↓
 *     application
 *
 *
 * This keeps application code cleaner.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Development configuration should be safe
 * ============================================================
 *
 * Development does NOT mean security is unnecessary.
 *
 * Avoid:
 *
 *     Real production credentials
 *     Real production database
 *     Real customer data
 *     Real production API keys
 *
 *
 * Use isolated development resources whenever possible.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Typical project structure
 * ============================================================
 *
 *
 *     project/
 *
 *     ├── src/
 *     │   ├── app.js
 *     │   ├── server.js
 *     │   └── config/
 *     │       ├── index.js
 *     │       ├── development.js
 *     │       └── production.js
 *     │
 *     ├── .env
 *     ├── .env.example
 *     ├── .gitignore
 *     ├── package.json
 *     └── package-lock.json
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Configuration selection
 * ============================================================
 *
 * A central configuration module can select the appropriate
 * environment configuration.
 *
 *
 * Conceptually:
 *
 *
 *     NODE_ENV
 *        │
 *        ├── development → developmentConfig
 *        │
 *        ├── production  → productionConfig
 *        │
 *        └── test        → testConfig
 *
 *
 * This pattern becomes useful as the application grows.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Important principle
 * ============================================================
 *
 * Environment-specific files should contain configuration,
 * not completely different application implementations.
 *
 *
 * Good:
 *
 *     developmentConfig.database.url
 *
 *     productionConfig.database.url
 *
 *
 * Both configure the same application subsystem.
 *
 *
 * Avoid creating two completely different applications merely
 * because they run in different environments.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Development checklist
 * ============================================================
 *
 *     ✓ NODE_ENV=development
 *
 *     ✓ Local database
 *
 *     ✓ Development secrets
 *
 *     ✓ Debugging enabled when needed
 *
 *     ✓ Verbose logging
 *
 *     ✓ Local frontend CORS
 *
 *     ✓ Detailed errors
 *
 *     ✓ Production credentials excluded
 *
 *     ✓ .env ignored by Git
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                DEVELOPMENT
 *                     │
 *          ┌──────────┼──────────┐
 *          ↓          ↓          ↓
 *       Debug       Logs       Local DB
 *          │          │          │
 *          └──────────┼──────────┘
 *                     ↓
 *             developmentConfig
 *                     ↓
 *                Application
 *
 *
 * Main principle:
 *
 *
 *     Development configuration should optimize for
 *     developer productivity while remaining isolated
 *     from production resources and secrets.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     16_environment/production.js
 *
 * ============================================================
 */

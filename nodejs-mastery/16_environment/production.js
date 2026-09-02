/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     16_environment/production.js
 *
 * Topic:
 *     Production Environment Configuration
 *
 * ============================================================
 *
 * WHAT IS A PRODUCTION ENVIRONMENT?
 * ============================================================
 *
 * Production is the environment where the application serves
 * real users and real workloads.
 *
 * Production configuration should prioritize:
 *
 *     - Security
 *     - Reliability
 *     - Performance
 *     - Observability
 *     - Stability
 *     - Safe error handling
 *     - Controlled access
 *
 *
 * Development and production should NOT share sensitive
 * resources unnecessarily.
 *
 * ============================================================
 *
 * ENVIRONMENT FLOW
 * ============================================================
 *
 *     Production environment
 *             ↓
 *        process.env
 *             ↓
 *        production.js
 *             ↓
 *      validated config
 *             ↓
 *         application
 *
 * ============================================================
 */

import "dotenv/config";

/*
 * ============================================================
 * 1. Identify the environment
 * ============================================================
 */

const environment = process.env.NODE_ENV || "production";

/*
 * ============================================================
 * 2. Production must actually be production
 * ============================================================
 *
 * This file is intended for production.
 *
 * If NODE_ENV is something else, warn immediately.
 *
 * ============================================================
 */

if (environment !== "production") {
  console.warn(`production.js loaded while NODE_ENV="${environment}"`);
}

/*
 * ============================================================
 * 3. Helper: required environment variable
 * ============================================================
 *
 * Production applications should fail fast when critical
 * configuration is missing.
 *
 * ============================================================
 */

function requireEnv(name) {
  const value = process.env[name];

  if (value === undefined || value === "") {
    throw new Error(
      `Missing required production environment variable: ${name}`,
    );
  }

  return value;
}

/*
 * ============================================================
 * 4. Helper: parse integer
 * ============================================================
 */

function parseInteger(value, defaultValue) {
  if (value === undefined || value === "") {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new Error(`Expected an integer but received: ${value}`);
  }

  return parsed;
}

/*
 * ============================================================
 * 5. Helper: parse port
 * ============================================================
 */

function parsePort(value, defaultValue = 3000) {
  const port = parseInteger(value, defaultValue);

  if (port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${port}`);
  }

  return port;
}

/*
 * ============================================================
 * 6. Helper: parse boolean
 * ============================================================
 */

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return value === "true";
}

/*
 * ============================================================
 * 7. Server configuration
 * ============================================================
 *
 * Production servers commonly listen on:
 *
 *
 *     0.0.0.0
 *
 *
 * rather than only:
 *
 *
 *     localhost
 *
 *
 * when running inside a container or server environment.
 *
 * ============================================================
 */

const server = {
  host: process.env.HOST || "0.0.0.0",

  port: parsePort(process.env.PORT, 3000),
};

/*
 * ============================================================
 * 8. Logging configuration
 * ============================================================
 *
 * Production logging should generally avoid extremely verbose
 * debugging output.
 *
 * Common levels:
 *
 *     fatal
 *     error
 *     warn
 *     info
 *     debug
 *
 * Production commonly uses:
 *
 *     info
 *
 * depending on the application's requirements.
 *
 * ============================================================
 */

const logging = {
  level: process.env.LOG_LEVEL || "info",

  pretty: false,
};

/*
 * ============================================================
 * 9. Debugging
 * ============================================================
 *
 * Debug features should normally be disabled in production.
 *
 * ============================================================
 */

const debug = parseBoolean(process.env.DEBUG, false);

/*
 * ============================================================
 * 10. Production database
 * ============================================================
 *
 * The database URL should be provided through the runtime
 * environment or a secret/configuration management system.
 *
 * ============================================================
 */

const databaseUrl = requireEnv("DATABASE_URL");

const database = {
  url: databaseUrl,
};

/*
 * ============================================================
 * 11. JWT secret
 * ============================================================
 *
 * Authentication secrets are critical production configuration.
 *
 * Never hard-code them in source code.
 *
 * ============================================================
 */

const jwtSecret = requireEnv("JWT_SECRET");

const auth = {
  jwtSecret,
};

/*
 * ============================================================
 * 12. JWT expiration
 * ============================================================
 *
 * Keep expiration configurable.
 *
 * Example:
 *
 *     JWT_ACCESS_TOKEN_EXPIRES_IN=15m
 *
 * ============================================================
 */

const accessTokenExpiration = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m";

const refreshTokenExpiration = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d";

auth.accessTokenExpiration = accessTokenExpiration;

auth.refreshTokenExpiration = refreshTokenExpiration;

/*
 * ============================================================
 * 13. CORS
 * ============================================================
 *
 * Production CORS should be explicit.
 *
 *
 * BAD:
 *
 *     *
 *
 *
 * Better:
 *
 *     https://app.example.com
 *
 *
 * The actual origin should come from deployment configuration.
 *
 * ============================================================
 */

const corsOrigin = requireEnv("CORS_ORIGIN");

const cors = {
  origin: corsOrigin,
};

/*
 * ============================================================
 * 14. Production API URL
 * ============================================================
 */

const apiUrl = requireEnv("API_URL");

const api = {
  url: apiUrl,
};

/*
 * ============================================================
 * 15. Redis
 * ============================================================
 *
 * If Redis is required by the production application, require
 * its connection URL.
 *
 * ============================================================
 */

const redisUrl = process.env.REDIS_URL;

const redis = {
  url: redisUrl,
};

/*
 * ============================================================
 * 16. Feature flags
 * ============================================================
 *
 * Features that are useful for development should generally be
 * disabled by default in production.
 *
 * ============================================================
 */

const features = {
  swagger: parseBoolean(process.env.ENABLE_SWAGGER, false),

  debugRoutes: parseBoolean(process.env.ENABLE_DEBUG_ROUTES, false),
};

/*
 * ============================================================
 * 17. Detailed errors
 * ============================================================
 *
 * Do not expose internal stack traces or sensitive information
 * to API clients in production.
 *
 * ============================================================
 */

const errors = {
  exposeDetails: false,
};

/*
 * ============================================================
 * 18. Trust proxy
 * ============================================================
 *
 * When an application is deployed behind a reverse proxy or
 * load balancer, frameworks may need proxy-awareness.
 *
 * The exact setting depends on the deployment architecture.
 *
 * Example:
 *
 *     TRUST_PROXY=true
 *
 * ============================================================
 */

const trustProxy = parseBoolean(process.env.TRUST_PROXY, false);

/*
 * ============================================================
 * 19. Secure cookies
 * ============================================================
 *
 * Production applications commonly use secure cookie settings.
 *
 * Example:
 *
 *     secure=true
 *     httpOnly=true
 *     sameSite="lax"
 *
 *
 * The exact values depend on the authentication architecture.
 *
 * ============================================================
 */

const cookies = {
  secure: true,

  httpOnly: true,

  sameSite: process.env.COOKIE_SAME_SITE || "lax",
};

/*
 * ============================================================
 * 20. Application configuration
 * ============================================================
 */

const app = {
  name: process.env.APP_NAME || "Node.js Production App",

  environment: "production",

  debug,
};

/*
 * ============================================================
 * 21. Complete production configuration
 * ============================================================
 *
 * Secrets are intentionally included here only so application
 * modules can consume them.
 *
 * Never print this entire object.
 *
 * ============================================================
 */

export const productionConfig = Object.freeze({
  app,

  server,

  logging,

  database,

  auth,

  cors,

  api,

  redis,

  features,

  errors,

  trustProxy,

  cookies,
});

/*
 * ============================================================
 * 22. Safe production summary
 * ============================================================
 *
 * This summary intentionally excludes actual secrets.
 * ============================================================
 */

export const productionSummary = {
  environment: productionConfig.app.environment,

  application: productionConfig.app.name,

  debug: productionConfig.app.debug,

  host: productionConfig.server.host,

  port: productionConfig.server.port,

  logLevel: productionConfig.logging.level,

  databaseConfigured: Boolean(productionConfig.database.url),

  jwtConfigured: Boolean(productionConfig.auth.jwtSecret),

  redisConfigured: Boolean(productionConfig.redis.url),

  swaggerEnabled: productionConfig.features.swagger,

  debugRoutesEnabled: productionConfig.features.debugRoutes,

  detailedErrors: productionConfig.errors.exposeDetails,

  trustProxy: productionConfig.trustProxy,
};

console.log("Production configuration loaded:");

console.log(productionSummary);

/*
 * ============================================================
 * 23. Example production environment
 * ============================================================
 *
 * These are examples only.
 *
 *
 *     NODE_ENV=production
 *
 *     APP_NAME=Node Production API
 *
 *     HOST=0.0.0.0
 *     PORT=3000
 *
 *     LOG_LEVEL=info
 *
 *     DATABASE_URL=<production-database-url>
 *
 *     JWT_SECRET=<strong-production-secret>
 *
 *     JWT_ACCESS_TOKEN_EXPIRES_IN=15m
 *     JWT_REFRESH_TOKEN_EXPIRES_IN=7d
 *
 *     CORS_ORIGIN=https://app.example.com
 *
 *     API_URL=https://api.example.com
 *
 *     REDIS_URL=<production-redis-url>
 *
 *     ENABLE_SWAGGER=false
 *     ENABLE_DEBUG_ROUTES=false
 *
 *     TRUST_PROXY=true
 *
 *
 * Real secrets should be supplied securely by the deployment
 * environment or secret manager.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Production does NOT require a .env file
 * ============================================================
 *
 * A common misconception is:
 *
 *
 *     Production = .env file
 *
 *
 * Not necessarily.
 *
 *
 * Production can receive configuration from:
 *
 *
 *     - Container environment
 *     - Cloud platform
 *     - CI/CD system
 *     - Secret manager
 *     - Or another deployment mechanism
 *
 *
 * dotenv is useful, but it is not the production architecture
 * itself.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Development vs production
 * ============================================================
 *
 *
 * ┌─────────────────────┬─────────────────────┐
 * │ Development         │ Production          │
 * ├─────────────────────┼─────────────────────┤
 * │ DEBUG=true          │ DEBUG=false         │
 * │ verbose logs        │ controlled logs     │
 * │ local DB            │ production DB       │
 * │ detailed errors     │ safe errors         │
 * │ debug routes        │ disabled            │
 * │ permissive CORS     │ explicit CORS       │
 * │ dev secrets         │ prod secrets        │
 * └─────────────────────┴─────────────────────┘
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Production security principles
 * ============================================================
 *
 * 1. Never hard-code secrets.
 *
 * 2. Never commit production secrets.
 *
 * 3. Disable debug endpoints.
 *
 * 4. Do not expose stack traces to clients.
 *
 * 5. Restrict CORS.
 *
 * 6. Use secure cookies when cookies are part of auth.
 *
 * 7. Use strong authentication secrets.
 *
 * 8. Use HTTPS at the appropriate deployment layer.
 *
 * 9. Keep dependencies updated.
 *
 * 10. Log security-relevant events appropriately.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Production reliability
 * ============================================================
 *
 * Production configuration should also support:
 *
 *
 *     Health checks
 *     Graceful shutdown
 *     Readiness checks
 *     Liveness checks
 *     Logging
 *     Metrics
 *     Monitoring
 *
 *
 * These topics are covered later in:
 *
 *
 *     35_production/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Production performance
 * ============================================================
 *
 * Production configuration may differ from development because
 * production workloads require:
 *
 *
 *     Connection pooling
 *     Appropriate timeouts
 *     Compression
 *     Caching
 *     Resource limits
 *     Worker processes
 *
 *
 * The exact values depend on the application and workload.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Configuration validation
 * ============================================================
 *
 * This file performs basic validation for critical values.
 *
 *
 * A mature application should validate:
 *
 *
 *     PORT
 *     NODE_ENV
 *     DATABASE_URL
 *     JWT_SECRET
 *     CORS_ORIGIN
 *     API_URL
 *     REDIS_URL
 *     token expiration
 *
 *
 * Later:
 *
 *
 *     17_validation/
 *
 *
 * will introduce schema-based validation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Why production should fail fast
 * ============================================================
 *
 * Example:
 *
 *
 *     DATABASE_URL missing
 *
 *
 * BAD:
 *
 *
 *     Server starts
 *          ↓
 *     Request arrives
 *          ↓
 *     Database operation
 *          ↓
 *     Failure
 *
 *
 * BETTER:
 *
 *
 *     Application starts
 *          ↓
 *     Validate configuration
 *          ↓
 *     DATABASE_URL missing
 *          ↓
 *     Process exits
 *
 *
 * This prevents an incorrectly configured application from
 * pretending to be healthy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Configuration boundary
 * ============================================================
 *
 *
 *             PRODUCTION ENVIRONMENT
 *                       │
 *                       ↓
 *                  process.env
 *                       │
 *                       ↓
 *                 production.js
 *                       │
 *                 validation
 *                       │
 *                       ↓
 *              productionConfig
 *                       │
 *                       ↓
 *                  application
 *
 *
 * The application should consume validated configuration rather
 * than repeatedly interpreting process.env.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Do not mix environments
 * ============================================================
 *
 * Never accidentally configure:
 *
 *
 *     Production API
 *          ↓
 *     Development database
 *
 *
 * or:
 *
 *
 *     Development API
 *          ↓
 *     Production database
 *
 *
 * Environment isolation is critical.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Production secrets
 * ============================================================
 *
 * A secret should:
 *
 *
 *     - Be difficult to guess
 *     - Be stored securely
 *     - Not be committed to Git
 *     - Not be printed in logs
 *     - Not be returned through APIs
 *     - Be rotated when necessary
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Production checklist
 * ============================================================
 *
 *     ✓ NODE_ENV=production
 *
 *     ✓ Production database configured
 *
 *     ✓ Strong JWT secret configured
 *
 *     ✓ Explicit CORS configured
 *
 *     ✓ Debug disabled
 *
 *     ✓ Debug routes disabled
 *
 *     ✓ Detailed errors disabled
 *
 *     ✓ Production logging configured
 *
 *     ✓ Secrets supplied securely
 *
 *     ✓ Production resources isolated
 *
 *     ✓ Health/readiness strategy available
 *
 *     ✓ Graceful shutdown strategy available
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                    PRODUCTION
 *                        │
 *             ┌──────────┼──────────┐
 *             ↓          ↓          ↓
 *          Security  Reliability Performance
 *             │          │          │
 *             └──────────┼──────────┘
 *                        ↓
 *              productionConfig
 *                        ↓
 *                   Application
 *
 *
 * Main principle:
 *
 *
 *     Production configuration should make the application
 *     secure, predictable, observable, and reliable.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     17_validation/manual_validation.js
 *
 * ============================================================
 */

/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     16_environment/dotenv.js
 *
 * Topic:
 *     Environment Variables with dotenv
 *
 * ============================================================
 *
 * WHAT ARE ENVIRONMENT VARIABLES?
 * ============================================================
 *
 * Environment variables are values provided to an application
 * by its execution environment instead of hard-coding them
 * directly into source code.
 *
 * Common examples:
 *
 *     PORT
 *     NODE_ENV
 *     DATABASE_URL
 *     JWT_SECRET
 *     API_KEY
 *     REDIS_URL
 *
 * Example:
 *
 *     PORT=5000
 *
 * ============================================================
 *
 * WHY USE ENVIRONMENT VARIABLES?
 * ============================================================
 *
 * BAD:
 *
 *     const password = "my-secret-password";
 *
 * The secret is now inside the source code.
 *
 *
 * BETTER:
 *
 *     const password = process.env.DB_PASSWORD;
 *
 * The actual value is supplied by the environment.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. process.env
 * ============================================================
 *
 * Node.js exposes environment variables through:
 *
 *     process.env
 *
 * Example:
 */

console.log("Environment variables:");
console.log(process.env);

/*
 * ============================================================
 * 2. Reading an environment variable
 * ============================================================
 *
 * Example:
 *
 *     process.env.NODE_ENV
 *
 * ============================================================
 */

console.log("NODE_ENV:", process.env.NODE_ENV);

/*
 * ============================================================
 * 3. PORT example
 * ============================================================
 */

const port = process.env.PORT || 3000;

console.log("Port:", port);

/*
 * ============================================================
 * 4. Environment variables are strings
 * ============================================================
 *
 * Important:
 *
 * Values obtained from process.env are strings.
 *
 *
 * Example:
 *
 *     PORT=5000
 *
 * Node.js gives:
 *
 *     "5000"
 *
 * not:
 *
 *     5000
 *
 * ============================================================
 */

const portFromEnv = process.env.PORT;

console.log("PORT value:", portFromEnv);

console.log("PORT type:", typeof portFromEnv);

/*
 * ============================================================
 * 5. Convert environment values
 * ============================================================
 *
 * If you need a number:
 */

const numericPort = Number(process.env.PORT) || 3000;

console.log("Numeric port:", numericPort);

console.log("Numeric port type:", typeof numericPort);

/*
 * ============================================================
 * 6. Boolean environment variables
 * ============================================================
 *
 * Do NOT do this:
 *
 *     Boolean(process.env.DEBUG)
 *
 * because:
 *
 *     Boolean("false") === true
 *
 *
 * Instead:
 */

const debug = process.env.DEBUG === "true";

console.log("Debug enabled:", debug);

/*
 * ============================================================
 * 7. Install dotenv
 * ============================================================
 *
 * Install it in your project:
 *
 *
 *     npm install dotenv
 *
 *
 * dotenv loads variables from a .env file into process.env.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Create a .env file
 * ============================================================
 *
 * Create:
 *
 *     .env
 *
 *
 * Example:
 *
 *
 *     PORT=5000
 *     NODE_ENV=development
 *     DATABASE_URL=mongodb://localhost:27017/mydb
 *     JWT_SECRET=my-super-secret-key
 *
 *
 * IMPORTANT:
 *
 * Do not commit secrets to Git.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Import dotenv
 * ============================================================
 *
 * CommonJS:
 *
 *     require("dotenv").config();
 *
 *
 * ESM:
 *
 *     import dotenv from "dotenv";
 *
 *     dotenv.config();
 *
 *
 * Modern Node.js can also load .env files using built-in
 * environment-variable features, depending on the Node.js
 * version and execution method.
 *
 * dotenv remains widely used in Node.js projects.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. dotenv.config()
 * ============================================================
 *
 * Example:
 *
 *
 *     import dotenv from "dotenv";
 *
 *     dotenv.config();
 *
 *
 * After loading:
 *
 *
 *     process.env.PORT
 *
 * can contain the value from `.env`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Complete dotenv example
 * ============================================================
 *
 * If this file is executed in an ESM project:
 *
 *
 *     import dotenv from "dotenv";
 *
 *     dotenv.config();
 *
 *     console.log(process.env.PORT);
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. ES module example
 * ============================================================
 *
 * In a project with:
 *
 *     "type": "module"
 *
 * use:
 *
 *
 *     import dotenv from "dotenv";
 *     dotenv.config();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Load dotenv at startup
 * ============================================================
 *
 * Environment configuration should generally be loaded before
 * application modules that depend on it.
 *
 *
 * Example:
 *
 *
 *     import dotenv from "dotenv";
 *
 *     dotenv.config();
 *
 *     import express from "express";
 *
 *
 * The exact module-loading strategy can vary by project.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. dotenv/config shortcut
 * ============================================================
 *
 * dotenv provides a preload entry:
 *
 *
 *     import "dotenv/config";
 *
 *
 * Then:
 *
 *
 *     process.env.PORT
 *
 * is available to the application.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Example using dotenv/config
 * ============================================================
 *
 *     import "dotenv/config";
 *
 *     const port =
 *       process.env.PORT || 3000;
 *
 *     console.log(port);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. .env structure
 * ============================================================
 *
 * Typical:
 *
 *
 *     PORT=5000
 *
 *     NODE_ENV=development
 *
 *     DATABASE_URL=mongodb://localhost:27017/app
 *
 *     JWT_SECRET=change-this-secret
 *
 *
 * Each variable follows:
 *
 *
 *     NAME=value
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Quotes
 * ============================================================
 *
 * Environment values may be written with quotes when needed.
 *
 *
 * Example:
 *
 *
 *     APP_NAME="Node Application"
 *
 *
 * The resulting environment value represents:
 *
 *
 *     Node Application
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Comments in .env
 * ============================================================
 *
 * Example:
 *
 *
 *     # Application
 *     PORT=5000
 *
 *     # Database
 *     DATABASE_URL=mongodb://localhost:27017/app
 *
 *
 * Comments help organize configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. .gitignore
 * ============================================================
 *
 * Add:
 *
 *
 *     .env
 *
 *
 * to `.gitignore`.
 *
 *
 * Example:
 *
 *
 *     node_modules/
 *     .env
 *
 *
 * This prevents the local environment file from being
 * accidentally committed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. .env.example
 * ============================================================
 *
 * A useful practice is to commit:
 *
 *
 *     .env.example
 *
 *
 * instead of:
 *
 *
 *     .env
 *
 *
 * Example:
 *
 *
 *     PORT=5000
 *     NODE_ENV=development
 *     DATABASE_URL=
 *     JWT_SECRET=
 *
 *
 * The example documents which variables the application needs
 * without exposing actual secrets.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Development vs production
 * ============================================================
 *
 * Development:
 *
 *
 *     .env
 *
 *
 * Production:
 *
 *
 *     Environment variables supplied by the deployment platform
 *
 *
 * Example:
 *
 *
 *     Local machine
 *         ↓
 *     .env
 *
 *
 *     Docker
 *         ↓
 *     environment configuration
 *
 *
 *     Cloud platform
 *         ↓
 *     secret/environment configuration
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. NODE_ENV
 * ============================================================
 *
 * A common environment variable is:
 *
 *
 *     NODE_ENV
 *
 *
 * Common values:
 *
 *
 *     development
 *     production
 *     test
 *
 * ============================================================
 */

const environment = process.env.NODE_ENV || "development";

console.log("Application environment:", environment);

/*
 * ============================================================
 * 23. Environment-specific behavior
 * ============================================================
 */

if (environment === "development") {
  console.log("Development mode enabled");
}

if (environment === "production") {
  console.log("Production mode enabled");
}

/*
 * ============================================================
 * 24. DATABASE_URL
 * ============================================================
 *
 * Database connection strings should generally be supplied
 * through environment configuration.
 *
 *
 * Example:
 *
 *
 *     DATABASE_URL=mongodb://localhost:27017/myapp
 *
 * Then:
 */

const databaseUrl = process.env.DATABASE_URL;

console.log("Database configured:", Boolean(databaseUrl));

/*
 * ============================================================
 * 25. JWT_SECRET
 * ============================================================
 *
 * Authentication secrets should not be hard-coded.
 *
 *
 * Example:
 *
 *
 *     JWT_SECRET=some-secret
 *
 *
 * Access:
 */

const jwtSecret = process.env.JWT_SECRET;

console.log("JWT secret configured:", Boolean(jwtSecret));

/*
 * ============================================================
 * 26. Never log secrets
 * ============================================================
 *
 * BAD:
 *
 *
 *     console.log(process.env.JWT_SECRET);
 *
 *
 * This can expose secrets in logs.
 *
 *
 * BETTER:
 *
 *
 *     console.log(Boolean(process.env.JWT_SECRET));
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Required environment variables
 * ============================================================
 *
 * An application should fail early when required configuration
 * is missing.
 *
 * ============================================================
 */

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/*
 * Example:
 *
 *     const databaseUrl =
 *       requireEnv("DATABASE_URL");
 *
 *
 * Do not uncomment this unless DATABASE_URL exists.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Optional environment variables
 * ============================================================
 *
 * Optional values can have defaults.
 *
 * Example:
 */

const host = process.env.HOST || "localhost";

const applicationPort = Number(process.env.PORT) || 3000;

console.log({
  host,
  applicationPort,
});

/*
 * ============================================================
 * 29. Nullish coalescing
 * ============================================================
 *
 * You can also use:
 *
 *
 *     ??
 *
 *
 * Example:
 */

const configuredPort = process.env.PORT ?? "3000";

console.log("Configured port:", configuredPort);

/*
 * ============================================================
 * 30. Environment variables are configuration
 * ============================================================
 *
 * Keep application logic separate from configuration.
 *
 *
 * Bad:
 *
 *
 *     connect(
 *       "mongodb://localhost:27017/app"
 *     );
 *
 *
 * Better:
 *
 *
 *     connect(
 *       process.env.DATABASE_URL
 *     );
 *
 *
 * This allows the same application code to run in different
 * environments.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Configuration example
 * ============================================================
 *
 *
 * Development:
 *
 *     DATABASE_URL=mongodb://localhost:27017/dev
 *
 *
 * Production:
 *
 *     DATABASE_URL=mongodb://production-server/database
 *
 *
 * Same application:
 *
 *     process.env.DATABASE_URL
 *
 *
 * Different configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. dotenv does NOT create security
 * ============================================================
 *
 * dotenv simply loads values.
 *
 *
 * It does NOT:
 *
 *     - Encrypt secrets
 *     - Secure your database
 *     - Hide secrets from the machine
 *     - Replace a production secret manager
 *
 *
 * It is primarily a configuration-loading mechanism.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Production secret management
 * ============================================================
 *
 * Production applications may use:
 *
 *
 *     Cloud secret managers
 *     CI/CD secrets
 *     Container secrets
 *     Platform environment variables
 *
 *
 * Examples include secret-management facilities provided by
 * cloud and deployment platforms.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Multiple environment files
 * ============================================================
 *
 * Some projects use files such as:
 *
 *
 *     .env
 *     .env.local
 *     .env.development
 *     .env.test
 *     .env.production
 *
 *
 * The exact loading precedence depends on the tool/framework.
 *
 *
 * Do not assume that dotenv automatically applies every possible
 * environment-file convention used by other frameworks.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. dotenv configuration path
 * ============================================================
 *
 * dotenv can load a specific file.
 *
 *
 * Example:
 *
 *
 *     dotenv.config({
 *       path: ".env.local",
 *     });
 *
 *
 * This is useful when configuration needs to come from a
 * non-default file.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Avoid committing .env
 * ============================================================
 *
 * Project:
 *
 *
 *     .gitignore
 *     .env
 *     .env.example
 *
 *
 * `.env`:
 *
 *     private local configuration
 *
 *
 * `.env.example`:
 *
 *     public configuration template
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Example project structure
 * ============================================================
 *
 *
 *     my-node-app/
 *
 *     ├── src/
 *     │   ├── app.js
 *     │   └── config.js
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
 * 38. Configuration module
 * ============================================================
 *
 * In a real project, avoid accessing process.env everywhere.
 *
 * Instead:
 *
 *
 *     process.env
 *          ↓
 *       config.js
 *          ↓
 *     application
 *
 *
 * This creates a central configuration boundary.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Example config.js
 * ============================================================
 *
 *     import "dotenv/config";
 *
 *     export const config = {
 *       port: Number(process.env.PORT) || 3000,
 *       nodeEnv:
 *         process.env.NODE_ENV || "development",
 *       databaseUrl:
 *         process.env.DATABASE_URL,
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Why centralize configuration?
 * ============================================================
 *
 * Instead of:
 *
 *
 *     process.env.PORT
 *     process.env.PORT
 *     process.env.PORT
 *     process.env.PORT
 *
 *
 * Use:
 *
 *
 *     config.port
 *
 *
 * Benefits:
 *
 *     - Easier testing
 *     - Easier validation
 *     - Centralized defaults
 *     - Cleaner application code
 *     - Easier environment management
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Environment validation
 * ============================================================
 *
 * Environment variables should often be validated during
 * application startup.
 *
 *
 * Example:
 *
 *
 *     PORT must be a valid number
 *     DATABASE_URL must exist
 *     JWT_SECRET must exist
 *
 *
 * Later in this repository:
 *
 *
 *     17_validation/
 *
 *
 * will cover stronger validation techniques.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Simple validation example
 * ============================================================
 */

function getPort() {
  const value = process.env.PORT;

  if (!value) {
    return 3000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port");
  }

  return port;
}

console.log("Validated port:", getPort());

/*
 * ============================================================
 * 43. dotenv lifecycle
 * ============================================================
 *
 *
 * .env
 *   ↓
 * dotenv
 *   ↓
 * process.env
 *   ↓
 * config
 *   ↓
 * application
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Complete conceptual example
 * ============================================================
 *
 *
 * .env
 *
 *     PORT=5000
 *     NODE_ENV=development
 *     DATABASE_URL=mongodb://localhost:27017/app
 *
 *
 * app.js
 *
 *     import "dotenv/config";
 *
 *     const port =
 *       Number(process.env.PORT) || 3000;
 *
 *     console.log(port);
 *
 *
 * Result:
 *
 *
 *     5000
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. Environment variable naming
 * ============================================================
 *
 * Common style:
 *
 *
 *     PORT
 *     NODE_ENV
 *     DATABASE_URL
 *     JWT_SECRET
 *     REDIS_URL
 *     API_KEY
 *
 *
 * Use descriptive names.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. Do not put secrets in source code
 * ============================================================
 *
 * NEVER:
 *
 *
 *     const JWT_SECRET =
 *       "real-production-secret";
 *
 *
 * Prefer:
 *
 *
 *     const JWT_SECRET =
 *       process.env.JWT_SECRET;
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. Do not expose server secrets to clients
 * ============================================================
 *
 * Environment variables on the server are not automatically
 * safe to expose.
 *
 *
 * Never return:
 *
 *
 *     process.env
 *
 *
 * through an API endpoint.
 *
 *
 * BAD:
 *
 *
 *     res.json(process.env);
 *
 *
 * This could expose credentials and internal configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. Environment variables and Docker
 * ============================================================
 *
 * Dockerized applications can receive environment variables
 * from the container/runtime environment.
 *
 *
 * Conceptually:
 *
 *
 * Docker
 *    ↓
 * Environment variables
 *    ↓
 * Node.js
 *    ↓
 * process.env
 *
 *
 * Therefore the application does not need to hard-code
 * environment-specific configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 49. Environment variables and CI/CD
 * ============================================================
 *
 * CI/CD systems can provide values such as:
 *
 *
 *     DATABASE_URL
 *     API_KEY
 *     JWT_SECRET
 *
 *
 * without placing them directly into source code.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. Important security rules
 * ============================================================
 *
 * 1. Never commit real secrets.
 *
 * 2. Add `.env` to `.gitignore`.
 *
 * 3. Commit `.env.example` when useful.
 *
 * 4. Never log secrets.
 *
 * 5. Never send secrets to clients.
 *
 * 6. Validate required environment variables.
 *
 * 7. Use proper secret management in production.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 51. Final mental model
 * ============================================================
 *
 *
 *                  CONFIGURATION
 *                        │
 *             ┌──────────┴──────────┐
 *             ↓                     ↓
 *          .env                Runtime env
 *             │                     │
 *             └──────────┬──────────┘
 *                        ↓
 *                   process.env
 *                        ↓
 *                     config
 *                        ↓
 *                   application
 *
 *
 * dotenv's main job:
 *
 *
 *     .env → process.env
 *
 *
 * ============================================================
 *
 * KEY COMMAND:
 *
 *     npm install dotenv
 *
 *
 * COMMON ESM USAGE:
 *
 *     import "dotenv/config";
 *
 *
 * READ VALUE:
 *
 *     process.env.PORT
 *
 *
 * DEFAULT:
 *
 *     process.env.PORT || 3000
 *
 *
 * NUMBER:
 *
 *     Number(process.env.PORT)
 *
 *
 * BOOLEAN:
 *
 *     process.env.DEBUG === "true"
 *
 * ============================================================
 *
 * NEXT:
 *
 *     16_environment/config.js
 *
 * ============================================================
 */

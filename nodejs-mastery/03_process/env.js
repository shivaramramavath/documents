/**
 * ============================================================
 * Node.js Process - Environment Variables
 * ============================================================
 *
 * File: env.js
 *
 * Topic:
 *     process.env
 *
 * ============================================================
 *
 * Environment variables are key-value pairs provided to a
 * running application by the operating system or execution
 * environment.
 *
 * They are commonly used for:
 *
 *     - PORT
 *     - NODE_ENV
 *     - DATABASE_URL
 *     - JWT_SECRET
 *     - API keys
 *     - Application configuration
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Access process.env
 * ============================================================
 *
 * `process.env` contains the environment variables available
 * to the current Node.js process.
 */

console.log(process.env);

/*
 * IMPORTANT:
 *
 * Do not print process.env in a real production application.
 *
 * It may contain secrets such as:
 *
 *     passwords
 *     API keys
 *     database credentials
 *     JWT secrets
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Read a specific environment variable
 * ============================================================
 *
 * Syntax:
 *
 *     process.env.VARIABLE_NAME
 *
 * Example:
 */

console.log("NODE_ENV:", process.env.NODE_ENV);

/*
 * If NODE_ENV is not defined, the result is:
 *
 *     undefined
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Common environment variables
 * ============================================================
 */

console.log("PATH:", process.env.PATH);

console.log("HOME:", process.env.HOME);

console.log("USER:", process.env.USER);

/*
 * On Windows, some of these variables may have different
 * names or may not exist.
 *
 * Therefore:
 *
 *     process.env.SOMETHING
 *
 * can safely return undefined.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Environment variables are strings
 * ============================================================
 *
 * This is VERY important.
 *
 * Suppose:
 *
 *     PORT=3000
 *
 *
 * Then:
 *
 *     process.env.PORT
 *
 * is:
 *
 *     "3000"
 *
 * not:
 *
 *     3000
 *
 * ============================================================
 */

const port = process.env.PORT;

console.log("PORT:", port);

console.log("PORT type:", typeof port);

/*
 * ============================================================
 * 5. Convert environment variable to number
 * ============================================================
 */

const numericPort = Number(process.env.PORT);

console.log("Numeric port:", numericPort);

/*
 * If PORT doesn't exist:
 *
 *
 *     Number(undefined)
 *
 *
 * becomes:
 *
 *
 *     NaN
 *
 *
 * Therefore, production code normally provides a fallback or
 * validates configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Default values
 * ============================================================
 *
 * The `||` operator can provide a fallback.
 */

const appPort = process.env.PORT || "3000";

console.log("Application port:", appPort);

/*
 * Modern JavaScript commonly uses nullish coalescing:
 *
 *
 *     ??
 *
 *
 * Example:
 */

const serverPort = process.env.PORT ?? "3000";

console.log("Server port:", serverPort);

/*
 * `??` only falls back for:
 *
 *     null
 *     undefined
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. NODE_ENV
 * ============================================================
 *
 * A common convention is:
 *
 *
 *     NODE_ENV=development
 *
 *     NODE_ENV=test
 *
 *     NODE_ENV=production
 *
 *
 * Your application can use this value to choose behavior.
 * ============================================================
 */

const environment = process.env.NODE_ENV || "development";

console.log("Environment:", environment);

/*
 * ============================================================
 * 8. Environment checks
 * ============================================================
 */

if (process.env.NODE_ENV === "production") {
  console.log("Production mode");
} else if (process.env.NODE_ENV === "test") {
  console.log("Test mode");
} else {
  console.log("Development mode");
}

/*
 * ============================================================
 * 9. Setting an environment variable inside Node
 * ============================================================
 *
 * You can assign to process.env:
 */

process.env.APP_NAME = "nodejs-mastery";

console.log(process.env.APP_NAME);

/*
 * IMPORTANT:
 *
 * This changes the environment variable for the CURRENT
 * Node.js process and its relevant child processes.
 *
 * It does NOT permanently modify your Windows environment.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Environment variable values are converted to strings
 * ============================================================
 *
 * Example:
 */

process.env.APP_VERSION = 1;

console.log(process.env.APP_VERSION);

console.log(typeof process.env.APP_VERSION);

/*
 * The value is represented as a string.
 *
 * Prefer assigning strings explicitly:
 *
 *
 *     process.env.APP_VERSION = "1";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Delete an environment variable
 * ============================================================
 */

process.env.TEMP_VARIABLE = "temporary";

console.log("Before delete:", process.env.TEMP_VARIABLE);

delete process.env.TEMP_VARIABLE;

console.log("After delete:", process.env.TEMP_VARIABLE);

/*
 * ============================================================
 * 12. Windows PowerShell environment variable
 * ============================================================
 *
 * In PowerShell you can set an environment variable for the
 * current terminal session:
 *
 *
 *     $env:PORT="5000"
 *
 *
 * Then run:
 *
 *
 *     node env.js
 *
 *
 * Node can read:
 *
 *
 *     process.env.PORT
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Windows CMD environment variable
 * ============================================================
 *
 * In Command Prompt:
 *
 *
 *     set PORT=5000
 *
 *
 * Then:
 *
 *
 *     node env.js
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. One-command environment variable
 * ============================================================
 *
 * PowerShell:
 *
 *
 *     $env:PORT="5000"; node env.js
 *
 *
 * CMD:
 *
 *
 *     set PORT=5000 && node env.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Environment variables in npm scripts
 * ============================================================
 *
 * You can also provide environment variables before running
 * your Node application.
 *
 *
 * Example PowerShell:
 *
 *
 *     $env:NODE_ENV="production"
 *
 *     npm start
 *
 *
 * Then Node can read:
 *
 *
 *     process.env.NODE_ENV
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. .env files
 * ============================================================
 *
 * A `.env` file commonly contains configuration:
 *
 *
 *     PORT=3000
 *     NODE_ENV=development
 *     DATABASE_URL=mongodb://localhost:27017/app
 *
 *
 * IMPORTANT:
 *
 * A `.env` file can contain secrets.
 *
 * Do NOT commit secrets to Git.
 *
 * Add:
 *
 *
 *     .env
 *
 *
 * to `.gitignore`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Loading .env with Node.js
 * ============================================================
 *
 * Modern Node.js versions provide built-in support for loading
 * environment files with the `--env-file` command-line option.
 *
 *
 * Example:
 *
 *
 *     node --env-file=.env env.js
 *
 *
 * Then:
 *
 *
 *     process.env.PORT
 *
 *
 * can read the value from `.env`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Example .env
 * ============================================================
 *
 * Create:
 *
 *
 *     .env
 *
 *
 * with:
 *
 *
 *     APP_NAME=nodejs-mastery
 *     PORT=3000
 *     NODE_ENV=development
 *
 *
 * Then:
 *
 *
 *     node --env-file=.env env.js
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Multiple environment files
 * ============================================================
 *
 * A project may use files such as:
 *
 *
 *     .env
 *     .env.development
 *     .env.test
 *     .env.production
 *
 *
 * The exact loading strategy depends on your application and
 * tooling.
 *
 * Never assume that every environment file is automatically
 * loaded.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Secrets
 * ============================================================
 *
 * Examples:
 *
 *
 *     JWT_SECRET=super-secret-value
 *
 *     DATABASE_PASSWORD=secret-password
 *
 *     API_KEY=secret-api-key
 *
 *
 * Application code:
 *
 *
 *     const jwtSecret =
 *       process.env.JWT_SECRET;
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Never hard-code production secrets
 * ============================================================
 *
 * BAD:
 *
 *
 *     const JWT_SECRET =
 *       "my-super-secret-key";
 *
 *
 * Better:
 *
 *
 *     const JWT_SECRET =
 *       process.env.JWT_SECRET;
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Validate required environment variables
 * ============================================================
 *
 * A common backend pattern:
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
 *
 *     const databaseUrl =
 *       requireEnv("DATABASE_URL");
 *
 *
 * If DATABASE_URL doesn't exist, the application fails early
 * instead of failing later with a confusing database error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Configuration object
 * ============================================================
 *
 * Instead of accessing process.env everywhere, many Node.js
 * applications centralize configuration.
 * ============================================================
 */

const config = {
  appName: process.env.APP_NAME ?? "nodejs-mastery",

  port: Number(process.env.PORT ?? 3000),

  environment: process.env.NODE_ENV ?? "development",
};

console.log("Config:", config);

/*
 * A larger project might have:
 *
 *
 *     src/
 *     └── config/
 *         └── index.js
 *
 *
 * which loads and validates all environment variables.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Boolean environment variables
 * ============================================================
 *
 * This is a common mistake:
 *
 *
 *     process.env.DEBUG
 *
 *
 * Environment variables are strings.
 *
 *
 * If:
 *
 *
 *     DEBUG=false
 *
 *
 * then:
 *
 *
 *     Boolean(process.env.DEBUG)
 *
 *
 * becomes:
 *
 *
 *     true
 *
 *
 * because "false" is a non-empty string.
 *
 * ============================================================
 */

/*
 * Correct approach:
 */

function parseBoolean(value) {
  return value === "true";
}

console.log(parseBoolean(process.env.DEBUG ?? "false"));

/*
 * ============================================================
 * 25. Number validation
 * ============================================================
 */

function parsePort(value) {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port.");
  }

  return port;
}

/*
 * Example:
 *
 *
 *     const port =
 *       parsePort(
 *         process.env.PORT ?? "3000",
 *       );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Environment variables and security
 * ============================================================
 *
 * Environment variables are useful for secrets, but they are
 * NOT automatically secure.
 *
 * Consider:
 *
 *     - Who can access the machine?
 *     - Who can inspect process information?
 *     - Who can access deployment configuration?
 *     - Are secrets appearing in logs?
 *     - Are .env files committed to Git?
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. .gitignore
 * ============================================================
 *
 * Your project should normally contain:
 *
 *
 *     .gitignore
 *
 *
 * with entries such as:
 *
 *
 *     node_modules/
 *     .env
 *     .env.*
 *
 *
 * Be careful with `.env.example`.
 *
 * It can contain variable names and safe placeholder values:
 *
 *
 *     PORT=3000
 *     NODE_ENV=development
 *     DATABASE_URL=
 *     JWT_SECRET=
 *
 *
 * Never put real secrets in `.env.example`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. process.env vs process.argv
 * ============================================================
 *
 *
 * process.env
 *
 *     Configuration supplied through environment variables.
 *
 *
 * Example:
 *
 *     PORT=3000
 *
 *
 * process.argv
 *
 *     Arguments supplied through the command line.
 *
 *
 * Example:
 *
 *     node app.js --port 3000
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Real Node.js server configuration
 * ============================================================
 *
 * A server may use:
 *
 *
 *     const port =
 *       Number(
 *         process.env.PORT ??
 *         3000,
 *       );
 *
 *
 *     server.listen(port);
 *
 *
 * This means:
 *
 *
 *     If PORT exists:
 *         use PORT
 *
 *
 *     Otherwise:
 *         use 3000
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Configuration flow
 * ============================================================
 *
 *
 * Operating System / Deployment
 *             │
 *             ▼
 *       Environment Variables
 *             │
 *             ▼
 *        process.env
 *             │
 *             ▼
 *      Configuration Layer
 *             │
 *             ▼
 *      Application / Server
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Read:
 *
 *     process.env.PORT
 *
 *
 * Default:
 *
 *     process.env.PORT ?? "3000"
 *
 *
 * Set for current process:
 *
 *     process.env.APP_NAME = "my-app";
 *
 *
 * Delete:
 *
 *     delete process.env.APP_NAME;
 *
 *
 * Environment:
 *
 *     process.env.NODE_ENV
 *
 *
 * Load .env using Node:
 *
 *     node --env-file=.env env.js
 *
 *
 * PowerShell:
 *
 *     $env:PORT="5000"
 *
 *
 * CMD:
 *
 *     set PORT=5000
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     process.env is the Node.js interface for environment
 *     variables available to the current process.
 *
 * ============================================================
 */

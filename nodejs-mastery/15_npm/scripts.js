/**
 * ============================================================
 * NODE.JS MASTERY - NPM SCRIPTS
 * ============================================================
 *
 * File:
 *     15_npm/scripts.js
 *
 * ============================================================
 *
 * WHAT ARE NPM SCRIPTS?
 * ============================================================
 *
 * npm scripts are named commands defined inside the
 * "scripts" section of package.json.
 *
 * They allow us to create short, consistent commands for
 * common project tasks.
 *
 *
 * Example:
 *
 *     "scripts": {
 *       "start": "node server.js",
 *       "dev": "node --watch server.js",
 *       "test": "node --test"
 *     }
 *
 *
 * Instead of remembering:
 *
 *     node --watch server.js
 *
 *
 * we can run:
 *
 *     npm run dev
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Basic scripts object
 * ============================================================
 *
 * package.json:
 *
 *     {
 *       "scripts": {
 *         "start": "node server.js",
 *         "dev": "node --watch server.js"
 *       }
 *     }
 *
 * ============================================================
 */

const scripts = {
  start: "node server.js",

  dev: "node --watch server.js",

  test: "node --test",

  lint: "eslint .",

  format: "prettier --write .",
};

console.log("Available npm scripts:");

console.log(scripts);

/*
 * ============================================================
 * 2. Running a script
 * ============================================================
 *
 * For custom scripts:
 *
 *     npm run dev
 *
 *
 * General syntax:
 *
 *     npm run <script-name>
 *
 *
 * Examples:
 *
 *     npm run dev
 *     npm run lint
 *     npm run format
 *     npm run build
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. npm start
 * ============================================================
 *
 * "start" is a special npm lifecycle script.
 *
 *
 * package.json:
 *
 *     "scripts": {
 *       "start": "node server.js"
 *     }
 *
 *
 * Run:
 *
 *     npm start
 *
 *
 * You can also use:
 *
 *     npm run start
 *
 *
 * But "npm start" is the conventional shortcut.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. npm test
 * ============================================================
 *
 * "test" is also a conventional npm lifecycle script.
 *
 *
 * package.json:
 *
 *     "scripts": {
 *       "test": "node --test"
 *     }
 *
 *
 * Run:
 *
 *     npm test
 *
 *
 * You can also run:
 *
 *     npm run test
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. npm run
 * ============================================================
 *
 * Run:
 *
 *     npm run
 *
 *
 * This displays the project's available scripts.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Why use npm scripts?
 * ============================================================
 *
 * They provide:
 *
 *     - Short commands
 *     - Consistency
 *     - Documentation
 *     - Automation
 *     - Team-friendly workflows
 *     - CI/CD integration
 *
 *
 * Example:
 *
 *
 * Without scripts:
 *
 *     node --watch src/server.js
 *
 *
 * With scripts:
 *
 *     npm run dev
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Development script
 * ============================================================
 *
 * A typical Node.js project might have:
 *
 *
 *     "dev": "node --watch src/server.js"
 *
 *
 * Run:
 *
 *     npm run dev
 *
 *
 * This starts Node.js in watch mode.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Start script
 * ============================================================
 *
 * Production-oriented application startup:
 *
 *
 *     "start": "node src/server.js"
 *
 *
 * Run:
 *
 *     npm start
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Build script
 * ============================================================
 *
 * TypeScript project:
 *
 *
 *     "build": "tsc"
 *
 *
 * Run:
 *
 *     npm run build
 *
 *
 * Concept:
 *
 *
 *     TypeScript
 *          ↓
 *         tsc
 *          ↓
 *     JavaScript output
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Lint script
 * ============================================================
 *
 * Example:
 *
 *
 *     "lint": "eslint ."
 *
 *
 * Run:
 *
 *     npm run lint
 *
 *
 * This checks project source code according to the project's
 * ESLint configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Format script
 * ============================================================
 *
 * Example:
 *
 *
 *     "format": "prettier --write ."
 *
 *
 * Run:
 *
 *     npm run format
 *
 *
 * This asks Prettier to format the project files.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Format check
 * ============================================================
 *
 * CI pipelines often need to check formatting without changing
 * files.
 *
 *
 * Example:
 *
 *
 *     "format:check": "prettier --check ."
 *
 *
 * Run:
 *
 *
 *     npm run format:check
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Test script
 * ============================================================
 *
 * Node.js has a built-in test runner.
 *
 *
 * Example:
 *
 *
 *     "test": "node --test"
 *
 *
 * Run:
 *
 *
 *     npm test
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Multiple scripts
 * ============================================================
 *
 * Example:
 *
 *
 *     "scripts": {
 *       "dev": "node --watch src/server.js",
 *       "start": "node src/server.js",
 *       "build": "tsc",
 *       "lint": "eslint .",
 *       "format": "prettier --write .",
 *       "test": "node --test"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Script naming
 * ============================================================
 *
 * Script names are arbitrary.
 *
 *
 * Examples:
 *
 *     dev
 *     build
 *     lint
 *     format
 *     test
 *     clean
 *     seed
 *     migrate
 *     typecheck
 *
 *
 * Some names have conventional npm behavior, such as:
 *
 *     start
 *     test
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Colon naming convention
 * ============================================================
 *
 * Related scripts can use colon-separated names.
 *
 *
 * Example:
 *
 *
 *     "db:migrate": "node scripts/migrate.js",
 *     "db:seed": "node scripts/seed.js"
 *
 *
 * Run:
 *
 *
 *     npm run db:migrate
 *
 *
 *     npm run db:seed
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Example project scripts
 * ============================================================
 */

const backendScripts = {
  dev: "node --watch src/server.js",

  start: "node src/server.js",

  build: "tsc",

  test: "node --test",

  lint: "eslint .",

  "lint:fix": "eslint . --fix",

  format: "prettier --write .",

  "format:check": "prettier --check .",

  typecheck: "tsc --noEmit",

  "db:migrate": "node scripts/migrate.js",

  "db:seed": "node scripts/seed.js",
};

console.log("\nBackend scripts:");

console.log(backendScripts);

/*
 * ============================================================
 * 18. Script arguments
 * ============================================================
 *
 * npm scripts can receive additional arguments.
 *
 *
 * Example:
 *
 *
 *     npm run test -- --watch
 *
 *
 * The "--" separates npm arguments from arguments passed to
 * the underlying command.
 *
 *
 * Concept:
 *
 *
 *     npm run test
 *            │
 *            └── npm
 *
 *
 *     --
 *       ↓
 *     pass remaining arguments
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Environment variables
 * ============================================================
 *
 * Scripts can use environment variables.
 *
 *
 * Example concept:
 *
 *
 *     "start": "node src/server.js"
 *
 *
 * The application can read:
 *
 *
 *     process.env.PORT
 *
 *
 * Environment variables should generally hold configuration,
 * not be hard-coded into npm scripts.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Cross-platform scripts
 * ============================================================
 *
 * Shell syntax can behave differently across:
 *
 *     Windows
 *     Linux
 *     macOS
 *
 *
 * For example, directly setting an environment variable in a
 * command can differ between shells.
 *
 *
 * Cross-platform projects should use suitable tooling or
 * Node.js-based scripts when portability matters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. npm lifecycle scripts
 * ============================================================
 *
 * npm has lifecycle events around commands.
 *
 *
 * Examples include:
 *
 *     prestart
 *     start
 *     poststart
 *
 *
 *     pretest
 *     test
 *     posttest
 *
 *
 * If you define:
 *
 *
 *     "prestart": "node scripts/check.js",
 *     "start": "node server.js"
 *
 *
 * npm can run:
 *
 *
 *     prestart
 *         ↓
 *     start
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. pre scripts
 * ============================================================
 *
 * If you define:
 *
 *
 *     "pretest": "node scripts/before-test.js",
 *     "test": "node --test"
 *
 *
 * Running:
 *
 *
 *     npm test
 *
 *
 * can execute:
 *
 *
 *     pretest
 *         ↓
 *     test
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. post scripts
 * ============================================================
 *
 * Example:
 *
 *
 *     "test": "node --test",
 *     "posttest": "node scripts/report.js"
 *
 *
 * Running:
 *
 *
 *     npm test
 *
 *
 * can execute:
 *
 *
 *     test
 *         ↓
 *     posttest
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Full lifecycle example
 * ============================================================
 */

const lifecycle = {
  prebuild: "node scripts/check-environment.js",

  build: "tsc",

  postbuild: "node scripts/copy-assets.js",
};

console.log("\nBuild lifecycle:");

console.log(lifecycle);

/*
 * ============================================================
 * 25. npm-run scripts can call other scripts
 * ============================================================
 *
 * Example:
 *
 *
 *     "lint": "eslint .",
 *     "format:check": "prettier --check .",
 *     "check": "npm run lint && npm run format:check"
 *
 *
 * Run:
 *
 *
 *     npm run check
 *
 *
 * Flow:
 *
 *
 *     check
 *       │
 *       ├── lint
 *       │
 *       └── format:check
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Sequential commands
 * ============================================================
 *
 * Shell operators can run commands sequentially.
 *
 *
 * Example:
 *
 *
 *     "check": "npm run lint && npm test"
 *
 *
 * The second command runs only if the first command succeeds.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Node.js scripts
 * ============================================================
 *
 * Instead of placing complicated shell logic inside package.json,
 * create a JavaScript file.
 *
 *
 * Example:
 *
 *
 *     scripts/
 *     └── migrate.js
 *
 *
 * package.json:
 *
 *
 *     "db:migrate": "node scripts/migrate.js"
 *
 *
 * This is often easier to maintain.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Script as application entry point
 * ============================================================
 *
 * Example:
 *
 *
 *     "start": "node src/server.js"
 *
 *
 * Here npm is not the server.
 *
 *
 * npm
 *  ↓
 * executes script
 *  ↓
 * Node.js
 *  ↓
 * server.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. npm scripts and dependencies
 * ============================================================
 *
 * Suppose:
 *
 *
 * devDependencies:
 *
 *     eslint
 *     prettier
 *     typescript
 *
 *
 * scripts:
 *
 *
 *     "lint": "eslint .",
 *     "format": "prettier --write .",
 *     "build": "tsc"
 *
 *
 * npm scripts can directly use locally installed command-line
 * binaries from the project's dependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Why local binaries work
 * ============================================================
 *
 * If you install:
 *
 *
 *     npm install -D eslint
 *
 *
 * npm places the executable under the project's:
 *
 *
 *     node_modules/.bin/
 *
 *
 * npm scripts automatically make local binaries available on
 * the script PATH.
 *
 *
 * Therefore:
 *
 *
 *     "lint": "eslint ."
 *
 *
 * works without requiring a global ESLint installation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Avoid global tooling when possible
 * ============================================================
 *
 * Project-local tools are generally preferable for team projects.
 *
 *
 * Why?
 *
 *     Developer A
 *         ↓
 *     same project dependency version
 *
 *
 *     Developer B
 *         ↓
 *     same project dependency version
 *
 *
 *     CI
 *         ↓
 *     same project dependency version
 *
 *
 * This improves reproducibility.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. CI/CD scripts
 * ============================================================
 *
 * A project might define:
 *
 *
 *     "scripts": {
 *       "ci": "npm run lint && npm test && npm run build"
 *     }
 *
 *
 * Run:
 *
 *
 *     npm run ci
 *
 *
 * Concept:
 *
 *
 *     lint
 *       ↓
 *     test
 *       ↓
 *     build
 *       ↓
 *     deploy
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Production workflow
 * ============================================================
 *
 *
 * Development:
 *
 *     npm run dev
 *
 *
 * Verification:
 *
 *     npm run lint
 *     npm test
 *
 *
 * Build:
 *
 *     npm run build
 *
 *
 * Production:
 *
 *     npm start
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Database scripts
 * ============================================================
 *
 * Backend projects often define:
 *
 *
 *     "db:migrate": "node scripts/migrate.js",
 *     "db:seed": "node scripts/seed.js"
 *
 *
 * This gives the team predictable commands.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Clean script
 * ============================================================
 *
 * Build systems may need a cleanup command.
 *
 *
 * Example:
 *
 *
 *     "clean": "node scripts/clean.js"
 *
 *
 * A JavaScript cleanup script can be more portable than relying
 * on shell-specific commands.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Type checking
 * ============================================================
 *
 * TypeScript projects commonly use:
 *
 *
 *     "typecheck": "tsc --noEmit"
 *
 *
 * This checks types without generating JavaScript output.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Watch scripts
 * ============================================================
 *
 * Node.js provides watch mode:
 *
 *
 *     node --watch server.js
 *
 *
 * package.json:
 *
 *
 *     "dev": "node --watch server.js"
 *
 *
 * Run:
 *
 *
 *     npm run dev
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Script environment
 * ============================================================
 *
 * npm scripts run with a PATH that includes local project
 * executables.
 *
 *
 * They also expose npm-related environment variables.
 *
 *
 * Example:
 *
 *
 *     process.env.npm_lifecycle_event
 *
 *
 * can identify the lifecycle/script event currently running.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Reading npm lifecycle event
 * ============================================================
 */

const currentScript = process.env.npm_lifecycle_event;

console.log(
  "\nCurrent npm lifecycle event:",
  currentScript ?? "Not running through npm",
);

/*
 * ============================================================
 * 40. Example package.json
 * ============================================================
 *
 * A realistic Node.js backend might have:
 *
 *
 * {
 *   "scripts": {
 *     "dev": "node --watch src/server.js",
 *     "start": "node src/server.js",
 *     "build": "tsc",
 *     "typecheck": "tsc --noEmit",
 *     "lint": "eslint .",
 *     "lint:fix": "eslint . --fix",
 *     "format": "prettier --write .",
 *     "format:check": "prettier --check .",
 *     "test": "node --test",
 *     "check": "npm run typecheck && npm run lint && npm test"
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Common mistakes
 * ============================================================
 *
 * Mistake 1:
 *
 *     Installing ESLint globally and assuming every developer
 *     has the same version.
 *
 *
 * Better:
 *
 *     Install ESLint as a devDependency.
 *
 *
 * Mistake 2:
 *
 *     Putting complicated shell logic directly in package.json.
 *
 *
 * Better:
 *
 *     Move complex logic into scripts/*.js.
 *
 *
 * Mistake 3:
 *
 *     Using a development command as the production start command.
 *
 *
 * Better:
 *
 *     Separate:
 *
 *         dev
 *         start
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Development vs production
 * ============================================================
 *
 *
 * DEVELOPMENT
 *
 *     npm run dev
 *
 *     Watch source files
 *     Developer tooling
 *     Debugging
 *
 *
 * PRODUCTION
 *
 *     npm start
 *
 *     Stable application startup
 *     No development watcher
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Script naming recommendation
 * ============================================================
 *
 * Prefer clear names:
 *
 *
 *     dev
 *     start
 *     build
 *     test
 *     lint
 *     format
 *     typecheck
 *
 *
 * Avoid obscure names such as:
 *
 *
 *     "x": "..."
 *
 *
 * unless there is a very specific reason.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Script documentation
 * ============================================================
 *
 * package.json scripts act as a small command reference for
 * your project.
 *
 *
 * A developer can inspect:
 *
 *
 *     package.json
 *
 *
 * and discover:
 *
 *
 *     How to start
 *     How to test
 *     How to build
 *     How to lint
 *     How to format
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                 package.json
 *                       │
 *                       ↓
 *                    scripts
 *                       │
 *          ┌────────────┼────────────┐
 *          ↓            ↓            ↓
 *         dev          test        build
 *          │            │            │
 *          ↓            ↓            ↓
 *       Node.js      Test runner    tsc
 *
 *
 * npm is the command orchestrator.
 *
 *
 * Example:
 *
 *
 *     npm run dev
 *
 *
 * means:
 *
 *
 *     Find "dev" in package.json
 *             ↓
 *     Execute its command
 *
 * ============================================================
 *
 * REMEMBER:
 *
 *     npm run <name>
 *         =
 *     execute a custom npm script.
 *
 *
 *     npm start
 *         =
 *     execute the start script.
 *
 *
 *     npm test
 *         =
 *     execute the test script.
 *
 *
 *     npm run
 *         =
 *     list available scripts.
 *
 *
 *     pre<name>
 *         =
 *     lifecycle hook before a script.
 *
 *
 *     post<name>
 *         =
 *     lifecycle hook after a script.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     semver.js
 *
 * ============================================================
 */

/**
 * ============================================================
 * NODE.JS MASTERY - NPM DEV DEPENDENCIES
 * ============================================================
 *
 * File:
 *     15_npm/dev_dependencies.js
 *
 * ============================================================
 *
 * WHAT IS A devDependency?
 * ============================================================
 *
 * A devDependency is a package that is primarily required
 * during development, testing, linting, formatting, building,
 * or other project-development tasks.
 *
 *
 * Example:
 *
 *     Application
 *         │
 *         ├── express
 *         │      ↓
 *         │   dependency
 *         │
 *         └── eslint
 *                ↓
 *          devDependency
 *
 * ============================================================
 *
 * INSTALL A DEV DEPENDENCY
 * ============================================================
 *
 *     npm install --save-dev eslint
 *
 *
 * Short form:
 *
 *     npm install -D eslint
 *
 *
 * After installation:
 *
 *     "devDependencies": {
 *       "eslint": "..."
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. dependencies vs devDependencies
 * ============================================================
 *
 *
 * dependencies
 * ─────────────────────────────────────────
 * Required by the application at runtime.
 *
 *
 * Examples:
 *
 *     express
 *     mongoose
 *     redis
 *     jsonwebtoken
 *
 *
 * devDependencies
 * ─────────────────────────────────────────
 * Primarily required while developing the application.
 *
 *
 * Examples:
 *
 *     eslint
 *     prettier
 *     typescript
 *     testing tools
 *     build tools
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Example package.json
 * ============================================================
 *
 *     {
 *       "dependencies": {
 *         "express": "^5.0.0"
 *       },
 *
 *       "devDependencies": {
 *         "eslint": "^9.0.0",
 *         "prettier": "^3.0.0"
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Install a development dependency
 * ============================================================
 *
 * Command:
 *
 *     npm install --save-dev eslint
 *
 *
 * Short:
 *
 *     npm i -D eslint
 *
 *
 * npm updates:
 *
 *     package.json
 *     package-lock.json
 *     node_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Why separate them?
 * ============================================================
 *
 * Separating runtime and development packages makes the
 * project's dependency intent clear.
 *
 *
 * Example:
 *
 *
 * PRODUCTION
 *
 *     Express
 *     Mongoose
 *     Redis
 *
 *
 * DEVELOPMENT
 *
 *     ESLint
 *     Prettier
 *     Test runner
 *
 *
 * This distinction becomes especially important for production
 * deployments.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Example devDependencies object
 * ============================================================
 */

const devDependencies = {
  eslint: "^9.0.0",

  prettier: "^3.0.0",

  typescript: "^5.0.0",
};

console.log("Development dependencies:");

console.log(devDependencies);

/*
 * ============================================================
 * 6. ESLint
 * ============================================================
 *
 * ESLint analyzes JavaScript/TypeScript code and can identify
 * potential problems and enforce coding conventions.
 *
 *
 * Example:
 *
 *     npm install --save-dev eslint
 *
 *
 * Why devDependency?
 *
 * ESLint is normally used while developing/checking the code,
 * not by the application itself at runtime.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Prettier
 * ============================================================
 *
 * Prettier is a code formatter.
 *
 *
 * Example:
 *
 *     npm install --save-dev prettier
 *
 *
 * It modifies/formats source code according to formatting rules.
 *
 *
 * It is normally a development tool.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. TypeScript
 * ============================================================
 *
 * In many Node.js projects, TypeScript is used during
 * development/building.
 *
 *
 * Example:
 *
 *     npm install --save-dev typescript
 *
 *
 * TypeScript source:
 *
 *     .ts
 *
 *
 * can be compiled into JavaScript that Node.js executes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Testing tools
 * ============================================================
 *
 * Testing packages are commonly devDependencies.
 *
 *
 * Examples include:
 *
 *     Test runners
 *     Assertion libraries
 *     Mocking libraries
 *
 *
 * Example:
 *
 *     npm install --save-dev <testing-package>
 *
 *
 * Why?
 *
 * Tests are normally executed during development or CI,
 * rather than being imported by the production application.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Build tools
 * ============================================================
 *
 * Build tools can also be development dependencies.
 *
 *
 * Example:
 *
 *     Source code
 *         ↓
 *     Build tool
 *         ↓
 *     Production output
 *
 *
 * The build tool may not be needed after the application has
 * been built.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Linting
 * ============================================================
 *
 * Linting checks source code for:
 *
 *     - Potential errors
 *     - Problematic patterns
 *     - Style violations
 *     - Inconsistent practices
 *
 *
 * Typical flow:
 *
 *
 *     Write code
 *         ↓
 *     ESLint
 *         ↓
 *     Fix problems
 *         ↓
 *     Commit code
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Formatting
 * ============================================================
 *
 * Typical flow:
 *
 *
 *     Source code
 *         ↓
 *     Prettier
 *         ↓
 *     Consistent formatting
 *
 *
 * Formatting and linting solve different problems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Development dependencies in package.json
 * ============================================================
 */

const packageJson = {
  name: "example-node-project",

  version: "1.0.0",

  dependencies: {
    express: "^5.0.0",

    mongoose: "^8.0.0",
  },

  devDependencies: {
    eslint: "^9.0.0",

    prettier: "^3.0.0",

    typescript: "^5.0.0",
  },
};

console.log("\nExample package.json:");

console.log(JSON.stringify(packageJson, null, 2));

/*
 * ============================================================
 * 14. npm install behavior
 * ============================================================
 *
 * Running:
 *
 *     npm install
 *
 * normally installs both:
 *
 *     dependencies
 *
 * and:
 *
 *     devDependencies
 *
 * in a development environment.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Production installation
 * ============================================================
 *
 * Production deployments may omit devDependencies.
 *
 *
 * Modern npm:
 *
 *
 *     npm ci --omit=dev
 *
 *
 * This installs production dependencies while omitting
 * development dependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Why omit devDependencies?
 * ============================================================
 *
 * Suppose:
 *
 *
 * dependencies:
 *
 *     express
 *     mongoose
 *     redis
 *
 *
 * devDependencies:
 *
 *     eslint
 *     prettier
 *     test-runner
 *
 *
 * A production container may only need:
 *
 *
 *     express
 *     mongoose
 *     redis
 *
 *
 * It does not necessarily need:
 *
 *     eslint
 *     prettier
 *     test-runner
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. NODE_ENV is NOT the only mechanism
 * ============================================================
 *
 * Historically, Node.js projects often used:
 *
 *     NODE_ENV=production
 *
 *
 * npm's modern dependency omission behavior can be explicitly
 * controlled with:
 *
 *     --omit=dev
 *
 *
 * Do not rely on NODE_ENV alone as your mental model for npm's
 * dependency installation behavior.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. npm install -D
 * ============================================================
 *
 * Short form:
 *
 *
 *     npm install -D package-name
 *
 *
 * Example:
 *
 *
 *     npm install -D eslint
 *
 *
 * It means:
 *
 *
 *     --save-dev
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Installing multiple devDependencies
 * ============================================================
 *
 * You can install several packages at once.
 *
 *
 * Example:
 *
 *
 *     npm install -D eslint prettier typescript
 *
 *
 * They are added to devDependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Remove a devDependency
 * ============================================================
 *
 * Command:
 *
 *
 *     npm uninstall eslint
 *
 *
 * npm updates package metadata and the lockfile.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Check installed packages
 * ============================================================
 *
 * Command:
 *
 *
 *     npm list
 *
 *
 * This can show the installed dependency tree.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. package-lock.json
 * ============================================================
 *
 * Development dependencies are also represented in the
 * dependency lockfile.
 *
 *
 * Therefore:
 *
 *
 * package.json
 *       │
 *       ├── dependencies
 *       │
 *       └── devDependencies
 *               │
 *               ↓
 *        package-lock.json
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. npm ci
 * ============================================================
 *
 * CI/CD systems commonly use:
 *
 *
 *     npm ci
 *
 *
 * This installs from the lockfile in a clean environment.
 *
 *
 * A common pipeline:
 *
 *
 *     checkout code
 *          ↓
 *     npm ci
 *          ↓
 *     npm test
 *          ↓
 *     npm run lint
 *          ↓
 *     npm run build
 *          ↓
 *     deploy
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Build-time dependency
 * ============================================================
 *
 * Consider:
 *
 *
 *     TypeScript
 *         ↓
 *     compile source
 *         ↓
 *     JavaScript
 *
 *
 * If TypeScript is only needed to build the application and the
 * deployment receives the compiled JavaScript, TypeScript can
 * appropriately be a devDependency.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Runtime dependency example
 * ============================================================
 *
 * Consider:
 *
 *
 *     import express from "express";
 *
 *
 * The application imports Express when it starts.
 *
 *
 * Therefore:
 *
 *
 *     express
 *
 *
 * should be in:
 *
 *
 *     dependencies
 *
 *
 * NOT merely devDependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Wrong classification
 * ============================================================
 *
 * BAD:
 *
 *
 *     "devDependencies": {
 *       "express": "..."
 *     }
 *
 *
 * while production code requires Express at runtime.
 *
 *
 * If production installation omits devDependencies, Express will
 * not be available.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Correct classification
 * ============================================================
 *
 * GOOD:
 *
 *
 *     "dependencies": {
 *       "express": "..."
 *     },
 *
 *     "devDependencies": {
 *       "eslint": "...",
 *       "prettier": "..."
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Peer dependencies are different
 * ============================================================
 *
 * Do not confuse:
 *
 *
 *     dependencies
 *     devDependencies
 *     peerDependencies
 *
 *
 * peerDependencies are primarily used by packages/libraries to
 * express compatibility requirements that are expected to be
 * supplied by the consuming project.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Optional dependencies are different
 * ============================================================
 *
 * npm also supports:
 *
 *
 *     optionalDependencies
 *
 *
 * They have different installation/runtime semantics from
 * devDependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Monorepos
 * ============================================================
 *
 * Large projects can have different development dependencies
 * for different packages.
 *
 *
 * Example:
 *
 *
 *     monorepo/
 *     ├── package.json
 *     └── packages/
 *         ├── api/
 *         │   └── package.json
 *         └── web/
 *             └── package.json
 *
 *
 * npm workspaces can manage such structures.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Dependency lifecycle
 * ============================================================
 *
 *
 * Development:
 *
 *     npm install
 *          ↓
 *     dependencies
 *          +
 *     devDependencies
 *
 *
 * Production:
 *
 *     npm ci --omit=dev
 *          ↓
 *     production dependencies
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Typical Node.js backend
 * ============================================================
 *
 *
 * dependencies:
 *
 *     express
 *     mongoose
 *     jsonwebtoken
 *     redis client
 *
 *
 * devDependencies:
 *
 *     eslint
 *     prettier
 *     test runner
 *     typescript
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Example scripts
 * ============================================================
 *
 * A project may define:
 *
 *
 *     "scripts": {
 *       "dev": "node --watch src/server.js",
 *       "lint": "eslint .",
 *       "format": "prettier --write .",
 *       "test": "node --test",
 *       "build": "tsc"
 *     }
 *
 *
 * These scripts commonly use devDependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. CI/CD example
 * ============================================================
 *
 *
 * Developer
 *     │
 *     ↓
 * Git push
 *     │
 *     ↓
 * CI server
 *     │
 *     ↓
 * npm ci
 *     │
 *     ├── devDependencies
 *     │
 *     └── dependencies
 *     │
 *     ↓
 * test
 *     ↓
 * build
 *     ↓
 * production artifact
 *     │
 *     ↓
 * deployment
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Production container example
 * ============================================================
 *
 *
 * Development image:
 *
 *     dependencies
 *     +
 *     devDependencies
 *
 *
 * Production image:
 *
 *     runtime application
 *     +
 *     production dependencies
 *
 *
 * The exact strategy depends on how the application is built
 * and packaged.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Security considerations
 * ============================================================
 *
 * DevDependencies can still affect your software supply chain.
 *
 * Even if a package is not present in the final production
 * runtime environment, it may execute during:
 *
 *     npm install
 *     build
 *     test
 *     CI
 *
 *
 * Therefore development dependencies should also be reviewed
 * and kept up to date.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. npm audit
 * ============================================================
 *
 * Check dependency security information:
 *
 *
 *     npm audit
 *
 *
 * Do not assume that devDependencies are irrelevant to security.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Minimal dependency strategy
 * ============================================================
 *
 * Prefer:
 *
 *
 *     Only install what you need.
 *
 *
 * Avoid:
 *
 *
 *     Installing large packages for tiny functionality when a
 *     simple standard-library solution is sufficient.
 *
 *
 * Every additional package increases your dependency surface.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. How to decide?
 * ============================================================
 *
 *
 * Ask:
 *
 *
 * "Does my application need this package when it is running?"
 *
 *
 * YES
 *     ↓
 * dependencies
 *
 *
 * NO, only development/build/test/lint/format
 *     ↓
 * devDependencies
 *
 *
 * Library/plugin compatibility requirement
 *     ↓
 * peerDependencies may be appropriate
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Quick comparison
 * ============================================================
 *
 *
 * ┌────────────────────┬──────────────────────────────────┐
 * │ Type               │ Purpose                          │
 * ├────────────────────┼──────────────────────────────────┤
 * │ dependencies       │ Runtime requirements              │
 * │ devDependencies    │ Development requirements         │
 * │ peerDependencies   │ Consumer compatibility           │
 * │ optionalDependencies│ Optional package requirements   │
 * └────────────────────┴──────────────────────────────────┘
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Common commands
 * ============================================================
 *
 *
 * Install runtime dependency:
 *
 *     npm install express
 *
 *
 * Install dev dependency:
 *
 *     npm install --save-dev eslint
 *
 *
 * Short:
 *
 *     npm i -D eslint
 *
 *
 * Remove:
 *
 *     npm uninstall eslint
 *
 *
 * Install everything:
 *
 *     npm install
 *
 *
 * Clean install:
 *
 *     npm ci
 *
 *
 * Production-only:
 *
 *     npm ci --omit=dev
 *
 *
 * Audit:
 *
 *     npm audit
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                    package.json
 *                         │
 *             ┌───────────┴───────────┐
 *             ↓                       ↓
 *       dependencies           devDependencies
 *             │                       │
 *             ↓                       ↓
 *        Runtime                Development
 *             │                       │
 *             ↓                       ↓
 *       Production              Build/Test/Lint
 *
 *
 * ============================================================
 *
 * REMEMBER:
 *
 *     dependencies
 *         =
 *     required by the running application.
 *
 *
 *     devDependencies
 *         =
 *     primarily required to develop, test, lint, format,
 *     or build the application.
 *
 *
 *     npm install -D package
 *         =
 *     add package to devDependencies.
 *
 *
 *     npm ci --omit=dev
 *         =
 *     clean installation without devDependencies.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     scripts.js
 *
 * ============================================================
 */

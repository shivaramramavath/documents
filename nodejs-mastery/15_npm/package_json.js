/**
 * ============================================================
 * NODE.JS MASTERY - NPM
 * ============================================================
 *
 * File:
 *     15_npm/package_json.js
 *
 * ============================================================
 *
 * WHAT IS package.json?
 * ============================================================
 *
 * package.json is the main configuration/metadata file of a
 * Node.js project.
 *
 * It describes things such as:
 *
 *     - Project name
 *     - Project version
 *     - Entry point
 *     - npm scripts
 *     - Dependencies
 *     - Development dependencies
 *     - Node.js/npm requirements
 *     - Package metadata
 *
 * ============================================================
 *
 * BASIC package.json
 * ============================================================
 *
 * {
 *   "name": "my-project",
 *   "version": "1.0.0",
 *   "description": "My Node.js project",
 *   "main": "index.js",
 *   "scripts": {
 *     "start": "node index.js"
 *   },
 *   "dependencies": {},
 *   "devDependencies": {}
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. package.json is JSON
 * ============================================================
 *
 * JSON:
 *
 *     JavaScript Object Notation
 *
 * package.json is NOT a normal JavaScript file.
 *
 *
 * Valid:
 *
 *     {
 *       "name": "my-app"
 *     }
 *
 *
 * Invalid:
 *
 *     {
 *       name: "my-app"
 *     }
 *
 *
 * JSON requires property names to use double quotes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Project name
 * ============================================================
 *
 * "name" identifies the package/project.
 *
 * Example:
 *
 *     "name": "nodejs-mastery"
 *
 *
 * npm package names should follow npm naming rules.
 *
 * ============================================================
 */

const projectName = "nodejs-mastery";

console.log("Project name:", projectName);

/*
 * ============================================================
 * 3. Project version
 * ============================================================
 *
 * "version" identifies the current release version.
 *
 * Common format:
 *
 *     MAJOR.MINOR.PATCH
 *
 *
 * Example:
 *
 *     1.0.0
 *
 * ============================================================
 */

const version = "1.0.0";

console.log("Version:", version);

/*
 * ============================================================
 * 4. Description
 * ============================================================
 *
 * "description" explains what the package/project does.
 * ============================================================
 */

const description = "A Node.js learning repository";

console.log("Description:", description);

/*
 * ============================================================
 * 5. Main
 * ============================================================
 *
 * "main" traditionally identifies the package entry point.
 *
 * Example:
 *
 *     "main": "index.js"
 *
 *
 * For an application, you might instead execute a file directly
 * through npm scripts.
 *
 * ============================================================
 */

const main = "index.js";

console.log("Main entry:", main);

/*
 * ============================================================
 * 6. Type
 * ============================================================
 *
 * Node.js supports different module systems.
 *
 *
 *     "type": "module"
 *
 * means .js files are treated as ES modules.
 *
 *
 * Without it, .js files are traditionally treated as CommonJS
 * unless another configuration applies.
 *
 * ============================================================
 */

const moduleType = "module";

console.log("Module type:", moduleType);

/*
 * ============================================================
 * 7. Scripts
 * ============================================================
 *
 * npm scripts provide shortcuts for commands.
 *
 *
 * Example package.json:
 *
 *     "scripts": {
 *       "start": "node src/index.js",
 *       "dev": "node --watch src/index.js",
 *       "test": "node --test"
 *     }
 *
 *
 * Run:
 *
 *     npm start
 *     npm run dev
 *     npm test
 *
 * ============================================================
 */

const scripts = {
  start: "node src/index.js",

  dev: "node --watch src/index.js",

  test: "node --test",
};

console.log("Scripts:", scripts);

/*
 * ============================================================
 * 8. Dependencies
 * ============================================================
 *
 * dependencies contain packages required by the application
 * at runtime.
 *
 *
 * Example:
 *
 *     "dependencies": {
 *       "express": "^5.1.0"
 *     }
 *
 *
 * If your application imports Express while running in
 * production, Express belongs in dependencies.
 *
 * ============================================================
 */

const dependencies = {
  express: "^5.1.0",
};

console.log("Dependencies:", dependencies);

/*
 * ============================================================
 * 9. devDependencies
 * ============================================================
 *
 * devDependencies contain packages primarily needed during
 * development.
 *
 * Examples:
 *
 *     Testing tools
 *     Linters
 *     Formatters
 *     TypeScript tooling
 *     Build tools
 *
 *
 * Example:
 *
 *     "devDependencies": {
 *       "eslint": "^9.0.0"
 *     }
 *
 * ============================================================
 */

const devDependencies = {
  eslint: "^9.0.0",
};

console.log("Development dependencies:", devDependencies);

/*
 * ============================================================
 * 10. engines
 * ============================================================
 *
 * "engines" can document supported Node.js/npm versions.
 *
 *
 * Example:
 *
 *     "engines": {
 *       "node": ">=20"
 *     }
 *
 * ============================================================
 */

const engines = {
  node: ">=20",
};

console.log("Supported Node.js:", engines.node);

/*
 * ============================================================
 * 11. Private package
 * ============================================================
 *
 * Applications that should not accidentally be published to
 * npm can use:
 *
 *     "private": true
 *
 *
 * Example:
 *
 *     {
 *       "private": true
 *     }
 *
 * ============================================================
 */

const privateProject = true;

console.log("Private project:", privateProject);

/*
 * ============================================================
 * 12. Keywords
 * ============================================================
 *
 * Keywords help describe a published npm package.
 *
 * ============================================================
 */

const keywords = ["nodejs", "javascript", "backend", "npm"];

console.log("Keywords:", keywords);

/*
 * ============================================================
 * 13. Author
 * ============================================================
 */

const author = "Node.js Developer";

console.log("Author:", author);

/*
 * ============================================================
 * 14. License
 * ============================================================
 *
 * Common open-source licenses include:
 *
 *     MIT
 *     Apache-2.0
 *     ISC
 *
 * Always choose a license appropriate to your project.
 *
 * ============================================================
 */

const license = "MIT";

console.log("License:", license);

/*
 * ============================================================
 * 15. Build a package.json-like object
 * ============================================================
 */

const packageJson = {
  name: "nodejs-mastery",

  version: "1.0.0",

  description: "A Node.js learning repository",

  main: "index.js",

  type: "module",

  scripts: {
    start: "node src/index.js",

    dev: "node --watch src/index.js",

    test: "node --test",
  },

  dependencies: {
    express: "^5.1.0",
  },

  devDependencies: {
    eslint: "^9.0.0",
  },

  engines: {
    node: ">=20",
  },

  private: true,

  keywords: ["nodejs", "javascript", "backend"],

  author: "Node.js Developer",

  license: "MIT",
};

console.log("\nPackage configuration:");

console.log(JSON.stringify(packageJson, null, 2));

/*
 * ============================================================
 * 16. JSON.stringify()
 * ============================================================
 *
 * JSON.stringify() converts a JavaScript value into JSON text.
 *
 * ============================================================
 */

const jsonText = JSON.stringify(packageJson);

console.log("\nJSON text:", jsonText);

/*
 * ============================================================
 * 17. JSON.parse()
 * ============================================================
 *
 * JSON.parse() converts JSON text into a JavaScript value.
 * ============================================================
 */

const parsedPackage = JSON.parse(jsonText);

console.log("\nParsed package name:", parsedPackage.name);

/*
 * ============================================================
 * 18. package-lock.json
 * ============================================================
 *
 * npm commonly creates:
 *
 *     package-lock.json
 *
 *
 * It records the resolved dependency tree and versions.
 *
 * This helps make installations reproducible.
 *
 *
 * package.json:
 *
 *     Declares what your project needs.
 *
 *
 * package-lock.json:
 *
 *     Records the resolved dependency tree.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. node_modules
 * ============================================================
 *
 * npm installs packages into:
 *
 *     node_modules/
 *
 *
 * Example:
 *
 *     project/
 *     ├── package.json
 *     ├── package-lock.json
 *     └── node_modules/
 *
 *
 * node_modules can become very large.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. .gitignore
 * ============================================================
 *
 * Usually:
 *
 *     node_modules/
 *
 * should NOT be committed to Git.
 *
 *
 * Example:
 *
 *     node_modules/
 *     .env
 *
 *
 * package.json and package-lock.json should normally be
 * committed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. npm init
 * ============================================================
 *
 * Create a new package.json:
 *
 *
 *     npm init
 *
 *
 * npm asks questions such as:
 *
 *     package name
 *     version
 *     description
 *     entry point
 *     test command
 *     git repository
 *     keywords
 *     author
 *     license
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. npm init -y
 * ============================================================
 *
 * Automatically creates package.json with default values.
 *
 *
 *     npm init -y
 *
 *
 * This is commonly used when starting a simple Node.js
 * project.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. npm install
 * ============================================================
 *
 * Install dependencies from package.json:
 *
 *
 *     npm install
 *
 *
 * npm reads package.json and installs the required packages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. npm install package
 * ============================================================
 *
 * Example:
 *
 *
 *     npm install express
 *
 *
 * This normally:
 *
 *     1. Downloads Express
 *     2. Places it in node_modules/
 *     3. Adds Express to dependencies
 *     4. Updates package-lock.json
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. npm install --save-dev
 * ============================================================
 *
 * Example:
 *
 *
 *     npm install --save-dev eslint
 *
 *
 * Adds the package to:
 *
 *     devDependencies
 *
 *
 * Short form:
 *
 *
 *     npm i -D eslint
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. npm uninstall
 * ============================================================
 *
 * Remove a dependency:
 *
 *
 *     npm uninstall express
 *
 *
 * npm updates:
 *
 *     package.json
 *     package-lock.json
 *     node_modules
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. npm update
 * ============================================================
 *
 * Update packages according to the version ranges allowed by
 * package.json.
 *
 *
 *     npm update
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. npm outdated
 * ============================================================
 *
 * Check for packages that have newer versions available:
 *
 *
 *     npm outdated
 *
 *
 * Useful columns include:
 *
 *     Current
 *     Wanted
 *     Latest
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. npm list
 * ============================================================
 *
 * Display installed packages:
 *
 *
 *     npm list
 *
 *
 * Production-only:
 *
 *
 *     npm list --omit=dev
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. npm scripts
 * ============================================================
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
 * For custom scripts:
 *
 *     "dev": "node --watch server.js"
 *
 *
 * Run:
 *
 *     npm run dev
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. npm test
 * ============================================================
 *
 * If package.json contains:
 *
 *     "scripts": {
 *       "test": "node --test"
 *     }
 *
 *
 * then:
 *
 *     npm test
 *
 * executes the configured test command.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. npm start
 * ============================================================
 *
 * npm provides a shortcut for the "start" script.
 *
 *
 *     npm start
 *
 *
 * instead of:
 *
 *     npm run start
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. npm run
 * ============================================================
 *
 * List available scripts:
 *
 *
 *     npm run
 *
 *
 * It reads the "scripts" section of package.json.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. npm version
 * ============================================================
 *
 * npm can update package versions.
 *
 *
 * Examples:
 *
 *     npm version patch
 *     npm version minor
 *     npm version major
 *
 *
 * Semantic versioning:
 *
 *     MAJOR.MINOR.PATCH
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. package.json is project metadata
 * ============================================================
 *
 *
 * Think of package.json as the project's identity card.
 *
 *
 * ┌─────────────────────────────────────────┐
 * │             package.json                │
 * ├─────────────────────────────────────────┤
 * │ name                                    │
 * │ version                                 │
 * │ description                             │
 * │ type                                    │
 * │ main                                    │
 * │ scripts                                 │
 * │ dependencies                            │
 * │ devDependencies                         │
 * │ engines                                 │
 * │ license                                 │
 * └─────────────────────────────────────────┘
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. package.json vs package-lock.json
 * ============================================================
 *
 *
 * package.json
 *     ↓
 * Project requirements
 *
 *
 * package-lock.json
 *     ↓
 * Exact resolved dependency tree
 *
 *
 * node_modules/
 *     ↓
 * Installed packages
 *
 *
 * Relationship:
 *
 *
 * package.json
 *      │
 *      ↓
 * npm install
 *      │
 *      ↓
 * package-lock.json
 *      │
 *      ↓
 * node_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Example production project
 * ============================================================
 *
 * A backend application might have:
 *
 *
 * {
 *   "name": "backend-api",
 *   "version": "1.0.0",
 *   "type": "module",
 *   "scripts": {
 *     "start": "node src/server.js",
 *     "dev": "node --watch src/server.js",
 *     "test": "node --test"
 *   },
 *   "dependencies": {
 *     "express": "...",
 *     "mongoose": "...",
 *     "jsonwebtoken": "..."
 *   },
 *   "devDependencies": {
 *     "eslint": "...",
 *     "prettier": "..."
 *   }
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Important distinction
 * ============================================================
 *
 *
 * dependency
 *     ↓
 * Needed by the application at runtime.
 *
 *
 * devDependency
 *     ↓
 * Primarily needed to develop, test, lint, format, or build
 * the application.
 *
 *
 * Example:
 *
 *     Express
 *         → dependency
 *
 *     ESLint
 *         → devDependency
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. npm ecosystem
 * ============================================================
 *
 *
 * Your application
 *       │
 *       ↓
 *     npm
 *       │
 *       ↓
 * npm registry
 *       │
 *       ↓
 * packages
 *
 *
 * npm is both:
 *
 *     - A package manager
 *     - A package ecosystem/registry
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Security
 * ============================================================
 *
 * Dependencies are third-party code.
 *
 * Therefore dependency security matters.
 *
 *
 * Useful command:
 *
 *
 *     npm audit
 *
 *
 * It checks installed dependency information against known
 * security advisories.
 *
 *
 * Another useful command:
 *
 *
 *     npm audit fix
 *
 *
 * However, do not blindly apply dependency changes in a
 * production system without reviewing the resulting changes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. npm cache
 * ============================================================
 *
 * npm maintains a cache to improve package operations.
 *
 *
 * Inspect:
 *
 *
 *     npm cache verify
 *
 *
 * Normally you should not delete the npm cache unless there is
 * a specific reason.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. npm config
 * ============================================================
 *
 * npm has configuration settings.
 *
 *
 * View configuration:
 *
 *
 *     npm config list
 *
 *
 * Get a specific configuration:
 *
 *
 *     npm config get registry
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Registry
 * ============================================================
 *
 * npm normally uses the npm registry to resolve packages.
 *
 *
 * Conceptually:
 *
 *
 *     npm install express
 *             │
 *             ↓
 *        npm registry
 *             │
 *             ↓
 *         Express
 *             │
 *             ↓
 *       node_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Workspaces
 * ============================================================
 *
 * npm supports monorepos using workspaces.
 *
 *
 * Example:
 *
 *
 * {
 *   "workspaces": [
 *     "packages/*"
 *   ]
 * }
 *
 *
 * This becomes useful when one repository contains multiple
 * related packages/applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. package.json fields to remember
 * ============================================================
 *
 * Most important:
 *
 *     name
 *     version
 *     description
 *     type
 *     main
 *     scripts
 *     dependencies
 *     devDependencies
 *     engines
 *     private
 *     license
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * Create package.json:
 *
 *     npm init
 *
 *
 * Create with defaults:
 *
 *     npm init -y
 *
 *
 * Install dependency:
 *
 *     npm install express
 *
 *
 * Install development dependency:
 *
 *     npm install --save-dev eslint
 *
 *
 * Short form:
 *
 *     npm i -D eslint
 *
 *
 * Remove:
 *
 *     npm uninstall express
 *
 *
 * Install from package.json:
 *
 *     npm install
 *
 *
 * Update:
 *
 *     npm update
 *
 *
 * Check outdated packages:
 *
 *     npm outdated
 *
 *
 * Check vulnerabilities:
 *
 *     npm audit
 *
 *
 * List dependencies:
 *
 *     npm list
 *
 *
 * Run custom script:
 *
 *     npm run dev
 *
 *
 * Start:
 *
 *     npm start
 *
 *
 * Test:
 *
 *     npm test
 *
 *
 * ============================================================
 *
 * CORE IDEA:
 *
 *     package.json
 *          ↓
 *     Defines project metadata,
 *     scripts and dependency requirements.
 *
 *
 *     package-lock.json
 *          ↓
 *     Records resolved dependency versions/tree.
 *
 *
 *     node_modules
 *          ↓
 *     Contains installed packages.
 *
 * ============================================================
 */

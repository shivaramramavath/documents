/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 06_npm_basics.js
 *
 * Topic:
 * npm Basics
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. What is npm?
 * ============================================================
 *
 * npm stands for:
 *
 *     Node Package Manager
 *
 * npm is the default package manager commonly used with
 * Node.js.
 *
 * It is used to:
 *
 *     - Install packages
 *     - Remove packages
 *     - Update packages
 *     - Manage project dependencies
 *     - Run project scripts
 *     - Publish packages
 *
 *
 * Example:
 *
 *     npm install express
 *
 * This installs the Express package into a Node.js project.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Node.js vs npm
 * ============================================================
 *
 * Node.js:
 *
 *     Runtime environment
 *     Executes JavaScript
 *
 *
 * npm:
 *
 *     Package manager
 *     Manages JavaScript/Node.js packages
 *
 *
 * Think:
 *
 *     Node.js
 *        ↓
 *     Runs JavaScript
 *
 *     npm
 *        ↓
 *     Installs and manages packages
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Check Node.js and npm versions
 * ============================================================
 *
 * From the terminal:
 *
 *     node --version
 *
 *     npm --version
 *
 *
 * Example:
 *
 *     node --version
 *     vXX.X.X
 *
 *     npm --version
 *     XX.X.X
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. What is a package?
 * ============================================================
 *
 * A package is reusable JavaScript/Node.js code distributed
 * through a package registry such as npm.
 *
 * Examples of popular packages:
 *
 *     express
 *     mongoose
 *     bcryptjs
 *     jsonwebtoken
 *     zod
 *     redis
 *     socket.io
 *     pino
 *
 *
 * Instead of implementing everything ourselves, we can
 * install and use existing packages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Installing a package
 * ============================================================
 *
 * Example:
 *
 *     npm install express
 *
 *
 * Short version:
 *
 *     npm i express
 *
 *
 * npm will generally:
 *
 *     1. Download the package
 *     2. Put it in node_modules
 *     3. Add it to package.json
 *     4. Update package-lock.json
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. node_modules
 * ============================================================
 *
 * When packages are installed, npm creates:
 *
 *     node_modules/
 *
 *
 * Example:
 *
 *     node_modules/
 *     ├── express/
 *     ├── body-parser/
 *     ├── ...
 *
 *
 * A package can have its own dependencies.
 *
 * Therefore node_modules can contain many packages.
 *
 *
 * IMPORTANT:
 *
 * Do NOT normally commit node_modules to Git.
 *
 * Add it to .gitignore:
 *
 *     node_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. package.json
 * ============================================================
 *
 * `package.json` describes a Node.js project.
 *
 * It can contain:
 *
 *     - Project name
 *     - Version
 *     - Description
 *     - Entry point
 *     - Scripts
 *     - Dependencies
 *     - Development dependencies
 *     - Project metadata
 *
 *
 * Example:
 *
 *     {
 *       "name": "nodejs-mastery",
 *       "version": "1.0.0",
 *       "description": "Learning Node.js",
 *       "main": "index.js",
 *       "scripts": {},
 *       "dependencies": {}
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Creating package.json
 * ============================================================
 *
 * Create a package.json interactively:
 *
 *     npm init
 *
 *
 * Create it with default values:
 *
 *     npm init -y
 *
 *
 * In our repository, we already used:
 *
 *     npm init -y
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. dependencies
 * ============================================================
 *
 * Production dependencies are packages required by the
 * application at runtime.
 *
 * Example:
 *
 *     npm install express
 *
 *
 * package.json:
 *
 *     "dependencies": {
 *       "express": "^5.x.x"
 *     }
 *
 *
 * Examples of packages that could be production dependencies:
 *
 *     express
 *     mongoose
 *     redis
 *     jsonwebtoken
 *     bcryptjs
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. devDependencies
 * ============================================================
 *
 * Development dependencies are packages primarily needed
 * while developing or testing the application.
 *
 * Example:
 *
 *     npm install --save-dev nodemon
 *
 * Short form:
 *
 *     npm i -D nodemon
 *
 *
 * package.json:
 *
 *     "devDependencies": {
 *       "nodemon": "..."
 *     }
 *
 *
 * Examples:
 *
 *     nodemon
 *     eslint
 *     prettier
 *     test frameworks
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. npm install
 * ============================================================
 *
 * Install a package:
 *
 *     npm install package-name
 *
 *
 * Example:
 *
 *     npm install express
 *
 *
 * Multiple packages:
 *
 *     npm install express mongoose dotenv
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. npm uninstall
 * ============================================================
 *
 * Remove a package:
 *
 *     npm uninstall express
 *
 * Short form:
 *
 *     npm remove express
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. npm update
 * ============================================================
 *
 * Update installed packages according to the version
 * constraints in package.json:
 *
 *     npm update
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. package-lock.json
 * ============================================================
 *
 * npm usually creates:
 *
 *     package-lock.json
 *
 *
 * It records the exact dependency tree resolved for the
 * project, including package versions and dependency
 * relationships.
 *
 *
 * This helps make installations more reproducible.
 *
 *
 * Normally:
 *
 *     package.json
 *         ↓
 *     Declares dependency requirements
 *
 *     package-lock.json
 *         ↓
 *     Records resolved dependency versions/tree
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. package.json vs package-lock.json
 * ============================================================
 *
 * package.json:
 *
 *     "What packages does my project need?"
 *
 *
 * package-lock.json:
 *
 *     "What exact dependency tree was resolved?"
 *
 *
 * Normally both should be committed to Git for an
 * application project.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. npm scripts
 * ============================================================
 *
 * package.json can contain scripts.
 *
 * Example:
 *
 *     "scripts": {
 *       "start": "node server.js",
 *       "dev": "node --watch server.js"
 *     }
 *
 *
 * Run:
 *
 *     npm start
 *
 *
 * Run:
 *
 *     npm run dev
 *
 *
 * Scripts are extremely useful for standardizing project
 * commands.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. npm run
 * ============================================================
 *
 * For a custom script:
 *
 *     npm run <script-name>
 *
 *
 * Example:
 *
 *     npm run dev
 *
 *
 * Special case:
 *
 *     npm start
 *
 * can run the `start` script without explicitly writing
 * `npm run start`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. npx
 * ============================================================
 *
 * `npx` is commonly used to execute packages/tools.
 *
 * Example:
 *
 *     npx nodemon server.js
 *
 *
 * Another common example:
 *
 *     npx eslint .
 *
 *
 * `npx` is useful when you want to execute a package
 * without manually managing a global installation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Global packages
 * ============================================================
 *
 * npm also supports global installation:
 *
 *     npm install -g package-name
 *
 *
 * However, application dependencies should generally be
 * installed locally in the project.
 *
 *
 * Local:
 *
 *     npm install express
 *
 *
 * Global:
 *
 *     npm install -g some-cli
 *
 *
 * Global packages are mainly useful for command-line tools
 * that you want available system-wide.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Semantic Versioning
 * ============================================================
 *
 * npm packages commonly use Semantic Versioning (SemVer).
 *
 * Format:
 *
 *     MAJOR.MINOR.PATCH
 *
 *
 * Example:
 *
 *     5.2.1
 *
 *
 * MAJOR:
 *     Breaking changes
 *
 * MINOR:
 *     New backward-compatible features
 *
 * PATCH:
 *     Backward-compatible bug fixes
 *
 *
 * Example:
 *
 *     5.2.1
 *     │ │ │
 *     │ │ └── PATCH
 *     │ └──── MINOR
 *     └────── MAJOR
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Version ranges
 * ============================================================
 *
 * package.json often contains:
 *
 *     "express": "^5.0.0"
 *
 *
 * Common symbols:
 *
 *     ^
 *     ~
 *     >
 *     >=
 *     <
 *     <=
 *
 *
 * Their exact behavior depends on SemVer rules.
 *
 * We will study SemVer in more detail later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Local package installation
 * ============================================================
 *
 * Suppose we install:
 *
 *     npm install lodash
 *
 *
 * npm creates:
 *
 *     node_modules/
 *         lodash/
 *
 *
 * We can then import/require it from our application.
 *
 *
 * CommonJS:
 *
 *     const lodash = require("lodash");
 *
 *
 * ES Modules:
 *
 *     import lodash from "lodash";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. npm cache
 * ============================================================
 *
 * npm maintains a local cache to improve package operations.
 *
 * You can inspect it using:
 *
 *     npm cache
 *
 *
 * For example:
 *
 *     npm cache verify
 *
 *
 * Normally, you should not manually delete npm's cache
 * unless there is a specific reason.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Useful npm commands
 * ============================================================
 *
 * Check npm version:
 *
 *     npm --version
 *
 *
 * Initialize project:
 *
 *     npm init
 *
 *
 * Initialize with defaults:
 *
 *     npm init -y
 *
 *
 * Install package:
 *
 *     npm install express
 *
 *
 * Install development dependency:
 *
 *     npm install --save-dev nodemon
 *
 *
 * Remove package:
 *
 *     npm uninstall express
 *
 *
 * List installed packages:
 *
 *     npm list
 *
 *
 * List top-level packages:
 *
 *     npm list --depth=0
 *
 *
 * Check outdated packages:
 *
 *     npm outdated
 *
 *
 * Update packages:
 *
 *     npm update
 *
 *
 * Run script:
 *
 *     npm run dev
 *
 *
 * Execute package:
 *
 *     npx package-name
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. npm project structure
 * ============================================================
 *
 * After installing packages, a typical Node.js project
 * looks like:
 *
 *
 *     my-project/
 *     │
 *     ├── node_modules/
 *     │
 *     ├── package.json
 *     │
 *     ├── package-lock.json
 *     │
 *     ├── src/
 *     │
 *     └── .gitignore
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. What should NOT be committed?
 * ============================================================
 *
 * Usually:
 *
 *     node_modules/
 *
 * should NOT be committed.
 *
 *
 * Instead, commit:
 *
 *     package.json
 *     package-lock.json
 *
 *
 * Then another developer can run:
 *
 *     npm install
 *
 * to recreate node_modules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. npm install in an existing project
 * ============================================================
 *
 * Suppose you clone a Node.js project:
 *
 *     git clone <repository>
 *
 *
 * The repository normally does not contain node_modules.
 *
 * Run:
 *
 *     npm install
 *
 *
 * npm reads:
 *
 *     package.json
 *     package-lock.json
 *
 *
 * and installs the required dependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. npm ci
 * ============================================================
 *
 * `npm ci` is commonly used in CI/CD environments.
 *
 * Example:
 *
 *     npm ci
 *
 *
 * It performs a clean installation based on the lock file.
 *
 * This is especially useful for:
 *
 *     - Continuous Integration
 *     - Automated builds
 *     - Production deployment
 *
 * We will study this more when we reach CI/CD.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Our Node.js Mastery project
 * ============================================================
 *
 * Our repository currently has:
 *
 *     nodejs-mastery/
 *     │
 *     ├── package.json
 *     ├── package-lock.json
 *     ├── .gitignore
 *     └── 00_node_basics/
 *
 *
 * As we progress, we will install packages such as:
 *
 *     express
 *     mongoose
 *     bcryptjs
 *     jsonwebtoken
 *     dotenv
 *     zod
 *     redis
 *     socket.io
 *     pino
 *     bullmq
 *
 *
 * We will understand why and when each package is used.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Important principle
 * ============================================================
 *
 * Don't install a package just because it exists.
 *
 * First understand:
 *
 *     1. What problem does it solve?
 *     2. Do we actually need it?
 *     3. Is there already a Node.js built-in API?
 *     4. Is the package maintained?
 *     5. Is it secure?
 *     6. Is the package appropriate for production?
 *
 *
 * Example:
 *
 * For cryptography, Node.js already provides:
 *
 *     crypto
 *
 * Therefore, you should understand the built-in module
 * before automatically reaching for another package.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Key Takeaways
 * ============================================================
 *
 * 1. npm = Node Package Manager.
 *
 * 2. Node.js runs JavaScript; npm manages packages.
 *
 * 3. `package.json` describes the project and its dependencies.
 *
 * 4. `node_modules` contains installed packages.
 *
 * 5. `package-lock.json` records the resolved dependency tree.
 *
 * 6. `dependencies` are packages required by the application.
 *
 * 7. `devDependencies` are primarily development-time tools.
 *
 * 8. `npm install` installs packages.
 *
 * 9. `npm uninstall` removes packages.
 *
 * 10. `npm update` updates packages according to package.json.
 *
 * 11. `npm run <script>` executes a package.json script.
 *
 * 12. `npx` executes packages/tools.
 *
 * 13. `npm ci` is useful for clean, reproducible installs,
 *     especially in CI/CD.
 *
 * 14. Normally, `node_modules` should not be committed to Git.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Useful commands to practice
 * ============================================================
 *
 * Check versions:
 *
 *     node -v
 *     npm -v
 *
 *
 * Initialize:
 *
 *     npm init -y
 *
 *
 * Install:
 *
 *     npm install express
 *
 *
 * Install development dependency:
 *
 *     npm install -D nodemon
 *
 *
 * List packages:
 *
 *     npm list --depth=0
 *
 *
 * Check outdated packages:
 *
 *     npm outdated
 *
 *
 * Remove:
 *
 *     npm uninstall express
 *
 *
 * Run a script:
 *
 *     npm run dev
 *
 *
 * Execute a package:
 *
 *     npx <package>
 *
 * ============================================================
 */

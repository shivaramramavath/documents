/**
 * ============================================================
 * NODE.JS MASTERY - NPM DEPENDENCIES
 * ============================================================
 *
 * File:
 *     15_npm/dependencies.js
 *
 * ============================================================
 *
 * WHAT IS A DEPENDENCY?
 * ============================================================
 *
 * A dependency is an external package that your application
 * needs in order to run.
 *
 *
 * Example:
 *
 *     Your application
 *           │
 *           ├── Express
 *           ├── Mongoose
 *           └── JSON Web Token
 *
 *
 * These packages become runtime dependencies.
 *
 * ============================================================
 *
 * INSTALL A DEPENDENCY
 * ============================================================
 *
 *     npm install express
 *
 *
 * Short form:
 *
 *     npm i express
 *
 *
 * npm normally:
 *
 *     1. Downloads the package
 *     2. Places it in node_modules/
 *     3. Adds it to package.json
 *     4. Updates package-lock.json
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Example dependency
 * ============================================================
 *
 * Suppose we run:
 *
 *     npm install express
 *
 *
 * package.json becomes similar to:
 *
 *     "dependencies": {
 *       "express": "^5.x.x"
 *     }
 *
 * The exact version depends on what npm resolves when you
 * install it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. dependencies section
 * ============================================================
 *
 * package.json:
 *
 *     {
 *       "dependencies": {
 *         "express": "^5.0.0"
 *       }
 *     }
 *
 *
 * "dependencies" is an object where:
 *
 *     key   = package name
 *     value = requested version/range
 *
 * ============================================================
 */

const dependencies = {
  express: "^5.0.0",

  mongoose: "^8.0.0",

  jsonwebtoken: "^9.0.0",
};

console.log("Runtime dependencies:");

console.log(dependencies);

/*
 * ============================================================
 * 3. Dependency name
 * ============================================================
 *
 * Example:
 *
 *     "express": "^5.0.0"
 *
 *
 * "express"
 *     ↓
 * Package name
 *
 *
 * "^5.0.0"
 *     ↓
 * Version range
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. node_modules
 * ============================================================
 *
 * When npm installs a dependency:
 *
 *
 *     npm install express
 *
 *
 * npm creates/updates:
 *
 *
 *     node_modules/
 *     └── express/
 *
 *
 * Express may itself depend on other packages.
 *
 * Those dependencies are also installed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Dependency tree
 * ============================================================
 *
 *
 * Your application
 *        │
 *        ↓
 *     express
 *        │
 *        ├── dependency A
 *        ├── dependency B
 *        └── dependency C
 *
 *
 * Therefore, installing one package can install many packages.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Direct dependency
 * ============================================================
 *
 * A package that your application explicitly declares.
 *
 *
 * Example:
 *
 *     npm install express
 *
 *
 * package.json:
 *
 *     "dependencies": {
 *       "express": "^5.0.0"
 *     }
 *
 *
 * Express is a direct dependency.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Transitive dependency
 * ============================================================
 *
 * A package required by one of your dependencies.
 *
 *
 * Example:
 *
 *
 * Your application
 *       │
 *       ↓
 *    Express
 *       │
 *       ↓
 *  another-package
 *
 *
 * another-package is a transitive dependency of your
 * application.
 *
 * You did not necessarily install it directly.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. npm install package
 * ============================================================
 *
 * Command:
 *
 *     npm install express
 *
 *
 * This is equivalent to:
 *
 *     npm i express
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Install a specific version
 * ============================================================
 *
 * Example:
 *
 *     npm install express@5.1.0
 *
 *
 * This requests a specific version.
 *
 *
 * package.json may contain:
 *
 *     "express": "^5.1.0"
 *
 * depending on npm's default save/version behavior.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Install latest
 * ============================================================
 *
 * Example:
 *
 *     npm install express@latest
 *
 *
 * This asks npm for the package's latest published version
 * according to the registry/tag.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Install an older version
 * ============================================================
 *
 * Example:
 *
 *     npm install express@4
 *
 *
 * This requests a compatible release from major version 4.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Version range
 * ============================================================
 *
 * npm supports semantic-version ranges.
 *
 *
 * Example:
 *
 *     "^5.1.0"
 *
 *
 * This generally allows compatible updates within the major
 * version according to semver rules.
 *
 *
 * Another example:
 *
 *     "~5.1.0"
 *
 *
 * This generally allows patch-level updates within the same
 * minor version.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Exact version
 * ============================================================
 *
 * Example:
 *
 *     "express": "5.1.0"
 *
 *
 * This specifies exactly version 5.1.0 in package.json.
 *
 *
 * Compare:
 *
 *
 *     "^5.1.0"
 *         ↓
 *     version range
 *
 *
 *     "5.1.0"
 *         ↓
 *     exact version
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Caret ^
 * ============================================================
 *
 * Example:
 *
 *     "^5.1.0"
 *
 *
 * The caret allows compatible updates according to npm's
 * semver rules.
 *
 * For a normal major version such as 5:
 *
 *
 *     >= 5.1.0
 *     < 6.0.0
 *
 *
 * Conceptually:
 *
 *
 *     5.1.0
 *       │
 *       ├── 5.1.x
 *       ├── 5.2.x
 *       ├── 5.9.x
 *       └── 5.x.x
 *
 *     but not:
 *
 *     6.x.x
 *
 *
 * The precise behavior of caret ranges depends on the
 * starting version, especially for 0.x releases.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Tilde ~
 * ============================================================
 *
 * Example:
 *
 *     "~5.1.0"
 *
 *
 * This generally allows patch-level updates:
 *
 *
 *     5.1.0
 *     5.1.1
 *     5.1.2
 *     ...
 *
 *
 * but normally not:
 *
 *     5.2.0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Wildcard
 * ============================================================
 *
 * Examples:
 *
 *     "5.x"
 *     "5.1.x"
 *
 *
 * These represent version ranges.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Dependency installation flow
 * ============================================================
 *
 *
 * npm install express
 *         │
 *         ↓
 * npm registry
 *         │
 *         ↓
 * Resolve package version
 *         │
 *         ↓
 * Resolve dependency tree
 *         │
 *         ↓
 * Install packages
 *         │
 *         ├──→ node_modules/
 *         │
 *         ├──→ package.json
 *         │
 *         └──→ package-lock.json
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. package-lock.json
 * ============================================================
 *
 * package-lock.json records the resolved dependency tree.
 *
 *
 * Example conceptually:
 *
 *
 * package.json
 *     │
 *     │ version range
 *     ↓
 * package-lock.json
 *     │
 *     │ resolved version
 *     ↓
 * node_modules
 *
 *
 * This helps installations remain reproducible.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. npm install from package.json
 * ============================================================
 *
 * When you clone a Node.js project:
 *
 *
 *     git clone <repository>
 *
 *
 * You normally receive:
 *
 *     package.json
 *     package-lock.json
 *
 *
 * but not:
 *
 *     node_modules/
 *
 *
 * Then run:
 *
 *
 *     npm install
 *
 *
 * npm reconstructs the dependency tree.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Do not commit node_modules
 * ============================================================
 *
 * node_modules can contain thousands of files.
 *
 * Normally add:
 *
 *
 *     node_modules/
 *
 *
 * to .gitignore.
 *
 *
 * Commit:
 *
 *     package.json
 *     package-lock.json
 *
 *
 * Do not normally commit:
 *
 *     node_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. npm ci
 * ============================================================
 *
 * npm ci is designed for clean, reproducible installs,
 * especially in CI/CD environments.
 *
 *
 * Command:
 *
 *     npm ci
 *
 *
 * It uses package-lock.json to install the dependency tree.
 *
 *
 * Typical CI flow:
 *
 *
 *     git clone
 *         ↓
 *     npm ci
 *         ↓
 *     npm test
 *         ↓
 *     npm run build
 *         ↓
 *     deploy
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. npm install vs npm ci
 * ============================================================
 *
 *
 * npm install
 * ─────────────────────────────────────────
 * General development installation
 * Can update the lockfile when necessary
 *
 *
 * npm ci
 * ─────────────────────────────────────────
 * Clean/reproducible installation
 * Requires a suitable lockfile
 * Commonly used in CI/CD
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Remove dependency
 * ============================================================
 *
 * Command:
 *
 *     npm uninstall express
 *
 *
 * This removes the dependency from the project and updates
 * package metadata/lockfile as appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Check installed dependencies
 * ============================================================
 *
 * Command:
 *
 *     npm list
 *
 *
 * Example concept:
 *
 *
 * nodejs-mastery
 * ├── express
 * ├── mongoose
 * └── jsonwebtoken
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Production dependencies only
 * ============================================================
 *
 * Modern npm:
 *
 *
 *     npm list --omit=dev
 *
 *
 * This focuses on production dependencies while omitting
 * development dependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Check outdated dependencies
 * ============================================================
 *
 * Command:
 *
 *     npm outdated
 *
 *
 * npm can show:
 *
 *
 *     Package
 *     Current
 *     Wanted
 *     Latest
 *
 *
 * Example:
 *
 *
 *     Package    Current    Wanted    Latest
 *     express    5.0.0      5.1.0     5.1.0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Update dependencies
 * ============================================================
 *
 * Command:
 *
 *     npm update
 *
 *
 * npm updates packages within the ranges allowed by your
 * package.json.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Security audit
 * ============================================================
 *
 * Command:
 *
 *     npm audit
 *
 *
 * This checks dependency information against known security
 * advisories.
 *
 *
 * You may also see:
 *
 *
 *     npm audit fix
 *
 *
 * Review changes before accepting them in production.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Dependency vulnerability
 * ============================================================
 *
 * Your application:
 *
 *     ↓
 * Dependency A
 *     ↓
 * Dependency B
 *     ↓
 * Vulnerable package
 *
 *
 * Even if you did not directly install the vulnerable package,
 * it can still affect your application through the dependency
 * tree.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Dependency tree
 * ============================================================
 *
 * npm can display dependency relationships.
 *
 *
 * Conceptually:
 *
 *
 * Application
 * │
 * ├── express
 * │   ├── package-a
 * │   └── package-b
 * │
 * └── mongoose
 *     ├── package-c
 *     └── package-d
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Nested dependencies
 * ============================================================
 *
 * Different packages can require different versions of the
 * same dependency.
 *
 *
 * Example:
 *
 *
 * Application
 * │
 * ├── package-a
 * │     └── utility@1.x
 * │
 * └── package-b
 *       └── utility@2.x
 *
 *
 * npm's dependency resolution can accommodate compatible or
 * conflicting version requirements using the dependency tree.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Dependency hoisting
 * ============================================================
 *
 * npm may place compatible dependencies higher in the
 * node_modules tree when possible.
 *
 *
 * Conceptually:
 *
 *
 * node_modules/
 * ├── express/
 * ├── utility/
 * └── package-a/
 *
 *
 * This reduces unnecessary duplication when dependency
 * versions can be shared.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Local dependency
 * ============================================================
 *
 * npm can also reference a local package.
 *
 *
 * Example package.json:
 *
 *
 *     "dependencies": {
 *       "my-library": "file:../my-library"
 *     }
 *
 *
 * This is useful during local development or monorepo-like
 * workflows.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Git dependency
 * ============================================================
 *
 * npm can also install packages from Git repositories.
 *
 *
 * Conceptually:
 *
 *
 *     npm install git+https://...
 *
 *
 * This should be used deliberately because Git dependencies
 * behave differently from normal registry releases.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Scoped packages
 * ============================================================
 *
 * npm supports scoped package names.
 *
 *
 * Example:
 *
 *
 *     @scope/package
 *
 *
 * Example installation:
 *
 *
 *     npm install @types/node
 *
 *
 * Here:
 *
 *     @types
 *         ↓
 * scope
 *
 *     node
 *         ↓
 * package
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Optional dependencies
 * ============================================================
 *
 * npm also supports:
 *
 *
 *     optionalDependencies
 *
 *
 * These dependencies can be optional for the package/application
 * depending on the use case.
 *
 * They are different from normal dependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Peer dependencies
 * ============================================================
 *
 * Packages can declare:
 *
 *
 *     peerDependencies
 *
 *
 * This tells consumers that the package expects another package
 * to be provided by the consuming project.
 *
 *
 * This is particularly common for libraries and plugins.
 *
 *
 * Example concept:
 *
 *
 *     my-react-plugin
 *          │
 *          └── expects React
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Dependency types
 * ============================================================
 *
 *
 * dependencies
 *     ↓
 * Runtime requirements
 *
 *
 * devDependencies
 *     ↓
 * Development/build/test requirements
 *
 *
 * peerDependencies
 *     ↓
 * Compatibility requirements supplied by the consumer
 *
 *
 * optionalDependencies
 *     ↓
 * Optional dependency requirements
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Why dependencies matter in backend development
 * ============================================================
 *
 * A production Node.js backend may depend on:
 *
 *
 *     Express
 *     MongoDB driver
 *     Mongoose
 *     Redis client
 *     JWT library
 *     Validation library
 *     Logging library
 *
 *
 * Example:
 *
 *
 * Application
 * │
 * ├── HTTP framework
 * ├── Database driver
 * ├── Cache client
 * ├── Authentication
 * ├── Validation
 * └── Logging
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Keep dependencies minimal
 * ============================================================
 *
 * More dependencies mean:
 *
 *     - More code
 *     - More updates
 *     - More vulnerabilities to monitor
 *     - More transitive dependencies
 *     - More maintenance
 *
 *
 * Therefore:
 *
 *
 *     Use a dependency when it provides meaningful value.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Pinning versions
 * ============================================================
 *
 * You may choose:
 *
 *
 *     "express": "5.1.0"
 *
 *
 * rather than:
 *
 *
 *     "express": "^5.1.0"
 *
 *
 * Exact versions provide tighter control, while version ranges
 * allow compatible updates.
 *
 *
 * Your project strategy should determine which approach is
 * appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Lockfile is important
 * ============================================================
 *
 * Even when package.json uses:
 *
 *
 *     "^5.1.0"
 *
 *
 * package-lock.json can record the concrete version resolved
 * for the installation.
 *
 *
 * Therefore:
 *
 *
 * package.json
 *     = allowed/requested range
 *
 *
 * package-lock.json
 *     = resolved dependency tree
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Fresh machine example
 * ============================================================
 *
 *
 * Developer A:
 *
 *     npm install express
 *
 *
 *     package.json
 *     package-lock.json
 *
 *
 * Push to GitHub.
 *
 *
 * Developer B:
 *
 *     git clone ...
 *     npm ci
 *
 *
 * Developer B receives a dependency tree based on the lockfile.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Production installation
 * ============================================================
 *
 * Production environments often omit development dependencies.
 *
 *
 * Modern npm:
 *
 *
 *     npm ci --omit=dev
 *
 *
 * This is useful when the deployed application only needs its
 * runtime dependencies.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. Environment variable vs dependency
 * ============================================================
 *
 * Do not confuse:
 *
 *
 * DEPENDENCY
 *     ↓
 * External package required by code.
 *
 *
 * ENVIRONMENT VARIABLE
 *     ↓
 * Runtime configuration/secret/value.
 *
 *
 * Example:
 *
 *
 * express
 *     → dependency
 *
 *
 * DATABASE_URL
 *     → environment variable
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. Dependency lifecycle
 * ============================================================
 *
 *
 * Choose package
 *       ↓
 * npm install
 *       ↓
 * package.json
 *       ↓
 * package-lock.json
 *       ↓
 * node_modules
 *       ↓
 * Application runs
 *       ↓
 * npm outdated
 *       ↓
 * Update/test
 *       ↓
 * npm audit
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. Useful commands
 * ============================================================
 *
 *
 * Install:
 *
 *     npm install express
 *
 *
 * Short:
 *
 *     npm i express
 *
 *
 * Specific version:
 *
 *     npm install express@5.1.0
 *
 *
 * Latest:
 *
 *     npm install express@latest
 *
 *
 * Remove:
 *
 *     npm uninstall express
 *
 *
 * Install project dependencies:
 *
 *     npm install
 *
 *
 * Clean reproducible install:
 *
 *     npm ci
 *
 *
 * List:
 *
 *     npm list
 *
 *
 * Outdated:
 *
 *     npm outdated
 *
 *
 * Update:
 *
 *     npm update
 *
 *
 * Security:
 *
 *     npm audit
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                    package.json
 *                         │
 *                         │
 *                 dependencies
 *                         │
 *                         ↓
 *                    npm install
 *                         │
 *                         ↓
 *                 package-lock.json
 *                         │
 *                         ↓
 *                    node_modules
 *                         │
 *                         ↓
 *                   Application
 *
 *
 * ============================================================
 *
 * REMEMBER:
 *
 *     dependencies
 *         =
 *     packages required at runtime.
 *
 *
 *     node_modules
 *         =
 *     installed package files.
 *
 *
 *     package-lock.json
 *         =
 *     resolved dependency tree.
 *
 *
 *     npm install
 *         =
 *     install/manage dependencies.
 *
 *
 *     npm ci
 *         =
 *     clean, lockfile-based installation.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     dev_dependencies.js
 *
 * ============================================================
 */

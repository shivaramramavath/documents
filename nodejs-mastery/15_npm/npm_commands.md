# NPM Commands

## 1. What is npm?

`npm` is the standard package manager commonly used with Node.js.

It is used to:

- Install packages
- Remove packages
- Update packages
- Run project scripts
- Manage dependencies
- Manage package versions
- Publish packages
- Execute package binaries

Basic structure:

```text
Node.js project
      │
      ├── package.json
      ├── package-lock.json
      └── node_modules/
                │
                └── installed packages
```

---

## 2. Check Node.js version

```bash
node --version
```

or:

```bash
node -v
```

Example:

```text
v24.x.x
```

---

## 3. Check npm version

```bash
npm --version
```

or:

```bash
npm -v
```

---

# Project Initialization

## 4. Create package.json

```bash
npm init
```

npm asks several questions and creates:

```text
package.json
```

---

## 5. Initialize with defaults

```bash
npm init -y
```

This creates a package.json without asking interactive questions.

Example:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

---

# Installing Packages

## 6. Install a package

```bash
npm install express
```

Short form:

```bash
npm i express
```

This generally:

1. Downloads the package
2. Places it in `node_modules`
3. Adds it to `dependencies`
4. Updates `package-lock.json`

---

## 7. Install multiple packages

```bash
npm install express mongoose dotenv
```

---

## 8. Install a development dependency

```bash
npm install --save-dev eslint
```

Short form:

```bash
npm i -D eslint
```

This adds the package to:

```json
{
  "devDependencies": {
    "eslint": "..."
  }
}
```

Development dependencies are typically tools needed during development, testing, linting, formatting, or building.

---

## 9. Install a specific version

```bash
npm install express@5.1.0
```

This requests that specific package version.

---

## 10. Install the latest version

```bash
npm install express@latest
```

This uses the package's `latest` distribution tag.

---

## 11. Install a pre-release tag

```bash
npm install package-name@next
```

The exact tags available depend on the package.

---

# Removing Packages

## 12. Remove a package

```bash
npm uninstall express
```

Short form:

```bash
npm remove express
```

or:

```bash
npm rm express
```

npm removes the dependency from the project configuration and installation.

---

## 13. Remove a development dependency

```bash
npm uninstall eslint
```

The corresponding `devDependencies` entry is removed.

---

# Listing Packages

## 14. List installed packages

```bash
npm list
```

Short form:

```bash
npm ls
```

---

## 15. List top-level dependencies

```bash
npm list --depth=0
```

This is useful for seeing packages directly installed by your project.

Example:

```text
my-project
├── express
├── mongoose
└── dotenv
```

---

## 16. List global packages

```bash
npm list -g --depth=0
```

This shows globally installed npm packages.

---

# Updating Packages

## 17. Check outdated packages

```bash
npm outdated
```

This can show information such as:

```text
Package    Current    Wanted    Latest
```

Conceptually:

```text
Current
   ↓
currently installed

Wanted
   ↓
highest version allowed by package.json

Latest
   ↓
latest published version
```

---

## 18. Update dependencies

```bash
npm update
```

npm updates packages according to the version ranges specified by the project.

---

## 19. Update a specific package

```bash
npm update express
```

---

## 20. Install a newer explicit version

```bash
npm install express@latest
```

This is different from simply running:

```bash
npm update
```

because installing an explicit version can change the dependency specification in `package.json`.

---

# Package Information

## 21. View package information

```bash
npm view express
```

Short form:

```bash
npm info express
```

This retrieves package metadata from the npm registry.

---

## 22. View package version

```bash
npm view express version
```

---

## 23. View all published versions

```bash
npm view express versions
```

---

## 24. View package description

```bash
npm view express description
```

---

## 25. View package dependencies

```bash
npm view express dependencies
```

---

## 26. View package repository

```bash
npm view express repository
```

---

# Searching Packages

## 27. Search npm registry

```bash
npm search express
```

This searches packages in the npm registry.

---

# Running Scripts

## 28. Run a custom script

Given:

```json
{
  "scripts": {
    "dev": "node --watch server.js"
  }
}
```

Run:

```bash
npm run dev
```

General syntax:

```bash
npm run <script>
```

---

## 29. Run start

Given:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Run:

```bash
npm start
```

---

## 30. Run tests

Given:

```json
{
  "scripts": {
    "test": "node --test"
  }
}
```

Run:

```bash
npm test
```

---

## 31. List available scripts

```bash
npm run
```

This displays scripts defined in `package.json`.

---

# Executing Package Binaries

## 32. Run a local package executable

For example:

```bash
npm exec eslint .
```

Modern npm also supports:

```bash
npx eslint .
```

`npx` is commonly used to execute package binaries.

---

## 33. Execute a package command

Example:

```bash
npx prettier --write .
```

This can execute the project's locally installed Prettier binary.

---

# Dependencies

## 34. Production dependency

```bash
npm install express
```

Result:

```json
{
  "dependencies": {
    "express": "..."
  }
}
```

---

## 35. Development dependency

```bash
npm install -D eslint
```

Result:

```json
{
  "devDependencies": {
    "eslint": "..."
  }
}
```

---

## 36. Why separate dependencies?

Production dependencies are required by the application at runtime.

Example:

```text
express
mongoose
jsonwebtoken
```

Development dependencies are commonly tools used to develop or verify the application.

Example:

```text
eslint
prettier
typescript
test runners
```

---

# Installation Modes

## 37. Normal installation

```bash
npm install
```

or:

```bash
npm i
```

npm reads the project dependency configuration and installs the required packages.

---

## 38. Clean installation

```bash
npm ci
```

`npm ci` is designed for clean, reproducible installations, especially in CI/CD environments.

It uses the lockfile and expects the dependency metadata to be consistent.

Typical CI flow:

```text
Clone repository
      ↓
npm ci
      ↓
npm test
      ↓
npm run build
```

---

## 39. npm install vs npm ci

### npm install

```bash
npm install
```

Commonly used during development.

It can update the lockfile when dependency metadata changes.

### npm ci

```bash
npm ci
```

Designed for automated/clean installations.

Typical use:

```text
CI/CD
Docker builds
Automated testing
Production build pipelines
```

---

# Lockfile

## 40. package-lock.json

When npm installs dependencies, it creates or updates:

```text
package-lock.json
```

It records the resolved dependency tree.

Conceptually:

```text
package.json
     │
     │ version ranges
     ↓
package-lock.json
     │
     │ resolved dependency versions
     ↓
node_modules
```

---

## 41. Do not casually delete package-lock.json

For applications, committing the lockfile to source control is generally important for reproducible installations.

Example:

```text
Git repository
│
├── package.json
└── package-lock.json
```

---

# Global Packages

## 42. Install globally

```bash
npm install -g package-name
```

Global packages are available outside a specific project.

However, project-specific development tools are generally better installed locally.

---

## 43. Show global npm root

```bash
npm root -g
```

---

## 44. Show npm global prefix

```bash
npm prefix -g
```

---

# Cache

## 45. Check npm cache

```bash
npm cache verify
```

This verifies the npm cache.

---

# Package Configuration

## 46. View npm configuration

```bash
npm config list
```

---

## 47. View all npm configuration

```bash
npm config ls -l
```

---

## 48. Get a configuration value

```bash
npm config get registry
```

---

## 49. Set a configuration value

```bash
npm config set <key> <value>
```

Use configuration changes deliberately, especially in shared development environments.

---

# Registry

## 50. Check npm registry

```bash
npm config get registry
```

The default public npm registry is:

```text
https://registry.npmjs.org/
```

---

# Auditing Dependencies

## 51. Check for vulnerabilities

```bash
npm audit
```

npm analyzes installed dependency information for known security vulnerabilities.

---

## 52. Attempt automatic fixes

```bash
npm audit fix
```

This can update dependencies when npm determines that compatible fixes are available.

Do not blindly apply dependency changes in critical production systems without reviewing the resulting changes.

---

# Dependency Tree

## 53. Explain why a package exists

```bash
npm explain package-name
```

This can help determine why a package is present in the dependency tree.

Example:

```bash
npm explain debug
```

Useful when you see a transitive dependency and want to know which package brought it into the project.

---

# Package Metadata

## 54. Show current project information

```bash
npm pkg get name
```

---

## 55. Get package version

```bash
npm pkg get version
```

---

## 56. Get scripts

```bash
npm pkg get scripts
```

---

## 57. Set package metadata

Example:

```bash
npm pkg set version=1.2.0
```

This modifies `package.json`.

---

# Version Management

## 58. Increase patch version

```bash
npm version patch
```

Example:

```text
1.0.0
  ↓
1.0.1
```

---

## 59. Increase minor version

```bash
npm version minor
```

Example:

```text
1.0.1
  ↓
1.1.0
```

---

## 60. Increase major version

```bash
npm version major
```

Example:

```text
1.1.0
  ↓
2.0.0
```

---

# Publishing

## 61. Log in to npm

```bash
npm login
```

This authenticates your npm account.

---

## 62. Check current npm user

```bash
npm whoami
```

---

## 63. Publish a package

```bash
npm publish
```

Publishing requires the appropriate package metadata and npm account permissions.

---

## 64. Publish beta/prerelease versions

npm supports distribution tags for publishing different release channels.

Conceptually:

```text
latest
   ↓
stable users

next
   ↓
early adopters/testing
```

---

# Uninstalling Node Modules

## 65. Remove node_modules

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
```

On macOS/Linux:

```bash
rm -rf node_modules
```

Then reinstall:

```bash
npm install
```

For CI-style clean installation:

```bash
npm ci
```

---

# Common Project Workflow

## 66. Create a Node.js project

```bash
mkdir my-node-app
cd my-node-app

npm init -y
```

---

## 67. Install Express

```bash
npm install express
```

---

## 68. Install development tools

```bash
npm install -D eslint prettier
```

---

## 69. Run the application

```bash
npm start
```

or during development:

```bash
npm run dev
```

---

# Typical Backend Workflow

```text
npm init -y
      ↓
npm install express
      ↓
npm install mongoose dotenv
      ↓
npm install -D eslint prettier
      ↓
npm run dev
      ↓
npm test
      ↓
npm run build
      ↓
npm ci
      ↓
Production
```

---

# Important Commands Cheat Sheet

| Command                | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `npm init`             | Create package.json interactively         |
| `npm init -y`          | Create package.json with defaults         |
| `npm install`          | Install project dependencies              |
| `npm i`                | Short form of install                     |
| `npm install <pkg>`    | Install dependency                        |
| `npm install -D <pkg>` | Install dev dependency                    |
| `npm uninstall <pkg>`  | Remove dependency                         |
| `npm list`             | Show dependency tree                      |
| `npm list --depth=0`   | Show direct dependencies                  |
| `npm outdated`         | Find outdated packages                    |
| `npm update`           | Update dependencies within allowed ranges |
| `npm view <pkg>`       | View registry metadata                    |
| `npm search <pkg>`     | Search npm registry                       |
| `npm run`              | List project scripts                      |
| `npm run <script>`     | Execute custom script                     |
| `npm start`            | Run start script                          |
| `npm test`             | Run test script                           |
| `npm exec <cmd>`       | Execute package binary                    |
| `npx <cmd>`            | Execute package binary                    |
| `npm ci`               | Clean lockfile-based installation         |
| `npm audit`            | Check known vulnerabilities               |
| `npm audit fix`        | Attempt compatible security fixes         |
| `npm explain <pkg>`    | Explain dependency presence               |
| `npm cache verify`     | Verify npm cache                          |
| `npm config list`      | Show npm configuration                    |
| `npm whoami`           | Show authenticated npm user               |
| `npm login`            | Authenticate with npm                     |
| `npm publish`          | Publish package                           |
| `npm version patch`    | Increase patch                            |
| `npm version minor`    | Increase minor                            |
| `npm version major`    | Increase major                            |

---

# Most Important Commands to Remember

For everyday Node.js backend development, these are the core commands:

```bash
# Create project
npm init -y

# Install dependency
npm install express

# Install dev dependency
npm install -D eslint

# Install everything from package.json
npm install

# Clean/reproducible installation
npm ci

# Run development script
npm run dev

# Run application
npm start

# Run tests
npm test

# Check outdated packages
npm outdated

# Update dependencies
npm update

# Check vulnerabilities
npm audit

# Show installed packages
npm list --depth=0
```

---

# Final Mental Model

```text
                         NPM
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
    Packages           Scripts          Registry
        │                 │                 │
        ↓                 ↓                 ↓
 npm install          npm run          npm publish
 npm uninstall        npm start        npm view
 npm update           npm test         npm search
        │
        ↓
 package.json
        │
        ↓
 package-lock.json
        │
        ↓
 node_modules/
```

The most important distinction is:

```text
package.json
     ↓
What dependencies/ranges the project declares

package-lock.json
     ↓
What dependency versions were resolved

node_modules/
     ↓
What is physically installed
```

**Next → `16_environment/dotenv.js`**

# ESLint + Prettier Setup

A production-friendly ESLint + Prettier setup for a Node.js / TypeScript project using:

- Node.js
- TypeScript
- ES Modules
- npm
- ESLint flat config (`eslint.config.js`)
- Prettier
- Optional Husky + lint-staged

---

## 1. ESLint vs Prettier

### ESLint

ESLint checks code quality and possible bugs.

Examples:

```js
const user = undefined;

console.log(user.name);
```

ESLint can detect problems such as:

- unused variables
- undefined variables
- incorrect patterns
- unsafe code
- inconsistent TypeScript usage
- bad imports
- unnecessary code

### Prettier

Prettier formats code.

Example:

```js
const user={name:"Shiva",age:21}
```

becomes:

```js
const user = {
  name: "Shiva",
  age: 21,
};
```

### Recommended responsibility

```text
ESLint     → code quality / correctness
Prettier   → code formatting
TypeScript → type checking
```

Do not make ESLint responsible for all formatting rules.

---

# 2. Install

For a TypeScript project:

```bash
npm install -D eslint @eslint/js typescript typescript-eslint prettier eslint-config-prettier globals
```

If using Node.js globals:

```bash
npm install -D globals
```

If using React, install the React ESLint packages separately:

```bash
npm install -D eslint-plugin-react-hooks eslint-plugin-react-refresh
```

---

# 3. Recommended Project Structure

```text
project/
├── src/
│   ├── app/
│   ├── config/
│   ├── modules/
│   ├── middleware/
│   ├── infrastructure/
│   ├── shared/
│   └── server.ts
│
├── eslint.config.js
├── prettier.config.js
├── .prettierignore
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```

For a larger project:

```text
src/
├── app/
│   ├── app.ts
│   ├── router.ts
│   └── providers/
│
├── config/
│
├── modules/
│   ├── auth/
│   ├── users/
│   └── timetable/
│
├── middleware/
│
├── infrastructure/
│   ├── database/
│   ├── cache/
│   ├── queue/
│   ├── mail/
│   └── observability/
│
├── shared/
│   ├── errors/
│   ├── types/
│   ├── utils/
│   └── constants/
│
└── server.ts
```

---

# 4. ESLint Flat Config

Modern ESLint uses the flat configuration system.

Create:

```text
eslint.config.js
```

Because the project uses ES Modules:

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".next/**",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    rules: {
      "no-console": "off",

      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
    },
  },

  eslintConfigPrettier,
);
```

---

# 5. Why `eslint-config-prettier`?

ESLint and Prettier can sometimes have conflicting formatting rules.

`eslint-config-prettier` disables ESLint rules that conflict with Prettier.

Architecture:

```text
ESLint
  │
  ├── correctness
  ├── code quality
  └── TypeScript rules
        │
        ▼
eslint-config-prettier
        │
        └── disables formatting conflicts
                │
                ▼
             Prettier
```

Recommended:

```text
ESLint → quality
Prettier → formatting
```

Instead of:

```text
ESLint → quality + formatting
Prettier → formatting
```

---

# 6. Prettier Configuration

Create:

```text
prettier.config.js
```

Example:

```js
export default {
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
};
```

---

# 7. Prettier Ignore

Create:

```text
.prettierignore
```

```text
node_modules
dist
build
coverage
.next
.env
.env.*
logs
*.min.js
```

---

# 8. ESLint Ignore

With flat config, prefer the `ignores` section inside:

```text
eslint.config.js
```

Example:

```js
{
  ignores: [
    "node_modules/**",
    "dist/**",
    "build/**",
    "coverage/**",
  ],
}
```

You normally do not need a separate `.eslintignore` file for a modern flat-config project.

---

# 9. Package Scripts

The most useful scripts are:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",

    "lint": "eslint .",
    "lint:fix": "eslint . --fix",

    "format": "prettier . --write",
    "format:check": "prettier . --check",

    "typecheck": "tsc --noEmit",

    "check": "npm run typecheck && npm run lint && npm run format:check"
  }
}
```

---

# 10. What Each Script Does

## `npm run lint`

Checks ESLint errors:

```bash
npm run lint
```

Equivalent:

```bash
eslint .
```

It does not modify files.

---

## `npm run lint:fix`

Automatically fixes ESLint problems that are safely fixable.

```bash
npm run lint:fix
```

Equivalent:

```bash
eslint . --fix
```

---

## `npm run format`

Formats the project:

```bash
npm run format
```

Equivalent:

```bash
prettier . --write
```

---

## `npm run format:check`

Checks formatting without changing files:

```bash
npm run format:check
```

Useful in CI/CD.

---

## `npm run typecheck`

Runs TypeScript checking without generating JavaScript:

```bash
npm run typecheck
```

Equivalent:

```bash
tsc --noEmit
```

---

## `npm run check`

Runs the complete quality check:

```bash
npm run check
```

Flow:

```text
TypeScript
    ↓
ESLint
    ↓
Prettier
    ↓
PASS / FAIL
```

This is the script you can run before pushing code.

---

# 11. Recommended Daily Workflow

During development:

```bash
npm run lint
```

If ESLint reports auto-fixable issues:

```bash
npm run lint:fix
```

Format:

```bash
npm run format
```

Check everything:

```bash
npm run check
```

---

# 12. Recommended CI Workflow

CI should not automatically modify source files.

Use:

```bash
npm ci
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Or simply:

```bash
npm run check
npm run build
```

The difference:

```text
Local development
→ --fix / --write allowed

CI
→ check only
→ fail if code is invalid or incorrectly formatted
```

---

# 13. TypeScript Configuration

A scalable Node.js TypeScript project can use:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    "rootDir": "src",
    "outDir": "dist",

    "strict": true,

    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    "skipLibCheck": true,

    "sourceMap": true,
    "declaration": true
  },

  "include": ["src/**/*.ts"],
  "exclude": [
    "node_modules",
    "dist",
    "coverage"
  ]
}
```

If your project uses a different TypeScript module strategy, keep the ESLint configuration aligned with it.

---

# 14. Type-Aware ESLint

Basic ESLint checks syntax and common problems.

For larger TypeScript projects, type-aware linting can catch additional issues.

A common setup is:

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  eslintConfigPrettier,
);
```

This is more powerful but can be slower.

For a growing backend:

```text
Small project
→ recommended

Large TypeScript project
→ recommendedTypeChecked
```

---

# 15. Important `projectService` Issue

If you see an error such as:

```text
was not found by the project service
```

ESLint is trying to type-check a file that is not included in your TypeScript project.

For example:

```text
eslint.config.js
```

may not be included by:

```json
{
  "include": ["src/**/*.ts"]
}
```

### Solution A — Do not type-check config files

Limit type-aware configuration to TypeScript source files:

```js
{
  files: ["src/**/*.{ts,tsx}"],

  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
}
```

This is usually the cleanest solution.

### Solution B — Use a dedicated ESLint tsconfig

For complex projects:

```text
tsconfig.json
tsconfig.eslint.json
```

But prefer `projectService` with a clean source-file boundary before introducing another TypeScript configuration.

---

# 16. ESLint Rules

Example:

```js
rules: {
  "no-console": "off",

  "@typescript-eslint/no-explicit-any": "warn",

  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
}
```

Severity:

```text
"off"   → 0
"warn"  → 1
"error" → 2
```

Example:

```js
"no-console": "warn"
```

or:

```js
"no-console": "error"
```

---

# 17. Unused Variables

Instead of:

```ts
function handler(req, res) {
  // req is intentionally unused
}
```

Use:

```ts
function handler(_req, res) {
}
```

With:

```js
argsIgnorePattern: "^_"
```

ESLint will ignore intentionally unused arguments beginning with `_`.

---

# 18. Type Imports

Prefer:

```ts
import type { User } from "./user.js";
```

instead of:

```ts
import { User } from "./user.js";
```

when `User` is only a TypeScript type.

Rule:

```js
"@typescript-eslint/consistent-type-imports": [
  "error",
  {
    prefer: "type-imports",
  },
]
```

---

# 19. Prettier + ESLint Order

Use:

```text
1. TypeScript
2. ESLint
3. Prettier
```

For automatic local fixes:

```bash
npm run lint:fix
npm run format
```

Then:

```bash
npm run check
```

---

# 20. VS Code Setup

Recommended extensions:

```text
ESLint
Prettier - Code formatter
```

Create:

```text
.vscode/settings.json
```

```json
{
  "editor.formatOnSave": true,

  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

# 21. Optional: Husky

For automatic checks before commits:

```bash
npm install -D husky
```

Initialize:

```bash
npx husky init
```

Create:

```text
.husky/
└── pre-commit
```

Example:

```bash
npm run check
```

Now:

```text
git commit
   ↓
Husky
   ↓
npm run check
   ↓
TypeScript + ESLint + Prettier
   ↓
commit allowed / rejected
```

For larger projects, use `lint-staged` so only changed files are checked.

---

# 22. Optional: lint-staged

Install:

```bash
npm install -D lint-staged
```

Add:

```json
{
  "lint-staged": {
    "*.{js,mjs,cjs,ts,mts,cts}": [
      "eslint --fix"
    ],
    "*.{js,mjs,cjs,ts,mts,cts,json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

Then your Husky hook can run:

```bash
npx lint-staged
```

Architecture:

```text
git commit
    ↓
Husky
    ↓
lint-staged
    ↓
only changed files
    ↓
ESLint + Prettier
```

This is faster than running the complete repository check for every commit.

---

# 23. Recommended Scripts for a Scalable Node.js Project

A practical `package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",

    "build": "tsc",
    "start": "node dist/server.js",

    "lint": "eslint .",
    "lint:fix": "eslint . --fix",

    "format": "prettier . --write",
    "format:check": "prettier . --check",

    "typecheck": "tsc --noEmit",

    "check": "npm run typecheck && npm run lint && npm run format:check",

    "test": "node --test",
    "test:watch": "node --test --watch",

    "ci": "npm run check && npm run test && npm run build"
  }
}
```

---

# 24. Recommended Command Cheat Sheet

```bash
# Install
npm install -D eslint @eslint/js typescript typescript-eslint prettier eslint-config-prettier globals

# Check ESLint
npm run lint

# Automatically fix ESLint issues
npm run lint:fix

# Format everything
npm run format

# Check formatting
npm run format:check

# Type checking
npm run typecheck

# Complete quality check
npm run check

# Tests
npm test

# Build
npm run build

# CI
npm run ci
```

---

# 25. Production Workflow

Recommended workflow:

```text
                Developer
                    │
                    ▼
              Write code
                    │
                    ▼
             npm run lint:fix
                    │
                    ▼
              npm run format
                    │
                    ▼
             npm run typecheck
                    │
                    ▼
                 Tests
                    │
                    ▼
               Git commit
                    │
                    ▼
                 Husky
                    │
                    ▼
              lint-staged
                    │
                    ▼
                  Push
                    │
                    ▼
              GitHub Actions
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      Typecheck   Lint     Format check
          │         │         │
          └─────────┼─────────┘
                    ▼
                  Tests
                    │
                    ▼
                  Build
```

---

# 26. Recommended Responsibility

Keep responsibilities clear:

```text
TypeScript
└── type correctness

ESLint
├── code quality
├── bug detection
├── TypeScript rules
└── architectural coding rules

Prettier
└── formatting

Husky
└── Git lifecycle hooks

lint-staged
└── changed-file checks

GitHub Actions
└── CI verification
```

---

# 27. Golden Rules

### Rule 1

Do not use Prettier as a replacement for ESLint.

### Rule 2

Do not add dozens of formatting rules to ESLint.

### Rule 3

Use:

```text
eslint-config-prettier
```

to avoid formatting conflicts.

### Rule 4

Use:

```bash
npm run lint
```

for CI validation.

### Rule 5

Use:

```bash
npm run lint:fix
```

for local auto-fixes.

### Rule 6

Use:

```bash
npm run format:check
```

in CI.

### Rule 7

Use:

```bash
npm run typecheck
```

because ESLint does not replace the TypeScript compiler.

### Rule 8

Keep generated directories out of linting:

```text
dist/
build/
coverage/
node_modules/
```

### Rule 9

For large projects, use type-aware ESLint carefully because it is more expensive.

### Rule 10

Use one central configuration at the project root.

---

# 28. Final Recommended Setup

```text
project/
│
├── src/
│   ├── app/
│   ├── config/
│   ├── modules/
│   ├── middleware/
│   ├── infrastructure/
│   ├── shared/
│   └── server.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .husky/
│   └── pre-commit
│
├── .vscode/
│   └── settings.json
│
├── eslint.config.js
├── prettier.config.js
├── .prettierignore
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```

Core commands:

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run typecheck
npm run check
npm test
npm run build
npm run ci
```

The key idea:

```text
ESLint       → Is my code correct and maintainable?
Prettier     → Is my code consistently formatted?
TypeScript   → Are my types correct?
Tests        → Does the application behave correctly?
Husky        → Should Git allow this commit?
CI           → Should this change enter the repository?
```

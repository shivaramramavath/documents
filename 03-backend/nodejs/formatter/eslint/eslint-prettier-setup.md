# ESLint + Prettier Setup — TypeScript (Node.js & React)

A production-friendly ESLint + Prettier setup for TypeScript projects, covering both a **Node.js backend** and a **React frontend**, using ESLint's flat config (`eslint.config.js`).

## ESLint vs Prettier vs TypeScript

| Tool           | Responsibility                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| **ESLint**     | Code quality & correctness — unused/undefined variables, unsafe patterns, bad imports, React hook rules |
| **Prettier**   | Formatting only — spacing, quotes, line breaks                                                          |
| **TypeScript** | Type checking                                                                                           |

Keep these separated. Don't make ESLint responsible for formatting — that's what `eslint-config-prettier` is for (see below).

```js
// Prettier: turns this
const user = { name: "Shiva", age: 21 };
// into this
const user = {
  name: "Shiva",
  age: 21,
};
```

---

## 1. Node.js (backend) setup

### Install

```bash
npm install -D eslint @eslint/js typescript typescript-eslint prettier eslint-config-prettier globals
```

### `eslint.config.js`

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: { ...globals.node },
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
        { prefer: "type-imports" },
      ],
    },
  },
  eslintConfigPrettier,
);
```

### `tsconfig.json`

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
  "exclude": ["node_modules", "dist", "coverage"]
}
```

---

## 2. React (frontend) setup

### Install

Everything from the Node.js setup, plus the React-specific plugins:

```bash
npm install -D eslint @eslint/js typescript typescript-eslint prettier eslint-config-prettier globals eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### `eslint.config.js`

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
    },
  },
  eslintConfigPrettier,
);
```

Key differences from the Node.js config:

- `globals.browser` instead of `globals.node` (React runs in the browser, not Node)
- `parserOptions.ecmaFeatures.jsx: true` to parse JSX
- `eslint-plugin-react-hooks` — enforces the Rules of Hooks (`useEffect` deps, hooks only at top level, etc.)
- `eslint-plugin-react-refresh` — warns when a file mixes component and non-component exports, which breaks Fast Refresh in Vite/CRA dev servers

### `tsconfig.json` (Vite + React example)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

---

## 3. `eslint-config-prettier`

ESLint and Prettier can disagree on formatting. `eslint-config-prettier` turns off any ESLint rule that would conflict with Prettier, so each tool sticks to its job:

```
ESLint  → correctness, quality, hooks/TS rules
             ↓
eslint-config-prettier → disables formatting-related ESLint rules
             ↓
Prettier → formatting
```

Always put `eslintConfigPrettier` **last** in the config array so it can override earlier rule sets.

## 4. Prettier config (same for both)

`prettier.config.js`:

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

`.prettierignore`:

```
node_modules
dist
build
coverage
.env
.env.*
*.min.js
```

With flat config, ESLint ignores go inside `eslint.config.js` (the `ignores` array) — a separate `.eslintignore` file usually isn't needed.

## 5. Package scripts

**Node.js:**

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

**React (Vite):**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "typecheck": "tsc -b --noEmit",
    "check": "npm run typecheck && npm run lint && npm run format:check"
  }
}
```

| Script         | What it does                                             |
| -------------- | -------------------------------------------------------- |
| `lint`         | Reports ESLint issues; doesn't modify files              |
| `lint:fix`     | Auto-fixes safely-fixable ESLint issues                  |
| `format`       | Formats the whole project with Prettier                  |
| `format:check` | Checks formatting without changing files — use in CI     |
| `typecheck`    | Runs the TS compiler with no output, just to check types |
| `check`        | Runs all three — the one command to run before pushing   |

## 6. Daily workflow

```
write code → lint:fix → format → typecheck → tests → commit
```

CI should never auto-modify files — use the `check` variants only:

```bash
npm ci
npm run check
npm run build
```

## 7. Type-aware linting (optional, larger projects)

Basic ESLint checks syntax; type-aware linting catches more (e.g. unsafe `any` usage across files) but is slower:

```js
...tseslint.configs.recommendedTypeChecked,
{
  files: ["src/**/*.{ts,tsx}"],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
},
```

**Common pitfall:** if you see `was not found by the project service`, ESLint is trying to type-check a file your `tsconfig.json` doesn't include (often `eslint.config.js` itself). Fix by scoping the `files` pattern to your actual source files (`src/**/*.{ts,tsx}`) rather than type-checking the whole repo.

## 8. Editor setup (VS Code)

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

Install the **ESLint** and **Prettier – Code formatter** extensions.

## 9. Optional: Husky + lint-staged

Run checks automatically before commit, on staged files only:

```bash
npm install -D husky lint-staged
npx husky init
```

`package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

`.husky/pre-commit`:

```sh
npx lint-staged
```

## Golden rules

1. Don't use Prettier to replace ESLint, or ESLint to replace Prettier.
2. Always include `eslint-config-prettier`, last in the config array.
3. Use `lint` + `format:check` in CI; `lint:fix` + `format` locally.
4. ESLint doesn't replace the TypeScript compiler — keep `typecheck` as its own step.
5. Exclude `dist/`, `build/`, `coverage/`, `node_modules/` from linting.
6. For React, don't skip `eslint-plugin-react-hooks` — it catches real bugs (stale closures, missing deps).
7. Reach for type-aware linting only when you need it — it's noticeably slower on large codebases.

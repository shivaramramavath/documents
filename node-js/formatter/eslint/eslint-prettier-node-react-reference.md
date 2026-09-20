# ESLint + Prettier — Node.js & React Reference

> A practical learning and reference guide for ESLint and Prettier, from fundamentals to production workflows.

## Learning Philosophy

For every important concept, use this mental model:

```text
WHAT?
  ↓
WHY?
  ↓
HOW?
  ↓
WHEN?
  ↓
WHEN NOT?
  ↓
WHAT HAPPENS INTERNALLY?
  ↓
WHAT CAN GO WRONG?
  ↓
HOW IS IT USED IN PRODUCTION?
  ↓
INTERVIEW
```

---

# 1. ESLint and Prettier at a Glance

| Tool | Main responsibility | Example |
|---|---|---|
| ESLint | Code quality and correctness | Detect undefined variables |
| Prettier | Code formatting | Consistent quotes, indentation, line wrapping |
| ESLint `--fix` | Automatically fix supported lint rules | Fix some code-quality/style issues |
| Prettier `--write` | Format files | Rewrite code using formatting rules |

### Mental model

```text
                         Source Code
                              │
                 ┌────────────┴────────────┐
                 ↓                         ↓
              ESLint                    Prettier
                 ↓                         ↓
       Code quality / rules            Formatting
                 ↓                         ↓
        "Is the code valid,          "Does the code
         safe and maintainable?"      follow our format?"
                 │                         │
                 └────────────┬────────────┘
                              ↓
                       Clean codebase
```

---

# 2. What Is ESLint?

## What?

ESLint is a static analysis tool for JavaScript and related ecosystems.

It analyzes source code without executing the application and reports problems according to configured rules.

Example:

```js
const user = "Shiva";

console.log(user);
console.log(username);
```

If `username` is not defined, ESLint can report:

```text
'username' is not defined
```

## Why?

ESLint helps detect:

- Undefined variables
- Unused variables
- Suspicious patterns
- Incorrect patterns
- Potential bugs
- Project-specific coding rules
- React Hooks mistakes
- Maintainability problems

## How?

```text
Source Code
    ↓
ESLint parses code
    ↓
Builds an internal representation
    ↓
Runs configured rules
    ↓
Reports diagnostics
    ↓
Optional automatic fixes
```

## When?

Use ESLint:

- During development
- Before commits
- In pull requests
- In CI/CD
- Across Node.js and React projects

## When not?

Do not use ESLint as:

- A code formatter replacement
- A compiler
- A runtime error handler
- A replacement for tests
- A replacement for TypeScript type checking

---

# 3. What Is Prettier?

## What?

Prettier is an opinionated code formatter.

It transforms source code into a consistent format according to Prettier's configuration.

### Before

```js
const user={name:"Shiva",age:21,skills:["JavaScript","Node.js","React"]};
```

### After

```js
const user = {
  name: "Shiva",
  age: 21,
  skills: ["JavaScript", "Node.js", "React"],
};
```

## Why?

Without an automated formatter, developers may disagree about:

- Indentation
- Quotes
- Line wrapping
- Trailing commas
- Spacing
- Semicolon usage

Prettier removes most formatting discussions from code reviews.

## How?

```text
Source Code
    ↓
Prettier parses the source
    ↓
Builds a document representation
    ↓
Applies formatting rules
    ↓
Generates formatted source
```

## When?

Use Prettier when you want:

- Consistent formatting
- Automatic formatting on save
- Easy code reviews
- Less formatting-related discussion

## When not?

Do not expect Prettier to detect:

- Undefined variables
- Authentication bugs
- SQL injection
- Incorrect business logic
- Broken API behavior
- Type errors

---

# 4. ESLint vs Prettier

| Question | ESLint | Prettier |
|---|---:|---:|
| Finds undefined variables | Yes | No |
| Finds unused variables | Yes | No |
| Checks React Hooks rules | Yes | No |
| Formats indentation | Usually not its main role | Yes |
| Formats quotes | Not its main role | Yes |
| Line wrapping | No | Yes |
| Can automatically fix | Some rules | Yes |
| Static analysis | Yes | No |
| Formatting | Limited / avoid overlap | Primary purpose |

### Recommended separation

```text
ESLint
→ Code quality
→ Correctness
→ Best-practice rules
→ Framework-specific rules

Prettier
→ Formatting
→ Consistency
→ Readability
```

Avoid making ESLint and Prettier fight over formatting rules.

---

# 5. Create a Node.js Practice Project

```text
eslint-prettier-practice/
│
├── src/
│   ├── index.js
│   ├── user.js
│   ├── calculator.js
│   └── utils.js
│
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── package.json
└── package-lock.json
```

Initialize the project:

```bash
npm init -y
```

---

# 6. Install ESLint

Install ESLint:

```bash
npm install --save-dev eslint
```

Install the recommended JavaScript rules package:

```bash
npm install --save-dev @eslint/js
```

Check the version:

```bash
npx eslint -v
```

---

# 7. Modern ESLint Configuration

Modern ESLint uses the flat configuration format.

Create:

```text
eslint.config.js
```

Basic configuration:

```js
import js from "@eslint/js";

export default [js.configs.recommended];
```

Install dependencies if needed:

```bash
npm install --save-dev @eslint/js
```

## What is happening?

```text
eslint.config.js
       ↓
import @eslint/js
       ↓
recommended JavaScript rules
       ↓
ESLint analyzes your project
```

---

# 8. Your First ESLint Error

Create:

```js
// src/index.js

const user = "Shiva";

console.log(user);

console.log(username);
```

Run:

```bash
npx eslint .
```

Expected behavior:

```text
'username' is not defined
```

The exact output formatting depends on your ESLint version and configuration.

## Why did ESLint detect it?

`username` is referenced but has no declaration in the scope.

```text
console.log(username)
            ↑
       Where defined?
            ↓
       Not found
            ↓
          ESLint
            ↓
          Error
```

---

# 9. What Does `.` Mean?

When you run:

```bash
npx eslint .
```

the `.` means the current directory.

You can also target a specific directory:

```bash
npx eslint src
```

Or a specific file:

```bash
npx eslint src/index.js
```

---

# 10. ESLint `--fix`

Some ESLint rules support automatic fixes.

Run:

```bash
npx eslint . --fix
```

Conceptually:

```text
eslint .
   ↓
Analyze code
   ↓
Find problems
   ↓
Can this rule be fixed automatically?
   ↓
Yes → Apply fix
No  → Report problem
```

Important:

> `--fix` cannot automatically solve every problem.

Logical bugs and many semantic problems require a developer to fix them.

---

# 11. ESLint Rules

Rules are the core of ESLint.

Example:

```js
export default [
  {
    rules: {
      "no-console": "warn",
    },
  },
];
```

Now `console.log()` can produce a warning.

---

# 12. Rule Severity

ESLint commonly uses:

```text
off
warn
error
```

## Off

```js
"no-console": "off"
```

The rule is disabled.

## Warn

```js
"no-console": "warn"
```

The issue is reported as a warning.

## Error

```js
"no-console": "error"
```

The issue is reported as an error.

### Mental model

```text
off
 ↓
Ignore

warn
 ↓
Tell developer
but usually don't block everything

error
 ↓
Treat as a failure
```

---

# 13. Useful Beginner Rules

Start with a small rule set.

```js
export default [
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "warn",
      eqeqeq: "error",
      "prefer-const": "error",
    },
  },
];
```

## `no-unused-vars`

Detects variables that are declared but not used.

```js
const name = "Shiva";
```

If `name` is never used, ESLint can report it.

## `no-undef`

Detects references to variables that are not defined.

```js
console.log(username);
```

## `no-console`

Controls use of:

```js
console.log();
console.warn();
console.error();
```

Whether this should be a warning or error depends on your project.

## `eqeqeq`

Encourages strict equality:

```js
value === 10;
```

instead of:

```js
value == 10;
```

## `prefer-const`

If a variable is never reassigned:

```js
let name = "Shiva";
```

ESLint can recommend:

```js
const name = "Shiva";
```

---

# 14. ESLint Configuration with Ignores

A simple modern configuration can look like:

```js
import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },

  js.configs.recommended,

  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "warn",
      eqeqeq: "error",
      "prefer-const": "error",
    },
  },
];
```

The important pieces are:

```text
ignores
rules
recommended configuration
```

---

# 15. Add npm Scripts

Instead of repeatedly typing:

```bash
npx eslint .
```

add scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

Now use:

```bash
npm run lint
```

and:

```bash
npm run lint:fix
```

---

# 16. Install Prettier

```bash
npm install --save-dev prettier
```

Check:

```bash
npx prettier --version
```

---

# 17. Create `.prettierrc`

Create:

```text
.prettierrc
```

Simple configuration:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all"
}
```

## Meaning

| Option | Meaning |
|---|---|
| `semi` | Add semicolons |
| `singleQuote` | Prefer single quotes |
| `trailingComma` | Add trailing commas where supported |

---

# 18. Prettier Formatting

### Before

```js
const user={name:"Shiva",age:21,skills:["JavaScript","Node.js","React"]};
```

### After

```js
const user = {
  name: 'Shiva',
  age: 21,
  skills: ['JavaScript', 'Node.js', 'React'],
};
```

---

# 19. Prettier Commands

Check formatting:

```bash
npx prettier . --check
```

Format files:

```bash
npx prettier . --write
```

### Difference

```text
prettier . --check
        ↓
Check only

prettier . --write
        ↓
Format files
```

---

# 20. Add Prettier Scripts

Update `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

Use:

```bash
npm run format
```

or:

```bash
npm run format:check
```

---

# 21. `.prettierignore`

Create:

```text
node_modules
dist
build
coverage
.env
.env.*
```

These files/directories are excluded from Prettier processing.

---

# 22. Recommended Node.js Workflow

```text
Write code
    ↓
Save file
    ↓
Prettier formats code
    ↓
Run ESLint
    ↓
ESLint checks code quality
    ↓
Fix reported issues
    ↓
Run tests
    ↓
Commit
```

Commands:

```bash
npm run format
npm run lint
```

Then:

```bash
npm test
```

---

# 23. VS Code Integration

Install these extensions:

- ESLint
- Prettier - Code formatter

Recommended VS Code settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

Now:

```text
Edit code
   ↓
Save
   ↓
Prettier
   ↓
Formatting automatically updated
```

ESLint can show diagnostics directly in the editor.

---

# 24. React and ESLint

React introduces additional patterns that benefit from linting.

Examples:

- Hooks
- JSX
- React-specific rules
- Effect dependencies
- Component patterns

A React project commonly has ESLint configured with React-related plugins/configurations.

For example, a project may use:

```text
ESLint
+
React ESLint configuration
+
React Hooks rules
```

Do not blindly copy old `.eslintrc` tutorials into a modern ESLint project. Modern ESLint projects commonly use:

```text
eslint.config.js
```

---

# 25. React Hooks Example

Consider:

```jsx
function User() {
  const [name, setName] = useState("Shiva");

  return <h1>{name}</h1>;
}
```

React-specific linting can help enforce rules around Hooks.

For example, Hooks should not be called conditionally:

```jsx
if (user) {
  useEffect(() => {
    // ...
  }, []);
}
```

This violates the Rules of Hooks.

Linting can detect this class of problem before runtime.

---

# 26. Node.js Project Structure

A scalable Node.js project might look like:

```text
server/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── app.js
│
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── package.json
└── package-lock.json
```

The exact structure depends on the architecture of the application.

ESLint and Prettier should operate consistently across the source tree while ignoring generated artifacts.

---

# 27. React Project Structure

For a typical React application:

```text
client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── package.json
└── package-lock.json
```

---

# 28. ESLint + Prettier Separation

Avoid creating a large collection of ESLint formatting rules when Prettier already handles formatting.

A useful boundary is:

```text
Prettier
├── indentation
├── quotes
├── line wrapping
├── trailing commas
└── formatting

ESLint
├── undefined variables
├── unused variables
├── suspicious code
├── best practices
├── React rules
├── Hooks rules
└── project-specific code quality
```

---

# 29. What Happens Internally?

## ESLint

At a high level:

```text
Source file
    ↓
Parser
    ↓
Syntax representation
    ↓
Rules inspect code
    ↓
Diagnostics
    ↓
Formatter/output
    ↓
Optional fixes
```

ESLint is therefore a static analysis tool.

It does not need to execute your application to detect many classes of problems.

---

## Prettier

At a high level:

```text
Source file
    ↓
Parser
    ↓
Document representation
    ↓
Formatting algorithm
    ↓
Generated source
```

Prettier focuses on producing a deterministic formatting result.

---

# 30. What Can Go Wrong?

## Problem 1 — ESLint does not find a file

Check:

```text
eslint.config.js
```

and verify that your target files are included.

Also check ignore patterns.

---

## Problem 2 — `eslint.config.js` has parsing/configuration errors

Check:

- Node.js version
- ESLint version
- Package type/module configuration
- Installed ESLint packages
- Configuration syntax

---

## Problem 3 — Prettier keeps changing files

Usually check:

- `.prettierrc`
- VS Code formatter settings
- Another formatter extension
- EditorConfig
- Different project-level Prettier configuration

---

## Problem 4 — ESLint and Prettier disagree

Avoid duplicate formatting responsibilities.

Determine:

```text
Is this a formatting concern?
        ↓
Prettier

Is this a code-quality concern?
        ↓
ESLint
```

---

## Problem 5 — `npm run lint:fix` does not fix everything

Expected.

`--fix` only fixes problems for which ESLint has an available safe/appropriate fixer.

You still need to manually resolve many errors.

---

# 31. Production Workflow

A practical project can use:

```text
Developer
    │
    ↓
VS Code
    │
    ├── Format on save
    │
    └── ESLint diagnostics
    │
    ↓
Local checks
    │
    ├── npm run lint
    ├── npm run format:check
    └── npm test
    │
    ↓
Git commit
    │
    ↓
Husky / lint-staged
    │
    ├── ESLint
    └── Prettier
    │
    ↓
Push
    │
    ↓
CI/CD
    │
    ├── lint
    ├── format check
    ├── tests
    └── build
    │
    ↓
Deployment
```

---

# 32. Husky + lint-staged

After understanding ESLint and Prettier, learn:

```text
Husky
+
lint-staged
```

Purpose:

> Run checks automatically on staged files before a commit.

Conceptually:

```text
git commit
    ↓
Husky hook
    ↓
lint-staged
    ↓
ESLint + Prettier
    ↓
Pass?
  ↙     ↘
Yes      No
 ↓        ↓
Commit   Stop
```

This prevents many avoidable quality issues from entering the repository.

---

# 33. CI/CD

Local checks are not enough.

Run the same checks in CI:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

Why?

A developer can:

- Disable editor extensions
- Forget to run commands
- Commit from another environment
- Have different local settings

CI provides an independent verification layer.

---

# 34. Recommended npm Scripts

A practical Node.js/React project can eventually have:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "test": "your-test-command",
    "build": "your-build-command"
  }
}
```

Use:

```bash
npm run lint
```

for code-quality checks.

Use:

```bash
npm run format
```

to format code.

Use:

```bash
npm run format:check
```

in CI when you want to verify that files are already formatted.

---

# 35. Learning Roadmap

## Level 1 — Prettier

Learn:

```text
.prettierrc
.prettierignore
prettier --write
prettier --check
```

Practice:

```bash
npm run format
npm run format:check
```

---

## Level 2 — ESLint

Learn:

```text
eslint.config.js
rules
ignores
eslint .
eslint . --fix
```

Practice:

```bash
npm run lint
npm run lint:fix
```

---

## Level 3 — Rules

Learn:

```text
no-unused-vars
no-undef
no-console
eqeqeq
prefer-const
```

Then move to more advanced rules.

---

## Level 4 — React

Learn:

```text
JSX linting
React-specific rules
React Hooks rules
Effect dependency rules
Component patterns
```

---

## Level 5 — Editor Integration

Learn:

```text
VS Code
formatOnSave
ESLint diagnostics
workspace settings
```

---

## Level 6 — Git Workflow

Learn:

```text
Husky
lint-staged
pre-commit
```

---

## Level 7 — Production

Learn:

```text
CI/CD
Pull request checks
Monorepo configuration
Shared ESLint configuration
Shared Prettier configuration
TypeScript integration
```

---

# 36. Practice Exercises

## Exercise 1 — ESLint

Create:

```js
const name = "Shiva";

console.log(username);
```

Run:

```bash
npm run lint
```

Identify the error.

---

## Exercise 2 — Unused variable

Create:

```js
const name = "Shiva";

console.log("Hello");
```

Run:

```bash
npm run lint
```

Identify the unused variable.

---

## Exercise 3 — Prettier

Write badly formatted code:

```js
const user={name:"Shiva",age:21};
```

Run:

```bash
npm run format
```

Observe the result.

---

## Exercise 4 — Strict equality

Write:

```js
if (age == 21) {
  console.log("Adult");
}
```

Configure:

```js
eqeqeq: "error"
```

Then run:

```bash
npm run lint
```

---

## Exercise 5 — React Hooks

Create a small React component and deliberately put a Hook inside a conditional.

Run ESLint and observe the diagnostic.

Then move the Hook to the top level of the component.

---

# 37. Quick Command Reference

| Command | Purpose |
|---|---|
| `npx eslint .` | Check project |
| `npx eslint . --fix` | Check and auto-fix supported ESLint issues |
| `npx prettier . --check` | Check formatting |
| `npx prettier . --write` | Format project |
| `npm run lint` | Project lint script |
| `npm run lint:fix` | Project lint auto-fix script |
| `npm run format` | Format project |
| `npm run format:check` | Verify formatting |

---

# 38. Interview Questions

## Beginner

### 1. What is ESLint?

ESLint is a static analysis tool that identifies code-quality and potential correctness problems based on configurable rules.

### 2. What is Prettier?

Prettier is an opinionated code formatter that automatically formats source code consistently.

### 3. What is the difference between ESLint and Prettier?

ESLint primarily analyzes code quality and correctness. Prettier primarily handles formatting.

### 4. What does `eslint .` do?

It runs ESLint against the current directory and applicable files.

### 5. What does `eslint --fix` do?

It automatically applies available ESLint fixes.

### 6. What does `prettier --write` do?

It formats files and writes the formatted output back to disk.

### 7. What is `.prettierrc`?

A configuration file used to customize Prettier formatting behavior.

### 8. What is `eslint.config.js`?

The modern ESLint flat configuration file.

---

# 39. Intermediate Interview Questions

### Why shouldn't ESLint and Prettier duplicate formatting rules?

Because two tools controlling the same formatting behavior can create conflicts and unnecessary configuration complexity.

A cleaner architecture is:

```text
Prettier → formatting
ESLint   → code quality
```

### Why use linting in CI if developers already use ESLint locally?

Local tooling is not guaranteed to be used consistently. CI provides an independent quality gate.

### Why use `lint-staged`?

It allows linting/formatting only the files relevant to the current commit instead of unnecessarily processing the entire project.

### Can ESLint replace tests?

No.

ESLint can detect many static problems, but it cannot verify that application behavior is correct.

### Can Prettier detect bugs?

Not in the way ESLint or tests do. Its primary responsibility is formatting.

---

# 40. Advanced Topics to Learn Next

After mastering the fundamentals, continue with:

```text
ESLint
├── Flat Config
├── Plugins
├── Configs
├── Rule customization
├── Overrides / file-specific configuration
├── Processors
├── Custom rules
├── TypeScript ESLint
├── React ESLint ecosystem
└── Monorepo configuration

Prettier
├── Configuration
├── Plugins
├── Ignore patterns
├── Editor integration
├── CI checks
└── Monorepo configuration

Git
├── Husky
├── lint-staged
├── pre-commit
└── commit hooks

CI/CD
├── GitHub Actions
├── lint
├── format check
├── tests
└── build
```

---

# 41. Final Mental Model

Memorize this:

```text
                    CODE
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
       PRETTIER                ESLINT
          ↓                       ↓
     FORMAT CODE             ANALYZE CODE
          ↓                       ↓
  quotes / spacing /       bugs / suspicious
  wrapping / commas        patterns / rules
          │                       │
          └───────────┬───────────┘
                      ↓
                LOCAL CHECKS
                      │
                      ↓
                HUSKY / GIT
                      │
                      ↓
                    CI/CD
                      │
                      ↓
                 PRODUCTION
```

The core rule is:

> **Prettier makes code consistent. ESLint makes code safer and more maintainable. Tests verify behavior. CI verifies the workflow.**

---

# 42. Recommended Learning Order

Do not jump directly into advanced ESLint configuration.

Follow this sequence:

```text
1. Prettier basics
       ↓
2. ESLint basics
       ↓
3. eslint.config.js
       ↓
4. ESLint rules
       ↓
5. --fix
       ↓
6. npm scripts
       ↓
7. VS Code
       ↓
8. Node.js project
       ↓
9. React project
       ↓
10. TypeScript
       ↓
11. Husky
       ↓
12. lint-staged
       ↓
13. CI/CD
       ↓
14. Monorepos
       ↓
15. Advanced/custom ESLint rules
```

This progression gives you the practical foundation first and introduces complexity only when it solves a real problem.

---

# 43. TypeScript ESLint

When a project uses TypeScript, standard JavaScript ESLint rules are not enough.

Use:

```text
ESLint
   +
typescript-eslint
   ↓
TypeScript-aware linting
```

## What?

`typescript-eslint` provides tooling that allows ESLint to understand TypeScript syntax and, when configured, TypeScript type information.

It is commonly used for:

- `.ts` files
- `.tsx` files
- TypeScript-specific rules
- Type-aware linting
- React + TypeScript projects
- Node.js + TypeScript projects

## Why?

TypeScript introduces syntax such as:

```ts
function greet(name: string): string {
  return name;
}
```

ESLint needs TypeScript-aware parsing and rules to analyze this correctly.

## Install

```bash
npm install --save-dev typescript typescript-eslint
```

Check TypeScript:

```bash
npx tsc --version
```

---

# 44. Basic TypeScript ESLint Configuration

Modern `typescript-eslint` provides a convenient flat-config API.

Example:

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
```

This combines:

```text
JavaScript ESLint recommended rules
                +
TypeScript ESLint recommended rules
```

---

# 45. TypeScript Project Structure

A Node.js + TypeScript project can look like:

```text
server/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── app.ts
│
├── eslint.config.js
├── tsconfig.json
├── .prettierrc
├── .prettierignore
├── package.json
└── package-lock.json
```

A React + TypeScript project:

```text
client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── eslint.config.js
├── tsconfig.json
├── .prettierrc
├── .prettierignore
├── package.json
└── package-lock.json
```

---

# 46. TypeScript ESLint Rules

TypeScript ESLint provides rules specifically designed for TypeScript.

Examples:

```text
@typescript-eslint/no-unused-vars
@typescript-eslint/no-explicit-any
@typescript-eslint/no-non-null-assertion
@typescript-eslint/consistent-type-imports
```

Example:

```ts
const user: any = getUser();
```

With:

```js
rules: {
  '@typescript-eslint/no-explicit-any': 'warn',
}
```

ESLint can report the explicit `any` usage.

---

# 47. TypeScript-Specific `no-unused-vars`

When using TypeScript, prefer the TypeScript-aware rule when you need to customize this behavior:

```js
'@typescript-eslint/no-unused-vars': 'error'
```

rather than relying only on:

```js
'no-unused-vars': 'error'
```

A common explicit replacement is:

```js
rules: {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'error',
}
```

Mental model:

```text
JavaScript
   ↓
no-unused-vars

TypeScript
   ↓
@typescript-eslint/no-unused-vars
```

---

# 48. `any` and TypeScript ESLint

Consider:

```ts
function processUser(user: any) {
  return user.name;
}
```

`any` disables much of TypeScript's static type checking for that value.

You can configure:

```js
rules: {
  '@typescript-eslint/no-explicit-any': 'warn',
}
```

Or, in stricter projects:

```js
rules: {
  '@typescript-eslint/no-explicit-any': 'error',
}
```

Do not blindly ban every use of `any`. Migration code, external libraries, and interoperability boundaries can sometimes justify it.

The production principle is:

> Make intentional exceptions explicit rather than allowing accidental `any` usage everywhere.

---

# 49. TypeScript ESLint and Type Checking

There are two important levels of TypeScript linting.

## Syntax-aware linting

```text
TypeScript source
      ↓
typescript-eslint
      ↓
Rules based on syntax
```

This is generally lighter and does not require full type information for every rule.

## Type-aware linting

```text
TypeScript source
      ↓
TypeScript compiler information
      ↓
typescript-eslint
      ↓
Rules that understand types
```

Type-aware linting can detect deeper problems but requires additional configuration and can increase linting cost.

---

# 50. Type Checking Is Not the Same as ESLint

This distinction is important.

TypeScript:

```bash
npx tsc --noEmit
```

checks TypeScript types.

ESLint:

```bash
npx eslint .
```

checks configured lint rules.

They solve different problems.

```text
TypeScript
   ↓
"Are these types valid?"

ESLint
   ↓
"Does this code follow our quality rules?"

Prettier
   ↓
"Is this code consistently formatted?"
```

A production TypeScript project commonly uses all three.

---

# 51. Recommended TypeScript Scripts

Add:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "typecheck": "tsc --noEmit"
  }
}
```

Now:

```bash
npm run lint
```

checks ESLint rules.

```bash
npm run lint:fix
```

fixes supported ESLint issues.

```bash
npm run format
```

formats files.

```bash
npm run format:check
```

checks formatting.

```bash
npm run typecheck
```

runs TypeScript type checking without generating JavaScript.

---

# 52. TypeScript + ESLint + Prettier

The complete relationship is:

```text
                    TypeScript Project
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
         TypeScript      ESLint      Prettier
              ↓            ↓            ↓
         Type checking   Linting    Formatting
              ↓            ↓            ↓
          "Are types     "Is code    "Is code
           valid?"       quality?"    formatted?"
              │            │            │
              └────────────┼────────────┘
                           ↓
                      Quality Code
```

---

# 53. React + TypeScript

React TypeScript files normally use:

```text
.ts
.tsx
```

Example:

```tsx
type UserProps = {
  name: string;
  age: number;
};

function User({ name, age }: UserProps) {
  return (
    <div>
      <h1>{name}</h1>
      <p>{age}</p>
    </div>
  );
}

export default User;
```

ESLint can be combined with TypeScript-aware and React-specific configurations to handle:

- TypeScript syntax
- JSX
- React-specific rules
- React Hooks rules
- TypeScript-specific rules

The complete stack becomes:

```text
ESLint
  +
typescript-eslint
  +
React ESLint configuration
  +
React Hooks rules
  +
Prettier
```

---

# 54. Node.js + TypeScript Production Workflow

```text
                 Developer
                     │
                     ↓
                Write .ts
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      Prettier     ESLint      TypeScript
          ↓          ↓          ↓
     Formatting   Linting    Type checking
          │          │          │
          └──────────┼──────────┘
                     ↓
               Local validation
                     ↓
              Husky / lint-staged
                     ↓
                    Git
                     ↓
                   CI/CD
                     ↓
              lint + typecheck
                     ↓
                   tests
                     ↓
                  build
```

---

# 55. Common TypeScript ESLint Mistakes

## Mistake 1 — Using only JavaScript rules

For TypeScript-specific behavior, use TypeScript-aware rules where appropriate:

```js
rules: {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'error',
}
```

## Mistake 2 — Thinking ESLint replaces `tsc`

It does not.

Run both:

```bash
npm run lint
npm run typecheck
```

## Mistake 3 — Enabling every strict rule immediately

Avoid:

```text
Install
↓
Enable hundreds of rules
↓
Fix hundreds of errors
```

Instead:

```text
Recommended config
       ↓
Understand errors
       ↓
Add rules gradually
       ↓
Customize for project
```

## Mistake 4 — Using `any` everywhere

Avoid:

```ts
const data: any = response;
```

when a useful type can be defined.

Prefer:

```ts
type User = {
  id: string;
  name: string;
};

const data: User = response;
```

The exact approach depends on the API boundary and runtime validation strategy.

---

# 56. TypeScript ESLint Learning Roadmap

```text
1. JavaScript ESLint
       ↓
2. ESLint flat config
       ↓
3. Prettier
       ↓
4. TypeScript basics
       ↓
5. typescript-eslint
       ↓
6. TypeScript-specific rules
       ↓
7. Type checking with tsc
       ↓
8. Type-aware ESLint rules
       ↓
9. React + TypeScript linting
       ↓
10. Node.js + TypeScript linting
       ↓
11. Husky + lint-staged
       ↓
12. CI/CD
```

---

# 57. Final TypeScript Mental Model

Memorize:

```text
               TypeScript Project
                       │
       ┌───────────────┼────────────────┐
       ↓               ↓                ↓
  TypeScript        ESLint           Prettier
       │               │                │
       ↓               ↓                ↓
 Type checking      Code quality     Formatting
       │               │                │
       ↓               ↓                ↓
    tsc             eslint           prettier
       │               │                │
       └───────────────┼────────────────┘
                       ↓
                 Production Code
```

The core rule becomes:

> **TypeScript checks types. ESLint checks code quality. Prettier formats code. Tests verify behavior. CI verifies the complete workflow.**

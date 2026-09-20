# Husky

## 1. What is Husky?

**Husky** is a tool that makes it easy to use **Git hooks** in Node.js, JavaScript, and TypeScript projects.

Git hooks are scripts that Git automatically executes when specific Git operations occur.

For example:

```text
git commit
    │
    ▼
pre-commit hook
    │
    ├── ESLint
    ├── TypeScript
    └── Prettier
    │
    ▼
Commit created
```

If a required check fails, the Git operation can be stopped.

---

# 2. Why Use Husky?

Without Husky:

```text
Developer
    │
    ├── npm run lint
    ├── npm run typecheck
    ├── npm run format:check
    └── git commit
```

The developer has to remember to run every command.

With Husky:

```text
Developer
    │
    ▼
git commit
    │
    ▼
Husky
    │
    ▼
pre-commit
    │
    ├── lint
    ├── typecheck
    └── format check
```

### Main benefits

- Automates Git checks
- Prevents known errors from entering commits
- Standardizes team workflows
- Reduces manual steps
- Integrates easily with ESLint and Prettier
- Can run tests before pushing
- Can enforce commit-message conventions

---

# 3. Git Hooks

Husky works with Git hooks.

Common Git hooks:

| Hook                 | Purpose                               |
| -------------------- | ------------------------------------- |
| `pre-commit`         | Runs before a commit is created       |
| `prepare-commit-msg` | Runs before the commit message editor |
| `commit-msg`         | Validates the commit message          |
| `post-commit`        | Runs after a commit                   |
| `pre-push`           | Runs before pushing                   |
| `post-checkout`      | Runs after checkout                   |
| `post-merge`         | Runs after merge                      |

The most commonly used hooks in Node.js projects are:

```text
pre-commit
commit-msg
pre-push
```

---

# 4. Husky Architecture

The basic architecture is:

```text
Git
 │
 │ git commit / git push
 ▼
Git Hook
 │
 ▼
Husky
 │
 ▼
Shell Script
 │
 ├── ESLint
 ├── Prettier
 ├── TypeScript
 └── Tests
```

Husky does not replace ESLint, Prettier, TypeScript, or testing tools.

It **connects Git events to commands you want to execute**.

---

# 5. Install Husky

Install Husky as a development dependency:

```bash
npm install -D husky
```

Check the installation:

```bash
npm list husky
```

Example:

```text
husky@9.x.x
```

---

# 6. Initialize Husky

Run:

```bash
npx husky init
```

This initializes Husky in the repository.

It creates:

```text
.husky/
└── pre-commit
```

It also adds the `prepare` script to `package.json`.

Example:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

---

# 7. What is `prepare`?

`prepare` is an npm lifecycle script.

Example:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

When npm runs the appropriate installation lifecycle, the `prepare` script invokes Husky.

Conceptually:

```text
npm install
    │
    ▼
prepare
    │
    ▼
husky
    │
    ▼
Git hook setup
```

This is useful when another developer clones the repository.

They can run:

```bash
npm install
```

and the project's Husky setup can be initialized automatically.

---

# 8. Run Husky

Husky can also be invoked directly:

```bash
npx husky
```

This ensures the Husky hook mechanism is configured.

---

# 9. Verify Git Configuration

Check Git's configured hooks path:

```bash
git config core.hooksPath
```

Expected output for a Husky 9 setup is typically:

```text
.husky/_
```

This tells Git where Husky's hook machinery is located.

---

# 10. Verify the Hook

PowerShell:

```powershell
Get-Content .husky/pre-commit
```

You can also inspect the directory:

```powershell
Get-ChildItem .husky
```

Expected:

```text
.husky/
└── pre-commit
```

---

# 11. Configure `pre-commit`

Open:

```text
.husky/pre-commit
```

Example:

```sh
npm run lint
npm run typecheck
npm run format:check
```

Now:

```bash
git commit
```

triggers those commands.

---

# 12. Pre-Commit Lifecycle

Suppose you run:

```bash
git commit -m "feat: add authentication"
```

The flow becomes:

```text
git commit
    │
    ▼
Git
    │
    ▼
pre-commit
    │
    ▼
npm run lint
    │
    ▼
npm run typecheck
    │
    ▼
npm run format:check
    │
    ▼
All successful
    │
    ▼
Commit created
```

If a command fails:

```text
git commit
    │
    ▼
pre-commit
    │
    ▼
lint
    │
    ▼
❌ failure
    │
    ▼
Commit aborted
```

---

# 13. Exit Codes

Git hooks depend on process exit codes.

Successful command:

```text
exit code 0
```

Failed command:

```text
exit code != 0
```

For example:

```bash
npm run lint
```

If ESLint finds an error, it normally returns a non-zero exit code.

That causes the hook to fail.

Therefore:

```text
ESLint fails
    ↓
pre-commit fails
    ↓
Git stops commit
```

---

# 14. Multiple Commands in a Hook

Example:

```sh
npm run lint
npm run typecheck
npm run format:check
```

The commands execute sequentially.

```text
lint
 ↓
typecheck
 ↓
format:check
```

If the first command fails, the subsequent commands normally won't be reached.

---

# 15. Recommended `package.json`

For your current project:

```json
{
  "name": "passportjs",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",

    "typecheck": "tsc --noEmit",

    "lint": "eslint .",
    "lint:fix": "eslint . --fix",

    "format": "prettier . --write",
    "format:check": "prettier . --check",

    "prepare": "husky"
  }
}
```

---

# 16. Recommended Pre-Commit Hook

```text
.husky/pre-commit
```

```sh
npm run lint
npm run typecheck
npm run format:check
```

---

# 17. Testing Husky

Create an intentional ESLint error:

```ts
const a = 10;
```

Run:

```bash
git add .
```

Then:

```bash
git commit -m "test: husky"
```

Expected:

```text
npm run lint

error  'a' is assigned a value but never used
```

The commit should fail.

After fixing the code:

```bash
git add .
git commit -m "test: husky"
```

The commit should succeed if all checks pass.

---

# 18. Pre-Push Hook

Husky can also run checks before pushing.

Create:

```text
.husky/pre-push
```

Example:

```sh
npm run typecheck
npm run lint
npm test
```

Flow:

```text
git push
    │
    ▼
pre-push
    │
    ├── typecheck
    ├── lint
    └── tests
    │
    ▼
Push
```

This is useful for checks that are more expensive than normal pre-commit checks.

---

# 19. Commit Message Hook

Git provides a `commit-msg` hook.

Example:

```text
.husky/commit-msg
```

This hook can be used to validate commit messages.

Example convention:

```text
feat: add login
fix: resolve authentication bug
docs: update Husky documentation
refactor: simplify auth middleware
test: add login tests
chore: update dependencies
```

The general structure is:

```text
type: description
```

A commit-message validation tool such as Commitlint can be connected through this hook.

---

# 20. `pre-commit` vs `pre-push`

### `pre-commit`

Runs before a commit.

Good for:

```text
ESLint
Prettier
Fast checks
lint-staged
```

### `pre-push`

Runs before pushing.

Good for:

```text
TypeScript
Tests
Integration tests
Build checks
```

Example:

```text
pre-commit
    │
    ├── ESLint
    └── Prettier

pre-push
    │
    ├── TypeScript
    ├── Tests
    └── Build
```

---

# 21. Husky + lint-staged

For small projects:

```sh
npm run lint
```

is acceptable.

For large projects, running ESLint over the entire repository on every commit can be unnecessarily expensive.

`lint-staged` runs commands only on staged files.

Install:

```bash
npm install -D lint-staged
```

Concept:

```text
Modified files
      │
      ▼
git add
      │
      ▼
Staged files
      │
      ▼
lint-staged
      │
      ├── ESLint
      └── Prettier
```

Then:

```text
.husky/pre-commit
```

can contain:

```sh
npx lint-staged
```

---

# 22. Example lint-staged Configuration

In `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

Then:

```text
.husky/pre-commit
```

```sh
npx lint-staged
```

This checks only staged files.

---

# 23. Husky and CI/CD

Husky should not replace CI/CD.

Use Husky for **local developer feedback**.

Use CI for **authoritative repository validation**.

```text
Developer
    │
    ▼
git commit
    │
    ▼
Husky
    │
    ├── ESLint
    └── Prettier
    │
    ▼
git push
    │
    ▼
CI/CD
    │
    ├── ESLint
    ├── TypeScript
    ├── Tests
    ├── Build
    └── Security checks
```

Why both?

Husky can be bypassed:

```bash
git commit --no-verify
```

CI provides an independent validation layer.

---

# 24. Bypassing Hooks

Git supports:

```bash
git commit --no-verify
```

This skips commit hooks.

Similarly:

```bash
git push --no-verify
```

can bypass push hooks.

Avoid using these routinely.

If the hook is frequently blocking legitimate work, improve the hook instead of routinely bypassing it.

---

# 25. Git Line Endings

On Windows, you may see:

```text
warning: LF will be replaced by CRLF
```

This is a Git line-ending warning.

You can standardize project files with:

```text
.gitattributes
```

Example:

```gitattributes
* text=auto

*.js text eol=lf
*.ts text eol=lf
*.json text eol=lf
*.md text eol=lf
*.sh text eol=lf

.husky/* text eol=lf
```

This is particularly useful for shell-based Git hooks.

---

# 26. Troubleshooting

## Hook does not run

Check:

```bash
git config core.hooksPath
```

Then inspect:

```powershell
Get-Content .husky/pre-commit
```

---

## Check Husky installation

```bash
npm list husky
```

---

## Check Git

```bash
git --version
```

---

## Check repository

```bash
git status
```

If the directory is not a Git repository:

```bash
git init
```

---

## Check the hook file

```powershell
Get-ChildItem .husky
```

Expected:

```text
pre-commit
```

---

## Test the command without Husky

Before debugging Husky, test the command itself:

```bash
npm run lint
```

Then:

```bash
npm run typecheck
```

Then:

```bash
npm run format:check
```

If these commands don't work independently, Husky is not the underlying problem.

---

# 27. Complete Setup

### Install

```bash
npm install -D husky
```

### Initialize

```bash
npx husky init
```

### Run Husky

```bash
npx husky
```

### Verify Git

```bash
git config core.hooksPath
```

Expected:

```text
.husky/_
```

### Configure pre-commit

```text
.husky/pre-commit
```

```sh
npm run lint
npm run typecheck
npm run format:check
```

### Verify hook

```powershell
Get-Content .husky/pre-commit
```

### Test

```bash
git add .
git commit -m "test: verify husky"
```

---

# 28. Project Structure

```text
passportjs/
│
├── src/
│   └── index.ts
│
├── .husky/
│   ├── pre-commit
│   └── pre-push
│
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── tsconfig.json
├── package.json
├── package-lock.json
└── .gitignore
```

---

# 29. Recommended Workflow

### Development

```bash
npm run dev
```

### Before commit

```text
git add .
    ↓
git commit
    ↓
Husky
    ↓
ESLint
    ↓
TypeScript
    ↓
Prettier
    ↓
Commit
```

### Before push

```text
git push
    ↓
Husky pre-push
    ↓
Tests
    ↓
TypeScript
    ↓
Build
    ↓
Push
```

### CI

```text
Push
    ↓
CI/CD
    ├── Install
    ├── Lint
    ├── Typecheck
    ├── Test
    └── Build
```

---

# 30. Quick Reference

## Install

```bash
npm install -D husky
```

## Initialize

```bash
npx husky init
```

## Run Husky

```bash
npx husky
```

## Verify Git

```bash
git config core.hooksPath
```

## Verify hook

```powershell
Get-Content .husky/pre-commit
```

## Pre-commit

```sh
npm run lint
npm run typecheck
npm run format:check
```

## Pre-push

```sh
npm run typecheck
npm test
npm run build
```

## Bypass

```bash
git commit --no-verify
```

Use only when necessary.

---

# 31. Final Mental Model

```text
                    Git
                     │
          ┌──────────┴──────────┐
          │                     │
       commit                  push
          │                     │
          ▼                     ▼
    pre-commit              pre-push
          │                     │
       Husky                  Husky
          │                     │
    ┌─────┴─────┐         ┌────┴─────┐
    │     │     │         │          │
  ESLint TS  Prettier   Tests     Build
    │     │     │         │          │
    └─────┴─────┘         └────┬─────┘
          │                    │
          ▼                    ▼
       Commit                 Push
```

**Husky's role is simple:**

```text
Git Event
    ↓
Husky
    ↓
Your Commands
    ↓
Pass → Continue
Fail → Stop
```

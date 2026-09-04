# `git init`

`git init` creates a new Git repository or reinitializes an existing directory as a Git repository.

It is the command used when you already have a directory and want Git to start tracking its history.

---

# 1. Basic Syntax

```cmd
git init
```

Run it inside a directory:

```cmd
mkdir my-project
cd my-project
git init
```

Git creates a hidden:

```text
.git/
```

directory.

---

# 2. What `git init` Actually Creates

Conceptually:

```text
my-project/
│
├── .git/
│   ├── HEAD
│   ├── config
│   ├── description
│   ├── hooks/
│   ├── info/
│   ├── objects/
│   ├── refs/
│   └── ...
│
└── project files
```

The `.git` directory is the repository's internal database and configuration area.

---

# 3. `git init` Does Not Create a Commit

Running:

```cmd
git init
```

does **not** automatically create:

```text
commit
```

It only initializes the repository.

After initialization:

```cmd
git status
```

may show:

```text
No commits yet
```

You still need:

```cmd
git add .
git commit -m "Initial commit"
```

---

# 4. Basic Initialization Workflow

```cmd
mkdir my-project
cd my-project

git init

git status

git add .

git commit -m "Initial commit"
```

The lifecycle is:

```text
directory
   │
   │ git init
   ▼
Git repository
   │
   │ git add
   ▼
staging area
   │
   │ git commit
   ▼
first commit
```

---

# 5. Initialize the Current Directory

```cmd
git init
```

The current directory becomes the working tree of the new repository.

Example:

```text
C:\projects\my-app
```

Run:

```cmd
git init
```

Git creates:

```text
C:\projects\my-app\.git
```

---

# 6. Initialize a Specific Directory

Syntax:

```cmd
git init <directory>
```

Example:

```cmd
git init my-project
```

This creates or initializes:

```text
my-project/
```

without requiring you to first enter that directory.

---

# 7. Initialize With a Custom Git Directory

The `--separate-git-dir` option allows the Git directory to be stored somewhere else.

```cmd
git init --separate-git-dir=<git-dir>
```

Example:

```cmd
git init --separate-git-dir=C:\git-data\my-project.git
```

The working tree and Git metadata are then separated.

This is an advanced repository-layout feature.

---

# 8. What Is `.git`?

For a normal non-bare repository:

```text
working tree
      │
      ▼
project files

.git
      │
      ├── repository database
      ├── references
      ├── configuration
      ├── index
      └── HEAD
```

The working tree contains your files.

`.git` contains Git's repository metadata and object database.

---

# 9. Check Whether a Directory Is a Repository

Run:

```cmd
git status
```

If the current directory is inside a Git working tree, Git will report repository state.

You can also use:

```cmd
git rev-parse --is-inside-work-tree
```

Expected:

```text
true
```

---

# 10. Find the Repository Root

```cmd
git rev-parse --show-toplevel
```

Example:

```text
C:/projects/my-project
```

This is particularly useful when you are inside nested directories.

---

# 11. Find the Git Directory

```cmd
git rev-parse --git-dir
```

For a standard repository this commonly returns:

```text
.git
```

For a repository using a separate Git directory, it can return another location.

---

# 12. Initialize an Existing Directory

You do not need an empty directory.

For example:

```text
my-project/
├── index.html
├── app.js
└── README.md
```

Run:

```cmd
git init
```

Git adds repository metadata without deleting your existing files.

Then:

```cmd
git status
```

will identify files that are not yet tracked.

---

# 13. `git init` Does Not Track Existing Files

Suppose:

```text
my-project/
├── app.js
└── README.md
```

After:

```cmd
git init
```

the files are not automatically staged.

You must explicitly stage them:

```cmd
git add .
```

Then:

```cmd
git commit -m "Initial commit"
```

---

# 14. Initialize and Inspect

```cmd
git init
git status
```

Typical conceptual state:

```text
No commits yet

Untracked files:
    app.js
    README.md
```

The files exist in the working tree but are not yet part of a commit.

---

# 15. Default Branch

Modern Git can initialize a repository with a configured initial branch name.

For example:

```cmd
git init -b main
```

This creates the repository with:

```text
main
```

as the initial branch name.

However, the branch does not yet contain a commit.

---

# 16. `-b` / `--initial-branch`

Syntax:

```cmd
git init -b <branch-name>
```

or:

```cmd
git init --initial-branch=<branch-name>
```

Example:

```cmd
git init -b main
```

Another example:

```cmd
git init -b develop
```

The initial branch name is established before the first commit.

---

# 17. Configure the Default Initial Branch Globally

Instead of specifying:

```cmd
git init -b main
```

every time, configure Git:

```cmd
git config --global init.defaultBranch main
```

Now:

```cmd
git init
```

uses:

```text
main
```

as the initial branch.

Check:

```cmd
git config --global --get init.defaultBranch
```

---

# 18. Repository Configuration

After initialization, repository configuration is stored in:

```text
.git/config
```

Inspect:

```cmd
git config --local --list
```

or:

```cmd
git config --local --list --show-origin
```

Repository-specific configuration applies only to that repository.

---

# 19. Global vs Local Configuration

Git has multiple configuration scopes.

Common scopes:

```text
system
global
local
worktree
command
```

For initialization, an important setting is:

```text
init.defaultBranch
```

Global:

```cmd
git config --global init.defaultBranch main
```

Local repository configuration:

```cmd
git config --local init.defaultBranch main
```

The local setting affects that repository's configuration.

---

# 20. Reinitializing a Repository

Running:

```cmd
git init
```

inside an existing Git repository does not create a second independent history.

It reinitializes the existing repository.

Example:

```cmd
git init
```

may report that the repository has been reinitialized.

Your existing commits are not normally recreated simply because you ran `git init` again.

---

# 21. Reinitialization Is Not `git reset`

These are completely different operations.

```text
git init
```

initializes or reinitializes repository metadata.

```text
git reset
```

moves references and/or changes the index and working tree depending on mode.

Do not use `git init` when you actually want to undo commits.

---

# 22. Reinitialize an Existing Repository With a Different Branch Name

If you want to change the current branch name, do not rely on re-running `git init`.

Use:

```cmd
git branch -M main
```

for an existing branch.

`git init -b main` is primarily useful when creating a new repository before its first commit.

---

# 23. Bare Repository

A bare repository has no normal working tree.

Initialize:

```cmd
git init --bare
```

Example:

```cmd
mkdir project.git
cd project.git
git init --bare
```

The result is conceptually:

```text
project.git/
├── HEAD
├── config
├── objects/
├── refs/
├── hooks/
└── ...
```

There is no normal:

```text
project.git/
└── project files
```

working tree.

---

# 24. `--bare`

Syntax:

```cmd
git init --bare
```

A bare repository is commonly used as:

```text
central Git repository
server-side repository
repository receiving pushes
```

It is not normally used as the directory where you edit project files.

---

# 25. Normal vs Bare Repository

Normal:

```text
project/
├── .git/
└── source files
```

Bare:

```text
project.git/
├── HEAD
├── objects/
├── refs/
└── config
```

Normal repository:

```text
repository + working tree
```

Bare repository:

```text
repository only
```

---

# 26. Shared Bare Repository

An advanced option is:

```cmd
git init --bare --shared
```

The `--shared` option adjusts repository configuration and permissions for shared use.

Possible forms include:

```cmd
git init --shared
git init --shared=group
git init --shared=all
```

The exact filesystem permission behavior depends on the operating system and environment.

---

# 27. `--shared`

Syntax:

```cmd
git init --shared[=<permissions>]
```

Possible permission modes include:

```text
false
true
umask
group
all
world
everybody
0xxx
```

The purpose is to configure a repository intended for shared access.

On Windows, filesystem permission behavior differs from traditional Unix environments, so do not assume Unix permission semantics map directly to Windows.

---

# 28. Separate Git Directory

Advanced syntax:

```cmd
git init --separate-git-dir <git-dir>
```

Example:

```cmd
mkdir my-project
git init --separate-git-dir=C:\git-repositories\my-project.git my-project
```

Conceptually:

```text
C:\projects\my-project\
    │
    └── working tree

C:\git-repositories\my-project.git\
    │
    └── Git repository data
```

This separates the working files from repository metadata.

---

# 29. `.git` File With Separate Git Directory

When Git metadata is separated, the working tree may contain a `.git` file rather than a `.git` directory.

Conceptually:

```text
my-project/
├── .git          ← file pointing to actual Git directory
├── app.js
└── README.md
```

The actual repository metadata exists elsewhere.

This is different from the normal:

```text
.git/
```

directory.

---

# 30. `--object-format`

Modern Git can initialize repositories using a specified object hash algorithm.

Syntax:

```cmd
git init --object-format=<format>
```

Common format:

```cmd
git init --object-format=sha1
```

Git also supports repositories using:

```text
sha256
```

where supported by the Git ecosystem and workflow.

---

# 31. SHA-1 vs SHA-256

Traditional Git repositories use:

```text
SHA-1
```

Git supports:

```text
SHA-256
```

as an alternative object format.

This is a repository-level architectural decision.

Do not casually choose SHA-256 for a repository intended to interoperate with tooling or hosting systems that do not support it.

---

# 32. Check Object Format

After initialization:

```cmd
git rev-parse --show-object-format
```

Possible result:

```text
sha1
```

or:

```text
sha256
```

---

# 33. `--ref-format`

Modern Git versions can support different reference storage formats.

Syntax:

```cmd
git init --ref-format=<format>
```

The exact available formats depend on your installed Git version.

The reference format determines how Git stores references internally.

For compatibility-sensitive repositories, use the default unless you specifically understand the implications.

---

# 34. Check Git Version

Before relying on advanced `git init` options:

```cmd
git --version
```

Example:

```text
git version 2.x.x
```

Git features and options can differ between versions.

---

# 35. Template Directory

Git can initialize a repository from a template directory.

Syntax:

```cmd
git init --template=<template-directory>
```

or:

```cmd
git init -t <template-directory>
```

A template directory can provide initial repository files such as:

```text
hooks
configuration templates
repository metadata
```

---

# 36. Default Template Directory

Git normally has a configured template mechanism.

Inspect:

```cmd
git config --show-origin --get init.templateDir
```

If configured, Git can use that directory when initializing repositories.

---

# 37. Custom Template

Example:

```cmd
git init --template=C:\git-templates\project
```

This allows organization-specific initialization behavior.

For example, a team could maintain templates containing predefined hooks or repository setup files.

---

# 38. `GIT_TEMPLATE_DIR`

Git also recognizes environment configuration for template behavior.

In Windows CMD:

```cmd
set GIT_TEMPLATE_DIR=C:\git-templates
```

Then:

```cmd
git init
```

can use that template location.

Environment configuration is process-specific unless configured persistently through the operating system.

---

# 39. Initialization Does Not Connect to GitHub

Running:

```cmd
git init
```

does not automatically create:

```text
GitHub repository
```

and does not automatically configure:

```text
origin
```

You must configure a remote separately:

```cmd
git remote add origin <repository-url>
```

---

# 40. Local Repository + Remote

Typical workflow:

```cmd
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin <repository-url>
git push -u origin main
```

The responsibilities are different:

```text
git init
    ↓
create local repository

git remote add
    ↓
configure remote

git push
    ↓
publish commits
```

---

# 41. `git init` and Existing `.git`

If:

```text
project/
└── .git/
```

already exists, running:

```cmd
git init
```

does not normally create another repository inside it.

Git recognizes the existing repository.

---

# 42. Nested Repositories

Suppose:

```text
project/
├── .git/
└── library/
    └── .git/
```

Now there are two independent Git repositories.

The inner repository:

```text
library/.git
```

has its own history.

Git does not automatically combine the two repositories.

This is an important reason to understand repository boundaries.

---

# 43. Find Repository Boundary

From a directory:

```cmd
git rev-parse --show-toplevel
```

Git searches upward to find the repository root.

If the directory is not inside a repository, Git reports an error.

---

# 44. `GIT_DIR`

Git can explicitly use a Git directory through the environment:

```cmd
set GIT_DIR=C:\repositories\project.git
```

Then Git commands can operate using that repository metadata.

This is an advanced mechanism.

---

# 45. `GIT_WORK_TREE`

You can also specify the working tree:

```cmd
set GIT_WORK_TREE=C:\projects\project
```

Combined with `GIT_DIR`, Git can operate with separated repository and working-tree locations.

Conceptually:

```text
GIT_DIR
   │
   ▼
repository metadata

GIT_WORK_TREE
   │
   ▼
working files
```

---

# 46. `--separate-git-dir` vs Environment Variables

These solve related but different configuration problems.

```text
--separate-git-dir
```

creates/configures a persistent relationship between the working tree and Git directory.

```text
GIT_DIR
GIT_WORK_TREE
```

are environment-level ways of telling Git where repository and working-tree data are located for command execution.

---

# 47. Repository Initialization Is Local

`git init` primarily changes the local filesystem.

It does not:

```text
upload files
create commits
push code
create GitHub repositories
merge branches
stage files
```

It initializes repository metadata.

---

# 48. What `git init` Does Not Do

```text
git init
```

does NOT automatically:

```text
❌ git add
❌ git commit
❌ git push
❌ git remote add
❌ create GitHub repository
❌ upload project files
❌ create project history
```

It prepares the directory for Git operations.

---

# 49. Initialization State

Immediately after:

```cmd
git init -b main
```

you can think of the repository as:

```text
HEAD
 │
 ▼
main
 │
 ▼
no commit yet

working tree
 │
 ▼
project files

index
 │
 ▼
initially empty
```

After:

```cmd
git add .
```

the index contains the staged snapshot.

After:

```cmd
git commit -m "Initial commit"
```

the branch points to the first commit.

---

# 50. Initial Branch Before First Commit

Before the first commit, the branch reference may not yet resolve to an actual commit.

Conceptually:

```text
HEAD
 │
 ▼
refs/heads/main
 │
 ▼
unborn branch
 │
 └── no commit yet
```

This is often called an **unborn branch**.

---

# 51. `HEAD` After Initialization

Check:

```cmd
git symbolic-ref HEAD
```

Possible result:

```text
refs/heads/main
```

This means:

```text
HEAD → main
```

but `main` may not yet point to a commit.

---

# 52. Create Repository With `main`

Recommended explicit initialization:

```cmd
git init -b main
```

Then:

```cmd
git symbolic-ref --short HEAD
```

Output:

```text
main
```

---

# 53. Initialization With an Existing Project

Example:

```cmd
cd C:\projects\my-app
git init -b main
git status
```

Then:

```cmd
git add .
git status
```

Then:

```cmd
git commit -m "Initial commit"
```

This converts an existing project directory into a Git-managed project.

---

# 54. `.gitignore` During Initialization

`git init` does not automatically create a `.gitignore`.

You may create one separately:

```cmd
type nul > .gitignore
```

Then configure patterns.

Example:

```text
node_modules/
dist/
.env
```

Then:

```cmd
git add .
```

Git will respect the ignore rules.

The `.gitignore` file itself can be committed.

---

# 55. Initialization and Git Hooks

A repository can contain:

```text
.git/hooks/
```

Git provides sample hooks in many installations.

Hooks can be used for repository workflows such as:

```text
pre-commit
commit-msg
post-commit
pre-push
```

`git init` prepares the repository's hooks structure.

Actual hook behavior depends on which hooks are configured and executable.

---

# 56. Initialization and Object Database

The repository contains an object database under:

```text
.git/objects/
```

Git stores objects such as:

```text
blob
tree
commit
tag
```

However, immediately after `git init`, your project files are not automatically stored as committed Git objects simply because the repository was initialized.

Objects are created as Git operations require them.

---

# 57. Initialization and Index

The index is the staging area.

It is commonly stored as:

```text
.git/index
```

A newly initialized repository may not have an index populated with project files.

After:

```cmd
git add .
```

Git builds/updates the index.

---

# 58. Initialization and References

References are stored under structures such as:

```text
refs/heads/
refs/tags/
refs/remotes/
```

Immediately after initialization, there may not yet be commits or normal branch references pointing to commit objects.

After the first commit:

```text
refs/heads/main
        │
        ▼
    commit object
```

---

# 59. Initialization and `HEAD`

`HEAD` identifies the current checked-out reference.

For a new repository:

```text
HEAD
 ↓
main
 ↓
no commit yet
```

After the first commit:

```text
HEAD
 ↓
main
 ↓
abc123...
```

This distinction is important when understanding Git's internal reference model.

---

# 60. `git init` vs `git clone`

Use:

```cmd
git init
```

when you have an existing directory and want to create a new Git repository.

Use:

```cmd
git clone <url>
```

when you want to obtain an existing repository.

Conceptually:

```text
git init
existing directory
      ↓
new repository
```

while:

```text
git clone
remote repository
      ↓
local repository
```

---

# 61. `git init` vs `git clone` — History

`git init`:

```text
new history
```

No existing commits are obtained from elsewhere.

`git clone`:

```text
existing history
```

is downloaded from the source repository.

---

# 62. Common Mistake: Running `git init` in the Wrong Directory

Suppose you intended:

```text
C:\projects\my-app
```

but accidentally run:

```cmd
cd C:\projects
git init
```

Now:

```text
C:\projects\.git
```

may become the repository root.

This can cause all projects beneath it to appear inside one repository.

Check your repository root:

```cmd
git rev-parse --show-toplevel
```

If it is wrong, carefully remove the unintended `.git` directory only if you are certain it is the incorrect repository.

---

# 63. Dangerous Cleanup of Accidental Initialization

If you accidentally initialized:

```text
C:\projects\.git
```

and you are certain that repository should not exist, remove the `.git` directory.

In Windows CMD:

```cmd
rmdir /s /q .git
```

**Do not run this unless you have verified that `.git` is the repository you intend to remove.**

Removing `.git` removes the repository metadata and local Git history from that directory.

---

# 64. Verify Before Removing `.git`

First:

```cmd
git rev-parse --show-toplevel
```

Then inspect:

```cmd
dir /a
```

If `.git` is present, verify the location carefully before deleting anything.

A safer principle is:

```text
inspect → verify → delete
```

not:

```text
delete → discover mistake
```

---

# 65. Advanced Repository Initialization Checklist

Before initializing:

```cmd
cd <project>
```

Verify location:

```cmd
cd
```

Check whether a repository already exists:

```cmd
git rev-parse --show-toplevel
```

If creating a new repository:

```cmd
git init -b main
```

Verify:

```cmd
git status
git symbolic-ref --short HEAD
git rev-parse --git-dir
```

Then begin normal Git workflow:

```cmd
git add .
git commit -m "Initial commit"
```

---

# 66. Important Options

The major `git init` options are:

```text
-b <branch>
--initial-branch=<branch>

--bare

--shared[=<permissions>]

--separate-git-dir=<git-dir>

--template=<template-directory>
-t <template-directory>

--object-format=<format>

--ref-format=<format>
```

Some options depend on your Git version.

Use:

```cmd
git init -h
```

to inspect options supported by your installed Git.

---

# 67. Command Syntax Reference

```text
git init [-q | --quiet]
         [--bare]
         [--template=<template-directory>]
         [--separate-git-dir <git-dir>]
         [--object-format=<format>]
         [--ref-format=<format>]
         [-b <branch-name> | --initial-branch=<branch-name>]
         [--shared[=<permissions>]]
         [<directory>]
```

The exact displayed syntax may vary slightly by Git version.

---

# 68. Practical Examples

## New repository

```cmd
mkdir project
cd project
git init
```

## New repository with `main`

```cmd
mkdir project
cd project
git init -b main
```

## Existing project

```cmd
cd my-existing-project
git init -b main
```

## Bare repository

```cmd
git init --bare project.git
```

## Separate Git directory

```cmd
git init --separate-git-dir=C:\git-data\project.git project
```

## Custom template

```cmd
git init --template=C:\git-templates\project project
```

## Specific object format

```cmd
git init --object-format=sha256 project
```

---

# 69. Diagnostic Commands

After initialization:

```cmd
git status
```

Repository root:

```cmd
git rev-parse --show-toplevel
```

Git directory:

```cmd
git rev-parse --git-dir
```

Working tree:

```cmd
git rev-parse --is-inside-work-tree
```

HEAD:

```cmd
git symbolic-ref HEAD
```

Short HEAD:

```cmd
git symbolic-ref --short HEAD
```

Object format:

```cmd
git rev-parse --show-object-format
```

Repository configuration:

```cmd
git config --local --list
```

---

# 70. Final Mental Model

`git init` transforms a directory from:

```text
ordinary directory
```

into:

```text
Git working tree
      +
Git repository metadata
```

Conceptually:

```text
Before

project/
├── app.js
└── README.md


              git init


After

project/
├── .git/
│   ├── HEAD
│   ├── config
│   ├── objects/
│   ├── refs/
│   └── ...
├── app.js
└── README.md
```

Then:

```text
git add
    ↓
index

git commit
    ↓
commit

git branch
    ↓
reference

git remote
    ↓
remote configuration

git push
    ↓
remote repository
```

---

# 71. Rules to Remember

```text
1. git init creates or reinitializes a Git repository.

2. git init does not create a commit.

3. git init does not automatically stage files.

4. git init does not automatically create a remote.

5. git init does not upload anything.

6. Existing files are not automatically tracked.

7. git init -b main creates the initial branch as main.

8. init.defaultBranch can configure the default initial
   branch globally.

9. --bare creates a repository without a working tree.

10. --separate-git-dir separates repository metadata from
    the working tree.

11. --template allows initialization from a template.

12. --object-format controls the repository object hash
    format.

13. Re-running git init inside a repository reinitializes
    the existing repository rather than creating a second
    history.

14. git init and git reset are completely different
    operations.

15. Always verify your current directory before running
    git init.

16. git rev-parse --show-toplevel identifies the repository
    root.

17. HEAD can point to an unborn branch before the first
    commit.

18. A normal repository contains a working tree and a Git
    directory.

19. A bare repository contains repository data without a
    normal working tree.

20. git init is repository initialization—not version
    history creation itself.
```

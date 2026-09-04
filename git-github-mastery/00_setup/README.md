# Git & GitHub Mastery — Setup

This section prepares the machine and Git environment before learning Git itself.

The goal is not merely to install Git, but to understand:

- What Git is
- How Git is installed
- How Git is configured
- How Git identifies the author of commits
- How Git stores configuration
- How to verify the installation
- How to inspect the current Git environment
- How to create the first repository
- How Git's command structure works
- How Git discovers a repository
- How Git configuration scopes work
- How Git behaves before and after initialization

---

# 1. What Is Git?

Git is a **distributed version control system (DVCS)**.

It records changes to files as a sequence of snapshots called **commits**.

Git allows you to:

- Track changes
- Create branches
- Merge independent lines of development
- Compare versions
- Revert changes
- Recover deleted or lost commits
- Work offline
- Collaborate with other developers
- Maintain complete project history

Git is distributed because every normal clone contains the repository's history locally.

A Git repository is therefore not simply a folder containing source code.

It contains:

```text
Working Files
     ↓
Git Index
     ↓
Git Object Database
     ↓
References
```

The `.git` directory contains the metadata and database that allow Git to manage the repository.

---

# 2. Git vs GitHub

Git and GitHub are different things.

## Git

Git is the version-control software.

Example:

```bash
git init
git add .
git commit -m "Initial commit"
git branch
git merge
```

These commands can work without GitHub.

## GitHub

GitHub is a hosted platform built around Git repositories.

It provides features such as:

- Remote repositories
- Pull requests
- Code review
- Issues
- Releases
- Actions
- Repository permissions
- Collaboration

The relationship is:

```text
Git
 │
 ├── Local repository
 ├── Commits
 ├── Branches
 ├── Tags
 └── History
       │
       │ push / fetch
       ▼
    GitHub
       │
       ├── Remote repository
       ├── Pull Requests
       ├── Issues
       └── Actions
```

Git does not require GitHub.

GitHub does use Git.

---

# 3. Git Installation

After installing Git, the `git` executable should be available from the terminal.

Verify it:

```bash
git --version
```

Example:

```text
git version 2.x.x
```

The exact version depends on the installed Git release.

---

# 4. Checking Where Git Is Installed

On Windows:

```powershell
where.exe git
```

This shows the executable locations available through `PATH`.

Example:

```text
C:\Program Files\Git\cmd\git.exe
```

You can also ask Git for its executable path:

```bash
git --exec-path
```

This displays the directory containing Git's core executable programs.

---

# 5. Understanding PATH

`PATH` is an operating-system environment variable containing directories where executable programs can be found.

When you run:

```bash
git
```

Windows searches directories listed in `PATH`.

Conceptually:

```text
git
 ↓
Windows PATH
 ↓
Git executable
 ↓
Git starts
```

If Git is not available from the terminal, the installation may not have added Git to `PATH`, or the terminal may need to be restarted.

---

# 6. Git Command Structure

Git commands generally follow this structure:

```bash
git <command> [options] [arguments]
```

Example:

```bash
git status
```

Here:

```text
git       → Git executable
status    → Git command
```

Another example:

```bash
git commit -m "Add authentication"
```

Here:

```text
git       → executable
commit    → command
-m        → option
"Add authentication" → option value
```

Another example:

```bash
git log --oneline --graph --decorate
```

The command is:

```text
log
```

and the options are:

```text
--oneline
--graph
--decorate
```

---

# 7. Getting Help

Git contains built-in documentation.

General help:

```bash
git help
```

Command-specific help:

```bash
git help commit
```

Short manual page:

```bash
git commit -h
```

For example:

```bash
git status -h
```

The difference is important.

```text
git <command> -h
```

usually displays concise command usage.

```text
git help <command>
```

opens the detailed documentation.

---

# 8. Git Version Information

Basic version:

```bash
git --version
```

More detailed information can be obtained using:

```bash
git version --build-options
```

Git also supports:

```bash
git version
```

which reports the Git version.

---

# 9. Initial Git Identity Configuration

Git records an author identity in commits.

Configure your name:

```bash
git config --global user.name "Your Name"
```

Configure your email:

```bash
git config --global user.email "you@example.com"
```

Example:

```bash
git config --global user.name "Shiva Ram"
git config --global user.email "you@example.com"
```

These values become the default identity for repositories on the machine.

---

# 10. Why user.name and user.email Matter

A Git commit contains author and committer information.

Conceptually:

```text
Commit
├── author
│   ├── name
│   └── email
│
├── committer
│   ├── name
│   └── email
│
├── timestamp
├── message
├── parent
└── tree
```

The identity is stored in the commit metadata.

Changing your Git configuration later does **not** automatically change old commits.

Old commits retain the identity that was recorded when those commits were created.

---

# 11. Git Configuration Levels

Git has multiple configuration scopes.

The three primary scopes are:

```text
system
global
local
```

There is also:

```text
worktree
```

for repositories using worktree-specific configuration.

The general hierarchy is:

```text
System
   ↓
Global
   ↓
Local
   ↓
Worktree
```

More specific configuration can override less specific configuration.

---

# 12. System Configuration

System configuration applies to the Git installation or machine.

Example:

```bash
git config --system --list
```

System configuration generally requires administrator privileges on Windows.

Do not modify system configuration unless you understand why the change is required.

---

# 13. Global Configuration

Global configuration applies to the current user.

Example:

```bash
git config --global --list
```

Set a value:

```bash
git config --global user.name "Shiva Ram"
```

Get a value:

```bash
git config --global user.name
```

Remove a value:

```bash
git config --global --unset user.name
```

Global configuration is commonly used for:

- Name
- Email
- Default branch name
- Editor
- Aliases
- Credential behavior
- Diff configuration

---

# 14. Local Configuration

Local configuration belongs to one repository.

First enter a Git repository:

```bash
cd my-project
```

Then:

```bash
git config --local --list
```

Set a repository-specific value:

```bash
git config --local user.name "Project Author"
```

The local configuration is stored inside:

```text
.git/config
```

This means different repositories can use different configuration.

---

# 15. Configuration Precedence

Suppose you have:

```text
Global:
user.name = Shiva Ram
```

and inside one repository:

```text
Local:
user.name = Company Account
```

Git uses:

```text
Company Account
```

for that repository because local configuration is more specific.

Conceptually:

```text
system
   ↓
global
   ↓
local
   ↓
worktree
```

More specific values override broader values.

---

# 16. Inspecting Configuration

Show all configuration:

```bash
git config --list
```

Show global configuration:

```bash
git config --global --list
```

Show local configuration:

```bash
git config --local --list
```

Show where each configuration value came from:

```bash
git config --list --show-origin
```

This is extremely useful when debugging unexpected Git behavior.

For example, if an unexpected username is being used:

```bash
git config --list --show-origin
```

can reveal which configuration file supplied it.

---

# 17. Configuration Files

Git commonly reads configuration from multiple locations.

Conceptually:

```text
System configuration
        ↓
Global configuration
        ↓
Local repository configuration
        ↓
Worktree configuration
```

On Windows, global configuration is commonly associated with:

```text
%USERPROFILE%\.gitconfig
```

Repository-specific configuration is:

```text
<repository>\.git\config
```

Do not manually edit these files unless necessary.

Prefer:

```bash
git config
```

because Git handles the configuration format for you.

---

# 18. First Repository

Create a project directory:

```bash
mkdir git-demo
cd git-demo
```

Initialize Git:

```bash
git init
```

Git creates:

```text
.git/
```

The directory now becomes a Git repository.

---

# 19. What git init Actually Does

`git init` does not upload your project.

It does not create a GitHub repository.

It initializes Git metadata locally.

Conceptually:

```text
project/
│
├── files...
│
└── .git/
```

The `.git` directory contains Git's repository metadata.

After initialization:

```text
Working directory
        │
        ▼
      .git/
        │
        ├── objects/
        ├── refs/
        ├── HEAD
        ├── config
        └── index
```

Some files/directories may be created lazily or have implementation-specific details, but the important concept is that `.git` is the repository's control/database area.

---

# 20. Checking Repository State

Run:

```bash
git status
```

Immediately after initialization, you may see a message similar to:

```text
On branch main

No commits yet

nothing to commit
```

The exact branch name and wording can vary depending on Git configuration and version.

---

# 21. Repository Discovery

Git commands can be executed from a repository's subdirectories.

Suppose:

```text
project/
├── .git/
├── src/
│   └── api/
└── README.md
```

If you execute:

```bash
git status
```

inside:

```text
project/src/api
```

Git searches upward for the repository.

Conceptually:

```text
project/src/api
       ↑
project/src
       ↑
project
       ↑
.git
```

This repository discovery mechanism is one reason Git commands work from nested project directories.

---

# 22. Finding the Repository Root

Run:

```bash
git rev-parse --show-toplevel
```

This returns the absolute path of the repository root.

Example:

```text
F:/projects/my-project
```

This is useful when working inside deeply nested directories.

---

# 23. Checking Whether a Directory Is Inside a Repository

Run:

```bash
git rev-parse --is-inside-work-tree
```

Expected result:

```text
true
```

Inside a Git repository.

Outside a repository, Git reports an error instead.

---

# 24. Git Repository vs Working Tree

A Git repository and a working tree are related but conceptually different.

### Repository

The Git database and metadata.

Usually:

```text
.git/
```

### Working tree

The files currently checked out for you to edit.

Example:

```text
project/
├── src/
├── package.json
├── README.md
└── .git/
```

Here:

```text
src/
package.json
README.md
```

are part of the working tree.

```text
.git/
```

contains Git's repository data.

---

# 25. Bare Repository

A normal repository generally has:

```text
working tree
+
.git repository
```

A bare repository has no normal working tree.

It contains repository data directly at its root.

Create one with:

```bash
git init --bare repository.git
```

Bare repositories are commonly used as server-side repositories.

Conceptually:

```text
Normal repository:

project/
├── source files
└── .git/


Bare repository:

repository.git/
├── objects/
├── refs/
├── HEAD
├── config
└── ...
```

Bare repositories are important when learning Git servers, remotes, hosting, and advanced Git administration.

---

# 26. Git's Three Major Areas

A normal Git workflow involves three important areas:

```text
Working Tree
     │
     │ git add
     ▼
Index / Staging Area
     │
     │ git commit
     ▼
Repository
```

### Working Tree

Files you currently edit.

### Index

The proposed contents of the next commit.

### Repository

Committed history and Git objects.

This model is fundamental to understanding Git.

---

# 27. Git Is Snapshot-Based

Git does not fundamentally operate like a traditional "store every file difference forever" system.

A commit represents a snapshot of project state.

Conceptually:

```text
Commit A
   │
   ├── tree
   │
   └── parent: none


Commit B
   │
   ├── tree
   │
   └── parent: Commit A


Commit C
   │
   ├── tree
   │
   └── parent: Commit B
```

Git internally stores objects that represent repository data.

The major Git object types are:

```text
blob
tree
commit
tag
```

These will be studied in depth later in:

```text
07_advanced_git/objects.md
```

---

# 28. Initial Setup Checklist

Before beginning Git development, verify:

```bash
git --version
```

Configure identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Verify:

```bash
git config --global user.name
git config --global user.email
```

Inspect configuration:

```bash
git config --list --show-origin
```

Create a test repository:

```bash
mkdir git-test
cd git-test
git init
```

Check it:

```bash
git status
```

Find its root:

```bash
git rev-parse --show-toplevel
```

---

# 29. Important Mental Model

Remember this model:

```text
                 Git
                  │
        ┌─────────┴─────────┐
        │                   │
   Working Tree         Repository
        │                   │
        │                   │
        ▼                   │
      Index                 │
        │                   │
        └── git commit ─────┘
```

And when collaborating:

```text
                 Local Git
                    │
             git push / fetch
                    │
                    ▼
               Remote Git
                    │
                    ▼
                 GitHub
```

---

# 30. What This Setup Section Establishes

After completing this section, you should understand:

```text
Git
├── Installation
├── PATH
├── Git commands
├── Git help
├── Identity
├── Configuration
│   ├── system
│   ├── global
│   ├── local
│   └── worktree
├── Repository
├── Working tree
├── Index
├── .git directory
├── Repository discovery
├── Normal repository
└── Bare repository
```

The next files go deeper into each setup operation:

```text
install-git.md
configure-git.md
first-commands.md
```

The important principle is:

> **Do not memorize Git commands independently. Understand what state each command changes.**

That mental model becomes increasingly important when working with branching, rebasing, reflogs, Git internals, hooks, remotes, and history rewriting.

# Git Repositories

A **Git repository** is the complete data structure Git uses to track a project's history.

A repository contains Git's:

- Objects
- References
- Configuration
- Index
- Reflogs
- Repository metadata

A repository can exist locally or remotely.

---

# 1. What Is a Repository?

A repository is the place where Git stores version-control information.

A normal working repository looks conceptually like:

```text
project/
├── src/
├── README.md
├── package.json
└── .git/
```

The project files are the **working tree**.

The `.git` directory contains the repository's Git data.

```text
Working Tree
     │
     ▼
   .git/
     │
     ├── objects
     ├── refs
     ├── HEAD
     ├── index
     ├── config
     └── ...
```

---

# 2. Repository vs Project

These are not exactly the same thing.

A **project** is the collection of files that make up an application or piece of work.

A **Git repository** is the version-control data associated with that project.

For a normal non-bare repository:

```text
project/
├── application files
└── .git/
```

The working files and Git metadata coexist.

---

# 3. Creating a Repository

Create a project directory:

```cmd
mkdir my-project
cd my-project
```

Initialize Git:

```cmd
git init
```

Git reports something similar to:

```text
Initialized empty Git repository in ...
```

Now:

```text
my-project/
└── .git/
```

exists.

---

# 4. What `git init` Does

`git init` creates the necessary Git repository structure.

Conceptually:

```text
git init
   │
   ▼
Create repository metadata
   │
   ├── HEAD
   ├── config
   ├── objects/
   ├── refs/
   └── index-related repository state
```

It does **not**:

- Commit your files
- Automatically upload anything
- Create a GitHub repository
- Automatically track every file
- Create project history

It initializes the repository.

---

# 5. `.git`

In a normal repository, `.git` is the Git administrative directory.

Example:

```text
my-project/
├── src/
├── README.md
└── .git/
```

The `.git` directory is critical.

Deleting it can remove the local Git repository metadata and history associated with that working tree.

The working files themselves may remain.

---

# 6. Inspect Repository Root

Run:

```cmd
git rev-parse --show-toplevel
```

This displays the root of the current working tree.

Example:

```text
C:/Projects/my-project
```

This is useful when your current directory is nested inside a repository.

---

# 7. Find the Git Directory

Run:

```cmd
git rev-parse --git-dir
```

In a normal repository, this commonly returns:

```text
.git
```

From a subdirectory, Git can still locate the repository.

Example:

```text
my-project/
├── .git/
└── src/
    └── api/
        └── server.js
```

From:

```text
src/api/
```

you can still run:

```cmd
git status
```

Git discovers the repository.

---

# 8. Repository Discovery

Git commands normally search upward from the current directory to find the repository.

Suppose:

```text
project/
├── .git/
└── src/
    └── backend/
        └── routes/
```

You are here:

```text
routes/
```

Running:

```cmd
git status
```

allows Git to discover:

```text
project/.git
```

This is why Git commands work from nested directories.

---

# 9. `.git` Is Not the Same as `.gitignore`

These are completely different.

### `.git`

Git's administrative directory.

```text
.git/
```

### `.gitignore`

A normal text file containing patterns for paths Git should ignore.

```text
.gitignore
```

Example:

```text
node_modules/
.env
dist/
```

Therefore:

```text
.git       → repository metadata
.gitignore → ignore rules
```

---

# 10. `.gitignore`

A `.gitignore` file tells Git which untracked paths should normally be ignored.

Example:

```text
node_modules/
.env
dist/
*.log
```

This is particularly useful for:

- Generated files
- Dependencies
- Build output
- Local configuration
- Temporary files
- Logs

---

# 11. Important `.gitignore` Limitation

`.gitignore` does not automatically stop tracking a file that is already tracked.

Suppose:

```text
.env
```

was already committed.

Adding:

```text
.env
```

to `.gitignore` does not remove it from tracking.

You would need to remove it from the index, for example:

```cmd
git rm --cached .env
```

Then commit that change.

The distinction is:

```text
ignored
≠
untracked
≠
tracked
```

---

# 12. Empty Repository

Immediately after:

```cmd
git init
```

the repository has no commits.

Conceptually:

```text
Repository
   │
   ├── objects
   ├── references
   └── HEAD

       no commit yet
```

Check:

```cmd
git status
```

You may see:

```text
No commits yet
```

This is an **empty-history repository**, not a repository containing no files whatsoever.

---

# 13. First Commit

Create a file:

```cmd
echo # My Project > README.md
```

Check:

```cmd
git status
```

Stage:

```cmd
git add README.md
```

Commit:

```cmd
git commit -m "Initial commit"
```

Now the repository has history:

```text
Commit A
```

---

# 14. Repository State

A useful model is:

```text
Working Tree
      │
      │ git add
      ▼
Index
      │
      │ git commit
      ▼
HEAD / Current Commit
```

The repository stores the committed history.

The working tree contains the files you are currently editing.

The index represents what will become the next commit.

---

# 15. Local Repository

A repository on your machine is a local repository.

Example:

```text
C:\Projects\my-project
```

It can contain:

```text
commits
branches
tags
objects
references
configuration
reflogs
```

You can work with it without a network connection.

---

# 16. Remote Repository

A remote repository is another repository that your local repository communicates with.

For example:

```text
Local Repository
       │
       │ fetch / push
       ▼
Remote Repository
```

The remote could be hosted on:

```text
GitHub
GitLab
Bitbucket
company server
private Git server
another machine
```

---

# 17. Repository Clone

`git clone` creates a new local repository from an existing repository.

Example:

```cmd
git clone https://example.com/project.git
```

Conceptually:

```text
Remote Repository
       │
       │ clone
       ▼
Local Repository
```

Clone normally creates:

```text
project/
├── working files
└── .git/
```

So cloning gives you both a working tree and local Git repository data.

---

# 18. `git clone` vs `git init`

### `git init`

Starts a new repository:

```text
Empty directory
      │
      ▼
git init
      │
      ▼
New Git repository
```

### `git clone`

Copies an existing repository:

```text
Existing repository
      │
      ▼
git clone
      │
      ▼
New local repository
```

Therefore:

```text
init  → create
clone → copy an existing repository
```

---

# 19. Bare Repository

A **bare repository** does not have a working tree.

Example:

```text
project.git/
├── HEAD
├── config
├── objects/
├── refs/
└── ...
```

There is no normal:

```text
src/
README.md
package.json
```

working directory.

Create one with:

```cmd
git init --bare project.git
```

---

# 20. Non-Bare Repository

A normal repository with a working tree is a non-bare repository.

Example:

```text
project/
├── src/
├── README.md
├── package.json
└── .git/
```

This is what developers normally use for day-to-day development.

---

# 21. Bare vs Non-Bare

```text
NON-BARE

project/
├── files
├── files
└── .git/


BARE

project.git/
├── objects/
├── refs/
├── HEAD
├── config
└── ...
```

The key distinction:

```text
Non-bare → working tree exists
Bare     → working tree does not exist
```

Bare repositories are commonly used as server-side repositories.

---

# 22. Why Bare Repositories Exist

A shared repository used primarily as a Git endpoint generally does not need an editable working tree.

For example:

```text
Developer A
     │
     ▼
Bare Repository
     ▲
     │
Developer B
```

Developers push to and fetch from the bare repository.

The bare repository acts as a central Git endpoint.

---

# 23. Repository Initialization Options

Basic:

```cmd
git init
```

Specify directory:

```cmd
git init my-project
```

Bare repository:

```cmd
git init --bare project.git
```

Specify initial branch name:

```cmd
git init -b main
```

Combine options:

```cmd
git init -b main my-project
```

---

# 24. Repository Configuration

Git has configuration at multiple levels.

Common levels include:

```text
system
global
local
worktree
command
```

A common setup is:

```cmd
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Repository-specific configuration can be set without `--global`:

```cmd
git config user.name "Project Name"
```

---

# 25. Repository Configuration File

Local repository configuration is commonly stored in:

```text
.git/config
```

Conceptually:

```text
.git/
└── config
```

Global configuration is stored separately from the repository.

Therefore:

```text
repository config
≠
global Git config
```

---

# 26. Inspect Configuration

Show effective configuration:

```cmd
git config --list
```

Show local repository configuration:

```cmd
git config --local --list
```

Show global configuration:

```cmd
git config --global --list
```

Show where values came from:

```cmd
git config --list --show-origin
```

This is extremely useful when debugging configuration problems.

---

# 27. Repository Format

The Git repository format contains internal structures that allow Git to manage:

```text
objects
references
index
configuration
repository state
```

Do not treat the internal `.git` directory as an API.

For repository manipulation, prefer Git commands rather than manually modifying internal files.

---

# 28. Objects Directory

A major component is:

```text
.git/objects/
```

This is where Git's object database is stored.

Git objects include:

```text
blob
tree
commit
tag
```

The repository's history is constructed from these objects.

---

# 29. References

Git references provide human-readable names for objects.

Examples:

```text
refs/heads/main
refs/heads/feature/login
refs/tags/v1.0.0
```

A branch reference points to a commit.

Conceptually:

```text
refs/heads/main
        │
        ▼
      Commit
```

---

# 30. HEAD

`HEAD` identifies the current checkout position.

Normally:

```text
HEAD
 ↓
refs/heads/main
 ↓
Commit
```

In detached HEAD state:

```text
HEAD
 ↓
Commit
```

The `HEAD` mechanism is part of repository state.

Inspect it:

```cmd
git symbolic-ref HEAD
```

When attached to a branch, this may return:

```text
refs/heads/main
```

---

# 31. Index

The index is a central part of the Git repository state.

It represents the proposed contents of the next commit.

Conceptually:

```text
Working Tree
      │
      │ git add
      ▼
    INDEX
      │
      │ git commit
      ▼
    COMMIT
```

The index is commonly stored as:

```text
.git/index
```

in a standard non-bare repository.

---

# 32. Reflogs

Git can maintain reflogs for references and `HEAD`.

A reflog records movements of references such as:

```text
HEAD
branch references
```

This can make it possible to locate commits that are no longer reachable through the current branch history.

Inspect:

```cmd
git reflog
```

Reflogs are especially valuable for recovery after operations such as:

```text
reset
rebase
branch movement
```

---

# 33. Repository Database Model

A useful abstraction is:

```text
Repository
│
├── Object Database
│   ├── blobs
│   ├── trees
│   ├── commits
│   └── tags
│
├── References
│   ├── branches
│   └── tags
│
├── HEAD
│
├── Index
│
├── Reflogs
│
└── Configuration
```

This is the foundation on which higher-level Git commands operate.

---

# 34. Repository Discovery From a Subdirectory

Suppose:

```text
my-project/
├── .git/
└── src/
    └── server/
        └── routes/
```

Move into:

```cmd
cd src\server\routes
```

Then:

```cmd
git status
```

Git can discover the repository above the current directory.

Find its root:

```cmd
git rev-parse --show-toplevel
```

---

# 35. `git rev-parse --is-inside-work-tree`

Run:

```cmd
git rev-parse --is-inside-work-tree
```

A normal working-tree repository commonly returns:

```text
true
```

This can be useful in scripts.

---

# 36. `git rev-parse --is-inside-git-dir`

Run:

```cmd
git rev-parse --is-inside-git-dir
```

This tells you whether the current location is inside the Git administrative directory.

It is useful when diagnosing repository path behavior.

---

# 37. Repository Root vs Git Directory

These commands answer different questions.

```cmd
git rev-parse --show-toplevel
```

asks:

```text
Where is the working-tree root?
```

While:

```cmd
git rev-parse --git-dir
```

asks:

```text
Where is the Git directory?
```

In a normal repository:

```text
Working tree:
C:/project

Git directory:
.git
```

---

# 38. Worktree Architecture

Git can support multiple working trees associated with one repository.

The command:

```cmd
git worktree
```

manages additional working trees.

Example:

```cmd
git worktree add ../feature-work feature
```

Conceptually:

```text
Main Working Tree
       │
       └── shared repository

Additional Working Tree
       │
       └── same repository
```

This allows multiple branches to be checked out simultaneously in separate directories.

---

# 39. Why Worktrees Matter

Without worktrees, switching branches changes the files in your working directory.

With multiple worktrees:

```text
project-main/
   └── main

project-feature/
   └── feature

project-hotfix/
   └── hotfix
```

You can work on different branches simultaneously.

This is useful for:

- Large projects
- Long-running features
- Hotfixes
- Parallel development
- Reviewing branches

---

# 40. Repository Status

Use:

```cmd
git status
```

It summarizes the relationship between:

```text
HEAD
Index
Working Tree
```

Conceptually:

```text
HEAD
 │
 │ compare
 ▼
Index
 │
 │ compare
 ▼
Working Tree
```

This makes `git status` one of the most important repository commands.

---

# 41. Repository Information

Useful commands:

```cmd
git rev-parse --show-toplevel
git rev-parse --git-dir
git rev-parse --is-inside-work-tree
git status
git branch
git remote -v
```

Together they provide a useful repository diagnostic picture.

---

# 42. Repository Identity

A repository is not simply a folder containing files.

Its identity is represented through Git's internal data.

The same working files can be:

```text
ordinary directory
```

or:

```text
Git working tree
```

depending on whether they are associated with a Git repository.

---

# 43. Repository History

A repository's history is formed by commits.

Example:

```text
A ← B ← C ← D
```

Each commit can point to its parent.

The repository's branch references identify current points in that history.

```text
main
 │
 ▼
D
```

The repository therefore combines:

```text
objects
+
references
```

to represent history.

---

# 44. Repository Does Not Mean GitHub

A repository can exist without GitHub:

```text
Local Git Repository
```

It can exist on GitHub:

```text
GitHub Repository
```

It can exist on a private server:

```text
Company Git Server
```

It can even exist in a filesystem location used for Git operations.

Therefore:

```text
Repository ≠ GitHub repository
```

---

# 45. Local Repository With Multiple Remotes

A local repository can have:

```text
origin
upstream
company
```

For example:

```text
Local Repository
      │
      ├── origin ───→ GitHub fork
      │
      ├── upstream ─→ Original project
      │
      └── company ──→ Internal server
```

This is a normal Git architecture.

---

# 46. Repository Cloning Architecture

When cloning:

```cmd
git clone <repository-url>
```

Git generally establishes:

```text
Local Repository
│
├── Working Tree
├── Git Object Database
├── Local References
└── Remote-Tracking References
```

and configures a remote, conventionally named:

```text
origin
```

The remote name is configurable.

---

# 47. Repository Validation

Git provides:

```cmd
git fsck
```

for checking repository object connectivity and integrity.

Example:

```cmd
git fsck
```

This can report objects such as:

```text
dangling
unreachable
missing
```

It is mainly a diagnostic tool.

---

# 48. Repository Maintenance

Git repositories can accumulate and organize large numbers of objects.

Git provides maintenance mechanisms such as:

```cmd
git gc
```

and:

```cmd
git maintenance
```

These can perform repository housekeeping.

For normal usage, let Git manage its internal storage rather than manually editing `.git/objects`.

---

# 49. Important Repository Safety Rule

Do not casually delete or modify:

```text
.git/objects
.git/refs
.git/HEAD
.git/index
.git/config
```

These are part of Git's repository state.

If you need to manipulate repository state, use Git commands whenever possible:

```text
git branch
git update-ref
git reset
git restore
git reflog
git worktree
```

---

# 50. Advanced Repository Mental Model

Think of a normal repository as:

```text
                 WORKING TREE
                      │
                      │ git add
                      ▼
                    INDEX
                      │
                      │ git commit
                      ▼
               OBJECT DATABASE
                      │
              ┌───────┴────────┐
              ▼                ▼
           COMMIT             TREE
              │                │
              ▼                ├── BLOB
           PARENT              └── TREE
                                 │
                                 └── BLOB

REFERENCES
    │
    ▼
  COMMIT

HEAD
    │
    ▼
REFERENCE
```

This is the architecture you should keep in your head.

---

# 51. Commands You Must Master

### Create

```cmd
git init
git init -b main
git init --bare project.git
```

### Clone

```cmd
git clone <url>
```

### Repository discovery

```cmd
git rev-parse --show-toplevel
git rev-parse --git-dir
git rev-parse --is-inside-work-tree
git rev-parse --is-inside-git-dir
```

### State

```cmd
git status
```

### Configuration

```cmd
git config --list
git config --local --list
git config --global --list
git config --list --show-origin
```

### References

```cmd
git branch
git tag
git show-ref
```

### History recovery

```cmd
git reflog
```

### Integrity

```cmd
git fsck
```

### Maintenance

```cmd
git gc
git maintenance
```

### Multiple working trees

```cmd
git worktree list
git worktree add <path> <branch>
```

---

# 52. Practical Repository Investigation

When you enter an unfamiliar Git project, run:

```cmd
git status
git rev-parse --show-toplevel
git rev-parse --git-dir
git branch
git remote -v
git log --oneline --decorate --graph --all
```

This quickly tells you:

```text
Where is the repository?
What branch am I on?
What is the repository state?
What remotes exist?
What does the history look like?
```

---

# 53. Repository Troubleshooting Sequence

If Git behaves unexpectedly:

```cmd
git status
```

Then:

```cmd
git rev-parse --show-toplevel
```

Then:

```cmd
git rev-parse --git-dir
```

Then:

```cmd
git branch --show-current
```

Then:

```cmd
git remote -v
```

Then inspect history:

```cmd
git log --oneline --decorate --graph --all
```

For deeper repository issues:

```cmd
git reflog
git fsck
```

This gives you a systematic diagnostic path.

---

# 54. Final Mental Model

A Git repository is fundamentally:

```text
Repository
│
├── Working Tree
│
├── Index
│
├── Object Database
│   ├── Blob
│   ├── Tree
│   ├── Commit
│   └── Tag
│
├── References
│   ├── Branches
│   └── Tags
│
├── HEAD
│
├── Reflogs
│
└── Configuration
```

The key relationship is:

```text
Working Tree
      │
      │ git add
      ▼
    Index
      │
      │ git commit
      ▼
   Commit
      │
      └── Tree
           ├── Blob
           ├── Blob
           └── Tree
```

And the branch relationship is:

```text
HEAD
 │
 ▼
Branch Reference
 │
 ▼
Commit
 │
 ▼
History
```

The repository is therefore the **foundation of Git**. GitHub, remotes, pull requests, and collaboration operate around repositories, but the repository itself is a Git concept and does not depend on GitHub.

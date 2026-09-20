# Git vs GitHub

## 1. Git

**Git** is a distributed version control system (DVCS).

It is software that runs on your computer and tracks changes to files.

Git allows you to:

- Track file history
- Create commits
- Create branches
- Merge changes
- Compare versions
- Revert changes
- Work offline
- Maintain complete local repository history
- Synchronize repositories with remote repositories

Git itself does **not** require GitHub.

You can use Git entirely locally.

```text
Working Directory
       │
       ▼
     Git
       │
       ▼
Local Repository
```

---

# 2. GitHub

**GitHub** is a cloud-based platform built around Git repositories.

GitHub provides services around Git, including:

- Remote repository hosting
- Collaboration
- Pull requests
- Code review
- Issues
- Discussions
- Actions / CI/CD
- Releases
- Permissions
- Organizations
- Repository management

Conceptually:

```text
Git
│
├── Local repository
├── Commits
├── Branches
├── Merges
└── History

GitHub
│
├── Remote repository
├── Pull requests
├── Code review
├── Issues
├── Actions
└── Collaboration
```

---

# 3. Git Is Not GitHub

The most important distinction:

```text
Git ≠ GitHub
```

Git is the version-control system.

GitHub is a platform that hosts Git repositories and provides collaboration features.

Other platforms can also host Git repositories.

Examples include:

```text
GitHub
GitLab
Bitbucket
Azure Repos
Gitea
Forgejo
```

The Git concepts remain largely the same.

---

# 4. Git Without GitHub

You can create a repository:

```cmd
mkdir my-project
cd my-project
git init
```

Now you have a Git repository.

```text
my-project/
└── .git/
```

You can create commits:

```cmd
git add .
git commit -m "Initial commit"
```

No GitHub account is required.

The repository exists locally.

```text
Your Computer
└── my-project
    └── .git
```

---

# 5. GitHub Without Understanding Git

You can create a GitHub repository through the GitHub website, but GitHub does not replace Git's underlying version-control concepts.

You still need to understand concepts such as:

```text
repository
commit
branch
merge
remote
fetch
push
pull
```

For professional development, understanding Git itself is more important than memorizing GitHub buttons.

---

# 6. Local Repository

A Git repository on your computer contains Git's internal data.

Example:

```text
project/
├── src/
├── package.json
├── README.md
└── .git/
```

The `.git` directory contains repository metadata and Git's object/reference information.

The local repository can contain:

```text
commits
branches
tags
references
objects
configuration
reflogs
index
```

The exact internal layout can vary with Git versions and repository configuration.

---

# 7. Remote Repository

A remote repository is another Git repository that your local repository can communicate with.

It may be hosted on:

```text
GitHub
GitLab
Bitbucket
private server
company Git server
another machine
```

Conceptually:

```text
Local Repository
       │
       │ network
       ▼
Remote Repository
```

---

# 8. Git Remote

Git represents a remote repository through a **remote**.

A common remote name is:

```text
origin
```

You can inspect configured remotes:

```cmd
git remote
```

More detailed information:

```cmd
git remote -v
```

Example:

```text
origin  https://github.com/example/project.git (fetch)
origin  https://github.com/example/project.git (push)
```

`origin` is only a conventional name.

It is not a special requirement of Git.

You could have:

```text
github
upstream
company
production
```

as remote names.

---

# 9. GitHub Repository

Suppose you create:

```text
my-project
```

on GitHub.

GitHub hosts a remote Git repository.

Your local repository can connect to it:

```cmd
git remote add origin https://github.com/example/my-project.git
```

The architecture becomes:

```text
Local
└── my-project
    └── Git repository

          │
          │ origin
          ▼

GitHub
└── my-project
    └── Remote Git repository
```

---

# 10. Push

`git push` sends local repository changes to a remote repository.

Example:

```cmd
git push origin main
```

Conceptually:

```text
Local
main
 │
 ▼
Commit A
 │
 ▼
Commit B
 │
 │ push
 ▼
Remote
main
 │
 ▼
Commit A
 │
 ▼
Commit B
```

Push is not simply "upload the current folder."

Git transfers Git objects and updates remote references according to the push operation.

---

# 11. Fetch

`git fetch` retrieves changes from a remote repository without integrating them into your current local branch.

Example:

```cmd
git fetch origin
```

Conceptually:

```text
Remote
   │
   │ fetch
   ▼
Local repository
   │
   ▼
Remote-tracking references
```

Your current working branch does not automatically move because of a normal fetch.

---

# 12. Pull

`git pull` is a higher-level operation.

Conceptually, it performs:

```text
fetch
+
integration
```

The integration can involve:

```text
merge
```

or, depending on configuration/options:

```text
rebase
```

Therefore:

```text
git pull
```

should not be mentally modeled as simply:

```text
download files
```

It interacts with Git history.

---

# 13. GitHub Pull Request vs Git Pull

These are completely different concepts.

### `git pull`

A Git command:

```cmd
git pull
```

It fetches and integrates changes from a remote.

### Pull Request

A GitHub collaboration feature.

A pull request is a proposal to merge changes from one branch/repository context into another.

```text
Feature Branch
      │
      │ Pull Request
      ▼
Target Branch
```

Therefore:

```text
git pull ≠ Pull Request
```

---

# 14. GitHub Pull Request

A typical workflow:

```text
Developer
   │
   ▼
Create branch
   │
   ▼
Make changes
   │
   ▼
Commit
   │
   ▼
Push branch
   │
   ▼
GitHub
   │
   ▼
Pull Request
   │
   ▼
Code Review
   │
   ▼
Merge
```

The pull request itself is a GitHub platform feature.

Git provides the underlying branches and commits.

---

# 15. Git Branch vs GitHub Branch UI

A Git branch is fundamentally a Git reference pointing to a commit.

For example:

```text
main
 │
 ▼
Commit C
```

GitHub displays and manages branches through its platform, but the underlying branch concept comes from Git.

You can create a branch without GitHub:

```cmd
git switch -c feature/login
```

---

# 16. Git Commit vs GitHub Commit Display

A commit is a Git object.

For example:

```text
Commit
├── tree
├── parent
├── author
├── committer
└── message
```

GitHub displays that commit through its web interface.

Therefore:

```text
Git
└── creates/stores commit

GitHub
└── displays/hosts/collaborates around commit
```

---

# 17. Git Repository vs GitHub Repository

These terms can be confusing.

### Git repository

A repository managed by Git.

It can exist:

```text
locally
on a server
on a private network
on a hosting platform
```

### GitHub repository

A repository hosted and managed through GitHub.

Therefore:

```text
Every GitHub repository uses Git
```

but:

```text
Not every Git repository is on GitHub
```

---

# 18. Distributed Version Control

Git is a **distributed** version control system.

A normal Git clone contains a substantial copy of repository history.

Conceptually:

```text
Developer A
└── repository + history

Developer B
└── repository + history

GitHub
└── repository + history
```

Each clone can have its own branches and commits.

This differs from a model where clients depend entirely on one central database for historical operations.

---

# 19. Offline Git

Because Git repositories are local, many operations work without internet access.

For example:

```cmd
git status
git add .
git commit
git log
git branch
git switch
git diff
git merge
```

You generally need network access for operations involving a remote server:

```cmd
git fetch
git pull
git push
```

GitHub-specific web functionality also requires access to GitHub.

---

# 20. Git's Local History

Suppose you have:

```text
A ← B ← C
```

Your local repository can contain all three commits.

You can inspect them:

```cmd
git log
```

Even if GitHub is temporarily unavailable, the local history remains available.

This is one of Git's major architectural advantages.

---

# 21. GitHub Is Not the Source of Git History

A common misconception is:

```text
GitHub
  ↓
contains the "real" Git history
```

Instead, Git repositories contain Git history.

GitHub hosts a copy of a Git repository and provides additional services.

You can have:

```text
Local repository
      │
      ├── GitHub remote
      ├── GitLab remote
      └── Company remote
```

One local Git repository can communicate with multiple remotes.

---

# 22. Multiple Remotes

You can configure:

```text
origin
upstream
company
```

For example:

```cmd
git remote add origin <url>
git remote add upstream <url>
```

Then:

```cmd
git fetch origin
git fetch upstream
```

Each remote can represent a different repository.

This is common in open-source workflows.

---

# 23. Fork Workflow

A common GitHub workflow uses a fork.

Conceptually:

```text
Original Repository
       │
       │ fork
       ▼
Your GitHub Repository
       │
       │ clone
       ▼
Your Local Repository
```

You may configure:

```text
origin
```

as your fork:

```text
origin → your repository
```

and:

```text
upstream
```

as the original repository:

```text
upstream → original repository
```

Then:

```cmd
git fetch upstream
```

can retrieve changes from the original repository.

---

# 24. Authentication

Git itself does not define GitHub account authentication.

When interacting with GitHub, authentication is handled by mechanisms supported by the platform and transport.

Common approaches include:

```text
HTTPS
SSH
```

For example:

```text
HTTPS remote
```

or:

```text
SSH remote
```

The important distinction is:

```text
Git
└── performs Git protocol operations

GitHub
└── authenticates and authorizes access to its service
```

---

# 25. Git Configuration vs GitHub Account

Git can have local identity configuration such as:

```cmd
git config user.name
git config user.email
```

These values are used when creating commits.

They do **not** automatically mean:

```text
GitHub account
```

A commit's author identity and authentication identity are separate concepts.

---

# 26. Commit Identity

A commit can contain:

```text
author
committer
```

For example:

```text
Author: Shiva Ram
Committer: Shiva Ram
```

Git records these as commit metadata.

GitHub may associate commits with a GitHub account based on configured identity and account information, but Git itself does not require a GitHub account to create commits.

---

# 27. Git Hosting

GitHub is a **Git hosting platform** plus collaboration tooling.

A hosting platform typically provides:

```text
Repository storage
Access control
Web interface
Code review
Issues
CI/CD
Release management
```

Git itself provides core version-control functionality:

```text
Object database
References
Commits
Branches
Merges
History
Local repository operations
```

---

# 28. GitHub Features That Are Not Core Git

Examples:

```text
Pull Requests
Issues
GitHub Actions
Discussions
Projects
Code Owners
Repository settings
Organization management
GitHub Codespaces
```

These are GitHub platform features.

They should not be confused with fundamental Git commands.

---

# 29. Git Features That Don't Require GitHub

You can use:

```text
git init
git add
git commit
git log
git diff
git branch
git switch
git merge
git rebase
git reset
git restore
git reflog
git stash
git tag
```

without GitHub.

These are Git operations.

---

# 30. Complete Architecture

A useful mental model:

```text
                         INTERNET
                            │
                            ▼
                    ┌───────────────┐
                    │    GitHub     │
                    │               │
                    │ Remote Repo   │
                    │ Pull Requests │
                    │ Issues        │
                    │ Actions       │
                    │ Code Review   │
                    └───────┬───────┘
                            │
                   fetch / push / pull
                            │
                            ▼
                    ┌───────────────┐
                    │ Local Machine │
                    │               │
                    │ Working Tree  │
                    │ Index         │
                    │ Git Repository│
                    │ Commits       │
                    │ Branches      │
                    └───────────────┘
```

---

# 31. The Three Layers You Must Keep Separate

When learning Git and GitHub, separate these concepts:

```text
1. Git
2. Git repository
3. GitHub
```

### Git

The version-control software.

### Git repository

The data structure managed by Git.

### GitHub

A platform that hosts Git repositories and provides collaboration services.

---

# 32. Command Classification

### Local Git commands

```cmd
git status
git add
git commit
git log
git diff
git branch
git switch
git merge
git rebase
git reset
git restore
```

### Remote Git commands

```cmd
git remote
git fetch
git push
git pull
```

### GitHub platform operations

Examples:

```text
Create repository
Create pull request
Review pull request
Create issue
Configure Actions
Manage repository permissions
```

These are not equivalent to ordinary local Git commands.

---

# 33. Common Misconceptions

### Wrong

```text
Git is GitHub.
```

### Correct

```text
Git is version-control software.
GitHub is a platform built around Git.
```

---

### Wrong

```text
You need GitHub to use Git.
```

### Correct

```text
Git can be used completely locally.
```

---

### Wrong

```text
git pull creates a pull request.
```

### Correct

```text
git pull fetches and integrates remote changes.
A Pull Request is a collaboration feature on platforms such as GitHub.
```

---

### Wrong

```text
A Git branch exists only on GitHub.
```

### Correct

```text
Git branches can exist entirely inside a local Git repository.
```

---

### Wrong

```text
GitHub stores files like Google Drive.
```

### Correct

```text
GitHub hosts Git repositories and their Git history while providing collaboration features.
```

---

# 34. Professional Mental Model

Think of Git as the **version-control engine**:

```text
Git
│
├── Objects
├── References
├── Commits
├── Branches
├── Tags
├── Merges
├── Rebase
└── Repository history
```

Think of GitHub as the **collaboration and hosting platform**:

```text
GitHub
│
├── Remote repositories
├── Pull Requests
├── Code Review
├── Issues
├── Actions
├── Releases
├── Permissions
└── Collaboration
```

They work together:

```text
                 Git
                  │
        version control
                  │
                  ▼
          Local Repository
                  │
        fetch / push / pull
                  │
                  ▼
              GitHub
                  │
        hosting + collaboration
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
     PRs       Issues     Actions
```

---

# 35. Commands to Know

```cmd
git --version
git init
git clone <url>

git status
git add .
git commit -m "message"

git branch
git switch -c <branch>

git remote
git remote -v
git remote add origin <url>

git fetch origin
git pull origin main
git push origin main
```

---

# 36. Final Summary

```text
Git
=
Distributed Version Control System
```

```text
Git Repository
=
Git-managed version history and repository data
```

```text
GitHub
=
Git hosting + collaboration platform
```

The relationship is:

```text
                 Git
                  │
                  ▼
          Local Git Repository
                  │
          remote communication
                  │
                  ▼
              GitHub
                  │
          collaboration layer
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
   Pull Requests Issues    Actions
```

The most important principle:

> **Learn Git first. Learn GitHub as the collaboration layer around Git.**

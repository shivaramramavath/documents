# Git Configuration

Git configuration controls how Git behaves and how Git identifies you when creating commits.

Git configuration is not limited to one setting. It is a hierarchical configuration system with multiple scopes, configuration files, aliases, conditional configuration, environment overrides, and repository-specific behavior.

---

# 1. Configuration Architecture

Git configuration can exist at multiple levels:

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

The important scopes are:

```text
--system
--global
--local
--worktree
```

---

# 2. Check Git Configuration

Show the effective configuration:

```powershell
git config --list
```

A more useful debugging form is:

```powershell
git config --list --show-origin
```

This displays where each configuration value came from.

You can also show the scope:

```powershell
git config --list --show-origin --show-scope
```

This is extremely useful when a Git setting appears to behave differently from what you expect.

---

# 3. Read a Specific Configuration Value

Read your configured name:

```powershell
git config --global user.name
```

Read your configured email:

```powershell
git config --global user.email
```

Read the default initial branch:

```powershell
git config --global init.defaultBranch
```

General syntax:

```powershell
git config <scope> <key>
```

Example:

```powershell
git config --global user.name
```

---

# 4. Set Global Identity

Set your Git name:

```powershell
git config --global user.name "Your Name"
```

Set your Git email:

```powershell
git config --global user.email "you@example.com"
```

Example:

```powershell
git config --global user.name "Shiva Ram"
git config --global user.email "you@example.com"
```

Verify:

```powershell
git config --global user.name
git config --global user.email
```

---

# 5. Why Git Needs an Identity

Every commit contains author and committer information.

Conceptually:

```text
Commit
├── Author
│   ├── Name
│   └── Email
│
├── Committer
│   ├── Name
│   └── Email
│
├── Timestamp
├── Parent
├── Tree
└── Message
```

The configuration:

```text
user.name
user.email
```

provides default identity information.

Git records this information in commits.

---

# 6. Identity Is Not Authentication

This distinction is fundamental.

This:

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

does not authenticate you with GitHub.

It controls commit metadata.

Authentication is handled separately through mechanisms such as:

```text
SSH
HTTPS credentials
Credential Manager
Personal access tokens
Provider-specific authentication
```

Therefore:

```text
Git identity
    ↓
Who the commit says created it

Remote authentication
    ↓
Who is allowed to access the remote
```

---

# 7. System Scope

System configuration applies broadly to the Git installation.

Inspect it:

```powershell
git config --system --list
```

Read a value:

```powershell
git config --system core.editor
```

Set one:

```powershell
git config --system <key> <value>
```

System-level configuration may require administrator privileges.

For personal development, global configuration is normally more appropriate.

---

# 8. Global Scope

Global configuration applies to your user account.

Inspect it:

```powershell
git config --global --list
```

Set a value:

```powershell
git config --global <key> <value>
```

Example:

```powershell
git config --global init.defaultBranch main
```

Global configuration is commonly used for:

```text
user.name
user.email
init.defaultBranch
core.editor
core.autocrlf
alias.*
```

---

# 9. Local Scope

Local configuration applies only to the current repository.

First initialize or enter a repository:

```powershell
mkdir config-test
cd config-test
git init
```

Then:

```powershell
git config --local --list
```

Set a repository-specific identity:

```powershell
git config --local user.name "Project Name"
git config --local user.email "project@example.com"
```

Verify:

```powershell
git config --local user.name
git config --local user.email
```

Local configuration is stored in:

```text
.git/config
```

---

# 10. Worktree Scope

Git can support configuration specific to an individual worktree.

This is especially relevant when using:

```powershell
git worktree
```

Worktree configuration requires the repository's extensions configuration to support it.

Enable it with:

```powershell
git config extensions.worktreeConfig true
```

Then worktree-specific configuration can be stored separately from the main repository configuration.

This becomes important in advanced multi-worktree workflows.

---

# 11. Configuration Precedence

Suppose the global configuration contains:

```text
user.name = Shiva Ram
```

but a repository contains:

```text
user.name = Company Account
```

When operating in that repository, the more specific value is used.

Conceptually:

```text
System
   ↓
Global
   ↓
Local
   ↓
Worktree
```

The effective configuration is determined by precedence.

---

# 12. Finding the Source of a Configuration

Suppose Git is using an unexpected editor.

Run:

```powershell
git config --list --show-origin --show-scope
```

You may see information conceptually similar to:

```text
global  file:C:/Users/User/.gitconfig    core.editor=...
local   file:.git/config                 core.editor=...
```

Now you know which configuration overrides the other.

This is one of the most useful Git troubleshooting techniques.

---

# 13. Configuration File Locations

Git configuration can come from several files.

Common locations include:

```text
System
Global
Local
Worktree
```

On Windows, the global configuration is commonly associated with:

```text
%USERPROFILE%\.gitconfig
```

Repository configuration:

```text
<repository>\.git\config
```

Worktree-specific configuration may be stored under Git's worktree configuration area.

The exact location can depend on Git's configuration and repository structure.

---

# 14. Show Configuration Files

Git can tell you which configuration files it is using.

Run:

```powershell
git config --show-origin --list
```

For more detail:

```powershell
git config --show-origin --show-scope --list
```

This is preferable to manually guessing which configuration file is responsible.

---

# 15. Set the Default Branch

Configure new repositories to use `main`:

```powershell
git config --global init.defaultBranch main
```

Verify:

```powershell
git config --global init.defaultBranch
```

Expected:

```text
main
```

This affects future repository initialization.

It does not rename branches in existing repositories.

---

# 16. Rename an Existing Branch

If an existing repository has:

```text
master
```

you can rename the current branch:

```powershell
git branch -m main
```

This is different from:

```powershell
git config --global init.defaultBranch main
```

The first changes an existing branch.

The second controls the default name used by future repository initialization.

---

# 17. Configure the Editor

Git may need an editor for operations such as:

- Commit messages
- Merge messages
- Rebase instructions
- Other interactive operations

For VS Code:

```powershell
git config --global core.editor "code --wait"
```

Verify:

```powershell
git config --global core.editor
```

The important part is:

```text
--wait
```

Git needs the editor process to remain active until the editing operation is completed.

---

# 18. Configure Line Endings

Windows commonly uses:

```text
CRLF
```

while Unix-like environments commonly use:

```text
LF
```

Git provides:

```text
core.autocrlf
```

A common Windows configuration is:

```powershell
git config --global core.autocrlf true
```

Check it:

```powershell
git config --global core.autocrlf
```

Possible values include:

```text
true
false
input
```

These values control how Git handles line-ending conversion.

---

# 19. Why `.gitattributes` Matters

Global `core.autocrlf` configuration is not a complete project-level line-ending policy.

A repository can define explicit behavior with:

```text
.gitattributes
```

For example, a project may specify:

```text
* text=auto
```

or more explicit rules for specific file types.

`.gitattributes` is particularly important in:

- Cross-platform teams
- Large repositories
- Generated files
- Binary files
- Language-specific projects

It will be studied separately.

---

# 20. Configure a Repository-Specific Setting

Global:

```powershell
git config --global core.autocrlf true
```

Repository-specific:

```powershell
git config --local core.autocrlf false
```

The local value can override the global value for that repository.

Check:

```powershell
git config --show-origin --show-scope --get core.autocrlf
```

---

# 21. Reading Configuration with `--get`

Instead of displaying everything:

```powershell
git config --get user.name
```

You can specify the scope:

```powershell
git config --global --get user.name
```

Another example:

```powershell
git config --global --get init.defaultBranch
```

If the key does not exist, Git does not return a normal value.

---

# 22. Reading Multiple Values

Some configuration keys can have multiple values.

Use:

```powershell
git config --get-all <key>
```

Example:

```powershell
git config --get-all remote.origin.fetch
```

This is especially useful for configuration keys that intentionally occur more than once.

---

# 23. Removing Configuration

Remove a global value:

```powershell
git config --global --unset user.name
```

Remove a global email:

```powershell
git config --global --unset user.email
```

Remove a local value:

```powershell
git config --local --unset user.name
```

If a key has multiple values:

```powershell
git config --global --unset-all <key>
```

Use this carefully because it removes all matching values.

---

# 24. Rename Configuration Keys

Git supports moving configuration values:

```powershell
git config --global --rename-section old.name new.name
```

This is an advanced administrative operation.

Do not use it casually.

For normal configuration changes, prefer explicitly setting the desired key.

---

# 25. Git Configuration Aliases

Aliases create shortcuts for Git commands.

Example:

```powershell
git config --global alias.st status
```

Now:

```powershell
git st
```

behaves like:

```powershell
git status
```

Another:

```powershell
git config --global alias.co checkout
```

Then:

```powershell
git co main
```

can invoke:

```powershell
git checkout main
```

---

# 26. Useful Log Alias

Create:

```powershell
git config --global alias.lg "log --oneline --graph --decorate --all"
```

Then:

```powershell
git lg
```

produces a compact history graph.

This is an example of configuration becoming a developer productivity layer.

---

# 27. Shell Aliases vs Git Aliases

These are different.

Git alias:

```powershell
git config --global alias.st status
```

creates:

```powershell
git st
```

PowerShell alias:

```powershell
Set-Alias
```

creates a shell-level shortcut.

Git aliases belong to Git.

PowerShell aliases belong to PowerShell.

Do not confuse them.

---

# 28. Shell Commands in Git Aliases

Git aliases can also execute shell commands when they begin with `!`.

Example:

```powershell
git config --global alias.root "!git rev-parse --show-toplevel"
```

Then:

```powershell
git root
```

runs the shell command.

This is powerful but should be used carefully.

Shell aliases can introduce portability problems because they may depend on:

- Shell syntax
- Operating system
- Installed commands
- Environment variables

---

# 29. Conditional Configuration

Git supports conditional configuration.

This allows different configuration rules for different repositories or directories.

A common scenario:

```text
Personal repositories
        ↓
Personal identity

Company repositories
        ↓
Company identity
```

Git can conditionally include another configuration file based on repository location.

Conceptually:

```text
~/.gitconfig
      │
      ├── personal configuration
      │
      └── company configuration
```

---

# 30. `includeIf`

Conditional inclusion uses:

```text
includeIf
```

For example, configuration can be associated with repositories under a particular directory.

Conceptually:

```text
Repositories under:
C:/work/

        ↓

Use:
C:/work/.gitconfig
```

This is extremely useful when maintaining separate identities.

---

# 31. Example Conditional Identity Architecture

Global configuration:

```text
C:/Users/User/.gitconfig
```

contains your general configuration.

A work configuration:

```text
C:/Users/User/.gitconfig-work
```

can contain:

```text
[user]
    name = Your Work Name
    email = work@example.com
```

The main configuration can conditionally include it for repositories located under a specific directory.

Conceptually:

```text
C:/work/project-a
C:/work/project-b
C:/work/project-c
        │
        ▼
work configuration
```

while:

```text
C:/personal/project-a
C:/personal/project-b
        │
        ▼
personal configuration
```

This avoids repeatedly changing `user.name` and `user.email`.

---

# 32. Environment Variables

Git configuration is not the only source of behavior.

Git can also be influenced by environment variables.

Examples include variables associated with:

```text
GIT_DIR
GIT_WORK_TREE
GIT_CONFIG
GIT_EDITOR
GIT_AUTHOR_NAME
GIT_AUTHOR_EMAIL
GIT_COMMITTER_NAME
GIT_COMMITTER_EMAIL
```

These are advanced mechanisms and should be understood before using them in automation or debugging.

---

# 33. `GIT_DIR`

Normally Git discovers `.git` automatically.

You can override repository discovery with:

```text
GIT_DIR
```

Conceptually:

```text
Working directory
       │
       ▼
GIT_DIR
       │
       ▼
Git repository
```

This is useful in scripting and unusual repository layouts.

It can also make Git behavior confusing if accidentally configured.

---

# 34. `GIT_WORK_TREE`

`GIT_WORK_TREE` can define the working tree associated with a repository.

Conceptually:

```text
Git repository
      │
      ▼
GIT_WORK_TREE
      │
      ▼
Working files
```

This is an advanced Git architecture concept and becomes important when separating Git metadata from working files.

---

# 35. Author vs Committer Configuration

Git distinguishes between:

```text
Author
```

and:

```text
Committer
```

Normally they are the same person.

They can differ.

The environment variables:

```text
GIT_AUTHOR_NAME
GIT_AUTHOR_EMAIL
GIT_COMMITTER_NAME
GIT_COMMITTER_EMAIL
```

can influence these values.

This distinction becomes important when studying:

- Rebases
- Cherry-picks
- Automated commits
- Patch application
- History rewriting

---

# 36. Configuration Debugging

When Git behaves unexpectedly, do not immediately change random configuration values.

Start with:

```powershell
git config --list --show-origin --show-scope
```

Then inspect the specific key:

```powershell
git config --show-origin --show-scope --get <key>
```

Example:

```powershell
git config --show-origin --show-scope --get core.editor
```

This gives you:

```text
scope
source
key
value
```

That allows you to determine which configuration layer is responsible.

---

# 37. Configuration Inspection Workflow

Use this workflow when debugging:

```text
Unexpected Git behavior
        │
        ▼
Identify the configuration key
        │
        ▼
git config --show-origin --show-scope --get <key>
        │
        ▼
Find configuration source
        │
        ▼
Determine precedence
        │
        ▼
Modify correct scope
        │
        ▼
Verify effective value
```

This is much safer than changing global configuration blindly.

---

# 38. Important Configuration Categories

Git configuration contains many categories.

Common examples:

```text
user.*
core.*
init.*
alias.*
remote.*
branch.*
merge.*
rebase.*
pull.*
push.*
fetch.*
diff.*
merge.*
credential.*
http.*
ssh.*
commit.*
tag.*
gpg.*
filter.*
include.*
```

Each category controls a different part of Git behavior.

---

# 39. Configuration Is Data

Git configuration follows a structured key/value model.

Conceptually:

```text
section.key = value
```

Example:

```text
user.name = Shiva Ram
```

Another:

```text
core.editor = code --wait
```

Another:

```text
init.defaultBranch = main
```

Some configuration keys can contain subsections.

For example:

```text
remote.origin.url
```

This structured naming system is important when working with advanced Git configuration.

---

# 40. Inspecting a Complete Environment

For advanced debugging, useful commands include:

```powershell
git --version
```

```powershell
where.exe git
```

```powershell
git config --list --show-origin --show-scope
```

```powershell
git rev-parse --show-toplevel
```

```powershell
git rev-parse --git-dir
```

```powershell
git rev-parse --is-inside-work-tree
```

Together these provide information about:

```text
Git executable
Git configuration
Repository root
Git directory
Repository state
```

---

# 41. `git rev-parse --git-dir`

Inside a repository:

```powershell
git rev-parse --git-dir
```

may return:

```text
.git
```

This identifies the Git directory associated with the current working tree.

Unlike manually assuming `.git`, this asks Git itself.

---

# 42. `git rev-parse --show-toplevel`

Run:

```powershell
git rev-parse --show-toplevel
```

It returns the repository root.

This is especially useful when scripts are executed from nested directories.

Example:

```text
project/
├── .git/
└── src/
    └── server/
```

From:

```text
src/server/
```

the command still identifies:

```text
project/
```

as the repository root.

---

# 43. Configuration Best Practices

Use global configuration for personal defaults:

```text
user.name
user.email
core.editor
init.defaultBranch
```

Use local configuration when a repository genuinely requires different behavior.

Use conditional configuration when you maintain multiple development identities.

Avoid modifying system configuration unless you administer the machine.

Always inspect configuration origins when debugging.

Prefer Git's configuration commands over manually editing configuration files.

---

# 44. Recommended Initial Configuration

A reasonable starting point is:

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
```

On Windows, if your project's line-ending policy calls for it:

```powershell
git config --global core.autocrlf true
```

Verify:

```powershell
git config --global --list
```

---

# 45. Configuration Verification

Run:

```powershell
git config --global user.name
```

```powershell
git config --global user.email
```

```powershell
git config --global init.defaultBranch
```

```powershell
git config --global core.editor
```

Then:

```powershell
git config --list --show-origin --show-scope
```

You should understand where each value originates.

---

# 46. Final Mental Model

Git configuration is hierarchical:

```text
                 Git Configuration
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       System         Global          Local
          │              │              │
          └──────────────┼──────────────┘
                         │
                      Worktree
                         │
                         ▼
                 Effective Config
                         │
                         ▼
                    Git Behavior
```

Configuration controls Git behavior.

Repository state controls repository history.

Authentication controls access to remotes.

These are separate systems:

```text
Configuration
     │
     ▼
Git behavior


Repository
     │
     ▼
History / objects / refs


Authentication
     │
     ▼
Remote access
```

Understanding this separation is essential before moving into Git fundamentals.

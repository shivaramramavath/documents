# Installing Git

Git must be installed and available from the terminal before using Git commands.

This guide focuses on installing Git on **Windows**, verifying the installation, understanding how Git is exposed to the terminal, and troubleshooting installation problems.

---

# 1. What Is Installed?

A Git installation provides the `git` executable and supporting programs required to operate Git repositories.

After installation, you should be able to execute:

```powershell
git --version
```

Example:

```text
git version 2.x.x
```

The exact version depends on the Git release installed on your machine.

---

# 2. Check Whether Git Is Already Installed

Before installing Git, check:

```powershell
git --version
```

If Git is installed and available through `PATH`, you will get a version:

```text
git version 2.x.x
```

If Git is not available, Windows may report that `git` is not recognized as a command.

---

# 3. Check Git's Executable Location

On Windows, use:

```powershell
where.exe git
```

Example:

```text
C:\Program Files\Git\cmd\git.exe
```

This tells you which `git.exe` Windows resolves when you execute:

```powershell
git
```

This is useful when multiple Git installations exist.

---

# 4. Git for Windows

The standard Git distribution for Windows is **Git for Windows**.

It provides:

- Git command-line tools
- Git Bash
- Git GUI
- Windows integration
- Credential-related functionality
- Unix-like tools through Git Bash

The command-line Git executable can be used from:

- Windows Command Prompt
- PowerShell
- VS Code integrated terminal
- Git Bash
- Other terminals that can access the Git executable through `PATH`

---

# 5. Installation Process

Download and install Git for Windows using the official Git distribution.

During installation, Git presents several configuration choices.

The defaults are generally suitable for most developers.

However, some choices are important to understand.

---

# 6. PATH Configuration

One of the most important installation choices determines how Git is exposed through Windows `PATH`.

The goal is to make this work:

```powershell
git --version
```

from a normal terminal.

Conceptually:

```text
Terminal
   │
   ▼
git --version
   │
   ▼
Windows PATH
   │
   ▼
git.exe
   │
   ▼
Git
```

If Git is not available from the terminal after installation, `PATH` is one of the first things to investigate.

---

# 7. Restarting the Terminal

If Git was installed while VS Code was already open, an existing terminal may not immediately receive the updated environment.

Close the existing terminal and create a new one.

In VS Code:

```text
Terminal
→ New Terminal
```

Then run:

```powershell
git --version
```

If necessary, restart VS Code completely.

---

# 8. Verify Git After Installation

Run:

```powershell
git --version
```

Then:

```powershell
where.exe git
```

You can also inspect Git's executable path:

```powershell
git --exec-path
```

These checks establish three useful facts:

```text
git --version
    ↓
Git is executable

where.exe git
    ↓
Which executable Windows found

git --exec-path
    ↓
Git's executable-support directory
```

---

# 9. Verify Git's Environment

Run:

```powershell
git version --build-options
```

This provides additional build-related information.

It can be useful when diagnosing unusual Git installations.

---

# 10. Git Installation vs Git Repository

Installing Git does **not** create a Git repository.

These are separate operations.

### Installing Git

Makes the Git software available:

```text
Windows
   │
   └── Git installed
```

### Initializing a repository

Creates Git repository metadata inside a project:

```powershell
git init
```

Result:

```text
project/
└── .git/
```

Therefore:

```text
Git installed
      ≠
Git repository initialized
```

You can install Git without having any repositories.

---

# 11. Git Executable and Repository

The `git` executable is the program you invoke:

```powershell
git status
```

The repository is the project-specific Git database.

For example:

```text
my-project/
├── src/
├── README.md
├── package.json
└── .git/
```

The executable might be installed somewhere such as:

```text
C:\Program Files\Git\
```

while the repository can exist anywhere:

```text
F:\projects\my-project\
```

These locations are independent.

---

# 12. Multiple Git Installations

It is possible for a Windows machine to contain multiple Git installations.

For example:

```text
C:\Program Files\Git\cmd\git.exe
```

and another Git executable somewhere else.

Check what Windows resolves:

```powershell
where.exe git
```

If multiple paths are returned:

```text
C:\Program Files\Git\cmd\git.exe
C:\SomeOtherGit\git.exe
```

then `PATH` ordering determines which executable is normally selected.

Always investigate multiple installations before changing `PATH`.

---

# 13. Checking PATH

In PowerShell:

```powershell
$env:Path
```

This displays the current process's `PATH`.

In Command Prompt:

```cmd
echo %PATH%
```

The important concept is that the terminal process receives environment variables from its parent process.

Therefore, after modifying system or user `PATH`, existing terminals may continue using their old environment.

Opening a new terminal usually resolves this.

---

# 14. Git in VS Code

VS Code can use Git installed on the operating system.

Open the integrated terminal:

```text
Terminal → New Terminal
```

Then:

```powershell
git --version
```

If this works, VS Code can access Git from the terminal.

VS Code can also detect Git repositories automatically.

For example:

```text
project/
├── .git/
├── src/
└── README.md
```

When the folder is opened in VS Code, the Source Control interface can recognize the repository.

---

# 15. Git Bash vs PowerShell vs CMD

Git itself is not limited to Git Bash.

You can run Git commands from:

### PowerShell

```powershell
git status
git add .
git commit -m "Initial commit"
```

### Command Prompt

```cmd
git status
git add .
git commit -m "Initial commit"
```

### Git Bash

```bash
git status
git add .
git commit -m "Initial commit"
```

The Git commands are fundamentally the same.

The surrounding shell syntax can differ.

For this repository, when we explicitly work with Windows terminal commands, pay attention to which shell you are using.

---

# 16. Line Endings on Windows

Windows traditionally uses:

```text
CRLF
```

Unix-like systems traditionally use:

```text
LF
```

Git can be configured to manage line-ending conversions.

A common Windows configuration is:

```powershell
git config --global core.autocrlf true
```

This means Git can normalize line endings when files are committed and restore Windows-style line endings in the working tree.

However, line-ending policy should be chosen deliberately for a project, especially in cross-platform teams.

Do not blindly change `core.autocrlf` in an existing professional repository without understanding that repository's `.gitattributes` policy.

`.gitattributes` will be covered later.

---

# 17. Git Configuration During Installation

Some Git installation options affect your initial Git environment, including:

- Default editor
- Initial branch naming
- PATH behavior
- HTTPS transport
- Terminal behavior
- Line-ending conversion

These settings can also be changed later.

For example, the default initial branch can be configured with:

```powershell
git config --global init.defaultBranch main
```

The installation wizard is therefore not your only opportunity to configure Git.

---

# 18. Initial Branch Name

Older Git installations may initialize repositories using:

```text
master
```

Many modern projects use:

```text
main
```

You can configure Git to use `main` for newly initialized repositories:

```powershell
git config --global init.defaultBranch main
```

Check the setting:

```powershell
git config --global init.defaultBranch
```

If it returns:

```text
main
```

then newly initialized repositories will use that default.

This setting affects future `git init` operations.

It does not rename an already-created branch.

---

# 19. Choosing the Default Editor

Git sometimes needs to open an editor.

Examples include:

- Writing commit messages
- Interactive rebase instructions
- Merge messages
- Other Git operations requiring text input

Git can be configured with:

```powershell
git config --global core.editor "code --wait"
```

This tells Git to use VS Code and wait until the editing operation is completed.

The `--wait` option is important because Git needs to know when the editor session has finished.

Verify:

```powershell
git config --global core.editor
```

---

# 20. Git Credential Management

Git operations involving authenticated remote repositories may require credentials.

Git for Windows integrates with credential-management mechanisms.

Do not store passwords directly inside repository URLs or Git configuration.

For modern hosted Git services, authentication commonly uses mechanisms such as:

- Credential managers
- Personal access tokens
- SSH keys
- Other provider-supported authentication

Authentication is different from Git commit identity.

For example:

```text
Commit identity
    ↓
user.name
user.email

Remote authentication
    ↓
SSH / credential manager / token
```

These solve different problems.

---

# 21. Commit Identity Is Not Authentication

This distinction is critical.

Setting:

```powershell
git config --global user.name "Shiva Ram"
git config --global user.email "you@example.com"
```

does **not** log you into GitHub.

It tells Git what identity to record in commits.

Authentication determines whether you are allowed to access a remote repository.

Therefore:

```text
user.name / user.email
        ↓
Commit metadata


SSH / HTTPS credentials
        ↓
Remote authentication
```

Do not confuse these concepts.

---

# 22. Verify the Complete Setup

Run these commands:

```powershell
git --version
```

```powershell
where.exe git
```

```powershell
git --exec-path
```

```powershell
git config --global user.name
```

```powershell
git config --global user.email
```

```powershell
git config --global init.defaultBranch
```

If the relevant values are present, the basic Git installation and configuration environment is ready.

---

# 23. Installation Troubleshooting

## Problem: `git` is not recognized

Run:

```powershell
where.exe git
```

If nothing is returned, Git may not be installed or may not be available through `PATH`.

Check whether Git exists under its installation directory.

If Git was just installed:

1. Close the terminal.
2. Open a new terminal.
3. Run:

```powershell
git --version
```

---

## Problem: Git works in Git Bash but not PowerShell

This usually indicates an environment or `PATH` difference.

Compare:

```powershell
where.exe git
```

in PowerShell with the Git Bash environment.

Do not immediately reinstall Git.

First determine which executable each environment is resolving.

---

## Problem: Wrong Git executable

Run:

```powershell
where.exe git
```

If multiple paths appear, inspect the installations and `PATH` ordering.

---

## Problem: VS Code cannot find Git

First test the integrated terminal:

```powershell
git --version
```

If the command fails, restart VS Code after confirming Git installation and environment configuration.

---

# 24. Installation Validation Checklist

Your Windows environment is ready when these work:

```powershell
git --version
```

```powershell
where.exe git
```

```powershell
git config --global user.name
```

```powershell
git config --global user.email
```

and:

```powershell
mkdir git-installation-test
cd git-installation-test
git init
git status
```

Then return to the parent directory:

```powershell
cd ..
```

You can remove the test repository afterward if desired.

---

# 25. Advanced Mental Model

The complete setup chain is:

```text
Windows
   │
   ├── Git installation
   │       │
   │       └── git.exe
   │
   ├── PATH
   │       │
   │       └── allows terminal to find git.exe
   │
   └── Terminal
           │
           ▼
        git command
           │
           ▼
      Git executable
           │
           ▼
    Current directory
           │
           ▼
     Repository discovery
           │
           ▼
        .git/
```

This distinction is foundational:

```text
Git software
     ≠
Git configuration
     ≠
Git repository
     ≠
GitHub account
     ≠
Remote repository
     ≠
Remote authentication
```

Each is a different layer of the Git ecosystem.

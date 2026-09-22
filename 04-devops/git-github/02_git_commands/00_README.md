# Git Commands

This directory is a command-level reference for Git.

The goal is to understand not only **what each command does**, but also:

- command syntax
- options and flags
- arguments
- execution behavior
- interaction with the working tree
- interaction with the staging area
- interaction with commits
- interaction with branches and references
- safe and destructive operations
- advanced workflows
- common mistakes
- practical examples

---

# Directory Structure

```text
02_git_commands/
│
├── README.md
│
├── init.md
├── clone.md
├── status.md
├── add.md
├── commit.md
├── log.md
├── diff.md
├── restore.md
├── reset.md
├── revert.md
├── clean.md
└── rm-mv.md
```

---

# Command Categories

## Repository Creation

```text
git init
git clone
```

Files:

```text
init.md
clone.md
```

These commands create or obtain a Git repository.

---

# Repository State

```text
git status
```

File:

```text
status.md
```

This command is used to inspect the state of:

```text
working tree
staging area
current branch
untracked files
```

---

# Staging

```text
git add
```

File:

```text
add.md
```

This command controls what content is placed into the staging area for the next commit.

---

# Commits

```text
git commit
```

File:

```text
commit.md
```

This command creates commits from the staged snapshot.

---

# History Inspection

```text
git log
```

File:

```text
log.md
```

This command displays commit history and provides many mechanisms for filtering and formatting history.

---

# Difference Inspection

```text
git diff
```

File:

```text
diff.md
```

This command compares different states of your repository.

Common comparisons include:

```text
working tree ↔ staging area
staging area ↔ HEAD
working tree ↔ HEAD
commit ↔ commit
branch ↔ branch
```

---

# Working-Tree Recovery

```text
git restore
```

File:

```text
restore.md
```

This command restores files in the working tree or staging area from another Git state.

---

# Reference and History Reset

```text
git reset
```

File:

```text
reset.md
```

This command moves references and can modify the staging area and working tree depending on the selected mode.

Important modes include:

```text
--soft
--mixed
--hard
--merge
--keep
```

Because some reset operations can destroy uncommitted work, this command requires careful understanding.

---

# History Reversal

```text
git revert
```

File:

```text
revert.md
```

This command creates a new commit that reverses the effect of earlier commits.

It is fundamentally different from `git reset`.

---

# Untracked File Cleanup

```text
git clean
```

File:

```text
clean.md
```

This command removes untracked files and directories from the working tree.

Because it can permanently remove files that Git does not track, its options must be understood carefully.

---

# File Removal and Renaming

```text
git rm
git mv
```

File:

```text
rm-mv.md
```

These commands manage tracked files while keeping Git's index synchronized with filesystem changes.

---

# Core Command Lifecycle

A common Git workflow can be represented as:

```text
             WORKING TREE
                  │
                  │ git add
                  ▼
            STAGING AREA
                  │
                  │ git commit
                  ▼
              COMMIT
                  │
                  │ git log
                  ▼
               HISTORY
```

Changes can be inspected with:

```text
git status
git diff
```

Changes can be recovered or discarded using:

```text
git restore
git reset
git revert
```

Untracked files can be removed with:

```text
git clean
```

Tracked files can be removed or renamed with:

```text
git rm
git mv
```

---

# Command Relationship

```text
git init
    │
    ▼
repository

git clone
    │
    ▼
repository

git status
    │
    ├── inspect working tree
    └── inspect staging area

git add
    │
    ▼
staging area

git commit
    │
    ▼
commit

git log
    │
    ▼
commit history

git diff
    │
    ├── working tree
    ├── index
    └── commits

git restore
    │
    └── restore content

git reset
    │
    └── move/reset references and state

git revert
    │
    └── create inverse commit

git clean
    │
    └── remove untracked content

git rm
    │
    └── remove tracked files

git mv
    │
    └── move/rename tracked files
```

---

# Important Git State Terms

Throughout this directory, these terms are used precisely.

## Working Tree

The files currently checked out in your filesystem.

```text
working tree
    ↓
files you edit
```

---

## Index

The Git index is commonly called the:

```text
staging area
```

It represents the content that will be used to construct the next commit.

```text
working tree
      │
      │ git add
      ▼
    index
```

---

## HEAD

`HEAD` identifies the current checked-out position in Git's reference system.

For example:

```text
HEAD
 │
 ▼
main
 │
 ▼
commit
```

---

## Commit

A commit records a snapshot plus metadata and parent relationships.

```text
commit
├── tree
├── parent
├── author
├── committer
└── message
```

---

# Command Safety Classification

The commands in this directory have different levels of destructive potential.

## Generally Inspecting

```text
git status
git log
git diff
```

These primarily inspect repository state.

---

## Changes Local State

```text
git add
git commit
git restore
git reset
git rm
git mv
```

These modify repository or working-tree state.

---

## Potentially Destructive

```text
git reset --hard
git clean
git clean -fd
git restore
```

These commands can discard work depending on their arguments and repository state.

Always understand what will be affected before executing destructive operations.

---

## Reverses History Through New Commits

```text
git revert
```

Unlike `reset`, `revert` normally preserves existing commits and records the reversal as a new commit.

---

# Common Command Syntax

Git commands generally follow this structure:

```text
git <command> [options] [arguments]
```

Example:

```cmd
git commit -m "Add authentication"
```

Breakdown:

```text
git
│
└── commit
      │
      ├── -m
      │
      └── "Add authentication"
```

Another example:

```cmd
git log --oneline --graph --decorate --all
```

Here:

```text
git
└── log
    ├── --oneline
    ├── --graph
    ├── --decorate
    └── --all
```

---

# Options vs Arguments

An option changes command behavior.

Example:

```cmd
git log --oneline
```

```text
--oneline
```

is an option.

An argument identifies an object, path, reference, or value.

Example:

```cmd
git log main
```

```text
main
```

is an argument identifying a revision.

---

# Short and Long Options

Git commonly supports short options:

```text
-a
-m
-f
-n
```

and long options:

```text
--all
--amend
--force
--number
```

Some commands support combined short options.

Example:

```cmd
git log -n 10
```

Always check the command-specific documentation because option behavior is command-dependent.

---

# Built-in Documentation

Git provides command documentation directly.

General help:

```cmd
git help
```

Command help:

```cmd
git help <command>
```

Example:

```cmd
git help commit
```

Short help:

```cmd
git <command> -h
```

Example:

```cmd
git commit -h
```

Version:

```cmd
git --version
```

---

# Command Reference Order

Study this directory in the following order:

```text
01. init
02. clone
03. status
04. add
05. commit
06. log
07. diff
08. restore
09. reset
10. revert
11. clean
12. rm-mv
```

This order follows the progression from:

```text
repository
    ↓
working tree
    ↓
staging
    ↓
commit
    ↓
history
    ↓
comparison
    ↓
recovery
    ↓
history manipulation
    ↓
cleanup
    ↓
file management
```

---

# Essential Commands

The commands covered by this directory are:

```cmd
git init
git clone
git status
git add
git commit
git log
git diff
git restore
git reset
git revert
git clean
git rm
git mv
```

---

# Advanced Topics Covered

The individual command files should cover advanced command behavior such as:

```text
pathspecs
revision specifications
HEAD
HEAD~
HEAD^
ranges
reflog interactions
index manipulation
intent-to-add
partial staging
patch mode
interactive operations
commit amendments
empty commits
author/committer metadata
history traversal
diff algorithms
rename detection
three-way comparisons
reset modes
merge-base relationships
revert ranges
untracked-file cleanup
ignored-file handling
file mode changes
submodules
```

Only the relevant concepts should be documented inside each command's file.

---

# Core Mental Model

The most important model for this directory is:

```text
                 ┌─────────────────┐
                 │  WORKING TREE   │
                 └────────┬────────┘
                          │
                       git add
                          │
                          ▼
                 ┌─────────────────┐
                 │  STAGING AREA   │
                 │     (INDEX)     │
                 └────────┬────────┘
                          │
                      git commit
                          │
                          ▼
                 ┌─────────────────┐
                 │    COMMIT       │
                 └────────┬────────┘
                          │
                          ▼
                    COMMIT HISTORY
```

Inspection:

```text
git status
git diff
git log
```

Movement/recovery:

```text
git restore
git reset
git revert
```

Cleanup:

```text
git clean
```

File operations:

```text
git rm
git mv
```

---

# Important Principle

Do not memorize Git commands as isolated commands.

Understand:

```text
command
   ↓
what state it reads
   ↓
what state it modifies
   ↓
what references it moves
   ↓
what content it creates/removes
   ↓
whether the operation is reversible
```

For every command in this directory, the corresponding `.md` file should explain these relationships in detail.

---

# Goal of This Directory

After completing `02_git_commands`, you should be able to:

```text
initialize repositories
clone repositories
inspect repository state
stage precise changes
create and modify commits
inspect complex history
compare repository states
restore files safely
understand reset modes
reverse commits correctly
clean untracked content safely
remove tracked files
rename/move tracked files
understand command options
use advanced pathspecs
use revision expressions
reason about HEAD and the index
```

The next Git concepts should build on this command-level foundation rather than treating commands as memorized shortcuts.

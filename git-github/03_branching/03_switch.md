# Git Switch

## 1. What Is `git switch`?

`git switch` is the modern Git command for **changing and creating branches**.

It was introduced to separate branch operations from the older multi-purpose:

```cmd
git checkout
```

The intended separation is:

```text
git switch
    ↓
branch operations

git restore
    ↓
file restoration
```

For modern Git workflows, prefer `git switch` when working with branches.

---

# 2. Basic Syntax

```cmd
git switch [options] <branch>
```

Examples:

```cmd
git switch main
git switch develop
git switch feature/login
```

---

# 3. Switch to an Existing Branch

```cmd
git switch main
```

This changes the current branch to:

```text
main
```

Before:

```text
A ── B ── C ← main
          \
           D ← feature/login
                ↑
               HEAD
```

After:

```text
A ── B ── C ← main
          ↑
         HEAD
          \
           D ← feature/login
```

The important operation is:

```text
HEAD → main
```

---

# 4. Check the Current Branch

After switching:

```cmd
git branch --show-current
```

Example:

```text
main
```

You can also use:

```cmd
git status
```

which reports:

```text
On branch main
```

---

# 5. Create and Switch to a Branch

The most important form:

```cmd
git switch -c <branch>
```

Example:

```cmd
git switch -c feature/login
```

This performs:

```text
create branch
      +
switch to branch
```

Equivalent older command:

```cmd
git checkout -b feature/login
```

---

# 6. What `-c` Means

`-c` means:

```text
create a new branch
```

Example:

```cmd
git switch -c feature/payment
```

Conceptually:

```text
Before:

A ── B ── C ← main
```

After:

```text
A ── B ── C
          ↑
     main
     feature/payment
          ↑
         HEAD
```

The new branch starts from the current `HEAD`.

---

# 7. Create a Branch From Another Branch

Syntax:

```cmd
git switch -c <new-branch> <start-point>
```

Example:

```cmd
git switch -c feature/login develop
```

Meaning:

```text
create feature/login
starting from develop
switch to feature/login
```

Conceptually:

```text
A ── B ── C ← develop
          ↑
          └── feature/login
                    ↑
                   HEAD
```

---

# 8. Create a Branch From a Commit

You can specify a commit:

```cmd
git switch -c feature/login abc1234
```

The branch starts at:

```text
abc1234
```

Conceptually:

```text
feature/login
      ↓
   abc1234
```

This is useful when starting work from a specific historical point.

---

# 9. Create a Branch From a Tag

Example:

```cmd
git switch -c maintenance v1.0.0
```

The new branch begins from the commit identified by:

```text
v1.0.0
```

Conceptually:

```text
v1.0.0
   ↓
commit
   ↑
maintenance
```

---

# 10. Switch to a Remote-Tracking Branch

Suppose you have:

```text
origin/feature/login
```

You can use:

```cmd
git switch --track origin/feature/login
```

Git creates a local branch and configures its upstream relationship.

Conceptually:

```text
feature/login
      ↓
origin/feature/login
```

The local branch becomes your working branch.

---

# 11. `--track`

Explicit tracking:

```cmd
git switch --track origin/feature/login
```

This generally creates a local branch based on:

```text
origin/feature/login
```

and sets:

```text
upstream = origin/feature/login
```

This relationship is useful for:

```cmd
git pull
git push
```

---

# 12. `-t`

Short form:

```cmd
git switch -t origin/feature/login
```

This is the short form of:

```cmd
git switch --track origin/feature/login
```

---

# 13. Tracking Relationship

Suppose:

```text
local branch:

feature/login
      │
      │ upstream
      ↓
origin/feature/login
```

The local branch and remote-tracking branch are still separate references.

Conceptually:

```text
refs/heads/feature/login
```

and:

```text
refs/remotes/origin/feature/login
```

They can point to the same commit, but they are not the same branch reference.

---

# 14. Switch to a Branch That Does Not Exist Locally

Suppose:

```text
origin/feature/login
```

exists but:

```text
feature/login
```

does not exist locally.

You can use:

```cmd
git switch --track origin/feature/login
```

Git creates the local branch.

Another explicit form:

```cmd
git switch -c feature/login --track origin/feature/login
```

---

# 15. `--no-track`

You can prevent automatic upstream tracking:

```cmd
git switch -c feature/login --no-track
```

This creates:

```text
feature/login
```

without automatically configuring an upstream.

This is useful when you want the branch to remain purely local.

---

# 16. Switch With Uncommitted Changes

Before switching:

```cmd
git status
```

Suppose:

```text
modified: app.js
```

Git attempts to preserve local changes when possible.

However, if switching would overwrite those changes, Git refuses.

Example:

```text
error: Your local changes to the following files would be overwritten
```

This protects your work.

---

# 17. Safe Workflow Before Switching

Check:

```cmd
git status
```

Then choose one of:

### Commit

```cmd
git add .
git commit -m "Save current work"
```

### Stash

```cmd
git stash push -m "WIP"
```

### Discard

If you intentionally want to discard changes:

```cmd
git restore app.js
```

Then:

```cmd
git switch main
```

---

# 18. Force Switching

`git switch` supports:

```cmd
git switch --discard-changes main
```

This discards local changes that would otherwise prevent switching.

This is destructive.

Use:

```cmd
git status
```

before using it.

Do not use force switching simply to bypass an error without understanding which changes will be discarded.

---

# 19. `--discard-changes`

Syntax:

```cmd
git switch --discard-changes <branch>
```

Example:

```cmd
git switch --discard-changes main
```

This tells Git to discard local changes that prevent the switch.

It is roughly analogous to the destructive behavior people often use:

```cmd
git checkout -f main
```

but the intention is much clearer.

---

# 20. Detached HEAD

`git switch` can intentionally enter detached HEAD.

Example:

```cmd
git switch --detach HEAD~2
```

Now:

```text
HEAD
 ↓
commit
```

instead of:

```text
HEAD
 ↓
branch
 ↓
commit
```

This is useful for examining or testing an old commit.

---

# 21. Switch to a Specific Commit

```cmd
git switch --detach abc1234
```

This places `HEAD` directly on:

```text
abc1234
```

You are not on a branch.

Git may display a message explaining that you are in detached HEAD state.

---

# 22. Why Use `--detach`?

Use detached HEAD intentionally when you want to:

```text
inspect an old version
test historical behavior
debug an old commit
run benchmarks
temporarily experiment
inspect a release
```

Example:

```cmd
git switch --detach v1.0.0
```

This is especially useful with tags.

---

# 23. Recover Work From Detached HEAD

Suppose:

```text
A ── B ── C
     ↑
    HEAD
```

You create commits:

```text
A ── B ── E ── F
     ↑         ↑
    main      HEAD
```

If the work is valuable, create a branch:

```cmd
git switch -c experiment
```

Now:

```text
A ── B ── E ── F ← experiment
                    ↑
                   HEAD
```

Your commits now have a branch reference.

---

# 24. Return From Detached HEAD

Switch back:

```cmd
git switch main
```

or another branch:

```cmd
git switch develop
```

If you created important detached commits, make sure they are referenced by a branch first.

Otherwise, use:

```cmd
git reflog
```

to locate them later.

---

# 25. Create an Orphan Branch

`git switch` supports:

```cmd
git switch --orphan <branch>
```

Example:

```cmd
git switch --orphan independent
```

This creates a branch with no parent history.

Conceptually:

```text
Existing history:

A ── B ── C ← main


New history:

X ← independent
```

The new history starts from a new root commit.

---

# 26. Orphan Branch Use Cases

Orphan branches can be useful for:

```text
independent documentation history
special deployment branches
generated content
GitHub Pages-style branches
completely separate histories
```

They should not be used merely as an alternative to normal feature branches.

---

# 27. `--orphan` and the Working Tree

After:

```cmd
git switch --orphan independent
```

the working tree may contain files from the previous checkout state.

The important distinction is:

```text
working tree contents
```

versus:

```text
new branch history
```

The branch has no parent commit even though files may still be present.

You should deliberately stage the files you want for the new root commit.

---

# 28. Switch and Branch Names

Normal:

```cmd
git switch feature/login
```

Branch names can contain:

```text
feature/login
feature/payment
bugfix/auth
release/v2.0.0
```

The slash is part of the reference name.

Conceptually:

```text
refs/heads/feature/login
```

---

# 29. Switch and HEAD

Normal branch switching:

```text
HEAD
 ↓
feature/login
 ↓
commit
```

Switching:

```cmd
git switch main
```

changes:

```text
HEAD → main
```

Detached switching:

```cmd
git switch --detach HEAD~1
```

changes:

```text
HEAD → commit
```

The branch itself is not changed.

---

# 30. Switch Does Not Merge

This is important.

Running:

```cmd
git switch main
```

does **not**:

```text
merge
rebase
cherry-pick
reset
```

It changes your current branch/HEAD and updates the working tree as necessary.

For example:

```text
feature/login
      ↓
      D

main
 ↓
C
```

Switching to `main` does not move `main` toward `D`.

You must explicitly merge or rebase if that is your goal.

---

# 31. Switch Does Not Copy a Branch

Suppose:

```text
main          → C
feature/login → C
```

Running:

```cmd
git switch feature/login
```

does not create another copy.

It simply changes:

```text
HEAD
```

from:

```text
main
```

to:

```text
feature/login
```

---

# 32. Switch and Working Tree

When changing branches, Git attempts to update the working tree to represent the selected commit.

Conceptually:

```text
HEAD
 ↓
branch
 ↓
commit snapshot
 ↓
working tree
```

The working tree therefore changes according to the target branch's tracked files.

---

# 33. Switch and the Index

Git also has an index/staging area.

Conceptually:

```text
HEAD
 ↓
commit

INDEX
 ↓
staged snapshot

WORKING TREE
 ↓
files on disk
```

When switching branches, Git needs to ensure that the index and working tree can be transformed safely to the target branch.

This is why conflicting uncommitted changes can prevent a switch.

---

# 34. Switch vs Checkout

Old approach:

```cmd
git checkout main
```

Modern approach:

```cmd
git switch main
```

Old branch creation:

```cmd
git checkout -b feature/login
```

Modern:

```cmd
git switch -c feature/login
```

Old detached HEAD:

```cmd
git checkout abc1234
```

Modern explicit form:

```cmd
git switch --detach abc1234
```

The modern syntax makes intent clearer.

---

# 35. Switch vs Restore

`git switch` is for branch/HEAD movement.

```cmd
git switch main
```

`git restore` is for file restoration.

```cmd
git restore app.js
```

Therefore:

```text
git switch
    → branch navigation

git restore
    → file state restoration
```

This separation is one of the main reasons these commands were introduced.

---

# 36. Switch vs Reset

Switch:

```text
changes current branch/HEAD
```

Reset:

```text
moves a branch reference and/or changes index/working tree
```

For example:

```cmd
git switch main
```

means:

```text
work on main
```

while:

```cmd
git reset --hard HEAD~1
```

means:

```text
move current branch backward
and reset index/working tree
```

These are fundamentally different operations.

---

# 37. Switch vs Rebase

Switch:

```text
changes where you are working
```

Rebase:

```text
rewrites commit ancestry
```

Example:

```cmd
git switch feature/login
```

does not rewrite history.

But:

```cmd
git rebase main
```

can create rewritten commits.

---

# 38. Switch vs Cherry-Pick

Switch:

```text
moves HEAD to another branch
```

Cherry-pick:

```text
copies the changes represented by selected commits
into a new commit on the current branch
```

Therefore:

```cmd
git switch main
```

does not bring feature commits into `main`.

You would need an explicit operation such as:

```cmd
git merge feature/login
```

or:

```cmd
git cherry-pick <commit>
```

---

# 39. Branch Discovery

List branches:

```cmd
git branch
```

List all:

```cmd
git branch -a
```

Then switch:

```cmd
git switch feature/login
```

Typical workflow:

```cmd
git branch -a
git switch feature/login
```

---

# 40. Remote Branch Workflow

Fetch remote information first:

```cmd
git fetch origin
```

Inspect:

```cmd
git branch -r
```

Suppose:

```text
origin/feature/payment
```

exists.

Create and track:

```cmd
git switch --track origin/feature/payment
```

Now you have:

```text
feature/payment
      ↓
origin/feature/payment
```

---

# 41. Explicit Remote Branch Creation

You can also use:

```cmd
git switch -c feature/payment --track origin/feature/payment
```

This makes the local branch name explicit.

It is useful when you want to control the local branch name.

---

# 42. Different Local and Remote Names

Example:

```cmd
git switch -c payment --track origin/feature/payment
```

Now:

```text
local:
payment

upstream:
origin/feature/payment
```

Conceptually:

```text
payment
   ↓
origin/feature/payment
```

The names do not have to be identical.

---

# 43. Branch Guessing

Git can sometimes infer a remote-tracking branch when you run:

```cmd
git switch feature/login
```

even when the local branch does not yet exist, if Git can unambiguously identify a corresponding remote-tracking branch.

For example:

```text
origin/feature/login
```

may allow Git to create:

```text
feature/login
```

automatically.

For deterministic workflows, explicit:

```cmd
git switch --track origin/feature/login
```

is clearer.

---

# 44. `--guess`

Git's branch switching behavior can use branch-name guessing.

The option:

```cmd
git switch --guess <branch>
```

enables guessing behavior.

The opposite is:

```cmd
git switch --no-guess <branch>
```

The exact default behavior can depend on Git configuration.

For scripts and precise workflows, explicit branch references are preferable.

---

# 45. `-C`

Git supports:

```cmd
git switch -C <branch> [<start-point>]
```

This creates the branch if necessary or resets the existing branch to the specified start point, then switches to it.

Example:

```cmd
git switch -C feature/login main
```

Conceptually:

```text
feature/login → main's current commit
HEAD → feature/login
```

This can move an existing branch, so use it deliberately.

---

# 46. `-C` vs `-c`

### `-c`

Create a new branch:

```cmd
git switch -c feature/login
```

It expects the branch not to already exist.

### `-C`

Create or reset:

```cmd
git switch -C feature/login
```

If the branch already exists, its reference can be moved to the specified starting point.

Therefore:

```text
-c = create
-C = create or reset
```

---

# 47. `--recurse-submodules`

When repositories contain Git submodules, switching branches can interact with submodule state.

Git supports:

```cmd
git switch --recurse-submodules main
```

This tells Git to update submodules as part of the switch according to the superproject's recorded state.

This is particularly relevant in repositories that use submodules.

---

# 48. `--no-recurse-submodules`

You can disable recursive submodule updating:

```cmd
git switch --no-recurse-submodules main
```

This gives explicit control over submodule behavior.

---

# 49. `--progress`

You can request progress information:

```cmd
git switch --progress feature/login
```

This is more relevant when switching involves significant working-tree operations.

---

# 50. `--quiet`

Suppress informational output:

```cmd
git switch --quiet main
```

Short form:

```cmd
git switch -q main
```

Useful in scripts when normal status messages are unnecessary.

---

# 51. `--merge`

Git can attempt to merge local changes into the target branch during switching:

```cmd
git switch --merge main
```

This is an advanced operation.

Instead of simply refusing when local changes conflict, Git may attempt a three-way merge between the current state and the target branch.

Use it only when you understand the resulting working-tree state.

---

# 52. `--conflict`

When merge-style switching encounters conflicts, you can influence conflict presentation:

```cmd
git switch --merge --conflict=merge main
```

or:

```cmd
git switch --merge --conflict=diff3 main
```

The exact conflict style can affect how conflict markers are presented.

This is an advanced conflict-resolution topic.

---

# 53. Switch Command Structure

The command can be viewed conceptually as:

```text
git switch
    │
    ├── existing branch
    │      └── git switch <branch>
    │
    ├── new branch
    │      └── git switch -c <branch>
    │
    ├── tracking branch
    │      └── git switch --track <remote>
    │
    ├── detached HEAD
    │      └── git switch --detach <commit>
    │
    └── orphan branch
           └── git switch --orphan <branch>
```

---

# 54. Important Options

## `-c`

Create and switch:

```cmd
git switch -c <branch>
```

---

## `-C`

Create or reset and switch:

```cmd
git switch -C <branch>
```

---

## `-t`

Create tracking branch:

```cmd
git switch -t <remote-branch>
```

---

## `--track`

Explicit tracking:

```cmd
git switch --track <remote-branch>
```

---

## `--no-track`

Disable automatic tracking:

```cmd
git switch -c <branch> --no-track
```

---

## `--detach`

Detach HEAD:

```cmd
git switch --detach <commit>
```

---

## `--orphan`

Create independent history:

```cmd
git switch --orphan <branch>
```

---

## `--discard-changes`

Discard conflicting local changes:

```cmd
git switch --discard-changes <branch>
```

---

## `--merge`

Attempt to merge local changes:

```cmd
git switch --merge <branch>
```

---

## `--guess`

Allow branch-name guessing:

```cmd
git switch --guess <branch>
```

---

## `--no-guess`

Disable branch-name guessing:

```cmd
git switch --no-guess <branch>
```

---

## `--recurse-submodules`

Update submodules:

```cmd
git switch --recurse-submodules <branch>
```

---

## `--no-recurse-submodules`

Do not recursively update submodules:

```cmd
git switch --no-recurse-submodules <branch>
```

---

## `-q`

Quiet output:

```cmd
git switch -q <branch>
```

---

## `--progress`

Show progress:

```cmd
git switch --progress <branch>
```

---

# 55. Common Commands

Switch:

```cmd
git switch main
```

Create and switch:

```cmd
git switch -c feature/login
```

Create from another branch:

```cmd
git switch -c feature/login develop
```

Create from a commit:

```cmd
git switch -c feature/login abc1234
```

Track remote:

```cmd
git switch --track origin/feature/login
```

Explicit tracking:

```cmd
git switch -c feature/login --track origin/feature/login
```

Detached HEAD:

```cmd
git switch --detach abc1234
```

Orphan branch:

```cmd
git switch --orphan independent
```

Force/discard conflicting changes:

```cmd
git switch --discard-changes main
```

Create or reset branch:

```cmd
git switch -C feature/login main
```

---

# 56. Recommended Modern Workflow

For a new feature:

```cmd
git status
git switch main
git pull
git switch -c feature/login
```

Work:

```cmd
git add .
git commit -m "Add login feature"
```

Inspect:

```cmd
git log --oneline --decorate --graph --all
```

Return to main:

```cmd
git switch main
```

The important separation is:

```text
git switch
    → navigate branches

git add
    → stage changes

git commit
    → create history

git merge
    → integrate branches
```

---

# 57. `switch` Mental Model

Normal:

```text
             HEAD
              ↓
        feature/login
              ↓
            commit
```

After:

```cmd
git switch main
```

becomes:

```text
             HEAD
              ↓
             main
              ↓
            commit
```

Detached:

```text
             HEAD
              ↓
            commit
```

The command primarily changes the location represented by `HEAD` and updates the working state accordingly.

---

# 58. `checkout` → `switch` Mapping

| Old `checkout`                        | Modern `switch`                     |
| ------------------------------------- | ----------------------------------- |
| `git checkout main`                   | `git switch main`                   |
| `git checkout -b feature`             | `git switch -c feature`             |
| `git checkout -b feature main`        | `git switch -c feature main`        |
| `git checkout abc1234`                | `git switch --detach abc1234`       |
| `git checkout --track origin/feature` | `git switch --track origin/feature` |
| `git checkout --orphan new`           | `git switch --orphan new`           |

File operations should move to:

```cmd
git restore
```

---

# 59. Common Mistakes

### Mistake 1: Thinking switch merges

```cmd
git switch main
```

does not merge anything.

---

### Mistake 2: Thinking switch copies branches

It only changes the current branch/HEAD.

---

### Mistake 3: Ignoring uncommitted changes

Always inspect:

```cmd
git status
```

before switching when you have work in progress.

---

### Mistake 4: Creating commits in detached HEAD

Detached commits can become difficult to locate if not referenced by a branch.

Use:

```cmd
git switch -c experiment
```

if the work should be retained.

---

### Mistake 5: Confusing local and remote-tracking branches

These are different:

```text
feature/login
origin/feature/login
```

---

# 60. Final Mental Model

```text
                    git switch
                         │
          ┌──────────────┼───────────────┐
          ↓              ↓               ↓
      branch          commit          orphan
      switch          checkout        history
          │              │               │
          ↓              ↓               ↓
       HEAD →        HEAD →          new root
       branch         commit           branch
```

The central rule:

```text
git switch = branch navigation
```

Use:

```cmd
git switch <branch>
```

to move between existing branches.

Use:

```cmd
git switch -c <branch>
```

to create and switch to a new branch.

Use:

```cmd
git switch --track <remote>
```

to create a tracking branch.

Use:

```cmd
git switch --detach <commit>
```

to intentionally enter detached HEAD.

Use:

```cmd
git switch --orphan <branch>
```

to create an independent history.

For modern Git, keep the responsibility boundary clear:

```text
git switch
    → branches

git restore
    → files

git merge
    → integrate histories

git rebase
    → rewrite/rebase history
```

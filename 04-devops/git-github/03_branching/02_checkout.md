# Git Checkout

## 1. What Is `git checkout`?

`git checkout` is a Git command historically used for multiple operations:

```text
switching branches
checking out commits
creating and switching branches
restoring files
```

Because it performs several different jobs, Git introduced more specialized commands:

```text
git switch
git restore
```

Modern Git generally recommends:

```text
git switch
```

for branch operations, and:

```text
git restore
```

for file restoration.

However, `git checkout` remains important because it is widely used in existing repositories, scripts, documentation, and older workflows.

---

# 2. Basic Syntax

The general syntax is:

```cmd
git checkout [options] <branch-or-commit>
```

Examples:

```cmd
git checkout main
git checkout feature/login
git checkout abc1234
```

The meaning depends on what the argument represents.

---

# 3. Switch to a Branch

The most common usage:

```cmd
git checkout main
```

This changes the current branch to:

```text
main
```

For example:

```text
A ── B ── C ← main
          \
           D ← feature/login
```

If you are currently on:

```text
feature/login
```

and run:

```cmd
git checkout main
```

Git changes:

```text
HEAD
 ↓
main
 ↓
C
```

---

# 4. `HEAD` After Checkout

Before:

```text
A ── B ── C ← main
          \
           D ← feature/login
                ↑
               HEAD
```

Run:

```cmd
git checkout main
```

Now:

```text
A ── B ── C ← main
          ↑
         HEAD
          \
           D ← feature/login
```

`HEAD` moves with the checkout operation.

---

# 5. Checkout a Feature Branch

```cmd
git checkout feature/login
```

Git changes the current branch to:

```text
feature/login
```

Conceptually:

```text
HEAD
 ↓
feature/login
 ↓
commit
```

Check it with:

```cmd
git branch --show-current
```

---

# 6. Checkout a Remote-Tracking Branch

Suppose:

```text
origin/main
```

exists.

You can inspect it with:

```cmd
git checkout origin/main
```

However, this normally does **not** put you on a local `main` branch.

Instead, you may enter:

```text
detached HEAD
```

because `origin/main` is a remote-tracking reference rather than a normal local branch.

For a local branch that tracks it, a better approach is:

```cmd
git checkout -b main --track origin/main
```

or with modern Git:

```cmd
git switch -c main --track origin/main
```

---

# 7. Create a Branch With `-b`

One of the most important forms of `checkout`:

```cmd
git checkout -b <new-branch>
```

Example:

```cmd
git checkout -b feature/login
```

This performs two operations:

```text
create branch
     +
switch to branch
```

Equivalent conceptually to:

```cmd
git branch feature/login
git checkout feature/login
```

---

# 8. Create Branch From Current HEAD

Suppose:

```text
A ── B ── C
          ↑
         main
```

Run:

```cmd
git checkout -b feature/login
```

Result:

```text
A ── B ── C
          ↑
     main
     feature/login
          ↑
         HEAD
```

Both branches initially point to `C`.

---

# 9. Create Branch From Another Branch

Syntax:

```cmd
git checkout -b <new-branch> <start-point>
```

Example:

```cmd
git checkout -b feature/login develop
```

This means:

```text
create feature/login
starting from develop
switch to feature/login
```

Conceptually:

```text
develop → C
           ↑
           └── feature/login
```

---

# 10. Create Branch From a Commit

You can specify a commit:

```cmd
git checkout -b feature/login abc1234
```

Now:

```text
feature/login → abc1234
```

The branch starts from that commit.

This is useful when you want to start work from a particular point in history.

---

# 11. Create Branch From a Tag

Example:

```cmd
git checkout -b maintenance v1.0.0
```

This creates:

```text
v1.0.0
   ↓
commit C
   ↑
maintenance
```

The new branch starts at the commit identified by the tag.

---

# 12. Checkout a Specific Commit

You can checkout a commit directly:

```cmd
git checkout abc1234
```

This does not normally switch to a branch.

Instead:

```text
HEAD
 ↓
commit abc1234
```

This is called:

```text
detached HEAD
```

---

# 13. Detached HEAD

Suppose:

```text
A ── B ── C ── D
          ↑
         main
```

Run:

```cmd
git checkout B
```

Now:

```text
A ── B ── C ── D
     ↑     ↑
    HEAD  main
```

`HEAD` points directly to commit `B` instead of pointing to a branch.

Therefore:

```text
HEAD → commit
```

instead of:

```text
HEAD → branch → commit
```

---

# 14. Why Detached HEAD Exists

Detached HEAD is useful for:

```text
examining old commits
testing historical versions
running old code
debugging regressions
temporarily experimenting
```

Example:

```cmd
git checkout v1.0.0
```

You can inspect exactly what the repository looked like at version `v1.0.0`.

---

# 15. Making Commits in Detached HEAD

You can technically create commits while detached.

Example:

```text
A ── B ── C
     ↑
    HEAD
```

Create a commit:

```text
A ── B ── E
     ↑
    HEAD

A ── B ── C
          ↑
         main
```

The new commit `E` is not referenced by `main`.

If you later checkout another branch, the commit may become difficult to find.

If the work is important, create a branch:

```cmd
git checkout -b experiment
```

This attaches a branch reference to the current commit.

---

# 16. Recovering Detached Work

Suppose:

```text
A ── B ── E
     ↑    ↑
    main HEAD
```

If you leave the detached state, the commit `E` may no longer have a branch pointing to it.

You can often find it using:

```cmd
git reflog
```

Then create a branch:

```cmd
git checkout -b recovered <commit>
```

This gives the commit a permanent branch reference.

---

# 17. Checkout and Working Tree

Checkout does more than change `HEAD`.

When switching branches, Git may update the working tree to match the target branch.

Example:

```text
main:
README.md
app.js
config.js
```

and:

```text
feature:
README.md
app.js
login.js
```

When switching:

```cmd
git checkout feature
```

Git updates the working tree so it represents the selected branch's snapshot.

---

# 18. Checkout Safety

Git normally prevents checkout if doing so would overwrite uncommitted changes.

Example:

```text
working tree:
modified app.js
```

Target branch also has a different version of:

```text
app.js
```

Git may refuse:

```text
error: Your local changes ... would be overwritten
```

This protects your uncommitted work.

---

# 19. Safe Ways to Switch

Before switching branches, inspect:

```cmd
git status
```

If you have important changes, either commit them:

```cmd
git add .
git commit -m "Save current work"
```

or temporarily stash them:

```cmd
git stash push -m "WIP"
```

Then switch:

```cmd
git checkout main
```

---

# 20. Checkout With Staged Changes

Staged changes may sometimes be preserved when switching if they do not conflict with the target branch.

However, relying on this implicitly is poor workflow.

Before switching, understand:

```text
working tree
staging area
target branch
```

Use:

```cmd
git status
```

to verify your state.

---

# 21. Checkout a File

Historically, `git checkout` can also restore a file:

```cmd
git checkout -- file.txt
```

This means:

```text
restore file.txt
from the current HEAD
```

It discards uncommitted working-tree changes in that file.

This is destructive.

Modern Git provides the clearer command:

```cmd
git restore file.txt
```

---

# 22. Checkout a File From Another Commit

Historical syntax:

```cmd
git checkout <commit> -- <file>
```

Example:

```cmd
git checkout abc1234 -- app.js
```

This takes the version of:

```text
app.js
```

from:

```text
abc1234
```

and places it into the working tree/staging state according to Git's checkout semantics.

Modern Git commonly uses:

```cmd
git restore --source=abc1234 -- app.js
```

---

# 23. The `--` Separator

The `--` separator tells Git:

```text
everything before -- = revisions/options
everything after -- = paths
```

Example:

```cmd
git checkout main -- app.js
```

means:

```text
revision = main
path = app.js
```

This avoids ambiguity when a branch name and file name could be confused.

---

# 24. Checkout All Files From Another Commit

The command:

```cmd
git checkout <commit> -- .
```

can restore files from the specified commit into the current working tree/index context.

For example:

```cmd
git checkout abc1234 -- .
```

This is powerful and potentially destructive.

Modern Git equivalent:

```cmd
git restore --source=abc1234 -- .
```

Understand the consequences before using it.

---

# 25. `checkout --orphan`

Git provides:

```cmd
git checkout --orphan <new-branch>
```

This creates a new branch with no parent commit.

Example:

```cmd
git checkout --orphan new-history
```

The new branch has a new history root.

The working tree may initially contain files from the current state, but the new branch itself starts without a parent commit.

A common use is creating a branch with an independent history.

---

# 26. Orphan Branch Example

Suppose:

```text
A ── B ── C ← main
```

Run:

```cmd
git checkout --orphan independent
```

Then:

```text
independent
    ↓
new root commit
```

The resulting history can become:

```text
X ← independent
```

instead of:

```text
A ── B ── C
```

This is fundamentally different from normal branch creation.

---

# 27. Checkout and Branch Creation From HEAD

These are equivalent in intent:

```cmd
git branch feature/login
git checkout feature/login
```

and:

```cmd
git checkout -b feature/login
```

The second is shorter.

Modern Git:

```cmd
git switch -c feature/login
```

is more explicit.

---

# 28. `-B`

`checkout` supports:

```cmd
git checkout -B <branch>
```

This creates the branch if necessary, or resets the existing branch to the specified starting point, then checks it out.

Example:

```cmd
git checkout -B feature/login main
```

Conceptually:

```text
feature/login → main's current commit
```

and then:

```text
HEAD → feature/login
```

This can move an existing branch, so use it carefully.

---

# 29. `-f`

Force checkout:

```cmd
git checkout -f <branch>
```

This tells Git to force the checkout and discard conflicting local changes.

Example:

```cmd
git checkout -f main
```

This can destroy uncommitted working-tree changes.

Do not use `-f` simply because Git refuses a normal checkout.

First inspect:

```cmd
git status
```

---

# 30. `--detach`

You can explicitly request detached HEAD:

```cmd
git checkout --detach <commit>
```

Example:

```cmd
git checkout --detach HEAD~3
```

This makes:

```text
HEAD → HEAD~3 commit
```

rather than:

```text
HEAD → branch → commit
```

This is useful when you intentionally want to inspect or experiment with a historical state.

---

# 31. `--track`

Create a branch that tracks a remote-tracking branch:

```cmd
git checkout --track origin/feature/login
```

Git can create a local branch and configure its upstream.

Conceptually:

```text
feature/login
      ↓
origin/feature/login
```

Then commands such as:

```cmd
git pull
git push
```

can use the tracking relationship.

---

# 32. `-t`

Short form:

```cmd
git checkout -t origin/feature/login
```

This is equivalent in purpose to:

```cmd
git checkout --track origin/feature/login
```

It creates a local tracking branch.

---

# 33. `--no-track`

You can prevent automatic upstream configuration:

```cmd
git checkout -b feature/login --no-track
```

This creates the local branch without automatically setting an upstream.

This can be useful when you want explicit control over remote tracking.

---

# 34. Checkout With Pathspec

Git checkout supports pathspecs.

Example:

```cmd
git checkout HEAD -- src\app.js
```

This restores:

```text
src\app.js
```

from:

```text
HEAD
```

It does not switch branches because the `--` separates the revision from the path.

---

# 35. Branch Name vs File Name Ambiguity

Suppose the repository contains:

```text
feature
```

as both:

```text
branch = feature
file = feature
```

Then:

```cmd
git checkout feature
```

can be ambiguous.

Use:

```cmd
git checkout feature --
```

to specify the branch/revision side.

Or:

```cmd
git checkout -- feature
```

to specify the file path.

This distinction is one reason `git switch` and `git restore` were introduced.

---

# 36. Checkout vs Switch

Old:

```cmd
git checkout main
```

Modern:

```cmd
git switch main
```

Old:

```cmd
git checkout -b feature/login
```

Modern:

```cmd
git switch -c feature/login
```

The modern commands separate responsibilities:

```text
git switch
    → branches

git restore
    → files
```

---

# 37. Checkout vs Restore

Historical file restoration:

```cmd
git checkout -- app.js
```

Modern:

```cmd
git restore app.js
```

Historical restoration from another commit:

```cmd
git checkout abc1234 -- app.js
```

Modern:

```cmd
git restore --source=abc1234 -- app.js
```

Modern commands are generally easier to understand.

---

# 38. Checkout vs Reset

Do not confuse:

```text
git checkout
git reset
```

Checkout can change:

```text
HEAD
working tree
index
```

depending on the form used.

Reset primarily moves:

```text
branch reference
HEAD
index
working tree
```

depending on its mode.

Examples:

```text
--soft
--mixed
--hard
```

Reset is covered separately in the history-rewriting section.

---

# 39. Checkout vs Rebase

Checkout:

```text
changes where HEAD is positioned
```

Rebase:

```text
rewrites commits onto another base
```

They solve completely different problems.

---

# 40. Checkout and Detached HEAD Diagram

Normal:

```text
HEAD
 ↓
main
 ↓
C
```

Detached:

```text
HEAD
 ↓
C
```

Branch remains elsewhere:

```text
main → D
```

This is one of the most important differences to understand.

---

# 41. Checkout Historical Commit

Suppose:

```text
A ── B ── C ── D ← main
```

Run:

```cmd
git checkout B
```

Result:

```text
A ── B ── C ── D
     ↑         ↑
    HEAD      main
```

You are now examining the repository as it existed at `B`.

---

# 42. Return From Detached HEAD

If you are detached:

```cmd
git checkout main
```

or:

```cmd
git switch main
```

returns you to the branch.

If you created important commits while detached, create a branch before leaving:

```cmd
git checkout -b experiment
```

---

# 43. Checkout a Tag

```cmd
git checkout v1.0.0
```

If `v1.0.0` is a tag, Git normally checks out the commit identified by the tag.

This commonly results in:

```text
detached HEAD
```

because tags normally identify fixed objects rather than movable branch references.

---

# 44. Checkout a Remote Branch

If:

```text
origin/feature/login
```

exists:

```cmd
git checkout origin/feature/login
```

can result in detached HEAD.

To create a local branch:

```cmd
git checkout -b feature/login origin/feature/login
```

or:

```cmd
git checkout --track origin/feature/login
```

The latter is useful when you want tracking.

---

# 45. Checkout and Untracked Files

Untracked files generally remain in the working tree during branch switching unless they would interfere with checkout.

Example:

```text
?? notes.txt
```

Switching branches may preserve:

```text
notes.txt
```

because it is not tracked by Git.

However, if an untracked file would be overwritten by the target branch, Git may refuse the checkout.

---

# 46. Checkout and Ignored Files

Ignored files are generally not affected by normal branch switching.

Examples:

```text
node_modules/
.env
dist/
```

depending on `.gitignore`.

These files are outside normal tracked branch history.

---

# 47. Checkout and Sparse Worktrees

In repositories using:

```text
sparse-checkout
```

checkout behavior interacts with the sparse working-tree configuration.

The branch can contain many files while only a subset is materialized in the working tree.

This becomes relevant in large repositories.

---

# 48. Checkout in Scripts

When scripting Git, avoid relying on ambiguous behavior.

Prefer explicit commands:

```cmd
git switch main
git switch -c feature/login
git restore --source=HEAD -- app.js
```

rather than using `git checkout` for everything.

This makes scripts easier to read and maintain.

---

# 49. Common Errors

## Error: Local changes would be overwritten

Example:

```text
error: Your local changes to the following files would be overwritten
```

Check:

```cmd
git status
```

Then decide whether to:

```text
commit
stash
discard
```

---

## Error: Pathspec did not match

Example:

```text
error: pathspec 'feature/login' did not match any file(s) known to git
```

Possible causes:

```text
branch does not exist
typo in branch name
remote branch has not been fetched
wrong repository
```

Inspect:

```cmd
git branch -a
```

---

# 50. Useful `checkout` Commands

Switch branch:

```cmd
git checkout main
```

Create and switch:

```cmd
git checkout -b feature/login
```

Create from another branch:

```cmd
git checkout -b feature/login develop
```

Create from a commit:

```cmd
git checkout -b feature/login abc1234
```

Checkout commit:

```cmd
git checkout abc1234
```

Checkout tag:

```cmd
git checkout v1.0.0
```

Explicit detached HEAD:

```cmd
git checkout --detach HEAD~2
```

Create tracking branch:

```cmd
git checkout --track origin/feature/login
```

Force checkout:

```cmd
git checkout -f main
```

Restore file:

```cmd
git checkout -- app.js
```

Restore file from commit:

```cmd
git checkout abc1234 -- app.js
```

Create orphan branch:

```cmd
git checkout --orphan independent
```

---

# 51. Important Options

## `-b`

Create and checkout a branch:

```cmd
git checkout -b <branch>
```

---

## `-B`

Create or reset and checkout a branch:

```cmd
git checkout -B <branch>
```

---

## `-f`

Force checkout:

```cmd
git checkout -f <branch>
```

Potentially discards conflicting local changes.

---

## `--detach`

Detach HEAD:

```cmd
git checkout --detach <commit>
```

---

## `--track`

Create a tracking branch:

```cmd
git checkout --track <remote-branch>
```

---

## `-t`

Short form of tracking:

```cmd
git checkout -t <remote-branch>
```

---

## `--no-track`

Do not automatically configure tracking:

```cmd
git checkout -b <branch> --no-track
```

---

## `--orphan`

Create a branch with no parent history:

```cmd
git checkout --orphan <branch>
```

---

## `--`

Separate revisions from paths:

```cmd
git checkout <revision> -- <path>
```

---

# 52. Advanced Mental Model

The most important distinction is:

### Normal branch checkout

```text
HEAD
 ↓
branch
 ↓
commit
```

### Detached checkout

```text
HEAD
 ↓
commit
```

### File checkout

```text
commit/revision
      ↓
    file
      ↓
working tree/index
```

These are fundamentally different operations hidden behind the historical `git checkout` command.

---

# 53. Modern Git Recommendation

For new workflows:

### Branch switching

Use:

```cmd
git switch main
```

instead of:

```cmd
git checkout main
```

### Branch creation

Use:

```cmd
git switch -c feature/login
```

instead of:

```cmd
git checkout -b feature/login
```

### File restoration

Use:

```cmd
git restore app.js
```

instead of:

```cmd
git checkout -- app.js
```

### Restore from another commit

Use:

```cmd
git restore --source=abc1234 -- app.js
```

instead of:

```cmd
git checkout abc1234 -- app.js
```

---

# 54. Why Learn `checkout` If `switch` Exists?

Because `checkout` remains important for understanding existing Git workflows.

You will encounter:

```cmd
git checkout main
git checkout -b feature
git checkout HEAD~1
git checkout -- file
```

in:

```text
older documentation
existing projects
CI scripts
Stack Overflow answers
Git tutorials
developer workflows
```

Therefore, understand `checkout`, but use the more specialized modern commands when appropriate.

---

# 55. Summary

```text
git checkout
```

historically combines several operations:

```text
                    git checkout
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
     branch switch   commit checkout   file restore
          │              │              │
     HEAD → branch   HEAD → commit   restore path
```

Most important forms:

```cmd
git checkout <branch>
git checkout -b <branch>
git checkout <commit>
git checkout <tag>
git checkout --detach <commit>
git checkout --track <remote>
git checkout -- <file>
git checkout <commit> -- <file>
git checkout --orphan <branch>
```

Modern replacements:

```text
git switch
    → branch operations

git restore
    → file restoration
```

The critical mental model:

```text
NORMAL
HEAD → branch → commit


DETACHED
HEAD → commit


FILE RESTORATION
revision → path → working tree
```

Understanding these three states is essential before moving to:

```text
03_switch.md
04_merge.md
05_merge-conflicts.md
06_branch-strategies.md
```

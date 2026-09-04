# Git Merge

## 1. What Is `git merge`?

`git merge` integrates the changes from one branch into another branch.

The key rule is:

> **You merge a branch into the branch you are currently on.**

Example:

```cmd
git switch main
git merge feature/login
```

This means:

```text
feature/login
      ↓
   merge into
      ↓
main
```

It does **not** mean that `main` is merged into `feature/login`.

---

# 2. Basic Syntax

```cmd
git merge <branch>
```

Example:

```cmd
git switch main
git merge feature/login
```

---

# 3. Why Merge Exists

Branches allow independent development.

Example:

```text
main:
A ── B ── C

feature:
          \
           D ── E
```

The feature branch contains commits that `main` does not have.

To integrate the feature:

```cmd
git switch main
git merge feature
```

Git combines the histories.

---

# 4. The Golden Rule

Always identify the branch you want to receive the changes.

If you want:

```text
feature → main
```

run:

```cmd
git switch main
git merge feature
```

If you want:

```text
main → feature
```

run:

```cmd
git switch feature
git merge main
```

The current branch is the **target branch**.

---

# 5. Simple Merge

Before:

```text
A ── B ── C ← main
          \
           D ── E ← feature
```

Run:

```cmd
git switch main
git merge feature
```

Git may create:

```text
A ── B ── C ───── M ← main
          \       /
           D ── E
```

`M` is a merge commit.

---

# 6. Merge Commit

A merge commit is a commit with multiple parents.

Normal commit:

```text
A → B → C
```

Commit `C` has one parent:

```text
C
↓
B
```

Merge commit:

```text
      C
     / \
    D   E
     \ /
      M
```

`M` has two parents:

```text
parent 1 = previous main commit
parent 2 = previous feature commit
```

This preserves the fact that two histories were joined.

---

# 7. Fast-Forward Merge

Not every merge creates a merge commit.

Consider:

```text
A ── B ← main
          \
           C ── D ← feature
```

If `main` has not progressed since `feature` was created:

```cmd
git switch main
git merge feature
```

Git can simply move `main` forward:

```text
A ── B ── C ── D
               ↑
        main, feature
```

This is called a:

```text
fast-forward merge
```

No merge commit is required.

---

# 8. Why Is It Called Fast-Forward?

Git does not need to combine two divergent histories.

It only needs to move the branch reference:

```text
main → B
```

to:

```text
main → D
```

The history already exists.

Therefore:

```text
old main
   ↓
   B ── C ── D
            ↑
         feature
```

becomes:

```text
main ────────┐
             ↓
A ── B ── C ── D
```

---

# 9. `--no-ff`

You can force Git to create a merge commit:

```cmd
git merge --no-ff feature
```

Even if a fast-forward is possible.

Before:

```text
A ── B ← main
          \
           C ── D ← feature
```

After:

```text
A ── B ───── M ← main
          \ /
           C ── D
```

This preserves an explicit merge point.

---

# 10. Why Use `--no-ff`?

It can make branch topology clearer.

Example:

```text
A ── B ── M ── F
         / \
        C   D
```

You can visually identify:

```text
feature branch
      ↓
     C,D
      ↓
    merge
      ↓
      M
```

This can be useful for team workflows and historical analysis.

---

# 11. `--ff-only`

You can require a fast-forward:

```cmd
git merge --ff-only feature
```

If a fast-forward is impossible, Git refuses to merge.

Example:

```text
A ── B ── C ← main
     \
      D ── E ← feature
```

Because the histories diverged, Git cannot fast-forward.

The command fails rather than creating a merge commit.

This is useful when you want strict linear history.

---

# 12. Three Important Merge Modes

```text
git merge feature
```

Normal merge behavior.

```text
git merge --ff-only feature
```

Only fast-forward.

```text
git merge --no-ff feature
```

Never fast-forward; create a merge commit.

Conceptually:

```text
             merge
               │
       ┌───────┼────────┐
       ↓       ↓        ↓
      ff      no-ff   ff-only
       │       │        │
     move    commit    move only
    pointer   always   or fail
```

---

# 13. Already Up-to-Date

Suppose:

```text
A ── B ── C
          ↑
     main, feature
```

Run:

```cmd
git switch main
git merge feature
```

Git reports that the branch is already up to date.

Why?

Because `main` already contains the commits reachable from `feature`.

There is nothing new to integrate.

---

# 14. Merge Direction

This is one of the most common beginner mistakes.

Suppose:

```text
main → A ── B
feature → A ── B ── C
```

To bring feature into main:

```cmd
git switch main
git merge feature
```

Do **not** run:

```cmd
git switch feature
git merge main
```

That performs the opposite direction.

---

# 15. Merge Is Based on Commit Graphs

Git does not fundamentally merge "files."

It operates on snapshots and commit ancestry.

For a three-way merge, Git considers:

```text
ours
theirs
common ancestor
```

Conceptually:

```text
          ours
           ↓
A ── B ── C
     \
      D ── E
           ↑
         theirs
```

`B` is the merge base.

Git compares:

```text
B → C
B → E
```

and combines the resulting changes.

---

# 16. Merge Base

The merge base is a common ancestor used as the starting point for a three-way merge.

Example:

```text
        C ← main
       /
A ── B
       \
        D ← feature
```

Here:

```text
merge base = B
```

Git compares:

```text
B → C
```

with:

```text
B → D
```

Then combines the changes.

You can inspect the merge base:

```cmd
git merge-base main feature
```

---

# 17. Finding Merge Bases

Useful command:

```cmd
git merge-base main feature
```

Output:

```text
abc1234...
```

You can inspect it:

```cmd
git show abc1234
```

This is useful when debugging complicated histories.

---

# 18. Two-Way vs Three-Way Merge

A simplistic view would be:

```text
ours + theirs
```

Git generally uses three relevant states:

```text
base
ours
theirs
```

Example:

```text
          ours
           ↓
A ── B ── C
     \
      D ── E
           ↑
         theirs
```

Git asks:

```text
What changed from B → C?
What changed from B → E?
Can those changes be combined?
```

This is the foundation of merge conflict detection.

---

# 19. Merge Conflicts

A conflict can occur when both branches modify the same logical area incompatibly.

Example:

`main`:

```text
const port = 3000;
```

`feature`:

```text
const port = 8080;
```

Both changed the same line differently.

Git may produce:

```text
<<<<<<< HEAD
const port = 3000;
=======
const port = 8080;
>>>>>>> feature
```

The merge is paused until you resolve the conflict.

Detailed conflict resolution is covered in:

```text
06_conflicts/
```

---

# 20. What Happens During a Conflict?

After:

```cmd
git merge feature
```

Git may report:

```text
CONFLICT (content): Merge conflict in app.js
Automatic merge failed
```

The repository enters an in-progress merge state.

Check:

```cmd
git status
```

You will see unmerged paths.

---

# 21. Resolve a Merge Conflict

Open the conflicted file:

```text
<<<<<<< HEAD
current branch version
=======
incoming branch version
>>>>>>> feature
```

Edit it to the desired final content.

Then stage it:

```cmd
git add app.js
```

Check:

```cmd
git status
```

Then complete the merge:

```cmd
git commit
```

Git creates the merge commit.

---

# 22. `git merge --abort`

If you decide you do not want to continue:

```cmd
git merge --abort
```

Git attempts to restore the repository to the state before the merge began.

Typical workflow:

```cmd
git merge feature
```

Conflict occurs:

```cmd
git status
```

Then:

```cmd
git merge --abort
```

The merge operation is cancelled.

---

# 23. `git merge --continue`

After resolving conflicts, Git can also continue the merge with:

```cmd
git merge --continue
```

Depending on Git state and configuration, completing the merge with:

```cmd
git commit
```

is also common.

The important sequence is:

```text
merge
 ↓
conflict
 ↓
resolve
 ↓
stage
 ↓
continue/commit
```

---

# 24. `--no-commit`

You can prevent Git from automatically creating the merge commit when a merge commit would otherwise be created:

```cmd
git merge --no-commit feature
```

This lets you inspect the merged result before committing.

Typical workflow:

```cmd
git merge --no-commit feature
git status
git diff --cached
git commit
```

Important:

`--no-commit` does not prevent a fast-forward because a fast-forward does not create a commit.

To prevent fast-forwarding as well:

```cmd
git merge --no-ff --no-commit feature
```

---

# 25. `--edit`

Git can open an editor for the merge commit message:

```cmd
git merge --edit feature
```

This lets you modify the generated merge message.

---

# 26. `--no-edit`

Keep the automatically generated merge message:

```cmd
git merge --no-edit feature
```

Useful when you do not need to modify the generated message.

---

# 27. Merge Commit Message

A merge commit may have a message such as:

```text
Merge branch 'feature/login' into main
```

You can provide your own:

```cmd
git merge feature/login -m "Merge login feature"
```

This creates the merge commit using the supplied message when a merge commit is needed.

---

# 28. `--squash`

A squash merge combines the changes from another branch into the current working tree/index without creating the normal merge commit.

Example:

```cmd
git switch main
git merge --squash feature/login
```

Conceptually:

```text
feature:
A ── B ── C ── D

main:
A ── B
```

After squash:

```text
main:
A ── B
       \
        working tree/index contain combined feature changes
```

Then:

```cmd
git commit -m "Add login feature"
```

creates one normal commit on `main`.

---

# 29. Squash Is Not a Normal Merge

This distinction is important.

Normal merge:

```text
feature history
       ↓
merge commit
       ↓
main
```

Squash:

```text
feature changes
       ↓
combined changes
       ↓
one new commit
```

The individual feature commits are not preserved as ancestors of the resulting commit.

---

# 30. Squash Example

Feature:

```text
A ── B ── C ── D ← feature
```

Main:

```text
A ── B ← main
```

Run:

```cmd
git switch main
git merge --squash feature
git commit -m "Add authentication"
```

Result:

```text
A ── B ── S ← main
     \
      C ── D ← feature
```

`S` contains the combined changes, but `C` and `D` are not parents of `S`.

---

# 31. `--squash` Does Not Move HEAD Automatically

After:

```cmd
git merge --squash feature
```

the changes are prepared in the index/working tree.

You still need:

```cmd
git commit
```

to create the commit.

This differs from a normal merge that creates its merge commit automatically when required.

---

# 32. `--no-ff` vs `--squash`

### `--no-ff`

Preserves branch ancestry:

```text
A ── B ── M
     \   /
      C─D
```

### `--squash`

Creates a new single commit:

```text
A ── B ── S
```

The feature commits are not part of the main branch ancestry.

---

# 33. Merge Strategy

Git supports merge strategies.

You can specify one using:

```cmd
git merge -s <strategy> <branch>
```

Example:

```cmd
git merge -s ort feature
```

Modern Git uses `ort` as the default strategy for ordinary two-head merges in current Git versions.

The older `recursive` strategy is historically important.

---

# 34. `ort`

`ort` stands for:

```text
Ostensibly Recursive's Twin
```

It is the modern default merge strategy for typical two-branch merges.

Example:

```cmd
git merge -s ort feature
```

You normally do not need to specify it manually because Git uses it by default in applicable cases.

---

# 35. `resolve`

Git also has the `resolve` strategy:

```cmd
git merge -s resolve feature
```

It is intended for simpler historical merge scenarios.

For modern repositories, normal:

```cmd
git merge feature
```

is generally preferable.

---

# 36. `ours` Merge Strategy

Do not confuse:

```cmd
git merge -s ours feature
```

with:

```cmd
git merge -X ours feature
```

They are fundamentally different.

The `ours` strategy creates a merge commit but uses the current tree as the resulting tree.

Conceptually:

```text
feature history
      ↓
recorded as merged
      ↓
result = current branch tree
```

This is an advanced history operation.

---

# 37. `-X ours`

This is different:

```cmd
git merge -X ours feature
```

Here `ours` is a strategy option.

It tells the merge machinery to prefer the current branch's side for certain conflicts.

It does **not** mean "ignore the entire other branch."

Likewise:

```cmd
git merge -X theirs feature
```

prefers the incoming side for certain conflicts.

These options should not be used blindly because they can silently choose one side of conflicting changes.

---

# 38. `-s ours` vs `-X ours`

This distinction is critical.

```cmd
git merge -s ours feature
```

means:

```text
use the ours merge strategy
```

The resulting tree comes from the current branch.

Whereas:

```cmd
git merge -X ours feature
```

means:

```text
use the normal merge strategy
but prefer ours when resolving applicable conflicts
```

Therefore:

```text
-s ours
    ≠
-X ours
```

---

# 39. Strategy Options

General form:

```cmd
git merge -s <strategy> -X <option> <branch>
```

Example:

```cmd
git merge -s ort -X ours feature
```

Strategy:

```text
ort
```

Strategy option:

```text
ours
```

These are separate concepts.

---

# 40. `--strategy-option`

Long form:

```cmd
git merge --strategy-option=ours feature
```

Equivalent conceptually to:

```cmd
git merge -X ours feature
```

Another example:

```cmd
git merge --strategy-option=theirs feature
```

---

# 41. `--verify-signatures`

Git can verify signatures on commits during merging.

Example:

```cmd
git merge --verify-signatures feature
```

This is useful in workflows where signed commits are required.

Git checks whether the tip commit being merged has a valid signature according to the configured trust model.

---

# 42. `--gpg-sign`

You can request that the resulting merge commit be signed:

```cmd
git merge --gpg-sign feature
```

You can specify a key:

```cmd
git merge --gpg-sign=<key-id> feature
```

This requires appropriate signing configuration.

Modern Git can also use SSH-based signing depending on configuration.

---

# 43. `--signoff`

Add a Signed-off-by line to the merge commit:

```cmd
git merge --signoff feature
```

This is not the same thing as cryptographic commit signing.

It adds a trailer such as:

```text
Signed-off-by: Name <email>
```

---

# 44. Cryptographic Signing vs Signoff

Do not confuse:

```text
--gpg-sign
```

with:

```text
--signoff
```

### Cryptographic signing

Provides a cryptographic signature.

```cmd
git merge --gpg-sign feature
```

### Signoff

Adds a textual commit trailer.

```cmd
git merge --signoff feature
```

They serve different purposes.

---

# 45. `--stat`

Show a summary of changes:

```cmd
git merge --stat feature
```

The output can include:

```text
files changed
insertions
deletions
```

---

# 46. `--no-stat`

Suppress the merge diffstat:

```cmd
git merge --no-stat feature
```

---

# 47. `--log`

Include summarized commit messages from the merged branch in the merge commit message:

```cmd
git merge --log feature
```

This can make merge commits more informative.

---

# 48. `--no-log`

Disable automatic inclusion of merged commit summaries:

```cmd
git merge --no-log feature
```

---

# 49. `--cleanup`

Merge commit messages can be cleaned using:

```cmd
git merge --cleanup=<mode> feature
```

Common cleanup modes include:

```text
strip
whitespace
verbatim
scissors
default
```

This is mainly useful when controlling merge-message formatting.

---

# 50. `--autostash`

Git can automatically stash local changes before a merge and reapply them afterward:

```cmd
git merge --autostash feature
```

Conceptually:

```text
local changes
      ↓
temporary stash
      ↓
merge
      ↓
reapply local changes
```

This can be convenient but may itself produce conflicts when the stash is reapplied.

---

# 51. `--no-autostash`

Disable automatic stashing:

```cmd
git merge --no-autostash feature
```

This is the explicit opposite of `--autostash`.

---

# 52. `--allow-unrelated-histories`

Normally Git refuses to merge histories that have no common ancestor.

Example:

```text
Repository A:

A ── B


Repository B:

X ── Y
```

There is no common ancestor.

Git may report:

```text
fatal: refusing to merge unrelated histories
```

You can explicitly allow it:

```cmd
git merge --allow-unrelated-histories other-branch
```

This should be used intentionally.

---

# 53. Why Unrelated Histories Matter

A normal merge assumes:

```text
both histories
      ↓
share ancestor
```

Unrelated histories look like:

```text
A ── B


X ── Y
```

There is no:

```text
common ancestor
```

This often happens when combining independently initialized repositories.

---

# 54. Merge Two Local Histories

Suppose you have two independently created histories:

```text
project A:
A ── B

project B:
X ── Y
```

If you deliberately want to combine them:

```cmd
git merge project-b --allow-unrelated-histories
```

Git can attempt the merge.

Conflicts may still occur.

---

# 55. Octopus Merge

Git can merge multiple branches at once:

```cmd
git merge feature-a feature-b feature-c
```

This can create an octopus merge:

```text
       feature-a
          \
       feature-b
          \
main ────── M
          /
       feature-c
```

An octopus merge has more than two parents.

---

# 56. Octopus Merge Limitation

Octopus merging is intended primarily for cases where the branches can be merged cleanly without conflicts.

If complicated conflicts occur, Git generally requires separate merges.

Typical workflow:

```cmd
git merge feature-a
git merge feature-b
git merge feature-c
```

instead of forcing everything into one complicated merge.

---

# 57. Merge Multiple Branches

Example:

```cmd
git switch main
git merge feature/auth feature/logging feature/metrics
```

Git may create a multi-parent merge if possible.

Use this deliberately because the resulting graph can be harder to reason about.

---

# 58. `--abort`

Syntax:

```cmd
git merge --abort
```

Use when an in-progress merge should be cancelled.

It attempts to restore:

```text
HEAD
index
working tree
```

to the state before the merge began.

---

# 59. `--quit`

Git also provides:

```cmd
git merge --quit
```

This stops the merge process but does not necessarily restore the working tree/index to the pre-merge state.

Conceptually:

```text
--abort
    → cancel and attempt restoration

--quit
    → stop merge bookkeeping
```

This distinction is important during advanced recovery.

---

# 60. `--continue`

After resolving conflicts:

```cmd
git merge --continue
```

Git attempts to continue the merge.

Typical sequence:

```cmd
git merge feature
```

Conflict:

```cmd
git status
```

Resolve files:

```cmd
git add .
```

Continue:

```cmd
git merge --continue
```

---

# 61. `--continue` vs `git commit`

In a standard merge, after resolving and staging conflicts:

```cmd
git commit
```

can complete the merge.

`git merge --continue` is more explicit about continuing the interrupted merge operation.

The exact behavior can depend on the repository's current state and Git version.

---

# 62. Merge and the Index

During a normal merge:

```text
HEAD
 ↓
current branch commit

INDEX
 ↓
resulting staged state

WORKING TREE
 ↓
files
```

During conflicts, the index can temporarily contain multiple stages for conflicted paths.

Conceptually:

```text
stage 1 → merge base
stage 2 → ours
stage 3 → theirs
```

This is an advanced Git internals concept.

You can inspect unresolved index entries using:

```cmd
git ls-files -u
```

---

# 63. Unmerged Index Entries

During a conflict:

```cmd
git ls-files -u
```

may show multiple entries for the same path.

Conceptually:

```text
100644 <base>   app.js
100644 <ours>   app.js
100644 <theirs> app.js
```

These represent the different versions Git is asking you to reconcile.

After resolution:

```cmd
git add app.js
```

the path becomes resolved in the index.

---

# 64. Merge State Files

During an in-progress merge, Git stores merge state inside the repository metadata.

You may encounter:

```text
.git/MERGE_HEAD
.git/MERGE_MSG
.git/MERGE_MODE
```

These internal files help Git understand that a merge is in progress and which commit(s) are being merged.

You normally should not edit these manually.

---

# 65. `MERGE_HEAD`

During a normal two-branch merge, Git records the incoming commit in:

```text
.git/MERGE_HEAD
```

Conceptually:

```text
current HEAD
     +
MERGE_HEAD
     ↓
merge commit
```

The eventual merge commit has the current commit and the `MERGE_HEAD` commit as parents.

---

# 66. Merge Commit Parent Order

Suppose:

```text
main → C
feature → E
```

You run:

```cmd
git switch main
git merge feature
```

The resulting merge commit:

```text
M
```

typically has:

```text
parent 1 = C
parent 2 = E
```

The first parent is generally the branch you were on when performing the merge.

This becomes important when analyzing history with:

```cmd
git log --first-parent
```

---

# 67. First Parent

Consider:

```text
A ── B ── M ── F ← main
         / \
        C   D
```

The first-parent path follows:

```text
A → B → M → F
```

rather than descending into:

```text
C → D
```

Use:

```cmd
git log --first-parent
```

This is extremely useful for understanding the mainline history of a project.

---

# 68. Merge and `git log --graph`

Use:

```cmd
git log --oneline --graph --decorate --all
```

Example:

```text
*   91ab234 (HEAD -> main) Merge branch 'feature/login'
|\
| * 74cd567 (feature/login) Add login validation
| * 62ab111 Add login form
* | 50fe222 Update API
|/
* 31aa000 Initial commit
```

The graph visually shows the merge topology.

---

# 69. Merge Verification

Before merging:

```cmd
git status
git branch --show-current
git log --oneline --graph --decorate --all
```

Then:

```cmd
git merge feature/login
```

After:

```cmd
git status
git log --oneline --graph --decorate --all
```

This makes the operation auditable.

---

# 70. Recommended Feature Merge Workflow

```cmd
git switch main
git pull
git status
git merge feature/login
```

If successful:

```cmd
git push origin main
```

If conflict:

```cmd
git status
```

Resolve files:

```cmd
git add <resolved-files>
git merge --continue
```

Then:

```cmd
git push origin main
```

---

# 71. Merge With Remote Changes

Suppose:

```text
local main:
A ── B

origin/main:
A ── B ── C
```

Fetch:

```cmd
git fetch origin
```

Then integrate:

```cmd
git merge origin/main
```

This merges the remote-tracking branch into your current local branch.

---

# 72. `pull` and Merge

A common command:

```cmd
git pull
```

usually performs:

```text
fetch
+
integration
```

Depending on configuration, integration can involve:

```text
merge
```

or:

```text
rebase
```

Therefore, understand `git merge` independently before relying on `git pull`.

---

# 73. Merge vs Rebase

Merge:

```text
preserves existing commit topology
```

Example:

```text
A ── B ── M
     \   /
      C─D
```

Rebase:

```text
rewrites commits onto another base
```

Example:

```text
A ── B ── C' ── D'
```

Neither is universally "better."

They produce different histories.

---

# 74. Merge vs Cherry-Pick

Merge:

```text
integrates a branch/history
```

Cherry-pick:

```text
applies selected commit changes as new commits
```

Merge example:

```cmd
git merge feature
```

Cherry-pick:

```cmd
git cherry-pick abc1234
```

Use merge when integrating a branch's history.

Use cherry-pick when intentionally selecting specific commits.

---

# 75. Merge vs Squash

Merge:

```text
preserves branch ancestry
```

Squash:

```text
combines changes into one new commit
```

Example:

```text
MERGE:

A ── B ── M
     \   /
      C─D


SQUASH:

A ── B ── S
```

---

# 76. Merge Strategy Selection

For normal development:

```cmd
git merge feature
```

For explicit feature-branch merge commits:

```cmd
git merge --no-ff feature
```

For strict linear history:

```cmd
git merge --ff-only feature
```

For squashed integration:

```cmd
git merge --squash feature
git commit
```

Choose based on the history policy of the repository.

---

# 77. Dangerous Merge Commands

Be especially careful with:

```cmd
git merge -s ours feature
git merge -X ours feature
git merge -X theirs feature
git merge --discard-changes feature
```

These can produce results different from what you intuitively expect.

Never use `ours` or `theirs` simply because you want a conflict to disappear.

Understand what Git will retain.

---

# 78. Merge Best Practices

Before merging:

```cmd
git status
git branch --show-current
git fetch origin
```

Inspect:

```cmd
git log --oneline --graph --decorate --all
```

Merge deliberately:

```cmd
git merge feature/login
```

After merging:

```cmd
git status
git log --oneline --graph --decorate --all
```

Then test the application.

Finally:

```cmd
git push
```

---

# 79. Production-Safe Merge Checklist

```text
1. Confirm target branch.
2. Confirm working tree is clean.
3. Update remote-tracking references.
4. Inspect the branch graph.
5. Merge the intended source branch.
6. Resolve conflicts carefully.
7. Run tests.
8. Inspect the resulting history.
9. Push the resulting branch.
```

Example:

```cmd
git switch main
git status
git fetch origin
git log --oneline --graph --decorate --all
git merge feature/login
git status
```

Then test and push.

---

# 80. Core Merge Commands

```cmd
git merge feature
```

Normal merge.

```cmd
git merge --no-ff feature
```

Force merge commit.

```cmd
git merge --ff-only feature
```

Fast-forward only.

```cmd
git merge --squash feature
```

Squash changes.

```cmd
git merge --no-commit feature
```

Do not automatically create merge commit.

```cmd
git merge --abort
```

Abort merge.

```cmd
git merge --continue
```

Continue after conflict resolution.

```cmd
git merge --quit
```

Quit merge operation without restoring the pre-merge state.

```cmd
git merge --allow-unrelated-histories feature
```

Allow histories without a common ancestor.

---

# 81. Advanced Merge Commands

```cmd
git merge -s ort feature
```

Specify merge strategy.

```cmd
git merge -X ours feature
```

Prefer ours for applicable conflicts.

```cmd
git merge -X theirs feature
```

Prefer theirs for applicable conflicts.

```cmd
git merge -s ours feature
```

Use the `ours` strategy.

```cmd
git merge --verify-signatures feature
```

Verify signatures.

```cmd
git merge --gpg-sign feature
```

Sign merge commit.

```cmd
git merge --signoff feature
```

Add signoff trailer.

```cmd
git merge --autostash feature
```

Automatically stash local changes.

```cmd
git merge --log feature
```

Include merged commit summaries.

```cmd
git merge --stat feature
```

Show diffstat.

---

# 82. The Complete Merge Mental Model

Think of merge as:

```text
                 SOURCE
                   │
                   ↓
             feature/login
                   │
                   │
                   ↓
CURRENT BRANCH ───────────────→ TARGET
       │
       ↓
      main
```

Command:

```cmd
git switch main
git merge feature/login
```

means:

```text
CURRENT:
main

SOURCE:
feature/login

RESULT:
feature/login changes integrated into main
```

---

# 83. Commit Graph Model

Before:

```text
             C ← main
            /
A ── B
            \
             D ── E ← feature
```

Three-way merge uses:

```text
base   = B
ours   = C
theirs = E
```

Result:

```text
             C
            / \
A ── B ────    M ← main
            \ /
             E
```

The merge commit records both histories.

---

# 84. Fast-Forward Model

Before:

```text
A ── B ← main
          \
           C ── D ← feature
```

After:

```text
A ── B ── C ── D
               ↑
          main, feature
```

No new commit.

Only:

```text
main → D
```

changes.

---

# 85. Non-Fast-Forward Model

Before:

```text
        C ← main
       /
A ── B
       \
        D ← feature
```

After:

```text
        C
       / \
A ── B   M ← main
       \ /
        D
```

A new merge commit is required because both branches contain unique commits.

---

# 86. The Most Important Rules

### Rule 1

The current branch receives the merge:

```cmd
git switch main
git merge feature
```

means:

```text
feature → main
```

---

### Rule 2

Fast-forward does not create a merge commit.

```cmd
git merge feature
```

may simply move the branch pointer.

---

### Rule 3

`--no-ff` forces a merge commit.

```cmd
git merge --no-ff feature
```

---

### Rule 4

`--ff-only` refuses a non-fast-forward merge.

```cmd
git merge --ff-only feature
```

---

### Rule 5

Conflicts are normal.

Resolve them rather than blindly choosing one side.

---

### Rule 6

Abort an unwanted merge:

```cmd
git merge --abort
```

---

### Rule 7

Squash is not the same as merge.

```cmd
git merge --squash feature
```

creates changes ready for a new commit rather than preserving the feature branch's ancestry.

---

# 87. Final Summary

```text
git merge
    │
    ├── integrates histories
    │
    ├── current branch = target
    │
    ├── source branch = argument
    │
    ├── may fast-forward
    │
    ├── may create merge commit
    │
    ├── may produce conflicts
    │
    └── uses merge-base for three-way merging
```

Essential commands:

```cmd
git switch main
git merge feature
```

Fast-forward only:

```cmd
git merge --ff-only feature
```

Force merge commit:

```cmd
git merge --no-ff feature
```

Squash:

```cmd
git merge --squash feature
git commit
```

Abort:

```cmd
git merge --abort
```

Continue:

```cmd
git merge --continue
```

Inspect:

```cmd
git log --oneline --graph --decorate --all
```

Find merge base:

```cmd
git merge-base main feature
```

Inspect unresolved index stages:

```cmd
git ls-files -u
```

The central concept to remember is:

```text
                 SOURCE
                    ↓
             feature/login
                    ↓
                    ↓
             git merge feature
                    ↓
             CURRENT BRANCH
                    ↓
                  main
```

**`git merge` integrates the source branch into the branch you are currently on.**

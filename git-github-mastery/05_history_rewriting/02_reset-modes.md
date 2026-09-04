# Git Reset Modes

## 1. What Is `git reset`?

`git reset` moves the current branch reference to another commit and, depending on the mode, can also change the **index** and **working tree**.

The three primary modes are:

```text
--soft
--mixed
--hard
```

The most important mental model is:

```text
HEAD
 │
 ↓
Branch reference
 │
 ↓
Commit history

Index
 │
 ↓
Staging area

Working tree
 │
 ↓
Files on disk
```

`git reset` can affect these layers differently.

---

# 2. The Three Areas

Git's local state can be understood as three major areas:

```text
┌──────────────────────┐
│ Working Tree         │
│ Files you edit       │
└──────────┬───────────┘
           │ git add
           ↓
┌──────────────────────┐
│ Index / Staging Area  │
│ Next commit snapshot  │
└──────────┬───────────┘
           │ git commit
           ↓
┌──────────────────────┐
│ Repository / History  │
│ Commits               │
└──────────────────────┘
```

`git reset` can manipulate all three.

---

# 3. What Does `HEAD` Mean?

`HEAD` identifies your current position in the repository.

Normally:

```text
HEAD
 ↓
main
 ↓
C
```

So:

```text
HEAD → main → C
```

When you reset:

```cmd
git reset HEAD~1
```

the branch moves:

```text
Before:

A ── B ── C
         ↑
        main
         ↑
        HEAD


After:

A ── B
     ↑
    main
     ↑
    HEAD

C
```

The branch reference moved from `C` to `B`.

---

# 4. Basic Syntax

```cmd
git reset [mode] [commit]
```

Examples:

```cmd
git reset --soft HEAD~1
```

```cmd
git reset --mixed HEAD~1
```

```cmd
git reset --hard HEAD~1
```

If no mode is specified:

```cmd
git reset HEAD~1
```

Git uses:

```text
--mixed
```

by default.

---

# 5. `HEAD~1`

`HEAD~1` means:

```text
the first parent of HEAD
```

If:

```text
A ── B ── C
         ↑
        HEAD
```

then:

```text
HEAD
  ↓
C

HEAD~1
  ↓
B

HEAD~2
  ↓
A
```

Therefore:

```cmd
git reset --soft HEAD~1
```

moves the branch back one commit.

---

# 6. `HEAD~2`

Given:

```text
A ── B ── C ── D
              ↑
             HEAD
```

then:

```text
HEAD~1 = C
HEAD~2 = B
HEAD~3 = A
```

Example:

```cmd
git reset --mixed HEAD~2
```

moves the branch from `D` to `B`.

---

# 7. `HEAD^`

Another way to refer to a parent:

```cmd
git reset --soft HEAD^
```

For a normal linear history:

```text
A ── B ── C
         ↑
        HEAD
```

both:

```text
HEAD^
```

and:

```text
HEAD~1
```

refer to:

```text
B
```

For ordinary single-parent commits:

```text
HEAD^ == HEAD~1
```

---

# 8. `--soft`

Command:

```cmd
git reset --soft <commit>
```

moves:

```text
HEAD / current branch
```

but leaves:

```text
index
working tree
```

unchanged.

Conceptually:

```text
Commit history  ← MOVED
Index            ← UNCHANGED
Working tree     ← UNCHANGED
```

---

# 9. Soft Reset Example

Before:

```text
A ── B ── C
         ↑
        main
```

Run:

```cmd
git reset --soft HEAD~1
```

After:

```text
A ── B
     ↑
    main

C's changes
     ↓
  STAGED
```

The commit `C` is no longer the branch tip.

But the changes introduced by `C` remain staged.

---

# 10. When to Use `--soft`

Use:

```cmd
git reset --soft
```

when you want to:

- undo one or more commits
- keep all changes staged
- combine commits
- redo the commit
- modify the commit message
- reconstruct recent history

Example:

```cmd
git reset --soft HEAD~3
```

This moves the branch back three commits while preserving the accumulated changes in the index.

You can then create a new commit:

```cmd
git commit -m "Combine recent work"
```

---

# 11. Soft Reset as Commit Squashing

Suppose:

```text
A ── B ── C ── D
```

You want to combine `B`, `C`, and `D`.

Run:

```cmd
git reset --soft A
```

Conceptually:

```text
A
↑
main

B + C + D changes
        ↓
     staged
```

Then:

```cmd
git commit -m "Implement complete feature"
```

Result:

```text
A ── E
```

where `E` contains the combined changes.

This is a simple form of history rewriting.

---

# 12. `--mixed`

Command:

```cmd
git reset --mixed <commit>
```

This moves:

```text
HEAD / branch
```

and resets:

```text
index
```

but preserves the working tree.

Conceptually:

```text
Commit history  ← MOVED
Index            ← RESET
Working tree     ← UNCHANGED
```

This is the default reset mode.

---

# 13. Mixed Reset Example

Before:

```text
A ── B ── C
         ↑
        main
```

Run:

```cmd
git reset --mixed HEAD~1
```

After:

```text
A ── B
     ↑
    main
```

The changes introduced by `C` remain in the working tree, but they are no longer staged.

So:

```text
Working tree:
modified

Index:
not staged
```

---

# 14. Default `git reset`

These are equivalent:

```cmd
git reset HEAD~1
```

and:

```cmd
git reset --mixed HEAD~1
```

Therefore, when you see:

```cmd
git reset <commit>
```

understand that it normally means:

```cmd
git reset --mixed <commit>
```

---

# 15. When to Use `--mixed`

Use mixed reset when you want to:

- undo commits but keep the file changes
- unstage changes
- reconstruct commits
- separate changes into different commits
- move the branch backward without deleting working-tree changes

Example:

```cmd
git reset HEAD~1
```

Then inspect:

```cmd
git status
```

Your previous commit's changes are now unstaged.

---

# 16. `--hard`

Command:

```cmd
git reset --hard <commit>
```

moves:

```text
HEAD / branch
```

resets:

```text
index
```

and updates:

```text
working tree
```

Conceptually:

```text
Commit history  ← MOVED
Index            ← RESET
Working tree     ← RESET
```

This is the most destructive common reset mode.

---

# 17. Hard Reset Example

Before:

```text
A ── B ── C
         ↑
        main
```

Run:

```cmd
git reset --hard HEAD~1
```

After:

```text
A ── B
     ↑
    main
```

The working tree is also updated to match `B`.

The changes introduced by `C` are no longer present in the working tree.

---

# 18. Hard Reset Warning

Be extremely careful with:

```cmd
git reset --hard
```

It can discard uncommitted changes.

Example:

```text
Working tree:
modified file
```

Then:

```cmd
git reset --hard HEAD
```

can remove those working-tree modifications.

Before using it, check:

```cmd
git status
```

---

# 19. The Reset Mode Matrix

| Mode      | Branch / HEAD | Index     | Working Tree |
| --------- | ------------- | --------- | ------------ |
| `--soft`  | moved         | unchanged | unchanged    |
| `--mixed` | moved         | reset     | unchanged    |
| `--hard`  | moved         | reset     | reset        |

The core difference is:

```text
--soft
    ↓
only history/reference

--mixed
    ↓
history + staging area

--hard
    ↓
history + staging area + working tree
```

---

# 20. Visual Comparison

Suppose:

```text
A ── B ── C
         ↑
        HEAD
```

### Soft

```text
A ── B
     ↑
    HEAD

C changes → staged
```

### Mixed

```text
A ── B
     ↑
    HEAD

C changes → unstaged
```

### Hard

```text
A ── B
     ↑
    HEAD

C changes → removed from working tree
```

---

# 21. Reset Does Not Normally Delete Commits Immediately

Suppose:

```text
A ── B ── C
         ↑
        main
```

Run:

```cmd
git reset --hard B
```

Now:

```text
A ── B
     ↑
    main

C
```

The branch no longer reaches `C`.

But `C` can remain in the repository's object database and may be recoverable through:

```cmd
git reflog
```

This is why reflog is essential when learning reset.

---

# 22. Recover From a Reset

Suppose you accidentally run:

```cmd
git reset --hard HEAD~2
```

Check:

```cmd
git reflog
```

You may see:

```text
HEAD@{0}
HEAD@{1}
HEAD@{2}
```

Find the previous commit ID.

Then:

```cmd
git reset --hard <commit-id>
```

The branch can be moved back to the previous position.

---

# 23. Reset and Reflog

Think of the relationship:

```text
reset
  ↓
moves branch
  ↓
reflog records movement
  ↓
previous position can often be recovered
```

This is one of the most important safety concepts in Git.

---

# 24. Reset a Single Commit

Undo the latest commit but keep changes staged:

```cmd
git reset --soft HEAD~1
```

Undo the latest commit and keep changes unstaged:

```cmd
git reset --mixed HEAD~1
```

Undo the latest commit and discard its changes:

```cmd
git reset --hard HEAD~1
```

---

# 25. Reset Multiple Commits

Three commits:

```text
A ── B ── C ── D
              ↑
             HEAD
```

Move back three commits:

```cmd
git reset --soft HEAD~3
```

Now:

```text
A
↑
HEAD
```

Changes represented by:

```text
B
C
D
```

remain staged.

---

# 26. Reset to a Specific Commit

Instead of relative notation:

```cmd
git reset --mixed abc1234
```

or:

```cmd
git reset --hard abc1234
```

The target can be any valid Git revision.

Examples:

```cmd
git reset HEAD~2
git reset HEAD^
git reset abc1234
git reset main
git reset origin/main
```

---

# 27. Reset to a Branch

Example:

```cmd
git reset --hard main
```

This moves the current branch to the commit currently referenced by:

```text
main
```

If you are on `feature/login`:

```text
feature/login ── C
main          ── B
```

then:

```cmd
git reset --hard main
```

produces:

```text
feature/login ── B
main          ── B
```

---

# 28. Reset to a Remote-Tracking Branch

You can reset to:

```cmd
git reset --hard origin/main
```

This makes the current branch point at your local remote-tracking reference.

Important:

```text
origin/main
```

is your local representation of the remote branch.

It is updated by:

```cmd
git fetch
```

---

# 29. Synchronize Local Branch to Remote-Tracking Branch

Suppose:

```text
local main:
A ── B ── C

origin/main:
A ── B
```

Run:

```cmd
git reset --hard origin/main
```

Result:

```text
local main:
A ── B

origin/main:
A ── B
```

Local commits represented by `C` are no longer on `main`.

Be careful: this also changes the working tree.

---

# 30. Reset and Unstaging

You can use reset to unstage a file:

```cmd
git reset HEAD -- file.txt
```

Modern Git also provides:

```cmd
git restore --staged file.txt
```

The important distinction is that:

```cmd
git reset HEAD -- file.txt
```

does not move the branch.

It updates the index for the specified path.

---

# 31. Path-Specific Reset

General form:

```cmd
git reset [commit] -- <path>
```

Example:

```cmd
git reset HEAD -- src/app.js
```

This resets the index entry for:

```text
src/app.js
```

without moving the branch.

This is different from:

```cmd
git reset HEAD~1
```

which changes the branch position.

---

# 32. `git reset` Has Two Major Forms

### Commit-level reset

```cmd
git reset --hard HEAD~1
```

Changes branch/HEAD position.

### Path-level reset

```cmd
git reset HEAD -- file.js
```

Updates the index for a path.

Understanding this distinction prevents many mistakes.

---

# 33. Reset and the Working Tree

For commit-level reset:

```text
--soft
```

does not update files.

```text
--mixed
```

does not update files.

```text
--hard
```

updates files.

Therefore:

```text
soft  → files stay
mixed → files stay
hard  → files change to target commit
```

---

# 34. Reset and the Index

For commit-level reset:

```text
--soft
```

keeps the index as it was.

```text
--mixed
```

makes the index match the target commit.

```text
--hard
```

also makes the index match the target commit.

So:

```text
soft  → index unchanged
mixed → index = target
hard  → index = target
```

---

# 35. Reset and HEAD

All three modes move the branch/HEAD to the specified commit:

```text
soft  → HEAD moves
mixed → HEAD moves
hard  → HEAD moves
```

This is the common operation shared by all three modes.

---

# 36. Reset vs Checkout

Historically, Git used:

```cmd
git checkout
```

for many operations involving branches and files.

Modern Git separates responsibilities:

```cmd
git switch
```

for branches.

```cmd
git restore
```

for files.

`git reset` remains important for:

```text
branch movement
index manipulation
history rewriting
```

---

# 37. Reset vs Restore

To unstage:

```cmd
git restore --staged file.js
```

or:

```cmd
git reset HEAD -- file.js
```

To discard working-tree changes:

```cmd
git restore file.js
```

To move the branch:

```cmd
git reset --hard HEAD~1
```

These commands have different responsibilities.

---

# 38. Reset vs Revert

This distinction is critical.

### Reset

```cmd
git reset --hard HEAD~1
```

moves your branch backward.

It rewrites local branch history.

### Revert

```cmd
git revert <commit>
```

creates a new commit that reverses an earlier commit.

Example:

```text
Before:

A ── B ── C
```

Reset:

```text
A ── B
```

Revert:

```text
A ── B ── C ── D
              ↑
        inverse of C
```

For already-published shared history, revert is often the safer approach.

---

# 39. Reset vs Amend

Amend:

```cmd
git commit --amend
```

replaces the current latest commit with a new one.

Reset:

```cmd
git reset HEAD~1
```

moves the branch to an earlier commit.

Conceptually:

```text
amend:
A ── B → B'

reset:
A ── B ── C
         ↓
       move to B
```

---

# 40. Reset vs Rebase

Reset:

```text
move a reference
```

Rebase:

```text
replay commits onto another base
```

Example:

```text
reset:

A ── B ── C
         ↑
        main

A ── B
     ↑
    main
```

Rebase:

```text
Before:

A ── B ── C
     \
      D ── E

After:

A ── B ── C ── D' ── E'
```

Rebase creates replacement commits.

---

# 41. Soft Reset for Squashing

Example:

```text
A ── B ── C ── D
```

Run:

```cmd
git reset --soft A
```

Then:

```cmd
git commit -m "Complete feature"
```

Result:

```text
A ── E
```

This is useful when you want to convert several local commits into one clean commit.

---

# 42. Mixed Reset for Reorganizing Commits

Suppose:

```text
A ── B ── C ── D
```

Run:

```cmd
git reset --mixed A
```

Now the changes from:

```text
B
C
D
```

are in the working tree.

You can selectively stage:

```cmd
git add file1.js
git commit -m "Add authentication"
```

Then:

```cmd
git add file2.js
git commit -m "Add authorization"
```

This lets you reconstruct a cleaner history.

---

# 43. Hard Reset for Throwing Away Local Work

Suppose:

```text
local:
A ── B ── C

origin/main:
A ── B
```

If you are certain that local `C` should be discarded:

```cmd
git fetch origin
git reset --hard origin/main
```

Result:

```text
local:
A ── B

origin/main:
A ── B
```

This is a common recovery/synchronization technique.

---

# 44. `ORIG_HEAD`

Git can save the previous tip in:

```text
ORIG_HEAD
```

Certain operations such as:

```text
merge
rebase
reset
```

can use `ORIG_HEAD` as a recovery reference.

You can inspect it:

```cmd
git show ORIG_HEAD
```

And potentially return to it:

```cmd
git reset --hard ORIG_HEAD
```

Do not assume `ORIG_HEAD` is a permanent backup; reflog is the broader recovery mechanism.

---

# 45. Reset and Merge Commits

Merge commits have multiple parents.

For example:

```text
      C
     / \
A ── B   M
     \ /
      D
```

A merge commit has:

```text
parent 1
parent 2
```

Therefore:

```text
M^1
```

and:

```text
M^2
```

can refer to different parents.

This matters when using reset with merge commits.

---

# 46. `HEAD^1` and `HEAD^2`

For a merge commit:

```text
      B
     / \
A ── C   M
     \ /
      D
```

If:

```text
HEAD = M
```

then:

```cmd
git rev-parse HEAD^1
```

selects the first parent.

And:

```cmd
git rev-parse HEAD^2
```

selects the second parent.

This is different from:

```text
HEAD~1
```

because `~` follows the first-parent chain.

---

# 47. Reset With Merge Commit

For example:

```cmd
git reset --hard HEAD^1
```

moves the current branch to the first parent of the merge commit.

Whereas:

```cmd
git reset --hard HEAD^2
```

moves it to the second parent.

This is an advanced operation and should only be used after understanding the merge graph.

---

# 48. Reset and Remote Branches

Resetting:

```cmd
git reset --hard origin/main
```

only changes your local branch.

It does **not** change the remote repository.

To change the remote branch after rewriting history, you would need a push.

Potentially:

```cmd
git push --force-with-lease
```

This should only be done when rewriting the remote branch is intentional and permitted.

---

# 49. Reset and Public History

Suppose the remote contains:

```text
A ── B ── C
```

You reset locally:

```text
A ── B
```

Then:

```cmd
git push --force-with-lease
```

would rewrite the remote branch to:

```text
A ── B
```

Other developers who already based work on `C` can be affected.

Therefore:

```text
local reset
    ≠
remote reset
```

A reset becomes a remote history rewrite only after the resulting reference is pushed.

---

# 50. Safety Checklist

Before:

```cmd
git reset --hard
```

check:

```cmd
git status
```

Inspect:

```cmd
git log --graph --oneline --decorate --all
```

Check current branch:

```cmd
git branch --show-current
```

Check upstream:

```cmd
git branch -vv
```

If necessary, inspect:

```cmd
git reflog
```

Then perform the reset.

---

# 51. Common Reset Recipes

### Undo latest commit, keep staged

```cmd
git reset --soft HEAD~1
```

### Undo latest commit, keep changes unstaged

```cmd
git reset --mixed HEAD~1
```

### Undo latest commit and discard changes

```cmd
git reset --hard HEAD~1
```

### Unstage a file

```cmd
git reset HEAD -- file.js
```

### Reset to a specific commit

```cmd
git reset --hard abc1234
```

### Reset local branch to remote-tracking branch

```cmd
git fetch origin
git reset --hard origin/main
```

### Find previous positions

```cmd
git reflog
```

---

# 52. Decision Tree

```text
Need to move the current branch?
        │
        ↓
      reset
        │
        ├── Keep staging exactly as-is?
        │        ↓
        │      --soft
        │
        ├── Keep files but unstage them?
        │        ↓
        │      --mixed
        │
        └── Make files exactly match target?
                 ↓
               --hard
```

---

# 53. Reset Mode Mental Model

Remember this:

```text
                    HEAD
                     │
                     ↓
                 branch ref
                     │
                     ↓
                   COMMIT
                     │
                     │
               ┌─────┴─────┐
               ↓           ↓
             INDEX     WORKING TREE
```

### `--soft`

```text
HEAD       → target
INDEX      → unchanged
WORKTREE   → unchanged
```

### `--mixed`

```text
HEAD       → target
INDEX      → target
WORKTREE   → unchanged
```

### `--hard`

```text
HEAD       → target
INDEX      → target
WORKTREE   → target
```

This is the single most important table in this file.

---

# 54. Advanced Example

Initial state:

```text
A ── B ── C ── D
              ↑
             main

working tree:
modified X.js
```

Run:

```cmd
git reset --soft B
```

Result:

```text
A ── B
     ↑
    main

Index:
C + D changes staged

Working tree:
C + D changes
+
previous modification to X.js
```

The index and working tree are not simply "cleaned"; their exact state depends on what was already staged and modified before the reset.

---

# 55. Another Advanced Example

Initial:

```text
A ── B ── C
         ↑
        main

working tree:
modified X.js
```

Run:

```cmd
git reset --mixed B
```

Result:

```text
A ── B
     ↑
    main

Index:
matches B

Working tree:
C's changes
+
existing X.js modification
```

The existing working-tree modification remains.

---

# 56. Hard Reset and Local Modifications

Suppose:

```text
HEAD:
A ── B
```

and:

```text
working tree:
X.js modified
```

Run:

```cmd
git reset --hard HEAD
```

The working tree becomes:

```text
X.js = version from HEAD
```

The uncommitted modification is discarded.

Therefore:

```text
--hard
```

must be treated as a potentially destructive command.

---

# 57. Reset Does Not Push

Running:

```cmd
git reset --hard HEAD~1
```

does not contact GitHub or another remote server.

It changes your local repository.

Only a later command such as:

```cmd
git push
```

communicates with the remote.

---

# 58. Reset Does Not Delete Remote Commits

Suppose:

```text
local main:
A ── B

origin/main:
A ── B ── C
```

Running:

```cmd
git reset --hard origin/main
```

would actually move local `main` to `C`.

But:

```cmd
git reset --hard B
```

only moves your local branch.

The remote still contains:

```text
A ── B ── C
```

unless you intentionally rewrite the remote through a push.

---

# 59. Important Difference: Reachability

Git commits form a graph.

A branch is a reference:

```text
main → C
```

If you reset:

```text
main → B
```

then:

```text
C
```

may become unreachable from `main`.

But it can still exist as a Git object.

This distinction is important:

```text
not reachable from branch
        ≠
immediately deleted
```

Garbage collection can eventually remove unreachable objects when they are no longer protected by references/reflogs.

---

# 60. Final Command Reference

```cmd
git reset --soft <commit>
git reset --mixed <commit>
git reset --hard <commit>
```

Default:

```cmd
git reset <commit>
```

Path-specific:

```cmd
git reset <commit> -- <path>
```

Examples:

```cmd
git reset HEAD~1
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
git reset HEAD -- file.js
git reset --hard origin/main
```

Recovery:

```cmd
git reflog
```

Inspection:

```cmd
git status
git branch -vv
git log --graph --oneline --decorate --all
git show HEAD
```

---

# 61. Final Rules

```text
1. git reset moves the current branch to another commit.

2. --soft moves the branch but leaves index and working tree unchanged.

3. --mixed moves the branch and resets the index while preserving
   working-tree changes.

4. --mixed is the default reset mode.

5. --hard moves the branch, resets the index, and updates the
   working tree to match the target.

6. --hard can destroy uncommitted working-tree changes.

7. HEAD~1 means the first parent of HEAD.

8. HEAD^ normally means the first parent of HEAD.

9. HEAD^1 and HEAD^2 are especially important for merge commits.

10. A path-specific reset can modify the index without moving the branch.

11. Reset is different from revert.

12. Reset is different from rebase.

13. Reset is different from amend.

14. Reset is local unless you subsequently push the rewritten history.

15. Reflog is an essential recovery mechanism after accidental resets.

16. A reset does not necessarily immediately delete unreachable commits.

17. Always inspect the graph before complicated history rewriting.

18. Use --hard only when you understand exactly what will happen to
    your working tree.

19. For shared public history, prefer non-rewriting approaches such as
    git revert when appropriate.

20. The core model is:

    --soft  = move HEAD
    --mixed = move HEAD + reset index
    --hard  = move HEAD + reset index + reset working tree
```

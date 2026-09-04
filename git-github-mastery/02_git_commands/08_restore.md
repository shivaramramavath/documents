# `git restore`

`git restore` is used to **restore files to a previous state**.

It is primarily used to:

```text
Discard working-tree changes
Unstage files
Restore files from a specific commit
Restore files from another source
Restore selected files safely
```

The key concept is:

```text
git restore
    changes files

git restore --staged
    changes the staging area
```

Unlike `git reset`, `git restore` is specifically designed for restoring file content and staging state.

---

# 1. Basic Syntax

```cmd
git restore <file>
```

Example:

```cmd
git restore app.js
```

This restores `app.js` in the **working tree**.

---

# 2. What Does `git restore` Restore From?

By default:

```cmd
git restore file.txt
```

restores the working-tree file from the **index (staging area)**.

Conceptually:

```text
Index
  │
  │ git restore
  ▼
Working Tree
```

Therefore, it discards the unstaged modifications for that file.

---

# 3. Example

Original committed file:

```javascript
console.log("Hello");
```

You modify it:

```javascript
console.log("Hello World");
```

Run:

```cmd
git diff
```

You see:

```diff
-console.log("Hello");
+console.log("Hello World");
```

Now:

```cmd
git restore app.js
```

The working-tree file returns to:

```javascript
console.log("Hello");
```

The unstaged modification is discarded.

---

# 4. Important Warning

This command can permanently discard **uncommitted working-tree changes**:

```cmd
git restore app.js
```

If the change exists only in the working tree and has not been committed or otherwise preserved, restoring it may make that work difficult or impossible to recover.

Always inspect first:

```cmd
git diff
```

---

# 5. Restore Multiple Files

```cmd
git restore app.js server.js
```

Restores both files.

---

# 6. Restore an Entire Directory

```cmd
git restore src\
```

This restores matching tracked files under the directory.

Be careful with broad paths.

---

# 7. Restore Everything

```cmd
git restore .
```

This restores all matching tracked files in the current directory and below.

It discards unstaged changes.

Use:

```cmd
git status
```

before doing this.

---

# 8. Restore a Specific File From HEAD

Explicitly specify the source:

```cmd
git restore --source=HEAD app.js
```

This means:

```text
HEAD
 │
 ▼
app.js in Working Tree
```

---

# 9. Restore From a Specific Commit

```cmd
git restore --source=<commit> <file>
```

Example:

```cmd
git restore --source=a1b2c3d app.js
```

This takes the version of `app.js` from commit:

```text
a1b2c3d
```

and restores it into the working tree.

---

# 10. Restore From a Branch

```cmd
git restore --source=main app.js
```

This restores the version of `app.js` from `main`.

The current branch does **not** change.

Only the selected file is restored.

---

# 11. Restore From a Remote-Tracking Branch

```cmd
git restore --source=origin/main app.js
```

This uses the version represented by:

```text
origin/main
```

and places it into the working tree.

---

# 12. Restore From a Tag

```cmd
git restore --source=v1.0.0 app.js
```

This restores the file version represented by the tag.

---

# 13. Restore From `HEAD~1`

```cmd
git restore --source=HEAD~1 app.js
```

This restores `app.js` from the parent of the current commit.

---

# 14. Restore From `HEAD^`

```cmd
git restore --source=HEAD^ app.js
```

`HEAD^` normally refers to the first parent of `HEAD`.

For ordinary linear history:

```text
HEAD^
  │
  ▼
previous commit
```

---

# 15. Restore From `HEAD~3`

```cmd
git restore --source=HEAD~3 app.js
```

This restores the version from approximately three first-parent steps before `HEAD`.

---

# 16. `--source`

General syntax:

```cmd
git restore --source=<tree> <path>
```

`<tree>` can commonly be a revision such as:

```text
HEAD
HEAD~1
commit hash
branch
tag
remote-tracking branch
```

Example:

```cmd
git restore --source=main -- src\app.js
```

---

# 17. Why `--` Is Useful

You can write:

```cmd
git restore --source=main -- src\app.js
```

The `--` separates:

```text
revision/options
```

from:

```text
path
```

This removes ambiguity when names could be interpreted as revisions.

---

# 18. Unstage a File

```cmd
git restore --staged app.js
```

This removes the file's changes from the staging area.

It does **not** normally discard the working-tree changes.

This is one of the most important uses of `git restore`.

---

# 19. Example: Unstage

Suppose:

```cmd
git add app.js
```

Now:

```cmd
git status
```

shows `app.js` as staged.

Run:

```cmd
git restore --staged app.js
```

Now the change becomes:

```text
Staged
  ↓
Unstaged
```

The file's working-tree modifications remain.

---

# 20. `restore` vs `restore --staged`

This distinction is critical:

```cmd
git restore app.js
```

means:

```text
Index → Working Tree
```

It discards unstaged changes.

While:

```cmd
git restore --staged app.js
```

means:

```text
HEAD → Index
```

It unstages the file.

---

# 21. Visual Model

```text
             HEAD
              │
              │
              ▼
           Index
              │
              │
              ▼
        Working Tree
```

Normal restore:

```cmd
git restore file
```

does:

```text
Index ──────────► Working Tree
```

Staged restore:

```cmd
git restore --staged file
```

does:

```text
HEAD ───────────► Index
```

---

# 22. Restore Both Staging and Working Tree

If you want to completely restore a file to `HEAD`:

```cmd
git restore --source=HEAD --staged --worktree app.js
```

This resets both:

```text
Index
Working Tree
```

to the version from:

```text
HEAD
```

This is destructive to uncommitted changes in that file.

---

# 23. Short Form

You can use:

```cmd
git restore -SW app.js
```

where:

```text
-S = --staged
-W = --worktree
```

However, the long form is often clearer when learning:

```cmd
git restore --source=HEAD --staged --worktree app.js
```

---

# 24. `--worktree`

Explicitly restore the working tree:

```cmd
git restore --worktree app.js
```

This is essentially making the target of the operation explicit.

---

# 25. `--staged`

Explicitly target the staging area:

```cmd
git restore --staged app.js
```

The staging area is also called the:

```text
Index
```

---

# 26. `--staged --worktree`

Both targets:

```cmd
git restore --staged --worktree app.js
```

This restores both the index and working tree.

When using both, specifying `--source` explicitly is often the clearest approach:

```cmd
git restore --source=HEAD --staged --worktree app.js
```

---

# 27. Restore a File While Keeping Its Staged Version

Suppose:

```text
HEAD
 │
 ▼
Index
 │
 ▼
Working Tree
```

You have:

```text
staged change
+
additional unstaged change
```

Run:

```cmd
git restore app.js
```

The working tree is restored from the index.

Therefore:

```text
staged change
```

remains.

The additional unstaged change disappears.

This is a powerful way to discard only the unstaged portion of a file.

---

# 28. Unstage While Keeping Working Changes

Suppose:

```text
HEAD
 │
 ▼
Index
 │
 ▼
Working Tree
```

You staged changes.

Run:

```cmd
git restore --staged app.js
```

Now:

```text
HEAD
 │
 ▼
Index
 │
 ▼
Working Tree
```

The index is restored to the `HEAD` version while your working-tree content remains.

Therefore:

```text
staged → unstaged
```

---

# 29. Restore From Another Branch Without Switching Branches

Suppose:

```text
main
feature
```

You are currently on:

```text
feature
```

You want one file from `main`.

Instead of:

```cmd
git switch main
```

you can simply:

```cmd
git restore --source=main -- app.js
```

This is much more targeted.

Your current branch remains unchanged.

---

# 30. Restore Multiple Files From Another Branch

```cmd
git restore --source=main -- app.js server.js
```

---

# 31. Restore an Entire Directory From Another Branch

```cmd
git restore --source=main -- src\
```

This can overwrite working-tree changes under that path.

Use carefully.

---

# 32. Restore From a Commit Into the Index

You can restore directly into the staging area:

```cmd
git restore --source=a1b2c3d --staged app.js
```

This means:

```text
commit a1b2c3d
        │
        ▼
      Index
```

The working tree is not necessarily changed by this operation.

---

# 33. Restore Commit Version Into Both

```cmd
git restore --source=a1b2c3d --staged --worktree app.js
```

Now:

```text
a1b2c3d
   │
   ├────────► Index
   │
   └────────► Working Tree
```

---

# 34. Restore a File to an Older Version and Stage It

```cmd
git restore --source=HEAD~1 --staged --worktree app.js
```

This effectively prepares the older version of `app.js` for the next commit.

Important:

This does **not** move `HEAD`.

---

# 35. Restore Does Not Rewrite History

Consider:

```text
A ── B ── C (HEAD)
```

Running:

```cmd
git restore --source=A app.js
```

does not change:

```text
A
B
C
```

The commit history remains untouched.

It only changes file state in the working tree, and optionally the index.

---

# 36. Restore Does Not Move HEAD

```cmd
git restore ...
```

does not perform:

```text
HEAD → another commit
```

It does not switch branches.

It does not reset the current branch pointer.

---

# 37. Restore vs Reset

Modern Git provides different commands for different purposes.

### Restore

```cmd
git restore
```

Primarily:

```text
restore file content
restore staging state
```

### Reset

```cmd
git reset
```

Can manipulate:

```text
HEAD
Index
Working Tree
```

depending on the mode.

### Revert

```cmd
git revert
```

creates a **new commit** that reverses an earlier commit.

Mental model:

```text
restore
    restore files

reset
    move/reset references and/or index/worktree

revert
    create a new reversing commit
```

---

# 38. Restore vs Checkout

Older Git workflows often used:

```cmd
git checkout -- app.js
```

to discard working-tree changes.

Modern Git separates responsibilities:

```cmd
git restore app.js
```

for restoring files.

And:

```cmd
git switch branch-name
```

for switching branches.

This separation makes Git commands easier to reason about.

---

# 39. Restore vs `git checkout`

Old:

```cmd
git checkout -- app.js
```

Modern:

```cmd
git restore app.js
```

Old:

```cmd
git checkout main -- app.js
```

Modern:

```cmd
git restore --source=main -- app.js
```

The modern commands communicate intent more clearly.

---

# 40. Restore vs Revert

Do not confuse:

```cmd
git restore app.js
```

with:

```cmd
git revert <commit>
```

`restore`:

```text
changes working-tree/index state
```

`revert`:

```text
creates a new commit
```

Example:

```text
A ── B ── C
          │
          ▼
        revert C

A ── B ── C ── D
```

`D` is a new commit.

---

# 41. Restore vs Reset HEAD

This:

```cmd
git restore --staged app.js
```

unstages a file.

Historically, the equivalent was commonly:

```cmd
git reset HEAD -- app.js
```

Modern Git makes the intent clearer:

```cmd
git restore --staged app.js
```

---

# 42. Restore a Deleted File

Suppose:

```cmd
del app.js
```

Then:

```cmd
git status
```

shows the deletion.

You can restore it:

```cmd
git restore app.js
```

Git retrieves the indexed version.

---

# 43. Restore a Deleted File From HEAD

Explicitly:

```cmd
git restore --source=HEAD -- app.js
```

This restores the file from the current commit.

---

# 44. Restore a Deleted File From Another Commit

```cmd
git restore --source=HEAD~1 -- app.js
```

This retrieves the version from the specified revision.

---

# 45. Restore a Deleted File From Another Branch

```cmd
git restore --source=main -- app.js
```

Useful when the file exists in `main` but not in your current working state.

---

# 46. Restore a Renamed File

If Git recognizes a rename:

```text
old.js → new.js
```

you should generally reason in terms of the paths that exist in the source revision and target revision.

For precise restoration, inspect:

```cmd
git status
git diff
```

then specify the desired path explicitly.

---

# 47. Restore With Pathspecs

Git supports pathspecs.

For example:

```cmd
git restore -- "*.js"
```

can target matching JavaScript files.

Pathspec behavior can be powerful and should be used carefully in large repositories.

---

# 48. Pathspec From a File

Git supports advanced pathspec input:

```cmd
git restore --pathspec-from-file=paths.txt
```

This allows paths to be supplied from a file rather than placing every path directly on the command line.

---

# 49. NUL-Separated Pathspecs

For advanced scripting:

```cmd
git restore --pathspec-from-file=paths.txt --pathspec-file-nul
```

The second option tells Git to interpret NUL characters as separators.

This is useful when filenames contain characters that complicate ordinary line-based parsing.

---

# 50. Interactive Restore

You can interactively select portions of changes:

```cmd
git restore -p
```

or:

```cmd
git restore --patch
```

Git presents individual hunks and asks what should be restored.

This is extremely useful when you want to discard **some changes but keep others**.

---

# 51. Interactive Restore Workflow

Suppose a file contains:

```text
Change A
Change B
Change C
```

You want to discard only:

```text
Change B
```

Run:

```cmd
git restore -p app.js
```

Git presents hunks.

You can selectively choose which hunks to restore.

---

# 52. Patch Mode Choices

In interactive patch mode, Git can present choices such as:

```text
y
n
q
a
d
s
e
?
```

Common meanings include:

```text
y
    restore this hunk

n
    do not restore this hunk

q
    quit

a
    restore this and all later hunks

d
    do not restore this and all later hunks

s
    split the hunk

e
    manually edit the hunk

?
    help
```

Exact interaction can vary with the Git version and situation.

---

# 53. Split a Hunk

If Git combines multiple nearby changes into one hunk, use:

```text
s
```

when available.

This asks Git to split the hunk into smaller pieces.

Then you can selectively restore only the desired part.

---

# 54. Manually Edit a Hunk

Interactive restore may allow:

```text
e
```

to manually edit the patch.

This is an advanced technique.

It allows fine-grained control over exactly which lines are restored.

Use it carefully because malformed patch edits can be rejected.

---

# 55. Restore Only Certain Unstaged Changes

```cmd
git restore -p app.js
```

This is one of the safest advanced techniques for cleaning up a partially modified file.

Instead of:

```cmd
git restore app.js
```

which discards all unstaged changes, patch mode allows selective restoration.

---

# 56. Restore Staged Changes Interactively

```cmd
git restore --staged -p app.js
```

This allows interactive removal of changes from the staging area.

Conceptually:

```text
Index
  │
  ▼
HEAD
```

for selected hunks.

---

# 57. Restore From Another Source Interactively

You can combine source selection with patch mode:

```cmd
git restore --source=main -p -- app.js
```

This allows selective restoration from the specified source.

---

# 58. `--overlay`

Git restore can operate using an overlay-style behavior:

```cmd
git restore --overlay ...
```

The overlay mode tries to preserve files that exist only in the current state when restoring from another source.

---

# 59. `--no-overlay`

```cmd
git restore --no-overlay ...
```

uses the alternative behavior where paths absent from the source can be removed from the target tree as part of the restoration.

This distinction matters especially when restoring directories from another revision.

---

# 60. Overlay Mental Model

Suppose current state:

```text
A.txt
B.txt
C.txt
```

Source revision contains:

```text
A.txt
B.txt
```

With overlay-style restoration, `C.txt` can remain.

With no-overlay behavior, paths absent from the source may be removed from the target.

This is why directory-wide restoration deserves caution.

---

# 61. Conflict Stages

During a merge conflict, the index can contain multiple stages.

Conceptually:

```text
Stage 1
    common ancestor

Stage 2
    ours

Stage 3
    theirs
```

You can restore a particular conflict stage using:

```cmd
git restore --ours -- app.js
```

or:

```cmd
git restore --theirs -- app.js
```

---

# 62. `--ours`

```cmd
git restore --ours -- app.js
```

restores the path using the "ours" version during an appropriate conflicted state.

Conceptually:

```text
ours
  ↓
working tree
```

---

# 63. `--theirs`

```cmd
git restore --theirs -- app.js
```

restores the path using the "theirs" version.

Conceptually:

```text
theirs
   ↓
working tree
```

---

# 64. Conflict Resolution Example

Suppose:

```text
<<<<<<< HEAD
ours
=======
theirs
>>>>>>> branch
```

You decide to keep ours:

```cmd
git restore --ours -- app.js
```

Then:

```cmd
git add app.js
```

The file is marked resolved.

---

# 65. Keep Theirs

```cmd
git restore --theirs -- app.js
```

Then:

```cmd
git add app.js
```

This marks the resolved file as staged.

---

# 66. Important Conflict Limitation

`--ours` and `--theirs` refer to conflict stages, not universally to:

```text
current branch
remote branch
```

Their exact meaning depends on the operation producing the conflict.

During a merge:

```text
ours
    current side

theirs
    merged-in side
```

During rebase/cherry-pick workflows, the interpretation can differ.

Always reason from the specific operation.

---

# 67. Restore During Merge

Typical workflow:

```cmd
git status
git restore --ours -- app.js
git add app.js
git status
```

Or:

```cmd
git restore --theirs -- app.js
git add app.js
```

---

# 68. Restore and Staging State

Remember:

```cmd
git restore --ours app.js
```

targets the working tree.

If you then want that resolution staged:

```cmd
git add app.js
```

The staging step is separate.

---

# 69. Inspect Before Restore

A safe workflow:

```cmd
git status
git diff
```

Then:

```cmd
git restore app.js
```

If staged:

```cmd
git diff --cached
```

Then:

```cmd
git restore --staged app.js
```

This makes the operation deliberate.

---

# 70. Recovering After Accidental Restore

If you accidentally run:

```cmd
git restore app.js
```

Git generally does not create a reflog entry for the discarded working-tree contents.

Therefore:

```text
uncommitted working-tree changes
```

may not be recoverable through ordinary Git history.

This is fundamentally different from many `HEAD` movements performed with `git reset`, which can often be investigated through the reflog.

Prevention is therefore important.

---

# 71. Before Destructive Restore

Use:

```cmd
git diff > backup.patch
```

to save the current diff before performing a destructive operation.

Then restore:

```cmd
git restore app.js
```

If needed, the patch can potentially be reapplied.

For larger work, make a commit or stash instead.

---

# 72. Restore vs Stash

If you might need the work later:

```cmd
git stash
```

is usually safer than simply:

```cmd
git restore
```

because stash preserves the changes.

Mental model:

```text
restore
    discard/replace

stash
    temporarily preserve
```

---

# 73. Restore vs Commit

If your work is meaningful and complete:

```cmd
git commit
```

is safer than relying on an uncommitted working tree.

Git's strongest recovery mechanisms operate around committed objects.

---

# 74. Practical Decision Table

```text
Need to discard unstaged changes?
    git restore <file>

Need to unstage a file?
    git restore --staged <file>

Need both index and working tree reset to HEAD?
    git restore --source=HEAD --staged --worktree <file>

Need a file from another commit?
    git restore --source=<commit> -- <file>

Need a file from another branch?
    git restore --source=<branch> -- <file>

Need only some changes discarded?
    git restore -p

Need only some staged changes removed?
    git restore --staged -p

Need ours during conflict?
    git restore --ours -- <file>

Need theirs during conflict?
    git restore --theirs -- <file>
```

---

# 75. Most Important Commands

```cmd
git restore file.txt
```

```cmd
git restore --staged file.txt
```

```cmd
git restore --source=HEAD -- file.txt
```

```cmd
git restore --source=main -- file.txt
```

```cmd
git restore --source=HEAD~1 -- file.txt
```

```cmd
git restore --source=HEAD --staged --worktree file.txt
```

```cmd
git restore -p file.txt
```

```cmd
git restore --staged -p file.txt
```

```cmd
git restore --ours -- file.txt
```

```cmd
git restore --theirs -- file.txt
```

---

# 76. Core Mental Model

Memorize these:

```text
git restore file
```

```text
Index
  │
  ▼
Working Tree
```

It discards unstaged changes.

---

```text
git restore --staged file
```

```text
HEAD
 │
 ▼
Index
```

It unstages changes while keeping working-tree content.

---

```text
git restore --source=COMMIT -- file
```

```text
COMMIT
   │
   ▼
Working Tree
```

It restores a file from another revision.

---

```text
git restore --source=COMMIT --staged --worktree file
```

```text
COMMIT
  ├────────► Index
  │
  └────────► Working Tree
```

It restores both states.

---

# 77. Final Rule

When using `git restore`, always ask:

```text
1. What source do I want?
2. What target do I want?
3. Do I want to discard everything or only selected changes?
```

Examples:

```text
Discard unstaged changes
    git restore file

Unstage
    git restore --staged file

Get file from another branch
    git restore --source=main -- file

Restore everything to HEAD
    git restore --source=HEAD --staged --worktree .

Selectively discard changes
    git restore -p file
```

The essential idea is:

> **`git restore` changes file state; it does not rewrite commit history.**

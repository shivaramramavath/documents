# `git rm` and `git mv`

`git rm` and `git mv` are Git-aware commands for managing **tracked files and directories**.

They combine a filesystem operation with the corresponding Git index update.

```text
git rm
    remove tracked files

git mv
    move or rename tracked files
```

---

# 1. Why Git Has `rm` and `mv`

You could use normal Windows commands:

```cmd
del file.txt
```

or:

```cmd
move old.txt new.txt
```

but Git then sees the result as a working-tree change that needs to be staged separately.

Git provides:

```cmd
git rm
git mv
```

to perform the filesystem operation **and stage the corresponding change in the index**.

---

# 2. `git rm`

Basic syntax:

```cmd
git rm <file>
```

Example:

```cmd
git rm old.txt
```

This:

```text
1. deletes old.txt from the working tree
2. stages the deletion
```

Check:

```cmd
git status
```

You will see the deletion staged for the next commit.

---

# 3. Normal `git rm` Workflow

Suppose:

```text
project/
├── app.js
└── old.js
```

`old.js` is tracked.

Run:

```cmd
git rm old.js
```

Then:

```cmd
git status
```

Conceptually:

```text
old.js
    ↓
working tree: deleted
index:        deletion staged
HEAD:         still contains old.js
```

The deletion becomes permanent in repository history only after:

```cmd
git commit -m "Remove old.js"
```

---

# 4. Important: `git rm` Does Not Delete History Immediately

Before commit:

```text
HEAD
 ↓
old.js exists

Index
 ↓
old.js deleted

Working tree
 ↓
old.js deleted
```

After:

```cmd
git commit -m "Remove old.js"
```

the new commit records the deletion.

The previous commit still contains `old.js`.

---

# 5. `git rm` vs Windows `del`

Using:

```cmd
del old.js
```

results in:

```text
working tree:
    old.js deleted

index:
    still expects old.js
```

Git then reports:

```cmd
git status
```

something similar to:

```text
deleted: old.js
```

You must stage it:

```cmd
git add old.js
```

or:

```cmd
git add -u
```

With:

```cmd
git rm old.js
```

the deletion is staged automatically.

---

# 6. `git rm` Is Essentially Two Operations

Conceptually:

```cmd
git rm old.js
```

combines:

```text
delete old.js
+
git add deletion to index
```

This is why it is called a Git-aware removal command.

---

# 7. Remove Multiple Files

You can specify multiple files:

```cmd
git rm file1.js file2.js file3.js
```

Example:

```cmd
git rm debug.js test-old.js legacy.js
```

Then:

```cmd
git status
```

---

# 8. Remove a Directory

Use:

```cmd
git rm -r directory
```

Example:

```cmd
git rm -r old-module
```

The `-r` means:

```text
recursive
```

It allows Git to remove tracked files inside the directory.

---

# 9. `-r`

Syntax:

```cmd
git rm -r <directory>
```

Example:

```cmd
git rm -r src/legacy
```

Conceptually:

```text
src/legacy/
├── a.js
├── b.js
└── c.js
```

becomes staged for deletion.

---

# 10. `git rm --cached`

This is one of the most important advanced forms.

```cmd
git rm --cached <file>
```

It removes the file from Git's index **but leaves the physical file in the working directory**.

Example:

```cmd
git rm --cached .env
```

Result:

```text
Git tracking:
    .env removed

Working directory:
    .env remains
```

---

# 11. Why Use `--cached`?

A common scenario:

```text
.env
```

was accidentally committed.

You want:

```text
.env
    remain on your computer

Git
    stop tracking it
```

Run:

```cmd
git rm --cached .env
```

Then add it to `.gitignore`:

```gitignore
.env
```

Then:

```cmd
git add .gitignore
git commit -m "Stop tracking environment file"
```

---

# 12. `git rm --cached` Does Not Delete the File

Compare:

```cmd
git rm file.txt
```

with:

```cmd
git rm --cached file.txt
```

### `git rm`

```text
index       → remove
working tree → remove
```

### `git rm --cached`

```text
index       → remove
working tree → keep
```

This distinction is fundamental.

---

# 13. Remove Multiple Files From Tracking

```cmd
git rm --cached file1.txt file2.txt
```

For a directory:

```cmd
git rm -r --cached directory/
```

Example:

```cmd
git rm -r --cached node_modules/
```

Then ensure:

```gitignore
node_modules/
```

is present in `.gitignore`.

---

# 14. `git rm --cached` and `.gitignore`

Important:

Adding a tracked file to `.gitignore` does **not** stop Git from tracking it.

For example:

```gitignore
.env
```

does not untrack an already tracked `.env`.

You must first:

```cmd
git rm --cached .env
```

Then:

```cmd
git commit -m "Stop tracking .env"
```

After that, `.gitignore` prevents future untracked versions from being added normally.

---

# 15. `git rm -f`

Git normally protects local modifications.

Use:

```cmd
git rm -f <file>
```

to force removal.

Example:

```cmd
git rm -f app.js
```

This can discard local modifications to the file.

**Use `-f` carefully.**

---

# 16. Why `-f` Exists

Suppose:

```text
HEAD:
app.js = version A

working tree:
app.js = version B
```

You run:

```cmd
git rm app.js
```

Git may refuse because removing the file would discard local changes.

Using:

```cmd
git rm -f app.js
```

explicitly tells Git to proceed.

---

# 17. `git rm -r -f`

For a modified directory:

```cmd
git rm -r -f old-module/
```

This recursively removes and stages the tracked files.

This is destructive to local modifications.

---

# 18. `git rm --dry-run`

You can preview what `git rm` would do:

```cmd
git rm --dry-run file.txt
```

Short form:

```cmd
git rm -n file.txt
```

This does not actually remove the file.

For directories:

```cmd
git rm -r -n old-module/
```

---

# 19. `git rm --ignore-unmatch`

Normally, Git can return an error when the specified path does not match a tracked file.

You can use:

```cmd
git rm --ignore-unmatch file.txt
```

This tells Git not to treat an unmatched path as an error.

Useful in scripts where the file may or may not exist.

---

# 20. `git rm --quiet`

Use:

```cmd
git rm -q file.txt
```

or:

```cmd
git rm --quiet file.txt
```

to reduce output.

This is more useful in automation than normal interactive work.

---

# 21. Pathspecs

`git rm` supports Git pathspecs.

Example:

```cmd
git rm -- "*.log"
```

This can remove matching tracked files according to the pathspec.

The `--` separates options from paths.

---

# 22. Why `--` Is Useful

Example:

```cmd
git rm -- file.txt
```

Everything after:

```text
--
```

is interpreted as a path.

This prevents filenames from being confused with command options.

---

# 23. `git rm` and Wildcards

You can use pathspec patterns.

Example:

```cmd
git rm -- "*.tmp"
```

This targets tracked files matching the pattern.

Another example:

```cmd
git rm -- "logs/*.log"
```

Be aware that Git pathspec behavior is not identical to every Windows shell's wildcard expansion.

Quoting pathspecs is often the safest approach.

---

# 24. `git mv`

`git mv` is used to:

```text
rename a tracked file
move a tracked file
```

Basic syntax:

```cmd
git mv <source> <destination>
```

Example:

```cmd
git mv old.js new.js
```

Git performs the move and stages the resulting change.

---

# 25. Basic Rename

Suppose:

```text
old-name.js
```

exists.

Run:

```cmd
git mv old-name.js new-name.js
```

Then:

```cmd
git status
```

Git may display:

```text
renamed: old-name.js -> new-name.js
```

The rename is staged.

---

# 26. Commit the Rename

After:

```cmd
git mv old.js new.js
```

run:

```cmd
git commit -m "Rename old.js to new.js"
```

The new commit records the change.

---

# 27. `git mv` Is Essentially

Conceptually:

```cmd
git mv old.js new.js
```

is similar to:

```cmd
move old.js new.js
git add -A
```

but Git handles the operation directly.

The important result is that the index is updated appropriately.

---

# 28. Move a File Into a Directory

Suppose:

```text
app.js
src/
```

Run:

```cmd
git mv app.js src/app.js
```

Result:

```text
src/
└── app.js
```

Check:

```cmd
git status
```

---

# 29. Rename a Directory

Example:

```cmd
git mv old-module new-module
```

Git moves the directory and its tracked contents.

Then:

```cmd
git status
```

may show multiple renamed paths.

---

# 30. Move Multiple Files

You can move multiple source files into a destination directory.

Example:

```cmd
git mv a.js b.js src/
```

Result:

```text
src/
├── a.js
└── b.js
```

The destination must be appropriate for the supplied sources.

---

# 31. `git mv -f`

Force a move:

```cmd
git mv -f old.js new.js
```

This can overwrite the destination when Git permits the operation.

Use carefully because an existing destination can be affected.

---

# 32. `git mv` and Local Changes

If a tracked file has local modifications, Git can often move it while preserving those modifications.

Example:

```text
app.js
    modified locally
```

Then:

```cmd
git mv app.js src/app.js
```

The local modifications move with the file.

Always verify:

```cmd
git status
```

and:

```cmd
git diff
```

---

# 33. Rename Detection

Git does not fundamentally store a special "rename object."

This is a critical advanced concept.

A commit primarily stores:

```text
trees
blobs
parents
metadata
```

Git can **detect renames** by comparing file contents between trees.

Therefore:

```text
old.js
    ↓
new.js
```

may be displayed as a rename even though the underlying representation is based on deleting one path and adding another path with related content.

---

# 34. Rename Detection Is Similarity-Based

Suppose:

```text
old.js
```

contains:

```js
function hello() {
  console.log("hello");
}
```

You rename it:

```text
new.js
```

and make only a small modification.

Git may recognize:

```text
old.js → new.js
```

as a rename.

If the contents change significantly, Git may instead show:

```text
deleted: old.js
new file: new.js
```

---

# 35. `git mv` Does Not Guarantee Rename Detection Forever

Even if you run:

```cmd
git mv old.js new.js
```

the commit object does not necessarily contain a special immutable rename record.

Git's later commands may detect the relationship based on content similarity.

This matters when reviewing history and understanding Git internals.

---

# 36. Rename Similarity

Git's diff machinery can report:

```text
rename from old.js
rename to new.js
similarity index 95%
```

The exact similarity calculation depends on Git's diff/rename detection machinery.

The important concept is:

```text
rename detection
    ≠
special filesystem rename object
```

---

# 37. `git status` and Rename Detection

After:

```cmd
git mv old.js new.js
```

run:

```cmd
git status
```

Git generally recognizes the staged index change as a rename.

After committing:

```cmd
git show --stat
```

can show the rename.

---

# 38. Inspect the Rename

Use:

```cmd
git show --summary HEAD
```

or:

```cmd
git show --stat HEAD
```

You may see:

```text
rename old.js => new.js
```

For detailed changes:

```cmd
git show HEAD
```

---

# 39. `git diff --cached`

Because `git mv` stages the operation:

```cmd
git diff --cached
```

is important.

It shows the changes currently staged in the index.

Example:

```cmd
git mv old.js new.js
git diff --cached
```

---

# 40. `git diff`

After:

```cmd
git mv old.js new.js
```

the move is staged.

Therefore:

```cmd
git diff
```

may show little or nothing for the staged move.

Use:

```cmd
git diff --cached
```

to inspect the staged operation.

This distinction is important.

---

# 41. Rename Then Modify

You can:

```cmd
git mv old.js new.js
```

then edit:

```text
new.js
```

Now:

```cmd
git status
```

may show the rename with additional modifications.

Inspect:

```cmd
git diff
```

for unstaged changes.

And:

```cmd
git diff --cached
```

for staged changes.

---

# 42. Stage the Final Version

If you modify the renamed file after `git mv`:

```cmd
git add new.js
```

Then:

```cmd
git diff --cached
```

shows the complete staged state.

Finally:

```cmd
git commit -m "Rename and update module"
```

---

# 43. Manual Rename vs `git mv`

You can also use Windows:

```cmd
move old.js new.js
```

Then:

```cmd
git status
```

Git sees the filesystem change.

You can stage it:

```cmd
git add -A
```

Git may then detect:

```text
rename: old.js -> new.js
```

So:

```text
git mv
```

is convenient, but Git does not require it to understand a rename.

---

# 44. Why `git mv` Is Still Recommended

Using:

```cmd
git mv
```

makes your intent explicit:

```text
I am moving/renaming this tracked path.
```

It also updates the index immediately.

That makes the workflow easier to reason about.

---

# 45. `git rm` and Staging

Remember:

```cmd
git rm file.js
```

results in:

```text
working tree
    deleted

index
    deletion staged

HEAD
    old file still exists
```

Therefore:

```cmd
git diff --cached
```

shows the staged deletion.

---

# 46. Undo a `git rm` Before Commit

Suppose:

```cmd
git rm old.js
```

but you changed your mind.

Because the deletion is staged, one way to restore it from `HEAD` is:

```cmd
git restore --staged old.js
git restore old.js
```

The first command removes the deletion from the index.

The second restores the working-tree file.

Alternatively, depending on your Git version/workflow:

```cmd
git restore --source=HEAD --staged --worktree old.js
```

restores both index and working tree from `HEAD`.

---

# 47. Undo `git rm` While Keeping the Deletion Unstaged

If you only want to unstage the deletion:

```cmd
git restore --staged old.js
```

Now:

```text
index:
    old.js still exists

working tree:
    old.js deleted
```

Check:

```cmd
git status
```

You can decide later whether to restore or permanently delete it.

---

# 48. Undo `git mv` Before Commit

Suppose:

```cmd
git mv old.js new.js
```

and you want to undo the move.

You can restore the original path from `HEAD`:

```cmd
git restore --source=HEAD --staged --worktree old.js
```

Then remove the unwanted destination if necessary.

Another straightforward approach is to move it back:

```cmd
git mv new.js old.js
```

Then:

```cmd
git status
```

The index should return toward its previous state.

---

# 49. `git rm --cached` and Commit History

Suppose `.env` was already committed:

```text
A ── B
     ↑
    .env tracked
```

Run:

```cmd
git rm --cached .env
```

and commit:

```cmd
git commit -m "Stop tracking .env"
```

Now:

```text
A ── B ── C
```

`.env` is no longer tracked in `C`.

But **the old `.env` contents still exist in earlier commits**.

This is critical for secrets.

---

# 50. `git rm --cached` Does Not Remove Secrets From History

If you accidentally committed:

```text
API_KEY=secret
```

then:

```cmd
git rm --cached .env
```

does not erase the secret from previous commits.

For exposed secrets:

```text
1. revoke/rotate the secret
2. remove the file from current tracking
3. if necessary, rewrite repository history using appropriate history-rewrite tooling
```

Do not treat `git rm --cached` as a history-cleaning mechanism.

---

# 51. `git rm` With Submodules

Submodules are special Git entries.

Removing a submodule can involve:

```text
.gitmodules
index entry
working-tree directory
```

Do not treat a submodule exactly like an ordinary directory.

A proper submodule removal workflow should account for its Git metadata and `.gitmodules` configuration.

---

# 52. `git mv` With Submodules

Moving a submodule is also more complicated than moving an ordinary directory because submodule configuration can involve:

```text
.gitmodules
.git/config
submodule working tree
index
```

Always verify:

```cmd
git status
```

after moving a submodule.

---

# 53. `git rm` and Sparse Checkout

In repositories using sparse-checkout, not every tracked path may be present in the working tree.

Operations involving paths outside the sparse working tree can behave differently.

Before destructive operations, inspect:

```cmd
git status
```

and understand the repository's sparse-checkout configuration.

---

# 54. `git rm` and Case-Only Renames on Windows

Windows filesystems are commonly case-insensitive.

Suppose:

```text
README.md
```

needs to become:

```text
Readme.md
```

A direct:

```cmd
git mv README.md Readme.md
```

may behave differently depending on filesystem and Git configuration.

A robust approach is a temporary name:

```cmd
git mv README.md README_TEMP.md
git mv README_TEMP.md Readme.md
```

Then:

```cmd
git status
```

---

# 55. Case Sensitivity Matters

Git internally tracks paths with case-sensitive path semantics, while Windows commonly uses a case-insensitive filesystem.

Therefore:

```text
file.js
File.js
FILE.js
```

can create tricky situations on Windows.

When doing case-only renames, verify the index carefully:

```cmd
git status
git ls-files
```

---

# 56. `core.ignorecase`

Git has a configuration variable:

```cmd
git config core.ignorecase
```

On many Windows repositories it is typically:

```text
true
```

This helps Git account for case-insensitive filesystems.

Check:

```cmd
git config --get core.ignorecase
```

Do not casually change this setting without understanding the filesystem implications.

---

# 57. Advanced: `git ls-files`

To see tracked paths:

```cmd
git ls-files
```

This is useful before:

```cmd
git rm
```

because `git rm` primarily operates on tracked paths.

Search for a particular path:

```cmd
git ls-files -- app.js
```

---

# 58. Advanced: Check Whether a File Is Tracked

Use:

```cmd
git ls-files --error-unmatch app.js
```

If Git knows the path, it is tracked.

This can be useful in scripts.

---

# 59. Advanced: Remove All Tracked Files Matching a Pattern

Pathspecs can be powerful:

```cmd
git rm -- "*.log"
```

This removes matching tracked files.

But remember:

```text
git rm
    does not remove ignored/untracked files simply because they match the pattern
```

For untracked files, use:

```cmd
git clean
```

---

# 60. `git rm` vs `git clean`

This is one of the most important distinctions in this section.

```text
git rm
    tracked files

git clean
    untracked files
```

Example:

```text
tracked.txt
untracked.txt
```

Then:

```cmd
git rm tracked.txt
```

removes the tracked file.

And:

```cmd
git clean -f -- untracked.txt
```

removes the untracked file.

---

# 61. `git rm` vs `git restore`

```text
git rm
    remove tracked file

git restore
    restore tracked file content
```

Example:

```cmd
git rm app.js
```

deletes and stages the deletion.

Whereas:

```cmd
git restore app.js
```

can discard working-tree changes and restore the file content.

---

# 62. `git mv` vs `git restore`

`git mv`:

```text
move/rename tracked path
```

`git restore`:

```text
restore tracked content
```

They operate on different intentions.

---

# 63. `git mv` vs `git reset`

`git mv` changes the working tree and index.

`git reset` changes:

```text
HEAD
index
possibly working tree
```

depending on the selected mode.

Do not use reset merely because you want to rename a file.

---

# 64. Rename Detection After Manual Move

This:

```cmd
move old.js new.js
git add -A
```

can result in Git recognizing:

```text
renamed: old.js -> new.js
```

because Git compares content.

Therefore, Git does not require:

```cmd
git mv
```

for rename detection.

---

# 65. What `git mv` Actually Stages

Suppose:

```text
old.js
```

becomes:

```text
new.js
```

The index records the resulting path state.

Conceptually:

```text
old.js
    ↓
removed from index

new.js
    ↓
added to index
```

Git later detects the rename relationship when displaying diffs/history.

---

# 66. `git mv` With Significant Changes

Suppose:

```cmd
git mv old.js new.js
```

and then you completely rewrite `new.js`.

Git may eventually display:

```text
deleted: old.js
new file: new.js
```

rather than a rename.

This is because rename detection depends on similarity.

---

# 67. Preserve Similarity When Renaming

If you want Git to clearly identify a rename:

```text
1. rename the file
2. commit the rename
3. make large changes in a separate commit
```

Example:

```cmd
git mv old.js new.js
git commit -m "Rename old.js to new.js"
```

Then modify:

```cmd
git commit -am "Refactor new.js"
```

This can make history easier to review.

---

# 68. Rename + Refactor in One Commit

You can also:

```cmd
git mv old.js new.js
```

then heavily modify it.

Git may or may not detect the rename depending on similarity.

For clean code review, separating structural changes from large refactors is often preferable.

---

# 69. `git status --short`

A compact way to inspect changes:

```cmd
git status --short
```

Example:

```text
D  old.js
A  new.js
```

or potentially:

```text
R  old.js -> new.js
```

The two-character status format represents index and working-tree states.

---

# 70. Staged vs Unstaged With `git rm`

After:

```cmd
git rm old.js
```

you can inspect:

```cmd
git status --short
```

The deletion appears in the staged column.

This helps understand:

```text
working tree
index
HEAD
```

as separate states.

---

# 71. Complete `git rm` Workflow

```cmd
git status
```

Identify the tracked file.

```cmd
git rm old.js
```

Verify:

```cmd
git status
```

Inspect staged deletion:

```cmd
git diff --cached
```

Commit:

```cmd
git commit -m "Remove old.js"
```

Verify:

```cmd
git log --oneline -3
```

---

# 72. Complete `git rm --cached` Workflow

For an accidentally tracked local file:

```cmd
git status
```

Then:

```cmd
git rm --cached .env
```

Add to `.gitignore`:

```gitignore
.env
```

Stage:

```cmd
git add .gitignore
```

Commit:

```cmd
git commit -m "Stop tracking environment file"
```

Verify:

```cmd
git status
```

The local `.env` remains on disk.

---

# 73. Complete `git mv` Workflow

```cmd
git status
```

Rename:

```cmd
git mv old.js new.js
```

Inspect:

```cmd
git status
```

Inspect staged changes:

```cmd
git diff --cached
```

Commit:

```cmd
git commit -m "Rename old.js to new.js"
```

Verify:

```cmd
git log --oneline -3
```

---

# 74. Command Reference

## `git rm`

```cmd
git rm <file>
```

Remove tracked file.

```cmd
git rm -r <directory>
```

Remove tracked directory recursively.

```cmd
git rm -f <file>
```

Force removal.

```cmd
git rm --cached <file>
```

Remove from index but keep working-tree file.

```cmd
git rm -r --cached <directory>
```

Untrack directory recursively.

```cmd
git rm -n <file>
```

Dry run.

```cmd
git rm --ignore-unmatch <file>
```

Ignore unmatched paths.

```cmd
git rm -q <file>
```

Quiet mode.

---

# 75. `git mv` Reference

```cmd
git mv <source> <destination>
```

Move or rename.

```cmd
git mv -f <source> <destination>
```

Force move.

```cmd
git mv -k <source> <destination>
```

Skip errors for individual files that cannot be moved.

```cmd
git mv -v <source> <destination>
```

Verbose output.

---

# 76. Important `git mv` Options

```text
-f
--force
    overwrite destination where permitted

-k
    skip move errors

-v
--verbose
    report operations
```

---

# 77. `git rm` Options Summary

```text
-f
--force
    force removal

-n
--dry-run
    preview

-r
    recursive

--cached
    remove from index, keep working tree

--ignore-unmatch
    do not fail when path is unmatched

-q
--quiet
    reduce output
```

---

# 78. Decision Table

| Situation                   | Command                  |
| --------------------------- | ------------------------ |
| Delete tracked file         | `git rm file`            |
| Delete tracked directory    | `git rm -r dir`          |
| Force-delete tracked file   | `git rm -f file`         |
| Stop tracking but keep file | `git rm --cached file`   |
| Stop tracking directory     | `git rm -r --cached dir` |
| Preview removal             | `git rm -n file`         |
| Rename tracked file         | `git mv old new`         |
| Move tracked file           | `git mv file dir/file`   |
| Rename directory            | `git mv old-dir new-dir` |
| Force move                  | `git mv -f old new`      |
| Delete untracked file       | `git clean -f`           |

---

# 79. Mental Model

Think of the three commands this way:

```text
git rm
    tracked path
       ↓
    remove

git mv
    tracked path
       ↓
    move/rename

git clean
    untracked path
       ↓
    delete
```

And:

```text
git rm --cached
    tracked path
       ↓
    stop tracking
       ↓
    keep local file
```

---

# 80. Golden Rules

### Delete a tracked file

```cmd
git rm file.js
```

### Delete a tracked directory

```cmd
git rm -r directory/
```

### Stop tracking but keep the local file

```cmd
git rm --cached file
```

### Rename a tracked file

```cmd
git mv old.js new.js
```

### Move a tracked file

```cmd
git mv app.js src/app.js
```

### Remove an untracked file

```cmd
git clean -f
```

---

# 81. Final Comparison

```text
                    TRACKED       UNTRACKED

Delete              git rm        git clean

Move/Rename         git mv        normal filesystem move
                                  + git add -A

Stop tracking       git rm
                    --cached
```

The most important distinction is:

```text
git rm
    = remove tracked content

git rm --cached
    = remove tracking, keep local content

git mv
    = move/rename tracked content

git clean
    = remove untracked content
```

Once you understand **HEAD → index → working tree**, these commands become much easier to reason about:

```text
HEAD
 │
 │ tracked version
 ↓
INDEX
 │
 │ staged change
 ↓
WORKING TREE
```

`git rm` and `git mv` primarily update the **index and working tree together**, while `git clean` deals with content that is outside Git's tracked set.

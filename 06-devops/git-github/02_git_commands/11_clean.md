# `git clean`

`git clean` removes **untracked files and directories** from the working tree.

It is a **destructive command**. Unlike `git restore`, `git reset`, or `git revert`, Git does not normally keep a recoverable commit containing the deleted untracked files.

---

# 1. What `git clean` Removes

Git tracks files that belong to commits.

There are three important categories:

```text
Tracked
    files known to Git

Untracked
    files present in the working tree but not tracked by Git

Ignored
    files excluded by .gitignore
```

`git clean` primarily operates on:

```text
untracked files
untracked directories
```

Example:

```text
project/
├── app.js          tracked
├── package.json    tracked
├── test.txt        untracked
├── build/          untracked directory
└── node_modules/   ignored
```

Running:

```cmd
git clean
```

can remove:

```text
test.txt
```

but does not automatically remove:

```text
build/
node_modules/
```

---

# 2. Basic Syntax

```cmd
git clean [options] [--] <pathspec>...
```

Most important forms:

```cmd
git clean -n
```

```cmd
git clean -f
```

```cmd
git clean -fd
```

```cmd
git clean -fX
```

```cmd
git clean -fx
```

---

# 3. Preview Before Deleting

The safest first command is:

```cmd
git clean -n
```

or:

```cmd
git clean --dry-run
```

It shows what would be removed without actually deleting anything.

Example:

```text
Would remove debug.log
Would remove temp.txt
```

Nothing has been deleted.

---

# 4. Why `-n` Is Important

Never blindly run:

```cmd
git clean -f
```

on an unfamiliar repository.

First:

```cmd
git clean -n
```

Then inspect the output.

If the list is correct:

```cmd
git clean -f
```

This gives you a safety check.

---

# 5. `-f` / `--force`

Git requires force by default before deleting untracked files.

```cmd
git clean -f
```

means:

```text
force deletion of untracked files
```

Example:

```text
Before:

app.js
debug.log
temp.txt
```

If `debug.log` and `temp.txt` are untracked:

```cmd
git clean -f
```

removes them.

---

# 6. Why Git Requires `-f`

Deleting files is destructive.

Therefore:

```cmd
git clean
```

normally refuses to perform the deletion.

You need:

```cmd
git clean -f
```

This is a deliberate safety mechanism.

---

# 7. Remove Untracked Directories

By default, `git clean -f` does not remove untracked directories.

Use:

```cmd
git clean -fd
```

where:

```text
-f = force
-d = directories
```

Example:

```text
project/
├── app.js
├── temp.txt
└── build/
    ├── output.js
    └── output.css
```

If `build/` is untracked:

```cmd
git clean -fd
```

can remove:

```text
temp.txt
build/
```

---

# 8. Preview Directory Removal

Before:

```cmd
git clean -fd
```

run:

```cmd
git clean -nd
```

or:

```cmd
git clean -nd
```

This previews untracked files and directories that would be removed.

Recommended:

```cmd
git clean -nd
```

then:

```cmd
git clean -fd
```

---

# 9. `-d`

The `-d` option tells Git to include untracked directories.

Without:

```cmd
git clean -f
```

only untracked files are targeted.

With:

```cmd
git clean -fd
```

untracked directories can also be removed.

---

# 10. Ignored Files

Normally, ignored files are protected.

Example `.gitignore`:

```gitignore
node_modules/
.env
dist/
*.log
```

Suppose:

```text
node_modules/
dist/
debug.log
temp.txt
```

are present.

A normal:

```cmd
git clean -f
```

does not remove ignored files.

---

# 11. `-x`

Use:

```cmd
git clean -fx
```

to include ignored files.

Meaning:

```text
-f = force
-x = include ignored files
```

Preview first:

```cmd
git clean -nx
```

Then:

```cmd
git clean -fx
```

---

# 12. `-fxd`

To remove:

```text
untracked files
untracked directories
ignored files
ignored directories
```

use:

```cmd
git clean -fxd
```

Preview:

```cmd
git clean -nxd
```

Then, if the result is definitely correct:

```cmd
git clean -fxd
```

This is **extremely destructive**.

---

# 13. `-X`

There is an important difference between:

```cmd
git clean -x
```

and:

```cmd
git clean -X
```

### `-x`

Remove:

```text
untracked + ignored
```

### `-X`

Remove:

```text
ignored only
```

So:

```cmd
git clean -fX
```

removes ignored files while leaving ordinary untracked files alone.

---

# 14. `-x` vs `-X`

Suppose:

```text
tracked.js       tracked
notes.txt        untracked
node_modules/    ignored
.env             ignored
```

### `git clean -fx`

can remove:

```text
notes.txt
node_modules/
.env
```

### `git clean -fX`

removes only:

```text
node_modules/
.env
```

`notes.txt` remains.

---

# 15. Interactive Mode

Use:

```cmd
git clean -i
```

or:

```cmd
git clean --interactive
```

Git presents an interactive interface allowing you to choose what to clean.

Typical options include:

```text
1. clean
2. filter by pattern
3. select by numbers
4. ask each
5. quit
```

The exact interactive menu can vary by Git version.

---

# 16. Interactive Mode With Directories

```cmd
git clean -id
```

allows interactive cleaning while including untracked directories.

---

# 17. Interactive Mode With Ignored Files

```cmd
git clean -ix
```

allows interactive cleaning including ignored files.

For directories too:

```cmd
git clean -idx
```

---

# 18. `-q` / `--quiet`

Use:

```cmd
git clean -fq
```

to suppress normal output.

`-q` means:

```text
quiet
```

This is more useful in scripts than interactive manual cleanup.

---

# 19. Pathspec

You can restrict cleaning to specific paths.

General form:

```cmd
git clean -f -- <path>
```

Example:

```cmd
git clean -f -- temp.txt
```

This limits the operation to the specified path.

You can also target a directory:

```cmd
git clean -fd -- build/
```

---

# 20. Why `--` Is Used

Git uses:

```cmd
--
```

to separate options from pathspecs.

Example:

```cmd
git clean -f -- temp.txt
```

Everything after:

```text
--
```

is interpreted as a pathspec rather than a command-line option.

This is particularly useful when filenames could otherwise be confused with options.

---

# 21. `git clean` Does Not Remove Tracked Files

Suppose:

```text
app.js       tracked
temp.txt     untracked
```

Running:

```cmd
git clean -f
```

does not remove:

```text
app.js
```

It targets:

```text
temp.txt
```

This is one of the most important distinctions.

---

# 22. `git clean` Does Not Undo Commits

If you have:

```text
A ── B ── C
```

`git clean` does not remove:

```text
C
```

It operates on untracked working-tree content.

For commits:

```cmd
git revert
```

or:

```cmd
git reset
```

may be appropriate depending on the situation.

---

# 23. `git clean` vs `git restore`

### `git clean`

Removes:

```text
untracked files/directories
```

### `git restore`

Restores:

```text
tracked file content
```

Example:

```cmd
git restore app.js
```

restores a tracked file.

Whereas:

```cmd
git clean -f
```

removes an untracked file.

---

# 24. `git clean` vs `git reset`

### `git clean`

Deals primarily with:

```text
untracked working-tree content
```

### `git reset`

Deals with:

```text
HEAD
index
working tree
commit history
```

depending on the mode.

---

# 25. `git clean` vs `git revert`

### `git clean`

```text
working-tree cleanup
```

### `git revert`

```text
commit-level undo
```

They solve completely different problems.

---

# 26. `git clean` vs `git rm`

### `git clean`

Removes untracked content.

### `git rm`

Removes tracked files and stages the deletion.

Example:

```cmd
git rm app.js
```

The deletion becomes part of the next commit.

With:

```cmd
git clean -f
```

an untracked file is simply deleted from the working tree.

---

# 27. Check Repository Status First

Before cleaning:

```cmd
git status
```

This tells you what Git considers:

```text
modified
staged
untracked
```

However, ignored files may not appear in ordinary status output.

To see ignored files:

```cmd
git status --ignored
```

This is useful before using:

```cmd
git clean -x
```

---

# 28. Inspect Everything

A useful safety workflow:

```cmd
git status
```

then:

```cmd
git status --ignored
```

then:

```cmd
git clean -nd
```

If ignored files are relevant:

```cmd
git clean -nxd
```

Only after checking:

```cmd
git clean -fd
```

or:

```cmd
git clean -fxd
```

---

# 29. Typical Build Cleanup

Suppose your project contains:

```text
src/
package.json
dist/
coverage/
temp/
```

and:

```text
dist/
coverage/
temp/
```

are generated and untracked.

Preview:

```cmd
git clean -nd
```

Then:

```cmd
git clean -fd
```

This is useful for returning the working tree to a cleaner state.

---

# 30. Deep Clean

A deep cleanup may use:

```cmd
git clean -fxd
```

Preview:

```cmd
git clean -nxd
```

This can remove things such as:

```text
build output
dependency directories
local environment files
ignored logs
generated assets
temporary files
```

depending on `.gitignore`.

**Do not run this blindly.**

---

# 31. Example: Node.js Repository

Suppose:

```text
node_modules/   ignored
dist/           ignored
.env            ignored
debug.log       ignored
test.tmp        untracked
src/            tracked
package.json    tracked
```

Preview ordinary untracked cleanup:

```cmd
git clean -n
```

Possible:

```text
Would remove test.tmp
```

Preview ignored cleanup:

```cmd
git clean -nx
```

Possible:

```text
Would remove .env
Would remove debug.log
Would remove dist/
Would remove node_modules/
```

Deep clean:

```cmd
git clean -fxd
```

could remove all of those non-tracked items.

---

# 32. Cleaning a Repository to a Pristine State

A common conceptual goal is:

```text
HEAD
+
no tracked modifications
+
no untracked files
+
no untracked directories
```

A possible sequence is:

```cmd
git reset --hard HEAD
git clean -fd
```

But understand the two commands separately:

```text
git reset --hard HEAD
    removes tracked working-tree/index changes

git clean -fd
    removes untracked files/directories
```

This combination is destructive.

---

# 33. Pristine State Including Ignored Files

A much more aggressive cleanup is:

```cmd
git reset --hard HEAD
git clean -fxd
```

This can make the working directory resemble a fresh checkout much more closely.

But ignored local configuration can also be deleted.

For example:

```text
.env
local configuration
developer-specific files
```

may be ignored precisely because they are not committed.

---

# 34. Safety Pattern

For destructive cleanup, use this sequence:

```cmd
git status
```

```cmd
git status --ignored
```

```cmd
git clean -nd
```

Then, if needed:

```cmd
git clean -nxd
```

Only then:

```cmd
git clean -fd
```

or:

```cmd
git clean -fxd
```

---

# 35. Dry Run Is Your Safety Net

Remember:

```cmd
git clean -n
```

means:

```text
show me what would be deleted
```

while:

```cmd
git clean -f
```

means:

```text
actually delete it
```

Therefore:

```text
-n = inspect
-f = execute
```

---

# 36. Important Option Combinations

| Command          | Meaning                                       |
| ---------------- | --------------------------------------------- |
| `git clean -n`   | Preview untracked files                       |
| `git clean -f`   | Remove untracked files                        |
| `git clean -nd`  | Preview untracked files/directories           |
| `git clean -fd`  | Remove untracked files/directories            |
| `git clean -nx`  | Preview untracked + ignored                   |
| `git clean -fx`  | Remove untracked + ignored files              |
| `git clean -nxd` | Preview untracked + ignored files/directories |
| `git clean -fxd` | Remove untracked + ignored files/directories  |
| `git clean -nX`  | Preview ignored files                         |
| `git clean -fX`  | Remove ignored files                          |
| `git clean -i`   | Interactive cleanup                           |
| `git clean -q`   | Quiet output                                  |

---

# 37. Most Important Flags

```text
-n
--dry-run
    preview

-f
--force
    actually delete

-d
    include directories

-x
    include ignored files

-X
    include only ignored files

-i
--interactive
    interactive cleanup

-q
--quiet
    reduce output
```

---

# 38. Dangerous Commands

These deserve extra caution:

```cmd
git clean -fd
```

More aggressive:

```cmd
git clean -fxd
```

Extremely important:

```cmd
git clean -fxd
```

can delete ignored project files that are not stored in Git.

Always preview:

```cmd
git clean -nxd
```

first.

---

# 39. Files You May Accidentally Delete

Depending on your `.gitignore`, aggressive cleaning can remove:

```text
.env
.env.local
node_modules/
dist/
build/
coverage/
local configuration
generated files
IDE-generated files
logs
temporary files
```

Once removed, Git cannot restore an untracked file from its normal commit history because it was never committed.

---

# 40. Advanced `.gitignore` Relationship

`git clean` respects `.gitignore` by default.

Therefore the behavior of:

```cmd
git clean -f
```

depends partly on:

```text
.gitignore
```

You can inspect ignore behavior using:

```cmd
git check-ignore -v <file>
```

Example:

```cmd
git check-ignore -v .env
```

This can show which `.gitignore` rule causes the file to be ignored.

---

# 41. Inspect Ignored Files

Use:

```cmd
git status --ignored
```

This displays ignored files/directories in addition to normal status information.

Useful before:

```cmd
git clean -x
```

---

# 42. `git clean` and Git's Object Database

An untracked file is not necessarily stored in Git's object database.

If:

```text
temp.txt
```

has never been committed or otherwise stored as a Git object, then:

```cmd
git clean -f
```

can delete the filesystem copy without Git having a normal commit from which to restore it.

This is why the command is destructive.

---

# 43. `git clean` Is Not a Trash-Bin Operation

Do not think:

```cmd
git clean
    ↓
Recycle Bin
```

It is better to think:

```text
git clean
    ↓
filesystem deletion requested by Git
```

Recovery may require operating-system or filesystem recovery tools if the file was not stored elsewhere.

---

# 44. Automated CI Cleanup

`git clean` is useful in automation because build environments can accumulate:

```text
temporary files
generated files
test output
build artifacts
```

A script can use:

```cmd
git clean -fd
```

to remove untracked generated content.

For highly controlled environments, teams may use:

```cmd
git clean -ffdx
```

with additional force when nested Git repositories are involved.

---

# 45. Double `-f`

Git has special protection around nested Git repositories.

In some cases:

```cmd
git clean -fd
```

may not remove certain nested Git repositories.

A stronger form is:

```cmd
git clean -ffdx
```

The second `-f` increases the force level.

This should be used only when you understand exactly what nested repositories or ignored content will be deleted.

---

# 46. Nested Git Repository Example

Suppose:

```text
project/
└── external/
    └── .git/
```

Git may treat the nested repository differently from an ordinary untracked directory.

Do not use:

```cmd
git clean -ffdx
```

unless you intentionally want such nested repository content removed.

Always preview first:

```cmd
git clean -nffdx
```

---

# 47. Clean Only a Specific Directory

Example:

```cmd
git clean -fd -- build/
```

This focuses cleanup on:

```text
build/
```

rather than cleaning every eligible untracked directory in the repository.

---

# 48. Clean Specific File

Example:

```cmd
git clean -f -- debug.log
```

This targets:

```text
debug.log
```

instead of broadly cleaning the repository.

---

# 49. Interactive Selection

For uncertain cleanup:

```cmd
git clean -i
```

is often safer than immediately using:

```cmd
git clean -f
```

You can inspect candidates and choose what should be removed.

---

# 50. Recommended Developer Workflow

When you simply want to remove generated untracked files:

```cmd
git status
```

```cmd
git clean -nd
```

```cmd
git clean -fd
```

When you also want to remove ignored generated files:

```cmd
git status --ignored
```

```cmd
git clean -nxd
```

```cmd
git clean -fxd
```

---

# 51. Mental Model

Think of Git's workspace as:

```text
                 Working Directory
                       │
          ┌────────────┴────────────┐
          │                         │
       Tracked                   Untracked
          │                         │
          │                   ┌─────┴─────┐
          │                   │           │
          │                Ignored    Not ignored
          │
          ↓
git restore/reset             git clean
```

More precisely:

```text
Tracked content
    → restore/reset can affect it

Untracked content
    → git clean can remove it

Ignored content
    → protected by default
    → -x / -X changes this behavior
```

---

# 52. Golden Rules

### Rule 1

Preview first:

```cmd
git clean -n
```

### Rule 2

For directories:

```cmd
git clean -nd
```

then:

```cmd
git clean -fd
```

### Rule 3

Before deleting ignored files:

```cmd
git clean -nxd
```

### Rule 4

Never blindly run:

```cmd
git clean -fxd
```

### Rule 5

Remember:

```text
git clean = delete untracked working-tree content
```

not:

```text
undo commits
```

---

# 53. Command Cheat Sheet

```cmd
:: Preview untracked files
git clean -n

:: Remove untracked files
git clean -f

:: Preview untracked files and directories
git clean -nd

:: Remove untracked files and directories
git clean -fd

:: Preview untracked + ignored content
git clean -nxd

:: Remove untracked + ignored content
git clean -fxd

:: Preview ignored content only
git clean -nX

:: Remove ignored content only
git clean -fX

:: Interactive cleanup
git clean -i

:: Interactive cleanup including directories
git clean -id

:: Quiet cleanup
git clean -fq

:: Clean a specific file
git clean -f -- file.txt

:: Clean a specific directory
git clean -fd -- build/
```

---

# 54. Final Summary

```text
git clean
    ↓
removes untracked working-tree content

-n
    ↓
preview only

-f
    ↓
force deletion

-d
    ↓
include directories

-x
    ↓
include ignored content

-X
    ↓
ignored content only

-i
    ↓
interactive selection
```

The safest general pattern is:

```cmd
git status
git status --ignored
git clean -nd
```

Inspect the result carefully.

If ignored content must also be removed:

```cmd
git clean -nxd
```

Only after confirming the preview should you execute:

```cmd
git clean -fd
```

or, for an intentionally complete cleanup:

```cmd
git clean -fxd
```

**Core distinction:**

```text
git clean
    → removes untracked files/directories

git restore
    → restores file content

git reset
    → moves/manipulates HEAD, index, and working tree

git revert
    → creates a new commit that reverses an old commit

git rm
    → removes tracked files and stages the deletion
```

# `git status`

`git status` displays the current state of the working tree and staging area.

It answers questions such as:

```text
What files changed?
What files are staged?
What files are unstaged?
What files are untracked?
What branch am I on?
Is my branch ahead or behind its upstream?
Are there merge conflicts?
Are there ignored files?
```

---

# 1. Basic Syntax

```cmd
git status
```

Example:

```cmd
git status
```

Typical output:

```text
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   app.js

Untracked files:
  notes.txt
```

---

# 2. What `git status` Actually Examines

Git status compares several states:

```text
HEAD
 │
 │ compare
 ▼
INDEX / STAGING AREA
 │
 │ compare
 ▼
WORKING TREE
```

More precisely:

```text
HEAD
 │
 ├── HEAD vs Index
 │       ↓
 │   staged changes
 │
 └── Index vs Working Tree
         ↓
     unstaged changes
```

It also determines:

```text
untracked files
ignored files
branch information
upstream relationship
conflicts
```

---

# 3. Working Tree

The working tree contains the files you currently work on.

Example:

```text
project/
├── app.js
├── package.json
└── README.md
```

If you modify:

```text
app.js
```

Git status can report:

```text
modified: app.js
```

---

# 4. Staging Area

The staging area is represented by Git's index.

If you execute:

```cmd
git add app.js
```

the current version of `app.js` is placed into the index.

Then:

```cmd
git status
```

may show:

```text
Changes to be committed:
  modified: app.js
```

---

# 5. Unstaged Changes

Suppose:

```cmd
git add app.js
```

Then you modify `app.js` again.

Now there are two states:

```text
HEAD
 │
 ▼
old version

INDEX
 │
 ▼
first modification

WORKING TREE
 │
 ▼
second modification
```

`git status` can report the file in both categories:

```text
Changes to be committed:
  modified: app.js

Changes not staged for commit:
  modified: app.js
```

This is an important Git concept.

---

# 6. Untracked Files

Create:

```text
new-file.txt
```

without adding it:

```cmd
git status
```

Git may report:

```text
Untracked files:
  new-file.txt
```

The file exists in the working tree but is not tracked by the index.

---

# 7. Tracked Files

A tracked file is known to Git.

It can be:

```text
unchanged
modified
deleted
renamed
copied
staged
```

A tracked file is not necessarily staged.

---

# 8. Clean Working Tree

If nothing changed:

```cmd
git status
```

may output:

```text
On branch main
nothing to commit, working tree clean
```

This means:

```text
HEAD == INDEX == WORKING TREE
```

for tracked content relevant to the repository.

---

# 9. Branch Information

`git status` reports the current branch:

```text
On branch main
```

This tells you which local branch `HEAD` currently points to.

---

# 10. Detached HEAD

If `HEAD` points directly to a commit instead of a local branch:

```cmd
git status
```

may show:

```text
HEAD detached at abc1234
```

This is called:

```text
detached HEAD
```

---

# 11. Ahead and Behind

If the branch tracks an upstream branch, status can report:

```text
Your branch is ahead of 'origin/main' by 2 commits.
```

Meaning:

```text
origin/main
    │
    ▼
A──B
    \
     C──D
       ↑
      main
```

Local `main` has two commits not present in `origin/main`.

---

# 12. Behind

Example:

```text
Your branch is behind 'origin/main' by 3 commits.
```

Conceptually:

```text
origin/main
      ↓
A──B──C──D
     ↑
   main
```

The local branch lacks commits reachable from the upstream branch.

---

# 13. Diverged

Status can report:

```text
Your branch and 'origin/main' have diverged,
and have 2 and 3 different commits each, respectively.
```

Conceptually:

```text
        C──D
       /
A──B
       \
        E──F──G
```

Local and upstream have independently developed history.

This is different from simply being ahead or behind.

---

# 14. `git status --short`

For compact output:

```cmd
git status --short
```

Short form:

```cmd
git status -s
```

Example:

```text
 M app.js
A  config.js
?? notes.txt
```

---

# 15. Short Status Format

The two-character status format is:

```text
XY filename
```

Where:

```text
X = index / staging-area status
Y = working-tree status
```

This is critical for understanding short status output.

---

# 16. First Character: Index

The first character describes the staged state.

Examples:

```text
M file.js
```

First character:

```text
M
```

means the file has a staged modification.

---

# 17. Second Character: Working Tree

The second character describes unstaged working-tree changes.

Example:

```text
 M file.js
```

means:

```text
X = space
Y = M
```

Therefore:

```text
not staged
modified in working tree
```

---

# 18. Important Status Characters

Common values:

```text
M   modified
A   added
D   deleted
R   renamed
C   copied
U   unmerged
?   untracked
!   ignored
```

---

# 19. Examples

```text
M  file.js
```

means:

```text
staged modification
```

```text
 M file.js
```

means:

```text
unstaged modification
```

```text
MM file.js
```

means:

```text
staged modification
+
additional unstaged modification
```

---

# 20. Staged New File

```text
A  new.js
```

means:

```text
new.js
```

has been added to the staging area.

---

# 21. Untracked File

```text
?? notes.txt
```

means:

```text
notes.txt
```

is untracked.

It has not been staged.

---

# 22. Deleted File

```text
 D file.js
```

means the tracked file was deleted from the working tree but the deletion has not been staged.

```text
D  file.js
```

means the deletion is staged.

---

# 23. Renamed File

A staged rename may appear as:

```text
R  old.js -> new.js
```

Git detects renames based on similarity between file contents.

A rename is represented internally through changes to paths and objects rather than as a special rename object.

---

# 24. Conflicts

During a merge or other operation, status can show:

```text
UU file.js
```

`UU` indicates an unmerged state involving both sides.

Other conflict states can include:

```text
AA
DD
AU
UA
DU
UD
UU
```

The exact meaning depends on which side added, deleted, or modified the path.

---

# 25. `--branch`

Show branch information in short status:

```cmd
git status --short --branch
```

Short form:

```cmd
git status -sb
```

Example:

```text
## main...origin/main
 M app.js
?? notes.txt
```

---

# 26. `-sb`

This is one of the most useful forms:

```cmd
git status -sb
```

Example:

```text
## main...origin/main [ahead 2]
 M src/app.js
?? test.txt
```

It combines:

```text
short output
+
branch information
```

---

# 27. Long Format

Default:

```cmd
git status
```

This is called the long/human-readable format.

It provides sections such as:

```text
Changes to be committed:
Changes not staged for commit:
Untracked files:
```

---

# 28. Porcelain Format

For scripts:

```cmd
git status --porcelain
```

This produces stable machine-readable output.

Example:

```text
 M app.js
A  config.js
?? notes.txt
```

The porcelain format is preferable to parsing normal human-readable status output.

---

# 29. Porcelain Version 1

```cmd
git status --porcelain=v1
```

This explicitly requests porcelain version 1.

Example:

```text
 M app.js
?? notes.txt
```

This format is widely used by tools and scripts.

---

# 30. Porcelain Version 2

Advanced:

```cmd
git status --porcelain=v2
```

Version 2 provides more structured information.

Example output can contain records such as:

```text
1 M. N... 100644 100644 100644 <object> <object> file.js
```

The exact fields depend on the status condition.

Use version 2 when building sophisticated tooling that needs structured Git status information.

---

# 31. Why Porcelain Matters

Do not build automation around:

```cmd
git status
```

human-readable sentences.

Instead use:

```cmd
git status --porcelain
```

or:

```cmd
git status --porcelain=v2
```

because porcelain output is designed for programmatic consumption.

---

# 32. `--untracked-files`

Control untracked-file reporting:

```cmd
git status --untracked-files
```

Short form:

```cmd
git status -u
```

Common values:

```text
no
normal
all
```

---

# 33. No Untracked Files

```cmd
git status --untracked-files=no
```

or:

```cmd
git status -uno
```

This hides untracked files.

Useful when a repository contains a very large number of generated files.

---

# 34. Normal Untracked Files

```cmd
git status --untracked-files=normal
```

This is generally the normal default behavior.

---

# 35. All Untracked Files

```cmd
git status --untracked-files=all
```

This reports individual files inside untracked directories rather than only reporting the directory.

Example:

```text
?? build/
```

versus potentially:

```text
?? build/a.js
?? build/b.js
?? build/c.js
```

---

# 36. Ignored Files

By default, ignored files are not normally displayed.

Example `.gitignore`:

```text
node_modules/
.env
dist/
```

Then:

```cmd
git status
```

does not normally list them.

---

# 37. Show Ignored Files

Use:

```cmd
git status --ignored
```

Example:

```text
Ignored files:
  node_modules/
  dist/
```

This is useful when debugging `.gitignore`.

---

# 38. Show Only Ignored Files

Combine options:

```cmd
git status --ignored --short
```

Example:

```text
!! node_modules/
!! dist/
```

The `!!` status indicates ignored paths in short output.

---

# 39. Why Ignored Files Matter

Suppose:

```text
.env
```

is ignored.

Then:

```cmd
git status
```

does not normally show it.

But if `.env` was already tracked before being added to `.gitignore`, ignoring does not automatically remove it from tracking.

This distinction is important.

---

# 40. Tracked vs Ignored

An ignored file:

```text
untracked
+
matches ignore rule
```

A tracked file:

```text
already exists in Git index/history
```

Adding it to `.gitignore` does not automatically stop tracking it.

---

# 41. `--ignored=matching`

You can control ignored directory behavior:

```cmd
git status --ignored=matching
```

This reports ignored directories according to matching behavior.

---

# 42. `--ignored=no`

Explicitly disable ignored-file reporting:

```cmd
git status --ignored=no
```

This is equivalent to normal behavior regarding ignored paths.

---

# 43. `--ignored=traditional`

Git also supports:

```cmd
git status --ignored=traditional
```

This controls how ignored paths are displayed.

For normal daily work, simply:

```cmd
git status --ignored
```

is usually sufficient.

---

# 44. `--ahead-behind`

Git can calculate how far the local branch is ahead or behind its upstream.

Example:

```cmd
git status --ahead-behind
```

This can display:

```text
Your branch is ahead of 'origin/main' by 3 commits.
```

---

# 45. Disable Ahead/Behind Calculation

Advanced:

```cmd
git status --no-ahead-behind
```

This avoids displaying detailed ahead/behind information.

This can matter for very large repositories where calculating divergence may be expensive.

---

# 46. Branch Tracking

Suppose:

```text
main
```

tracks:

```text
origin/main
```

Then status can compare:

```text
local main
      │
      ▼
local commit

origin/main
      │
      ▼
remote-tracking commit
```

This comparison produces ahead/behind information.

---

# 47. `--renames`

Git status can detect renames.

Example:

```cmd
git status --renames
```

This enables rename detection where applicable.

---

# 48. `--no-renames`

Disable rename detection:

```cmd
git status --no-renames
```

This can be useful for performance or when you want path-level additions/deletions instead of rename interpretation.

---

# 49. Rename Detection Is Similarity-Based

Git does not generally store:

```text
rename object
```

Instead, rename detection can infer:

```text
old file
    ↓
deleted

new file
    ↓
added
```

and determine that the contents are sufficiently similar to treat the pair as a rename.

Therefore status output can depend on rename detection settings.

---

# 50. Rename Similarity

Git uses similarity analysis when detecting renames.

A file with mostly unchanged content may be reported as:

```text
renamed: old.js -> new.js
```

while a heavily modified file may be reported as:

```text
deleted: old.js
new file: new.js
```

---

# 51. `--find-renames`

Explicitly enable rename detection:

```cmd
git status --find-renames
```

You can specify a similarity threshold:

```cmd
git status --find-renames=50%
```

The exact threshold affects how aggressively Git detects renames.

---

# 52. `--find-copies`

Advanced:

```cmd
git status --find-copies
```

This asks Git to detect copies as well as renames where applicable.

Short form:

```cmd
git status -C
```

---

# 53. Copy Detection

Suppose:

```text
original.js
```

is duplicated into:

```text
backup.js
```

Git may detect:

```text
copied: original.js -> backup.js
```

when copy detection is enabled and similarity conditions are met.

---

# 54. Pathspec

You can ask status about specific paths:

```cmd
git status -- src/app.js
```

Example:

```cmd
git status -- src/
```

The `--` separates Git options from path arguments.

---

# 55. Why `--` Matters

Consider a file beginning with a dash:

```text
--test.txt
```

Using:

```cmd
git status -- --test.txt
```

tells Git that everything after `--` should be interpreted as a path rather than an option.

This is a standard Git command-line convention.

---

# 56. Status for a Specific File

```cmd
git status -- app.js
```

This focuses status output on:

```text
app.js
```

Useful in large repositories.

---

# 57. Status for a Directory

```cmd
git status -- src/
```

This limits output to paths under:

```text
src/
```

---

# 58. Multiple Paths

```cmd
git status -- src/ package.json README.md
```

Git reports status for those specified paths.

---

# 59. Status in Another Repository

Use:

```cmd
git -C C:\projects\my-app status
```

This executes status as if Git were run from that repository.

Useful in scripts and multi-repository workflows.

---

# 60. Status and Submodules

A repository containing submodules may show submodule changes.

Example:

```text
modified:   libs/library (new commits)
```

The parent repository tracks the submodule's commit reference rather than the submodule's individual files.

---

# 61. Submodule Status Concepts

A submodule can have:

```text
new commits
modified content
untracked content
```

Status may indicate these states.

For more detailed submodule information:

```cmd
git submodule status
```

---

# 62. Status During Merge

When a merge is in progress:

```cmd
git status
```

provides information about:

```text
unmerged paths
conflicts
changes ready to commit
changes not staged
```

Example:

```text
You have unmerged paths.
  (fix conflicts and run "git commit")
```

---

# 63. Conflict Workflow

Typical workflow:

```cmd
git merge feature
git status
```

Then resolve conflicts.

After resolution:

```cmd
git add file.js
git status
```

The file should move from:

```text
Unmerged paths
```

to:

```text
Changes to be committed
```

---

# 64. Status During Rebase

During a rebase:

```cmd
git status
```

can tell you that a rebase is currently running and what operation is expected next.

For example, Git may tell you to:

```text
resolve conflicts
git add <file>
git rebase --continue
```

---

# 65. Status During Cherry-Pick

If a cherry-pick stops because of conflicts:

```cmd
git status
```

helps identify:

```text
unmerged paths
current cherry-pick state
files requiring resolution
```

---

# 66. Status During Revert

A conflicted revert similarly causes:

```cmd
git status
```

to report the current operation and unresolved paths.

---

# 67. Status Is Diagnostic

Think of:

```cmd
git status
```

as Git's repository diagnostic command.

Before destructive or history-changing operations, it is often useful to run:

```cmd
git status
```

so you know what state the repository is currently in.

---

# 68. Before Commit

Typical workflow:

```cmd
git status
git add .
git status
git commit
```

The first status shows:

```text
what will be staged
```

The second status verifies:

```text
what is staged
```

---

# 69. Before Reset

Before using:

```cmd
git reset
```

inspect:

```cmd
git status
```

This helps determine whether changes are:

```text
staged
unstaged
untracked
```

---

# 70. Before Rebase

Use:

```cmd
git status
```

A clean working tree is commonly preferred before rebasing.

If status reports:

```text
modified files
untracked files
```

you should understand those changes before beginning the rebase.

---

# 71. Before Switching Branches

Check:

```cmd
git status
```

This helps identify local modifications that may interact with the target branch.

Git may prevent a checkout/switch if doing so would overwrite local changes.

---

# 72. `git status` Does Not Change Repository History

Unlike:

```text
git commit
git reset
git merge
git rebase
```

`git status` is primarily observational.

It does not create commits or intentionally modify the working tree/index.

---

# 73. Status Does Not Fetch

Important:

```cmd
git status
```

does not normally contact the remote to download new commits.

If you want current remote-tracking information:

```cmd
git fetch
git status
```

For example:

```cmd
git fetch origin
git status
```

Now the local `origin/main` reference has been updated before status calculates divergence.

---

# 74. Why Status Can Be "Outdated"

Suppose the remote has received:

```text
new commits
```

but you have not fetched.

Your local:

```text
origin/main
```

may still point to an older commit.

Therefore:

```cmd
git status
```

may not know about the latest remote changes.

Use:

```cmd
git fetch
git status
```

when you need refreshed remote-tracking information.

---

# 75. Status vs Diff

`git status` answers:

```text
WHAT changed?
```

`git diff` answers:

```text
HOW did it change?
```

Example:

```cmd
git status
```

might say:

```text
modified: app.js
```

Then:

```cmd
git diff
```

shows the actual line-level changes.

---

# 76. Status vs Log

```cmd
git status
```

shows the current repository state.

```cmd
git log
```

shows commit history.

They answer different questions.

---

# 77. Status vs Branch

```cmd
git status
```

shows current branch plus working-tree state.

```cmd
git branch
```

primarily manages/displays branches.

---

# 78. Status vs Fetch

```cmd
git status
```

inspects local state.

```cmd
git fetch
```

updates remote-tracking references.

A useful sequence is:

```cmd
git fetch
git status
```

when you need current local-vs-remote information.

---

# 79. Useful Daily Commands

Normal:

```cmd
git status
```

Compact:

```cmd
git status -s
```

Compact + branch:

```cmd
git status -sb
```

Show ignored:

```cmd
git status --ignored
```

Machine-readable:

```cmd
git status --porcelain
```

Machine-readable advanced:

```cmd
git status --porcelain=v2
```

Show all untracked files:

```cmd
git status -uall
```

---

# 80. Recommended Developer Workflow

Use:

```cmd
git status -sb
```

for a quick overview.

Then:

```cmd
git diff
```

for unstaged changes.

Then:

```cmd
git diff --staged
```

for staged changes.

This gives:

```text
status
   ↓
what changed?

diff
   ↓
what unstaged content changed?

diff --staged
   ↓
what staged content will be committed?
```

---

# 81. Advanced Status Inspection

A strong diagnostic sequence is:

```cmd
git status -sb
git diff
git diff --staged
git branch -vv
git log --oneline --decorate -10
```

This gives you:

```text
working-tree state
staged changes
branch tracking
recent commit topology
```

---

# 82. Script-Friendly Status

For automation:

```cmd
git status --porcelain=v2
```

You can combine it with:

```cmd
--branch
```

Example:

```cmd
git status --porcelain=v2 --branch
```

This provides structured status plus branch information.

---

# 83. Detect Dirty Repository

A common scripting technique:

```cmd
git status --porcelain
```

If output is empty:

```text
working tree/index have no reported changes
```

If output exists:

```text
repository has reported changes
```

Do not assume that "empty output" answers every possible repository-state question; scripts should define whether they care about ignored/untracked files, submodules, or other states.

---

# 84. Detect Untracked Files

Use:

```cmd
git status --porcelain
```

and inspect entries beginning with:

```text
??
```

For example:

```text
?? temp.txt
```

means:

```text
untracked
```

---

# 85. Detect Staged Changes

Inspect the first status column.

Examples:

```text
M  app.js
A  config.js
D  old.js
```

All contain non-space first-column values.

This indicates index/staging-area changes.

---

# 86. Detect Unstaged Changes

Inspect the second status column.

Example:

```text
 M app.js
 D old.js
```

The second column indicates working-tree changes.

---

# 87. Detect Both Staged and Unstaged Changes

Example:

```text
MM app.js
```

Interpretation:

```text
M
│
└── staged modification

M
│
└── additional unstaged modification
```

This is one of the most important short-status patterns.

---

# 88. Status and `.gitignore`

When a file unexpectedly appears as:

```text
?? file
```

inspect ignore rules:

```cmd
git check-ignore -v file
```

When it is ignored, Git can show:

```text
.gitignore:10:*.log    file.log
```

This is often more useful than repeatedly running status.

---

# 89. Status and File Tracking

To determine whether a file is tracked:

```cmd
git ls-files --error-unmatch file.js
```

If Git reports the file, it is tracked.

If not, it is not currently in the index.

---

# 90. Status and Index

Remember:

```text
HEAD
  │
  │ HEAD → INDEX
  ▼
INDEX
  │
  │ INDEX → WORKTREE
  ▼
WORKTREE
```

Status effectively summarizes differences between these states.

---

# 91. Advanced Mental Model

```text
                         HEAD
                          │
                          │
                     committed state
                          │
                          ▼
                    ┌───────────┐
                    │   INDEX   │
                    │  staged   │
                    └─────┬─────┘
                          │
                          │
                     staged diff
                          │
                          ▼
                    ┌───────────┐
                    │ WORKTREE  │
                    │  current  │
                    └───────────┘
```

Status reports both transitions:

```text
HEAD → INDEX
INDEX → WORKTREE
```

plus:

```text
untracked
ignored
branch/upstream
conflicts
```

---

# 92. Common Mistakes

### Mistake 1: Thinking modified means staged

```text
 M file.js
```

is **not staged**.

```text
M  file.js
```

is staged.

---

### Mistake 2: Thinking `git status` contacts GitHub

Normally:

```cmd
git status
```

does not fetch from the remote.

---

### Mistake 3: Thinking ignored means deleted

Ignored means:

```text
Git is instructed not to report the untracked path normally.
```

It does not mean the file was deleted.

---

### Mistake 4: Thinking status shows line changes

It normally identifies files and states.

Use:

```cmd
git diff
```

to inspect actual line-level modifications.

---

### Mistake 5: Parsing human-readable output

For scripts, prefer:

```cmd
git status --porcelain=v2
```

instead of parsing:

```cmd
git status
```

---

# 93. Most Important Commands

```cmd
git status
```

```cmd
git status -s
```

```cmd
git status -sb
```

```cmd
git status --porcelain
```

```cmd
git status --porcelain=v2
```

```cmd
git status --ignored
```

```cmd
git status -uall
```

```cmd
git status -- src/
```

```cmd
git status -- app.js
```

```cmd
git -C C:\path\to\repo status
```

---

# 94. Command Reference

```text
git status
    Show normal repository status.

git status -s
    Show short status.

git status -sb
    Show short status plus branch information.

git status --porcelain
    Machine-readable status.

git status --porcelain=v1
    Explicit porcelain v1.

git status --porcelain=v2
    Advanced machine-readable status.

git status --ignored
    Include ignored files.

git status -uno
    Hide untracked files.

git status -uall
    Show all individual untracked files.

git status --branch
    Include branch information.

git status --ahead-behind
    Show ahead/behind information.

git status --no-ahead-behind
    Disable ahead/behind reporting.

git status --renames
    Enable rename detection.

git status --no-renames
    Disable rename detection.

git status --find-renames
    Enable rename detection.

git status --find-copies
    Enable copy detection.

git status -- <path>
    Restrict status to a path.

git -C <repository> status
    Run status against another repository.
```

---

# 95. Final Mental Model

Always interpret:

```text
XY file
```

as:

```text
X = INDEX
Y = WORKING TREE
```

Therefore:

```text
 M file
```

means:

```text
INDEX       unchanged
WORKTREE    modified
```

while:

```text
M  file
```

means:

```text
INDEX       modified
WORKTREE    matches index
```

and:

```text
MM file
```

means:

```text
INDEX       modified
WORKTREE    modified again
```

and:

```text
?? file
```

means:

```text
not tracked
```

The core model is:

```text
                    git status
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
       repository state        branch state
             │                       │
       ┌─────┼─────┐           ┌─────┴─────┐
       ▼     ▼     ▼           ▼           ▼
    staged  unstaged untracked ahead/behind upstream
       │       │       │
       └───────┴───────┘
               │
               ▼
        current Git state
```

If you understand:

```text
HEAD
INDEX
WORKING TREE
X/Y status columns
tracked vs untracked
staged vs unstaged
upstream
ahead/behind
porcelain
```

then you understand the fundamental mechanics behind `git status`.

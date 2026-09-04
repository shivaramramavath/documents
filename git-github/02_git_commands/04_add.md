# `git add`

`git add` updates the **Git index (staging area)** with content from the working tree.

It does **not** create a commit.

The fundamental flow is:

```text
WORKING TREE
     │
     │ git add
     ▼
  INDEX
     │
     │ git commit
     ▼
   HEAD
```

So:

```cmd
git add <path>
```

means:

> Take the current content of the specified path from the working tree and prepare it in the index for the next commit.

---

# 1. Basic Syntax

```cmd
git add <file>
```

Example:

```cmd
git add app.js
```

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

# 2. What `git add` Actually Does

Suppose:

```text
HEAD
 │
 ▼
version 1
```

You modify a file:

```text
WORKING TREE
 │
 ▼
version 2
```

Before `git add`:

```text
HEAD       = version 1
INDEX      = version 1
WORKTREE   = version 2
```

After:

```cmd
git add app.js
```

the state becomes:

```text
HEAD       = version 1
INDEX      = version 2
WORKTREE   = version 2
```

The modification is now staged.

---

# 3. `git add` Does Not Commit

This:

```cmd
git add app.js
```

does not create a commit.

You still need:

```cmd
git commit
```

Complete workflow:

```cmd
git add app.js
git commit -m "Update application logic"
```

---

# 4. Add One File

```cmd
git add app.js
```

Only:

```text
app.js
```

is staged.

Other modified files remain unstaged.

---

# 5. Add Multiple Files

```cmd
git add app.js server.js package.json
```

All specified files are staged.

---

# 6. Add a Directory

```cmd
git add src/
```

This stages applicable changes under:

```text
src/
```

including files recursively.

Example:

```text
src/
├── app.js
├── server.js
└── utils/
    ├── logger.js
    └── ids.js
```

Running:

```cmd
git add src/
```

stages changes under that directory.

---

# 7. Add Everything in the Current Directory

```cmd
git add .
```

This stages changes reachable from the current directory according to Git's pathspec behavior.

It is commonly used from the repository root:

```cmd
git add .
```

---

# 8. `git add -A`

```cmd
git add -A
```

or:

```cmd
git add --all
```

This stages additions, modifications, and deletions across the working tree.

Example:

```text
app.js       modified
old.js       deleted
new.js       untracked
```

After:

```cmd
git add -A
```

all applicable changes are staged.

---

# 9. `git add -u`

```cmd
git add -u
```

or:

```cmd
git add --update
```

Stages modifications and deletions of **already tracked files**.

It does not normally stage new untracked files.

Example:

```text
app.js       modified
old.js       deleted
new.js       untracked
```

After:

```cmd
git add -u
```

the result is:

```text
app.js       staged
old.js       staged deletion
new.js       still untracked
```

---

# 10. `-A` vs `-u` vs `.`

Important distinction:

```text
git add .
    Add applicable changes under the current path.

git add -A
    Stage additions, modifications and deletions across the working tree.

git add -u
    Stage modifications and deletions of tracked files.
```

For repository-wide staging:

```cmd
git add -A
```

is the clearest explicit command.

---

# 11. Add a New File

Suppose:

```text
new-feature.js
```

does not exist in Git.

Run:

```cmd
git add new-feature.js
```

Now:

```text
?? new-feature.js
```

becomes:

```text
A  new-feature.js
```

in short status.

---

# 12. Stage a Modification

Suppose:

```text
app.js
```

is already tracked.

After editing:

```text
 M app.js
```

Run:

```cmd
git add app.js
```

Now:

```text
M  app.js
```

The modification is staged.

---

# 13. Stage a Deletion

Suppose:

```text
old.js
```

is tracked and you delete it.

Status:

```text
 D old.js
```

Run:

```cmd
git add old.js
```

Now:

```text
D  old.js
```

The deletion is staged.

---

# 14. `git add -A` for Deletions

You can stage deleted files with:

```cmd
git add -A
```

This is useful when multiple files were deleted.

---

# 15. `git rm` vs `git add`

For a tracked file:

```cmd
git rm old.js
```

removes the file from the working tree and stages its deletion.

Alternatively:

```cmd
del old.js
git add old.js
```

stages the deletion after the filesystem operation.

Both can result in the deletion being staged.

---

# 16. Check Before and After

Before:

```cmd
git status -sb
```

Then:

```cmd
git add app.js
```

Then:

```cmd
git status -sb
```

This lets you verify exactly what entered the index.

---

# 17. The Index Is Not a Patch Queue

A common misconception is that `git add` simply stores a list of commands.

It does not.

The index represents a proposed snapshot of the next commit.

Conceptually:

```text
HEAD
  │
  │ previous snapshot
  ▼
INDEX
  │
  │ proposed next snapshot
  ▼
WORKING TREE
  │
  │ current files
  ▼
filesystem
```

---

# 18. Partial Staging

You can stage only part of a file.

Use:

```cmd
git add -p
```

or:

```cmd
git add --patch
```

This is one of the most important advanced uses of `git add`.

---

# 19. Interactive Patch Mode

Run:

```cmd
git add -p
```

Git shows a change hunk and asks what to do.

Typical prompt:

```text
Stage this hunk [y,n,q,a,d,s,e,?]?
```

The letters represent different actions.

---

# 20. Patch Mode: `y`

```text
y
```

means:

```text
yes
```

Stage the current hunk.

---

# 21. Patch Mode: `n`

```text
n
```

means:

```text
no
```

Do not stage the current hunk.

The change remains unstaged.

---

# 22. Patch Mode: `q`

```text
q
```

means:

```text
quit
```

Stop the patch operation.

Changes already staged remain staged.

---

# 23. Patch Mode: `a`

```text
a
```

means:

```text
stage this hunk and all later hunks in the current file
```

---

# 24. Patch Mode: `d`

```text
d
```

means:

```text
do not stage this hunk or any later hunks in the current file
```

---

# 25. Patch Mode: `s`

```text
s
```

means:

```text
split the current hunk
```

Git attempts to divide a large hunk into smaller hunks.

This is extremely useful when unrelated changes are close together.

---

# 26. Patch Mode: `e`

```text
e
```

means:

```text
manually edit the patch
```

This provides fine-grained control over which lines enter the index.

Use this carefully.

---

# 27. Patch Mode: `?`

```text
?
```

shows help for the available patch commands.

---

# 28. Why Partial Staging Matters

Suppose you changed:

```text
app.js
```

with two unrelated changes:

```text
feature A
debugging code
```

You want the commit to contain only feature A.

Instead of:

```cmd
git add app.js
```

use:

```cmd
git add -p app.js
```

Stage only the feature-related hunk.

Then:

```cmd
git commit -m "Add feature A"
```

The debugging change remains unstaged.

---

# 29. Staging and Commit Boundaries

Good commits generally contain logically related changes.

For example:

```text
Commit 1:
Add authentication

Commit 2:
Fix authentication validation

Commit 3:
Update documentation
```

Partial staging lets you create clean commit boundaries even when multiple changes exist in the same working-tree files.

---

# 30. Interactive Add

Run:

```cmd
git add -i
```

or:

```cmd
git add --interactive
```

Git opens an interactive staging interface.

It can provide operations such as:

```text
status
update
revert
add untracked
patch
diff
```

Exact interactive UI/output can vary by Git version.

---

# 31. Interactive `update`

Within interactive mode, `update` lets you select paths to stage.

This is useful when many files have changed.

---

# 32. Interactive `patch`

Interactive mode can enter patch selection.

Conceptually:

```text
git add -i
       │
       ▼
interactive menu
       │
       ▼
patch selection
       │
       ▼
select individual hunks
```

---

# 33. Stage Only Specific Paths

Use:

```cmd
git add -- src/app.js src/server.js
```

The `--` separates options from paths.

This is especially useful when filenames might otherwise be interpreted as options.

---

# 34. Pathspecs

`git add` accepts Git pathspecs.

Examples:

```cmd
git add src/
```

```cmd
git add "*.js"
```

```cmd
git add "src/**/*.js"
```

Pathspec behavior depends on Git's pathspec rules and shell quoting.

---

# 35. Important Windows CMD Quoting

In Windows CMD, quoting can be useful for wildcard/pathspec expressions:

```cmd
git add "*.js"
```

This allows Git to interpret the pattern rather than relying on shell expansion.

---

# 36. Exclude Paths

Advanced pathspec syntax can exclude paths.

Example:

```cmd
git add . ":(exclude)node_modules/"
```

This tells Git to include the normal path selection but exclude:

```text
node_modules/
```

This is an advanced pathspec technique.

---

# 37. Pathspec Magic

Git supports pathspec magic syntax.

For example:

```cmd
git add ":(top)src/app.js"
```

`:(top)` makes the path relative to the repository root.

Another example:

```cmd
git add ":(exclude)dist/"
```

excludes a path.

---

# 38. Top-Level Pathspec

```cmd
git add ":(top)src/"
```

means:

```text
src/
```

from the repository root, regardless of your current directory.

---

# 39. Literal Pathspec

If you need Git to treat special pathspec characters literally:

```cmd
git add ":(literal)file[1].js"
```

This tells Git to interpret the path literally rather than applying pathspec pattern semantics.

---

# 40. Glob Pathspec

Git also supports glob-style pathspec magic:

```cmd
git add ":(glob)**/*.js"
```

This can be useful when selecting files recursively.

---

# 41. Exclude With Glob

Example:

```cmd
git add ":(glob)**/*.js" ":(exclude)node_modules/**"
```

Conceptually:

```text
include all JavaScript files
        +
exclude node_modules
```

---

# 42. Intent to Add

Advanced:

```cmd
git add -N file.js
```

or:

```cmd
git add --intent-to-add file.js
```

This tells Git that you intend to add the file without immediately staging its full content.

---

# 43. Intent-to-Add Purpose

Suppose:

```text
new.js
```

is untracked.

Run:

```cmd
git add -N new.js
```

Git records the intent to add the path.

This can make its content appear in certain diff/status workflows without fully staging the file contents.

---

# 44. `git add -N` Is Not the Same as Normal `git add`

Normal:

```cmd
git add new.js
```

means:

```text
stage the file content
```

Intent-to-add:

```cmd
git add -N new.js
```

means:

```text
record that this path is intended to be added
without staging its content as a normal addition
```

---

# 45. Refreshing the Index

Advanced:

```cmd
git add --refresh
```

This refreshes stat information in the index without adding new content in the normal sense.

It is primarily useful for index/stat-cache behavior and advanced tooling.

---

# 46. `--renormalize`

Advanced:

```cmd
git add --renormalize .
```

This reapplies Git's clean-filter/normalization rules to tracked files.

It is especially useful after changing:

```text
.gitattributes
```

For example:

```text
line endings
```

can be normalized consistently.

---

# 47. Why `--renormalize` Exists

Suppose a repository changes its normalization policy through:

```text
.gitattributes
```

Existing tracked files may need to be reprocessed.

Use:

```cmd
git add --renormalize .
```

to stage the normalized versions.

Then inspect:

```cmd
git diff --cached
```

before committing.

---

# 48. End-of-Line Normalization

Git can normalize line endings using attributes such as:

```text
text
eol
```

For example:

```text
*.js text
```

When normalization rules change, this workflow can be appropriate:

```cmd
git add --renormalize .
git status
git diff --cached
git commit -m "Normalize line endings"
```

---

# 49. File Mode Changes

Git can track executable-bit/file-mode changes on systems that support them.

A change may appear as:

```text
mode change 100644 => 100755
```

`git add` stages the index state representing that change.

---

# 50. Symlinks

Git can track symbolic links.

When a symlink changes, `git add` stages the new index representation.

The exact filesystem behavior depends on the operating system and Git configuration.

---

# 51. Submodules

When a submodule's checked-out commit changes, the parent repository can record the changed submodule commit reference.

Running:

```cmd
git add path\to\submodule
```

in the parent repository can stage the changed gitlink.

---

# 52. Submodule Content vs Parent Repository

Suppose:

```text
project/
└── library/
```

is a submodule.

Changes inside the submodule are normally committed inside the submodule repository first.

Then the parent repository stages the new submodule commit reference.

Conceptually:

```text
SUBMODULE
   │
   └── commit new version

PARENT REPOSITORY
   │
   └── git add library/
```

---

# 53. Adding Ignored Files

Normally:

```cmd
git add ignored.log
```

will refuse to add an ignored file.

You can explicitly force it:

```cmd
git add -f ignored.log
```

or:

```cmd
git add --force ignored.log
```

---

# 54. Why `-f` Matters

Suppose `.gitignore` contains:

```text
.env
```

Then:

```cmd
git add .env
```

does not normally stage it.

Force it with:

```cmd
git add -f .env
```

Use this carefully, especially for secrets.

---

# 55. `-f` Does Not Override Everything

Force-add affects ignore rules, but it does not mean:

```text
"ignore all repository safety checks"
```

It simply allows explicitly specified ignored paths to be added.

---

# 56. Add Empty Directories

Git does not track empty directories directly.

This:

```text
logs/
```

cannot be staged merely because the directory exists.

You need a tracked file, commonly:

```text
logs/.gitkeep
```

Then:

```cmd
git add logs/.gitkeep
```

Git tracks the file, and therefore the directory exists when the repository is checked out.

---

# 57. Git Tracks Files, Not Directories

Important mental model:

```text
Git
 │
 └── tracks file paths and their contents
```

Directories are implied by tracked paths.

Therefore:

```text
src/app.js
```

causes the directory structure:

```text
src/
```

to exist when checked out.

---

# 58. Add After Rename

Suppose:

```text
old.js
```

is renamed to:

```text
new.js
```

using the filesystem.

Git may initially show:

```text
 D old.js
?? new.js
```

Then:

```cmd
git add -A
```

stages both changes.

Later Git may display them as a rename based on similarity detection.

---

# 59. `git add -A` and Rename Detection

`git add` does not necessarily create a special "rename object."

It updates the index with the resulting paths/content.

Rename detection is generally performed later by commands such as:

```cmd
git diff
```

or:

```cmd
git status
```

based on similarity.

---

# 60. Staging Only What You Want

Example working tree:

```text
 M auth.js
 M database.js
 M README.md
?? notes.txt
```

You want only authentication changes:

```cmd
git add auth.js
```

Now:

```text
M  auth.js
 M database.js
 M README.md
?? notes.txt
```

This is the core purpose of selective staging.

---

# 61. Verify Staged Content

After:

```cmd
git add auth.js
```

run:

```cmd
git diff --cached
```

or:

```cmd
git diff --staged
```

This shows what will enter the next commit.

---

# 62. Verify Unstaged Content

Use:

```cmd
git diff
```

This shows changes that are still only in the working tree.

Therefore:

```text
git diff
    ↓
unstaged changes

git diff --cached
    ↓
staged changes
```

---

# 63. Critical Workflow

A professional staging workflow:

```cmd
git status -sb
git diff
git add <specific-files>
git diff --cached
git status -sb
git commit
```

This lets you inspect both sides of the index boundary.

---

# 64. Stage → Modify Again

Suppose:

```cmd
git add app.js
```

Then modify `app.js` again.

Now:

```cmd
git status -s
```

can show:

```text
MM app.js
```

Meaning:

```text
first version
    ↓
staged

second version
    ↓
unstaged
```

Running:

```cmd
git add app.js
```

again stages the latest version.

---

# 65. `git add` Is Snapshot-Oriented

If you stage a file and then modify it:

```text
INDEX       = snapshot A
WORKTREE    = snapshot B
```

The index does not automatically update.

You must stage again:

```cmd
git add file.js
```

to move the new working-tree state into the index.

---

# 66. Staging Does Not "Lock" the File

After:

```cmd
git add app.js
```

you can continue editing:

```cmd
code app.js
```

The index remains at the staged version until you run `git add` again.

---

# 67. Staged and Unstaged Versions Can Coexist

This is valid:

```text
HEAD
 │
 ▼
version 1

INDEX
 │
 ▼
version 2

WORKTREE
 │
 ▼
version 3
```

Therefore:

```text
HEAD != INDEX != WORKTREE
```

This allows you to construct a commit from only part of your current work.

---

# 68. Stage From a Different Directory

Suppose you are inside:

```text
project/src/
```

You can use:

```cmd
git add app.js
```

to stage the file relative to the current directory.

To explicitly reference repository-root paths:

```cmd
git add ":(top)src/app.js"
```

---

# 69. Stage Everything From Repository Root

A common workflow:

```cmd
cd C:\projects\my-app
git add -A
```

This makes the scope explicit and avoids confusion about the current directory.

---

# 70. Common Mistake: `git add .`

Do not blindly use:

```cmd
git add .
```

when you have unrelated work.

Example:

```text
feature.js
debug.js
secret-test.js
README.md
```

If only `feature.js` belongs in the commit, prefer:

```cmd
git add feature.js
```

or:

```cmd
git add -p
```

---

# 71. Common Mistake: Forgetting Deletions

If you delete:

```text
old.js
```

and run:

```cmd
git add .
```

from an appropriate location, Git can stage the deletion.

For an explicit repository-wide operation:

```cmd
git add -A
```

is clearer.

---

# 72. Common Mistake: Assuming `git add` Is Recursive Everywhere

Path scope matters.

```cmd
git add .
```

is relative to the current path.

Whereas:

```cmd
git add -A
```

has repository-wide semantics when used appropriately.

Always understand your current directory before staging broadly.

---

# 73. Common Mistake: Adding Secrets

Never casually execute:

```cmd
git add -A
```

in a project containing:

```text
.env
credentials.json
private-key.pem
secrets/
```

Use `.gitignore` and inspect status first:

```cmd
git status --ignored
```

---

# 74. Common Mistake: `git add -f`

Do not use:

```cmd
git add -f .
```

as a routine solution.

Force-adding ignored content can accidentally stage:

```text
credentials
build output
local configuration
private files
```

Use `-f` only when you intentionally want a specific ignored path tracked.

---

# 75. `git add` and `.gitignore`

`.gitignore` controls untracked files.

Example:

```text
node_modules/
dist/
.env
*.log
```

Then:

```cmd
git add .
```

normally does not stage those ignored paths.

Already tracked files are different.

---

# 76. `.gitignore` Does Not Untrack Files

If:

```text
.env
```

was already committed, adding:

```text
.env
```

to `.gitignore` does not remove it from Git tracking.

You would need a separate operation such as:

```cmd
git rm --cached .env
```

if your goal is to stop tracking it while keeping the local file.

---

# 77. Add and Index Entries

At a lower level, the index contains entries representing paths and object IDs.

Conceptually:

```text
path       → object ID + metadata
```

When:

```cmd
git add file.js
```

runs, Git writes/updates the appropriate object and updates the index entry for that path.

---

# 78. Content-Addressed Storage

Git objects are identified by hashes.

When content is staged, Git can create an object representing the file content.

Conceptually:

```text
file content
     │
     ▼
Git object
     │
     ▼
object ID
     │
     ▼
index entry
```

The exact object format/hash algorithm depends on the repository's object format.

---

# 79. Blob Objects

File contents are represented by Git as **blob objects**.

A simplified model:

```text
app.js
  │
  ▼
blob
  │
  ▼
object ID
  │
  ▼
index entry
```

Directories are represented through tree objects when commits are created.

---

# 80. Index vs Commit

The index is not itself a commit.

```text
INDEX
```

is the proposed snapshot.

A commit records a snapshot represented by trees and metadata.

Therefore:

```cmd
git add
```

prepares:

```text
next snapshot
```

while:

```cmd
git commit
```

records that snapshot in history.

---

# 81. Advanced Diagnostic Commands

After staging:

```cmd
git diff --cached
```

To inspect index state more deeply:

```cmd
git ls-files --stage
```

This shows index entries and their associated object IDs/modes.

---

# 82. `git ls-files --stage`

Example conceptually:

```text
100644 <object-id> 0 app.js
```

The important pieces include:

```text
mode
object ID
stage number
path
```

This is an advanced way to inspect what is actually in the index.

---

# 83. Index Stages During Conflicts

During a conflict, the index can contain multiple stages for a path.

Conceptually:

```text
stage 1 = common ancestor
stage 2 = ours
stage 3 = theirs
```

This is why:

```cmd
git ls-files --stage
```

can be useful for advanced conflict debugging.

After resolving the conflict and running:

```cmd
git add file.js
```

the normal resolved entry replaces the unmerged state.

---

# 84. `git add` Resolves the Index State

During conflict resolution:

```cmd
git add resolved-file.js
```

means:

> Put the resolved working-tree version into the index.

It does not itself perform the merge.

The merge operation is completed later with the appropriate command, commonly:

```cmd
git commit
```

for a merge.

---

# 85. Stage After Conflict Resolution

Typical merge workflow:

```cmd
git merge feature
```

Conflict occurs.

Then:

```cmd
git status
```

Edit files.

Then:

```cmd
git add file.js
```

Then:

```cmd
git status
```

Finally:

```cmd
git commit
```

---

# 86. Patch Staging Is Not the Same as Editing the File

With:

```cmd
git add -p
```

you can choose which changes enter the index without deleting the remaining changes from the working tree.

This means:

```text
WORKTREE
    │
    ├── selected changes → INDEX
    │
    └── remaining changes stay in WORKTREE
```

---

# 87. Excellent Commit Construction Workflow

Use:

```cmd
git status -sb
git diff
git add -p
git diff --cached
git diff
git status -sb
git commit
```

This provides maximum visibility.

---

# 88. Practical Command Matrix

```text
Command
│
├── git add file.js
│      └── stage one path
│
├── git add src/
│      └── stage paths under src
│
├── git add .
│      └── stage applicable changes under current path
│
├── git add -A
│      └── stage additions/modifications/deletions
│
├── git add -u
│      └── stage tracked modifications/deletions
│
├── git add -p
│      └── stage selected hunks
│
├── git add -i
│      └── interactive staging
│
├── git add -N file
│      └── intent-to-add
│
├── git add -f file
│      └── force-add ignored path
│
├── git add --renormalize .
│      └── reapply normalization rules
│
└── git add --refresh
       └── refresh index stat information
```

---

# 89. Most Important Commands to Memorize

```cmd
git add file.js
```

```cmd
git add src/
```

```cmd
git add .
```

```cmd
git add -A
```

```cmd
git add -u
```

```cmd
git add -p
```

```cmd
git add -i
```

```cmd
git add -f file
```

```cmd
git add -N file
```

```cmd
git add --renormalize .
```

```cmd
git diff --cached
```

```cmd
git status -sb
```

---

# 90. Professional Rule

Prefer **specific staging** when possible:

```cmd
git add src/auth/login.js
git add src/auth/logout.js
```

instead of automatically doing:

```cmd
git add .
```

when the repository contains unrelated work.

For mixed changes inside one file:

```cmd
git add -p
```

is the professional tool for creating clean commit boundaries.

---

# 91. Final Mental Model

Remember this:

```text
                 WORKING TREE
                      │
                      │
                  git add
                      │
                      ▼
                    INDEX
                      │
                      │
                  git commit
                      │
                      ▼
                     HEAD
```

More precisely:

```text
HEAD
 │
 │ previous snapshot
 ▼
INDEX
 │
 │ proposed next snapshot
 ▼
WORKING TREE
 │
 │ current edits
 ▼
FILESYSTEM
```

`git add` moves selected content **from the working tree into the index**.

It does not:

```text
create a commit
push to GitHub
change branch
merge branches
upload anything
```

Its primary job is:

```text
WORKING TREE
      ↓
   SELECT
      ↓
    INDEX
      ↓
  NEXT COMMIT
```

The most important advanced concept is that **the index is a complete proposed snapshot**, which is why Git allows you to stage an exact subset of your working-tree changes and build precise, logically separated commits.

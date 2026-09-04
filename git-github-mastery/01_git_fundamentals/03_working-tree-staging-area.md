# Working Tree, Staging Area, and HEAD

Understanding the relationship between the **working tree**, **staging area (index)**, and **repository/HEAD** is one of the most important foundations of Git.

The core model is:

```text
Working Tree
     │
     │ git add
     ▼
Staging Area (Index)
     │
     │ git commit
     ▼
Repository (Commit)
```

More precisely:

```text
                    Git Repository
                         │
                         ▼
                       HEAD
                         │
                         ▼
                  Current Commit
                         ▲
                         │
                  git commit
                         │
                         ▼
                      Index
                         ▲
                         │
                    git add
                         │
                         ▼
                  Working Tree
```

---

# 1. Working Tree

The **working tree** is the set of files you currently have checked out and are working on.

Example:

```text
my-project/
├── src/
│   ├── app.js
│   └── server.js
├── package.json
└── README.md
```

These are your working-tree files.

When you edit:

```text
src/app.js
```

you are modifying the working tree.

Git does not automatically create a commit when you modify a file.

---

# 2. Staging Area

The **staging area** is also called the **index**.

It represents the exact content that Git intends to place into the next commit.

Conceptually:

```text
Working Tree
     │
     │ select changes
     ▼
Staging Area
     │
     │ commit
     ▼
Next Commit
```

The important point is:

> The staging area is not simply a list of filenames. It records the proposed content for the next commit.

---

# 3. HEAD

`HEAD` identifies the current checkout position.

In a normal branch checkout:

```text
HEAD
 │
 ▼
refs/heads/main
 │
 ▼
Commit C
```

So the complete model becomes:

```text
Working Tree
     │
     │ git add
     ▼
Index
     │
     │ git commit
     ▼
Commit C
     ▲
     │
    HEAD
```

---

# 4. Three Different States

Suppose the latest commit contains:

```text
README.md
```

with:

```text
Hello Git
```

Now you modify the file:

```text
Hello Git
Advanced Git
```

There are now potentially three versions:

```text
HEAD version
    │
    └── Hello Git

Index version
    │
    └── Hello Git

Working Tree version
    │
    └── Hello Git
        Advanced Git
```

Before staging, only the working tree differs.

---

# 5. `git status`

Use:

```cmd
git status
```

to inspect the relationship between:

```text
HEAD
Index
Working Tree
```

Example:

```text
Changes not staged for commit:
  modified: README.md
```

This means:

```text
HEAD
 │
 ▼
old content

Index
 │
 ▼
old content

Working Tree
 │
 ▼
new content
```

The change exists only in the working tree.

---

# 6. `git add`

Run:

```cmd
git add README.md
```

Now Git copies the current content of the file into the index.

Conceptually:

```text
Before:

HEAD      = old
Index     = old
Work Tree = new


After git add:

HEAD      = old
Index     = new
Work Tree = new
```

This is why staging is important.

You are deciding which version of the file belongs in the next commit.

---

# 7. Staged Changes

After:

```cmd
git add README.md
```

`git status` may show:

```text
Changes to be committed:
  modified: README.md
```

The state is:

```text
HEAD
 │
 └── old

Index
 │
 └── new

Working Tree
 │
 └── new
```

The index now contains the version that will be committed.

---

# 8. `git commit`

Run:

```cmd
git commit -m "Update README"
```

Git creates a new commit from the staged state.

Before:

```text
HEAD → Commit A

Index → New content
```

After:

```text
HEAD → Commit B
         │
         └── New content
```

Conceptually:

```text
Working Tree
     │
     ▼
Index
     │
     ▼
New Commit
     ▲
     │
    HEAD
```

---

# 9. The Index Is Between Working Tree and Commit

A very useful mental model:

```text
           You edit
              │
              ▼
       ┌──────────────┐
       │ Working Tree │
       └──────┬───────┘
              │
           git add
              │
              ▼
       ┌──────────────┐
       │    Index     │
       └──────┬───────┘
              │
          git commit
              │
              ▼
       ┌──────────────┐
       │   Commit     │
       └──────────────┘
```

This is the fundamental Git workflow.

---

# 10. Why Does Git Have a Staging Area?

The staging area allows you to construct a commit deliberately.

Suppose you modify:

```text
src/login.js
src/database.js
README.md
```

You can stage only:

```cmd
git add src/login.js
```

Then commit:

```cmd
git commit -m "Fix login validation"
```

The commit contains only the staged change.

The other modifications remain in the working tree.

---

# 11. Partial Staging

Suppose one file contains two logical changes:

```text
src/app.js
```

Change A:

```text
Fix authentication
```

Change B:

```text
Add debug logging
```

You can interactively stage only part of the changes:

```cmd
git add -p
```

Git presents individual hunks.

You can choose which hunks enter the index.

Conceptually:

```text
Working Tree
│
├── Change A
└── Change B
      │
      │ git add -p
      ▼
Index
│
└── Change A

Commit
│
└── Change A
```

Change B remains unstaged.

---

# 12. `git add .`

You can stage many changes with:

```cmd
git add .
```

This stages applicable changes under the current directory.

Be careful with broad staging commands because the index determines the contents of your next commit.

Always inspect:

```cmd
git status
```

and preferably:

```cmd
git diff --cached
```

before committing.

---

# 13. `git add -A`

Another common command:

```cmd
git add -A
```

This stages additions, modifications, and deletions across the repository scope.

Example:

```text
modified: file-a.js
deleted:  file-b.js
new file: file-c.js
```

After:

```cmd
git add -A
```

all applicable changes are staged.

---

# 14. `git add -u`

Use:

```cmd
git add -u
```

to stage modifications and deletions of tracked files.

It does not normally stage new untracked files.

Example:

```text
modified tracked file → staged
deleted tracked file  → staged
new untracked file    → not staged
```

---

# 15. Working Tree vs Index

This is one of the most important comparisons.

Use:

```cmd
git diff
```

to see changes in the working tree that are **not staged**.

Conceptually:

```text
Index
  │
  │ compare
  ▼
Working Tree
```

So:

```cmd
git diff
```

answers:

> What have I changed but not staged?

---

# 16. Index vs HEAD

Use:

```cmd
git diff --cached
```

or:

```cmd
git diff --staged
```

to see staged changes.

Conceptually:

```text
HEAD
 │
 │ compare
 ▼
Index
```

It answers:

> What exactly will the next commit contain?

This is one of the most important commands to use before committing.

---

# 17. All Working Changes

You can compare the working tree against `HEAD`:

```cmd
git diff HEAD
```

This shows the combined difference between:

```text
HEAD
```

and:

```text
Working Tree
```

regardless of whether individual changes are staged.

Conceptually:

```text
HEAD
 │
 │ compare
 ▼
Working Tree
```

---

# 18. The Three-Way Comparison

You can think about Git's state using three snapshots:

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

There are three important comparisons:

```text
git diff
```

means:

```text
Index ↔ Working Tree
```

---

```text
git diff --cached
```

means:

```text
HEAD ↔ Index
```

---

```text
git diff HEAD
```

means:

```text
HEAD ↔ Working Tree
```

Memorize this.

---

# 19. Staging Does Not Create a Commit

Running:

```cmd
git add file.js
```

does **not** create history.

It only changes the index.

```text
git add
    │
    ▼
Index changes
```

History changes only when:

```cmd
git commit
```

creates a new commit.

---

# 20. Commit Does Not Commit Every Working-Tree Change

Suppose:

```text
file.js → staged change
app.js  → unstaged change
```

Then:

```cmd
git commit -m "Update file"
```

commits the staged version only.

The unstaged change remains in the working tree.

```text
Commit
└── file.js

Working Tree
└── app.js modified
```

This is a critical Git behavior.

---

# 21. Example: Two Files

Initial state:

```text
HEAD:
A.js = version 1
B.js = version 1

Index:
A.js = version 1
B.js = version 1

Working Tree:
A.js = version 1
B.js = version 1
```

Modify both:

```text
A.js = version 2
B.js = version 2
```

Now:

```text
HEAD:
A.js = v1
B.js = v1

Index:
A.js = v1
B.js = v1

Working Tree:
A.js = v2
B.js = v2
```

Stage only `A.js`:

```cmd
git add A.js
```

Now:

```text
HEAD:
A.js = v1
B.js = v1

Index:
A.js = v2
B.js = v1

Working Tree:
A.js = v2
B.js = v2
```

Commit:

```cmd
git commit -m "Update A"
```

Result:

```text
New Commit:
A.js = v2
B.js = v1

Working Tree:
A.js = v2
B.js = v2
```

The modification to `B.js` remains unstaged.

---

# 22. Staging an Updated File Twice

Suppose:

```cmd
git add app.js
```

Then you modify `app.js` again.

Now:

```text
HEAD      = version 1
Index     = version 2
Work Tree = version 3
```

This is a very important state.

The next commit will contain:

```text
version 2
```

not:

```text
version 3
```

because the index contains version 2.

To stage the latest version:

```cmd
git add app.js
```

Now:

```text
HEAD      = version 1
Index     = version 3
Work Tree = version 3
```

---

# 23. `git restore` and the Working Tree

Git provides:

```cmd
git restore <file>
```

to restore working-tree content.

For example:

```cmd
git restore app.js
```

can discard unstaged working-tree changes to the file by restoring it from the index.

Conceptually:

```text
Index
  │
  │ restore
  ▼
Working Tree
```

Be careful:

> Restoring a file can discard uncommitted working-tree changes.

---

# 24. Unstage a File

To remove a file's staged changes from the index while keeping the working-tree changes:

```cmd
git restore --staged app.js
```

Conceptually:

```text
Before:

HEAD      = old
Index     = new
Work Tree = new


After:

HEAD      = old
Index     = old
Work Tree = new
```

The modification is no longer staged, but it is not lost.

---

# 25. `git restore --staged`

This command is fundamentally about:

```text
Index → HEAD
```

for the selected path.

It changes the index while preserving the working-tree content.

Example:

```cmd
git restore --staged README.md
```

Result:

```text
HEAD      = old
Index     = old
Work Tree = new
```

So the change becomes unstaged.

---

# 26. `git reset HEAD <file>`

Older Git workflows commonly use:

```cmd
git reset HEAD <file>
```

to unstage a file.

Modern Git provides the clearer:

```cmd
git restore --staged <file>
```

For learning the underlying model, remember:

```text
unstage
=
change the index
```

---

# 27. Intent-to-Add

Git has an advanced staging concept:

```cmd
git add -N <file>
```

or:

```cmd
git add --intent-to-add <file>
```

This records intent to add a path without staging its full content in the normal way.

This can be useful when you want the path to participate in certain diff/status workflows before its content is fully staged.

It is an advanced index feature.

---

# 28. Index as a Snapshot

The index can be thought of as a proposed snapshot.

Suppose:

```text
HEAD snapshot
```

contains:

```text
A.js
B.js
C.js
```

You modify:

```text
A.js
B.js
```

and stage only `A.js`.

The index represents:

```text
A.js → new
B.js → old
C.js → old
```

Therefore the next commit will be:

```text
A.js → new
B.js → old
C.js → old
```

This is why staging enables precise commits.

---

# 29. The Index Is Not a Commit

The index is similar to a snapshot but it is **not itself a commit**.

A commit contains metadata and points to a tree representing the committed snapshot.

The index is a mutable area used to construct the next tree.

Conceptually:

```text
Index
  │
  │ git commit
  ▼
Tree
  │
  ▼
Commit
```

---

# 30. The Index Is Not a Patch Queue

The staging area is often incorrectly described as:

```text
"list of changes"
```

A more accurate model is:

```text
index = proposed next snapshot
```

It can contain a mixture of:

```text
unchanged paths
modified paths
added paths
deleted paths
```

The index represents what the next commit should contain.

---

# 31. Index File

In a standard repository, the index is commonly stored at:

```text
.git/index
```

It is a binary Git-managed file.

Do not manually edit it.

Use Git commands:

```cmd
git add
git restore --staged
git reset
```

to manipulate the index.

---

# 32. Inspecting the Index

An advanced diagnostic command is:

```cmd
git ls-files
```

This lists paths tracked through the index.

For more detailed information:

```cmd
git ls-files --stage
```

You may see output conceptually similar to:

```text
100644 <object-id> 0    README.md
100644 <object-id> 0    src/app.js
```

The fields contain index-related information such as:

```text
mode
object ID
stage
path
```

---

# 33. Index Stages

The index normally uses stage:

```text
0
```

for the ordinary resolved entry.

During certain merge-conflict states, the index can temporarily contain multiple stages:

```text
stage 1 → common ancestor
stage 2 → ours
stage 3 → theirs
```

Conceptually:

```text
Index
│
├── stage 1 → base
├── stage 2 → ours
└── stage 3 → theirs
```

This is an advanced mechanism used during unresolved merges.

After resolving the conflict and staging the resolved file, the normal stage-0 entry is established.

---

# 34. Why Merge Conflicts Affect the Index

During a conflicting merge, Git needs to represent multiple versions of a path.

Therefore the index can temporarily represent:

```text
base
ours
theirs
```

instead of only one resolved version.

This is why:

```cmd
git ls-files --stage
```

can be extremely useful for diagnosing merge conflicts.

---

# 35. `git status` Is a Comparison Tool

`git status` is effectively summarizing differences between:

```text
HEAD
Index
Working Tree
```

For example:

```text
Changes to be committed
```

means:

```text
HEAD ≠ Index
```

while:

```text
Changes not staged for commit
```

means:

```text
Index ≠ Working Tree
```

This is a powerful way to understand the output instead of memorizing it.

---

# 36. Status State Matrix

The common states can be modeled as:

```text
HEAD = Index = Working Tree
```

Result:

```text
clean
```

---

```text
HEAD = Index ≠ Working Tree
```

Result:

```text
unstaged changes
```

---

```text
HEAD ≠ Index = Working Tree
```

Result:

```text
staged changes
```

---

```text
HEAD ≠ Index ≠ Working Tree
```

Result:

```text
both staged and unstaged changes
```

This model explains a large portion of everyday Git behavior.

---

# 37. Untracked Files

An untracked file is different from a modified tracked file.

Suppose:

```text
new-file.js
```

does not exist in `HEAD` and has not been added to the index.

Git reports:

```text
Untracked files:
  new-file.js
```

Conceptually:

```text
HEAD
 └── no entry

Index
 └── no entry

Working Tree
 └── new-file.js
```

After:

```cmd
git add new-file.js
```

the file becomes staged:

```text
HEAD
 └── no entry

Index
 └── new-file.js

Working Tree
 └── new-file.js
```

---

# 38. Deleted Files

Suppose a tracked file exists in:

```text
HEAD
```

but you delete it from the working tree.

Before staging:

```text
HEAD
 └── file.js

Index
 └── file.js

Working Tree
 └── deleted
```

Git reports the deletion as unstaged.

Run:

```cmd
git add -u
```

or:

```cmd
git add file.js
```

and the deletion enters the index.

Then:

```text
HEAD
 └── file.js

Index
 └── deleted

Working Tree
 └── deleted
```

The deletion will be included in the next commit.

---

# 39. Rename Detection

Git does not fundamentally require a special "rename object."

A rename can be represented through changes to paths and content.

Git can detect renames heuristically when comparing trees.

For example:

```text
old.js → removed
new.js → added
```

may be displayed as:

```text
renamed: old.js -> new.js
```

depending on similarity detection.

This is relevant when thinking about what the index and commits actually store.

---

# 40. File Mode Changes

Git can track certain filesystem metadata such as executable mode.

For example:

```text
100644
```

commonly represents a normal non-executable file.

```text
100755
```

commonly represents an executable file.

The index records mode information alongside path/object information.

---

# 41. Content vs File System

Git primarily tracks file content and selected metadata.

The working tree is an actual filesystem.

The index is Git's structured representation of the next snapshot.

The commit stores the committed snapshot.

Therefore:

```text
Filesystem
     │
     ▼
Working Tree
     │
     ▼
Index
     │
     ▼
Tree
     │
     ▼
Commit
```

---

# 42. The Object Model Behind Staging

When content is staged, Git can create/store objects representing file contents.

A file's content is represented by a **blob object**.

Directories are represented by **tree objects**.

Commits reference trees.

Conceptually:

```text
Working Tree
     │
     │ git add
     ▼
Blob Objects
     │
     ▼
Index
     │
     │ git commit
     ▼
Tree
     │
     ▼
Commit
```

The exact internal mechanics involve Git's object database and index processing.

---

# 43. Why `git add` Can Be Thought of as Preparing a Tree

A commit points to a tree representing the repository snapshot.

The index is effectively preparing that snapshot.

For example:

```text
Index:

src/app.js     → blob A
src/db.js      → blob B
README.md      → blob C
```

Git can construct a tree from these entries when creating the commit.

Then:

```text
Commit
  │
  ▼
Tree
  ├── src/
  │    ├── app.js → blob A
  │    └── db.js  → blob B
  │
  └── README.md → blob C
```

---

# 44. `git diff --cached` Is a Commit Preview

A very strong professional habit is:

```cmd
git diff --cached
```

before:

```cmd
git commit
```

It lets you inspect the difference between:

```text
HEAD
```

and:

```text
Index
```

In other words:

```text
"What am I about to commit?"
```

---

# 45. Recommended Commit Workflow

A precise workflow:

```cmd
git status
```

Inspect unstaged changes:

```cmd
git diff
```

Stage intentional changes:

```cmd
git add <files>
```

Inspect staged changes:

```cmd
git diff --cached
```

Commit:

```cmd
git commit -m "Meaningful message"
```

Check final state:

```cmd
git status
```

This workflow prevents many accidental commits.

---

# 46. Advanced Partial Commit Workflow

Suppose one file contains multiple logical changes.

Use:

```cmd
git add -p
```

Review:

```cmd
git diff --cached
```

Commit:

```cmd
git commit -m "Fix authentication"
```

Then inspect remaining work:

```cmd
git diff
```

This lets one working-tree state produce multiple focused commits.

---

# 47. Staging and Commit Quality

A staging area enables:

```text
small commits
focused commits
reviewable commits
logical commits
```

Instead of:

```text
"Everything I changed today"
```

you can create:

```text
Commit 1 → Fix authentication
Commit 2 → Add validation
Commit 3 → Update documentation
```

even if all changes were made in the same working session.

---

# 48. Working Tree Can Be Ahead of HEAD

A working tree may contain changes that are not committed:

```text
HEAD
 │
 ▼
Commit A

Working Tree
 │
 └── additional changes
```

This is normal.

Git is designed to allow uncommitted work.

---

# 49. Index Can Be Ahead of HEAD

The index can also contain staged changes:

```text
HEAD
 │
 ▼
Commit A
 │
 │ staged changes
 ▼
Index
```

This means you have prepared the next commit but have not created it yet.

---

# 50. Working Tree Can Be Ahead of Index

After staging a file and then modifying it again:

```text
HEAD
 │
 ▼
version 1

Index
 │
 ▼
version 2

Working Tree
 │
 ▼
version 3
```

This is one of the most important advanced states to understand.

The next commit contains:

```text
version 2
```

unless you stage version 3.

---

# 51. `git commit -a`

Git provides:

```cmd
git commit -a -m "message"
```

or:

```cmd
git commit -am "message"
```

This automatically stages modifications and deletions of **already tracked files** and commits them.

It does not normally include new untracked files.

Therefore:

```text
tracked modified files → included
tracked deleted files  → included
untracked files        → not included
```

This command is convenient but can bypass deliberate staging.

---

# 52. `git commit <path>` and Modern Workflows

Git has commands and options that can create commits from specified paths, but these behaviors can be subtle.

For predictable professional workflows, understand the index first.

The safest mental model remains:

```text
Working Tree
     ↓
Index
     ↓
Commit
```

Control the index explicitly when you need precise commit boundaries.

---

# 53. Staging Is Repository-Local

The index belongs to your local repository/worktree state.

It is not uploaded to GitHub as an independent staging area.

For example:

```text
Your Computer
│
├── Working Tree
├── Index
└── Local Repository
        │
        │ git push
        ▼
      Remote
```

The remote receives Git objects and references as part of Git operations.

The local staging state itself is not a shared GitHub staging area.

---

# 54. GitHub Has Its Own UI Concepts

Do not confuse:

```text
Git staging area
```

with:

```text
GitHub staging/deployment concepts
```

Git's index is a local Git repository mechanism.

GitHub provides separate collaboration and hosting features.

---

# 55. Staging Does Not Mean Uploading

Another common misconception:

```text
git add
```

does **not** upload anything.

It changes the local index.

Uploading to a remote is associated with:

```cmd
git push
```

So:

```text
git add
    ↓
local index

git commit
    ↓
local history

git push
    ↓
remote repository
```

---

# 56. Staging Does Not Mean Saving to History

Another distinction:

```text
git add
```

means:

```text
prepare next snapshot
```

while:

```text
git commit
```

means:

```text
create a new history object
```

Therefore:

```text
add ≠ commit
commit ≠ push
```

---

# 57. Complete Lifecycle of a File

A new file may move through these states:

```text
Not present
    │
    ▼
Untracked
    │
    │ git add
    ▼
Staged
    │
    │ git commit
    ▼
Committed
    │
    │ edit
    ▼
Modified
    │
    │ git add
    ▼
Staged modification
    │
    │ git commit
    ▼
New committed version
```

This state machine is fundamental Git knowledge.

---

# 58. File State Matrix

A useful simplified model:

```text
                         Working Tree
                              │
                 ┌────────────┴────────────┐
                 │                         │
               same                     different
                 │                         │
                 ▼                         ▼
              Index                    modified
                 │
       ┌─────────┴─────────┐
       │                   │
      same              different
       │                   │
       ▼                   ▼
     clean               staged
```

For new files, the state also includes:

```text
untracked
```

---

# 59. Advanced Diagnostic Commands

Inspect unstaged changes:

```cmd
git diff
```

Inspect staged changes:

```cmd
git diff --cached
```

Inspect everything relative to `HEAD`:

```cmd
git diff HEAD
```

Inspect index entries:

```cmd
git ls-files --stage
```

Inspect status in machine-friendly form:

```cmd
git status --short
```

Inspect repository state:

```cmd
git status
```

---

# 60. Short Status Format

Run:

```cmd
git status --short
```

Example:

```text
 M app.js
M  server.js
A  login.js
?? debug.log
```

The two columns represent different states.

Conceptually:

```text
XY path
```

where:

```text
X = index/staging state
Y = working-tree state
```

Examples:

```text
 M file.js
```

means modified in working tree but not staged.

```text
M  file.js
```

means modified in index but working tree matches the index.

```text
MM file.js
```

means staged and then modified again.

```text
?? file.js
```

means untracked.

---

# 61. The `MM` State

This is especially important:

```text
MM app.js
```

It means:

```text
HEAD
 │
 └── version 1

Index
 │
 └── version 2

Working Tree
 │
 └── version 3
```

The first `M`:

```text
HEAD → Index
```

The second `M`:

```text
Index → Working Tree
```

This directly demonstrates the three-state model.

---

# 62. Removing a File From the Index

Suppose:

```text
file.js
```

is staged for deletion.

You can inspect:

```cmd
git status
```

If you want to unstage the deletion:

```cmd
git restore --staged file.js
```

The file's index state is restored toward `HEAD`.

The exact working-tree result depends on the operation and current state, so always inspect:

```cmd
git status
```

after destructive or state-changing commands.

---

# 63. Restoring Both Index and Working Tree

Git provides powerful restore operations.

For example:

```cmd
git restore --source=HEAD --staged --worktree file.js
```

This tells Git to restore the path from `HEAD` into both:

```text
Index
Working Tree
```

Conceptually:

```text
HEAD
 │
 ├──→ Index
 │
 └──→ Working Tree
```

This can discard both staged and unstaged changes for that path.

Use carefully.

---

# 64. `git checkout` Historical Behavior

Older Git workflows frequently used:

```cmd
git checkout -- file.js
```

for restoring working-tree files.

Modern Git separates responsibilities more clearly:

```cmd
git restore
git switch
```

For file restoration, prefer:

```cmd
git restore
```

For branch switching, prefer:

```cmd
git switch
```

This makes the operation's intent clearer.

---

# 65. Why `git restore --staged` Is Safer to Understand

Instead of thinking:

```text
"undo add"
```

think:

```text
"change the index so it matches the chosen source"
```

For:

```cmd
git restore --staged file.js
```

the common source is `HEAD`.

Therefore:

```text
HEAD
 ↓
Index
```

while the working tree remains as-is.

This is the correct mental model.

---

# 66. Advanced Concept: Index and Multiple Worktrees

When using:

```cmd
git worktree
```

Git can maintain per-working-tree administrative state.

Some repository data is shared while some state is specific to an individual worktree.

Conceptually:

```text
Shared Repository
│
├── Object Database
├── References
└── Shared data
      │
      ├── Worktree A
      │    └── working-tree-specific state
      │
      └── Worktree B
           └── working-tree-specific state
```

This matters when studying Git internals and advanced repository layouts.

---

# 67. Advanced Concept: Sparse Checkout

Git can configure a working tree to materialize only selected paths.

This is associated with:

```cmd
git sparse-checkout
```

The repository can contain much more history and content than what is currently materialized in the working tree.

Therefore:

```text
Repository contents
        ≠
Working-tree files currently materialized
```

This is an advanced distinction.

---

# 68. Working Tree Is Not the Repository

A common mistake is:

```text
"Everything in my project folder is the Git repository."
```

More accurately:

```text
Working Tree
+
Git administrative data
=
Git working repository
```

In a normal repository:

```text
project/
├── source files
├── configuration files
└── .git/
```

The source files are the working tree.

`.git` contains repository metadata.

---

# 69. Commit Is Not the Working Tree

After a commit:

```text
Commit A
```

the working tree may still be modified afterward.

Example:

```text
Commit A
   │
   └── application.js = version 1

Working Tree
   │
   └── application.js = version 2
```

The commit remains unchanged.

Editing a file does not rewrite an existing commit.

Git history is immutable in normal operation; operations such as rebase can create replacement history rather than mutating existing commit objects.

---

# 70. Commit Is Not the Index

The index is mutable.

A commit is a historical object.

You can repeatedly do:

```cmd
git add
```

and change the index without changing existing commits.

Example:

```text
Commit A
   │
   ▼
Index version 1
   │
   ▼
Index version 2
   │
   ▼
Index version 3
```

Only when you commit does a new commit get created.

---

# 71. Professional Mental Model

Always ask three questions:

### 1. What is committed?

```cmd
git show HEAD
```

### 2. What is staged?

```cmd
git diff --cached
```

### 3. What is unstaged?

```cmd
git diff
```

Together:

```text
HEAD
 │
 ├── git diff --cached ──→ Index
 │
 └── git diff ───────────→ Working Tree
```

This gives you complete visibility into the common Git state.

---

# 72. Master Diagram

```text
                         LOCAL GIT REPOSITORY
┌───────────────────────────────────────────────────────────┐
│                                                           │
│                       HEAD                                │
│                        │                                  │
│                        ▼                                  │
│                    Commit A                               │
│                        │                                  │
│                        │ compare                          │
│                        ▼                                  │
│                  INDEX / STAGING AREA                     │
│                        │                                  │
│                        │ compare                          │
│                        ▼                                  │
│                   WORKING TREE                            │
│                                                           │
└───────────────────────────────────────────────────────────┘


Working Tree
     │
     │ git add
     ▼
Index
     │
     │ git commit
     ▼
Commit
     │
     │ git push
     ▼
Remote Repository
```

---

# 73. Essential Commands

### Inspect state

```cmd
git status
git status --short
```

### Inspect unstaged changes

```cmd
git diff
```

### Stage

```cmd
git add <file>
git add .
git add -A
git add -u
git add -p
```

### Inspect staged changes

```cmd
git diff --cached
git diff --staged
```

### Commit

```cmd
git commit -m "message"
```

### Unstage

```cmd
git restore --staged <file>
```

### Restore working tree

```cmd
git restore <file>
```

### Inspect index

```cmd
git ls-files
git ls-files --stage
```

### Compare everything to HEAD

```cmd
git diff HEAD
```

---

# 74. The Three Commands to Memorize

If you remember only three commands from this file:

```cmd
git diff
```

means:

```text
What changed in the Working Tree
that is not staged?
```

```cmd
git diff --cached
```

means:

```text
What is staged for the next commit?
```

```cmd
git diff HEAD
```

means:

```text
What differs between my current Working Tree
and the current commit?
```

---

# 75. Final Mental Model

The most important Git model is:

```text
                 HEAD
                  │
                  ▼
             Current Commit
                  │
                  │
             git commit
                  ▲
                  │
                INDEX
                  ▲
                  │
               git add
                  ▲
                  │
            WORKING TREE
```

Or as state comparisons:

```text
HEAD
 │
 │ git diff --cached
 ▼
INDEX
 │
 │ git diff
 ▼
WORKING TREE
```

And:

```text
git diff HEAD
```

compares:

```text
HEAD ↔ Working Tree
```

The staging area exists so you can **construct the exact snapshot you want to commit**.

That is the core reason Git's workflow is:

```text
EDIT
  ↓
STAGE
  ↓
REVIEW
  ↓
COMMIT
```

and not simply:

```text
EDIT
  ↓
COMMIT EVERYTHING
```

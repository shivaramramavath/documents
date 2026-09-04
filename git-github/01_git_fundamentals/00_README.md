# Git Fundamentals

This section builds the actual Git mental model.

Do not treat Git as merely:

```text
git add
git commit
git push
```

Git is a **content-addressable version-control system** built around objects, references, snapshots, and a staging index.

To use advanced Git correctly, you need to understand what Git is actually storing and how commands move information between its different states.

---

# 1. What Git Actually Tracks

Git primarily tracks **content snapshots**.

A useful simplified model is:

```text
Working Tree
     │
     │ git add
     ▼
   Index
     │
     │ git commit
     ▼
 Commit / Repository
```

The working tree contains the files you are currently editing.

The index contains the exact content selected for the next commit.

The repository stores Git objects representing committed history and other data.

---

# 2. The Three Main States

Git work is easiest to understand through three states:

```text
┌───────────────────┐
│   Working Tree    │
│                   │
│ Files you edit    │
└─────────┬─────────┘
          │
       git add
          │
          ▼
┌───────────────────┐
│       Index       │
│                   │
│ Next commit       │
│ snapshot          │
└─────────┬─────────┘
          │
       git commit
          │
          ▼
┌───────────────────┐
│    Repository     │
│                   │
│ Committed history │
└───────────────────┘
```

This is the most important model in Git fundamentals.

---

# 3. Working Tree

The working tree is the collection of files you currently have checked out.

Example:

```text
project/
├── src/
│   ├── app.js
│   └── server.js
├── package.json
└── README.md
```

When you edit:

```text
src/app.js
```

you are changing the working tree.

Git does not automatically create a new commit.

Check the state:

```powershell
git status
```

---

# 4. Index

The index is also called the:

```text
Staging Area
```

It is not simply a temporary list of filenames.

It represents the content that Git will use to construct the next commit.

Example:

```text
Working Tree:

app.js        modified
server.js     modified
README.md     modified
```

You can stage only one:

```powershell
git add app.js
```

Now:

```text
Working Tree
├── app.js       modified + staged
├── server.js    modified
└── README.md    modified
```

The next commit can contain only `app.js`.

This is why the index is a fundamental Git feature.

---

# 5. Repository

The repository is stored in:

```text
.git/
```

It contains Git's internal data.

Conceptually:

```text
.git/
├── objects/
├── refs/
├── HEAD
├── index
└── config
```

The exact internal structure can vary with Git features and repository configuration, but these concepts are fundamental.

---

# 6. `.git`

A normal repository:

```text
project/
├── .git/
├── src/
├── package.json
└── README.md
```

`.git` contains the repository's metadata and object database.

Do not manually modify files inside `.git` unless you understand Git internals and the consequences.

Inspect repository information through Git commands instead:

```powershell
git status
git rev-parse --git-dir
git rev-parse --show-toplevel
```

---

# 7. Git Is Not a File-Difference Database

A common misconception is:

```text
Git
=
database of changes between files
```

A better mental model is:

```text
Git
=
database of objects representing content and history
```

Commits point to trees.

Trees point to blobs and other trees.

Commits also point to parent commits.

Conceptually:

```text
Commit
   │
   ├── tree
   │     ├── blob
   │     ├── blob
   │     └── tree
   │
   └── parent
```

This is the foundation of Git's object model.

---

# 8. Git Objects

Git has four fundamental object types:

```text
blob
tree
commit
tag
```

These objects are stored in the repository's object database.

---

# 9. Blob

A blob stores file content.

Conceptually:

```text
file content
     │
     ▼
   blob
```

A blob does not fundamentally store:

```text
filename
permissions
directory path
```

It stores content.

The filename and path are represented by tree entries.

---

# 10. Tree

A tree represents a directory-like structure.

It maps names to objects.

Conceptually:

```text
tree
├── README.md → blob
├── app.js    → blob
└── src        → tree
                 ├── server.js → blob
                 └── db.js     → blob
```

Therefore:

```text
Tree
=
directory structure + references to objects
```

---

# 11. Commit

A commit represents a project snapshot plus metadata.

A simplified commit contains:

```text
tree
parent
author
committer
message
```

Conceptually:

```text
Commit
├── tree
├── parent
├── author
├── committer
└── message
```

A commit points to a tree representing the project's state.

---

# 12. Commit History

Commits normally point backward to their parent commits.

Example:

```text
A ← B ← C ← D
```

Where:

```text
D
│
└── parent → C

C
│
└── parent → B

B
│
└── parent → A
```

The latest commit can therefore lead backward through the history.

---

# 13. Branches Are Not Containers

A branch is not a directory.

A branch is not a copy of your project.

A branch is essentially a **reference to a commit**.

Example:

```text
A ← B ← C
        ↑
       main
```

The branch:

```text
main
```

points to:

```text
C
```

If a new commit is created:

```text
A ← B ← C ← D
            ↑
           main
```

The branch moves from `C` to `D`.

---

# 14. Multiple Branches

Example:

```text
A ← B ← C
        │
        ├── main
        │
        └── feature
```

Both branches can point to the same commit.

After development:

```text
        D ← E
       /
A ← B ← C
       \
        F ← G
```

The references identify different tips.

```text
main    → E
feature → G
```

---

# 15. HEAD

`HEAD` identifies your current checkout position.

Normally:

```text
HEAD
 │
 ▼
main
 │
 ▼
commit
```

You can inspect it:

```powershell
git symbolic-ref HEAD
```

or:

```powershell
git rev-parse HEAD
```

---

# 16. HEAD Is Usually Symbolic

When you are on:

```text
main
```

the relationship is approximately:

```text
HEAD
 │
 ▼
refs/heads/main
 │
 ▼
commit
```

This means `HEAD` normally points to the current branch reference.

---

# 17. Detached HEAD

You can also have:

```text
HEAD
 │
 ▼
commit
```

without:

```text
HEAD → branch
```

This is called:

```text
Detached HEAD
```

For example:

```powershell
git switch --detach <commit>
```

Now:

```text
HEAD
 │
 ▼
C

main
 │
 ▼
D
```

Your `HEAD` is at `C`, but `main` remains at `D`.

Detached HEAD is useful for:

- Inspecting old versions
- Testing historical commits
- Temporary experimentation
- Advanced repository operations

---

# 18. Snapshot Model

Suppose your project has:

```text
app.js
db.js
README.md
```

Commit 1 contains:

```text
app.js  → version A
db.js   → version A
README  → version A
```

After modifying `app.js`, Commit 2 represents:

```text
app.js  → version B
db.js   → version A
README  → version A
```

Git's object model can reuse unchanged objects.

Conceptually:

```text
Commit 1
   │
   └── Tree 1
       ├── app.js → Blob A
       ├── db.js  → Blob B
       └── README → Blob C


Commit 2
   │
   └── Tree 2
       ├── app.js → Blob D
       ├── db.js  → Blob B
       └── README → Blob C
```

Notice:

```text
Blob B
Blob C
```

can be reused.

This is one reason Git can efficiently store history.

---

# 19. Content Addressing

Git identifies objects using hashes.

Conceptually:

```text
content
   │
   ▼
hash
   │
   ▼
object ID
```

Therefore an object is addressed by its content-derived identity.

You can inspect an object's type:

```powershell
git cat-file -t <object>
```

Inspect its contents:

```powershell
git cat-file -p <object>
```

---

# 20. Object ID

A Git object has an object ID.

Example:

```text
a13f8d2...
```

The full identifier is much longer.

You can refer to objects using an unambiguous abbreviation in many commands:

```powershell
git show a13f8d2
```

Git resolves the abbreviation if it uniquely identifies an object.

---

# 21. SHA-1 and SHA-256

Historically, Git repositories commonly use SHA-1 object IDs.

Git also supports SHA-256 repositories.

Therefore, do not build your mental model around:

```text
Git always uses SHA-1
```

The more important concept is:

```text
Git objects
      ↓
content-addressed identifiers
```

The exact hash algorithm is repository-dependent.

---

# 22. The Index Is a Snapshot

Suppose:

```text
HEAD
 │
 ▼
Commit A
```

You modify:

```text
app.js
```

Now:

```text
HEAD
 │
 ▼
Commit A

Working Tree
 │
 └── app.js modified
```

After:

```powershell
git add app.js
```

the index contains the new version:

```text
HEAD
 │
 ▼
Commit A

Index
 │
 └── app.js version B

Working Tree
 │
 └── app.js version B
```

The index is therefore a proposed next snapshot.

---

# 23. Staged and Unstaged Changes Can Coexist

This is a very important Git concept.

Suppose you do:

```text
Edit app.js
   ↓
git add app.js
   ↓
Edit app.js again
```

Now:

```text
Working Tree
    │
    └── version C

Index
    │
    └── version B

HEAD
    │
    └── version A
```

Therefore:

```text
HEAD → A
Index → B
Working Tree → C
```

This explains why:

```powershell
git diff
```

and:

```powershell
git diff --cached
```

can show different changes for the same file.

---

# 24. `git diff` Three-State Model

Think of Git as:

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

Therefore:

```text
git diff
```

means:

```text
Working Tree
      vs
Index
```

while:

```text
git diff --cached
```

means:

```text
Index
      vs
HEAD
```

This model should become automatic.

---

# 25. `git diff HEAD`

This compares your current working-tree/index state against `HEAD`.

Use:

```powershell
git diff HEAD
```

It is useful when you want to inspect the total change relative to the last commit.

---

# 26. What `git commit` Actually Does

When you execute:

```powershell
git commit
```

Git takes the staged state from the index and creates a new commit.

Conceptually:

```text
Index
  │
  │ create snapshot
  ▼
Tree
  │
  ▼
Commit
  │
  ▼
Current branch moves forward
```

The working tree is not itself committed directly.

The index determines the next snapshot.

---

# 27. Commit Does Not Mean "Save File"

Your editor already saves files to the filesystem.

Git commit means:

```text
Record the staged project state as a new Git commit.
```

Therefore:

```text
Save file
    ≠
Git commit
```

---

# 28. Commit Graph

Git history is better represented as a graph than a simple list.

A simple history:

```text
A ← B ← C
```

A branch:

```text
      D
     /
A ← B ← C
```

A merge:

```text
      D ── E
     /      \
A ← B        F
     \      /
      C ──
```

The commit graph can contain:

- Linear history
- Branches
- Merge commits
- Multiple parents

---

# 29. Merge Commit

A normal commit has one parent:

```text
Commit C
   │
   └── parent → B
```

A merge commit can have two or more parents.

Example:

```text
A ← B ← D
     \   /
      C ←
```

Conceptually:

```text
D
├── parent 1 → B
└── parent 2 → C
```

This is why Git can represent branch convergence.

---

# 30. Fast-Forward

Suppose:

```text
A ← B ← C
        ↑
       main
```

Another branch has advanced:

```text
A ← B ← C ← D ← E
                  ↑
               feature
```

If `main` has no unique commits, Git can simply move the `main` reference:

```text
A ← B ← C ← D ← E
                  ↑
          main + feature
```

No merge commit is required.

This is:

```text
Fast-forward
```

---

# 31. Non-Fast-Forward History

Suppose:

```text
      C ← D
     /     \
A ← B       ?
     \
      E ← F
```

Both branches contain unique commits.

Git cannot simply move one branch reference forward.

Integration requires an operation such as:

```text
merge
```

or:

```text
rebase
```

depending on the desired history.

---

# 32. Remote-Tracking Branches

A remote-tracking branch is a local reference representing the last known state of a branch on a remote.

Example:

```text
origin/main
```

Conceptually:

```text
Remote
   │
   │ fetch
   ▼
origin/main
```

It does not mean the remote branch itself exists locally.

It is your local record of the remote branch's known state.

---

# 33. Local Branch vs Remote-Tracking Branch

These are different:

```text
main
```

is normally a local branch.

```text
origin/main
```

is a remote-tracking reference.

Example:

```text
main
   ↓
C

origin/main
   ↓
B
```

This means your local branch has advanced beyond the last fetched remote state.

---

# 34. Upstream Branch

A local branch can track an upstream branch.

Example:

```text
main
 │
 └── upstream → origin/main
```

This relationship helps Git determine defaults for operations such as:

```powershell
git pull
git push
```

Inspect tracking information:

```powershell
git branch -vv
```

---

# 35. References

Git references are names pointing to objects.

Examples:

```text
HEAD
refs/heads/main
refs/heads/feature
refs/remotes/origin/main
refs/tags/v1.0.0
```

Conceptually:

```text
Reference
    │
    ▼
Object
```

This is the foundation of branches and tags.

---

# 36. `refs/heads`

Local branches are stored conceptually under:

```text
refs/heads/
```

For example:

```text
refs/heads/main
refs/heads/develop
refs/heads/feature-auth
```

Therefore:

```text
main
```

is shorthand for:

```text
refs/heads/main
```

in many Git contexts.

---

# 37. `refs/remotes`

Remote-tracking references are under:

```text
refs/remotes/
```

For example:

```text
refs/remotes/origin/main
```

is normally displayed as:

```text
origin/main
```

---

# 38. Tags

Tags are also references.

Example:

```text
refs/tags/v1.0.0
```

A tag can point to a commit or another Git object depending on tag type.

Two common forms are:

```text
Lightweight tag
Annotated tag
```

Annotated tags are themselves Git tag objects containing metadata.

---

# 39. Repository State Model

A useful advanced model is:

```text
                   Repository
                       │
             ┌─────────┴─────────┐
             │                   │
          Objects             References
             │                   │
       ┌─────┼─────┐       ┌─────┼─────┐
       │     │     │       │     │     │
     blob  tree  commit    HEAD branch tag
```

The working tree and index interact with this object/reference system.

---

# 40. Git's Content Model

Think:

```text
File content
     │
     ▼
   Blob

Directory structure
     │
     ▼
   Tree

Project snapshot + metadata
     │
     ▼
  Commit

Named pointer
     │
     ▼
 Reference
```

This is the core Git object model.

---

# 41. Git Doesn't Store a Branch's Files Separately

Suppose:

```text
main
```

and:

```text
feature
```

point to different commits.

Git does not need:

```text
main-copy/
feature-copy/
```

Instead:

```text
main    → commit A
feature → commit B
```

The commits and trees determine the corresponding snapshots.

This is a fundamental difference from simplistic "branch = copy of directory" models.

---

# 42. Branch Creation Is Cheap

When you execute:

```powershell
git switch -c feature
```

Git does not need to duplicate the entire repository.

Conceptually it creates a reference:

```text
feature
   │
   ▼
current commit
```

That is why creating branches is generally cheap.

The expensive part can be the working-tree transition or later repository operations, not the creation of the reference itself.

---

# 43. Branch Movement

Suppose:

```text
A ← B ← C
        ↑
       main
```

You create a commit:

```text
A ← B ← C ← D
            ↑
           main
```

The branch reference moved:

```text
C
↓
D
```

The previous commits remain part of history.

---

# 44. `HEAD` + Branch + Commit

The complete normal checkout relationship:

```text
HEAD
 │
 ▼
refs/heads/main
 │
 ▼
Commit C
 │
 ▼
Tree
```

The working tree is populated from the selected commit.

The index tracks the state prepared for the next commit.

---

# 45. Checkout vs Switch

Older Git commonly used:

```powershell
git checkout
```

for multiple purposes.

Modern Git separates responsibilities:

```powershell
git switch
```

for branch switching.

```powershell
git restore
```

for restoring file content.

This makes intent clearer.

For example:

```powershell
git switch main
```

means:

```text
Change branch
```

while:

```powershell
git restore app.js
```

means:

```text
Restore file content
```

---

# 46. Tracking vs Untracked

A file can be:

```text
tracked
```

or:

```text
untracked
```

A tracked file is known to Git's index/history.

An untracked file exists in the working tree but is not currently tracked.

Example:

```text
?? notes.txt
```

from:

```powershell
git status --short
```

means:

```text
notes.txt
```

is untracked.

---

# 47. Ignored Files

A file can also be ignored through:

```text
.gitignore
```

Example:

```text
node_modules/
.env
dist/
```

Ignored files are not automatically staged by normal commands such as:

```powershell
git add .
```

depending on pathspec and force options.

Ignoring is different from tracking.

A file that is already tracked is generally not made untracked merely by adding it to `.gitignore`.

---

# 48. `.gitignore` Does Not Delete Files

Adding:

```text
.env
```

to:

```text
.gitignore
```

does not delete `.env`.

It tells Git to ignore matching untracked paths.

If `.env` is already tracked, additional steps are required to stop tracking it.

---

# 49. Git Status as State Analysis

When Git says:

```text
modified
```

it means the working tree differs from the relevant index state.

When Git says:

```text
changes to be committed
```

it means the index differs from `HEAD`.

This follows directly from the three-state model:

```text
HEAD
 │
 ▼
INDEX
 │
 ▼
WORKING TREE
```

---

# 50. The Most Important Comparison Table

| Command             | Comparison / Purpose         |
| ------------------- | ---------------------------- |
| `git diff`          | Working tree vs index        |
| `git diff --cached` | Index vs `HEAD`              |
| `git diff HEAD`     | Working tree/index vs `HEAD` |
| `git status`        | Summarizes repository state  |
| `git show HEAD`     | Shows the `HEAD` commit      |
| `git log`           | Traverses commit history     |

---

# 51. Reset in the Three-State Model

`git reset` becomes easier to understand when viewed through:

```text
HEAD
INDEX
WORKING TREE
```

### Soft

```powershell
git reset --soft <commit>
```

moves:

```text
HEAD
```

while leaving the index and working tree generally unchanged.

### Mixed

```powershell
git reset <commit>
```

moves:

```text
HEAD
```

and resets the index to that commit while leaving working-tree changes.

### Hard

```powershell
git reset --hard <commit>
```

moves:

```text
HEAD
INDEX
WORKING TREE
```

to the target state.

`--hard` can discard changes.

---

# 52. Revert vs Reset

These solve different problems.

`reset` changes where a branch reference points and can rewrite the apparent branch history.

```text
A ← B ← C
        ↑
       main

reset

A ← B
    ↑
   main
```

`revert` creates a new commit that reverses an earlier commit:

```text
A ← B ← C ← D
            ↑
        revert C
```

The original commit remains.

For shared history, `revert` is often preferable when you need to undo an already-published change.

---

# 53. Rebase

Rebase rewrites commits by replaying them onto another base.

Suppose:

```text
      C ← D
     /
A ← B
     \
      E ← F
```

A rebase can conceptually transform:

```text
      C ← D
     /
A ← B
     \
      E' ← F'
```

The rebased commits:

```text
E'
F'
```

are new commits with different ancestry and therefore different identities.

Rebase is history rewriting.

---

# 54. Merge vs Rebase

Merge:

```text
      C
     / \
A ← B   M
     \ /
      D
```

Rebase:

```text
A ← B ← C ← D'
```

Merge preserves the original branch topology.

Rebase creates a new linear ancestry for the rebased commits.

Neither is universally "better."

The correct choice depends on collaboration and history policy.

---

# 55. Immutable Commit Objects

Once a commit exists, you do not edit its contents in place.

If any commit data changes:

```text
tree
parent
author
committer
message
```

the resulting commit is a different object.

Therefore:

```text
Old commit
    ≠
Modified commit
```

A rewritten history creates new objects.

This is why:

```text
rebase
reset
amend
```

can change commit IDs.

---

# 56. Why Commit IDs Change

A commit depends on data including its:

```text
tree
parent
author
committer
message
```

If the parent changes:

```text
Parent A
```

becomes:

```text
Parent B
```

then the commit's identity changes.

Therefore a rebase creates different commit IDs even if the visible file changes appear identical.

---

# 57. History Is a Directed Acyclic Graph

Git commit history can be modeled as a:

```text
Directed Acyclic Graph
```

or:

```text
DAG
```

Each commit points to its parent or parents.

The graph has direction:

```text
newer
  │
  ▼
older
```

and does not contain cycles in normal commit ancestry.

This is the mathematical structure behind Git history.

---

# 58. Reachability

A commit is reachable when a reference can eventually lead to it through Git's object graph.

For example:

```text
main
 │
 ▼
D
│
▼
C
│
▼
B
│
▼
A
```

All of:

```text
A
B
C
D
```

are reachable from `main`.

References such as:

```text
branches
tags
HEAD
remote-tracking refs
```

act as starting points for reachability.

---

# 59. Unreachable Objects

An object can become unreachable if no relevant reference leads to it.

For example:

```text
main → D

Old commit C
   ↓
Old commit B
```

If nothing references:

```text
C
B
```

they may eventually become unreachable.

Git's cleanup mechanisms can eventually remove unreachable objects.

This is why reflogs can be important for recovery after history rewriting.

---

# 60. Reflog and Recovery

Suppose:

```text
A ← B ← C
        ↑
       main
```

You accidentally reset:

```text
A ← B
    ↑
   main
```

The commit:

```text
C
```

may still be recoverable through:

```powershell
git reflog
```

You may see the previous `HEAD` position.

Then inspect:

```powershell
git show <commit>
```

and, if appropriate, move a reference back to it.

The important principle:

```text
Branch movement
     ≠
Immediate object deletion
```

---

# 61. Git Command Layers

Git commands can be viewed at different abstraction levels.

High-level:

```text
git status
git add
git commit
git switch
git merge
```

Lower-level:

```text
git rev-parse
git cat-file
git hash-object
git update-ref
git read-tree
git write-tree
```

The lower-level commands expose the mechanics underlying Git's high-level operations.

---

# 62. `git write-tree`

The index can be written into a tree object:

```powershell
git write-tree
```

Conceptually:

```text
Index
  │
  ▼
Tree object
```

This is a powerful demonstration of the relationship:

```text
Index
  ↓
Tree
```

---

# 63. `git commit-tree`

Git also has a lower-level mechanism for creating commits from a tree:

```text
Tree
 │
 ▼
Commit object
```

The plumbing command:

```powershell
git commit-tree
```

can construct a commit object when supplied with the required information.

Normally you should use:

```powershell
git commit
```

But understanding the plumbing explains what the porcelain command is doing.

---

# 64. `git update-ref`

References can be manipulated with:

```powershell
git update-ref
```

Conceptually:

```text
Reference
    │
    ▼
Object ID
```

For example, a branch reference ultimately identifies a commit.

This command is powerful and should not be used casually.

---

# 65. Git Repository Architecture

A simplified architecture:

```text
                 WORKING TREE
                      │
                      │ git add
                      ▼
                    INDEX
                      │
                      │ write-tree
                      ▼
                    TREE
                      │
                      │ commit
                      ▼
                   COMMIT
                      │
                      ▼
                 OBJECT DATABASE
                      │
                      ▲
                      │
                  REFERENCES
```

This is the model to carry into advanced Git.

---

# 66. Local Repository vs Remote Repository

A remote repository is not a magical extension of your local repository.

You have:

```text
Local repository
```

and:

```text
Remote repository
```

Git transfers objects and references between repositories.

For example:

```text
git fetch
```

transfers remote information into your local repository.

```text
git push
```

transfers local commits/references toward the remote.

---

# 67. Fetch Is Not Merge

This distinction is essential.

```powershell
git fetch origin
```

updates your local knowledge of the remote.

It does not normally modify your current branch.

For example:

```text
Before:

main        → C
origin/main → B
```

After fetching:

```text
main        → C
origin/main → D
```

Your current `main` does not automatically move to `D`.

---

# 68. Pull Is Integration

A pull commonly performs:

```text
fetch
+
merge
```

or:

```text
fetch
+
rebase
```

depending on configuration and command options.

Therefore:

```text
fetch
```

and:

```text
pull
```

should never be mentally treated as identical operations.

---

# 69. Push Is Reference Update + Object Transfer

A push may involve:

```text
Local objects
      │
      ▼
Remote object database

Local reference
      │
      ▼
Remote reference
```

Git transfers the required objects and asks the remote to update the appropriate reference.

The remote can reject the reference update when it is not a permitted fast-forward or when server-side policies prevent it.

---

# 70. Fast-Forward Safety

Suppose the remote branch is:

```text
A ← B ← C
        ↑
      remote
```

and your local branch is:

```text
A ← B ← C ← D
            ↑
          local
```

Updating the remote to `D` is a fast-forward.

But if:

```text
A ← B ← C
        ↑
      remote

A ← B ← D
        ↑
      local
```

the histories diverge.

A normal push can be rejected because updating the remote would discard the remote branch's current tip from the branch's ancestry.

---

# 71. Git's Fundamental Vocabulary

You should be able to distinguish:

```text
Working Tree
Index
Repository
Object
Blob
Tree
Commit
Reference
Branch
Tag
HEAD
Remote
Remote-tracking branch
Upstream
Working-tree change
Staged change
Untracked file
Ignored file
```

These terms are the vocabulary used by advanced Git documentation and workflows.

---

# 72. Fundamental State Diagram

Memorize this:

```text
                    HEAD
                     │
                     ▼
                  Commit
                     │
                     │
                     ▼
                   INDEX
                     │
                     │
                     ▼
               WORKING TREE
```

For changes:

```text
WORKING TREE
     │
     │ git add
     ▼
   INDEX
     │
     │ git commit
     ▼
   COMMIT
```

For remote collaboration:

```text
LOCAL REPOSITORY
       │
       │ git push
       ▼
REMOTE REPOSITORY

REMOTE REPOSITORY
       │
       │ git fetch
       ▼
LOCAL REPOSITORY
```

---

# 73. Fundamental Object Diagram

Memorize this too:

```text
                 COMMIT
                /      \
               /        \
          parent         tree
             │             │
             ▼             ▼
          COMMIT          TREE
                           │
                    ┌──────┴──────┐
                    │             │
                   BLOB          TREE
                    │             │
                 file data    subdirectory
```

This explains much of Git's internal behavior.

---

# 74. Fundamental Reference Diagram

```text
HEAD
 │
 ▼
refs/heads/main
 │
 ▼
Commit
 │
 ▼
Tree
 │
 ├── Blob
 ├── Blob
 └── Tree
```

Branches are references.

Commits are objects.

Trees are objects.

Blobs are objects.

This distinction is fundamental.

---

# 75. Commands for Inspecting the Model

Inspect current branch:

```powershell
git branch --show-current
```

Inspect `HEAD`:

```powershell
git rev-parse HEAD
```

Inspect repository root:

```powershell
git rev-parse --show-toplevel
```

Inspect Git directory:

```powershell
git rev-parse --git-dir
```

Inspect branches:

```powershell
git branch -avv
```

Inspect history graph:

```powershell
git log --oneline --graph --decorate --all
```

Inspect commit:

```powershell
git show HEAD
```

Inspect object type:

```powershell
git cat-file -t HEAD
```

Inspect object:

```powershell
git cat-file -p HEAD
```

Inspect files tracked by the index:

```powershell
git ls-files
```

---

# 76. Fundamental Practice

Create a test repository:

```powershell
mkdir git-fundamentals-test
cd git-fundamentals-test
git init
```

Create:

```powershell
New-Item app.txt -ItemType File
```

Stage:

```powershell
git add app.txt
```

Commit:

```powershell
git commit -m "Initial snapshot"
```

Now inspect:

```powershell
git status
git log --oneline
git rev-parse HEAD
git cat-file -t HEAD
git cat-file -p HEAD
```

Observe that:

```text
HEAD
 ↓
commit
 ↓
tree
```

---

# 77. Practice the Three States

Modify `app.txt`.

Run:

```powershell
git status
```

Then:

```powershell
git diff
```

Now stage it:

```powershell
git add app.txt
```

Run:

```powershell
git diff
```

Then:

```powershell
git diff --cached
```

Notice:

```text
Before staging:

git diff
→ shows changes


After staging:

git diff
→ working tree vs index

git diff --cached
→ index vs HEAD
```

This exercise is mandatory for understanding Git.

---

# 78. Practice Staged + Unstaged Changes

Modify `app.txt`.

Stage it:

```powershell
git add app.txt
```

Modify it again.

Now run:

```powershell
git status
```

Then:

```powershell
git diff
```

and:

```powershell
git diff --cached
```

You should observe two different versions:

```text
HEAD
 │
 └── version A

INDEX
 │
 └── version B

WORKING TREE
 │
 └── version C
```

This is one of the most important Git exercises.

---

# 79. Practice Branch References

Create a branch:

```powershell
git switch -c fundamentals-test
```

Check:

```powershell
git branch -avv
```

Check:

```powershell
git symbolic-ref HEAD
```

Then:

```powershell
git rev-parse HEAD
```

You should understand:

```text
HEAD
 ↓
fundamentals-test
 ↓
commit
```

---

# 80. Practice Detached HEAD

Find a previous commit:

```powershell
git log --oneline
```

Then:

```powershell
git switch --detach <commit>
```

Check:

```powershell
git status
```

You are now in detached HEAD state.

Inspect:

```powershell
git rev-parse HEAD
```

Return to your branch:

```powershell
git switch fundamentals-test
```

---

# 81. Practice Reflog

Inspect:

```powershell
git reflog
```

You should see movements involving:

```text
HEAD
checkout
commit
```

The reflog is a local record of reference movement.

It is especially useful when learning recovery.

---

# 82. Fundamentals Checklist

Before moving to the next topic, you should understand:

```text
[ ] Working tree
[ ] Index
[ ] Repository
[ ] HEAD
[ ] Branch
[ ] Reference
[ ] Commit
[ ] Parent commit
[ ] Tree
[ ] Blob
[ ] Tag
[ ] Object ID
[ ] Content addressing
[ ] Commit graph
[ ] DAG
[ ] Fast-forward
[ ] Detached HEAD
[ ] Remote-tracking branch
[ ] Upstream branch
[ ] Staged changes
[ ] Unstaged changes
[ ] Untracked files
[ ] Ignored files
[ ] Reflog
```

---

# 83. Core Mental Model

If you remember only one diagram from this file, remember this:

```text
                       REFERENCES
                            │
                ┌───────────┼───────────┐
                │           │           │
               HEAD       branch       tag
                │           │           │
                └───────────┼───────────┘
                            │
                            ▼
                          COMMIT
                            │
                    ┌───────┴───────┐
                    │               │
                  parent           tree
                                    │
                           ┌────────┴────────┐
                           │                 │
                         blob              tree
                           │                 │
                         files          directories


WORKING TREE
     │
     │ git add
     ▼
   INDEX
     │
     │ git commit
     ▼
   COMMIT / OBJECT DATABASE
```

This is the foundation for advanced Git.

---

# 84. Final Principle

Git becomes much easier when you stop thinking:

```text
"I need to remember which command fixes this."
```

and start thinking:

```text
"What state am I in?"
        ↓
"What state do I want?"
        ↓
"Which Git operation moves me there?"
```

For example:

```text
Modified but not staged
        ↓
git add
        ↓
Staged

Staged
        ↓
git commit
        ↓
Committed

Wrong branch
        ↓
git switch
        ↓
Correct branch

Published bad commit
        ↓
git revert
        ↓
New reversing commit

Local unpublished history needs restructuring
        ↓
rebase / reset / amend
        ↓
Rewritten history
```

Once this model is internalized, Git's advanced commands become much easier to reason about.

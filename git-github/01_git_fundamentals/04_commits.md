# Git Commits

A **commit** is a permanent snapshot of the project state recorded in Git history.

A commit is not simply "a saved version of a file."

A Git commit records:

```text
Commit
├── Snapshot (Tree)
├── Parent commit(s)
├── Author
├── Committer
├── Timestamp
├── Commit message
└── Commit metadata
```

The fundamental flow is:

```text
Working Tree
     │
     │ git add
     ▼
Index / Staging Area
     │
     │ git commit
     ▼
Commit
```

---

# 1. What Is a Commit?

A commit records the state represented by the staging area at the moment the commit is created.

Example:

```text
Commit A
│
├── README.md
├── package.json
└── src/
    ├── app.js
    └── server.js
```

The commit is a snapshot of those paths and their contents.

A commit also points to its parent commit.

```text
Commit A
   │
   ▼
Commit B
   │
   ▼
Commit C
```

This creates Git history.

---

# 2. Creating a Commit

The basic command is:

```cmd
git commit -m "Initial commit"
```

Normally:

```text
Working Tree
     │
     │ git add
     ▼
Index
     │
     │ git commit
     ▼
Commit
```

Example:

```cmd
git add README.md
git commit -m "Add README"
```

Only the staged state is committed.

---

# 3. Commit Snapshot

Suppose the index contains:

```text
README.md
src/app.js
package.json
```

with their current staged contents.

Running:

```cmd
git commit -m "Add application structure"
```

creates a commit representing that snapshot.

Conceptually:

```text
Index
 │
 ├── README.md
 ├── src/app.js
 └── package.json
        │
        │ git commit
        ▼
      Tree
        │
        ▼
      Commit
```

---

# 4. Commit and Working Tree Are Different

After creating:

```text
Commit A
```

you can continue editing files.

For example:

```text
Commit A
 │
 └── app.js = version 1

Working Tree
 │
 └── app.js = version 2
```

The existing commit remains unchanged.

The working-tree modification is not automatically part of the commit.

---

# 5. Commit and Index Are Different

The index can change after a commit.

Example:

```text
Commit A
   │
   ▼
Index
   │
   └── staged modification
```

The staged modification does not become history until another commit is created.

Therefore:

```text
git add
```

changes the index.

```text
git commit
```

creates a new commit.

---

# 6. Commit Identity

Every Git commit has an object ID.

Modern Git repositories commonly use SHA-1 object IDs, while Git also supports SHA-256 repositories.

A commit may be represented by an identifier such as:

```text
8f3a1c...
```

The full object ID is much longer.

You can inspect a commit with:

```cmd
git show
```

or:

```cmd
git log
```

---

# 7. Commit Hash

A commit's object ID is derived from its content and metadata.

Conceptually:

```text
Commit Data
    │
    ├── tree
    ├── parent
    ├── author
    ├── committer
    └── message
          │
          ▼
       Hash
          │
          ▼
      Commit ID
```

Changing relevant commit data produces a different commit object ID.

This is a fundamental property of Git's content-addressable object model.

---

# 8. Commit Object

Internally, a commit object contains information such as:

```text
tree <tree-object-id>
parent <parent-object-id>
author <author-information>
committer <committer-information>

commit message
```

A root commit has no parent.

A normal commit usually has one parent.

A merge commit can have multiple parents.

---

# 9. Root Commit

The first commit in a repository is commonly called the **root commit**.

Example:

```text
Commit A
```

There is no previous commit:

```text
Commit A
  │
  └── no parent
```

Create one with:

```cmd
git add .
git commit -m "Initial commit"
```

---

# 10. Parent Commit

A normal commit points to its parent.

Example:

```text
A → B → C
```

where:

```text
B.parent = A
C.parent = B
```

This parent relationship forms the commit graph.

---

# 11. Commit Graph

Git history is fundamentally a graph.

A simple linear history:

```text
A
│
B
│
C
│
D
```

A branching history:

```text
      B
     /
A ──
     \
      C
```

A merge history:

```text
      B
     / \
A ──    D
     \ /
      C
```

The commit graph is more fundamental than the visual branch names.

---

# 12. Branches Point to Commits

A branch is essentially a movable reference to a commit.

Example:

```text
main
 │
 ▼
Commit C
```

The commits are the history.

The branch reference identifies a particular tip.

```text
A → B → C
        ▲
        │
       main
```

Creating a new commit moves the branch:

```text
A → B → C → D
            ▲
            │
           main
```

---

# 13. HEAD and Commits

`HEAD` identifies the current checkout position.

On a normal branch:

```text
HEAD
 │
 ▼
main
 │
 ▼
Commit C
```

Therefore:

```text
HEAD → branch → commit
```

The exact representation can vary depending on whether you are in a detached HEAD state.

---

# 14. Detached HEAD

You can check out a specific commit:

```cmd
git switch --detach <commit>
```

Then:

```text
HEAD
 │
 ▼
Commit C
```

instead of:

```text
HEAD
 │
 ▼
main
 │
 ▼
Commit C
```

This is called **detached HEAD**.

You are now positioned directly at a commit rather than through a branch.

---

# 15. Creating Commits in Detached HEAD

You can create commits while detached.

Example:

```text
A → B → C
        ▲
       HEAD
```

Create a commit:

```text
A → B → C → D
            ▲
           HEAD
```

No branch necessarily points to `D`.

If you want to preserve that work, create or move a branch reference to it.

For example:

```cmd
git switch -c experiment
```

This creates a branch pointing at the current commit.

---

# 16. Commit Messages

A commit message explains the purpose of the commit.

Example:

```cmd
git commit -m "Add user authentication"
```

Good commit messages describe the logical change.

Examples:

```text
Add JWT authentication
Fix database connection timeout
Refactor message validation
Update API documentation
```

Avoid vague messages such as:

```text
changes
update
fix
stuff
work
```

---

# 17. Commit Message Structure

A common convention is:

```text
Short summary

Optional detailed explanation.
Explain why the change was necessary,
important implementation decisions,
and relevant context.
```

Example:

```text
Fix message ordering

Ensure messages are sorted using the server timestamp
before being inserted into the client cache.
```

The first line should be concise.

The body is useful for important context.

---

# 18. Editing the Commit Message

When creating a commit without `-m`:

```cmd
git commit
```

Git opens the configured editor.

You can write:

```text
Add authentication middleware
```

and save the commit message.

---

# 19. Inspecting Commits

Use:

```cmd
git log
```

Example:

```text
commit abc123...
Author: Shiva Ram
Date:   ...

    Add authentication
```

For a compact history:

```cmd
git log --oneline
```

Example:

```text
a91f2e3 Add authentication
72b81ac Add API routes
1f5c3d2 Initial commit
```

---

# 20. Inspect a Specific Commit

Use:

```cmd
git show <commit>
```

Example:

```cmd
git show HEAD
```

This shows information about the commit and its changes.

You can inspect an older commit:

```cmd
git show HEAD~1
```

---

# 21. `HEAD~` Commit Navigation

For a linear history:

```text
A
│
B
│
C
│
D ← HEAD
```

Then:

```cmd
git show HEAD
```

means:

```text
D
```

```cmd
git show HEAD~1
```

means:

```text
C
```

```cmd
git show HEAD~2
```

means:

```text
B
```

```cmd
git show HEAD~3
```

means:

```text
A
```

---

# 22. `HEAD^`

You can also use:

```cmd
git show HEAD^
```

For a normal one-parent commit:

```text
HEAD
 │
 ▼
D
│
▼
C
```

`HEAD^` refers to the parent:

```text
C
```

---

# 23. `HEAD~1` vs `HEAD^`

For ordinary linear commits:

```text
HEAD~1
```

and:

```text
HEAD^
```

usually identify the same parent.

The distinction becomes important with merge commits.

A merge commit can have:

```text
parent 1
parent 2
```

Then:

```cmd
git show HEAD^1
```

selects the first parent.

```cmd
git show HEAD^2
```

selects the second parent.

---

# 24. Merge Commit

A merge commit can have multiple parents.

Example:

```text
       B
      / \
A ───    D
      \ /
       C
```

`D` has:

```text
parent 1 = B
parent 2 = C
```

Therefore:

```cmd
git show D^1
```

selects `B`.

```cmd
git show D^2
```

selects `C`.

---

# 25. Commit Metadata

A commit contains two important identity fields:

```text
Author
Committer
```

They are not necessarily the same person.

The **author** is the person who originally wrote the change.

The **committer** is the person who created the commit object.

This distinction matters in workflows involving:

```text
patches
rebases
cherry-picks
automation
maintainers
```

---

# 26. Author vs Committer

A commit may conceptually look like:

```text
Author:
Developer A

Committer:
Developer B
```

This can happen when:

```text
Developer A
    │
    │ creates patch
    ▼
Developer B
    │
    │ commits it
    ▼
Git history
```

Inspect with:

```cmd
git show --format=fuller
```

---

# 27. Configure Identity

Git uses configuration values for commit identity.

Check:

```cmd
git config user.name
git config user.email
```

Configure globally:

```cmd
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Repository-specific configuration can override global configuration:

```cmd
git config user.name "Project Name"
git config user.email "project@example.com"
```

---

# 28. Commit Timestamp

Commits contain timestamps associated with author and committer information.

You can inspect them with:

```cmd
git show --format=fuller
```

This can show:

```text
AuthorDate
CommitDate
```

The distinction can become important when commits are rewritten.

---

# 29. Commit Is Immutable

Once created, a commit object is identified by its content-derived object ID.

If you change its:

```text
message
author
committer
parent
tree
```

you are creating a different commit object.

Conceptually:

```text
Commit A
   │
   │ modify commit metadata
   ▼
Commit B
```

`B` is a new object.

---

# 30. `git commit --amend`

You can replace the latest commit using:

```cmd
git commit --amend
```

Example:

```text
A → B
    ▲
   HEAD
```

Amending produces:

```text
A → B'
     ▲
    HEAD
```

`B'` is a new commit.

It is not literally modifying the old commit object.

---

# 31. Amend the Message

To change the latest commit message:

```cmd
git commit --amend -m "Correct message"
```

Conceptually:

```text
Old:

A → B


After amend:

A → B'
```

`B'` has a different commit identity.

---

# 32. Amend Content

Suppose you forgot a file.

Stage it:

```cmd
git add missing-file.js
```

Then:

```cmd
git commit --amend --no-edit
```

The latest commit is replaced with a new commit containing the newly staged content.

```text
Before:

A → B


After:

A → B'
```

---

# 33. `--no-edit`

Use:

```cmd
git commit --amend --no-edit
```

when you want to modify the commit contents but keep the existing commit message.

---

# 34. Amend and Published History

Amending a commit that has already been pushed changes history.

Example:

```text
Remote:
A → B

Local:
A → B'
```

The local branch no longer points to the same commit as the remote branch.

Updating the remote may require a force push.

This should be used carefully on shared branches.

---

# 35. Empty Commits

Git can create a commit without ordinary file changes:

```cmd
git commit --allow-empty -m "Trigger CI"
```

Example:

```text
A → B
```

where the tree represented by `B` may be the same as its parent while the commit metadata/message differs.

This can be useful for automation or workflow triggers.

---

# 36. Commit With No File Changes

A commit does not necessarily require a different tree.

The commit object itself can still differ because of:

```text
message
author
committer
timestamp
```

Therefore:

```text
same tree
≠
same commit
```

---

# 37. Commit Tree

A commit points to a tree object.

Conceptually:

```text
Commit
  │
  ▼
Tree
├── README.md → blob
├── package.json → blob
└── src/
    ├── app.js → blob
    └── db.js → blob
```

The tree describes the committed filesystem snapshot.

---

# 38. Commit → Tree → Blob

Git's object model can be visualized as:

```text
Commit
   │
   ▼
 Tree
 ├── blob
 ├── blob
 └── Tree
      ├── blob
      └── blob
```

The major object types are:

```text
blob
tree
commit
tag
```

A commit is therefore metadata pointing to a tree and parent commit(s).

---

# 39. Inspect the Commit Object

You can inspect the raw commit representation with:

```cmd
git cat-file -p HEAD
```

You may see:

```text
tree <tree-id>
parent <parent-id>
author ...
committer ...

Commit message
```

This exposes the underlying commit structure.

---

# 40. Inspect the Commit Type

Run:

```cmd
git cat-file -t HEAD
```

Expected result:

```text
commit
```

Inspect the tree:

```cmd
git cat-file -p HEAD^{tree}
```

This exposes the tree referenced by the commit.

---

# 41. Commit Reachability

A commit is normally reachable through references such as:

```text
branch
tag
HEAD
remote-tracking branch
```

Example:

```text
main
 │
 ▼
C
│
B
│
A
```

If a commit becomes unreachable from references, Git can eventually remove it through garbage collection.

This is why dangling commits can sometimes be recovered temporarily.

---

# 42. Commit Reachability and References

Think of references as entry points:

```text
refs
 │
 ├── main ───────→ C
 ├── feature ────→ B
 └── tag/v1.0 ───→ A
```

The commits reachable from these references form the currently referenced history.

The commit objects themselves are stored separately in the object database.

---

# 43. Commit Graph Is Not Branch Storage

Branches do not contain copies of commits.

For example:

```text
main    ──┐
          ▼
          C
         /
A → B
         \
feature ──→ C
```

Both branches can point to the same commit.

The commit exists once.

The references simply identify it.

---

# 44. Commit IDs Are Content Addressed

Git uses object IDs to identify objects.

A commit's identity depends on its serialized contents.

Conceptually:

```text
commit contents
      │
      ▼
cryptographic hash
      │
      ▼
commit ID
```

This gives Git properties such as:

```text
object identity
integrity checking
efficient object lookup
content addressing
```

---

# 45. Changing a Parent Changes the Commit

Suppose:

```text
A → B
```

and `B` has parent `A`.

If the parent relationship changes, the commit's content changes.

Therefore its object ID changes.

This is why history rewriting produces new commit IDs.

---

# 46. Changing a Commit Message Changes the ID

Suppose:

```text
Commit B
message = "Add login"
```

Change the message:

```text
"Add authentication"
```

The resulting commit is different:

```text
B → B'
```

Therefore:

```text
ID(B) ≠ ID(B')
```

---

# 47. Rewriting History

Operations such as:

```cmd
git commit --amend
git rebase
git cherry-pick
```

can create new commits.

This means:

```text
old history
```

can be replaced by:

```text
new history
```

even though the logical changes may be similar.

This is a central concept in advanced Git.

---

# 48. Commit Ordering

Git does not require a globally linear sequence number such as:

```text
Commit 1
Commit 2
Commit 3
```

Instead, commits form a directed acyclic graph.

Example:

```text
      B
     / \
A ──    D
     \ /
      C
```

The graph structure determines ancestry.

---

# 49. Ancestry

A commit is an ancestor of another commit if it can be reached by repeatedly following parent relationships.

Example:

```text
A → B → C → D
```

Then:

```text
A
```

is an ancestor of:

```text
D
```

You can test ancestry with:

```cmd
git merge-base --is-ancestor A D
```

A successful result means `A` is an ancestor of `D`.

---

# 50. Common Ancestor

Given:

```text
      B
     /
A ──
     \
      C
```

`A` is a common ancestor of `B` and `C`.

Git uses common ancestors for operations such as:

```text
merge
diff
three-way comparison
```

---

# 51. Commit Parents and Merge

A normal commit:

```text
B
│
└── parent A
```

A merge commit:

```text
      B
     / \
A ──    D
     \ /
      C
```

has two parents:

```text
D → B
D → C
```

The parent count is part of the commit object's structure.

---

# 52. Commit Content vs Commit Diff

A commit fundamentally stores a snapshot, not merely a patch.

Git can display a diff associated with a commit by comparing its tree with a parent tree.

For example:

```cmd
git show HEAD
```

typically presents:

```text
commit metadata
+
difference from parent
```

The diff is a derived comparison.

The commit itself points to the resulting snapshot.

---

# 53. Why Snapshot Thinking Matters

Suppose:

```text
Commit A
```

contains:

```text
file.txt = A
```

and:

```text
Commit B
```

contains:

```text
file.txt = B
```

Git's conceptual committed states are:

```text
A → snapshot 1
B → snapshot 2
```

The difference between them can be calculated.

Therefore:

```text
commit ≠ patch
```

A patch/diff is derived from snapshots.

---

# 54. Commit Verification

Git's content-addressed model allows Git to detect inconsistencies.

If the content used to identify an object does not correspond to its expected object ID, integrity is violated.

Git provides commands such as:

```cmd
git fsck
```

for repository object integrity checking.

This is an advanced diagnostic tool.

---

# 55. `git fsck`

Run:

```cmd
git fsck
```

to check repository connectivity and object validity.

It can report objects such as:

```text
dangling commit
dangling blob
dangling tree
```

A dangling commit may be a commit that is no longer reachable from a current reference.

---

# 56. Recovering Unreferenced Commits

If a commit becomes unreachable:

```text
A → B → C

branch → B
```

then:

```text
C
```

may be unreachable.

It can sometimes remain in the object database until garbage collection removes it.

Commands such as:

```cmd
git reflog
```

can help locate previously referenced commits.

---

# 57. Reflog and Commits

The reflog records updates to local references such as:

```text
HEAD
branch references
```

For example:

```cmd
git reflog
```

may show:

```text
HEAD@{0}
HEAD@{1}
HEAD@{2}
```

This can help locate commits that disappeared from normal branch history after operations such as:

```text
reset
rebase
amend
```

---

# 58. Commit Signing

Git supports signed commits.

For example:

```cmd
git commit -S -m "Add authentication"
```

Signing allows commit authenticity to be verified through a configured signing mechanism.

You can inspect signatures with:

```cmd
git log --show-signature
```

Commit signing is distinct from merely configuring the author identity.

---

# 59. Signed Commit vs Author Identity

These are different concepts:

```text
user.name
user.email
```

identify the commit's configured author/committer metadata.

A cryptographic signature provides a mechanism for verifying that the signer controlled the corresponding signing key.

Therefore:

```text
email identity
≠
cryptographic signature
```

---

# 60. Commit Trailers

Commit messages can contain structured trailers.

Example:

```text
Fix authentication flow

Reviewed-by: Developer
Co-authored-by: Another Developer <email@example.com>
```

Trailers are commonly used by development workflows to encode structured metadata in commit messages.

Git provides commands and configuration for interpreting commit trailers.

---

# 61. Co-authored Commits

A commit can credit additional contributors through commit-message conventions such as:

```text
Co-authored-by:
```

This is metadata in the commit message.

It does not mean the commit object has multiple author fields.

The commit object itself has one author identity and one committer identity.

---

# 62. Commit Hooks

Git can execute hooks around commit operations.

Important commit-related hooks include:

```text
pre-commit
prepare-commit-msg
commit-msg
post-commit
```

Typical purposes include:

```text
validation
linting
format checking
commit-message validation
automation
```

Hooks execute locally unless a workflow explicitly distributes equivalent checks elsewhere.

---

# 63. `pre-commit`

The `pre-commit` hook runs before Git creates the commit.

Conceptually:

```text
git commit
    │
    ▼
pre-commit
    │
    ├── failure → commit stops
    │
    └── success
          │
          ▼
       commit
```

This is useful for local validation.

---

# 64. `commit-msg`

The `commit-msg` hook can validate or modify the commit message before the commit is finalized.

For example, a project could enforce:

```text
type(scope): description
```

or another commit-message convention.

---

# 65. Commit Creation Pipeline

A useful advanced model:

```text
git commit
    │
    ▼
prepare commit message
    │
    ▼
pre-commit
    │
    ▼
commit-msg
    │
    ▼
create tree from index
    │
    ▼
create commit object
    │
    ▼
update current reference
    │
    ▼
post-commit
```

Exact behavior can vary depending on options and hooks, but this is a useful conceptual pipeline.

---

# 66. Commit Updates a Reference

Suppose:

```text
main → B
```

You create a new commit:

```text
git commit -m "Add feature"
```

Git creates:

```text
C
```

and updates:

```text
main → C
```

with:

```text
C.parent = B
```

So committing performs two important conceptual operations:

```text
create commit
+
move current branch reference
```

---

# 67. Commit Does Not Move Every Branch

Suppose:

```text
main    → B
feature → C
```

You are currently on `feature`.

Create a commit:

```text
main    → B
feature → D
```

Only the current branch moves.

Other branch references remain unchanged.

---

# 68. Commit and Remote Branches

A local commit:

```text
main → C
```

does not automatically update:

```text
origin/main
```

The remote-tracking reference may still point to:

```text
origin/main → B
```

After pushing:

```cmd
git push
```

the remote branch can advance.

Conceptually:

```text
Before push:

local main    → C
origin/main   → B
```

After successful push:

```text
local main    → C
origin/main   → C
```

---

# 69. Commit and Fast-Forward History

If the remote branch is an ancestor of your local branch:

```text
A → B → C

origin/main → B
main        → C
```

a push can normally fast-forward the remote reference:

```text
origin/main → C
```

No merge commit is required.

---

# 70. Commit Quality

Good commits are:

```text
focused
logical
reviewable
atomic where practical
descriptive
```

A useful principle:

> One commit should represent one coherent logical change.

For example:

```text
Commit 1 → Add authentication
Commit 2 → Add authorization
Commit 3 → Update documentation
```

is generally easier to review than:

```text
Commit 1 → authentication + authorization + docs + unrelated refactor
```

---

# 71. Atomic Commit

An atomic commit is a commit representing a coherent change that can be understood and evaluated independently.

Benefits include:

```text
easier review
easier debugging
easier revert
clearer history
better cherry-picking
```

The staging area is what allows you to construct these focused commits.

---

# 72. Commit Before Push

A common local workflow:

```cmd
git status
git diff
git add <files>
git diff --cached
git commit -m "Meaningful message"
git log --oneline
```

Only afterward:

```cmd
git push
```

This separates:

```text
creating local history
```

from:

```text
publishing history
```

---

# 73. Verify the Latest Commit

Useful commands:

```cmd
git log -1
```

or:

```cmd
git show --stat HEAD
```

For the complete patch:

```cmd
git show HEAD
```

For metadata:

```cmd
git show --format=fuller --no-patch HEAD
```

---

# 74. Useful Commit Inspection Commands

```cmd
git log
git log --oneline
git log --graph --oneline
git show HEAD
git show <commit>
git show --stat <commit>
git show --name-only <commit>
git show --format=fuller <commit>
git cat-file -p <commit>
git cat-file -t <commit>
```

These commands allow you to inspect both the high-level history and the underlying commit object.

---

# 75. Commit Range

Git can operate on ranges of commits.

For example:

```cmd
git log A..B
```

generally shows commits reachable from `B` that are not reachable from `A`.

This is useful for answering questions such as:

```text
What commits exist on my branch that are not on main?
```

---

# 76. Comparing Commits

You can compare two commit snapshots:

```cmd
git diff A B
```

This asks:

```text
What changed between snapshot A and snapshot B?
```

The commits themselves remain unchanged.

The diff is calculated from their trees.

---

# 77. Commit Statistics

Use:

```cmd
git show --stat HEAD
```

to see a summary such as:

```text
2 files changed
15 insertions
4 deletions
```

This is useful for quickly understanding the scope of a commit.

---

# 78. Commit File List

Use:

```cmd
git show --name-only HEAD
```

to display files associated with the commit's changes.

For names and status:

```cmd
git show --name-status HEAD
```

This can show operations such as:

```text
M   modified
A   added
D   deleted
R   renamed
```

---

# 79. First-Parent History

Merge-heavy repositories can be easier to understand with:

```cmd
git log --first-parent
```

This follows the first-parent chain of commits.

For example:

```text
       B
      / \
A ───    D
      \ /
       C
```

The first-parent history can emphasize the main integration path:

```text
A → B → D
```

This is especially useful for release and integration histories.

---

# 80. Commit Graph Visualization

Use:

```cmd
git log --graph --oneline --decorate --all
```

Example:

```text
*   91ac2d1 (HEAD -> main) Merge feature
|\
| * 7bc912a (feature) Add validation
|/
* 1aa72de Add API
* 03c8f12 Initial commit
```

This is one of the most useful commands for understanding commit topology.

---

# 81. Commit Ancestry Is the Core

When reasoning about Git history, focus on:

```text
commit
├── parent(s)
├── tree
└── metadata
```

Then branches and tags are references:

```text
branch → commit
tag    → object
HEAD   → reference/commit
```

This explains many advanced Git operations.

---

# 82. Important Distinction

Remember:

```text
Working Tree
    ↓
Index
    ↓
Commit
    ↓
Reference
```

More precisely:

```text
Working Tree
      │
      │ git add
      ▼
Index
      │
      │ git commit
      ▼
Commit ─────→ Tree
 │
 └──────────→ Parent Commit(s)

Branch
  │
  ▼
Commit

HEAD
  │
  ▼
Current Branch / Commit
```

---

# 83. Commit Lifecycle

A practical commit lifecycle is:

```text
1. Modify files
       ↓
2. Inspect changes
       ↓
3. Stage selected changes
       ↓
4. Review staged snapshot
       ↓
5. Create commit
       ↓
6. Inspect commit
       ↓
7. Optionally publish with git push
```

Commands:

```cmd
git diff
git add <files>
git diff --cached
git commit -m "..."
git show HEAD
git push
```

---

# 84. Commit Rules to Remember

```text
git add
    = update the index

git commit
    = create a new commit from the index

commit
    = snapshot + metadata + parent relationship

branch
    = reference to a commit

HEAD
    = current checkout position

git push
    = publish local commits to a remote
```

---

# 85. Final Mental Model

The most important model in this file:

```text
                 WORKING TREE
                      │
                      │ git add
                      ▼
                   INDEX
                      │
                      │ git commit
                      ▼
                    TREE
                      │
                      ▼
                   COMMIT
                  /       \
             parent       metadata
                │
                ▼
             history
```

And the history forms a graph:

```text
             B
            / \
           /   \
          A     D
           \   /
            \ /
             C
```

Branches point into this graph:

```text
main ───────→ D
feature ────→ C
```

`HEAD` identifies your current position:

```text
HEAD
 │
 ▼
main
 │
 ▼
D
```

The central principle is:

> **A commit is a content-addressed historical snapshot with metadata and parent relationships, created from the staging area's proposed state.**

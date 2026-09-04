# Git Merging

Git **merge** combines the histories of two branches.

The important concept is:

> A merge does not simply combine files. It combines two lines of commit history and, when necessary, creates a new commit that has multiple parents.

---

# 1. Basic Merge Model

Suppose:

```text
A → B → C
        ▲
       main
```

Create a feature:

```text
A → B → C
        ▲
        ├── main
        └── feature
```

Add commits to `feature`:

```text
A → B → C → D → E
        ▲         ▲
        │         │
       main    feature
```

Now merge `feature` into `main`.

```cmd
git switch main
git merge feature
```

If `main` has not moved since `feature` was created, Git can perform a **fast-forward**.

---

# 2. Fast-Forward Merge

Before:

```text
A → B → C → D → E
        ▲         ▲
       main    feature
```

Actually, if `main` is at `C` and `feature` is at `E`:

```text
A → B → C → D → E
        ▲         ▲
       main    feature
```

Git can simply move `main`:

```text
A → B → C → D → E
                  ▲
                  ├── main
                  └── feature
```

No merge commit is created.

Command:

```cmd
git switch main
git merge feature
```

Result:

```text
main → E
```

---

# 3. What Fast-Forward Means

Fast-forward means:

```text
current branch
      │
      ▼
     C
      │
      ▼
     D
      │
      ▼
     E
```

The target branch is already a descendant of the current branch.

Therefore Git only needs to move the branch reference.

No new commit is necessary.

---

# 4. Prevent Fast-Forward

You can force Git to create a merge commit:

```cmd
git merge --no-ff feature
```

Before:

```text
A → B → C
        ▲
       main

C → D → E
        ▲
      feature
```

After:

```text
        D → E
       /     \
A → B → C     M
        \     /
         ────
```

More accurately:

```text
        D → E
       /     \
A → B → C → M
```

`M` has two parents:

```text
parent 1 = C
parent 2 = E
```

---

# 5. Why `--no-ff` Exists

A non-fast-forward merge preserves the fact that a separate branch was integrated.

Example:

```text
A → B → C ───────── M
        \           /
         D → E ────
```

This can make feature integration visible in the history.

Without `--no-ff`:

```text
A → B → C → D → E
```

The feature branch's separate structure disappears from the main branch's topology.

---

# 6. Diverged Branches

The more important merge case is when both branches have new commits.

Before:

```text
        C → D
       /
A → B
       \
        E → F
```

Suppose:

```text
main    → D
feature → F
```

Neither branch is an ancestor of the other.

A fast-forward is impossible.

---

# 7. Three-Way Merge

Git finds a common ancestor.

```text
        C → D
       /
A → B
       \
        E → F
```

The common ancestor is:

```text
B
```

Git compares:

```text
B → D
B → F
```

and combines those changes.

This is called a **three-way merge**.

The three relevant commits are:

```text
common ancestor
current branch tip
merged branch tip
```

---

# 8. Merge Base

Git can identify the merge base:

```cmd
git merge-base main feature
```

For:

```text
        C → D
       /
A → B
       \
        E → F
```

the result corresponds to:

```text
B
```

The merge base is fundamental to three-way merging.

---

# 9. Merge Commit

After a successful three-way merge:

```text
        C → D
       /     \
A → B         M
       \     /
        E → F
```

`M` is the merge commit.

It has two parents:

```text
M
├── parent 1 → D
└── parent 2 → F
```

The exact parent ordering depends on which branch was checked out and which branch was merged.

---

# 10. Which Branch Is Modified?

When you run:

```cmd
git switch main
git merge feature
```

Git merges:

```text
feature
```

into:

```text
main
```

The current branch is the branch that receives the result.

Think:

```text
current branch
     +
target branch
     ↓
current branch updated
```

So:

```cmd
git switch main
git merge feature
```

means:

```text
feature → main
```

---

# 11. Merge Does Not Move the Merged Branch

Suppose:

```text
main    → D
feature → F
```

Run:

```cmd
git switch main
git merge feature
```

Result:

```text
main    → M
feature → F
```

The `feature` branch remains at `F`.

Only `main` moves.

---

# 12. Basic Merge Workflow

Typical workflow:

```cmd
git switch main
git pull
git merge feature/login
```

Then inspect:

```cmd
git status
git log --graph --oneline --decorate --all
```

If successful:

```cmd
git push
```

---

# 13. Merge Commit Creation

When branches have diverged:

```cmd
git merge feature
```

Git may automatically create a merge commit.

Example:

```text
        C → D
       /     \
A → B         M
       \     /
        E → F
```

The commit message may look like:

```text
Merge branch 'feature'
```

You can edit the message if necessary.

---

# 14. `--no-edit`

You can accept Git's generated merge message:

```cmd
git merge --no-edit feature
```

This is useful when you do not need to change the automatically generated message.

---

# 15. `--edit`

You can explicitly request editing of the merge message:

```cmd
git merge --edit feature
```

This is generally useful when the merge commit needs a meaningful message.

---

# 16. Merge Message

A merge commit should explain the integration when the default message is insufficient.

Example:

```text
Merge feature/authentication into main
```

The purpose is not to describe every individual change.

Those details already exist in the merged branch history.

---

# 17. Merge Conflict

A merge conflict happens when Git cannot automatically determine how to combine changes.

Example:

```text
main:
file.txt → "Hello world"

feature:
file.txt → "Hello Git"
```

If both branches modify the same region incompatibly, Git may stop the merge.

---

# 18. Conflict Markers

Git may place conflict markers into a file:

```text
<<<<<<< HEAD
main version
=======
feature version
>>>>>>> feature
```

Meaning:

```text
<<<<<<< HEAD
current branch version
=======
merged branch version
>>>>>>> feature
```

You must decide what the final content should be.

---

# 19. Resolving a Conflict

First inspect:

```cmd
git status
```

Git identifies conflicted files.

Open the file and resolve the conflict.

For example, change:

```text
<<<<<<< HEAD
Hello from main
=======
Hello from feature
>>>>>>> feature
```

into:

```text
Hello from both branches
```

Then stage the resolved file:

```cmd
git add file.txt
```

Finally complete the merge:

```cmd
git commit
```

Modern Git may also allow:

```cmd
git merge --continue
```

depending on the merge state.

---

# 20. Conflict Resolution Is a Content Decision

Git can identify conflicting regions.

It cannot always know the correct business meaning.

For example:

```text
main:
timeout = 30

feature:
timeout = 60
```

Git may require a human decision.

The correct value could be:

```text
30
```

or:

```text
60
```

or:

```text
45
```

The correct answer depends on application requirements.

---

# 21. Check Conflicts

Use:

```cmd
git status
```

You can also inspect unresolved files with:

```cmd
git diff
```

During a merge, `git diff` can show unmerged changes.

---

# 22. List Unmerged Files

Use:

```cmd
git diff --name-only --diff-filter=U
```

`U` represents an unmerged state.

This is useful in large conflict resolutions.

---

# 23. Abort a Merge

If you decide not to continue:

```cmd
git merge --abort
```

This attempts to return the working tree and index to their pre-merge state.

Use this when you want to abandon the current merge operation.

---

# 24. Merge Abort Limitation

`git merge --abort` is not a general-purpose undo command.

If you made additional changes during the merge or had certain pre-existing working-tree states, recovery may not be perfectly equivalent to simply "undo everything."

Therefore, keep important uncommitted work safe before complicated merges.

---

# 25. Continue a Merge

After resolving conflicts:

```cmd
git add .
git merge --continue
```

If Git does not require the continuation command in the current merge state, completing the merge with:

```cmd
git commit
```

may be appropriate.

---

# 26. Current Merge State

During an unresolved merge:

```cmd
git status
```

is your primary diagnostic command.

It can tell you:

```text
which files conflict
whether all conflicts are resolved
whether a merge is in progress
what Git expects next
```

---

# 27. Ours and Theirs

During a merge conflict, Git uses terminology such as:

```text
ours
theirs
```

For:

```cmd
git switch main
git merge feature
```

typically:

```text
ours   = main
theirs = feature
```

This terminology is relative to the merge operation.

Do not interpret "ours" and "theirs" as permanent properties of the branches.

---

# 28. Checkout One Side of a Conflict

For a conflicted file, older workflows may use:

```cmd
git checkout --ours file.txt
git checkout --theirs file.txt
```

Modern Git can use:

```cmd
git restore --ours file.txt
git restore --theirs file.txt
```

Then stage the result:

```cmd
git add file.txt
```

Be careful: these commands discard the other side's version for that file.

---

# 29. Manual Combination

You do not have to choose entirely one side.

For example:

```text
ours:
timeout = 30
logging = true
```

and:

```text
theirs:
timeout = 60
logging = false
```

You may resolve to:

```text
timeout = 60
logging = true
```

This is a manual merge resolution.

---

# 30. Binary Conflicts

Binary files can also conflict.

For example:

```text
image.png
```

cannot normally be merged line-by-line like a text file.

You generally choose one version or regenerate/create a correct combined artifact using an appropriate application.

---

# 31. Rename Conflicts

Git can detect renames.

For example:

```text
main:
old-name.js → new-name.js

feature:
old-name.js → another-name.js
```

Git may need human assistance to determine the intended result.

Rename handling is one reason merge conflicts are not limited to identical line edits.

---

# 32. Add/Add Conflict

Suppose both branches independently create:

```text
config.js
```

with different contents.

Git may report an add/add conflict.

Conceptually:

```text
main:
config.js

feature:
config.js
```

You must decide the final content.

---

# 33. Modify/Delete Conflict

Suppose:

```text
main:
modifies file.txt

feature:
deletes file.txt
```

Git cannot automatically know whether the modification or deletion should win.

You must resolve the conflict.

---

# 34. Delete/Modify Conflict

The inverse situation can occur:

```text
main:
deletes file.txt

feature:
modifies file.txt
```

Again, Git requires a resolution.

---

# 35. Merge Strategy

Git uses a merge strategy to determine how histories and trees are combined.

Modern Git generally uses the `ort` merge strategy for ordinary two-head merges.

You can inspect available strategies and behavior with Git documentation:

```cmd
git help merge
```

---

# 36. `ort` Strategy

`ort` is the modern default strategy for standard two-branch merges in current Git versions.

Its design focuses on:

```text
correctness
performance
rename handling
conflict reduction
```

You normally do not need to manually specify it.

---

# 37. Recursive Strategy

Older Git versions commonly used the `recursive` strategy for two-head merges.

You may encounter:

```cmd
git merge -s recursive feature
```

in older documentation or repositories.

Modern Git generally uses `ort` instead.

---

# 38. Strategy Options

Merge strategies can have strategy-specific options.

For example:

```cmd
git merge -X ours feature
```

and:

```cmd
git merge -X theirs feature
```

These are **not equivalent** to blindly selecting an entire branch in every situation.

`-X` supplies a merge strategy option for resolving certain conflicts.

Understand the distinction between:

```text
-X ours
```

and:

```text
-s ours
```

---

# 39. `-X ours`

Example:

```cmd
git merge -X ours feature
```

This tells the merge strategy to favor the current side in certain conflicting hunks.

It does **not** mean:

```text
ignore feature completely
```

Non-conflicting changes from the other branch can still be merged.

---

# 40. `-X theirs`

Example:

```cmd
git merge -X theirs feature
```

This tells the merge strategy to favor the other side in certain conflicts.

Again, it does not mean:

```text
replace everything with feature
```

It is a strategy option for conflict handling.

---

# 41. `-s ours`

The `ours` merge strategy is fundamentally different:

```cmd
git merge -s ours feature
```

It records a merge relationship while effectively keeping the current tree.

This is an advanced operation.

It should not be confused with:

```cmd
git merge -X ours feature
```

---

# 42. Merge Without Commit

You can perform the merge but prevent automatic commit creation:

```cmd
git merge --no-commit feature
```

This gives you an opportunity to inspect or modify the resulting index/worktree before committing.

Important:

If the merge is fast-forwardable, `--no-commit` alone cannot create a merge commit because there is no merge commit to pause before.

Use:

```cmd
git merge --no-ff --no-commit feature
```

if you need to force a merge commit and inspect the result before committing.

---

# 43. Merge Without Fast-Forward

```cmd
git merge --no-ff feature
```

This guarantees that Git creates a merge commit when the merge succeeds, rather than fast-forwarding.

This is useful when preserving branch topology is part of the repository's workflow.

---

# 44. Force Fast-Forward

You can require fast-forward behavior:

```cmd
git merge --ff-only feature
```

If the branches have diverged, Git refuses to create a merge commit.

This is useful when you want strict linear history.

---

# 45. Why `--ff-only` Is Useful

Suppose:

```text
        C → D
       /
A → B
       \
        E
```

If you run:

```cmd
git merge --ff-only feature
```

and a fast-forward is impossible, Git refuses.

This prevents an unexpected merge commit.

---

# 46. Merge Only Fast-Forward

A useful workflow:

```cmd
git switch main
git pull --ff-only
```

This ensures local `main` does not unexpectedly gain a merge commit during the pull operation.

---

# 47. Squash Merge

A squash merge combines the changes from a branch into the current branch as one new commit without creating a normal merge commit connecting the histories.

Command:

```cmd
git merge --squash feature
```

Then:

```cmd
git commit -m "Add authentication"
```

Conceptually:

```text
feature:
A → B → C → D

main:
A → B → S
```

where `S` contains the combined changes.

The feature commits are not recorded as parents of `S`.

---

# 48. Squash Merge vs Normal Merge

Normal merge:

```text
        C → D
       /     \
A → B         M
       \     /
        E → F
```

Squash:

```text
        C → D
       /
A → B → S
```

The resulting content may be similar, but the commit topology is different.

---

# 49. Squash Does Not Create Normal Merge Relationship

After:

```cmd
git merge --squash feature
git commit
```

Git does not create a two-parent merge commit.

Therefore Git does not record:

```text
feature tip
```

as a parent of the new commit.

This matters for future ancestry calculations.

---

# 50. Squash Workflow

Example:

```cmd
git switch main
git merge --squash feature/login
git status
git diff --cached
git commit -m "Add login functionality"
```

Then:

```cmd
git push
```

---

# 51. Merge vs Rebase

Merge:

```text
      C → D
     /     \
A → B       M
     \     /
      E → F
```

Rebase:

```text
A → B → C → E' → F'
```

Merge preserves the original branch topology.

Rebase creates new commits on a new base.

---

# 52. Merge Preserves Existing Commits

With a normal merge:

```text
C
```

remains:

```text
C
```

and:

```text
D
```

remains:

```text
D
```

A new merge commit:

```text
M
```

is added.

This is different from rebasing.

---

# 53. Merge Does Not Rewrite Existing History

A normal merge adds a new commit.

Example:

```text
Before:

A → B → C
     \
      D
```

After:

```text
A → B → C
     \   \
      D → M
```

The existing commits remain unchanged.

---

# 54. Merge Commit Parents

A merge commit has multiple parents.

Inspect:

```cmd
git show --no-patch --pretty=raw <merge-commit>
```

You may see multiple:

```text
parent <commit>
parent <commit>
```

A normal two-branch merge has two parents.

Octopus merges can have more.

---

# 55. Octopus Merge

Git can merge multiple heads simultaneously in certain cases:

```cmd
git merge branch1 branch2 branch3
```

This can produce an **octopus merge**.

Example:

```text
        branch1
           \
            \
             M
            /|\
           / | \
       branch2 branch3
```

Octopus merges are generally used when the heads can be merged without complex conflicts.

---

# 56. Octopus Limitation

If complicated conflicts require manual resolution, Git's normal octopus behavior may refuse the operation.

This is intentional.

For complicated integration, merging branches individually provides more control.

---

# 57. Merge Commit Inspection

Show merge commit:

```cmd
git show <merge-commit>
```

Show parents:

```cmd
git rev-list --parents -n 1 <merge-commit>
```

Visualize:

```cmd
git log --graph --oneline --decorate --all
```

---

# 58. First-Parent History

Merge commits create multiple ancestry paths.

To follow only the first-parent path:

```cmd
git log --first-parent
```

This is extremely useful for understanding the history of a main integration branch.

Example:

```text
main:
A → B → M → N → O
        \
         feature history
```

`--first-parent` follows:

```text
A → B → M → N → O
```

without traversing into the merged branch's internal history.

---

# 59. Why First-Parent Matters

For a release branch, you may want to see:

```text
feature A merged
feature B merged
bugfix C merged
```

rather than every individual commit from every feature.

Use:

```cmd
git log --first-parent --oneline main
```

This gives a high-level integration history.

---

# 60. Merge Commit Diff

A merge commit has multiple parents.

A normal:

```cmd
git show <merge>
```

may display a combined diff depending on context and Git configuration.

You can inspect differences against a specific parent.

For example:

```cmd
git diff <parent1> <merge>
```

and:

```cmd
git diff <parent2> <merge>
```

This helps identify what the merge introduced relative to each side.

---

# 61. Merge Tree

Git can calculate a merge result without necessarily creating a commit.

Advanced command:

```cmd
git merge-tree <branch1> <branch2>
```

This is useful for examining how Git would combine histories.

Modern Git versions provide additional merge-tree functionality.

Check:

```cmd
git help merge-tree
```

for version-specific options.

---

# 62. Merge Verification

After merging:

```cmd
git status
git log --graph --oneline --decorate --all
git diff HEAD^ HEAD
```

Then run project validation:

```text
tests
lint
build
type-check
integration tests
```

The exact commands depend on the project.

A successful Git merge does not guarantee a semantically correct application.

---

# 63. Merge Conflict Workflow

The complete workflow:

```cmd
git switch main
git merge feature
```

If conflict:

```cmd
git status
```

Inspect:

```cmd
git diff
```

Resolve files.

Stage:

```cmd
git add <resolved-file>
```

Verify:

```cmd
git status
```

Complete:

```cmd
git merge --continue
```

or:

```cmd
git commit
```

Then:

```cmd
git log --graph --oneline --decorate --all
```

Finally test and push.

---

# 64. Abort Workflow

If the merge becomes undesirable:

```cmd
git merge --abort
```

Then verify:

```cmd
git status
```

and:

```cmd
git log --graph --oneline --decorate --all
```

---

# 65. Merge and Working Tree

Git expects the working tree to be in an appropriate state before a merge.

Check:

```cmd
git status
```

before merging.

If you have unrelated uncommitted changes, consider committing or otherwise safely storing them before starting a complex merge.

---

# 66. Merge and Staging Area

The index is central to merge operations.

Conceptually:

```text
HEAD
 │
 ▼
current commit

INDEX
 │
 ▼
proposed merge result

WORKING TREE
 │
 ▼
files you see/edit
```

During conflicts, the index can contain multiple stages for conflicted paths.

---

# 67. Index Conflict Stages

Advanced Git users can inspect the index:

```cmd
git ls-files -u
```

During a conflict, entries can represent:

```text
stage 1 = common ancestor
stage 2 = ours
stage 3 = theirs
```

This is a powerful low-level view of merge conflicts.

---

# 68. Conflict Stages

Conceptually:

```text
Stage 1
common ancestor
       │
       ├─────────────┐
       ▼             ▼
Stage 2           Stage 3
ours              theirs
```

Git uses these versions to construct the conflict state.

Once you resolve and stage the file:

```cmd
git add file.txt
```

the unresolved multi-stage entries are replaced by the resolved result.

---

# 69. Merge Drivers

Git can use merge drivers to determine how particular files should be merged.

Configuration can be defined through:

```text
.gitattributes
```

and Git configuration.

This is useful for specialized file formats.

Example:

```text
*.generated merge=ours
```

The exact behavior depends on the configured merge driver.

---

# 70. `.gitattributes` and Merge Behavior

`.gitattributes` can define attributes that affect merge behavior.

For example:

```text
*.lock merge=ours
```

can be associated with a configured merge driver.

Do not blindly use `ours` for files merely because they frequently conflict.

The correct strategy depends on whether the file can safely discard changes.

---

# 71. Custom Merge Drivers

A custom merge driver can be configured in Git:

```cmd
git config merge.my-driver.driver "command"
```

Then referenced through attributes.

Example conceptually:

```text
*.custom merge=my-driver
```

This is an advanced repository customization mechanism.

---

# 72. Rerere

Git can record previous conflict resolutions using:

```cmd
git config rerere.enabled true
```

`rerere` means:

```text
reuse recorded resolution
```

When the same or sufficiently similar conflict appears again, Git can reuse a previously recorded resolution.

---

# 73. Rerere Workflow

Enable:

```cmd
git config --global rerere.enabled true
```

Resolve a conflict once.

Git records the resolution.

If a similar conflict appears again, Git may reuse the resolution.

This can be particularly useful during repeated rebases and complex long-lived branch integration.

---

# 74. Merge Verification With Tests

Git determines whether the histories and trees can be combined.

Your test suite determines whether the resulting software behaves correctly.

Therefore:

```text
successful merge
        ≠
correct application
```

Always validate important merges.

---

# 75. Merge Strategy Selection

Do not choose a merge strategy merely because it "avoids conflicts."

A strategy that silently discards valid changes can produce a technically successful but logically incorrect merge.

The correct priority is:

```text
correct result
   ↓
understand conflict
   ↓
resolve intentionally
   ↓
test result
```

---

# 76. Safe Integration Pattern

A disciplined integration flow:

```cmd
git switch main
git pull --ff-only

git merge --no-ff feature/login

git status
git log --graph --oneline --decorate --all

run tests

git push
```

If conflicts occur:

```cmd
git status
git diff
```

resolve:

```cmd
git add <files>
git merge --continue
```

Then test again.

---

# 77. Merge Best Practices

### Keep branches focused

Prefer:

```text
feature/authentication
```

over a branch containing unrelated:

```text
authentication
database redesign
UI redesign
logging changes
```

### Integrate regularly

Long-lived branches accumulate divergence.

### Update before merging

Know what changed on the target branch.

### Resolve conflicts intentionally

Never blindly accept one side without understanding the effect.

### Test after merging

The merge result is new software state.

---

# 78. Dangerous Merge Habits

Avoid:

```cmd
git merge -s ours feature
```

unless you specifically understand why you want to discard the merged branch's tree changes.

Avoid blindly using:

```cmd
git merge -X ours feature
```

just because conflict resolution is inconvenient.

Avoid resolving every conflict by selecting:

```text
ours
```

or:

```text
theirs
```

without examining the intended result.

---

# 79. Merge and Public History

A normal merge is generally safe for shared history because it does not rewrite existing commits.

Example:

```text
main:
A → B → C

feature:
    B → D → E
```

After merge:

```text
A → B → C ── M
     \      /
      D → E
```

Existing commits remain unchanged.

This is one reason merge is commonly used for integrating published branches.

---

# 80. Merge vs Force Push

Normal merge:

```text
existing history
      +
new merge commit
```

Force-pushed rebase:

```text
old history
      ↓
replaced branch history
```

These have very different collaboration implications.

Merge generally avoids rewriting the existing branch history.

---

# 81. Merge Base and Criss-Cross History

Advanced repositories can contain multiple plausible common ancestors because branches have previously been merged in complex ways.

Example:

```text
      C ─── M1
     / \   /
A → B   \ /
     \   X
      D ─ M2
```

Git's merge machinery may need to construct a suitable merge base from multiple ancestors.

This is one reason merge algorithms are more sophisticated than simply finding the first common commit.

---

# 82. Recursive Merge Bases

When multiple merge bases exist, Git may conceptually merge those bases to create a suitable virtual merge base before performing the final merge.

This helps Git handle complex historical topologies.

The details are implementation-specific and can vary with Git's merge strategy.

---

# 83. Merge and DAGs

Git's commit history is a **directed acyclic graph (DAG)**.

A normal commit has:

```text
one parent
```

A root commit has:

```text
zero parents
```

A normal merge commit has:

```text
two parents
```

An octopus merge can have:

```text
multiple parents
```

Branches are references into this graph.

---

# 84. Merge as Graph Operation

Before:

```text
        D
       /
A → B
       \
        F
```

After:

```text
        D
       / \
A → B     M
       \ /
        F
```

The merge adds a new graph node:

```text
M
```

with two parent edges.

---

# 85. Reachability After Merge

Before merge:

```text
main → D
feature → F
```

After:

```text
main → M
feature → F
```

From `M`, Git can reach:

```text
D
F
and all ancestors of D and F
```

This is why a merge commit connects both histories.

---

# 86. Merge and Commit IDs

A commit ID depends on the commit's content and metadata, including its parent information.

Therefore:

```text
same tree
+
different parents
=
different commit
```

A merge commit has unique identity because it has multiple parents and its own metadata.

---

# 87. Empty Merge

In certain situations, a merge may be requested where the trees do not introduce content changes but the graph relationship can still matter.

An explicit merge commit can sometimes be created with:

```cmd
git merge --no-ff <branch>
```

even when fast-forwarding might otherwise be possible.

The resulting merge commit preserves topology.

---

# 88. Merge Commit as Historical Event

A merge commit can represent:

```text
"These two lines of development were integrated here."
```

This is valuable for:

```text
release history
feature integration
auditability
first-parent logs
```

---

# 89. High-Level Decision Table

| Situation                      | Typical command                              |
| ------------------------------ | -------------------------------------------- |
| Simple ancestor relationship   | `git merge feature`                          |
| Require merge commit           | `git merge --no-ff feature`                  |
| Refuse non-FF merge            | `git merge --ff-only feature`                |
| Combine branch into one commit | `git merge --squash feature`                 |
| Conflict                       | resolve → `git add` → `git merge --continue` |
| Abandon merge                  | `git merge --abort`                          |
| Inspect graph                  | `git log --graph --oneline --decorate --all` |
| Find merge base                | `git merge-base main feature`                |
| Follow integration history     | `git log --first-parent`                     |

---

# 90. Essential Commands

```cmd
git merge <branch>

git merge --no-ff <branch>

git merge --ff-only <branch>

git merge --no-commit <branch>

git merge --squash <branch>

git merge --abort

git merge --continue

git merge-base <branch1> <branch2>

git log --graph --oneline --decorate --all

git log --first-parent
```

---

# 91. Advanced Diagnostics

```cmd
git status

git diff

git diff --name-only --diff-filter=U

git ls-files -u

git rev-list --parents -n 1 <merge-commit>

git show <merge-commit>

git merge-tree <branch1> <branch2>
```

These commands expose different layers of merge state:

```text
status
   ↓
working tree / index
   ↓
conflict stages
   ↓
commit graph
   ↓
merge topology
```

---

# 92. Complete Mental Model

When executing:

```cmd
git switch main
git merge feature
```

think:

```text
                 feature
                    │
                    ▼
                feature tip
                    │
                    │
main tip ───────────┤
      │             │
      └──────┬──────┘
             ▼
        find merge base
             │
             ▼
       perform 3-way merge
             │
       ┌─────┴─────┐
       │           │
    success      conflict
       │           │
       ▼           ▼
   merge commit   resolve
       │           │
       │           ▼
       │          add
       │           │
       └──────┬────┘
              ▼
          final main
```

---

# 93. Final Rules

Remember these:

```text
1. Merge integrates histories.

2. The current branch receives the merge result.

3. Fast-forward moves a branch pointer without creating
   a merge commit.

4. Diverged branches generally require a three-way merge.

5. A normal merge commit has multiple parents.

6. Conflicts are unresolved content decisions.

7. `--no-ff` preserves an explicit merge commit.

8. `--ff-only` prevents unexpected merge commits.

9. `--squash` combines changes without creating a normal
   merge relationship.

10. `git merge --abort` abandons an in-progress merge.

11. `git log --first-parent` is valuable for understanding
    integration history.

12. A successful merge does not guarantee correct software;
    always validate the resulting state.
```

The core model is:

```text
             branch A
                │
                ▼
           commit A2
              /
             /
common ─────●
             \
              \
           commit B2
                ▲
                │
             branch B


                 ↓ merge


           commit A2
              \   \
               \   \
common ─────────●─── M
               /   /
              /   /
           commit B2
```

**Merge is fundamentally a commit-graph operation that creates a new relationship between histories, with the working tree and index representing the resulting content.**

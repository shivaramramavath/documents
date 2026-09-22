# Git Cherry-Pick

## 1. What Is `git cherry-pick`?

`git cherry-pick` applies the changes introduced by one or more existing commits onto your current branch.

Basic syntax:

```cmd
git cherry-pick <commit>
```

Example:

```cmd
git cherry-pick a1b2c3d
```

Conceptually:

```text
source branch:

A ── B ── C
          ↑
       commit to copy


current branch:

A ── D

        ↓ cherry-pick C

A ── D ── C'
```

The **changes** introduced by `C` are applied to the current branch.

Git creates a **new commit** (`C'`) rather than moving the original commit itself.

---

# 2. Why Use Cherry-Pick?

Cherry-pick is useful when you need a specific change without merging an entire branch.

Common situations:

- applying a bug fix to another branch
- backporting a production fix
- moving a specific feature
- applying a security patch
- recovering a useful commit from another branch
- selectively transferring work between release branches
- applying a commit from an experimental branch
- transferring a small isolated change

Example:

```text
main:
A ── B ── C

feature:
A ── B ── D ── E ── F
```

If only `E` is needed on `main`:

```cmd
git switch main
git cherry-pick E
```

Result:

```text
A ── B ── C ── E'
```

You did not merge `D`, `E`, and `F`.

---

# 3. Cherry-Pick Works on Commits

Cherry-pick operates on commit objects.

You normally identify the commit using:

```cmd
git log --oneline
```

Example:

```text
f8a31d2 Fix authentication timeout
c92a761 Add authentication
a31f4e8 Add user model
```

Then:

```cmd
git cherry-pick f8a31d2
```

---

# 4. Basic Workflow

First inspect branches:

```cmd
git branch
```

Switch to the destination branch:

```cmd
git switch main
```

Find the desired commit:

```cmd
git log --oneline feature
```

Cherry-pick it:

```cmd
git cherry-pick <commit>
```

Verify:

```cmd
git log --oneline
```

---

# 5. Important Mental Model

Suppose:

```text
feature:

A ── B ── C
          ↑
          C
```

You run:

```cmd
git switch main
git cherry-pick C
```

Git does **not** move `C`.

Instead:

```text
main:

A ── D ── C'
```

where:

```text
C'
```

contains the changes introduced by:

```text
C
```

but has a different parent and therefore normally a different commit ID.

---

# 6. Cherry-Pick vs Merge

Suppose:

```text
main:
A ── B ── C

feature:
A ── B ── D ── E
```

### Merge

```cmd
git switch main
git merge feature
```

Result:

```text
        D ── E
       /      \
A ── B ── C ── M
```

The entire branch history is integrated.

### Cherry-pick

```cmd
git switch main
git cherry-pick E
```

Result:

```text
A ── B ── C ── E'
```

Only the changes from `E` are applied.

---

# 7. Cherry-Pick vs Rebase

### Cherry-pick

Copies selected commits onto the current branch.

```text
specific commit
      ↓
new branch
```

### Rebase

Replays a sequence of commits onto another base.

```text
multiple commits
      ↓
new base
```

Use:

```text
cherry-pick → selective transfer
rebase      → rewrite/rebase a sequence
```

---

# 8. Cherry-Pick vs Copying Files

Do not think of cherry-pick as:

```text
copy files
```

Think:

```text
identify commit
      ↓
calculate commit's patch
      ↓
apply patch to current HEAD
      ↓
create new commit
```

The commit's changes are applied relative to its parent.

---

# 9. Cherry-Picking a Commit

```cmd
git cherry-pick abc1234
```

If successful, Git creates a new commit.

Inspect:

```cmd
git log --oneline -1
```

You may see:

```text
7f91abc Fix authentication timeout
```

The new commit ID is different from:

```text
abc1234
```

---

# 10. Cherry-Picking Multiple Commits

You can specify multiple commits:

```cmd
git cherry-pick abc1234 def5678
```

Git applies them in the specified sequence.

Conceptually:

```text
abc1234
   ↓
def5678
   ↓
new commits
```

Order matters when commits depend on one another.

---

# 11. Cherry-Picking a Commit Range

You can cherry-pick a range:

```cmd
git cherry-pick A..D
```

This generally means:

```text
commits reachable from D
that are not reachable from A
```

The starting commit `A` itself is excluded.

Example:

```text
A ── B ── C ── D
```

```cmd
git cherry-pick A..D
```

selects:

```text
B
C
D
```

---

# 12. Inclusive Range

If you want to include the first commit explicitly, you can use:

```cmd
git cherry-pick A^..D
```

Example:

```text
A ── B ── C ── D
```

```cmd
git cherry-pick A^..D
```

selects:

```text
A
B
C
D
```

The `^` means the parent of `A`.

---

# 13. Cherry-Pick in a Release Branch

Example:

```text
main:
A ── B ── C ── D ── E

release/1.0:
A ── B ── C
```

Suppose `E` contains an important bug fix.

You can apply it:

```cmd
git switch release/1.0
git cherry-pick E
```

Result:

```text
main:
A ── B ── C ── D ── E

release/1.0:
A ── B ── C ── E'
```

This is a common **backporting** pattern.

---

# 14. Backporting

Backporting means applying a change from a newer development line to an older supported line.

Example:

```text
main
    ↓
new bug fix
    ↓
release/2.0
    ↓
release/1.0
```

If the fix is isolated:

```cmd
git switch release/1.0
git cherry-pick <fix-commit>
```

This avoids bringing unrelated newer features into the older release.

---

# 15. Cherry-Pick and Bug Fixes

Suppose:

```text
feature:
A ── B ── C ── D
          ↑
       bug fix
```

You need the bug fix on:

```text
release:
A ── B ── R
```

Use:

```cmd
git switch release
git cherry-pick C
```

Result:

```text
A ── B ── R ── C'
```

Now the release contains the fix without importing `D`.

---

# 16. Cherry-Pick Conflicts

Cherry-pick can produce conflicts.

Example:

```cmd
git cherry-pick abc1234
```

Git may report:

```text
CONFLICT (content): Merge conflict in file
```

Check:

```cmd
git status
```

Git tells you which files need resolution.

---

# 17. Resolving a Cherry-Pick Conflict

First inspect:

```cmd
git status
```

Open the conflicted files.

Resolve conflict markers:

```text
<<<<<<< HEAD
current branch
=======
cherry-picked changes
>>>>>>> abc1234
```

After resolving:

```cmd
git add <resolved-file>
```

Then:

```cmd
git cherry-pick --continue
```

Git creates the cherry-picked commit.

---

# 18. `git cherry-pick --continue`

Use:

```cmd
git cherry-pick --continue
```

after resolving a conflict.

Typical workflow:

```cmd
git status
git add .
git cherry-pick --continue
```

Git proceeds with the cherry-pick operation.

---

# 19. `git cherry-pick --abort`

If you decide the cherry-pick should not continue:

```cmd
git cherry-pick --abort
```

Git attempts to restore the state from before the cherry-pick operation began.

Use this when you want to completely abandon the current cherry-pick.

---

# 20. `git cherry-pick --quit`

You can also use:

```cmd
git cherry-pick --quit
```

This stops the cherry-pick sequence without attempting to reset the working tree and index to their pre-operation state.

Conceptually:

```text
--abort
    ↓
stop + attempt to restore pre-operation state

--quit
    ↓
stop operation + leave current state
```

---

# 21. `--no-commit`

By default:

```cmd
git cherry-pick abc1234
```

applies the change and creates a commit.

With:

```cmd
git cherry-pick --no-commit abc1234
```

or:

```cmd
git cherry-pick -n abc1234
```

Git applies the changes but does not create the commit automatically.

This gives you an opportunity to modify the result before committing.

---

# 22. `--no-commit` Workflow

```cmd
git cherry-pick --no-commit abc1234
```

Inspect:

```cmd
git status
git diff
```

Modify if necessary.

Stage:

```cmd
git add .
```

Then create your own commit:

```cmd
git commit -m "Apply authentication fix"
```

This is useful when the original commit's exact message or content should not be preserved as-is.

---

# 23. `--edit`

You can explicitly request commit-message editing:

```cmd
git cherry-pick --edit abc1234
```

Short form:

```cmd
git cherry-pick -e abc1234
```

Git opens the editor so you can modify the resulting commit message.

---

# 24. `--no-edit`

If you do not want Git to open the editor:

```cmd
git cherry-pick --no-edit abc1234
```

This accepts the automatically generated commit message.

---

# 25. Cherry-Pick and Commit Messages

A cherry-picked commit normally retains the original commit message.

Example source:

```text
abc1234 Fix authentication timeout
```

After cherry-pick:

```text
def5678 Fix authentication timeout
```

The message is usually the same, while the commit ID is different.

---

# 26. `-x`

The `-x` option adds information indicating where the commit was cherry-picked from.

```cmd
git cherry-pick -x abc1234
```

The resulting commit message can include a line identifying the original commit.

This can be useful for tracking backports across branches.

It is particularly useful when maintaining release branches where you want the origin of a change to remain visible.

---

# 27. `--signoff`

You can use:

```cmd
git cherry-pick --signoff abc1234
```

or:

```cmd
git cherry-pick -s abc1234
```

This adds a `Signed-off-by` line to the resulting commit message according to Git's signoff mechanism.

Example:

```text
Fix authentication timeout

Signed-off-by: Developer Name <developer@example.com>
```

---

# 28. `--strategy`

Cherry-pick can accept a merge strategy:

```cmd
git cherry-pick --strategy=<strategy> <commit>
```

For example:

```cmd
git cherry-pick --strategy=ort abc1234
```

The strategy controls how Git performs the underlying merge machinery when applying the commit.

---

# 29. `-X` Strategy Options

You can pass strategy-specific options:

```cmd
git cherry-pick -X<option> <commit>
```

For example:

```cmd
git cherry-pick -Xours abc1234
```

or:

```cmd
git cherry-pick -Xtheirs abc1234
```

These affect conflict resolution behavior during the underlying merge operation.

Use these only when you understand which side represents the current branch and which side represents the cherry-picked commit.

---

# 30. Cherry-Picking Merge Commits

A normal commit has one parent:

```text
A ── B ── C
```

A merge commit can have multiple parents:

```text
       D
      / \
A ── B   M
      \ /
       C
```

Cherry-picking a merge commit requires Git to know which parent should be treated as the mainline.

Use:

```cmd
git cherry-pick -m <parent-number> <merge-commit>
```

Example:

```cmd
git cherry-pick -m 1 abc1234
```

---

# 31. What Does `-m 1` Mean?

Suppose merge commit `M` has:

```text
parent 1 → main branch
parent 2 → feature branch
```

Then:

```cmd
git cherry-pick -m 1 M
```

tells Git:

```text
Treat parent 1 as the mainline.
Apply the changes introduced by M
relative to parent 1.
```

The parent number is not arbitrary.

Inspect the merge commit:

```cmd
git show --summary M
```

or:

```cmd
git rev-list --parents -n 1 M
```

---

# 32. Why Merge Commit Cherry-Picks Are Tricky

A merge commit does not represent a single linear change in the same way as an ordinary commit.

It represents the result of combining histories.

Therefore Git needs:

```text
mainline parent
```

to calculate:

```text
merge result - selected parent
```

That difference becomes the patch to apply.

---

# 33. Cherry-Pick an Empty Commit

Sometimes the changes introduced by a commit already exist on the destination branch.

Then cherry-pick may become empty.

Git may report that the cherry-picked commit is empty.

Check:

```cmd
git status
```

You may be able to continue with:

```cmd
git cherry-pick --skip
```

if the commit does not need to be represented separately.

---

# 34. Empty Commit Preservation

If you intentionally want to preserve the commit even though Git considers it empty, advanced workflows can use:

```cmd
git cherry-pick --allow-empty <commit>
```

This allows an empty commit to be created.

Use this only when the existence of the commit itself has meaning.

---

# 35. Cherry-Pick and Duplicate Changes

Suppose:

```text
main:
A ── B ── C

feature:
A ── B ── D
```

If the change from `D` has already been independently implemented in `main`, cherry-picking `D` may:

- become empty
- conflict
- produce a duplicate logical change

Git operates on patches and ancestry; it does not automatically understand your application's semantic intent.

---

# 36. Cherry-Pick Does Not Preserve Original Ancestry

Suppose:

```text
feature:
A ── B ── C
```

Cherry-pick `C` onto:

```text
release:
A ── B ── R
```

Result:

```text
A ── B ── R ── C'
```

`C'` does not have `B` as its parent.

Its parent is:

```text
R
```

Therefore:

```text
C' ≠ C
```

even if the file changes are identical.

---

# 37. Cherry-Pick and Patch Equivalence

Two commits can introduce equivalent changes but have different IDs.

Example:

```text
C  → patch P
C' → same patch P
```

but:

```text
C.id  != C'.id
```

because commit identity depends on more than the resulting file contents.

This is why cherry-pick creates a new commit.

---

# 38. Cherry-Pick and Dependencies

Suppose:

```text
A ── B ── C ── D
```

where:

```text
C depends on B
D depends on C
```

Cherry-picking only:

```cmd
git cherry-pick D
```

may fail or produce an incomplete result if the destination branch lacks the prerequisite changes.

Therefore, before cherry-picking a commit, determine its dependencies.

Inspect:

```cmd
git show D
```

and:

```cmd
git log --oneline --ancestry-path <base>..D
```

---

# 39. Cherry-Pick a Dependency Chain

If you need:

```text
B
C
D
```

rather than only `D`:

```cmd
git cherry-pick B C D
```

or use an appropriate range:

```cmd
git cherry-pick B^..D
```

The exact range should be chosen based on the branch topology.

---

# 40. Cherry-Pick With a Branch Reference

You can use a branch name to identify a commit:

```cmd
git cherry-pick feature
```

This cherry-picks the commit currently referenced by `feature`.

It does **not** merge the entire branch.

For example:

```text
feature → E
```

means:

```cmd
git cherry-pick feature
```

is effectively targeting:

```text
E
```

---

# 41. Cherry-Pick a Remote-Tracking Branch Commit

After fetching:

```cmd
git fetch origin
```

you can inspect:

```cmd
git log --oneline origin/feature
```

Then:

```cmd
git cherry-pick <commit>
```

or, if the branch tip itself is the desired commit:

```cmd
git cherry-pick origin/feature
```

---

# 42. Cherry-Pick With `FETCH_HEAD`

After:

```cmd
git fetch origin
```

Git may update `FETCH_HEAD`.

You can inspect:

```cmd
git log --oneline FETCH_HEAD
```

A specific fetched commit can then be cherry-picked by its object ID.

---

# 43. Cherry-Pick Sequence State

During a multi-commit cherry-pick:

```cmd
git cherry-pick A B C
```

Git maintains state for the ongoing operation.

If a conflict occurs:

```cmd
git status
```

shows that a cherry-pick is in progress.

After resolving:

```cmd
git cherry-pick --continue
```

Git proceeds to the next commit.

---

# 44. Inspecting the Current Cherry-Pick

During a conflict:

```cmd
git status
```

is the first command to use.

Then inspect:

```cmd
git diff
```

and:

```cmd
git diff --cached
```

The first shows unstaged differences.

The second shows staged changes.

---

# 45. Cherry-Pick and `ORIG_HEAD`

Git can maintain special references during operations.

After operations that move `HEAD`, `ORIG_HEAD` may help identify the previous position.

Inspect:

```cmd
git show ORIG_HEAD
```

This can be useful when diagnosing a complex history operation.

For recovery work, also use:

```cmd
git reflog
```

---

# 46. Cherry-Pick and Reflog

If you accidentally cherry-pick or otherwise alter your branch:

```cmd
git reflog
```

can help identify previous `HEAD` positions.

Example:

```text
abc1234 HEAD@{0}: cherry-pick: Fix authentication
def5678 HEAD@{1}: checkout: moving from feature to main
```

The reflog can be extremely useful during recovery.

---

# 47. Cherry-Pick and Signed Commits

Cherry-picking creates a new commit.

Therefore, cryptographic signatures associated with the original commit do not automatically make the new commit the same signed object.

If your project requires signed commits, you should understand your signing policy before backporting signed commits.

Possible signing workflows involve:

```cmd
git cherry-pick -S <commit>
```

where supported by your configured signing setup.

---

# 48. Cherry-Pick and Author Information

The resulting commit generally preserves the original author's identity while the person performing the cherry-pick becomes the committer.

Conceptually:

```text
Original:

Author:    Developer A
Committer: Developer A

Cherry-picked:

Author:    Developer A
Committer: Developer B
```

This distinction matters when auditing history.

Inspect with:

```cmd
git show --format=fuller <commit>
```

---

# 49. Cherry-Pick and Commit Metadata

A commit contains metadata such as:

```text
tree
parent
author
committer
message
```

When cherry-picking:

```text
original commit
      ↓
patch applied
      ↓
new commit
```

The new commit has a new parent and new commit metadata.

Therefore its object identity changes.

---

# 50. Cherry-Pick a Bug Fix Across Releases

Example:

```text
main:
A ── B ── C ── D ── E

release/2.0:
A ── B ── C ── R
```

`D` is a security fix.

Apply it:

```cmd
git switch release/2.0
git cherry-pick -x D
```

Now:

```text
main:
A ── B ── C ── D ── E

release/2.0:
A ── B ── C ── R ── D'
```

`-x` provides traceability back to the original commit.

---

# 51. Cherry-Pick Multiple Related Fixes

Suppose:

```text
main:

A ── B ── C ── D ── E ── F
          ↑         ↑
          fix 1     fix 2
```

You need both fixes:

```cmd
git switch release
git cherry-pick C E
```

If `E` depends on `D`, however, you may need:

```cmd
git cherry-pick C D E
```

Always inspect dependencies before selecting isolated commits.

---

# 52. Cherry-Pick With `--no-commit` for Combining Changes

Suppose you need:

```text
A
B
C
```

but want a single destination commit.

Use:

```cmd
git cherry-pick --no-commit A
git cherry-pick --no-commit B
git cherry-pick --no-commit C
```

Then:

```cmd
git commit -m "Backport authentication fixes"
```

This creates one destination commit containing all three changes.

---

# 53. Cherry-Pick and Review

Before cherry-picking:

```cmd
git show --stat <commit>
```

Then:

```cmd
git show <commit>
```

Check:

- files changed
- additions
- deletions
- dependencies
- commit message
- author
- parent
- whether the change belongs on the target branch

Then execute:

```cmd
git cherry-pick <commit>
```

---

# 54. A Safe Cherry-Pick Workflow

```cmd
git status
```

Ensure your working tree is clean.

Then:

```cmd
git switch <destination-branch>
```

Find the source commit:

```cmd
git log --oneline <source-branch>
```

Inspect:

```cmd
git show <commit>
```

Cherry-pick:

```cmd
git cherry-pick <commit>
```

Verify:

```cmd
git log --oneline -5
git status
```

Run your tests.

---

# 55. Conflict Workflow

```cmd
git cherry-pick <commit>
```

If conflict:

```cmd
git status
```

Resolve files.

Stage:

```cmd
git add <resolved-files>
```

Continue:

```cmd
git cherry-pick --continue
```

If another conflict appears:

```text
resolve
   ↓
git add
   ↓
git cherry-pick --continue
```

Repeat until complete.

---

# 56. Cancel Workflow

If you want to abandon the operation:

```cmd
git cherry-pick --abort
```

Then verify:

```cmd
git status
```

and:

```cmd
git log --oneline -5
```

---

# 57. Common Mistake: Cherry-Picking the Wrong Branch

Suppose:

```text
main
release
feature
```

You intend:

```text
feature → release
```

but accidentally run:

```cmd
git switch main
git cherry-pick <feature-commit>
```

The commit is now on `main`.

Always verify:

```cmd
git branch --show-current
```

before cherry-picking.

---

# 58. Common Mistake: Cherry-Picking a Commit Without Dependencies

Do not assume:

```text
one commit = one independent feature
```

A commit may depend on:

```text
previous commit
database migration
configuration
API change
type definition
test helper
```

Inspect the surrounding history before cherry-picking.

---

# 59. Common Mistake: Cherry-Picking a Merge Commit Without `-m`

This:

```cmd
git cherry-pick <merge-commit>
```

may fail for a merge commit.

Use:

```cmd
git cherry-pick -m 1 <merge-commit>
```

after determining the correct mainline parent.

---

# 60. Common Mistake: Treating Cherry-Pick as a Permanent Link

Cherry-pick does not create a live relationship between branches.

After:

```cmd
git cherry-pick C
```

the destination contains a new commit:

```text
C'
```

Future changes to `C` or its source branch do not automatically propagate.

---

# 61. Cherry-Pick Is Selective Integration

Think:

```text
merge:
    branch → branch

rebase:
    sequence → new base

cherry-pick:
    commit → current branch
```

This is the central distinction.

---

# 62. Advanced Example

Initial:

```text
main:

A ── B ── C ── D
```

Feature:

```text
A ── B ── E ── F ── G
```

Suppose:

```text
E = unrelated feature
F = security fix
G = UI feature
```

You need only the security fix on `main`.

Run:

```cmd
git switch main
git cherry-pick F
```

Result:

```text
A ── B ── C ── D ── F'
```

But before doing this, inspect whether `F` depends on `E`.

If it does, cherry-picking only `F` may not be valid.

---

# 63. Advanced Example: Backport With Traceability

Source:

```text
main:

A ── B ── C ── D
              ↑
          security fix
```

Destination:

```text
release:

A ── B ── R
```

Run:

```cmd
git switch release
git cherry-pick -x D
```

Result:

```text
A ── B ── R ── D'
```

The new commit represents the same logical fix while maintaining a trace to the original commit.

---

# 64. Advanced Example: Selective Commit Series

Source:

```text
A ── B ── C ── D ── E ── F
```

Suppose you need:

```text
B
D
F
```

You can use:

```cmd
git cherry-pick B D F
```

Git applies them sequentially.

However, if:

```text
D depends on C
```

then this selective sequence may not be valid.

Cherry-pick is selective, but it cannot eliminate logical dependencies.

---

# 65. Cherry-Pick and Patch Conflicts

A conflict means Git could not cleanly apply the selected commit's changes to the current state.

It does not necessarily mean the source commit is wrong.

It means:

```text
source patch
     +
current destination state
     ↓
ambiguous overlapping changes
```

You must decide what the correct combined result should be.

---

# 66. Cherry-Pick and `rerere`

If you repeatedly resolve similar conflicts, Git's `rerere` feature can remember conflict resolutions.

Enable:

```cmd
git config rerere.enabled true
```

Then Git can reuse recorded resolutions when the same conflict pattern occurs again.

This is especially useful for repeated backports across release branches.

---

# 67. Cherry-Pick and Automation

Cherry-pick can be incorporated into release automation.

Example conceptual workflow:

```text
bug fixed on main
       ↓
identify fix commit
       ↓
backport to supported releases
       ↓
test
       ↓
release
```

Automation should still verify:

- dependencies
- conflicts
- tests
- compatibility
- release-specific behavior

---

# 68. Cherry-Pick and CI

After cherry-picking into a release branch:

```cmd
git push origin release/2.0
```

CI can validate:

```text
compile
↓
unit tests
↓
integration tests
↓
security checks
↓
release validation
```

Cherry-picking a commit does not guarantee that the change is compatible with the destination branch.

---

# 69. Cherry-Pick and Code Review

A clean workflow is:

```text
feature branch
     ↓
commit
     ↓
review
     ↓
merge to main
     ↓
identify required backport
     ↓
cherry-pick to release
     ↓
test
     ↓
release
```

For important backports, preserve traceability with:

```cmd
git cherry-pick -x <commit>
```

when appropriate for your project's policy.

---

# 70. Useful Inspection Commands

Show commit:

```cmd
git show <commit>
```

Show only statistics:

```cmd
git show --stat <commit>
```

Show commit metadata:

```cmd
git show --format=fuller <commit>
```

Show parent information:

```cmd
git rev-list --parents -n 1 <commit>
```

Find commit:

```cmd
git log --oneline --all
```

Inspect branch history:

```cmd
git log --graph --oneline --decorate --all
```

---

# 71. Cherry-Pick Command Reference

### Single commit

```cmd
git cherry-pick <commit>
```

### Multiple commits

```cmd
git cherry-pick <commit1> <commit2> <commit3>
```

### Range

```cmd
git cherry-pick A..D
```

### Inclusive range

```cmd
git cherry-pick A^..D
```

### No automatic commit

```cmd
git cherry-pick -n <commit>
```

### Edit message

```cmd
git cherry-pick -e <commit>
```

### No message editing

```cmd
git cherry-pick --no-edit <commit>
```

### Add source reference

```cmd
git cherry-pick -x <commit>
```

### Add signoff

```cmd
git cherry-pick -s <commit>
```

### Merge commit

```cmd
git cherry-pick -m <parent-number> <merge-commit>
```

### Continue

```cmd
git cherry-pick --continue
```

### Skip

```cmd
git cherry-pick --skip
```

### Abort

```cmd
git cherry-pick --abort
```

### Quit

```cmd
git cherry-pick --quit
```

---

# 72. Most Important Options

```text
-n, --no-commit
    apply changes without creating a commit

-e, --edit
    edit commit message

--no-edit
    use generated message without editing

-x
    append source commit reference

-s, --signoff
    add Signed-off-by line

-m <parent-number>
    select mainline parent for merge commits

--abort
    cancel current cherry-pick sequence

--continue
    continue after conflict resolution

--skip
    omit current commit

--quit
    stop cherry-pick operation without resetting state

--strategy=<strategy>
    select merge strategy

-X<option>
    pass strategy option

--allow-empty
    allow an empty cherry-picked commit
```

---

# 73. Cherry-Pick Decision Tree

Use **merge** when:

```text
I want the branch's history and changes.
```

Use **rebase** when:

```text
I want to replay a sequence onto another base.
```

Use **cherry-pick** when:

```text
I need specific commit(s) only.
```

Use:

```text
cherry-pick -x
```

when:

```text
I need traceability for a backported change.
```

Use:

```text
cherry-pick -n
```

when:

```text
I want the changes but need to construct the final commit myself.
```

Use:

```text
cherry-pick -m
```

when:

```text
I need to cherry-pick a merge commit.
```

---

# 74. Professional Backport Checklist

Before cherry-picking:

```text
[ ] Confirm destination branch
[ ] Confirm source commit
[ ] Inspect the commit
[ ] Inspect parent/dependencies
[ ] Check whether the change already exists
[ ] Ensure working tree is clean
[ ] Check branch protection/team policy
```

Execute:

```cmd
git cherry-pick -x <commit>
```

If conflict:

```cmd
git status
```

Resolve:

```cmd
git add <files>
git cherry-pick --continue
```

Afterward:

```text
[ ] Inspect resulting commit
[ ] Run tests
[ ] Check diff
[ ] Push branch
```

---

# 75. Final Mental Model

```text
SOURCE BRANCH

A ── B ── C
          ↑
      selected commit
          │
          │
          ▼
      calculate patch
          │
          ▼
CURRENT BRANCH

A ── D
      │
      ▼
      C'
```

The fundamental rule is:

```text
git cherry-pick does not copy the commit object itself.

It applies the changes introduced by the commit
and creates a new commit on the current branch.
```

Therefore:

```text
original commit
      ↓
     patch
      ↓
destination state
      ↓
new commit
```

And:

```text
original commit ID ≠ cherry-picked commit ID
```

The most important practical use is **selective integration**, especially **backporting isolated fixes to release branches**.

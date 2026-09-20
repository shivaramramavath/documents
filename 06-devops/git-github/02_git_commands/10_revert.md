# `git revert`

`git revert` is used to **undo the changes introduced by an existing commit without rewriting Git history**.

This makes `git revert` the preferred command for undoing commits that have already been pushed to a shared remote repository.

The key difference:

```text
git reset
    moves branch history

git revert
    creates a new commit that reverses an existing commit
```

---

# 1. Basic Syntax

```cmd
git revert <commit>
```

Examples:

```cmd
git revert abc1234
```

```cmd
git revert HEAD
```

```cmd
git revert HEAD~1
```

Multiple commits:

```cmd
git revert <commit1> <commit2>
```

A range can also be reverted:

```cmd
git revert <oldest>^..<newest>
```

---

# 2. The Core Idea

Suppose your history is:

```text
A ── B ── C
         ↑
        HEAD
```

Commit `C` introduced a bug.

Instead of moving the branch back:

```text
A ── B
```

`git revert` creates a new commit:

```text
A ── B ── C ── D
              ↑
             HEAD
```

Where:

```text
D = inverse of C
```

The original commit `C` remains in history.

---

# 3. Why Revert Is Different From Reset

### Reset

```cmd
git reset --hard B
```

Result:

```text
A ── B
```

The branch no longer points to `C`.

### Revert

```cmd
git revert C
```

Result:

```text
A ── B ── C ── D
```

`D` reverses `C`.

---

# 4. Revert Does Not Delete the Original Commit

After:

```cmd
git revert C
```

Git history contains:

```text
C
↓
original change

D
↓
inverse change
```

Both commits remain part of history.

This is important for:

```text
auditability
collaboration
code review
shared branches
CI/CD
release history
```

---

# 5. Revert `HEAD`

To undo the latest commit:

```cmd
git revert HEAD
```

Git creates a new commit.

Example:

```text
Before:

A ── B ── C
         ↑
        HEAD
```

After:

```text
A ── B ── C ── D
              ↑
             HEAD
```

`D` reverses `C`.

---

# 6. Revert a Specific Commit

Find the commit:

```cmd
git log --oneline
```

Example:

```text
91abcde Add authentication
72def12 Add logging
42abcde Initial implementation
```

To reverse the authentication commit:

```cmd
git revert 91abcde
```

Git creates a new commit that reverses the changes from `91abcde`.

---

# 7. Revert a Commit That Is Not HEAD

Suppose:

```text
A ── B ── C ── D
```

You want to undo `B`.

Run:

```cmd
git revert B
```

Result conceptually:

```text
A ── B ── C ── D ── E
```

`E` reverses the changes introduced by `B`.

This can cause conflicts because later commits may depend on the changes made by `B`.

---

# 8. Revert Does Not Simply Move Back

This is a critical distinction.

```cmd
git revert B
```

does not mean:

```text
move HEAD to B
```

Instead:

```text
take changes introduced by B
        ↓
calculate inverse patch
        ↓
apply inverse patch
        ↓
create new commit
```

---

# 9. The Revert Workflow

Conceptually:

```text
Existing commit
      ↓
Determine its changes
      ↓
Calculate inverse changes
      ↓
Apply inverse changes
      ↓
Stage resulting changes
      ↓
Create new commit
```

---

# 10. Revert Usually Opens an Editor

Running:

```cmd
git revert HEAD
```

usually creates a default commit message such as:

```text
Revert "Original commit message"
```

Git may open your configured editor.

Save and close the editor to complete the commit.

---

# 11. `--no-edit`

To accept the automatically generated revert message:

```cmd
git revert --no-edit HEAD
```

This is useful when you do not need to modify the message.

---

# 12. `--edit`

Explicitly allow editing the revert commit message:

```cmd
git revert --edit HEAD
```

This is generally the default behavior.

---

# 13. Revert Without Automatically Committing

Use:

```cmd
git revert --no-commit <commit>
```

or:

```cmd
git revert -n <commit>
```

This applies the inverse changes but does not create the revert commit immediately.

Example:

```cmd
git revert --no-commit HEAD
```

Now inspect:

```cmd
git status
```

Then:

```cmd
git diff
```

Finally:

```cmd
git commit
```

---

# 14. Why Use `--no-commit`?

It allows you to:

```text
inspect the inverse changes
modify them
combine multiple reverts
create a custom commit
perform additional changes
```

Example:

```cmd
git revert --no-commit A
git revert --no-commit B
git commit -m "Revert problematic changes"
```

---

# 15. Multiple Commits

You can revert multiple commits:

```cmd
git revert <commit1> <commit2>
```

Git processes the requested commits and creates revert commits as appropriate.

For a carefully controlled sequence, it is often clearer to understand the order of the commits and inspect the resulting changes.

---

# 16. Reverting a Range

Suppose:

```text
A ── B ── C ── D ── E
```

You want to revert:

```text
C
D
E
```

Use:

```cmd
git revert C^..E
```

The `^` is important.

It makes the range include `C`.

Without it:

```text
C..E
```

means commits after `C` through `E`.

---

# 17. Range Syntax

Git's range:

```cmd
C^..E
```

means:

```text
include C
through E
```

Example:

```cmd
git revert abc123^..def456
```

---

# 18. Revert Range Ordering

When reverting a sequence of commits, Git must apply inverse changes in a way that preserves the logical result.

For example:

```text
A ── B ── C ── D
```

If reverting the whole sequence:

```cmd
git revert B^..D
```

Git processes the requested commits according to Git's revert machinery.

When conflicts occur, resolve them based on the desired final state rather than blindly choosing "ours" or "theirs."

---

# 19. Revert Conflict

A revert can produce conflicts.

Example:

```text
A ── B ── C
```

Suppose `B` changed:

```text
app.js
```

and `C` subsequently modified the same lines.

Now:

```cmd
git revert B
```

may not be able to cleanly apply the inverse of `B`.

Git can stop with a conflict.

---

# 20. Check Revert Status

When a conflict occurs:

```cmd
git status
```

Git will show files requiring resolution.

Then inspect:

```cmd
git diff
```

---

# 21. Resolve Revert Conflict

Edit the conflicted files.

Then:

```cmd
git add <resolved-file>
```

After all conflicts are resolved:

```cmd
git revert --continue
```

---

# 22. Continue

The standard sequence is:

```cmd
git revert <commit>
```

If conflict occurs:

```cmd
git status
```

Resolve files.

Then:

```cmd
git add .
```

Then:

```cmd
git revert --continue
```

---

# 23. Abort a Revert

If you decide not to continue:

```cmd
git revert --abort
```

This attempts to restore the repository to the state it had before the revert operation began.

---

# 24. Revert Status Lifecycle

```text
git revert <commit>
        ↓
    conflict?
      /   \
    no     yes
    ↓       ↓
 commit   resolve
            ↓
          git add
            ↓
    git revert --continue
```

Or:

```cmd
git revert --abort
```

to abandon the operation.

---

# 25. `git revert --quit`

Git also provides:

```cmd
git revert --quit
```

This stops the revert operation's sequencer state without necessarily resetting the working tree and index.

Use it only when you understand the state you want to preserve.

---

# 26. Reverting a Merge Commit

Reverting a merge commit is more complicated because a merge has multiple parents.

Example:

```text
      B
     / \
A ──    M
     \ /
      C
```

`M` has two parents.

Git needs to know which parent should be considered the mainline.

Use:

```cmd
git revert -m <parent-number> <merge-commit>
```

---

# 27. `-m` / `--mainline`

Syntax:

```cmd
git revert -m <parent-number> <merge-commit>
```

Example:

```cmd
git revert -m 1 abc1234
```

The `1` means:

```text
treat parent 1 as the mainline
```

---

# 28. Why Merge Reverts Need `-m`

A normal commit has:

```text
one parent
```

A merge commit has:

```text
two or more parents
```

Git needs to determine:

```text
Which parent represents the mainline?
```

Therefore:

```cmd
git revert -m 1 <merge-commit>
```

or:

```cmd
git revert -m 2 <merge-commit>
```

may produce different results.

---

# 29. Inspect Merge Parents

Before reverting a merge:

```cmd
git show <merge-commit>
```

or:

```cmd
git log --graph --oneline --decorate --all
```

You can inspect the parents with:

```cmd
git rev-list --parents -n 1 <merge-commit>
```

Example output:

```text
merge123 parentA parentB
```

Then:

```text
parentA = parent 1
parentB = parent 2
```

---

# 30. Example Merge Revert

Suppose:

```text
        feature
       /      \
A ─── B        M ── N
       \      /
        C ───
```

If `M` merged the feature into the main branch and you want to reverse that merge:

```cmd
git revert -m 1 M
```

Git creates a new commit that reverses the changes introduced by the merged side relative to parent 1.

---

# 31. Important Merge-Revert Consequence

Reverting a merge does **not** mean Git forgets that the merge happened.

The merge commit remains:

```text
M
```

and the new revert commit records:

```text
reverse M's changes
```

This matters when attempting to merge the same branch again later.

---

# 32. Reverting a Revert

Suppose:

```text
A ── B ── C ── R
```

where:

```text
C = original change
R = revert of C
```

If you later want the original change back:

```cmd
git revert R
```

This creates another commit:

```text
A ── B ── C ── R ── R2
```

Conceptually:

```text
C
    adds change

R
    removes change

R2
    adds change again
```

---

# 33. Why Revert of Revert Works

Because a revert is itself a commit.

Therefore:

```text
original commit
       ↓
revert commit
       ↓
revert the revert
```

The second revert applies the inverse of the first inverse.

---

# 34. Revert and Shared Branches

Suppose:

```text
local:
A ── B ── C

remote:
A ── B ── C
```

If `C` is bad:

```cmd
git revert C
```

Result:

```text
local:
A ── B ── C ── D

remote:
A ── B ── C
```

Then:

```cmd
git push
```

No history rewrite is necessary.

---

# 35. Why Revert Is Collaboration-Friendly

Revert preserves:

```text
commit ancestry
commit IDs
branch topology
shared history
audit trail
```

Therefore it is normally safer for:

```text
main
master
release
production
shared feature branches
```

when the unwanted commit has already been pushed.

---

# 36. Reset vs Revert

```text
                    RESET              REVERT

Creates new commit?  No                Yes

Rewrites history?    Usually yes        No

Original commit      May become         Remains
                     unreachable

Safe for shared      Usually no         Usually yes
history?

Undo changes?        Depends on mode    Yes

Typical purpose      Rewrite local      Undo public
                     history            changes
```

---

# 37. Revert vs Restore

These commands operate at different conceptual levels.

### Revert

```cmd
git revert <commit>
```

Undo a **commit** by creating another commit.

### Restore

```cmd
git restore <file>
```

Restore **file content** in the working tree/index.

Therefore:

```text
commit-level undo
    git revert

file-level restoration
    git restore
```

---

# 38. Revert vs Reset vs Restore

```text
git reset
    manipulate HEAD/index/working tree

git revert
    create a new commit reversing another commit

git restore
    restore file content
```

This distinction is fundamental.

---

# 39. Revert and Working-Tree Changes

Before reverting, check:

```cmd
git status
```

A dirty working tree can complicate a revert.

Prefer beginning from a known state:

```cmd
git status
```

If necessary, commit or stash unrelated work before starting a complicated revert.

---

# 40. Inspect the Commit First

Before:

```cmd
git revert abc1234
```

inspect:

```cmd
git show abc1234
```

Also useful:

```cmd
git diff abc1234^ abc1234
```

This tells you exactly what the commit changed.

---

# 41. Inspect the Result

After a revert:

```cmd
git status
```

Then:

```cmd
git show HEAD
```

And:

```cmd
git diff HEAD^ HEAD
```

The new commit should represent the inverse of the original change, subject to conflict resolution and subsequent repository state.

---

# 42. Revert Commit Message

Typical generated message:

```text
Revert "Add authentication"

This reverts commit abc1234...
```

This is useful because the history clearly documents:

```text
what was reverted
which commit was reverted
why the history contains an inverse change
```

---

# 43. Custom Revert Message

Using `--no-commit`:

```cmd
git revert --no-commit abc1234
```

Then:

```cmd
git commit -m "Disable broken authentication change"
```

This is useful when the default message does not adequately explain the operational reason.

---

# 44. Revert in Release Management

Suppose release history is:

```text
v1
 ↓
feature A
 ↓
feature B
 ↓
buggy feature C
```

Instead of rewriting the release branch:

```cmd
git revert <feature-C-commit>
```

you can create:

```text
revert feature C
```

and preserve the release history.

---

# 45. Revert in Production

If a production commit is already deployed:

```text
deploy
  ↓
bad commit
```

a common Git workflow is:

```cmd
git revert <bad-commit>
git push
```

Then CI/CD can build and deploy the new revert commit.

The exact deployment behavior depends on the project's release pipeline.

---

# 46. Revert Does Not Fix Every Bug

Reverting a commit reverses the changes introduced by that commit.

It does not necessarily restore the repository to some arbitrary old state.

Example:

```text
A: create file
B: modify file
C: modify same file
```

Reverting `B` does not simply make the repository equal to `A`.

The inverse of `B` is applied on top of `C`, potentially producing conflicts or a state different from `A`.

---

# 47. Revert Is Patch-Based

Conceptually:

```text
Commit B:

old state
   ↓
new state

Revert B:

new state
   ↓
inverse patch
   ↓
result
```

The resulting state depends on the commits that occurred after the target commit.

---

# 48. Revert and Later Changes

Suppose:

```text
A ── B ── C
```

`B` changes:

```text
config.js
```

Then `C` changes the same area.

Reverting `B` may cause:

```text
conflict
```

because the inverse patch of `B` no longer applies cleanly to the current tree.

---

# 49. Revert Conflict Resolution Principle

When resolving a conflict, ask:

> What should the final repository state be after undoing the target commit while preserving the valid later changes?

Do not blindly choose:

```text
ours
```

or:

```text
theirs
```

without understanding the desired final state.

---

# 50. Revert and `git add`

After manually resolving:

```cmd
git add file.js
```

Check:

```cmd
git status
```

Then:

```cmd
git revert --continue
```

---

# 51. Revert and `git diff`

During conflict resolution:

```cmd
git diff
```

shows unresolved differences.

After staging:

```cmd
git diff --cached
```

shows what is staged for the next commit.

This is useful for verifying the exact inverse change before continuing.

---

# 52. Revert a Sequence Safely

For complex history:

```cmd
git log --graph --oneline --decorate --all
```

Identify the commits.

Then:

```cmd
git show <commit>
```

for each important commit.

Use:

```cmd
git revert --no-commit ...
```

when you want to inspect or combine the result before creating the final commit.

---

# 53. Revert With No Automatic Commit

Example:

```cmd
git revert --no-commit HEAD
```

Then:

```cmd
git diff
```

If correct:

```cmd
git commit -m "Revert latest change"
```

If incorrect, you can inspect and modify the working tree before committing.

---

# 54. Revert a Bad Feature

History:

```text
A ── B ── C ── D
```

Suppose `C` introduced a broken feature.

Run:

```cmd
git revert C
```

Result:

```text
A ── B ── C ── D ── R
```

where `R` reverses `C`.

Notice that `D` remains.

This is one of the major advantages over resetting to `B`.

---

# 55. Why Reset Would Be Different

Resetting:

```cmd
git reset --hard B
```

would produce:

```text
A ── B
```

and remove `C` and `D` from the current branch history.

Revert:

```cmd
git revert C
```

produces:

```text
A ── B ── C ── D ── R
```

while preserving `D`.

---

# 56. Revert a Bug Fix

Suppose:

```text
B = bug fix
```

but the fix itself causes another problem.

Instead of deleting `B` from history:

```cmd
git revert B
```

creates a documented inverse.

This is especially valuable in production branches.

---

# 57. Revert and Code Review

A revert can be reviewed like any other commit.

Example:

```text
PR #100
    Add payment validation

PR #105
    Revert "Add payment validation"
```

The repository history clearly records both decisions.

---

# 58. Revert and Auditability

Because the original commit remains, you can determine:

```text
what changed originally
when it changed
who created it
why it was reverted
what later restored it
```

This is particularly valuable in regulated or high-compliance environments.

---

# 59. Revert and Commit IDs

Original:

```text
abc1234
```

Revert:

```text
def5678
```

The original commit ID does not change.

The revert receives its own commit ID because it is a new commit.

---

# 60. Revert and SHA-1/SHA-256 Object Identity

Git commit IDs identify commit objects.

Since a revert creates a new commit object containing different:

```text
tree
parents
metadata
message
```

it receives a different object ID.

Therefore:

```text
original commit ≠ revert commit
```

even though their changes are inverses.

---

# 61. Revert and Branches

If you revert on:

```text
main
```

only the current branch receives the new revert commit.

Example:

```text
main:
A ── B ── C ── R

feature:
A ── B ── C
```

The feature branch is unaffected unless the revert is separately merged or applied there.

---

# 62. Revert and Cherry-Pick

A revert creates a normal commit.

Therefore, like other commits, its changes can potentially be transferred with:

```cmd
git cherry-pick <revert-commit>
```

However, understand the resulting history before doing this.

---

# 63. Revert and Cherry-Pick Relationship

Conceptually:

```text
Commit C
    ↓
Revert C
    ↓
commit R

Cherry-pick R
    ↓
apply R's inverse changes elsewhere
```

This can be useful when propagating a rollback across branches.

---

# 64. Revert a Commit on Another Branch

You can identify a commit:

```cmd
git log --all --oneline
```

Then switch to the branch where you want the inverse:

```cmd
git switch release
```

Then:

```cmd
git revert <commit>
```

The revert is created on the current branch.

---

# 65. Important Branch Principle

`git revert` operates relative to:

```text
current HEAD
```

The target commit can be elsewhere in the ancestry, but the new revert commit is created on the current branch.

---

# 66. Revert Does Not Require the Target to Be HEAD

This is valid:

```cmd
git revert abc1234
```

even when:

```text
HEAD
  ↓
D

target
  ↓
B
```

Git calculates the inverse of `B` and applies it to the current state.

---

# 67. Revert and Mainline

For ordinary commits:

```cmd
git revert <commit>
```

For merge commits:

```cmd
git revert -m 1 <merge-commit>
```

The `-m` option is specifically important for merge commits.

---

# 68. Common Mistake: Using Reset Instead of Revert

Bad workflow for shared history:

```cmd
git reset --hard HEAD~1
git push --force
```

This rewrites history.

Preferred workflow when the commit is public:

```cmd
git revert HEAD
git push
```

---

# 69. Common Mistake: Reverting Without Inspecting

Before:

```cmd
git revert <commit>
```

inspect:

```cmd
git show <commit>
```

You should know what you are reversing.

---

# 70. Common Mistake: Reverting the Wrong Merge Parent

Dangerous:

```cmd
git revert -m 2 <merge>
```

when parent 1 was actually the mainline.

Always inspect:

```cmd
git rev-list --parents -n 1 <merge>
```

and:

```cmd
git log --graph --oneline
```

---

# 71. Common Mistake: Reverting a Range Carelessly

Before:

```cmd
git revert A^..D
```

understand:

```text
A
B
C
D
```

and whether later commits depend on earlier ones.

Complex ranges can produce conflicts.

---

# 72. Common Mistake: Ignoring Working Changes

Before starting:

```cmd
git status
```

If unrelated modifications exist, consider:

```text
commit them
stash them
or otherwise separate them
```

before a complicated revert.

---

# 73. Common Mistake: Thinking Revert Restores an Old Commit Exactly

This is false.

```cmd
git revert B
```

does not necessarily make:

```text
working tree == state immediately before B
```

because later commits may have changed the same files.

Revert applies an inverse patch to the current state.

---

# 74. Revert Decision Tree

```text
Need to undo a commit?
        │
        ├── Has it been shared?
        │       │
        │       ├── Yes
        │       │    ↓
        │       │  git revert
        │       │
        │       └── No
        │            ↓
        │       reset may be appropriate
        │
        └── Is it a merge commit?
                │
                ├── Yes
                │    ↓
                │  git revert -m <parent> <merge>
                │
                └── No
                     ↓
                   git revert <commit>
```

---

# 75. Practical Commands

Undo latest commit:

```cmd
git revert HEAD
```

Accept default message:

```cmd
git revert --no-edit HEAD
```

Undo specific commit:

```cmd
git revert abc1234
```

Apply inverse without committing:

```cmd
git revert --no-commit abc1234
```

Revert a range:

```cmd
git revert abc1234^..def5678
```

Revert merge:

```cmd
git revert -m 1 abc1234
```

Continue after conflict:

```cmd
git revert --continue
```

Abort:

```cmd
git revert --abort
```

Quit sequencer state:

```cmd
git revert --quit
```

---

# 76. Recommended Safe Workflow

```cmd
git status
```

```cmd
git log --graph --oneline --decorate --all
```

Identify the commit:

```cmd
git show <commit>
```

Then:

```cmd
git revert <commit>
```

If conflict occurs:

```cmd
git status
```

Resolve files.

Then:

```cmd
git add <resolved-files>
```

Continue:

```cmd
git revert --continue
```

Finally:

```cmd
git log --oneline -5
git show HEAD
```

---

# 77. Advanced Workflow: Inspect Before Commit

```cmd
git revert --no-commit <commit>
```

Inspect:

```cmd
git diff
```

Modify if necessary.

Stage:

```cmd
git add .
```

Inspect:

```cmd
git diff --cached
```

Commit:

```cmd
git commit -m "Revert problematic change"
```

---

# 78. Advanced Workflow: Revert Several Changes Into One Commit

```cmd
git revert --no-commit <commit1>
git revert --no-commit <commit2>
git revert --no-commit <commit3>
```

Inspect:

```cmd
git diff
```

Then:

```cmd
git add .
git commit -m "Revert problematic changes"
```

This produces one consolidated revert commit instead of separate commits.

---

# 79. Revert vs History Rewrite

Use:

```text
git revert
```

when you want:

```text
history preserved
shared branch safe
rollback documented
original commit retained
```

Use:

```text
git reset
```

when you intentionally want:

```text
local history rewritten
branch pointer moved
commits removed from branch ancestry
```

---

# 80. Final Mental Model

Remember:

```text
RESET

A ── B ── C
         ↑
        HEAD

reset to B

A ── B
     ↑
    HEAD
```

History was moved.

Now:

```text
REVERT

A ── B ── C ── R
         ↑     ↑
      original inverse
```

History was preserved.

---

# 81. Golden Rule

```text
Undo local/private history:
    git reset

Undo shared/public history:
    git revert
```

More precisely:

> **Use `git revert` when the commit should remain part of the shared history but its effects should be undone.**

That is the fundamental purpose of `git revert`.

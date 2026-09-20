# Git Interactive Rebase

## 1. What Is Interactive Rebase?

Interactive rebase is one of Git's most powerful history-rewriting tools.

It allows you to **inspect, reorder, edit, combine, split, rename, or remove commits** before publishing or finalizing a branch history.

Basic syntax:

```cmd
git rebase -i <base>
```

Example:

```cmd
git rebase -i HEAD~5
```

This tells Git:

```text
Open the last 5 commits for interactive editing.
```

---

# 2. Why Use Interactive Rebase?

Interactive rebase is useful for:

- cleaning messy local history
- combining multiple commits
- changing commit messages
- reordering commits
- removing unwanted commits
- editing an old commit
- splitting one commit into multiple commits
- creating fixup commits
- preparing a clean branch for code review
- reviewing the exact sequence of commits before rewriting them

Example:

```text
Before:

A ── B ── C ── D ── E
```

You may transform it into:

```text
A ── B ── C' ── D'
```

where several commits have been combined or modified.

---

# 3. Interactive Rebase Syntax

```cmd
git rebase -i <base>
```

Common examples:

```cmd
git rebase -i HEAD~3
git rebase -i HEAD~5
git rebase -i HEAD~10
```

You can also use a branch:

```cmd
git rebase -i main
```

or a commit:

```cmd
git rebase -i abc1234
```

---

# 4. Understanding `HEAD~N`

Suppose:

```text
A ── B ── C ── D ── E
                  ↑
                 HEAD
```

Then:

```cmd
git rebase -i HEAD~3
```

means Git will prepare the commits after the selected base:

```text
C
D
E
```

Conceptually:

```text
HEAD~3
  ↓
  C ── D ── E
```

The exact commit selection is important because the base commit itself is not normally included in the interactive todo list.

---

# 5. The Interactive Rebase Todo List

Running:

```cmd
git rebase -i HEAD~5
```

opens a todo list similar to:

```text
pick 1111111 Add user model
pick 2222222 Add database connection
pick 3333333 Fix database bug
pick 4444444 Add authentication
pick 5555555 Fix authentication typo
```

Git executes these instructions from **top to bottom**.

The order is therefore extremely important.

---

# 6. The `pick` Command

```text
pick <commit>
```

means:

```text
Apply this commit unchanged.
```

Example:

```text
pick 1111111 Add user model
pick 2222222 Add database connection
```

is the normal/default operation.

You can change a line back to `pick` if you previously changed its action.

---

# 7. The `reword` Command

```text
reword <commit>
```

means:

```text
Apply the commit, but change its commit message.
```

Example:

```text
pick 1111111 Add user model
reword 2222222 db stuff
pick 3333333 Add authentication
```

During the rebase, Git opens an editor for the commit message.

You can replace:

```text
db stuff
```

with:

```text
Add PostgreSQL database connection
```

The commit's message changes while its content remains essentially the same.

---

# 8. The `edit` Command

```text
edit <commit>
```

means:

```text
Stop after applying this commit so you can modify it.
```

Example:

```text
pick 1111111 Add user model
edit 2222222 Add database connection
pick 3333333 Add authentication
```

Git pauses after `2222222`.

At that point you can:

```cmd
git status
```

modify files, stage changes, amend the commit, or split it.

Continue with:

```cmd
git rebase --continue
```

---

# 9. `edit` Is More Powerful Than `reword`

Use:

```text
reword
```

when you only want to change the message.

Use:

```text
edit
```

when you want to modify the actual commit.

For example:

```text
reword → change commit message
edit    → change commit content and/or message
```

---

# 10. The `squash` Command

```text
squash <commit>
```

combines the commit with the previous commit.

Suppose:

```text
pick 1111111 Add authentication
squash 2222222 Fix authentication typo
```

Git combines:

```text
1111111
2222222
```

into one commit.

Git normally lets you edit the resulting commit message.

Result:

```text
Add authentication
```

instead of having two separate commits.

---

# 11. Squashing Multiple Commits

Suppose:

```text
pick A Add authentication
squash B Fix authentication
squash C Fix authentication tests
squash D Improve authentication error handling
```

These become one commit:

```text
A'
```

containing the combined changes.

This is useful for turning a development history such as:

```text
Add login
Fix login
Fix login again
Oops
Final fix
```

into:

```text
Implement authentication
```

---

# 12. The `fixup` Command

```text
fixup <commit>
```

is similar to:

```text
squash
```

but Git automatically discards the fixup commit's commit message.

Example:

```text
pick A Add authentication
fixup B Fix typo
fixup C Fix validation
```

Result:

```text
A'
```

The original message from `A` is retained.

---

# 13. `squash` vs `fixup`

### `squash`

```text
squash B
```

Combines commits and allows commit-message editing.

### `fixup`

```text
fixup B
```

Combines commits and keeps the previous commit's message.

Mental model:

```text
squash → combine + edit messages

fixup  → combine + discard fixup message
```

For cleanup before code review, `fixup` is often convenient.

---

# 14. The `drop` Command

```text
drop <commit>
```

removes the commit from the rewritten history.

Example:

```text
pick A Add feature
drop B Debugging experiment
pick C Add tests
```

Result:

```text
A ── C'
```

The changes introduced by `B` are not replayed.

Use `drop` carefully.

---

# 15. Removing a Commit by Deleting Its Line

You can also remove a commit from the todo list.

For example:

```text
pick A Add feature
pick B Temporary debugging
pick C Add tests
```

Delete:

```text
pick B Temporary debugging
```

Result:

```text
pick A Add feature
pick C Add tests
```

Git will not replay `B`.

Explicit `drop` is often clearer:

```text
drop B Temporary debugging
```

---

# 16. Reordering Commits

Suppose:

```text
pick A Add model
pick B Add API
pick C Add tests
```

You can reorder them:

```text
pick A Add model
pick C Add tests
pick B Add API
```

Git attempts to replay them in the new order.

However, commits may depend on previous commits.

If `C` requires changes introduced by `B`, reordering them may cause conflicts or produce an invalid logical history.

---

# 17. Reordering Example

Before:

```text
A ── B ── C
```

Todo:

```text
pick A
pick B
pick C
```

Change to:

```text
pick A
pick C
pick B
```

Result conceptually:

```text
A ── C' ── B'
```

Because the commits are recreated, their IDs may change.

---

# 18. Editing an Old Commit

Suppose:

```text
A ── B ── C ── D ── E
```

You want to modify `C`.

Run:

```cmd
git rebase -i HEAD~4
```

Select:

```text
edit C
```

Git pauses at `C`.

Now inspect:

```cmd
git status
```

Modify files.

Stage them:

```cmd
git add <files>
```

Amend:

```cmd
git commit --amend
```

Then:

```cmd
git rebase --continue
```

Git recreates the descendants of `C`.

---

# 19. Editing Only the Commit Message

If only the message needs changing:

```text
reword C
```

is simpler than:

```text
edit C
```

Use the smallest operation that solves the problem.

---

# 20. Splitting a Commit

Interactive rebase can split one commit into multiple commits.

Suppose:

```text
A ── B ── C
```

and `B` contains:

```text
feature code
test code
documentation
```

You want:

```text
A ── B1 ── B2 ── B3 ── C'
```

Mark `B` as:

```text
edit B
```

When Git stops at `B`:

```cmd
git reset HEAD^
```

This resets the index while keeping the changes in the working tree.

Now:

```cmd
git status
```

will show the changes as unstaged.

Stage only the first group:

```cmd
git add <feature-files>
```

Create:

```cmd
git commit -m "Add feature"
```

Then stage the next group:

```cmd
git add <test-files>
git commit -m "Add feature tests"
```

Then:

```cmd
git add <documentation-files>
git commit -m "Document feature"
```

Finally:

```cmd
git rebase --continue
```

---

# 21. Splitting Commit Mental Model

Before:

```text
B
└── feature + tests + docs
```

After:

```text
B1 → feature
B2 → tests
B3 → docs
```

This is extremely useful when one development commit contains unrelated changes.

---

# 22. `rebase --continue`

During an interactive rebase, Git may stop because of:

- `edit`
- conflicts
- commit splitting
- other rebase operations

Continue with:

```cmd
git rebase --continue
```

Git proceeds to the next todo instruction.

---

# 23. `rebase --abort`

If you want to completely cancel the interactive rebase:

```cmd
git rebase --abort
```

This is the safest exit when you decide the operation should not continue.

---

# 24. `rebase --skip`

If Git is currently processing a commit and you intentionally want to omit it:

```cmd
git rebase --skip
```

Use this carefully.

Skipping means:

```text
current commit will not be included in the rewritten history
```

---

# 25. Viewing the Todo List

The todo list is normally opened automatically:

```cmd
git rebase -i HEAD~5
```

You can also configure your editor through Git configuration.

Check:

```cmd
git config --get core.editor
```

If no editor is configured, Git uses its available default editor.

---

# 26. The Order of Operations

Suppose:

```text
pick A
reword B
edit C
squash D
fixup E
drop F
```

Git processes them sequentially:

```text
A
↓
B → change message
↓
C → stop for editing
↓
D → combine with C
↓
E → combine with previous
↓
F → omit
```

The todo list is effectively a sequence of history-transformation instructions.

---

# 27. `break`

Interactive rebase also supports:

```text
break
```

This intentionally stops the rebase at that point.

Example:

```text
pick A
pick B
break
pick C
pick D
```

Git pauses after `B`.

You can inspect the repository:

```cmd
git status
git log --oneline
```

Then continue:

```cmd
git rebase --continue
```

This can be useful for advanced inspection or testing during a rewrite.

---

# 28. `exec`

Interactive rebase supports:

```text
exec <command>
```

This runs a shell command during the rebase.

Example:

```text
pick A
exec npm test
pick B
exec npm test
pick C
```

This can be used to validate commits as Git replays them.

---

# 29. `exec` With `--exec`

Instead of manually writing `exec` commands, you can use:

```cmd
git rebase -i --exec "npm test" HEAD~5
```

Git adds execution instructions during the interactive rebase.

Conceptually:

```text
pick A
exec npm test
pick B
exec npm test
pick C
exec npm test
```

This is useful when each intermediate commit must remain buildable or testable.

---

# 30. `break` vs `edit`

### `edit`

Stops because you intend to modify a specific commit.

```text
edit A
```

### `break`

Stops without selecting a particular commit for modification.

```text
break
```

Mental model:

```text
edit  → stop to change a commit

break → stop to inspect/do something manually
```

---

# 31. Autosquash

Autosquash is designed around commits created with:

```cmd
git commit --fixup=<commit>
```

Suppose:

```text
A Add authentication
B Fix typo
```

Instead of manually editing the interactive todo list, create a fixup commit:

```cmd
git commit --fixup=A
```

Then:

```cmd
git rebase -i --autosquash <base>
```

Git automatically positions the fixup commit next to its target.

---

# 32. Fixup Commit

Example:

```cmd
git commit --fixup=abc1234
```

Git creates a commit whose message identifies the target commit.

Conceptually:

```text
fixup! Add authentication
```

Then:

```cmd
git rebase -i --autosquash HEAD~5
```

Git transforms the todo list appropriately.

---

# 33. Autosquash Workflow

Typical code-review workflow:

```cmd
git log --oneline
```

Find the commit:

```text
abc1234 Add authentication
```

Make a correction.

Then:

```cmd
git add .
git commit --fixup=abc1234
```

Later:

```cmd
git rebase -i --autosquash main
```

Git combines the fixup into the original commit.

This keeps your working process flexible while allowing a clean final history.

---

# 34. `fixup` vs `fixup -C`

Advanced interactive rebase supports variants such as:

```text
fixup
fixup -C
fixup -c
```

The exact behavior concerns how commit messages are handled when combining commits.

For normal history cleanup:

```text
fixup
```

is usually sufficient.

Use the message-control variants when you specifically need to preserve or edit a particular commit message during the combination.

---

# 35. `reword` vs `edit`

Example:

```text
reword A
```

Use when:

```text
only the message is wrong
```

Example:

```text
edit A
```

Use when:

```text
the actual snapshot/content needs modification
```

A useful rule:

```text
message only → reword
content       → edit
```

---

# 36. Squashing Development Noise

Messy branch:

```text
A Add login
B fix typo
C fix login
D fix tests
E fix login again
F improve login
```

Interactive rebase can turn it into:

```text
A' Implement login
B' Add login tests
```

This produces a history that communicates meaningful units of work rather than every intermediate correction.

---

# 37. Good Commit History

A good final history might look like:

```text
Add authentication
Add authorization
Add authentication tests
Document authentication API
```

Instead of:

```text
auth
fix
fix2
oops
test
fix test
final
final-final
```

Interactive rebase helps transform development history into reviewable history.

---

# 38. Interactive Rebase With `main`

Suppose:

```text
main:
A ── B ── C

feature:
A ── B ── C ── D ── E ── F
```

To rewrite feature commits:

```cmd
git switch feature
git rebase -i main
```

The todo list contains:

```text
D
E
F
```

You can then:

```text
pick D
squash E
reword F
```

Result:

```text
A ── B ── C ── D' ── F'
```

---

# 39. Interactive Rebase and Conflicts

Suppose you reorder:

```text
B
C
```

but `C` depends on changes introduced by `B`.

Git may produce a conflict.

Check:

```cmd
git status
```

Resolve files.

Stage them:

```cmd
git add <resolved-files>
```

Continue:

```cmd
git rebase --continue
```

If you decide the entire rewrite is not worth continuing:

```cmd
git rebase --abort
```

---

# 40. Interactive Rebase and Conflict Granularity

Interactive rebase replays commits individually.

Therefore:

```text
Commit A
   ↓
Commit B
   ↓
Commit C
```

is processed as:

```text
replay A
replay B
replay C
```

A conflict can occur specifically while replaying `B`.

This gives you a precise point at which to resolve the history.

---

# 41. Interactive Rebase and Commit IDs

Before:

```text
A ── B ── C ── D
```

After changing `B`:

```text
A ── B' ── C' ── D'
```

Why do `C` and `D` change?

Because:

```text
C.parent = B
```

After rewriting:

```text
C'.parent = B'
```

Therefore the descendants must also be recreated.

---

# 42. Interactive Rebase and Shared Branches

Do not casually use:

```cmd
git rebase -i
```

on a branch whose commits other developers have already based work on.

Example:

```text
remote feature:
A ── B ── C
```

After rewriting:

```text
A ── B' ── C'
```

the original commit IDs no longer represent the same ancestry.

This can force collaborators to reconcile divergent histories.

---

# 43. Interactive Rebase Before Pull Request

A common workflow:

```cmd
git status
git fetch origin
git rebase origin/main
git rebase -i origin/main
```

Clean the commits.

Then inspect:

```cmd
git log --oneline --decorate
```

Run tests.

Finally push.

If the branch was already pushed before rewriting:

```cmd
git push --force-with-lease
```

provided the team workflow allows rewriting that branch.

---

# 44. `--autosquash` With a Range

Example:

```cmd
git rebase -i --autosquash HEAD~10
```

This:

```text
1. selects the specified history range
2. opens interactive rebase
3. detects fixup/squash commits
4. rearranges them automatically
```

You still review the todo list before proceeding.

---

# 45. `--rebase-merges`

Interactive rebase can preserve merge structure:

```cmd
git rebase -i --rebase-merges main
```

This is useful for complex histories where merge commits carry meaningful topology.

Without appropriate merge-preservation behavior, a rebase may flatten parts of the history.

---

# 46. Interactive Rebase From the Root

You can rewrite the entire history:

```cmd
git rebase -i --root
```

This exposes commits starting from the repository root.

Possible uses:

- correcting early commit messages
- restructuring an early history
- removing accidental commits
- reorganizing an unpublished repository

Do not use this casually on established shared repositories.

---

# 47. Interactive Rebase and Empty Commits

During rewriting, a commit may become empty.

For example:

```text
B adds a line
C also effectively adds that line
```

After reordering or changing earlier commits, `C` may introduce no new changes.

Git can stop and inform you that the commit became empty.

Inspect:

```cmd
git status
```

Depending on the intended result, you can continue or explicitly preserve an empty commit where appropriate.

---

# 48. Creating an Empty Commit

You can intentionally create an empty commit:

```cmd
git commit --allow-empty -m "Mark release milestone"
```

This is sometimes useful for markers or automation triggers.

Interactive rebase can preserve such commits depending on the rewrite.

---

# 49. Interactive Rebase and Testing

A powerful workflow is:

```cmd
git rebase -i --exec "npm test" HEAD~10
```

Conceptually:

```text
replay commit 1
   ↓
run tests

replay commit 2
   ↓
run tests

replay commit 3
   ↓
run tests
```

If a command fails, Git can stop and allow investigation.

This can expose commits that are not independently valid.

---

# 50. Interactive Rebase and Buildable Commits

A high-quality project history often aims for:

```text
each commit
    ↓
builds successfully
    ↓
tests pass
    ↓
has a meaningful purpose
```

Interactive rebase can help achieve this by:

- splitting unrelated changes
- fixing commit ordering
- squashing broken intermediate commits
- removing accidental changes
- validating commits with `exec`

---

# 51. Interactive Rebase as a History Editor

Think of:

```cmd
git rebase -i
```

as a small history programming language.

The todo list:

```text
pick
reword
edit
squash
fixup
drop
exec
break
```

describes transformations over a commit sequence.

For example:

```text
pick A
reword B
squash C
fixup D
drop E
edit F
```

is effectively a history transformation program.

---

# 52. Advanced Example

Initial:

```text
A ── B ── C ── D ── E ── F
```

Goal:

```text
A ── B' ── C' ── F'
```

Todo:

```text
reword B
squash C
drop D
fixup E
pick F
```

Conceptually:

```text
B → change message
C → combine with B
D → remove
E → combine with previous
F → replay
```

The final history contains fewer, cleaner commits.

---

# 53. Advanced Example: Splitting and Squashing

Initial:

```text
A ── B ── C ── D
```

Suppose `B` contains two unrelated features.

Mark:

```text
edit B
```

Split:

```text
B1
B2
```

Then continue.

Suppose `C` is merely a correction to `B2`.

You can then combine it:

```text
B1
B2
squash C
```

Final:

```text
A ── B1 ── B2' ── D'
```

---

# 54. Advanced Example: Reordering and Editing

Initial:

```text
A ── B ── C ── D
```

Todo:

```text
edit B
pick D
pick C
```

Git:

```text
1. applies B
2. stops for modification
3. continues with D
4. replays C
```

If `C` depended on `D`, conflict resolution may be required.

This demonstrates why commit ordering represents actual dependency relationships.

---

# 55. `git reflog` After Interactive Rebase

Interactive rebase can significantly change references.

If you make a mistake:

```cmd
git reflog
```

can help locate the previous branch position.

Example:

```text
HEAD@{0}: rebase finished
HEAD@{1}: rebase: ...
HEAD@{2}: checkout feature
```

Find the desired old commit and inspect it:

```cmd
git show <commit>
```

Then recover if necessary.

---

# 56. Backup Before High-Risk Interactive Rebase

For complex history rewriting:

```cmd
git branch backup-before-rebase
```

Then:

```cmd
git rebase -i HEAD~20
```

Now you have:

```text
backup-before-rebase → old history
feature               → rewritten history
```

This gives you an additional reference to the original history.

---

# 57. Safe Interactive Rebase Workflow

Before:

```cmd
git status
git branch --show-current
git log --graph --oneline --decorate --all
```

Optional safety branch:

```cmd
git branch backup-before-rebase
```

Start:

```cmd
git rebase -i HEAD~10
```

Edit todo list.

If conflicts occur:

```cmd
git status
```

Resolve:

```cmd
git add <resolved-files>
git rebase --continue
```

Cancel if necessary:

```cmd
git rebase --abort
```

After completion:

```cmd
git log --graph --oneline --decorate --all
git status
```

---

# 58. Common Mistakes

## Mistake 1: Choosing the wrong range

```cmd
git rebase -i HEAD~5
```

does not mean "edit exactly five arbitrary commits."

Understand which commit is being used as the base.

---

## Mistake 2: Reordering dependent commits

A commit may rely on changes from an earlier commit.

Changing order can produce conflicts or logically broken history.

---

## Mistake 3: Using `drop` without checking the commit

Dropping a commit removes its changes from the replay.

---

## Mistake 4: Using `squash` when `fixup` is sufficient

If the secondary commit message is just noise:

```text
fixup
```

is cleaner.

---

## Mistake 5: Rewriting shared history

Interactive rebase changes commit IDs.

Do not rewrite shared history without coordination.

---

## Mistake 6: Force pushing blindly

If a rewritten branch was already published:

```cmd
git push --force-with-lease
```

is generally safer than:

```cmd
git push --force
```

---

# 59. Interactive Rebase Command Reference

### Start interactive rebase

```cmd
git rebase -i HEAD~5
```

### Rebase against branch

```cmd
git rebase -i main
```

### Rebase against remote branch

```cmd
git fetch origin
git rebase -i origin/main
```

### Start from root

```cmd
git rebase -i --root
```

### Autosquash

```cmd
git rebase -i --autosquash HEAD~10
```

### Preserve merge structure

```cmd
git rebase -i --rebase-merges main
```

### Execute command during rebase

```cmd
git rebase -i --exec "npm test" HEAD~10
```

### Continue

```cmd
git rebase --continue
```

### Abort

```cmd
git rebase --abort
```

### Skip

```cmd
git rebase --skip
```

---

# 60. Interactive Rebase Action Reference

```text
pick
```

Apply commit.

```text
reword
```

Apply commit but change message.

```text
edit
```

Stop and modify commit.

```text
squash
```

Combine with previous commit and edit messages.

```text
fixup
```

Combine with previous commit and discard this commit's message.

```text
drop
```

Remove commit.

```text
exec
```

Run a shell command.

```text
break
```

Pause the rebase.

---

# 61. The Most Important Difference

Remember:

```text
pick
    ↓
keep

reword
    ↓
keep content, change message

edit
    ↓
stop and modify

squash
    ↓
combine + edit message

fixup
    ↓
combine + keep previous message

drop
    ↓
remove

exec
    ↓
run command

break
    ↓
pause
```

---

# 62. Professional Commit-Cleanup Example

Messy history:

```text
A Add login
B fix login
C fix login validation
D add tests
E fix test
F typo
G final login fix
```

Run:

```cmd
git rebase -i HEAD~7
```

Possible todo:

```text
pick A Add login
fixup B fix login
fixup C fix login validation
squash D add tests
fixup E fix test
fixup F typo
fixup G final login fix
```

You can then edit the resulting messages.

The result might become:

```text
A' Implement login
B' Add login tests
```

This is significantly easier to review.

---

# 63. The Core Mental Model

Interactive rebase:

```text
OLD HISTORY
     ↓
SELECT COMMIT RANGE
     ↓
GENERATE TODO LIST
     ↓
CHOOSE ACTIONS
     ↓
REPLAY COMMITS
     ↓
EDIT / COMBINE / DROP / REORDER
     ↓
CREATE NEW COMMITS
     ↓
UPDATE BRANCH
```

The original commits are not modified in place.

Git creates rewritten commits.

---

# 64. Important Safety Rule

Interactive rebase is safest when used on:

```text
local
private
unpublished
feature
```

history.

Be careful with:

```text
shared
published
protected
team
```

history.

The fundamental reason is:

```text
interactive rebase
        ↓
changes commit ancestry
        ↓
changes commit IDs
        ↓
can invalidate other people's references
```

---

# 65. Final Summary

```text
git rebase -i
```

is Git's interactive history-rewriting mechanism.

The essential operations are:

```text
pick
reword
edit
squash
fixup
drop
exec
break
```

The most important workflows are:

```cmd
git rebase -i HEAD~5
```

for recent commits,

```cmd
git rebase -i main
```

for commits since a branch base,

```cmd
git rebase -i --autosquash HEAD~10
```

for automatic fixup/squash cleanup,

and:

```cmd
git rebase -i --root
```

for rewriting the entire reachable history.

The key principle is:

```text
Interactive rebase does not edit commits in place.

It creates a new sequence of commits according
to the instructions in the rebase todo list.
```

Therefore:

```text
old commits
    ↓
history transformation
    ↓
new commits
    ↓
new commit IDs
    ↓
updated branch
```

Before using interactive rebase on a published branch, understand exactly who depends on that history.

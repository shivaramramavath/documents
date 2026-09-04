# Git Rebase

## 1. What Is `git rebase`?

`git rebase` is a **history-rewriting operation** that moves or replays commits onto a new base commit.

Basic syntax:

```cmd
git rebase <new-base>
```

The central idea is:

```text
Take my commits
    ↓
temporarily remove them
    ↓
move my branch to a new base
    ↓
replay my commits
```

---

# 2. Why Use Rebase?

Rebase is commonly used to:

- keep feature branches up to date
- create a linear history
- avoid unnecessary merge commits
- clean local commit history
- prepare commits for code review
- reorganize commits
- combine commits
- edit commits
- reorder commits

Example:

```text
Before:

A ── B ── C
     \
      D ── E
```

After rebasing the feature branch onto `C`:

```text
A ── B ── C ── D' ── E'
```

---

# 3. Rebase Is Not Moving Commits

A common misconception is:

```text
rebase = move existing commits
```

More accurately:

```text
rebase = create new commits based on the old commits' changes
```

Therefore:

```text
D → D'
E → E'
```

The new commits have different IDs.

---

# 4. Basic Example

Suppose:

```text
A ── B ── C
     \
      D ── E
```

`C` is on `main`.

`D` and `E` are on your feature branch.

You want:

```text
A ── B ── C ── D' ── E'
```

Switch to the feature branch:

```cmd
git switch feature
```

Then:

```cmd
git rebase main
```

Git finds the commits unique to `feature`:

```text
D
E
```

and replays them on top of `main`.

---

# 5. What Rebase Does Internally

Conceptually:

```text
Before:

A ── B ── C
     \
      D ── E
```

Git identifies:

```text
base = B
commits to replay = D, E
new base = C
```

Then:

```text
A ── B ── C
          \
           D'
            \
             E'
```

The final graph becomes:

```text
A ── B ── C ── D' ── E'
```

---

# 6. Basic Syntax

```cmd
git rebase <branch>
```

Example:

```cmd
git rebase main
```

You can also specify a commit:

```cmd
git rebase abc1234
```

or another reference:

```cmd
git rebase origin/main
```

---

# 7. Rebase Onto `main`

Typical workflow:

```cmd
git switch feature
git fetch origin
git rebase origin/main
```

This takes your local feature commits and replays them on top of the latest fetched `origin/main`.

---

# 8. Rebase Onto a Remote-Tracking Branch

Suppose:

```text
origin/main:
A ── B ── C ── D

feature:
A ── B ── X ── Y
```

Run:

```cmd
git fetch origin
git switch feature
git rebase origin/main
```

Result:

```text
A ── B ── C ── D ── X' ── Y'
```

Your feature commits are replayed after `D`.

---

# 9. Rebase vs Merge

Suppose:

```text
A ── B ── C
     \
      D ── E
```

### Merge

```cmd
git merge main
```

can produce:

```text
A ── B ── C ───── M
     \           /
      D ── E ───
```

### Rebase

```cmd
git rebase main
```

produces:

```text
A ── B ── C ── D' ── E'
```

Merge preserves the existing branch topology.

Rebase rewrites the feature branch to create a new ancestry.

---

# 10. Rebase Creates New Commit IDs

Suppose:

```text
D = abc123
E = def456
```

After rebase:

```text
D' = 789abc
E' = 012def
```

The IDs change because commits contain parent references.

Since the parent changes:

```text
D.parent = B
```

becomes:

```text
D'.parent = C
```

the commit object changes.

---

# 11. Why Descendant Commits Change

Suppose:

```text
A ── B ── D ── E
```

If `D` gets recreated:

```text
D'
```

then `E` cannot continue pointing to old `D`.

Therefore:

```text
D → D'
E → E'
```

This is why rebasing a chain of commits normally changes every replayed commit's ID.

---

# 12. Rebase Only Your Own Commits

A common safe workflow is:

```text
main:
A ── B ── C

feature:
A ── B ── D ── E
```

Here:

```text
D
E
```

are your feature commits.

Rebase:

```cmd
git switch feature
git rebase main
```

Result:

```text
A ── B ── C ── D' ── E'
```

This is the ideal use case for rebase.

---

# 13. Rebase a Branch That Has Been Shared

Suppose:

```text
origin/feature:
A ── B ── D ── E

local feature:
A ── B ── D ── E
```

You rebase locally:

```text
A ── B ── C ── D' ── E'
```

Now the remote still points to:

```text
A ── B ── D ── E
```

Your branch history has diverged.

A normal push may be rejected.

You may need:

```cmd
git push --force-with-lease
```

if rewriting that shared branch is intentional and coordinated.

---

# 14. Golden Rule of Rebase

A practical rule:

```text
Do not rebase commits that other people are
already depending on unless the rewrite is
explicitly coordinated.
```

In simpler terms:

```text
Private/local history
    → rebase freely

Shared history
    → rebase carefully

Public protected branch
    → generally do not rewrite
```

---

# 15. Rebase and Working Tree

Before starting a rebase, Git generally expects a clean working tree.

Check:

```cmd
git status
```

If you have uncommitted changes, you can:

### Commit them

```cmd
git add .
git commit -m "WIP"
```

or stash them:

```cmd
git stash push -m "before rebase"
```

Then rebase:

```cmd
git rebase main
```

Afterward:

```cmd
git stash pop
```

---

# 16. Rebase With Uncommitted Changes

Git may sometimes be able to perform an operation without problems depending on the exact state, but relying on this is poor workflow.

Preferred:

```cmd
git status
```

Ensure the working tree is clean before complex rebases.

This makes conflict resolution and recovery significantly easier.

---

# 17. Rebase Conflicts

Suppose:

```text
main:
A ── B ── C

feature:
A ── B ── D
```

Both `C` and `D` modify the same lines.

Run:

```cmd
git rebase main
```

Git attempts to replay `D`.

A conflict may occur.

Git pauses the rebase.

Check:

```cmd
git status
```

---

# 18. Conflict Resolution During Rebase

After resolving the conflicting files:

```cmd
git add <resolved-file>
```

Then continue:

```cmd
git rebase --continue
```

If another conflict occurs:

```cmd
git status
```

Resolve it:

```cmd
git add <resolved-files>
```

Continue:

```cmd
git rebase --continue
```

Repeat until the rebase completes.

---

# 19. Abort a Rebase

If you decide the rebase should not continue:

```cmd
git rebase --abort
```

Git attempts to return the branch to its state before the rebase started.

This is one of the most important recovery commands.

---

# 20. Skip a Commit

During a rebase, Git may stop on a commit that you decide should not be replayed.

You can use:

```cmd
git rebase --skip
```

This tells Git to omit the current commit from the rebase.

Use this carefully.

Skipping a commit means its changes will not be replayed.

---

# 21. Rebase State

During an active rebase, Git maintains temporary state describing:

- original branch position
- target base
- commits being replayed
- current commit
- remaining commits
- conflict state

You normally interact with this state through:

```cmd
git status
```

and:

```cmd
git rebase --continue
git rebase --abort
git rebase --skip
```

---

# 22. Interactive Rebase

Interactive rebase is covered in depth in:

```text
04_interactive-rebase.md
```

Basic command:

```cmd
git rebase -i HEAD~5
```

It allows you to manipulate recent commits.

Common operations include:

```text
pick
reword
edit
squash
fixup
drop
```

Interactive rebase is one of Git's most powerful history-editing tools.

---

# 23. Non-Interactive vs Interactive Rebase

### Normal rebase

```cmd
git rebase main
```

Purpose:

```text
replay your branch commits onto main
```

### Interactive rebase

```cmd
git rebase -i HEAD~5
```

Purpose:

```text
inspect and modify a sequence of commits
```

---

# 24. Rebase `--onto`

`--onto` provides precise control over the new base.

Syntax:

```cmd
git rebase --onto <new-base> <old-base> <branch>
```

Example:

```text
A ── B ── C
     \
      D ── E ── F
```

Suppose you want to move:

```text
E
F
```

to another base.

You can use:

```cmd
git rebase --onto C D feature
```

Conceptually:

```text
old base = D
new base = C
replay commits after D
```

Result:

```text
A ── B ── C ── E' ── F'
     \
      D
```

---

# 25. Understanding `--onto`

The general model is:

```text
git rebase --onto NEW_BASE OLD_BASE BRANCH
```

means:

```text
Take commits reachable from BRANCH
but not from OLD_BASE
and replay them onto NEW_BASE.
```

This is extremely useful for advanced branch surgery.

---

# 26. Rebase `--onto` Example

Initial:

```text
A ── B ── C
     \
      D ── E ── F
```

Suppose:

```text
feature = F
```

and you want to remove `D` from the ancestry while keeping `E` and `F`.

Run:

```cmd
git rebase --onto B D feature
```

The commits after `D` are:

```text
E
F
```

They are replayed onto `B`.

Result:

```text
A ── B ── E' ── F'
     \
      D
```

---

# 27. Rebase `--onto` With Branches

Another useful form:

```cmd
git rebase --onto main old-base feature
```

This is useful when `feature` was originally based on `old-base`, but should now be based on `main`.

Conceptually:

```text
old-base
   ↓
feature commits
   ↓
new-base
```

The feature commits are replayed onto the new base.

---

# 28. Rebase a Branch Onto Its Upstream

If your branch tracks an upstream branch, you can use:

```cmd
git rebase
```

Git can use the configured upstream relationship.

Inspect it with:

```cmd
git branch -vv
```

Example:

```text
feature abc123 [origin/main: ahead 3]
```

The exact behavior depends on branch configuration.

---

# 29. Rebase Onto Remote's Latest State

Common workflow:

```cmd
git fetch origin
git switch feature
git rebase origin/main
```

Important distinction:

```text
git fetch
    ↓
updates remote-tracking references

git rebase origin/main
    ↓
rewrites your local feature history
```

`fetch` does not itself rebase anything.

---

# 30. Rebase and Fast-Forward

After rebasing:

```text
main:
A ── B ── C

feature:
A ── B ── C ── D' ── E'
```

Merging feature into main can often be fast-forwarded:

```cmd
git switch main
git merge feature
```

Result:

```text
A ── B ── C ── D' ── E'
```

No merge commit is required because the history is linear.

---

# 31. Rebase Does Not Automatically Update `main`

Suppose:

```text
main:
A ── B ── C

feature:
A ── B ── D ── E
```

Running:

```cmd
git switch feature
git rebase main
```

changes `feature`.

It does not move `main`.

Result:

```text
main:
A ── B ── C

feature:
A ── B ── C ── D' ── E'
```

---

# 32. Rebase Does Not Automatically Push

A rebase is a local operation unless you subsequently push.

After:

```cmd
git rebase main
```

you still need:

```cmd
git push
```

if the rewritten branch needs to be published.

If the branch was already published and history was rewritten:

```cmd
git push --force-with-lease
```

may be required.

---

# 33. Rebase and Force Push

Suppose remote:

```text
A ── B ── D ── E
```

After rebase:

```text
A ── B ── C ── D' ── E'
```

The old remote history and new local history differ.

A normal:

```cmd
git push
```

may fail because it is not a fast-forward update.

If the rewrite is intentional:

```cmd
git push --force-with-lease
```

is generally safer than:

```cmd
git push --force
```

---

# 34. Why Rebase Is a History Rewrite

Before:

```text
D.parent = B
```

After rebasing onto `C`:

```text
D'.parent = C
```

Since the parent is part of the commit object:

```text
D ≠ D'
```

Therefore rebase changes commit identity.

---

# 35. Rebase and Commit Content

Rebase generally attempts to replay the **changes introduced by each commit**, not simply copy the old commit object.

For example:

```text
D:
adds authentication

E:
adds authorization
```

During rebase:

```text
D'
```

attempts to apply the authentication changes to the new base.

Then:

```text
E'
```

attempts to apply the authorization changes after `D'`.

If the surrounding code changed, conflicts can occur.

---

# 36. Patch-Based Mental Model

A useful mental model:

```text
Original:

B
 ↓
D = patch 1
 ↓
E = patch 2
```

Rebase:

```text
new base C
    ↓
apply patch 1
    ↓
D'
    ↓
apply patch 2
    ↓
E'
```

This explains why conflicts can happen even when the final code seems conceptually compatible.

---

# 37. Rebase and Merge Conflict Difference

During merge:

```text
Git combines histories.
```

During rebase:

```text
Git replays commits one by one.
```

Therefore rebase conflicts are associated with the specific commit currently being replayed.

This is why:

```cmd
git status
```

during a rebase is especially important.

---

# 38. Resolving a Rebase Conflict

Typical sequence:

```cmd
git rebase main
```

Conflict.

Then:

```cmd
git status
```

Inspect conflict markers in files:

```text
<<<<<<<
current/base content
=======
replayed commit content
>>>>>>>
```

Edit the file to the desired result.

Stage it:

```cmd
git add <file>
```

Continue:

```cmd
git rebase --continue
```

---

# 39. If You Made a Mistake While Resolving

You can abort:

```cmd
git rebase --abort
```

This is preferable to continuing through a bad resolution if you no longer understand the current state.

You can then inspect the original history and restart the operation.

---

# 40. Rebase and Reflog

Rebase changes commit IDs and branch positions.

The reflog records reference movements.

Check:

```cmd
git reflog
```

You may see entries associated with:

```text
rebase
checkout
commit
reset
```

If you accidentally complete an unwanted rebase, reflog can often help you locate the branch's previous position.

---

# 41. Recovering From a Bad Rebase

Suppose:

```text
Before:

A ── B ── D ── E
```

After an unwanted rebase:

```text
A ── B ── C ── D' ── E'
```

Find the previous branch position:

```cmd
git reflog
```

Then inspect the candidate commit:

```cmd
git show <commit>
```

If it is the desired previous state:

```cmd
git reset --hard <commit>
```

This can restore the branch reference.

---

# 42. Rebase and Tags

Tags are references to specific objects.

If a tag points to an old commit:

```text
tag v1.0
   ↓
D
```

and you rebase commits after `D`, the tag does not automatically move to the new rewritten commits.

You must deliberately update tags when appropriate.

---

# 43. Rebase and Merge Commits

By default, ordinary rebase generally flattens the branch's merge structure rather than preserving every merge topology.

Git provides:

```cmd
git rebase --rebase-merges
```

to preserve and recreate merge structure during a rebase.

This is an advanced feature.

---

# 44. `--rebase-merges`

Example:

```cmd
git rebase --rebase-merges main
```

This tells Git to attempt to preserve merge structure while rebasing.

Instead of treating all commits as one simple linear sequence, Git reconstructs relevant merge commits.

This is useful for complex branch histories.

---

# 45. Rebase and Empty Commits

During replay, a commit can become empty if its changes are already present in the new base.

Git may stop or omit such commits depending on the situation and options.

This can happen when:

```text
the change was independently incorporated
```

or:

```text
the change becomes unnecessary after conflict resolution
```

Use:

```cmd
git status
```

to understand the current rebase state.

---

# 46. Rebase and `--exec`

Interactive rebase supports executing commands after commits.

Example:

```cmd
git rebase -i --exec "npm test" HEAD~5
```

This can be used to run tests at selected points during an interactive rebase.

This is an advanced history-validation technique.

---

# 47. Rebase and Autosquash

Git supports autosquashing commits intended to be folded into earlier commits.

Typical workflow:

```cmd
git commit --fixup=<commit>
```

Then:

```cmd
git rebase -i --autosquash <base>
```

Git can automatically arrange fixup commits appropriately in the interactive rebase sequence.

This is especially useful for code-review workflows.

---

# 48. Rebase and `--autostash`

If you have local modifications, Git can optionally stash them automatically:

```cmd
git rebase --autostash main
```

Conceptually:

```text
working changes
      ↓
temporary stash
      ↓
rebase
      ↓
restore working changes
```

This is convenient but should not replace understanding the state of your working tree.

---

# 49. Rebase and `--keep-base`

Git also provides:

```cmd
git rebase --keep-base <upstream>
```

This can be useful when you want to update commits while preserving the original merge base rather than simply moving the branch to the latest upstream tip.

It is an advanced option and is most useful in workflows where preserving the original base has semantic value.

---

# 50. Rebase and `--fork-point`

Git can use a fork-point heuristic:

```cmd
git rebase --fork-point <upstream>
```

This can help determine where a topic branch diverged from an upstream branch when upstream history has been rewritten.

It is particularly relevant when branches track rewritten or force-updated histories.

---

# 51. Rebase and `--root`

Interactive rebase can start from the root commit:

```cmd
git rebase -i --root
```

This allows rewriting the entire reachable history from the repository's root.

Use this carefully because it can rewrite a very large portion of history.

---

# 52. Rebase Onto a Commit

You are not limited to branches.

Example:

```cmd
git rebase abc1234
```

Git uses the specified commit as the new base.

The target can be a valid revision expression such as:

```cmd
git rebase HEAD~3
```

although this particular form is more commonly associated with interactive rebase:

```cmd
git rebase -i HEAD~3
```

---

# 53. Rebase and Detached HEAD

Rebase normally operates on a branch.

If you are in detached HEAD state:

```text
HEAD → commit
```

there is no normal branch reference to update.

Before performing complex history rewriting, check:

```cmd
git branch --show-current
```

If it prints nothing, you may be in detached HEAD state.

---

# 54. Rebase Workflow for Feature Development

A practical workflow:

```cmd
git status
git fetch origin
git switch feature
git rebase origin/main
```

If there are conflicts:

```cmd
git status
```

Resolve files.

Then:

```cmd
git add <resolved-files>
git rebase --continue
```

Repeat if necessary.

After completion:

```cmd
git log --graph --oneline --decorate --all
```

Then test the application.

If the branch was already pushed and history changed:

```cmd
git push --force-with-lease
```

---

# 55. Rebase Before Pulling

Git can configure pull behavior to rebase instead of merge.

For example:

```cmd
git pull --rebase
```

Conceptually:

```text
fetch remote changes
      ↓
replay local commits
      ↓
on top of updated remote branch
```

Instead of creating a merge commit.

This is a workflow choice and should match your team's conventions.

---

# 56. `git pull --rebase`

Suppose:

```text
remote:
A ── B ── C

local:
A ── B ── D ── E
```

Run:

```cmd
git pull --rebase
```

Conceptually:

```text
A ── B ── C ── D' ── E'
```

instead of:

```text
A ── B ── C ───── M
     \           /
      D ── E ───
```

---

# 57. Rebase Configuration

You can configure pull behavior:

```cmd
git config --global pull.rebase true
```

Then:

```cmd
git pull
```

can use rebase behavior according to that configuration.

Check:

```cmd
git config --get pull.rebase
```

Do not enable workflow settings blindly on a team repository; understand the team's expected history model first.

---

# 58. Rebase and Published Feature Branches

Suppose:

```text
origin/feature:
A ── B ── D ── E
```

You rebase:

```text
A ── B ── C ── D' ── E'
```

Now your local branch no longer has the same ancestry.

Before force pushing:

```cmd
git fetch origin
git log --graph --oneline --decorate --all
```

Then, if appropriate:

```cmd
git push --force-with-lease origin feature
```

This reduces the chance of overwriting changes that appeared remotely after your last fetch.

---

# 59. Rebase Safety Strategy

Before rebase:

```cmd
git status
git branch -vv
git log --graph --oneline --decorate --all
```

Create an optional safety branch:

```cmd
git branch backup-before-rebase
```

Then:

```cmd
git rebase main
```

If something goes wrong:

```cmd
git rebase --abort
```

If the rebase has already completed:

```cmd
git reflog
```

can help locate the previous state.

---

# 60. Rebase With a Backup Reference

For high-risk history rewriting:

```cmd
git branch backup-before-rebase
```

Then:

```cmd
git rebase main
```

Now you have:

```text
backup-before-rebase → old history
feature              → rewritten history
```

This creates an additional reference to the old commit chain.

After verifying everything:

```cmd
git branch -d backup-before-rebase
```

when the backup is no longer needed.

---

# 61. Rebase and Commit Graph

The commit graph is the foundation of rebase.

Example:

```text
        D ── E
       /
A ── B ── C
```

Rebase changes ancestry:

```text
A ── B ── C ── D' ── E'
```

The actual file changes may remain conceptually identical, but the parent relationships are different.

---

# 62. Rebase and Reachability

Before:

```text
feature → E
```

where:

```text
E → D → B
```

After:

```text
feature → E'
```

where:

```text
E' → D' → C
```

The old commits:

```text
D
E
```

may no longer be reachable from the branch.

They can often remain discoverable through reflog for a period of time.

---

# 63. Rebase Does Not Change the Base Branch

If:

```text
main → C
feature → E
```

and you run:

```cmd
git switch feature
git rebase main
```

the result is:

```text
main → C
feature → E'
```

`main` remains exactly where it was.

Rebase modifies the current branch.

---

# 64. Rebase and Current Branch

Always check:

```cmd
git branch --show-current
```

before rebasing.

If you intended:

```text
feature
```

but are actually on:

```text
main
```

then:

```cmd
git rebase feature
```

would perform a completely different operation.

Never skip this check when performing complex history rewriting.

---

# 65. Rebase and Upstream Tracking

Check tracking:

```cmd
git branch -vv
```

Example:

```text
* feature abc123 [origin/feature] Add authentication
```

This tells you which remote-tracking branch is associated with the local branch.

Understanding this relationship is important before rebasing and force pushing.

---

# 66. Common Mistakes

## Mistake 1: Rebasing shared history

```cmd
git rebase main
git push --force
```

on a branch other developers are using can cause significant disruption.

---

## Mistake 2: Forgetting the current branch

Always:

```cmd
git branch --show-current
```

---

## Mistake 3: Continuing a conflict without understanding it

Use:

```cmd
git status
```

before:

```cmd
git rebase --continue
```

---

## Mistake 4: Using `--skip` casually

```cmd
git rebase --skip
```

can permanently omit the current commit from the resulting branch history.

---

## Mistake 5: Force pushing blindly

Prefer:

```cmd
git push --force-with-lease
```

over:

```cmd
git push --force
```

when a force push is genuinely required.

---

# 67. Rebase Command Reference

### Basic rebase

```cmd
git rebase main
```

### Rebase onto remote main

```cmd
git fetch origin
git rebase origin/main
```

### Interactive rebase

```cmd
git rebase -i HEAD~5
```

### Rebase onto a specific commit

```cmd
git rebase abc1234
```

### Precise branch surgery

```cmd
git rebase --onto <new-base> <old-base> <branch>
```

### Preserve merge structure

```cmd
git rebase --rebase-merges main
```

### Automatically stash local changes

```cmd
git rebase --autostash main
```

### Preserve original base

```cmd
git rebase --keep-base main
```

### Abort

```cmd
git rebase --abort
```

### Continue

```cmd
git rebase --continue
```

### Skip current commit

```cmd
git rebase --skip
```

### Rebase from root

```cmd
git rebase -i --root
```

---

# 68. Advanced Rebase Mental Model

Think of:

```cmd
git rebase <new-base>
```

as:

```text
1. Identify current branch.
2. Identify the common ancestor with the new base.
3. Find commits unique to the current branch.
4. Temporarily detach those commits from the branch tip.
5. Move the branch to the new base.
6. Replay each unique commit.
7. Create new commit objects.
8. Update the branch reference.
9. Stop for conflicts when necessary.
10. Continue until all commits are replayed.
```

---

# 69. Rebase State Machine

Conceptually:

```text
START
  │
  ↓
identify commits
  │
  ↓
move to new base
  │
  ↓
replay commit
  │
  ├── success ──────┐
  │                 │
  └── conflict      │
        ↓           │
      resolve       │
        ↓           │
      git add       │
        ↓           │
 git rebase --continue
        │           │
        └───────────┘
                    ↓
                 COMPLETE
```

At any appropriate point:

```cmd
git rebase --abort
```

can cancel the operation.

---

# 70. Rebase vs Reset vs Amend

These three commands are all history-rewriting tools, but they operate differently.

### Amend

```cmd
git commit --amend
```

```text
replace latest commit
```

### Reset

```cmd
git reset --soft HEAD~1
```

```text
move branch reference
```

### Rebase

```cmd
git rebase main
```

```text
replay a sequence of commits onto another base
```

Mental model:

```text
amend → replace HEAD commit

reset  → move reference

rebase → replay commits
```

---

# 71. Rebase vs Cherry-Pick

Rebase:

```text
replays a sequence of commits
```

Cherry-pick:

```text
replays selected individual commits
```

Example:

```text
D ── E ── F
```

Rebase may replay:

```text
D
E
F
```

Cherry-pick can select:

```cmd
git cherry-pick E
```

to replay only `E`.

---

# 72. Rebase vs Merge Strategy

Use rebase when:

```text
you control the branch history
you want a linear history
your commits are not shared
you are preparing local history for review
```

Use merge when:

```text
preserving branch topology matters
history is already shared
you want to avoid rewriting commits
your team workflow requires merge commits
```

The correct choice depends on the repository's collaboration policy.

---

# 73. Professional Feature-Branch Workflow

```cmd
git switch feature/login
git fetch origin
git rebase origin/main
```

Resolve conflicts if necessary:

```cmd
git status
```

Then:

```cmd
git add <resolved-files>
git rebase --continue
```

Verify:

```cmd
git log --graph --oneline --decorate --all
git status
```

Run tests.

If the branch was already published and rewriting is permitted:

```cmd
git push --force-with-lease
```

---

# 74. Rebase Safety Checklist

Before:

```cmd
git rebase
```

check:

```cmd
git status
git branch --show-current
git branch -vv
git log --graph --oneline --decorate --all
```

For risky operations:

```cmd
git branch backup-before-rebase
```

During conflicts:

```cmd
git status
```

After rebase:

```cmd
git log --graph --oneline --decorate --all
```

If something went wrong:

```cmd
git rebase --abort
```

or investigate:

```cmd
git reflog
```

---

# 75. Final Rules

```text
1. Rebase rewrites history.

2. Rebase replays commits onto a new base.

3. Rebased commits receive new commit IDs.

4. Descendant commits normally receive new IDs too.

5. Rebase modifies the current branch, not the target base branch.

6. Use git fetch before rebasing onto the latest remote-tracking branch.

7. git rebase main replays your current branch's unique commits onto main.

8. git rebase --onto provides precise control over which commits are replayed.

9. git rebase --abort cancels an active rebase.

10. git rebase --continue continues after conflict resolution.

11. git rebase --skip omits the current commit from the replay.

12. Interactive rebase is used for detailed commit-history editing.

13. Rebase conflicts occur while individual commits are being replayed.

14. Use git status to understand an active rebase.

15. Reflog is an important recovery mechanism after an unwanted rebase.

16. Do not casually rebase shared history.

17. Do not blindly force-push rewritten history.

18. Prefer git push --force-with-lease when an intentional force push
    is required.

19. Rebase is fundamentally about changing commit ancestry and replaying
    changes.

20. The core mental model is:

    OLD HISTORY
         ↓
    identify unique commits
         ↓
    NEW BASE
         ↓
    replay commits
         ↓
    NEW COMMITS
         ↓
    updated branch reference
```

# Git Reflog

## 1. What Is Reflog?

`git reflog` records updates to references in your **local repository**.

It allows you to find previous positions of:

- `HEAD`
- local branches
- other references that have reflogs enabled

The most important use of reflog is **recovering commits or branch positions that appear to be lost**.

Basic command:

```cmd
git reflog
```

Example:

```text
a8f91c2 HEAD@{0}: commit: Add authentication
7b31e90 HEAD@{1}: reset: moving to HEAD~1
a8f91c2 HEAD@{2}: commit: Add database layer
```

The reflog shows that `a8f91c2` existed at an earlier `HEAD` position.

---

# 2. Why Reflog Matters

Git history can appear to lose commits after operations such as:

```cmd
git reset
git rebase
git commit --amend
git cherry-pick
git checkout
git switch
```

For example:

```text
Before:

A ── B ── C ── D
              ↑
             HEAD
```

You execute:

```cmd
git reset --hard B
```

Now:

```text
A ── B
      ↑
     HEAD

C ── D
```

`C` and `D` may no longer be reachable from the current branch.

But the reflog can still contain:

```text
HEAD@{1} → D
```

So you can potentially recover them.

---

# 3. Reflog Is Not the Same as Git Log

`git log` shows the commit history reachable from a reference.

```cmd
git log
```

Reflog shows **where references have previously pointed**.

```cmd
git reflog
```

Think:

```text
git log
    ↓
"What commits are in this reachable history?"

git reflog
    ↓
"Where has this local reference pointed?"
```

---

# 4. Basic Reflog Output

Run:

```cmd
git reflog
```

Example:

```text
f83a2d1 HEAD@{0}: commit: Fix login
a7b91c3 HEAD@{1}: checkout: moving from feature to main
d82e11a HEAD@{2}: commit: Add login
```

Each entry contains information such as:

```text
commit
reference position
operation
description
```

The most recent entry is:

```text
HEAD@{0}
```

The previous entry is:

```text
HEAD@{1}
```

Then:

```text
HEAD@{2}
HEAD@{3}
...
```

---

# 5. `HEAD@{n}`

`HEAD@{n}` identifies a previous reflog position.

Example:

```cmd
git reflog
```

Output:

```text
abc1234 HEAD@{0}: commit: Current work
def5678 HEAD@{1}: commit: Previous work
789abcd HEAD@{2}: checkout: moving from feature to main
```

You can inspect:

```cmd
git show HEAD@{1}
```

Or:

```cmd
git show HEAD@{2}
```

---

# 6. Reflog Is Local

Reflogs are generally **local repository records**.

If you run:

```cmd
git reflog
```

you are viewing your local reflog.

It does not mean:

```text
GitHub automatically has your local reflog.
```

If another developer loses a commit locally, your reflog does not normally contain their local reference movements.

---

# 7. Reflog and Remote Repositories

A remote-tracking reference can also have reflog information depending on configuration.

For example:

```text
origin/main
```

may have reflog entries locally.

However, do not confuse:

```text
origin/main
```

with the remote server's internal reflog.

Your local repository maintains its own reference state.

---

# 8. `HEAD` Reflog

The most commonly used reflog is:

```cmd
git reflog
```

which normally displays the reflog for `HEAD`.

You can explicitly use:

```cmd
git reflog show HEAD
```

Example:

```text
abc1234 HEAD@{0}: commit: Update API
def5678 HEAD@{1}: checkout: moving from feature to main
```

---

# 9. Branch Reflog

You can inspect a specific branch:

```cmd
git reflog show main
```

Example:

```text
abc1234 main@{0}: commit: Fix authentication
def5678 main@{1}: commit: Add authentication
```

This shows previous positions of the `main` reference.

---

# 10. Reflog After Reset

Suppose:

```text
A ── B ── C ── D
              ↑
             HEAD
```

Run:

```cmd
git reset --hard B
```

Now:

```text
A ── B
      ↑
     HEAD
```

The reflog may contain:

```text
B HEAD@{0}: reset: moving to B
D HEAD@{1}: commit: D
```

Therefore:

```cmd
git reflog
```

can reveal the previous `D`.

---

# 11. Recovering a Reset Commit

Suppose reflog shows:

```text
d4e5f6a HEAD@{1}: reset: moving to HEAD~2
```

and the previous entry contains:

```text
a1b2c3d HEAD@{2}: commit: Important feature
```

You can inspect it:

```cmd
git show a1b2c3d
```

If it is the commit you need, create a recovery branch:

```cmd
git branch recovery a1b2c3d
```

Then:

```cmd
git switch recovery
```

The commit is recovered as a reachable branch tip.

---

# 12. Safest Recovery Technique

When recovering lost work, prefer creating a new branch first.

Example:

```cmd
git reflog
```

Find:

```text
abc1234 HEAD@{7}: commit: Important work
```

Create:

```cmd
git branch recovery abc1234
```

Then:

```cmd
git switch recovery
```

This is safer than immediately resetting an existing branch.

---

# 13. Recovering a Deleted Branch

Suppose you accidentally delete:

```cmd
git branch -D feature
```

The branch reference disappears.

The commits may still exist.

Search reflog:

```cmd
git reflog
```

Find the old branch tip:

```text
abc1234 HEAD@{8}: checkout: moving from feature to main
```

Then:

```cmd
git branch feature-recovered abc1234
```

You can inspect the recovered branch:

```cmd
git switch feature-recovered
```

---

# 14. Deleted Branch Recovery

Example:

Before:

```text
feature → C
```

Delete:

```cmd
git branch -D feature
```

Now:

```text
feature
   X
```

The reference is gone.

But reflog may contain:

```text
C HEAD@{5}: checkout: moving from feature to main
```

Recover:

```cmd
git branch feature-recovered C
```

Now:

```text
feature-recovered → C
```

The commits become reachable again.

---

# 15. Recovering After Rebase

Rebase rewrites commits.

Example:

```text
Before:

A ── B ── C
```

After rebase:

```text
A ── X ── Y
```

The original:

```text
B
C
```

may no longer be reachable from the branch.

Use:

```cmd
git reflog
```

to find the previous branch position.

Example:

```text
abc1234 HEAD@{0}: rebase (finish)
def5678 HEAD@{1}: rebase (pick)
789abcd HEAD@{5}: checkout
1234567 HEAD@{6}: commit: Original C
```

The old commit chain can potentially be recovered from those references.

---

# 16. Recovering Before a Rebase

Before performing a risky rewrite, you can create a safety branch:

```cmd
git branch backup-before-rebase
```

Then:

```cmd
git rebase main
```

If something goes wrong:

```cmd
git reflog
```

can help locate the old state.

This gives you two recovery mechanisms:

```text
backup branch
     +
reflog
```

---

# 17. Reflog and Amend

Suppose:

```text
A ── B
```

You run:

```cmd
git commit --amend
```

The original `B` is replaced by a new commit:

```text
A ── B'
```

The old `B` may no longer be reachable through the branch.

But reflog can show:

```text
B' HEAD@{0}: commit (amend): Updated message
B  HEAD@{1}: commit: Original message
```

You can inspect the original:

```cmd
git show B
```

---

# 18. Recovering an Amended Commit

Run:

```cmd
git reflog
```

Find the old commit:

```text
abc1234 HEAD@{1}: commit: Original commit
```

Create a recovery branch:

```cmd
git branch old-commit abc1234
```

Now the old commit is reachable.

---

# 19. Reflog and Interactive Rebase

Interactive rebase:

```cmd
git rebase -i HEAD~5
```

can:

- reorder commits
- squash commits
- edit commits
- drop commits
- rewrite commit messages

If you accidentally remove something:

```cmd
git reflog
```

may help locate the pre-rebase state.

---

# 20. Reflog and Cherry-Pick

Cherry-pick creates a new commit.

If you accidentally cherry-pick something:

```cmd
git cherry-pick abc1234
```

and want to inspect the previous state:

```cmd
git reflog
```

may show:

```text
xyz9876 HEAD@{0}: cherry-pick: Fix authentication
abc1234 HEAD@{1}: checkout: moving from feature to main
```

You can use the previous position to determine where the branch was before the operation.

---

# 21. Reflog During Checkout

Example:

```cmd
git switch feature
```

Then:

```cmd
git switch main
```

The reflog records reference movement.

Example:

```text
abc1234 HEAD@{0}: checkout: moving from feature to main
def5678 HEAD@{1}: checkout: moving from main to feature
```

This makes reflog useful for understanding recent local navigation.

---

# 22. Reflog and Detached HEAD

Suppose:

```cmd
git switch --detach abc1234
```

Now:

```text
HEAD
 ↓
abc1234
```

You make a commit:

```cmd
git commit -m "Experimental work"
```

Then leave the detached state:

```cmd
git switch main
```

The experimental commit may become unreachable from a branch.

Use:

```cmd
git reflog
```

to find it.

Then create a branch:

```cmd
git branch experimental-recovered <commit>
```

---

# 23. Reflog and Detached HEAD Recovery

Typical workflow:

```cmd
git reflog
```

Find:

```text
abc1234 HEAD@{3}: commit: Experimental work
```

Then:

```cmd
git branch recovered-work abc1234
```

Switch:

```cmd
git switch recovered-work
```

Now the previously detached work is reachable again.

---

# 24. Reflog With Relative References

You can use reflog selectors as revisions.

Example:

```cmd
git show HEAD@{1}
```

You can also use them with other commands:

```cmd
git diff HEAD@{1} HEAD
```

or:

```cmd
git reset --hard HEAD@{1}
```

The last command is powerful and potentially destructive, so verify the target first.

---

# 25. Reflog Date Syntax

Git supports date-based reflog references.

Examples:

```cmd
git show HEAD@{yesterday}
```

```cmd
git show HEAD@{"2 days ago"}
```

```cmd
git show HEAD@{"1 week ago"}
```

The exact interpretation depends on Git's revision/date parsing.

Use quotes in Windows CMD when the expression contains spaces:

```cmd
git show HEAD@{"2 days ago"}
```

---

# 26. Reflog by Date

You can inspect the reflog:

```cmd
git reflog
```

Then investigate a previous point in time:

```cmd
git show HEAD@{"yesterday"}
```

This is useful when you remember approximately **when** the desired state existed but not its commit ID.

---

# 27. Reflog Expiration

Reflog entries are not necessarily permanent.

Git eventually expires old reflog entries according to its expiration settings.

Inspect configuration:

```cmd
git config --show-origin --get gc.reflogExpire
```

and:

```cmd
git config --show-origin --get gc.reflogExpireUnreachable
```

Common configuration concepts are:

```text
gc.reflogExpire
    expiration for reachable reflog entries

gc.reflogExpireUnreachable
    expiration for unreachable reflog entries
```

Exact defaults can vary by Git version/configuration.

---

# 28. Why Reflog Cannot Guarantee Recovery Forever

Suppose:

```text
lost commit
    ↓
reflog entry expires
    ↓
object eventually becomes prunable
    ↓
garbage collection
    ↓
object may be permanently removed
```

Therefore:

```text
reflog ≠ permanent backup
```

If you discover lost work, recover it promptly.

---

# 29. Reflog and Garbage Collection

Git periodically performs maintenance and garbage collection.

Commands such as:

```cmd
git gc
```

can eventually remove unreachable objects that are no longer protected.

Reflog entries can keep otherwise unreachable commits discoverable for a period of time.

Once relevant reflog entries expire and objects become prunable, recovery becomes much harder or impossible.

---

# 30. Reflog vs Backup

Reflog:

```text
local recovery mechanism
```

Backup:

```text
independent copy of data
```

Do not treat reflog as your backup strategy.

For important work, use:

```text
remote repository
backup branch
tag
archive
backup system
```

---

# 31. Inspect Reflog With Dates

You can use:

```cmd
git reflog --date=iso
```

Example:

```text
abc1234 HEAD@{2026-09-04 09:30:12 +0530}: commit: Fix login
def5678 HEAD@{2026-09-04 09:10:04 +0530}: checkout: moving from feature to main
```

This makes it easier to identify the desired state.

---

# 32. Reflog Format Options

You can combine reflog with formatting options:

```cmd
git reflog --date=iso
```

You can also inspect the underlying commit in more detail:

```cmd
git show --format=fuller <commit>
```

The reflog is primarily a reference-movement record, while commit objects contain the detailed commit metadata.

---

# 33. `git reflog show`

Explicitly show a reflog:

```cmd
git reflog show
```

For a branch:

```cmd
git reflog show main
```

For `HEAD`:

```cmd
git reflog show HEAD
```

This is useful when you want to make the reference being inspected explicit.

---

# 34. `git reflog expire`

Git provides:

```cmd
git reflog expire
```

for expiring reflog entries.

Example:

```cmd
git reflog expire --expire=now --all
```

This is an advanced maintenance operation.

**Do not run aggressive expiration commands casually.**

They can remove useful recovery information.

---

# 35. `git reflog delete`

Individual reflog entries can be deleted:

```cmd
git reflog delete <ref>@{<specifier>}
```

Example:

```cmd
git reflog delete HEAD@{5}
```

This is an advanced maintenance operation.

Deleting reflog entries can reduce your ability to recover old states.

---

# 36. `git reflog drop`

You can remove an entire reflog:

```cmd
git reflog drop <ref>
```

This is destructive to the reflog information for that reference.

Do not use it as a normal Git workflow command.

---

# 37. Finding Lost Commits With Reflog

The basic recovery process is:

```text
1. Run reflog
        ↓
2. Find old reference position
        ↓
3. Inspect commit
        ↓
4. Verify it contains desired work
        ↓
5. Create recovery branch
        ↓
6. Continue normal Git work
```

Commands:

```cmd
git reflog
git show <commit>
git branch recovery <commit>
git switch recovery
```

---

# 38. Finding Lost Work With All Reflogs

You can inspect all available reflogs:

```cmd
git reflog --all
```

This can reveal reference movements beyond the default `HEAD` reflog.

It is useful when you do not immediately know which branch contained the lost commit.

---

# 39. Reflog and `git fsck`

If reflog does not reveal the lost commit, an advanced recovery tool is:

```cmd
git fsck
```

For example:

```cmd
git fsck --full --no-reflogs
```

This can help identify unreachable Git objects.

Reflog should generally be checked first because it gives contextual information about previous reference positions.

---

# 40. Reflog + FSCK Recovery

Conceptually:

```text
git reflog
     ↓
known previous reference
     ↓
recover
```

If unavailable:

```text
git fsck
     ↓
unreachable objects
     ↓
inspect candidates
     ↓
recover if necessary
```

`fsck` is more forensic because it can expose objects without the convenient reference context provided by reflog.

---

# 41. Recovery Branch Pattern

When you find a suspicious commit:

```cmd
git branch recovery <commit>
```

Then inspect:

```cmd
git switch recovery
```

Run:

```cmd
git log --oneline --graph --decorate
```

and:

```cmd
git diff main..recovery
```

Only after confirming the recovered state should you decide whether to merge, cherry-pick, reset, or otherwise integrate it.

---

# 42. Reflog Recovery Example

Initial:

```text
A ── B ── C ── D
              ↑
             main
```

Accidental:

```cmd
git reset --hard B
```

Current:

```text
A ── B
      ↑
     main
```

Run:

```cmd
git reflog
```

You find:

```text
B HEAD@{0}: reset: moving to B
D HEAD@{1}: commit: Important production fix
```

Inspect:

```cmd
git show D
```

Recover:

```cmd
git branch recovered-fix D
```

Now:

```text
A ── B ── C ── D
      ↑         ↑
     main    recovered-fix
```

Your work is reachable again.

---

# 43. Recover the Entire Previous Branch State

Suppose:

```text
Before reset:

A ── B ── C ── D
              ↑
           feature
```

After:

```cmd
git reset --hard B
```

If reflog shows that `feature` previously pointed to `D`, you can restore the branch:

```cmd
git reset --hard D
```

or safer:

```cmd
git branch feature-recovered D
```

The branch recovery strategy depends on whether the existing branch should be moved.

---

# 44. Safer Than Blind Reset

Do not immediately execute:

```cmd
git reset --hard HEAD@{5}
```

Instead:

```cmd
git show HEAD@{5}
```

Then:

```cmd
git log HEAD@{5} --oneline
```

Then create a safety reference:

```cmd
git branch recovery HEAD@{5}
```

Only then decide whether to reset.

---

# 45. Reflog Revision Syntax

Git revision syntax allows:

```text
HEAD@{0}
HEAD@{1}
HEAD@{2}
```

and:

```text
main@{0}
main@{1}
```

The general form is:

```text
<ref>@{<reflog-selector>}
```

Examples:

```cmd
git show HEAD@{1}
```

```cmd
git show main@{2}
```

---

# 46. Reflog vs `HEAD~`

These are different concepts.

```text
HEAD~1
```

means:

```text
the first parent of the current HEAD
```

Whereas:

```text
HEAD@{1}
```

means:

```text
the previous reflog position of HEAD
```

Example:

```text
History:

A ── B ── C
          ↑
         HEAD
```

Then:

```text
HEAD~1 → B
```

But:

```text
HEAD@{1}
```

depends on what the previous `HEAD` position was.

---

# 47. Very Important Difference

```text
HEAD~1
```

is **history traversal**.

```text
HEAD@{1}
```

is **reference movement history**.

Therefore:

```text
~ / ^ → commit ancestry

@{...} → reflog history
```

This distinction is critical for advanced Git recovery.

---

# 48. Example: Why They Differ

Suppose:

```text
A ── B ── C
          ↑
         HEAD
```

You switch branches:

```cmd
git switch feature
```

Now `HEAD` points somewhere else.

The previous `HEAD` position might be:

```text
main → C
```

Therefore:

```text
HEAD@{1}
```

could point to `C`.

But:

```text
HEAD~1
```

means the parent of the **current** HEAD.

They are completely different operations.

---

# 49. Reflog During Branch Movement

Commands such as:

```cmd
git switch
git checkout
git reset
git merge
git rebase
git commit
git cherry-pick
```

can cause reflog entries.

This makes reflog a powerful chronological record of local reference changes.

---

# 50. Reflog Is a Safety Net

A useful mental model:

```text
Git history
    ↓
normal reachable commits

Reflog
    ↓
recent local reference movements

FSCK
    ↓
low-level object discovery
```

When history appears broken:

```text
reflog → first recovery tool
fsck   → deeper recovery tool
```

---

# 51. Professional Recovery Procedure

When you accidentally lose work:

### Step 1 — Stop destructive operations

Do not immediately run:

```cmd
git gc
```

or aggressive reflog expiration.

### Step 2 — Inspect

```cmd
git status
git reflog
```

### Step 3 — Find candidate

```cmd
git show <commit>
```

### Step 4 — Protect it

```cmd
git branch recovery <commit>
```

### Step 5 — Verify

```cmd
git log --graph --oneline --decorate --all
```

### Step 6 — Integrate

Only after verification should you modify the original branch.

---

# 52. Reflog and Disaster Recovery

For local Git disasters:

```text
accidental reset
       ↓
git reflog
       ↓
find previous HEAD
       ↓
create recovery branch
       ↓
verify
       ↓
restore/integrate
```

For more severe cases:

```text
reflog unavailable
       ↓
git fsck
       ↓
find unreachable objects
       ↓
inspect
       ↓
recover
```

---

# 53. Important Limitations

Reflog does **not** guarantee recovery.

Recovery can fail if:

- reflog entries have expired
- unreachable objects have been garbage-collected
- the repository was deleted
- the commit never existed locally
- the work was never committed
- the required object was never fetched
- the object database is damaged

Uncommitted work is especially important:

```text
reflog primarily tracks references,
not every uncommitted change.
```

---

# 54. Reflog Cannot Recover Every Uncommitted File

Suppose you create:

```text
important-file.js
```

but never commit it.

Then:

```cmd
git reset --hard
```

deletes your working-tree changes.

Reflog may not be able to recover those uncommitted contents because they were never stored as a normal commit.

Therefore:

```text
committed work
    → reflog can often help

uncommitted work
    → reflog is not a reliable recovery mechanism
```

---

# 55. Reflog and Unreachable Commits

A commit can be:

```text
reachable
```

or:

```text
unreachable
```

A reflog entry can keep an otherwise unreachable commit discoverable.

Example:

```text
branch
  ↓
B

A ── B

old commit C
     ↑
  reflog entry
```

Although no branch points to `C`, reflog may still reference it.

---

# 56. Reachability Model

Think:

```text
branch/tag
    ↓
commit
    ↓
parent
    ↓
parent
```

Those commits are reachable.

Reflog can additionally remember:

```text
old branch position
       ↓
old commit
```

This is why reflog is useful after history rewriting.

---

# 57. Reflog and Tags

Tags can protect important commits from becoming difficult to find.

Before a risky rewrite:

```cmd
git tag backup-before-rewrite
```

Then perform the rewrite.

Unlike reflog, the tag is an explicit named reference.

This can be a useful safety technique for important operations.

---

# 58. Reflog and Backup Branches

Another protection:

```cmd
git branch backup-before-rebase
```

Then:

```cmd
git rebase main
```

If necessary:

```cmd
git switch backup-before-rebase
```

This is more explicit than relying only on reflog.

---

# 59. Reflog for Experts

At an expert level, understand:

```text
Git commits are immutable objects.
References are movable pointers.
Reflogs record reference movements.
```

This explains why history rewriting is recoverable for a period of time.

For example:

```text
branch → C
```

After reset:

```text
branch → B
```

The commit `C` itself was not rewritten.

The reference moved.

The reflog records that movement.

---

# 60. The Core Principle

This is the most important concept in reflog:

```text
git reset does not normally destroy the old commit immediately.

It moves a reference.

The old commit may remain in the object database,
and the reflog may remember where the reference used to point.
```

Therefore:

```text
reference movement
       ↓
reflog records movement
       ↓
old commit remains discoverable
       ↓
recovery possible
```

---

# 61. Essential Commands

```cmd
git reflog
```

Show `HEAD` reflog.

```cmd
git reflog show main
```

Show a branch reflog.

```cmd
git reflog --all
```

Show available reflogs.

```cmd
git reflog --date=iso
```

Show timestamps.

```cmd
git show HEAD@{1}
```

Inspect a previous `HEAD` state.

```cmd
git log HEAD@{1} --oneline
```

Inspect history from a previous position.

```cmd
git branch recovery HEAD@{1}
```

Create a recovery branch.

```cmd
git fsck --full --no-reflogs
```

Search deeper when reflog is insufficient.

---

# 62. Recovery Cheat Sheet

### Accidentally reset

```cmd
git reflog
git show HEAD@{1}
git branch recovery HEAD@{1}
```

### Accidentally amended

```cmd
git reflog
git show HEAD@{1}
git branch old-version HEAD@{1}
```

### Deleted branch

```cmd
git reflog
git branch recovered-branch <old-commit>
```

### Lost detached-HEAD commit

```cmd
git reflog
git branch recovered-work <commit>
```

### Rebase mistake

```cmd
git reflog
git branch pre-rebase <old-commit>
```

### Reflog insufficient

```cmd
git fsck --full --no-reflogs
```

---

# 63. Final Mental Model

```text
                 Git Object Database
                         │
             ┌───────────┴───────────┐
             │                       │
        Reachable                 Unreachable
             │                       │
        branch/tag                old commits
             │                       │
             │                   reflog may
             │                   remember them
             │                       │
             └───────────┬───────────┘
                         ↓
                  possible recovery
```

Remember these three rules:

```text
1. git log = reachable history

2. git reflog = local reference movement history

3. git fsck = low-level object discovery
```

And the most important recovery pattern:

```cmd
git reflog
git show <commit>
git branch recovery <commit>
git switch recovery
```

**Reflog is one of Git's most important advanced recovery mechanisms. It is the safety net behind many seemingly destructive history operations, but it is not a permanent backup.**

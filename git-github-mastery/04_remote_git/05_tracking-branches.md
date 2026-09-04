# Git Tracking Branches

## 1. What Is a Tracking Branch?

A **tracking branch** is a local branch configured to track an **upstream branch**.

The relationship tells Git:

```text
local branch
     │
     │ tracks
     ↓
remote-tracking branch
```

Example:

```text
main
  │
  ↓
origin/main
```

This allows commands such as:

```cmd
git pull
git push
```

to determine the default remote and branch without requiring them every time.

---

# 2. Three Different Concepts

Do not confuse these:

```text
local branch
remote-tracking branch
upstream branch
```

Example:

```text
Local branch:
main

Remote-tracking branch:
origin/main

Upstream of local main:
origin/main
```

`origin/main` is a remote-tracking reference stored locally.

---

# 3. Local Branch

A normal local branch:

```cmd
git branch
```

Example:

```text
* main
  feature/login
  feature/payment
```

These branches exist in your local repository.

---

# 4. Remote-Tracking Branch

After cloning or fetching:

```cmd
git branch -r
```

you may see:

```text
origin/main
origin/develop
origin/feature/login
```

These are **remote-tracking branches**.

They represent your local knowledge of branches that exist on the remote.

---

# 5. `origin/main`

This:

```text
origin/main
```

means:

```text
remote = origin
branch = main
```

It is not the same thing as your local:

```text
main
```

You can have:

```text
main
origin/main
```

pointing to different commits.

---

# 6. Tracking Relationship

Suppose:

```text
local:
main → C

remote-tracking:
origin/main → C
```

and:

```text
main tracks origin/main
```

Git can determine:

```text
push target = origin/main
pull source = origin/main
```

for the current branch, subject to Git's configured behavior.

---

# 7. Create a Tracking Branch During Clone

When you run:

```cmd
git clone <repository-url>
```

Git normally creates a local branch such as:

```text
main
```

that tracks:

```text
origin/main
```

Conceptually:

```text
main
 ↓
origin/main
```

---

# 8. Create Tracking Branch With `-u`

Create a new branch:

```cmd
git switch -c feature/login
```

Push it:

```cmd
git push -u origin feature/login
```

The `-u` option means:

```text
--set-upstream
```

After this:

```text
feature/login
       │
       ↓
origin/feature/login
```

The local branch now tracks the remote branch.

---

# 9. Verify Tracking

Use:

```cmd
git branch -vv
```

Example:

```text
* main          a1b2c3d [origin/main] latest commit
  feature/login d4e5f6g [origin/feature/login] login
```

The part:

```text
[origin/main]
```

shows the upstream relationship.

---

# 10. `git status`

With tracking configured:

```cmd
git status
```

may report:

```text
Your branch is up to date with 'origin/main'.
```

Or:

```text
Your branch is ahead of 'origin/main' by 2 commits.
```

Or:

```text
Your branch is behind 'origin/main' by 3 commits.
```

Or:

```text
Your branch and 'origin/main' have diverged.
```

This information comes from the relationship between the local branch and its upstream.

---

# 11. Ahead

Suppose:

```text
origin/main:
A ── B

local main:
A ── B ── C ── D
```

Then local `main` is:

```text
ahead by 2 commits
```

You can usually publish them with:

```cmd
git push
```

---

# 12. Behind

Suppose:

```text
origin/main:
A ── B ── C ── D

local main:
A ── B
```

Your local branch is:

```text
behind by 2 commits
```

You need to integrate the remote changes, commonly with:

```cmd
git pull
```

or explicitly:

```cmd
git fetch origin
git merge origin/main
```

or:

```cmd
git fetch origin
git rebase origin/main
```

---

# 13. Diverged

Example:

```text
        C
       /
A ── B
       \
        D
```

Remote:

```text
A ── B ── C
```

Local:

```text
A ── B ── D
```

The branches have diverged.

`git status` may report:

```text
Your branch and 'origin/main' have diverged
```

You must integrate the histories before a normal push.

---

# 14. `git branch -vv`

This is one of the most useful commands for tracking information:

```cmd
git branch -vv
```

Example:

```text
* main          abc1234 [origin/main] update README
  feature/login def5678 [origin/feature/login: ahead 2] login work
```

It can show:

```text
local branch
commit
upstream branch
ahead/behind information
```

---

# 15. Show Only Current Branch

```cmd
git branch --show-current
```

Example:

```text
main
```

Then:

```cmd
git branch -vv
```

can be used to inspect its tracking configuration.

---

# 16. Show Upstream Branch

Use:

```cmd
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
```

Example:

```text
origin/main
```

This asks Git:

```text
"What is the upstream branch of my current branch?"
```

---

# 17. Show Upstream Remote

```cmd
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
```

Example:

```text
origin/main
```

The remote portion is:

```text
origin
```

The branch portion is:

```text
main
```

---

# 18. `@{upstream}`

Git provides special revision syntax:

```text
@{upstream}
```

or:

```text
@{u}
```

For a branch tracking `origin/main`:

```text
@{u}
```

resolves to:

```text
origin/main
```

Example:

```cmd
git log @{u}..HEAD --oneline
```

shows commits in your current branch that are not in its upstream.

---

# 19. `HEAD` vs `@{upstream}`

Suppose:

```text
HEAD
 ↓
main
 ↓
origin/main
```

Then:

```text
HEAD
```

represents your current commit.

```text
@{upstream}
```

represents the configured upstream branch.

This allows:

```cmd
git log @{u}..HEAD
```

to compare your current branch against its upstream.

---

# 20. Commits Ahead of Upstream

```cmd
git log @{u}..HEAD --oneline
```

Meaning:

```text
commits reachable from HEAD
but not reachable from upstream
```

Useful before:

```cmd
git push
```

---

# 21. Commits Behind Upstream

```cmd
git log HEAD..@{u} --oneline
```

Meaning:

```text
commits reachable from upstream
but not reachable from HEAD
```

Useful before integrating remote changes.

---

# 22. Compare Both Directions

```cmd
git log --left-right --oneline HEAD...@{u}
```

This helps identify commits unique to each side.

For a graphical view:

```cmd
git log --left-right --graph --oneline HEAD...@{u}
```

---

# 23. Tracking During Branch Creation

You can create a local branch directly from a remote-tracking branch:

```cmd
git switch --track origin/feature/login
```

Git can create:

```text
feature/login
```

and configure it to track:

```text
origin/feature/login
```

---

# 24. `git checkout --track`

Older/common syntax:

```cmd
git checkout --track origin/feature/login
```

This creates a local branch based on:

```text
origin/feature/login
```

and establishes tracking.

Modern Git generally favors:

```cmd
git switch --track origin/feature/login
```

---

# 25. Explicit Branch Name With `--track`

You can specify the local branch name:

```cmd
git switch -c login --track origin/feature/login
```

Now:

```text
local:
login

upstream:
origin/feature/login
```

The branch names do not have to match.

---

# 26. `--no-track`

Git can be instructed not to establish tracking:

```cmd
git switch --no-track -c feature/test
```

This creates the branch without an upstream relationship.

Then:

```cmd
git branch -vv
```

will not show an upstream for that branch.

---

# 27. Set Upstream After Branch Creation

Suppose:

```cmd
git switch -c feature/login
```

and you already have the remote branch.

Set its upstream:

```cmd
git branch --set-upstream-to=origin/feature/login
```

Shorter:

```cmd
git branch -u origin/feature/login
```

---

# 28. `git branch -u`

Example:

```cmd
git branch -u origin/main
```

This sets the upstream of the current branch to:

```text
origin/main
```

You can specify another local branch:

```cmd
git branch -u origin/develop feature/login
```

This means:

```text
feature/login
       ↓
origin/develop
```

---

# 29. Remove Upstream

To remove the upstream relationship:

```cmd
git branch --unset-upstream
```

After this:

```text
feature/login
```

still exists, but it no longer tracks:

```text
origin/feature/login
```

---

# 30. Tracking Does Not Mean Synchronization

Important:

```text
tracking ≠ automatically synchronized
```

If:

```text
main tracks origin/main
```

Git does not automatically download or upload commits.

You still need:

```cmd
git fetch
```

or:

```cmd
git pull
```

or:

```cmd
git push
```

---

# 31. Tracking Is Configuration

Tracking is essentially metadata attached to a local branch.

For example:

```ini
[branch "main"]
    remote = origin
    merge = refs/heads/main
```

This tells Git:

```text
branch main
    ↓
remote origin
    ↓
remote branch refs/heads/main
```

---

# 32. `branch.<name>.remote`

The configuration:

```ini
branch.main.remote = origin
```

specifies the remote associated with the branch.

Inspect:

```cmd
git config --get branch.main.remote
```

Output:

```text
origin
```

---

# 33. `branch.<name>.merge`

The configuration:

```ini
branch.main.merge = refs/heads/main
```

specifies the upstream branch reference.

Inspect:

```cmd
git config --get branch.main.merge
```

Output:

```text
refs/heads/main
```

Together:

```ini
[branch "main"]
    remote = origin
    merge = refs/heads/main
```

represent the tracking relationship.

---

# 34. Inspect Current Branch Configuration

```cmd
git config --get-regexp "^branch\."
```

Example:

```text
branch.main.remote origin
branch.main.merge refs/heads/main
branch.feature/login.remote origin
branch.feature/login.merge refs/heads/feature/login
```

This is useful for debugging tracking configuration.

---

# 35. Tracking and `git pull`

If:

```text
main → origin/main
```

then:

```cmd
git pull
```

knows which remote branch should be integrated.

Conceptually:

```text
git pull
   =
git fetch
   +
integration
```

The exact integration behavior depends on configuration.

---

# 36. Tracking and `git push`

If:

```text
main → origin/main
```

then:

```cmd
git push
```

can use the configured upstream/push behavior.

This is why:

```cmd
git push -u origin main
```

is so useful for a newly published branch.

---

# 37. Tracking and Branch Renaming

Suppose:

```text
feature/login
      ↓
origin/feature/login
```

Rename the local branch:

```cmd
git branch -m feature/auth
```

Git generally updates the local branch's configuration appropriately, but the remote branch still has its original name unless separately renamed.

You may need to publish the new remote branch explicitly.

---

# 38. Rename Remote Branch Workflow

Example:

```cmd
git branch -m feature/login feature/auth
```

Push new branch:

```cmd
git push -u origin feature/auth
```

Delete old remote branch:

```cmd
git push origin --delete feature/login
```

Now:

```text
feature/auth
      ↓
origin/feature/auth
```

---

# 39. Remote-Tracking Branches Are Local References

This is a critical concept.

When you see:

```text
origin/main
```

you are looking at a reference in **your local repository**.

It represents your last known state of the remote branch.

It does not mean Git is continuously connected to the server.

To update it:

```cmd
git fetch origin
```

---

# 40. Fetch Updates Tracking Information

Before fetch:

```text
remote main:
A ── B ── C

local origin/main:
A ── B
```

After:

```cmd
git fetch origin
```

your remote-tracking reference becomes:

```text
origin/main:
A ── B ── C
```

Your local branch does not automatically move:

```text
main:
A ── B
```

---

# 41. Tracking Branch vs Remote-Tracking Branch

These terms are frequently confused.

### Tracking branch

Usually means a local branch configured with an upstream.

Example:

```text
main
```

### Remote-tracking branch

A local reference representing a remote branch.

Example:

```text
origin/main
```

Relationship:

```text
local branch
    │
    │ upstream
    ↓
remote-tracking branch
```

---

# 42. `origin/main` Is Not a Local Branch

Do not normally switch directly to:

```cmd
git switch origin/main
```

because that checks out the remote-tracking commit and can result in detached HEAD behavior.

Instead:

```cmd
git switch --track origin/main
```

creates a local tracking branch.

---

# 43. Remote Branch Deleted

Suppose the remote branch:

```text
origin/feature/login
```

was deleted on the server.

Your local repository may still show:

```text
origin/feature/login
```

until stale remote-tracking references are cleaned up.

Run:

```cmd
git fetch --prune
```

or:

```cmd
git remote prune origin
```

---

# 44. `fetch.prune`

You can configure automatic pruning during fetch:

```cmd
git config --global fetch.prune true
```

Then:

```cmd
git fetch
```

can remove stale remote-tracking references.

This is useful for keeping local remote-tracking information clean.

---

# 45. Tracking Branch After Clone

Typical clone:

```cmd
git clone https://example.com/project.git
```

Result:

```text
local:
main
   ↓
origin/main
```

Check:

```cmd
git branch -vv
```

You may see:

```text
* main abc1234 [origin/main] initial commit
```

---

# 46. Tracking a Remote Branch With Different Names

Example:

```text
local:
release

remote:
origin/main
```

Configure:

```cmd
git branch -u origin/main release
```

Now:

```text
release
   ↓
origin/main
```

The names differ, but tracking still works.

---

# 47. Push and Pull With Different Names

Suppose:

```text
local:
release

upstream:
origin/main
```

Then:

```cmd
git branch -u origin/main release
```

sets the upstream relationship.

Whether an unqualified:

```cmd
git push
```

uses that upstream depends on the configured `push.default` behavior.

For maximum clarity, use:

```cmd
git push origin release:main
```

when that is specifically what you intend.

---

# 48. Tracking Is Per Local Branch

You can have:

```text
main
  ↓
origin/main

feature/login
  ↓
origin/feature/login

feature/payment
  ↓
origin/feature/payment
```

Each local branch can have its own upstream configuration.

---

# 49. A Branch Can Have No Upstream

Example:

```text
feature/experiment
```

with no:

```text
origin/feature/experiment
```

Then:

```cmd
git branch -vv
```

may show no upstream relationship.

You can publish and track it:

```cmd
git push -u origin feature/experiment
```

---

# 50. A Branch Can Track a Remote Branch That Is Gone

You might have:

```text
feature/login
      ↓
origin/feature/login
```

and then someone deletes the remote branch.

After pruning:

```text
feature/login
      ↓
missing upstream
```

Git can report that the upstream branch is gone.

You must decide whether to:

```text
delete local branch
change upstream
recreate remote branch
```

---

# 51. Change Upstream

```cmd
git branch -u origin/develop
```

Now the current branch tracks:

```text
origin/develop
```

Remove it completely:

```cmd
git branch --unset-upstream
```

---

# 52. Tracking and Multiple Remotes

Suppose:

```text
origin
upstream
```

A local branch can track:

```text
upstream/main
```

while you might push to:

```text
origin/feature/login
```

Tracking and push destinations are related but are not necessarily identical.

This distinction is important in fork-based workflows.

---

# 53. Fork Example

```text
upstream/main
      ↑
      │ fetch
      │
local main
      │
      │ push
      ↓
origin/main
```

A contributor may fetch the original project from:

```text
upstream
```

while publishing personal branches to:

```text
origin
```

Do not assume `origin` always means the original repository.

---

# 54. Inspect All Branches and Tracking

Use:

```cmd
git branch -a -vv
```

This can show:

```text
local branches
remote-tracking branches
upstream relationships
ahead/behind information
```

Example:

```text
* main                  abc1234 [origin/main]
  feature/login         def5678 [origin/feature/login: ahead 2]
  remotes/origin/main   abc1234
  remotes/origin/develop 9876543
```

---

# 55. Tracking and `git switch`

Create local tracking branch:

```cmd
git switch --track origin/develop
```

If Git can infer the local name:

```text
origin/develop
      ↓
develop
```

It creates:

```text
develop → origin/develop
```

---

# 56. Tracking and `git checkout`

Legacy/common syntax:

```cmd
git checkout --track origin/develop
```

Modern syntax:

```cmd
git switch --track origin/develop
```

Prefer `switch` for branch switching in modern Git because it makes branch operations more explicit.

---

# 57. Tracking and `git pull --rebase`

If your branch tracks:

```text
origin/main
```

you can use:

```cmd
git pull --rebase
```

This fetches the upstream changes and rebases your local commits on top of them.

Conceptually:

```text
Before:

A ── B ── C   origin/main
     \
      D ── E   local


After rebase:

A ── B ── C ── D' ── E'
```

The exact result depends on the repository state and conflicts.

---

# 58. Configure Pull Rebase

You can configure:

```cmd
git config --global pull.rebase true
```

Then:

```cmd
git pull
```

can use rebase behavior by default.

This changes integration behavior and should match your team's workflow.

---

# 59. Tracking and `git status -sb`

```cmd
git status -sb
```

can provide compact branch/tracking information.

Example:

```text
## main...origin/main [ahead 2]
```

This means:

```text
current branch = main
upstream = origin/main
local is ahead by 2
```

---

# 60. Tracking and Revision Ranges

For a tracked branch:

```cmd
git log @{u}..HEAD --oneline
```

means:

```text
what I have that upstream does not
```

And:

```cmd
git log HEAD..@{u} --oneline
```

means:

```text
what upstream has that I do not
```

This is more robust than hard-coding:

```text
origin/main
```

because it uses the current branch's configured upstream.

---

# 61. Tracking and `git diff`

Outgoing changes:

```cmd
git diff @{u}..HEAD
```

Remote-side changes:

```cmd
git diff HEAD..@{u}
```

Three-dot comparison:

```cmd
git diff HEAD...@{u}
```

has different semantics and is useful when comparing changes from the common ancestor.

Understanding revision ranges is essential for advanced Git usage.

---

# 62. Tracking Configuration Internals

Example:

```ini
[branch "feature/login"]
    remote = origin
    merge = refs/heads/feature/login
```

Interpretation:

```text
branch.feature/login.remote
    ↓
origin

branch.feature/login.merge
    ↓
refs/heads/feature/login
```

Together:

```text
feature/login
       ↓
origin/feature/login
```

---

# 63. Tracking Is Not a Copy

Suppose:

```text
main
 ↓
commit A

origin/main
 ↓
commit B
```

They are separate references.

Tracking does not make:

```text
main == origin/main
```

It only establishes:

```text
main's upstream = origin/main
```

---

# 64. Tracking and Commit Identity

Branches are references to commits.

Tracking connects references through configuration:

```text
local ref
   ↓
upstream remote-tracking ref
```

Example:

```text
refs/heads/main
       ↓
refs/remotes/origin/main
```

The underlying commit IDs can change as you fetch, commit, rebase, merge, or push.

---

# 65. Important Reference Names

Local branch:

```text
refs/heads/main
```

Remote-tracking branch:

```text
refs/remotes/origin/main
```

Remote branch on the server is conceptually represented as:

```text
refs/heads/main
```

on the remote repository itself.

The local:

```text
refs/remotes/origin/main
```

is your local remote-tracking reference.

---

# 66. Tracking With Explicit Refs

You can inspect:

```cmd
git show-ref
```

Example:

```text
abc123 refs/heads/main
abc123 refs/remotes/origin/main
```

This shows that both references currently point to the same object.

---

# 67. Tracking After Fetch

```cmd
git fetch origin
```

updates:

```text
refs/remotes/origin/*
```

according to the remote's fetch configuration.

It does not normally modify:

```text
refs/heads/*
```

your local branches.

This separation is fundamental to Git's remote workflow.

---

# 68. Tracking After Push

Suppose:

```text
main → C
origin/main → B
```

After:

```cmd
git push
```

the remote `main` can move to:

```text
C
```

and your local remote-tracking information is updated to reflect the successful push:

```text
main → C
origin/main → C
```

---

# 69. Tracking and Force Push

Suppose:

```text
main → D
origin/main → C
```

You rewrite history and force push.

After a successful:

```cmd
git push --force-with-lease
```

the remote branch and local remote-tracking reference can move to the rewritten history.

Tracking itself does not prevent history rewriting.

It only defines the upstream relationship.

---

# 70. Tracking Best Practices

Use:

```cmd
git push -u origin feature/name
```

when publishing a new branch.

Check:

```cmd
git branch -vv
```

regularly when debugging branch relationships.

Before complex operations:

```cmd
git fetch --prune
```

Then inspect:

```cmd
git log --oneline --decorate --graph --all
```

For current branch comparison:

```cmd
git log @{u}..HEAD --oneline
git log HEAD..@{u} --oneline
```

---

# 71. Common Tracking Mistakes

### Mistake 1: Confusing `main` and `origin/main`

They are different references.

### Mistake 2: Assuming `origin/main` is live

It is local remote-tracking information.

Update it with:

```cmd
git fetch origin
```

### Mistake 3: Creating a branch without upstream

Then:

```cmd
git push
```

may not know where to publish it.

Use:

```cmd
git push -u origin branch-name
```

### Mistake 4: Assuming tracking means synchronization

Tracking is configuration, not automatic synchronization.

### Mistake 5: Force pushing without checking the upstream

Always inspect:

```cmd
git branch -vv
```

before intentionally rewriting a shared branch.

---

# 72. Complete Tracking Workflow

Create:

```cmd
git switch -c feature/login
```

Work:

```cmd
git add .
git commit -m "Add login"
```

Publish:

```cmd
git push -u origin feature/login
```

Verify:

```cmd
git branch -vv
```

Fetch remote changes:

```cmd
git fetch origin
```

Inspect:

```cmd
git status
git log --oneline --decorate --graph --all
```

Continue working:

```cmd
git add .
git commit -m "Improve login validation"
```

Push:

```cmd
git push
```

Because the upstream relationship was established, Git knows the configured branch relationship.

---

# 73. Advanced Diagnostic Sequence

When you are unsure what your branch tracks:

```cmd
git branch --show-current
git branch -vv
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
git remote -v
git status -sb
```

Then inspect history:

```cmd
git log --oneline --decorate --graph --all
```

And compare:

```cmd
git log @{u}..HEAD --oneline
git log HEAD..@{u} --oneline
```

This gives you a precise picture of:

```text
current branch
upstream branch
remote
ahead commits
behind commits
history relationship
```

---

# 74. Essential Commands

```cmd
git branch -vv
```

Show tracking relationships.

```cmd
git branch -r
```

Show remote-tracking branches.

```cmd
git branch -a
```

Show local and remote-tracking branches.

```cmd
git switch --track origin/main
```

Create a local tracking branch.

```cmd
git push -u origin feature/login
```

Publish and establish tracking.

```cmd
git branch -u origin/main
```

Set upstream.

```cmd
git branch --unset-upstream
```

Remove upstream.

```cmd
git fetch --prune
```

Update remote-tracking branches and remove stale ones.

```cmd
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
```

Show current upstream.

```cmd
git log @{u}..HEAD --oneline
```

Show commits ahead.

```cmd
git log HEAD..@{u} --oneline
```

Show commits behind.

---

# 75. Final Mental Model

```text
                    REMOTE REPOSITORY
                           │
                           │ fetch
                           ↓
                  origin/main
             remote-tracking ref
                           │
                           │ upstream
                           ↓
                         main
                    local branch
                           │
                           │ commit
                           ↓
                    local history


main ───────────────→ origin/main
 ↑                         ↑
local branch           remote-tracking
                        branch
```

Remember:

```text
1. A tracking branch is a local branch with an upstream configured.
2. origin/main is a remote-tracking reference stored locally.
3. main and origin/main are separate references.
4. Tracking does not automatically synchronize anything.
5. git fetch updates remote-tracking information.
6. git push publishes local commits and can update the remote.
7. git pull uses the upstream relationship to determine what to integrate.
8. git push -u establishes an upstream when publishing a new branch.
9. git branch -vv is the primary quick diagnostic command.
10. @{u} refers to the current branch's upstream.
11. refs/heads/main represents a local branch reference.
12. refs/remotes/origin/main represents a remote-tracking reference.
13. A local branch can track a differently named remote branch.
14. A branch can have no upstream.
15. An upstream can become stale or disappear.
16. git fetch --prune cleans stale remote-tracking references.
17. Tracking is configuration; it is not a live connection.
18. Understanding tracking is essential for correctly using push, pull, fetch, rebase, and branch workflows.
```

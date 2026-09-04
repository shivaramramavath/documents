# Git Upstream

## 1. What Is an Upstream Branch?

An **upstream branch** is the remote-tracking branch that a local branch is configured to follow.

Example:

```text
local branch
    main
      │
      │ upstream
      ↓
remote-tracking branch
    origin/main
```

The upstream relationship tells Git:

```text
main → origin/main
```

This relationship is used by commands such as:

```cmd
git pull
git push
git status
git branch -vv
```

---

# 2. Upstream Is Not the Same as Remote

A **remote** identifies a repository.

Example:

```text
origin
```

An **upstream branch** identifies the branch a local branch follows.

Example:

```text
origin/main
```

So:

```text
origin
```

is a remote.

```text
origin/main
```

is a remote-tracking branch.

---

# 3. Basic Relationship

Suppose you have:

```text
main
```

and:

```text
origin/main
```

If `main` tracks `origin/main`:

```text
main
 │
 └──── upstream ────→ origin/main
```

The local branch does not become part of the remote branch.

It simply has a configured relationship with it.

---

# 4. Why Upstream Exists

Without an upstream:

```text
main
```

Git does not necessarily know which remote branch should be used as its default comparison or integration target.

With:

```text
main → origin/main
```

Git can determine:

```text
pull from origin/main
compare against origin/main
push according to push configuration
show ahead/behind relative to origin/main
```

---

# 5. Create Upstream With `git push -u`

The most common way to create an upstream relationship for a new branch is:

```cmd
git push -u origin main
```

The `-u` option is shorthand for:

```cmd
git push --set-upstream origin main
```

After this:

```text
main
 │
 ↓
origin/main
```

---

# 6. New Feature Branch

Create:

```cmd
git switch -c feature/login
```

Commit:

```cmd
git add .
git commit -m "Add login feature"
```

Push and establish upstream:

```cmd
git push -u origin feature/login
```

Now:

```text
feature/login
      │
      ↓
origin/feature/login
```

Future pushes can usually use:

```cmd
git push
```

---

# 7. Set Upstream After Creation

Suppose the branch already exists locally:

```cmd
git switch feature/login
```

Set its upstream:

```cmd
git branch -u origin/feature/login
```

Equivalent:

```cmd
git branch --set-upstream-to=origin/feature/login
```

Now:

```text
feature/login
      ↓
origin/feature/login
```

---

# 8. Set Upstream for Another Local Branch

You can specify the local branch explicitly:

```cmd
git branch -u origin/main feature/login
```

This means:

```text
feature/login
      ↓
origin/main
```

The local and upstream branch names do not have to match.

---

# 9. Remove Upstream

Remove the upstream configuration:

```cmd
git branch --unset-upstream
```

The local branch remains:

```text
feature/login
```

but the relationship:

```text
feature/login → origin/feature/login
```

is removed.

---

# 10. Verify Upstream

Use:

```cmd
git branch -vv
```

Example:

```text
* main abc1234 [origin/main] latest commit
```

The important part is:

```text
[origin/main]
```

This indicates the upstream branch.

---

# 11. Show Current Upstream

Use:

```cmd
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
```

Example:

```text
origin/main
```

This directly asks Git for the upstream of the current branch.

---

# 12. The `@{u}` Shortcut

Git provides:

```text
@{upstream}
```

and its shorter form:

```text
@{u}
```

If:

```text
main → origin/main
```

then:

```text
@{u}
```

resolves to:

```text
origin/main
```

Example:

```cmd
git log @{u}
```

---

# 13. `@{u}` Is Dynamic

Avoid hard-coding:

```cmd
git log origin/main
```

when you want to work with the current branch's upstream.

Instead:

```cmd
git log @{u}
```

If you switch branches:

```cmd
git switch feature/login
```

then:

```cmd
git log @{u}
```

automatically refers to the upstream configured for `feature/login`.

This makes scripts and diagnostic commands more reusable.

---

# 14. Commits Ahead of Upstream

To see commits that exist locally but not in upstream:

```cmd
git log @{u}..HEAD --oneline
```

Conceptually:

```text
upstream:
A ── B

local:
A ── B ── C ── D
```

Output:

```text
D
C
```

The local branch is ahead by two commits.

---

# 15. Commits Behind Upstream

Use:

```cmd
git log HEAD..@{u} --oneline
```

Conceptually:

```text
upstream:
A ── B ── C ── D

local:
A ── B
```

The output contains:

```text
D
C
```

These are commits that exist upstream but not in the local branch.

---

# 16. Check Ahead and Behind

```cmd
git status -sb
```

Example:

```text
## main...origin/main [ahead 2, behind 1]
```

This means:

```text
local branch = main
upstream = origin/main
local has 2 unique commits
upstream has 1 unique commit
```

The branches have diverged.

---

# 17. Compare With `git diff`

Compare local changes against upstream:

```cmd
git diff @{u}..HEAD
```

Compare upstream against local:

```cmd
git diff HEAD..@{u}
```

These commands operate on the commit ranges rather than simply comparing working-tree files.

---

# 18. Three-Dot Comparison

You can also use:

```cmd
git diff HEAD...@{u}
```

The three-dot form compares changes relative to the common ancestor.

This becomes particularly useful when branches have diverged.

---

# 19. Upstream and `git pull`

If:

```text
main → origin/main
```

then:

```cmd
git pull
```

can use that upstream relationship.

Conceptually:

```text
git pull
   │
   ├── fetch
   │
   └── integrate upstream
```

The exact integration method can be merge or rebase depending on configuration and command options.

---

# 20. Explicit Pull

Instead of relying on upstream:

```cmd
git pull origin main
```

You explicitly specify:

```text
remote = origin
branch = main
```

With upstream configured:

```cmd
git pull
```

can infer the intended relationship.

---

# 21. Upstream and `git fetch`

Fetching:

```cmd
git fetch origin
```

updates remote-tracking references such as:

```text
origin/main
origin/develop
origin/feature/login
```

It does **not** automatically move your local branch.

Example:

```text
Before:

main ─────── A
origin/main ─────── A

After fetch:

main ─────── A
origin/main ─────── B
```

Your local `main` remains at `A`.

---

# 22. Upstream and `git push`

Suppose:

```text
main → origin/main
```

and:

```text
main
A ── B ── C
```

while:

```text
origin/main
A ── B
```

A normal:

```cmd
git push
```

can use the configured branch relationship according to Git's push configuration.

After successful push:

```text
main:
A ── B ── C

origin/main:
A ── B ── C
```

---

# 23. Upstream Does Not Mean Push Destination in Every Configuration

This distinction is important:

```text
upstream configuration
```

and:

```text
push destination
```

are related but not conceptually identical.

For example:

```text
local branch:
feature/login

upstream:
upstream/main

push destination:
origin/feature/login
```

This kind of setup is common in fork-based development.

---

# 24. Fork Workflow

Suppose:

```text
upstream
   ↓
original project

origin
   ↓
your fork
```

Your local repository has both:

```text
origin
upstream
```

A common configuration is:

```text
main → upstream/main
```

while feature branches are published to:

```text
origin/feature/login
```

This allows you to track the original project's development while pushing your own work to your fork.

---

# 25. Remote Named `upstream`

The word **upstream** can have two meanings.

### Meaning 1 — Git branch relationship

```text
main → origin/main
```

`origin/main` is the upstream branch.

### Meaning 2 — Remote named `upstream`

```text
git remote add upstream <repository>
```

Here:

```text
upstream
```

is simply a remote name.

These are not the same concept.

---

# 26. Remote Named `upstream`

You can have:

```text
origin
upstream
```

Run:

```cmd
git remote -v
```

Example:

```text
origin    <repository>
upstream  <repository>
```

A local branch can track:

```text
upstream/main
```

or:

```text
origin/main
```

depending on configuration.

---

# 27. Branch Can Track a Different Name

Suppose:

```text
local:
release

upstream:
origin/main
```

Configure:

```cmd
git branch -u origin/main release
```

Now:

```text
release
   │
   ↓
origin/main
```

This is valid.

Branch names do not need to match.

---

# 28. Branch Can Have No Upstream

Create:

```cmd
git switch -c experiment
```

If you do not configure an upstream:

```text
experiment
```

has no upstream relationship.

Check:

```cmd
git branch -vv
```

You will not see something like:

```text
[origin/experiment]
```

for that branch.

---

# 29. Create Without Tracking

You can explicitly prevent automatic tracking:

```cmd
git switch --no-track -c experiment
```

Now:

```text
experiment
```

exists without an upstream.

---

# 30. Create a Tracking Branch From Remote

If the remote-tracking branch already exists:

```cmd
git switch --track origin/develop
```

Git creates a local branch:

```text
develop
```

with:

```text
develop → origin/develop
```

---

# 31. Explicit Local Name

You can choose a different local name:

```cmd
git switch -c development --track origin/develop
```

Result:

```text
development
      ↓
origin/develop
```

---

# 32. Upstream Configuration Internals

Git stores the relationship in configuration.

Example:

```ini
[branch "main"]
    remote = origin
    merge = refs/heads/main
```

This means:

```text
branch:
main

remote:
origin

merge/upstream ref:
refs/heads/main
```

Git combines this information to resolve:

```text
origin/main
```

as the upstream.

---

# 33. Inspect Branch Remote

```cmd
git config --get branch.main.remote
```

Output:

```text
origin
```

---

# 34. Inspect Branch Merge Reference

```cmd
git config --get branch.main.merge
```

Output:

```text
refs/heads/main
```

Together:

```ini
branch.main.remote = origin
branch.main.merge = refs/heads/main
```

represent:

```text
main → origin/main
```

---

# 35. Inspect All Branch Upstream Configuration

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

This is useful for advanced debugging.

---

# 36. Upstream Reference Internals

A local branch is generally represented by:

```text
refs/heads/main
```

A remote-tracking branch is represented by:

```text
refs/remotes/origin/main
```

So:

```text
local:
refs/heads/main
```

tracks:

```text
remote-tracking:
refs/remotes/origin/main
```

The remote-tracking reference represents your local knowledge of the remote branch.

---

# 37. Upstream Is Not the Remote Server Directly

This is a critical distinction:

```text
main
 ↓
refs/remotes/origin/main
```

Your local branch tracks the **local remote-tracking reference**.

That reference is updated through operations such as:

```cmd
git fetch
```

Therefore:

```text
upstream relationship
```

does not mean your local branch is directly connected to a server at every moment.

---

# 38. Stale Upstream

Suppose:

```text
feature/login
       ↓
origin/feature/login
```

Someone deletes the remote branch.

Your local repository may still contain:

```text
origin/feature/login
```

until the remote-tracking reference is pruned.

Run:

```cmd
git fetch --prune
```

Then Git can remove stale remote-tracking references.

---

# 39. Upstream Branch Deleted

After pruning, you may have:

```text
feature/login
       ↓
[upstream no longer exists]
```

Git can report that the configured upstream branch is gone.

You can then:

### Remove upstream

```cmd
git branch --unset-upstream
```

### Recreate the remote branch

```cmd
git push -u origin feature/login
```

### Point the branch to another upstream

```cmd
git branch -u origin/develop
```

The correct action depends on your workflow.

---

# 40. Upstream After Rebase

Suppose:

```text
main → origin/main
```

You rebase local commits:

```text
Before:

A ── B ── C   origin/main
     \
      D ── E   main
```

After rebase:

```text
A ── B ── C ── D' ── E'   main
             ↑
        rewritten commits
```

The upstream relationship can remain:

```text
main → origin/main
```

but the histories may now differ.

A normal push may be rejected because the remote history does not contain the rewritten commits.

---

# 41. Upstream After Force Push

If the rewritten branch is intentionally published:

```cmd
git push --force-with-lease
```

The remote branch can be updated to the rewritten history.

The safer form is generally:

```cmd
git push --force-with-lease
```

rather than blindly using:

```cmd
git push --force
```

because `--force-with-lease` provides protection against overwriting unexpected remote updates.

---

# 42. Upstream and Branch Deletion

Delete a local branch:

```cmd
git branch -d feature/login
```

Delete the remote branch:

```cmd
git push origin --delete feature/login
```

These are separate operations.

Deleting a local branch does not inherently mean deleting its remote branch.

---

# 43. Upstream and Remote Rename

If a remote is renamed:

```cmd
git remote rename origin central
```

Git updates relevant remote configuration.

A relationship such as:

```text
main → origin/main
```

can become:

```text
main → central/main
```

because the remote name changed.

Always verify:

```cmd
git branch -vv
```

after significant remote configuration changes.

---

# 44. Upstream and Remote Removal

If you remove a remote:

```cmd
git remote remove origin
```

the remote-tracking references associated with that remote are removed.

Branches that depended on that remote as their upstream can lose their usable upstream target.

Inspect afterward:

```cmd
git branch -vv
```

---

# 45. Upstream and Multiple Remotes

Example:

```text
origin/main
upstream/main
```

Your local branch can track one of them:

```text
main → upstream/main
```

while another branch tracks:

```text
feature/login → origin/feature/login
```

Each local branch can have its own upstream.

---

# 46. Upstream Is Per Local Branch

This:

```text
main → origin/main
```

does not imply:

```text
feature/login → origin/feature/login
```

Every local branch has its own branch configuration.

Example:

```text
main
  ↓
origin/main

develop
  ↓
origin/develop

feature/login
  ↓
origin/feature/login
```

---

# 47. Upstream and `git status`

When an upstream exists:

```cmd
git status
```

can tell you:

```text
Your branch is ahead of 'origin/main' by 2 commits.
```

or:

```text
Your branch is behind 'origin/main' by 3 commits.
```

or:

```text
Your branch is up to date with 'origin/main'.
```

Without an upstream, Git cannot make this particular upstream comparison.

---

# 48. Upstream and `git branch -vv`

Use:

```cmd
git branch -vv
```

Example:

```text
* main          abc1234 [origin/main] latest changes
  develop       def5678 [origin/develop: behind 2] development
  experiment    9876543 experimental work
```

Interpretation:

```text
main
 └─ tracks origin/main

develop
 └─ tracks origin/develop

experiment
 └─ no upstream
```

---

# 49. Upstream and `git status --short --branch`

```cmd
git status -sb
```

Example:

```text
## feature/login...origin/feature/login [ahead 3]
```

This compactly displays:

```text
current branch
upstream
ahead/behind state
```

It is particularly useful in scripts and terminal workflows.

---

# 50. Find the Upstream Commit

```cmd
git rev-parse @{u}
```

This returns the commit ID referenced by the upstream.

Example:

```text
abc123456789...
```

You can then inspect it:

```cmd
git show @{u}
```

---

# 51. Find the Upstream Branch Name

```cmd
git rev-parse --abbrev-ref @{u}
```

Example:

```text
origin/main
```

For the full symbolic reference:

```cmd
git rev-parse --symbolic-full-name @{u}
```

Example:

```text
refs/remotes/origin/main
```

---

# 52. Find the Common Ancestor

For advanced branch analysis:

```cmd
git merge-base HEAD @{u}
```

This returns the commit that Git identifies as the merge base.

Graphically:

```text
        C ── D   local
       /
A ── B
       \
        E ── F   upstream
```

The merge base is:

```text
B
```

This is important for understanding divergence and three-way operations.

---

# 53. Determine Divergence

Use:

```cmd
git rev-list --left-right --count HEAD...@{u}
```

Example:

```text
2    3
```

Interpretation:

```text
local-only commits     = 2
upstream-only commits  = 3
```

This is a precise way to measure divergence.

---

# 54. Inspect Both Histories

```cmd
git log --left-right --graph --oneline HEAD...@{u}
```

Example concept:

```text
> local commit
> local commit
< upstream commit
< upstream commit
```

The markers identify which side contains each commit.

---

# 55. Upstream and Merge Base

You can inspect:

```cmd
git merge-base HEAD @{u}
```

then:

```cmd
git show $(git merge-base HEAD @{u})
```

In Windows `cmd`, command substitution using `$()` does not work like Unix shells.

Use:

```cmd
git merge-base HEAD @{u}
```

first, then:

```cmd
git show <returned-commit-id>
```

This is useful when manually debugging divergent histories.

---

# 56. Upstream and Pull Rebase

If:

```text
main → origin/main
```

then:

```cmd
git pull --rebase
```

uses the upstream as the integration target.

Conceptually:

```text
remote:
A ── B ── C

local:
A ── B ── D ── E
```

After rebase:

```text
A ── B ── C ── D' ── E'
```

The upstream relationship remains conceptually:

```text
main → origin/main
```

---

# 57. Configure Rebase Behavior

You can configure a branch:

```cmd
git config branch.main.rebase true
```

Then pulls involving that branch can use rebase behavior.

Global configuration:

```cmd
git config --global pull.rebase true
```

Always understand your team's workflow before changing global pull behavior.

---

# 58. Upstream and Push Configuration

Git has separate push configuration such as:

```text
push.default
branch.<name>.pushRemote
remote.pushDefault
```

These can affect where an unqualified:

```cmd
git push
```

publishes changes.

Therefore, advanced Git users should distinguish:

```text
upstream for branch integration/comparison
```

from:

```text
push destination configuration
```

---

# 59. `branch.<name>.pushRemote`

A branch can have a specific push remote:

```ini
[branch "feature/login"]
    remote = upstream
    merge = refs/heads/main
    pushRemote = origin
```

Conceptually:

```text
feature/login
      │
      ├── upstream/comparison → upstream/main
      │
      └── push → origin
```

This is useful in fork workflows.

---

# 60. `remote.pushDefault`

You can configure a default push remote:

```cmd
git config --global remote.pushDefault origin
```

This can make:

```text
fetch/pull source
```

different from:

```text
push destination
```

This distinction becomes valuable in multi-remote repositories.

---

# 61. Upstream With a Fork

A sophisticated fork workflow may look like:

```text
                    ORIGINAL
                   upstream/main
                        ↑
                        │ fetch
                        │
                     local
                        │
                        │ push
                        ↓
                    YOUR FORK
                   origin/main
```

You might configure:

```text
local main → upstream/main
```

while pushing feature branches to:

```text
origin/feature/login
```

This lets you stay synchronized with the original project while developing against your fork.

---

# 62. Upstream Is Not Necessarily `origin`

Do not memorize:

```text
upstream = origin/main
```

as a rule.

The correct statement is:

```text
upstream = whatever remote-tracking branch the local branch is configured to follow
```

It could be:

```text
origin/main
upstream/main
company/develop
team/release
```

---

# 63. Common Commands

### Set upstream

```cmd
git branch -u origin/main
```

### Set upstream for a specific local branch

```cmd
git branch -u origin/main feature/login
```

### Set upstream while pushing

```cmd
git push -u origin feature/login
```

### Remove upstream

```cmd
git branch --unset-upstream
```

### Show upstream

```cmd
git branch -vv
```

### Show current upstream

```cmd
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
```

---

# 64. Advanced Diagnostic Sequence

When a branch behaves unexpectedly:

```cmd
git branch --show-current
git branch -vv
git remote -v
git status -sb
```

Then inspect configuration:

```cmd
git config --get-regexp "^branch\."
```

Inspect upstream:

```cmd
git rev-parse --symbolic-full-name @{u}
```

Inspect divergence:

```cmd
git rev-list --left-right --count HEAD...@{u}
```

Inspect history:

```cmd
git log --graph --decorate --oneline --all
```

This gives a complete picture of the branch's upstream relationship.

---

# 65. Practical Workflow

Create:

```cmd
git switch -c feature/payment
```

Commit:

```cmd
git add .
git commit -m "Add payment flow"
```

Publish:

```cmd
git push -u origin feature/payment
```

Verify:

```cmd
git branch -vv
```

Fetch:

```cmd
git fetch origin
```

Check:

```cmd
git status -sb
```

Inspect local-only commits:

```cmd
git log @{u}..HEAD --oneline
```

Inspect upstream-only commits:

```cmd
git log HEAD..@{u} --oneline
```

After reviewing the relationship:

```cmd
git pull --rebase
```

or use your team's preferred integration strategy.

Finally:

```cmd
git push
```

---

# 66. Important Rules

```text
1. Upstream is a relationship configured for a local branch.
2. An upstream is normally a remote-tracking branch.
3. origin is a remote name, not an upstream branch.
4. origin/main is a remote-tracking branch.
5. main can track origin/main.
6. A local branch can track a differently named branch.
7. A branch can have no upstream.
8. git push -u establishes an upstream relationship.
9. git branch -u changes the upstream relationship.
10. git branch --unset-upstream removes it.
11. @{u} means the current branch's upstream.
12. git fetch updates remote-tracking references.
13. Tracking does not automatically synchronize branches.
14. Upstream configuration is stored in Git configuration.
15. branch.<name>.remote identifies the remote.
16. branch.<name>.merge identifies the upstream ref.
17. push destination and upstream are not always identical.
18. Multiple remotes can be used simultaneously.
19. Fork workflows commonly separate upstream integration from origin publishing.
20. git branch -vv is the fastest general tracking diagnostic.
```

---

# 67. Final Mental Model

```text
                         REMOTE SERVER
                              │
                  ┌───────────┴───────────┐
                  │                       │
                origin                 upstream
                  │                       │
                  ↓                       ↓
             origin/main            upstream/main
                  │                       │
                  │                       │
                  └──── remote-tracking ──┘
                           references
                              │
                              │
                       local branch
                              │
                              ↓
                            main
```

For a normal repository:

```text
main
 │
 └──── upstream ────→ origin/main
```

For a fork workflow:

```text
main
 │
 └──── upstream ────→ upstream/main

feature/login
 │
 └──── upstream ────→ origin/feature/login
```

The key idea is:

```text
UPSTREAM = THE REMOTE-TRACKING BRANCH
           THAT A LOCAL BRANCH IS CONFIGURED TO FOLLOW
```

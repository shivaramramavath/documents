# Git Push

## 1. What Is `git push`?

`git push` transfers commits and other Git objects from your **local repository** to a **remote repository**, and updates remote references according to the push refspec.

Basic idea:

```text
LOCAL REPOSITORY
      │
      │ git push
      ↓
REMOTE REPOSITORY
```

Example:

```cmd
git push origin main
```

This pushes the local `main` branch to the `main` branch on the remote named `origin`.

---

# 2. Basic Syntax

```cmd
git push
```

Explicit:

```cmd
git push origin main
```

General syntax:

```cmd
git push [options] [<repository> [<refspec>...]]
```

---

# 3. What Does `git push` Actually Do?

Suppose your local repository is:

```text
A ── B ── C
         ↑
        main
```

Remote:

```text
A ── B
     ↑
origin/main
```

Run:

```cmd
git push origin main
```

Git transfers the required objects and updates the remote branch:

```text
A ── B ── C
         ↑
    origin/main
         ↑
        main
```

The remote branch now points to commit `C`.

---

# 4. Push Is Not the Same as Commit

These commands operate at different levels:

```cmd
git commit
```

creates a commit **locally**.

```cmd
git push
```

transfers your local commits to a remote repository.

Typical workflow:

```text
working tree
     ↓
git add
     ↓
staging area
     ↓
git commit
     ↓
local repository
     ↓
git push
     ↓
remote repository
```

---

# 5. Push Requires a Remote

Check configured remotes:

```cmd
git remote -v
```

Example:

```text
origin  git@github.com:user/project.git (fetch)
origin  git@github.com:user/project.git (push)
```

The remote name is:

```text
origin
```

---

# 6. Push to `origin`

Explicit:

```cmd
git push origin main
```

Meaning:

```text
remote = origin
source branch = main
destination branch = main
```

This is one of the clearest forms of push.

---

# 7. Push Without Arguments

After upstream tracking has been configured:

```cmd
git push
```

can determine where the current branch should be pushed.

For example:

```text
main
  ↓
tracks
  ↓
origin/main
```

Then:

```cmd
git push
```

can push `main` to `origin/main`.

---

# 8. Setting Upstream With `-u`

For a new branch:

```cmd
git switch -c feature/login
```

Push it and establish tracking:

```cmd
git push -u origin feature/login
```

`-u` means:

```text
--set-upstream
```

After this, you can generally use:

```cmd
git push
```

and:

```cmd
git pull
```

without specifying the remote and branch every time.

---

# 9. `--set-upstream`

Long form:

```cmd
git push --set-upstream origin feature/login
```

Short form:

```cmd
git push -u origin feature/login
```

Both establish the upstream relationship.

---

# 10. Upstream Relationship

After:

```cmd
git push -u origin feature/login
```

the relationship is conceptually:

```text
feature/login
       │
       ↓
 origin/feature/login
```

Check it:

```cmd
git branch -vv
```

Example:

```text
* feature/login abc1234 [origin/feature/login] add login
```

---

# 11. Push a New Branch

Create:

```cmd
git switch -c feature/payment
```

Commit:

```cmd
git add .
git commit -m "Add payment feature"
```

Push:

```cmd
git push -u origin feature/payment
```

Remote now has:

```text
origin/feature/payment
```

---

# 12. Push Existing Branch

If tracking is already configured:

```cmd
git push
```

Or explicitly:

```cmd
git push origin main
```

---

# 13. Push Multiple Branches

You can specify multiple refspecs:

```cmd
git push origin main feature/login
```

This pushes both specified branches.

For more complex cases, use explicit refspecs.

---

# 14. Push All Branches

```cmd
git push --all origin
```

`--all` pushes all local branches to the specified remote.

Be careful with this in large or shared repositories.

It can publish branches that you did not intend to publish.

---

# 15. Push Tags

Push a specific tag:

```cmd
git push origin v1.0.0
```

Push all local tags:

```cmd
git push origin --tags
```

A tag is a reference to a Git object, commonly a commit.

---

# 16. Annotated Tags

Create:

```cmd
git tag -a v1.0.0 -m "Release 1.0.0"
```

Push:

```cmd
git push origin v1.0.0
```

Inspect:

```cmd
git show v1.0.0
```

---

# 17. `--follow-tags`

```cmd
git push --follow-tags
```

This pushes annotated tags that are reachable from the commits being pushed and are not already present on the remote.

It is useful in release workflows.

It does not mean "push every tag."

For every local tag:

```cmd
git push --tags
```

---

# 18. Push Rejection

A common situation:

```text
remote:
A ── B ── C

local:
A ── B ── D
```

You attempt:

```cmd
git push
```

The remote may reject the push because updating the remote branch would discard or bypass commits already present on the remote.

Typical reason:

```text
non-fast-forward
```

---

# 19. Why Non-Fast-Forward Pushes Are Rejected

Suppose remote:

```text
A ── B ── C
```

Local:

```text
A ── B
     \
      D
```

If Git simply moved:

```text
origin/main → D
```

commit `C` would no longer be reachable through the branch.

Git therefore normally refuses the update.

This protects shared history.

---

# 20. Fixing a Non-Fast-Forward Push

First fetch:

```cmd
git fetch origin
```

Inspect:

```cmd
git log --oneline --decorate --graph --all
```

Then integrate:

```cmd
git rebase origin/main
```

or:

```cmd
git merge origin/main
```

Then push:

```cmd
git push
```

---

# 21. Recommended Workflow After Rejection

```cmd
git fetch origin
git status
git branch -vv
git log --oneline --decorate --graph --all
```

Then choose:

```cmd
git rebase origin/main
```

or:

```cmd
git merge origin/main
```

Resolve conflicts if necessary.

Then:

```cmd
git push
```

---

# 22. Force Push

You can override normal non-fast-forward protection:

```cmd
git push --force
```

This is dangerous.

It can move the remote branch to a different history and make existing remote commits unreachable from that branch.

---

# 23. Why `--force` Is Dangerous

Suppose remote:

```text
A ── B ── C
         ↑
     origin/main
```

Your local branch:

```text
A ── B ── D
         ↑
        main
```

Force pushing can change:

```text
origin/main
```

from:

```text
C
```

to:

```text
D
```

Potentially discarding the branch's previous visible history.

This is especially dangerous on shared branches.

---

# 24. Prefer `--force-with-lease`

Instead of:

```cmd
git push --force
```

prefer:

```cmd
git push --force-with-lease
```

`--force-with-lease` provides an additional safety check.

It generally refuses to overwrite the remote reference if the remote has changed in a way that your local expectations do not account for.

This makes it substantially safer for intentional history rewriting.

---

# 25. Force Push After Rebase

Suppose you rebased a branch that had already been pushed:

```cmd
git rebase -i HEAD~3
```

The commit IDs may change.

Normal push:

```cmd
git push
```

may be rejected.

If rewriting the remote branch is intentional:

```cmd
git push --force-with-lease
```

is generally preferable to:

```cmd
git push --force
```

---

# 26. Never Treat Force Push as Normal Push

Use:

```cmd
git push --force-with-lease
```

only when you intentionally changed the branch's history.

Typical reasons:

```text
interactive rebase
commit rewriting
history cleanup
amended pushed commit
```

Avoid force pushing shared protected branches unless the project explicitly permits it.

---

# 27. Delete a Remote Branch

Modern syntax:

```cmd
git push origin --delete feature/login
```

This deletes:

```text
origin/feature/login
```

on the remote.

Alternative refspec syntax:

```cmd
git push origin :feature/login
```

The modern `--delete` form is clearer.

---

# 28. Delete a Remote Tag

```cmd
git push origin --delete v1.0.0
```

This deletes the remote tag reference.

An alternative:

```cmd
git push origin :refs/tags/v1.0.0
```

The explicit ref form demonstrates that Git references are being updated.

---

# 29. Push an Empty Commit

You can create an empty commit:

```cmd
git commit --allow-empty -m "Trigger CI"
```

Then:

```cmd
git push
```

This is sometimes useful for triggering CI/CD systems that react to pushes.

---

# 30. Push With a Specific Ref

Git pushes references using refspecs.

Example:

```cmd
git push origin main
```

is conceptually similar to:

```text
main → refs/heads/main
```

You can explicitly specify:

```cmd
git push origin refs/heads/main:refs/heads/main
```

This makes the source and destination references explicit.

---

# 31. RefSpec Syntax

General form:

```text
<source>:<destination>
```

Example:

```cmd
git push origin main:main
```

Meaning:

```text
local main
     ↓
remote main
```

Another example:

```cmd
git push origin feature/login:feature/login
```

---

# 32. Push a Local Branch to a Different Remote Branch

Example:

```cmd
git push origin feature/login:review/login
```

This means:

```text
local:
feature/login

        ↓

remote:
review/login
```

The names do not need to be identical.

---

# 33. Delete a Remote Reference With a Refspec

An empty source means delete the destination:

```cmd
git push origin :feature/login
```

Conceptually:

```text
<empty source> : feature/login
```

means:

```text
delete remote feature/login
```

---

# 34. Force RefSpec

You can prefix a refspec with `+`:

```cmd
git push origin +main:main
```

This forces the update for that refspec.

It is an advanced form of force pushing.

Prefer the more explicit safety of:

```cmd
git push --force-with-lease
```

when rewriting shared history intentionally.

---

# 35. Push Current Branch

You can use:

```cmd
git push origin HEAD
```

This refers to the current checked-out commit/branch context.

To push the current branch to the same-named remote branch:

```cmd
git push origin HEAD:HEAD
```

However, for normal development, upstream tracking makes:

```cmd
git push
```

simpler and safer.

---

# 36. `HEAD:<branch>`

A useful pattern:

```cmd
git push origin HEAD:feature/login
```

This means:

```text
current local HEAD
       ↓
remote feature/login
```

This is useful when you don't want to type the local branch name.

---

# 37. `HEAD` With `-u`

For a new branch:

```cmd
git push -u origin HEAD
```

This can publish the current branch and establish its upstream using the configured push behavior.

A more explicit version is:

```cmd
git push -u origin feature/login
```

---

# 38. Push URL vs Fetch URL

Check:

```cmd
git remote -v
```

You may see:

```text
origin  https://example.com/repo.git (fetch)
origin  https://example.com/repo.git (push)
```

Git can configure different URLs for fetching and pushing.

This is useful in architectures where read and write endpoints differ.

---

# 39. Separate Push URL

You can inspect:

```cmd
git remote get-url origin
```

Push URL:

```cmd
git remote get-url --push origin
```

A repository can have:

```text
fetch URL
push URL
```

that are different.

---

# 40. Push and Authentication

Push requires write access to the remote repository.

Depending on transport, authentication may involve:

```text
SSH keys
credential managers
access tokens
organization authentication
```

If authentication fails, Git may reject the push before reference updates occur.

---

# 41. Push Permissions

Even valid authentication does not guarantee push permission.

A remote repository may enforce:

```text
branch protection
required reviews
status checks
signed commits
restricted push permissions
```

Therefore:

```text
authenticated ≠ authorized to push
```

---

# 42. Protected Branches

A remote may protect:

```text
main
master
production
release/*
```

For example, direct pushes to `main` may be prohibited.

Instead:

```text
feature branch
      ↓
push
      ↓
pull request
      ↓
review
      ↓
merge
```

The exact policy depends on the hosting platform and repository configuration.

---

# 43. Push and Pull Requests

Git itself does not create pull requests.

Git performs:

```cmd
git push
```

A hosting platform can then use the newly pushed branch to create a pull request.

Conceptually:

```text
local feature branch
       ↓
git push
       ↓
remote feature branch
       ↓
Pull Request
```

---

# 44. Push and Remote-Tracking Branches

After:

```cmd
git push
```

your local remote-tracking reference may be updated based on the push result.

For example:

```text
local:
main → C

remote:
origin/main → C
```

The remote-tracking branch represents your local knowledge of the remote branch.

---

# 45. Push Does Not Fetch

Important:

```cmd
git push
```

does not mean:

```text
download remote changes
```

It sends local updates to the remote.

Compare:

```text
git fetch
    remote → local

git push
    local → remote
```

---

# 46. Push Does Not Automatically Pull First

Running:

```cmd
git push
```

does not automatically perform:

```cmd
git pull
```

If the remote has advanced independently, your push may be rejected.

Then you must decide how to integrate the remote changes.

---

# 47. Push and Diverged History

Remote:

```text
A ── B ── C
```

Local:

```text
A ── B ── D
```

Push:

```cmd
git push
```

may fail.

Correct approach:

```cmd
git fetch origin
```

then inspect and integrate:

```cmd
git rebase origin/main
```

or:

```cmd
git merge origin/main
```

then:

```cmd
git push
```

---

# 48. `--dry-run`

Before actually pushing:

```cmd
git push --dry-run
```

This lets you inspect what Git would attempt without performing the actual remote update.

Useful for scripts and cautious operations.

---

# 49. `--porcelain`

For machine-readable output:

```cmd
git push --porcelain
```

This is useful when another program needs to parse push results.

Normal human-readable output is usually preferable interactively.

---

# 50. `--verbose`

Use:

```cmd
git push --verbose
```

for additional information.

Useful when debugging:

```text
remote selection
transport behavior
ref updates
```

---

# 51. `--quiet`

Use:

```cmd
git push --quiet
```

to reduce normal output.

Useful in scripts when detailed output is unnecessary.

---

# 52. `--atomic`

Advanced:

```cmd
git push --atomic origin main feature/login
```

Requests that multiple reference updates succeed or fail together.

Conceptually:

```text
main update       ─┐
                   ├── atomic operation
feature update    ─┘
```

If the remote supports the required atomic operation, either all requested updates succeed or none are applied.

This is useful for coordinated multi-reference updates.

---

# 53. `--thin`

Git can use thin packs during transfer:

```cmd
git push --thin
```

This is generally an implementation/performance detail.

Git normally handles pack negotiation automatically, so most users do not need to specify this.

---

# 54. `--no-thin`

Opposite:

```cmd
git push --no-thin
```

This requests a non-thin pack.

It is an advanced transport-level option and is rarely needed during ordinary development.

---

# 55. `--receive-pack`

Advanced:

```cmd
git push --receive-pack=<git-receive-pack> origin main
```

This specifies the program used on the remote side to receive pushed objects and references.

Normally Git uses:

```text
git-receive-pack
```

automatically.

---

# 56. Push Options

Some Git servers support push options:

```cmd
git push --push-option=<option>
```

Short form:

```cmd
git push -o <option>
```

These options can be passed to the remote server.

Their meaning is server-specific.

---

# 57. Push Negotiation

Modern Git can negotiate which objects need to be transferred.

Git does not simply send the entire repository every time.

Conceptually:

```text
local object database
        ↓
determine objects remote lacks
        ↓
pack required objects
        ↓
transfer
        ↓
remote object database
```

This is one reason Git can efficiently transfer incremental changes.

---

# 58. Objects During Push

Git repositories store objects such as:

```text
commit
tree
blob
tag
```

When pushing a new commit, Git transfers the objects required for the remote to understand that commit.

Example:

```text
commit
  ↓
tree
  ↓
blobs
```

The remote then updates its reference.

---

# 59. Reference Update

At a high level, pushing a branch consists of:

```text
transfer required objects
          ↓
remote reference update
```

For example:

```text
refs/heads/main
       ↓
    old SHA
       ↓
    new SHA
```

The branch reference moves only if the remote accepts the update.

---

# 60. Fast-Forward Push

Normal safe push:

```text
Remote:
A ── B

Local:
A ── B ── C
```

The remote branch can move:

```text
A ── B ── C
         ↑
      origin/main
```

This is a fast-forward update.

No existing remote branch history is discarded.

---

# 61. Non-Fast-Forward Push

Remote:

```text
A ── B ── C
```

Local:

```text
A ── B ── D
```

Moving remote directly from `C` to `D` would not be a fast-forward.

Git normally rejects it.

This is a core safety mechanism of Git's reference update model.

---

# 62. `push.default`

Git has configuration controlling what:

```cmd
git push
```

means when no refspec is specified.

Inspect:

```cmd
git config --get push.default
```

Common modes include:

```text
nothing
current
upstream
simple
matching
```

---

# 63. `push.default=simple`

A common setting:

```cmd
git config --global push.default simple
```

The `simple` mode is designed to avoid surprising pushes by using the current branch's upstream relationship with compatible branch naming.

This is generally a good default for normal development.

---

# 64. `push.default=current`

```cmd
git config --global push.default current
```

This pushes the current branch to a same-named branch on the remote, subject to the applicable push configuration.

---

# 65. `push.default=upstream`

```cmd
git config --global push.default upstream
```

This pushes the current branch to its configured upstream branch.

This can be useful when local and remote branch names intentionally differ.

---

# 66. `push.default=nothing`

```cmd
git config --global push.default nothing
```

Then:

```cmd
git push
```

without an explicit destination fails.

You must specify what should be pushed.

This is useful when you want maximum explicitness.

---

# 67. `remote.pushDefault`

Git can also configure a default push remote:

```cmd
git config remote.pushDefault origin
```

This can be useful when the remote used for fetching differs from the remote preferred for pushing.

---

# 68. `branch.<name>.pushRemote`

A branch can have its own push remote:

```ini
[branch "feature/login"]
    pushRemote = origin
```

This gives branch-specific control over where pushes go.

---

# 69. Push Refspec Configuration

Git can configure default push refspecs.

Inspect:

```cmd
git config --get-all remote.origin.push
```

Remote configuration can determine which refs are pushed when no explicit refspec is provided.

This is an advanced area and should be changed deliberately.

---

# 70. `remote.origin.push`

Example configuration:

```ini
[remote "origin"]
    url = ...
    fetch = +refs/heads/*:refs/remotes/origin/*
    push = refs/heads/main:refs/heads/main
```

The `push` configuration controls default push refspecs for that remote.

---

# 71. Push to a Different Remote

Suppose you have:

```text
origin
upstream
```

Push to:

```cmd
git push origin main
```

or:

```cmd
git push upstream main
```

The remote name determines where the reference update is sent.

---

# 72. Fork Workflow

A common open-source workflow:

```text
upstream
   ↑
   │
   │ fetch
   │
local repository
   │
   │ push
   ↓
origin
```

Typically:

```text
upstream = original project
origin   = your fork
```

You usually push your feature branch to:

```cmd
git push origin feature/login
```

Then create a pull request toward the upstream project.

---

# 73. Push After Rebase

If a branch has not been shared:

```cmd
git rebase main
git push
```

usually works if no remote divergence exists.

If the branch was already pushed and rebase rewrote its history:

```cmd
git push --force-with-lease
```

may be required.

---

# 74. Push After Amend

Suppose you already pushed:

```cmd
git commit -m "Add feature"
git push
```

Then amend:

```cmd
git commit --amend
```

The commit ID changes.

A normal:

```cmd
git push
```

may be rejected.

If rewriting the remote branch is intentional:

```cmd
git push --force-with-lease
```

---

# 75. Push After Interactive Rebase

Example:

```cmd
git rebase -i HEAD~5
```

You might:

```text
pick
reword
squash
fixup
drop
reorder
```

These operations can change commit IDs.

Afterward:

```cmd
git push --force-with-lease
```

may be necessary if the original commits were already pushed.

---

# 76. Push Security

Never put secrets into Git history.

Avoid committing:

```text
passwords
API keys
private keys
tokens
credentials
.env secrets
```

Even if you later delete the file, the secret may remain in Git history.

Pushing a secret can make it available to remote users immediately.

---

# 77. If a Secret Was Pushed

Deleting the file and pushing:

```cmd
git rm .env
git commit -m "Remove secret"
git push
```

does not necessarily remove the secret from historical commits.

The correct response generally includes:

```text
revoke/rotate the secret
remove it from history if required
force-update affected references
verify remote copies/caches as appropriate
```

Never rely on Git history rewriting as a substitute for rotating a compromised credential.

---

# 78. Push and Signed Commits

Projects may require signed commits.

For example:

```cmd
git commit -S -m "Signed commit"
```

Then:

```cmd
git push
```

The remote hosting service may verify the signature.

Signing policy is repository-specific.

---

# 79. Push and CI

A successful push can trigger:

```text
CI
tests
linting
builds
deployment pipelines
security scans
release automation
```

Therefore:

```cmd
git push
```

can have effects beyond simply updating a branch.

Always understand the repository's automation rules before pushing to important branches.

---

# 80. Push and Releases

A common release flow:

```text
commit
   ↓
tag
   ↓
push branch
   ↓
push tag
   ↓
CI/CD
   ↓
release
```

Example:

```cmd
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin main
git push origin v1.0.0
```

---

# 81. Push and Multiple Branches

For a coordinated update:

```cmd
git push --atomic origin main release/v1
```

If supported by the remote, this ensures the requested reference updates are treated as one atomic operation.

This is useful when consistency between several references matters.

---

# 82. Push From a Detached HEAD

Suppose:

```text
HEAD → abc1234
```

with no current branch.

You can push the commit explicitly:

```cmd
git push origin HEAD:feature/test
```

This creates/updates:

```text
origin/feature/test
```

pointing to the detached HEAD commit.

However, for normal development, create a branch first:

```cmd
git switch -c feature/test
```

then:

```cmd
git push -u origin feature/test
```

---

# 83. Push to an Empty Remote Repository

If the remote is empty:

```cmd
git push -u origin main
```

can create the remote branch and establish tracking.

Afterward:

```cmd
git push
```

is normally sufficient.

---

# 84. Push After Clone

Typical workflow:

```cmd
git clone <repository-url>
cd project
git switch -c feature/login
```

Make changes:

```cmd
git add .
git commit -m "Add login"
```

Push:

```cmd
git push -u origin feature/login
```

Then future pushes:

```cmd
git push
```

---

# 85. Diagnose Push Problems

Start with:

```cmd
git status
git branch --show-current
git branch -vv
git remote -v
```

Check remote state:

```cmd
git fetch origin
```

Inspect history:

```cmd
git log --oneline --decorate --graph --all
```

Then determine whether the issue is:

```text
authentication
authorization
non-fast-forward
wrong remote
wrong branch
branch protection
network
repository configuration
```

---

# 86. Verify What Will Be Pushed

Before pushing, inspect commits:

```cmd
git log origin/main..main --oneline
```

This shows commits reachable from local `main` that are not reachable from `origin/main`.

Useful question:

```text
"What commits am I about to publish?"
```

---

# 87. Compare Local and Remote

Commits only on local:

```cmd
git log origin/main..main --oneline
```

Commits only on remote:

```cmd
git log main..origin/main --oneline
```

Both directions:

```cmd
git log --left-right --graph main...origin/main
```

This is extremely useful before pushing.

---

# 88. Inspect Ahead/Behind Status

```cmd
git status
```

may show:

```text
Your branch is ahead of 'origin/main' by 2 commits.
```

Meaning:

```text
local:
A ── B ── C ── D

remote:
A ── B
```

You can push:

```cmd
git push
```

---

# 89. Push Only Commits, Not "Files"

A subtle but important concept:

```cmd
git push
```

does not directly push individual files.

Git pushes:

```text
references
+
objects required by those references
```

A branch points to a commit, and that commit references trees and blobs.

Therefore the fundamental unit being published is Git history/reference state, not a collection of files.

---

# 90. Push Reference Model

Conceptually:

```text
Local:

refs/heads/main
       │
       ↓
   commit C
       │
       ↓
     tree
       │
       ↓
    blobs


Push
  ↓

Remote:

refs/heads/main
       │
       ↓
   commit C
```

The remote reference moves after the required objects are available.

---

# 91. Push Protocol Model

At a high level:

```text
Client
  │
  │ discover remote capabilities
  ↓
Remote
  │
  │ negotiate objects
  ↓
Client
  │
  │ send pack
  ↓
Remote
  │
  │ validate/update refs
  ↓
success/rejection
```

Transport details vary between protocols and Git versions.

---

# 92. Push Validation

The remote may validate:

```text
object integrity
reference update rules
permissions
hooks
branch protection
server policies
```

Only after the remote accepts the update does the branch reference move.

---

# 93. Server-Side Hooks

A Git server can run hooks such as:

```text
pre-receive
update
post-receive
```

These can enforce policies or trigger automation.

For example:

```text
git push
   ↓
remote receives objects
   ↓
pre-receive
   ↓
update checks
   ↓
refs updated
   ↓
post-receive
```

---

# 94. Atomicity and Reference Updates

When pushing multiple references:

```cmd
git push --atomic origin main feature/login
```

the remote can treat the updates as one transaction when supported.

Without atomic behavior, multiple reference updates may not have the same all-or-nothing semantics.

---

# 95. Push Rejection Is Often Good

A rejected push is not necessarily an error in Git.

For example:

```text
remote branch advanced
```

and Git says:

```text
non-fast-forward
```

This protects the remote history.

Treat rejection as:

```text
"Your local history needs reconciliation."
```

not:

```text
"Force push immediately."
```

---

# 96. Professional Push Workflow

Before pushing:

```cmd
git status
git branch --show-current
git branch -vv
git fetch --prune origin
git log --oneline --decorate --graph --all
```

Inspect outgoing commits:

```cmd
git log origin/main..main --oneline
```

Then:

```cmd
git push
```

If rejected:

```cmd
git fetch origin
git rebase origin/main
```

or:

```cmd
git merge origin/main
```

Then:

```cmd
git push
```

---

# 97. Safe Force-Push Workflow

If you intentionally rewrote history:

```cmd
git fetch origin
git log --oneline --decorate --graph --all
```

Confirm that your local history is the intended history.

Then:

```cmd
git push --force-with-lease
```

Do not immediately use:

```cmd
git push --force
```

unless you fully understand the consequences.

---

# 98. Common Push Mistakes

### Mistake 1

```cmd
git push --force
```

without understanding the remote state.

Better:

```cmd
git push --force-with-lease
```

when force is actually required.

### Mistake 2

Pushing without checking the current branch.

Use:

```cmd
git branch --show-current
```

### Mistake 3

Ignoring remote changes.

Use:

```cmd
git fetch origin
```

and inspect before rewriting history.

### Mistake 4

Publishing unfinished branches accidentally.

Use explicit:

```cmd
git push origin feature/name
```

when appropriate.

---

# 99. Essential Push Commands

```cmd
git push
```

Push configured upstream.

```cmd
git push origin main
```

Push local `main` to remote `origin`.

```cmd
git push -u origin feature/login
```

Push and establish upstream.

```cmd
git push --all origin
```

Push all local branches.

```cmd
git push origin --tags
```

Push all tags.

```cmd
git push --delete origin feature/login
```

Delete a remote branch.

```cmd
git push --force-with-lease
```

Safely perform an intentional force update with lease protection.

```cmd
git push --dry-run
```

Preview the push.

---

# 100. Final Mental Model

```text
                  LOCAL
                    │
                    │
                 COMMIT
                    │
                    ↓
             local repository
                    │
                    │
                git push
                    │
                    ↓
             object transfer
                    │
                    ↓
              remote repository
                    │
                    ↓
             reference update
                    │
              ┌─────┴─────┐
              │           │
          fast-forward   reject
              │           │
              ↓           ↓
           success    investigate
                          │
                    fetch + inspect
                          │
                    merge / rebase
                          │
                       push
```

The most important rules:

```text
1. git commit creates history locally.
2. git push publishes local history to a remote.
3. git push does not fetch remote changes.
4. git push does not automatically pull first.
5. git push -u establishes upstream tracking.
6. A normal push generally requires a fast-forward remote update.
7. Non-fast-forward rejection protects remote history.
8. Use git fetch before deciding how to reconcile divergent history.
9. Prefer --force-with-lease over --force for intentional rewrites.
10. A refspec has the form <source>:<destination>.
11. HEAD can represent the current branch/commit context.
12. --all pushes all local branches.
13. --tags pushes tags.
14. --delete removes a remote ref.
15. --atomic can make multiple ref updates all-or-nothing when supported.
16. Push permissions and branch protection are controlled by the remote/server.
17. git push transfers objects and updates references; it does not simply "upload files."
18. Always understand what commits you are publishing before pushing important branches.
```

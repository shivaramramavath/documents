# Git Remotes

Git **remotes** are references to repositories stored somewhere other than your local repository.

A remote commonly points to a repository hosted on a Git server such as GitHub, GitLab, Bitbucket, or a private Git server.

The key distinction is:

```text
Local repository
    ↓
your computer

Remote repository
    ↓
server / hosting platform
```

Git itself does not require GitHub. Git remotes can point to any Git repository accessible through a supported transport.

---

# 1. Local Repository vs Remote Repository

Your local repository contains:

```text
.git/
commits
branches
tags
objects
refs
configuration
```

A remote repository has its own Git history.

Example:

```text
Your computer                    Server

local repository  ←──────────→  remote repository
       │                              │
       ├── main                       ├── main
       ├── feature                    ├── feature
       └── tags                        └── tags
```

The repositories are independent.

Git provides commands to synchronize them.

---

# 2. What Is a Remote?

A remote is essentially a named reference to another repository.

The most common remote name is:

```text
origin
```

Example:

```cmd
git remote -v
```

Output may look like:

```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

Here:

```text
origin
```

is the remote name.

---

# 3. `origin` Is Not Special

`origin` is only the conventional default name.

You can have:

```text
origin
upstream
company
backup
production
```

For example:

```cmd
git remote add upstream https://example.com/project.git
```

Now:

```text
origin
upstream
```

are two different remote names.

Git does not require the name `origin`.

---

# 4. List Remotes

Basic:

```cmd
git remote
```

Detailed:

```cmd
git remote -v
```

More detailed:

```cmd
git remote show origin
```

---

# 5. Add a Remote

Suppose you already have a local repository.

Add a remote:

```cmd
git remote add origin https://github.com/user/project.git
```

Verify:

```cmd
git remote -v
```

Expected conceptually:

```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

---

# 6. Remote URL

A remote can use different transport protocols.

Common forms:

```text
https://github.com/user/project.git
```

or:

```text
git@github.com:user/project.git
```

The first commonly uses HTTPS.

The second uses SSH.

---

# 7. Change Remote URL

Change an existing remote:

```cmd
git remote set-url origin https://github.com/user/new-project.git
```

Verify:

```cmd
git remote -v
```

This changes where Git contacts the remote.

It does not change your existing commits.

---

# 8. Remove a Remote

Remove:

```cmd
git remote remove origin
```

or:

```cmd
git remote rm origin
```

The local repository remains.

Only the remote configuration is removed.

---

# 9. Rename a Remote

Rename:

```cmd
git remote rename origin upstream
```

Before:

```text
origin
```

After:

```text
upstream
```

Existing remote-tracking references are updated accordingly.

---

# 10. Fetch

Fetch downloads information from a remote without integrating it into your current branch.

```cmd
git fetch origin
```

Conceptually:

```text
remote repository
       │
       │ fetch
       ▼
local repository
       │
       ▼
remote-tracking refs
```

Your current branch does not automatically move.

---

# 11. Fetch All Remotes

```cmd
git fetch --all
```

This fetches from all configured remotes.

You can also prune stale remote-tracking references:

```cmd
git fetch --all --prune
```

---

# 12. What Fetch Does Not Do

Running:

```cmd
git fetch origin
```

does not normally:

```text
merge origin/main into main
```

It updates your knowledge of the remote repository.

For example:

```text
Before:

local main        → C
origin/main       → C


Remote changes:

remote main       → D
```

After fetch:

```text
local main        → C
origin/main       → D
```

Your local `main` remains at `C`.

---

# 13. Remote-Tracking Branches

A remote-tracking branch represents a remote branch as known by your local repository.

Example:

```text
origin/main
origin/feature/login
```

These are not ordinary local branches.

They represent your local record of where those remote branches were last observed.

---

# 14. Local Branch vs Remote-Tracking Branch

Example:

```text
main
origin/main
```

They are different references.

```text
main
  │
  ▼
local commit

origin/main
  │
  ▼
last fetched remote commit
```

They may point to the same commit or different commits.

---

# 15. Inspect Remote Branches

```cmd
git branch -r
```

Example:

```text
origin/main
origin/develop
origin/feature/login
```

All local branches:

```cmd
git branch
```

Both local and remote-tracking:

```cmd
git branch -a
```

---

# 16. Remote Branch Is Not Directly Local

When you see:

```text
origin/main
```

remember:

```text
origin = remote name
main   = branch name
```

It does not mean that `main` itself is remote.

It means:

```text
the main branch as tracked from origin
```

---

# 17. Push

Push sends local commits to a remote repository.

Example:

```cmd
git push origin main
```

Conceptually:

```text
local main
    │
    │ push
    ▼
origin/main
```

The remote repository receives the new objects and reference update.

---

# 18. Push Does Not Mean Upload Everything

Git push is primarily a synchronization of reachable Git objects and references.

Git transfers objects necessary for the remote to understand the new commits.

It then updates the remote reference if the update is allowed.

---

# 19. First Push

If your local branch does not yet track a remote branch:

```cmd
git push -u origin main
```

The `-u` option establishes an upstream relationship.

After that, you can often use:

```cmd
git push
```

without specifying:

```text
origin main
```

every time.

---

# 20. Upstream Branch

Suppose:

```text
local:
main

remote:
origin/main
```

After:

```cmd
git push -u origin main
```

Git records:

```text
main
  │
  └── upstream → origin/main
```

Now:

```cmd
git push
```

knows where the branch should push.

Similarly:

```cmd
git pull
```

can know which remote branch to integrate.

---

# 21. Check Upstream

Use:

```cmd
git branch -vv
```

Example:

```text
* main abc1234 [origin/main] Add authentication
```

This tells you that:

```text
main
```

tracks:

```text
origin/main
```

---

# 22. Set Upstream Without Pushing

You can establish tracking separately:

```cmd
git branch --set-upstream-to=origin/main main
```

Short form:

```cmd
git branch -u origin/main main
```

---

# 23. Push a Different Local Branch Name

Suppose:

```text
local branch:
feature-login

remote branch:
login
```

You can push:

```cmd
git push origin feature-login:login
```

Syntax:

```text
local-ref:remote-ref
```

So:

```text
feature-login → login
```

---

# 24. Delete a Remote Branch

Modern syntax:

```cmd
git push origin --delete feature/login
```

Equivalent ref deletion syntax:

```cmd
git push origin :feature/login
```

The first form is clearer and preferred.

---

# 25. Push Tags

Push one tag:

```cmd
git push origin v1.0.0
```

Push all tags:

```cmd
git push origin --tags
```

A tag is a reference, not a branch.

---

# 26. Fetch a Specific Branch

```cmd
git fetch origin main
```

This fetches the specified remote branch information.

You can then inspect:

```cmd
git log origin/main
```

---

# 27. Fetch a Specific Ref

Advanced:

```cmd
git fetch origin main:refs/remotes/origin/main
```

This explicitly specifies the destination ref.

Understanding refspecs is important for advanced Git remote work.

---

# 28. Refspec

A refspec describes how references are mapped between local and remote repositories.

Typical fetch configuration conceptually looks like:

```text
+refs/heads/*:refs/remotes/origin/*
```

Meaning:

```text
remote branches
      ↓
refs/heads/*
      ↓
local remote-tracking refs
      ↓
refs/remotes/origin/*
```

---

# 29. Understanding the Standard Refspec

```text
+refs/heads/*:refs/remotes/origin/*
```

Breakdown:

```text
+
```

allows forced updating of the destination reference under the refspec's rules.

```text
refs/heads/*
```

matches remote branches.

```text
:
```

separates source and destination.

```text
refs/remotes/origin/*
```

stores the fetched references locally as remote-tracking branches.

---

# 30. Inspect Remote Configuration

```cmd
git config --get-regexp "^remote\."
```

Or:

```cmd
git config --list
```

You may see:

```text
remote.origin.url=...
remote.origin.fetch=...
```

---

# 31. Inspect One Remote

```cmd
git remote show origin
```

This can show:

```text
remote URL
fetch URL
push URL
tracked branches
local branches configured for pull
local branches configured for push
stale branches
```

---

# 32. Fetch URL vs Push URL

Git can have separate URLs.

Inspect:

```cmd
git remote get-url origin
```

Fetch URL:

```cmd
git remote get-url --fetch origin
```

Push URL:

```cmd
git remote get-url --push origin
```

This can be useful in advanced workflows.

---

# 33. Separate Push URL

You can configure a separate push URL:

```cmd
git remote set-url --add --push origin <push-url>
```

This allows fetching from one location while pushing to another.

Use carefully because repository topology can become less obvious.

---

# 34. Multiple Push URLs

Git can have multiple push URLs:

```cmd
git remote set-url --add --push origin <url1>
git remote set-url --add --push origin <url2>
```

This can cause pushes to be sent to multiple destinations.

This is an advanced configuration and should be used intentionally.

---

# 35. Fetch URL vs Push URL Model

Conceptually:

```text
                  origin
                    │
          ┌─────────┴─────────┐
          │                   │
        fetch                push
          │                   │
          ▼                   ▼
      repository A        repository B
```

This can be useful for specialized mirroring or deployment architectures.

---

# 36. `git clone`

Clone creates a new local repository from an existing repository.

```cmd
git clone https://github.com/user/project.git
```

Conceptually:

```text
remote repository
       │
       │ clone
       ▼
new local repository
       │
       └── origin configured
```

---

# 37. What Clone Does

Clone generally:

```text
1. creates a directory
2. initializes a Git repository
3. configures a remote named origin
4. fetches repository objects
5. creates remote-tracking branches
6. checks out an appropriate local branch
```

The exact checkout behavior depends on the remote's advertised/default branch and Git options.

---

# 38. Clone With Custom Directory

```cmd
git clone https://github.com/user/project.git my-project
```

The repository is created inside:

```text
my-project/
```

instead of using Git's default directory name.

---

# 39. Clone With a Specific Branch

```cmd
git clone --branch develop https://github.com/user/project.git
```

Short:

```cmd
git clone -b develop https://github.com/user/project.git
```

This checks out the specified branch after cloning.

---

# 40. Clone Without Checkout

Advanced:

```cmd
git clone --no-checkout https://github.com/user/project.git
```

Short:

```cmd
git clone -n https://github.com/user/project.git
```

The repository is created without immediately checking out the working tree.

Useful for specialized workflows.

---

# 41. Shallow Clone

A shallow clone limits history depth.

```cmd
git clone --depth 1 https://github.com/user/project.git
```

This can reduce initial download size.

Conceptually:

```text
full history:
A → B → C → D → E → F

depth 1:
                F
```

---

# 42. Shallow Repository

Check:

```cmd
git rev-parse --is-shallow-repository
```

Possible output:

```text
true
```

A shallow repository has limitations for operations requiring complete history.

---

# 43. Deepen a Shallow Clone

You can fetch more history:

```cmd
git fetch --deepen=50
```

Or:

```cmd
git fetch --unshallow
```

The latter attempts to obtain the complete history.

---

# 44. Partial Clone

Advanced:

```cmd
git clone --filter=blob:none <repository>
```

This can avoid downloading many file contents initially.

Git can retrieve required objects later.

This is useful for very large repositories.

---

# 45. Sparse Checkout

For large repositories, sparse checkout can limit the working tree to selected paths.

Initialize:

```cmd
git sparse-checkout init
```

For cone mode:

```cmd
git sparse-checkout set src docs
```

The repository may still contain the broader Git history/object model, but the working tree is selectively populated.

---

# 46. Partial Clone vs Sparse Checkout

These solve different problems.

### Partial clone

Controls which Git objects are initially downloaded.

```text
network/storage optimization
```

### Sparse checkout

Controls which paths appear in the working tree.

```text
working-tree optimization
```

They can also be combined.

---

# 47. Fetch Prune

Remote branches can be deleted.

Your local remote-tracking reference may remain:

```text
origin/old-feature
```

Run:

```cmd
git fetch --prune
```

Git removes stale remote-tracking references.

---

# 48. Remote Prune

You can specifically prune:

```cmd
git remote prune origin
```

This removes remote-tracking references that no longer exist on `origin`.

---

# 49. Pruning Does Not Delete Local Branches

Suppose:

```text
local:
feature

remote:
feature deleted
```

Running:

```cmd
git fetch --prune
```

does not automatically delete:

```text
feature
```

your local branch.

It removes stale remote-tracking references such as:

```text
origin/feature
```

---

# 50. Remote Branch Deletion

Suppose:

```text
origin/feature
```

exists.

Delete remote branch:

```cmd
git push origin --delete feature
```

After other clients fetch/prune:

```text
origin/feature
```

disappears from their remote-tracking references.

---

# 51. Pull

`git pull` is a convenience operation.

Conceptually:

```text
git pull
    =
git fetch
    +
integration step
```

The integration step may be a merge or rebase depending on configuration/options.

---

# 52. Pull With Merge

```cmd
git pull --no-rebase
```

Conceptually:

```text
fetch
  +
merge
```

---

# 53. Pull With Rebase

```cmd
git pull --rebase
```

Conceptually:

```text
fetch
  +
rebase
```

This can keep local history linear in appropriate workflows.

---

# 54. Fast-Forward-Only Pull

```cmd
git pull --ff-only
```

This refuses to integrate via a merge commit when fast-forwarding is impossible.

Useful when you want strict linear updates.

---

# 55. Pull Is Not the Same as Fetch

```cmd
git fetch
```

updates remote-tracking information.

```cmd
git pull
```

fetches and then integrates.

Therefore, for controlled workflows:

```cmd
git fetch origin
git log main..origin/main
```

lets you inspect changes before deciding how to integrate them.

---

# 56. Inspect Incoming Commits

Suppose:

```text
main       → C
origin/main → F
```

See commits on remote that local main does not have:

```cmd
git log main..origin/main --oneline
```

This means:

```text
commits reachable from origin/main
but not reachable from main
```

---

# 57. Inspect Local-Only Commits

```cmd
git log origin/main..main --oneline
```

This means:

```text
commits reachable from main
but not reachable from origin/main
```

This is extremely useful before pushing.

---

# 58. Compare Both Directions

Incoming:

```cmd
git log main..origin/main --oneline
```

Outgoing:

```cmd
git log origin/main..main --oneline
```

Graph:

```cmd
git log --graph --oneline --decorate --all
```

---

# 59. Compare Changes

Remote changes:

```cmd
git diff main..origin/main
```

Local changes relative to remote:

```cmd
git diff origin/main..main
```

Remember:

```text
A..B
```

has specific revision semantics.

For symmetric comparison, use:

```cmd
git diff main...origin/main
```

where appropriate.

---

# 60. Triple-Dot Remote Comparison

The triple-dot notation:

```cmd
git diff main...origin/main
```

compares the changes on the right side relative to the merge base.

This is useful for understanding what one side introduced since divergence.

---

# 61. Remote Tracking Configuration

Inspect:

```cmd
git config --get-regexp "branch\..*"
```

You may see:

```text
branch.main.remote=origin
branch.main.merge=refs/heads/main
```

This means:

```text
main
  │
  ├── remote = origin
  │
  └── merge = refs/heads/main
```

So `main` tracks `origin/main`.

---

# 62. Remote Configuration

Inspect:

```cmd
git config --get-regexp "remote\..*"
```

Typical configuration:

```text
remote.origin.url=https://...
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
```

This is the underlying configuration behind common remote operations.

---

# 63. Push RefSpec

You can explicitly specify:

```cmd
git push origin main:main
```

Meaning:

```text
local main
    ↓
remote main
```

More generally:

```text
git push <remote> <source>:<destination>
```

---

# 64. Delete Using Empty Source

Remote deletion can be expressed as:

```cmd
git push origin :feature
```

The empty source means delete the destination reference.

Modern readable syntax is:

```cmd
git push origin --delete feature
```

---

# 65. Force Push

Force push:

```cmd
git push --force
```

or:

```cmd
git push -f
```

This can rewrite the remote branch reference.

It is dangerous on shared branches.

---

# 66. Safer Force Push

Prefer:

```cmd
git push --force-with-lease
```

This checks that the remote reference still matches what you expect.

Conceptually:

```text
your expected remote state
          ↓
       compare
          ↓
actual remote state
```

If the remote changed unexpectedly, Git can reject the push rather than overwriting someone else's work.

---

# 67. Force Push Is Reference Rewriting

Suppose remote:

```text
A → B → C
        ▲
      origin/main
```

Your local rewritten history:

```text
A → B → D
        ▲
       main
```

A normal push is rejected because:

```text
C
```

is not an ancestor of:

```text
D
```

A force push can move the remote reference from:

```text
C
```

to:

```text
D
```

This can make commits appear to disappear from the branch's reachable history.

---

# 68. Non-Fast-Forward Push

Git normally rejects a push that would cause a branch reference to move backward in ancestry.

Example:

```text
remote:
A → B → C

local:
A → B → D
```

Normal:

```cmd
git push
```

is rejected.

This protects the remote branch from accidental history replacement.

---

# 69. Force-With-Lease

Prefer:

```cmd
git push --force-with-lease
```

over:

```cmd
git push --force
```

when rewriting a branch is genuinely required.

However, even `--force-with-lease` should be used carefully on shared branches.

---

# 70. Remote HEAD

A remote has a symbolic default branch reference.

You can inspect:

```cmd
git remote show origin
```

You may see information about:

```text
HEAD branch
```

This is commonly the repository's default branch.

---

# 71. `origin/HEAD`

Locally, you may see:

```text
origin/HEAD -> origin/main
```

This is a symbolic reference indicating the remote's default branch as known locally.

Inspect:

```cmd
git symbolic-ref refs/remotes/origin/HEAD
```

---

# 72. Update Remote HEAD

You can update the symbolic remote HEAD information:

```cmd
git remote set-head origin -a
```

Or explicitly:

```cmd
git remote set-head origin main
```

---

# 73. Remote-Tracking Refs Internally

Remote-tracking branches are stored under refs such as:

```text
refs/remotes/origin/main
```

Local branches are under:

```text
refs/heads/main
```

Tags are commonly under:

```text
refs/tags/v1.0.0
```

This is why:

```text
main
```

and:

```text
origin/main
```

are fundamentally different references.

---

# 74. Inspect References

```cmd
git show-ref
```

You may see:

```text
<hash> refs/heads/main
<hash> refs/remotes/origin/main
<hash> refs/tags/v1.0.0
```

This exposes Git's reference layer directly.

---

# 75. `git ls-remote`

You can inspect a remote repository's refs without creating or updating local remote-tracking branches:

```cmd
git ls-remote origin
```

Or directly against a URL:

```cmd
git ls-remote https://github.com/user/project.git
```

This is useful for checking remote refs.

---

# 76. List Remote Heads

```cmd
git ls-remote --heads origin
```

Tags:

```cmd
git ls-remote --tags origin
```

This is useful when you want to inspect the server's advertised refs.

---

# 77. Remote Protocols

Git can communicate using different transports.

Common examples:

```text
HTTPS
SSH
Git protocol
local filesystem
```

Examples:

```text
https://example.com/repo.git

git@example.com:repo/project.git

file:///C:/repos/project.git
```

The exact capabilities depend on the server and protocol.

---

# 78. HTTPS Authentication

With HTTPS, authentication may involve credentials or tokens depending on the hosting provider.

Do not place sensitive credentials directly into repository configuration or command history unless you understand the security implications.

Prefer the hosting provider's recommended credential manager or authentication mechanism.

---

# 79. SSH Authentication

SSH remotes commonly look like:

```text
git@github.com:user/project.git
```

Git uses SSH authentication configured on your machine.

A typical workflow is:

```cmd
ssh -T git@github.com
```

The exact response depends on the hosting provider.

---

# 80. Remote Names and Architecture

A common professional setup:

```text
origin
   ↓
your fork

upstream
   ↓
main project
```

For example:

```text
             upstream
                │
                ▼
        original repository
                ▲
                │
             pull/fetch
                │
              origin
                │
                ▼
             your fork
```

This is common in open-source development.

---

# 81. Fork Workflow

Typical workflow:

```cmd
git remote -v
```

You might have:

```text
origin   → your fork
upstream → original repository
```

Fetch upstream:

```cmd
git fetch upstream
```

Inspect:

```cmd
git log upstream/main --oneline
```

Update local main:

```cmd
git switch main
git merge upstream/main
```

Then push:

```cmd
git push origin main
```

---

# 82. Multiple Remotes

Add:

```cmd
git remote add upstream <repository-url>
```

List:

```cmd
git remote -v
```

Fetch:

```cmd
git fetch upstream
```

You can now compare:

```cmd
git log main..upstream/main --oneline
```

---

# 83. Remote Groups

Advanced Git configurations can group multiple remotes for fetching.

Inspect:

```cmd
git config --get-regexp "^remotes\."
```

A remote group can conceptually allow:

```text
git fetch <group>
```

to fetch from multiple configured remotes.

This is an advanced configuration feature.

---

# 84. Mirror Clone

Advanced:

```cmd
git clone --mirror <repository-url>
```

A mirror clone is designed for repository mirroring rather than normal working-tree development.

It includes all refs rather than simply creating a standard checked-out working repository.

---

# 85. Mirror Push

A mirror can be pushed using:

```cmd
git push --mirror
```

This is powerful and dangerous.

It synchronizes refs aggressively and can delete remote refs that no longer exist locally.

Use it only when you intentionally want complete reference mirroring.

---

# 86. Bare Repository

A bare repository has no normal working tree.

Create:

```cmd
git init --bare
```

Typical server-side repository structure:

```text
project.git/
├── HEAD
├── config
├── objects/
├── refs/
└── ...
```

This is commonly used as a central Git repository.

---

# 87. Push to a Bare Repository

Suppose:

```text
local project
       │
       │ push
       ▼
server.git
```

Configure:

```cmd
git remote add origin <server-repository>
```

Then:

```cmd
git push -u origin main
```

A bare repository can receive pushes without having a working tree to update.

---

# 88. Remote Server Does Not Have to Be GitHub

Git remotes can be:

```text
GitHub
GitLab
Bitbucket
self-hosted Git server
company server
NAS
another local directory
cloud infrastructure
```

Git is the version-control system.

GitHub and similar services provide hosting and collaboration infrastructure.

---

# 89. Remote Object Transfer

Git transfers Git objects such as:

```text
commits
trees
blobs
tags
```

when synchronization requires them.

Objects are identified by object IDs.

The server does not simply receive a ZIP of the project every time you push.

Git transfers the necessary object graph efficiently.

---

# 90. Reachability

Suppose:

```text
A → B → C
```

and you push `C`.

Because:

```text
C → B → A
```

the remote can understand the reachable history once the required objects are transferred.

This object reachability model is fundamental to Git synchronization.

---

# 91. Negotiation

During fetch/push operations, Git can negotiate which objects the other side already possesses.

Conceptually:

```text
client:
"I have A, B, C."

server:
"I already have A and B."

client:
"I need to send C."
```

Actual Git protocol negotiation is more sophisticated, but the core purpose is to avoid unnecessary object transfer.

---

# 92. Remote Rejection

A push may fail because:

```text
remote branch advanced
branch protection
permissions
authentication
non-fast-forward update
server-side hooks
repository policy
```

Example:

```text
! [rejected] main -> main (non-fast-forward)
```

The correct response is usually to fetch and inspect the remote changes rather than immediately force-pushing.

---

# 93. Typical Non-Fast-Forward Recovery

```cmd
git fetch origin
git log main..origin/main --oneline
```

Then integrate:

```cmd
git merge origin/main
```

or, if appropriate:

```cmd
git rebase origin/main
```

Then:

```cmd
git push
```

---

# 94. Remote Branch Tracking Workflow

A common workflow:

```cmd
git switch main
git fetch origin
git status
git log main..origin/main --oneline
git merge origin/main
git push
```

This explicitly separates:

```text
fetch
inspect
integrate
publish
```

This is often easier to reason about than blindly running `git pull`.

---

# 95. Safe Professional Workflow

Before starting work:

```cmd
git fetch --prune origin
```

Inspect:

```cmd
git status
git branch -vv
```

Update your branch:

```cmd
git switch main
git pull --ff-only
```

Create work:

```cmd
git switch -c feature/auth
```

Commit:

```cmd
git add .
git commit -m "Add authentication"
```

Publish:

```cmd
git push -u origin feature/auth
```

---

# 96. Remote State Mental Model

Think in three layers:

```text
REMOTE SERVER
      │
      │ fetch
      ▼
REMOTE-TRACKING REF
origin/main
      │
      │ merge/rebase
      ▼
LOCAL BRANCH
main
      │
      │ push
      ▼
REMOTE SERVER
```

This model explains much of Git's behavior.

---

# 97. The Most Important Distinction

Do not confuse:

```text
main
```

with:

```text
origin/main
```

`main`:

```text
local branch
```

`origin/main`:

```text
remote-tracking reference
```

Neither one is necessarily the current state of the server at every moment.

`origin/main` is only as current as your last successful fetch.

---

# 98. Fetch Freshness

Suppose:

```text
server main:
A → B → C → D
```

but you last fetched at:

```text
A → B → C
```

Your local state may show:

```text
origin/main → C
```

even though the server is already at:

```text
D
```

Run:

```cmd
git fetch origin
```

and then:

```text
origin/main → D
```

This is why remote-tracking references are snapshots of known remote state.

---

# 99. Remote Workflow Summary

```text
                 REMOTE
                   │
             git fetch
                   │
                   ▼
             origin/main
                   │
            merge / rebase
                   │
                   ▼
                 main
                   │
              git push
                   │
                   ▼
                 REMOTE
```

---

# 100. Essential Commands

```cmd
git remote
git remote -v
git remote show origin
git remote add origin <url>
git remote remove origin
git remote rename origin upstream
git remote set-url origin <url>

git fetch
git fetch origin
git fetch --all
git fetch --prune

git branch -r
git branch -a
git branch -vv

git push
git push origin main
git push -u origin main
git push --force-with-lease
git push origin --delete <branch>

git pull
git pull --rebase
git pull --no-rebase
git pull --ff-only

git ls-remote origin

git log main..origin/main --oneline
git log origin/main..main --oneline

git diff main..origin/main
git diff main...origin/main
```

---

# 101. Advanced Remote Commands

```cmd
git remote get-url origin

git remote get-url --fetch origin

git remote get-url --push origin

git remote set-head origin -a

git remote prune origin

git ls-remote --heads origin

git ls-remote --tags origin

git show-ref

git config --get-regexp "^remote\."

git config --get-regexp "^branch\."

git rev-parse --is-shallow-repository
```

---

# 102. Final Mental Model

Git remotes are best understood as **references plus object synchronization**.

```text
                    SERVER
                      │
                      │ fetch
                      ▼
             remote-tracking refs
                origin/main
                origin/dev
                origin/feature
                      │
                      │
                integrate
                 merge/rebase
                      │
                      ▼
                local branches
                    main
                    dev
                    feature
                      │
                      │ push
                      ▼
                    SERVER
```

The critical concepts are:

```text
remote
remote URL
remote-tracking branch
upstream branch
fetch
push
pull
refspec
remote HEAD
fetch pruning
non-fast-forward
force push
force-with-lease
multiple remotes
bare repositories
shallow clones
partial clones
sparse checkout
```

Once these concepts are clear, GitHub becomes much easier to understand because GitHub is primarily providing hosted Git repositories and collaboration features around the Git model.

---

# 103. Final Rules

```text
1. A remote is a named reference to another Git repository.

2. origin is only a conventional remote name.

3. git fetch downloads remote information without normally
   modifying your current branch.

4. origin/main is a remote-tracking reference, not your
   local main branch.

5. Remote-tracking references are only as fresh as your
   last fetch.

6. git push publishes local commits/ref updates to a remote.

7. git pull performs fetch plus an integration operation.

8. -u establishes an upstream relationship.

9. --ff-only prevents unexpected merge commits.

10. --force rewrites remote references and can destroy
    another user's reachable branch history.

11. --force-with-lease is safer for intentional history
    rewriting.

12. git fetch --prune removes stale remote-tracking refs.

13. Refspecs control how references are mapped between
    repositories.

14. git ls-remote lets you inspect remote refs directly.

15. Multiple remotes are normal in professional workflows.

16. origin commonly represents your fork while upstream
    represents the original project.

17. Fetch, inspect, integrate, test, then push.

18. A remote repository does not have to be hosted on GitHub.

19. Git is the version-control system; GitHub is a hosting
    and collaboration platform.

20. Never confuse local branch state, remote-tracking state,
    and actual server state.
```

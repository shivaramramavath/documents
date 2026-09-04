# Git Remote

## 1. What Is a Remote?

A **remote** is a named reference to another Git repository.

Most commonly, the remote repository exists on a server such as:

```text
GitHub
GitLab
Bitbucket
self-hosted Git server
```

A remote allows your local repository to communicate with another repository.

```text
Local Repository
       │
       │ Git transport
       ↓
Remote Repository
```

The remote itself is **not the repository**.

It is a configuration entry that tells Git:

```text
where another repository is
what name we use for it
```

---

# 2. Local Repository vs Remote Repository

A local repository exists on your computer:

```text
project/
└── .git/
```

A remote repository exists somewhere else:

```text
GitHub
   ↓
remote repository
```

You can have:

```text
1 local repository
+
multiple remote repositories
```

For example:

```text
origin
upstream
backup
```

---

# 3. What Is `origin`?

`origin` is simply the conventional default name for the remote created by:

```cmd
git clone <repository-url>
```

For example:

```cmd
git clone https://github.com/user/project.git
```

Git typically creates:

```text
origin → https://github.com/user/project.git
```

Important:

```text
origin
```

is **not a special Git keyword**.

It is just a remote name.

You could rename it:

```cmd
git remote rename origin github
```

---

# 4. View Remotes

Use:

```cmd
git remote
```

Example:

```text
origin
```

To display URLs:

```cmd
git remote -v
```

Example:

```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

---

# 5. Fetch URL vs Push URL

A remote can have separate URLs for fetching and pushing.

```text
fetch URL
    ↓
read objects from remote

push URL
    ↓
send objects to remote
```

View them:

```cmd
git remote -v
```

Example:

```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

They are normally identical.

---

# 6. Inspect a Remote

Use:

```cmd
git remote show origin
```

This can show information such as:

```text
remote URL
remote-tracking branches
local tracking branches
configured push behavior
branches that are ahead
branches that are stale
```

This is useful when debugging remote configuration.

---

# 7. Add a Remote

If you created a repository locally:

```cmd
git init
```

you can connect it to an existing remote:

```cmd
git remote add origin https://github.com/user/project.git
```

Verify:

```cmd
git remote -v
```

---

# 8. Remote Configuration

Remote information is stored in:

```text
.git/config
```

Conceptually:

```ini
[remote "origin"]
    url = https://github.com/user/project.git
    fetch = +refs/heads/*:refs/remotes/origin/*
```

The important parts are:

```text
url
fetch
```

The `fetch` specification tells Git how remote branch references are mapped into local remote-tracking references.

---

# 9. Remote Names Are Arbitrary

You can create:

```cmd
git remote add github https://github.com/user/project.git
```

or:

```cmd
git remote add upstream https://github.com/org/project.git
```

or:

```cmd
git remote add backup https://server/project.git
```

The names are chosen by you.

Common conventions:

```text
origin
    your primary remote

upstream
    original repository in a fork workflow
```

---

# 10. Multiple Remotes

A repository can have:

```text
origin
upstream
backup
```

Example:

```cmd
git remote add upstream https://github.com/company/project.git
```

View:

```cmd
git remote -v
```

Possible result:

```text
origin    https://github.com/shivaram/project.git (fetch)
origin    https://github.com/shivaram/project.git (push)

upstream  https://github.com/company/project.git (fetch)
upstream  https://github.com/company/project.git (push)
```

---

# 11. Fetching from a Remote

Fetch remote information:

```cmd
git fetch origin
```

This downloads objects and updates remote-tracking references.

Conceptually:

```text
Remote:
origin/main
     ↓
git fetch
     ↓
Local:
origin/main
```

It does **not normally modify your current working branch**.

---

# 12. Fetch Everything

Fetch from all configured remotes:

```cmd
git fetch --all
```

This is useful when you have:

```text
origin
upstream
backup
```

Git contacts the configured remotes and updates their remote-tracking references.

---

# 13. Fetch All Remote Branches

A normal fetch updates the remote-tracking references configured for that remote.

For example:

```text
origin/main
origin/develop
origin/feature/login
```

These are local references representing the state Git last observed on the remote.

They are **not ordinary local branches**.

---

# 14. Remote-Tracking Branch

A remote-tracking branch looks like:

```text
origin/main
```

It means:

```text
the local reference to the branch named main
as last observed on remote origin
```

Important distinction:

```text
main
```

is a local branch.

```text
origin/main
```

is a remote-tracking reference.

---

# 15. Local Branch vs Remote-Tracking Branch

Example:

```text
main
origin/main
```

They can point to different commits.

```text
A ── B ── C
         ↑
       main

A ── B
     ↑
 origin/main
```

This means:

```text
local main
```

has commits that the local repository has not pushed to `origin`.

---

# 16. Remote Branch Is Not Directly a Local Branch

Suppose the server contains:

```text
main
feature/login
```

After fetching, you may see:

```text
origin/main
origin/feature/login
```

These are local remote-tracking references.

They allow Git to know what the remote currently looks like.

---

# 17. Create a Local Branch from a Remote Branch

You can create:

```cmd
git switch -c feature/login origin/feature/login
```

Now:

```text
feature/login
```

is a local branch based on:

```text
origin/feature/login
```

Modern Git can often infer this automatically:

```cmd
git switch feature/login
```

when an appropriate remote-tracking branch exists.

---

# 18. Remote Branch Tracking

A local branch can track:

```text
origin/main
```

Example:

```text
main
  ↓ tracks
origin/main
```

This relationship allows commands such as:

```cmd
git pull
git push
git status
```

to understand the default remote branch.

---

# 19. Check Tracking Information

Use:

```cmd
git branch -vv
```

Example:

```text
* main  abc1234 [origin/main] Add authentication
```

This tells you:

```text
local branch: main
upstream: origin/main
```

It can also show whether the branch is:

```text
ahead
behind
ahead and behind
```

---

# 20. Set an Upstream Branch

When pushing a new branch:

```cmd
git push -u origin feature/login
```

The:

```text
-u
```

option means:

```text
--set-upstream
```

Git establishes a tracking relationship:

```text
feature/login
      ↓
origin/feature/login
```

Afterward:

```cmd
git push
```

and:

```cmd
git pull
```

can use that relationship.

---

# 21. Push to a Remote

Basic syntax:

```cmd
git push <remote> <branch>
```

Example:

```cmd
git push origin main
```

Conceptually:

```text
local main
    │
    │ push
    ↓
origin/main
```

The remote repository receives the necessary Git objects and updates its branch reference if the push is accepted.

---

# 22. Push a New Branch

Create:

```cmd
git switch -c feature/login
```

Push:

```cmd
git push -u origin feature/login
```

This generally performs two logical tasks:

```text
1. transfer commits/objects
2. create/update remote branch
```

and establishes tracking.

---

# 23. Push All Branches

You can push all local branches with:

```cmd
git push --all origin
```

Use this carefully.

In normal workflows, explicitly pushing the branch you intend to publish is safer.

---

# 24. Push Tags

Push one tag:

```cmd
git push origin v1.0.0
```

Push all tags:

```cmd
git push origin --tags
```

Tags are separate refs from branches.

---

# 25. Delete a Remote Branch

Use:

```cmd
git push origin --delete feature/login
```

This requests deletion of:

```text
origin/feature/login
```

on the remote server.

The local branch:

```text
feature/login
```

is not automatically deleted.

---

# 26. Remove a Stale Remote-Tracking Reference

Suppose the remote branch was deleted.

Your repository may still show:

```text
origin/feature/login
```

Clean stale references:

```cmd
git fetch --prune
```

or:

```cmd
git remote prune origin
```

`fetch --prune` is commonly preferred because it fetches and cleans stale remote-tracking references in one operation.

---

# 27. What `git fetch` Actually Does

A simplified model:

```text
Remote repository
       │
       │ objects
       ↓
Local object database
       │
       ↓
remote-tracking refs
```

For:

```cmd
git fetch origin
```

Git can:

```text
download missing objects
download updated objects
update origin/* references
```

It does not automatically merge those changes into your current branch.

---

# 28. Fetch vs Pull

### Fetch

```cmd
git fetch origin
```

means:

```text
download remote updates
```

without integrating them into the current branch.

### Pull

```cmd
git pull
```

is conceptually:

```text
fetch
+
integration
```

The integration can be performed using a merge or rebase depending on configuration/options.

---

# 29. Safe Inspection Workflow

Instead of immediately pulling:

```cmd
git fetch origin
git log --oneline --decorate --graph --all
```

You can inspect what changed.

For example:

```cmd
git log main..origin/main
```

shows commits reachable from:

```text
origin/main
```

but not:

```text
main
```

This is useful for determining what the remote has that your local branch does not.

---

# 30. Compare Local and Remote

Local commits not on remote:

```cmd
git log origin/main..main
```

Remote commits not on local:

```cmd
git log main..origin/main
```

Conceptually:

```text
origin/main..main
```

means:

```text
what exists on main but not origin/main
```

while:

```text
main..origin/main
```

means:

```text
what exists on origin/main but not main
```

---

# 31. Remote URL Protocols

Common URL forms:

### HTTPS

```text
https://github.com/user/project.git
```

### SSH

```text
git@github.com:user/project.git
```

### Local path

```text
C:/repositories/project.git
```

### Network filesystem

```text
\\server\git\project.git
```

The protocol determines how Git communicates with the remote repository.

---

# 32. Change Remote URL

View:

```cmd
git remote -v
```

Change:

```cmd
git remote set-url origin https://github.com/user/new-project.git
```

Verify:

```cmd
git remote -v
```

This changes the configured URL.

It does not move or copy the repository itself.

---

# 33. Rename a Remote

Rename:

```cmd
git remote rename origin github
```

Then:

```cmd
git remote
```

shows:

```text
github
```

Git also updates relevant remote-tracking references and configuration.

---

# 34. Remove a Remote

Use:

```cmd
git remote remove origin
```

This removes the remote configuration from the local repository.

It does **not delete the remote repository from the hosting service**.

---

# 35. Remote Repository Does Not Mean GitHub

Git is distributed.

A remote can be:

```text
GitHub
GitLab
Bitbucket
company server
another computer
NAS
local bare repository
```

Git itself does not require GitHub.

---

# 36. Bare Remote Repository

A common server-side repository is a **bare repository**.

Create:

```cmd
git init --bare project.git
```

A bare repository does not have a normal working tree.

It primarily contains:

```text
objects
refs
HEAD
config
hooks
```

It is suitable as a central Git repository.

---

# 37. Local Repository as Remote

You can use another local repository as a remote.

Example:

```cmd
git remote add backup ../project-backup.git
```

Then:

```cmd
git push backup main
```

This is useful for understanding that a remote is fundamentally another Git repository, not specifically a cloud service.

---

# 38. Remote Refs

Git references are names pointing to commits.

Examples:

```text
refs/heads/main
refs/remotes/origin/main
refs/tags/v1.0.0
```

Conceptually:

```text
refs/heads/main
        ↓
      commit

refs/remotes/origin/main
        ↓
      commit

refs/tags/v1.0.0
        ↓
      commit
```

Remote tracking is implemented using references.

---

# 39. Full Remote Reference

Instead of:

```text
origin/main
```

the full reference is:

```text
refs/remotes/origin/main
```

Instead of:

```text
main
```

the full local branch reference is:

```text
refs/heads/main
```

This becomes important when learning Git internals.

---

# 40. Remote-Tracking Ref Updates

Suppose:

```text
origin/main → A
```

After:

```cmd
git fetch origin
```

the remote advances:

```text
origin/main → B
```

Your local:

```text
main → A
```

may remain unchanged.

So:

```text
main       → A
origin/main → B
```

Fetching updates the knowledge of the remote, not your current work.

---

# 41. Non-Fast-Forward Push

Suppose the remote contains:

```text
A ── B ── C
```

while your local branch contains:

```text
A ── B ── D
```

Pushing:

```cmd
git push origin main
```

may be rejected because:

```text
remote history
      +
local history
```

have diverged.

Git generally refuses to move the remote branch in a way that would discard reachable remote commits.

---

# 42. Resolve Divergence

First:

```cmd
git fetch origin
```

Inspect:

```cmd
git log --oneline --graph --decorate --all
```

Then choose an appropriate integration strategy.

For example:

```cmd
git merge origin/main
```

or:

```cmd
git rebase origin/main
```

Then push:

```cmd
git push origin main
```

The correct strategy depends on the team's history policy.

---

# 43. Force Push

A force push can overwrite the remote branch reference:

```cmd
git push --force
```

This is dangerous on shared branches.

A safer variant is:

```cmd
git push --force-with-lease
```

`--force-with-lease` checks that the remote reference is still at the expected state before replacing it.

This helps prevent accidentally overwriting another person's newly pushed work.

---

# 44. Why Force Push Is Dangerous

Suppose:

```text
Remote:
A ── B ── C
          ↑
       colleague
```

Your rewritten history is:

```text
A ── B ── D
```

A force push could move the remote branch from:

```text
C
```

to:

```text
D
```

making `C` unreachable from that branch.

Therefore:

```text
never force-push shared branches casually
```

---

# 45. `git push --force-with-lease`

Preferred when history rewriting is intentionally required:

```cmd
git push --force-with-lease
```

It provides an important safety check.

Conceptually:

```text
"What I believe the remote points to"
              ==
"What the remote actually points to"
```

If they differ, Git can reject the push rather than blindly replacing the remote branch.

---

# 46. Remote Default Branch

A remote repository has a default branch concept.

For example:

```text
main
```

When cloning:

```cmd
git clone <url>
```

Git uses the remote's advertised default branch to establish the initial local setup.

Do not assume the default branch must always be called:

```text
main
```

It could be:

```text
master
develop
production
```

depending on the repository.

---

# 47. Remote HEAD

A remote can advertise a symbolic reference such as:

```text
origin/HEAD
```

which indicates the remote's default branch.

You can inspect:

```cmd
git remote show origin
```

You may also see:

```text
HEAD branch: main
```

---

# 48. `git remote get-url`

Get the URL:

```cmd
git remote get-url origin
```

Get the fetch URL:

```cmd
git remote get-url --fetch origin
```

Get the push URL:

```cmd
git remote get-url --push origin
```

This is useful in scripts and debugging.

---

# 49. `git remote set-url`

Change the normal URL:

```cmd
git remote set-url origin <new-url>
```

Change push URL separately:

```cmd
git remote set-url --push origin <push-url>
```

This allows configurations such as:

```text
fetch → public mirror
push  → authenticated server
```

---

# 50. Multiple Push URLs

Git can support multiple push URLs.

For example:

```cmd
git remote set-url --add --push origin <backup-url>
```

This can be used to push to multiple destinations.

Use such configurations carefully because every push can affect multiple repositories.

---

# 51. Remote Tracking Configuration

A branch's upstream relationship can be inspected with:

```cmd
git branch -vv
```

Detailed configuration:

```cmd
git config --get-regexp "branch\..*"
```

Example configuration:

```ini
[branch "main"]
    remote = origin
    merge = refs/heads/main
```

This means:

```text
main
 ↓
remote = origin
 ↓
tracks refs/heads/main
```

---

# 52. Push Configuration

Git can define how branches are pushed.

View:

```cmd
git config --get push.default
```

Common values include:

```text
nothing
current
upstream
simple
matching
```

A commonly used modern default is:

```text
simple
```

It provides a conservative push behavior.

---

# 53. `push.default`

### `simple`

Push the current branch to its upstream branch when names are compatible.

### `current`

Push the current branch to a same-named branch on the remote.

### `upstream`

Push to the configured upstream branch.

### `matching`

Push matching branch names.

### `nothing`

Require explicit branch selection.

Example:

```cmd
git push origin main
```

is explicit and therefore avoids ambiguity.

---

# 54. Fetch Refspec

A remote configuration can contain:

```ini
fetch = +refs/heads/*:refs/remotes/origin/*
```

Breakdown:

```text
refs/heads/*
```

means:

```text
remote branches
```

and:

```text
refs/remotes/origin/*
```

means:

```text
local remote-tracking references
```

Therefore:

```text
remote refs/heads/main
        ↓
local refs/remotes/origin/main
```

---

# 55. The `+` in Fetch Refspec

Example:

```text
+refs/heads/*:refs/remotes/origin/*
```

The `+` allows Git to update the destination reference even when the update is not a normal fast-forward.

This is relevant because remote-tracking references are intended to represent the remote's current state.

---

# 56. Explicit Fetch Refspec

You can fetch a specific branch:

```cmd
git fetch origin main
```

This fetches the relevant remote branch information.

You can also use refspec syntax for advanced workflows.

Example:

```cmd
git fetch origin main:refs/remotes/origin/main
```

The explicit form becomes useful when controlling reference destinations.

---

# 57. Fetching Without Updating Local Branches

This is one of the most important remote concepts:

```cmd
git fetch
```

does not mean:

```text
"update my current branch"
```

It means:

```text
"update my local knowledge of the remote"
```

Then you decide what to do:

```text
merge
rebase
reset
inspect
compare
```

---

# 58. Pull Configuration

`git pull` can be configured to integrate fetched changes using:

```text
merge
rebase
fast-forward-only
```

Examples:

```cmd
git pull --rebase
```

or:

```cmd
git pull --ff-only
```

For controlled workflows, explicitly selecting the behavior can make the operation easier to reason about.

---

# 59. `git pull --ff-only`

Use:

```cmd
git pull --ff-only
```

when you want Git to refuse the pull if integration would require a merge.

This is useful when you expect:

```text
local branch
    ↓
strictly behind
    ↓
remote branch
```

If the histories diverge, Git stops instead of automatically creating a merge commit.

---

# 60. Remote Workflow

A disciplined workflow:

```text
1. Fetch
2. Inspect
3. Integrate
4. Test
5. Commit if necessary
6. Push
```

Example:

```cmd
git fetch origin
git status
git log --oneline --decorate --graph --all
git merge origin/main
```

or:

```cmd
git rebase origin/main
```

Then:

```cmd
git push
```

---

# 61. Remote Troubleshooting Checklist

Check remotes:

```cmd
git remote -v
```

Check branches:

```cmd
git branch -vv
```

Fetch:

```cmd
git fetch --all --prune
```

Inspect history:

```cmd
git log --oneline --graph --decorate --all
```

Check configuration:

```cmd
git config --list --show-origin
```

Check remote:

```cmd
git remote show origin
```

---

# 62. Common Mistakes

### Mistake 1

Thinking:

```text
origin = GitHub
```

Correct:

```text
origin = remote name
```

---

### Mistake 2

Thinking:

```text
origin/main = local main
```

Correct:

```text
origin/main = remote-tracking reference
```

---

### Mistake 3

Thinking:

```text
git fetch = merge
```

Correct:

```text
git fetch = retrieve + update remote-tracking references
```

---

### Mistake 4

Thinking:

```text
git pull = only download
```

Correct:

```text
git pull = fetch + integration
```

---

### Mistake 5

Using:

```cmd
git push --force
```

on a shared branch without understanding the consequences.

---

# 63. Professional Remote Model

A useful mental model is:

```text
                 REMOTE SERVER
                      │
                 origin/main
                      │
                git fetch
                      ↓
             LOCAL REMOTE-TRACKING
                      │
                origin/main
                      │
             merge / rebase
                      ↓
                  local main
                      │
                  git push
                      ↓
                 REMOTE SERVER
```

This model explains most everyday remote operations.

---

# 64. Essential Commands

```cmd
git remote
git remote -v
git remote show origin

git remote add origin <url>
git remote remove origin
git remote rename origin <new-name>
git remote set-url origin <url>
git remote get-url origin

git fetch
git fetch origin
git fetch --all
git fetch --prune

git push
git push origin main
git push -u origin feature/login
git push --force-with-lease

git branch -vv
git branch --set-upstream-to=origin/main main

git pull
git pull --rebase
git pull --ff-only
```

---

# 65. Core Concepts to Remember

```text
REMOTE
    named connection to another repository

ORIGIN
    conventional remote name

REMOTE-TRACKING BRANCH
    local reference representing a remote branch

FETCH
    download/update remote information

PUSH
    publish local history/reference updates to a remote

PULL
    fetch + integrate

UPSTREAM
    branch relationship used by pull/push/status

REMOTE REFS
    references such as refs/remotes/origin/main
```

The critical distinction is:

```text
local branch
     ↓
main

remote-tracking reference
     ↓
origin/main

remote repository
     ↓
actual repository on the server
```

Understanding these three layers is fundamental to mastering Git remotes.

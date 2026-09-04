# Git Fetch

## 1. What Is `git fetch`?

`git fetch` downloads changes from a remote repository into your local repository **without changing your current working branch**.

The core idea is:

```text
Remote Repository
       │
       │ git fetch
       ↓
Local Repository
       │
       ↓
Remote-Tracking References
```

For example:

```text
origin/main
```

is updated to represent the latest state Git fetched from the remote.

Your local:

```text
main
```

is not automatically changed.

---

# 2. Basic Syntax

```cmd
git fetch
```

Fetch from a specific remote:

```cmd
git fetch <remote>
```

Example:

```cmd
git fetch origin
```

Fetch a specific branch:

```cmd
git fetch origin main
```

General syntax:

```cmd
git fetch [options] [<repository> [<refspec>...]]
```

---

# 3. Why Use `git fetch`?

`git fetch` is useful when you want to:

```text
see remote changes
compare local and remote branches
update remote-tracking references
inspect incoming commits
prepare for merge
prepare for rebase
check whether someone pushed changes
```

without immediately modifying your current branch.

This makes `fetch` one of the safest Git network operations.

---

# 4. Fetch vs Pull

This distinction is fundamental.

### Fetch

```cmd
git fetch origin
```

Conceptually:

```text
download remote changes
        ↓
update origin/*
        ↓
stop
```

### Pull

```cmd
git pull
```

Conceptually:

```text
fetch
  ↓
integrate
```

The integration may use:

```text
merge
```

or:

```text
rebase
```

depending on configuration or options.

---

# 5. What Happens During Fetch?

Suppose the remote contains:

```text
A ── B ── C ── D
```

Your local repository currently knows:

```text
A ── B ── C
```

and:

```text
origin/main → C
main        → C
```

After:

```cmd
git fetch origin
```

Git downloads the missing objects and updates:

```text
origin/main → D
```

while:

```text
main → C
```

remains unchanged.

Result:

```text
A ── B ── C ── D
         ↑     ↑
        main  origin/main
```

---

# 6. The Most Important Mental Model

Remember:

```text
git fetch
```

means:

> Update my local knowledge of the remote repository.

It does **not** mean:

> Change my current branch to match the remote.

Therefore:

```text
fetch ≠ merge
fetch ≠ rebase
fetch ≠ pull
```

---

# 7. Fetch From `origin`

Most common command:

```cmd
git fetch origin
```

This tells Git:

```text
contact remote named origin
retrieve its updates
update relevant remote-tracking references
```

Example:

```text
origin
  │
  ↓
remote repository
```

---

# 8. Fetch Without Specifying a Remote

You can use:

```cmd
git fetch
```

Git uses the configured remote and fetch configuration associated with the current repository.

For normal repositories with a single `origin`, this commonly means fetching from the configured upstream remote.

For advanced repositories with multiple remotes or unusual configurations, explicitly specifying the remote is clearer:

```cmd
git fetch origin
```

---

# 9. Fetch All Remotes

If your repository has:

```text
origin
upstream
backup
```

you can fetch from all configured remotes:

```cmd
git fetch --all
```

Conceptually:

```text
origin
  ↓
fetch

upstream
  ↓
fetch

backup
  ↓
fetch
```

The local remote-tracking references are updated accordingly.

---

# 10. `--all`

Command:

```cmd
git fetch --all
```

Meaning:

```text
fetch from all configured remotes
```

This is different from:

```cmd
git fetch --all --prune
```

which additionally removes stale remote-tracking references.

---

# 11. Fetch a Specific Remote Branch

You can fetch:

```cmd
git fetch origin main
```

This requests the remote's `main` reference.

You can then inspect the fetched state using:

```cmd
git log --oneline origin/main
```

or:

```cmd
git log --oneline --decorate --graph origin/main
```

---

# 12. Fetch and Update a Local Branch Explicitly

Advanced refspec syntax allows you to specify where the fetched reference should be stored.

Example:

```cmd
git fetch origin main:refs/remotes/origin/main
```

Conceptually:

```text
origin/main
     ↓
refs/remotes/origin/main
```

Normally Git's remote configuration already defines this mapping, so explicit refspecs are primarily useful for advanced workflows.

---

# 13. Remote-Tracking References

After:

```cmd
git fetch origin
```

you may have:

```text
origin/main
origin/develop
origin/feature/login
```

These are **remote-tracking references**.

They are local references that record the state of branches on the remote as last fetched.

---

# 14. Full Remote-Tracking Reference

The short form:

```text
origin/main
```

corresponds to:

```text
refs/remotes/origin/main
```

Compare this with a local branch:

```text
main
```

whose full reference is:

```text
refs/heads/main
```

Therefore:

```text
refs/heads/main
        ↓
local branch

refs/remotes/origin/main
        ↓
remote-tracking reference
```

---

# 15. Fetch Does Not Change `HEAD`

Suppose:

```text
HEAD
 ↓
main
```

and:

```text
main → C
origin/main → C
```

The remote advances to:

```text
D
```

After:

```cmd
git fetch origin
```

you get:

```text
main → C
origin/main → D
HEAD → main
```

Your current checkout remains exactly where it was.

---

# 16. Fetch Does Not Modify Your Working Tree

Suppose your working directory contains:

```text
src/
README.md
package.json
```

Running:

```cmd
git fetch origin
```

does not normally:

```text
replace your files
discard your modifications
merge remote changes
checkout another branch
```

This is one reason fetch is safe for inspecting remote updates.

---

# 17. Fetch Downloads Objects

Git is object-based.

A repository stores objects such as:

```text
blob
tree
commit
tag
```

When fetching changes, Git transfers objects that your local repository does not already have.

Conceptually:

```text
Remote Object Database
        │
        │ missing objects
        ↓
Local Object Database
```

Then references are updated.

---

# 18. Fetch Is More Than Downloading Files

Git does not simply download:

```text
file1.txt
file2.js
README.md
```

Instead, it transfers Git objects and references.

For example:

```text
commit
   ↓
tree
   ↓
blobs
```

This is why understanding `git fetch` becomes important when learning Git internals.

---

# 19. Fetch Updates References

The high-level operation is:

```text
remote repository
       ↓
objects
       ↓
local object database
       ↓
remote-tracking refs
```

For example:

```text
Remote:
refs/heads/main
       ↓
Local:
refs/remotes/origin/main
```

---

# 20. Fetch and Commit Objects

Suppose remote `main` moves:

```text
A ── B ── C
         \
          D
```

Your repository may not contain commit `D`.

After:

```cmd
git fetch origin
```

Git retrieves the necessary objects.

Now:

```text
D
```

exists in your local object database.

And:

```text
origin/main
```

can point to `D`.

---

# 21. Fetch Does Not Merge the Commit

After:

```cmd
git fetch origin
```

you might have:

```text
main → C
origin/main → D
```

Commit `D` exists locally.

But your branch:

```text
main
```

still points to:

```text
C
```

To integrate `D`, you need an additional operation such as:

```cmd
git merge origin/main
```

or:

```cmd
git rebase origin/main
```

---

# 22. Inspect Before Integrating

A professional workflow is:

```cmd
git fetch origin
git log --oneline --decorate --graph --all
```

Then determine what changed.

For example:

```cmd
git log main..origin/main
```

This shows commits reachable from:

```text
origin/main
```

but not:

```text
main
```

---

# 23. Check What You Have Locally

Use:

```cmd
git log origin/main..main
```

This shows commits that are on:

```text
main
```

but not:

```text
origin/main
```

So:

```text
main..origin/main
```

means:

```text
remote has these commits that local main does not
```

while:

```text
origin/main..main
```

means:

```text
local main has these commits that remote-tracking main does not
```

---

# 24. Check Ahead/Behind Status

Use:

```cmd
git status
```

If your branch tracks:

```text
origin/main
```

Git can report whether you are:

```text
ahead
behind
ahead and behind
up to date
```

After fetching, this information is based on the updated remote-tracking reference.

---

# 25. Fetch Before Rebase

A common workflow:

```cmd
git fetch origin
git rebase origin/main
```

This separates:

```text
network operation
```

from:

```text
history rewriting operation
```

That separation makes the process easier to understand and control.

---

# 26. Fetch Before Merge

Similarly:

```cmd
git fetch origin
git merge origin/main
```

This explicitly performs:

```text
1. retrieve remote state
2. inspect/integrate remote state
```

Instead of hiding both steps inside:

```cmd
git pull
```

---

# 27. `git fetch --prune`

Use:

```cmd
git fetch --prune
```

or:

```cmd
git fetch origin --prune
```

This performs:

```text
fetch remote updates
+
remove stale remote-tracking references
```

---

# 28. Why Pruning Is Necessary

Suppose the remote once had:

```text
origin/main
origin/feature/login
```

Someone deletes the remote branch:

```text
feature/login
```

Your local repository can still have:

```text
origin/feature/login
```

because it is a local reference.

Running:

```cmd
git fetch --prune
```

removes the stale remote-tracking reference.

---

# 29. Fetch vs Prune

Without pruning:

```text
remote:
main

local:
origin/main
origin/feature/login   ← stale
```

With:

```cmd
git fetch --prune
```

you get:

```text
remote:
main

local:
origin/main
```

The local branch:

```text
feature/login
```

is not automatically deleted.

Pruning concerns remote-tracking references.

---

# 30. `git remote prune`

Another command is:

```cmd
git remote prune origin
```

This removes stale remote-tracking references.

Unlike:

```cmd
git fetch --prune
```

it does not perform the fetch itself.

Therefore:

```text
git fetch --prune
    ↓
fetch + prune

git remote prune origin
    ↓
prune only
```

---

# 31. Fetch Tags

Git can fetch tags depending on the fetch configuration and options.

Explicitly fetch tags:

```cmd
git fetch --tags
```

This asks Git to fetch tags from the remote.

Tags can represent releases:

```text
v1.0.0
v1.1.0
v2.0.0
```

---

# 32. `--tags`

Example:

```cmd
git fetch origin --tags
```

This fetches tags that are not already present locally, subject to Git's tag-fetch behavior.

It does not mean:

```text
delete local tags
```

or:

```text
change local branches
```

---

# 33. Fetch a Single Tag

You can fetch a particular tag:

```cmd
git fetch origin tag v1.0.0
```

Afterward:

```cmd
git show v1.0.0
```

can inspect the tag.

---

# 34. Fetch a Pull Request Reference

Some hosting platforms expose special references for Pull Requests.

The exact ref namespace depends on the hosting service.

For advanced workflows, Git can fetch an explicit refspec.

Conceptually:

```text
remote PR ref
     ↓
local reference
```

This is useful when you need to inspect a Pull Request without merging it into your branch.

---

# 35. Fetch Refspec

A refspec describes how references are mapped during fetch or push.

Typical remote configuration:

```ini
[remote "origin"]
    url = https://github.com/user/project.git
    fetch = +refs/heads/*:refs/remotes/origin/*
```

Breakdown:

```text
refs/heads/*
```

means remote branch references.

```text
refs/remotes/origin/*
```

means local remote-tracking references.

Therefore:

```text
remote refs/heads/main
        ↓
local refs/remotes/origin/main
```

---

# 36. The `+` in the Fetch Refspec

Typical configuration:

```text
+refs/heads/*:refs/remotes/origin/*
```

The `+` allows Git to update the destination reference even when the update is not a normal fast-forward.

This is appropriate for remote-tracking references because their purpose is to reflect the remote's current state.

---

# 37. Fetch a Remote Branch to a Temporary Local Ref

Advanced example:

```cmd
git fetch origin main:refs/heads/temp-main
```

This tells Git to fetch:

```text
origin/main
```

and update:

```text
refs/heads/temp-main
```

This can be useful for advanced ref manipulation.

Use explicit refspecs carefully because they directly manipulate references.

---

# 38. Fetch Into `FETCH_HEAD`

When Git fetches, it can record information in:

```text
.git/FETCH_HEAD
```

This file records information about references fetched during the operation.

For example, after:

```cmd
git fetch origin
```

Git can record the fetched branch information in `FETCH_HEAD`.

This is one mechanism historically used by commands such as:

```cmd
git merge FETCH_HEAD
```

---

# 39. `FETCH_HEAD`

Conceptually:

```text
remote
  ↓
git fetch
  ↓
FETCH_HEAD
```

`FETCH_HEAD` is not the same thing as:

```text
origin/main
```

`origin/main` is a persistent remote-tracking reference.

`FETCH_HEAD` records what was fetched by a particular fetch operation.

---

# 40. Fetch and `FETCH_HEAD`

Example:

```cmd
git fetch origin main
```

You can inspect:

```cmd
git show FETCH_HEAD
```

or:

```cmd
git log FETCH_HEAD
```

This can be useful for advanced scripting and inspection.

---

# 41. Fetch Output

Run:

```cmd
git fetch origin
```

Git may display output similar to:

```text
From https://github.com/user/project
   abc1234..def5678  main -> origin/main
```

Interpretation:

```text
abc1234
    old origin/main commit

def5678
    new origin/main commit

main -> origin/main
    remote main updated local remote-tracking ref
```

---

# 42. Fetch a Remote That Has Diverged

Suppose:

```text
Remote:
A ── B ── C

Local remote-tracking:
A ── B
```

Remote force-rewrites history:

```text
A ── B ── D
```

Then:

```cmd
git fetch origin
```

can update:

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

because remote-tracking references are designed to follow the remote state.

Your local branch:

```text
main
```

still remains unchanged.

---

# 43. Fetch Does Not Protect Your Local Branch

Suppose:

```text
main → C
origin/main → C
```

and the remote is force-updated to:

```text
D
```

After:

```cmd
git fetch origin
```

you can have:

```text
main → C
origin/main → D
```

Git does not automatically rewrite your local `main`.

This separation is an important safety property.

---

# 44. Fetch With Multiple Refspecs

Advanced syntax allows multiple refspecs:

```cmd
git fetch origin main develop
```

This requests multiple remote branches.

You can also use explicit mappings.

For example:

```cmd
git fetch origin main:refs/remotes/origin/main develop:refs/remotes/origin/develop
```

The default remote configuration usually makes explicit mappings unnecessary.

---

# 45. Fetch From a URL Without a Named Remote

Git can fetch directly from a repository URL:

```cmd
git fetch https://github.com/user/project.git
```

This does not necessarily create a permanent remote configuration named `origin`.

This is useful for one-off operations.

For regular workflows, a named remote is usually clearer:

```cmd
git remote add origin <url>
```

then:

```cmd
git fetch origin
```

---

# 46. Fetch From Another Repository

You can fetch from another repository:

```cmd
git fetch <repository>
```

where `<repository>` can identify:

```text
remote name
URL
local repository path
```

For example:

```cmd
git fetch ../another-project.git
```

Git can retrieve objects and references from that repository.

---

# 47. Fetch and Authentication

Depending on the remote protocol, Git may require authentication.

For example:

```text
HTTPS
SSH
```

The fetch operation itself does not define authentication.

The transport and credential mechanism handle authentication.

Conceptually:

```text
git fetch
    ↓
transport
    ↓
authentication
    ↓
remote repository
```

---

# 48. Fetch Over SSH

Example remote:

```text
git@github.com:user/project.git
```

Fetch:

```cmd
git fetch origin
```

Git uses the configured SSH transport.

The remote URL can be inspected with:

```cmd
git remote get-url origin
```

---

# 49. Fetch Over HTTPS

Example:

```text
https://github.com/user/project.git
```

Fetch:

```cmd
git fetch origin
```

Git uses the HTTPS transport and the configured credential mechanism.

---

# 50. Fetch Does Not Require GitHub

A remote can be:

```text
GitHub
GitLab
Bitbucket
self-hosted Git server
local repository
network repository
bare repository
```

Therefore:

```text
git fetch
```

is a Git operation, not a GitHub-specific operation.

---

# 51. Fetch in a Fork Workflow

Suppose:

```text
origin
    ↓
your fork

upstream
    ↓
original project
```

Fetch your fork:

```cmd
git fetch origin
```

Fetch original project:

```cmd
git fetch upstream
```

You may then have:

```text
origin/main
upstream/main
```

These allow you to compare the two repositories.

---

# 52. Synchronizing a Fork

A common workflow:

```cmd
git fetch upstream
git switch main
git merge upstream/main
```

or, depending on policy:

```cmd
git rebase upstream/main
```

Then:

```cmd
git push origin main
```

The important point is:

```text
fetch upstream
```

updates your local knowledge of the original project first.

---

# 53. Fetch Before Creating a Branch

If you want a branch based on the latest remote `main`:

```cmd
git fetch origin
git switch -c feature/login origin/main
```

This is safer than creating from a potentially stale local `main`.

---

# 54. Fetch Before Comparing

Use:

```cmd
git fetch origin
```

then:

```cmd
git diff main origin/main
```

This compares your local branch with the latest fetched remote state.

Without fetching first, `origin/main` may represent an older remote state.

---

# 55. Fetch Before Checking Remote Status

Suppose you want to know whether someone pushed changes.

Run:

```cmd
git fetch origin
git status
```

Now Git has current remote-tracking information.

Without fetching, your local:

```text
origin/main
```

may not represent the current server state.

---

# 56. Fetch Does Not Automatically Delete Local Branches

Suppose remote branch:

```text
feature/login
```

is deleted.

After:

```cmd
git fetch --prune
```

Git may remove:

```text
origin/feature/login
```

but a local branch:

```text
feature/login
```

can remain.

You must explicitly delete it:

```cmd
git branch -d feature/login
```

if you no longer need it.

---

# 57. Fetch Does Not Automatically Delete Commits

Pruning:

```cmd
git fetch --prune
```

removes stale references.

It does not immediately mean:

```text
delete every unreachable object
```

Git object cleanup is handled separately through maintenance and garbage collection.

This distinction becomes important when learning Git internals.

---

# 58. Fetch and Garbage Collection

Simplified lifecycle:

```text
fetch
 ↓
objects downloaded
 ↓
refs updated
 ↓
old objects may become unreachable
 ↓
maintenance / gc
 ↓
eventual cleanup
```

Do not confuse:

```text
reference deletion
```

with:

```text
object deletion
```

---

# 59. Fetch and Repository Size

Repeated fetches can introduce new objects into your local object database.

Git later performs maintenance to manage storage efficiency.

Useful commands include:

```cmd
git maintenance run
```

and:

```cmd
git gc
```

These are separate from fetching itself.

---

# 60. Fetch Negotiation

At an advanced protocol level, Git does not blindly transfer every object in the remote repository.

The client and server negotiate what objects are needed.

Conceptually:

```text
Client:
"I have these objects."

Server:
"Then you need these additional objects."

Client:
"Send them."
```

This reduces unnecessary data transfer.

The exact negotiation behavior depends on the Git transport and protocol.

---

# 61. Reachability

Git determines object relationships through commit graphs and object references.

If you already have:

```text
A ── B ── C
```

and the remote has:

```text
A ── B ── C ── D ── E
```

you generally only need the objects necessary to obtain:

```text
D
E
```

rather than downloading objects you already possess.

This is one reason Git can efficiently synchronize repositories.

---

# 62. Packfiles During Fetch

Git may transfer objects in packed form.

Conceptually:

```text
Remote:
objects
  ↓
packfile
  ↓
network
  ↓
local object database
```

Packfiles reduce storage and network overhead.

This becomes important in:

```text
large repositories
large histories
monorepos
```

and is covered more deeply in Git internals.

---

# 63. Protocol Versions

Modern Git can communicate using Git transport protocols such as:

```text
protocol v0
protocol v1
protocol v2
```

Protocol v2 provides a more structured request/response mechanism and can improve efficiency for certain operations.

You normally do not need to manually manage protocol versions for everyday `git fetch`.

---

# 64. Fetch Performance

For large repositories, fetch performance can be affected by:

```text
repository size
number of refs
commit graph
packfiles
network latency
server configuration
protocol version
partial clone
shallow clone
object negotiation
```

Advanced repository configurations can optimize these operations.

---

# 65. Fetch With Tags and Branches

Examples:

```cmd
git fetch origin
git fetch origin --tags
git fetch --all
git fetch --all --prune
```

Meaning:

```text
git fetch origin
    ↓
fetch origin

git fetch origin --tags
    ↓
fetch origin + tags

git fetch --all
    ↓
fetch all remotes

git fetch --all --prune
    ↓
fetch all remotes + prune stale refs
```

---

# 66. Useful Fetch Options

Common options include:

```text
--all
--prune
--tags
--dry-run
--verbose
--quiet
--force
--depth
--shallow-since
--shallow-exclude
--unshallow
--update-shallow
--refetch
```

Not every option is needed for everyday Git.

---

# 67. `--dry-run`

You can preview what a fetch would do:

```cmd
git fetch --dry-run origin
```

This is useful when you want to inspect the potential operation without actually updating the repository.

---

# 68. `--verbose`

Use:

```cmd
git fetch --verbose origin
```

or:

```cmd
git fetch -v origin
```

This provides more detailed output.

Useful when debugging fetch behavior.

---

# 69. `--quiet`

Use:

```cmd
git fetch --quiet origin
```

or:

```cmd
git fetch -q origin
```

This reduces normal output.

It can be useful in scripts.

---

# 70. `--force`

Advanced:

```cmd
git fetch --force origin
```

This allows local remote-tracking references to be updated even when the remote reference has changed in a non-fast-forward way.

This is different from:

```cmd
git push --force
```

because fetch updates your local remote-tracking references rather than publishing changes to the server.

---

# 71. `--depth`

For shallow repositories:

```cmd
git fetch --depth=10 origin
```

This can deepen the history by fetching additional commits.

For example:

```text
Before:
recent 10 commits

After:
recent 20 commits
```

This is relevant to shallow clone workflows.

---

# 72. `--unshallow`

If the repository is shallow:

```cmd
git fetch --unshallow origin
```

can convert it toward a complete history by fetching the missing history.

This can be expensive for large repositories.

---

# 73. `--shallow-since`

Example:

```cmd
git fetch --shallow-since="2026-01-01" origin
```

This can deepen history based on a date boundary.

It is useful when you need more historical context without immediately fetching the entire history.

---

# 74. `--shallow-exclude`

Advanced:

```cmd
git fetch --shallow-exclude=<revision> origin
```

This allows more controlled shallow-history expansion.

It is primarily useful for specialized shallow repository workflows.

---

# 75. `--update-shallow`

When fetching from a repository that itself has shallow history, Git normally protects against unintentionally changing your shallow boundary.

```cmd
git fetch --update-shallow origin
```

allows the shallow boundary to be updated.

Use this when you understand the implications of shallow history.

---

# 76. `--refetch`

Advanced:

```cmd
git fetch --refetch origin
```

This requests that objects be fetched again rather than relying on the usual negotiation behavior.

This can be useful after changing certain repository configuration affecting object filtering.

It is not a normal everyday option.

---

# 77. Fetch in Scripts

A robust script may use:

```cmd
git fetch --prune origin
```

followed by explicit inspection.

For example:

```cmd
git fetch --prune origin
git rev-parse origin/main
```

This can retrieve the current fetched commit ID for `origin/main`.

---

# 78. Get the Current Fetched Commit

Use:

```cmd
git rev-parse origin/main
```

Example:

```text
abc123456789...
```

This gives the commit object ID currently referenced by:

```text
origin/main
```

after the latest fetch.

---

# 79. Fetch and `rev-parse`

A useful diagnostic sequence:

```cmd
git fetch origin
git rev-parse origin/main
git rev-parse main
```

If the hashes differ:

```text
main
    ↓
different commit

origin/main
    ↓
different commit
```

your local branch and fetched remote state are not pointing at the same commit.

---

# 80. Fetch and `merge-base`

Advanced comparison:

```cmd
git fetch origin
git merge-base main origin/main
```

This returns the best common ancestor between the two histories.

Useful for understanding:

```text
divergence
integration
branch relationships
```

---

# 81. Detect Divergence

After:

```cmd
git fetch origin
```

inspect:

```cmd
git log --left-right --graph main...origin/main
```

This can show commits unique to each side.

Conceptually:

```text
main-only commits
        ↔
common history
        ↔
origin/main-only commits
```

This is useful when diagnosing branch divergence.

---

# 82. Fetch Workflow for Developers

Recommended pattern:

```cmd
git fetch origin
git status
git log --oneline --decorate --graph --all
```

Then decide:

```text
merge?
rebase?
continue working?
create branch?
```

Do not treat every fetch as an instruction to immediately merge.

---

# 83. Professional Daily Workflow

Before starting work:

```cmd
git fetch origin
git switch main
git pull --ff-only
```

Or, if you prefer explicitly separating operations:

```cmd
git switch main
git fetch origin
git merge --ff-only origin/main
```

Then create a feature branch:

```cmd
git switch -c feature/new-feature
```

This ensures your starting point is current.

---

# 84. Fetch Before Pull

Remember that:

```cmd
git pull
```

already performs a fetch.

So:

```cmd
git fetch origin
git pull
```

usually performs two fetches and is unnecessary unless you intentionally want to inspect the first fetch before pulling.

Instead:

```cmd
git fetch origin
```

then inspect and explicitly integrate.

Or simply:

```cmd
git pull --ff-only
```

when you want a straightforward update.

---

# 85. Common Mistakes

### Mistake 1

Thinking:

```cmd
git fetch
```

updates your current branch.

It does not normally do so.

---

### Mistake 2

Thinking:

```text
origin/main
```

is the actual remote branch.

It is a local remote-tracking reference representing the fetched state of the remote branch.

---

### Mistake 3

Thinking fetch changes your working files.

It normally does not.

---

### Mistake 4

Thinking fetch means merge.

It does not.

---

### Mistake 5

Thinking pruning deletes local branches.

It does not.

---

# 86. Fetch vs Merge

```text
git fetch origin
```

updates:

```text
origin/main
```

Then:

```text
git merge origin/main
```

integrates it into the current branch.

Therefore:

```text
FETCH
 ↓
update remote-tracking state

MERGE
 ↓
integrate history
```

Keeping these concepts separate is essential.

---

# 87. Fetch vs Rebase

```cmd
git fetch origin
git rebase origin/main
```

means:

```text
1. retrieve latest remote state
2. rewrite local branch commits on top of origin/main
```

Fetch itself performs only step 1.

---

# 88. Fetch vs Push

Fetch:

```text
remote → local
```

Push:

```text
local → remote
```

Visual model:

```text
             REMOTE
             /   \
         fetch   push
           ↓       ↑
          LOCAL
```

These are opposite directions of repository synchronization.

---

# 89. Fetch vs Clone

`git clone` is normally used to create a new local repository from a remote repository.

```cmd
git clone <url>
```

A clone includes:

```text
repository initialization
remote configuration
object transfer
initial checkout
```

`git fetch` is used after you already have a repository.

```cmd
git fetch origin
```

So:

```text
clone
    ↓
initial synchronization

fetch
    ↓
later synchronization
```

---

# 90. Fetch vs Remote

These are different commands.

```cmd
git remote
```

manages remote configuration.

```cmd
git fetch
```

retrieves remote changes.

Therefore:

```text
git remote
    ↓
"Where is the remote?"

git fetch
    ↓
"Get the remote's latest state."
```

---

# 91. Fetch Command Reference

### Basic

```cmd
git fetch
git fetch origin
git fetch origin main
```

### All remotes

```cmd
git fetch --all
```

### Prune

```cmd
git fetch --prune
git fetch origin --prune
git fetch --all --prune
```

### Tags

```cmd
git fetch --tags
git fetch origin --tags
```

### Preview

```cmd
git fetch --dry-run origin
```

### Verbose

```cmd
git fetch --verbose origin
```

### Quiet

```cmd
git fetch --quiet origin
```

### Force remote-tracking updates

```cmd
git fetch --force origin
```

### Shallow history

```cmd
git fetch --depth=10 origin
git fetch --unshallow origin
git fetch --shallow-since="2026-01-01" origin
```

---

# 92. Advanced Diagnostic Commands

After fetching:

```cmd
git branch -vv
```

Inspect history:

```cmd
git log --oneline --decorate --graph --all
```

Compare:

```cmd
git log main..origin/main
```

Reverse comparison:

```cmd
git log origin/main..main
```

Diff:

```cmd
git diff main..origin/main
```

Find common ancestor:

```cmd
git merge-base main origin/main
```

Inspect remote-tracking commit:

```cmd
git show origin/main
```

Inspect fetched reference:

```cmd
git rev-parse origin/main
```

---

# 93. Complete Fetch Mental Model

```text
                    REMOTE
                       │
                 refs/heads/main
                       │
                       │ fetch
                       ↓
                network transfer
                       │
                       ↓
             Local Object Database
                       │
                       ↓
          refs/remotes/origin/main
                       │
                       │
             ┌─────────┴─────────┐
             │                   │
           inspect             integrate
             │                   │
             ↓                   ↓
          log/diff        merge / rebase
```

The key sequence is:

```text
REMOTE
  ↓
FETCH
  ↓
OBJECTS + REMOTE-TRACKING REFS
  ↓
INSPECT
  ↓
MERGE / REBASE
```

---

# 94. Golden Rules

```text
1. Fetch updates your local knowledge of a remote.
2. Fetch does not normally modify your current branch.
3. Fetch does not normally modify your working tree.
4. origin/main is a remote-tracking reference.
5. Fetch downloads Git objects, not simply files.
6. Fetch and merge are separate operations.
7. Fetch and rebase are separate operations.
8. Fetch is generally safe to run at any time.
9. --prune removes stale remote-tracking references.
10. Fetch before comparing local and remote state.
11. Fetch before creating work from a remote branch.
12. Use explicit remotes when multiple remotes exist.
```

---

# 95. Master Example

Start with:

```text
Remote:
A ── B ── C ── D

Local:
A ── B ── C
         ↑
      main
      origin/main
```

Run:

```cmd
git fetch origin
```

Now:

```text
A ── B ── C ── D
         ↑     ↑
        main  origin/main
```

Nothing was merged.

Then:

```cmd
git merge origin/main
```

Now:

```text
A ── B ── C ── D
                  ↑
              main
              origin/main
```

The complete concept is:

```text
git fetch
    ↓
retrieve + update remote-tracking references

git merge
    ↓
integrate fetched history

git rebase
    ↓
replay local commits on fetched history
```

That distinction is the foundation for understanding `git pull`, upstream tracking, branch synchronization, and advanced Git workflows.

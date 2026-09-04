# `git remote`

## 1. What Is `git remote`?

`git remote` is the Git command used to **manage remote repositories** associated with your local repository.

A remote is a named reference to another Git repository.

Typical setup:

```text
Local Repository
       │
       │
       ▼
origin
       │
       ▼
Remote Repository
```

The most common remote name is:

```text
origin
```

But `origin` is only a name. It is not a special type of remote.

---

# 2. Basic Syntax

```cmd
git remote
```

General syntax:

```cmd
git remote [options] [subcommand]
```

Common subcommands:

```cmd
git remote
git remote -v
git remote add
git remote remove
git remote rename
git remote get-url
git remote set-url
git remote show
git remote prune
```

---

# 3. List Remotes

```cmd
git remote
```

Example:

```text
origin
```

If multiple remotes exist:

```text
origin
upstream
backup
```

This displays only the **remote names**.

---

# 4. List Remotes with URLs

Use:

```cmd
git remote -v
```

Example:

```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

The `-v` means:

```text
--verbose
```

So:

```cmd
git remote -v
```

shows more information than:

```cmd
git remote
```

---

# 5. Understanding Fetch and Push URLs

A remote can have:

```text
fetch URL
push URL
```

For example:

```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

### Fetch

Used when Git retrieves information:

```text
remote → local
```

### Push

Used when Git publishes changes:

```text
local → remote
```

They are normally the same URL.

---

# 6. Add a Remote

Syntax:

```cmd
git remote add <name> <url>
```

Example:

```cmd
git remote add origin https://github.com/user/project.git
```

Now:

```cmd
git remote
```

returns:

```text
origin
```

Verify:

```cmd
git remote -v
```

---

# 7. Add Remote to an Existing Local Repository

Suppose you have:

```cmd
git init
```

Your repository is local only:

```text
local repository
```

You can connect it to a remote:

```cmd
git remote add origin https://github.com/user/project.git
```

Now:

```text
local repository
      │
      │ origin
      ▼
remote repository
```

The `git remote add` command **does not upload your code**.

It only creates the remote configuration.

To upload commits, use:

```cmd
git push
```

---

# 8. Verify the Remote

After adding:

```cmd
git remote -v
```

Expected:

```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

You can also use:

```cmd
git remote get-url origin
```

---

# 9. Remote Names

Remote names are arbitrary.

For example:

```cmd
git remote add github https://github.com/user/project.git
```

or:

```cmd
git remote add upstream https://github.com/company/project.git
```

or:

```cmd
git remote add backup https://server/project.git
```

All are valid.

The convention is:

```text
origin
```

for the primary remote.

---

# 10. Why Is It Called `origin`?

When you clone:

```cmd
git clone https://github.com/user/project.git
```

Git normally creates:

```text
origin
```

automatically.

So:

```text
origin
```

usually means:

```text
the repository from which this repository was cloned
```

But it does not technically have to mean that.

---

# 11. Rename a Remote

Syntax:

```cmd
git remote rename <old-name> <new-name>
```

Example:

```cmd
git remote rename origin github
```

Before:

```text
origin
```

After:

```text
github
```

Verify:

```cmd
git remote
```

---

# 12. Remove a Remote

Syntax:

```cmd
git remote remove <name>
```

Example:

```cmd
git remote remove origin
```

Equivalent older form:

```cmd
git remote rm origin
```

Afterward:

```cmd
git remote
```

will no longer show:

```text
origin
```

Removing the remote only changes your **local Git configuration**.

It does not delete the repository from GitHub or another server.

---

# 13. `git remote remove` vs Repository Deletion

These are completely different operations.

```cmd
git remote remove origin
```

means:

```text
remove the remote connection from this local repository
```

It does NOT mean:

```text
delete remote repository
```

For example:

```text
GitHub repository
        ↑
        │
      origin
        │
        ↓
local repository
```

Removing `origin` removes:

```text
local → origin
```

The GitHub repository remains intact.

---

# 14. Show Remote Information

Use:

```cmd
git remote show origin
```

This provides detailed information about the remote.

Typical information includes:

```text
Fetch URL
Push URL
HEAD branch
Remote branches
Local branches configured for git pull
Local refs configured for git push
```

This is one of the most useful commands for understanding a remote.

---

# 15. Example `git remote show origin`

Example:

```cmd
git remote show origin
```

Possible output:

```text
* remote origin
  Fetch URL: https://github.com/user/project.git
  Push  URL: https://github.com/user/project.git
  HEAD branch: main
  Remote branches:
    main tracked
    develop tracked
  Local branch configured for 'git pull':
    main merges with remote main
  Local ref configured for 'git push':
    main pushes to main
```

The exact output depends on the repository.

---

# 16. Get Remote URL

Syntax:

```cmd
git remote get-url <remote>
```

Example:

```cmd
git remote get-url origin
```

Output:

```text
https://github.com/user/project.git
```

This is useful when you only need the URL.

---

# 17. Get Fetch URL

```cmd
git remote get-url --fetch origin
```

This explicitly asks Git for the fetch URL.

---

# 18. Get Push URL

```cmd
git remote get-url --push origin
```

This explicitly asks Git for the push URL.

---

# 19. Get All URLs

```cmd
git remote get-url --all origin
```

This can display all configured URLs for the remote.

---

# 20. Change a Remote URL

Syntax:

```cmd
git remote set-url <remote> <new-url>
```

Example:

```cmd
git remote set-url origin https://github.com/user/new-project.git
```

Verify:

```cmd
git remote -v
```

---

# 21. Why Change a Remote URL?

Common reasons:

```text
repository moved
repository renamed
HTTPS → SSH
SSH → HTTPS
organization changed
GitHub account changed
server changed
```

Example:

```text
Old:
https://github.com/user/old-project.git

New:
https://github.com/user/new-project.git
```

Change:

```cmd
git remote set-url origin https://github.com/user/new-project.git
```

---

# 22. Change Only the Push URL

You can configure fetch and push separately.

```cmd
git remote set-url --push origin <push-url>
```

Example:

```cmd
git remote set-url --push origin git@github.com:user/project.git
```

Now you can have:

```text
Fetch:
https://github.com/user/project.git

Push:
git@github.com:user/project.git
```

This is an advanced configuration.

---

# 23. Add an Additional Push URL

Syntax:

```cmd
git remote set-url --add --push <remote> <url>
```

Example:

```cmd
git remote set-url --add --push origin https://backup.example.com/project.git
```

A remote can therefore have multiple push destinations.

This should be used carefully because one `git push` can affect multiple destinations.

---

# 24. Multiple Remotes

A repository can have several remotes.

Example:

```text
origin
upstream
backup
```

View:

```cmd
git remote -v
```

Example:

```text
origin    https://github.com/user/project.git
upstream  https://github.com/company/project.git
backup    https://server/project.git
```

Each remote can represent a different repository.

---

# 25. `origin` and `upstream`

This is common in open-source development.

```text
upstream
    ↓
original project

origin
    ↓
your fork
```

Example:

```text
Company Repository
       ↑
    upstream
       │
       │
     fork
       │
     origin
       │
       ↓
your local repository
```

Typical configuration:

```cmd
git remote add upstream https://github.com/company/project.git
```

---

# 26. Fork Workflow

Suppose:

```text
origin
```

points to your fork:

```text
https://github.com/shivaram/project.git
```

and:

```text
upstream
```

points to the original project:

```text
https://github.com/company/project.git
```

You can fetch the original project:

```cmd
git fetch upstream
```

Then:

```text
upstream/main
```

represents the latest fetched state of the original project's `main`.

---

# 27. Remote-Tracking References

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

These are remote-tracking references.

The full reference is:

```text
refs/remotes/origin/main
```

while a local branch is:

```text
refs/heads/main
```

This distinction is fundamental.

---

# 28. Remote Configuration Location

Remote configuration is stored in:

```text
.git/config
```

Example:

```ini
[remote "origin"]
    url = https://github.com/user/project.git
    fetch = +refs/heads/*:refs/remotes/origin/*
```

This configuration tells Git:

```text
remote name = origin
remote URL = ...
fetch mapping = ...
```

---

# 29. Understanding the Fetch Refspec

This line:

```text
+refs/heads/*:refs/remotes/origin/*
```

means, conceptually:

```text
remote branch references
        ↓
refs/heads/*
        ↓
local remote-tracking references
        ↓
refs/remotes/origin/*
```

For example:

```text
Remote:
refs/heads/main

        ↓ fetch

Local:
refs/remotes/origin/main
```

This is an advanced Git concept.

---

# 30. `git remote get-url` vs `git remote show`

Use:

```cmd
git remote get-url origin
```

when you need:

```text
only the URL
```

Use:

```cmd
git remote show origin
```

when you need:

```text
remote details
branches
tracking information
HEAD branch
push/pull configuration
```

---

# 31. `git remote -v` vs `git remote`

```cmd
git remote
```

Output:

```text
origin
```

while:

```cmd
git remote -v
```

Output:

```text
origin  https://github.com/user/project.git (fetch)
origin  https://github.com/user/project.git (push)
```

Therefore:

```text
git remote
    ↓
names

git remote -v
    ↓
names + URLs
```

---

# 32. Prune Remote-Tracking References

Use:

```cmd
git remote prune origin
```

This removes stale remote-tracking references.

Suppose the remote branch:

```text
feature/login
```

was deleted from the server.

Your local repository might still have:

```text
origin/feature/login
```

Pruning removes the stale reference.

---

# 33. `git fetch --prune`

A commonly preferred alternative is:

```cmd
git fetch --prune
```

This:

```text
fetches remote updates
+
removes stale remote-tracking references
```

For example:

```cmd
git fetch origin --prune
```

---

# 34. Remote HEAD

A remote can advertise its default branch.

For example:

```text
origin/HEAD
```

may point conceptually to:

```text
origin/main
```

You can inspect:

```cmd
git remote show origin
```

and see:

```text
HEAD branch: main
```

This is particularly useful when repositories use different default branch names.

---

# 35. Set Remote HEAD

You can update the symbolic remote HEAD with:

```cmd
git remote set-head origin -a
```

The `-a` option asks Git to determine the remote's default branch.

You can also explicitly set it:

```cmd
git remote set-head origin main
```

This changes the local remote-tracking symbolic reference.

---

# 36. Remote HEAD vs Local HEAD

Do not confuse:

```text
HEAD
```

with:

```text
origin/HEAD
```

### `HEAD`

Represents the currently checked-out location in your local repository.

### `origin/HEAD`

Represents the locally stored symbolic indication of the remote's default branch.

They are different references.

---

# 37. Remote Names in Commands

Once a remote exists:

```text
origin
```

you reference it in commands:

```cmd
git fetch origin
git push origin main
git push -u origin feature/login
git remote show origin
git remote get-url origin
```

The remote name identifies **which remote repository** Git should communicate with.

---

# 38. Remote Is Not a Branch

This is important.

```text
origin
```

is a remote name.

```text
main
```

is a local branch.

```text
origin/main
```

is a remote-tracking reference.

They are three different concepts:

```text
origin
  ↓
remote

main
  ↓
local branch

origin/main
  ↓
remote-tracking reference
```

---

# 39. Remote Is Not a Copy of the Server

A remote configuration contains information about another repository.

Your local repository does not simply contain:

```text
"GitHub connection"
```

Instead, Git maintains:

```text
remote configuration
+
local object database
+
local refs
+
remote-tracking refs
```

This is why Git can continue working locally even when the remote server is unavailable.

---

# 40. Remote Operations Are Distributed

Git is a distributed version control system.

You can make commits locally:

```cmd
git commit
```

without any network connection.

The remote is involved when you explicitly perform operations such as:

```cmd
git fetch
git pull
git push
```

Therefore:

```text
commit ≠ push
```

A commit is local.

A push publishes it to a remote.

---

# 41. Local Commit vs Remote Commit

Suppose:

```text
Local:
A ── B ── C

Remote:
A ── B
```

Your commit:

```text
C
```

exists locally.

It is not yet present on the remote.

After:

```cmd
git push origin main
```

the remote can become:

```text
A ── B ── C
```

This distinction is fundamental to Git.

---

# 42. Remote Configuration Commands

### List

```cmd
git remote
```

### Verbose list

```cmd
git remote -v
```

### Add

```cmd
git remote add <name> <url>
```

### Remove

```cmd
git remote remove <name>
```

### Rename

```cmd
git remote rename <old> <new>
```

### Show details

```cmd
git remote show <name>
```

### Get URL

```cmd
git remote get-url <name>
```

### Change URL

```cmd
git remote set-url <name> <url>
```

### Prune

```cmd
git remote prune <name>
```

### Set remote HEAD

```cmd
git remote set-head <name> <branch>
```

---

# 43. Common Options

## `-v`

Verbose output:

```cmd
git remote -v
```

## `--verbose`

Equivalent:

```cmd
git remote --verbose
```

## `--fetch`

Operate on fetch URLs:

```cmd
git remote get-url --fetch origin
```

## `--push`

Operate on push URLs:

```cmd
git remote get-url --push origin
```

## `--add`

Add an additional URL:

```cmd
git remote set-url --add --push origin <url>
```

## `--delete`

Delete a matching URL:

```cmd
git remote set-url --delete --push origin <url>
```

---

# 44. Practical Workflow

Create repository:

```cmd
mkdir git-demo
cd git-demo
git init
```

Add remote:

```cmd
git remote add origin https://github.com/user/git-demo.git
```

Verify:

```cmd
git remote -v
```

Inspect:

```cmd
git remote show origin
```

Create a commit:

```cmd
git add .
git commit -m "Initial commit"
```

Push:

```cmd
git push -u origin main
```

Now the local branch can track:

```text
origin/main
```

---

# 45. Debugging Remote Problems

First:

```cmd
git remote -v
```

Check:

```text
Is the remote name correct?
Is the URL correct?
Is fetch configured?
Is push configured?
```

Then:

```cmd
git remote show origin
```

Then:

```cmd
git branch -vv
```

Then:

```cmd
git fetch origin
```

Then inspect:

```cmd
git log --oneline --graph --decorate --all
```

This sequence gives a strong picture of the local/remote state.

---

# 46. Remote URL Changed

If a repository moves:

```text
old:
https://github.com/company/old-name.git

new:
https://github.com/company/new-name.git
```

Change:

```cmd
git remote set-url origin https://github.com/company/new-name.git
```

Verify:

```cmd
git remote -v
```

No new clone is required simply because the remote URL changed.

---

# 47. HTTPS to SSH

Current:

```text
https://github.com/user/project.git
```

Change to SSH:

```cmd
git remote set-url origin git@github.com:user/project.git
```

Verify:

```cmd
git remote -v
```

The repository's local Git history remains unchanged.

Only the remote transport configuration changes.

---

# 48. Remote URL Does Not Change Git History

Changing:

```cmd
git remote set-url origin <new-url>
```

does not modify:

```text
commits
trees
blobs
branches
tags
working tree
index
```

It changes the remote configuration.

This is an important separation of concerns.

---

# 49. Advanced Inspection

List remote configuration:

```cmd
git config --get-regexp "^remote\."
```

Example:

```text
remote.origin.url https://github.com/user/project.git
remote.origin.fetch +refs/heads/*:refs/remotes/origin/*
```

You can also inspect the configuration source:

```cmd
git config --list --show-origin
```

This helps determine where a configuration value comes from.

---

# 50. Remote Configuration Hierarchy

Git configuration can exist at multiple levels:

```text
system
global
local
worktree
command
```

Remote configuration is normally repository-specific:

```text
.git/config
```

Therefore two clones of the same repository can have different remote configurations.

---

# 51. Security Consideration

Do not put credentials directly into remote URLs when avoidable.

Avoid configurations such as:

```text
https://username:password@example.com/project.git
```

Credentials in URLs can be exposed through:

```text
configuration files
logs
process output
shell history
```

Use an appropriate credential manager or SSH authentication mechanism instead.

---

# 52. Remote Architecture

The complete model:

```text
                  REMOTE SERVER
                       │
                       │
                Remote Repository
                       │
             ┌─────────┴─────────┐
             │                   │
          fetch                 push
             │                   │
             ↓                   ↑
       remote-tracking       local refs
          refs                  │
             │                   │
             └───────┬───────────┘
                     │
              Local Repository
```

More specifically:

```text
Remote branch
refs/heads/main
      │
      │ fetch
      ↓
Local remote-tracking ref
refs/remotes/origin/main
      │
      │ merge/rebase
      ↓
Local branch
refs/heads/main
      │
      │ push
      ↓
Remote branch
refs/heads/main
```

This is the core architecture behind Git remotes.

---

# 53. Important Distinctions

```text
git remote
```

manages remote configuration.

```text
git fetch
```

retrieves remote updates.

```text
git pull
```

fetches and integrates.

```text
git push
```

publishes local updates.

Therefore:

```text
remote ≠ fetch
remote ≠ pull
remote ≠ push
```

`git remote` manages the **connection/reference configuration** used by those operations.

---

# 54. Command Reference

```cmd
git remote
git remote -v
git remote --verbose

git remote add origin <url>

git remote show origin

git remote get-url origin
git remote get-url --fetch origin
git remote get-url --push origin
git remote get-url --all origin

git remote set-url origin <url>
git remote set-url --push origin <url>
git remote set-url --add --push origin <url>
git remote set-url --delete --push origin <url>

git remote rename origin github

git remote remove origin
git remote rm origin

git remote prune origin

git remote set-head origin -a
git remote set-head origin main
```

---

# 55. Master Mental Model

Remember this:

```text
REMOTE NAME
     │
     │
     ▼
   origin
     │
     │ points to
     ▼
REMOTE URL
     │
     ▼
https://github.com/user/project.git
```

After fetching:

```text
origin/main
     │
     ▼
remote-tracking reference
```

Your actual local branch is:

```text
main
```

Therefore:

```text
origin
    = remote configuration name

origin/main
    = local remote-tracking reference

main
    = local branch

remote repository
    = actual repository on another system
```

Once these four concepts are clear, `fetch`, `pull`, `push`, upstream tracking, and remote troubleshooting become much easier to understand.

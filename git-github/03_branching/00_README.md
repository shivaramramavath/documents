# Git Branching

Git branching is the mechanism Git uses to create **independent lines of development**.

A branch is not a separate copy of the entire repository. In Git, a branch is essentially a **movable reference to a commit**.

```text
                 C ── D  ← feature
                /
A ── B ────────
                \
                 E ── F  ← bugfix
```

The important concepts in this section are:

```text
branch
checkout
switch
merge
merge conflicts
branch strategies
```

---

# 1. Why Branches Exist

Without branches, multiple changes would have to be developed directly on one history:

```text
A ── B ── C ── D ── E
```

This makes independent work difficult.

With branches:

```text
                 C ── D  ← feature
                /
A ── B ────────
                \
                 E ── F  ← bugfix
```

Different work can progress independently.

Typical branches include:

```text
main
develop
feature/login
feature/payments
bugfix/auth-error
release/v2.0
hotfix/security-patch
```

---

# 2. Branches Are References

A branch is fundamentally a reference pointing to a commit.

Example:

```text
A ── B ── C
          ↑
        main
```

Conceptually:

```text
main → C
```

After creating another commit:

```text
A ── B ── C ── D
               ↑
              main
```

The branch reference moves:

```text
main → D
```

The previous commits remain in the repository.

---

# 3. Branches Are Cheap

Git branches are lightweight because Git does not create a complete repository copy for every branch.

Conceptually:

```text
branch
   ↓
commit
   ↓
parent commits
   ↓
objects
```

Creating a branch primarily creates or updates a reference.

That is why creating branches is fast.

---

# 4. Branch Names

Examples:

```text
main
develop
feature/login
feature/payment
bugfix/session-expired
release/v1.4
hotfix/security
```

Good branch names communicate intent.

For example:

```text
feature/user-authentication
```

is more informative than:

```text
test123
```

---

# 5. `main`

A common primary branch is:

```text
main
```

Historically, many repositories used:

```text
master
```

but `main` is now widely used as the default branch name.

The exact default branch name is repository-specific.

---

# 6. Creating a Branch

Traditional command:

```cmd
git branch feature/login
```

This creates:

```text
feature/login
```

but does **not** switch you to it.

Example:

```cmd
git branch feature/login
git branch
```

You may see:

```text
* main
  feature/login
```

The `*` identifies the currently checked-out branch.

---

# 7. Create and Switch

Traditional:

```cmd
git checkout -b feature/login
```

Modern:

```cmd
git switch -c feature/login
```

The modern command is generally clearer because `switch` is specifically intended for changing branches.

---

# 8. Branch Pointer Model

Suppose:

```text
A ── B ── C
          ↑
         main
```

Run:

```cmd
git switch -c feature/login
```

Now:

```text
A ── B ── C
          ↑
     main feature/login
```

Both references point to the same commit.

Then create a commit:

```text
A ── B ── C ── D
          ↑     ↑
         main  feature/login
```

Actually, after the feature commit:

```text
A ── B ── C ── D
               ↑
         feature/login
          ↑
         main
```

More precisely:

```text
main → C
feature/login → D
```

The branches now diverge.

---

# 9. Branches Do Not Contain Changes by Themselves

A common misconception is:

```text
branch = folder
```

This is incorrect.

Think instead:

```text
branch = reference → commit
```

The commit references trees and other Git objects.

---

# 10. `HEAD`

Git uses:

```text
HEAD
```

to identify your current position.

Normally:

```text
HEAD
 ↓
main
 ↓
commit C
```

If you switch branches:

```cmd
git switch feature/login
```

the relationship becomes:

```text
HEAD
 ↓
feature/login
 ↓
commit D
```

Understanding `HEAD` is essential for advanced branching.

---

# 11. `HEAD` and Branch Movement

Example:

```text
A ── B ── C
          ↑
         main
          ↑
         HEAD
```

Create a commit:

```text
A ── B ── C ── D
               ↑
              main
               ↑
              HEAD
```

The branch moves from `C` to `D`.

`HEAD` continues pointing to the current branch.

---

# 12. Branch Divergence

Suppose:

```text
A ── B ── C
          ↑
         main
```

Create:

```text
feature
```

Then switch to it and commit:

```text
          D
         /
A ── B ── C
          \
           E
```

A clearer representation:

```text
          D ← feature
         /
A ── B ── C ← main
```

Now:

```text
main
    → C

feature
    → D
```

The histories have diverged.

---

# 13. Merging

When feature development is complete:

```text
          D ← feature
         /
A ── B ── C ← main
```

switch to:

```cmd
git switch main
```

then:

```cmd
git merge feature
```

Depending on the history, Git may perform:

```text
fast-forward
```

or create:

```text
merge commit
```

---

# 14. Fast-Forward Merge

Suppose:

```text
A ── B ── C ← main
          \
           D ── E ← feature
```

If `main` has not advanced, Git can move the `main` reference forward:

```text
A ── B ── C ── D ── E
                    ↑
              main, feature
```

No merge commit is necessary.

This is a:

```text
fast-forward merge
```

---

# 15. Three-Way Merge

Suppose:

```text
          D ← feature
         /
A ── B ── C ← main
```

and `main` also receives another commit:

```text
          D ← feature
         /
A ── B ── C ── E ← main
```

Now Git cannot simply move `main` to `D`.

Git performs a three-way merge using:

```text
common ancestor
main tip
feature tip
```

This can produce:

```text
          D ─────┐
         /        \
A ── B ── C ── E ── M ← main
```

where:

```text
M = merge commit
```

---

# 16. Merge Conflicts

A merge conflict occurs when Git cannot automatically reconcile changes.

Example:

```text
main:
console.log("Hello");

feature:
console.log("Hi");
```

Both branches changed the same part of the file differently.

Git may produce:

```text
<<<<<<< HEAD
console.log("Hello");
=======
console.log("Hi");
>>>>>>> feature
```

The developer must decide the correct final content.

---

# 17. Conflict Resolution

The general process is:

```cmd
git status
```

Inspect conflicted files.

Edit the files and remove conflict markers.

Then:

```cmd
git add <resolved-file>
```

Finally:

```cmd
git commit
```

for a merge conflict.

For rebase conflicts, the continuation command is different:

```cmd
git rebase --continue
```

---

# 18. Branch Deletion

After merging:

```cmd
git branch -d feature/login
```

The `-d` option performs a safety check.

Force deletion:

```cmd
git branch -D feature/login
```

`-D` can delete a branch even when Git believes it contains commits that have not been merged.

Use it carefully.

---

# 19. Local vs Remote Branches

A repository can contain:

```text
local branches
remote-tracking branches
```

Example:

```text
main
feature/login

origin/main
origin/feature/login
```

These are different references.

A remote-tracking branch such as:

```text
origin/main
```

represents your local knowledge of the remote repository's `main` branch.

---

# 20. Branch Tracking

A local branch can track a remote-tracking branch.

Example:

```text
main
   ↓ tracks
origin/main
```

Then:

```cmd
git pull
```

can determine which remote branch to integrate.

And:

```cmd
git push
```

can know the default destination.

---

# 21. Upstream Branch

The tracked remote branch is commonly called the branch's:

```text
upstream
```

Example:

```text
feature/login
       │
       └── upstream → origin/feature/login
```

This relationship is important for:

```text
git pull
git push
git status
```

---

# 22. Branch Listing

List local branches:

```cmd
git branch
```

List remote-tracking branches:

```cmd
git branch -r
```

List both:

```cmd
git branch -a
```

Show branches with commit information:

```cmd
git branch -v
```

Show upstream information:

```cmd
git branch -vv
```

---

# 23. Branch Verbose Information

Run:

```cmd
git branch -vv
```

You may see something conceptually like:

```text
* main  abc1234 [origin/main] Latest commit
  feature/login  def5678 [origin/feature/login] Add login
```

This can reveal:

```text
current branch
latest commit
upstream branch
tracking status
```

---

# 24. Branch Strategies

Branching becomes more important when multiple developers work together.

Common strategies include:

```text
Feature Branching
Git Flow
Trunk-Based Development
Release Branching
GitHub Flow
```

Each strategy has different trade-offs.

---

# 25. Feature Branching

Typical structure:

```text
main
  │
  ├── feature/login
  ├── feature/payment
  └── feature/profile
```

Developers isolate work in feature branches.

After review and testing:

```text
feature/login
      ↓
main
```

through a merge or pull request.

---

# 26. GitHub Flow

A simplified GitHub Flow model:

```text
main
  ↓
create feature branch
  ↓
commit changes
  ↓
push branch
  ↓
open pull request
  ↓
code review
  ↓
tests
  ↓
merge
  ↓
deploy
```

It is relatively simple and works well for continuously delivered applications.

---

# 27. Git Flow

Git Flow commonly uses long-lived branches such as:

```text
main
develop
```

with temporary branches such as:

```text
feature/*
release/*
hotfix/*
```

Conceptually:

```text
main
 │
 └── release
       ↑
develop
 │
 ├── feature
 └── feature
```

Git Flow can be useful for release-oriented products but may introduce more branching complexity than necessary for continuously deployed systems.

---

# 28. Trunk-Based Development

Trunk-based development emphasizes a shared mainline:

```text
main
 │
 ├── short-lived branch
 │       ↓
 │     merge
 │       ↓
 ├── short-lived branch
 │       ↓
 │     merge
 ↓
```

Branches are generally:

```text
short-lived
small
frequently integrated
```

The goal is to minimize long-lived divergence.

---

# 29. Long-Lived Branches

Example:

```text
main
      \
       feature
        \
         \
          \
           merge
```

The longer the branch lives, the greater the chance of:

```text
merge conflicts
stale assumptions
integration problems
large review sizes
```

This is one reason modern development workflows often favor smaller branches.

---

# 30. Branch Naming Convention

A useful convention:

```text
feature/<name>
bugfix/<name>
hotfix/<name>
release/<version>
chore/<name>
refactor/<name>
docs/<name>
test/<name>
```

Examples:

```text
feature/oauth-login
bugfix/token-refresh
hotfix/payment-security
release/v2.4.0
refactor/auth-service
docs/api-authentication
```

The exact convention should be consistent within a team.

---

# 31. Branch Protection

Important production branches may be protected against direct changes.

Typical protected branch:

```text
main
```

Rules can require:

```text
pull request
code review
passing CI
status checks
no force pushes
```

This is generally configured by the hosting platform rather than by Git itself.

---

# 32. Force Pushing and Branches

A normal push advances a remote branch in a way that preserves its existing history.

History rewriting may require:

```cmd
git push --force-with-lease
```

rather than:

```cmd
git push --force
```

`--force-with-lease` provides an additional safety check against overwriting unexpected remote updates.

This becomes particularly important after:

```text
rebase
interactive rebase
commit rewriting
```

---

# 33. Branches and History Rewriting

Suppose:

```text
A ── B ── C ← feature
```

After rebasing onto a newer base:

```text
A ── B ── X ── Y ← feature
```

The branch reference moves to newly created commits.

The original commits may become unreachable from the branch reference but can often be recovered through:

```cmd
git reflog
```

This is why understanding branches and references is essential before learning history rewriting.

---

# 34. Branches and Tags Are Different

A branch:

```text
moves
```

A tag:

```text
normally identifies a fixed point
```

Example:

```text
A ── B ── C ── D
          ↑
       v1.0.0
```

A branch may later move:

```text
A ── B ── C ── D ── E
                    ↑
                   main
```

while:

```text
v1.0.0 → C
```

still points to the same commit.

---

# 35. Branches Are References Inside Git

At an advanced level, branch references are stored under Git's reference namespace.

Conceptually:

```text
refs/
└── heads/
    ├── main
    └── feature/login
```

Remote-tracking references are conceptually under:

```text
refs/
└── remotes/
    └── origin/
        ├── main
        └── feature/login
```

This will be explored deeply in:

```text
07_advanced_git/03_refs.md
```

---

# 36. Inspect a Branch Reference

You can inspect references with:

```cmd
git show-ref
```

For local branches:

```cmd
git for-each-ref refs/heads/
```

For remote-tracking branches:

```cmd
git for-each-ref refs/remotes/
```

These commands expose the underlying reference model.

---

# 37. Branch Tip

The commit a branch currently points to is called its:

```text
tip
```

Example:

```text
A ── B ── C
          ↑
          main
```

`C` is the tip of `main`.

After another commit:

```text
A ── B ── C ── D
               ↑
              main
```

`D` becomes the new tip.

---

# 38. Branch Reachability

If:

```text
A ── B ── C
          ↑
         main
```

then commits:

```text
A
B
C
```

are reachable from `main`.

If another branch points to:

```text
D
```

and:

```text
D
```

has `C` as an ancestor, then `C` is also reachable from that branch.

Reachability is fundamental to:

```text
merge
rebase
branch comparison
garbage collection
commit recovery
```

---

# 39. Comparing Branches

See commits in `feature` that are not in `main`:

```cmd
git log main..feature
```

See commits in `main` that are not in `feature`:

```cmd
git log feature..main
```

See both sides:

```cmd
git log --left-right main...feature
```

This becomes especially useful when determining whether a branch is ready to merge.

---

# 40. Compare Branch Content

```cmd
git diff main..feature
```

This compares the content represented by the branch tips.

For a more precise understanding of commits unique to each side, use:

```cmd
git log main..feature
```

because:

```text
git diff
    compares content

git log
    compares history
```

---

# 41. Branch Ancestry

Check whether one branch is an ancestor of another:

```cmd
git merge-base --is-ancestor main feature
```

If successful, `main` is an ancestor of `feature`.

This is useful in scripts and CI systems.

---

# 42. Merge Base

For:

```text
          D ← feature
         /
A ── B ── C ← main
```

the merge base is:

```text
B
```

The merge base represents the common ancestor Git can use when performing a three-way merge.

Find it with:

```cmd
git merge-base main feature
```

---

# 43. Branch Workflow

A common feature workflow:

```cmd
git switch main
git pull
git switch -c feature/login
```

Work:

```cmd
git add .
git commit -m "Add login"
```

Push:

```cmd
git push -u origin feature/login
```

Create a pull request or merge according to the team's workflow.

After merging:

```cmd
git switch main
git pull
git branch -d feature/login
```

---

# 44. Safe Branching Principles

Use branches to isolate:

```text
features
bug fixes
experiments
release preparation
hotfixes
```

Keep branches:

```text
small
focused
up to date
short-lived when possible
```

Avoid unnecessarily long-lived branches unless your release model requires them.

---

# 45. Commands Covered in This Section

### Branch creation

```cmd
git branch <name>
git checkout -b <name>
git switch -c <name>
```

### Branch switching

```cmd
git checkout <name>
git switch <name>
```

### Branch listing

```cmd
git branch
git branch -a
git branch -r
git branch -v
git branch -vv
```

### Branch deletion

```cmd
git branch -d <name>
git branch -D <name>
```

### Merging

```cmd
git merge <branch>
```

### Branch comparison

```cmd
git log main..feature
git diff main..feature
git merge-base main feature
```

---

# 46. Files in This Section

```text
03_branching/
│
├── 00_README.md
│
├── 01_branch.md
│   └── Creating, listing, deleting and inspecting branches
│
├── 02_checkout.md
│   └── Legacy branch/file switching command
│
├── 03_switch.md
│   └── Modern branch switching and creation
│
├── 04_merge.md
│   └── Fast-forward and three-way merges
│
├── 05_merge-conflicts.md
│   └── Understanding and handling merge conflicts
│
└── 06_branch-strategies.md
    └── Feature branching, GitHub Flow,
        Git Flow and trunk-based development
```

---

# 47. Learning Order

Study this directory in this exact order:

```text
00_README.md
      ↓
01_branch.md
      ↓
02_checkout.md
      ↓
03_switch.md
      ↓
04_merge.md
      ↓
05_merge-conflicts.md
      ↓
06_branch-strategies.md
```

The progression is:

```text
branch references
      ↓
switching branches
      ↓
modern branch operations
      ↓
merging histories
      ↓
conflict resolution
      ↓
professional branching strategies
```

---

# 48. Core Mental Model

Remember:

```text
                    branch
                      ↓
HEAD → branch → commit
                 ↓
              parent
                 ↓
              parent
```

A branch is a **movable reference**.

When you commit:

```text
branch → new commit
```

When you switch:

```text
HEAD → another branch
```

When you merge:

```text
two histories
     ↓
one resulting history
```

When histories cannot be automatically reconciled:

```text
merge conflict
     ↓
manual resolution
     ↓
completed merge
```

This mental model is the foundation for advanced Git operations such as:

```text
rebase
cherry-pick
reflog
reset
detached HEAD
worktrees
reference manipulation
commit recovery
```

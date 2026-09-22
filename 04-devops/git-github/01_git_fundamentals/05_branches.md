# Git Branches

A **Git branch is a movable reference to a commit**.

Branches do not contain copies of your project.

They point to commits in Git's commit graph.

```text
A → B → C
        ▲
        │
       main
```

Here:

```text
main → C
```

The commits are objects. `main` is a reference pointing to the latest commit.

---

# 1. Why Branches Exist

Branches allow multiple lines of development to exist in the same repository.

Example:

```text
             feature
                │
                ▼
A → B → C → D
          │
          ▼
         main
```

You can develop a feature without immediately moving the main development line.

Typical branches:

```text
main
develop
feature/login
feature/payments
bugfix/session
release/v1.2
```

---

# 2. Creating a Branch

Create a branch:

```cmd
git branch feature/login
```

This creates:

```text
A → B → C
        ▲
        ├── main
        └── feature/login
```

The new branch points to the current commit.

It does **not** automatically switch to the new branch.

---

# 3. List Branches

List local branches:

```cmd
git branch
```

Example:

```text
* main
  feature/login
  feature/payment
```

The `*` identifies the currently checked-out branch.

---

# 4. Switch Branch

Use:

```cmd
git switch feature/login
```

Now:

```text
HEAD
 │
 ▼
feature/login
 │
 ▼
C
```

The current branch is now `feature/login`.

---

# 5. Create and Switch

The common command is:

```cmd
git switch -c feature/login
```

This performs:

```text
create branch
+
switch to branch
```

Equivalent older syntax:

```cmd
git checkout -b feature/login
```

For modern Git, prefer:

```cmd
git switch -c feature/login
```

---

# 6. Branch Pointer

Suppose:

```text
A → B → C
        ▲
        │
       main
```

Create:

```cmd
git branch feature
```

Now:

```text
A → B → C
        ▲
        ├── main
        └── feature
```

Both references point to the same commit.

---

# 7. Branches Move When You Commit

Suppose you switch to `feature`:

```text
feature
   │
   ▼
   C
```

Create a commit:

```cmd
git commit -m "Add login"
```

Now:

```text
A → B → C → D
        │     ▲
        │     │
       main  feature
```

Only `feature` moves.

`main` remains at `C`.

---

# 8. Branches Are Lightweight

A branch is fundamentally a reference.

Conceptually:

```text
refs/heads/main
```

contains the object ID of the commit currently referenced by `main`.

For example:

```text
refs/heads/main
        │
        ▼
     commit C
```

This is why creating a branch is extremely cheap.

---

# 9. Branch Reference Storage

Local branches live under:

```text
refs/heads/
```

Conceptually:

```text
.git/
└── refs/
    └── heads/
        ├── main
        └── feature
```

The exact physical storage can differ because Git may use packed references.

Do not depend on `.git/refs/heads` always containing every branch as a loose file.

---

# 10. Branch Name

A branch name such as:

```text
feature/login
```

is a reference name.

It ultimately identifies a commit through:

```text
feature/login
      │
      ▼
    commit
```

Git imposes rules on valid reference names.

---

# 11. Branch Naming

Good names are descriptive:

```text
feature/user-authentication
feature/payment-api
bugfix/session-timeout
hotfix/security-patch
release/v2.0
```

Avoid meaningless names:

```text
test
abc
stuff
new
branch1
```

A repository can establish its own naming conventions.

---

# 12. Current Branch

Check the current branch:

```cmd
git branch --show-current
```

Example:

```text
feature/login
```

Another useful command:

```cmd
git status
```

It usually reports the current branch near the top.

---

# 13. HEAD and Branches

When on a branch:

```text
HEAD
 │
 ▼
main
 │
 ▼
C
```

This means:

```text
HEAD → main → C
```

`HEAD` normally points to the current branch reference.

---

# 14. Detached HEAD

If you check out a commit directly:

```cmd
git switch --detach <commit>
```

the structure becomes:

```text
HEAD
 │
 ▼
C
```

There is no branch between `HEAD` and `C`.

This is called:

```text
detached HEAD
```

---

# 15. Branch Creation From a Specific Commit

You can create a branch at a particular commit:

```cmd
git branch feature/login <commit>
```

Example:

```text
A → B → C → D
    ▲
    │
 feature
```

The branch starts at `B`.

---

# 16. Branch From Another Branch

You can create a branch from an existing branch:

```cmd
git branch feature/login main
```

If:

```text
main → C
```

then:

```text
main    → C
feature → C
```

Again, no commits are copied.

---

# 17. Branch From a Tag

A branch can be created from a tag:

```cmd
git branch maintenance v1.0
```

Conceptually:

```text
v1.0
 │
 ▼
C
▲
│
maintenance
```

This creates a new branch starting at the tagged commit.

---

# 18. Branch From Relative Commit

You can use commit expressions:

```cmd
git branch feature HEAD~3
```

If:

```text
A → B → C → D → E
            ▲
           HEAD
```

then:

```text
HEAD~3 = B
```

and the new branch points to `B`.

---

# 19. Rename a Branch

Rename the current branch:

```cmd
git branch -m new-name
```

Rename another local branch:

```cmd
git branch -m old-name new-name
```

Example:

```cmd
git branch -m feature/login feature/authentication
```

---

# 20. Delete a Branch

Delete a merged local branch:

```cmd
git branch -d feature/login
```

The `-d` option performs a safety check.

If Git determines the branch contains commits that may not be safely discarded, deletion can be refused.

---

# 21. Force Delete a Branch

You can force deletion:

```cmd
git branch -D feature/login
```

This removes the branch reference even when Git's normal safety check would prevent deletion.

Important:

```text
branch deletion
≠
immediate deletion of commit objects
```

The commits may remain temporarily reachable through other references or reflogs.

---

# 22. Branch Deletion Example

Before:

```text
A → B → C → D
        │     ▲
       main  feature
```

Delete:

```cmd
git branch -d feature
```

After:

```text
A → B → C → D
              ▲
             main
```

The branch reference is gone.

The commits remain part of history if they are still reachable from `main`.

---

# 23. Merged Branch

Suppose:

```text
       C → D
      /     \
A → B         M
      \     /
       E → F
```

If `feature` was merged into `main`, the feature branch can often be deleted:

```cmd
git branch -d feature
```

The merge commit preserves the integration history.

---

# 24. Branch Containment

Git can determine whether one branch contains another.

Example:

```cmd
git branch --contains <commit>
```

This lists branches whose history contains the specified commit.

For example:

```text
A → B → C → D
        ▲
       main
```

If `C` is an ancestor of `main`, then:

```cmd
git branch --contains C
```

can include:

```text
main
```

---

# 25. Branches Containing HEAD

Use:

```cmd
git branch --contains HEAD
```

This identifies local branches containing the current commit.

This is useful when determining whether a commit has already been incorporated into another branch.

---

# 26. Branches Not Containing a Commit

You can use:

```cmd
git branch --no-contains <commit>
```

to identify branches that do not contain a given commit.

This is useful when investigating branch divergence.

---

# 27. Branch Merged Status

List branches already merged into the current branch:

```cmd
git branch --merged
```

List branches not merged:

```cmd
git branch --no-merged
```

These commands are useful for branch cleanup.

---

# 28. Branch Tracking

A local branch can track a remote-tracking branch.

Example:

```text
main
 │
 │ tracks
 ▼
origin/main
```

Tracking information allows commands such as:

```cmd
git status
git pull
git push
```

to determine a default upstream relationship.

---

# 29. Upstream Branch

A local branch can have an upstream branch:

```text
local main
    │
    ▼
origin/main
```

You can inspect tracking information:

```cmd
git branch -vv
```

Example:

```text
* main  abc123 [origin/main] Add API
```

This tells you that local `main` tracks `origin/main`.

---

# 30. Set Upstream During Push

A common first push:

```cmd
git push -u origin feature/login
```

The `-u` option establishes the upstream relationship.

Afterward:

```cmd
git push
```

can use the configured upstream.

---

# 31. Set Upstream Manually

You can configure tracking with:

```cmd
git branch --set-upstream-to=origin/main main
```

Conceptually:

```text
main
 │
 └── upstream → origin/main
```

---

# 32. Remove Upstream

To remove the upstream relationship:

```cmd
git branch --unset-upstream
```

This does not delete either branch.

It only removes the tracking configuration.

---

# 33. Local Branch vs Remote-Tracking Branch

These are different:

```text
main
```

is a local branch.

```text
origin/main
```

is normally a remote-tracking branch.

Conceptually:

```text
refs/heads/main
refs/remotes/origin/main
```

They are different references.

---

# 34. Remote-Tracking Branch

Suppose the remote repository has:

```text
main → C
```

After fetching:

```text
origin/main → C
```

Your local repository stores a reference representing the last known state of the remote branch.

This is not the remote repository itself.

---

# 35. Remote Branch Creation

Suppose you create:

```cmd
git switch -c feature/login
```

and then:

```cmd
git push -u origin feature/login
```

The conceptual result is:

```text
local:
feature/login → C

remote:
feature/login → C

local tracking:
feature/login → origin/feature/login
```

---

# 36. Remote Branch Deletion

Delete a remote branch:

```cmd
git push origin --delete feature/login
```

This requests deletion of the remote branch.

Your local remote-tracking reference may also be updated as part of the operation.

You can prune stale remote-tracking references separately with:

```cmd
git fetch --prune
```

---

# 37. Pruning Remote Branches

Suppose the remote branch was deleted:

```text
Remote:
feature/login → deleted
```

Your local repository may still have:

```text
origin/feature/login
```

Run:

```cmd
git fetch --prune
```

to remove stale remote-tracking references.

---

# 38. Branch Divergence

Suppose:

```text
      C → D
     /
A → B
     \
      E → F
```

Now:

```text
main    → D
feature → F
```

The branches have diverged.

They share:

```text
A → B
```

but contain different descendants.

---

# 39. Finding Divergence

A common ancestor can be found with:

```cmd
git merge-base main feature
```

Suppose it returns:

```text
B
```

Then:

```text
B
├── main → D
└── feature → F
```

`B` is a merge base.

---

# 40. Branch Difference

To inspect commits on `feature` that are not reachable from `main`:

```cmd
git log main..feature
```

To inspect commits on `main` that are not reachable from `feature`:

```cmd
git log feature..main
```

This is based on commit reachability, not branch names alone.

---

# 41. Symmetric Difference

You can inspect commits unique to either side with:

```cmd
git log main...feature
```

The three-dot syntax represents the symmetric difference in commit reachability.

A common visualization:

```cmd
git log --left-right main...feature
```

This can indicate which commits belong exclusively to each side.

---

# 42. Branch Comparison

Compare snapshots:

```cmd
git diff main feature
```

This answers:

```text
What is different between the trees at main and feature?
```

Compare commits:

```cmd
git log main..feature
```

This answers:

```text
Which commits are reachable from feature but not main?
```

These are different questions.

---

# 43. Branch and Commit Graph

Branches should be understood as labels attached to commits.

Example:

```text
                  feature
                     │
                     ▼
A → B → C → D → E → F
          ▲
          │
         main
```

If `feature` receives another commit:

```text
A → B → C → D → E → F → G
          ▲             ▲
          │             │
         main         feature
```

The branch reference moves from `F` to `G`.

---

# 44. Branches Do Not Store Changes

A common misconception:

```text
feature branch = copy of project
```

Incorrect.

Instead:

```text
feature branch = reference to commit
```

The committed files are represented by Git objects associated with that commit.

---

# 45. Branch Creation Is Cheap

Because a branch is essentially a reference:

```text
branch → commit
```

creating one does not duplicate the entire repository.

Therefore:

```cmd
git branch feature/test
```

is cheap even for large repositories.

The cost of creating a branch is fundamentally different from copying a working directory.

---

# 46. Branch Switching

When you run:

```cmd
git switch feature
```

Git changes the current checkout to the commit referenced by `feature` and updates the working tree and index accordingly.

Conceptually:

```text
Before:

HEAD → main → C


After:

HEAD → feature → D
```

The working tree is updated to match the target checkout, subject to local changes and Git's safety rules.

---

# 47. Switching With Uncommitted Changes

Suppose:

```text
Working Tree
    │
    └── uncommitted modifications
```

You attempt:

```cmd
git switch feature
```

Git checks whether switching would overwrite local changes.

If it would be unsafe, Git can refuse the operation.

This protects uncommitted work.

---

# 48. Branch-Specific Development

Typical workflow:

```text
main
 │
 └── create feature
          │
          ▼
      feature/login
          │
          ├── commit
          ├── commit
          └── commit
                  │
                  ▼
                merge
                  │
                  ▼
                 main
```

The branch provides an isolated line of history.

---

# 49. Feature Branch

A feature branch can be created with:

```cmd
git switch main
git pull
git switch -c feature/login
```

Then:

```cmd
git add .
git commit -m "Add login validation"
```

Continue:

```cmd
git add .
git commit -m "Add login service"
```

Eventually integrate the branch into the target branch.

---

# 50. Branch Naming Hierarchy

Names such as:

```text
feature/auth/login
feature/auth/logout
bugfix/api/session
release/2.0
```

look hierarchical.

Git treats the name as a reference name rather than creating a true directory hierarchy of independent branch objects.

The `/` character is primarily part of the reference naming structure.

---

# 51. Branch Configuration

Tracking and branch behavior can be configured through Git configuration.

Conceptually:

```text
branch.<name>.remote
branch.<name>.merge
```

For example:

```text
branch.main.remote = origin
branch.main.merge = refs/heads/main
```

This tells Git the upstream relationship.

---

# 52. Branch Verbose Information

Use:

```cmd
git branch -vv
```

Example:

```text
* main      a1b2c3 [origin/main] Latest changes
  feature   d4e5f6 [origin/feature] Add authentication
```

This can show:

```text
current branch
commit
upstream
tracking relationship
```

---

# 53. Branch List by Commit Date

You can sort branches:

```cmd
git branch --sort=-committerdate
```

This is useful in repositories containing many branches.

You can combine options with verbose output:

```cmd
git branch -vv --sort=-committerdate
```

---

# 54. Branch List by Authorship

Git's sorting options can use commit metadata.

For example:

```cmd
git branch --sort=authordate
```

This sorts branches based on relevant commit metadata.

Sorting is particularly useful for repository maintenance.

---

# 55. Branch Reflog

Branches can have reflogs when reflog recording is enabled.

Inspect a branch's reflog:

```cmd
git reflog show main
```

Example:

```text
main@{0}
main@{1}
main@{2}
```

This records previous positions of the branch reference.

---

# 56. Branch Reflog vs Commit History

Commit history:

```text
A → B → C
```

describes parent relationships.

Branch reflog:

```text
main:
C → D → E → C
```

describes movements of the branch reference.

They are fundamentally different.

Commit history is repository history.

Reflog is local reference-movement history.

---

# 57. Recovering a Moved Branch

Suppose:

```text
main → C
```

You reset it:

```cmd
git reset --hard A
```

Now:

```text
main → A
```

The previous location may still be visible through:

```cmd
git reflog main
```

You may then recover it by creating a branch:

```cmd
git branch recovery <commit>
```

This is one reason reflogs are valuable.

---

# 58. Branch Reset

A branch reference can be moved with:

```cmd
git reset --hard <commit>
```

when that branch is checked out.

Conceptually:

```text
Before:

A → B → C
        ▲
       main
```

After:

```text
A → B → C
▲
│
main
```

The commits are not necessarily immediately destroyed.

The branch reference simply moved backward.

---

# 59. Reset vs Revert

These are fundamentally different.

`reset` moves a branch reference:

```text
main → C
```

to another commit:

```text
main → B
```

`revert` creates a new commit that reverses an earlier change:

```text
A → B → C
          │
          ▼
          D
```

where `D` reverses the effect of `C`.

For shared history, revert is often safer because it does not rewrite the existing branch ancestry.

---

# 60. Branch Fast-Forward

Suppose:

```text
main → B

A → B → C
          ▲
        feature
```

If `main` is advanced to `C` without creating a merge commit:

```text
A → B → C
        ▲
        ├── main
        └── feature
```

this is a fast-forward.

No new commit is necessary.

---

# 61. Branch Merge

When two branches diverge:

```text
      C
     /
A → B
     \
      D
```

merging may create:

```text
      C
     / \
A → B   M
     \ /
      D
```

`M` is a merge commit with two parents.

The merge operation is covered in detail in:

```text
01_git_fundamentals/merging.md
```

---

# 62. Branch Rebase

A branch can be rebased onto another base.

Before:

```text
      C → D
     /
A → B
     \
      E → F
```

After rebasing the feature branch onto `C`:

```text
A → B → C → E' → F'
```

The rebased commits are new commit objects.

Therefore:

```text
E ≠ E'
F ≠ F'
```

even if their logical changes are similar.

---

# 63. Branch History Rewriting

Operations that can rewrite branch history include:

```text
reset
rebase
commit --amend
cherry-pick
filtering/history-rewrite tools
```

When a branch is rewritten:

```text
old commits
```

may be replaced by:

```text
new commits
```

This changes commit IDs.

---

# 64. Branch and Force Push

Suppose:

```text
Remote main → C
Local main  → D
```

and you rewrite local history:

```text
Remote main → C

Local:
A → B → X
        ▲
       main
```

The remote may reject a normal push because the update is not a fast-forward.

A force push can replace the remote branch reference.

Prefer:

```cmd
git push --force-with-lease
```

over:

```cmd
git push --force
```

when rewriting a published branch.

`--force-with-lease` provides an additional safety check against overwriting unexpected remote updates.

---

# 65. Branch Protection

In collaborative repositories, important branches such as:

```text
main
production
release
```

may be protected by the hosting platform.

Typical policies include:

```text
pull requests required
status checks required
reviews required
force pushes disabled
direct pushes restricted
```

These are hosting-platform policies, not core Git branch mechanics.

---

# 66. Branch Strategy

Common strategies include:

```text
feature branches
release branches
hotfix branches
trunk-based development
Git Flow
```

Git itself does not require a particular branching strategy.

A branching strategy is a team workflow built on Git's reference and commit mechanisms.

---

# 67. Trunk-Based Development

A simplified model:

```text
main
 │
 ├── short-lived feature
 │
 ├── short-lived feature
 │
 └── short-lived feature
```

Changes are integrated frequently.

The emphasis is on keeping branches short-lived and the main line continuously integrable.

---

# 68. Git Flow-Style Model

A simplified model:

```text
main
 │
 ├── release
 │
 └── develop
       │
       ├── feature
       ├── feature
       └── feature
```

Git does not enforce this model.

It is simply a workflow convention.

---

# 69. Branch as a Ref

The most important advanced concept is:

```text
branch
   =
reference
   ↓
commit
```

For example:

```text
refs/heads/main
        │
        ▼
   abc123...
```

A branch does not store:

```text
files
diffs
copies
patches
```

It identifies a commit.

---

# 70. Reference Names

Git references include namespaces such as:

```text
refs/heads/
refs/remotes/
refs/tags/
```

Examples:

```text
refs/heads/main
refs/heads/feature/login
refs/remotes/origin/main
refs/tags/v1.0
```

The short names are convenient forms:

```text
main
feature/login
origin/main
v1.0
```

---

# 71. Branch Reference Update

Creating a commit on the current branch conceptually performs:

```text
old branch ref
      │
      ▼
   Commit A

create Commit B

new branch ref
      │
      ▼
   Commit B
```

This is why branches appear to "move."

The commits themselves do not move.

The reference moves.

---

# 72. Branches and Object Database

The relationship is:

```text
Branch
   │
   ▼
Commit
   │
   ├── Parent
   │
   └── Tree
         │
         ├── Blob
         └── Tree
```

Git's object database stores these objects.

References provide reachable entry points into the object graph.

---

# 73. Branch Reachability

Suppose:

```text
A → B → C → D
        ▲
        │
       main
```

`main` makes `D`, `C`, `B`, and `A` reachable through ancestry.

If another branch points to `B`:

```text
A → B → C → D
    ▲       ▲
    │       │
 feature   main
```

both branches share the history through `B`.

---

# 74. Branch Name Does Not Determine History

These names:

```text
main
feature
release
production
```

have no inherent semantic meaning to Git.

Git does not automatically know:

```text
main = production
feature = unfinished
release = stable
```

Those meanings come from human/team conventions or hosting-platform configuration.

---

# 75. Branch Pointer Mental Model

Think of:

```text
A → B → C → D
        ▲
        │
       main
```

as:

```text
Commit graph:
A → B → C → D

Reference:
main = D
```

If you commit:

```text
main = E
```

where:

```text
D → E
```

The branch changed from:

```text
main = D
```

to:

```text
main = E
```

That is the core behavior.

---

# 76. Essential Branch Commands

```cmd
git branch
git branch <name>
git branch -m <old> <new>
git branch -d <name>
git branch -D <name>

git switch <name>
git switch -c <name>

git branch --show-current
git branch -vv
git branch --merged
git branch --no-merged
git branch --contains <commit>
git branch --no-contains <commit>
```

---

# 77. Remote Branch Commands

```cmd
git fetch
git fetch --prune

git push -u origin <branch>
git push origin --delete <branch>

git branch -r
git branch -a
```

These commands allow you to inspect and manage local and remote-tracking references.

---

# 78. Branch Investigation Commands

```cmd
git log --graph --oneline --decorate --all

git log main..feature

git log feature..main

git log main...feature

git merge-base main feature

git diff main feature

git branch --contains <commit>

git branch --merged
git branch --no-merged
```

These are extremely useful for understanding branch topology.

---

# 79. Practical Advanced Workflow

A disciplined feature workflow:

```cmd
git switch main
git pull --ff-only

git switch -c feature/authentication

git status
git diff

git add <files>
git diff --cached

git commit -m "Add authentication"

git log --oneline --graph --decorate

git push -u origin feature/authentication
```

Then integrate through the project's chosen workflow.

---

# 80. Branch Troubleshooting Model

When branch behavior looks confusing, inspect:

```cmd
git status
git branch -vv
git log --graph --oneline --decorate --all
git remote -v
git reflog
```

Then determine:

```text
1. Where is HEAD?
2. What branch is checked out?
3. Which commit does the branch point to?
4. What is the upstream?
5. Where does the remote-tracking branch point?
6. Where did the branch previously point?
```

This resolves most branch-state problems.

---

# 81. The Complete Branch Model

```text
                         COMMIT GRAPH

                B ─── C ─── D
               /           ▲
              /            │
A ───────────┘            main
              \
               E ─── F
                    ▲
                    │
                  feature


REFERENCES

refs/heads/main
       │
       ▼
       D

refs/heads/feature
       │
       ▼
       F

HEAD
 │
 ▼
main
 │
 ▼
D
```

The branch references are simply pointers into the commit graph.

---

# 82. Final Mental Model

Remember these five rules:

```text
1. A branch is a movable reference to a commit.

2. Creating a branch does not copy the repository.

3. Creating a commit moves the current branch forward.

4. HEAD identifies the current checkout position.

5. Branch history is determined by commit ancestry,
   not by the branch name.
```

The deepest useful model is:

```text
                Commit Graph
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      main         feature      release
        │            │            │
        ▼            ▼            ▼
      Commit       Commit       Commit
```

Git branches are therefore best understood as **movable names attached to commits in a directed acyclic commit graph**.

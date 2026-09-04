# Git Branch

## 1. What Is a Git Branch?

A Git branch is a **movable reference to a commit**.

It does not represent:

```text
a copy of the repository
a copy of the working directory
a separate physical project
```

Instead, conceptually:

```text
branch → commit
```

Example:

```text
A ── B ── C
          ↑
        main
```

Here:

```text
main → C
```

`main` points to commit `C`.

---

# 2. Why Branches Are Used

Branches allow different development work to happen independently.

For example:

```text
main
 │
 ├── feature/login
 ├── feature/payment
 ├── feature/profile
 └── bugfix/session
```

You can develop a feature without modifying the main development line until the feature is ready.

Typical uses:

```text
feature development
bug fixes
experiments
refactoring
release preparation
hotfixes
```

---

# 3. The Branch Pointer Model

Consider:

```text
A ── B ── C
          ↑
         main
```

The branch does not contain commits `A`, `B`, and `C`.

Instead:

```text
main → C
```

Commit `C` contains a reference to its parent:

```text
C → B
B → A
```

Therefore, following the commit ancestry from `C` gives the history reachable from `main`.

---

# 4. Creating a Branch

Use:

```cmd
git branch <branch-name>
```

Example:

```cmd
git branch feature/login
```

This creates:

```text
feature/login
```

The important detail is that creating the branch **does not switch you to it**.

If you were on:

```text
main
```

you remain on:

```text
main
```

---

# 5. Verify Branches

List local branches:

```cmd
git branch
```

Example:

```text
* main
  feature/login
```

The `*` indicates the current branch.

Therefore:

```text
* main
```

means:

```text
HEAD → main
```

while:

```text
feature/login
```

is another local branch.

---

# 6. Creating a Branch at the Current Commit

Suppose:

```text
A ── B ── C
          ↑
         main
```

Run:

```cmd
git branch feature/login
```

Now:

```text
A ── B ── C
          ↑
     main
     feature/login
```

Both branches point to the same commit:

```text
main          → C
feature/login → C
```

No commit was created.

---

# 7. Branches Move When You Commit

Suppose:

```text
A ── B ── C
          ↑
     main
     feature/login
```

Switch to:

```text
feature/login
```

Then create a commit.

The result becomes:

```text
A ── B ── C ── D
          ↑     ↑
         main  feature/login
```

More precisely:

```text
main          → C
feature/login → D
```

The branch moved from `C` to `D`.

The old commit still exists.

---

# 8. Branch Creation Does Not Copy History

This:

```cmd
git branch feature/login
```

does not duplicate:

```text
A
B
C
```

Git creates another reference to the existing commit.

Conceptually:

```text
Before:

main → C


After:

main          → C
feature/login → C
```

This is why branch creation is cheap.

---

# 9. Branch Names

Branch names should communicate purpose.

Good examples:

```text
feature/login
feature/user-profile
feature/payment-api
bugfix/session-timeout
hotfix/security-patch
refactor/auth-service
docs/api-reference
test/payment-flow
```

Avoid meaningless names such as:

```text
test
abc
new
branch1
changes
temp123
```

A team should establish a consistent naming convention.

---

# 10. Slash in Branch Names

Git supports hierarchical-looking branch names:

```text
feature/login
feature/payment
bugfix/auth
release/v2.0.0
```

The slash does not create an actual directory containing branches.

It is part of the reference name.

Conceptually:

```text
refs/heads/feature/login
```

is the reference for:

```text
feature/login
```

---

# 11. Branch Names and References

Local branches are stored in Git's reference namespace.

Conceptually:

```text
refs/
└── heads/
    ├── main
    └── feature/
        └── login
```

Therefore:

```text
main
```

corresponds to:

```text
refs/heads/main
```

and:

```text
feature/login
```

corresponds to:

```text
refs/heads/feature/login
```

This becomes important when learning Git internals.

---

# 12. Inspect Branch References

Use:

```cmd
git show-ref
```

Example output may look similar to:

```text
abc123 refs/heads/main
def456 refs/heads/feature/login
```

The first value is the object ID.

The second value is the reference.

---

# 13. Branch Verbose Information

Use:

```cmd
git branch -v
```

Example:

```text
* main          abc1234 Add application setup
  feature/login def5678 Add login form
```

This shows:

```text
branch name
commit identifier
commit subject
```

---

# 14. Show More Branch Information

Use:

```cmd
git branch -vv
```

This includes upstream tracking information.

Example:

```text
* main          abc1234 [origin/main] Add application setup
  feature/login def5678 [origin/feature/login] Add login
```

This is particularly useful when working with remote repositories.

---

# 15. List Local Branches

```cmd
git branch
```

Only local branches are displayed.

Example:

```text
* main
  feature/login
  feature/payment
  bugfix/auth
```

---

# 16. List Remote-Tracking Branches

```cmd
git branch -r
```

Example:

```text
origin/main
origin/feature/login
origin/develop
```

These are **remote-tracking references**, not local branches.

For example:

```text
origin/main
```

represents your local knowledge of the remote repository's `main`.

---

# 17. List All Branches

```cmd
git branch -a
```

Example:

```text
* main
  feature/login
  remotes/origin/main
  remotes/origin/feature/login
```

This combines local and remote-tracking branches.

---

# 18. Branch Creation From Another Branch

Suppose:

```text
A ── B ── C ← main
```

Create:

```cmd
git branch feature/login main
```

This creates:

```text
A ── B ── C
          ↑
         main
         feature/login
```

The new branch starts at the specified commit reachable from `main`.

---

# 19. Branch Creation From a Commit

You can create a branch from a specific commit:

```cmd
git branch feature/login <commit>
```

Example:

```cmd
git branch feature/login abc1234
```

Now:

```text
feature/login → abc1234
```

This is useful when starting development from an earlier point in history.

---

# 20. Branch Creation From a Tag

A branch can also be created from a tag:

```cmd
git branch maintenance v1.0.0
```

Conceptually:

```text
v1.0.0
   ↓
commit C
   ↑
maintenance
```

The branch begins from the commit identified by the tag.

---

# 21. Branch Creation From a Remote-Tracking Branch

Example:

```cmd
git branch feature/login origin/feature/login
```

This creates a local branch at the same commit as:

```text
origin/feature/login
```

It does not automatically mean the local branch tracks that remote branch.

For tracking behavior, use an appropriate upstream configuration.

---

# 22. Current Branch

The simplest way to identify the current branch:

```cmd
git branch --show-current
```

Example:

```text
main
```

Another command:

```cmd
git status
```

may show:

```text
On branch main
```

---

# 23. Branch Tip

The commit a branch points to is its **tip**.

Example:

```text
A ── B ── C
          ↑
         main
```

`C` is the tip of `main`.

After a new commit:

```text
A ── B ── C ── D
               ↑
              main
```

`D` is now the tip.

---

# 24. Branch Movement

Branches normally move when new commits are created.

Before:

```text
main → C
```

After committing:

```text
main → D
```

The commit history becomes:

```text
A ── B ── C ── D
```

The branch is therefore a **movable pointer**, unlike a normal immutable commit object.

---

# 25. Branch Divergence

Suppose:

```text
A ── B ── C
          ↑
         main
```

Create a branch:

```text
feature → C
```

Then make a commit on `feature`:

```text
          D ← feature
         /
A ── B ── C ← main
```

Now the branches have different tips:

```text
main    → C
feature → D
```

This is branch divergence.

---

# 26. Independent Development

Once branches diverge:

```text
          D ── E ← feature
         /
A ── B ── C ── F ← main
```

the branches can continue independently.

The histories share:

```text
A
B
C
```

but then contain different commits.

Eventually they may be merged.

---

# 27. Branch Ancestry

For:

```text
A ── B ── C ── D
```

if:

```text
main → D
```

then:

```text
A
B
C
D
```

are reachable from `main`.

The relationship is:

```text
D → C → B → A
```

through parent references.

This ancestry model is fundamental to Git.

---

# 28. Determine Whether One Branch Contains Another

Use:

```cmd
git merge-base --is-ancestor main feature
```

If the command succeeds, `main` is an ancestor of `feature`.

Conceptually:

```text
A ── B ── C ── D
          ↑     ↑
         main  feature
```

Here:

```text
main
```

is an ancestor of:

```text
feature
```

because the commit pointed to by `main` is reachable from `feature`.

---

# 29. Finding the Merge Base

Use:

```cmd
git merge-base main feature
```

Suppose:

```text
          D ── E ← feature
         /
A ── B ── C ── F ← main
```

The common ancestor used as the merge base is:

```text
B
```

The merge base is important for three-way merges.

---

# 30. Comparing Branches

Commits unique to `feature`:

```cmd
git log main..feature
```

Commits unique to `main`:

```cmd
git log feature..main
```

Commits on either side:

```cmd
git log main...feature
```

For a more explicit left/right representation:

```cmd
git log --left-right main...feature
```

---

# 31. Branch Difference

Content comparison:

```cmd
git diff main..feature
```

History comparison:

```cmd
git log main..feature
```

These answer different questions.

```text
git diff
    What content is different?

git log
    What commits are different?
```

---

# 32. Deleting a Branch

After the work has been merged:

```cmd
git branch -d feature/login
```

The lowercase `-d` is a safe deletion.

Git checks whether the branch's commits are already integrated.

---

# 33. Force Deleting a Branch

```cmd
git branch -D feature/login
```

This forces deletion.

Use it carefully.

The branch reference is removed even if Git determines that commits may not have been merged.

The commits themselves may still be recoverable through other references or the reflog for some time.

---

# 34. Renaming a Branch

Rename the current branch:

```cmd
git branch -m new-name
```

Rename another branch:

```cmd
git branch -m old-name new-name
```

Force rename:

```cmd
git branch -M new-name
```

`-M` forces the rename if the destination name already exists.

---

# 35. `main` to Another Name

For example:

```cmd
git branch -m master main
```

This changes the local branch name.

However, renaming a branch on a remote repository involves additional steps involving:

```text
remote references
upstream configuration
default repository branch
collaborators
CI/CD configuration
```

A local rename alone does not rename the remote branch.

---

# 36. Branch Copying

Git can create another branch pointing at the same commit:

```cmd
git branch new-branch existing-branch
```

Conceptually:

```text
existing-branch ─┐
                 ├──→ C
new-branch ──────┘
```

No history is copied.

Both references point to the same commit.

---

# 37. Branch Force Reset

A branch can be moved to another commit with:

```cmd
git branch -f <branch> <commit>
```

Example:

```cmd
git branch -f feature/login HEAD~2
```

This moves:

```text
feature/login
```

to:

```text
HEAD~2
```

The commits are not necessarily deleted.

Only the branch reference is moved.

This is an advanced operation and should be used deliberately.

---

# 38. Branch vs Commit

A commit is an object:

```text
commit
 ↓
tree
 ↓
files
```

A branch is a reference:

```text
branch
   ↓
commit
```

Therefore:

```text
commit = history object
branch = movable reference
```

This distinction is one of the most important Git concepts.

---

# 39. Branch vs Working Tree

These are also different concepts.

```text
branch
   ↓
commit


working tree
   ↓
files currently present on disk
```

Changing branches can update the working tree to match the selected commit.

Therefore:

```text
branch ≠ working directory
```

---

# 40. Branch vs HEAD

A branch:

```text
main
```

is a reference.

`HEAD` identifies your current location.

Normally:

```text
HEAD
 ↓
main
 ↓
commit
```

After switching:

```text
HEAD
 ↓
feature/login
 ↓
commit
```

Therefore:

```text
HEAD ≠ branch
```

`HEAD` normally points to the current branch.

---

# 41. Branches and HEAD in `.git`

In a normal repository, `.git/HEAD` commonly contains a symbolic reference such as:

```text
ref: refs/heads/main
```

Conceptually:

```text
HEAD
 ↓
refs/heads/main
 ↓
commit
```

This means Git knows:

```text
current branch = main
```

The exact storage mechanism becomes important when learning Git internals.

---

# 42. Branch Reference Files

A simple local branch can conceptually correspond to:

```text
.git/refs/heads/main
```

The file contains the object ID of the commit the branch points to.

For example:

```text
.git/refs/heads/main
```

may contain:

```text
abc123...
```

meaning:

```text
main → abc123...
```

Packed references can change the physical storage mechanism, but the logical model remains the same.

---

# 43. Branches and Garbage Collection

Suppose:

```text
A ── B ── C
          ↑
         main
```

and you move the branch:

```text
main → B
```

Commit `C` may become unreachable from normal references.

However, it is not necessarily immediately deleted.

Git can retain unreachable objects temporarily.

Recovery may be possible through:

```cmd
git reflog
```

or:

```cmd
git fsck
```

This is why deleting or moving a branch does not mean the underlying commit immediately disappears.

---

# 44. Branch Reflog

A local branch can have reflog history.

Inspect it with:

```cmd
git reflog
```

or:

```cmd
git reflog show main
```

Example conceptually:

```text
C → D
D → E
E → F
```

The reflog records reference movements.

This is extremely useful when a branch was accidentally:

```text
reset
rebased
deleted
force-moved
```

---

# 45. Branch Tracking

A local branch may have an upstream branch:

```text
main
 ↓
origin/main
```

This relationship allows Git to determine default remote integration and push/pull behavior.

Inspect it using:

```cmd
git branch -vv
```

---

# 46. Creating a Tracking Branch

A common command:

```cmd
git switch -c feature/login --track origin/feature/login
```

This creates:

```text
feature/login
```

and configures it to track:

```text
origin/feature/login
```

The exact behavior can depend on repository configuration.

---

# 47. Branches and Remote Branches

Do not confuse:

```text
feature/login
```

with:

```text
origin/feature/login
```

The first is normally a local branch.

The second is a remote-tracking reference.

Conceptually:

```text
local:
refs/heads/feature/login

remote-tracking:
refs/remotes/origin/feature/login
```

They may point to the same commit, but they are separate references.

---

# 48. Branch Workflow Example

Create a feature branch:

```cmd
git switch -c feature/login
```

Check it:

```cmd
git branch
```

Work on files:

```cmd
git add .
git commit -m "Add login feature"
```

Inspect:

```cmd
git log --oneline --decorate --graph --all
```

The history may look like:

```text
* abc1234 (HEAD -> feature/login) Add login feature
* def5678 (main) Previous commit
```

The decoration shows where the references point.

---

# 49. Useful Branch Commands

### Create

```cmd
git branch <name>
```

### Create from another branch

```cmd
git branch <name> <start-point>
```

### Create and switch

```cmd
git switch -c <name>
```

### List

```cmd
git branch
```

### List remote branches

```cmd
git branch -r
```

### List everything

```cmd
git branch -a
```

### Show current branch

```cmd
git branch --show-current
```

### Detailed listing

```cmd
git branch -vv
```

### Rename

```cmd
git branch -m <old> <new>
```

### Delete safely

```cmd
git branch -d <name>
```

### Force delete

```cmd
git branch -D <name>
```

### Force-move branch

```cmd
git branch -f <name> <commit>
```

---

# 50. Important Options

## `-a`

```cmd
git branch -a
```

List local and remote-tracking branches.

---

## `-r`

```cmd
git branch -r
```

List remote-tracking branches.

---

## `-v`

```cmd
git branch -v
```

Show branch tips.

---

## `-vv`

```cmd
git branch -vv
```

Show branch tips and upstream information.

---

## `-d`

```cmd
git branch -d <name>
```

Safe branch deletion.

---

## `-D`

```cmd
git branch -D <name>
```

Force branch deletion.

---

## `-m`

```cmd
git branch -m <name>
```

Rename branch.

---

## `-M`

```cmd
git branch -M <name>
```

Force rename.

---

## `-f`

```cmd
git branch -f <name> <start-point>
```

Force-move an existing branch reference.

---

# 51. Advanced Branch Inspection

Show all references:

```cmd
git show-ref
```

Show local branch references:

```cmd
git for-each-ref refs/heads/
```

Show remote-tracking references:

```cmd
git for-each-ref refs/remotes/
```

Show branch decorations in history:

```cmd
git log --oneline --decorate --graph --all
```

Find the merge base:

```cmd
git merge-base main feature
```

Test ancestry:

```cmd
git merge-base --is-ancestor main feature
```

---

# 52. Branch Mental Model

The most important model is:

```text
                    HEAD
                     ↓
                  branch
                     ↓
                   commit
                     ↓
                  parent
                     ↓
                  parent
```

For example:

```text
HEAD
 ↓
feature/login
 ↓
D
 ↓
C
 ↓
B
 ↓
A
```

The branch is only the reference at the top.

The commits form the history.

---

# 53. Final Rules to Remember

```text
1. A branch is a movable reference.

2. A branch normally points to one commit.

3. Creating a branch does not create new commits.

4. Creating a branch does not copy the repository.

5. Multiple branches can point to the same commit.

6. A commit can be reachable from multiple branches.

7. Committing normally moves the current branch forward.

8. HEAD normally points to the current branch.

9. Local branches and remote-tracking branches are different references.

10. Deleting a branch deletes the reference, not necessarily the commits immediately.

11. Branch divergence creates independent histories.

12. Merge combines divergent histories.

13. Branch names are references, not directories.

14. refs/heads/ contains the logical namespace for local branches.

15. Understanding references is essential for advanced Git.
```

---

# 54. Practice Commands

Create a test branch:

```cmd
git switch -c practice/branch
```

Inspect:

```cmd
git branch -vv
```

Create a commit:

```cmd
git add .
git commit -m "Practice branch"
```

Inspect the graph:

```cmd
git log --oneline --decorate --graph --all
```

Find the current branch:

```cmd
git branch --show-current
```

Compare it with `main`:

```cmd
git log main..practice/branch
```

Find their merge base:

```cmd
git merge-base main practice/branch
```

After practice, switch away:

```cmd
git switch main
```

Delete the test branch if no longer needed:

```cmd
git branch -d practice/branch
```

---

# Key Concept

```text
BRANCH
   │
   └── movable reference
             │
             ↓
           COMMIT
             │
             ↓
          PARENT
             │
             ↓
          PARENT
```

If you understand this model, the later topics—

```text
checkout
switch
merge
merge conflicts
rebase
cherry-pick
reset
reflog
refs
detached HEAD
worktrees
```

—become much easier to understand.

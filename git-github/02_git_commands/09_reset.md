# `git reset`

`git reset` is an advanced Git command used to **move `HEAD` and/or change the staging area (index)**, and depending on the mode, also modify the working tree.

It is one of Git's most important commands for understanding:

```text
HEAD
Branches
Index / Staging Area
Working Tree
Commit history
Unstaging
Discarding commits
Rewriting local history
```

The most important concept is:

```text
git reset
    primarily moves HEAD / branch reference
    and changes the index

git reset --hard
    additionally changes the working tree
```

---

# 1. Basic Syntax

```cmd
git reset [options] [<commit>]
```

With paths:

```cmd
git reset [<commit>] -- <path>
```

Common forms:

```cmd
git reset
git reset HEAD
git reset <commit>
git reset --soft <commit>
git reset --mixed <commit>
git reset --hard <commit>
git reset HEAD -- <file>
```

---

# 2. The Three Git States

Git can be understood using:

```text
HEAD
 │
 ▼
Index
 │
 ▼
Working Tree
```

Where:

```text
HEAD
    Current commit

Index
    Staging area

Working Tree
    Files currently on disk
```

`git reset` can affect these layers differently depending on the mode.

---

# 3. The Three Main Reset Modes

The three modes you must understand are:

```cmd
git reset --soft <commit>
```

```cmd
git reset --mixed <commit>
```

```cmd
git reset --hard <commit>
```

Their effects:

```text
                    HEAD    INDEX    WORKTREE

--soft               ✓        ✗          ✗

--mixed              ✓        ✓          ✗

--hard               ✓        ✓          ✓
```

This table is the core of `git reset`.

---

# 4. `--soft`

```cmd
git reset --soft <commit>
```

Moves:

```text
HEAD
```

but leaves:

```text
Index
Working Tree
```

unchanged.

Therefore, changes between the old `HEAD` and the new `HEAD` become staged.

---

# 5. Example of `--soft`

Suppose history is:

```text
A ── B ── C (HEAD)
```

Run:

```cmd
git reset --soft B
```

History becomes:

```text
A ── B (HEAD)
```

But the content introduced by `C` remains staged.

Conceptually:

```text
HEAD
  ↓
B

Index
  ↓
content that was in C

Working Tree
  ↓
same content
```

---

# 6. Why Use `--soft`?

Common uses:

```text
combine commits
redo the last commit
change commit message/content
prepare previous commits for recommitting
reorganize local history
```

Example:

```cmd
git reset --soft HEAD~1
```

This removes the latest commit from the branch history while keeping its changes staged.

You can then create a new commit:

```cmd
git commit
```

---

# 7. `--mixed`

`--mixed` is the default reset mode.

```cmd
git reset --mixed <commit>
```

or simply:

```cmd
git reset <commit>
```

It moves:

```text
HEAD
```

and resets:

```text
Index
```

but leaves:

```text
Working Tree
```

unchanged.

---

# 8. Example of `--mixed`

History:

```text
A ── B ── C (HEAD)
```

Run:

```cmd
git reset HEAD~1
```

Result:

```text
A ── B (HEAD)
```

The changes introduced by `C` remain in the working tree, but they are no longer staged.

Conceptually:

```text
HEAD
  ↓
B

Index
  ↓
B

Working Tree
  ↓
content from C
```

Therefore:

```text
commit
   ↓
staged
   ↓
unstaged
```

---

# 9. Why Use `--mixed`?

Common uses:

```text
unstage changes
undo a local commit while keeping files
rebuild staging
split a commit
reorganize local commits
```

---

# 10. `--hard`

```cmd
git reset --hard <commit>
```

This changes:

```text
HEAD
Index
Working Tree
```

All three are aligned to the selected commit.

---

# 11. Example of `--hard`

Before:

```text
A ── B ── C (HEAD)
```

Run:

```cmd
git reset --hard B
```

After:

```text
A ── B (HEAD)
```

The working tree and index are also changed to match `B`.

Therefore, changes introduced by `C` disappear from the current branch state.

---

# 12. `--hard` Warning

This is destructive:

```cmd
git reset --hard <commit>
```

It can discard:

```text
staged changes
unstaged changes
local modifications
```

if they are not represented somewhere else.

Always inspect:

```cmd
git status
git diff
git diff --cached
```

before using it.

---

# 13. `HEAD`

`HEAD` represents the currently checked-out commit/reference.

Example:

```text
A ── B ── C
         ↑
        HEAD
```

If you run:

```cmd
git reset --soft B
```

then:

```text
A ── B
     ↑
    HEAD
```

The current branch reference moves with `HEAD`.

---

# 14. Resetting a Branch

Suppose:

```text
A ── B ── C
         ↑
       main
```

Run:

```cmd
git reset --hard B
```

Now:

```text
A ── B
     ↑
    main
```

The branch pointer moved backward.

The commit object `C` may still exist in the repository temporarily, but it is no longer reachable from `main`.

---

# 15. Reset Does Not Delete a Commit Immediately

Important Git concept:

```cmd
git reset --hard B
```

does not necessarily physically erase commit `C` immediately.

Instead:

```text
C
```

becomes unreachable from the branch.

Git's object database and reflog can often allow recovery before unreachable objects are eventually pruned.

---

# 16. Reflog and Reset Recovery

Inspect reference movements:

```cmd
git reflog
```

You may see:

```text
HEAD@{0}
HEAD@{1}
HEAD@{2}
```

If you accidentally reset:

```cmd
git reset --hard HEAD~3
```

you can often find the previous `HEAD` in the reflog.

Example:

```cmd
git reflog
```

Then:

```cmd
git reset --hard <old-head>
```

can recover the previous branch state.

---

# 17. Reflog Is Critical

The reflog records local reference movements such as:

```text
commit
reset
checkout/switch
merge
rebase
```

Example:

```cmd
git reflog
```

This is one of the most important recovery tools for advanced Git users.

---

# 18. Reset the Last Commit

To undo the last commit but keep changes staged:

```cmd
git reset --soft HEAD~1
```

To undo the last commit and unstage the changes:

```cmd
git reset HEAD~1
```

To undo the last commit and discard the changes:

```cmd
git reset --hard HEAD~1
```

The difference is entirely about the target states.

---

# 19. Comparison

```text
git reset --soft HEAD~1
    commit removed
    changes staged

git reset HEAD~1
    commit removed
    changes unstaged

git reset --hard HEAD~1
    commit removed
    changes discarded
```

---

# 20. Reset Multiple Commits

Suppose:

```text
A ── B ── C ── D ── E
                   ↑
                  HEAD
```

Run:

```cmd
git reset --soft HEAD~3
```

Result:

```text
A ── B
     ↑
    HEAD
```

The changes represented by:

```text
C
D
E
```

remain staged relative to the new `HEAD`.

---

# 21. Mixed Reset Multiple Commits

```cmd
git reset --mixed HEAD~3
```

Result:

```text
A ── B
     ↑
    HEAD
```

Changes from:

```text
C
D
E
```

remain in the working tree but are unstaged.

---

# 22. Hard Reset Multiple Commits

```cmd
git reset --hard HEAD~3
```

Result:

```text
A ── B
     ↑
    HEAD
```

The index and working tree are also aligned with `B`.

---

# 23. `HEAD~n`

You can refer to ancestors:

```cmd
git reset --soft HEAD~1
```

```cmd
git reset --soft HEAD~2
```

```cmd
git reset --soft HEAD~5
```

Conceptually:

```text
HEAD~1
    parent

HEAD~2
    parent's parent

HEAD~3
    three ancestors away
```

---

# 24. `HEAD^`

```cmd
git reset --soft HEAD^
```

Normally means:

```text
first parent of HEAD
```

For ordinary linear history:

```text
A ── B ── C
         ↑
        HEAD

HEAD^ = B
```

---

# 25. `HEAD^^`

```cmd
git reset --soft HEAD^^
```

means approximately:

```text
first parent of first parent
```

Equivalent to:

```cmd
git reset --soft HEAD~2
```

in ordinary linear history.

---

# 26. Reset to a Commit Hash

```cmd
git reset --mixed a1b2c3d
```

or:

```cmd
git reset --hard a1b2c3d
```

Git accepts abbreviated commit IDs when they uniquely identify a commit.

---

# 27. Reset to a Branch

```cmd
git reset --hard main
```

This makes the current branch's `HEAD` point to the same commit as `main`.

It does not switch you to `main`.

---

# 28. Reset to Remote-Tracking Branch

```cmd
git fetch
git reset --hard origin/main
```

This makes the current branch match the current local reference:

```text
origin/main
```

This is commonly used to discard local divergence.

Be extremely careful because local commits and working-tree changes can become difficult to recover.

---

# 29. Reset to a Tag

```cmd
git reset --hard v1.0.0
```

This moves the current branch to the commit referenced by the tag.

---

# 30. `git reset` Without a Commit

```cmd
git reset
```

is effectively:

```cmd
git reset --mixed HEAD
```

This resets the index to `HEAD` while leaving working-tree files alone.

Its common purpose is:

> Unstage everything.

---

# 31. Unstage One File

```cmd
git reset HEAD -- app.js
```

This resets the index entry for:

```text
app.js
```

to `HEAD`.

The working-tree modification remains.

Modern equivalent:

```cmd
git restore --staged app.js
```

---

# 32. Unstage Multiple Files

```cmd
git reset HEAD -- app.js server.js
```

---

# 33. Unstage a Directory

```cmd
git reset HEAD -- src\
```

---

# 34. Unstage Everything

```cmd
git reset
```

or:

```cmd
git reset HEAD
```

This leaves the working tree untouched but removes staged changes.

---

# 35. Reset Only the Index

The path-based form:

```cmd
git reset HEAD -- app.js
```

does not move the current branch to another commit.

It only changes the index for the specified path.

This is why:

```cmd
git reset HEAD -- file
```

is historically used for unstaging.

---

# 36. Path-Based Reset

General syntax:

```cmd
git reset [<commit>] -- <path>
```

Example:

```cmd
git reset HEAD -- src\app.js
```

This is fundamentally different from:

```cmd
git reset --hard HEAD~1
```

because the path form operates on selected paths rather than moving the branch to an earlier commit.

---

# 37. Why `--` Matters

Use:

```cmd
git reset HEAD -- app.js
```

The `--` separates:

```text
revision
```

from:

```text
path
```

This prevents ambiguity.

---

# 38. Interactive Reset

Git supports:

```cmd
git reset -p
```

or:

```cmd
git reset --patch
```

This allows selective changes to be removed from the staging area.

---

# 39. Interactive Reset Example

Suppose you staged:

```text
Change A
Change B
Change C
```

but only want:

```text
Change A
Change C
```

staged.

Run:

```cmd
git reset -p
```

Git presents hunks and allows you to selectively unstage them.

---

# 40. Patch Mode Choices

Typical choices include:

```text
y
n
q
a
d
s
e
?
```

Common meanings:

```text
y
    unstage this hunk

n
    keep this hunk staged

q
    quit

a
    unstage this and later hunks

d
    keep this and later hunks staged

s
    split the hunk

e
    manually edit the hunk

?
    help
```

---

# 41. Reset as Commit Squashing Tool

Suppose:

```text
A ── B ── C ── D
```

You want to combine:

```text
B
C
D
```

into one commit.

First:

```cmd
git reset --soft A
```

Now:

```text
A
↑
HEAD
```

while the changes from:

```text
B + C + D
```

are staged.

Then:

```cmd
git commit -m "Combined change"
```

Result:

```text
A ── E
```

where `E` contains the combined changes.

---

# 42. Rewrite the Last Commit

Suppose you committed:

```cmd
git commit -m "Initial feature"
```

but forgot a file.

You can stage the file:

```cmd
git add missing.js
```

Then:

```cmd
git commit --amend
```

Alternatively, reset can be used:

```cmd
git reset --soft HEAD~1
```

Then:

```cmd
git add missing.js
git commit
```

For simply modifying the latest commit, `--amend` is normally more direct.

---

# 43. Split One Commit Into Multiple Commits

Suppose one commit contains:

```text
authentication
logging
documentation
```

You can reset it while preserving the content:

```cmd
git reset HEAD~1
```

Now the changes are unstaged.

Then selectively stage:

```cmd
git add -p
```

Commit:

```cmd
git commit -m "Add authentication"
```

Then stage remaining changes:

```cmd
git add -p
```

Commit:

```cmd
git commit -m "Add logging and documentation"
```

This is an advanced history-cleaning workflow.

---

# 44. Reset Before Pushing

Reset is safest when rewriting:

```text
local history
```

that has not been shared.

Example:

```text
local:
A ── B ── C

remote:
A ── B
```

You can safely rewrite local history if no collaborators depend on `C`.

---

# 45. Reset After Pushing

Suppose:

```text
remote:
A ── B ── C

local:
A ── B ── C
```

You run:

```cmd
git reset --hard B
```

Now:

```text
local:
A ── B

remote:
A ── B ── C
```

A normal push will generally be rejected because the remote branch is ahead.

---

# 46. Force Push After Reset

You might see:

```cmd
git push --force
```

or preferably:

```cmd
git push --force-with-lease
```

However, rewriting shared history can disrupt other developers.

Prefer:

```cmd
git push --force-with-lease
```

over:

```cmd
git push --force
```

when force-pushing is actually necessary.

---

# 47. `--force-with-lease`

This protects against overwriting a remote update you have not seen.

Conceptually:

```text
your expected remote state
        ↓
compare with actual remote
        ↓
push only if expectation is still valid
```

This is safer than unconditional force pushing.

---

# 48. Reset and Public History

Rule:

```text
Local/private commits
    reset can be appropriate

Shared/public commits
    prefer revert
```

If a bad commit has already been shared, generally use:

```cmd
git revert <commit>
```

instead of rewriting the branch with reset.

---

# 49. Reset vs Revert

### Reset

```cmd
git reset <commit>
```

moves branch history.

Example:

```text
A ── B ── C
         ↓
reset to B

A ── B
```

### Revert

```cmd
git revert C
```

creates a new commit:

```text
A ── B ── C ── D
```

where `D` reverses the changes from `C`.

---

# 50. Reset vs Restore

### Reset

```cmd
git reset
```

primarily manipulates:

```text
HEAD
Index
```

depending on mode.

### Restore

```cmd
git restore
```

primarily manipulates:

```text
Working Tree
Index
```

without moving `HEAD`.

---

# 51. Reset vs Checkout

Old Git often used checkout for several unrelated purposes.

Modern Git separates:

```cmd
git switch
```

for branch switching.

```cmd
git restore
```

for restoring files.

```cmd
git reset
```

for moving/resetting branch/index state.

---

# 52. Reset Modes Complete Table

```text
Command                         HEAD    INDEX    WORKTREE

git reset --soft <commit>        ✓       —         —

git reset --mixed <commit>       ✓       ✓         —

git reset --hard <commit>        ✓       ✓         ✓

git reset <commit>               ✓       ✓         —

git reset HEAD -- file           —       ✓         —

git reset                        —       ✓         —
```

`—` means that particular state is not changed by the reset operation.

---

# 53. Practical Scenario: Undo Commit, Keep Work

Use:

```cmd
git reset --soft HEAD~1
```

Result:

```text
commit removed
changes staged
```

Best when you want to immediately recommit.

---

# 54. Practical Scenario: Undo Commit, Continue Editing

Use:

```cmd
git reset HEAD~1
```

Result:

```text
commit removed
changes unstaged
```

Now edit and selectively stage:

```cmd
git add -p
```

---

# 55. Practical Scenario: Completely Throw Away Local Commit

If the changes are definitely unwanted:

```cmd
git reset --hard HEAD~1
```

This removes the commit from the current branch and resets files to the previous commit.

---

# 56. Practical Scenario: Make Local Branch Match Remote

First:

```cmd
git fetch origin
```

Then, if you intentionally want to discard local divergence:

```cmd
git reset --hard origin/main
```

This makes the current branch match `origin/main`.

Before doing this, inspect:

```cmd
git log --oneline --decorate --graph --all
```

and:

```cmd
git status
```

---

# 57. Practical Scenario: Unstage Everything

```cmd
git reset
```

Equivalent conceptually to:

```cmd
git reset HEAD
```

Working-tree modifications remain.

---

# 58. Practical Scenario: Unstage One File

```cmd
git reset HEAD -- app.js
```

Modern equivalent:

```cmd
git restore --staged app.js
```

---

# 59. Practical Scenario: Keep Staged Work but Discard Commit

```cmd
git reset --soft HEAD~1
```

This is one of the cleanest ways to redo a commit.

---

# 60. Practical Scenario: Combine Last Three Commits

```cmd
git reset --soft HEAD~3
git commit -m "Combined feature"
```

Before:

```text
A ── B ── C ── D
```

After:

```text
A ── E
```

---

# 61. Practical Scenario: Split Last Commit

```cmd
git reset HEAD~1
```

Then:

```cmd
git add -p
git commit -m "Part one"
```

Then:

```cmd
git add -p
git commit -m "Part two"
```

---

# 62. Inspect Before Reset

Before any destructive reset:

```cmd
git status
```

Then:

```cmd
git log --oneline --decorate --graph -10
```

Then:

```cmd
git diff
```

Then:

```cmd
git diff --cached
```

This gives you a clear picture of:

```text
current commit
working-tree changes
staged changes
history
```

---

# 63. Create a Safety Reference

Before complicated history rewriting, you can create a temporary branch:

```cmd
git branch backup-before-reset
```

Then perform:

```cmd
git reset --hard HEAD~3
```

If something goes wrong, the backup branch still points to the previous commit.

This is a strong safety technique.

---

# 64. Safety Tag

For important history rewriting:

```cmd
git tag backup-before-reset
```

Then reset.

The tag keeps a reference to the old commit.

---

# 65. Reflog Safety Net

Another important tool:

```cmd
git reflog
```

Find the previous commit:

```text
HEAD@{1}
HEAD@{2}
```

Then inspect:

```cmd
git show HEAD@{1}
```

If it is the state you want:

```cmd
git reset --hard HEAD@{1}
```

---

# 66. Reset Does Not Mean Delete

This is an important mental correction.

```cmd
git reset
```

does not inherently mean:

> Delete commits.

Instead:

```text
reset
    move/reset references and/or index/worktree state
```

Whether commits become unreachable depends on what commit you reset to and what references remain.

---

# 67. Branch Pointer Model

Suppose:

```text
A ── B ── C
         ↑
       feature
```

Run:

```cmd
git reset --hard B
```

Now:

```text
A ── B
     ↑
   feature

C
```

`C` still exists as an object for some time.

It simply no longer has `feature` pointing to it.

---

# 68. Detached HEAD and Reset

If you are in detached HEAD:

```text
A ── B ── C
         ↑
        HEAD
```

but no branch points to `C`, running reset moves:

```text
HEAD
```

without necessarily moving a branch.

Example:

```cmd
git reset --hard B
```

The detached `HEAD` moves to `B`.

---

# 69. Reset During Merge

During an unfinished merge, reset can be used to abandon the merge in appropriate circumstances.

Historically:

```cmd
git reset --hard HEAD
```

can restore the working tree and index to `HEAD`.

Modern Git also provides:

```cmd
git merge --abort
```

which is usually clearer when the goal is specifically to abort a merge.

---

# 70. Reset During Rebase

During a rebase, prefer the dedicated command:

```cmd
git rebase --abort
```

rather than using reset blindly.

Reset can manipulate the underlying state, but dedicated abort commands communicate intent and handle operation-specific metadata.

---

# 71. Reset During Cherry-Pick

Similarly, if a cherry-pick is in progress:

```cmd
git cherry-pick --abort
```

is generally preferable to manually manipulating state with reset.

---

# 72. Reset and Merge Commits

Merge commits have multiple parents.

Suppose:

```text
      B
     / \
A ──    M
     \ /
      C
```

`HEAD^` normally refers to the first parent.

You can specify another parent explicitly:

```cmd
git reset --hard HEAD^2
```

This is advanced and should be used only when you understand the merge topology.

---

# 73. Parent Selection

For a merge commit:

```text
M
├── parent 1
└── parent 2
```

Then:

```text
M^1
    first parent

M^2
    second parent
```

For ordinary commits:

```text
HEAD^
```

usually means the previous commit.

---

# 74. Reset With Merge Parent

Example:

```cmd
git reset --hard HEAD^1
```

moves to the first parent.

Or:

```cmd
git reset --hard HEAD^2
```

moves to the second parent.

This can radically change branch state, so inspect the graph first:

```cmd
git log --graph --oneline --decorate
```

---

# 75. Reset and Commit Graph

Use:

```cmd
git log --graph --oneline --decorate --all
```

to understand where you are before resetting.

Example:

```text
*   91abcde Merge feature
|\
| * 72abcde Feature commit
|/
* 42abcde Main commit
```

This makes parent relationships visible.

---

# 76. Reset and `ORIG_HEAD`

Git can save a previous position in special references such as:

```text
ORIG_HEAD
```

After operations such as merges or other history-changing operations, `ORIG_HEAD` can sometimes provide a recovery point.

Inspect:

```cmd
git show ORIG_HEAD
```

If appropriate, you can use it as a reset target:

```cmd
git reset --hard ORIG_HEAD
```

Do not assume `ORIG_HEAD` always represents the state you want; inspect it first.

---

# 77. Reset and `HEAD@{n}`

Reflog expressions can be used as reset targets:

```cmd
git reset --hard HEAD@{1}
```

or:

```cmd
git reset --soft HEAD@{2}
```

This is powerful for recovery.

---

# 78. Reset With `--keep`

Git also supports:

```cmd
git reset --keep <commit>
```

This attempts to reset `HEAD` while preserving local working-tree changes that do not conflict with the target state.

It is safer than `--hard` in some situations because Git refuses the operation when local changes would be overwritten.

---

# 79. `--keep` Mental Model

```text
HEAD
    moves

Index
    reset toward target

Working Tree
    preserve compatible local changes
```

If preserving the local changes is impossible without overwriting them, the reset can fail instead of silently destroying them.

---

# 80. Reset With `--merge`

Another advanced mode:

```cmd
git reset --merge <commit>
```

It resets `HEAD` and updates the index while attempting to preserve working-tree changes.

It has historically been useful around merge-related states.

For modern workflows, dedicated commands such as:

```cmd
git merge --abort
```

are usually clearer when specifically aborting an operation.

---

# 81. `--keep` vs `--merge`

Conceptually:

```text
--hard
    aggressively align everything

--keep
    move toward target while preserving compatible local work

--merge
    reset while attempting to preserve local modifications
```

These advanced modes should be used only after understanding exactly what local state must survive.

---

# 82. Reset and File Modes

Git also supports reset options such as:

```cmd
git reset -N
```

or:

```cmd
git reset --intent-to-add
```

This can mark paths with intent-to-add behavior when resetting.

This is an advanced staging/index feature and is mainly useful in specialized workflows.

---

# 83. Reset and Intent-to-Add

The idea is:

```text
file exists in working tree
        ↓
Git knows you intend to add it
        ↓
status/diff can represent that intent
```

This is useful when preparing new files incrementally.

---

# 84. Reset in Automation

Avoid blindly using:

```cmd
git reset --hard
```

in scripts unless the repository state is intentionally disposable.

Safer automation should:

```text
verify repository
verify branch
verify expected commit
check status
then reset
```

For example:

```cmd
git status --porcelain
git rev-parse HEAD
git reset --hard <expected-commit>
```

---

# 85. Reset and CI/CD

In CI environments, a common pattern is to ensure the working tree matches a known revision:

```cmd
git fetch
git reset --hard origin/main
```

This is acceptable when the workspace is disposable and local changes are not valuable.

It is dangerous in a developer's working directory.

---

# 86. Reset and Untracked Files

Important:

```cmd
git reset --hard
```

does **not normally remove untracked files**.

Example:

```text
tracked modified file
    reset --hard removes modification

untracked file
    generally remains
```

To remove untracked files, Git provides:

```cmd
git clean
```

---

# 87. Reset + Clean

A completely clean disposable working tree may require:

```cmd
git reset --hard HEAD
git clean -fd
```

This is highly destructive.

Before using `git clean`, inspect with:

```cmd
git clean -nd
```

or:

```cmd
git clean -n
```

Never use this blindly.

---

# 88. Reset and `.gitignore`

Ignored files are generally not removed by:

```cmd
git clean -fd
```

To include ignored files:

```cmd
git clean -fdx
```

This can delete ignored build output, environment files, generated assets, and other data.

Extremely dangerous in a real development environment.

---

# 89. Reset Does Not Remove Untracked Files

This distinction is important:

```text
git reset --hard
    tracked files

git clean
    untracked files
```

Therefore:

```text
reset ≠ clean
```

---

# 90. Common Mistake

Wrong assumption:

```cmd
git reset --hard
```

means:

> Make the directory completely empty of all non-Git files.

Not true.

It resets tracked state.

Untracked files generally remain.

---

# 91. Safe Reset Workflow

Before reset:

```cmd
git status
```

Then:

```cmd
git log --oneline --decorate --graph --all -10
```

Then:

```cmd
git diff
```

Then:

```cmd
git diff --cached
```

Optional safety branch:

```cmd
git branch backup-before-reset
```

Then perform the reset.

---

# 92. Verify After Reset

Run:

```cmd
git status
```

Then:

```cmd
git log --oneline --decorate --graph -10
```

For a hard reset:

```cmd
git diff
```

should show no tracked working-tree changes if the tree matches the target.

---

# 93. Common Mistakes

### Mistake 1

Using:

```cmd
git reset --hard
```

when you only wanted to unstage.

Use:

```cmd
git reset
```

or:

```cmd
git restore --staged .
```

instead.

---

### Mistake 2

Using reset on shared history.

Prefer:

```cmd
git revert
```

for public commits.

---

### Mistake 3

Forgetting uncommitted changes.

Always inspect:

```cmd
git status
git diff
git diff --cached
```

---

### Mistake 4

Using the wrong ancestor.

Verify:

```cmd
git log --oneline --graph
```

before:

```cmd
git reset HEAD~N
```

---

# 94. Command Decision Table

```text
Want to unstage everything?
    git reset

Want to unstage one file?
    git reset HEAD -- file

Undo latest commit but keep changes staged?
    git reset --soft HEAD~1

Undo latest commit and unstage changes?
    git reset HEAD~1

Undo latest commit and discard tracked changes?
    git reset --hard HEAD~1

Move current branch to another commit?
    git reset <commit>

Make current branch match another branch?
    git reset --hard <branch>

Selectively unstage hunks?
    git reset -p

Recover after an accidental reset?
    git reflog
```

---

# 95. Reset Mode Decision Table

```text
Need                           Command

Move HEAD only                 git reset --soft <commit>

Move HEAD + reset index        git reset --mixed <commit>

Move HEAD + index + files      git reset --hard <commit>

Preserve compatible work       git reset --keep <commit>

Merge-oriented preservation    git reset --merge <commit>
```

---

# 96. Most Important Commands to Memorize

```cmd
git reset
```

```cmd
git reset HEAD -- file.txt
```

```cmd
git reset --soft HEAD~1
```

```cmd
git reset --mixed HEAD~1
```

```cmd
git reset --hard HEAD~1
```

```cmd
git reset --soft HEAD~3
```

```cmd
git reset --hard origin/main
```

```cmd
git reset -p
```

```cmd
git reflog
```

```cmd
git reset --hard HEAD@{1}
```

---

# 97. The Core Mental Model

Memorize this diagram:

```text
                    HEAD
                     │
                     ▼
                   INDEX
                     │
                     ▼
               WORKING TREE
```

### Soft

```text
git reset --soft <commit>

HEAD       ← changed
INDEX      ← unchanged
WORKTREE   ← unchanged
```

### Mixed

```text
git reset --mixed <commit>

HEAD       ← changed
INDEX      ← changed
WORKTREE   ← unchanged
```

### Hard

```text
git reset --hard <commit>

HEAD       ← changed
INDEX      ← changed
WORKTREE   ← changed
```

---

# 98. The Most Important Distinction

Think:

```text
--soft
    "Move the commit pointer, keep everything staged."

--mixed
    "Move the commit pointer, keep the work but unstage it."

--hard
    "Move the commit pointer and make files match it."
```

---

# 99. Reset and History Rewriting

`git reset` becomes particularly powerful when rewriting local history.

Typical workflow:

```cmd
git log --oneline
git reset --soft HEAD~3
git commit
```

This converts several local commits into a cleaner commit.

For collaborative branches, coordinate before rewriting history.

---

# 100. Final Rule

Before using `git reset`, ask three questions:

```text
1. Where should HEAD point?

2. Should the changes remain staged?

3. Should the working-tree changes remain?
```

Then choose:

```text
Keep staged:
    --soft

Keep files but unstage:
    --mixed

Discard tracked working-tree changes:
    --hard
```

The fundamental idea is:

> **`git reset` changes where your branch points and/or how the index and working tree align with that point.**

Once you understand:

```text
HEAD
INDEX
WORKING TREE
```

and the three modes:

```text
--soft
--mixed
--hard
```

you understand the core of `git reset`.

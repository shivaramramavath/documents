# Git Merge Conflicts

## 1. What Is a Merge Conflict?

A **merge conflict** occurs when Git cannot automatically combine changes from two histories.

Git can automatically merge many changes, but when two branches make incompatible changes to the same part of a file, Git needs you to decide what the final content should be.

Example:

```text
main:
A ── B ── C

feature:
     \
      D
```

If `C` and `D` modify the same lines differently, merging `feature` into `main` can produce a conflict.

---

# 2. Why Conflicts Happen

The most common situation is:

```text
main:
const port = 3000;

feature:
const port = 8080;
```

Both branches changed the same line from the same original version.

Git cannot know which value is correct.

Therefore:

```cmd
git switch main
git merge feature
```

may stop with:

```text
CONFLICT (content): Merge conflict in config.js
Automatic merge failed; fix conflicts and then commit the result.
```

---

# 3. Three-Way Merge

Git generally performs a three-way merge using:

```text
BASE
OURS
THEIRS
```

Example:

```text
             C ← main
            /
A ── B
            \
             D ← feature
```

Here:

```text
BASE   = B
OURS   = C
THEIRS = D
```

Git compares:

```text
B → C
```

and:

```text
B → D
```

and attempts to combine the changes.

---

# 4. Merge Base

The common ancestor used by the merge is called the **merge base**.

Example:

```text
        C ← main
       /
A ── B
       \
        D ← feature
```

The merge base is:

```text
B
```

You can inspect it:

```cmd
git merge-base main feature
```

---

# 5. Basic Conflict Scenario

Create a repository:

```cmd
mkdir merge-demo
cd merge-demo
git init
```

Create:

```text
app.js
```

with:

```js
const port = 3000;
console.log(`Server: ${port}`);
```

Commit:

```cmd
git add app.js
git commit -m "Initial server"
```

Create a branch:

```cmd
git switch -c feature
```

Change:

```js
const port = 8080;
```

Commit:

```cmd
git add app.js
git commit -m "Change feature port"
```

Switch back:

```cmd
git switch main
```

Change the same line differently:

```js
const port = 5000;
```

Commit:

```cmd
git add app.js
git commit -m "Change main port"
```

Now merge:

```cmd
git merge feature
```

Git can produce a conflict.

---

# 6. Conflict Markers

Git inserts conflict markers into the affected file.

Example:

```js
<<<<<<< HEAD
const port = 5000;
=======
const port = 8080;
>>>>>>> feature
```

These markers divide the competing versions.

---

# 7. Meaning of `<<<<<<< HEAD`

```text
<<<<<<< HEAD
```

marks the beginning of the current branch's version.

If you ran:

```cmd
git switch main
git merge feature
```

then:

```text
HEAD
```

represents:

```text
main
```

So:

```js
<<<<<<< HEAD
const port = 5000;
```

means the current `main` version is:

```js
const port = 5000;
```

---

# 8. Meaning of `=======`

```text
=======
```

separates the two competing versions.

Example:

```js
<<<<<<< HEAD
const port = 5000;
=======
const port = 8080;
>>>>>>> feature
```

The separator is between:

```text
ours
```

and:

```text
theirs
```

---

# 9. Meaning of `>>>>>>> feature`

```text
>>>>>>> feature
```

marks the end of the incoming branch's version.

Because we ran:

```cmd
git merge feature
```

the incoming branch is:

```text
feature
```

---

# 10. Conflict Marker Structure

The general structure is:

```text
<<<<<<< HEAD
OURS
=======
THEIRS
>>>>>>> branch-name
```

For:

```cmd
git switch main
git merge feature
```

this means:

```text
<<<<<<< HEAD
main version
=======
feature version
>>>>>>> feature
```

---

# 11. Resolving a Conflict

Suppose Git produces:

```js
<<<<<<< HEAD
const port = 5000;
=======
const port = 8080;
>>>>>>> feature
```

You must decide the correct final content.

For example:

```js
const port = 8080;
```

Then **remove all conflict markers**.

The final file must contain valid code.

---

# 12. Stage the Resolved File

After editing:

```cmd
git add app.js
```

This tells Git:

> The conflict in `app.js` has been resolved.

Check:

```cmd
git status
```

Git should no longer show that file as unmerged.

---

# 13. Complete the Merge

After resolving and staging all conflicts:

```cmd
git commit
```

or:

```cmd
git merge --continue
```

Git creates the merge commit.

---

# 14. Complete Conflict Workflow

The standard workflow is:

```cmd
git merge feature
```

Conflict:

```cmd
git status
```

Inspect files.

Edit the conflicted files.

Stage them:

```cmd
git add <file>
```

Verify:

```cmd
git status
```

Complete:

```cmd
git merge --continue
```

or:

```cmd
git commit
```

---

# 15. `git status` During a Conflict

Always use:

```cmd
git status
```

after a conflict.

It tells you:

```text
which files are conflicted
which files are resolved
whether a merge is in progress
what Git expects you to do next
```

Example:

```text
You have unmerged paths.

Unmerged paths:
  both modified:   app.js
```

---

# 16. Multiple Conflicts

A merge can conflict in multiple files.

Example:

```text
app.js
config.js
routes.js
database.js
```

Check:

```cmd
git status
```

Resolve each file.

Then:

```cmd
git add app.js
git add config.js
git add routes.js
git add database.js
```

Or:

```cmd
git add .
```

Be careful with `git add .` because it stages all eligible changes in the working tree, not only conflict resolutions.

---

# 17. Check for Unmerged Files

Use:

```cmd
git status
```

You can also inspect unmerged index entries:

```cmd
git ls-files -u
```

If output exists, Git still has unmerged paths.

After resolving and staging:

```cmd
git ls-files -u
```

should produce no output for those resolved paths.

---

# 18. Conflict Stages in the Index

During a conflict, the Git index can contain multiple stages.

Conceptually:

```text
stage 1 = BASE
stage 2 = OURS
stage 3 = THEIRS
```

Inspect them:

```cmd
git ls-files -u
```

This is useful for advanced conflict debugging.

---

# 19. Stage 1 — Base

Stage 1 represents the merge base:

```text
stage 1
   ↓
common ancestor
```

This is the version from before the branches diverged.

---

# 20. Stage 2 — Ours

Stage 2 represents:

```text
OURS
```

which is the current branch.

If you run:

```cmd
git switch main
git merge feature
```

then:

```text
stage 2 = main
```

---

# 21. Stage 3 — Theirs

Stage 3 represents:

```text
THEIRS
```

which is the incoming branch.

For:

```cmd
git merge feature
```

then:

```text
stage 3 = feature
```

---

# 22. Extract Conflict Versions

You can inspect specific stages with:

```cmd
git show :1:app.js
```

Base version:

```cmd
git show :1:app.js
```

Ours:

```cmd
git show :2:app.js
```

Theirs:

```cmd
git show :3:app.js
```

These commands are particularly useful when the working-tree conflict markers are not enough to understand what changed.

---

# 23. Conflict Resolution With Ours

For a conflicted file, you can choose the current branch's version:

```cmd
git checkout --ours app.js
```

Then:

```cmd
git add app.js
```

Modern Git also supports:

```cmd
git restore --ours app.js
git add app.js
```

This means:

```text
keep OUR version
```

It does not mean:

```text
merge intelligently
```

It simply selects that side for the path.

---

# 24. Conflict Resolution With Theirs

Choose the incoming branch's version:

```cmd
git checkout --theirs app.js
```

Then:

```cmd
git add app.js
```

Modern syntax:

```cmd
git restore --theirs app.js
git add app.js
```

This means:

```text
keep THEIRS version
```

---

# 25. Ours vs Theirs

If:

```cmd
git switch main
git merge feature
```

then:

```text
OURS   = main
THEIRS = feature
```

Therefore:

```cmd
git restore --ours app.js
```

keeps:

```text
main
```

while:

```cmd
git restore --theirs app.js
```

keeps:

```text
feature
```

This is one of the most important concepts in conflict resolution.

---

# 26. Do Not Blindly Use `ours`

Avoid resolving every conflict with:

```cmd
git restore --ours .
```

unless you intentionally want the current branch's versions.

You can accidentally discard valid incoming changes.

---

# 27. Do Not Blindly Use `theirs`

Likewise:

```cmd
git restore --theirs .
```

can discard valid changes from the current branch.

Conflict resolution should be based on the intended final state.

---

# 28. Manual Resolution

Manual resolution is usually the safest approach when both changes matter.

Example:

```text
ours:
const port = 5000;

theirs:
const port = 8080;
```

Instead of choosing one, perhaps the correct solution is:

```js
const port = process.env.PORT || 8080;
```

The resolver can create a third version containing the intended behavior.

This is the essence of conflict resolution:

```text
OURS + THEIRS
      ↓
INTENDED RESULT
```

---

# 29. Conflict Resolution Is Not Always Choosing One Side

A conflict does not necessarily mean:

```text
choose ours
OR
choose theirs
```

It can mean:

```text
understand both changes
        ↓
combine them
        ↓
produce a third correct version
```

Example:

```js
<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 10000;
>>>>>>> feature
```

The correct result might be:

```js
const timeout = Number(process.env.TIMEOUT || 10000);
```

---

# 30. Delete a Conflicted File

If the intended resolution is to remove the file:

```cmd
git rm app.js
```

This both removes the file and stages the deletion.

Then:

```cmd
git status
```

---

# 31. Keep a Deleted File

If one branch deleted a file and the other modified it, Git may report a conflict.

Suppose:

```text
main:
app.js exists

feature:
app.js deleted
```

You must decide.

Keep the file:

```cmd
git add app.js
```

after resolving its contents.

Delete it:

```cmd
git rm app.js
```

---

# 32. Modify/Delete Conflict

Example:

```text
main:
modified app.js

feature:
deleted app.js
```

Git cannot automatically determine whether:

```text
keep modified app.js
```

or:

```text
delete app.js
```

Resolve according to the desired final repository state.

---

# 33. Add/Add Conflict

Two branches may create a file with the same path independently.

Example:

```text
main:
creates config.js

feature:
creates config.js
```

If the contents differ, Git can report:

```text
CONFLICT (add/add)
```

You must decide what `config.js` should contain.

---

# 34. Rename/Delete Conflict

One branch may rename a file while another deletes it.

Example:

```text
main:
old.js → new.js

feature:
deletes old.js
```

Git needs you to determine whether:

```text
new.js
```

should remain.

---

# 35. Rename/Rename Conflict

Two branches may rename the same file differently.

Example:

```text
main:
app.js → server.js

feature:
app.js → application.js
```

Git cannot automatically decide which destination name is correct.

You must resolve the naming conflict.

---

# 36. Directory/File Conflict

A path can become a file on one branch and a directory on another.

Example:

```text
main:
config

feature:
config/
    database.js
```

The same path cannot simultaneously represent both a file and a directory.

Git may require manual resolution.

---

# 37. Binary File Conflicts

Text files can often be merged line-by-line.

Binary files generally cannot be merged that way.

Examples:

```text
image.png
database.db
compiled.bin
```

Git may report a binary conflict.

You normally select the desired version or regenerate the binary artifact.

---

# 38. Conflict Markers Are Not Git Metadata

These:

```text
<<<<<<<
=======
>>>>>>>
```

are inserted into the working-tree file.

They are not meant to remain in the final file.

If you commit them accidentally, you can introduce broken code.

Always inspect the resolved file.

---

# 39. Detect Remaining Conflict Markers

Before completing the merge, search your repository for:

```text
<<<<<<<
=======
>>>>>>>
```

In Windows CMD:

```cmd
findstr /S /N /C:"<<<<<<<" *.*
```

You can similarly search for:

```cmd
findstr /S /N /C:">>>>>>>" *.*
```

Be aware that these searches can inspect generated or binary files, so use them as a supplementary check rather than the only validation method.

---

# 40. `git diff` During Conflict

Run:

```cmd
git diff
```

This shows unresolved working-tree differences.

It is useful for understanding the conflict.

---

# 41. `git diff --cached`

After staging a resolution:

```cmd
git add app.js
```

inspect:

```cmd
git diff --cached
```

This shows what has been staged for the merge result.

Use both:

```cmd
git diff
git diff --cached
```

to distinguish unresolved working-tree changes from staged resolutions.

---

# 42. `git diff --ours`

During a conflict:

```cmd
git diff --ours
```

can show differences relative to the current branch's version.

---

# 43. `git diff --theirs`

Likewise:

```cmd
git diff --theirs
```

can show differences relative to the incoming branch's version.

These are useful for understanding complex conflicts.

---

# 44. `git diff --base`

You can inspect differences against the merge base:

```cmd
git diff --base
```

This is particularly useful when investigating exactly how the conflicted file differs from the common ancestor.

---

# 45. `git checkout --conflict`

Git can recreate conflict markers:

```cmd
git checkout --conflict=merge app.js
```

Available conflict styles can include:

```text
merge
diff3
zdiff3
```

---

# 46. `diff3` Conflict Style

The traditional conflict representation:

```text
<<<<<<< HEAD
ours
=======
theirs
>>>>>>> feature
```

shows two sides.

With `diff3`, Git can also show the base:

```text
<<<<<<< ours
ours
||||||| base
base
=======
theirs
>>>>>>> theirs
```

This gives you:

```text
OURS
BASE
THEIRS
```

which can make complicated conflicts easier to understand.

---

# 47. `zdiff3`

Modern Git can support:

```cmd
git checkout --conflict=zdiff3 app.js
```

`zdiff3` provides a more compact conflict representation while including the base version.

It can make certain conflicts easier to analyze.

---

# 48. Configure Conflict Style

You can configure the default conflict style:

```cmd
git config --global merge.conflictStyle diff3
```

or:

```cmd
git config --global merge.conflictStyle zdiff3
```

Then future conflicts can include the base automatically.

---

# 49. Abort the Merge

If the merge becomes too complicated:

```cmd
git merge --abort
```

This attempts to return the repository to its state before the merge started.

Use this when you want to abandon the merge entirely.

---

# 50. Verify After Abort

Run:

```cmd
git status
```

Then:

```cmd
git log --oneline --graph --decorate --all
```

Confirm that the repository is back in the expected state.

---

# 51. `git merge --quit`

Another command is:

```cmd
git merge --quit
```

This stops the merge operation's bookkeeping without performing the same restoration behavior as:

```cmd
git merge --abort
```

Use `--abort` when your goal is specifically to cancel and restore the merge.

---

# 52. Conflict Resolution With a GUI

Editors such as VS Code can display conflict actions such as:

```text
Accept Current Change
Accept Incoming Change
Accept Both Changes
Compare Changes
```

Conceptually:

```text
Current = OURS
Incoming = THEIRS
```

Do not click an option without understanding what it selects.

---

# 53. Accept Current Change

For:

```cmd
git switch main
git merge feature
```

"Accept Current Change" generally means:

```text
keep main
```

Equivalent conceptually to selecting:

```cmd
git restore --ours <file>
```

---

# 54. Accept Incoming Change

"Accept Incoming Change" generally means:

```text
keep feature
```

Equivalent conceptually to:

```cmd
git restore --theirs <file>
```

---

# 55. Accept Both Changes

This attempts to retain both sides in the file.

However, "both" does not necessarily mean the resulting code is logically correct.

You should still review the resulting code.

---

# 56. Merge Tools

Git supports external merge tools.

Inspect configuration:

```cmd
git config --get merge.tool
```

Launch the configured merge tool:

```cmd
git mergetool
```

Git may open a graphical or configured comparison interface.

---

# 57. Configure a Merge Tool

Git supports many external merge tools.

Example configuration:

```cmd
git config --global merge.tool <tool>
```

Then:

```cmd
git mergetool
```

The exact configuration depends on the tool being used.

---

# 58. `git mergetool`

During conflicts:

```cmd
git mergetool
```

can help compare:

```text
LOCAL
BASE
REMOTE
MERGED
```

After resolving, verify:

```cmd
git status
```

and stage the resolved file if necessary.

---

# 59. Rerere

Git has a feature called:

```text
rerere
```

meaning:

```text
reuse recorded resolution
```

Enable it:

```cmd
git config --global rerere.enabled true
```

Git can remember how you resolved certain conflicts and reuse that resolution when the same conflict occurs again.

---

# 60. Why Rerere Is Useful

Suppose you repeatedly merge:

```text
main
```

with:

```text
long-lived feature
```

and the same conflict repeatedly occurs.

Without rerere:

```text
conflict
 ↓
manual resolution
 ↓
repeat
```

With rerere:

```text
conflict
 ↓
Git recognizes previous resolution
 ↓
reuses resolution
```

You should still review the result.

---

# 61. Rerere Status

You can inspect recorded resolutions:

```cmd
git rerere status
```

Git can show paths for which rerere has recorded conflict resolutions.

---

# 62. Rerere Diff

Inspect the recorded resolution:

```cmd
git rerere diff
```

This can show the difference between the conflict and the recorded resolution.

---

# 63. Forget a Rerere Resolution

If Git recorded a bad resolution:

```cmd
git rerere forget <path>
```

This tells rerere to forget the recorded resolution for that path.

---

# 64. Reapply Rerere

Git can reuse a recorded resolution:

```cmd
git rerere
```

This can be useful when rerere is enabled and a previously seen conflict occurs again.

Always inspect the resulting files.

---

# 65. Conflict Resolution With Tests

Never assume:

```text
merge completed
```

means:

```text
application is correct
```

After resolving conflicts:

```cmd
git status
```

then run your project's:

```text
tests
lint
type checks
build
```

The exact commands depend on the project.

---

# 66. Conflict Resolution Is a Semantic Problem

Git understands:

```text
commits
trees
blobs
lines
paths
```

It does not understand your application's business requirements.

For example:

```js
timeout = 5000;
```

vs:

```js
timeout = 10000;
```

Git cannot know whether the correct business rule is:

```js
5000;
```

or:

```js
10000;
```

or:

```js
process.env.TIMEOUT;
```

That decision belongs to the developer.

---

# 67. Preventing Conflicts

Good branch practices can reduce conflicts.

Keep branches:

```text
small
focused
short-lived
```

Regularly synchronize long-running branches.

For example:

```cmd
git fetch origin
git merge origin/main
```

from your feature branch when appropriate.

---

# 68. Keep Commits Focused

Avoid mixing unrelated changes.

Bad:

```text
Add authentication
Format entire project
Rename 100 files
Update dependencies
Fix unrelated bug
```

Good:

```text
Add authentication
```

Focused commits make conflict analysis easier.

---

# 69. Avoid Unnecessary Formatting Changes

Suppose one branch changes:

```text
business logic
```

while another reformats the entire file.

Git may see hundreds of changed lines.

This dramatically increases conflict complexity.

Avoid large unrelated formatting changes during active feature development.

---

# 70. Synchronize Long-Lived Branches

A long-running branch:

```text
main:
A ── B ── C ── D ── E

feature:
     \
      F ── G ── H
```

can become increasingly difficult to merge.

Regularly integrating current `main` changes can reduce the final conflict size.

---

# 71. Conflict Prevention Strategy

A practical workflow:

```cmd
git switch feature
git fetch origin
git merge origin/main
```

Resolve conflicts early.

Run tests.

Continue development.

Then eventually:

```cmd
git switch main
git merge feature
```

This is a workflow choice; teams may instead use rebase or pull-request-based integration.

---

# 72. Never Treat Conflict Resolution as Mechanical

A dangerous mindset is:

```text
Conflict = choose ours/theirs
```

Better:

```text
Conflict
   ↓
Understand BASE
   ↓
Understand OURS
   ↓
Understand THEIRS
   ↓
Understand intended behavior
   ↓
Write correct final version
   ↓
Test
```

---

# 73. Conflict Resolution Decision Tree

```text
CONFLICT
   │
   ↓
What should the final state be?
   │
   ├── OURS only
   │      ↓
   │   restore --ours
   │
   ├── THEIRS only
   │      ↓
   │   restore --theirs
   │
   ├── BOTH
   │      ↓
   │   manually combine
   │
   └── DIFFERENT THIRD VERSION
          ↓
       manually implement
```

---

# 74. Full Conflict Example

Initial:

```text
A
```

Main:

```text
A ── B ← main
```

Feature:

```text
A ── C ← feature
```

Suppose:

```text
B:
const timeout = 5000;

C:
const timeout = 10000;
```

Merge:

```cmd
git switch main
git merge feature
```

Conflict:

```text
<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 10000;
>>>>>>> feature
```

Resolve:

```js
const timeout = 10000;
```

Stage:

```cmd
git add config.js
```

Continue:

```cmd
git merge --continue
```

Result:

```text
      B
     / \
A ───   M ← main
     \ /
      C
```

---

# 75. Verify the Result

After completing the merge:

```cmd
git status
```

Then:

```cmd
git log --oneline --graph --decorate --all
```

Inspect the merge commit:

```cmd
git show --stat HEAD
```

Inspect the final changes:

```cmd
git diff HEAD^1 HEAD
```

For a merge commit, `HEAD^1` refers to its first parent.

---

# 76. Inspect Both Merge Parents

For a merge commit:

```cmd
git rev-parse HEAD^1
git rev-parse HEAD^2
```

This gives the two parent commits.

You can inspect them:

```cmd
git show HEAD^1
git show HEAD^2
```

This is useful for advanced merge-history debugging.

---

# 77. First Parent After a Merge

After merging:

```cmd
git log --first-parent
```

shows the mainline history.

For example:

```text
A ── B ── M ── F
         / \
        C   D
```

First-parent history:

```text
A
B
M
F
```

This is useful when analyzing release history.

---

# 78. Merge Conflict vs Rebase Conflict

Merge conflict:

```cmd
git merge feature
```

means:

```text
you are combining histories
```

Rebase conflict:

```cmd
git rebase main
```

means:

```text
Git is replaying commits onto another base
```

Both can produce conflicts, but their state and continuation commands differ.

Merge:

```cmd
git merge --continue
```

Rebase:

```cmd
git rebase --continue
```

---

# 79. Merge Conflict vs Cherry-Pick Conflict

Cherry-pick can also conflict:

```cmd
git cherry-pick <commit>
```

If conflict occurs:

```cmd
git cherry-pick --continue
```

or:

```cmd
git cherry-pick --abort
```

Do not confuse these with merge commands.

---

# 80. Conflict Commands Reference

### Inspect state

```cmd
git status
```

### Inspect unresolved index

```cmd
git ls-files -u
```

### Inspect working-tree conflict

```cmd
git diff
```

### Inspect staged resolution

```cmd
git diff --cached
```

### Keep ours

```cmd
git restore --ours <file>
git add <file>
```

### Keep theirs

```cmd
git restore --theirs <file>
git add <file>
```

### Delete file

```cmd
git rm <file>
```

### Continue

```cmd
git merge --continue
```

### Abort

```cmd
git merge --abort
```

### Quit

```cmd
git merge --quit
```

### Merge tool

```cmd
git mergetool
```

---

# 81. Advanced Conflict Inspection

```cmd
git ls-files -u
```

```cmd
git show :1:<file>
```

```cmd
git show :2:<file>
```

```cmd
git show :3:<file>
```

```cmd
git diff --ours
```

```cmd
git diff --theirs
```

```cmd
git diff --base
```

These commands allow you to inspect the individual stages of a conflicted path instead of relying only on conflict markers.

---

# 82. Advanced Conflict Resolution Model

During a conflict:

```text
                 MERGE
                   │
                   ↓
             ┌───────────┐
             │  MERGE    │
             │   BASE    │
             └─────┬─────┘
                   │
          ┌────────┴────────┐
          ↓                 ↓
       OURS               THEIRS
          │                 │
          └────────┬────────┘
                   ↓
             RESOLUTION
                   │
                   ↓
              git add
                   │
                   ↓
             MERGE COMMIT
```

---

# 83. Important Distinction: Working Tree vs Index

During conflict resolution:

```text
WORKING TREE
    ↓
you edit the file

INDEX
    ↓
git add records the resolution

COMMIT
    ↓
git commit / git merge --continue
```

Therefore:

```cmd
git add file.js
```

is not merely "saving the file."

It tells Git:

> The current contents of this path represent my resolved version.

---

# 84. What `git add` Means During a Conflict

Before resolution:

```text
app.js
    ↓
unmerged
```

After editing:

```text
app.js
    ↓
resolved working tree
```

After:

```cmd
git add app.js
```

the index records:

```text
resolved version
```

Then:

```cmd
git merge --continue
```

can complete the merge.

---

# 85. Common Mistakes

### Mistake 1

Leaving conflict markers:

```text
<<<<<<<
=======
>>>>>>>
```

### Mistake 2

Using `--ours` everywhere.

### Mistake 3

Using `--theirs` everywhere.

### Mistake 4

Forgetting to stage resolved files.

### Mistake 5

Not running tests.

### Mistake 6

Continuing the wrong Git operation.

### Mistake 7

Resolving based only on syntax instead of application behavior.

---

# 86. Safe Conflict Resolution Procedure

Use this sequence:

```cmd
git status
git diff
```

Understand the conflict.

Inspect the base if necessary:

```cmd
git show :1:<file>
```

Inspect ours:

```cmd
git show :2:<file>
```

Inspect theirs:

```cmd
git show :3:<file>
```

Edit the final version.

Stage:

```cmd
git add <file>
```

Verify:

```cmd
git status
git diff --cached
```

Complete:

```cmd
git merge --continue
```

Run tests.

Inspect history:

```cmd
git log --oneline --graph --decorate --all
```

---

# 87. When to Abort

Abort when:

```text
you merged the wrong branch
you started the wrong merge
the merge is too complicated to resolve safely
you want to restart the operation
the branch state needs to be reconsidered
```

Use:

```cmd
git merge --abort
```

Then inspect:

```cmd
git status
```

---

# 88. Conflict Resolution Checklist

```text
[ ] Confirm which branch is current.
[ ] Identify the incoming branch.
[ ] Run git status.
[ ] Identify every conflicted file.
[ ] Understand BASE.
[ ] Understand OURS.
[ ] Understand THEIRS.
[ ] Decide the intended final state.
[ ] Remove conflict markers.
[ ] Stage every resolved path.
[ ] Verify git status.
[ ] Inspect git diff --cached.
[ ] Complete the merge.
[ ] Run tests.
[ ] Inspect the resulting history.
```

---

# 89. Core Mental Model

Remember:

```text
OURS
  ↓
current branch

THEIRS
  ↓
branch being merged

BASE
  ↓
common ancestor

CONFLICT
  ↓
Git cannot determine the correct result

RESOLUTION
  ↓
developer decides final state

git add
  ↓
record resolution in index

git merge --continue
  ↓
finish merge
```

---

# 90. Final Summary

A merge conflict is not a Git failure.

It means Git has encountered a situation where automatic integration is ambiguous.

The correct process is:

```cmd
git merge feature
```

↓

```cmd
git status
```

↓

inspect:

```cmd
git diff
```

↓

resolve the files

↓

```cmd
git add <resolved-file>
```

↓

verify:

```cmd
git diff --cached
git status
```

↓

complete:

```cmd
git merge --continue
```

↓

test

↓

inspect:

```cmd
git log --oneline --graph --decorate --all
```

The most important advanced concepts are:

```text
three-way merge
merge base
ours
theirs
index conflict stages
stage 1 / stage 2 / stage 3
conflict markers
manual resolution
git restore --ours
git restore --theirs
git ls-files -u
git diff --base
git diff --ours
git diff --theirs
diff3 / zdiff3
rerere
merge --abort
merge --continue
```

**The objective of conflict resolution is not to make Git stop complaining. The objective is to produce the correct final repository state.**

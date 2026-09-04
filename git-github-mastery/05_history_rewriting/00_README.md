# Git History Rewriting

## 1. What Is History Rewriting?

Git history rewriting means **changing the existing commit history** by creating different commits, changing commit relationships, moving branch references, or removing commits from a branch's visible history.

Common history-rewriting commands:

```cmd
git commit --amend
git reset
git rebase
git rebase -i
git cherry-pick
```

Recovery and investigation:

```cmd
git reflog
```

---

## 2. Why Does History Rewriting Change Commit IDs?

A Git commit is identified by a hash derived from information including:

```text
commit
├── tree
├── parent commit(s)
├── author
├── committer
├── timestamp
└── commit message
```

If important commit data changes, the resulting commit has a different ID.

For example:

```text
Before:

A ── B ── C
```

After rewriting `B`:

```text
A ── B' ── C'
```

`B'` is a different commit from `B`.

Because `C` pointed to `B`, changing `B` also requires creating a new descendant commit.

---

## 3. Rewriting vs Moving a Branch

These are different concepts.

### Moving a branch reference

```text
git reset --hard HEAD~1
```

can move:

```text
main
 ↓
C
```

to:

```text
main
 ↓
B
```

The existing commits may still exist in the object database.

### Rewriting commits

```text
git rebase
```

can create completely new commits with new parent relationships.

---

## 4. Main History-Rewriting Operations

### Amend

Modify the most recent commit:

```cmd
git commit --amend
```

Typical uses:

```text
fix the previous commit message
add a forgotten file
modify the previous commit
```

---

### Reset

Move a branch reference to another commit:

```cmd
git reset <commit>
```

Different modes control what happens to:

```text
HEAD
index
working tree
```

The major modes are:

```cmd
git reset --soft
git reset --mixed
git reset --hard
```

---

### Rebase

Reapply commits onto another base:

```cmd
git rebase main
```

Conceptually:

```text
Before:

      D ── E
     /
A ── B ── C
```

After rebasing onto `C`:

```text
A ── B ── C ── D' ── E'
```

The commits `D'` and `E'` are new commits.

---

### Interactive Rebase

```cmd
git rebase -i HEAD~5
```

Interactive rebase allows you to manipulate a sequence of commits.

Common operations:

```text
pick
reword
edit
squash
fixup
drop
exec
break
```

It is commonly used to clean up local history before publishing it.

---

### Cherry-Pick

```cmd
git cherry-pick <commit>
```

Copies the changes introduced by a commit and creates a new commit on the current branch.

```text
source:

A ── B ── C
          ↑
        commit

target:

A ── D
     ↑
   new commit
```

`D` is not the original `C`.

---

### Reflog

```cmd
git reflog
```

Records movements of references such as:

```text
HEAD
branch references
```

It is one of the most important recovery mechanisms after accidental:

```text
reset
rebase
checkout/switch
commit amendment
branch movement
```

---

# 5. The Three Areas Matter

History rewriting becomes much easier to understand when you distinguish:

```text
Working tree
     │
     ↓
Index / staging area
     │
     ↓
Commit history
```

For example:

```cmd
git reset --soft HEAD~1
```

moves the branch back one commit while keeping the changes staged.

```cmd
git reset --mixed HEAD~1
```

moves the branch back and leaves the changes unstaged in the working tree.

```cmd
git reset --hard HEAD~1
```

moves the branch back and updates both the index and working tree.

---

# 6. Private vs Public History

The most important practical rule:

```text
LOCAL / PRIVATE HISTORY
        ↓
rewriting is generally safe

SHARED / PUBLIC HISTORY
        ↓
rewriting can disrupt other developers
```

Suppose others already have:

```text
A ── B ── C
```

and you rewrite it into:

```text
A ── B' ── C'
```

Other developers still have:

```text
A ── B ── C
```

The histories have diverged.

This can make synchronization more complicated.

---

# 7. Force Push After Rewriting

If you rewrite a branch that has already been pushed, a normal push may be rejected.

You may need:

```cmd
git push --force-with-lease
```

Prefer:

```cmd
git push --force-with-lease
```

over:

```cmd
git push --force
```

`--force-with-lease` provides protection against overwriting remote work that you were not expecting.

However, even `--force-with-lease` should be used carefully on shared branches.

---

# 8. Why `reflog` Is Important

Suppose:

```text
A ── B ── C
         ↑
        main
```

You accidentally run:

```cmd
git reset --hard HEAD~1
```

Now:

```text
A ── B
     ↑
    main

C
```

The branch no longer points to `C`.

But the previous `HEAD` position can usually be found through:

```cmd
git reflog
```

Then you can recover it:

```cmd
git reset --hard <commit>
```

This is why understanding history rewriting should always include understanding reflog.

---

# 9. Safe Investigation Before Rewriting

Before rewriting history:

```cmd
git status
```

Inspect branches:

```cmd
git branch -vv
```

Inspect the graph:

```cmd
git log --graph --oneline --decorate --all
```

Inspect recent reference movements:

```cmd
git reflog
```

Check whether the branch has an upstream:

```cmd
git rev-parse --abbrev-ref --symbolic-full-name @{upstream}
```

If the branch is shared, determine whether rewriting it is acceptable.

---

# 10. Recommended Learning Order

Study this directory in this order:

```text
01_amend.md
     ↓
02_reset-modes.md
     ↓
03_rebase.md
     ↓
04_interactive-rebase.md
     ↓
05_cherry-pick.md
     ↓
06_reflog.md
```

### `01_amend.md`

Learn:

```text
commit --amend
message correction
forgotten files
author/committer metadata
amending pushed commits
```

### `02_reset-modes.md`

Learn:

```text
--soft
--mixed
--hard
HEAD movement
index movement
working-tree movement
```

### `03_rebase.md`

Learn:

```text
rebase mechanics
rebase onto another branch
rebase --onto
rebase --continue
rebase --skip
rebase --abort
```

### `04_interactive-rebase.md`

Learn:

```text
pick
reword
edit
squash
fixup
drop
exec
autosquash
```

### `05_cherry-pick.md`

Learn:

```text
single commit
multiple commits
commit ranges
conflicts
--continue
--abort
--skip
```

### `06_reflog.md`

Learn:

```text
HEAD reflog
branch reflog
recovery
dangling commits
expired reflog entries
```

---

# 11. Core Mental Model

Think of Git history as a graph:

```text
             D ── E
            /
A ── B ── C
```

A branch is simply a reference pointing to a commit:

```text
main
 ↓
E
```

History rewriting can:

```text
1. Move the reference
2. Create replacement commits
3. Change parent relationships
4. Change commit messages
5. Combine commits
6. Remove commits from a branch's reachable history
7. Reapply commits onto a different base
```

Therefore, history rewriting is fundamentally about **changing references and/or creating a different commit graph**.

---

# 12. Critical Safety Rules

```text
1. Understand the commit graph before rewriting it.

2. Check git status first.

3. Use git log --graph --oneline --decorate --all
   before complicated operations.

4. Use reflog when recovering from mistakes.

5. Avoid rewriting shared history unless the team explicitly allows it.

6. Prefer --force-with-lease over --force when a force push is necessary.

7. Never use git reset --hard casually when uncommitted work matters.

8. Understand soft, mixed, and hard reset before using reset.

9. Understand that rebased commits receive new commit IDs.

10. Remember that descendants of rewritten commits also become new commits.

11. Use interactive rebase primarily to clean up appropriate history,
    especially before publishing.

12. Verify the resulting graph after a rewrite.
```

---

# 13. Commands to Keep in Memory

```cmd
git commit --amend
```

```cmd
git reset --soft HEAD~1
```

```cmd
git reset HEAD~1
```

```cmd
git reset --hard HEAD~1
```

```cmd
git rebase main
```

```cmd
git rebase -i HEAD~5
```

```cmd
git rebase --continue
```

```cmd
git rebase --abort
```

```cmd
git cherry-pick <commit>
```

```cmd
git reflog
```

```cmd
git push --force-with-lease
```

---

# 14. Final Concept

The essential distinction is:

```text
NORMAL HISTORY

A ── B ── C ── D
             ↑
            main


REWRITTEN HISTORY

A ── B ── C' ── D'
             ↑
            main
```

The rewritten commits are different objects.

Therefore:

```text
same changes ≠ same commits
```

Two commits can produce identical file contents while still having different commit IDs because their metadata and/or parent history differs.

Mastering history rewriting means mastering:

```text
references
+
commit graph
+
HEAD
+
index
+
working tree
+
commit identity
+
reflog
```

These concepts form the foundation for advanced Git recovery, rebasing, history cleanup, and repository maintenance.

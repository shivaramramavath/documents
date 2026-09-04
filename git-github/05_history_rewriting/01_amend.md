# Git Commit Amend

## 1. What Is `git commit --amend`?

`git commit --amend` modifies the **most recent commit** instead of creating a new commit.

Basic command:

```cmd
git commit --amend
```

It can be used to:

* change the latest commit message
* add forgotten files
* remove files from the latest commit
* modify the latest commit's contents
* change author information
* correct the latest commit before publishing it

---

# 2. Normal Commit Flow

Suppose your history is:

```text
A ── B ── C
         ↑
        HEAD
```

You realize that `C` has a mistake.

If you create another commit:

```text
A ── B ── C ── D
```

you now have an additional commit.

With amend:

```text
A ── B ── C'
         ↑
        HEAD
```

Git replaces the previous tip commit with a new commit.

`C'` is a **new commit object**.

---

# 3. Basic Syntax

```cmd
git commit --amend
```

Git opens the configured editor containing the current commit message.

You can modify the message and save it.

---

# 4. Amend Only the Commit Message

If the latest commit is:

```text
A ── B ── C
```

and you only want to change its message:

```cmd
git commit --amend
```

Edit the message.

Or use:

```cmd
git commit --amend -m "Correct commit message"
```

Example:

```cmd
git commit -m "Add user authentication"
```

Later:

```cmd
git commit --amend -m "Add JWT authentication"
```

The commit message changes.

---

# 5. Amend Without Changing the Message

Suppose you forgot a file.

First stage it:

```cmd
git add forgotten-file.js
```

Then:

```cmd
git commit --amend --no-edit
```

`--no-edit` tells Git:

```text
Keep the existing commit message.
```

So:

```cmd
git commit --amend --no-edit
```

is commonly used when you want to modify the commit contents without changing its message.

---

# 6. Forgotten File Example

Suppose you committed:

```text
src/
├── app.js
└── server.js
```

but forgot:

```text
src/config.js
```

Current history:

```text
A ── B
     ↑
    HEAD
```

Stage the forgotten file:

```cmd
git add src/config.js
```

Amend:

```cmd
git commit --amend --no-edit
```

Result:

```text
A ── B'
     ↑
    HEAD
```

The latest commit now contains the additional file.

---

# 7. Amend Multiple Files

You can stage multiple changes:

```cmd
git add file1.js
git add file2.js
git add file3.js
```

Then:

```cmd
git commit --amend --no-edit
```

Or:

```cmd
git add .
git commit --amend --no-edit
```

Be careful with:

```cmd
git add .
```

because it stages all applicable changes under the current directory.

---

# 8. Amend With Interactive Staging

You can selectively stage changes:

```cmd
git add -p
```

Then amend:

```cmd
git commit --amend --no-edit
```

This allows you to choose individual hunks rather than staging an entire file.

Useful when only part of a file belongs in the previous commit.

---

# 9. Amend and Change the Message

You can do both:

```cmd
git add .
git commit --amend -m "Improve authentication flow"
```

This:

1. stages your selected changes
2. replaces the previous commit
3. creates a new commit
4. uses the new commit message

---

# 10. Amend With No Staged Changes

If you run:

```cmd
git commit --amend
```

without staged changes, Git can still create a replacement commit if commit metadata or the message changes.

For example:

```cmd
git commit --amend -m "Correct message"
```

changes the commit message.

---

# 11. Amend Changes the Commit ID

This is critical.

Before:

```text
A ── B
```

Commit `B` has some ID:

```text
B = abc123...
```

After amendment:

```text
A ── B'
```

The new commit may be:

```text
B' = def456...
```

The old and new commits are different objects.

Therefore:

```text
B ≠ B'
```

even if their file contents are almost identical.

---

# 12. Why the Hash Changes

A Git commit contains information such as:

```text
tree
parent
author
committer
commit message
```

Changing the message changes the commit object.

Adding a file changes the tree referenced by the commit.

Changing the parent changes the commit.

Therefore the commit ID changes.

Conceptually:

```text
Old:

tree ─────┐
parent ───┤
author ───┤
message ──┤
           ↓
        hash B


New:

tree' ────┐
parent ───┤
author ───┤
message' ─┤
           ↓
        hash B'
```

---

# 13. Descendant Commits Also Change

This is extremely important.

Suppose:

```text
A ── B ── C ── D
```

You amend `B`.

Git cannot simply modify `B`, because `C` contains `B` as its parent.

Therefore:

```text
A ── B' ── C' ── D'
```

The descendants must be recreated.

So changing an earlier commit is more expensive than changing only the tip.

This is one reason interactive rebase exists.

---

# 14. Amend Is a History-Rewriting Operation

`git commit --amend` is technically history rewriting.

Before:

```text
A ── B
```

After:

```text
A ── B'
```

The original `B` is no longer the branch tip.

This is usually safe when the commit has not been shared.

---

# 15. Amend a Local Commit

Recommended workflow:

```cmd
git status
git log --oneline -5
```

Make your changes.

Stage them:

```cmd
git add .
```

Amend:

```cmd
git commit --amend --no-edit
```

Verify:

```cmd
git log --oneline -5
```

---

# 16. Verify the Commit

Inspect the latest commit:

```cmd
git show HEAD
```

Show only the summary:

```cmd
git show --stat HEAD
```

Show the commit message:

```cmd
git log -1
```

Show the commit ID:

```cmd
git rev-parse HEAD
```

---

# 17. Amend Author Information

Git allows author information to be explicitly changed.

Example:

```cmd
git commit --amend --author="John Doe <john@example.com>"
```

This creates a replacement commit with the specified author.

The committer information is separate from the author information.

---

# 18. Author vs Committer

A Git commit can contain:

```text
Author
Committer
```

### Author

The person who originally wrote the changes.

### Committer

The person who created the current commit object.

When you amend someone else's commit, the author can remain unchanged while you become the new committer.

This distinction becomes important in advanced Git workflows.

---

# 19. Preserve Author While Amending

Normally:

```cmd
git commit --amend
```

does not mean:

```text
replace the original author with yourself
```

The original author information can remain while the committer information reflects the amendment.

Inspect with:

```cmd
git show --format=fuller HEAD
```

---

# 20. Change Both Author and Message

Example:

```cmd
git commit --amend --author="John Doe <john@example.com>" -m "Improve authentication"
```

This creates a replacement commit with:

```text
new author
new commit message
new commit ID
```

---

# 21. Amend a Published Commit

Suppose:

```text
local:
A ── B

remote:
A ── B
```

You amend `B`:

```text
local:
A ── B'
```

while the remote still has:

```text
remote:
A ── B
```

Now the histories differ.

A normal:

```cmd
git push
```

may be rejected.

---

# 22. Force Push After Amend

If you intentionally amended a commit that was already pushed, you may need:

```cmd
git push --force-with-lease
```

Do **not** treat this as a routine operation on shared branches.

The safer principle is:

```text
unpublished commit
    → amend freely

published private branch
    → amend carefully

shared branch
    → avoid rewriting unless explicitly coordinated
```

---

# 23. Why `--force-with-lease`?

Compare:

```cmd
git push --force
```

with:

```cmd
git push --force-with-lease
```

`--force` can overwrite the remote branch regardless of whether someone else has pushed changes.

`--force-with-lease` performs a safety check based on your expected remote state.

Therefore, when rewriting a published branch is intentional:

```cmd
git push --force-with-lease
```

is generally preferable.

---

# 24. Amend vs New Commit

Suppose you have:

```text
A ── B
```

and discover a typo.

### New commit

```cmd
git add .
git commit -m "Fix typo"
```

Result:

```text
A ── B ── C
```

### Amend

```cmd
git add .
git commit --amend --no-edit
```

Result:

```text
A ── B'
```

Use amend when the correction logically belongs to the previous commit.

Use a new commit when the correction should remain independently visible.

---

# 25. Amend vs Reset

These commands solve different problems.

### Amend

```cmd
git commit --amend
```

modifies the **latest commit**.

### Reset

```cmd
git reset <commit>
```

moves a branch reference.

Conceptually:

```text
amend:

A ── B
     ↓
A ── B'


reset:

A ── B ── C
         ↑
        main

A ── B
     ↑
    main
```

---

# 26. Amend vs Rebase

`amend` operates primarily on:

```text
latest commit
```

Rebase can rewrite:

```text
multiple commits
```

Example:

```text
A ── B ── C ── D
```

Amend:

```text
A ── B ── C ── D'
```

Interactive rebase:

```cmd
git rebase -i HEAD~4
```

can modify:

```text
B
C
D
```

and potentially reorder, combine, edit, or remove them.

---

# 27. Amend and the Index

The staging area controls what gets included in the amended commit.

Suppose the latest commit contains:

```text
A.js
B.js
```

You modify:

```text
A.js
B.js
C.js
```

If you run:

```cmd
git add A.js
```

then:

```cmd
git commit --amend --no-edit
```

only the staged `A.js` changes are incorporated into the amended commit.

Unstaged changes remain in the working tree.

This makes the index extremely important when using amend.

---

# 28. Partial Amend

Example:

```cmd
git add -p
```

Choose only the relevant changes.

Then:

```cmd
git commit --amend --no-edit
```

Result:

```text
previous commit
       +
selected staged changes
       ↓
replacement commit
```

Unselected changes remain outside the amended commit.

---

# 29. Amend and `HEAD`

The command:

```cmd
git commit --amend
```

operates on:

```text
HEAD
```

More precisely, it replaces the current branch's tip commit.

If:

```text
main → C
```

then:

```cmd
git commit --amend
```

amends `C`.

It does not directly amend an arbitrary historical commit.

For an older commit, use interactive rebase.

---

# 30. Amend After a Merge Commit

The current `HEAD` can also be a merge commit.

You can amend the latest merge commit with:

```cmd
git commit --amend
```

However, modifying merge commits can have more complex implications because a merge commit has multiple parents.

Inspect it with:

```cmd
git show --summary HEAD
```

and:

```cmd
git log --graph --oneline --decorate --all
```

Before modifying complicated merge history, understand the resulting graph.

---

# 31. Amend During a Rebase

During an interactive rebase, Git can stop at a commit:

```text
edit <commit>
```

At that point, you can modify files:

```cmd
git add .
```

then:

```cmd
git commit --amend
```

Afterward:

```cmd
git rebase --continue
```

This is one of the most important advanced uses of amend.

Conceptually:

```text
interactive rebase
       ↓
stop at commit
       ↓
modify files
       ↓
git add
       ↓
git commit --amend
       ↓
git rebase --continue
```

---

# 32. Amend With `--no-edit`

The most common cleanup pattern is:

```cmd
git add .
git commit --amend --no-edit
```

Meaning:

```text
take staged changes
+
replace current HEAD commit
+
keep existing message
```

---

# 33. Amend With `-m`

```cmd
git commit --amend -m "New message"
```

Meaning:

```text
take staged changes
+
replace current HEAD commit
+
use new message
```

---

# 34. Amend With an Editor

```cmd
git commit --amend
```

Git opens your configured commit-message editor.

You can:

```text
modify message
remove message
rewrite message
```

Then save and close the editor.

---

# 35. Empty Amend

Git normally prevents creating an amended commit when there is no effective change to commit unless the metadata/message is changed.

You can explicitly allow an empty replacement commit with:

```cmd
git commit --amend --allow-empty
```

This can be useful for special workflows, but should not be used casually.

---

# 36. Amend With Empty Commit

Example:

```cmd
git commit --allow-empty -m "Trigger deployment"
```

Later:

```cmd
git commit --amend --allow-empty -m "Trigger production deployment"
```

This replaces the empty commit with another empty commit having the new message.

---

# 37. Inspect Before and After

Before:

```cmd
git rev-parse HEAD
```

Then amend:

```cmd
git commit --amend --no-edit
```

After:

```cmd
git rev-parse HEAD
```

The result can be different:

```text
Before:
abc123...

After:
def456...
```

This demonstrates that the commit was replaced.

---

# 38. Recover the Previous Commit With Reflog

Suppose:

```text
Before:
A ── B
     ↑
    HEAD
```

After amend:

```text
A ── B'
     ↑
    HEAD
```

The old `B` may still be referenced in the reflog.

Run:

```cmd
git reflog
```

You may see entries similar to:

```text
def4567 HEAD@{0}: commit (amend): corrected message
abc1234 HEAD@{1}: commit: original message
```

The previous commit can then be inspected or recovered.

---

# 39. Amend Does Not Immediately Destroy the Old Commit

A common misconception is:

```text
amend = old commit instantly deleted
```

More accurately:

```text
branch reference
       ↓
moves to new commit
```

The old commit may become unreachable from the branch but can remain in Git's object database for some time.

Reflog can provide a way to locate it.

---

# 40. Amend and Remote-Tracking Branches

Suppose:

```text
main → B'
origin/main → B
```

after amending a previously pushed commit.

Your local branch and remote-tracking branch now point to different histories.

Check:

```cmd
git status -sb
```

and:

```cmd
git branch -vv
```

You may see divergence.

This is expected after rewriting a published commit.

---

# 41. Recommended Safe Workflow

For a local commit:

```cmd
git status
```

Inspect:

```cmd
git show HEAD
```

Make corrections.

Stage exactly what belongs in the previous commit:

```cmd
git add <files>
```

Amend:

```cmd
git commit --amend --no-edit
```

Verify:

```cmd
git show HEAD
```

Verify graph:

```cmd
git log --graph --oneline --decorate -5
```

If the branch was never published, you are generally done.

---

# 42. Advanced Safe Workflow

Before rewriting:

```cmd
git status
git branch -vv
git log --graph --oneline --decorate --all
git reflog
```

Then:

```cmd
git add -p
git commit --amend --no-edit
```

Verify:

```cmd
git show HEAD
git branch -vv
git log --graph --oneline --decorate --all
```

If the rewritten commit was already published and rewriting is authorized:

```cmd
git push --force-with-lease
```

---

# 43. Common Mistakes

### Mistake 1 — Amending the wrong commit

```cmd
git commit --amend
```

only affects the current `HEAD` commit.

For older commits, use:

```cmd
git rebase -i
```

---

### Mistake 2 — Staging too much

This:

```cmd
git add .
git commit --amend
```

can accidentally add unrelated changes to the previous commit.

Prefer selective staging when necessary:

```cmd
git add <file>
```

or:

```cmd
git add -p
```

---

### Mistake 3 — Rewriting shared history

Amending a pushed shared commit can force everyone else to reconcile divergent histories.

Avoid this unless the workflow explicitly permits it.

---

### Mistake 4 — Blind force push

Avoid:

```cmd
git push --force
```

when:

```cmd
git push --force-with-lease
```

provides a safer alternative.

---

# 44. Useful Command Reference

```cmd
git commit --amend
```

Open the commit editor.

```cmd
git commit --amend --no-edit
```

Amend without changing the message.

```cmd
git commit --amend -m "New message"
```

Amend with a new message.

```cmd
git commit --amend --author="Name <email>"
```

Change the author.

```cmd
git commit --amend --allow-empty
```

Allow an empty amended commit.

```cmd
git show HEAD
```

Inspect the resulting commit.

```cmd
git reflog
```

Find previous `HEAD` positions.

```cmd
git push --force-with-lease
```

Safely publish an intentional rewrite when permitted.

---

# 45. Decision Guide

```text
Need to fix latest commit?
        │
        ↓
   git commit --amend
        │
        ├── Change message?
        │       ↓
        │   git commit --amend
        │
        ├── Keep message?
        │       ↓
        │   git commit --amend --no-edit
        │
        ├── Add forgotten files?
        │       ↓
        │   git add <file>
        │   git commit --amend --no-edit
        │
        └── Change older commit?
                ↓
          git rebase -i
```

---

# 46. Key Mental Model

Remember:

```text
git commit --amend
```

does **not** edit a commit in place.

Conceptually it does:

```text
old commit
    ↓
create replacement commit
    ↓
move current branch to replacement
```

Therefore:

```text
old commit ID
     ↓
new commit ID
```

The fundamental model is:

```text
STAGE CHANGES
      ↓
MODIFY HEAD COMMIT
      ↓
CREATE NEW COMMIT OBJECT
      ↓
MOVE BRANCH TIP
```

---

# 47. Final Rules

```text
1. --amend modifies the latest commit.

2. The original commit is replaced from the branch's perspective.

3. The amended commit gets a new commit ID.

4. Changing a commit can cause descendants to receive new IDs.

5. Use --no-edit when keeping the existing message.

6. Stage changes before amending.

7. Use git add -p for selective amendments.

8. Use interactive rebase for older commits.

9. Amending published history rewrites shared history.

10. Avoid rewriting shared branches unless explicitly coordinated.

11. Prefer --force-with-lease when a force push is legitimately required.

12. Use reflog as a recovery mechanism.

13. Verify the resulting graph after an amendment.

14. Always distinguish the working tree, index, HEAD, branch reference,
    and commit object when reasoning about amend.
```

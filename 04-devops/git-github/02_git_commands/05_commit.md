# `git commit`

`git commit` creates a new commit from the content currently stored in the **Git index (staging area)**.

The core flow is:

```text
WORKING TREE
     │
     │ git add
     ▼
   INDEX
     │
     │ git commit
     ▼
   COMMIT
     │
     ▼
    HEAD
```

The most important rule:

> `git commit` commits what is in the **index**, not everything currently modified in the working tree.

---

# 1. Basic Syntax

```cmd
git commit
```

Git opens the configured editor so you can enter the commit message.

---

# 2. Commit With a Message

```cmd
git commit -m "Add authentication"
```

`-m` means:

```text
--message
```

Example:

```cmd
git add src/auth.js
git commit -m "Add authentication"
```

---

# 3. Commit Message Structure

A commit contains more than a message.

Conceptually:

```text
Commit
├── tree
├── parent
├── author
├── committer
└── message
```

The commit points to a tree representing the snapshot.

---

# 4. Commit Creates a Snapshot

Suppose the index contains:

```text
app.js
server.js
package.json
```

When you run:

```cmd
git commit -m "Update server"
```

Git creates a commit representing the staged snapshot.

The working tree can still contain additional unstaged changes.

---

# 5. Commit Only Staged Changes

Suppose:

```text
 M app.js
M  server.js
```

The first column represents the index/staging state.

The second represents the working tree.

Only:

```text
server.js
```

is staged.

Therefore:

```cmd
git commit -m "Update server"
```

commits `server.js`, not the unstaged `app.js` change.

---

# 6. `git commit -a`

```cmd
git commit -a -m "Update tracked files"
```

or:

```cmd
git commit -am "Update tracked files"
```

`-a` automatically stages modifications and deletions of **already tracked files** before committing.

It does not normally include new untracked files.

Example:

```text
app.js       modified
old.js       deleted
new.js       untracked
```

Running:

```cmd
git commit -am "Update files"
```

stages and commits:

```text
app.js
old.js
```

but not:

```text
new.js
```

---

# 7. `-a` Is Not Equivalent to `git add -A`

These are different:

```cmd
git add -A
git commit -m "Update"
```

versus:

```cmd
git commit -am "Update"
```

The first explicitly stages all applicable changes.

The second automatically stages tracked modifications/deletions as part of the commit operation.

Untracked files are not included by `-a`.

---

# 8. Why `git commit -a` Can Be Dangerous

Suppose you have:

```text
feature.js       modified
debug.js         modified
README.md        modified
```

You intend to commit only:

```text
feature.js
```

Do not use:

```cmd
git commit -am "Add feature"
```

because tracked modifications can all become part of the commit.

Instead:

```cmd
git add feature.js
git commit -m "Add feature"
```

---

# 9. Commit Specific Paths

Git supports path arguments:

```cmd
git commit path\to\file.js
```

This has special semantics and can bypass the normal "commit everything already staged" workflow for specified paths.

For predictable commit construction, the clearer workflow is generally:

```cmd
git add <paths>
git commit -m "message"
```

---

# 10. Commit Empty Changes

Normally:

```cmd
git commit -m "Update"
```

requires something to commit.

You can explicitly create an empty commit:

```cmd
git commit --allow-empty -m "Trigger deployment"
```

The commit contains the same tree as its parent but has a new commit identity/message.

---

# 11. Why Empty Commits Are Useful

Empty commits can be useful for:

```text
CI/CD triggers
workflow markers
release automation
testing hooks
repository events
```

Example:

```cmd
git commit --allow-empty -m "Trigger CI"
```

---

# 12. Commit Without Opening an Editor

Use:

```cmd
git commit -m "Fix validation"
```

The message is supplied directly.

You can also use multiple `-m` options:

```cmd
git commit -m "Add authentication" -m "Implement token validation and session handling."
```

The first becomes the subject and the second contributes to the commit body.

---

# 13. Multiple `-m` Messages

Example:

```cmd
git commit -m "Add authentication" -m "Implement login, logout, token validation, and session handling."
```

Conceptually:

```text
Add authentication

Implement login, logout, token validation, and session handling.
```

---

# 14. Commit Message From a File

Use:

```cmd
git commit -F commit-message.txt
```

or:

```cmd
git commit --file=commit-message.txt
```

Git reads the commit message from the specified file.

This is useful for scripts and automation.

---

# 15. Author Identity

A commit contains author information.

Configured values can be viewed with:

```cmd
git config user.name
git config user.email
```

Example:

```cmd
git config user.name "Shiva Ram"
git config user.email "you@example.com"
```

---

# 16. Author vs Committer

Git commits contain two identity concepts:

```text
Author
    Person who originally wrote the change.

Committer
    Person who created the commit object.
```

They can be different.

This matters when applying someone else's work or rewriting history.

---

# 17. Override Author

You can explicitly specify the author:

```cmd
git commit --author="John Doe <john@example.com>" -m "Apply contribution"
```

This changes the author metadata of the commit.

The committer remains the configured/current Git identity.

---

# 18. Amend Author

You can amend the latest commit's author:

```cmd
git commit --amend --author="John Doe <john@example.com>"
```

Be careful when rewriting commits that have already been shared.

---

# 19. Commit Date

Git maintains timestamps associated with authoring and committing.

Advanced environment variables can influence these values.

Common concepts:

```text
author date
committer date
```

They should not normally be manipulated unless you understand the consequences for history auditing and reproducibility.

---

# 20. `--date`

You can override the author date:

```cmd
git commit --date="2026-09-04 10:00:00" -m "Add feature"
```

This changes the author timestamp.

It does not necessarily change the committer timestamp in the same way.

---

# 21. Amend the Latest Commit

The most commonly used history-editing command:

```cmd
git commit --amend
```

It replaces the current tip commit with a new commit.

Typical use:

```cmd
git add forgotten-file.js
git commit --amend
```

The newly created commit includes the newly staged content.

---

# 22. Amend the Commit Message

```cmd
git commit --amend -m "Correct commit message"
```

This replaces the previous commit with a new commit containing the new message.

---

# 23. Amend Without Changing the Message

```cmd
git commit --amend --no-edit
```

Example:

```cmd
git add forgotten-file.js
git commit --amend --no-edit
```

This adds the staged change to the latest commit while retaining its existing message.

---

# 24. Amend Is History Rewriting

Important:

```cmd
git commit --amend
```

does not modify the existing commit object in place.

It creates a new commit replacing the old tip.

Conceptually:

```text
Before:

A ── B
     ↑
    HEAD


After amend:

A ── B'
     ↑
    HEAD
```

`B` and `B'` have different commit identities.

---

# 25. Why Amend Changes the Hash

A commit's identity depends on its contents and metadata, including:

```text
tree
parent
author
committer
message
```

Changing any relevant commit data produces a different commit object.

Therefore:

```text
B != B'
```

---

# 26. Amend Before Push

This is usually safe:

```cmd
git commit -m "Add feature"
```

then:

```cmd
git add forgotten.js
git commit --amend --no-edit
```

before pushing.

It lets you clean up the latest local commit.

---

# 27. Amend After Push

If the commit has already been pushed:

```cmd
git commit --amend
```

rewrites your local history.

The remote still has the old commit.

You may need a force update:

```cmd
git push --force-with-lease
```

This should be used carefully.

---

# 28. `--force-with-lease`

When rewritten history must be pushed, prefer:

```cmd
git push --force-with-lease
```

over:

```cmd
git push --force
```

`--force-with-lease` provides a safety check against overwriting remote changes you have not incorporated.

---

# 29. `git commit --dry-run`

Use:

```cmd
git commit --dry-run
```

to inspect what would be committed without actually creating the commit.

It is useful for checking the current commit state.

---

# 30. Verbose Commit Mode

```cmd
git commit -v
```

includes a diff of the changes being committed in the commit-message editor.

This helps you review the commit before finalizing it.

---

# 31. Very Verbose Mode

```cmd
git commit -vv
```

provides additional diff information, including staged and unstaged context.

This can be useful for reviewing complex working states.

---

# 32. Sign a Commit

Git supports cryptographic commit signing.

For GPG:

```cmd
git commit -S -m "Add feature"
```

or:

```cmd
git commit --gpg-sign -m "Add feature"
```

This creates a cryptographically signed commit when signing is correctly configured.

---

# 33. Disable Signing for One Commit

If signing is configured globally:

```cmd
git commit --no-gpg-sign -m "Add feature"
```

This disables GPG signing for that commit.

---

# 34. SSH Commit Signing

Modern Git can also use SSH-based signing when configured.

Conceptually:

```text
Commit
   │
   └── cryptographic signature
          │
          └── verification
```

The exact configuration depends on your signing setup.

---

# 35. Commit Signing vs Authorship

Signing proves possession of a configured signing key.

It does not inherently prove:

```text
employment
identity in the real world
authority over a project
quality of the change
```

It provides cryptographic verification associated with the configured identity/key.

---

# 36. Commit Hooks

`git commit` can execute hooks.

Important commit-related hooks include:

```text
pre-commit
prepare-commit-msg
commit-msg
post-commit
```

Typical flow:

```text
git commit
   │
   ▼
pre-commit
   │
   ▼
prepare-commit-msg
   │
   ▼
editor/message
   │
   ▼
commit-msg
   │
   ▼
commit created
   │
   ▼
post-commit
```

---

# 37. `pre-commit`

The `pre-commit` hook can run checks before the commit is created.

Examples:

```text
lint
format validation
tests
secret detection
static analysis
```

If it exits unsuccessfully, the commit can be aborted.

---

# 38. Bypass Hooks

Use:

```cmd
git commit --no-verify -m "Emergency fix"
```

or:

```cmd
git commit -n -m "Emergency fix"
```

This bypasses commit hooks that support the standard verification mechanism.

Use this carefully.

A hook may be enforcing important repository checks.

---

# 39. `commit-msg`

The `commit-msg` hook can validate or modify commit messages.

For example, a project may require:

```text
PROJ-123 Add authentication
```

The hook can reject messages that do not follow the repository's convention.

---

# 40. `prepare-commit-msg`

The `prepare-commit-msg` hook can automatically prepare or modify the message before the editor opens.

It can be used for:

```text
branch-based prefixes
templates
metadata
automated message preparation
```

---

# 41. `post-commit`

The `post-commit` hook runs after a commit has successfully been created.

Unlike `pre-commit`, it cannot prevent the commit because the commit already exists.

---

# 42. Commit Templates

You can configure a commit message template:

```cmd
git config commit.template .gitmessage.txt
```

Then:

```cmd
git commit
```

opens the template in the editor.

A template can encourage consistent commit structure.

---

# 43. Commit Message Conventions

A common structure:

```text
Subject line

Detailed explanation.

Additional context.
```

Example:

```text
Add JWT authentication

Implement access-token validation and authentication middleware.

The middleware rejects missing or invalid tokens.
```

---

# 44. Subject Line

The first line should normally summarize the change.

Example:

```text
Add user authentication
```

Avoid vague messages such as:

```text
update
changes
fix
work
stuff
```

A commit message should describe the logical change.

---

# 45. Imperative Commit Messages

A common convention is imperative wording:

```text
Add authentication
Fix token validation
Remove obsolete endpoint
Update documentation
```

rather than:

```text
Added authentication
Fixed token validation
Updating documentation
```

The exact convention should follow the repository's established standards.

---

# 46. Commit Body

Use the body to explain:

```text
why the change was needed
important implementation decisions
constraints
behavioral consequences
```

The code already shows much of the "what."

The commit message can preserve the reasoning.

---

# 47. One Logical Change Per Commit

Prefer:

```text
Commit 1
Add authentication

Commit 2
Add authorization

Commit 3
Update API documentation
```

rather than:

```text
Commit
Add authentication, fix unrelated bug, update docs, rename files
```

Small logical commits are easier to:

```text
review
revert
cherry-pick
bisect
debug
merge
```

---

# 48. Commit Granularity

Too large:

```text
Complete project changes
```

Too small:

```text
Fix typo in line 42
Fix another typo
Fix another typo
```

Aim for a coherent unit of change.

---

# 49. Commit Object Structure

Conceptually:

```text
commit
├── tree <tree-id>
├── parent <parent-id>
├── author <author>
├── committer <committer>
└── message
```

A normal commit points to one parent.

A merge commit can point to multiple parents.

---

# 50. Root Commit

The first commit has no parent.

```text
A
↑
root commit
```

Example:

```cmd
git add .
git commit -m "Initial commit"
```

The resulting commit is the repository's root commit.

---

# 51. Normal Commit Graph

```text
A ── B ── C
          ↑
         HEAD
```

Each normal commit points to its immediate parent.

---

# 52. Commit Identity

A commit is identified by an object ID.

Modern repositories may use SHA-1 or SHA-256 object formats depending on repository configuration.

Example:

```text
a1b2c3d4...
```

Short IDs are commonly displayed:

```cmd
git log --oneline
```

---

# 53. Commit Hash Is Not a Sequential Number

Git does not create:

```text
commit 1
commit 2
commit 3
```

Instead, commits are content-addressed objects.

Therefore:

```text
commit ID
```

depends on the commit object's data.

---

# 54. Parent Relationship

Suppose:

```text
A ── B ── C
```

Then:

```text
C.parent = B
B.parent = A
A.parent = none
```

This parent relationship forms the commit history.

---

# 55. Commit Tree

A commit points to a tree:

```text
Commit
  │
  ▼
Tree
 ├── src/
 ├── package.json
 └── README.md
```

The tree describes the repository snapshot.

Files are represented through blob objects.

---

# 56. Commit Does Not Store "Changed Lines"

A commit conceptually identifies a complete snapshot.

Git can calculate differences between snapshots:

```text
Commit A
   │
   │ diff
   ▼
Commit B
```

The diff is derived from the snapshots rather than being the fundamental identity of the commit.

---

# 57. Commit and Working Tree

After:

```cmd
git commit -m "Add feature"
```

the committed snapshot is represented by the new `HEAD`.

If the working tree matches it:

```text
HEAD
INDEX
WORKTREE
```

all represent the same content.

But this is not required.

---

# 58. Commit With Remaining Unstaged Changes

This is perfectly valid:

```text
HEAD
 │
 ▼
previous commit

INDEX
 │
 ▼
staged feature

WORKTREE
 │
 ▼
staged feature + additional edits
```

Running:

```cmd
git commit -m "Add feature"
```

commits only the index snapshot.

---

# 59. Commit Workflow

Professional basic workflow:

```cmd
git status
git diff
git add <files>
git diff --cached
git commit -m "Meaningful message"
git status
```

This gives you a review point before history is created.

---

# 60. Advanced Workflow With Partial Staging

```cmd
git status -sb
git diff
git add -p
git diff --cached
git diff
git commit -m "Add authentication"
```

This is excellent when a file contains multiple logical changes.

---

# 61. Commit Amend Workflow

Correct a recent commit:

```cmd
git add forgotten-file.js
git commit --amend --no-edit
```

Correct the message:

```cmd
git commit --amend -m "Correct message"
```

Correct both:

```cmd
git add forgotten-file.js
git commit --amend -m "Add authentication"
```

---

# 62. Reset vs Amend

These are different concepts.

```text
git commit --amend
    Replace the latest commit with a new version.

git reset
    Move/reset references and/or modify index/worktree state.
```

Do not treat them as interchangeable.

---

# 63. Revert vs Amend

```text
git commit --amend
    Rewrite the latest commit.

git revert
    Create a new commit that reverses an earlier commit.
```

Use amend mainly for local/unpublished cleanup.

Use revert when preserving shared history is important.

---

# 64. Commit and Branches

A branch is essentially a movable reference to a commit.

Example:

```text
A ── B ── C
          ↑
        main
```

After:

```cmd
git commit -m "Add feature"
```

the current branch reference moves:

```text
A ── B ── C ── D
               ↑
              main
```

---

# 65. HEAD and Commit

Usually:

```text
HEAD
 │
 ▼
current branch
 │
 ▼
latest commit
```

For a normal attached HEAD.

So:

```cmd
git commit
```

moves the current branch forward to the newly created commit.

---

# 66. Detached HEAD

If HEAD is detached:

```text
A ── B ── C
          ↑
         HEAD
```

with no branch reference pointing to `C`, you can still create commits.

Example:

```cmd
git checkout <commit>
git commit -m "Experiment"
```

The commit exists, but it is not automatically attached to a branch.

Create a branch if you want to preserve the work:

```cmd
git switch -c experiment
```

---

# 67. Commit in a Merge

During a merge:

```text
      B
     / \
A ──     M
     \ /
      C
```

The merge commit `M` has multiple parents:

```text
M
├── parent B
└── parent C
```

A normal `git commit` usually has one parent; a merge commit can have two or more.

---

# 68. Commit in a Rebase

Rebase recreates commits on a different base.

Example:

```text
Before:

A ── B ── C
      \
       D ── E
```

After rebase:

```text
A ── B ── C ── D' ── E'
```

`D'` and `E'` are new commit objects.

Their hashes differ from the original commits.

---

# 69. Commit Hooks and Automation

A commit can trigger local automation such as:

```text
lint
format
type-check
tests
commit-message validation
secret scanning
```

This is one reason a commit can take longer than simply writing an object.

---

# 70. Environment and Configuration

Useful configuration:

```cmd
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Editor:

```cmd
git config --global core.editor "code --wait"
```

Commit template:

```cmd
git config --global commit.template C:\path\to\.gitmessage
```

---

# 71. Inspect the Latest Commit

After committing:

```cmd
git show
```

or:

```cmd
git show HEAD
```

This displays the latest commit and its patch.

---

# 72. Inspect Commit Metadata

```cmd
git show --no-patch --pretty=fuller HEAD
```

This can show detailed metadata such as:

```text
author
committer
dates
message
```

---

# 73. Inspect Commit History

```cmd
git log
```

Compact:

```cmd
git log --oneline
```

Graph:

```cmd
git log --oneline --graph --decorate --all
```

This helps understand where the new commit sits in history.

---

# 74. Verify Commit Contents

Before committing:

```cmd
git diff --cached
```

After committing:

```cmd
git show --stat HEAD
```

or:

```cmd
git show HEAD
```

This verifies what actually entered the commit.

---

# 75. Commit Statistics

```cmd
git show --stat HEAD
```

can provide a summary such as:

```text
2 files changed
15 insertions
4 deletions
```

---

# 76. Commit Path Filtering

You can inspect history for a particular path:

```cmd
git log -- src\auth.js
```

This helps trace commits affecting that file.

---

# 77. Fixup Commits

Advanced history workflow:

```cmd
git commit --fixup=<commit>
```

Example:

```cmd
git commit --fixup=abc1234
```

This creates a commit intended to be automatically combined with an earlier target commit during an interactive rebase.

Typical workflow:

```cmd
git commit --fixup=abc1234
```

then:

```cmd
git rebase -i --autosquash <base>
```

---

# 78. Autosquash

Fixup workflow:

```text
Original commit
      │
      ▼
fixup commit
      │
      ▼
interactive rebase --autosquash
      │
      ▼
cleaned history
```

Command:

```cmd
git rebase -i --autosquash HEAD~5
```

Git automatically positions fixup commits appropriately.

---

# 79. `--fixup=amend`

Advanced:

```cmd
git commit --fixup=amend:<commit>
```

This creates a fixup intended to amend the target commit's content and message during autosquashing.

Use only when you understand interactive rebase workflows.

---

# 80. `--fixup=reword`

Advanced:

```cmd
git commit --fixup=reword:<commit>
```

This creates a fixup commit intended to change the target commit's message during autosquashing.

---

# 81. Signed-off-by

Some projects use Developer Certificate of Origin (DCO) workflows.

You can add a sign-off line with:

```cmd
git commit -s -m "Add feature"
```

or:

```cmd
git commit --signoff -m "Add feature"
```

The commit message receives a line similar to:

```text
Signed-off-by: Your Name <you@example.com>
```

Do not use `--signoff` unless the project's contribution policy requires or permits it.

---

# 82. `--no-post-rewrite`

Advanced option:

```cmd
git commit --no-post-rewrite
```

This prevents the `post-rewrite` hook from running when applicable.

This is mainly relevant to repositories with customized hook infrastructure.

---

# 83. `--cleanup`

Git can clean up commit-message whitespace and comment lines.

Example:

```cmd
git commit --cleanup=strip
```

Other cleanup modes include:

```text
strip
whitespace
verbatim
scissors
default
```

The exact behavior depends on the selected mode and Git configuration.

---

# 84. Commit Message Comments

Git may place comments such as:

```text
# Please enter the commit message...
```

in the editor.

These lines are normally not part of the final commit message.

The configured comment character can be inspected with:

```cmd
git config core.commentChar
```

---

# 85. `--trailer`

Git supports structured message trailers.

Example:

```cmd
git commit -m "Add feature" --trailer "Reviewed-by: Alice"
```

Trailers are structured metadata at the end of commit messages.

Common examples include:

```text
Signed-off-by:
Reviewed-by:
Co-authored-by:
Fixes:
```

The meaning depends on repository conventions and tooling.

---

# 86. Co-Author

Git hosting platforms commonly recognize a trailer such as:

```text
Co-authored-by: Name <email>
```

It can be included in the commit message body.

Example:

```cmd
git commit -m "Add feature" -m "Co-authored-by: Alice <alice@example.com>"
```

Follow the platform/project's exact contribution rules.

---

# 87. `--no-edit`

Most commonly used with amend:

```cmd
git commit --amend --no-edit
```

Meaning:

```text
reuse the existing commit message
```

---

# 88. `--reset-author`

When amending, you can reset the author information to the current committer:

```cmd
git commit --amend --reset-author
```

This is relevant when the current user is now the intended author of the amended commit.

---

# 89. `--reuse-message`

You can reuse another commit's message:

```cmd
git commit -C <commit>
```

or:

```cmd
git commit --reuse-message=<commit>
```

This reuses the specified commit's message and authorship information.

---

# 90. `--reedit-message`

```cmd
git commit -c <commit>
```

or:

```cmd
git commit --reedit-message=<commit>
```

reuses the commit's message while allowing you to edit it.

---

# 91. Commit Without Changes

Normal:

```cmd
git commit -m "Test"
```

fails if there is nothing to commit.

Explicit:

```cmd
git commit --allow-empty -m "Test"
```

creates the commit anyway.

---

# 92. Commit Message Validation

A mature repository may enforce:

```text
maximum subject length
Conventional Commits
issue references
DCO
ticket IDs
required trailers
```

For example:

```text
feat: add authentication
fix: validate expired tokens
docs: update API reference
```

Follow the project's actual convention rather than imposing one arbitrarily.

---

# 93. Conventional Commits

A common convention is:

```text
type(scope): description
```

Examples:

```text
feat(auth): add JWT authentication
fix(api): reject expired tokens
docs(readme): update installation steps
refactor(db): simplify connection handling
test(auth): add token validation tests
```

This is a **commit-message convention**, not a requirement built into Git.

---

# 94. Good Commit Review

Before:

```cmd
git commit -m "Add authentication"
```

review:

```cmd
git status -sb
git diff
git diff --cached
```

Then commit.

After:

```cmd
git show --stat HEAD
git status -sb
```

---

# 95. Recommended Professional Pattern

For normal work:

```cmd
git status -sb
git diff
git add <specific-files>
git diff --cached
git commit -m "Clear logical change"
git show --stat HEAD
git status -sb
```

For mixed changes:

```cmd
git status -sb
git diff
git add -p
git diff --cached
git commit -m "Clear logical change"
```

---

# 96. Command Reference

```text
git commit
    Create commit using staged content.

git commit -m "message"
    Create commit with supplied message.

git commit -am "message"
    Stage tracked modifications/deletions and commit.

git commit --amend
    Replace latest commit.

git commit --amend --no-edit
    Amend while keeping the existing message.

git commit --allow-empty -m "message"
    Create an empty commit.

git commit -v
    Show diff in commit-message editor.

git commit -vv
    Show more detailed diff context.

git commit --dry-run
    Inspect commit operation without creating it.

git commit -S -m "message"
    Create signed commit.

git commit --no-verify -m "message"
    Skip commit hooks.

git commit --author="Name <email>" -m "message"
    Override author.

git commit -s -m "message"
    Add Signed-off-by trailer.

git commit -C <commit>
    Reuse another commit's message and authorship.

git commit -c <commit>
    Reuse and edit another commit's message.

git commit --fixup=<commit>
    Create a fixup commit.

git commit --trailer "Key: Value"
    Add a commit trailer.

git commit -F file.txt
    Read commit message from a file.
```

---

# 97. The Most Important Mental Model

Always remember:

```text
                 WORKING TREE
                      │
                      │ git add
                      ▼
                    INDEX
                      │
                      │ git commit
                      ▼
                  NEW COMMIT
                      │
                      ▼
                     HEAD
```

`git commit` does **not** simply mean:

```text
"save everything I changed"
```

It means:

```text
"create a permanent history object from the snapshot currently represented by the index."
```

Therefore the professional sequence is:

```text
EDIT
  ↓
REVIEW
  ↓
STAGE
  ↓
REVIEW STAGED SNAPSHOT
  ↓
COMMIT
  ↓
VERIFY
```

The critical boundary is:

```text
WORKING TREE ≠ INDEX
```

and the commit is created from:

```text
INDEX → COMMIT
```

not directly from:

```text
WORKING TREE → COMMIT
```

except where a command such as `git commit -a` first stages eligible tracked changes as part of the operation.

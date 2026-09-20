# `git log`

`git log` displays the **commit history** of a Git repository.

It is one of the most important commands for understanding:

- what changed
- when it changed
- who changed it
- why it changed
- which branch contains a commit
- how branches diverged
- which files were modified
- how commits are related

---

# 1. Basic Syntax

```cmd
git log
```

Example:

```text
commit 91a8f32...
Author: Shiva Ram <you@example.com>
Date:   Fri Sep 4 10:20:00 2026 +0530

    Add authentication

commit 72bc91a...
Author: Shiva Ram <you@example.com>
Date:   Thu Sep 3 18:10:00 2026 +0530

    Initialize project
```

By default, Git starts from `HEAD` and follows its parent commits.

---

# 2. Basic Mental Model

Suppose your history is:

```text
A ── B ── C ── D
             ↑
            HEAD
```

Running:

```cmd
git log
```

walks backward:

```text
D
↓
C
↓
B
↓
A
```

The default history traversal follows parent relationships.

---

# 3. One-Line History

```cmd
git log --oneline
```

Example:

```text
91a8f32 Add authentication
72bc91a Initialize project
```

This is one of the most useful everyday forms of `git log`.

---

# 4. Short Hash

```cmd
git log --oneline
```

normally displays an abbreviated commit ID.

Example:

```text
91a8f32 Add authentication
```

The full object ID can be inspected with:

```cmd
git rev-parse HEAD
```

---

# 5. Full Commit Information

```cmd
git log
```

shows information such as:

```text
commit
author
date
commit message
```

For a more compact format:

```cmd
git log --format=fuller
```

---

# 6. Graph View

```cmd
git log --graph
```

Example:

```text
* commit D
* commit C
|\
| * commit B2
| * commit B1
|/
* commit A
```

The graph becomes especially useful when branches and merges exist.

---

# 7. Recommended Graph Command

```cmd
git log --oneline --graph --decorate --all
```

This is one of the best commands for understanding repository history.

Example:

```text
* 91a8f32 (HEAD -> main) Add authentication
* 72bc91a Update API
|\
| * 44dc821 (feature) Add login
| * 31af902 Add user model
|/
* 12aa341 Initial commit
```

---

# 8. `--decorate`

```cmd
git log --decorate
```

shows references associated with commits.

For example:

```text
HEAD -> main
origin/main
feature/auth
tag: v1.0.0
```

Useful combination:

```cmd
git log --oneline --decorate
```

---

# 9. `--all`

```cmd
git log --all
```

shows commits reachable from all references instead of only the current `HEAD` history.

Recommended:

```cmd
git log --oneline --graph --decorate --all
```

This is extremely useful for branch analysis.

---

# 10. Current Branch Only

```cmd
git log
```

normally starts from the current `HEAD`.

For example:

```text
main
 │
 ▼
D
│
C
│
B
│
A
```

Only commits reachable from `D` through its parents are shown.

---

# 11. Limit Number of Commits

```cmd
git log -5
```

or:

```cmd
git log -n 5
```

shows the latest five commits.

Example:

```cmd
git log --oneline -10
```

shows ten commits.

---

# 12. `--max-count`

```cmd
git log --max-count=10
```

is another way to limit the number of commits.

Equivalent conceptually to:

```cmd
git log -n 10
```

---

# 13. Skip Commits

```cmd
git log --skip=5 -n 10
```

skips the first five commits and then shows the next ten matching commits.

Useful for paging through large histories.

---

# 14. Search Commit Messages

```cmd
git log --grep="authentication"
```

Searches commit messages for the specified pattern.

Example:

```cmd
git log --grep="bug"
```

---

# 15. Case-Insensitive Message Search

```cmd
git log --grep="authentication" -i
```

`-i` makes the grep pattern case-insensitive.

---

# 16. Multiple `--grep` Patterns

```cmd
git log --grep="auth" --grep="login"
```

By default, multiple grep patterns can be combined according to Git's commit-message filtering behavior.

For stricter logical combinations, use:

```cmd
git log --all-match --grep="auth" --grep="security"
```

This requires all specified grep patterns to match.

---

# 17. Search Author

```cmd
git log --author="Shiva"
```

Example:

```cmd
git log --author="Alice"
```

This filters commits based on author information.

---

# 18. Search Committer

Git distinguishes:

```text
author
committer
```

You can filter by committer using:

```cmd
git log --committer="Shiva"
```

This is useful when authorship and commit creation are different.

---

# 19. Search by Date

```cmd
git log --since="2026-09-01"
```

Example:

```cmd
git log --since="2 weeks ago"
```

---

# 20. `--until`

```cmd
git log --until="2026-09-04"
```

filters commits occurring before the specified point.

Combine both:

```cmd
git log --since="2026-09-01" --until="2026-09-04"
```

---

# 21. Relative Date Filtering

Git understands expressions such as:

```cmd
git log --since="yesterday"
```

```cmd
git log --since="1 week ago"
```

```cmd
git log --since="2 months ago"
```

Examples depend on Git's date parsing.

---

# 22. Date Filtering With Messages

```cmd
git log --since="1 month ago" --grep="authentication"
```

This searches recent history for matching commit messages.

---

# 23. Show Changed Files

```cmd
git log --stat
```

Example:

```text
commit 91a8f32

    Add authentication

 src/auth.js    | 50 +++++++++++++++++
 src/server.js  | 10 ++++
 2 files changed
```

---

# 24. Show File Names Only

```cmd
git log --name-only
```

This displays the names of files changed by each commit.

---

# 25. Show File Status

```cmd
git log --name-status
```

Example:

```text
A       src/auth.js
M       src/server.js
D       old-auth.js
```

Common status letters:

```text
A = Added
M = Modified
D = Deleted
R = Renamed
C = Copied
```

---

# 26. Show Patch/Diff

```cmd
git log -p
```

or:

```cmd
git log --patch
```

This displays the actual patches introduced by commits.

Useful when you need to inspect how historical code changed.

---

# 27. Patch for Last Commit

```cmd
git log -p -1
```

This shows the patch for the latest commit.

---

# 28. Statistics for Last Commit

```cmd
git log --stat -1
```

Shows a summary of the latest commit's changes.

---

# 29. File-Specific History

```cmd
git log -- src\auth.js
```

This shows commits affecting:

```text
src\auth.js
```

This is one of the most useful history-debugging techniques.

---

# 30. File History With Patches

```cmd
git log -p -- src\auth.js
```

This shows the actual historical changes to that file.

---

# 31. Follow Renamed Files

```cmd
git log --follow -- src\auth.js
```

`--follow` attempts to continue history across renames for a single file.

Useful when a file has been renamed.

---

# 32. Why `--follow` Matters

Suppose:

```text
old-auth.js
     │
     │ rename
     ▼
auth.js
```

Without:

```cmd
git log --follow -- auth.js
```

you may see history beginning only from `auth.js`.

With `--follow`, Git can trace the file's history across the rename.

---

# 33. Find a Commit That Changed Specific Code

Use:

```cmd
git log -S"validateToken"
```

This searches for commits where the number of occurrences of the specified string changed.

This is called **pickaxe search**.

---

# 34. `-S` Pickaxe Search

Example:

```cmd
git log -S"JWT_SECRET"
```

Useful for answering:

> When was this exact string introduced or removed?

---

# 35. Regex Pickaxe

```cmd
git log -G"validate.*Token"
```

`-G` searches the patch for lines matching a regular expression.

Difference:

```text
-S
    Searches for changes in the number of occurrences of a string.

-G
    Searches changed lines using a regular expression.
```

---

# 36. `-S` vs `-G`

Example:

```cmd
git log -S"foo"
```

asks roughly:

> Which commits changed the number of occurrences of `foo`?

While:

```cmd
git log -G"foo.*bar"
```

asks roughly:

> Which commits modified lines matching this pattern?

This distinction is important when debugging historical changes.

---

# 37. Find Introduction of a Function

Suppose:

```javascript
function authenticateUser() {}
```

Search:

```cmd
git log -S"authenticateUser"
```

This can identify commits where the function name appeared or disappeared.

---

# 38. Branch History

```cmd
git log feature\auth
```

shows commits reachable from the specified branch.

---

# 39. Remote Branch History

```cmd
git log origin\main
```

or:

```cmd
git log origin/main
```

Git revision syntax generally uses `/` for remote-tracking references:

```cmd
git log origin/main
```

---

# 40. Compare Two Histories

```cmd
git log main..feature
```

This shows commits reachable from:

```text
feature
```

but not:

```text
main
```

Conceptually:

```text
feature - main
```

---

# 41. Find Commits Missing From Another Branch

```cmd
git log main..feature --oneline
```

Useful for answering:

> What commits are on `feature` that are not on `main`?

---

# 42. Reverse Comparison

```cmd
git log feature..main --oneline
```

means:

> What commits are on `main` that are not on `feature`?

---

# 43. Symmetric Difference

```cmd
git log main...feature --oneline
```

The three-dot form shows commits reachable from either side but not both, using the symmetric difference of the histories.

This is useful when analyzing divergence.

---

# 44. Show Both Branches in a Graph

```cmd
git log --oneline --graph --decorate main feature
```

This gives a visual comparison of their histories.

---

# 45. Find Merge Base

`git log` can use revision relationships, but for directly finding the common ancestor, use:

```cmd
git merge-base main feature
```

Then inspect history around it:

```cmd
git log --oneline main...feature
```

This is important when analyzing branch divergence.

---

# 46. First Parent History

```cmd
git log --first-parent
```

This follows only the first parent of merge commits.

Example:

```text
A ── B ── M ── N
      \ /
       C
```

`--first-parent` keeps the mainline perspective:

```text
A → B → M → N
```

instead of traversing into the merged branch's internal commits.

---

# 47. Why `--first-parent` Is Useful

For release or production history:

```cmd
git log --first-parent --oneline
```

can give a cleaner view of the main integration history.

It helps answer:

> Which changes were merged into this branch?

rather than:

> Show every commit that exists inside every merged branch.

---

# 48. Topological Ordering

Git can order commits according to their graph relationships.

```cmd
git log --topo-order
```

This attempts to avoid showing commits in an order that makes branch relationships confusing.

---

# 49. Date Ordering

```cmd
git log --date-order
```

tries to avoid showing commits before all of their children while considering commit dates.

---

# 50. Author Date Ordering

```cmd
git log --author-date-order
```

orders commits based on author dates while respecting graph constraints.

---

# 51. Reverse Order

```cmd
git log --reverse
```

shows commits from older to newer.

Normal:

```text
D
C
B
A
```

Reverse:

```text
A
B
C
D
```

---

# 52. Root Commits

```cmd
git log --root
```

can include root commits in certain history/path operations where they might otherwise be omitted.

---

# 53. Boundary Commits

```cmd
git log --boundary
```

marks boundary commits when limiting history with revision ranges.

Useful when investigating where a history traversal stops.

---

# 54. Pretty Formats

Git provides multiple formatting styles.

```cmd
git log --pretty=oneline
```

```cmd
git log --pretty=short
```

```cmd
git log --pretty=medium
```

```cmd
git log --pretty=full
```

```cmd
git log --pretty=fuller
```

```cmd
git log --pretty=email
```

---

# 55. Custom Pretty Format

```cmd
git log --pretty=format:"%h %an %ad %s"
```

Useful placeholders include:

```text
%H  full commit hash
%h  abbreviated commit hash
%T  tree hash
%t  abbreviated tree hash
%P  parent hashes
%p  abbreviated parent hashes
%an author name
%ae author email
%ad author date
%cn committer name
%ce committer email
%cd committer date
%s  subject
%b  body
%D  ref decorations
```

---

# 56. Useful Custom Format

```cmd
git log --pretty=format:"%h | %an | %ad | %s"
```

Example:

```text
91a8f32 | Shiva Ram | Fri Sep 4 | Add authentication
72bc91a | Shiva Ram | Thu Sep 3 | Initialize project
```

---

# 57. ISO Dates

```cmd
git log --date=iso
```

Combine with formatting:

```cmd
git log --date=iso --pretty=format:"%h %ad %an %s"
```

---

# 58. Relative Dates

```cmd
git log --date=relative
```

Example:

```text
91a8f32 2 hours ago Add authentication
72bc91a 1 day ago Initialize project
```

---

# 59. Short Date

```cmd
git log --date=short
```

Example:

```text
2026-09-04
2026-09-03
```

---

# 60. Commit Subject Only

```cmd
git log --pretty=format:"%s"
```

Useful for scripts or generating simple commit lists.

---

# 61. Commit Hashes Only

```cmd
git log --pretty=format:"%H"
```

Short hashes:

```cmd
git log --pretty=format:"%h"
```

---

# 62. Author Information

```cmd
git log --pretty=format:"%h %an <%ae>"
```

This is useful when auditing authorship.

---

# 63. Parent Information

```cmd
git log --pretty=format:"%h %p %s"
```

This exposes parent relationships.

---

# 64. Decorations

```cmd
git log --pretty=format:"%h %d %s"
```

`%d` displays ref decorations.

Example:

```text
91a8f32 (HEAD -> main, origin/main) Add authentication
```

---

# 65. Common Professional History Command

```cmd
git log --oneline --graph --decorate --all
```

Memorize this command.

It gives:

```text
commit
 ├── short hash
 ├── branch/tag references
 ├── commit message
 └── graph relationship
```

---

# 66. Show Recent Work

```cmd
git log --oneline -10
```

---

# 67. Show Recent Work With Files

```cmd
git log --stat -5
```

---

# 68. Show Recent Work With Actual Changes

```cmd
git log -p -3
```

---

# 69. Search Recent Authentication Changes

```cmd
git log --since="1 month ago" --grep="auth" --oneline
```

---

# 70. Find Changes to a Specific File

```cmd
git log --oneline -- src\auth.js
```

---

# 71. Find a Specific Code Change

```cmd
git log -S"authenticateUser" --oneline
```

---

# 72. Find Regex-Based Code Changes

```cmd
git log -G"authenticate.*token" --oneline
```

---

# 73. Show Branch Divergence

```cmd
git log --oneline --graph --decorate --all
```

Then:

```cmd
git log main..feature --oneline
```

---

# 74. Find Commits Not Merged

A common pattern:

```cmd
git log main..feature --oneline
```

This identifies commits reachable from `feature` but not `main`.

For more advanced ancestry analysis:

```cmd
git log --left-right --oneline main...feature
```

---

# 75. `--left-right`

```cmd
git log --left-right main...feature
```

marks commits according to which side they belong to.

Conceptually:

```text
< = main side
> = feature side
```

Useful with symmetric differences.

---

# 76. `--cherry`

```cmd
git log --cherry main...feature
```

helps identify equivalent changes that may have different commit IDs.

This is useful after:

```text
rebase
cherry-pick
history rewriting
```

---

# 77. `--cherry-pick`

```cmd
git log --cherry-pick main...feature
```

can omit commits whose patches correspond to equivalent changes on the other side.

This is useful when comparing histories containing cherry-picked changes.

---

# 78. Patch Equivalence

Two commits can have:

```text
different hashes
```

but represent essentially the same patch.

For example:

```text
original commit: A1
cherry-picked:   B1
```

The hashes differ because their parent/context differs.

History comparison options such as `--cherry` help reason about this.

---

# 79. Follow History Across Renames

For a specific file:

```cmd
git log --follow --oneline -- src\auth.js
```

This combines:

```text
file history
+
compact output
+
rename following
```

---

# 80. Reflog vs Log

These are fundamentally different.

```text
git log
    Shows commit history reachable through references.

git reflog
    Shows movements of local references such as HEAD.
```

Example:

```cmd
git reflog
```

can help recover commits after:

```text
reset
rebase
amend
checkout/switch
```

---

# 81. `git log` Does Not Show Every Existing Object

Important:

```cmd
git log
```

does not mean:

```text
show every commit object in .git
```

It traverses commits reachable from the starting revisions.

Unreachable commits may require other mechanisms to locate, such as:

```cmd
git reflog
```

or lower-level object inspection.

---

# 82. Revision Arguments

`git log` accepts revision expressions.

Examples:

```cmd
git log HEAD
```

```cmd
git log HEAD~3
```

```cmd
git log HEAD^
```

```cmd
git log main
```

```cmd
git log main..feature
```

```cmd
git log main...feature
```

Understanding revision syntax is essential for advanced Git history work.

---

# 83. `HEAD~N`

Example:

```cmd
git log HEAD~3
```

`HEAD~3` means following the first-parent chain three generations from `HEAD`.

Example:

```text
A ── B ── C ── D
             ↑
            HEAD
```

Then:

```text
HEAD~1 = C
HEAD~2 = B
HEAD~3 = A
```

---

# 84. `HEAD^`

```cmd
git log HEAD^
```

means the first parent of `HEAD`.

For a normal commit:

```text
A ── B
     ↑
    HEAD
```

`HEAD^` refers to:

```text
A
```

---

# 85. Merge Commit Parents

Merge commits have multiple parents.

Example:

```text
      B
     / \
A ──    M
     \ /
      C
```

For merge commit `M`:

```text
M^1 = B
M^2 = C
```

You can inspect them with:

```cmd
git log -1 M^1
```

and:

```cmd
git log -1 M^2
```

---

# 86. `--parents`

```cmd
git log --parents --oneline
```

shows parent commit IDs along with each commit.

Useful for understanding graph structure.

---

# 87. `--children`

```cmd
git log --children --oneline
```

shows child relationships.

This can help when analyzing commit graphs.

---

# 88. Simplifying History

Git may simplify history when a path is supplied.

For example:

```cmd
git log -- src\auth.js
```

does not necessarily display every commit in the repository.

It focuses on commits relevant to the specified path and Git's history simplification rules.

For deep history analysis, understand that path-limited history is not simply equivalent to scanning every commit.

---

# 89. `--full-history`

```cmd
git log --full-history -- src\auth.js
```

requests a fuller traversal of history for the specified path.

This can be useful when merges make ordinary path history appear incomplete.

---

# 90. `--simplify-merges`

```cmd
git log --simplify-merges
```

can simplify the displayed history while retaining meaningful merge relationships.

This is useful for making complicated graphs more understandable.

---

# 91. `--dense`

```cmd
git log --dense -- src\auth.js
```

is part of Git's history simplification behavior for path-limited logs.

---

# 92. `--sparse`

```cmd
git log --sparse -- src\auth.js
```

provides a less aggressive simplification of path history.

These options are advanced and are mainly useful when investigating complex merge histories.

---

# 93. Audit a File

A strong debugging workflow:

```cmd
git log --follow --stat -- src\auth.js
```

Then inspect a specific commit:

```cmd
git show <commit>
```

Then search the code's historical introduction:

```cmd
git log -S"functionName" -- src\auth.js
```

---

# 94. Audit a Feature

Start:

```cmd
git log --all --oneline --grep="authentication"
```

Then inspect:

```cmd
git show <commit>
```

Then inspect related files:

```cmd
git show --stat <commit>
```

Then search the exact implementation:

```cmd
git log -S"authenticateUser" --all --oneline
```

---

# 95. Find Who Changed a Line

`git log` is not the primary command for line attribution.

Use:

```cmd
git blame src\auth.js
```

Then inspect the identified commit:

```cmd
git show <commit>
```

A strong historical investigation often combines:

```text
git log
git show
git blame
git diff
```

---

# 96. Log vs Show

```text
git log
    History of multiple commits.

git show <commit>
    Detailed inspection of a particular object/commit.
```

Example:

```cmd
git log --oneline
git show 91a8f32
```

---

# 97. Log vs Diff

```text
git log
    Answers: "What commits happened?"

git diff
    Answers: "What content differs?"
```

They are complementary tools.

---

# 98. Log vs Reflog

```text
git log
    Repository history through reachable commits.

git reflog
    Local reference movement history.
```

For accidental resets:

```cmd
git reflog
```

may be more useful than:

```cmd
git log
```

---

# 99. Save a Useful Log Alias

You can create an alias:

```cmd
git config --global alias.lg "log --oneline --graph --decorate --all"
```

Then:

```cmd
git lg
```

becomes:

```cmd
git log --oneline --graph --decorate --all
```

---

# 100. Useful Aliases

Compact history:

```cmd
git config --global alias.l "log --oneline"
```

Graph history:

```cmd
git config --global alias.lg "log --oneline --graph --decorate --all"
```

Recent history:

```cmd
git config --global alias.last "log -1 HEAD"
```

---

# 101. Script-Friendly Output

Avoid parsing human-oriented output when possible.

For machine-readable workflows, use explicit formatting:

```cmd
git log --pretty=format:"%H%x09%an%x09%ad%x09%s"
```

Here:

```text
%H
    full hash

%x09
    tab

%an
    author name

%ad
    author date

%s
    subject
```

---

# 102. NUL-Separated Output

For robust scripting involving unusual filenames or values, Git supports formatting mechanisms involving `%x00`.

Example concept:

```cmd
git log --pretty=format:"%H%x00%s%x00"
```

This can be safer than relying on whitespace separators.

---

# 103. Search All Branches

```cmd
git log --all --grep="authentication" --oneline
```

Without `--all`, you may miss matching commits that are reachable only from another local reference.

---

# 104. Search All Branches for Code

```cmd
git log --all -S"authenticateUser" --oneline
```

This is powerful when you know a symbol existed somewhere in repository history but not necessarily on your current branch.

---

# 105. Search Remote-Tracking History

After fetching:

```cmd
git fetch
```

you can inspect:

```cmd
git log origin/main --oneline
```

or:

```cmd
git log --all --oneline
```

---

# 106. Find Recent Commits by Author

```cmd
git log --author="Shiva" --since="1 month ago" --oneline
```

---

# 107. Find Recent Changes to a File

```cmd
git log --since="1 month ago" --oneline -- src\auth.js
```

---

# 108. Find Changes Between Dates

```cmd
git log --since="2026-08-01" --until="2026-09-01" --oneline
```

---

# 109. Find Merge Commits

```cmd
git log --merges --oneline
```

This shows only merge commits.

---

# 110. Exclude Merge Commits

```cmd
git log --no-merges --oneline
```

Useful when you want to inspect only ordinary commits.

---

# 111. Find Root Commit

```cmd
git log --root --oneline
```

For a simple repository, another useful approach is:

```cmd
git rev-list --max-parents=0 HEAD
```

This directly identifies root commits reachable from `HEAD`.

---

# 112. Commit Count

```cmd
git rev-list --count HEAD
```

This counts commits reachable from `HEAD`.

For a branch:

```cmd
git rev-list --count main
```

---

# 113. Log With Commit Counts

You can combine:

```cmd
git rev-list --count HEAD
```

with:

```cmd
git log --oneline
```

to analyze repository history size.

---

# 114. Verify a Commit's Reachability

```cmd
git merge-base --is-ancestor A B
```

This is not `git log`, but it is an important companion when reasoning about history.

It answers whether:

```text
A
```

is an ancestor of:

```text
B
```

---

# 115. Advanced Investigation Workflow

When debugging a historical regression:

```cmd
git log --oneline --graph --decorate --all
```

Identify the likely commit.

Then:

```cmd
git show <commit>
```

If you know the affected symbol:

```cmd
git log -S"symbolName" --all --oneline
```

If you know a pattern:

```cmd
git log -G"pattern" --all --oneline
```

If you know the file:

```cmd
git log --follow --oneline -- path\to\file
```

Then use:

```cmd
git blame path\to\file
```

to attribute individual lines.

---

# 116. Best Everyday Commands

```cmd
git log
```

```cmd
git log --oneline
```

```cmd
git log --oneline -10
```

```cmd
git log --oneline --graph --decorate --all
```

```cmd
git log --stat
```

```cmd
git log -p
```

```cmd
git log -- src\file.js
```

```cmd
git log --follow -- src\file.js
```

```cmd
git log --grep="keyword" --oneline
```

```cmd
git log --author="name" --oneline
```

```cmd
git log --since="1 month ago" --oneline
```

```cmd
git log -S"exactText" --oneline
```

```cmd
git log -G"regexPattern" --oneline
```

---

# 117. Advanced History Commands

```cmd
git log --first-parent --oneline
```

```cmd
git log --merges --oneline
```

```cmd
git log --no-merges --oneline
```

```cmd
git log --left-right --oneline main...feature
```

```cmd
git log --cherry-pick --oneline main...feature
```

```cmd
git log --full-history -- path\to\file
```

```cmd
git log --parents --oneline
```

```cmd
git log --children --oneline
```

```cmd
git log --reverse --oneline
```

```cmd
git log --boundary --oneline main..feature
```

---

# 118. The Core Mental Model

Think of `git log` as a **commit graph traversal and filtering tool**.

```text
                 HEAD
                  │
                  ▼
                  D
                 / \
                C   E
                |   |
                B   F
                 \ /
                  A
```

`git log` can control:

```text
START POINT
    ↓
which references/commits to traverse

TRAVERSAL
    ↓
parents, first-parent, topology

FILTER
    ↓
author
message
date
file
-S
-G

OUTPUT
    ↓
oneline
graph
pretty format
patch
statistics
```

So advanced `git log` usage is not about memorizing dozens of flags.

It is about understanding four things:

```text
1. Commit graph
2. Revision ranges
3. History filtering
4. Output formatting
```

Once those four concepts are clear, commands such as:

```cmd
git log --all --oneline --graph --decorate
```

```cmd
git log main..feature --oneline
```

```cmd
git log -S"authenticateUser" --all --oneline
```

```cmd
git log --first-parent --merges --oneline
```

become predictable rather than memorized.

# `git diff`

`git diff` shows **differences between versions of files**.

It is primarily used to answer:

> **What changed?**

Git can compare:

```text
Working tree
Staging area
Commits
Branches
Tags
Files
Arbitrary revisions
```

---

# 1. Basic Syntax

```cmd
git diff
```

This shows changes between:

```text
Working Tree
      ↓
Staging Area
```

More precisely:

```text
HEAD
 ↓
Index (staging area)
 ↓
Working tree
```

`git diff` compares:

```text
Index ↔ Working Tree
```

It does **not** show changes that are already staged.

---

# 2. The Three Important States

Git maintains three important versions:

```text
HEAD
 │
 ▼
Repository
 │
 ▼
Index
 │
 ▼
Working Tree
```

Think:

```text
HEAD
    Last committed version

Index
    Version prepared for next commit

Working Tree
    Current files on disk
```

---

# 3. `git diff`

```cmd
git diff
```

Compares:

```text
Index ↔ Working Tree
```

It answers:

> What have I modified but not staged?

---

# 4. Example

Suppose `app.js` originally contains:

```javascript
console.log("Hello");
```

You modify it to:

```javascript
console.log("Hello World");
```

Run:

```cmd
git diff
```

You may see:

```diff
-console.log("Hello");
+console.log("Hello World");
```

Meaning:

```text
- removed
+ added
```

---

# 5. `git diff --cached`

```cmd
git diff --cached
```

or:

```cmd
git diff --staged
```

This compares:

```text
HEAD ↔ Index
```

It answers:

> What changes are currently staged for the next commit?

---

# 6. Working Tree vs Staging Area

```cmd
git diff
```

means:

```text
Index → Working Tree
```

---

# 7. HEAD vs Staging Area

```cmd
git diff --cached
```

means:

```text
HEAD → Index
```

---

# 8. HEAD vs Working Tree

```cmd
git diff HEAD
```

means:

```text
HEAD → Working Tree
```

This includes:

```text
staged changes
+
unstaged changes
```

This distinction is extremely important.

---

# 9. The Three Core Commands

```cmd
git diff
```

```text
unstaged changes
```

```cmd
git diff --cached
```

```text
staged changes
```

```cmd
git diff HEAD
```

```text
all changes since last commit
```

---

# 10. `git diff HEAD`

```cmd
git diff HEAD
```

Compares:

```text
HEAD ↔ Working Tree
```

including both staged and unstaged modifications.

Example:

```text
HEAD
 │
 ├── staged changes
 │
 └── unstaged changes
```

`git diff HEAD` shows both.

---

# 11. Compare Two Commits

```cmd
git diff <commit1> <commit2>
```

Example:

```cmd
git diff a1b2c3d d4e5f6g
```

This shows content differences between the two commits.

---

# 12. Commit-to-Commit Comparison

Suppose:

```text
A ── B ── C
```

Run:

```cmd
git diff A B
```

This compares the snapshots represented by:

```text
A
B
```

It does **not** mean:

> show only commit B's metadata.

It compares their resulting file trees.

---

# 13. Compare Current Commit With Previous Commit

```cmd
git diff HEAD~1 HEAD
```

or:

```cmd
git diff HEAD^ HEAD
```

This shows the changes introduced by the latest commit.

---

# 14. Show a Commit's Changes

Although `git diff` can do this:

```cmd
git diff HEAD~1 HEAD
```

a more direct command is:

```cmd
git show HEAD
```

Mental distinction:

```text
git diff
    Compare snapshots.

git show
    Inspect an object/commit.
```

---

# 15. Compare Branches

```cmd
git diff main feature
```

This compares the snapshots at:

```text
main
feature
```

It answers:

> How does the final state of `feature` differ from the final state of `main`?

---

# 16. Two-Dot Syntax

```cmd
git diff main..feature
```

For `git diff`, this is generally equivalent to comparing the two endpoints:

```cmd
git diff main feature
```

Do not confuse this with:

```cmd
git log main..feature
```

because revision-range semantics differ between commands.

---

# 17. Three-Dot Syntax

```cmd
git diff main...feature
```

This compares:

```text
merge-base(main, feature)
            ↓
         feature
```

In other words, it shows changes on `feature` since the common ancestor with `main`.

This is extremely useful for reviewing a feature branch against its base.

---

# 18. Two Dot vs Three Dot

Suppose:

```text
        C ── D   feature
       /
A ── B
       \
        E ── F   main
```

Then:

```cmd
git diff main feature
```

compares:

```text
main snapshot
       ↕
feature snapshot
```

while:

```cmd
git diff main...feature
```

compares:

```text
merge-base
     ↓
feature
```

For pull-request-style review, the three-dot form is often the more meaningful comparison.

---

# 19. Compare a Branch With Its Remote

```cmd
git fetch
git diff main origin/main
```

This compares local:

```text
main
```

with:

```text
origin/main
```

---

# 20. Working Tree and Specific File

```cmd
git diff -- src\app.js
```

This limits the diff to:

```text
src\app.js
```

---

# 21. Multiple Files

```cmd
git diff -- src\app.js src\server.js
```

Only those paths are included.

The `--` separates:

```text
revisions/options
```

from:

```text
paths
```

This is especially important when a filename could otherwise be interpreted as a revision.

---

# 22. Diff a Specific Commit and File

```cmd
git diff HEAD~1 HEAD -- src\app.js
```

This shows how `src\app.js` changed between those commits.

---

# 23. Staged Diff for One File

```cmd
git diff --cached -- src\app.js
```

This shows staged changes for that file.

---

# 24. All Changes for One File

```cmd
git diff HEAD -- src\app.js
```

This includes staged and unstaged changes relative to `HEAD`.

---

# 25. Summary Statistics

```cmd
git diff --stat
```

Example:

```text
src/app.js     | 20 +++++++++++++-------
src/server.js  |  5 +++--
2 files changed, 17 insertions(+), 8 deletions(-)
```

Useful for quickly understanding change size.

---

# 26. Staged Statistics

```cmd
git diff --cached --stat
```

Shows statistics for staged changes.

---

# 27. Commit-to-Commit Statistics

```cmd
git diff --stat HEAD~3 HEAD
```

Shows summary statistics for changes between those commits.

---

# 28. Name-Only Output

```cmd
git diff --name-only
```

Example:

```text
src/app.js
src/server.js
README.md
```

Useful when you only need affected paths.

---

# 29. Name and Status

```cmd
git diff --name-status
```

Example:

```text
M       src/app.js
A       src/auth.js
D       old.js
```

Common statuses:

```text
A = Added
M = Modified
D = Deleted
R = Renamed
C = Copied
```

---

# 30. Raw Diff Information

```cmd
git diff --raw
```

Provides lower-level information about changed paths.

Useful for tooling and advanced Git analysis.

---

# 31. Full Patch

```cmd
git diff --patch
```

Equivalent to:

```cmd
git diff -p
```

The patch displays actual line-level changes.

---

# 32. No Patch

```cmd
git diff --no-patch
```

or:

```cmd
git diff -s
```

Suppresses patch output.

Useful when you only want metadata/statistics.

---

# 33. Unified Context

Git normally shows surrounding context around changed lines.

You can control it:

```cmd
git diff -U5
```

This requests five lines of context.

For example:

```cmd
git diff -U0
```

shows essentially no surrounding context.

---

# 34. Word-Level Diff

```cmd
git diff --word-diff
```

Instead of emphasizing entire changed lines, Git highlights changes at the word level.

Useful for:

```text
documentation
JSON
configuration
prose
small code modifications
```

---

# 35. Word Diff With Color

```cmd
git diff --word-diff=color
```

Useful interactively when changes within long lines are difficult to see.

---

# 36. Word Diff Regex

```cmd
git diff --word-diff-regex="[^[:space:]]+"
```

Controls what Git considers a "word" during word-level diffing.

This is useful when the default word boundaries are not appropriate.

---

# 37. Ignore Whitespace Changes

```cmd
git diff -w
```

or:

```cmd
git diff --ignore-all-space
```

Ignores whitespace differences.

Example:

```text
const x=1;
```

versus:

```text
const x = 1;
```

can become much less noisy in the diff.

---

# 38. Ignore Changes in Amount of Whitespace

```cmd
git diff -b
```

or:

```cmd
git diff --ignore-space-change
```

Ignores changes in the amount of whitespace but does not necessarily ignore all whitespace differences.

---

# 39. Ignore Blank Lines

```cmd
git diff --ignore-blank-lines
```

Useful when formatting introduces blank-line noise.

---

# 40. Ignore Whitespace at End of Line

```cmd
git diff --ignore-space-at-eol
```

Useful when editors introduce trailing-space differences.

---

# 41. Detect Renames

Git can detect renames in diffs:

```cmd
git diff -M
```

Example:

```text
old.js → new.js
```

instead of:

```text
delete old.js
add new.js
```

---

# 42. Rename Detection Threshold

```cmd
git diff -M90%
```

sets a high similarity threshold for rename detection.

Another example:

```cmd
git diff -M50%
```

allows Git to consider files with lower similarity as possible renames.

---

# 43. Detect Copies

```cmd
git diff -C
```

enables copy detection.

For more aggressive detection:

```cmd
git diff -C --find-copies-harder
```

This can be expensive on large repositories.

---

# 44. Rename and Copy Detection

```cmd
git diff -M -C
```

enables both rename and copy detection.

---

# 45. Detect Renames Explicitly

```cmd
git diff --find-renames
```

Equivalent conceptually to:

```cmd
git diff -M
```

---

# 46. Detect Copies Explicitly

```cmd
git diff --find-copies
```

Equivalent conceptually to:

```cmd
git diff -C
```

---

# 47. Binary Files

For binary files, Git generally cannot display a normal textual patch.

You may see:

```text
Binary files A/file and B/file differ
```

You can use:

```cmd
git diff --stat
```

to understand the overall change.

---

# 48. Binary Patch

Git supports binary patch representations in certain patch output contexts:

```cmd
git diff --binary
```

This can include binary changes in a form usable by Git's patch application mechanisms.

---

# 49. No External Diff

```cmd
git diff --no-ext-diff
```

prevents configured external diff drivers from being used.

This is useful when you want Git's standard diff behavior.

---

# 50. External Diff

Git can be configured to use external diff programs.

```cmd
git diff --ext-diff
```

allows configured external diff machinery where applicable.

---

# 51. Diff Algorithms

Git supports different diff algorithms.

Default:

```cmd
git diff --diff-algorithm=default
```

Other useful algorithms include:

```cmd
git diff --diff-algorithm=myers
```

```cmd
git diff --diff-algorithm=minimal
```

```cmd
git diff --diff-algorithm=patience
```

```cmd
git diff --diff-algorithm=histogram
```

---

# 52. Myers Algorithm

```cmd
git diff --diff-algorithm=myers
```

is the traditional general-purpose algorithm.

It attempts to find a reasonably concise edit sequence.

---

# 53. Minimal Algorithm

```cmd
git diff --diff-algorithm=minimal
```

spends more effort attempting to produce the smallest possible diff.

This can be slower.

---

# 54. Patience Algorithm

```cmd
git diff --diff-algorithm=patience
```

can produce more readable diffs in certain structured code changes.

It can be particularly useful when code has repeated patterns.

---

# 55. Histogram Algorithm

```cmd
git diff --diff-algorithm=histogram
```

is often useful for source code because it improves on some cases handled by the basic algorithms.

---

# 56. Word Diff + Algorithm

You can combine options:

```cmd
git diff --word-diff --diff-algorithm=histogram
```

Git options can often be combined when their semantics are compatible.

---

# 57. Find Function Context

```cmd
git diff -W
```

or:

```cmd
git diff --function-context
```

attempts to include the entire function surrounding a changed line.

Very useful for source-code review.

---

# 58. Function Context Example

Instead of:

```diff
@@
 function authenticate() {
+  validateToken();
 }
```

you may get more surrounding function context.

This makes code review easier.

---

# 59. Pickaxe With `git diff`

You can search differences for exact text:

```cmd
git diff -S"authenticateUser"
```

This is useful for finding whether a string is present in the difference between two states.

---

# 60. Regex Pickaxe

```cmd
git diff -G"authenticate.*Token"
```

searches changed lines using a regular expression.

---

# 61. `-S` vs `-G`

```text
-S"text"
    Detects changes in the number of occurrences.

-G"regex"
    Detects changed lines matching a regex.
```

These options are extremely useful for advanced code investigation.

---

# 62. Check for a Specific Change

Suppose:

```javascript
timeout = 5000;
```

was changed.

You can inspect:

```cmd
git diff -S"timeout" HEAD~10 HEAD
```

This asks Git to find differences where the occurrence count of `timeout` changes.

---

# 63. Submodule Diff

For repositories containing submodules:

```cmd
git diff
```

can show submodule changes.

You can control submodule display using:

```cmd
git diff --submodule
```

---

# 64. Submodule Summary

```cmd
git diff --submodule=log
```

can show submodule commit history involved in the change.

---

# 65. Output Without Color

```cmd
git diff --no-color
```

Useful for:

```text
CI
scripts
logs
redirected output
```

---

# 66. Force Color

```cmd
git diff --color=always
```

Useful when output is intentionally being consumed by a color-capable environment.

---

# 67. Check Whitespace Errors

```cmd
git diff --check
```

This checks for common whitespace errors such as:

```text
trailing whitespace
whitespace errors at end of lines
```

This is extremely useful before committing.

---

# 68. Pre-Commit Workflow

A strong workflow is:

```cmd
git status
git diff
git add .
git diff --cached
git diff --check --cached
git commit
```

This lets you inspect:

```text
1. What changed?
2. What did I stage?
3. Are there whitespace problems?
4. What am I actually committing?
```

---

# 69. Review Before Commit

Recommended:

```cmd
git diff
```

Review unstaged changes.

Then:

```cmd
git add src\auth.js
```

Then:

```cmd
git diff --cached
```

Review exactly what is staged.

Then:

```cmd
git commit
```

This prevents accidental commits.

---

# 70. Review Everything Since HEAD

```cmd
git diff HEAD
```

This answers:

> What is different in my working directory from the last commit?

---

# 71. Compare With Previous Commit

```cmd
git diff HEAD~1 HEAD
```

Useful for reviewing the latest commit.

---

# 72. Compare Last Three Commits

```cmd
git diff HEAD~3 HEAD
```

This compares the snapshot three commits ago with the current `HEAD`.

It shows the cumulative content difference.

---

# 73. Important: Diff Is Snapshot-Based

Consider:

```text
A
│
B  adds X
│
C  removes X
```

The cumulative diff:

```cmd
git diff A C
```

may show no change for `X`.

Why?

Because:

```text
A snapshot
    X absent

C snapshot
    X absent
```

Intermediate history is not represented in the final snapshot comparison.

If you want individual commits:

```cmd
git log -p
```

---

# 74. Diff Does Not Show Commit History

```cmd
git diff
```

answers:

> What content differs?

While:

```cmd
git log
```

answers:

> What commits happened?

This distinction is fundamental.

---

# 75. Diff vs Show

```cmd
git diff A B
```

compares two states.

```cmd
git show A
```

shows information about object `A`, commonly a commit and its patch.

---

# 76. Diff vs Status

```cmd
git status
```

answers:

> Which files changed and what is their staging state?

```cmd
git diff
```

answers:

> What exactly changed in the content?

Use both together.

---

# 77. Diff vs Merge

Before merging:

```cmd
git diff main...feature
```

can show what the feature branch introduces relative to the common ancestor.

After merging:

```cmd
git diff main
```

can be used to compare resulting snapshots depending on your current state.

---

# 78. Review a Feature Branch

A useful workflow:

```cmd
git fetch
git diff main...feature
```

Then:

```cmd
git diff --stat main...feature
```

Then inspect specific files:

```cmd
git diff main...feature -- src\auth.js
```

---

# 79. Review Local Work

```cmd
git status
git diff
git diff --cached
git diff HEAD
```

These four commands provide a complete picture of local modifications.

---

# 80. Find Exactly What Will Be Committed

Run:

```cmd
git diff --cached
```

This is the authoritative content review for the next commit.

Do not rely only on:

```cmd
git status
```

because `status` tells you **which files** are staged, not every line that will be committed.

---

# 81. Partial Staging and Diff

Suppose a file contains two unrelated changes.

You can interactively stage parts:

```cmd
git add -p
```

Then inspect:

```cmd
git diff --cached
```

and:

```cmd
git diff
```

You can therefore have:

```text
staged part
+
unstaged part
```

in the same file.

This is an important Git concept.

---

# 82. Example: Same File, Two States

Suppose:

```text
app.js
```

contains:

```text
Change A
Change B
```

You stage only Change A.

Then:

```cmd
git diff --cached -- app.js
```

shows:

```text
Change A
```

while:

```cmd
git diff -- app.js
```

shows:

```text
Change B
```

Git can therefore track staged and unstaged versions simultaneously.

---

# 83. Diff Exit Codes

For scripting:

```cmd
git diff --exit-code
```

returns an exit status indicating whether differences exist.

Conceptually:

```text
0
    no differences

non-zero
    differences exist
```

This is useful in:

```text
CI/CD
automation
validation scripts
```

---

# 84. Quiet Diff

```cmd
git diff --quiet
```

suppresses normal output and uses the exit status to indicate whether differences exist.

Useful for scripts.

---

# 85. Diff Filters

You can filter changed file types/statuses with:

```cmd
git diff --diff-filter=M
```

For example:

```text
A = added
C = copied
D = deleted
M = modified
R = renamed
T = type changed
U = unmerged
X = unknown
B = broken pairing
```

You can combine them:

```cmd
git diff --diff-filter=AM
```

which focuses on:

```text
Added
Modified
```

---

# 86. Exclude a Status

Uppercase letters select statuses.

Lowercase letters exclude statuses.

For example:

```cmd
git diff --diff-filter=d
```

means:

> include everything except deleted files.

---

# 87. Diff Filter With File Path

```cmd
git diff --diff-filter=M -- src
```

can focus on modified paths under:

```text
src
```

---

# 88. External Diff Drivers

Git can define custom diff behavior through:

```text
.gitattributes
```

For example, a repository can define special handling for particular file types.

This becomes important for:

```text
generated files
binary-like formats
custom source formats
language-aware diffs
```

---

# 89. `.gitattributes` and Diff

A repository can configure attributes such as:

```text
*.md diff=markdown
```

or custom diff drivers.

Then:

```cmd
git diff
```

can use the configured driver behavior.

This is an advanced repository-level customization mechanism.

---

# 90. Text Conversion

Git attributes can also define working-tree/index conversions.

Diff behavior can therefore depend on attributes and text normalization.

For example:

```text
line-ending normalization
text conversion
custom diff drivers
```

This is one reason why two machines can sometimes display different-looking working-tree behavior if repository configuration differs.

---

# 91. Rename Detection Is Heuristic

Important:

Git does not store a special "rename object" for normal file renames.

Instead, rename detection generally works by comparing similarity between files.

Therefore:

```text
rename detection
```

is a heuristic interpretation of changes.

This explains why:

```cmd
git diff -M
```

may classify a change differently depending on how much content changed.

---

# 92. Similarity Threshold

Example:

```cmd
git diff -M80%
```

means Git uses an approximately 80% similarity threshold for rename detection.

Lower thresholds make rename detection more permissive.

Higher thresholds make it stricter.

---

# 93. Large Repository Considerations

Operations involving:

```text
-M
-C
--find-copies-harder
```

can become computationally expensive.

For large repositories, avoid unnecessarily aggressive rename/copy detection unless required.

---

# 94. Diff Binary vs Text

Git determines whether files are treated as binary based on repository/content characteristics and attributes.

Text files:

```text
line-level diff
```

Binary files:

```text
binary difference indication
```

Custom attributes can influence this behavior.

---

# 95. Diff From an Empty Tree

For advanced Git workflows, you can compare a tree against the empty tree object:

```cmd
git diff-tree --no-commit-id --name-only -r <commit>
```

This is usually more appropriate than `git diff` for low-level commit/tree inspection.

The important concept is:

```text
commit
  ↓
tree
  ↓
files
```

Git diffs ultimately compare tree/file snapshots.

---

# 96. Git Object Model and Diff

A commit points to a tree:

```text
Commit
  │
  ▼
Tree
  │
  ├── file
  ├── file
  └── directory
```

When you run:

```cmd
git diff A B
```

Git ultimately compares the file trees represented by those revisions.

This is why diff is fundamentally about **snapshots**, not simply textual edits between commits.

---

# 97. Diff With Tags

```cmd
git diff v1.0.0 v2.0.0
```

compares the snapshots associated with the two tags.

Useful for release comparisons.

---

# 98. Release Diff

Example:

```cmd
git diff v1.0.0..v1.1.0 --stat
```

Then:

```cmd
git diff v1.0.0..v1.1.0
```

to inspect the actual changes.

---

# 99. Compare Remote Release

After:

```cmd
git fetch --tags
```

you can run:

```cmd
git diff v1.0.0 v1.1.0
```

---

# 100. Advanced Review Pattern

For a feature branch:

```cmd
git fetch
git diff --stat origin/main...feature
```

Then:

```cmd
git diff origin/main...feature
```

Then specific files:

```cmd
git diff origin/main...feature -- src\auth.js
```

Then whitespace validation:

```cmd
git diff --check origin/main...feature
```

This gives:

```text
scope
 ↓
full patch
 ↓
specific implementation
 ↓
whitespace validation
```

---

# 101. Useful Daily Commands

```cmd
git diff
```

```cmd
git diff --cached
```

```cmd
git diff HEAD
```

```cmd
git diff --stat
```

```cmd
git diff --name-only
```

```cmd
git diff --name-status
```

```cmd
git diff --check
```

```cmd
git diff -- src\file.js
```

---

# 102. Advanced Commands Worth Memorizing

```cmd
git diff HEAD
```

```cmd
git diff HEAD~1 HEAD
```

```cmd
git diff main...feature
```

```cmd
git diff --cached
```

```cmd
git diff --stat
```

```cmd
git diff --name-status
```

```cmd
git diff --check
```

```cmd
git diff -w
```

```cmd
git diff -M
```

```cmd
git diff --word-diff
```

```cmd
git diff --function-context
```

```cmd
git diff -S"symbol"
```

```cmd
git diff -G"regex"
```

---

# 103. The Core Mental Model

Memorize this:

```text
                  git diff
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Working       Index         HEAD
       Tree       (staging)     (commit)
```

The most important comparisons are:

```text
git diff
    Index ↔ Working Tree

git diff --cached
    HEAD ↔ Index

git diff HEAD
    HEAD ↔ Working Tree
```

And for history:

```text
git diff A B
    A snapshot ↔ B snapshot

git diff main...feature
    merge-base(main, feature) ↔ feature
```

The central question is always:

> **Which two states am I comparing?**

Once that is clear, `git diff` becomes much easier to reason about.

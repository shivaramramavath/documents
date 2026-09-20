# Git Objects

Git is fundamentally an **object database**.

The most important Git objects are:

```text
blob
tree
commit
tag
```

Understanding these objects explains how Git stores files, directories, commits, branches, tags, history, and repository state.

---

# 1. Git Object Database

Git stores objects inside its repository.

Conceptually:

```text
.git/
└── objects/
```

The object database contains objects identified by object IDs.

The four fundamental object types are:

```text
┌──────────────┐
│     blob     │ → file content
├──────────────┤
│     tree     │ → directory structure
├──────────────┤
│    commit    │ → snapshot + history metadata
├──────────────┤
│     tag      │ → annotated reference object
└──────────────┘
```

---

# 2. Content-Addressable Storage

Git uses **content-addressable storage**.

The basic concept is:

```text
Object content
      │
      ▼
Hash algorithm
      │
      ▼
Object ID
```

The resulting object ID identifies the object.

Therefore Git can locate an object from its identifier.

Conceptually:

```text
content
   ↓
hash
   ↓
object ID
   ↓
.git/objects
```

---

# 3. Object ID

A Git object has an object ID.

Example:

```text
a13f8d2...
```

The complete ID is longer.

You can obtain the current commit ID with:

```powershell
git rev-parse HEAD
```

Example output:

```text
a13f8d2c...
```

That identifier points to a commit object.

---

# 4. Object Type

You can ask Git what type an object is:

```powershell
git cat-file -t HEAD
```

Example:

```text
commit
```

Because:

```text
HEAD
 ↓
commit
```

You can also test another object:

```powershell
git cat-file -t <object-id>
```

Possible output:

```text
blob
tree
commit
tag
```

---

# 5. Object Contents

Use:

```powershell
git cat-file -p <object>
```

The `-p` option pretty-prints the object.

For example:

```powershell
git cat-file -p HEAD
```

A commit may display something conceptually like:

```text
tree a83f...
parent 91cd...
author Shiva Ram <...>
committer Shiva Ram <...>

Initial commit
```

The important part is:

```text
tree
parent
author
committer
message
```

---

# 6. Blob Object

A **blob** stores file content.

Suppose:

```text
hello.txt
```

contains:

```text
Hello Git
```

Git can represent that content as a blob.

Conceptually:

```text
hello.txt
    │
    ▼
  content
    │
    ▼
   blob
```

The blob itself does not fundamentally know that the filename is:

```text
hello.txt
```

The filename is associated through a tree.

---

# 7. Blob Does Not Store Filename

This is extremely important.

A blob represents:

```text
file content
```

not:

```text
filename + path
```

For example:

```text
app.js
```

and:

```text
backup/app.js
```

could theoretically point to the same blob if their contents are identical.

Conceptually:

```text
              ┌── app.js
              │
same blob ────┤
              │
              └── backup/app.js
```

The tree provides the names and paths.

---

# 8. Creating a Blob Manually

You can create an object from standard input using:

```powershell
"Hello Git" | git hash-object -w --stdin
```

Git returns an object ID.

Example:

```text
a8f3...
```

Now inspect it:

```powershell
git cat-file -t a8f3...
```

Output:

```text
blob
```

Inspect content:

```powershell
git cat-file -p a8f3...
```

Output:

```text
Hello Git
```

---

# 9. `hash-object`

The command:

```powershell
git hash-object
```

calculates the object ID for content.

Without `-w`, Git can calculate the ID without storing the object.

Example:

```powershell
"Hello Git" | git hash-object --stdin
```

With:

```powershell
-w
```

Git writes the object into the object database.

```powershell
"Hello Git" | git hash-object -w --stdin
```

Conceptually:

```text
content
   │
   ▼
hash-object
   │
   ├── calculate ID
   │
   └── -w → store object
```

---

# 10. Hashing a File

You can also hash a file:

```powershell
git hash-object app.txt
```

This calculates the blob's object ID.

To store it:

```powershell
git hash-object -w app.txt
```

Now the blob exists in the repository's object database.

---

# 11. Tree Object

A tree represents a directory structure.

Conceptually:

```text
project/
├── README.md
├── app.js
└── src/
    └── server.js
```

can be represented as:

```text
tree
├── README.md → blob
├── app.js    → blob
└── src       → tree
                 └── server.js → blob
```

Therefore:

```text
tree
=
directory entries
+
references to objects
```

---

# 12. Tree Entries

A tree entry contains information such as:

```text
mode
type
object ID
name
```

Conceptually:

```text
100644 blob a83f... README.md
100644 blob b91d... app.js
040000 tree c82a... src
```

The exact formatting of `git cat-file -p` output is important when inspecting trees.

---

# 13. File Modes

Git trees store file modes.

A common regular file mode is:

```text
100644
```

An executable file may use:

```text
100755
```

A directory is represented as a tree entry, commonly:

```text
040000
```

Other Git modes exist for special cases such as symbolic links and submodules.

---

# 14. Inspecting a Commit's Tree

First get the current commit:

```powershell
git rev-parse HEAD
```

Then:

```powershell
git cat-file -p HEAD
```

You might see:

```text
tree a83f...
```

Now inspect that tree:

```powershell
git cat-file -p a83f...
```

You may see:

```text
100644 blob 123abc... README.md
100644 blob 456def... app.js
040000 tree 789ghi... src
```

Now the relationship becomes visible:

```text
commit
  │
  └── tree
       ├── blob
       ├── blob
       └── tree
```

---

# 15. Tree Recursion

A tree can contain another tree.

For:

```text
project/
└── src/
    ├── app.js
    └── server.js
```

the structure is:

```text
root tree
└── src → subtree
          ├── app.js → blob
          └── server.js → blob
```

This creates a recursive directory representation.

---

# 16. Root Tree

Every commit points to a root tree.

Conceptually:

```text
Commit
   │
   ▼
Root Tree
   │
   ├── file → Blob
   ├── file → Blob
   └── directory → Tree
```

The root tree represents the complete project snapshot.

---

# 17. Commit Object

A commit contains references to:

```text
tree
parent(s)
author
committer
message
```

Conceptually:

```text
Commit
├── tree → root tree
├── parent → previous commit
├── author
├── committer
└── message
```

The tree represents the project state.

The parent represents history.

---

# 18. Commit Without a Parent

The first commit in a repository has no parent.

Example:

```text
Commit A
├── tree
├── author
├── committer
└── message
```

There is no:

```text
parent
```

This is the root commit.

---

# 19. Commit With One Parent

Normal commits usually have one parent.

```text
A ← B
```

Commit `B` contains:

```text
parent A
```

Therefore:

```text
B
│
└── parent → A
```

---

# 20. Merge Commit

A merge commit can contain multiple parents.

Example:

```text
      B
     / \
A ← C   M
     \ /
      D
```

Conceptually:

```text
M
├── parent → C
└── parent → D
```

The merge commit combines the histories.

---

# 21. Commit Is Not the File Content

A commit does not directly contain every file's content.

Instead:

```text
Commit
   │
   ▼
Tree
   │
   ├── Blob
   ├── Blob
   └── Tree
        ├── Blob
        └── Blob
```

This indirection is fundamental.

---

# 22. Commit Snapshot

Suppose:

```text
app.js
README.md
```

exist in the project.

The commit can point to:

```text
Commit
   │
   ▼
Tree
├── app.js → Blob A
└── README → Blob B
```

The tree therefore describes the exact state of the project at that commit.

---

# 23. Object Reuse

Suppose commit 1 has:

```text
app.js → Blob A
README → Blob B
```

You modify only `app.js`.

Commit 2 can contain:

```text
app.js → Blob C
README → Blob B
```

The README blob is reused.

Therefore Git does not need to create a new blob for unchanged content.

---

# 24. Identical Content Can Share an Object

Suppose:

```text
file1.txt
```

contains:

```text
Hello
```

and:

```text
file2.txt
```

also contains:

```text
Hello
```

They can reference the same blob.

```text
file1.txt ──┐
            ├──→ Blob X
file2.txt ──┘
```

This follows from content addressing.

---

# 25. Tree Reuse

Object reuse applies to trees as well.

If a directory's contents remain unchanged, Git can reuse the corresponding tree object.

Example:

```text
Commit 1
   │
   └── Root Tree A
          ├── src → Tree B
          └── docs → Tree C
```

After changing only `src`:

```text
Commit 2
   │
   └── Root Tree D
          ├── src → Tree E
          └── docs → Tree C
```

`Tree C` can remain unchanged and be reused.

---

# 26. Full Object Graph

A realistic simplified history:

```text
Commit C
   │
   ├── parent → Commit B
   │
   └── tree → Tree C
                │
                ├── README → Blob R
                ├── app.js  → Blob A2
                └── src     → Tree S2
                              ├── db.js     → Blob D
                              └── server.js → Blob S
```

Previous commit:

```text
Commit B
   │
   └── tree → Tree B
                │
                ├── README → Blob R
                ├── app.js  → Blob A1
                └── src     → Tree S1
                              ├── db.js     → Blob D
                              └── server.js → Blob S
```

Notice reused objects:

```text
Blob R
Blob D
Blob S
```

---

# 27. Tag Object

An annotated tag is a Git object.

It can contain:

```text
object
type
tag
tagger
message
```

Conceptually:

```text
Tag Object
├── object → Commit
├── type → commit
├── tag → v1.0.0
├── tagger
└── message
```

This differs from a lightweight tag.

---

# 28. Lightweight Tag

A lightweight tag is essentially a reference:

```text
refs/tags/v1.0.0
        │
        ▼
      Commit
```

It does not create a separate tag object.

---

# 29. Annotated Tag

An annotated tag adds an actual tag object:

```text
refs/tags/v1.0.0
        │
        ▼
     Tag Object
        │
        ▼
      Commit
```

This allows tag metadata such as:

```text
tagger
message
tag name
```

to be stored.

---

# 30. Inspecting Tags

List tags:

```powershell
git tag
```

Inspect an annotated tag:

```powershell
git cat-file -t v1.0.0
```

Possible output:

```text
tag
```

Inspect it:

```powershell
git cat-file -p v1.0.0
```

---

# 31. Plumbing vs Porcelain

Git commands are commonly discussed as:

```text
porcelain
```

and:

```text
plumbing
```

### Porcelain

High-level user-facing commands:

```text
git add
git commit
git switch
git merge
git restore
git status
```

### Plumbing

Lower-level commands exposing Git's internal mechanisms:

```text
git hash-object
git cat-file
git write-tree
git commit-tree
git update-ref
git read-tree
```

Understanding plumbing helps explain porcelain behavior.

---

# 32. `git cat-file`

This is one of the most important object-inspection commands.

Syntax:

```powershell
git cat-file <options> <object>
```

Important forms:

```powershell
git cat-file -t <object>
```

Get object type.

```powershell
git cat-file -p <object>
```

Pretty-print object.

```powershell
git cat-file -s <object>
```

Get object size.

---

# 33. `git rev-parse`

`git rev-parse` resolves Git references and expressions.

Examples:

```powershell
git rev-parse HEAD
```

Resolve `HEAD`.

```powershell
git rev-parse HEAD^
```

Resolve the first parent.

```powershell
git rev-parse HEAD~3
```

Resolve three first-parent generations backward.

```powershell
git rev-parse --show-toplevel
```

Show repository root.

```powershell
git rev-parse --git-dir
```

Show Git directory.

---

# 34. Revision Syntax

Git supports powerful revision expressions.

For example:

```text
HEAD
```

means the current `HEAD`.

```text
HEAD^
```

means the first parent of `HEAD`.

```text
HEAD~2
```

means two first-parent steps backward.

Example:

```text
A ← B ← C ← D
            ↑
           HEAD
```

Then:

```text
HEAD   = D
HEAD^  = C
HEAD~2 = B
HEAD~3 = A
```

---

# 35. `^` vs `~`

For ordinary linear history:

```text
HEAD^
```

and:

```text
HEAD~1
```

refer to the same parent.

But merge commits make the distinction important.

For a merge commit:

```text
      B
     / \
A ← C   M
     \ /
      D
```

`M^1` means:

```text
first parent
```

and:

```text
M^2
```

means:

```text
second parent
```

`~` follows the first-parent chain.

---

# 36. Inspect the Root Tree

Run:

```powershell
git rev-parse HEAD^{tree}
```

This resolves the tree associated with `HEAD`.

Then:

```powershell
git cat-file -p HEAD^{tree}
```

You can inspect the root tree directly.

---

# 37. Object Expression

Git can resolve:

```text
HEAD^{commit}
```

to ensure the object is interpreted as a commit.

Similarly:

```text
HEAD^{tree}
```

resolves the associated tree.

This is useful when working directly with Git's object graph.

---

# 38. `git ls-tree`

A convenient tree-inspection command is:

```powershell
git ls-tree HEAD
```

Example:

```text
100644 blob 123abc README.md
100644 blob 456def app.js
040000 tree 789ghi src
```

Recursively:

```powershell
git ls-tree -r HEAD
```

This displays entries beneath subdirectories as well.

---

# 39. `git ls-files`

The index can be inspected with:

```powershell
git ls-files
```

This shows tracked paths represented in the index.

Compare:

```text
git ls-files
```

with:

```text
git ls-tree -r HEAD
```

to understand the difference between:

```text
INDEX
```

and:

```text
HEAD tree
```

---

# 40. Building a Tree

The lower-level command:

```powershell
git write-tree
```

writes the current index as a tree object.

Conceptually:

```text
INDEX
  │
  ▼
git write-tree
  │
  ▼
TREE OBJECT
```

The command outputs the tree's object ID.

---

# 41. Building a Commit

The lower-level command:

```powershell
git commit-tree
```

creates a commit from a tree.

Conceptually:

```text
INDEX
  │
  ▼
write-tree
  │
  ▼
TREE
  │
  ▼
commit-tree
  │
  ▼
COMMIT
```

A parent can be supplied using:

```text
-p <parent>
```

This demonstrates the relationship between trees and commits.

---

# 42. Why `git commit` Is Higher-Level

The normal command:

```powershell
git commit
```

handles many details for you:

```text
index
↓
tree creation
↓
parent determination
↓
author/committer metadata
↓
commit creation
↓
branch reference update
```

The plumbing commands expose these individual concepts.

---

# 43. Branches and Objects

A branch is not an object type.

There is no fundamental:

```text
branch object
```

Instead:

```text
branch
=
reference → commit
```

Example:

```text
refs/heads/main
        │
        ▼
      Commit
```

This distinction is essential.

---

# 44. `HEAD` and Objects

`HEAD` usually points to a branch:

```text
HEAD
 ↓
refs/heads/main
 ↓
Commit
```

In detached HEAD:

```text
HEAD
 ↓
Commit
```

Therefore `HEAD` is a special reference mechanism, not a commit object itself.

---

# 45. References Are Names

Instead of remembering:

```text
a83f1c9d...
```

you can use:

```text
main
HEAD
v1.0.0
origin/main
```

These names eventually resolve to Git objects.

Conceptually:

```text
main
 ↓
commit

HEAD
 ↓
main
 ↓
commit

v1.0.0
 ↓
tag or commit
```

---

# 46. Object Reachability

Git objects form a graph.

References provide entry points.

Example:

```text
main
 │
 ▼
Commit D
 │
 ▼
Commit C
 │
 ▼
Commit B
 │
 ▼
Commit A
```

Starting from `main`, Git can reach:

```text
D
C
B
A
```

Therefore those objects are reachable from `main`.

---

# 47. Garbage Collection

Git can clean up objects that are no longer reachable from relevant references.

A common maintenance command is:

```powershell
git gc
```

Git may:

- Repack objects
- Remove unnecessary loose objects
- Perform repository housekeeping

Do not think of `git gc` as simply "delete old commits."

Reachability and repository retention rules matter.

---

# 48. Reflogs and Reachability

Suppose a branch moves:

```text
A ← B ← C
        ↑
       main
```

Then:

```text
main
 ↓
B
```

The commit `C` may no longer be reachable from `main`.

However, the reflog may still contain the previous reference position.

Therefore:

```text
unreachable
```

does not necessarily mean:

```text
immediately deleted
```

This is important for recovery.

---

# 49. Object Storage Layout

Traditional loose Git objects are stored conceptually under:

```text
.git/objects/
```

An object ID such as:

```text
a83f1234...
```

can be represented using a directory prefix and remaining identifier.

Conceptually:

```text
.git/objects/
└── a8/
    └── 3f1234...
```

Git also uses packed objects for efficient storage.

Do not rely on manually navigating `.git/objects` as your normal workflow.

Use Git's object-inspection commands.

---

# 50. Loose Objects vs Packfiles

Git can store objects as:

```text
loose objects
```

or inside:

```text
packfiles
```

Packfiles allow Git to store many objects efficiently.

Conceptually:

```text
Loose:
object → individual object file

Packed:
many objects
     ↓
packfile
```

The logical object model remains the same.

---

# 51. Packfiles Do Not Change the Object Model

Whether an object is stored:

```text
loose
```

or:

```text
packed
```

you still reason about:

```text
blob
tree
commit
tag
```

Packfiles are primarily a storage optimization.

---

# 52. Hash Algorithm and Object Format

Git object identity depends on the repository's object format.

Historically:

```text
SHA-1
```

has been widely used.

Git also supports:

```text
SHA-256
```

repositories.

Therefore the durable concept is:

```text
object content
      ↓
repository hash algorithm
      ↓
object ID
```

not a hard-coded assumption about one particular hash algorithm.

---

# 53. Object Integrity

Content-addressing provides an important integrity property.

Conceptually:

```text
Object ID
    ↓
expected content identity
```

If the underlying object content changes, its calculated identity changes.

This makes object corruption detectable.

Git also has verification tools such as:

```powershell
git fsck
```

---

# 54. `git fsck`

`git fsck` checks repository object connectivity and integrity.

Basic:

```powershell
git fsck
```

It can identify issues involving:

```text
dangling objects
unreachable objects
missing objects
corrupt objects
```

Use it as an inspection/debugging tool rather than a routine everyday command.

---

# 55. Complete Object Relationship

The core architecture:

```text
                    REFERENCE
                        │
                        ▼
                      COMMIT
                     /      \
                    /        \
               parent        tree
                 │             │
                 ▼             ▼
              COMMIT          TREE
                               │
                    ┌──────────┴──────────┐
                    │                     │
                   BLOB                  TREE
                    │                     │
                file data             directory
```

For annotated tags:

```text
REFERENCE
    │
    ▼
 TAG OBJECT
    │
    ▼
 COMMIT
    │
    ▼
 TREE
    │
    ├── BLOB
    └── TREE
```

---

# 56. Object Inspection Workflow

For any commit:

```powershell
git rev-parse HEAD
```

Then:

```powershell
git cat-file -t HEAD
```

Then:

```powershell
git cat-file -p HEAD
```

Find its tree:

```powershell
git rev-parse HEAD^{tree}
```

Inspect the tree:

```powershell
git cat-file -p HEAD^{tree}
```

Inspect recursively:

```powershell
git ls-tree -r HEAD
```

Now you can traverse:

```text
HEAD
 ↓
Commit
 ↓
Tree
 ↓
Blob
```

---

# 57. Object Investigation Example

Create:

```powershell
New-Item example.txt -ItemType File
```

Put some content in it:

```powershell
"Git object model" | Set-Content example.txt
```

Stage and commit:

```powershell
git add example.txt
git commit -m "Add example"
```

Get commit:

```powershell
git rev-parse HEAD
```

Inspect:

```powershell
git cat-file -p HEAD
```

Find the tree:

```powershell
git rev-parse HEAD^{tree}
```

Inspect it:

```powershell
git cat-file -p HEAD^{tree}
```

You should see an entry for:

```text
example.txt
```

with:

```text
blob
```

and an object ID.

Now inspect that blob:

```powershell
git cat-file -p <blob-id>
```

You should get:

```text
Git object model
```

---

# 58. Object Traversal Exercise

Starting from:

```text
HEAD
```

perform this traversal manually:

```text
HEAD
 ↓
commit
 ↓
tree
 ↓
blob
 ↓
file content
```

Commands:

```powershell
git cat-file -t HEAD
git cat-file -p HEAD
git rev-parse HEAD^{tree}
git ls-tree HEAD
```

Then inspect the blob:

```powershell
git cat-file -p <blob-id>
```

You should understand what each command is showing.

---

# 59. Advanced Exercise: Compare Two Commits

Create two commits where only one file changes.

Then inspect:

```powershell
git ls-tree -r <commit1>
git ls-tree -r <commit2>
```

Compare the blob IDs.

For an unchanged file:

```text
commit1 → same blob
commit2 → same blob
```

For a changed file:

```text
commit1 → blob A
commit2 → blob B
```

This demonstrates Git's content-based object reuse.

---

# 60. Advanced Exercise: Inspect Parents

Run:

```powershell
git cat-file -p HEAD
```

Find:

```text
parent <object-id>
```

Then:

```powershell
git cat-file -p <parent-id>
```

Repeat.

You are manually traversing the commit graph:

```text
HEAD
 ↓
Commit D
 ↓ parent
Commit C
 ↓ parent
Commit B
 ↓ parent
Commit A
```

---

# 61. Advanced Exercise: Inspect a Merge

Create a test repository with divergent branches and merge them.

Then:

```powershell
git cat-file -p HEAD
```

If `HEAD` is the merge commit, inspect its:

```text
parent
parent
```

You should see multiple parent lines.

This demonstrates why Git history is a graph rather than merely a list.

---

# 62. Commands to Master

### Object inspection

```powershell
git cat-file -t <object>
git cat-file -p <object>
git cat-file -s <object>
```

### Object creation

```powershell
git hash-object <file>
git hash-object -w <file>
```

### Tree inspection

```powershell
git ls-tree <tree>
git ls-tree -r <tree>
```

### Index inspection

```powershell
git ls-files
```

### Revision resolution

```powershell
git rev-parse <revision>
git rev-parse HEAD^{tree}
git rev-parse HEAD^
git rev-parse HEAD~2
```

### Object verification

```powershell
git fsck
```

### Low-level construction

```powershell
git write-tree
git commit-tree
git update-ref
```

---

# 63. What You Must Understand Before Moving On

You should now be able to explain:

```text
What is a blob?
What is a tree?
What is a commit?
What is an annotated tag?
Why doesn't a blob store a filename?
How does a commit point to a snapshot?
How does a tree represent directories?
Why can Git reuse unchanged blobs?
What is content-addressable storage?
What is an object ID?
What does HEAD point to?
What is a branch internally?
What is a reference?
What is a parent commit?
Why can merge commits have multiple parents?
What is reachability?
What is a dangling object?
What is a reflog?
What does git cat-file do?
What does git rev-parse do?
What does git ls-tree do?
What does git hash-object do?
What does git write-tree do?
What does git commit-tree do?
```

---

# 64. Final Mental Model

The entire Git object model can be reduced to:

```text
                         REFERENCE
                             │
                             ▼
                           COMMIT
                          /      \
                         /        \
                    parent        TREE
                      │             │
                      ▼             ├── BLOB
                   COMMIT           ├── BLOB
                                    └── TREE
                                         │
                                         ├── BLOB
                                         └── BLOB
```

And the working model is:

```text
WORKING TREE
      │
      │ git add
      ▼
    INDEX
      │
      │ git write-tree
      ▼
     TREE
      │
      │ git commit / commit-tree
      ▼
    COMMIT
      │
      ▼
   REFERENCE
```

The key principle is:

```text
Git does not fundamentally store "branches containing files."

Git stores objects and references.

References point to commits.
Commits point to trees.
Trees point to blobs and other trees.
Commits point to parent commits.
```

Once this object graph becomes intuitive, advanced operations such as **reset, rebase, merge, cherry-pick, reflog recovery, filtering, object recovery, and history rewriting** become much easier to understand.

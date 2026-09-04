# Git First Commands

This file covers the first Git commands you should understand before moving into Git fundamentals.

The objective is not to memorize commands. The objective is to understand:

- What each command operates on
- What state it reads
- What state it changes
- What it does not change
- Which commands are safe
- Which commands can destroy or rewrite data

---

# 1. Git Command Mental Model

A useful Git model is:

```text
                    Git Repository
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
     Working Tree      Index       Repository
          │              │              │
          │              │              │
          └─────── git add ─────────────┘
                         │
                         ▼
                       Index
                         │
                    git commit
                         │
                         ▼
                    Repository
```

For remote repositories:

```text
Local Repository
       │
       ├── git push ───────► Remote Repository
       │
       ◄── git fetch ────── Remote Repository
       │
       └── git pull
```

This model will become more important as Git becomes advanced.

---

# 2. `git --version`

Check the installed Git version:

```powershell
git --version
```

Example:

```text
git version 2.x.x
```

Purpose:

```text
Verify Git installation
```

It does not:

- Create a repository
- Modify files
- Create commits
- Contact GitHub

---

# 3. `git help`

Display Git's general help:

```powershell
git help
```

You can request help for a specific command:

```powershell
git help status
```

or:

```powershell
git status -h
```

General pattern:

```text
git help <command>
git <command> -h
```

Use help when you need exact command syntax rather than relying on memory.

---

# 4. `git init`

Initialize a Git repository:

```powershell
git init
```

Example:

```powershell
mkdir my-project
cd my-project
git init
```

Git creates repository metadata, normally inside:

```text
.git/
```

The structure becomes conceptually:

```text
my-project/
└── .git/
```

If project files already exist:

```text
my-project/
├── src/
├── README.md
└── .git/
```

`git init` does not create a commit.

It does not automatically track every file.

It does not upload anything.

It only initializes the repository.

---

# 5. `git init` Is Safe to Understand, Not Something to Run Repeatedly

Running:

```powershell
git init
```

inside an existing repository generally reinitializes the repository rather than creating a second independent repository.

However, you should understand your repository structure before doing this.

Check whether you are already inside a repository:

```powershell
git rev-parse --is-inside-work-tree
```

If Git returns:

```text
true
```

you are inside a working tree.

---

# 6. `git status`

One of the most important Git commands:

```powershell
git status
```

It reports the current state of the working tree and staging area.

Typical information includes:

```text
Current branch
Untracked files
Modified files
Staged changes
Unstaged changes
Repository state
```

Use it frequently.

A common workflow is:

```text
change files
   ↓
git status
   ↓
git add
   ↓
git status
   ↓
git commit
   ↓
git status
```

---

# 7. `git status --short`

For a compact representation:

```powershell
git status --short
```

Example:

```text
 M app.js
?? README.md
A  index.js
```

The two status columns are important.

Conceptually:

```text
XY filename
```

where:

```text
X = index / staging-area state
Y = working-tree state
```

Examples:

```text
 M file.js
```

means the working tree has a modification that is not staged.

```text
M  file.js
```

means the modification is staged.

```text
MM file.js
```

means the file has staged changes and additional unstaged changes.

```text
?? file.js
```

means the file is untracked.

This two-column model is extremely useful when debugging staging problems.

---

# 8. `git add`

Stage changes:

```powershell
git add file.js
```

For multiple files:

```powershell
git add file1.js file2.js
```

For the current directory:

```powershell
git add .
```

The purpose of `git add` is:

```text
Working Tree
      │
      │ git add
      ▼
Index
```

It does not create a commit.

It prepares content for the next commit.

---

# 9. Why `git add` Exists

Git's staging area allows you to construct a commit deliberately.

Suppose you modify:

```text
login.js
database.js
README.md
```

but only want to commit:

```text
login.js
```

You can run:

```powershell
git add login.js
```

Then:

```powershell
git status
```

The index contains the version of `login.js` that will be included in the next commit.

This gives you control over commit boundaries.

---

# 10. `git add .`

This command:

```powershell
git add .
```

stages changes under the current directory according to Git's pathspec behavior.

It is convenient, but do not blindly use it.

Before committing, inspect:

```powershell
git status
```

and:

```powershell
git diff --cached
```

This allows you to verify exactly what is staged.

---

# 11. `git diff`

Show unstaged differences:

```powershell
git diff
```

Conceptually:

```text
Working Tree
      │
      ▼
Index
```

It compares your working-tree content against the index.

Therefore:

```powershell
git diff
```

primarily answers:

> What have I changed that is not currently staged?

---

# 12. `git diff --cached`

Show staged differences:

```powershell
git diff --cached
```

Also commonly:

```powershell
git diff --staged
```

Conceptually:

```text
Index
  │
  ▼
HEAD
```

It answers:

> What will the next commit contain?

This is one of the most important review commands in Git.

---

# 13. `git diff HEAD`

Show the difference between the working tree/index state and the current commit:

```powershell
git diff HEAD
```

This is useful for seeing all current modifications relative to `HEAD`, including changes that have already been staged.

Conceptually:

```text
Working Tree + Index
          │
          ▼
         HEAD
```

---

# 14. `git commit`

Create a commit:

```powershell
git commit -m "Initial commit"
```

A commit records the currently staged snapshot.

Conceptually:

```text
Working Tree
     │
  git add
     ▼
   Index
     │
 git commit
     ▼
 Repository
```

Only staged content is included.

This is why:

```powershell
git add
```

and:

```powershell
git commit
```

are separate operations.

---

# 15. Commit Message

A commit message should describe the logical change.

Good:

```text
Add user authentication
```

Less useful:

```text
changes
```

Bad:

```text
asdf
```

A commit should represent a meaningful unit of change.

The quality of commit history becomes increasingly important when using:

- `git log`
- `git bisect`
- `git revert`
- `git cherry-pick`
- `git rebase`
- Code review
- Release management

---

# 16. `git commit --amend`

Modify the most recent commit:

```powershell
git commit --amend
```

For example:

```powershell
git add README.md
git commit --amend
```

This replaces the previous commit with a new commit.

The commit ID changes.

Therefore:

```text
Old commit
     ↓
amend
     ↓
New commit
```

This is history rewriting.

Avoid amending commits that have already been shared when doing so would disrupt collaborators.

---

# 17. `git log`

View commit history:

```powershell
git log
```

Typical information:

```text
commit <hash>
Author: ...
Date: ...

    Commit message
```

A commit has a unique object ID.

Modern Git commonly uses SHA-1 or can use SHA-256 repositories depending on repository configuration.

The important concept is:

```text
Commit ID
    ↓
Identifies a specific Git object
```

---

# 18. Compact History

Use:

```powershell
git log --oneline
```

Example:

```text
a13f8d2 Add authentication
6c81e90 Add database layer
9f21c31 Initial commit
```

This is easier to scan than the full log.

---

# 19. Graph History

Use:

```powershell
git log --oneline --graph --decorate --all
```

This displays branch relationships.

Example:

```text
* a13f8d2 Add feature
| * b72c110 Experimental work
|/
* 6c81e90 Base implementation
* 9f21c31 Initial commit
```

This becomes extremely valuable once you learn branching and merging.

---

# 20. `HEAD`

`HEAD` is a symbolic reference representing the current checkout position.

In a normal branch checkout:

```text
HEAD
 │
 ▼
main
 │
 ▼
commit
```

Conceptually:

```text
HEAD
  │
  ▼
refs/heads/main
  │
  ▼
commit A
```

You can inspect it with:

```powershell
git symbolic-ref HEAD
```

Example:

```text
refs/heads/main
```

You can also inspect the commit it points to:

```powershell
git rev-parse HEAD
```

---

# 21. `git branch`

List local branches:

```powershell
git branch
```

Example:

```text
* main
  feature
  development
```

The `*` identifies the current branch.

List all local and remote-tracking branches:

```powershell
git branch --all
```

List remote-tracking branches:

```powershell
git branch --remotes
```

---

# 22. Creating a Branch

Create a branch:

```powershell
git branch feature-login
```

This creates a branch reference.

It does not automatically switch to it.

Switch:

```powershell
git switch feature-login
```

or create and switch:

```powershell
git switch -c feature-login
```

This distinction is important.

```text
git branch
    ↓
create branch

git switch
    ↓
move to branch
```

---

# 23. `git switch`

Switch branches:

```powershell
git switch main
```

Create and switch:

```powershell
git switch -c feature-auth
```

`git switch` was introduced to provide a more focused interface for branch switching and creation.

Older Git workflows commonly used:

```powershell
git checkout
```

for both branch operations and file restoration.

Modern Git provides more specialized commands:

```text
git switch
git restore
```

---

# 24. `git restore`

Restore working-tree content:

```powershell
git restore file.js
```

This can discard unstaged changes to that file.

That makes it potentially destructive.

To restore a staged file from the index while keeping its working-tree content:

```powershell
git restore --staged file.js
```

This removes it from the staging area.

The file itself is not deleted.

---

# 25. `git restore --staged`

Suppose:

```powershell
git add app.js
```

Then you realize it should not be part of the next commit.

Run:

```powershell
git restore --staged app.js
```

Conceptually:

```text
Before:

Working Tree
     │
     ▼
   Index
     │
     ▼
   Commit


After restore --staged:

Working Tree
     │
     ▼
   Index
     │
     ▼
   Commit
```

The staged change is removed from the index.

The working-tree modification remains.

---

# 26. `git rm`

Remove a tracked file:

```powershell
git rm file.js
```

This removes the file from the working tree and stages its deletion.

For a staged removal:

```text
Working Tree
     │
     ▼
Deleted
     │
     ▼
Index records deletion
```

Commit afterward:

```powershell
git commit -m "Remove obsolete file"
```

---

# 27. `git mv`

Rename or move a tracked file:

```powershell
git mv old.js new.js
```

Git stages the rename operation.

Conceptually:

```text
old.js
  ↓
git mv
  ↓
new.js
```

Git internally tracks content and paths rather than storing a magical "rename object."

Rename detection is largely a comparison/detection mechanism.

This becomes important when studying Git internals.

---

# 28. `git show`

Show an object, commonly the latest commit:

```powershell
git show
```

Show a particular commit:

```powershell
git show <commit>
```

For example:

```powershell
git show HEAD
```

This can show:

- Commit metadata
- Commit message
- Patch
- Parent information

It is useful when inspecting exactly what a commit contains.

---

# 29. `git remote`

List configured remotes:

```powershell
git remote
```

More detailed:

```powershell
git remote -v
```

Example:

```text
origin  https://example.com/repository.git (fetch)
origin  https://example.com/repository.git (push)
```

A remote is a named reference to another repository.

The common default name is:

```text
origin
```

but Git does not require that name.

---

# 30. `git remote add`

Add a remote:

```powershell
git remote add origin <remote-url>
```

Example:

```powershell
git remote add origin https://example.com/user/project.git
```

Verify:

```powershell
git remote -v
```

Adding a remote does not upload your commits.

It only records information about the remote repository.

---

# 31. `git fetch`

Download information from a remote:

```powershell
git fetch origin
```

Fetch generally updates remote-tracking references and downloads required Git objects.

It does not normally merge remote changes into your current branch.

Conceptually:

```text
Remote Repository
       │
       │ fetch
       ▼
Local Git Repository
       │
       ▼
Remote-tracking refs
```

This is different from `git pull`.

---

# 32. `git pull`

Pull integrates changes from a remote into the current branch according to the configured pull strategy.

Commonly:

```text
fetch
+
merge
```

or, when configured:

```text
fetch
+
rebase
```

Run:

```powershell
git pull
```

Do not think of `pull` as a primitive operation.

It is a higher-level integration operation.

---

# 33. `git push`

Upload local commits/references to a remote:

```powershell
git push
```

For a new branch:

```powershell
git push -u origin feature-auth
```

The `-u` option establishes an upstream tracking relationship.

Then future pushes can often use:

```powershell
git push
```

instead of specifying the remote and branch every time.

---

# 34. `git clone`

Clone an existing repository:

```powershell
git clone <repository-url>
```

Example:

```powershell
git clone https://example.com/project.git
```

Conceptually:

```text
Remote Repository
       │
       │ clone
       ▼
Local Repository
       +
Working Tree
       +
Remote Configuration
```

A clone generally creates:

- A working tree
- A local Git repository
- Remote configuration
- Remote-tracking information

---

# 35. `git fetch` vs `git pull`

These should not be confused.

### Fetch

```powershell
git fetch
```

Downloads remote updates without integrating them into your current branch.

### Pull

```powershell
git pull
```

Fetches and then integrates according to the configured strategy.

Conceptually:

```text
git fetch

Remote
  ↓
Local remote-tracking refs


git pull

Remote
  ↓
Fetch
  ↓
Integration
  ↓
Current branch
```

---

# 36. `git reset`

`git reset` moves references and/or changes the index and working tree depending on the mode.

The three primary modes are:

```text
--soft
--mixed
--hard
```

Default mode is:

```text
--mixed
```

Example:

```powershell
git reset --soft HEAD~1
```

Moves the branch back while preserving changes staged.

```powershell
git reset HEAD~1
```

typically means mixed reset.

It moves the branch and resets the index while leaving working-tree files changed.

```powershell
git reset --hard HEAD~1
```

can discard working-tree changes.

`--hard` is destructive and requires caution.

---

# 37. `git revert`

Create a new commit that reverses the effect of an earlier commit:

```powershell
git revert <commit>
```

This does not remove the original commit from history.

Conceptually:

```text
A
│
B   ← original change
│
C   ← revert of B
```

This is usually safer for already-shared history than rewriting history.

---

# 38. `git clean`

Remove untracked files:

```powershell
git clean
```

Do not run it blindly.

Preview first:

```powershell
git clean -n
```

or:

```powershell
git clean --dry-run
```

Then, if appropriate:

```powershell
git clean -f
```

Directories require additional options.

For example:

```powershell
git clean -fd
```

This can permanently remove untracked content.

---

# 39. `git tag`

Create a tag:

```powershell
git tag v1.0.0
```

List tags:

```powershell
git tag
```

Annotated tag:

```powershell
git tag -a v1.0.0 -m "Release 1.0.0"
```

Tags are references commonly used to identify important points in history.

Examples:

```text
v1.0.0
v1.1.0
v2.0.0
```

---

# 40. `git blame`

Show which commit last changed each line:

```powershell
git blame file.js
```

Example concept:

```text
commit-id  Author  line content
abc123     Alice   const port = 3000;
def456     Bob     app.listen(port);
```

It answers:

> Which commit last modified this line?

It should not be interpreted as a tool for assigning personal responsibility or blame.

It is primarily a history investigation tool.

---

# 41. `git bisect`

Git can perform a binary search through history to locate the commit that introduced a bug.

Start:

```powershell
git bisect start
```

Mark current commit as bad:

```powershell
git bisect bad
```

Mark a known-good commit:

```powershell
git bisect good <commit>
```

Git checks out an intermediate commit.

You test the application and tell Git:

```powershell
git bisect good
```

or:

```powershell
git bisect bad
```

Git continues narrowing the range.

Finish:

```powershell
git bisect reset
```

Conceptually:

```text
Good ───────────────────── Bad
          │
          ▼
       midpoint
          │
      good/bad?
          │
          ▼
       midpoint
          │
          ▼
        repeat
```

This is one of Git's most powerful debugging features.

---

# 42. `git reflog`

Git maintains reflogs for certain references.

View:

```powershell
git reflog
```

Reflogs record movements such as:

```text
checkout
commit
reset
rebase
merge
```

Conceptually:

```text
HEAD
 │
 ├── commit A
 ├── commit B
 ├── reset
 ├── commit C
 └── ...
```

Reflog is extremely useful when recovering from accidental:

```text
reset
rebase
branch movement
```

It is one of the most important recovery mechanisms in Git.

---

# 43. `git fsck`

Check repository object connectivity and validity:

```powershell
git fsck
```

This is an advanced diagnostic command.

It can help identify:

- Unreachable objects
- Corrupted objects
- Repository connectivity problems

Do not use it as your first troubleshooting command.

For ordinary history recovery, inspect:

```powershell
git reflog
```

first.

---

# 44. `git grep`

Search tracked repository content:

```powershell
git grep "TODO"
```

Search a specific path:

```powershell
git grep "TODO" -- src/
```

This can be useful because Git understands the repository's tracked content.

---

# 45. `git ls-files`

List files known to Git:

```powershell
git ls-files
```

This is different from:

```powershell
dir
```

or:

```powershell
Get-ChildItem
```

The shell command lists filesystem content.

`git ls-files` displays paths known to Git's index.

This distinction becomes important when learning the staging area.

---

# 46. `git rev-parse`

`git rev-parse` is an advanced plumbing-oriented command frequently used by scripts.

Repository root:

```powershell
git rev-parse --show-toplevel
```

Git directory:

```powershell
git rev-parse --git-dir
```

Current commit:

```powershell
git rev-parse HEAD
```

Check working tree:

```powershell
git rev-parse --is-inside-work-tree
```

This command is extremely useful for Git automation and debugging.

---

# 47. `git cat-file`

Inspect Git objects:

```powershell
git cat-file -t <object>
```

Get object type:

```text
commit
tree
blob
tag
```

Inspect object content:

```powershell
git cat-file -p <object>
```

For example:

```powershell
git cat-file -t HEAD
```

might return:

```text
commit
```

This is an important bridge between everyday Git commands and Git internals.

---

# 48. `git hash-object`

Create or inspect Git object IDs from content:

```powershell
git hash-object file.txt
```

This demonstrates an important Git concept:

```text
Content
   │
   ▼
Hash
   │
   ▼
Object identity
```

This command belongs more to Git's plumbing layer than everyday porcelain usage.

It will be studied in depth later.

---

# 49. Porcelain vs Plumbing

Git commands can broadly be understood as:

```text
Porcelain
   ↓
High-level user interface

Plumbing
   ↓
Low-level repository operations
```

Examples of porcelain-oriented commands:

```text
git status
git add
git commit
git switch
git merge
git restore
```

Examples associated with lower-level repository operations:

```text
git cat-file
git hash-object
git update-ref
git rev-parse
```

Do not treat this distinction as an absolute classification for every command.

It is primarily a useful conceptual model.

---

# 50. Basic Workflow

A typical local workflow:

```text
Create project
      │
      ▼
git init
      │
      ▼
Create / modify files
      │
      ▼
git status
      │
      ▼
git add
      │
      ▼
git diff --cached
      │
      ▼
git commit
      │
      ▼
git log
```

For collaboration:

```text
git clone
     │
     ▼
modify files
     │
     ▼
git add
     │
     ▼
git commit
     │
     ▼
git pull / fetch
     │
     ▼
resolve/integrate
     │
     ▼
git push
```

---

# 51. First Complete Practice

Create a test repository:

```powershell
mkdir git-first-test
cd git-first-test
git init
```

Check:

```powershell
git status
```

Create a file:

```powershell
New-Item README.md -ItemType File
```

Check:

```powershell
git status
```

Stage:

```powershell
git add README.md
```

Check:

```powershell
git status
```

Inspect the staged content:

```powershell
git diff --cached
```

Commit:

```powershell
git commit -m "Initial commit"
```

Check:

```powershell
git status
```

View history:

```powershell
git log --oneline
```

---

# 52. Modify the File

Add some content to `README.md`.

Then:

```powershell
git status
```

View the unstaged changes:

```powershell
git diff
```

Stage:

```powershell
git add README.md
```

View staged changes:

```powershell
git diff --cached
```

Commit:

```powershell
git commit -m "Update README"
```

View history:

```powershell
git log --oneline
```

Now you have:

```text
Initial commit
      │
      ▼
Update README
```

---

# 53. Safe vs Destructive Commands

Understand the risk level of commands.

Generally informational:

```text
git status
git log
git diff
git show
git branch
git remote -v
```

State-changing but generally recoverable:

```text
git add
git commit
git switch
git merge
git fetch
git pull
git push
```

Potentially destructive:

```text
git restore
git reset
git reset --hard
git clean
git rebase
```

History rewriting:

```text
git commit --amend
git reset
git rebase
git cherry-pick
```

This does not mean the commands are inherently dangerous.

It means you should understand exactly what state they modify before using them.

---

# 54. The Four Questions to Ask About Every Git Command

When learning a Git command, ask:

## 1. What does it read?

Example:

```powershell
git diff
```

reads differences between Git states.

## 2. What does it modify?

Example:

```powershell
git add
```

modifies the index.

## 3. Does it create a commit?

For example:

```text
git add
    → No

git commit
    → Yes
```

## 4. Can it rewrite or destroy history/data?

For example:

```text
git status
    → No

git reset --hard
    → Potentially destructive
```

This approach is much more useful than memorizing syntax.

---

# 55. Core Command Map

```text
Installation
│
└── git --version

Repository
│
├── git init
├── git clone
└── git status

Working Tree
│
├── git diff
├── git restore
├── git clean
├── git rm
└── git mv

Index
│
├── git add
├── git restore --staged
└── git diff --cached

History
│
├── git log
├── git show
├── git blame
├── git bisect
└── git reflog

Branches
│
├── git branch
├── git switch
├── git merge
└── git rebase

Remote
│
├── git remote
├── git fetch
├── git pull
└── git push

Recovery / Internals
│
├── git reflog
├── git fsck
├── git rev-parse
├── git cat-file
└── git hash-object
```

---

# 56. Final Mental Model

The most important command relationships are:

```text
                 WORKING TREE
                      │
                      │ git add
                      ▼
                    INDEX
                      │
                      │ git commit
                      ▼
                 REPOSITORY
                      │
             git push │ git fetch
                      ▼
                 REMOTE
```

For history:

```text
commit
  │
  ▼
branch reference
  │
  ▼
HEAD
```

For recovery:

```text
HEAD movement
     │
     ▼
reflog
     │
     ▼
possible recovery
```

For internals:

```text
commit
  │
  ├── tree
  │    ├── blob
  │    ├── blob
  │    └── tree
  │
  └── parent commit
```

These concepts are the foundation for everything that follows.

---

# 57. Commands You Should Be Comfortable With

Before leaving setup, you should be comfortable running:

```powershell
git --version
git help
git init
git status
git status --short
git add
git diff
git diff --cached
git commit
git log
git log --oneline
git branch
git switch
git restore
git rm
git mv
git show
git remote
git fetch
git pull
git push
git clone
git tag
git blame
git bisect
git reflog
git rev-parse
```

You do **not** need to memorize every option yet.

Understand the state transition each command performs.

---

# 58. Setup Section Complete

The setup section has now established:

```text
00_setup/
│
├── README.md
├── install-git.md
├── configure-git.md
└── first-commands.md
```

You now have the environment and conceptual foundation required for the next section:

```text
01_git_fundamentals/
```

The next topic should be:

```text
01_git_fundamentals/README.md
```

which will establish the deeper Git model before individual fundamentals are covered.

# `git clone`

`git clone` creates a new local Git repository by copying an existing repository.

It is primarily used when you want to obtain an existing Git repository from:

```text
remote server
another local repository
filesystem
network location
```

The clone operation creates a new repository, configures a remote, downloads repository data, and normally checks out a working tree.

---

# 1. Basic Syntax

```cmd
git clone <repository>
```

Example:

```cmd
git clone https://github.com/user/project.git
```

Git normally creates:

```text
project/
├── .git/
├── source files
└── ...
```

---

# 2. Clone Workflow

Conceptually:

```text
existing repository
        │
        │ git clone
        ▼
local repository
        │
        ├── Git objects
        ├── references
        ├── remote configuration
        └── working tree
```

The default remote created by `git clone` is normally:

```text
origin
```

---

# 3. What `git clone` Does

A normal clone generally performs these operations:

```text
1. creates the destination directory
2. initializes Git repository metadata
3. configures the origin remote
4. obtains repository objects
5. creates remote-tracking references
6. determines the remote's default branch
7. creates/checks out the corresponding local branch
```

The exact behavior depends on options and repository configuration.

---

# 4. HTTPS Clone

Example:

```cmd
git clone https://github.com/user/project.git
```

The remote is configured as:

```text
origin
```

Inspect it:

```cmd
git remote -v
```

---

# 5. SSH Clone

Example:

```cmd
git clone git@github.com:user/project.git
```

SSH authentication is used instead of HTTPS authentication.

The resulting remote is still normally:

```text
origin
```

---

# 6. Clone Into a Specific Directory

Syntax:

```cmd
git clone <repository> <directory>
```

Example:

```cmd
git clone https://github.com/user/project.git my-project
```

Instead of using the repository's default name, Git creates:

```text
my-project/
```

---

# 7. Clone the Current Directory

You can clone into an existing directory when that directory is suitable for cloning.

Example:

```cmd
git clone https://github.com/user/project.git .
```

The destination is:

```text
.
```

meaning the current directory.

The directory generally needs to satisfy Git's requirements for a valid clone destination.

---

# 8. Clone a Specific Branch

Syntax:

```cmd
git clone --branch <branch> <repository>
```

Short form:

```cmd
git clone -b <branch> <repository>
```

Example:

```cmd
git clone -b develop https://github.com/user/project.git
```

Git checks out the specified branch after cloning.

---

# 9. Clone a Tag

`--branch` can also select a tag:

```cmd
git clone --branch v1.0.0 https://github.com/user/project.git
```

Git checks out the tag.

Because a tag normally does not move like a branch, the resulting checkout is generally in a detached `HEAD` state.

---

# 10. Clone a Remote Branch as a Local Tracking Branch

When cloning a branch such as:

```cmd
git clone -b develop <repository>
```

Git normally creates a local:

```text
develop
```

branch that tracks:

```text
origin/develop
```

Conceptually:

```text
develop
   │
   └── upstream → origin/develop
```

---

# 11. `--single-branch`

Syntax:

```cmd
git clone --single-branch <repository>
```

This limits the clone to the history associated with the selected branch.

Example:

```cmd
git clone --single-branch --branch main https://github.com/user/project.git
```

This can reduce the amount of branch history obtained.

---

# 12. `--no-single-branch`

The opposite behavior can be explicitly requested:

```cmd
git clone --no-single-branch <repository>
```

This allows the clone to obtain histories for multiple branches according to the configured fetch behavior.

---

# 13. Shallow Clone

Syntax:

```cmd
git clone --depth <depth> <repository>
```

Example:

```cmd
git clone --depth 1 https://github.com/user/project.git
```

This creates a shallow repository.

Instead of obtaining the complete reachable history, Git limits the initial history depth.

---

# 14. Depth Example

Full history:

```text
A → B → C → D → E → F
```

With:

```cmd
git clone --depth 1 <repository>
```

the initial history may effectively contain only:

```text
F
```

The repository is therefore shallow.

---

# 15. Check Shallow Status

After cloning:

```cmd
git rev-parse --is-shallow-repository
```

Possible result:

```text
true
```

For a normal complete repository:

```text
false
```

---

# 16. Deepen a Shallow Clone

Add more history:

```cmd
git fetch --deepen=50
```

For example:

```cmd
git fetch --deepen=100
```

This extends the available history.

---

# 17. Convert Shallow to Full

```cmd
git fetch --unshallow
```

This attempts to obtain the complete history.

Afterwards:

```cmd
git rev-parse --is-shallow-repository
```

should normally report:

```text
false
```

assuming the remote provides the complete history.

---

# 18. Shallow Clone Trade-Off

Advantages:

```text
smaller initial download
faster cloning
less local history
useful for CI
```

Disadvantages:

```text
limited history
some operations may be restricted
history traversal can be incomplete
merging older history can be problematic
```

Use shallow clones intentionally.

---

# 19. Clone With No Checkout

Syntax:

```cmd
git clone --no-checkout <repository>
```

Short form:

```cmd
git clone -n <repository>
```

Example:

```cmd
git clone --no-checkout https://github.com/user/project.git
```

Git obtains the repository but does not immediately populate the normal working tree through checkout.

---

# 20. Why Use `--no-checkout`?

Useful for workflows involving:

```text
sparse checkout
large repositories
custom checkout logic
repository inspection
automation
```

For example:

```cmd
git clone --no-checkout <repository>
cd project
git sparse-checkout init
```

---

# 21. Bare Clone

Syntax:

```cmd
git clone --bare <repository>
```

Example:

```cmd
git clone --bare https://example.com/project.git project.git
```

A bare clone contains Git repository data but no normal working tree.

Conceptually:

```text
project.git/
├── HEAD
├── objects/
├── refs/
├── config
└── ...
```

---

# 22. Mirror Clone

Syntax:

```cmd
git clone --mirror <repository>
```

A mirror clone is intended for repository mirroring.

It differs from a normal clone because it mirrors repository references rather than creating a conventional working-tree-oriented clone.

Typical use:

```text
repository backup
repository mirror
migration
server synchronization
```

---

# 23. `--mirror` Implies Bare

A mirror clone is effectively a bare repository configured for mirroring.

Conceptually:

```text
normal clone
    ↓
working tree + repository

bare clone
    ↓
repository only

mirror clone
    ↓
bare repository + mirror-oriented refs
```

---

# 24. Partial Clone

Advanced:

```cmd
git clone --filter=<filter-spec> <repository>
```

Example:

```cmd
git clone --filter=blob:none https://github.com/user/project.git
```

A partial clone allows Git to omit certain objects initially and retrieve them later when required.

---

# 25. `blob:none`

Example:

```cmd
git clone --filter=blob:none <repository>
```

This requests that blob objects not be downloaded initially when possible.

Conceptually:

```text
commits
trees
    ↓
download initially

file contents
blobs
    ↓
obtain when required
```

This can be useful for very large repositories.

---

# 26. `blob:limit`

A filter can specify a blob size threshold.

Example:

```cmd
git clone --filter=blob:limit=1m <repository>
```

The exact filter syntax and behavior depend on Git's partial-clone support and the remote server.

---

# 27. Sparse Checkout

Sparse checkout controls which paths appear in the working tree.

Example workflow:

```cmd
git clone --no-checkout <repository>
cd project
git sparse-checkout init --cone
git sparse-checkout set src docs
```

The repository can contain broader history/object information while the working tree contains selected directories.

---

# 28. Partial Clone vs Sparse Checkout

They solve different problems.

Partial clone:

```text
controls objects transferred
```

Sparse checkout:

```text
controls paths populated in working tree
```

They can be combined.

Example:

```cmd
git clone --filter=blob:none --no-checkout <repository>
```

followed by sparse-checkout configuration.

---

# 29. Clone With a Custom Remote Name

By default:

```text
origin
```

is used.

You can change the initial remote name:

```cmd
git clone -o upstream <repository>
```

Long form:

```cmd
git clone --origin upstream <repository>
```

Then:

```cmd
git remote
```

shows:

```text
upstream
```

instead of:

```text
origin
```

---

# 30. Clone With a Custom Remote

Example:

```cmd
git clone --origin upstream https://example.com/project.git
```

Now references may appear as:

```text
upstream/main
upstream/develop
```

This is useful when the repository's role is more naturally described as `upstream`.

---

# 31. Clone Without Remote Configuration

Advanced:

```cmd
git clone --no-remote <repository>
```

This prevents the usual remote configuration from being created.

This is uncommon and useful only for specialized repository setups.

---

# 32. Clone With Template

Git supports templates:

```cmd
git clone --template=<template-directory> <repository>
```

Example:

```cmd
git clone --template=C:\git-templates\project <repository>
```

The template can provide repository initialization content.

---

# 33. Clone With Reference Repository

Advanced:

```cmd
git clone --reference <local-repository> <repository>
```

Example:

```cmd
git clone --reference C:\git-cache\project <repository>
```

Git can use the local reference repository to reduce object transfer/storage when appropriate.

---

# 34. Reference Clone

The idea is:

```text
existing local repository
          │
          │ object reference
          ▼
new clone
```

Instead of independently obtaining every object from the remote, Git can reuse objects available from the reference repository.

This is useful for large repositories and local caching.

---

# 35. Dissociate Reference Clone

If you want to initially use a reference repository but later make the clone independent:

```cmd
git clone --reference C:\git-cache\project --dissociate <repository>
```

The required objects are copied into the new repository rather than leaving it dependent on the reference repository.

---

# 36. `--dissociate`

Syntax:

```cmd
git clone --dissociate <repository>
```

It is most meaningful when combined with:

```cmd
--reference
```

or related local-object reuse mechanisms.

---

# 37. Local Repository Clone

Git can clone another local repository.

Example:

```cmd
git clone C:\repositories\project.git
```

or:

```cmd
git clone file:///C:/repositories/project.git
```

This is useful for local testing, backups, and repository duplication.

---

# 38. Local Clone Optimization

When cloning from a local filesystem, Git can optimize object transfer.

Options such as:

```text
--local
--no-local
--no-hardlinks
```

control aspects of this behavior.

---

# 39. `--local`

```cmd
git clone --local C:\repositories\project.git
```

This requests local cloning behavior when cloning from a local repository.

Local clones can use filesystem-level optimizations where supported.

---

# 40. `--no-local`

```cmd
git clone --no-local C:\repositories\project.git
```

This disables the local optimization and uses the normal Git transport mechanism.

This can be useful when you specifically want behavior closer to cloning through a transport.

---

# 41. `--no-hardlinks`

```cmd
git clone --no-hardlinks C:\repositories\project.git
```

For local clones, this prevents Git from using hardlinks for local object reuse.

This can be useful when you want the clone's object storage to be physically independent.

---

# 42. Clone With Depth and Branch

Options can be combined.

Example:

```cmd
git clone --depth 1 --branch main https://github.com/user/project.git
```

This requests:

```text
main branch
shallow history
```

---

# 43. Clone With Depth and Single Branch

```cmd
git clone --depth 1 --single-branch --branch main https://github.com/user/project.git
```

This is common in CI environments where only the current branch and limited history are required.

---

# 44. Clone With Filter and Sparse Checkout

Advanced workflow:

```cmd
git clone --filter=blob:none --no-checkout https://github.com/user/project.git
cd project
git sparse-checkout init --cone
git sparse-checkout set src
```

Conceptually:

```text
large repository
       │
       ├── partial object transfer
       │
       └── selective working tree
```

This can significantly reduce local resource usage for suitable repositories.

---

# 45. Clone With Progress Output

Git normally provides progress information when appropriate.

You can explicitly request progress:

```cmd
git clone --progress <repository>
```

Suppress progress:

```cmd
git clone --quiet <repository>
```

Short form:

```cmd
git clone -q <repository>
```

---

# 46. `--verbose`

```cmd
git clone --verbose <repository>
```

Short form:

```cmd
git clone -v <repository>
```

This increases diagnostic output.

---

# 47. `--quiet`

```cmd
git clone --quiet <repository>
```

Short form:

```cmd
git clone -q <repository>
```

This suppresses normal informational output.

Errors still need to be reported.

---

# 48. Clone Depth by Date

Advanced shallow clone:

```cmd
git clone --shallow-since="2026-01-01" <repository>
```

This requests history newer than the specified date where supported by the remote.

---

# 49. Clone Excluding History Before a Commit

Another shallow mechanism:

```cmd
git clone --shallow-exclude=<revision> <repository>
```

This allows history exclusion based on a revision.

It is an advanced history-retrieval feature.

---

# 50. Multiple Shallow Constraints

Advanced clone configurations can combine shallow options such as:

```text
--depth
--shallow-since
--shallow-exclude
```

These should be used only when you understand the resulting shallow boundary.

---

# 51. Clone With IPv4

Git can be instructed to prefer IPv4:

```cmd
git clone -4 <repository>
```

Long form:

```cmd
git clone --ipv4 <repository>
```

Useful for network environments where IPv6 causes connectivity problems.

---

# 52. Clone With IPv6

```cmd
git clone -6 <repository>
```

Long form:

```cmd
git clone --ipv6 <repository>
```

This requests IPv6 where available.

---

# 53. Clone From a Bundle

Git can clone from a bundle file:

```cmd
git clone project.bundle project
```

A bundle is a portable representation of Git objects and refs that can be transferred without a normal Git server.

This can be useful for offline or restricted environments.

---

# 54. Clone From a Bundle URI

Modern Git versions can support bundle-related optimization mechanisms.

These are primarily useful when a server provides bundle information to accelerate initial object acquisition.

Exact support depends on the remote infrastructure and installed Git version.

---

# 55. Submodules During Clone

A repository can contain submodules.

Basic clone:

```cmd
git clone <repository>
```

may clone the main repository without recursively obtaining all nested submodule working trees.

To initialize and clone submodules recursively:

```cmd
git clone --recurse-submodules <repository>
```

---

# 56. `--recurse-submodules`

Example:

```cmd
git clone --recurse-submodules https://example.com/project.git
```

Conceptually:

```text
main repository
      │
      ├── submodule A
      ├── submodule B
      └── submodule C
```

Git initializes and updates the configured submodules.

---

# 57. Clone Submodules Recursively

For nested submodules:

```cmd
git clone --recurse-submodules <repository>
```

Git recursively initializes nested submodules according to their configuration.

---

# 58. Clone With Submodule Depth

Advanced:

```cmd
git clone --recurse-submodules --shallow-submodules <repository>
```

This requests shallow histories for submodules as well.

---

# 59. Clone Submodules Without Their Full History

The option:

```cmd
git clone --shallow-submodules <repository>
```

is useful when submodule histories do not need to be complete.

This can reduce download size.

---

# 60. Clone With Jobs

When initializing submodules, Git can perform multiple operations in parallel.

Example:

```cmd
git clone --recurse-submodules --jobs=4 <repository>
```

Short form:

```cmd
git clone --recurse-submodules --jobs 4 <repository>
```

This can improve performance when many submodules are present.

---

# 61. `--config`

Git allows configuration values to be set during clone:

```cmd
git clone --config <key>=<value> <repository>
```

Example:

```cmd
git clone --config core.autocrlf=true <repository>
```

This can be useful for repository-specific initialization.

---

# 62. Multiple `--config` Options

You can specify multiple configuration values:

```cmd
git clone ^
  --config core.autocrlf=true ^
  --config fetch.prune=true ^
  <repository>
```

In Windows CMD, `^` can be used for line continuation.

The configuration is applied to the new repository.

---

# 63. Clone and Remote URL

After cloning:

```cmd
git remote -v
```

Typical result:

```text
origin  https://example.com/project.git (fetch)
origin  https://example.com/project.git (push)
```

The clone operation automatically establishes this relationship unless remote configuration is disabled.

---

# 64. Clone and Remote-Tracking Branches

After cloning, you may have:

```cmd
git branch -r
```

Output:

```text
origin/main
origin/develop
origin/feature/login
```

These are remote-tracking references.

---

# 65. Clone and Local Branch

After cloning the default branch, you normally have:

```cmd
git branch
```

Example:

```text
* main
```

and:

```cmd
git branch -vv
```

may show:

```text
* main abc1234 [origin/main] Initial state
```

This indicates tracking between:

```text
main
```

and:

```text
origin/main
```

---

# 66. Clone and `origin/HEAD`

The clone normally records the remote's default branch.

You may see:

```text
origin/HEAD -> origin/main
```

Inspect:

```cmd
git symbolic-ref refs/remotes/origin/HEAD
```

---

# 67. Clone and Detached HEAD

If you clone a tag:

```cmd
git clone --branch v1.0.0 <repository>
```

you will commonly get:

```text
HEAD
 ↓
tag commit
```

rather than:

```text
HEAD
 ↓
local branch
```

Check:

```cmd
git status
```

You may see a detached HEAD state.

---

# 68. Clone and Authentication

For HTTPS:

```text
https://...
```

authentication is handled through the configured credential mechanism and hosting provider.

For SSH:

```text
git@...
```

authentication is handled through SSH keys/configuration.

Do not place passwords or tokens directly into clone URLs unless you fully understand the security consequences.

---

# 69. Clone and Credential Helpers

Git can use credential helpers for HTTPS authentication.

Inspect:

```cmd
git config --show-origin --get-all credential.helper
```

Credential management depends on your operating system and Git installation.

---

# 70. Clone and LFS

Repositories using Git LFS may require Git LFS support.

A typical environment has:

```cmd
git lfs install
```

Then clone:

```cmd
git clone <repository>
```

LFS behavior depends on Git LFS installation and repository configuration.

---

# 71. Clone a Large Repository

For large repositories, consider:

```cmd
git clone --filter=blob:none <repository>
```

or:

```cmd
git clone --depth 1 <repository>
```

or:

```cmd
git clone --sparse <repository>
```

depending on what you actually need.

These options solve different problems.

---

# 72. `--sparse`

Modern Git supports:

```cmd
git clone --sparse <repository>
```

This initializes sparse-checkout behavior so that only the top-level files are initially populated in the working tree.

You can then select directories:

```cmd
git sparse-checkout set src docs
```

---

# 73. Sparse Clone Example

```cmd
git clone --sparse https://example.com/large-project.git
cd large-project
git sparse-checkout set backend docs
```

Working tree:

```text
large-project/
├── backend/
├── docs/
└── selected root files
```

rather than necessarily materializing every repository path.

---

# 74. `--also-filter-submodules`

For repositories with submodules, partial clone filters can be applied to submodules when supported.

Example:

```cmd
git clone --filter=blob:none --also-filter-submodules --recurse-submodules <repository>
```

This is an advanced large-repository optimization.

---

# 75. `--remote-submodules`

With:

```cmd
git clone --recurse-submodules --remote-submodules <repository>
```

submodules can be configured to update from their remote-tracking branches rather than simply using the exact recorded submodule commit.

This changes normal submodule update semantics and should be used deliberately.

---

# 76. `--jobs`

The general syntax:

```cmd
git clone --jobs=<n> <repository>
```

is mainly relevant to parallel operations such as submodule fetching.

Example:

```cmd
git clone --recurse-submodules --jobs=8 <repository>
```

---

# 77. Clone Protocol Selection

For advanced environments, Git supports protocol-related configuration and transport options.

Examples include:

```text
https
ssh
file
git
```

The correct protocol depends on:

```text
server configuration
authentication
network policy
security requirements
repository hosting
```

---

# 78. Clone URL Examples

HTTPS:

```text
https://example.com/team/project.git
```

SSH:

```text
git@example.com:team/project.git
```

Local path:

```text
C:\repositories\project.git
```

File URL:

```text
file:///C:/repositories/project.git
```

---

# 79. Clone From a Specific Remote URL

You can clone directly:

```cmd
git clone https://example.com/team/project.git
```

Git does not require a GitHub-style hosting service.

Any compatible Git repository transport can be used.

---

# 80. Clone Does Not Mean Fork

These are different concepts.

```text
git clone
```

creates a local copy.

A hosting-platform:

```text
fork
```

creates another hosted repository under an account/organization.

A common workflow is:

```text
hosted repository
       │
       │ fork
       ▼
your hosted repository
       │
       │ clone
       ▼
your local repository
```

---

# 81. Clone Does Not Automatically Create a Fork

Running:

```cmd
git clone <repository>
```

does not create another server-side repository.

It only creates a local repository.

---

# 82. Clone vs Init

```text
git init
```

starts a new repository from a directory.

```text
git clone
```

copies an existing repository.

Comparison:

```text
git init
existing directory
      ↓
new Git repository


git clone
existing repository
      ↓
new local repository
```

---

# 83. Clone vs Copying the Folder

Do not confuse:

```text
filesystem copy
```

with:

```text
git clone
```

A Git clone understands:

```text
objects
references
remote configuration
branches
repository metadata
```

A simple filesystem copy does not necessarily establish the correct Git repository relationships.

---

# 84. Clone and Object Database

A cloned repository receives Git objects required for the clone.

Objects can include:

```text
commits
trees
blobs
annotated tags
```

The exact set depends on:

```text
depth
filters
branch selection
remote capabilities
clone options
```

---

# 85. Clone and References

A normal clone creates references such as:

```text
refs/remotes/origin/main
```

and usually a local branch:

```text
refs/heads/main
```

The relationship is approximately:

```text
HEAD
 ↓
refs/heads/main
 ↓
commit

refs/remotes/origin/main
 ↓
same or corresponding remote commit
```

---

# 86. Clone and Fetch Refspec

A normal clone configures a fetch refspec similar to:

```text
+refs/heads/*:refs/remotes/origin/*
```

This means remote branches are fetched into:

```text
refs/remotes/origin/*
```

The exact configuration can be inspected with:

```cmd
git config --get-regexp "^remote\."
```

---

# 87. Inspect Clone Configuration

After cloning:

```cmd
git remote -v
```

Then:

```cmd
git config --local --list
```

Then:

```cmd
git branch -vv
```

And:

```cmd
git branch -a
```

These commands reveal the clone's basic topology.

---

# 88. Verify Clone

Immediately after cloning:

```cmd
cd project
git status
git remote -v
git branch -a
git branch -vv
```

This verifies:

```text
working tree
remote
branches
tracking relationship
```

---

# 89. Clone Failure: Existing Directory

A common error occurs when the destination directory already exists and contains incompatible content.

For example:

```cmd
git clone <repository> project
```

when:

```text
project/
```

already contains files.

Choose an appropriate empty/suitable destination or clone into a different directory.

Do not delete an existing project directory blindly.

---

# 90. Clone Failure: Authentication

If cloning over HTTPS or SSH fails, inspect:

```text
URL
credentials
SSH keys
credential helper
network access
repository permissions
```

For SSH, test:

```cmd
ssh -T git@github.com
```

when using GitHub.

For HTTPS, verify your configured credential mechanism and repository access.

---

# 91. Clone Failure: Network

Possible causes:

```text
DNS
proxy
firewall
VPN
server availability
TLS
authentication
network policy
```

Increase diagnostic information when needed:

```cmd
git clone --verbose <repository>
```

Git's transport-specific tracing facilities can provide deeper diagnostics when required.

---

# 92. Clone With Transport Tracing

Advanced diagnostics can use environment variables such as:

```cmd
set GIT_TRACE=1
```

Then:

```cmd
git clone <repository>
```

For deeper HTTP diagnostics, Git provides additional trace facilities, but these can expose sensitive information. Use them carefully and do not share credentials or secrets from trace output.

---

# 93. Clone and File Permissions

A clone creates a working tree according to Git's configuration and the operating system's filesystem semantics.

Executable-bit behavior and filesystem permissions can differ between:

```text
Windows
Linux
macOS
```

Do not assume Unix permission behavior applies directly to Windows.

---

# 94. Clone and Line Endings

On Windows, Git configuration such as:

```cmd
git config --global core.autocrlf true
```

can affect working-tree line endings.

You can configure repository behavior during clone:

```cmd
git clone --config core.autocrlf=true <repository>
```

Be deliberate about line-ending policy in cross-platform projects.

---

# 95. Clone Into a Repository

Do not casually run:

```cmd
git clone <repository>
```

inside another existing Git repository.

You can accidentally create nested repository structures.

First inspect:

```cmd
git rev-parse --show-toplevel
```

when unsure about your current location.

---

# 96. Clone and Nested Repositories

A normal clone produces:

```text
project/
└── .git/
```

If you then clone another repository inside:

```text
project/
└── another-project/
    └── .git/
```

you have nested repositories.

Git treats the inner repository separately.

If the inner repository is intended to be part of the outer project, consider whether it should instead be a submodule or ordinary directory.

---

# 97. Clone Into Parent Directory

Example:

```cmd
cd C:\projects
git clone https://example.com/project.git
```

Result:

```text
C:\projects\project\
```

The repository root is:

```text
C:\projects\project
```

Verify:

```cmd
git -C C:\projects\project rev-parse --show-toplevel
```

---

# 98. `-C` With a Cloned Repository

Git's `-C` option can run a command as though Git were invoked from another directory.

Example:

```cmd
git -C C:\projects\project status
```

This is not a `clone` option, but it is useful immediately after cloning for automation.

---

# 99. Clone in Automation

CI systems often use combinations such as:

```cmd
git clone --depth 1 --single-branch --branch main <repository>
```

or:

```cmd
git clone --filter=blob:none --sparse <repository>
```

The correct choice depends on whether the job needs:

```text
full history
tags
multiple branches
file contents
submodules
```

Do not use shallow/partial options simply because they are faster if the build requires unavailable history or objects.

---

# 100. Clone Strategy

Choose based on requirements.

### Normal development

```cmd
git clone <repository>
```

### Specific branch

```cmd
git clone --branch main <repository>
```

### CI with limited history

```cmd
git clone --depth 1 --single-branch <repository>
```

### Huge repository

```cmd
git clone --filter=blob:none <repository>
```

### Huge repository + limited working tree

```cmd
git clone --filter=blob:none --sparse <repository>
```

### Repository mirror

```cmd
git clone --mirror <repository>
```

### Server-style bare repository

```cmd
git clone --bare <repository>
```

### Repository with submodules

```cmd
git clone --recurse-submodules <repository>
```

---

# 101. Important `git clone` Options

Major options include:

```text
-b <branch>
--branch=<branch>

-o <name>
--origin=<name>

--single-branch
--no-single-branch

--depth=<depth>

--shallow-since=<date>
--shallow-exclude=<revision>

--no-checkout
-n

--bare
--mirror

--filter=<filter-spec>

--sparse

--recurse-submodules
--shallow-submodules
--remote-submodules
--jobs=<n>

--reference=<repository>
--reference-if-able=<repository>
--dissociate

--local
--no-local
--no-hardlinks

--template=<directory>

--config=<key>=<value>

--no-tags
--tags

--origin=<name>

--quiet
--verbose
--progress

-4
-6
```

Available options vary by Git version.

Use:

```cmd
git clone -h
```

for the exact options supported by your installed Git.

---

# 102. Clone Command Structure

General structure:

```text
git clone
    [options]
    <repository>
    [<directory>]
```

Example:

```cmd
git clone --depth 1 --branch main https://example.com/project.git my-project
```

Breakdown:

```text
git
└── clone
    ├── --depth 1
    ├── --branch main
    ├── repository URL
    └── destination directory
```

---

# 103. Advanced Clone Model

Think of clone as:

```text
SOURCE REPOSITORY
       │
       │ object/reference transfer
       ▼
LOCAL GIT REPOSITORY
       │
       ├── objects
       ├── refs
       ├── remote configuration
       ├── HEAD
       └── index
              │
              ▼
         WORKING TREE
```

A clone is therefore more than copying project files.

---

# 104. Clone State After Completion

Typical normal clone:

```text
project/
├── .git/
│   ├── HEAD
│   ├── config
│   ├── index
│   ├── objects/
│   └── refs/
│
├── source files
└── ...
```

And conceptually:

```text
HEAD
 ↓
main
 ↓
commit

main
 ↓
origin/main
```

with the local branch tracking the remote-tracking branch.

---

# 105. Final Mental Model

```text
                    REMOTE REPOSITORY
                           │
                           │
                       git clone
                           │
                           ▼
                  ┌─────────────────┐
                  │ LOCAL REPOSITORY│
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          objects       refs/config    working tree
             │             │             │
             ▼             ▼             ▼
          history      origin/main     files
```

The important distinction is:

```text
git clone
    ↓
obtains an existing repository

git init
    ↓
creates a new repository structure
```

---

# 106. Rules to Remember

```text
1. git clone creates a local copy of an existing Git repository.

2. A normal clone creates a remote named origin.

3. origin is only a conventional name and can be changed.

4. git clone normally creates remote-tracking branches.

5. A normal clone usually creates a local branch tracking
   the remote's default branch.

6. git clone does not create a server-side fork.

7. --branch selects the branch or tag to check out.

8. --depth creates a shallow clone.

9. --single-branch limits fetched branch history.

10. --no-checkout prevents the initial checkout.

11. --bare creates a repository without a working tree.

12. --mirror is designed for repository mirroring.

13. --filter enables partial-clone behavior.

14. --sparse limits the initial working-tree population.

15. Partial clone and sparse checkout solve different problems.

16. --recurse-submodules initializes and fetches submodules.

17. --reference can reuse objects from another local repository.

18. --dissociate can make a reference-based clone independent.

19. --no-hardlinks prevents local object hardlink optimization.

20. git clone can clone from URLs or local repositories.

21. Cloning a tag normally results in detached HEAD.

22. Shallow repositories do not contain complete history.

23. Fetch can later deepen or unshallow a shallow clone.

24. Clone configuration can be inspected with git remote,
    git branch, and git config.

25. Always verify the destination directory before cloning.

26. Do not accidentally create nested repositories.

27. Choose clone options based on what your workflow actually
    needs.

28. git clone copies repository history and metadata—not merely
    the current project files.

29. The resulting repository can be synchronized with its
    remote using git fetch, git pull, and git push.

30. Understand the clone topology before modifying or
    publishing repository history.
```

# Git Branch Strategies

## 1. What Is a Branching Strategy?

A **branching strategy** defines how a team creates, uses, integrates, reviews, and releases Git branches.

A branching strategy answers questions such as:

```text
Where do developers create branches?
Which branch represents production?
How are features developed?
How are changes reviewed?
How are releases created?
How are hotfixes handled?
When are branches deleted?
How are changes merged?
```

A branch strategy is therefore a **workflow model**, not a Git command.

---

# 2. Why Branch Strategies Matter

Without a defined strategy, a team can end up with:

```text
hundreds of long-lived branches
unclear ownership
frequent merge conflicts
unstable main branches
unreviewed production changes
difficult releases
duplicate work
```

A good strategy should optimize for:

```text
fast integration
small changes
clear ownership
easy code review
safe releases
low merge complexity
traceable history
```

---

# 3. Branch Lifetime

Branches generally fall into two categories.

### Short-lived branches

```text
feature/login
fix/payment-timeout
docs/api-reference
```

They exist for a short period and are integrated quickly.

### Long-lived branches

```text
main
develop
release/*
```

They represent persistent stages of development or release management.

Modern teams generally prefer keeping **work branches short-lived**.

---

# 4. Main Branch

A typical repository has:

```text
main
```

The `main` branch generally represents the primary integration or production-ready history.

Example:

```text
main
A ── B ── C ── D
```

Depending on the organization, `main` may represent:

```text
production
production-ready code
latest integrated code
```

Do not assume every organization's `main` has exactly the same meaning.

The branch's meaning is defined by the team's workflow.

---

# 5. Feature Branch Strategy

A feature branch is created for an isolated feature.

Example:

```text
main
A ── B ── C
         \
          D ── E ← feature/login
```

The developer works on:

```text
feature/login
```

When finished:

```text
feature/login
        ↓
code review
        ↓
merge
        ↓
main
```

---

# 6. Creating a Feature Branch

Start from an updated `main`:

```cmd
git switch main
git pull --ff-only
```

Create:

```cmd
git switch -c feature/login
```

Verify:

```cmd
git branch
```

Work:

```cmd
git add .
git commit -m "Add login flow"
```

Push:

```cmd
git push -u origin feature/login
```

---

# 7. Feature Branch Naming

Common patterns:

```text
feature/login
feature/user-profile
feature/payment-integration
```

Bug fixes:

```text
fix/login-timeout
fix/payment-validation
```

Hotfixes:

```text
hotfix/payment-crash
hotfix/security-patch
```

Chores:

```text
chore/update-dependencies
```

Documentation:

```text
docs/api-reference
```

The exact convention should be standardized within the team.

---

# 8. Feature Branch Lifecycle

A typical lifecycle:

```text
main
 │
 ├── create feature branch
 │
 ↓
feature/login
 │
 ├── development
 ├── commits
 ├── tests
 ├── push
 ├── code review
 │
 ↓
merge
 │
 ↓
main
 │
 ↓
delete feature branch
```

---

# 9. Delete Finished Feature Branches

After successful integration:

```cmd
git switch main
git branch -d feature/login
```

Delete the remote branch:

```cmd
git push origin --delete feature/login
```

Deleting obsolete branches keeps the repository easier to navigate.

---

# 10. Pull Request Workflow

A common team workflow is:

```text
feature branch
      ↓
push
      ↓
Pull Request
      ↓
CI
      ↓
Code Review
      ↓
Approval
      ↓
Merge
      ↓
main
```

The branch itself does not provide code review.

The hosting platform and team workflow provide the review process.

---

# 11. Protecting Main

Teams often protect:

```text
main
```

Typical requirements include:

```text
Pull Request required
CI must pass
required reviewers
no direct pushes
branch must be up to date
status checks required
```

The exact capabilities depend on the hosting platform.

---

# 12. Trunk-Based Development

**Trunk-based development** emphasizes frequent integration into one primary branch.

Conceptually:

```text
             feature
                │
                ↓
main ── A ── B ── C ── D ── E
```

Developers generally use:

```text
very short-lived branches
```

or sometimes commit directly to the trunk in teams that allow it.

The central principle is:

```text
integrate frequently
```

---

# 13. Trunk-Based Development Characteristics

Typical characteristics:

```text
short-lived branches
frequent integration
small commits
strong CI
small pull requests
fast code review
minimal branch divergence
```

This approach aims to reduce long-running branch conflicts.

---

# 14. Feature Flags

Trunk-based development often uses **feature flags**.

Example:

```js
if (featureFlags.newCheckout) {
  newCheckout();
} else {
  oldCheckout();
}
```

The code can be merged before the feature is exposed to users.

Conceptually:

```text
code deployment
      ↓
feature disabled
      ↓
testing
      ↓
feature enabled
```

This separates:

```text
deployment
```

from:

```text
release
```

---

# 15. Git Flow

**Git Flow** is a more structured branching model.

A traditional Git Flow repository commonly has:

```text
main
develop
feature/*
release/*
hotfix/*
```

Conceptually:

```text
main
  ↑
release
  ↑
develop
  ↑
feature
```

It is designed around explicit development and release stages.

---

# 16. Git Flow — Main

```text
main
```

represents production releases.

Example:

```text
main
A ── B ── C
```

Production releases are associated with commits or tags on this branch.

---

# 17. Git Flow — Develop

```text
develop
```

represents the integration branch for upcoming work.

Example:

```text
main
A ── B

develop
     \
      C ── D ── E
```

Feature branches are typically created from `develop`.

---

# 18. Git Flow — Feature

Example:

```text
develop
A ── B
      \
       C ── D ← feature/login
```

After completion:

```text
feature/login
       ↓
develop
```

Then the feature branch can be deleted.

---

# 19. Git Flow — Release

When preparing a release:

```text
develop
A ── B ── C ── D
              \
               R ← release/2.0
```

A release branch can be used for:

```text
release testing
bug fixes
version updates
documentation
release preparation
```

New features generally should not be added to a release branch.

---

# 20. Git Flow — Hotfix

A production bug can be handled with:

```text
main
A ── B ── C
          \
           H ← hotfix/2.0.1
```

After fixing:

```text
hotfix
   ↓
main
```

The fix is also integrated back into the appropriate development branch.

This prevents the production fix from being lost in future development.

---

# 21. Git Flow Structure

Conceptually:

```text
                    release
                   /       \
                  ↓         ↓
feature → develop           main
            ↑                ↑
            └── hotfix ──────┘
```

Git Flow creates more branch types and more process overhead than trunk-based development.

---

# 22. GitHub Flow

A simpler workflow is commonly called **GitHub Flow**.

Typical model:

```text
main
  │
  ├── feature branch
  │
  ↓
Pull Request
  │
  ↓
review + CI
  │
  ↓
main
```

There is usually no permanent `develop` branch.

---

# 23. GitHub Flow Lifecycle

```text
1. Start from main
2. Create branch
3. Make changes
4. Commit
5. Push
6. Open Pull Request
7. Run CI
8. Review
9. Merge
10. Deploy
11. Delete branch
```

This is simpler than traditional Git Flow.

---

# 24. GitLab Flow

GitLab Flow is a family of workflows that combines feature branches with environment or release-oriented branches depending on project requirements.

Possible structure:

```text
main
 ↓
feature/*
 ↓
staging
 ↓
production
```

or another structure appropriate to the deployment model.

The important concept is that branch structure can represent deployment environments or release states when necessary.

---

# 25. Environment Branching

Some organizations maintain branches such as:

```text
development
staging
production
```

Example:

```text
feature
   ↓
development
   ↓
staging
   ↓
production
```

This can be useful in some environments, but it can also introduce synchronization and merge complexity.

Do not create environment branches automatically just because environments exist.

Deployment systems can often manage environments without requiring separate long-lived Git branches.

---

# 26. Release Branch Strategy

A release branch may look like:

```text
main
A ── B ── C ── D
              \
               R ── R1 ── R2
```

Typical purpose:

```text
stabilize release
fix release-specific bugs
prepare release metadata
run final validation
```

After release:

```text
release
   ↓
main
```

---

# 27. Release Branch Rules

Once a release branch is created:

```text
avoid introducing unrelated features
accept only release-relevant fixes
keep changes reviewable
run release validation
tag the release
```

This prevents the release branch from becoming another development branch.

---

# 28. Hotfix Strategy

A hotfix is an urgent production fix.

Example:

```text
main
A ── B ── C
          \
           H
```

Create:

```cmd
git switch main
git pull --ff-only
git switch -c hotfix/payment-crash
```

Fix:

```cmd
git add .
git commit -m "Fix payment crash"
```

Push:

```cmd
git push -u origin hotfix/payment-crash
```

Then review and merge according to the team's production workflow.

---

# 29. Hotfix Synchronization

The important requirement is:

```text
production fix
      ↓
production branch
      ↓
development history
```

Otherwise future releases can accidentally reintroduce the bug.

The exact synchronization mechanism depends on the branch strategy.

---

# 30. Branch Strategy Comparison

| Strategy             | Main Idea                             | Branch Complexity | Integration Frequency |
| -------------------- | ------------------------------------- | ----------------: | --------------------: |
| Feature branches     | Isolate work                          |               Low |                  High |
| GitHub Flow          | PR → main                             |               Low |                  High |
| Trunk-based          | Integrate continuously                |          Very Low |             Very High |
| Git Flow             | Explicit development/release branches |              High |              Moderate |
| Environment branches | Branches represent environments       |       Medium–High |                Varies |

---

# 31. Short-Lived vs Long-Lived Branches

### Short-lived

```text
feature/login
fix/cache-bug
docs/api
```

Advantages:

```text
less divergence
smaller conflicts
faster review
easier deletion
```

### Long-lived

```text
develop
release/*
environment branches
```

Advantages can include:

```text
explicit release stages
controlled stabilization
organizational separation
```

But they increase synchronization cost.

---

# 32. Branch Divergence

Suppose:

```text
main:
A ── B ── C ── D ── E

feature:
     \
      F ── G ── H
```

The feature branch has diverged significantly.

The longer it stays separate:

```text
more main changes
        +
more feature changes
        ↓
larger integration surface
        ↓
higher conflict probability
```

---

# 33. Keep Branches Close to Main

One strategy is to periodically integrate updated `main`.

For example:

```cmd
git switch feature/login
git fetch origin
git merge origin/main
```

Resolve conflicts early.

Run tests.

Continue development.

This prevents all integration work from accumulating until the end.

---

# 34. Rebase-Based Feature Workflow

Some teams prefer rebasing feature branches.

Example:

```cmd
git switch feature/login
git fetch origin
git rebase origin/main
```

Conceptually:

```text
Before:

main:
A ── B ── C

feature:
     \
      D ── E


After rebase:

A ── B ── C ── D' ── E'
```

The feature commits receive new identities.

---

# 35. Rebase Policy

A team must clearly define whether developers may rebase shared branches.

Safe principle:

```text
rebase your own unpublished/private work
```

Be careful with:

```text
shared branches
public branches
branches other developers use
```

because rebase rewrites commit history.

---

# 36. Merge Policy

A team should decide whether Pull Requests use:

```text
merge commits
squash merges
rebase merges
```

Each produces different history.

---

# 37. Merge Commit

A merge commit preserves both histories.

Example:

```text
      D ── E
     /      \
A ── B ───── M
```

Advantages:

```text
preserves topology
shows explicit integration
```

Disadvantages:

```text
can produce noisier history
```

---

# 38. Squash Merge

Multiple feature commits:

```text
D ── E ── F
```

can become one commit:

```text
S
```

Result:

```text
main
A ── B ── S
```

Advantages:

```text
clean main history
one logical change
easy rollback of the feature
```

Disadvantages:

```text
individual feature commit history is not preserved on main
```

The original branch commits may still exist until garbage collection if references to them disappear.

---

# 39. Rebase Merge

A feature branch can be rebased and then integrated without creating a merge commit when the resulting history is linear.

Example:

```text
A ── B ── C ── D' ── E'
```

This creates a clean linear history.

---

# 40. Fast-Forward

If the target branch has not advanced:

```text
main:
A ── B

feature:
     \
      C ── D
```

Actually the graph is:

```text
A ── B ── C ── D
```

and `main` simply points at `B`.

A fast-forward can move:

```text
main: B → D
```

without creating a merge commit.

Command:

```cmd
git merge --ff-only feature
```

---

# 41. No-Fast-Forward

A team may require an explicit merge commit:

```cmd
git merge --no-ff feature/login
```

This preserves a visible merge boundary:

```text
      C ── D
     /      \
A ── B ───── M
```

This is a policy choice.

---

# 42. Squash vs Merge vs Rebase

| Method | Main History    | Feature Commits   |
| ------ | --------------- | ----------------- |
| Merge  | Graph preserved | Preserved         |
| Squash | Linear/simple   | Combined into one |
| Rebase | Linear          | Rewritten         |

The correct choice depends on the team's history and release requirements.

---

# 43. Monorepo Branching

A monorepo may contain:

```text
frontend/
backend/
services/
packages/
infrastructure/
```

All projects share one Git repository.

A common strategy is still:

```text
main
 ├── feature/frontend-login
 ├── feature/backend-auth
 └── fix/shared-library
```

Do not automatically create one permanent branch per application.

---

# 44. Large Teams

Large teams should generally optimize for:

```text
small branches
small PRs
automated CI
clear ownership
frequent integration
branch protection
automated testing
```

Large branch structures can become expensive to maintain.

---

# 45. Open Source Workflow

A common open-source model is:

```text
upstream repository
        ↑
Pull Request
        ↑
fork
        ↑
developer branch
```

Conceptually:

```text
upstream/main
       ↑
       │ Pull Request
       │
fork/feature
```

The contributor may not have direct write access to the upstream repository.

---

# 46. Fork-Based Development

Typical workflow:

```cmd
git clone <fork>
git remote add upstream <upstream-repository>
```

Check:

```cmd
git remote -v
```

Synchronize:

```cmd
git fetch upstream
```

Create work:

```cmd
git switch -c feature/my-change
```

Push to your fork:

```cmd
git push -u origin feature/my-change
```

Then open a Pull Request against the upstream repository.

---

# 47. Branch Protection and Strategy

A branching strategy becomes significantly safer when protected by repository rules.

Typical rules:

```text
main:
    no direct push
    PR required
    CI required
    review required
```

Feature branches:

```text
developer-controlled
```

Release branches:

```text
restricted access
```

The exact rules should reflect the team's risk profile.

---

# 48. CI and Branching

A strong workflow connects branches to CI.

Example:

```text
push
 ↓
lint
 ↓
type-check
 ↓
unit tests
 ↓
integration tests
 ↓
build
 ↓
security checks
```

Only after successful validation should the branch be eligible for integration.

---

# 49. Branch Strategy and Deployment

One possible modern model:

```text
feature branch
       ↓
Pull Request
       ↓
CI
       ↓
main
       ↓
deployment pipeline
       ↓
production
```

Notice that:

```text
Git branch
```

does not necessarily need to represent:

```text
deployment environment
```

Modern CI/CD can manage environments independently.

---

# 50. Branch Strategy Anti-Patterns

Avoid:

```text
permanent feature branches
```

when they are no longer needed.

Avoid:

```text
huge feature branches
```

Avoid:

```text
merging without tests
```

Avoid:

```text
direct production changes
```

without traceability.

Avoid:

```text
branching for every tiny change
```

when the team's workflow does not benefit from it.

---

# 51. The "Never Merge" Branch

A branch that exists for months and is continuously rebased or merged can become:

```text
feature
 ├── dozens of commits
 ├── hundreds of files
 ├── conflicts
 └── unknown integration state
```

This is usually a sign that the work should be decomposed.

---

# 52. Decompose Large Features

Instead of:

```text
feature/complete-ecommerce-system
```

use smaller units:

```text
feature/product-api
feature/cart-api
feature/checkout-ui
feature/payment-service
feature/order-history
```

Each change can be integrated independently.

---

# 53. Dependency-Aware Branching

Sometimes feature B depends on feature A.

Example:

```text
feature/auth
     ↓
feature/profile
     ↓
feature/settings
```

Avoid merging dependent branches blindly.

A better strategy may be:

```text
feature/auth
      ↓
main
      ↓
feature/profile
```

when possible.

This reduces hidden branch dependencies.

---

# 54. Stacked Branches

Advanced teams may intentionally stack branches:

```text
main
 │
 └── feature/A
       │
       └── feature/B
             │
             └── feature/C
```

Each branch depends on the previous branch.

This can allow large work to be reviewed as smaller pieces.

But it requires disciplined rebasing and branch management.

---

# 55. Branch Ownership

Teams should know:

```text
who owns the branch
what branch it started from
what it contains
where it will merge
when it should be deleted
```

A Pull Request should make these relationships obvious.

---

# 56. Branch Naming as Information

A good branch name communicates intent:

```text
feature/oauth-login
fix/cache-invalidation
hotfix/payment-crash
docs/api-authentication
chore/update-node
```

Avoid vague names:

```text
test
new
changes
branch1
stuff
final
final2
```

---

# 57. Branch Strategy for Solo Projects

For a solo developer, a simple model is usually enough:

```text
main
  │
  ├── feature/*
  ├── fix/*
  └── hotfix/*
```

Workflow:

```text
main
 ↓
feature branch
 ↓
test
 ↓
merge
 ↓
main
```

Git Flow is often unnecessary for small personal projects.

---

# 58. Branch Strategy for Small Teams

A practical model:

```text
main
 ├── feature/*
 ├── fix/*
 └── hotfix/*
```

with:

```text
Pull Requests
CI
branch protection
code review
```

This is often simpler than maintaining:

```text
main
develop
release
staging
production
```

unless those branches solve a real operational requirement.

---

# 59. Branch Strategy for High-Risk Systems

Systems with strict release controls may need:

```text
main
release/*
hotfix/*
```

plus:

```text
required reviews
automated testing
security validation
release approvals
signed commits/tags
audit trails
```

The branching model should follow operational requirements rather than tradition.

---

# 60. Branch Strategy Selection

Choose based on:

```text
team size
release frequency
deployment model
regulatory requirements
CI maturity
code review process
risk tolerance
repository size
number of contributors
```

Do not choose Git Flow simply because it is popular.

---

# 61. Simple Decision Model

If you deploy frequently:

```text
trunk-based / short-lived feature branches
```

If you need explicit release stabilization:

```text
release branches may help
```

If you have complex scheduled releases:

```text
Git Flow-like structures may be appropriate
```

If you are working alone:

```text
simple feature branches are usually enough
```

---

# 62. Modern Default

A strong default for many software teams is:

```text
main
 │
 ├── feature/*
 ├── fix/*
 └── hotfix/*
```

combined with:

```text
short-lived branches
Pull Requests
CI
branch protection
frequent integration
automated deployment
```

This minimizes branching complexity while preserving review and safety.

---

# 63. Example Professional Workflow

Start:

```cmd
git switch main
git pull --ff-only
```

Create:

```cmd
git switch -c feature/user-authentication
```

Work:

```cmd
git add .
git commit -m "Add user authentication"
```

Push:

```cmd
git push -u origin feature/user-authentication
```

Open Pull Request.

CI runs.

Review happens.

After approval:

```text
feature/user-authentication
             ↓
            main
```

Delete:

```cmd
git switch main
git pull --ff-only
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

---

# 64. Golden Rules

```text
1. Keep work branches short-lived.
2. Keep commits focused.
3. Integrate frequently.
4. Protect important branches.
5. Require automated validation.
6. Review changes before integration.
7. Avoid unnecessary long-lived branches.
8. Delete obsolete branches.
9. Do not rewrite shared history casually.
10. Make the branch strategy match the delivery model.
```

---

# 65. Advanced Mental Model

Think of branching as an integration topology:

```text
                  feature
                     │
                     ↓
main ────────────────●──────────────
                     │
                     ↓
                   merge
```

Every additional long-lived branch creates another synchronization boundary.

Therefore:

```text
more branches
      ↓
more synchronization
      ↓
more divergence
      ↓
more integration complexity
```

The goal is not:

```text
maximum number of branches
```

The goal is:

```text
controlled isolation
+
fast integration
+
safe delivery
```

---

# 66. Strategy Summary

### Feature Branching

```text
main
 └── feature/*
```

Best for:

```text
small teams
individual features
Pull Request workflows
```

### GitHub Flow

```text
main
 └── short-lived branch
          ↓
         PR
          ↓
         main
```

Best for:

```text
continuous delivery
frequent deployment
simple workflows
```

### Trunk-Based Development

```text
main
 ↑ ↑ ↑ ↑
small changes
```

Best for:

```text
high integration frequency
strong CI/CD
continuous delivery
```

### Git Flow

```text
main
develop
feature/*
release/*
hotfix/*
```

Best when:

```text
explicit release management
scheduled releases
release stabilization
```

### Environment Branching

```text
development
     ↓
staging
     ↓
production
```

Best only when the branch model genuinely provides operational value.

---

# 67. Final Principle

A branching strategy should make this path predictable:

```text
IDEA
 ↓
BRANCH
 ↓
COMMIT
 ↓
PUSH
 ↓
REVIEW
 ↓
CI
 ↓
INTEGRATION
 ↓
RELEASE
 ↓
PRODUCTION
```

The best strategy is usually the **simplest strategy that provides the required control, review, release safety, and traceability**.

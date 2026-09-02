/**
 * ============================================================
 * NODE.JS MASTERY - SEMANTIC VERSIONING
 * ============================================================
 *
 * File:
 *     15_npm/semver.js
 *
 * ============================================================
 *
 * WHAT IS SEMVER?
 * ============================================================
 *
 * SemVer = Semantic Versioning
 *
 * The standard version format is:
 *
 *     MAJOR.MINOR.PATCH
 *
 *
 * Example:
 *
 *     2.5.3
 *
 *
 *     2  → MAJOR
 *     5  → MINOR
 *     3  → PATCH
 *
 * ============================================================
 *
 * WHY DOES VERSIONING MATTER?
 * ============================================================
 *
 * Node.js projects depend on many packages.
 *
 * When a package releases a new version, we need to know whether
 * the update is:
 *
 *     - Breaking
 *     - Backward compatible
 *     - A bug/security fix
 *
 *
 * Semantic Versioning provides a common convention for this.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. MAJOR.MINOR.PATCH
 * ============================================================
 *
 * Example:
 *
 *     4.7.2
 *
 *
 * MAJOR
 *     4
 *
 * MINOR
 *     7
 *
 * PATCH
 *     2
 *
 * ============================================================
 */

const version = "4.7.2";

const [major, minor, patch] = version.split(".").map(Number);

console.log("Version:", version);
console.log("Major:", major);
console.log("Minor:", minor);
console.log("Patch:", patch);

/*
 * ============================================================
 * 2. PATCH VERSION
 * ============================================================
 *
 * Patch releases are generally for backward-compatible bug
 * fixes.
 *
 *
 * Example:
 *
 *     1.4.0
 *         ↓
 *     1.4.1
 *
 *
 * The API should remain compatible according to SemVer.
 *
 * ============================================================
 */

const patchUpdate = {
  from: "1.4.0",
  to: "1.4.1",
  meaning: "Backward-compatible bug fix",
};

console.log("\nPatch update:");
console.log(patchUpdate);

/*
 * ============================================================
 * 3. MINOR VERSION
 * ============================================================
 *
 * Minor releases are generally for backward-compatible new
 * functionality.
 *
 *
 * Example:
 *
 *     1.4.1
 *         ↓
 *     1.5.0
 *
 *
 * Existing functionality should remain compatible according
 * to SemVer.
 *
 * ============================================================
 */

const minorUpdate = {
  from: "1.4.1",
  to: "1.5.0",
  meaning: "Backward-compatible new functionality",
};

console.log("\nMinor update:");
console.log(minorUpdate);

/*
 * ============================================================
 * 4. MAJOR VERSION
 * ============================================================
 *
 * Major releases may introduce breaking changes.
 *
 *
 * Example:
 *
 *     1.5.0
 *         ↓
 *     2.0.0
 *
 *
 * Code that worked with version 1.x may require changes when
 * moving to version 2.x.
 *
 * ============================================================
 */

const majorUpdate = {
  from: "1.5.0",
  to: "2.0.0",
  meaning: "Potentially breaking changes",
};

console.log("\nMajor update:");
console.log(majorUpdate);

/*
 * ============================================================
 * 5. SEMVER RULE
 * ============================================================
 *
 *
 * MAJOR.MINOR.PATCH
 *    │      │     │
 *    │      │     └── Bug fixes
 *    │      │
 *    │      └──────── New backward-compatible features
 *    │
 *    └─────────────── Breaking changes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. VERSION EXAMPLES
 * ============================================================
 *
 *
 * 1.0.0
 * 1.0.1
 * 1.0.2
 * 1.1.0
 * 1.2.0
 * 2.0.0
 *
 *
 * Progress:
 *
 *
 * 1.0.0
 *   │
 *   └── patch → 1.0.1
 *
 *
 * 1.0.1
 *   │
 *   └── minor → 1.1.0
 *
 *
 * 1.1.0
 *   │
 *   └── major → 2.0.0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. PRE-1.0 VERSIONS
 * ============================================================
 *
 * Versions below 1.0.0 are commonly considered initial
 * development versions.
 *
 *
 * Example:
 *
 *     0.1.0
 *     0.2.0
 *     0.2.1
 *
 *
 * The SemVer specification has special rules for 0.x versions,
 * so do not assume that 0.x behaves exactly like stable 1.x+
 * versions.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. VERSION PREFIX
 * ============================================================
 *
 * npm package versions often appear with:
 *
 *
 *     ^
 *     ~
 *     >
 *     >=
 *     <
 *     <=
 *     =
 *
 *
 * These are version range operators.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. EXACT VERSION
 * ============================================================
 *
 * Example:
 *
 *
 *     "express": "5.1.0"
 *
 *
 * This requests exactly version 5.1.0 in package.json.
 *
 * ============================================================
 */

const exactVersion = "5.1.0";

console.log("\nExact version:", exactVersion);

/*
 * ============================================================
 * 10. CARET ^
 * ============================================================
 *
 * Example:
 *
 *
 *     "^5.1.0"
 *
 *
 * For a normal 5.x release, this generally means:
 *
 *
 *     >= 5.1.0
 *     < 6.0.0
 *
 *
 * Therefore compatible updates within the 5.x major version
 * may be selected.
 *
 * ============================================================
 */

const caretRange = "^5.1.0";

console.log("\nCaret range:", caretRange);

/*
 * ============================================================
 * 11. TILDE ~
 * ============================================================
 *
 * Example:
 *
 *
 *     "~5.1.0"
 *
 *
 * This generally allows patch-level updates:
 *
 *
 *     5.1.0
 *     5.1.1
 *     5.1.2
 *     ...
 *
 *
 * but not normally:
 *
 *
 *     5.2.0
 *
 * ============================================================
 */

const tildeRange = "~5.1.0";

console.log("Tilde range:", tildeRange);

/*
 * ============================================================
 * 12. GREATER THAN
 * ============================================================
 *
 * Example:
 *
 *
 *     ">5.1.0"
 *
 *
 * Means versions greater than 5.1.0.
 *
 * ============================================================
 */

const greaterThan = ">5.1.0";

console.log("Greater than:", greaterThan);

/*
 * ============================================================
 * 13. GREATER THAN OR EQUAL
 * ============================================================
 *
 * Example:
 *
 *
 *     ">=5.1.0"
 *
 *
 * Means:
 *
 *
 *     5.1.0 and newer versions
 *
 * ============================================================
 */

const greaterThanOrEqual = ">=5.1.0";

console.log("Greater than or equal:", greaterThanOrEqual);

/*
 * ============================================================
 * 14. LESS THAN
 * ============================================================
 *
 * Example:
 *
 *
 *     "<6.0.0"
 *
 *
 * Means versions below 6.0.0.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. LESS THAN OR EQUAL
 * ============================================================
 *
 * Example:
 *
 *
 *     "<=5.9.9"
 *
 *
 * Means versions up to and including 5.9.9.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. COMBINING RANGES
 * ============================================================
 *
 * Example:
 *
 *
 *     ">=5.1.0 <6.0.0"
 *
 *
 * This means:
 *
 *
 *     >= 5.1.0
 *     AND
 *     < 6.0.0
 *
 * ============================================================
 */

const combinedRange = ">=5.1.0 <6.0.0";

console.log("\nCombined range:", combinedRange);

/*
 * ============================================================
 * 17. WILDCARD
 * ============================================================
 *
 * Examples:
 *
 *
 *     "5.x"
 *
 *
 * means any 5.x version within the specified range semantics.
 *
 *
 * Another:
 *
 *
 *     "5.1.x"
 *
 *
 * represents patch releases for 5.1.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. STAR *
 * ============================================================
 *
 * Example:
 *
 *
 *     "*"
 *
 *
 * This represents a broad version range.
 *
 *
 * In production dependencies, broad ranges should be used
 * deliberately because they allow many versions.
 *
 * ============================================================
 */

const wildcard = "*";

console.log("Wildcard:", wildcard);

/*
 * ============================================================
 * 19. OR RANGES
 * ============================================================
 *
 * npm/semver supports OR conditions.
 *
 *
 * Example:
 *
 *
 *     ">=5.0.0 <6.0.0 || >=7.0.0 <8.0.0"
 *
 *
 * This allows either range.
 *
 * ============================================================
 */

const orRange = ">=5.0.0 <6.0.0 || >=7.0.0 <8.0.0";

console.log("\nOR range:", orRange);

/*
 * ============================================================
 * 20. HYPHEN RANGE
 * ============================================================
 *
 * A range can also express an interval using a hyphen.
 *
 *
 * Conceptually:
 *
 *
 *     5.1.0 - 5.3.0
 *
 *
 * means a range from 5.1.0 through 5.3.0 according to
 * semver range rules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. PRE-RELEASE VERSION
 * ============================================================
 *
 * SemVer supports pre-release identifiers.
 *
 *
 * Example:
 *
 *
 *     2.0.0-alpha.1
 *
 *
 *     2.0.0-beta.1
 *
 *
 *     2.0.0-rc.1
 *
 *
 * Common progression:
 *
 *
 *     alpha
 *       ↓
 *     beta
 *       ↓
 *     release candidate
 *       ↓
 *     stable
 *
 * ============================================================
 */

const prereleaseVersions = [
  "2.0.0-alpha.1",
  "2.0.0-beta.1",
  "2.0.0-rc.1",
  "2.0.0",
];

console.log("\nPre-release progression:");

console.log(prereleaseVersions);

/*
 * ============================================================
 * 22. BUILD METADATA
 * ============================================================
 *
 * SemVer also allows build metadata.
 *
 *
 * Example:
 *
 *
 *     1.2.3+build.45
 *
 *
 * Build metadata follows "+".
 *
 * ============================================================
 */

const buildVersion = "1.2.3+build.45";

console.log("\nBuild metadata version:", buildVersion);

/*
 * ============================================================
 * 23. Version comparison
 * ============================================================
 *
 * Semantic versions have ordering rules.
 *
 *
 * Example:
 *
 *
 *     1.2.0
 *     1.3.0
 *
 *
 * 1.3.0 is newer than 1.2.0.
 *
 *
 * Another:
 *
 *
 *     2.0.0
 *     1.9.9
 *
 *
 * 2.0.0 is newer because MAJOR is higher.
 *
 * ============================================================
 */

function compareSimpleVersions(a, b) {
  const aParts = a.split(".").map(Number);

  const bParts = b.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (aParts[i] > bParts[i]) {
      return 1;
    }

    if (aParts[i] < bParts[i]) {
      return -1;
    }
  }

  return 0;
}

console.log(
  "\nCompare 2.0.0 and 1.9.9:",
  compareSimpleVersions("2.0.0", "1.9.9"),
);

/*
 * ============================================================
 * 24. Comparison result
 * ============================================================
 *
 *
 *     1
 *         → first version is greater
 *
 *
 *     -1
 *         → first version is smaller
 *
 *
 *     0
 *         → versions are equal
 *
 *
 * Note:
 *
 * The simple function above is educational and does not fully
 * implement the SemVer specification, particularly pre-release
 * identifiers and validation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. npm package example
 * ============================================================
 *
 * package.json:
 *
 *
 *     {
 *       "dependencies": {
 *         "express": "^5.1.0"
 *       }
 *     }
 *
 *
 * Here:
 *
 *
 *     express
 *         ↓
 *     package name
 *
 *
 *     ^5.1.0
 *         ↓
 *     SemVer range
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Why npm uses ranges
 * ============================================================
 *
 * Suppose:
 *
 *
 *     express = "^5.1.0"
 *
 *
 * The project can receive compatible updates within the
 * permitted range without requiring a manual package.json
 * change for every patch/minor release.
 *
 *
 * The lockfile records the resolved dependency tree for the
 * installation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. package.json vs package-lock.json
 * ============================================================
 *
 *
 * package.json:
 *
 *     "express": "^5.1.0"
 *
 *             ↓
 *
 *     Allowed version range
 *
 *
 * package-lock.json:
 *
 *             ↓
 *
 *     Concrete resolved dependency information
 *
 *
 * Therefore:
 *
 *
 *     package.json
 *         =
 *     dependency intent/range
 *
 *
 *     package-lock.json
 *         =
 *     resolved installation
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Breaking change example
 * ============================================================
 *
 *
 * Version 1:
 *
 *     function getUser(id)
 *
 *
 * Version 2:
 *
 *     function getUser(options)
 *
 *
 * Existing code may break.
 *
 *
 * Therefore the package author may release:
 *
 *
 *     2.0.0
 *
 *
 * rather than:
 *
 *
 *     1.5.0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Backward-compatible feature
 * ============================================================
 *
 * Existing:
 *
 *     getUser(id)
 *
 *
 * New:
 *
 *     getUser(id)
 *     getUserByEmail(email)
 *
 *
 * Existing functionality still works.
 *
 *
 * A SemVer-compliant project may release this as:
 *
 *
 *     1.4.0
 *
 *
 * rather than:
 *
 *
 *     2.0.0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Bug fix
 * ============================================================
 *
 * Existing:
 *
 *     1.4.0
 *
 *
 * Bug fixed without changing the public API:
 *
 *
 *     1.4.1
 *
 *
 * This is a typical PATCH release.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Semantic versioning workflow
 * ============================================================
 *
 *
 * Bug fix
 *    ↓
 * PATCH
 *
 *
 * New backward-compatible feature
 *    ↓
 * MINOR
 *
 *
 * Breaking API change
 *    ↓
 * MAJOR
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Caret examples
 * ============================================================
 *
 *
 * "^1.2.3"
 *
 * generally allows:
 *
 *     1.2.3
 *     1.2.4
 *     1.3.0
 *     1.9.x
 *
 * but not:
 *
 *     2.0.0
 *
 *
 * The exact range behavior is defined by npm's semver rules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Important 0.x caret behavior
 * ============================================================
 *
 * Do NOT apply the normal 1.x+ intuition blindly to 0.x.
 *
 *
 * For example:
 *
 *
 *     "^0.2.3"
 *
 *
 * is much narrower than:
 *
 *
 *     "^1.2.3"
 *
 *
 * because changes in 0.x can have different compatibility
 * implications under SemVer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Tilde examples
 * ============================================================
 *
 *
 * "~1.2.3"
 *
 *
 * generally allows:
 *
 *
 *     1.2.3
 *     1.2.4
 *     1.2.5
 *
 *
 * but not:
 *
 *
 *     1.3.0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. npm version commands
 * ============================================================
 *
 *
 * npm version patch
 *
 *     1.0.0 → 1.0.1
 *
 *
 * npm version minor
 *
 *     1.0.1 → 1.1.0
 *
 *
 * npm version major
 *
 *     1.1.0 → 2.0.0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Versioning a package
 * ============================================================
 *
 * Suppose you publish:
 *
 *
 *     my-library@1.0.0
 *
 *
 * Bug fix:
 *
 *
 *     my-library@1.0.1
 *
 *
 * New compatible feature:
 *
 *
 *     my-library@1.1.0
 *
 *
 * Breaking change:
 *
 *
 *     my-library@2.0.0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Version tags
 * ============================================================
 *
 * npm packages can have distribution tags.
 *
 *
 * Common tag:
 *
 *
 *     latest
 *
 *
 * Other projects may use tags such as:
 *
 *
 *     beta
 *     next
 *
 *
 * Tags and SemVer are related but different concepts.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. npm install @latest
 * ============================================================
 *
 * Example:
 *
 *
 *     npm install express@latest
 *
 *
 * This asks npm to use the package's "latest" dist-tag.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. npm install @next
 * ============================================================
 *
 * Some packages publish pre-release versions under tags such as:
 *
 *
 *     next
 *
 *
 * Example:
 *
 *
 *     npm install package-name@next
 *
 *
 * The exact availability depends on the package.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Version range mental model
 * ============================================================
 *
 *
 * Exact:
 *
 *     5.1.0
 *
 *     ↓
 *     Only 5.1.0
 *
 *
 * Caret:
 *
 *     ^5.1.0
 *
 *     ↓
 *     Compatible 5.x releases
 *
 *
 * Tilde:
 *
 *     ~5.1.0
 *
 *     ↓
 *     Compatible 5.1.x releases
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Common npm version notation
 * ============================================================
 */

const ranges = {
  exact: "5.1.0",

  caret: "^5.1.0",

  tilde: "~5.1.0",

  greaterThan: ">5.1.0",

  greaterThanOrEqual: ">=5.1.0",

  lessThan: "<6.0.0",

  lessThanOrEqual: "<=5.9.9",

  wildcard: "5.x",

  combined: ">=5.1.0 <6.0.0",
};

console.log("\nCommon version ranges:");

console.log(ranges);

/*
 * ============================================================
 * 42. Common mistakes
 * ============================================================
 *
 * Mistake 1:
 *
 *     Assuming every minor/patch release is guaranteed safe.
 *
 *
 * SemVer is a contract/convention. Package authors may make
 * mistakes.
 *
 *
 * Mistake 2:
 *
 *     Ignoring the lockfile.
 *
 *
 * package-lock.json matters for reproducible installations.
 *
 *
 * Mistake 3:
 *
 *     Treating ^ and ~ as identical.
 *
 *
 * They represent different ranges.
 *
 *
 * Mistake 4:
 *
 *     Assuming 0.x behaves exactly like 1.x.
 *
 *
 * It does not.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Production dependency strategy
 * ============================================================
 *
 * A production project should deliberately decide:
 *
 *
 *     Which versions are allowed?
 *     Which updates are automatically acceptable?
 *     How are upgrades tested?
 *     How is package-lock.json managed?
 *
 *
 * Example:
 *
 *
 *     package.json
 *         ↓
 *     semver range
 *         ↓
 *     lockfile
 *         ↓
 *     npm ci
 *         ↓
 *     tests
 *         ↓
 *     deployment
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. SemVer and dependency updates
 * ============================================================
 *
 *
 * PATCH
 *     ↓
 * Bug fix
 *
 *
 * MINOR
 *     ↓
 * Compatible feature
 *
 *
 * MAJOR
 *     ↓
 * Potential breaking change
 *
 *
 * This allows developers to reason about package upgrades.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * VERSION:
 *
 *     MAJOR.MINOR.PATCH
 *
 *
 * PATCH:
 *
 *     1.2.3 → 1.2.4
 *
 *
 * MINOR:
 *
 *     1.2.4 → 1.3.0
 *
 *
 * MAJOR:
 *
 *     1.3.0 → 2.0.0
 *
 *
 * EXACT:
 *
 *     5.1.0
 *
 *
 * CARET:
 *
 *     ^5.1.0
 *
 *
 * TILDE:
 *
 *     ~5.1.0
 *
 *
 * GREATER:
 *
 *     >5.1.0
 *
 *
 * GREATER OR EQUAL:
 *
 *     >=5.1.0
 *
 *
 * LESS:
 *
 *     <6.0.0
 *
 *
 * LESS OR EQUAL:
 *
 *     <=5.9.9
 *
 *
 * RANGE:
 *
 *     >=5.1.0 <6.0.0
 *
 *
 * PRE-RELEASE:
 *
 *     2.0.0-beta.1
 *
 *
 * BUILD METADATA:
 *
 *     2.0.0+build.1
 *
 *
 * ============================================================
 *
 * FINAL MENTAL MODEL:
 *
 *
 *             SEMVER
 *                │
 *       ┌────────┼────────┐
 *       ↓        ↓        ↓
 *     MAJOR    MINOR    PATCH
 *       │        │        │
 *   Breaking   Feature   Fix
 *   changes    additions
 *
 *
 * package.json:
 *
 *     "express": "^5.1.0"
 *
 *                ↓
 *
 *         version range
 *
 *                ↓
 *
 *       package-lock.json
 *
 *                ↓
 *
 *          npm install
 *
 * ============================================================
 *
 * NEXT:
 *
 *     npm_commands.md
 *
 * ============================================================
 */

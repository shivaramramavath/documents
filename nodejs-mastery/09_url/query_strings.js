/**
 * ============================================================
 * Node.js URL - Query Strings
 * ============================================================
 *
 * File:
 *     09_url/query_string.js
 *
 * Query string:
 *
 *     ?page=2&limit=10&search=node
 *
 *
 * Query parameters are key/value pairs attached to a URL.
 *
 * ============================================================
 */

const { URL, URLSearchParams } = require("node:url");

/*
 * ============================================================
 * 1. Read query string using URL
 * ============================================================
 */

const url = new URL("https://example.com/products?page=2&limit=10");

console.log("Search:", url.search);

/*
 * ============================================================
 * 2. Get one parameter
 * ============================================================
 */

console.log("Page:", url.searchParams.get("page"));

console.log("Limit:", url.searchParams.get("limit"));

/*
 * ============================================================
 * 3. Missing parameter
 * ============================================================
 */

console.log("Search:", url.searchParams.get("search"));

/*
 * Result:
 *
 *     null
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. has()
 * ============================================================
 */

console.log("Has page:", url.searchParams.has("page"));

console.log("Has search:", url.searchParams.has("search"));

/*
 * ============================================================
 * 5. set()
 * ============================================================
 */

url.searchParams.set("page", "3");

console.log(url.href);

/*
 * ============================================================
 * 6. append()
 * ============================================================
 *
 * append() adds another value.
 * ============================================================
 */

url.searchParams.append("tag", "node");

url.searchParams.append("tag", "javascript");

console.log(url.search);

/*
 * ============================================================
 * 7. getAll()
 * ============================================================
 */

console.log("Tags:", url.searchParams.getAll("tag"));

/*
 * Result:
 *
 *     [
 *       "node",
 *       "javascript"
 *     ]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. delete()
 * ============================================================
 */

url.searchParams.delete("limit");

console.log(url.href);

/*
 * ============================================================
 * 9. sort()
 * ============================================================
 */

url.searchParams.sort();

console.log("Sorted:", url.search);

/*
 * ============================================================
 * 10. URLSearchParams directly
 * ============================================================
 */

const params = new URLSearchParams();

params.set("page", "1");

params.set("limit", "20");

params.set("sort", "name");

console.log(params.toString());

/*
 * ============================================================
 * 11. Create from object
 * ============================================================
 */

const objectParams = new URLSearchParams({
  page: "2",

  limit: "50",

  search: "node js",
});

console.log(objectParams.toString());

/*
 * ============================================================
 * 12. Create from string
 * ============================================================
 */

const stringParams = new URLSearchParams("page=2&limit=10&active=true");

console.log("Page:", stringParams.get("page"));

console.log("Active:", stringParams.get("active"));

/*
 * ============================================================
 * 13. Iterating parameters
 * ============================================================
 */

for (const [key, value] of stringParams) {
  console.log(key, "=", value);
}

/*
 * ============================================================
 * 14. keys()
 * ============================================================
 */

for (const key of stringParams.keys()) {
  console.log("Key:", key);
}

/*
 * ============================================================
 * 15. values()
 * ============================================================
 */

for (const value of stringParams.values()) {
  console.log("Value:", value);
}

/*
 * ============================================================
 * 16. entries()
 * ============================================================
 */

for (const entry of stringParams.entries()) {
  console.log("Entry:", entry);
}

/*
 * ============================================================
 * 17. Query parameter encoding
 * ============================================================
 */

const encodedParams = new URLSearchParams();

encodedParams.set("search", "Node.js HTTP API");

console.log("Encoded:", encodedParams.toString());

/*
 * Spaces and special characters are encoded safely.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Array-like query values
 * ============================================================
 *
 * For multiple values:
 *
 *
 *     ?tag=node&tag=javascript&tag=backend
 *
 * ============================================================
 */

const tags = new URLSearchParams();

tags.append("tag", "node");

tags.append("tag", "javascript");

tags.append("tag", "backend");

console.log(tags.getAll("tag"));

/*
 * ============================================================
 * 19. Query string in an API
 * ============================================================
 *
 *
 * Request:
 *
 *     GET /users?page=2&limit=20&search=shiva
 *
 *
 * Extract:
 *
 *     page   = 2
 *     limit  = 20
 *     search = shiva
 *
 * ============================================================
 */

function parsePagination(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");

  const page = Number(url.searchParams.get("page") || "1");

  const limit = Number(url.searchParams.get("limit") || "10");

  const search = url.searchParams.get("search");

  return {
    page,
    limit,
    search,
  };
}

console.log(parsePagination("/users?page=2&limit=20&search=shiva"));

/*
 * ============================================================
 * 20. Important: query values are strings
 * ============================================================
 */

const query = new URLSearchParams("page=10&active=true");

console.log(typeof query.get("page"));

/*
 * Result:
 *
 *     string
 *
 *
 * Convert manually when necessary:
 *
 *     Number(...)
 *
 *     Boolean logic
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 * Get:
 *
 *     params.get("page")
 *
 *
 * Check:
 *
 *     params.has("page")
 *
 *
 * Set:
 *
 *     params.set(
 *       "page",
 *       "2"
 *     )
 *
 *
 * Add:
 *
 *     params.append(
 *       "tag",
 *       "node"
 *     )
 *
 *
 * Multiple:
 *
 *     params.getAll("tag")
 *
 *
 * Delete:
 *
 *     params.delete("page")
 *
 *
 * Sort:
 *
 *     params.sort()
 *
 *
 * String:
 *
 *     params.toString()
 *
 * ============================================================
 */

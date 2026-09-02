/**
 * ============================================================
 * Node.js URL API
 * ============================================================
 *
 * File:
 *     09_url/url.js
 *
 * Built-in modules:
 *
 *     node:url
 *
 * Modern Node.js also provides the global URL class.
 *
 * ============================================================
 *
 * A URL can contain:
 *
 *     protocol
 *     username
 *     password
 *     hostname
 *     port
 *     pathname
 *     search/query string
 *     hash
 *
 *
 * Example:
 *
 *     https://admin:secret@example.com:8080/users/123?page=2#profile
 *
 *
 *     protocol  -> https:
 *     username  -> admin
 *     password  -> secret
 *     hostname  -> example.com
 *     port      -> 8080
 *     pathname  -> /users/123
 *     query     -> ?page=2
 *     hash      -> #profile
 *
 * ============================================================
 */

const { URL } = require("node:url");

/*
 * ============================================================
 * 1. Create a URL
 * ============================================================
 */

const url = new URL("https://example.com/users/123?active=true#profile");

console.log("URL:", url.href);

/*
 * ============================================================
 * 2. URL properties
 * ============================================================
 */

console.log("Protocol:", url.protocol);

console.log("Hostname:", url.hostname);

console.log("Port:", url.port);

console.log("Host:", url.host);

console.log("Pathname:", url.pathname);

console.log("Search:", url.search);

console.log("Hash:", url.hash);

/*
 * ============================================================
 * 3. Origin
 * ============================================================
 */

console.log("Origin:", url.origin);

/*
 * Output:
 *
 *     https://example.com
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Username and password
 * ============================================================
 */

const authenticatedUrl = new URL("https://admin:secret@example.com/dashboard");

console.log("Username:", authenticatedUrl.username);

console.log("Password:", authenticatedUrl.password);

/*
 * ============================================================
 * 5. URL with port
 * ============================================================
 */

const apiUrl = new URL("http://localhost:3000/api/users");

console.log("Protocol:", apiUrl.protocol);

console.log("Hostname:", apiUrl.hostname);

console.log("Port:", apiUrl.port);

console.log("Path:", apiUrl.pathname);

/*
 * ============================================================
 * 6. URL search parameters
 * ============================================================
 */

const searchUrl = new URL("https://example.com/products?page=2&limit=10");

console.log("Search:", searchUrl.search);

console.log("Page:", searchUrl.searchParams.get("page"));

console.log("Limit:", searchUrl.searchParams.get("limit"));

/*
 * ============================================================
 * 7. URL hash
 * ============================================================
 */

const hashUrl = new URL("https://example.com/docs#installation");

console.log("Hash:", hashUrl.hash);

/*
 * ============================================================
 * 8. Modify URL properties
 * ============================================================
 */

const mutableUrl = new URL("https://example.com/users");

mutableUrl.pathname = "/products";

mutableUrl.port = "8080";

console.log("Modified URL:", mutableUrl.href);

/*
 * ============================================================
 * 9. Modify search parameters
 * ============================================================
 */

mutableUrl.searchParams.set("page", "2");

mutableUrl.searchParams.set("limit", "20");

console.log("Modified URL:", mutableUrl.href);

/*
 * ============================================================
 * 10. URL encoding
 * ============================================================
 *
 * URL automatically handles encoding when appropriate.
 *
 * ============================================================
 */

const encodedUrl = new URL("https://example.com/search");

encodedUrl.searchParams.set("q", "Node.js HTTP API");

console.log("Encoded URL:", encodedUrl.href);

/*
 * ============================================================
 * 11. Relative URLs
 * ============================================================
 *
 * A relative URL needs a base URL.
 * ============================================================
 */

const relativeUrl = new URL("/users/123", "https://example.com");

console.log("Relative URL resolved:", relativeUrl.href);

/*
 * ============================================================
 * 12. Relative URL with query
 * ============================================================
 */

const relativeApiUrl = new URL("/users?page=2", "https://api.example.com");

console.log("Resolved:", relativeApiUrl.href);

/*
 * ============================================================
 * 13. URL.canParse()
 * ============================================================
 *
 * Check whether a string can be parsed as a URL.
 * ============================================================
 */

console.log("Can parse:", URL.canParse("https://example.com"));

console.log("Cannot parse:", URL.canParse("not a valid absolute URL"));

/*
 * ============================================================
 * 14. URL.parse()
 * ============================================================
 *
 * Modern Node.js versions provide URL.parse().
 *
 * It returns a URL object when parsing succeeds and null
 * when parsing fails.
 * ============================================================
 */

if (typeof URL.parse === "function") {
  const parsed = URL.parse("https://example.com/users?page=2");

  console.log("Parsed URL:", parsed);
}

/*
 * ============================================================
 * 15. URL -> string
 * ============================================================
 */

console.log(String(url));

console.log(url.toString());

/*
 * ============================================================
 * 16. URL -> JSON
 * ============================================================
 */

console.log(url.toJSON());

/*
 * ============================================================
 * 17. URL constructor from Node's url module
 * ============================================================
 *
 * Modern Node.js:
 *
 *     new URL(...)
 *
 *
 * is preferred over the legacy:
 *
 *     url.parse(...)
 *
 *
 * The WHATWG URL API is the modern API.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. URL structure
 * ============================================================
 *
 *
 * https://example.com:8080/users/123?page=2#profile
 * └──┬─┘ └──────┬──────┘ └──────┬──────┘ └───┬──┘
 *    │           │               │            │
 * protocol    host           pathname       hash
 *
 *
 * Query:
 *
 *     ?page=2
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 * Create:
 *
 *     const url = new URL(
 *       "https://example.com"
 *     );
 *
 *
 * Protocol:
 *
 *     url.protocol
 *
 *
 * Hostname:
 *
 *     url.hostname
 *
 *
 * Port:
 *
 *     url.port
 *
 *
 * Path:
 *
 *     url.pathname
 *
 *
 * Query:
 *
 *     url.search
 *
 *
 * Query parameters:
 *
 *     url.searchParams
 *
 *
 * Hash:
 *
 *     url.hash
 *
 *
 * Full URL:
 *
 *     url.href
 *
 *
 * Validate:
 *
 *     URL.canParse(value)
 *
 * ============================================================
 */

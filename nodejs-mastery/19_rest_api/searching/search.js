/**
 * ============================================================
 * 19_rest_api/searching/search.js
 * ============================================================
 *
 * REST API SEARCHING
 *
 * Searching allows clients to find records based on text.
 *
 * Examples:
 *
 *     GET /users?search=shiva
 *
 *     GET /products?search=iphone
 *
 *     GET /messages?search=meeting
 *
 * ============================================================
 */

import express from "express";

const app = express();

/*
 * ============================================================
 * SAMPLE DATA
 * ============================================================
 */

const users = [
  {
    id: 1,
    name: "Shiva Ram",
    email: "shiva@example.com",
    city: "Guntur",
  },

  {
    id: 2,
    name: "Rahul Kumar",
    email: "rahul@example.com",
    city: "Hyderabad",
  },

  {
    id: 3,
    name: "Shivani",
    email: "shivani@example.com",
    city: "Vijayawada",
  },

  {
    id: 4,
    name: "Ravi Kumar",
    email: "ravi@example.com",
    city: "Guntur",
  },
];

/*
 * ============================================================
 * 1. BASIC SEARCH
 * ============================================================
 */

function searchUsers(users, search) {
  if (!search) {
    return users;
  }

  const term = search.toLowerCase().trim();

  return users.filter((user) => user.name.toLowerCase().includes(term));
}

/*
 * ============================================================
 * 2. SEARCH MULTIPLE FIELDS
 * ============================================================
 *
 * Search:
 *
 *     name
 *     email
 *     city
 *
 * ============================================================
 */

function searchUsersMultipleFields(users, search) {
  if (!search) {
    return users;
  }

  const term = search.toLowerCase().trim();

  return users.filter((user) => {
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.city.toLowerCase().includes(term)
    );
  });
}

/*
 * ============================================================
 * 3. EXPRESS SEARCH API
 * ============================================================
 */

app.get("/users", (req, res) => {
  const data = searchUsersMultipleFields(users, req.query.search);

  return res.json({
    data,
  });
});

/*
 * ============================================================
 * 4. MONGODB REGEX SEARCH
 * ============================================================
 *
 * Simple MongoDB search:
 *
 *
 * {
 *   name: {
 *     $regex: "shiva",
 *     $options: "i"
 *   }
 * }
 *
 *
 * i = case insensitive
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. SEARCH MULTIPLE MONGODB FIELDS
 * ============================================================
 *
 * MongoDB:
 *
 *
 * {
 *   $or: [
 *
 *     {
 *       name: {
 *         $regex: search,
 *         $options: "i"
 *       }
 *     },
 *
 *     {
 *       email: {
 *         $regex: search,
 *         $options: "i"
 *       }
 *     },
 *
 *     {
 *       city: {
 *         $regex: search,
 *         $options: "i"
 *       }
 *     }
 *
 *   ]
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. BUILD SEARCH QUERY
 * ============================================================
 */

function buildSearchQuery(search) {
  if (typeof search !== "string" || search.trim() === "") {
    return {};
  }

  const escaped = escapeRegex(search.trim());

  return {
    $or: [
      {
        name: {
          $regex: escaped,
          $options: "i",
        },
      },

      {
        email: {
          $regex: escaped,
          $options: "i",
        },
      },

      {
        city: {
          $regex: escaped,
          $options: "i",
        },
      },
    ],
  };
}

/*
 * ============================================================
 * 7. ESCAPE REGEX
 * ============================================================
 *
 * User input should not be blindly inserted into regexes.
 *
 * ============================================================
 */

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/*
 * ============================================================
 * 8. MONGOOSE EXAMPLE
 * ============================================================
 *
 * const filter =
 *   buildSearchQuery(
 *     req.query.search,
 *   );
 *
 *
 * const users =
 *   await User.find(filter);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. SEARCH + FILTER
 * ============================================================
 *
 * Request:
 *
 *     GET /users
 *       ?search=shiva
 *       &active=true
 *
 *
 * MongoDB:
 *
 * {
 *   active: true,
 *
 *   $or: [
 *     {
 *       name: {
 *         $regex: "shiva",
 *         $options: "i"
 *       }
 *     },
 *
 *     {
 *       email: {
 *         $regex: "shiva",
 *         $options: "i"
 *       }
 *     }
 *   ]
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. SEARCH + FILTER + SORT + PAGINATION
 * ============================================================
 *
 * Production REST API:
 *
 *
 * GET /users
 *   ?search=shiva
 *   &active=true
 *   &sort=-createdAt
 *   &page=1
 *   &limit=20
 *
 *
 * Processing:
 *
 *
 *     search
 *       ↓
 *     filters
 *       ↓
 *     sort
 *       ↓
 *     pagination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. REGEX VS TEXT SEARCH
 * ============================================================
 *
 * Regex:
 *
 *     $regex
 *
 *
 * Good for:
 *
 *     simple partial matching
 *
 *
 * But regex can become expensive on large collections.
 *
 *
 * For large-scale text search consider:
 *
 *
 *     MongoDB text indexes
 *
 * or:
 *
 *     MongoDB Atlas Search
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. TEXT INDEX
 * ============================================================
 *
 * Mongoose:
 *
 *
 *     userSchema.index({
 *       name: "text",
 *       email: "text",
 *       city: "text",
 *     });
 *
 *
 * Query:
 *
 *
 *     User.find({
 *       $text: {
 *         $search: search,
 *       },
 *     });
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. SEARCH SHOULD BE BOUNDED
 * ============================================================
 *
 * Don't allow unlimited search strings.
 *
 *
 * Example:
 *
 *     max length = 100
 *
 *
 * This protects the API from unnecessarily expensive queries.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. SEARCH MENTAL MODEL
 * ============================================================
 *
 *
 * ?search=shiva
 *
 *       ↓
 *
 * normalize
 *
 *       ↓
 *
 * validate
 *
 *       ↓
 *
 * escape / tokenize
 *
 *       ↓
 *
 * database search
 *
 *       ↓
 *
 * results
 *
 * ============================================================
 */

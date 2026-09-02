/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     18_express/controllers.js
 *
 * Topic:
 *     Express Controllers
 *
 * ============================================================
 *
 * WHAT IS A CONTROLLER?
 * ============================================================
 *
 * A controller is responsible for handling the HTTP layer.
 *
 * It typically:
 *
 *     1. Receives req/res
 *     2. Reads validated input
 *     3. Calls a service
 *     4. Converts the service result into an HTTP response
 *
 *
 * Controller should NOT contain large business logic.
 *
 * Recommended flow:
 *
 *     Request
 *        ↓
 *     Middleware
 *        ↓
 *     Controller
 *        ↓
 *     Service
 *        ↓
 *     Repository / Model
 *        ↓
 *     Database
 *
 * ============================================================
 */

import express from "express";

const app = express();

app.use(express.json());

/*
 * ============================================================
 * 1. SIMPLE CONTROLLER
 * ============================================================
 */

function getHome(req, res) {
  res.json({
    message: "Home",
  });
}

app.get("/", getHome);

/*
 * ============================================================
 * 2. CONTROLLER NAMING
 * ============================================================
 *
 * Prefer names describing the operation:
 *
 *     listUsers
 *     getUser
 *     createUser
 *     updateUser
 *     deleteUser
 *
 *
 * Avoid vague names:
 *
 *     handle()
 *     process()
 *     doSomething()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. SERVICE LAYER
 * ============================================================
 *
 * Controllers should delegate business logic to services.
 *
 * ============================================================
 */

const userService = {
  async list() {
    return [
      {
        id: "user_1",

        name: "Shiva",
      },

      {
        id: "user_2",

        name: "Ram",
      },
    ];
  },

  async getById(id) {
    return {
      id,
      name: "Shiva",
    };
  },

  async create(data) {
    return {
      id: "user_123",

      ...data,
    };
  },

  async update(id, data) {
    return {
      id,
      ...data,
    };
  },

  async remove(id) {
    return {
      id,
      deleted: true,
    };
  },
};

/*
 * ============================================================
 * 4. LIST USERS CONTROLLER
 * ============================================================
 */

async function listUsers(req, res, next) {
  try {
    const users = await userService.list();

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

app.get("/users", listUsers);

/*
 * ============================================================
 * 5. GET USER CONTROLLER
 * ============================================================
 */

async function getUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await userService.getById(id);

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

app.get("/users/:id", getUser);

/*
 * ============================================================
 * 6. CREATE USER CONTROLLER
 * ============================================================
 */

async function createUser(req, res, next) {
  try {
    const user = await userService.create(req.body);

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

app.post("/users", createUser);

/*
 * ============================================================
 * 7. UPDATE USER CONTROLLER
 * ============================================================
 */

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await userService.update(id, req.body);

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

app.patch("/users/:id", updateUser);

/*
 * ============================================================
 * 8. DELETE USER CONTROLLER
 * ============================================================
 */

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    await userService.remove(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

app.delete("/users/:id", deleteUser);

/*
 * ============================================================
 * 9. CONTROLLER RESPONSIBILITIES
 * ============================================================
 *
 * Controller:
 *
 *     ✓ Read req.params
 *     ✓ Read req.query
 *     ✓ Read req.body
 *     ✓ Read authenticated user
 *     ✓ Call service
 *     ✓ Choose HTTP status
 *     ✓ Return response
 *     ✓ Forward errors
 *
 *
 * Controller should generally NOT:
 *
 *     ✗ Perform complex business rules
 *     ✗ Directly contain database queries
 *     ✗ Handle password hashing logic
 *     ✗ Implement authorization rules everywhere
 *     ✗ Contain huge algorithms
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. CONTROLLER + QUERY PARAMETERS
 * ============================================================
 */

async function searchUsers(req, res, next) {
  try {
    const { search, page = "1", limit = "20" } = req.query;

    const users =
      (await userService.search?.({
        search,
        page: Number(page),
        limit: Number(limit),
      })) ?? [];

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

app.get("/search/users", searchUsers);

/*
 * ============================================================
 * 11. HTTP STATUS CODES
 * ============================================================
 *
 * Controller decides the HTTP representation of the result.
 *
 *
 * Successful creation:
 *
 *     201 Created
 *
 *
 * Successful request:
 *
 *     200 OK
 *
 *
 * Successful deletion with no response body:
 *
 *     204 No Content
 *
 *
 * Invalid request:
 *
 *     400 Bad Request
 *
 *
 * Not authenticated:
 *
 *     401 Unauthorized
 *
 *
 * Authenticated but forbidden:
 *
 *     403 Forbidden
 *
 *
 * Resource not found:
 *
 *     404 Not Found
 *
 *
 * Unexpected server failure:
 *
 *     500 Internal Server Error
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. CONTROLLER SHOULD NOT LEAK DATABASE OBJECTS BLINDLY
 * ============================================================
 *
 * Database models can contain fields that should not be returned.
 *
 * Example:
 *
 *     {
 *       id,
 *       email,
 *       passwordHash,
 *       internalFlags
 *     }
 *
 *
 * Do not blindly:
 *
 *     res.json(user)
 *
 *
 * if user contains sensitive/internal properties.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. RESPONSE DTO
 * ============================================================
 *
 * DTO = Data Transfer Object.
 *
 * A controller can explicitly shape the public response.
 *
 * ============================================================
 */

function toUserResponse(user) {
  return {
    id: user.id,

    name: user.name,

    email: user.email,
  };
}

async function getSafeUser(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);

    res.json({
      data: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
}

app.get("/safe-users/:id", getSafeUser);

/*
 * ============================================================
 * 14. AUTHENTICATED USER
 * ============================================================
 *
 * Authentication middleware may attach:
 *
 *     req.user
 *
 * Controller can use it.
 *
 * ============================================================
 */

function authenticate(req, res, next) {
  req.user = {
    id: "user_123",
  };

  next();
}

async function getMe(req, res, next) {
  try {
    const user = await userService.getById(req.user.id);

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

app.get("/me", authenticate, getMe);

/*
 * ============================================================
 * 15. CONTROLLER WITH MULTIPLE INPUT SOURCES
 * ============================================================
 */

async function getUserPosts(req, res, next) {
  try {
    const { userId } = req.params;

    const { page = "1", limit = "20" } = req.query;

    /*
     * In a real application:
     *
     *     postService.listByUser(...)
     */

    res.json({
      userId,

      pagination: {
        page: Number(page),

        limit: Number(limit),
      },

      posts: [],
    });
  } catch (error) {
    next(error);
  }
}

app.get("/users/:userId/posts", getUserPosts);

/*
 * ============================================================
 * 16. CONTROLLER FACTORY
 * ============================================================
 *
 * Sometimes reusable controller factories are useful.
 *
 * ============================================================
 */

function createGetController(service) {
  return async (req, res, next) => {
    try {
      const result = await service.getById(req.params.id);

      res.json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

/*
 * ============================================================
 * 17. CONTROLLER ERROR HANDLING
 * ============================================================
 *
 * Preferred pattern:
 *
 *
 *     try {
 *         ...
 *     } catch (error) {
 *         next(error);
 *     }
 *
 *
 * Central error middleware then handles the error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. CUSTOM APPLICATION ERRORS
 * ============================================================
 */

class NotFoundError extends Error {
  statusCode = 404;

  code = "NOT_FOUND";
}

async function getUserOrFail(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/*
 * ============================================================
 * 19. SERVICE RESULT
 * ============================================================
 *
 * A service can return:
 *
 *     data
 *
 * or throw:
 *
 *     NotFoundError
 *     ConflictError
 *     ValidationError
 *
 *
 * Controller translates these into HTTP responses through the
 * application's error-handling strategy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. CONTROLLER VS SERVICE
 * ============================================================
 *
 *
 * CONTROLLER
 *
 *     HTTP-specific
 *
 *     req
 *     res
 *     status codes
 *     headers
 *     cookies
 *
 *
 * SERVICE
 *
 *     Business-specific
 *
 *     rules
 *     workflows
 *     transactions
 *     domain operations
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. BAD CONTROLLER
 * ============================================================
 *
 * Avoid this:
 *
 *
 *     app.post("/users", async (req, res) => {
 *
 *         // validate
 *         // hash password
 *         // check duplicate
 *         // create database record
 *         // send email
 *         // publish Kafka event
 *         // update cache
 *         // etc...
 *
 *     });
 *
 *
 * The controller becomes a "god function".
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. BETTER CONTROLLER
 * ============================================================
 *
 *
 *     app.post(
 *       "/users",
 *       validateCreateUser,
 *       authenticate,
 *       createUser
 *     );
 *
 *
 *     async function createUser(req, res, next) {
 *
 *       try {
 *
 *         const user =
 *           await userService.create(
 *             req.body
 *           );
 *
 *         res.status(201).json({
 *           data: user
 *         });
 *
 *       } catch (error) {
 *         next(error);
 *       }
 *     }
 *
 *
 * Business complexity belongs in services/domain layers.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. RESPONSE HELPERS
 * ============================================================
 */

function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,

    data,
  });
}

function sendCreated(res, data) {
  return sendSuccess(res, data, 201);
}

/*
 * Example:
 *
 *     return sendSuccess(
 *       res,
 *       users
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. PAGINATION RESPONSE
 * ============================================================
 */

function sendPaginated(res, { data, page, limit, total }) {
  const totalPages = Math.ceil(total / limit);

  return res.json({
    success: true,

    data,

    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

/*
 * ============================================================
 * 25. CONTROLLER WITH PAGINATION
 * ============================================================
 */

async function listUsersPaginated(req, res, next) {
  try {
    const page = Number(req.query.page || 1);

    const limit = Number(req.query.limit || 20);

    /*
     * Example service result.
     */

    const result = {
      data: [],
      page,
      limit,
      total: 0,
    };

    sendPaginated(res, result);
  } catch (error) {
    next(error);
  }
}

app.get("/paginated-users", listUsersPaginated);

/*
 * ============================================================
 * 26. CONTROLLER + FILE UPLOAD
 * ============================================================
 *
 * File upload middleware such as multer parses multipart/form-data.
 *
 * Controller receives the parsed result.
 *
 *
 *     middleware
 *          ↓
 *     req.file / req.files
 *          ↓
 *     controller
 *          ↓
 *     storage service
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. CONTROLLER + WEBSOCKET
 * ============================================================
 *
 * In realtime applications:
 *
 *     HTTP controller
 *          ↓
 *     service
 *          ↓
 *     database
 *          ↓
 *     event/socket layer
 *
 *
 * Avoid embedding large socket orchestration logic directly in
 * the controller.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. CONTROLLER + KAFKA
 * ============================================================
 *
 * Similarly:
 *
 *     Controller
 *         ↓
 *     Service
 *         ↓
 *     Database
 *         ↓
 *     Event Publisher
 *         ↓
 *     Kafka
 *
 *
 * The controller should normally not know Kafka protocol details.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. CONTROLLER TESTING
 * ============================================================
 *
 * Controllers are easier to test when services are injected.
 *
 * Example:
 *
 *
 *     const controller =
 *       createUserController(
 *         mockUserService
 *       );
 *
 *
 * Then test:
 *
 *     req.body
 *         ↓
 *     service.create()
 *         ↓
 *     response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. DEPENDENCY INJECTION
 * ============================================================
 */

function createUserController(service) {
  return async function createUser(req, res, next) {
    try {
      const user = await service.create(req.body);

      res.status(201).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}

/*
 * ============================================================
 * 31. CONTROLLER FACTORY USAGE
 * ============================================================
 */

const injectedCreateUser = createUserController(userService);

app.post("/injected-users", injectedCreateUser);

/*
 * ============================================================
 * 32. CONTROLLER LAYER ARCHITECTURE
 * ============================================================
 *
 *
 *             HTTP REQUEST
 *                   │
 *                   ↓
 *              Middleware
 *                   │
 *                   ↓
 *              Controller
 *                   │
 *          ┌────────┴────────┐
 *          ↓                 ↓
 *       params            body/query
 *          │                 │
 *          └────────┬────────┘
 *                   ↓
 *                Service
 *                   │
 *                   ↓
 *             Repository
 *                   │
 *                   ↓
 *               Database
 *                   │
 *                   ↓
 *                Service
 *                   │
 *                   ↓
 *              Controller
 *                   │
 *                   ↓
 *             HTTP Response
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. RESPONSIBILITY BOUNDARIES
 * ============================================================
 *
 *
 * Middleware:
 *
 *     cross-cutting HTTP concerns
 *
 *
 * Controller:
 *
 *     HTTP request/response translation
 *
 *
 * Service:
 *
 *     business logic
 *
 *
 * Repository:
 *
 *     persistence/data access
 *
 *
 * Model:
 *
 *     data structure/database mapping
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. IDEAL CONTROLLER
 * ============================================================
 *
 * A good controller is usually:
 *
 *     short
 *     predictable
 *     HTTP-aware
 *     easy to test
 *     easy to read
 *
 *
 * Example:
 *
 *
 *     async function createUser(req, res, next) {
 *
 *       try {
 *
 *         const user =
 *           await userService.create(req.body);
 *
 *         return res
 *           .status(201)
 *           .json({ data: user });
 *
 *       } catch (error) {
 *
 *         return next(error);
 *       }
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *                    REQUEST
 *                       │
 *                       ↓
 *                 MIDDLEWARE
 *                       │
 *                       ↓
 *                  CONTROLLER
 *                       │
 *                       │ HTTP → Domain
 *                       ↓
 *                    SERVICE
 *                       │
 *                       ↓
 *                  REPOSITORY
 *                       │
 *                       ↓
 *                   DATABASE
 *                       │
 *                       ↓
 *                  CONTROLLER
 *                       │
 *                       │ Domain → HTTP
 *                       ↓
 *                   RESPONSE
 *
 *
 * Remember:
 *
 *     Controller = HTTP adapter
 *
 * It translates between the HTTP world and the application's
 * business/domain world.
 *
 * ============================================================
 *
 * NEXT:
 *
 *     18_express/error_handler.js
 *
 * ============================================================
 */

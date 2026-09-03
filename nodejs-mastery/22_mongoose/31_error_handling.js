/**
 * ============================================================
 * 31_error_handling.js
 * ============================================================
 *
 * Mongoose Error Handling
 *
 * Topics:
 *
 *  1. MongooseError
 *  2. ValidationError
 *  3. CastError
 *  4. Duplicate key / E11000
 *  5. MongoServerError
 *  6. DocumentNotFound
 *  7. Query errors
 *  8. Connection errors
 *  9. Transaction errors
 * 10. Custom application errors
 * 11. Error classification
 * 12. Repository errors
 * 13. Service errors
 * 14. Controller error handling
 * 15. Production error middleware
 *
 * ============================================================
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

/*
 * ============================================================
 * 1. ENVIRONMENT
 * ============================================================
 */

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

/*
 * ============================================================
 * 2. SCHEMA
 * ============================================================
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: [true, "Name is required"],

      minlength: [3, "Name must contain at least 3 characters"],

      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,

      required: [true, "Email is required"],

      lowercase: true,

      trim: true,

      unique: true,
    },

    age: {
      type: Number,

      min: [18, "Age must be at least 18"],

      max: [100, "Age cannot exceed 100"],
    },
  },
  {
    timestamps: true,
  },
);

/*
 * ============================================================
 * 3. MODEL
 * ============================================================
 */

const User =
  mongoose.models.ErrorHandlingUser ||
  mongoose.model("ErrorHandlingUser", userSchema);

/*
 * ============================================================
 * 4. BASIC TRY/CATCH
 * ============================================================
 */

async function basicErrorHandling() {
  try {
    const user = await User.findOne({
      email: "test@example.com",
    });

    console.log(user);
  } catch (error) {
    console.error("Database operation failed:", error);
  }
}

/*
 * ============================================================
 * 5. MONGOOSE ERROR
 * ============================================================
 */

async function mongooseErrorDemo() {
  try {
    throw new mongoose.Error("Something went wrong");
  } catch (error) {
    console.log("Error name:", error.name);

    console.log("Error message:", error.message);

    console.log("Is MongooseError:", error instanceof mongoose.Error);
  }
}

/*
 * ============================================================
 * 6. VALIDATION ERROR
 * ============================================================
 */

async function validationErrorDemo() {
  try {
    await User.create({
      /*
       * Missing name
       */

      email: "invalid@example.com",

      /*
       * Invalid age
       */

      age: 10,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.log("Validation error");

      console.log("Message:", error.message);

      console.log("Fields:", Object.keys(error.errors));

      for (const [field, fieldError] of Object.entries(error.errors)) {
        console.log("\nField:", field);

        console.log("Message:", fieldError.message);

        console.log("Kind:", fieldError.kind);

        console.log("Value:", fieldError.value);
      }
    }
  }
}

/*
 * ============================================================
 * 7. CAST ERROR
 * ============================================================
 */

async function castErrorDemo() {
  try {
    /*
     * MongoDB ObjectId must have
     * a valid representation.
     */

    await User.findById("not-a-valid-object-id");
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      console.log("Cast error");

      console.log("Path:", error.path);

      console.log("Value:", error.value);

      console.log("Kind:", error.kind);

      console.log("Message:", error.message);
    }
  }
}

/*
 * ============================================================
 * 8. DUPLICATE KEY ERROR
 * ============================================================
 *
 * MongoDB duplicate key errors normally have:
 *
 * code = 11000
 *
 * ============================================================
 */

async function duplicateKeyDemo() {
  const email = `duplicate-${Date.now()}@example.com`;

  try {
    await User.create({
      name: "First User",

      email,

      age: 25,
    });

    /*
     * Same unique email again.
     */

    await User.create({
      name: "Second User",

      email,

      age: 30,
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      console.log("Duplicate key error");

      console.log("Key pattern:", error.keyPattern);

      console.log("Key value:", error.keyValue);
    }
  }
}

/*
 * ============================================================
 * 9. MongoServerError
 * ============================================================
 */

async function mongoServerErrorDemo() {
  try {
    await User.create({
      name: "Test",

      email: "test-server-error@example.com",

      age: 25,
    });
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError) {
      console.log("MongoDB server error");

      console.log("Code:", error.code);

      console.log("Code name:", error.codeName);

      console.log("Message:", error.message);
    }
  }
}

/*
 * ============================================================
 * 10. DOCUMENT NOT FOUND
 * ============================================================
 */

async function documentNotFoundDemo() {
  const user = await User.findOne({
    email: "does-not-exist@example.com",
  });

  if (!user) {
    console.log("User not found");

    return;
  }

  console.log(user);
}

/*
 * ============================================================
 * 11. findById OR THROW
 * ============================================================
 */

async function findOrThrow(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}

/*
 * ============================================================
 * 12. CUSTOM APPLICATION ERRORS
 * ============================================================
 */

class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    details = undefined,
  ) {
    super(message);

    this.name = "AppError";

    this.statusCode = statusCode;

    this.code = code;

    this.details = details;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/*
 * ============================================================
 * 13. NOT FOUND ERROR
 * ============================================================
 */

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(
      message,

      404,

      "NOT_FOUND",
    );
  }
}

/*
 * ============================================================
 * 14. BAD REQUEST ERROR
 * ============================================================
 */

class BadRequestError extends AppError {
  constructor(message = "Bad request", details) {
    super(
      message,

      400,

      "BAD_REQUEST",

      details,
    );
  }
}

/*
 * ============================================================
 * 15. CONFLICT ERROR
 * ============================================================
 */

class ConflictError extends AppError {
  constructor(message = "Resource conflict", details) {
    super(
      message,

      409,

      "CONFLICT",

      details,
    );
  }
}

/*
 * ============================================================
 * 16. DATABASE ERROR MAPPER
 * ============================================================
 */

function mapDatabaseError(error) {
  /*
   * ValidationError
   */

  if (error instanceof mongoose.Error.ValidationError) {
    const fields = {};

    for (const [field, fieldError] of Object.entries(error.errors)) {
      fields[field] = {
        message: fieldError.message,

        value: fieldError.value,
      };
    }

    return new BadRequestError(
      "Validation failed",

      {
        fields,
      },
    );
  }

  /*
   * CastError
   */

  if (error instanceof mongoose.Error.CastError) {
    return new BadRequestError(
      `Invalid ${error.path}`,

      {
        path: error.path,

        value: error.value,
      },
    );
  }

  /*
   * Duplicate key.
   */

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  ) {
    return new ConflictError(
      "A resource with the same unique value already exists",

      {
        keyPattern: error.keyPattern,

        keyValue: error.keyValue,
      },
    );
  }

  /*
   * Already an AppError.
   */

  if (error instanceof AppError) {
    return error;
  }

  /*
   * Unknown error.
   */

  return new AppError("Database operation failed", 500, "DATABASE_ERROR");
}

/*
 * ============================================================
 * 17. ERROR CLASSIFIER
 * ============================================================
 */

function classifyError(error) {
  if (error instanceof AppError) {
    return {
      type: "application",

      statusCode: error.statusCode,

      code: error.code,
    };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return {
      type: "validation",

      statusCode: 400,
    };
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      type: "cast",

      statusCode: 400,
    };
  }

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  ) {
    return {
      type: "duplicate_key",

      statusCode: 409,
    };
  }

  if (error instanceof mongoose.mongo.MongoServerError) {
    return {
      type: "mongodb",

      statusCode: 500,
    };
  }

  return {
    type: "unknown",

    statusCode: 500,
  };
}

/*
 * ============================================================
 * 18. REPOSITORY
 * ============================================================
 */

const userRepository = {
  async findById(id, session) {
    try {
      return await User.findById(id).session(session);
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  async create(data, session) {
    try {
      const users = await User.create(
        [data],

        {
          session,
        },
      );

      return users[0];
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  async update(id, data, session) {
    try {
      return await User.findByIdAndUpdate(
        id,

        data,

        {
          new: true,

          runValidators: true,

          session,
        },
      );
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  async delete(id, session) {
    try {
      return await User.findByIdAndDelete(
        id,

        {
          session,
        },
      );
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },
};

/*
 * ============================================================
 * 19. SERVICE
 * ============================================================
 */

const userService = {
  async getUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  },

  async createUser(data) {
    return userRepository.create(data);
  },
};

/*
 * ============================================================
 * 20. SERVICE ERROR HANDLING
 * ============================================================
 */

async function serviceExample(userId) {
  try {
    return await userService.getUser(userId);
  } catch (error) {
    /*
     * Service normally does not need
     * to convert every database error
     * if repository already maps it.
     */

    throw error;
  }
}

/*
 * ============================================================
 * 21. EXPRESS-STYLE ERROR HANDLER
 * ============================================================
 */

function errorHandler(error, req, res, next) {
  /*
   * Production should not expose
   * internal database details.
   */

  console.error(error);

  const statusCode = error instanceof AppError ? error.statusCode : 500;

  const code = error instanceof AppError ? error.code : "INTERNAL_ERROR";

  const message =
    error instanceof AppError ? error.message : "Internal server error";

  const response = {
    success: false,

    error: {
      code,

      message,
    },
  };

  /*
   * Include details only for
   * controlled operational errors.
   */

  if (error instanceof AppError && error.details) {
    response.error.details = error.details;
  }

  res.status(statusCode).json(response);
}

/*
 * ============================================================
 * 22. EXPRESS CONTROLLER EXAMPLE
 * ============================================================
 */

async function getUserController(req, res, next) {
  try {
    const user = await userService.getUser(req.params.id);

    res.json({
      success: true,

      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/*
 * ============================================================
 * 23. TRANSACTION ERROR HANDLING
 * ============================================================
 */

async function transactionErrorDemo() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await User.create(
        [
          {
            name: "Transaction User",

            email: `transaction-${Date.now()}@example.com`,

            age: 25,
          },
        ],

        {
          session,
        },
      );

      /*
       * Simulate failure.
       */

      throw new Error("Transaction operation failed");
    });
  } catch (error) {
    console.error("Transaction failed:", error);

    throw error;
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 24. SAFE ERROR RESPONSE
 * ============================================================
 */

function toErrorResponse(error) {
  if (error instanceof AppError) {
    return {
      success: false,

      error: {
        code: error.code,

        message: error.message,

        ...(error.details && {
          details: error.details,
        }),
      },
    };
  }

  return {
    success: false,

    error: {
      code: "INTERNAL_ERROR",

      message: "Internal server error",
    },
  };
}

/*
 * ============================================================
 * 25. CONNECTION ERROR
 * ============================================================
 */

function registerConnectionEvents() {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });
}

/*
 * ============================================================
 * 26. MAIN
 * ============================================================
 */

async function main() {
  registerConnectionEvents();

  try {
    await mongoose.connect(MONGODB_URI);

    console.log("Application started");

    /*
     * Uncomment one example.
     */

    // await validationErrorDemo();

    // await castErrorDemo();

    // await duplicateKeyDemo();

    // await documentNotFoundDemo();
  } catch (error) {
    console.error("Application startup failed:", error);

    process.exitCode = 1;
  }
}

await main();

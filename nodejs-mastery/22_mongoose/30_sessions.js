/**
 * ============================================================
 * 30_sessions.js
 * ============================================================
 *
 * Mongoose Sessions
 *
 * Topics:
 *
 *  1. Create a session
 *  2. End a session
 *  3. Session with queries
 *  4. Manual transaction
 *  5. withTransaction()
 *  6. Commit
 *  7. Abort
 *  8. Multiple models
 *  9. Session-aware repository
 * 10. Session-aware service
 * 11. Error handling
 * 12. Production pattern
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
 * 2. SCHEMAS
 * ============================================================
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * ============================================================
 * 3. MODELS
 * ============================================================
 */

const User =
  mongoose.models.SessionUser || mongoose.model("SessionUser", userSchema);

const Department =
  mongoose.models.SessionDepartment ||
  mongoose.model("SessionDepartment", departmentSchema);

/*
 * ============================================================
 * 4. BASIC SESSION
 * ============================================================
 */

async function createSession() {
  const session = await mongoose.startSession();

  console.log("Session created");

  console.log("Session ID:", session.id);

  await session.endSession();

  console.log("Session ended");
}

/*
 * ============================================================
 * 5. SESSION WITH QUERY
 * ============================================================
 */

async function sessionWithQuery() {
  const session = await mongoose.startSession();

  try {
    const users = await User.find().session(session);

    console.log(users);
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 6. FIND ONE WITH SESSION
 * ============================================================
 */

async function findOneWithSession(email) {
  const session = await mongoose.startSession();

  try {
    const user = await User.findOne({
      email,
    }).session(session);

    return user;
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 7. CREATE WITH SESSION
 * ============================================================
 */

async function createWithSession() {
  const session = await mongoose.startSession();

  try {
    const users = await User.create(
      [
        {
          name: "Shiva",

          email: "shiva@example.com",

          balance: 1000,
        },
      ],
      {
        session,
      },
    );

    return users[0];
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 8. UPDATE WITH SESSION
 * ============================================================
 */

async function updateWithSession(userId) {
  const session = await mongoose.startSession();

  try {
    const user = await User.findByIdAndUpdate(
      userId,

      {
        $inc: {
          balance: 500,
        },
      },

      {
        new: true,

        session,
      },
    );

    return user;
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 9. DELETE WITH SESSION
 * ============================================================
 */

async function deleteWithSession(userId) {
  const session = await mongoose.startSession();

  try {
    await User.findByIdAndDelete(
      userId,

      {
        session,
      },
    );
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 10. MANUAL TRANSACTION
 * ============================================================
 */

async function manualTransaction() {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /*
     * Operation 1
     */

    const user = await User.create(
      [
        {
          name: "Transaction User",

          email: `transaction-${Date.now()}@example.com`,

          balance: 1000,
        },
      ],

      {
        session,
      },
    );

    /*
     * Operation 2
     */

    await Department.create(
      [
        {
          name: "Computer Science",

          code: `CSE-${Date.now()}`,
        },
      ],

      {
        session,
      },
    );

    /*
     * Commit everything.
     */

    await session.commitTransaction();

    console.log("Transaction committed");

    return user[0];
  } catch (error) {
    /*
     * Rollback everything.
     */

    await session.abortTransaction();

    console.error("Transaction aborted", error);

    throw error;
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 11. withTransaction()
 * ============================================================
 *
 * Mongoose/MongoDB can manage transaction
 * commit/abort behavior for you.
 *
 * ============================================================
 */

async function withTransactionDemo() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await User.create(
        [
          {
            name: "With Transaction",

            email: `with-${Date.now()}@example.com`,

            balance: 500,
          },
        ],

        {
          session,
        },
      );

      await Department.create(
        [
          {
            name: "Information Technology",

            code: `IT-${Date.now()}`,
          },
        ],

        {
          session,
        },
      );
    });

    console.log("Transaction completed");
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 12. TRANSACTION FAILURE
 * ============================================================
 */

async function transactionFailureDemo() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await User.create(
        [
          {
            name: "Will Rollback",

            email: `rollback-${Date.now()}@example.com`,

            balance: 100,
          },
        ],

        {
          session,
        },
      );

      /*
       * Simulate failure.
       */

      throw new Error("Something went wrong");
    });
  } catch (error) {
    console.log("Transaction rolled back");

    console.error(error);
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 13. MULTIPLE OPERATIONS
 * ============================================================
 */

async function multipleOperationsTransaction() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      /*
       * Create user
       */

      const users = await User.create(
        [
          {
            name: "Multi Operation",

            email: `multi-${Date.now()}@example.com`,

            balance: 1000,
          },
        ],

        {
          session,
        },
      );

      const user = users[0];

      /*
       * Update user
       */

      await User.updateOne(
        {
          _id: user._id,
        },

        {
          $inc: {
            balance: 500,
          },
        },

        {
          session,
        },
      );

      /*
       * Create department
       */

      await Department.create(
        [
          {
            name: "CSE Department",

            code: `CSE-${Date.now()}`,
          },
        ],

        {
          session,
        },
      );

      /*
       * Delete/update/etc.
       *
       * Everything belongs to
       * the same transaction.
       */
    });
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 14. SESSION IN FIND
 * ============================================================
 */

async function findInsideTransaction(session) {
  const user = await User.findOne({
    email: "shiva@example.com",
  }).session(session);

  return user;
}

/*
 * ============================================================
 * 15. SESSION IN UPDATE
 * ============================================================
 */

async function updateInsideTransaction(session, userId) {
  return User.findByIdAndUpdate(
    userId,

    {
      $inc: {
        balance: 100,
      },
    },

    {
      new: true,

      session,
    },
  );
}

/*
 * ============================================================
 * 16. SESSION IN DELETE
 * ============================================================
 */

async function deleteInsideTransaction(session, userId) {
  return User.deleteOne(
    {
      _id: userId,
    },

    {
      session,
    },
  );
}

/*
 * ============================================================
 * 17. REPOSITORY PATTERN
 * ============================================================
 */

const userRepository = {
  async create(data, session) {
    const users = await User.create(
      [data],

      {
        session,
      },
    );

    return users[0];
  },

  async findById(id, session) {
    return User.findById(id).session(session);
  },

  async updateBalance(id, amount, session) {
    return User.findByIdAndUpdate(
      id,

      {
        $inc: {
          balance: amount,
        },
      },

      {
        new: true,

        session,
      },
    );
  },

  async delete(id, session) {
    return User.deleteOne(
      {
        _id: id,
      },

      {
        session,
      },
    );
  },
};

/*
 * ============================================================
 * 18. DEPARTMENT REPOSITORY
 * ============================================================
 */

const departmentRepository = {
  async create(data, session) {
    const departments = await Department.create(
      [data],

      {
        session,
      },
    );

    return departments[0];
  },

  async findById(id, session) {
    return Department.findById(id).session(session);
  },
};

/*
 * ============================================================
 * 19. SERVICE PATTERN
 * ============================================================
 */

const userService = {
  async createUserWithDepartment(userData, departmentData) {
    const session = await mongoose.startSession();

    try {
      return await session.withTransaction(async () => {
        const user = await userRepository.create(
          userData,

          session,
        );

        const department = await departmentRepository.create(
          departmentData,

          session,
        );

        return {
          user,

          department,
        };
      });
    } finally {
      await session.endSession();
    }
  },
};

/*
 * ============================================================
 * 20. IMPORTANT:
 *
 * SAME SESSION
 * ============================================================
 *
 * Correct:
 *
 * service
 *    ↓
 * repository
 *    ↓
 * same session
 *
 * ============================================================
 */

async function correctTransactionPattern() {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const user = await userRepository.create(
        {
          name: "Correct Pattern",

          email: `correct-${Date.now()}@example.com`,

          balance: 1000,
        },

        session,
      );

      await userRepository.updateBalance(
        user._id,

        500,

        session,
      );

      const department = await departmentRepository.create(
        {
          name: "CSE",

          code: `CSE-${Date.now()}`,
        },

        session,
      );

      return {
        user,

        department,
      };
    });
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 21. WRONG TRANSACTION PATTERN
 * ============================================================
 */

async function wrongTransactionPattern() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      /*
       * WRONG:
       *
       * No session passed.
       */

      await User.create({
        name: "Wrong",

        email: `wrong-${Date.now()}@example.com`,

        balance: 100,
      });

      /*
       * This operation may NOT be
       * part of the transaction.
       */
    });
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 22. TRANSACTION WITH EXISTING DOCUMENT
 * ============================================================
 */

async function updateExistingDocument(userId) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const user = await User.findById(userId).session(session);

      if (!user) {
        throw new Error("User not found");
      }

      user.balance += 100;

      await user.save({
        session,
      });
    });
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 23. TRANSACTION OPTIONS
 * ============================================================
 */

async function transactionOptionsDemo() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(
      async () => {
        await User.create(
          [
            {
              name: "Transaction Options",

              email: `options-${Date.now()}@example.com`,

              balance: 100,
            },
          ],

          {
            session,
          },
        );
      },

      {
        /*
         * MongoDB transaction options.
         */

        readConcern: {
          level: "snapshot",
        },

        writeConcern: {
          w: "majority",
        },

        readPreference: "primary",
      },
    );
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 24. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  /*
   * Uncomment examples individually.
   */

  // await createSession();

  // await sessionWithQuery();

  // await createWithSession();

  // await manualTransaction();

  // await withTransactionDemo();

  // await transactionFailureDemo();

  // await multipleOperationsTransaction();

  // await correctTransactionPattern();

  await mongoose.disconnect();

  console.log("MongoDB disconnected");
}

await main();

/**
 * ============================================================
 * 26_transactions.js
 * ============================================================
 *
 * MongoDB Transactions with Mongoose
 *
 * Topics:
 *
 *  1. What is a transaction?
 *  2. Session
 *  3. startSession()
 *  4. startTransaction()
 *  5. commitTransaction()
 *  6. abortTransaction()
 *  7. endSession()
 *  8. withTransaction()
 *  9. Transaction options
 * 10. Passing session to queries
 * 11. create() with session
 * 12. save() with session
 * 13. updateOne() with session
 * 14. deleteOne() with session
 * 15. Rollback
 * 16. Nested operations
 * 17. Transaction errors
 * 18. Retry considerations
 * 19. Timetable transaction example
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
 * 2. USER SCHEMA
 * ============================================================
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  email: {
    type: String,

    required: true,
  },

  balance: {
    type: Number,

    default: 0,
  },
});

/*
 * ============================================================
 * 3. WALLET SCHEMA
 * ============================================================
 */

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "TransactionUser",

    required: true,
  },

  balance: {
    type: Number,

    default: 0,
  },
});

/*
 * ============================================================
 * 4. TRANSACTION LOG SCHEMA
 * ============================================================
 */

const transactionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "TransactionUser",

    required: true,
  },

  amount: {
    type: Number,

    required: true,
  },

  type: {
    type: String,

    enum: ["credit", "debit"],

    required: true,
  },
});

/*
 * ============================================================
 * 5. TIMETABLE SCHEMA
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  status: {
    type: String,

    enum: ["draft", "published"],

    default: "draft",
  },
});

/*
 * ============================================================
 * 6. ROOM SCHEMA
 * ============================================================
 */

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,

    required: true,

    unique: true,
  },

  occupied: {
    type: Boolean,

    default: false,
  },
});

/*
 * ============================================================
 * 7. FACULTY SCHEMA
 * ============================================================
 */

const facultySchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  available: {
    type: Boolean,

    default: true,
  },
});

/*
 * ============================================================
 * 8. TIMETABLE ENTRY SCHEMA
 * ============================================================
 */

const timetableEntrySchema = new mongoose.Schema({
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "TransactionTimetable",

    required: true,
  },

  roomId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "TransactionRoom",

    required: true,
  },

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "TransactionFaculty",

    required: true,
  },

  day: {
    type: String,

    required: true,
  },

  startTime: {
    type: String,

    required: true,
  },

  endTime: {
    type: String,

    required: true,
  },
});

/*
 * ============================================================
 * 9. MODELS
 * ============================================================
 */

const User =
  mongoose.models.TransactionUser ||
  mongoose.model("TransactionUser", userSchema);

const Wallet =
  mongoose.models.TransactionWallet ||
  mongoose.model("TransactionWallet", walletSchema);

const TransactionLog =
  mongoose.models.TransactionLog ||
  mongoose.model("TransactionLog", transactionLogSchema);

const Timetable =
  mongoose.models.TransactionTimetable ||
  mongoose.model("TransactionTimetable", timetableSchema);

const Room =
  mongoose.models.TransactionRoom ||
  mongoose.model("TransactionRoom", roomSchema);

const Faculty =
  mongoose.models.TransactionFaculty ||
  mongoose.model("TransactionFaculty", facultySchema);

const TimetableEntry =
  mongoose.models.TransactionTimetableEntry ||
  mongoose.model("TransactionTimetableEntry", timetableEntrySchema);

/*
 * ============================================================
 * 10. BASIC TRANSACTION
 * ============================================================
 *
 * Manual transaction lifecycle:
 *
 * session
 *    ↓
 * startTransaction()
 *    ↓
 * operations
 *    ↓
 * commitTransaction()
 *    ↓
 * endSession()
 *
 * ============================================================
 */

async function basicTransaction() {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /*
     * IMPORTANT:
     *
     * Every operation that should belong to the transaction
     * must receive the session.
     */

    const user = await User.create(
      [
        {
          name: "Transaction User",

          email: "transaction@example.com",

          balance: 1000,
        },
      ],

      {
        session,
      },
    );

    await Wallet.create(
      [
        {
          userId: user[0]._id,

          balance: 1000,
        },
      ],

      {
        session,
      },
    );

    await session.commitTransaction();

    console.log("\n===== TRANSACTION COMMITTED =====");
  } catch (error) {
    await session.abortTransaction();

    console.error("\n===== TRANSACTION ABORTED =====");

    console.error(error);
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 11. TRANSACTION WITH save()
 * ============================================================
 */

async function saveWithTransaction() {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = new User({
      name: "Save Transaction User",

      email: "save@example.com",

      balance: 500,
    });

    await user.save({
      session,
    });

    const wallet = new Wallet({
      userId: user._id,

      balance: 500,
    });

    await wallet.save({
      session,
    });

    await session.commitTransaction();

    console.log("\n===== SAVE TRANSACTION COMMITTED =====");
  } catch (error) {
    await session.abortTransaction();

    console.error("\n===== SAVE TRANSACTION ABORTED =====");
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 12. UPDATE WITH TRANSACTION
 * ============================================================
 */

async function updateWithTransaction(userId) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await User.updateOne(
      {
        _id: userId,
      },

      {
        $inc: {
          balance: 100,
        },
      },

      {
        session,
      },
    );

    await Wallet.updateOne(
      {
        userId,
      },

      {
        $inc: {
          balance: 100,
        },
      },

      {
        session,
      },
    );

    await session.commitTransaction();

    console.log("\n===== UPDATE TRANSACTION COMMITTED =====");
  } catch (error) {
    await session.abortTransaction();

    console.error("\n===== UPDATE TRANSACTION ABORTED =====");
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 13. DELETE WITH TRANSACTION
 * ============================================================
 */

async function deleteWithTransaction(userId) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Wallet.deleteOne(
      {
        userId,
      },

      {
        session,
      },
    );

    await TransactionLog.deleteMany(
      {
        userId,
      },

      {
        session,
      },
    );

    await User.deleteOne(
      {
        _id: userId,
      },

      {
        session,
      },
    );

    await session.commitTransaction();

    console.log("\n===== DELETE TRANSACTION COMMITTED =====");
  } catch (error) {
    await session.abortTransaction();

    console.error("\n===== DELETE TRANSACTION ABORTED =====");
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 14. withTransaction()
 * ============================================================
 *
 * Mongoose/MongoDB provides a cleaner transaction pattern.
 *
 * ============================================================
 */

async function withTransactionDemo() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const user = await User.create(
        [
          {
            name: "With Transaction",

            email: "withtransaction@example.com",

            balance: 2000,
          },
        ],

        {
          session,
        },
      );

      await Wallet.create(
        [
          {
            userId: user[0]._id,

            balance: 2000,
          },
        ],

        {
          session,
        },
      );
    });

    console.log("\n===== withTransaction() COMMITTED =====");
  } catch (error) {
    console.error("\n===== withTransaction() FAILED =====");

    console.error(error);
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 15. ROLLBACK DEMO
 * ============================================================
 */

async function rollbackDemo() {
  const session = await mongoose.startSession();

  let userId;

  try {
    session.startTransaction();

    const users = await User.create(
      [
        {
          name: "Rollback User",

          email: "rollback@example.com",

          balance: 1000,
        },
      ],

      {
        session,
      },
    );

    userId = users[0]._id;

    console.log("User created inside transaction:", userId);

    /*
     * Force an error.
     */

    throw new Error("Something failed after user creation");
  } catch (error) {
    console.log("\n===== ERROR OCCURRED =====");

    console.log(error.message);

    await session.abortTransaction();

    console.log("Transaction rolled back");
  } finally {
    await session.endSession();
  }

  /*
   * Because transaction was aborted,
   * the user should not exist.
   */

  const user = await User.findById(userId);

  console.log("\nUser after rollback:", user);
}

/*
 * ============================================================
 * 16. TRANSACTION OPTIONS
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
              name: "Transaction Options User",

              email: "options@example.com",

              balance: 500,
            },
          ],

          {
            session,
          },
        );
      },

      {
        /*
         * Read preference for transaction.
         */

        readPreference: "primary",

        /*
         * Durability.
         */

        writeConcern: {
          w: "majority",
        },

        /*
         * Isolation level.
         */

        readConcern: {
          level: "snapshot",
        },
      },
    );
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 17. TIMETABLE TRANSACTION
 * ============================================================
 *
 * Example:
 *
 * 1. Create timetable
 * 2. Reserve room
 * 3. Reserve faculty
 * 4. Create timetable entry
 *
 * If anything fails:
 *
 * EVERYTHING ROLLS BACK.
 *
 * ============================================================
 */

async function createTimetableTransaction() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      /*
       * ----------------------------------------------------
       * STEP 1
       * Create timetable
       * ----------------------------------------------------
       */

      const timetables = await Timetable.create(
        [
          {
            name: "CSE Semester 5",

            status: "draft",
          },
        ],

        {
          session,
        },
      );

      const timetable = timetables[0];

      /*
       * ----------------------------------------------------
       * STEP 2
       * Find available room
       * ----------------------------------------------------
       */

      const room = await Room.findOneAndUpdate(
        {
          occupied: false,
        },

        {
          $set: {
            occupied: true,
          },
        },

        {
          session,

          new: true,
        },
      );

      if (!room) {
        throw new Error("No room available");
      }

      /*
       * ----------------------------------------------------
       * STEP 3
       * Find available faculty
       * ----------------------------------------------------
       */

      const faculty = await Faculty.findOneAndUpdate(
        {
          available: true,
        },

        {
          $set: {
            available: false,
          },
        },

        {
          session,

          new: true,
        },
      );

      if (!faculty) {
        throw new Error("No faculty available");
      }

      /*
       * ----------------------------------------------------
       * STEP 4
       * Create timetable entry
       * ----------------------------------------------------
       */

      await TimetableEntry.create(
        [
          {
            timetableId: timetable._id,

            roomId: room._id,

            facultyId: faculty._id,

            day: "Monday",

            startTime: "09:00",

            endTime: "10:00",
          },
        ],

        {
          session,
        },
      );

      /*
       * ----------------------------------------------------
       * STEP 5
       * Publish timetable
       * ----------------------------------------------------
       */

      await Timetable.updateOne(
        {
          _id: timetable._id,
        },

        {
          $set: {
            status: "published",
          },
        },

        {
          session,
        },
      );
    });

    console.log("\n===== TIMETABLE TRANSACTION COMMITTED =====");
  } catch (error) {
    console.error("\n===== TIMETABLE TRANSACTION ROLLED BACK =====");

    console.error(error.message);
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 18. TRANSACTION READ
 * ============================================================
 *
 * Reads can also participate in a transaction.
 *
 * IMPORTANT:
 *
 * Pass session.
 *
 * ============================================================
 */

async function transactionReadDemo() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const users = await User.find({
        balance: {
          $gte: 1000,
        },
      })

        .session(session);

      console.log("\nUsers inside transaction:", users.length);
    });
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 19. TRANSACTION COUNT
 * ============================================================
 */

async function transactionCountDemo() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const count = await User.countDocuments(
        {
          balance: {
            $gte: 100,
          },
        },

        {
          session,
        },
      );

      console.log("\nCount:", count);
    });
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 20. IMPORTANT SESSION RULE
 * ============================================================
 *
 * WRONG:
 *
 * await User.create(...);
 * await Wallet.create(..., { session });
 *
 * User operation is OUTSIDE transaction.
 *
 *
 * CORRECT:
 *
 * await User.create(..., { session });
 * await Wallet.create(..., { session });
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. TRANSACTION HELPER
 * ============================================================
 *
 * In production applications, don't repeat the same
 * session lifecycle everywhere.
 *
 * ============================================================
 */

async function runTransaction(callback) {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      return await callback(session);
    });
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 22. TRANSACTION HELPER DEMO
 * ============================================================
 */

async function transactionHelperDemo() {
  await runTransaction(async (session) => {
    const users = await User.create(
      [
        {
          name: "Helper User",

          email: "helper@example.com",

          balance: 100,
        },
      ],

      {
        session,
      },
    );

    await TransactionLog.create(
      [
        {
          userId: users[0]._id,

          amount: 100,

          type: "credit",
        },
      ],

      {
        session,
      },
    );
  });

  console.log("\n===== HELPER TRANSACTION COMPLETE =====");
}

/*
 * ============================================================
 * 23. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    await basicTransaction();

    await saveWithTransaction();

    await withTransactionDemo();

    await rollbackDemo();

    await transactionOptionsDemo();

    await createTimetableTransaction();

    await transactionReadDemo();

    await transactionCountDemo();

    await transactionHelperDemo();
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 24. RUN
 * ============================================================
 */

await main();

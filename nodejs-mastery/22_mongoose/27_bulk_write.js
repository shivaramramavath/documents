/**
 * ============================================================
 * 27_bulk_write.js
 * ============================================================
 *
 * Mongoose bulkWrite()
 *
 * Topics:
 *
 *  1. insertOne
 *  2. updateOne
 *  3. updateMany
 *  4. deleteOne
 *  5. deleteMany
 *  6. replaceOne
 *  7. upsert
 *  8. ordered
 *  9. unordered
 * 10. bulkWrite result
 * 11. filters
 * 12. update operators
 * 13. timestamps
 * 14. validation
 * 15. bulkWrite + session
 * 16. bulkWrite + transaction
 * 17. timetable example
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

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },

    email: {
      type: String,

      required: true,

      unique: true,
    },

    age: {
      type: Number,

      default: 0,
    },

    active: {
      type: Boolean,

      default: true,
    },
  },

  {
    timestamps: true,
  },
);

/*
 * ============================================================
 * 3. PRODUCT SCHEMA
 * ============================================================
 */

const productSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  stock: {
    type: Number,

    default: 0,
  },

  price: {
    type: Number,

    required: true,
  },
});

/*
 * ============================================================
 * 4. TIMETABLE ENTRY SCHEMA
 * ============================================================
 */

const timetableEntrySchema = new mongoose.Schema({
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,

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

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,

    required: true,
  },

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,

    required: true,
  },

  roomId: {
    type: mongoose.Schema.Types.ObjectId,

    required: true,
  },
});

/*
 * ============================================================
 * 5. MODELS
 * ============================================================
 */

const User = mongoose.models.BulkUser || mongoose.model("BulkUser", userSchema);

const Product =
  mongoose.models.BulkProduct || mongoose.model("BulkProduct", productSchema);

const TimetableEntry =
  mongoose.models.BulkTimetableEntry ||
  mongoose.model("BulkTimetableEntry", timetableEntrySchema);

/*
 * ============================================================
 * 6. INSERT ONE
 * ============================================================
 */

async function insertOneDemo() {
  const result = await User.bulkWrite([
    {
      insertOne: {
        document: {
          name: "User One",

          email: "user1@example.com",

          age: 20,
        },
      },
    },
  ]);

  console.log("\n===== insertOne =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 7. MULTIPLE INSERTS
 * ============================================================
 */

async function multipleInsertDemo() {
  const result = await User.bulkWrite([
    {
      insertOne: {
        document: {
          name: "User Two",

          email: "user2@example.com",

          age: 21,
        },
      },
    },

    {
      insertOne: {
        document: {
          name: "User Three",

          email: "user3@example.com",

          age: 22,
        },
      },
    },

    {
      insertOne: {
        document: {
          name: "User Four",

          email: "user4@example.com",

          age: 23,
        },
      },
    },
  ]);

  console.log("\n===== MULTIPLE INSERTS =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 8. UPDATE ONE
 * ============================================================
 */

async function updateOneDemo() {
  const result = await User.bulkWrite([
    {
      updateOne: {
        filter: {
          email: "user1@example.com",
        },

        update: {
          $set: {
            age: 25,
          },
        },
      },
    },
  ]);

  console.log("\n===== updateOne =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 9. MULTIPLE UPDATE ONE
 * ============================================================
 */

async function multipleUpdateDemo() {
  const result = await User.bulkWrite([
    {
      updateOne: {
        filter: {
          email: "user1@example.com",
        },

        update: {
          $inc: {
            age: 1,
          },
        },
      },
    },

    {
      updateOne: {
        filter: {
          email: "user2@example.com",
        },

        update: {
          $set: {
            active: false,
          },
        },
      },
    },

    {
      updateOne: {
        filter: {
          email: "user3@example.com",
        },

        update: {
          $set: {
            name: "Updated User Three",
          },
        },
      },
    },
  ]);

  console.log("\n===== MULTIPLE UPDATE ONE =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 10. UPDATE MANY
 * ============================================================
 */

async function updateManyDemo() {
  const result = await User.bulkWrite([
    {
      updateMany: {
        filter: {
          age: {
            $gte: 20,
          },
        },

        update: {
          $set: {
            active: true,
          },
        },
      },
    },
  ]);

  console.log("\n===== updateMany =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 11. DELETE ONE
 * ============================================================
 */

async function deleteOneDemo() {
  const result = await User.bulkWrite([
    {
      deleteOne: {
        filter: {
          email: "user4@example.com",
        },
      },
    },
  ]);

  console.log("\n===== deleteOne =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 12. DELETE MANY
 * ============================================================
 */

async function deleteManyDemo() {
  const result = await User.bulkWrite([
    {
      deleteMany: {
        filter: {
          active: false,
        },
      },
    },
  ]);

  console.log("\n===== deleteMany =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 13. REPLACE ONE
 * ============================================================
 *
 * replaceOne replaces the entire document.
 *
 * Be careful:
 *
 * Existing fields not included in replacement disappear.
 *
 * ============================================================
 */

async function replaceOneDemo() {
  const result = await User.bulkWrite([
    {
      replaceOne: {
        filter: {
          email: "user1@example.com",
        },

        replacement: {
          name: "Completely Replaced User",

          email: "user1@example.com",

          age: 30,

          active: true,
        },
      },
    },
  ]);

  console.log("\n===== replaceOne =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 14. UPSERT
 * ============================================================
 *
 * If document exists:
 *
 *     UPDATE
 *
 * If document doesn't exist:
 *
 *     INSERT
 *
 * ============================================================
 */

async function upsertDemo() {
  const result = await User.bulkWrite([
    {
      updateOne: {
        filter: {
          email: "upsert@example.com",
        },

        update: {
          $set: {
            name: "Upsert User",

            age: 25,

            active: true,
          },
        },

        upsert: true,
      },
    },
  ]);

  console.log("\n===== UPSERT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 15. UPSERT WITH $setOnInsert
 * ============================================================
 */

async function setOnInsertDemo() {
  const result = await User.bulkWrite([
    {
      updateOne: {
        filter: {
          email: "new-user@example.com",
        },

        update: {
          $set: {
            active: true,
          },

          $setOnInsert: {
            name: "New User",

            age: 18,
          },
        },

        upsert: true,
      },
    },
  ]);

  console.log("\n===== $setOnInsert =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 16. ORDERED BULK WRITE
 * ============================================================
 *
 * Default:
 *
 * ordered = true
 *
 * MongoDB executes operations in order.
 *
 * If one operation fails, subsequent operations
 * are not processed.
 *
 * ============================================================
 */

async function orderedDemo() {
  try {
    const result = await User.bulkWrite(
      [
        {
          insertOne: {
            document: {
              name: "Ordered One",

              email: "ordered1@example.com",
            },
          },
        },

        {
          insertOne: {
            document: {
              name: "Ordered Two",

              email: "ordered2@example.com",
            },
          },
        },
      ],

      {
        ordered: true,
      },
    );

    console.log("\n===== ORDERED BULK WRITE =====");

    console.dir(result, {
      depth: 10,
    });
  } catch (error) {
    console.error(error.message);
  }
}

/*
 * ============================================================
 * 17. UNORDERED BULK WRITE
 * ============================================================
 *
 * ordered = false
 *
 * MongoDB can continue processing other operations
 * even if one operation fails.
 *
 * ============================================================
 */

async function unorderedDemo() {
  try {
    const result = await User.bulkWrite(
      [
        {
          insertOne: {
            document: {
              name: "Unordered One",

              email: "unordered1@example.com",
            },
          },
        },

        {
          insertOne: {
            document: {
              name: "Duplicate Email",

              email: "unordered1@example.com",
            },
          },
        },

        {
          insertOne: {
            document: {
              name: "Unordered Three",

              email: "unordered3@example.com",
            },
          },
        },
      ],

      {
        ordered: false,
      },
    );

    console.log("\n===== UNORDERED BULK WRITE =====");

    console.dir(result, {
      depth: 10,
    });
  } catch (error) {
    console.error("\nBulk error:", error.message);
  }
}

/*
 * ============================================================
 * 18. MIXED BULK OPERATIONS
 * ============================================================
 */

async function mixedBulkDemo() {
  const result = await Product.bulkWrite([
    /*
     * INSERT
     */

    {
      insertOne: {
        document: {
          name: "Keyboard",

          stock: 100,

          price: 1500,
        },
      },
    },

    /*
     * INSERT
     */

    {
      insertOne: {
        document: {
          name: "Mouse",

          stock: 200,

          price: 700,
        },
      },
    },

    /*
     * UPDATE
     */

    {
      updateOne: {
        filter: {
          name: "Keyboard",
        },

        update: {
          $inc: {
            stock: 50,
          },
        },
      },
    },

    /*
     * UPDATE MANY
     */

    {
      updateMany: {
        filter: {
          price: {
            $gte: 500,
          },
        },

        update: {
          $inc: {
            stock: 10,
          },
        },
      },
    },
  ]);

  console.log("\n===== MIXED BULK =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 19. BULK WRITE WITH SESSION
 * ============================================================
 */

async function bulkWriteWithSession() {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await User.bulkWrite(
        [
          {
            updateOne: {
              filter: {
                email: "transaction-bulk@example.com",
              },

              update: {
                $set: {
                  name: "Transaction Bulk User",
                },
              },

              upsert: true,
            },
          },

          {
            updateOne: {
              filter: {
                email: "transaction-bulk-2@example.com",
              },

              update: {
                $set: {
                  name: "Transaction Bulk User 2",
                },
              },

              upsert: true,
            },
          },
        ],

        {
          session,
        },
      );
    });

    console.log("\n===== BULK + TRANSACTION =====");
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 20. TIMETABLE BULK INSERT
 * ============================================================
 *
 * Imagine AI generated 30 timetable entries.
 *
 * Instead of:
 *
 * await Entry.create(...)
 * await Entry.create(...)
 * await Entry.create(...)
 *
 * use ONE bulkWrite.
 *
 * ============================================================
 */

async function createTimetableEntries(
  timetableId,
  facultyId,
  subjectId,
  roomId,
) {
  const entries = [
    {
      day: "Monday",

      startTime: "09:00",

      endTime: "10:00",
    },

    {
      day: "Monday",

      startTime: "10:00",

      endTime: "11:00",
    },

    {
      day: "Monday",

      startTime: "11:00",

      endTime: "12:00",
    },

    {
      day: "Tuesday",

      startTime: "09:00",

      endTime: "10:00",
    },

    {
      day: "Tuesday",

      startTime: "10:00",

      endTime: "11:00",
    },
  ];

  const operations = entries.map((entry) => ({
    insertOne: {
      document: {
        timetableId,

        facultyId,

        subjectId,

        roomId,

        day: entry.day,

        startTime: entry.startTime,

        endTime: entry.endTime,
      },
    },
  }));

  const result = await TimetableEntry.bulkWrite(operations);

  console.log("\n===== TIMETABLE BULK INSERT =====");

  console.log("Inserted:", result.insertedCount);

  return result;
}

/*
 * ============================================================
 * 21. TIMETABLE BULK UPDATE
 * ============================================================
 */

async function updateTimetableEntries(timetableId) {
  const result = await TimetableEntry.bulkWrite([
    {
      updateOne: {
        filter: {
          timetableId,

          day: "Monday",

          startTime: "09:00",
        },

        update: {
          $set: {
            startTime: "09:30",

            endTime: "10:30",
          },
        },
      },
    },

    {
      updateOne: {
        filter: {
          timetableId,

          day: "Monday",

          startTime: "10:00",
        },

        update: {
          $set: {
            startTime: "10:30",

            endTime: "11:30",
          },
        },
      },
    },
  ]);

  console.log("\n===== TIMETABLE BULK UPDATE =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 22. TIMETABLE UPSERT
 * ============================================================
 *
 * Very useful for synchronization.
 *
 * Natural key:
 *
 * timetableId
 * + day
 * + startTime
 * + roomId
 *
 * ============================================================
 */

async function syncTimetableEntries(timetableId, facultyId, subjectId, roomId) {
  const entries = [
    {
      day: "Wednesday",

      startTime: "09:00",

      endTime: "10:00",
    },

    {
      day: "Wednesday",

      startTime: "10:00",

      endTime: "11:00",
    },
  ];

  const operations = entries.map((entry) => ({
    updateOne: {
      filter: {
        timetableId,

        day: entry.day,

        startTime: entry.startTime,

        roomId,
      },

      update: {
        $set: {
          endTime: entry.endTime,

          facultyId,

          subjectId,
        },
      },

      upsert: true,
    },
  }));

  const result = await TimetableEntry.bulkWrite(operations);

  console.log("\n===== TIMETABLE UPSERT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 23. BULK DELETE
 * ============================================================
 */

async function deleteTimetableEntries(timetableId) {
  const result = await TimetableEntry.bulkWrite([
    {
      deleteMany: {
        filter: {
          timetableId,

          day: "Wednesday",
        },
      },
    },
  ]);

  console.log("\n===== BULK DELETE =====");

  console.log("Deleted:", result.deletedCount);
}

/*
 * ============================================================
 * 24. BULK + TRANSACTION FOR TIMETABLE
 * ============================================================
 */

async function transactionalTimetableBulk(
  timetableId,
  facultyId,
  subjectId,
  roomId,
) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      /*
       * --------------------------------------------
       * Remove old entries
       * --------------------------------------------
       */

      await TimetableEntry.deleteMany(
        {
          timetableId,
        },

        {
          session,
        },
      );

      /*
       * --------------------------------------------
       * Insert new entries
       * --------------------------------------------
       */

      await TimetableEntry.bulkWrite(
        [
          {
            insertOne: {
              document: {
                timetableId,

                facultyId,

                subjectId,

                roomId,

                day: "Monday",

                startTime: "09:00",

                endTime: "10:00",
              },
            },
          },

          {
            insertOne: {
              document: {
                timetableId,

                facultyId,

                subjectId,

                roomId,

                day: "Monday",

                startTime: "10:00",

                endTime: "11:00",
              },
            },
          },

          {
            insertOne: {
              document: {
                timetableId,

                facultyId,

                subjectId,

                roomId,

                day: "Tuesday",

                startTime: "09:00",

                endTime: "10:00",
              },
            },
          },
        ],

        {
          session,
        },
      );
    });

    console.log("\n===== TRANSACTIONAL TIMETABLE BULK =====");
  } finally {
    await session.endSession();
  }
}

/*
 * ============================================================
 * 25. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    await insertOneDemo();

    await multipleInsertDemo();

    await updateOneDemo();

    await multipleUpdateDemo();

    await updateManyDemo();

    await deleteOneDemo();

    await deleteManyDemo();

    await replaceOneDemo();

    await upsertDemo();

    await setOnInsertDemo();

    await orderedDemo();

    await unorderedDemo();

    await mixedBulkDemo();

    await bulkWriteWithSession();
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 26. RUN
 * ============================================================
 */

await main();

/**
 * ============================================================
 * 29_change_streams.js
 * ============================================================
 *
 * Mongoose Change Streams
 *
 * Topics:
 *
 *  1. What is a Change Stream?
 *  2. Model.watch()
 *  3. Connection.watch()
 *  4. Insert events
 *  5. Update events
 *  6. Replace events
 *  7. Delete events
 *  8. Full document
 *  9. Full document lookup
 * 10. Event filtering
 * 11. Resume tokens
 * 12. startAfter
 * 13. resumeAfter
 * 14. Error handling
 * 15. close()
 * 16. Socket.IO integration
 * 17. Production pattern
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

const timetableSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,
    },

    department: {
      type: String,

      required: true,
    },

    semester: {
      type: Number,

      required: true,
    },

    section: {
      type: String,

      required: true,
    },

    status: {
      type: String,

      enum: ["draft", "published", "archived"],

      default: "draft",
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

const Timetable =
  mongoose.models.ChangeStreamTimetable ||
  mongoose.model("ChangeStreamTimetable", timetableSchema);

/*
 * ============================================================
 * 4. BASIC CHANGE STREAM
 * ============================================================
 */

async function basicChangeStream() {
  const changeStream = Timetable.watch();

  console.log("Change stream started");

  changeStream.on("change", (change) => {
    console.log("\n===== CHANGE EVENT =====");

    console.dir(change, {
      depth: 10,
    });
  });

  return changeStream;
}

/*
 * ============================================================
 * 5. INSERT EVENT
 * ============================================================
 */

async function insertDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      console.log("\n===== INSERT =====");

      console.log("Document:");

      console.dir(change.fullDocument, {
        depth: 10,
      });
    }
  });

  return changeStream;
}

/*
 * ============================================================
 * 6. UPDATE EVENT
 * ============================================================
 */

async function updateDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "update") {
      console.log("\n===== UPDATE =====");

      console.log("Document ID:", change.documentKey._id);

      console.log("Updated fields:");

      console.dir(change.updateDescription, {
        depth: 10,
      });
    }
  });

  return changeStream;
}

/*
 * ============================================================
 * 7. DELETE EVENT
 * ============================================================
 */

async function deleteDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "delete") {
      console.log("\n===== DELETE =====");

      console.log("Deleted document:", change.documentKey._id);
    }
  });

  return changeStream;
}

/*
 * ============================================================
 * 8. REPLACE EVENT
 * ============================================================
 */

async function replaceDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "replace") {
      console.log("\n===== REPLACE =====");

      console.dir(change.fullDocument, {
        depth: 10,
      });
    }
  });

  return changeStream;
}

/*
 * ============================================================
 * 9. LISTEN TO MULTIPLE OPERATIONS
 * ============================================================
 */

async function multipleOperationsDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        console.log("INSERT", change.documentKey._id);

        break;

      case "update":
        console.log("UPDATE", change.documentKey._id);

        break;

      case "replace":
        console.log("REPLACE", change.documentKey._id);

        break;

      case "delete":
        console.log("DELETE", change.documentKey._id);

        break;

      default:
        console.log("OTHER", change.operationType);
    }
  });

  return changeStream;
}

/*
 * ============================================================
 * 10. FULL DOCUMENT LOOKUP
 * ============================================================
 *
 * By default an update event may contain:
 *
 * updateDescription
 *
 * rather than the complete updated document.
 *
 * ============================================================
 */

async function fullDocumentDemo() {
  const changeStream = Timetable.watch(
    [],

    {
      fullDocument: "updateLookup",
    },
  );

  changeStream.on("change", (change) => {
    console.log("\n===== FULL DOCUMENT =====");

    console.log("Operation:", change.operationType);

    console.dir(change.fullDocument, {
      depth: 10,
    });
  });

  return changeStream;
}

/*
 * ============================================================
 * 11. UPDATE DESCRIPTION
 * ============================================================
 */

async function updateDescriptionDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    if (change.operationType !== "update") {
      return;
    }

    const {
      updatedFields,

      removedFields,

      truncatedArrays,
    } = change.updateDescription;

    console.log("\n===== UPDATE DESCRIPTION =====");

    console.log("Updated fields:");

    console.dir(updatedFields, {
      depth: 10,
    });

    console.log("Removed fields:");

    console.dir(removedFields, {
      depth: 10,
    });

    console.log("Truncated arrays:");

    console.dir(truncatedArrays, {
      depth: 10,
    });
  });

  return changeStream;
}

/*
 * ============================================================
 * 12. FILTER CHANGE EVENTS
 * ============================================================
 *
 * Only watch published timetables.
 *
 * ============================================================
 */

async function filteredChangeStream() {
  const pipeline = [
    {
      $match: {
        operationType: {
          $in: ["insert", "update", "replace", "delete"],
        },
      },
    },
  ];

  const changeStream = Timetable.watch(pipeline);

  changeStream.on("change", (change) => {
    console.log("\n===== FILTERED EVENT =====");

    console.dir(change, {
      depth: 10,
    });
  });

  return changeStream;
}

/*
 * ============================================================
 * 13. WATCH ONLY UPDATES
 * ============================================================
 */

async function watchOnlyUpdates() {
  const changeStream = Timetable.watch([
    {
      $match: {
        operationType: "update",
      },
    },
  ]);

  changeStream.on("change", (change) => {
    console.log("\n===== UPDATE EVENT =====");

    console.log("ID:", change.documentKey._id);

    console.dir(change.updateDescription, {
      depth: 10,
    });
  });

  return changeStream;
}

/*
 * ============================================================
 * 14. WATCH PUBLISHED TIMETABLES
 * ============================================================
 *
 * Important:
 *
 * For update events, the changed document's
 * current value is available when using
 * fullDocument: "updateLookup".
 *
 * ============================================================
 */

async function watchPublishedTimetables() {
  const changeStream = Timetable.watch(
    [
      {
        $match: {
          "fullDocument.status": "published",
        },
      },
    ],

    {
      fullDocument: "updateLookup",
    },
  );

  changeStream.on("change", (change) => {
    console.log("\n===== PUBLISHED TIMETABLE CHANGE =====");

    console.log("Operation:", change.operationType);

    console.dir(change.fullDocument, {
      depth: 10,
    });
  });

  return changeStream;
}

/*
 * ============================================================
 * 15. RESUME TOKEN
 * ============================================================
 */

async function resumeTokenDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    const resumeToken = changeStream.resumeToken;

    console.log("\n===== RESUME TOKEN =====");

    console.dir(resumeToken, {
      depth: 10,
    });
  });

  return changeStream;
}

/*
 * ============================================================
 * 16. CLOSE CHANGE STREAM
 * ============================================================
 */

async function closeStreamDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    console.log("Change:", change.operationType);
  });

  /*
   * Later:
   *
   * await changeStream.close();
   */

  return changeStream;
}

/*
 * ============================================================
 * 17. CHANGE STREAM EVENTS
 * ============================================================
 */

async function streamEventsDemo() {
  const changeStream = Timetable.watch();

  changeStream.on("change", (change) => {
    console.log("CHANGE", change.operationType);
  });

  changeStream.on("error", (error) => {
    console.error("CHANGE STREAM ERROR", error);
  });

  changeStream.on("close", () => {
    console.log("CHANGE STREAM CLOSED");
  });

  changeStream.on("end", () => {
    console.log("CHANGE STREAM ENDED");
  });

  return changeStream;
}

/*
 * ============================================================
 * 18. ASYNC ITERATOR
 * ============================================================
 *
 * Change streams are async iterables.
 *
 * ============================================================
 */

async function asyncIteratorDemo() {
  const changeStream = Timetable.watch();

  try {
    for await (const change of changeStream) {
      console.log("\n===== ASYNC CHANGE =====");

      console.dir(change, {
        depth: 10,
      });
    }
  } finally {
    await changeStream.close();
  }
}

/*
 * ============================================================
 * 19. CREATE A CHANGE
 * ============================================================
 */

async function createTimetable() {
  const timetable = await Timetable.create({
    name: "CSE Timetable",

    department: "CSE",

    semester: 6,

    section: "A",

    status: "draft",
  });

  console.log("\nCreated:", timetable._id);

  return timetable;
}

/*
 * ============================================================
 * 20. UPDATE A TIMETABLE
 * ============================================================
 */

async function updateTimetable(timetableId) {
  const timetable = await Timetable.findByIdAndUpdate(
    timetableId,

    {
      $set: {
        status: "published",
      },
    },

    {
      new: true,
    },
  );

  console.log("\nUpdated:", timetable);

  return timetable;
}

/*
 * ============================================================
 * 21. DELETE A TIMETABLE
 * ============================================================
 */

async function deleteTimetable(timetableId) {
  await Timetable.findByIdAndDelete(timetableId);

  console.log("\nDeleted:", timetableId);
}

/*
 * ============================================================
 * 22. SOCKET.IO STYLE HANDLER
 * ============================================================
 *
 * Imagine:
 *
 * change stream
 *      ↓
 * socket.emit()
 *
 * ============================================================
 */

function handleTimetableChange(change, io) {
  switch (change.operationType) {
    case "insert":
      io.emit("timetable:created", {
        document: change.fullDocument,
      });

      break;

    case "update":
      io.emit("timetable:updated", {
        id: change.documentKey._id,

        document: change.fullDocument,

        changes: change.updateDescription,
      });

      break;

    case "replace":
      io.emit("timetable:replaced", {
        id: change.documentKey._id,

        document: change.fullDocument,
      });

      break;

    case "delete":
      io.emit("timetable:deleted", {
        id: change.documentKey._id,
      });

      break;
  }
}

/*
 * ============================================================
 * 23. SOCKET.IO CHANGE STREAM
 * ============================================================
 */

function startTimetableWatcher(io) {
  const changeStream = Timetable.watch(
    [],

    {
      fullDocument: "updateLookup",
    },
  );

  changeStream.on("change", (change) => {
    handleTimetableChange(change, io);
  });

  changeStream.on("error", (error) => {
    console.error("Timetable watcher error:", error);
  });

  changeStream.on("close", () => {
    console.log("Timetable watcher closed");
  });

  return changeStream;
}

/*
 * ============================================================
 * 24. PRODUCTION WATCHER
 * ============================================================
 */

function createProductionWatcher(model, onChange) {
  const changeStream = model.watch(
    [],

    {
      fullDocument: "updateLookup",
    },
  );

  changeStream.on("change", async (change) => {
    try {
      await onChange(change);
    } catch (error) {
      console.error("Change handler failed:", error);
    }
  });

  changeStream.on("error", (error) => {
    console.error("Change stream error:", error);
  });

  changeStream.on("close", () => {
    console.warn("Change stream closed");
  });

  return changeStream;
}

/*
 * ============================================================
 * 25. EXAMPLE PRODUCTION HANDLER
 * ============================================================
 */

async function handleProductionChange(change) {
  switch (change.operationType) {
    case "insert":
      console.log("Timetable created:", change.documentKey._id);

      break;

    case "update":
      console.log("Timetable updated:", change.documentKey._id);

      console.log("Changes:", change.updateDescription);

      break;

    case "delete":
      console.log("Timetable deleted:", change.documentKey._id);

      break;
  }
}

/*
 * ============================================================
 * 26. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  /*
   * Start ONE watcher.
   */

  const changeStream = createProductionWatcher(
    Timetable,

    handleProductionChange,
  );

  /*
   * Keep application alive.
   */

  const shutdown = async () => {
    console.log("\nShutting down...");

    await changeStream.close();

    await mongoose.disconnect();

    console.log("MongoDB disconnected");

    process.exit(0);
  };

  process.on("SIGINT", shutdown);

  process.on("SIGTERM", shutdown);
}

/*
 * ============================================================
 * 27. START
 * ============================================================
 */

await main();

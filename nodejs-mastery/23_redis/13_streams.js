import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const redis = new Redis(REDIS_URL);

/*
 * ============================================================
 * Redis events
 * ============================================================
 */

redis.on("connect", () => {
  console.log("[redis] connected");
});

redis.on("ready", () => {
  console.log("[redis] ready");
});

redis.on("error", (error) => {
  console.error("[redis] error:", error);
});

redis.on("close", () => {
  console.log("[redis] connection closed");
});

redis.on("reconnecting", (delay) => {
  console.log(`[redis] reconnecting in ${delay}ms`);
});

/*
 * ============================================================
 * Stream names
 * ============================================================
 */

const STREAMS = {
  events: "app:events",

  timetable: "timetable:events",

  users: "user:events",
};

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del(STREAMS.events, STREAMS.timetable, STREAMS.users);
}

/*
 * ============================================================
 * 01. XADD
 * ============================================================
 *
 * Add a message to a stream.
 *
 * XADD stream * field value field value
 * ============================================================
 */

async function addMessage() {
  const id = await redis.xadd(
    STREAMS.events,
    "*",

    "type",
    "USER_CREATED",

    "userId",
    "user:100",

    "name",
    "Shiva",
  );

  console.log("Created stream message:", id);
}

/*
 * ============================================================
 * 02. XADD with multiple fields
 * ============================================================
 */

async function addTimetableEvent() {
  const id = await redis.xadd(
    STREAMS.timetable,
    "*",

    "type",
    "TIMETABLE_GENERATED",

    "timetableId",
    "timetable:100",

    "status",
    "completed",

    "version",
    "1",

    "timestamp",
    Date.now().toString(),
  );

  console.log("Timetable event ID:", id);
}

/*
 * ============================================================
 * 03. Read stream using XRANGE
 * ============================================================
 *
 * XRANGE returns messages in ID order.
 * ============================================================
 */

async function rangeMessages() {
  const messages = await redis.xrange(STREAMS.events, "-", "+");

  console.log("Stream messages:", messages);
}

/*
 * ============================================================
 * 04. Read limited messages
 * ============================================================
 */

async function rangeWithCount() {
  const messages = await redis.xrange(STREAMS.events, "-", "+", "COUNT", 10);

  console.log("First 10 messages:", messages);
}

/*
 * ============================================================
 * 05. Read messages after a specific ID
 * ============================================================
 */

async function rangeAfterId() {
  const messages = await redis.xrange(STREAMS.events, "(0-0", "+");

  console.log("Messages after 0-0:", messages);
}

/*
 * ============================================================
 * 06. XREVRANGE
 * ============================================================
 *
 * Read newest messages first.
 * ============================================================
 */

async function reverseRange() {
  const messages = await redis.xrevrange(STREAMS.events, "+", "-", "COUNT", 5);

  console.log("Latest 5 messages:", messages);
}

/*
 * ============================================================
 * 07. XREAD
 * ============================================================
 *
 * XREAD reads entries from one or more streams.
 * ============================================================
 */

async function readStream() {
  const result = await redis.xread(
    "COUNT",
    10,

    "STREAMS",

    STREAMS.events,

    "0-0",
  );

  console.log("XREAD result:", result);
}

/*
 * ============================================================
 * 08. Read multiple streams
 * ============================================================
 */

async function readMultipleStreams() {
  const result = await redis.xread(
    "COUNT",
    10,

    "STREAMS",

    STREAMS.events,
    STREAMS.timetable,

    "0-0",
    "0-0",
  );

  console.log("Multiple streams:", result);
}

/*
 * ============================================================
 * 09. XREAD with latest ID
 * ============================================================
 */

async function readNewMessages() {
  const result = await redis.xread(
    "COUNT",
    10,

    "STREAMS",

    STREAMS.events,

    "$",
  );

  console.log("New messages:", result);
}

/*
 * ============================================================
 * 10. Blocking XREAD
 * ============================================================
 *
 * BLOCK makes Redis wait for new messages.
 *
 * Time is milliseconds.
 * ============================================================
 */

async function blockingRead() {
  console.log("Waiting for new stream message...");

  const result = await redis.xread(
    "BLOCK",
    5000,

    "COUNT",
    10,

    "STREAMS",

    STREAMS.events,

    "$",
  );

  console.log("Blocking result:", result);
}

/*
 * ============================================================
 * 11. XINFO STREAM
 * ============================================================
 */

async function streamInfo() {
  const info = await redis.xinfo("STREAM", STREAMS.events);

  console.log("Stream info:", info);
}

/*
 * ============================================================
 * 12. XINFO GROUPS
 * ============================================================
 */

async function groupInfo() {
  const groups = await redis.xinfo("GROUPS", STREAMS.events);

  console.log("Consumer groups:", groups);
}

/*
 * ============================================================
 * 13. Stream length
 * ============================================================
 */

async function streamLength() {
  const length = await redis.xlen(STREAMS.events);

  console.log("Stream length:", length);
}

/*
 * ============================================================
 * 14. MAXLEN
 * ============================================================
 *
 * Keep stream size bounded.
 * ============================================================
 */

async function boundedStream() {
  for (let i = 1; i <= 20; i++) {
    await redis.xadd(
      STREAMS.events,
      "MAXLEN",
      "~",
      10,
      "*",

      "type",
      "TEST_EVENT",

      "index",
      i.toString(),
    );
  }

  const length = await redis.xlen(STREAMS.events);

  console.log("Bounded stream length:", length);
}

/*
 * ============================================================
 * 15. Exact MAXLEN
 * ============================================================
 */

async function exactMaxLength() {
  await redis.xadd(
    STREAMS.events,

    "MAXLEN",
    "=",
    100,

    "*",

    "type",
    "EXACT_LIMIT",

    "value",
    "hello",
  );

  console.log("Exact MAXLEN applied");
}

/*
 * ============================================================
 * 16. Manual stream deletion
 * ============================================================
 */

async function deleteMessage() {
  const id = await redis.xadd(
    STREAMS.events,
    "*",

    "type",
    "DELETE_TEST",

    "value",
    "temporary",
  );

  console.log("Created:", id);

  const deleted = await redis.xdel(STREAMS.events, id);

  console.log("Deleted:", deleted);
}

/*
 * ============================================================
 * 17. Multiple XADD operations
 * ============================================================
 */

async function addMultipleEvents() {
  const events = [
    {
      type: "USER_CREATED",

      userId: "100",
    },

    {
      type: "USER_UPDATED",

      userId: "100",
    },

    {
      type: "TIMETABLE_CREATED",

      timetableId: "100",
    },

    {
      type: "TIMETABLE_GENERATED",

      timetableId: "100",
    },
  ];

  for (const event of events) {
    const id = await redis.xadd(
      STREAMS.events,
      "*",

      "type",
      event.type,

      "data",
      JSON.stringify(event),

      "timestamp",
      Date.now().toString(),
    );

    console.log("Event:", id);
  }
}

/*
 * ============================================================
 * 18. Event envelope
 * ============================================================
 */

function createEvent({ type, source, data }) {
  return {
    eventId: crypto.randomUUID(),

    type,

    source,

    timestamp: new Date().toISOString(),

    data,
  };
}

/*
 * ============================================================
 * 19. Add structured event
 * ============================================================
 */

async function addStructuredEvent({ stream, type, source, data }) {
  const event = createEvent({
    type,
    source,
    data,
  });

  const id = await redis.xadd(
    stream,
    "*",

    "eventId",
    event.eventId,

    "type",
    event.type,

    "source",
    event.source,

    "timestamp",
    event.timestamp,

    "data",
    JSON.stringify(event.data),
  );

  return {
    id,
    event,
  };
}

/*
 * ============================================================
 * 20. Structured timetable event
 * ============================================================
 */

async function structuredTimetableEvent() {
  const result = await addStructuredEvent({
    stream: STREAMS.timetable,

    type: "TIMETABLE_GENERATED",

    source: "timetable-service",

    data: {
      timetableId: "timetable:100",

      version: 3,

      status: "completed",
    },
  });

  console.log("Structured event:", result);
}

/*
 * ============================================================
 * 21. Parse stream entries
 * ============================================================
 */

function parseStreamEntry(entry) {
  const [id, fields] = entry;

  const event = {
    id,
  };

  for (let i = 0; i < fields.length; i += 2) {
    event[fields[i]] = fields[i + 1];
  }

  return event;
}

/*
 * ============================================================
 * 22. Parse stream messages
 * ============================================================
 */

async function parseMessages() {
  const result = await redis.xrange(STREAMS.timetable, "-", "+");

  if (!result) {
    return;
  }

  for (const entry of result) {
    const event = parseStreamEntry(entry);

    console.log("Parsed event:", event);
  }
}

/*
 * ============================================================
 * 23. Stream trimming
 * ============================================================
 */

async function trimStream() {
  const deleted = await redis.xtrim(STREAMS.events, "MAXLEN", "~", 100);

  console.log("Trimmed entries:", deleted);
}

/*
 * ============================================================
 * 24. Stream ID
 * ============================================================
 *
 * Redis stream IDs look like:
 *
 * 1750000000000-0
 *
 * First part:
 * milliseconds timestamp
 *
 * Second part:
 * sequence number
 * ============================================================
 */

async function inspectIds() {
  const id = await redis.xadd(
    STREAMS.events,
    "*",

    "type",
    "ID_TEST",
  );

  const [timestamp, sequence] = id.split("-");

  console.log("Full ID:", id);

  console.log("Timestamp:", timestamp);

  console.log("Sequence:", sequence);
}

/*
 * ============================================================
 * 25. XADD with explicit ID
 * ============================================================
 */

async function explicitId() {
  const id = await redis.xadd(
    "app:explicit-stream",

    "1000-0",

    "type",
    "EXPLICIT_EVENT",

    "value",
    "hello",
  );

  console.log("Explicit ID:", id);

  await redis.del("app:explicit-stream");
}

/*
 * ============================================================
 * 26. Redis stream as event log
 * ============================================================
 */

async function eventLogExample() {
  await addStructuredEvent({
    stream: STREAMS.events,

    type: "USER_CREATED",

    source: "user-service",

    data: {
      userId: "user:100",

      name: "Shiva",
    },
  });

  await addStructuredEvent({
    stream: STREAMS.events,

    type: "USER_UPDATED",

    source: "user-service",

    data: {
      userId: "user:100",

      field: "name",

      value: "Shiva Ram",
    },
  });

  await addStructuredEvent({
    stream: STREAMS.events,

    type: "TIMETABLE_GENERATED",

    source: "timetable-service",

    data: {
      timetableId: "timetable:100",

      status: "completed",
    },
  });

  console.log("Event log created");
}

/*
 * ============================================================
 * 27. Read event log
 * ============================================================
 */

async function readEventLog() {
  const messages = await redis.xrange(STREAMS.events, "-", "+");

  if (!messages) {
    return;
  }

  for (const message of messages) {
    const event = parseStreamEntry(message);

    console.log(event);
  }
}

/*
 * ============================================================
 * 28. Last message ID
 * ============================================================
 */

async function getLastMessage() {
  const messages = await redis.xrevrange(STREAMS.events, "+", "-", "COUNT", 1);

  console.log("Latest message:", messages);
}

/*
 * ============================================================
 * 29. Consumer-style polling
 * ============================================================
 *
 * This example doesn't use consumer groups yet.
 *
 * Consumer groups come in the next lesson.
 * ============================================================
 */

async function pollingConsumer() {
  let lastId = "0-0";

  for (let i = 0; i < 3; i++) {
    const result = await redis.xread(
      "COUNT",
      10,

      "BLOCK",
      1000,

      "STREAMS",

      STREAMS.events,

      lastId,
    );

    if (!result) {
      console.log("No new messages");

      continue;
    }

    const [, entries] = result[0];

    for (const entry of entries) {
      const [id] = entry;

      console.log("Consumed:", entry);

      lastId = id;
    }
  }

  console.log("Last processed ID:", lastId);
}

/*
 * ============================================================
 * 30. Production-style timetable stream
 * ============================================================
 */

async function timetableStream() {
  const result = await addStructuredEvent({
    stream: STREAMS.timetable,

    type: "TIMETABLE_PROGRESS",

    source: "langgraph-worker",

    data: {
      timetableId: "timetable:123",

      progress: 75,

      status: "generating",
    },
  });

  console.log("Timetable stream event:", result);
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- XADD ---");

    await addMessage();

    console.log("\n--- TIMETABLE EVENT ---");

    await addTimetableEvent();

    console.log("\n--- XRANGE ---");

    await rangeMessages();

    console.log("\n--- XRANGE COUNT ---");

    await rangeWithCount();

    console.log("\n--- XRANGE AFTER ID ---");

    await rangeAfterId();

    console.log("\n--- XREVRANGE ---");

    await reverseRange();

    console.log("\n--- XREAD ---");

    await readStream();

    console.log("\n--- MULTIPLE STREAMS ---");

    await readMultipleStreams();

    console.log("\n--- NEW MESSAGES ---");

    await readNewMessages();

    console.log("\n--- BLOCKING READ ---");

    await blockingRead();

    console.log("\n--- STREAM INFO ---");

    await streamInfo();

    console.log("\n--- GROUP INFO ---");

    await groupInfo();

    console.log("\n--- STREAM LENGTH ---");

    await streamLength();

    console.log("\n--- BOUNDED STREAM ---");

    await boundedStream();

    console.log("\n--- EXACT MAXLEN ---");

    await exactMaxLength();

    console.log("\n--- DELETE MESSAGE ---");

    await deleteMessage();

    console.log("\n--- MULTIPLE EVENTS ---");

    await addMultipleEvents();

    console.log("\n--- STRUCTURED EVENT ---");

    await structuredTimetableEvent();

    console.log("\n--- PARSE MESSAGES ---");

    await parseMessages();

    console.log("\n--- TRIM STREAM ---");

    await trimStream();

    console.log("\n--- STREAM IDs ---");

    await inspectIds();

    console.log("\n--- EXPLICIT ID ---");

    await explicitId();

    console.log("\n--- EVENT LOG ---");

    await eventLogExample();

    console.log("\n--- READ EVENT LOG ---");

    await readEventLog();

    console.log("\n--- LAST MESSAGE ---");

    await getLastMessage();

    console.log("\n--- POLLING CONSUMER ---");

    await pollingConsumer();

    console.log("\n--- TIMETABLE STREAM ---");

    await timetableStream();

    console.log("\nRedis Streams examples completed");
  } catch (error) {
    console.error("\nRedis Streams error:", error);
  } finally {
    await redis.quit();
  }
}

await main();

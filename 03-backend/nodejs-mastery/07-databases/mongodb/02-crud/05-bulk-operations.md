# Bulk Operations

Performing many writes — a mix of inserts, updates, and deletes — in a single round trip to the server, rather than one call at a time.

## Why not just loop over individual calls?

```js
// ❌ works, but makes N separate round trips to the server
for (const user of users) {
  await db.users.updateOne({ _id: user.id }, { $set: { status: user.status } });
}
```

Each `await` here waits for a full network round trip before starting the next one — for a few dozen documents this barely matters, but for thousands, the accumulated network latency becomes a real bottleneck. `bulkWrite` sends all the operations to the server in far fewer round trips.

---

## `bulkWrite` — the core bulk operation method

```js
db.users.bulkWrite([
  { insertOne: { document: { name: "Alice", age: 30 } } },
  {
    updateOne: {
      filter: { name: "Bob" },
      update: { $set: { age: 26 } },
    },
  },
  { deleteOne: { filter: { name: "Carol" } } },
]);
```

```js
{
  insertedCount: 1,
  matchedCount: 1,
  modifiedCount: 1,
  deletedCount: 1,
  upsertedCount: 0,
  insertedIds: { '0': ObjectId("...") },
}
```

A single `bulkWrite` call can mix inserts, updates, and deletes together in one batch — the result summarizes counts across all of them.

---

## Available operation types

```js
db.users.bulkWrite([
  { insertOne: { document: { name: "Dave" } } },
  { updateOne: { filter: { name: "Alice" }, update: { $set: { age: 31 } } } },
  {
    updateMany: {
      filter: { status: "pending" },
      update: { $set: { status: "active" } },
    },
  },
  {
    replaceOne: {
      filter: { name: "Bob" },
      replacement: { name: "Bob", age: 27 },
    },
  },
  { deleteOne: { filter: { name: "Eve" } } },
  { deleteMany: { filter: { status: "spam" } } },
]);
```

Each entry mirrors the corresponding individual method (`02-crud/01-insert.md`, `03-update.md`, `04-delete.md`), just wrapped in an object describing which operation it is.

---

## Ordered vs unordered bulk writes

Same concept as `insertMany` (`01-insert.md`):

```js
db.users.bulkWrite(operations, { ordered: true }); // default — stops at the first failure
db.users.bulkWrite(operations, { ordered: false }); // keeps going, reports all failures at the end
```

|           | Ordered (default)                               | Unordered                   |
| --------- | ----------------------------------------------- | --------------------------- |
| Execution | Sequential, stops on first error                | Parallel-ish, all attempted |
| Use when  | Operations depend on each other's order/success | Operations are independent  |

Unordered bulk writes can also execute somewhat faster, since MongoDB isn't constrained to strict sequential execution — a secondary reason to prefer it when order genuinely doesn't matter.

---

## A realistic use case: syncing external data

```js
const operations = externalRecords.map((record) => ({
  updateOne: {
    filter: { externalId: record.id },
    update: { $set: record },
    upsert: true, // bulkWrite operations support upsert too
  },
}));

await db.products.bulkWrite(operations);
```

A very common real pattern: syncing a batch of records from an external API or import file, where each one should be created if new or updated if it already exists — expressed as one `bulkWrite` call with an upsert on every operation, rather than looping over individual `updateOne({ upsert: true })` calls.

---

## `insertMany` vs `bulkWrite`: when to use which

```js
// insertMany — simpler API, but only handles inserts
db.users.insertMany([{ name: "Alice" }, { name: "Bob" }]);

// bulkWrite — more verbose, but handles a MIX of operation types in one batch
db.users.bulkWrite([
  { insertOne: { document: { name: "Alice" } } },
  { updateOne: { filter: { name: "Bob" }, update: { $set: { age: 26 } } } },
]);
```

If you're only inserting, `insertMany` is simpler and reads more clearly. Reach for `bulkWrite` specifically when a single batch genuinely needs a mix of operation types, or when you need per-operation options (like upsert) that `insertMany` alone doesn't apply.

---

## Bulk operations and write concern

```js
db.users.bulkWrite(operations, { writeConcern: { w: "majority" } });
```

Like any write, a bulk operation can specify a write concern (`08-performance/04-connection-pooling-and-read-write-concerns.md`) controlling how many replica set members must acknowledge the write before it's considered successful — worth being deliberate about for a large, important batch of writes.

---

## Performance consideration: batch size

```js
// splitting a very large operation list into reasonably-sized chunks
const BATCH_SIZE = 1000;
for (let i = 0; i < operations.length; i += BATCH_SIZE) {
  const batch = operations.slice(i, i + BATCH_SIZE);
  await db.users.bulkWrite(batch);
}
```

MongoDB internally batches bulk operations up to a certain size regardless, but for extremely large operation lists (tens of thousands of operations), manually chunking into smaller batches can help manage memory usage and provide natural checkpoints if a batch needs to be retried.

## Common mistakes

- **Looping over individual write calls when a genuine bulk write would do** — works correctly, just noticeably slower for large volumes due to accumulated network round trips.
- **Using ordered (the default) when operations are actually independent** — unnecessarily stops the whole batch at the first unrelated failure; use `{ ordered: false }`.
- **Not checking the detailed result for partial failures in an unordered bulk write** — `bulkWrite`'s result includes per-operation error details worth inspecting rather than just checking overall success.
- **Sending an enormous single bulk operation with no batching** — can hit memory or message-size limits; chunk very large operation lists.
- **Forgetting that `bulkWrite` operations aren't automatically wrapped in a transaction** — a failure partway through an ordered bulk write leaves earlier operations already applied; use an actual transaction (`07-transactions/`) if true all-or-nothing behavior across the whole batch is required.

## Quick summary

- `bulkWrite` sends a mixed batch of inserts/updates/deletes to the server in far fewer round trips than looping over individual calls
- Ordered (default) stops at the first failure; unordered keeps going and reports all failures at the end, and can be somewhat faster
- A common real-world use: syncing external records with `updateOne` + `upsert: true` per record, batched into one `bulkWrite` call
- `bulkWrite` isn't automatically transactional — wrap it in an explicit transaction if true all-or-nothing behavior across every operation is required
- For extremely large operation lists, manually chunking into smaller batches helps manage memory and provides retry checkpoints

## Section complete

That covers CRUD operations in full depth — insert, find/projection, update, delete, and bulk operations. **`03-querying`** goes deeper into the filter object itself, covering the full range of query operators.

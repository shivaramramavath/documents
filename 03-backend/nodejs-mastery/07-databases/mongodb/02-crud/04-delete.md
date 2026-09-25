# Delete

Removing documents from a collection — and the common alternative, soft deletes, when actual removal isn't what you really want.

## `deleteOne` — removes the first match

```js
db.users.deleteOne({ email: "alice@example.com" });
```

```js
{ acknowledged: true, deletedCount: 1 }
```

If multiple documents match the filter, only the **first** one encountered is removed — same "One vs Many" caution as `updateOne`/`insertOne`.

---

## `deleteMany` — removes every match

```js
db.users.deleteMany({ status: "inactive" });
```

```js
{ acknowledged: true, deletedCount: 47 }
```

### ⚠️ An empty filter deletes everything

```js
db.users.deleteMany({});
```

This deletes **every document in the collection** — a genuinely dangerous one-liner. Always double-check a `deleteMany` filter before running it, especially in a script or migration, and consider requiring an explicit confirmation step in any tooling that could run this against production data.

---

## `findOneAndDelete` — delete and get the document back

```js
const deletedUser = await db.users.findOneAndDelete({ _id: userId });
```

Like `findOneAndUpdate` (`03-update.md`), this atomically removes a document **and** returns its content in one round trip — useful when you need to know what was deleted (e.g. to log it, or to show a confirmation with the deleted item's details) without a separate `findOne` beforehand.

---

## Deleting collections and databases entirely

```js
db.users.drop(); // delete the entire collection, including its indexes
db.dropDatabase(); // delete the ENTIRE current database
```

Both are irreversible outside of a backup — reserved for genuine cleanup (dropping a test database, removing a deprecated collection during a migration), never a routine part of application logic.

---

## Soft deletes: the alternative to actually deleting

Rather than removing a document, a **soft delete** marks it as deleted while keeping it in the collection:

```js
db.users.updateOne({ _id: userId }, { $set: { deletedAt: new Date() } });
```

```js
// "active" users — exclude soft-deleted ones
db.users.find({ deletedAt: { $exists: false } });

// or, with a boolean flag instead of a timestamp
db.users.updateOne({ _id: userId }, { $set: { isDeleted: true } });
db.users.find({ isDeleted: { $ne: true } });
```

### Why choose a soft delete over a real one

- **Recoverability** — a mistaken or maliciously-triggered delete can be undone by simply clearing the flag, rather than needing a full backup restore
- **Audit trails** — some domains (finance, healthcare) require retaining a record that something _existed and was later removed_, not just silently vanishing
- **Preserving references** — if other documents/collections reference this one by ID (`04-schema-design/01-modeling-relationships.md`), a hard delete can leave dangling references pointing at nothing; a soft delete keeps the referenced document available if needed

### The trade-off

Every query against a soft-deletable collection now needs to remember to exclude deleted documents (`{ deletedAt: { $exists: false } }`) — forgetting this filter in even one query path is a real, easy-to-make bug that silently surfaces "deleted" data. Some teams handle this by wrapping query logic in a repository layer (`10-nodejs-mongodb/03-repository-and-service-pattern.md`) that applies the exclusion automatically, rather than relying on every call site to remember it manually.

Full coverage of implementing this pattern well, including handling unique indexes correctly (a soft-deleted user's email shouldn't necessarily block a new signup with the same email) lives in `19-real-world-patterns/01-soft-delete.md`.

---

## Deleting with a session (for transactions)

```js
const session = client.startSession();
session.startTransaction();
try {
  await db.collection("orders").deleteOne({ _id: orderId }, { session });
  await db.collection("orderItems").deleteMany({ orderId }, { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

Deleting related documents across multiple collections together, atomically, is a common transaction use case — full coverage in `07-transactions/`.

## Common mistakes

- **Running `deleteMany({})` without realizing it targets the entire collection** — always sanity-check a delete filter, especially in scripts run against real data.
- **Using `deleteOne` when every matching document should be removed** — silently only removes the first match.
- **Choosing a hard delete for data that has legal/audit retention requirements**, or that other records depend on referentially — a soft delete is often the safer default for exactly this reason.
- **Forgetting to exclude soft-deleted documents in a query path** — silently surfaces data the application logic assumed was gone.
- **Deleting a parent document without considering documents that reference it elsewhere** — can leave dangling references; either cascade the delete (within a transaction) or use a soft delete to keep the reference resolvable.

## Quick summary

- `deleteOne` removes the first match; `deleteMany` removes every match — an empty filter `{}` on `deleteMany` removes the entire collection
- `findOneAndDelete` atomically deletes and returns the removed document in one call
- `drop()`/`dropDatabase()` remove an entire collection/database — irreversible outside a backup
- A soft delete (a flag or timestamp field, plus filtering it out of normal queries) trades some query complexity for recoverability, audit trails, and preserved references
- Deleting related documents across collections atomically is a common transaction use case

## Next

**`05-bulk-operations.md`** covers performing many of these operations efficiently in a single round trip, rather than one call at a time.

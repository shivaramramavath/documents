# CRUD Overview

A high-level tour of the four fundamental operations every database supports — Create, Read, Update, Delete — before `02-crud/` covers each one's full method signatures, options, and edge cases.

## The four operations, at a glance

```js
db.users.insertOne({ name: "Alice", age: 30 }); // Create
db.users.find({ age: { $gte: 18 } }); // Read
db.users.updateOne({ name: "Alice" }, { $set: { age: 31 } }); // Update
db.users.deleteOne({ name: "Alice" }); // Delete
```

Every one of these methods takes a **filter** (or, for insert, the document itself) as a plain JavaScript object — this is the same query-object syntax you'll see used consistently across `find()`, `updateOne()`, `deleteOne()`, and aggregation `$match` stages later.

---

## Create: `insertOne` / `insertMany`

```js
db.users.insertOne({ name: "Alice", age: 30 });

db.users.insertMany([
  { name: "Bob", age: 25 },
  { name: "Carol", age: 35 },
]);
```

Both return an acknowledgment plus the generated `_id`(s) — full coverage, including ordered vs. unordered inserts and error handling, in `02-crud/01-insert.md`.

---

## Read: `find` / `findOne`

```js
db.users.findOne({ name: "Alice" }); // one matching document, or null
db.users.find({ age: { $gte: 18 } }); // a cursor over all matching documents
```

```js
db.users.find({ age: { $gte: 18 } }).toArray(); // materialize the cursor into an array
```

`find()` returns a **cursor**, not an array directly — it doesn't fetch every matching document immediately, which matters for large result sets (full coverage in `02-crud/02-find-and-projection.md`, and pagination strategies in `08-performance/05-pagination-strategies.md`).

### Filtering with query operators

```js
db.users.find({ age: { $gte: 18, $lt: 65 } });
db.users.find({ status: { $in: ["active", "pending"] } });
```

The `$`-prefixed keys (`$gte`, `$in`, and many more) are MongoDB's **query operators** — covered in depth in `03-querying/01-query-operators.md`.

---

## Update: `updateOne` / `updateMany` / `replaceOne`

```js
db.users.updateOne({ name: "Alice" }, { $set: { age: 31 } });
```

Two arguments: a filter (which document(s) to match) and an **update document**, using update operators (`$set`, `$inc`, `$push`, and others) to describe _how_ to change the matched document — not a full replacement, unless you specifically use `replaceOne()`.

```js
db.users.replaceOne(
  { name: "Alice" },
  { name: "Alice", age: 31, email: "alice@example.com" }, // the ENTIRE new document
);
```

Full coverage of the update operators and the `updateOne` vs `replaceOne` distinction in `02-crud/03-update.md`.

---

## Delete: `deleteOne` / `deleteMany`

```js
db.users.deleteOne({ name: "Alice" });
db.users.deleteMany({ status: "inactive" });
```

Straightforward — a filter identifying what to remove. Full coverage, including the "soft delete" alternative pattern, in `02-crud/04-delete.md` and `19-real-world-patterns/01-soft-delete.md`.

---

## A pattern you'll see everywhere: filter first, then action

```js
db.users.findOne(filter);
db.users.updateOne(filter, update);
db.users.deleteOne(filter);
```

Every one of `find`/`update`/`delete`'s methods starts with the same kind of filter object — once you're comfortable writing a filter for `find()`, that same skill transfers directly to targeting the right documents for an update or delete, which is exactly why `03-querying/` (all about filters) is covered as its own dedicated section right after CRUD.

---

## `One` vs `Many` methods

```js
db.users.updateOne({ status: "pending" }, { $set: { status: "active" } }); // only the FIRST match
db.users.updateMany({ status: "pending" }, { $set: { status: "active" } }); // EVERY match
```

Every CRUD operation has this same `One`/`Many` distinction (`insertOne`/`insertMany`, `deleteOne`/`deleteMany`) — worth double-checking which one you actually mean, since using `updateOne` when you meant `updateMany` is a common, easy-to-miss bug that silently updates only the first matching document instead of all of them.

## Common mistakes

- **Using `updateOne`/`deleteOne` when every matching document should be affected** — silently only touches the first match; use the `Many` variant.
- **Calling `.toArray()` unnecessarily on a small, already-consumed cursor**, or forgetting it when an actual array is genuinely needed elsewhere in your code.
- **Confusing `updateOne` (partial update via operators) with `replaceOne` (full document replacement)** — using `replaceOne` when you meant a partial update discards every field not included in the replacement document.
- **Writing an empty filter `{}` by accident** — matches _every_ document in the collection; particularly dangerous with `deleteMany({})`, which would delete an entire collection's contents.

## Quick summary

- Create (`insertOne`/`insertMany`), Read (`find`/`findOne`), Update (`updateOne`/`updateMany`/`replaceOne`), Delete (`deleteOne`/`deleteMany`) are MongoDB's four fundamental operations
- Every operation (except pure inserts) starts with a filter object — the same skill used across find, update, and delete
- `find()` returns a cursor, not an immediate array — call `.toArray()` to materialize it
- Always double-check `One` vs `Many` — using the wrong one is a common, quietly-incorrect bug
- An accidental empty filter `{}` matches every document — especially dangerous combined with `deleteMany`

## Section complete

That covers MongoDB's fundamentals: architecture, the database/collection/document hierarchy, BSON/ObjectId, and a CRUD overview. **`02-crud`** now covers each operation in full depth.

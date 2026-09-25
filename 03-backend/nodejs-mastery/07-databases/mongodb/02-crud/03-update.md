# Update

Modifying existing documents — precisely, using update operators, rather than replacing them wholesale.

## `updateOne` — the basic shape

```js
db.users.updateOne(
  { name: "Alice" }, // filter — which document(s) to match
  { $set: { age: 31 } }, // update — how to change the matched document
);
```

```js
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1
}
```

`matchedCount` vs `modifiedCount` can differ: if the update would set a field to the value it already has, the document is matched but not actually modified — worth knowing when interpreting the result.

---

## Update operators

### `$set` — set a field's value

```js
db.users.updateOne({ name: "Alice" }, { $set: { age: 31, isVerified: true } });
```

Adds the field if it doesn't exist, or overwrites it if it does — the operator you'll use most often.

### `$unset` — remove a field entirely

```js
db.users.updateOne({ name: "Alice" }, { $unset: { temporaryFlag: "" } });
```

The value given for the field to unset doesn't matter (conventionally `""`) — only the key matters.

### `$inc` — atomically increment/decrement a number

```js
db.products.updateOne({ _id: productId }, { $inc: { views: 1 } });
db.accounts.updateOne({ _id: accountId }, { $inc: { balance: -50 } });
```

`$inc` is **atomic** — critical for something like a view counter or account balance, where two concurrent updates (`$inc: { views: 1 }` fired by two simultaneous requests) both correctly apply, rather than one silently overwriting the other's effect (which is exactly what would happen with a naive "read current value, add one, write it back" approach in application code).

### `$push` / `$pull` — array modification

```js
db.users.updateOne({ _id: userId }, { $push: { tags: "vip" } }); // add to an array
db.users.updateOne({ _id: userId }, { $pull: { tags: "inactive" } }); // remove matching value(s)
```

```js
db.users.updateOne(
  { _id: userId },
  { $push: { orders: { $each: [order1, order2] } } }, // push multiple values at once
);
```

### `$addToSet` — push only if not already present

```js
db.users.updateOne({ _id: userId }, { $addToSet: { tags: "vip" } });
```

Unlike `$push`, `$addToSet` won't add a duplicate — behaves like adding to a mathematical set rather than a plain list, useful for tags/categories where duplicates don't make sense.

### `$rename` — rename a field

```js
db.users.updateMany({}, { $rename: { username: "name" } });
```

Useful during a schema migration (`18-production/05-migration.md`) when renaming a field across an existing collection.

---

## `updateOne` vs `updateMany` vs `replaceOne`

```js
db.users.updateOne({ status: "pending" }, { $set: { status: "active" } }); // first match only
db.users.updateMany({ status: "pending" }, { $set: { status: "active" } }); // every match
```

```js
db.users.replaceOne(
  { name: "Alice" },
  { name: "Alice", age: 31, email: "alice@new.com" }, // the ENTIRE new document — everything else is discarded
);
```

`replaceOne` doesn't use operators at all — it swaps out the whole document (except `_id`, which is preserved) for the one you provide. Any field not included in the replacement is simply gone. Use `updateOne` with operators for a partial change; `replaceOne` only when you genuinely mean "this document's entire content is now this."

---

## Upserts: insert if no match, update if there is one

```js
db.users.updateOne(
  { email: "alice@example.com" },
  { $set: { name: "Alice", lastLoginAt: new Date() } },
  { upsert: true },
);
```

If a document matching the filter exists, it's updated normally. If **no** document matches, MongoDB inserts a new one instead, combining the filter fields and the `$set` fields. This is extremely useful for "create or update" logic — e.g. tracking last-login time for a user who might or might not already have a record — without needing a separate `findOne` + conditional `insertOne`/`updateOne` in application code.

```js
db.counters.updateOne(
  { name: "pageViews" },
  { $inc: { count: 1 } },
  { upsert: true },
);
```

A classic upsert pattern: the very first call creates the counter document (starting the increment from an implicit 0); every call after that just increments the existing one — one line of code handles both "doesn't exist yet" and "already exists."

---

## Array update operators, in a bit more depth

```js
// update a specific array element matching a condition
db.orders.updateOne(
  { _id: orderId, "items.sku": "ABC123" },
  { $set: { "items.$.quantity": 5 } }, // positional $ — the FIRST matching array element
);

// update ALL matching array elements
db.orders.updateMany(
  {},
  { $set: { "items.$[elem].discounted": true } },
  { arrayFilters: [{ "elem.price": { $gt: 100 } }] },
);
```

The positional `$` operator targets the first array element matching the query's array condition; `arrayFilters` (with `$[elem]`) is the more flexible mechanism for updating **every** array element matching a specific condition, not just the first. Full array query mechanics live in `03-querying/02-array-and-embedded-document-queries.md`.

---

## `findOneAndUpdate` — update and get the document back in one call

```js
const result = await db.users.findOneAndUpdate(
  { _id: userId },
  { $inc: { credits: -10 } },
  { returnDocument: "after" }, // "before" (default) or "after"
);
```

A plain `updateOne` only tells you _whether_ something was matched/modified — not the document's actual content. `findOneAndUpdate` atomically updates and returns the document in one round trip, useful when your application logic needs the resulting value immediately (e.g. showing an updated balance right after a deduction) without a separate `findOne` call afterward.

## Common mistakes

- **Using `replaceOne` when a partial update was intended** — silently discards every field not included in the replacement document.
- **Manually reading, modifying, and writing back a numeric field** instead of using `$inc` — introduces a race condition under concurrent updates; `$inc` is atomic and avoids it entirely.
- **Forgetting `{ upsert: true }`** and instead writing separate "check if exists, then insert or update" logic in application code — more code, and still has a race condition between the check and the write that `upsert: true` avoids.
- **Using `updateOne` when every matching document should change** — silently updates only the first match; use `updateMany`.
- **Confusing the positional `$` operator (first match) with `arrayFilters`/`$[elem]` (all matches meeting a condition)** — using the wrong one either under- or over-updates an array.

## Quick summary

- `$set`/`$unset`/`$inc`/`$push`/`$pull`/`$addToSet`/`$rename` are the core update operators — each changes a document precisely, rather than replacing it
- `$inc` (and other operators generally) apply atomically, avoiding race conditions that manual read-modify-write logic in application code would introduce
- `replaceOne` swaps the entire document; `updateOne`/`updateMany` apply operators to specific fields — pick based on whether you mean "this document is now entirely this" or "change these specific fields"
- `{ upsert: true }` inserts if nothing matches the filter, updates if something does — a common "create or update" pattern in one call
- `findOneAndUpdate` returns the actual document alongside the update, in one atomic round trip

## Next

**`04-delete.md`** covers removing documents — the last of the four CRUD operations.

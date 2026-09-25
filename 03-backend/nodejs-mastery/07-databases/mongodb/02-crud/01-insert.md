# Insert

Adding new documents to a collection, with `insertOne` and `insertMany`.

## `insertOne`

```js
db.users.insertOne({ name: "Alice", age: 30 });
```

```js
{
  acknowledged: true,
  insertedId: ObjectId("64f1a2b3c4d5e6f7a8b9c0d1")
}
```

If you don't provide `_id`, MongoDB generates an `ObjectId` automatically (`01-fundamentals/03-bson-types-and-objectid.md`). Supplying your own is fine too, as long as it's unique within the collection:

```js
db.users.insertOne({ _id: "alice@example.com", name: "Alice" });
```

Attempting to insert a document whose `_id` already exists throws a duplicate key error.

---

## `insertMany`

```js
db.users.insertMany([
  { name: "Bob", age: 25 },
  { name: "Carol", age: 35 },
  { name: "Dave", age: 40 },
]);
```

```js
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId("..."),
    '1': ObjectId("..."),
    '2': ObjectId("...")
  }
}
```

---

## Ordered vs unordered inserts

By default, `insertMany` is **ordered**: documents are inserted in array order, and if one fails (e.g. a duplicate `_id`), MongoDB stops immediately — documents after the failure are **not** inserted.

```js
db.users.insertMany([
  { _id: 1, name: "Alice" },
  { _id: 1, name: "Duplicate" }, // fails — duplicate _id
  { _id: 3, name: "Carol" }, // never attempted — insert already stopped
]);
```

### Unordered: keep going even if some fail

```js
db.users.insertMany(
  [
    { _id: 1, name: "Alice" },
    { _id: 1, name: "Duplicate" }, // fails
    { _id: 3, name: "Carol" }, // still gets inserted — order doesn't matter here
  ],
  { ordered: false },
);
```

With `{ ordered: false }`, MongoDB attempts every document regardless of earlier failures, and reports all errors at the end — useful when you're inserting a batch of independent documents and want to maximize how many actually succeed, rather than stopping at the first problem.

|                             | Ordered (default)                              | Unordered                                                      |
| --------------------------- | ---------------------------------------------- | -------------------------------------------------------------- |
| Stops on first error?       | Yes                                            | No — keeps going                                               |
| Guarantees insertion order? | Yes                                            | No                                                             |
| Use when                    | Documents depend on being inserted in sequence | Documents are independent; you want maximum successful inserts |

---

## Handling insert errors

```js
try {
  await db.collection("users").insertOne({ _id: 1, name: "Alice" });
} catch (err) {
  if (err.code === 11000) {
    console.log(
      "Duplicate key error — a document with this _id (or unique index value) already exists",
    );
  } else {
    throw err;
  }
}
```

Error code `11000` specifically indicates a duplicate key violation — either on `_id` or on any other field with a unique index (`05-indexes/`). Checking this specific code, rather than treating every insert failure the same, lets you handle "already exists" as a distinct, often-expected case (e.g. showing a friendly "email already registered" message) rather than a generic server error.

---

## Insert with validation

```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      required: ["name", "email"],
      properties: {
        email: { bsonType: "string", pattern: "^.+@.+$" },
      },
    },
  },
});

db.users.insertOne({ name: "Alice" }); // fails — missing required "email" field
```

If schema validation is configured on the collection (`04-schema-design/02-schema-validation.md`), an insert violating those rules is rejected at the database level — a safety net beyond whatever validation your application code already does (`06-express/05-validation.md`, if you're also using Express).

---

## Inserting with a session (for transactions)

```js
const session = client.startSession();
session.startTransaction();
try {
  await db.collection("users").insertOne({ name: "Alice" }, { session });
  await db.collection("logs").insertOne({ event: "user_created" }, { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

Passing `{ session }` ties the insert to a multi-document transaction — full coverage in `07-transactions/`.

## Common mistakes

- **Assuming `insertMany` is always atomic across all documents** — by default (ordered), it stops at the first failure but doesn't roll back documents already successfully inserted before that point; MongoDB's inserts aren't automatically all-or-nothing unless wrapped in an explicit transaction (`07-transactions/`).
- **Not checking for error code `11000` specifically** — treating every insert failure identically makes it harder to give a clear, specific response for the common "this already exists" case.
- **Providing a non-unique custom `_id`** — silently fails with a duplicate key error; ensure your own `_id` values are genuinely unique before relying on them.
- **Forgetting `{ ordered: false }` when batch-inserting independent documents where partial success is acceptable** — the default `ordered: true` behavior stops the whole batch at the first failure, which may not be what you want.

## Quick summary

- `insertOne` inserts a single document; `insertMany` inserts an array of them
- `_id` is auto-generated as an `ObjectId` if not supplied, and must be unique if you provide your own
- `insertMany` is ordered (stop on first failure) by default; `{ ordered: false }` keeps inserting despite individual failures
- Error code `11000` specifically means a duplicate key violation — worth checking for and handling distinctly
- Inserts aren't automatically all-or-nothing across multiple documents unless wrapped in an explicit transaction

## Next

**`02-find-and-projection.md`** covers reading the documents you've just inserted.

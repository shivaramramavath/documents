# BSON Types & ObjectId

Documents look like JSON when you read or write them, but MongoDB actually stores them as **BSON** — a binary format that extends JSON with more types and metadata. This file covers what that means in practice, and `ObjectId`, BSON's own default ID type.

## BSON vs JSON

```json
// JSON — what you type/see
{ "name": "Alice", "age": 30, "createdAt": "2026-01-15T10:00:00Z" }
```

```
// BSON — what's actually stored (conceptually; it's binary, not readable text)
{ name: "Alice" (string), age: 30 (int32), createdAt: ISODate(...) (actual date type) }
```

JSON only has a handful of types: string, number, boolean, null, array, object. BSON extends this with more precise, application-useful types — a real `Date` type, distinct integer sizes, binary data, and more — encoded in a binary format that's faster to parse and traverse than parsing JSON text.

### Why this matters practically

```js
db.events.insertOne({ name: "Launch", date: new Date() });
```

```js
db.events.find({
  date: { $gte: new Date("2026-01-01"), $lt: new Date("2026-02-01") },
});
```

Because `date` is stored as a genuine BSON date type, not a string, you can query it with real date comparisons (`$gte`/`$lt`) directly — if dates were stored as plain strings (as they'd have to be in pure JSON), you'd need string comparison, which doesn't reliably sort or compare the way you'd want across different date formats.

---

## Common BSON types

| BSON type                  | JavaScript/driver equivalent      | Example                                                        |
| -------------------------- | --------------------------------- | -------------------------------------------------------------- |
| String                     | `String`                          | `"Alice"`                                                      |
| Int32 / Int64 (Long)       | `Number` (small) / `Long` (large) | `30`, a 64-bit counter                                         |
| Double                     | `Number`                          | `29.99`                                                        |
| Boolean                    | `Boolean`                         | `true`                                                         |
| Date                       | `Date`                            | `new Date()`                                                   |
| Array                      | `Array`                           | `["a", "b"]`                                                   |
| Object (embedded document) | `Object`                          | `{ city: "Boston" }`                                           |
| ObjectId                   | `ObjectId`                        | `ObjectId("64f1a2b3...")`                                      |
| Null                       | `null`                            | `null`                                                         |
| Binary data                | `Buffer` (Node)                   | Raw bytes — files, encrypted data                              |
| Decimal128                 | `Decimal128`                      | Exact decimal — for currency, avoiding floating-point rounding |

### Int32 vs Double: a common surprise

```js
db.products.insertOne({ price: 10 }); // stored as Int32
db.products.insertOne({ price: 10.5 }); // stored as Double
```

MongoDB infers the specific numeric BSON type from how a number is written — this rarely matters day to day, but can matter for exact type-based queries (`$type`, `03-querying/01-query-operators.md`) or when precision genuinely matters, which is exactly why `Decimal128` exists for money-related fields instead of relying on ordinary floating-point numbers.

### Decimal128 for currency

```js
import { Decimal128 } from "mongodb";

db.orders.insertOne({ total: Decimal128.fromString("19.99") });
```

Ordinary floating-point numbers (BSON's `Double`) can introduce small rounding errors (`0.1 + 0.2 !== 0.3` in most languages) — `Decimal128` stores an exact decimal value instead, which matters for anything involving money.

---

## `ObjectId`

The default type MongoDB uses for `_id` — a 12-byte value, displayed as a 24-character hexadecimal string.

```js
ObjectId("64f1a2b3c4d5e6f7a8b9c0d1");
```

### What's actually encoded inside it

```
64f1a2b3   c4d5e6      f7a8b9c0d1
────────   ──────      ──────────
timestamp   random      counter
(4 bytes)  (5 bytes)    (3 bytes)
```

- **Timestamp** (4 bytes) — seconds since the Unix epoch, when the `ObjectId` was generated
- **Random value** (5 bytes) — unique per process, reduces collision risk across different machines/processes generating IDs concurrently
- **Counter** (3 bytes) — an incrementing counter, initialized to a random value, ensuring uniqueness even for multiple `ObjectId`s generated within the same second by the same process

This design means `ObjectId`s are generated **client-side** (by your driver, before the document is even sent to the server) and are extremely unlikely to collide, even across many servers generating IDs simultaneously with no coordination between them.

### A genuinely useful side effect: extracting the creation timestamp

```js
const id = ObjectId("64f1a2b3c4d5e6f7a8b9c0d1");
console.log(id.getTimestamp()); // the Date this ObjectId was generated
```

Because the timestamp is embedded directly in the ID, you can extract a document's approximate creation time **without a separate `createdAt` field** — useful in a pinch, though an explicit `createdAt` field is still generally clearer and more precise for anything you'll actually query or sort by regularly.

### Sorting by `_id` approximates sorting by creation time

```js
db.events.find().sort({ _id: -1 }); // roughly "most recently created first"
```

Since the timestamp is the leading component of an `ObjectId`, sorting by `_id` produces a result very close to sorting by actual insertion time — a handy shortcut, though not a substitute for an explicit timestamp field when precision or timezone-awareness matters.

### Comparing `ObjectId`s

```js
const id1 = new ObjectId();
const id2 = new ObjectId("64f1a2b3c4d5e6f7a8b9c0d1");

id1.equals(id2); // ✅ correct way to compare
id1 === id2; // ❌ always false — different object references, even if "the same" value
id1.toString() === id2.toString(); // ✅ also works, comparing the string form
```

A common bug: comparing two `ObjectId` instances with `===` always returns `false`, even when they represent the same ID, because they're distinct JavaScript objects. Use `.equals()`, or compare their string forms.

## Common mistakes

- **Treating BSON dates as strings** — storing dates as plain strings loses the ability to do proper date range queries; use an actual `Date` object.
- **Using floating-point numbers for currency** — use `Decimal128` for anything money-related to avoid rounding errors.
- **Comparing `ObjectId`s with `===`** — always use `.equals()` or compare `.toString()` values instead.
- **Assuming `ObjectId`'s embedded timestamp is precise enough to rely on for anything beyond an approximation** — it's second-level precision and reflects generation time, not necessarily exactly when a business event "actually happened"; use an explicit timestamp field for anything that matters.

## Quick summary

- BSON is the binary format MongoDB actually stores documents as — a superset of JSON's types, including real dates, distinct numeric types, and binary data
- `Decimal128` avoids floating-point rounding errors for currency; ordinary numbers are fine for most other numeric data
- `ObjectId` encodes a timestamp, a random value, and a counter — generated client-side, extremely unlikely to collide
- `ObjectId`'s embedded timestamp lets you extract an approximate creation time, and sorting by `_id` approximates sorting by creation order
- Always compare `ObjectId`s with `.equals()`, never `===`

## Next

**`04-crud-overview.md`** gives a high-level tour of Create, Read, Update, and Delete before `02-crud/` covers each in full depth.

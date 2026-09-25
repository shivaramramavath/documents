# Find & Projection

Reading documents with `find`/`findOne`, understanding cursors, and controlling exactly which fields come back with projections.

## `findOne` vs `find`

```js
db.users.findOne({ name: "Alice" });
```

Returns a single matching document (or `null` if none match) — even if multiple documents match the filter, `findOne` only ever returns the first one it encounters.

```js
db.users.find({ status: "active" });
```

Returns a **cursor** over every matching document — not the documents themselves, immediately.

---

## Cursors: why `find()` doesn't just return an array

```js
const cursor = db.users.find({ status: "active" });
```

A cursor is a pointer to the result set on the server — MongoDB doesn't send every matching document to your application all at once. Instead, it fetches results in batches as you iterate, which matters a great deal for large result sets (imagine `find({})` on a 10-million-document collection — materializing that entire result into memory immediately would be disastrous).

### Consuming a cursor

```js
// materialize into an array (fine for reasonably small result sets)
const users = await db.users.find({ status: "active" }).toArray();

// iterate one document at a time (better for very large result sets)
const cursor = db.users.find({ status: "active" });
for await (const user of cursor) {
  console.log(user);
}
```

`toArray()` is convenient and fine for most everyday queries, but be deliberate about it for genuinely large result sets — iterating the cursor directly avoids holding the entire result in memory at once.

---

## Sorting

```js
db.users.find().sort({ age: 1 }); // ascending
db.users.find().sort({ age: -1 }); // descending
db.users.find().sort({ lastName: 1, firstName: 1 }); // multiple fields, in priority order
```

`1` for ascending, `-1` for descending — the same convention used throughout MongoDB, including in index definitions (`05-indexes/`).

---

## Limiting and skipping

```js
db.users.find().limit(10); // only the first 10 results
db.users.find().skip(20).limit(10); // skip the first 20, then take 10 (a naive pagination approach)
```

`skip`/`limit` together look like an obvious pagination mechanism, but `skip` gets progressively slower on large offsets, since MongoDB still has to walk through and discard every skipped document — the better-performing pagination approaches are covered in `08-performance/05-pagination-strategies.md`.

---

## Chaining cursor methods

```js
db.users.find({ status: "active" }).sort({ createdAt: -1 }).limit(20).toArray();
```

`sort`/`limit`/`skip` can be chained in any order when writing the code — MongoDB applies them in a fixed logical order (filter, then sort, then skip, then limit) regardless of the order you wrote the chain in.

---

## Projections: returning only the fields you need

```js
db.users.find({ status: "active" }, { name: 1, email: 1 });
```

The second argument to `find`/`findOne` is a **projection** — `1` means "include this field," and by default `_id` is always included unless explicitly excluded:

```js
db.users.find({}, { name: 1, email: 1, _id: 0 }); // include name/email, explicitly exclude _id
```

### Inclusion vs exclusion — don't mix them

```js
// ✅ inclusion — only these fields (plus _id, unless excluded)
db.users.find({}, { name: 1, email: 1 });

// ✅ exclusion — everything EXCEPT these fields
db.users.find({}, { password: 0, internalNotes: 0 });

// ❌ mixing inclusion and exclusion on regular fields is not allowed
db.users.find({}, { name: 1, email: 0 }); // error, except for the _id special case
```

You generally pick one mode per query: list what you want (inclusion), or list what to hide (exclusion) — not both, aside from the `_id: 0` exception, which is allowed alongside an inclusion projection specifically.

### Why projections matter beyond convenience

```js
db.users.find({}, { password: 0 });
```

Excluding sensitive fields (password hashes, internal flags) at the **query level** is a meaningful safety habit — rather than fetching everything and remembering to strip sensitive fields in application code afterward (which is easy to forget in one code path and not another), the database simply never sends that data back in the first place.

Projections also reduce the amount of data transferred over the network and held in memory, which matters for performance on documents with large fields you don't always need.

### Projecting into nested fields

```js
db.users.find({}, { "address.city": 1 });
```

Dot notation lets you project a specific nested field without pulling in the entire embedded document.

### Projecting array elements

```js
db.users.find({}, { orders: { $slice: 5 } }); // first 5 array elements only
db.users.find({}, { orders: { $slice: -5 } }); // last 5 array elements only
db.users.find(
  { "orders.status": "shipped" },
  { "orders.$": 1 }, // only the FIRST matching array element
);
```

`$slice` limits how many array elements come back; the positional `$` operator returns only the first array element that matched the query filter, rather than the whole array — useful when a document has a large array but you only care about the one element relevant to your query.

---

## Counting documents

```js
db.users.countDocuments({ status: "active" }); // accurate count, matching the filter
db.users.estimatedDocumentCount(); // fast, approximate count of the WHOLE collection
```

`countDocuments` gives an accurate, filtered count but scans matching documents to produce it; `estimatedDocumentCount` is much faster but only gives the total collection size (ignoring any filter), using cached metadata rather than scanning — pick based on whether you need an exact filtered count or just a rough total.

## Common mistakes

- **Calling `.toArray()` on a potentially huge result set without a `limit`** — risks pulling an enormous number of documents into memory at once; use pagination or iterate the cursor directly for large data.
- **Using `skip`/`limit` for deep pagination on a large collection** — gets progressively slower; use a cursor-based (keyset) pagination approach instead (`08-performance/05-pagination-strategies.md`).
- **Mixing inclusion and exclusion in a projection** (aside from the `_id: 0` exception) — MongoDB rejects this outright.
- **Fetching entire documents when only a couple of fields are needed** — wastes bandwidth and memory; use a projection.
- **Forgetting projections don't replace real security controls** — excluding a field from a query response is good hygiene, but sensitive data still needs proper access control (`12-security/`), not just careful querying.

## Quick summary

- `findOne` returns a single document or `null`; `find` returns a cursor over potentially many
- Cursors fetch results in batches from the server rather than all at once — `.toArray()` materializes the full result, iterating the cursor directly is better for very large results
- `sort`/`skip`/`limit` compose, but `skip` degrades on large offsets — prefer cursor-based pagination for deep pages
- Projections (`{ field: 1 }` or `{ field: 0 }`) control exactly which fields come back — pick inclusion or exclusion, not both, and use them to keep sensitive fields out of query results by default

## Next

**`03-update.md`** covers modifying documents you've found — the operators used to change specific fields precisely.

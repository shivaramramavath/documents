# Databases, Collections & Documents

The core organizational hierarchy every MongoDB deployment is built from — three nested levels, roughly (but not exactly) analogous to a relational database's own structure.

```
Server (mongod)
  └── Database
        └── Collection
              └── Document
```

## Databases

A database is a container for collections — the top level of organization, similar to a relational database instance.

```js
use myapp        // switch to (or create) a database called "myapp"
show dbs           // list all databases on this server
db.getName()          // the currently selected database's name
```

A database is created **implicitly**, the first time you write data to it — there's no separate "create database" step required:

```js
use brandNewDatabase
db.users.insertOne({ name: "Alice" })   // this single write creates both the database AND the collection
show dbs   // "brandNewDatabase" now appears
```

Before that first write, `use brandNewDatabase` just selects a name to work with — it doesn't persist anything until data actually exists.

### Reserved databases

```
admin   → authentication and authorization data
config    → sharding metadata (relevant only in sharded clusters)
local      → data local to a specific mongod instance, not replicated
```

You won't interact with these directly in normal application development — they're MongoDB's own internal bookkeeping.

---

## Collections

A collection is a grouping of documents — the closest MongoDB equivalent to a relational table, though without a fixed schema.

```js
db.createCollection("users")     // explicit creation (rarely necessary)
db.users.insertOne({ name: "Alice" })   // implicit creation — the far more common path
show collections
db.users.drop()                    // delete a collection and everything in it
```

Like databases, collections are usually created **implicitly** on first insert — explicit `createCollection()` is mainly used when you need to pass creation-time options (like schema validation rules, `04-schema-design/02-`, or capped-collection settings, `17-specialized-features/01-`) that can't be added after the fact.

### Naming conventions

```js
db.users; // conventionally: lowercase, plural, matching the kind of document it holds
db.orders;
db.blog_posts; // underscores or camelCase both common; consistency matters more than the specific choice
```

MongoDB has few hard restrictions on collection names (no `$`, can't start with `system.`), but "lowercase, plural noun" is the near-universal convention, mirroring typical relational table naming.

---

## Documents

A document is a single record — MongoDB's equivalent of a row — represented as a BSON object (`03-bson-types-and-objectid.md` covers what BSON actually is).

```js
{
  _id: ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  interests: ["reading", "hiking"],
  address: {
    city: "Boston",
    zip: "02101",
  },
}
```

### The `_id` field: every document's primary key

```js
db.users.insertOne({ name: "Alice" });
```

```js
{
  acknowledged: true,
  insertedId: ObjectId("64f1a2b3c4d5e6f7a8b9c0d1")
}
```

Every document has an `_id` field, which MongoDB **automatically generates as an `ObjectId`** if you don't provide one yourself — it uniquely identifies the document within its collection, exactly like a primary key in a relational table. You _can_ supply your own `_id` (a string, a number, anything unique) instead of letting MongoDB generate one, which is sometimes done when a natural unique identifier already exists (e.g. using an email address as `_id` for a users collection).

### Documents in the same collection can have different shapes

```js
db.users.insertOne({ name: "Alice", age: 30 });
db.users.insertOne({ name: "Bob", isVerified: true, tags: ["vip"] });
```

Both are valid documents in the same `users` collection, despite having entirely different fields — a direct consequence of MongoDB's flexible-schema-by-default design covered in `01-mongodb-architecture.md`. Whether this flexibility is used deliberately (evolving a schema over time, `04-schema-design/`) or accidentally (inconsistent data from a bug) is entirely up to how disciplined your application (or your validation rules) are about it.

### Nested documents and arrays

```js
{
  name: "Alice",
  address: { city: "Boston", zip: "02101" },   // an embedded document
  orders: [
    { id: 1, total: 29.99 },                    // an array of embedded documents
    { id: 2, total: 15.50 },
  ],
}
```

This nesting — documents inside documents, arrays of documents — is exactly the "store related data together" instinct from `01-mongodb-architecture.md`, and is queryable directly (`03-querying/02-array-and-embedded-document-queries.md`) without needing a join.

---

## Document size limit

```
16 MB per document (hard limit, enforced by MongoDB)
```

A single document can never exceed 16MB — a deliberate limit meant to keep documents reasonably sized and prevent a single document from monopolizing memory during a query. Hitting this limit in practice usually signals a schema design that's embedding _too much_ (e.g. an unbounded array that grows forever) and would be better served by referencing (`04-schema-design/01-modeling-relationships.md`) instead of embedding. GridFS (`17-specialized-features/03-gridfs.md`) exists specifically for storing files larger than this limit.

## Common mistakes

- **Expecting an error when writing to a database/collection that doesn't exist yet** — MongoDB creates both implicitly on first write; there's no equivalent to a relational "table doesn't exist" error for this case.
- **Assuming every document in a collection shares the same shape** — true in a relational table by design, not guaranteed at all in MongoDB unless you add validation rules yourself.
- **Manually generating your own `_id` values without a real need** — MongoDB's auto-generated `ObjectId` already guarantees uniqueness and is efficient to index; only override it when there's a genuine reason (a natural key, cross-referencing an external system's ID).
- **Embedding unboundedly growing data** — risks hitting the 16MB document limit; a growing array of related records (e.g. every order a customer has ever placed) is often better modeled as references instead.

## Quick summary

- The hierarchy is server → database → collection → document, roughly paralleling instance → database → table → row in a relational system
- Databases and collections are typically created implicitly on first write, not via an explicit creation step
- Every document has a unique `_id` (an auto-generated `ObjectId` by default) acting as its primary key
- Documents in the same collection can have different shapes — flexible by default, disciplined only if you make it so
- A hard 16MB-per-document limit exists, relevant to the embed-vs-reference schema design decision

## Next

**`03-bson-types-and-objectid.md`** covers what a document actually _is_ under the hood — the BSON format, and what `ObjectId` specifically encodes.

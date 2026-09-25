# MongoDB Architecture

What MongoDB actually is under the hood, and how its document-oriented model differs fundamentally from a relational database.

## `mongod` — the database server process

```bash
mongod --dbpath /data/db --port 27017
```

`mongod` is the core MongoDB server process — it listens for connections, manages data storage, and handles queries. When you `brew services start mongodb-community` or run the Docker image (`00-setup/01-installation-and-atlas.md`), you're starting `mongod` under the hood.

```
Client (mongosh, your app's driver)
        ↓ (wire protocol, TCP)
      mongod
        ↓
  Storage engine (WiredTiger)
        ↓
     Disk / data files
```

### `mongos` — the query router (sharded clusters only)

In a sharded deployment (`14-sharding/`), clients connect to `mongos` instead of `mongod` directly — `mongos` routes each query to the correct shard(s) and merges results, acting as a transparent layer in front of the actual data-holding `mongod` instances. For a single, unsharded deployment (the vast majority of setups, especially while learning), you talk to `mongod` directly.

---

## The storage engine: WiredTiger

MongoDB's default storage engine (since 3.2) is **WiredTiger** — it's what actually manages how documents are stored on disk, handles compression, and implements document-level concurrency control (multiple operations can modify different documents in the same collection simultaneously, without blocking each other).

You'll rarely interact with WiredTiger directly, but it's worth knowing it exists as the layer beneath `mongod` responsible for the actual storage mechanics — similar in spirit to how a relational database has a distinct storage engine underneath its SQL interface (e.g. InnoDB for MySQL).

---

## Document model vs relational model

This is the single most important architectural difference to internalize:

```js
// MongoDB — one document holds the whole related shape
{
  _id: ObjectId("..."),
  name: "Alice",
  email: "alice@example.com",
  addresses: [
    { type: "home", city: "Boston" },
    { type: "work", city: "New York" },
  ],
}
```

```sql
-- Relational — the same data spread across two tables, joined at query time
users:      id, name, email
addresses:  id, user_id, type, city
```

MongoDB favors storing related data **together, in one document**, rather than normalizing it across separate tables joined at query time. This isn't a limitation — it's a deliberate design choice matching how an application typically _uses_ the data (you usually want a user and their addresses together, not separately).

|                 | Relational                         | MongoDB                                                                          |
| --------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| Unit of storage | Rows in tables                     | Documents in collections                                                         |
| Schema          | Fixed, enforced by the database    | Flexible by default (though you can enforce validation — `04-schema-design/02-`) |
| Related data    | Joined at query time across tables | Often embedded together in one document                                          |
| Scaling         | Typically vertical (bigger server) | Designed for horizontal scaling (sharding) from the start                        |

The `04-schema-design/` section covers the actual decision-making process (embed vs. reference) in depth — this file is just establishing that the _default instinct_ differs meaningfully from relational modeling.

---

## No fixed schema, by default

```js
db.users.insertOne({ name: "Alice", age: 30 });
db.users.insertOne({ name: "Bob", nickname: "Bobby", isActive: true }); // totally different shape, same collection
```

MongoDB doesn't require every document in a collection to have the same fields or types — this flexibility is a deliberate feature, not an oversight, but it also means **schema discipline is something your application (or MongoDB's own optional schema validation, `04-schema-design/02-`) has to enforce deliberately**, rather than getting it for free from the database engine the way a relational database's fixed table schema does.

---

## How this shapes the rest of this documentation set

- **`02-crud`/`03-querying`** — operations work on whole documents (or nested fields within them), not rows-and-joins
- **`04-schema-design`** — because there's no forced normalization, _deciding_ how to structure related data (embed vs. reference) is a real design decision you make deliberately, not something the database forces on you
- **`06-aggregation`** — MongoDB's aggregation pipeline is how you do the equivalent of a SQL `JOIN`/`GROUP BY` when needed, via the `$lookup` and `$group` stages
- **`14-sharding`** — because MongoDB was designed with horizontal scaling in mind from early on, sharding is a first-class, well-supported feature rather than an afterthought bolted onto a fundamentally single-server design

## Quick summary

- `mongod` is the core server process; `mongos` is a routing layer used only in sharded deployments
- WiredTiger is the default storage engine underneath `mongod`, handling actual on-disk storage and concurrency
- MongoDB's document model favors storing related data together in one document, rather than normalizing across joined tables
- No fixed schema by default — flexibility that shifts schema discipline onto your application (or optional validation rules) rather than the database engine itself

## Next

**`02-databases-collections-documents.md`** covers the concrete hierarchy — databases, collections, and documents — that this architecture is built around.

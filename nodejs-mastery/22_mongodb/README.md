# MongoDB Mastery

MongoDB is a document-oriented NoSQL database.

Instead of storing data primarily as rows and tables:

```text
SQL

Database
 └── Tables
      └── Rows
           └── Columns
```

MongoDB uses:

```text
MongoDB

Database
 └── Collections
      └── Documents
           └── Fields
```

---

## 1. What is MongoDB?

MongoDB stores data as BSON documents.

Example:

```javascript
{
  _id: ObjectId("..."),

  name: "Shiva",

  age: 22,

  department: "CSE",

  skills: [
    "Python",
    "Node.js",
    "MongoDB"
  ]
}
```

Conceptually, this resembles JSON.

MongoDB actually stores BSON:

```text
BSON
│
├── JSON-like
├── Binary encoded
├── Supports additional data types
└── Optimized for database storage
```

---

# 2. MongoDB Terminology

| MongoDB     | SQL Equivalent  |
| ----------- | --------------- |
| Database    | Database        |
| Collection  | Table           |
| Document    | Row             |
| Field       | Column          |
| `_id`       | Primary Key     |
| Index       | Index           |
| Aggregation | Query/Analytics |
| `$lookup`   | JOIN            |

Example:

```text
college
│
├── students
│    ├── document
│    ├── document
│    └── document
│
├── faculty
│    ├── document
│    └── document
│
└── subjects
     ├── document
     └── document
```

---

# 3. Why MongoDB?

MongoDB is useful when the application has:

* flexible document structures
* rapidly evolving schemas
* nested data
* high-volume workloads
* horizontal scaling requirements
* event-oriented data
* JSON-heavy APIs

Example API response:

```javascript
{
  id: "tt-101",

  semester: 5,

  department: "CSE",

  periods: [
    {
      day: "Monday",
      start: "09:00",
      end: "10:00",
      subject: "DBMS",
      faculty: "FAC-101"
    }
  ]
}
```

A document database naturally represents this structure.

---

# 4. MongoDB Architecture

A simplified architecture:

```text
Node.js Application
        │
        │ MongoDB Driver
        ▼
MongoDB Server
        │
        ├── Database
        │
        ├── Collections
        │
        ├── Query Engine
        │
        ├── Indexes
        │
        └── Storage Engine
```

In a production system:

```text
Client
  │
  ▼
Node.js API
  │
  ▼
MongoDB Driver
  │
  ▼
MongoDB Cluster
  │
  ├── Primary
  │
  └── Secondaries
```

---

# 5. MongoDB Driver vs Mongoose

There are two important ways to use MongoDB from Node.js.

## Native MongoDB Driver

```javascript
import { MongoClient } from "mongodb";
```

This provides direct access to MongoDB.

Advantages:

* less abstraction
* full MongoDB API
* excellent performance
* useful for database-heavy operations

---

## Mongoose

```javascript
import mongoose from "mongoose";
```

Mongoose provides an ODM:

```text
Object Document Mapper
```

It adds:

* schemas
* validation
* middleware
* models
* hooks
* population
* type-related conveniences

---

# 6. Basic CRUD

CRUD means:

```text
C → Create
R → Read
U → Update
D → Delete
```

MongoDB operations:

```javascript
insertOne()
find()
findOne()
updateOne()
updateMany()
deleteOne()
deleteMany()
```

Example:

```javascript
await users.insertOne({
  name: "Shiva",
  age: 22,
});
```

---

# 7. Querying

Example:

```javascript
await users.find({
  age: {
    $gte: 18,
  },
});
```

MongoDB query operators include:

```text
$eq
$ne
$gt
$gte
$lt
$lte
$in
$nin
$and
$or
$not
$exists
$regex
```

---

# 8. Indexes

Indexes are critical for production MongoDB applications.

Without an appropriate index:

```text
Query
  ↓
Scan many documents
  ↓
Find matching documents
```

With an index:

```text
Query
  ↓
Index
  ↓
Matching documents
```

Example:

```javascript
await users.createIndex({
  email: 1,
});
```

---

# 9. Compound Index

Multiple fields can be indexed together:

```javascript
await timetables.createIndex({
  organizationId: 1,
  departmentId: 1,
  semester: 1,
});
```

This is useful for queries such as:

```javascript
await timetables.find({
  organizationId: "ORG-1",

  departmentId: "CSE",

  semester: 5,
});
```

Index design must follow actual query patterns.

---

# 10. Unique Index

Example:

```javascript
await users.createIndex(
  {
    email: 1,
  },
  {
    unique: true,
  },
);
```

Now duplicate emails are rejected.

This is a database-level constraint.

Do not rely only on:

```javascript
if (!existingUser) {
  createUser();
}
```

because concurrent requests can still race.

---

# 11. Aggregation

Aggregation processes documents through stages.

Example:

```javascript
await students.aggregate([
  {
    $match: {
      department: "CSE",
    },
  },

  {
    $group: {
      _id: "$semester",

      count: {
        $sum: 1,
      },
    },
  },
]);
```

Pipeline:

```text
documents
    │
    ▼
$match
    │
    ▼
$group
    │
    ▼
result
```

Common stages:

```text
$match
$group
$project
$sort
$limit
$skip
$lookup
$unwind
$set
$unset
$count
```

---

# 12. `$lookup`

MongoDB can perform join-like operations.

Example:

```javascript
{
  $lookup: {
    from: "faculty",

    localField: "facultyId",

    foreignField: "_id",

    as: "faculty",
  },
}
```

Conceptually:

```text
timetable
     │
     │ facultyId
     ▼
faculty
```

However, `$lookup` should not automatically replace good data modeling.

---

# 13. Transactions

Transactions allow multiple operations to behave atomically.

Example:

```text
Transaction
│
├── create timetable
├── assign faculty
├── update resource
│
└── commit
```

If one operation fails:

```text
rollback
```

Example:

```javascript
const session =
  client.startSession();

try {

  await session.withTransaction(
    async () => {

      await users.insertOne(
        user,
        { session },
      );

      await profiles.insertOne(
        profile,
        { session },
      );
    },
  );

} finally {

  await session.endSession();
}
```

Transactions should be used when atomicity across multiple writes is actually required.

---

# 14. Bulk Write

For many independent database operations:

```javascript
await collection.bulkWrite([
  {
    insertOne: {
      document: {
        name: "A",
      },
    },
  },

  {
    updateOne: {
      filter: {
        name: "B",
      },

      update: {
        $set: {
          active: true,
        },
      },
    },
  },
]);
```

This is particularly useful for:

```text
imports
batch updates
ETL
timetable generation
large synchronization operations
```

---

# 15. Pagination

Basic pagination:

```javascript
await users
  .find({})
  .skip(20)
  .limit(20);
```

But large offsets can become inefficient.

For large datasets, prefer cursor/range pagination:

```javascript
await users
  .find({
    _id: {
      $gt: lastId,
    },
  })
  .sort({
    _id: 1,
  })
  .limit(20);
```

Conceptually:

```text
Page 1
  ↓
lastId
  ↓
Page 2
  ↓
lastId
  ↓
Page 3
```

---

# 16. Cursor

MongoDB can return a cursor instead of loading the entire result set.

```javascript
const cursor =
  collection.find({});

for await (
  const document of cursor
) {

  console.log(
    document,
  );
}
```

This is useful for large datasets.

---

# 17. Change Streams

MongoDB Change Streams allow applications to react to database changes.

Example:

```javascript
const changeStream =
  collection.watch();

changeStream.on(
  "change",
  (change) => {

    console.log(
      change,
    );
  },
);
```

Conceptually:

```text
MongoDB
   │
   │ document changed
   ▼
Change Stream
   │
   ▼
Node.js
   │
   ├── WebSocket
   ├── cache invalidation
   ├── event processing
   └── notifications
```

---

# 18. Data Modeling

MongoDB does not mean:

```text
"Put everything into one document."
```

Nor does it mean:

```text
"Normalize everything like SQL."
```

The correct approach is workload-driven data modeling.

Consider:

```text
Embedded data
```

when data:

* belongs strongly to the parent
* is usually read together
* has bounded size

Consider:

```text
Referenced data
```

when data:

* is independently accessed
* grows significantly
* is shared by many documents
* has an independent lifecycle

---

# 19. Example: Timetable System

Possible collections:

```text
organizations
departments
users
faculty
subjects
rooms
nodes
edges
timetables
timetable_versions
generation_jobs
```

Example timetable:

```javascript
{
  _id: ObjectId("..."),

  organizationId:
    ObjectId("..."),

  departmentId:
    ObjectId("..."),

  semester: 5,

  academicYear:
    "2026-27",

  status:
    "draft",

  periods: [
    {
      day: "Monday",

      startTime: "09:00",

      endTime: "10:00",

      subjectId:
        ObjectId("..."),

      facultyId:
        ObjectId("..."),

      roomId:
        ObjectId("...")
    }
  ]
}
```

But whether `periods` should be embedded exactly this way depends on:

```text
read patterns
update patterns
document size
concurrency
query requirements
history/versioning
```

---

# 20. MongoDB + Node.js

Typical production architecture:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
MongoDB
```

Example:

```javascript
controller
    ↓
timetableService.update()
    ↓
timetableRepository.update()
    ↓
MongoDB
```

Avoid putting large amounts of database logic directly inside controllers.

---

# 21. Connection Management

A Node.js application should normally reuse the MongoDB client/connection pool.

Do NOT do this on every request:

```javascript
app.get(
  "/users",
  async (req, res) => {

    const client =
      new MongoClient(uri);

    await client.connect();

    // ...

    await client.close();
  },
);
```

Instead:

```text
Application startup
       │
       ▼
Create MongoDB client
       │
       ▼
Connection pool
       │
       ├── Request 1
       ├── Request 2
       ├── Request 3
       └── Request N
```

---

# 22. Error Handling

MongoDB errors should be translated at the application boundary.

Example:

```javascript
try {

  await users.insertOne(
    user,
  );

} catch (error) {

  if (
    error.code === 11000
  ) {

    throw new Error(
      "Email already exists",
    );
  }

  throw error;
}
```

Do not expose raw database errors to clients.

---

# 23. MongoDB Security

Production systems should consider:

```text
authentication
authorization
TLS
network restrictions
least privilege
secret management
input validation
audit logging
backup
encryption
```

Never put credentials directly in source code:

```javascript
const uri =
  "mongodb://admin:password@...";
```

Prefer:

```javascript
const uri =
  process.env.MONGODB_URI;
```

---

# 24. MongoDB Performance

When optimizing MongoDB:

```text
1. Understand query patterns
2. Inspect explain plans
3. Add appropriate indexes
4. Return only required fields
5. Avoid unnecessary large documents
6. Avoid unbounded arrays
7. Use appropriate pagination
8. Batch writes when appropriate
9. Avoid unnecessary $lookup operations
10. Measure before optimizing
```

Use:

```javascript
collection
  .find(query)
  .explain("executionStats");
```

to inspect query execution.

---

# 25. MongoDB and Redis

MongoDB:

```text
Primary persistent database
```

Redis:

```text
Cache
sessions
queues
temporary state
rate limiting
fast ephemeral data
```

A common architecture:

```text
              ┌───────────┐
              │  Node.js  │
              └─────┬─────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       Redis              MongoDB
       Cache              Database
```

Do not automatically put every MongoDB document into Redis.

Cache based on actual access patterns.

---

# 26. MongoDB and Kafka

MongoDB:

```text
Stores application state
```

Kafka:

```text
Transports durable event streams
```

Example:

```text
Timetable generated
        │
        ▼
MongoDB
        │
        ▼
Event
        │
        ▼
Kafka
        │
        ├── Notification service
        ├── Analytics service
        └── Audit service
```

Kafka is not simply a replacement for MongoDB bulk writes.

For bulk database insertion/update:

```javascript
bulkWrite()
```

is often the appropriate MongoDB operation.

---

# 27. MongoDB Vector Search

MongoDB can also be used for vector search.

Typical architecture:

```text
Document
   │
   ▼
Embedding Model
   │
   ▼
Vector
   │
   ▼
MongoDB Vector Search
```

Example conceptual document:

```javascript
{
  _id: "...",

  content:
    "Database Management Systems",

  embedding: [
    0.012,
    -0.283,
    0.441,
    // ...
  ]
}
```

Then semantic search can retrieve documents based on vector similarity.

This becomes particularly useful for:

```text
RAG
semantic search
AI assistants
document retrieval
recommendation
knowledge bases
```

---

# 28. Production Mental Model

The MongoDB stack you should understand is:

```text
MongoDB
│
├── Connection
│
├── Databases
│
├── Collections
│
├── Documents
│
├── CRUD
│
├── Query Operators
│
├── Updates
│
├── Indexes
│
├── Compound Indexes
│
├── Aggregation
│
├── Lookup
│
├── Transactions
│
├── Bulk Write
│
├── Pagination
│
├── Cursors
│
├── Change Streams
│
├── Data Modeling
│
├── Replication
│
├── Sharding
│
└── Vector Search
```

Then:

```text
Node.js
   │
   ▼
MongoDB Driver
   │
   ▼
Mongoose
   │
   ├── Schema
   ├── Model
   ├── Validation
   ├── Middleware
   └── Population
```

---

# 29. What You Should Master

By the end of this section you should be comfortable with:

```text
✓ MongoDB fundamentals
✓ BSON
✓ CRUD
✓ Query operators
✓ Update operators
✓ Projection
✓ Sorting
✓ Indexes
✓ Compound indexes
✓ Unique indexes
✓ Text search
✓ Aggregation
✓ $lookup
✓ Transactions
✓ bulkWrite()
✓ Pagination
✓ Cursor
✓ Change Streams
✓ Data modeling
✓ MongoDB Driver
✓ Mongoose
✓ Schema design
✓ Validation
✓ Mongoose middleware
✓ Population
✓ Performance
✓ Explain plans
✓ Replication
✓ Sharding
✓ Vector Search
```

---

# 30. Learning Order

Follow this order:

```text
01 Connection
      ↓
02 Database
      ↓
03 Collections
      ↓
04 Documents
      ↓
05 CRUD
      ↓
06 Queries
      ↓
07 Update Operators
      ↓
08 Delete
      ↓
09 Indexes
      ↓
10 Compound Indexes
      ↓
11 Unique Indexes
      ↓
12 Text Search
      ↓
13 Aggregation
      ↓
14 Lookup
      ↓
15 Transactions
      ↓
16 Bulk Write
      ↓
17 Pagination
      ↓
18 Cursor
      ↓
19 Change Streams
      ↓
20 Mongoose Schema
      ↓
21 Mongoose Model
      ↓
22 Mongoose CRUD
      ↓
23 Validation
      ↓
24 Mongoose Indexes
      ↓
25 Population
      ↓
26 Mongoose Transactions
      ↓
27 Mongoose Bulk Write
      ↓
28 Vector Search
```

The next file is:

```text
22_mongodb/01_connection.js
```

It will cover MongoDB connection architecture in Node.js, `MongoClient`, connection pooling, environment variables, startup/shutdown lifecycle, timeouts, and production connection handling.

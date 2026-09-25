# 01 — Fundamentals

With a running MongoDB instance from `00-setup`, this section covers what MongoDB actually is and how it's structured — the document model, BSON, and a high-level look at the CRUD operations covered in full detail in `02-crud/`.

## In this section

| File                                    | Covers                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `01-mongodb-architecture.md`            | How MongoDB is structured — `mongod`, the storage engine, and how it differs from a relational database |
| `02-databases-collections-documents.md` | The core hierarchy: databases contain collections, collections contain documents                        |
| `03-bson-types-and-objectid.md`         | BSON — the binary format documents are actually stored as — and `ObjectId`, BSON's own ID type          |
| `04-crud-overview.md`                   | A high-level tour of Create, Read, Update, Delete, before `02-crud/` covers each in depth               |

## Why this comes before CRUD operations in depth

Understanding _what_ a document actually is (a BSON object, not literally JSON), what an `ObjectId` actually encodes, and how collections relate to databases makes every subsequent CRUD/query/aggregation file make more sense — rather than memorizing `insertOne()`'s syntax without understanding what it's actually doing.

## What you should be able to do after this section

- Explain what `mongod` is, and how MongoDB's document model differs from a relational database's tables/rows
- Describe the database → collection → document hierarchy, and how it compares to a relational schema
- Explain what BSON is and why MongoDB uses it instead of plain JSON, and what information an `ObjectId` actually encodes
- Describe, at a high level, what each of the four CRUD operations does

## Next

**`02-crud`** covers Create, Read, Update, and Delete operations in full depth.

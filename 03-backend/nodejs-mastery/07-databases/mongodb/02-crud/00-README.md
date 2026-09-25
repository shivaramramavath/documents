# 02 — CRUD

`01-fundamentals/04-crud-overview.md` gave a high-level tour of Create, Read, Update, and Delete. This section covers each in full depth — every method variant, the options they accept, and the edge cases that matter in real code.

## In this section

| File                        | Covers                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `01-insert.md`              | `insertOne`/`insertMany`, ordered vs unordered inserts, and handling insert errors                   |
| `02-find-and-projection.md` | `find`/`findOne` in depth, cursors, sorting/limiting/skipping, and projections                       |
| `03-update.md`              | Update operators (`$set`, `$inc`, `$push`, etc.), `updateOne`/`updateMany`/`replaceOne`, and upserts |
| `04-delete.md`              | `deleteOne`/`deleteMany`, and the soft-delete alternative                                            |
| `05-bulk-operations.md`     | Performing many writes efficiently in a single round trip                                            |

## Why this comes before querying and schema design

Every filter object here is exactly the same syntax used later in `03-querying/` and in aggregation `$match` stages — mastering `find()`'s filter argument here transfers directly. Understanding update operators in depth also matters directly for `04-schema-design/`, since how you plan to _update_ a document shape (does a field need atomic increments? does an array need efficient appends?) is part of designing that shape in the first place.

## What you should be able to do after this section

- Insert one or many documents, and handle the difference between ordered and unordered bulk inserts
- Read documents with `find`, including sorting, pagination-style limiting/skipping, and returning only the fields you need
- Update documents precisely with operators, understand `updateOne` vs `replaceOne`, and use upserts correctly
- Delete documents safely, and know when a soft delete is the better choice
- Batch many writes into a single bulk operation for better performance than individual calls

## Next

**`03-querying`** goes deeper into the filter object itself — the full range of query operators available beyond the basics used here.

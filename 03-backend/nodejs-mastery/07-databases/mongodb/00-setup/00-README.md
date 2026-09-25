# mongosh & Compass

Two ways to actually look at and interact with a MongoDB database: `mongosh`, the command-line shell, and Compass, the official GUI. Most people end up using both, for different tasks.

## `mongosh` — the command-line shell

### Connecting

```bash
mongosh                                              # connects to localhost:27017 by default
mongosh "mongodb://localhost:27017"                    # explicit local connection
mongosh "mongodb+srv://cluster0.abcde.mongodb.net/" --username myuser   # Atlas
```

Atlas will prompt for the password interactively rather than taking it as a plain command-line argument, which avoids it ending up in your shell history.

### Basic navigation

```js
show dbs                  // list all databases
use myapp                  // switch to (or create, on first write) a database
show collections             // list collections in the current database
```

### Running queries directly

```js
db.users.find();
db.users.find({ age: { $gt: 18 } });
db.users.insertOne({ name: "Alice", age: 30 });
db.users.countDocuments();
```

`mongosh` is a full JavaScript environment — `db.users.find()` is a real method call, not a special query language, which is why the query syntax throughout this documentation set (`02-crud/`, `03-querying/`) looks like ordinary JavaScript object literals.

### Formatting output

```js
db.users.find().pretty(); // multi-line, indented output
db.users.find().limit(5); // only the first 5 results
db.users.find().toArray(); // materialize the cursor into a plain array
```

### Running a script file

```bash
mongosh myapp --file setup-script.js
```

Useful for repeatable setup — seeding test data, creating indexes — rather than typing the same commands interactively every time.

### Getting help

```js
help;
db.users.help();
db.help();
```

---

## MongoDB Compass — the GUI

Compass is MongoDB's official desktop application for visually browsing databases, running queries, building aggregation pipelines, and inspecting indexes — without writing shell commands for everything.

### Connecting

Open Compass, paste in the same connection string used for `mongosh`:

```
mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/
```

### What Compass is good for

- **Browsing data visually** — scrolling through documents in a collection without writing a `find()` query
- **Building queries with a form-based filter bar**, seeing results update live
- **The Aggregation Pipeline Builder** — constructing an aggregation (`06-aggregation/`) stage by stage, seeing each stage's output before adding the next — often much easier to reason about visually than writing the whole pipeline blind
- **Schema analysis** — Compass can sample a collection's documents and show you the actual shape/types of data present, useful for understanding an unfamiliar or evolved schema
- **Index management** — viewing existing indexes, their usage stats, and creating new ones through a form rather than a shell command
- **Explain plans** — visualizing a query's execution plan (`08-performance/01-explain.md`) more readably than raw shell JSON output

### Exporting a query as code

A particularly useful Compass feature: build a query or aggregation visually, then use "Export to language" to generate the equivalent Node.js/Python/Java code — a fast way to go from "I found the right query interactively" to "here's the code for my app."

---

## When to use which

| Task                                                 | Better tool                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| Quick one-off query while developing                 | `mongosh` — faster to type, no context-switching from the terminal |
| Exploring an unfamiliar collection's data/shape      | Compass — visual browsing beats scrolling shell output             |
| Building a complex aggregation pipeline              | Compass's pipeline builder — see each stage's output incrementally |
| Scripted, repeatable setup (seeding, index creation) | `mongosh --file` — version-controllable, rerunnable                |
| Checking index usage/health                          | Compass — visual stats are easier to scan than raw shell commands  |
| Quick sanity check during a scripted workflow/CI     | `mongosh` — no GUI needed, scriptable                              |

Most people default to `mongosh` for anything they're also going to encode in application code (since it's literally the same JavaScript-like query syntax), and reach for Compass when visual exploration or pipeline-building genuinely helps.

## Common mistakes

- **Typing an Atlas password directly into a connection string in shell history** — let `mongosh --username` prompt for it interactively instead.
- **Forgetting `.toArray()` when you need an actual array**, not a cursor — a `find()` result is a cursor, not a materialized array, which matters if you're passing the result into other JavaScript logic within `mongosh` itself.
- **Not exploring Compass's "Export to language" feature** — a fast way to translate an interactively-built query directly into the driver code you actually need, rather than hand-translating it.

## Quick summary

- `mongosh` is a full JavaScript shell connected to MongoDB — `db.collection.method()` calls, not a separate query language
- Compass is the visual GUI — best for browsing data, building aggregations incrementally, and inspecting indexes/schema
- Both connect with the same connection string; use whichever fits the task, and don't feel like you have to pick one permanently

## Section complete

With a running instance and a way to interact with it, **`01-fundamentals`** covers what's actually stored inside — databases, collections, documents, and BSON.

# Engineering Notes

A structured **software engineering knowledge base** covering programming languages, frontend, backend, databases, libraries, DevOps, system design, AI, DSA, interviews, and production engineering.

The goal is to maintain notes from:

```text
Fundamentals
    ↓
Core Concepts
    ↓
Intermediate
    ↓
Advanced
    ↓
Internals
    ↓
Production
    ↓
Interview
```

These notes are designed for both **learning** and **long-term technical reference**.

---

## Repository Structure

```text
engineering-notes/
│
├── README.md
├── ROADMAP.md
│
├── 01-languages/
├── 02-frontend/
├── 03-backend/
├── 04-databases/
├── 05-libraries/
├── 06-devops/
├── 07-system-design/
├── 08-ai/
├── 09-dsa/
├── 10-interview/
└── 11-production-patterns/
```

---

# 01. Languages

Programming language fundamentals, advanced concepts, internals, patterns, and interview preparation.

```text
01-languages/
│
├── javascript/
├── typescript/
├── java/
└── python/
```

### Topics

- Syntax and fundamentals
- Data types
- Functions
- OOP
- Collections
- Error handling
- Asynchronous programming
- Memory management
- Concurrency
- Language internals
- Advanced features
- Best practices

→ [JavaScript](./01-languages/javascript/)
→ [TypeScript](./01-languages/typescript/)
→ [Java](./01-languages/java/)
→ [Python](./01-languages/python/)

---

# 02. Frontend

Frontend technologies and application development.

```text
02-frontend/
│
├── html/
├── css/
├── javascript/
├── react/
├── nextjs/
├── tailwind/
├── zustand/
└── tanstack-query/
```

### Topics

- HTML
- CSS
- JavaScript in the browser
- React
- Next.js
- Tailwind CSS
- Client-side state management
- Server state management
- Routing
- Forms
- Performance
- Accessibility
- Frontend architecture

→ [HTML](./02-frontend/html/)
→ [CSS](./02-frontend/css/)
→ [React](./02-frontend/react/)
→ [Next.js](./02-frontend/nextjs/)
→ [Tailwind CSS](./02-frontend/tailwind/)
→ [Zustand](./02-frontend/zustand/)
→ [TanStack Query](./02-frontend/tanstack-query/)

---

# 03. Backend

Backend development with Node.js and related architecture concepts.

```text
03-backend/
│
├── nodejs/
├── express/
├── api-design/
├── authentication/
├── authorization/
├── websocket/
└── microservices/
```

### Topics

- Node.js fundamentals
- Node.js runtime
- Modules
- HTTP
- Events
- Streams
- Buffers
- File system
- Error handling
- Express
- REST APIs
- Authentication
- Authorization
- WebSockets
- Microservices
- Backend architecture
- Scalability

→ [Node.js](./03-backend/nodejs/)
→ [Express](./03-backend/express/)
→ [API Design](./03-backend/api-design/)
→ [Authentication](./03-backend/authentication/)
→ [Authorization](./03-backend/authorization/)
→ [WebSocket](./03-backend/websocket/)
→ [Microservices](./03-backend/microservices/)

---

# 04. Databases

Database concepts, implementation, optimization, and design.

```text
04-databases/
│
├── mongodb/
├── postgresql/
├── mysql/
├── redis/
└── database-design/
```

### Topics

- Database fundamentals
- SQL
- NoSQL
- Data modeling
- Schema design
- Indexing
- Queries
- Transactions
- Relationships
- Aggregation
- Caching
- Replication
- Performance
- Database security

→ [MongoDB](./04-databases/mongodb/)
→ [PostgreSQL](./04-databases/postgresql/)
→ [MySQL](./04-databases/mysql/)
→ [Redis](./04-databases/redis/)
→ [Database Design](./04-databases/database-design/)

---

# 05. Libraries

Practical reference notes for commonly used development libraries and tools.

```text
05-libraries/
│
├── axios/
├── pino/
├── argon2/
├── jose/
├── passport/
├── eslint/
├── prettier/
├── husky/
├── bullmq/
└── socketio/
```

### Current Libraries

| Library   | Purpose                           |
| --------- | --------------------------------- |
| Axios     | HTTP client                       |
| Pino      | Structured logging                |
| Argon2    | Password hashing                  |
| JOSE      | JWT/JWS/JWE and related standards |
| Passport  | Authentication middleware         |
| ESLint    | Code linting                      |
| Prettier  | Code formatting                   |
| Husky     | Git hooks                         |
| BullMQ    | Background jobs and queues        |
| Socket.IO | Real-time communication           |

Each library should document:

```text
Concept
   ↓
Why
   ↓
Installation
   ↓
Syntax
   ↓
Examples
   ↓
How It Works
   ↓
Configuration
   ↓
Common Mistakes
   ↓
Advanced
   ↓
Production
   ↓
Security
   ↓
Performance
   ↓
Interview
```

---

# 06. DevOps

Development, deployment, infrastructure, automation, and observability.

```text
06-devops/
│
├── git/
├── github/
├── docker/
├── nginx/
├── github-actions/
├── aws/
└── observability/
```

### Topics

- Git
- GitHub
- Branching
- Pull requests
- Docker
- Docker Compose
- Nginx
- CI/CD
- GitHub Actions
- AWS
- Deployment
- Monitoring
- Logging
- Metrics
- Tracing

→ [Git](./06-devops/git/)
→ [GitHub](./06-devops/github/)
→ [Docker](./06-devops/docker/)
→ [Nginx](./06-devops/nginx/)
→ [GitHub Actions](./06-devops/github-actions/)
→ [AWS](./06-devops/aws/)
→ [Observability](./06-devops/observability/)

---

# 07. System Design

Concepts required to design reliable, scalable, and distributed systems.

```text
07-system-design/
│
├── scalability/
├── caching/
├── queues/
├── load-balancing/
├── databases/
├── distributed-systems/
└── system-design-problems/
```

### Topics

- Scalability
- Vertical scaling
- Horizontal scaling
- Caching
- Message queues
- Load balancing
- Database scaling
- Replication
- Sharding
- Distributed systems
- CAP theorem
- Consistency
- Availability
- Fault tolerance
- Rate limiting
- System design problems

→ [Scalability](./07-system-design/scalability/)
→ [Caching](./07-system-design/caching/)
→ [Queues](./07-system-design/queues/)
→ [Load Balancing](./07-system-design/load-balancing/)
→ [Databases](./07-system-design/databases/)
→ [Distributed Systems](./07-system-design/distributed-systems/)
→ [System Design Problems](./07-system-design/system-design-problems/)

---

# 08. AI

Artificial intelligence and modern LLM application development.

```text
08-ai/
│
├── llm/
├── embeddings/
├── rag/
├── langchain/
├── langgraph/
└── vector-databases/
```

### Topics

- Large Language Models
- Prompt engineering
- Tokens
- Embeddings
- Vector search
- RAG
- Retrieval pipelines
- LangChain
- LangGraph
- Vector databases
- AI application architecture
- Evaluation
- AI production systems

→ [LLM](./08-ai/llm/)
→ [Embeddings](./08-ai/embeddings/)
→ [RAG](./08-ai/rag/)
→ [LangChain](./08-ai/langchain/)
→ [LangGraph](./08-ai/langgraph/)
→ [Vector Databases](./08-ai/vector-databases/)

---

# 09. DSA

Data structures, algorithms, reusable patterns, and problem-solving techniques.

```text
09-dsa/
│
├── patterns/
├── arrays/
├── strings/
├── trees/
├── graphs/
└── dynamic-programming/
```

### Topics

- Arrays
- Strings
- Hashing
- Two pointers
- Sliding window
- Prefix sum
- Binary search
- Stack
- Queue
- Linked list
- Trees
- Graphs
- Greedy
- Backtracking
- Dynamic programming

→ [Patterns](./09-dsa/patterns/)
→ [Arrays](./09-dsa/arrays/)
→ [Strings](./09-dsa/strings/)
→ [Trees](./09-dsa/trees/)
→ [Graphs](./09-dsa/graphs/)
→ [Dynamic Programming](./09-dsa/dynamic-programming/)

---

# 10. Interview

Interview-focused revision material.

```text
10-interview/
│
├── javascript.md
├── typescript.md
├── react.md
├── nodejs.md
├── mongodb.md
├── system-design.md
└── hr.md
```

### Coverage

- Core concepts
- Frequently asked questions
- Practical questions
- Debugging questions
- Architecture questions
- Performance questions
- Security questions
- System design questions
- Behavioral questions

→ [JavaScript Interview](./10-interview/javascript.md)
→ [TypeScript Interview](./10-interview/typescript.md)
→ [React Interview](./10-interview/react.md)
→ [Node.js Interview](./10-interview/nodejs.md)
→ [MongoDB Interview](./10-interview/mongodb.md)
→ [System Design Interview](./10-interview/system-design.md)
→ [HR Interview](./10-interview/hr.md)

---

# 11. Production Patterns

Reusable patterns for building real-world applications.

```text
11-production-patterns/
│
├── scalable-node-api/
├── authentication/
├── redis-cache/
├── background-jobs/
├── realtime-system/
├── file-upload/
├── logging/
├── error-handling/
└── deployment/
```

### Topics

- Scalable Node.js APIs
- Authentication architecture
- Redis caching
- Background jobs
- Real-time systems
- File uploads
- Logging
- Error handling
- Production deployment

This section focuses on **how technologies are combined to solve real engineering problems**.

---

# Documentation Philosophy

Every major topic should follow a consistent structure:

```text
Concept
   ↓
Why
   ↓
Prerequisites
   ↓
Mental Model
   ↓
Syntax
   ↓
Example
   ↓
How It Works
   ↓
Common Mistakes
   ↓
Advanced
   ↓
Production
   ↓
Performance
   ↓
Security
   ↓
Best Practices
   ↓
Interview
   ↓
Quick Revision
```

The goal is not to copy official documentation.

The goal is to understand:

```text
What?
 ↓
Why?
 ↓
How?
 ↓
When?
 ↓
When NOT?
 ↓
What happens internally?
 ↓
What can go wrong?
 ↓
How is it used in production?
```

---

# Learning Levels

Each technology should progressively move through these levels:

### Level 1 — Fundamentals

Understand basic terminology, syntax, APIs, and simple examples.

### Level 2 — Core

Understand how the major features work and how they interact.

### Level 3 — Advanced

Understand internals, edge cases, performance, security, and advanced APIs.

### Level 4 — Production

Understand architecture, scalability, observability, reliability, and operational concerns.

### Level 5 — Interview

Convert the knowledge into concise explanations and problem-solving ability.

---

# Repository Principles

## 1. Learn, Don't Copy

Notes should explain concepts in your own understanding rather than reproduce documentation.

## 2. Prefer Examples

A concept should normally be supported by practical code.

## 3. Understand Internals

Don't stop at API usage. Understand what happens underneath when it matters.

## 4. Connect Concepts

Link related technologies and patterns.

For example:

```text
Node.js
   ↓
Express
   ↓
Authentication
   ↓
JOSE / Passport
   ↓
Redis
   ↓
Scalable API
```

## 5. Keep Notes Updated

Technology changes over time. Update notes when APIs, recommended practices, or production patterns change.

## 6. Separate Knowledge From Patterns

Document:

> **What is Redis?**

in the Redis section.

Document:

> **How to implement Redis caching in a Node.js API**

in Production Patterns.

---

# Recommended Workflow

When learning a new technology:

```text
1. Learn the fundamentals
        ↓
2. Create the reference notes
        ↓
3. Write simple examples
        ↓
4. Build a small implementation
        ↓
5. Study internals
        ↓
6. Add advanced concepts
        ↓
7. Document production patterns
        ↓
8. Add common mistakes
        ↓
9. Add interview questions
        ↓
10. Create quick revision notes
```

---

# Repository Status

This repository is continuously evolving.

New technologies, concepts, patterns, implementation notes, and interview questions can be added as the knowledge base grows.

---

## Quick Navigation

| Area                                             | Description                     |
| ------------------------------------------------ | ------------------------------- |
| [Languages](./01-languages/)                     | Programming languages           |
| [Frontend](./02-frontend/)                       | Frontend development            |
| [Backend](./03-backend/)                         | Backend development             |
| [Databases](./04-databases/)                     | Database technologies           |
| [Libraries](./05-libraries/)                     | Development libraries           |
| [DevOps](./06-devops/)                           | Infrastructure and deployment   |
| [System Design](./07-system-design/)             | Scalable system architecture    |
| [AI](./08-ai/)                                   | LLM and AI engineering          |
| [DSA](./09-dsa/)                                 | Algorithms and data structures  |
| [Interview](./10-interview/)                     | Interview preparation           |
| [Production Patterns](./11-production-patterns/) | Real-world engineering patterns |

---

> **Learn the concept. Understand the internals. Build it. Apply it in production. Document it. Revise it.**

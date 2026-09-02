/**
 * ============================================================
 * NODE.JS CRYPTO - RANDOM UUID
 * ============================================================
 *
 * File:
 *     12_crypto/random_uuid.js
 *
 * ============================================================
 *
 * WHAT IS A UUID?
 * ============================================================
 *
 * UUID = Universally Unique Identifier
 *
 * A UUID is a standardized identifier used to identify
 * objects, records, requests, resources, etc.
 *
 * Example:
 *
 *     550e8400-e29b-41d4-a716-446655440000
 *
 *
 * UUID structure:
 *
 *     xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *
 *
 * UUIDs are commonly used for:
 *
 *     - Database IDs
 *     - User IDs
 *     - Request IDs
 *     - Order IDs
 *     - Message IDs
 *     - Session identifiers
 *     - Distributed systems
 *     - Correlation IDs
 *
 * ============================================================
 *
 * RANDOM UUID
 * ============================================================
 *
 * Node.js provides:
 *
 *     crypto.randomUUID()
 *
 * It generates a cryptographically strong random UUID.
 *
 * ============================================================
 */

const { randomUUID } = require("node:crypto");

/*
 * ============================================================
 * 1. Generate a UUID
 * ============================================================
 */

const id = randomUUID();

console.log("UUID:", id);

/*
 * Example:
 *
 *     3f2504e0-4f89-41d3-9a0c-0305e82c3301
 *
 * The exact value will be different every time.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Generate multiple UUIDs
 * ============================================================
 */

for (let i = 0; i < 5; i++) {
  console.log(randomUUID());
}

/*
 * ============================================================
 * 3. UUID length
 * ============================================================
 */

const uuid = randomUUID();

console.log("UUID:", uuid);

console.log("Length:", uuid.length);

/*
 * A standard textual UUID is 36 characters:
 *
 *     32 hexadecimal characters
 *     +
 *     4 hyphens
 *
 *     32 + 4 = 36
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. UUID format
 * ============================================================
 *
 * UUID:
 *
 *     xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
 *
 *
 * The third section identifies the UUID version.
 *
 * For randomUUID():
 *
 *     Version = 4
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Check UUID version
 * ============================================================
 */

const version = uuid[14];

console.log("UUID version:", version);

/*
 * Version 4 UUID:
 *
 *     xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx
 *
 *
 * Therefore character index 14 is:
 *
 *     "4"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Validate UUID format
 * ============================================================
 */

function isUuid(value) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value);
}

console.log("Valid UUID:", isUuid(uuid));

console.log("Invalid UUID:", isUuid("hello"));

/*
 * ============================================================
 * 7. Generate a user ID
 * ============================================================
 */

function generateUserId() {
  return randomUUID();
}

const userId = generateUserId();

console.log("User ID:", userId);

/*
 * ============================================================
 * 8. Generate an order ID
 * ============================================================
 */

function generateOrderId() {
  return randomUUID();
}

const orderId = generateOrderId();

console.log("Order ID:", orderId);

/*
 * ============================================================
 * 9. Generate a request ID
 * ============================================================
 *
 * Request IDs are useful for tracing requests across
 * services and logs.
 *
 * ============================================================
 */

function generateRequestId() {
  return randomUUID();
}

const requestId = generateRequestId();

console.log("Request ID:", requestId);

/*
 * ============================================================
 * 10. Correlation ID
 * ============================================================
 *
 * In distributed systems:
 *
 *
 * Client
 *   ↓
 * API Gateway
 *   ↓
 * User Service
 *   ↓
 * Payment Service
 *   ↓
 * Notification Service
 *
 *
 * The same correlation ID can be passed through services
 * to associate logs with one request/workflow.
 *
 * ============================================================
 */

const correlationId = randomUUID();

console.log("Correlation ID:", correlationId);

/*
 * ============================================================
 * 11. Message ID
 * ============================================================
 */

const messageId = randomUUID();

const message = {
  id: messageId,
  content: "Hello Node.js",
};

console.log(message);

/*
 * ============================================================
 * 12. Database record example
 * ============================================================
 */

const user = {
  id: randomUUID(),
  name: "Shiva",
  email: "user@example.com",
};

console.log(user);

/*
 * ============================================================
 * 13. UUID as a Map key
 * ============================================================
 */

const users = new Map();

const id1 = randomUUID();

users.set(id1, {
  name: "Shiva",
});

console.log(users.get(id1));

/*
 * ============================================================
 * 14. UUID uniqueness
 * ============================================================
 *
 * UUID v4 has a very large random space.
 *
 * The probability of accidental collision is extremely small
 * when generated correctly.
 *
 * However:
 *
 *     "unique in practice"
 *
 * does NOT mean:
 *
 *     "mathematically impossible to collide"
 *
 *
 * Applications should still define appropriate database
 * uniqueness constraints when identifiers must be unique.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Generate 1000 UUIDs
 * ============================================================
 */

const ids = new Set();

for (let i = 0; i < 1000; i++) {
  ids.add(randomUUID());
}

console.log("Generated:", 1000);

console.log("Unique:", ids.size);

/*
 * Normally:
 *
 *     Generated = 1000
 *     Unique    = 1000
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Check duplicate UUIDs
 * ============================================================
 */

function generateUniqueIds(count) {
  const result = new Set();

  while (result.size < count) {
    result.add(randomUUID());
  }

  return [...result];
}

const generatedIds = generateUniqueIds(10);

console.log(generatedIds);

/*
 * ============================================================
 * 17. UUID and randomBytes()
 * ============================================================
 *
 * randomBytes():
 *
 *     Gives raw cryptographic random bytes.
 *
 *
 * randomUUID():
 *
 *     Gives a standardized UUID representation.
 *
 *
 * Example:
 *
 *     randomBytes(16)
 *
 * gives:
 *
 *     <Buffer ...>
 *
 *
 * randomUUID()
 *
 * gives:
 *
 *     xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. UUID vs random token
 * ============================================================
 *
 *
 * UUID:
 *
 *     randomUUID()
 *
 *     Standardized format
 *     Easy to recognize
 *     36-character string
 *
 *
 * Random token:
 *
 *     randomBytes(32)
 *
 *     Custom length
 *     Custom encoding
 *     Useful for secrets/tokens
 *
 *
 * Use the appropriate primitive for the purpose.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. UUID is not automatically a secret
 * ============================================================
 *
 * A UUID is primarily an identifier.
 *
 * Do NOT automatically treat:
 *
 *     randomUUID()
 *
 * as a replacement for:
 *
 *     authentication secret
 *     password reset secret
 *     API secret
 *     encryption key
 *
 *
 * For secret material, use appropriate cryptographic random
 * bytes and security design.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. UUID and database IDs
 * ============================================================
 *
 * A database may use UUIDs instead of sequential integers.
 *
 *
 * Integer:
 *
 *     1
 *     2
 *     3
 *     4
 *
 *
 * UUID:
 *
 *     8a7...
 *     91b...
 *     f24...
 *     4cd...
 *
 *
 * UUIDs are useful when IDs need to be generated across
 * multiple services without relying on a central sequence.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Distributed system example
 * ============================================================
 *
 *
 * Service A
 *     ↓
 * generates:
 *
 *     7b9f...UUID
 *
 *
 * Service B receives the same ID.
 *
 * Service C can also refer to the same resource.
 *
 *
 * This is useful because different services can generate
 * identifiers independently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. UUID in HTTP request tracing
 * ============================================================
 */

const traceId = randomUUID();

const requestHeaders = {
  "x-request-id": traceId,
};

console.log(requestHeaders);

/*
 * A server could use the request ID in:
 *
 *     logs
 *     metrics
 *     tracing
 *     error reports
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. UUID in an object
 * ============================================================
 */

function createUser(name, email) {
  return {
    id: randomUUID(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };
}

const newUser = createUser("Shiva", "shiva@example.com");

console.log(newUser);

/*
 * ============================================================
 * 24. UUID in an array
 * ============================================================
 */

const products = Array.from(
  {
    length: 5,
  },
  (_, index) => {
    return {
      id: randomUUID(),
      name: `Product ${index + 1}`,
    };
  },
);

console.log(products);

/*
 * ============================================================
 * 25. UUID comparison
 * ============================================================
 */

const uuidA = randomUUID();

const uuidB = randomUUID();

console.log("UUID A:", uuidA);

console.log("UUID B:", uuidB);

console.log("Same:", uuidA === uuidB);

/*
 * ============================================================
 * 26. UUID lowercase format
 * ============================================================
 *
 * Node.js returns UUIDs in the standard textual form.
 *
 * You can normalize user-provided UUID strings if your
 * application accepts different casing.
 *
 * ============================================================
 */

const normalized = uuid.toLowerCase();

console.log(normalized);

/*
 * ============================================================
 * 27. Remove hyphens
 * ============================================================
 *
 * Sometimes an external system may require a compact
 * representation.
 *
 * ============================================================
 */

const compactUuid = uuid.replace(/-/g, "");

console.log("Compact UUID:", compactUuid);

console.log("Compact length:", compactUuid.length);

/*
 * Standard:
 *
 *     36 characters
 *
 * Compact:
 *
 *     32 hexadecimal characters
 *
 *
 * IMPORTANT:
 *
 * If your API/database expects standard UUID formatting,
 * do not arbitrarily change the format.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Convert UUID to string
 * ============================================================
 */

const uuidString = String(randomUUID());

console.log(typeof uuidString);

console.log(uuidString);

/*
 * ============================================================
 * 29. UUID validation helper
 * ============================================================
 */

function assertUuid(value) {
  if (!isUuid(value)) {
    throw new TypeError("Invalid UUID");
  }

  return value;
}

try {
  assertUuid(randomUUID());

  console.log("UUID accepted");
} catch (error) {
  console.error(error.message);
}

/*
 * ============================================================
 * 30. Invalid UUID example
 * ============================================================
 */

try {
  assertUuid("not-a-uuid");
} catch (error) {
  console.error("Validation error:", error.message);
}

/*
 * ============================================================
 * 31. UUID version 4
 * ============================================================
 *
 * randomUUID() generates RFC 9562 UUID version 4 values.
 *
 * Version 4 UUIDs are based primarily on randomly generated
 * bits with UUID-defined version and variant bits.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. UUID variant
 * ============================================================
 *
 * A UUID also contains variant information.
 *
 * In the standard textual representation:
 *
 *     xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * The first hexadecimal character of the fourth group is
 * constrained to the RFC 9562 variant range.
 *
 * For version 4 UUIDs it is commonly:
 *
 *     8
 *     9
 *     a
 *     b
 *
 * ============================================================
 */

const variant = uuid[19];

console.log("Variant character:", variant);

/*
 * ============================================================
 * 33. UUID structure inspection
 * ============================================================
 */

const parts = uuid.split("-");

console.log("UUID parts:", parts);

console.log("Part 1:", parts[0]);

console.log("Part 2:", parts[1]);

console.log("Part 3:", parts[2]);

console.log("Part 4:", parts[3]);

console.log("Part 5:", parts[4]);

/*
 * UUID groups:
 *
 *     8 - 4 - 4 - 4 - 12
 *
 * Total:
 *
 *     36 characters including hyphens.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. UUID factory
 * ============================================================
 */

const Id = {
  generate() {
    return randomUUID();
  },

  validate(value) {
    return isUuid(value);
  },
};

const generatedId = Id.generate();

console.log("Generated ID:", generatedId);

console.log("Valid:", Id.validate(generatedId));

/*
 * ============================================================
 * 35. Practical entity factory
 * ============================================================
 */

function createEntity(data) {
  return {
    id: randomUUID(),
    ...data,
  };
}

const entity = createEntity({
  type: "user",
  name: "Shiva",
});

console.log(entity);

/*
 * ============================================================
 * 36. UUID as a request correlation identifier
 * ============================================================
 */

function createRequestContext() {
  return {
    requestId: randomUUID(),
    startedAt: Date.now(),
  };
}

const context = createRequestContext();

console.log(context);

/*
 * ============================================================
 * 37. UUID and logging
 * ============================================================
 */

function logRequest(requestId, message) {
  console.log(`[${requestId}] ${message}`);
}

const logRequestId = randomUUID();

logRequest(logRequestId, "Request started");

logRequest(logRequestId, "Processing request");

logRequest(logRequestId, "Request completed");

/*
 * This allows multiple log entries to be associated with
 * the same request.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Do not use UUID for ordered IDs
 * ============================================================
 *
 * UUID v4 values are random.
 *
 * They are not naturally ordered by creation time.
 *
 * If your database requires chronological ordering or
 * locality, consider an identifier strategy designed for
 * that purpose.
 *
 * Examples include:
 *
 *     UUID v7
 *     ULID
 *     database-generated sequences
 *
 * The choice depends on the application's requirements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. UUID vs database ObjectId
 * ============================================================
 *
 * MongoDB commonly uses ObjectId by default.
 *
 * PostgreSQL and other systems can use UUID columns.
 *
 *
 * UUID:
 *
 *     Standardized identifier
 *
 *
 * ObjectId:
 *
 *     MongoDB-specific identifier format
 *
 *
 * Neither is universally "better".
 *
 * Choose based on database design and application needs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. UUID security considerations
 * ============================================================
 *
 * UUIDs can be excellent identifiers.
 *
 * But do not rely on an identifier alone for authorization.
 *
 *
 * BAD:
 *
 *     GET /users/<uuid>
 *
 * and assuming:
 *
 *     "The UUID is hard to guess, therefore it is secure."
 *
 *
 * Authorization must still verify that the requesting user
 * has permission to access the resource.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. UUID generation is local
 * ============================================================
 *
 * randomUUID() does not require:
 *
 *     a database
 *     a network request
 *     a central ID server
 *
 *
 * The application can generate the ID locally.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. UUID in REST API response
 * ============================================================
 */

function createApiResponse(data) {
  return {
    id: randomUUID(),
    data,
  };
}

console.log(
  createApiResponse({
    message: "Success",
  }),
);

/*
 * ============================================================
 * 43. UUID in event-driven systems
 * ============================================================
 */

const event = {
  id: randomUUID(),
  type: "USER_CREATED",
  timestamp: new Date().toISOString(),
  data: {
    userId: randomUUID(),
  },
};

console.log(event);

/*
 * Event IDs can help consumers identify and deduplicate
 * events when the overall system is designed to support
 * idempotency.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. UUID generation function
 * ============================================================
 */

function createId() {
  return randomUUID();
}

console.log(createId());

/*
 * ============================================================
 * 45. Practical ID service
 * ============================================================
 */

class IdGenerator {
  static uuid() {
    return randomUUID();
  }
}

const idA = IdGenerator.uuid();

const idB = IdGenerator.uuid();

console.log(idA);

console.log(idB);

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const {
 *       randomUUID
 *     } = require("node:crypto");
 *
 *
 * Generate:
 *
 *     const id =
 *       randomUUID();
 *
 *
 * Validate:
 *
 *     /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
 *
 *
 * Standard UUID:
 *
 *     xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *
 *
 * Version 4:
 *
 *     xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx
 *
 *
 * Length:
 *
 *     36 characters
 *
 *
 * ============================================================
 * UUID vs RANDOM BYTES
 * ============================================================
 *
 *
 * randomBytes()
 *
 *     Raw random bytes
 *     ↓
 *     Tokens
 *     Keys
 *     Nonces
 *
 *
 * randomUUID()
 *
 *     Standardized random identifier
 *     ↓
 *     IDs
 *     Request IDs
 *     Entity IDs
 *     Correlation IDs
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     randomUUID()
 *
 * gives your Node.js application a convenient way to generate
 * cryptographically strong UUID version 4 identifiers.
 *
 * Use UUIDs for identification, not as a substitute for
 * authentication or authorization.
 *
 * ============================================================
 */

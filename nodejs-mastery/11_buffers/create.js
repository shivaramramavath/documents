/**
 * ============================================================
 * NODE.JS BUFFERS - CREATE
 * ============================================================
 *
 * File:
 *     11_buffers/create.js
 *
 * ============================================================
 *
 * WHAT IS A BUFFER?
 * ============================================================
 *
 * A Buffer is Node.js's way of working with raw binary data.
 *
 * JavaScript normally works with strings and objects:
 *
 *     "Hello"
 *     { name: "Shiva" }
 *
 * Node.js also needs to work with binary data:
 *
 *     Files
 *     Images
 *     Videos
 *     Audio
 *     TCP packets
 *     HTTP data
 *     Encryption
 *     Compression
 *
 *
 * Buffer provides a fixed-size sequence of bytes.
 *
 *
 * Example:
 *
 *     "A"
 *
 * can be represented as:
 *
 *     65
 *
 * in UTF-8 / ASCII-compatible encoding.
 *
 *
 * ============================================================
 *
 * Buffer
 * ============================================================
 *
 *     Buffer
 *        │
 *        ├── Byte
 *        ├── Byte
 *        ├── Byte
 *        └── Byte
 *
 *
 * Each byte contains a value from:
 *
 *     0 → 255
 *
 * ============================================================
 */

const { Buffer } = require("node:buffer");

/*
 * ============================================================
 * 1. Create an empty Buffer
 * ============================================================
 *
 * Buffer.alloc(size)
 *
 * creates a Buffer with the requested number of bytes.
 *
 * ============================================================
 */

const buffer = Buffer.alloc(10);

console.log("Buffer:", buffer);

/*
 * Output:
 *
 * <Buffer 00 00 00 00 00 00 00 00 00 00>
 *
 *
 * 10 bytes were allocated.
 *
 *
 * Each byte initially contains:
 *
 *     0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Buffer length
 * ============================================================
 */

console.log("Length:", buffer.length);

/*
 * ============================================================
 * 3. Create Buffer from a string
 * ============================================================
 *
 * Buffer.from(string)
 *
 * converts a string into bytes.
 *
 * ============================================================
 */

const hello = Buffer.from("Hello");

console.log("Buffer:", hello);

console.log("Length:", hello.length);

/*
 * "Hello" contains 5 ASCII characters.
 *
 * Therefore:
 *
 *     Buffer length = 5 bytes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Convert Buffer back to string
 * ============================================================
 */

console.log("String:", hello.toString());

/*
 * ============================================================
 * 5. Buffer.from() with UTF-8
 * ============================================================
 */

const utf8Buffer = Buffer.from("Hello", "utf8");

console.log(utf8Buffer);

/*
 * UTF-8 is the default encoding.
 *
 *
 * Therefore:
 *
 *     Buffer.from("Hello")
 *
 * is equivalent to:
 *
 *     Buffer.from(
 *       "Hello",
 *       "utf8"
 *     )
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Buffer from hexadecimal string
 * ============================================================
 *
 * Hexadecimal represents bytes using:
 *
 *     00 → FF
 *
 * ============================================================
 */

const hexBuffer = Buffer.from("48656c6c6f", "hex");

console.log("Hex Buffer:", hexBuffer);

console.log("Text:", hexBuffer.toString());

/*
 * 48656c6c6f
 *
 * represents:
 *
 *     Hello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Buffer from Base64
 * ============================================================
 */

const base64Buffer = Buffer.from("SGVsbG8=", "base64");

console.log("Base64 Buffer:", base64Buffer);

console.log("Text:", base64Buffer.toString());

/*
 * ============================================================
 * 8. Buffer from an array
 * ============================================================
 *
 * Each number represents one byte.
 *
 * Valid values:
 *
 *     0 → 255
 *
 * ============================================================
 */

const arrayBuffer = Buffer.from([72, 101, 108, 108, 111]);

console.log(arrayBuffer);

console.log(arrayBuffer.toString());

/*
 * These byte values represent:
 *
 *     H = 72
 *     e = 101
 *     l = 108
 *     l = 108
 *     o = 111
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Buffer.alloc()
 * ============================================================
 */

const safeBuffer = Buffer.alloc(5);

console.log(safeBuffer);

/*
 * Result:
 *
 * <Buffer 00 00 00 00 00>
 *
 *
 * Buffer.alloc() initializes memory with zeros.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Buffer.alloc() with a fill value
 * ============================================================
 */

const filledBuffer = Buffer.alloc(5, 1);

console.log(filledBuffer);

/*
 * Result:
 *
 * <Buffer 01 01 01 01 01>
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Fill with a string
 * ============================================================
 */

const textBuffer = Buffer.alloc(10, "A");

console.log(textBuffer);

/*
 * ============================================================
 * 12. Buffer.allocUnsafe()
 * ============================================================
 *
 * allocUnsafe() allocates memory without initializing it.
 *
 * It can be faster than alloc().
 *
 *
 * IMPORTANT:
 *
 * The memory may contain old data.
 *
 * Therefore:
 *
 *     DO NOT use allocUnsafe()
 *
 * when you need initialized / zeroed memory.
 *
 * ============================================================
 */

const unsafeBuffer = Buffer.allocUnsafe(10);

console.log("Unsafe Buffer:", unsafeBuffer);

/*
 * IMPORTANT:
 *
 * Never assume allocUnsafe() contains zeros.
 *
 * If you expose its contents before writing them, you may
 * accidentally expose previous memory contents.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Buffer.from() vs Buffer.alloc()
 * ============================================================
 *
 *
 * Buffer.from()
 *
 *     Creates Buffer from existing data.
 *
 *
 * Buffer.alloc()
 *
 *     Creates a new initialized Buffer.
 *
 *
 * Example:
 *
 *     Buffer.from("Hello")
 *
 *
 *     Buffer.alloc(10)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Buffer byte access
 * ============================================================
 */

const data = Buffer.from("Hello");

console.log("First byte:", data[0]);

console.log("Second byte:", data[1]);

/*
 * H = 72
 * e = 101
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Modify a byte
 * ============================================================
 */

const mutable = Buffer.from("Hello");

mutable[0] = 74;

console.log(mutable.toString());

/*
 * 74 = J
 *
 * Result:
 *
 *     Jello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Read all bytes
 * ============================================================
 */

for (const byte of data) {
  console.log(byte);
}

/*
 * ============================================================
 * 17. Buffer is iterable
 * ============================================================
 */

for (const byte of Buffer.from("ABC")) {
  console.log(byte);
}

/*
 * Output:
 *
 *     65
 *     66
 *     67
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Convert Buffer to array
 * ============================================================
 */

const bytes = Array.from(Buffer.from("Hello"));

console.log(bytes);

/*
 * ============================================================
 * 19. Buffer to JSON
 * ============================================================
 */

const jsonBuffer = Buffer.from("Hello");

console.log(jsonBuffer.toJSON());

/*
 * Result:
 *
 * {
 *   type: "Buffer",
 *   data: [
 *     72,
 *     101,
 *     108,
 *     108,
 *     111
 *   ]
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Buffer.isBuffer()
 * ============================================================
 *
 * Used to determine whether a value is a Buffer.
 * ============================================================
 */

console.log(Buffer.isBuffer(Buffer.from("Hello")));

console.log(Buffer.isBuffer("Hello"));

/*
 * Output:
 *
 *     true
 *     false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Buffer.byteLength()
 * ============================================================
 *
 * Returns the number of bytes required to represent a string.
 *
 * ============================================================
 */

console.log(Buffer.byteLength("Hello"));

/*
 * ASCII characters:
 *
 *     1 character ≈ 1 byte in UTF-8
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Unicode characters
 * ============================================================
 *
 * Characters do not always equal bytes.
 *
 * ============================================================
 */

const unicode = "😊";

console.log("Characters:", unicode.length);

console.log("Bytes:", Buffer.byteLength(unicode, "utf8"));

/*
 * IMPORTANT:
 *
 * JavaScript string length and UTF-8 byte length can differ.
 *
 * This is very important when dealing with:
 *
 *     network protocols
 *     file sizes
 *     database storage
 *     binary protocols
 * ============================================================
 */

/*
 * ============================================================
 * 23. Buffer size
 * ============================================================
 */

const sizeBuffer = Buffer.alloc(1024);

console.log("Bytes:", sizeBuffer.length);

/*
 * 1024 bytes = 1 KiB
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Buffer slice
 * ============================================================
 */

const original = Buffer.from("Hello World");

const sliced = original.subarray(0, 5);

console.log(sliced.toString());

/*
 * Result:
 *
 *     Hello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. subarray() shares memory
 * ============================================================
 *
 * A subarray is a view over the original Buffer.
 *
 * Modifying it can modify the original Buffer.
 *
 * ============================================================
 */

const originalBuffer = Buffer.from("Hello");

const view = originalBuffer.subarray(0, 5);

view[0] = 74;

console.log(originalBuffer.toString());

/*
 * Result:
 *
 *     Jello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Copy a Buffer
 * ============================================================
 *
 * Buffer.from(buffer)
 *
 * creates a separate Buffer containing the same bytes.
 *
 * ============================================================
 */

const sourceBuffer = Buffer.from("Hello");

const copiedBuffer = Buffer.from(sourceBuffer);

copiedBuffer[0] = 74;

console.log("Original:", sourceBuffer.toString());

console.log("Copy:", copiedBuffer.toString());

/*
 * Original:
 *
 *     Hello
 *
 *
 * Copy:
 *
 *     Jello
 *
 *
 * They have independent memory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Buffer.concat()
 * ============================================================
 *
 * Combines multiple Buffers.
 * ============================================================
 */

const first = Buffer.from("Hello ");

const second = Buffer.from("World");

const combined = Buffer.concat([first, second]);

console.log(combined.toString());

/*
 * Result:
 *
 *     Hello World
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Buffer.concat() with total length
 * ============================================================
 */

const combinedWithLength = Buffer.concat(
  [Buffer.from("Hello "), Buffer.from("Node")],
  10,
);

console.log(combinedWithLength);

/*
 * ============================================================
 * 29. Compare Buffers
 * ============================================================
 */

const bufferA = Buffer.from("ABC");

const bufferB = Buffer.from("ABC");

console.log(bufferA.equals(bufferB));

/*
 * Result:
 *
 *     true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Buffer.compare()
 * ============================================================
 */

console.log(Buffer.compare(Buffer.from("ABC"), Buffer.from("ABC")));

/*
 * Result:
 *
 *     0
 *
 *
 * Comparison:
 *
 *     0  → equal
 *     <0 → first comes before second
 *     >0 → first comes after second
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Write into Buffer
 * ============================================================
 */

const writableBuffer = Buffer.alloc(20);

const bytesWritten = writableBuffer.write("Hello");

console.log("Bytes written:", bytesWritten);

console.log(writableBuffer.toString());

/*
 * ============================================================
 * 32. Write at a specific offset
 * ============================================================
 */

const offsetBuffer = Buffer.alloc(10);

offsetBuffer.write("Hello", 2);

console.log(offsetBuffer);

console.log(offsetBuffer.toString());

/*
 * Data starts at byte offset 2.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Encoding conversions
 * ============================================================
 */

const encodingBuffer = Buffer.from("Hello");

console.log("UTF-8:", encodingBuffer.toString("utf8"));

console.log("Hex:", encodingBuffer.toString("hex"));

console.log("Base64:", encodingBuffer.toString("base64"));

/*
 * ============================================================
 * 34. Buffer and files
 * ============================================================
 *
 * fs.readFile() can return a Buffer when no encoding is given.
 *
 *
 * Example:
 *
 *     const fs =
 *       require("node:fs/promises");
 *
 *
 *     const data =
 *       await fs.readFile(
 *         "./image.png"
 *       );
 *
 *
 * data is a Buffer.
 *
 *
 * This is how Node.js can work with binary files.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Buffer and streams
 * ============================================================
 *
 * Streams commonly transfer data as Buffer chunks.
 *
 *
 *     File
 *       ↓
 * Readable Stream
 *       ↓
 *   Buffer chunk
 *       ↓
 * Transform
 *       ↓
 *   Buffer chunk
 *       ↓
 * Writable Stream
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Buffer and HTTP
 * ============================================================
 *
 * HTTP request bodies may arrive as Buffer chunks.
 *
 *
 *     Client
 *       ↓
 *     HTTP
 *       ↓
 * Buffer chunks
 *       ↓
 * Server
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Buffer and binary data
 * ============================================================
 *
 * Buffer is especially useful for:
 *
 *     Images
 *     PDFs
 *     Videos
 *     Audio
 *     ZIP files
 *     Encryption
 *     Hashing
 *     Network packets
 *     File streams
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Buffer memory
 * ============================================================
 *
 *
 * Buffer:
 *
 *     fixed-size
 *     byte-oriented
 *     mutable
 *
 *
 * Example:
 *
 *     Buffer.alloc(5)
 *
 *
 * creates exactly:
 *
 *     5 bytes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Common Buffer constructors
 * ============================================================
 *
 *
 * Buffer.from("Hello")
 *
 *     String → Buffer
 *
 *
 * Buffer.from([1, 2, 3])
 *
 *     Array → Buffer
 *
 *
 * Buffer.from(existingBuffer)
 *
 *     Copy Buffer
 *
 *
 * Buffer.alloc(10)
 *
 *     Safe initialized Buffer
 *
 *
 * Buffer.allocUnsafe(10)
 *
 *     Uninitialized Buffer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Common Buffer methods
 * ============================================================
 *
 *
 * buffer.toString()
 *
 *     Buffer → string
 *
 *
 * buffer.write()
 *
 *     Write string into Buffer
 *
 *
 * buffer.subarray()
 *
 *     Create a view
 *
 *
 * buffer.equals()
 *
 *     Compare Buffers
 *
 *
 * buffer.toJSON()
 *
 *     Convert to JSON representation
 *
 *
 * Buffer.concat()
 *
 *     Combine Buffers
 *
 *
 * Buffer.byteLength()
 *
 *     Calculate byte size
 *
 *
 * Buffer.isBuffer()
 *
 *     Check whether value is Buffer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Buffer vs String
 * ============================================================
 *
 *
 * String:
 *
 *     Human-readable text
 *
 *
 * Buffer:
 *
 *     Raw bytes
 *
 *
 * String:
 *
 *     "Hello"
 *
 *
 * Buffer:
 *
 *     <Buffer 48 65 6c 6c 6f>
 *
 *
 * Conversion:
 *
 *     String
 *       ↓
 *   Buffer.from()
 *       ↓
 *     Buffer
 *
 *
 *     Buffer
 *       ↓
 *   toString()
 *       ↓
 *     String
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * Create:
 *
 *     Buffer.alloc(10);
 *
 *
 * Create from string:
 *
 *     Buffer.from("Hello");
 *
 *
 * Create from hex:
 *
 *     Buffer.from(
 *       "48656c6c6f",
 *       "hex"
 *     );
 *
 *
 * Create from Base64:
 *
 *     Buffer.from(
 *       "SGVsbG8=",
 *       "base64"
 *     );
 *
 *
 * Read:
 *
 *     buffer[0];
 *
 *
 * Write:
 *
 *     buffer[0] = 65;
 *
 *
 * Convert:
 *
 *     buffer.toString();
 *
 *
 * Size:
 *
 *     buffer.length;
 *
 *
 * Check:
 *
 *     Buffer.isBuffer(value);
 *
 *
 * Combine:
 *
 *     Buffer.concat([
 *       buffer1,
 *       buffer2
 *     ]);
 *
 *
 * Copy:
 *
 *     Buffer.from(buffer);
 *
 *
 * View:
 *
 *     buffer.subarray(
 *       start,
 *       end
 *     );
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * Buffer = RAW BINARY DATA
 *
 *
 *             Buffer
 *        ┌─────────────────┐
 *        │ 48 │ 65 │ 6C │ 6C │ 6F │
 *        └─────────────────┘
 *          ↓    ↓    ↓    ↓    ↓
 *          H    e    l    l    o
 *
 * ============================================================
 */

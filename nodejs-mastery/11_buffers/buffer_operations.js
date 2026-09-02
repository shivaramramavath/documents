/**
 * ============================================================
 * NODE.JS BUFFERS - BUFFER OPERATIONS
 * ============================================================
 *
 * File:
 *     11_buffers/buffer_operations.js
 *
 * ============================================================
 *
 * This file covers practical Buffer operations:
 *
 *     - Reading bytes
 *     - Writing bytes
 *     - Copying
 *     - Slicing / subarray
 *     - Concatenating
 *     - Comparing
 *     - Searching
 *     - Filling
 *     - Swapping bytes
 *     - Reading/writing integers
 *     - Reading/writing floating-point numbers
 *     - JSON conversion
 *     - Buffer ↔ string conversion
 *
 * ============================================================
 */

const { Buffer } = require("node:buffer");

/*
 * ============================================================
 * 1. Create a Buffer
 * ============================================================
 */

const buffer = Buffer.from("Hello Node.js");

console.log(buffer);

/*
 * ============================================================
 * 2. Buffer length
 * ============================================================
 */

console.log("Length:", buffer.length);

/*
 * length represents the number of BYTES.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Read individual bytes
 * ============================================================
 */

console.log("Byte 0:", buffer[0]);

console.log("Byte 1:", buffer[1]);

/*
 * ============================================================
 * 4. Modify individual bytes
 * ============================================================
 */

const mutableBuffer = Buffer.from("Hello");

mutableBuffer[0] = 74;

console.log(mutableBuffer.toString());

/*
 * 74 represents:
 *
 *     J
 *
 * Result:
 *
 *     Jello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Iterate over bytes
 * ============================================================
 */

for (const byte of buffer) {
  console.log(byte);
}

/*
 * ============================================================
 * 6. Convert Buffer to array
 * ============================================================
 */

const byteArray = Array.from(buffer);

console.log(byteArray);

/*
 * ============================================================
 * 7. Buffer → string
 * ============================================================
 */

console.log(buffer.toString());

console.log(buffer.toString("utf8"));

/*
 * ============================================================
 * 8. Buffer → hexadecimal
 * ============================================================
 */

console.log(buffer.toString("hex"));

/*
 * ============================================================
 * 9. Buffer → Base64
 * ============================================================
 */

console.log(buffer.toString("base64"));

/*
 * ============================================================
 * 10. String → Buffer
 * ============================================================
 */

const textBuffer = Buffer.from("Hello", "utf8");

console.log(textBuffer);

/*
 * ============================================================
 * 11. Buffer.byteLength()
 * ============================================================
 */

console.log(Buffer.byteLength("Hello", "utf8"));

/*
 * ============================================================
 * 12. buffer.write()
 * ============================================================
 *
 * Writes a string into an existing Buffer.
 *
 * ============================================================
 */

const writable = Buffer.alloc(20);

const written = writable.write("Hello");

console.log("Bytes written:", written);

console.log(writable.toString());

/*
 * ============================================================
 * 13. Write at an offset
 * ============================================================
 */

const offsetBuffer = Buffer.alloc(20);

offsetBuffer.write("Node", 5);

console.log(offsetBuffer.toString());

/*
 * Data begins at byte offset 5.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Write with a length limit
 * ============================================================
 */

const limitedBuffer = Buffer.alloc(10);

limitedBuffer.write("Hello World", 0, 5);

console.log(limitedBuffer.toString());

/*
 * Only 5 bytes are written.
 *
 Result:
 *
 *     Hello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Fill a Buffer
 * ============================================================
 */

const filled = Buffer.alloc(10);

filled.fill(65);

console.log(filled.toString());

/*
 * 65 = A
 *
 * Result:
 *
 *     AAAAAAAAAA
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Fill with a string
 * ============================================================
 */

const textFilled = Buffer.alloc(10);

textFilled.fill("X");

console.log(textFilled.toString());

/*
 * ============================================================
 * 17. Fill a range
 * ============================================================
 */

const rangeBuffer = Buffer.alloc(10);

rangeBuffer.fill(1, 2, 6);

console.log(rangeBuffer);

/*
 * Signature:
 *
 *     buffer.fill(
 *       value,
 *       start,
 *       end
 *     );
 *
 * end is exclusive.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. subarray()
 * ============================================================
 *
 * Creates a view over part of a Buffer.
 *
 * It does NOT copy the underlying memory.
 *
 * ============================================================
 */

const original = Buffer.from("Hello World");

const part = original.subarray(0, 5);

console.log(part.toString());

/*
 * Result:
 *
 *     Hello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. subarray() shares memory
 * ============================================================
 */

const source = Buffer.from("Hello");

const view = source.subarray(0, 5);

view[0] = 74;

console.log("Source:", source.toString());

console.log("View:", view.toString());

/*
 * Source becomes:
 *
 *     Jello
 *
 * because both Buffers reference the same memory region.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Create an independent copy
 * ============================================================
 */

const sourceCopy = Buffer.from("Hello");

const independent = Buffer.from(sourceCopy);

independent[0] = 74;

console.log("Original:", sourceCopy.toString());

console.log("Copy:", independent.toString());

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
 * ============================================================
 */

/*
 * ============================================================
 * 21. Buffer.copy()
 * ============================================================
 *
 * Copies bytes from one Buffer into another.
 *
 * ============================================================
 */

const sourceBuffer = Buffer.from("Hello");

const targetBuffer = Buffer.alloc(10);

sourceBuffer.copy(targetBuffer);

console.log(targetBuffer.toString());

/*
 * ============================================================
 * 22. Copy with offsets
 * ============================================================
 */

const sourceData = Buffer.from("Hello");

const destinationData = Buffer.alloc(20);

sourceData.copy(destinationData, 5, 0, 5);

console.log(destinationData.toString());

/*
 * Arguments:
 *
 *     target
 *     targetStart
 *     sourceStart
 *     sourceEnd
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Buffer.concat()
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
 * 24. Buffer.concat() with length
 * ============================================================
 */

const limitedCombined = Buffer.concat(
  [Buffer.from("Hello"), Buffer.from("World")],
  7,
);

console.log(limitedCombined.toString());

/*
 * Only the first 7 bytes are retained.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Compare Buffers
 * ============================================================
 */

const a = Buffer.from("Hello");

const b = Buffer.from("Hello");

console.log(a.equals(b));

/*
 * Result:
 *
 *     true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Compare different Buffers
 * ============================================================
 */

const c = Buffer.from("Hello");

const d = Buffer.from("World");

console.log(c.equals(d));

/*
 * Result:
 *
 *     false
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Buffer.compare()
 * ============================================================
 */

console.log(Buffer.compare(Buffer.from("A"), Buffer.from("B")));

/*
 * Result is negative because "A" comes before "B".
 *
 *
 * Possible results:
 *
 *     < 0
 *     0
 *     > 0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Search using indexOf()
 * ============================================================
 */

const searchable = Buffer.from("Hello Node.js");

console.log(searchable.indexOf("Node"));

/*
 * ============================================================
 * 29. Search for a byte
 * ============================================================
 */

const byteSearch = Buffer.from([10, 20, 30, 40]);

console.log(byteSearch.indexOf(30));

/*
 * Result:
 *
 *     2
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. includes()
 * ============================================================
 */

console.log(searchable.includes("Node"));

console.log(searchable.includes("Python"));

/*
 * ============================================================
 * 31. lastIndexOf()
 * ============================================================
 */

const repeated = Buffer.from("hello hello");

console.log(repeated.lastIndexOf("hello"));

/*
 * ============================================================
 * 32. Read UInt8
 * ============================================================
 */

const numbers = Buffer.from([100, 200]);

console.log(numbers.readUInt8(0));

console.log(numbers.readUInt8(1));

/*
 * ============================================================
 * 33. Write UInt8
 * ============================================================
 */

const uint8 = Buffer.alloc(2);

uint8.writeUInt8(255, 0);

uint8.writeUInt8(100, 1);

console.log(uint8);

/*
 * ============================================================
 * 34. Read UInt16BE
 * ============================================================
 */

const uint16 = Buffer.alloc(2);

uint16.writeUInt16BE(50000, 0);

console.log(uint16.readUInt16BE(0));

/*
 * ============================================================
 * 35. Read UInt16LE
 * ============================================================
 */

const uint16LE = Buffer.alloc(2);

uint16LE.writeUInt16LE(50000, 0);

console.log(uint16LE.readUInt16LE(0));

/*
 * ============================================================
 * 36. Big-endian vs little-endian
 * ============================================================
 */

const endian = Buffer.alloc(4);

endian.writeUInt32BE(0x12345678, 0);

console.log("BE:", endian.toString("hex"));

endian.writeUInt32LE(0x12345678, 0);

console.log("LE:", endian.toString("hex"));

/*
 * BE:
 *
 *     12345678
 *
 *
 * LE:
 *
 *     78563412
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Signed integers
 * ============================================================
 */

const signed = Buffer.alloc(4);

signed.writeInt32BE(-123456, 0);

console.log(signed.readInt32BE(0));

/*
 * ============================================================
 * 38. Floating-point values
 * ============================================================
 */

const float = Buffer.alloc(4);

float.writeFloatBE(3.14, 0);

console.log(float.readFloatBE(0));

/*
 * ============================================================
 * 39. Double values
 * ============================================================
 */

const double = Buffer.alloc(8);

double.writeDoubleLE(123.456, 0);

console.log(double.readDoubleLE(0));

/*
 * ============================================================
 * 40. Swap byte order
 * ============================================================
 *
 * Buffer provides:
 *
 *     swap16()
 *     swap32()
 *     swap64()
 *
 * These are useful when manipulating byte order.
 *
 * ============================================================
 */

const swap16 = Buffer.from([0x12, 0x34, 0x56, 0x78]);

swap16.swap16();

console.log(swap16.toString("hex"));

/*
 * Before:
 *
 *     12 34 56 78
 *
 *
 * After swap16:
 *
 *     34 12 78 56
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. swap32()
 * ============================================================
 */

const swap32 = Buffer.from([0x12, 0x34, 0x56, 0x78]);

swap32.swap32();

console.log(swap32.toString("hex"));

/*
 * Before:
 *
 *     12 34 56 78
 *
 *
 * After:
 *
 *     78 56 34 12
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. JSON representation
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
 * 43. Buffer → JSON → Buffer
 * ============================================================
 */

const originalJsonBuffer = Buffer.from("Node.js");

const json = originalJsonBuffer.toJSON();

const restoredBuffer = Buffer.from(json.data);

console.log(restoredBuffer.toString());

/*
 * ============================================================
 * 44. Check whether a value is a Buffer
 * ============================================================
 */

console.log(Buffer.isBuffer(Buffer.from("Hello")));

console.log(Buffer.isBuffer("Hello"));

/*
 * ============================================================
 * 45. Buffer size
 * ============================================================
 */

const sized = Buffer.alloc(1024);

console.log(sized.length);

/*
 * 1024 bytes = 1 KiB.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. Clear a Buffer
 * ============================================================
 */

const clearable = Buffer.from("Sensitive");

clearable.fill(0);

console.log(clearable);

/*
 * This overwrites the Buffer's bytes with zero.
 *
 IMPORTANT:
 *
 * This does not make all sensitive-data handling universally
 * secure. JavaScript may have other copies of the data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. Buffer.subarray() vs Buffer.copy()
 * ============================================================
 *
 *
 * subarray():
 *
 *     Creates a view.
 *
 *     No byte copy.
 *
 *     Shares memory.
 *
 *
 * copy():
 *
 *     Copies bytes.
 *
 *     Independent memory.
 *
 *
 * Example:
 *
 *
 *     original
 *        │
 *        ├──── subarray
 *        │       ↓
 *        │    same memory
 *        │
 *        └──── copy
 *                ↓
 *           different memory
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. Buffer operations in streams
 * ============================================================
 *
 * Streams frequently provide Buffer chunks:
 *
 *
 *     chunk
 *       ↓
 *     Buffer
 *       ↓
 *     process
 *       ↓
 *     Buffer
 *
 *
 * Example:
 *
 *     readable.on(
 *       "data",
 *       (chunk) => {
 *
 *         console.log(
 *           chunk
 *         );
 *
 *       }
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 49. Buffer operations in HTTP
 * ============================================================
 *
 * Request bodies can arrive as chunks.
 *
 *
 *     HTTP Request
 *           ↓
 *       Buffer chunk
 *           ↓
 *       Buffer chunk
 *           ↓
 *         concat
 *           ↓
 *       complete body
 *
 *
 * Modern applications should also consider streaming instead
 * of buffering large request bodies entirely in memory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. Buffer operations in cryptography
 * ============================================================
 *
 * Node.js crypto APIs frequently work with Buffers.
 *
 *
 * Example:
 *
 *     plaintext
 *        ↓
 *      Buffer
 *        ↓
 *      crypto
 *        ↓
 *    ciphertext
 *
 *
 * This will be covered in:
 *
 *     12_crypto/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 51. Buffer operations in file processing
 * ============================================================
 *
 *
 *     fs.readFile()
 *          ↓
 *        Buffer
 *          ↓
 *       process
 *          ↓
 *     fs.writeFile()
 *
 *
 * For large files, prefer streams rather than loading the
 * entire file into memory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 52. Buffer memory model
 * ============================================================
 *
 *
 * Buffer
 *   │
 *   ├── byte 0
 *   ├── byte 1
 *   ├── byte 2
 *   ├── byte 3
 *   └── ...
 *
 *
 * Operations:
 *
 *     read
 *     write
 *     copy
 *     slice/view
 *     compare
 *     search
 *     fill
 *     concatenate
 *
 * ============================================================
 */

/*
 * ============================================================
 * 53. Most important methods
 * ============================================================
 *
 *
 * Creation:
 *
 *     Buffer.from()
 *     Buffer.alloc()
 *     Buffer.allocUnsafe()
 *
 *
 * Conversion:
 *
 *     toString()
 *     toJSON()
 *
 *
 * Manipulation:
 *
 *     copy()
 *     fill()
 *     subarray()
 *     concat()
 *
 *
 * Search:
 *
 *     indexOf()
 *     lastIndexOf()
 *     includes()
 *
 *
 * Comparison:
 *
 *     equals()
 *     Buffer.compare()
 *
 *
 * Numeric:
 *
 *     readUInt8()
 *     writeUInt8()
 *
 *     readUInt16BE()
 *     writeUInt16BE()
 *
 *     readUInt16LE()
 *     writeUInt16LE()
 *
 *     readUInt32BE()
 *     writeUInt32BE()
 *
 *     readInt32BE()
 *     writeInt32BE()
 *
 *     readFloatBE()
 *     writeFloatBE()
 *
 *     readDoubleBE()
 *     writeDoubleBE()
 *
 *
 * Byte order:
 *
 *     swap16()
 *     swap32()
 *     swap64()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 54. Buffer workflow
 * ============================================================
 *
 *
 * CREATE
 *   ↓
 * Buffer.from()
 *   │
 *   ↓
 * READ / WRITE
 *   │
 *   ├── buffer[index]
 *   ├── readUInt32BE()
 *   └── writeUInt32BE()
 *   │
 *   ↓
 * MANIPULATE
 *   │
 *   ├── copy()
 *   ├── fill()
 *   ├── subarray()
 *   └── concat()
 *   │
 *   ↓
 * CONVERT
 *   │
 *   ├── toString()
 *   ├── hex
 *   └── base64
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
 *     const buffer =
 *       Buffer.from("Hello");
 *
 *
 * Read byte:
 *
 *     buffer[0];
 *
 *
 * Write byte:
 *
 *     buffer[0] = 65;
 *
 *
 * Length:
 *
 *     buffer.length;
 *
 *
 * String:
 *
 *     buffer.toString("utf8");
 *
 *
 * Hex:
 *
 *     buffer.toString("hex");
 *
 *
 * Base64:
 *
 *     buffer.toString("base64");
 *
 *
 * Write string:
 *
 *     buffer.write("Hello");
 *
 *
 * Copy:
 *
 *     source.copy(target);
 *
 *
 * View:
 *
 *     buffer.subarray(
 *       0,
 *       5
 *     );
 *
 *
 * Fill:
 *
 *     buffer.fill(0);
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
 * Search:
 *
 *     buffer.indexOf("Hello");
 *
 *
 * Contains:
 *
 *     buffer.includes("Hello");
 *
 *
 * Compare:
 *
 *     buffer.equals(other);
 *
 *
 * Integer:
 *
 *     buffer.readUInt32BE(0);
 *
 *     buffer.writeUInt32BE(
 *       123,
 *       0
 *     );
 *
 *
 * Float:
 *
 *     buffer.readFloatBE(0);
 *
 *
 * Byte order:
 *
 *     buffer.swap32();
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * Buffer operations are the low-level building blocks behind
 * Node.js file I/O, streams, networking, HTTP bodies,
 * compression, and cryptography.
 *
 * ============================================================
 */

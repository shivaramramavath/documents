/**
 * ============================================================
 * NODE.JS BUFFERS - BINARY DATA
 * ============================================================
 *
 * File:
 *     11_buffers/binary_data.js
 *
 * ============================================================
 *
 * WHAT IS BINARY DATA?
 * ============================================================
 *
 * Computers ultimately store and transfer information as bits:
 *
 *     0
 *     1
 *
 * 8 bits = 1 byte
 *
 *
 * Example:
 *
 *     01001000
 *
 * represents the decimal value:
 *
 *     72
 *
 * which can represent:
 *
 *     "H"
 *
 * ============================================================
 *
 * Buffer is Node.js's primary abstraction for raw bytes.
 *
 *     Buffer
 *       ↓
 *     bytes
 *       ↓
 *     binary data
 *
 * ============================================================
 */

const { Buffer } = require("node:buffer");

/*
 * ============================================================
 * 1. Create binary data
 * ============================================================
 */

const data = Buffer.from([0, 1, 2, 3, 4]);

console.log(data);

/*
 * Output:
 *
 *     <Buffer 00 01 02 03 04>
 *
 * Each value represents one byte.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Byte range
 * ============================================================
 *
 * One byte contains 8 bits.
 *
 * Therefore:
 *
 *     Minimum = 0
 *     Maximum = 255
 *
 * ============================================================
 */

const bytes = Buffer.from([0, 127, 128, 255]);

console.log(bytes);

/*
 * ============================================================
 * 3. Binary representation
 * ============================================================
 */

for (const byte of bytes) {
  console.log(byte.toString(2));
}

/*
 * ============================================================
 * 4. Pad binary values
 * ============================================================
 */

function toBinary(byte) {
  return byte.toString(2).padStart(8, "0");
}

for (const byte of bytes) {
  console.log(toBinary(byte));
}

/*
 * Example:
 *
 *     0   → 00000000
 *     1   → 00000001
 *     2   → 00000010
 *     255 → 11111111
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. ASCII bytes
 * ============================================================
 */

const hello = Buffer.from("Hello");

for (const byte of hello) {
  console.log(byte, toBinary(byte));
}

/*
 * ============================================================
 *
 * H = 72  = 01001000
 * e = 101 = 01100101
 * l = 108 = 01101100
 * l = 108 = 01101100
 * o = 111 = 01101111
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Read a byte
 * ============================================================
 */

const buffer = Buffer.from([10, 20, 30, 40]);

console.log(buffer[0]);

console.log(buffer[2]);

/*
 * ============================================================
 * 7. Modify binary data
 * ============================================================
 */

buffer[0] = 100;

console.log(buffer);

/*
 * ============================================================
 * 8. Bitwise operations
 * ============================================================
 *
 * JavaScript provides bitwise operators for working with
 * individual bits.
 *
 *
 *     &   AND
 *     |   OR
 *     ^   XOR
 *     ~   NOT
 *     <<  left shift
 *     >>  right shift
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. AND
 * ============================================================
 */

const a = 0b1100;

const b = 0b1010;

console.log(a & b);

/*
 * Binary:
 *
 *     1100
 *   & 1010
 *   ------
 *     1000
 *
 * Result:
 *
 *     8
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. OR
 * ============================================================
 */

console.log(a | b);

/*
 *     1100
 *   | 1010
 *   ------
 *     1110
 *
 * Result:
 *
 *     14
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. XOR
 * ============================================================
 */

console.log(a ^ b);

/*
 *     1100
 *   ^ 1010
 *   ------
 *     0110
 *
 * Result:
 *
 *     6
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. NOT
 * ============================================================
 */

console.log(~a);

/*
 * JavaScript bitwise operators work with signed 32-bit
 * integer representations.
 *
 Therefore the result may appear negative.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Left shift
 * ============================================================
 */

const value = 1;

console.log(value << 1);

console.log(value << 2);

/*
 *     1 << 1 = 2
 *
 *     1 << 2 = 4
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Right shift
 * ============================================================
 */

console.log(8 >> 1);

console.log(8 >> 2);

/*
 *     8 >> 1 = 4
 *
 *     8 >> 2 = 2
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Write UInt8
 * ============================================================
 *
 * writeUInt8() writes one unsigned 8-bit integer.
 *
 * Range:
 *
 *     0 → 255
 *
 * ============================================================
 */

const uint8Buffer = Buffer.alloc(4);

uint8Buffer.writeUInt8(255, 0);

uint8Buffer.writeUInt8(100, 1);

console.log(uint8Buffer);

/*
 * ============================================================
 * 16. Read UInt8
 * ============================================================
 */

console.log(uint8Buffer.readUInt8(0));

console.log(uint8Buffer.readUInt8(1));

/*
 * ============================================================
 * 17. Signed 8-bit integer
 * ============================================================
 *
 * Signed 8-bit range:
 *
 *     -128 → 127
 *
 * ============================================================
 */

const int8Buffer = Buffer.alloc(2);

int8Buffer.writeInt8(-100, 0);

int8Buffer.writeInt8(100, 1);

console.log(int8Buffer);

console.log(int8Buffer.readInt8(0));

console.log(int8Buffer.readInt8(1));

/*
 * ============================================================
 * 18. UInt16
 * ============================================================
 *
 * Unsigned 16-bit range:
 *
 *     0 → 65535
 *
 * ============================================================
 */

const uint16Buffer = Buffer.alloc(2);

uint16Buffer.writeUInt16BE(50000, 0);

console.log(uint16Buffer);

console.log(uint16Buffer.readUInt16BE(0));

/*
 * ============================================================
 * 19. UInt16 little-endian
 * ============================================================
 */

const littleEndian = Buffer.alloc(2);

littleEndian.writeUInt16LE(50000, 0);

console.log(littleEndian);

console.log(littleEndian.readUInt16LE(0));

/*
 * ============================================================
 * 20. Big-endian vs Little-endian
 * ============================================================
 *
 * Endianness defines the byte order of multi-byte numbers.
 *
 *
 * Big-endian:
 *
 *     Most significant byte first.
 *
 *
 * Little-endian:
 *
 *     Least significant byte first.
 *
 * ============================================================
 */

const endianBuffer = Buffer.alloc(4);

endianBuffer.writeUInt32BE(0x12345678, 0);

console.log("Big-endian:", endianBuffer);

endianBuffer.writeUInt32LE(0x12345678, 0);

console.log("Little-endian:", endianBuffer);

/*
 * Big-endian:
 *
 *     12 34 56 78
 *
 *
 * Little-endian:
 *
 *     78 56 34 12
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. UInt32
 * ============================================================
 *
 * Unsigned 32-bit range:
 *
 *     0 → 4,294,967,295
 *
 * ============================================================
 */

const uint32Buffer = Buffer.alloc(4);

uint32Buffer.writeUInt32BE(4000000000, 0);

console.log(uint32Buffer);

console.log(uint32Buffer.readUInt32BE(0));

/*
 * ============================================================
 * 22. Signed 32-bit integer
 * ============================================================
 */

const int32Buffer = Buffer.alloc(4);

int32Buffer.writeInt32BE(-123456, 0);

console.log(int32Buffer.readInt32BE(0));

/*
 * ============================================================
 * 23. Floating-point numbers
 * ============================================================
 *
 * Buffers can also store floating-point numbers.
 *
 * ============================================================
 */

const floatBuffer = Buffer.alloc(4);

floatBuffer.writeFloatBE(3.14, 0);

console.log(floatBuffer);

console.log(floatBuffer.readFloatBE(0));

/*
 * ============================================================
 * 24. Double precision
 * ============================================================
 *
 * JavaScript Number uses double-precision floating point.
 *
 * Buffer supports:
 *
 *     writeDoubleBE()
 *     writeDoubleLE()
 *     readDoubleBE()
 *     readDoubleLE()
 *
 * ============================================================
 */

const doubleBuffer = Buffer.alloc(8);

doubleBuffer.writeDoubleLE(123.456, 0);

console.log(doubleBuffer);

console.log(doubleBuffer.readDoubleLE(0));

/*
 * ============================================================
 * 25. DataView-style binary thinking
 * ============================================================
 *
 * A Buffer can contain multiple types of binary fields.
 *
 *
 * Example packet:
 *
 *
 *     Byte 0       → version
 *     Byte 1       → flags
 *     Bytes 2-3    → port
 *     Bytes 4-7    → ID
 *
 * ============================================================
 */

const packet = Buffer.alloc(8);

packet.writeUInt8(1, 0);

packet.writeUInt8(3, 1);

packet.writeUInt16BE(8080, 2);

packet.writeUInt32BE(12345, 4);

console.log("Packet:", packet);

/*
 * Read packet fields:
 */

console.log("Version:", packet.readUInt8(0));

console.log("Flags:", packet.readUInt8(1));

console.log("Port:", packet.readUInt16BE(2));

console.log("ID:", packet.readUInt32BE(4));

/*
 * ============================================================
 * 26. Binary protocol example
 * ============================================================
 *
 * Imagine a custom protocol:
 *
 *
 *     ┌─────────┬─────────┬─────────────┐
 *     │ Version │ Flags   │ Data Length │
 *     │ 1 byte  │ 1 byte  │ 2 bytes     │
 *     └─────────┴─────────┴─────────────┘
 *
 *
 * Buffer lets us construct this packet.
 *
 * ============================================================
 */

const header = Buffer.alloc(4);

header.writeUInt8(1, 0);

header.writeUInt8(0, 1);

header.writeUInt16BE(100, 2);

console.log("Header:", header);

/*
 * ============================================================
 * 27. Buffer and binary files
 * ============================================================
 *
 * Binary files such as:
 *
 *     PNG
 *     JPEG
 *     PDF
 *     ZIP
 *     MP3
 *
 * are sequences of bytes.
 *
 *
 * Node.js can read them into Buffers.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. PNG file signature
 * ============================================================
 *
 * PNG files start with a known 8-byte signature:
 *
 *
 *     89 50 4E 47 0D 0A 1A 0A
 *
 *
 * We can represent it using a Buffer.
 *
 * ============================================================
 */

const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

console.log(pngSignature);

/*
 * ============================================================
 * 29. Binary signature validation
 * ============================================================
 */

const incomingData = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const isPng = incomingData.subarray(0, 8).equals(pngSignature);

console.log("Is PNG:", isPng);

/*
 * This pattern is useful for file-type detection.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. XOR with bytes
 * ============================================================
 *
 * XOR is commonly encountered in low-level binary algorithms.
 *
 * ============================================================
 */

const input = Buffer.from([10, 20, 30]);

const key = 0xff;

const result = Buffer.alloc(input.length);

for (let index = 0; index < input.length; index++) {
  result[index] = input[index] ^ key;
}

console.log("XOR result:", result);

/*
 * IMPORTANT:
 *
 * XOR alone is NOT a secure encryption algorithm.
 *
 * Real cryptography should use Node.js's crypto module and
 * established cryptographic algorithms.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Binary data from hexadecimal
 * ============================================================
 */

const binary = Buffer.from("deadbeef", "hex");

console.log(binary);

/*
 * ============================================================
 * 32. Inspect hexadecimal
 * ============================================================
 */

console.log(binary.toString("hex"));

/*
 * ============================================================
 * 33. Check individual bits
 * ============================================================
 */

const flags = 0b00000101;

/*
 * Bit 0:
 */

const bit0 = Boolean(flags & 0b00000001);

/*
 * Bit 1:
 */

const bit1 = Boolean(flags & 0b00000010);

/*
 * Bit 2:
 */

const bit2 = Boolean(flags & 0b00000100);

console.log({
  bit0,
  bit1,
  bit2,
});

/*
 * ============================================================
 * 34. Bit flags
 * ============================================================
 *
 * A single byte can store multiple boolean flags.
 *
 *
 *     00000101
 *     ││││││││
 *     │││││││└─ flag 0 = true
 *     ││││││└── flag 1 = false
 *     │││││└─── flag 2 = true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Set a bit
 * ============================================================
 */

let bitFlags = 0;

bitFlags |= 1 << 0;

bitFlags |= 1 << 2;

console.log(bitFlags);

/*
 * Result:
 *
 *     00000101
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Clear a bit
 * ============================================================
 */

bitFlags &= ~(1 << 2);

console.log(bitFlags);

/*
 * ============================================================
 * 37. Toggle a bit
 * ============================================================
 */

bitFlags ^= 1 << 1;

console.log(bitFlags);

/*
 * ============================================================
 * 38. Buffer and streams
 * ============================================================
 *
 * Streams often deliver data in chunks.
 *
 *
 * Example:
 *
 *     Chunk 1:
 *     <Buffer ...>
 *
 *     Chunk 2:
 *     <Buffer ...>
 *
 *     Chunk 3:
 *     <Buffer ...>
 *
 *
 * The chunks together represent the complete data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Buffer chunk example
 * ============================================================
 */

const chunk1 = Buffer.from("Hello ");

const chunk2 = Buffer.from("World");

const complete = Buffer.concat([chunk1, chunk2]);

console.log(complete.toString());

/*
 * ============================================================
 * 40. Important binary methods
 * ============================================================
 *
 *
 * Unsigned:
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
 *     readUInt32LE()
 *     writeUInt32LE()
 *
 *
 * Signed:
 *
 *     readInt8()
 *     writeInt8()
 *
 *     readInt16BE()
 *     writeInt16BE()
 *
 *     readInt32BE()
 *     writeInt32BE()
 *
 *
 * Floating point:
 *
 *     readFloatBE()
 *     writeFloatBE()
 *
 *     readDoubleBE()
 *     writeDoubleBE()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Binary data architecture
 * ============================================================
 *
 *
 *             Application
 *                  │
 *                  ↓
 *             JavaScript
 *                  │
 *                  ↓
 *               Buffer
 *                  │
 *        ┌─────────┼─────────┐
 *        ↓         ↓         ↓
 *      File      Network   Crypto
 *        │         │         │
 *        └─────────┼─────────┘
 *                  ↓
 *              Raw Bytes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Real-world use cases
 * ============================================================
 *
 *
 * File processing
 *
 *     Read binary files
 *
 *
 * Network protocols
 *
 *     Parse packet fields
 *
 *
 * Image processing
 *
 *     Read/write image bytes
 *
 *
 * Cryptography
 *
 *     Hashes, keys, ciphertext
 *
 *
 * Compression
 *
 *     Compressed byte streams
 *
 *
 * Database drivers
 *
 *     Binary fields
 *
 *
 * WebSockets
 *
 *     Binary messages
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Important distinction
 * ============================================================
 *
 *
 * Text:
 *
 *     "Hello"
 *
 *
 * Binary:
 *
 *     48 65 6c 6c 6f
 *
 *
 * The same underlying data can be represented differently.
 *
 *
 *     Text
 *       ↓
 *     Encoding
 *       ↓
 *     Bytes
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * Create binary data:
 *
 *     Buffer.from([
 *       1,
 *       2,
 *       3
 *     ]);
 *
 *
 * Read byte:
 *
 *     buffer[0];
 *
 *
 * Modify byte:
 *
 *     buffer[0] = 255;
 *
 *
 * Binary:
 *
 *     byte.toString(2);
 *
 *
 * Hex:
 *
 *     buffer.toString("hex");
 *
 *
 * UInt8:
 *
 *     buffer.readUInt8(offset);
 *
 *
 *     buffer.writeUInt8(
 *       value,
 *       offset
 *     );
 *
 *
 * UInt16:
 *
 *     buffer.readUInt16BE(offset);
 *
 *     buffer.writeUInt16BE(
 *       value,
 *       offset
 *     );
 *
 *
 * UInt32:
 *
 *     buffer.readUInt32BE(offset);
 *
 *     buffer.writeUInt32BE(
 *       value,
 *       offset
 *     );
 *
 *
 * Float:
 *
 *     buffer.readFloatBE(offset);
 *
 *
 * Double:
 *
 *     buffer.readDoubleBE(offset);
 *
 *
 * Compare:
 *
 *     buffer.equals(other);
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * Buffer allows Node.js to work directly with BYTES.
 *
 *
 *     8 bits
 *       ↓
 *     1 byte
 *       ↓
 *     Buffer
 *       ↓
 *     Binary data
 *
 *
 * Once you understand:
 *
 *     bytes
 *     bits
 *     encoding
 *     endianness
 *     integers
 *     floating point
 *     binary protocols
 *
 * you can understand how Node.js handles files, networking,
 * streams, cryptography, and other low-level operations.
 *
 * ============================================================
 */

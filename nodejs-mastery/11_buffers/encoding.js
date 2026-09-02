/**
 * ============================================================
 * NODE.JS BUFFERS - ENCODING
 * ============================================================
 *
 * File:
 *     11_buffers/encoding.js
 *
 * ============================================================
 *
 * WHAT IS ENCODING?
 * ============================================================
 *
 * Encoding defines how data is represented as bytes.
 *
 * A JavaScript string:
 *
 *     "Hello"
 *
 * must be converted into bytes before it can be:
 *
 *     - written to a file
 *     - sent over a network
 *     - stored as binary data
 *     - processed by a Buffer
 *
 *
 * Example:
 *
 *     "A"
 *       ↓
 *     UTF-8
 *       ↓
 *     65
 *
 * ============================================================
 *
 * Common Node.js Buffer encodings:
 *
 *     utf8
 *     utf-8
 *     ascii
 *     latin1
 *     base64
 *     base64url
 *     hex
 *     ucs2
 *     ucs-2
 *     utf16le
 *
 * ============================================================
 */

const { Buffer } = require("node:buffer");

/*
 * ============================================================
 * 1. UTF-8
 * ============================================================
 *
 * UTF-8 is the default encoding used by Buffer.
 *
 * It supports Unicode characters.
 *
 * ============================================================
 */

const utf8Buffer = Buffer.from("Hello", "utf8");

console.log("UTF-8 Buffer:", utf8Buffer);

console.log("UTF-8 String:", utf8Buffer.toString("utf8"));

/*
 * The following are equivalent:
 *
 *     Buffer.from("Hello")
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
 * 2. ASCII
 * ============================================================
 *
 * ASCII represents basic characters using byte values.
 *
 * Standard ASCII:
 *
 *     0 → 127
 *
 * Node.js's "ascii" Buffer encoding has specific behavior for
 * bytes above the standard ASCII range, so for modern text
 * processing prefer UTF-8.
 *
 * ============================================================
 */

const asciiBuffer = Buffer.from("Hello", "ascii");

console.log(asciiBuffer);

console.log(asciiBuffer.toString("ascii"));

/*
 * ============================================================
 * 3. UTF-8 with Unicode
 * ============================================================
 */

const unicodeText = "Hello 😊";

const unicodeBuffer = Buffer.from(unicodeText, "utf8");

console.log("Text:", unicodeText);

console.log("Buffer:", unicodeBuffer);

console.log("Byte length:", unicodeBuffer.length);

/*
 * IMPORTANT:
 *
 * JavaScript string length is NOT necessarily the same as
 * UTF-8 byte length.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. String length vs byte length
 * ============================================================
 */

const emoji = "😊";

console.log("String length:", emoji.length);

console.log("UTF-8 byte length:", Buffer.byteLength(emoji, "utf8"));

/*
 * An emoji is represented using multiple UTF-8 bytes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Hex encoding
 * ============================================================
 *
 * Hexadecimal represents each byte using two hexadecimal
 * characters.
 *
 *
 *     00 → FF
 *
 * Example:
 *
 *     H = 48
 *
 *     e = 65
 *
 *     l = 6c
 *
 * ============================================================
 */

const hexBuffer = Buffer.from("Hello", "utf8");

const hex = hexBuffer.toString("hex");

console.log("Hex:", hex);

/*
 * ============================================================
 * 6. Hex → Buffer
 * ============================================================
 */

const fromHex = Buffer.from("48656c6c6f", "hex");

console.log(fromHex.toString("utf8"));

/*
 * Result:
 *
 *     Hello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Base64
 * ============================================================
 *
 * Base64 represents binary data using printable characters.
 *
 * It is commonly used for:
 *
 *     - APIs
 *     - Data URLs
 *     - Authentication-related encoding
 *     - Transmitting binary data as text
 *
 * IMPORTANT:
 *
 * Base64 is encoding, NOT encryption.
 *
 * ============================================================
 */

const base64Source = Buffer.from("Hello");

const base64 = base64Source.toString("base64");

console.log("Base64:", base64);

/*
 * ============================================================
 * 8. Base64 → Buffer
 * ============================================================
 */

const fromBase64 = Buffer.from(base64, "base64");

console.log(fromBase64.toString());

/*
 * ============================================================
 * 9. Base64 example
 * ============================================================
 */

const message = "Node.js Buffer";

const encoded = Buffer.from(message).toString("base64");

const decoded = Buffer.from(encoded, "base64").toString("utf8");

console.log("Original:", message);

console.log("Encoded:", encoded);

console.log("Decoded:", decoded);

/*
 * ============================================================
 * 10. Base64URL
 * ============================================================
 *
 * Base64URL is a URL-safe variant of Base64.
 *
 * It uses characters suitable for URLs.
 *
 * Commonly encountered in:
 *
 *     JWT
 *     URLs
 *     Web-safe tokens
 *
 * ============================================================
 */

const base64UrlBuffer = Buffer.from("Hello World!");

const base64Url = base64UrlBuffer.toString("base64url");

console.log("Base64URL:", base64Url);

console.log(Buffer.from(base64Url, "base64url").toString());

/*
 * ============================================================
 * 11. Base64 vs Base64URL
 * ============================================================
 *
 *
 * Base64:
 *
 *     + /
 *
 *
 * Base64URL:
 *
 *     - _
 *
 *
 * Base64URL avoids characters that can have special meaning
 * in URLs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Latin-1
 * ============================================================
 *
 * latin1 is an 8-bit character encoding.
 *
 * It maps byte values:
 *
 *     0 → 255
 *
 * to characters.
 *
 * Node.js also accepts "binary" as an alias for latin1.
 *
 * ============================================================
 */

const latinBuffer = Buffer.from("Hello", "latin1");

console.log(latinBuffer);

console.log(latinBuffer.toString("latin1"));

/*
 * ============================================================
 * 13. UTF-16LE
 * ============================================================
 *
 * Node.js calls this encoding:
 *
 *     utf16le
 *
 * It is also known as:
 *
 *     ucs2
 *     ucs-2
 *
 * ============================================================
 */

const utf16Buffer = Buffer.from("Hello", "utf16le");

console.log("UTF-16LE Buffer:", utf16Buffer);

console.log("UTF-16LE Text:", utf16Buffer.toString("utf16le"));

/*
 * ============================================================
 * 14. UTF-16LE byte size
 * ============================================================
 */

console.log("UTF-16LE bytes:", utf16Buffer.length);

/*
 * For basic characters, UTF-16LE generally uses 2 bytes per
 * code unit.
 *
 ============================================================
 */

/*
 * ============================================================
 * 15. Encoding conversion
 * ============================================================
 *
 *
 * UTF-8
 *   ↓
 * Buffer
 *   ↓
 * Base64
 *
 * ============================================================
 */

const originalText = "Hello Node.js";

const buffer = Buffer.from(originalText, "utf8");

const encodedBase64 = buffer.toString("base64");

console.log("Base64:", encodedBase64);

const restoredText = Buffer.from(encodedBase64, "base64").toString("utf8");

console.log("Restored:", restoredText);

/*
 * ============================================================
 * 16. UTF-8 → Hex → UTF-8
 * ============================================================
 */

const text = "Node";

const textBuffer = Buffer.from(text, "utf8");

const hexadecimal = textBuffer.toString("hex");

const restored = Buffer.from(hexadecimal, "hex").toString("utf8");

console.log("Original:", text);

console.log("Hex:", hexadecimal);

console.log("Restored:", restored);

/*
 * ============================================================
 * 17. Buffer.byteLength()
 * ============================================================
 *
 * Calculates the number of bytes required by a string using
 * a specific encoding.
 * ============================================================
 */

console.log(Buffer.byteLength("Hello", "utf8"));

console.log(Buffer.byteLength("Hello", "utf16le"));

/*
 * ============================================================
 * 18. Different encodings can have different byte sizes
 * ============================================================
 */

const value = "Hello";

console.log("UTF-8:", Buffer.byteLength(value, "utf8"));

console.log("UTF-16LE:", Buffer.byteLength(value, "utf16le"));

console.log("Latin1:", Buffer.byteLength(value, "latin1"));

/*
 * ============================================================
 * 19. Buffer.isEncoding()
 * ============================================================
 *
 * Check whether Node.js supports a particular encoding name.
 * ============================================================
 */

console.log(Buffer.isEncoding("utf8"));

console.log(Buffer.isEncoding("base64"));

console.log(Buffer.isEncoding("hex"));

console.log(Buffer.isEncoding("unknown"));

/*
 * ============================================================
 * 20. Case of encoding names
 * ============================================================
 *
 * Encoding names are generally handled case-insensitively.
 * ============================================================
 */

console.log(Buffer.isEncoding("UTF8"));

console.log(Buffer.isEncoding("Base64"));

/*
 * ============================================================
 * 21. Partial hex input
 * ============================================================
 *
 * Hex encoding expects pairs of hexadecimal digits per byte.
 *
 * ============================================================
 */

const partialHex = Buffer.from("48656c", "hex");

console.log(partialHex.toString());

/*
 * ============================================================
 * 22. Invalid hex characters
 * ============================================================
 *
 * Be careful when decoding external input.
 *
 * Always validate data when the encoding is part of a protocol
 * or security-sensitive operation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Encoding and files
 * ============================================================
 *
 * When reading a text file:
 *
 *
 *     const fs =
 *       require("node:fs");
 *
 *
 *     const data =
 *       fs.readFileSync(
 *         "./file.txt",
 *         "utf8"
 *       );
 *
 *
 * You get a string.
 *
 *
 * Without encoding:
 *
 *
 *     const data =
 *       fs.readFileSync(
 *         "./file.txt"
 *       );
 *
 *
 * You get a Buffer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Encoding and HTTP
 * ============================================================
 *
 * HTTP data often arrives as bytes.
 *
 *
 *     Network
 *        ↓
 *     Buffer
 *        ↓
 *     UTF-8
 *        ↓
 *     String
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Encoding and JSON
 * ============================================================
 *
 * JSON is text.
 *
 * A Buffer may contain JSON bytes.
 *
 * ============================================================
 */

const jsonText = JSON.stringify({
  id: 1,

  name: "Shiva",
});

const jsonBuffer = Buffer.from(jsonText, "utf8");

const parsed = JSON.parse(jsonBuffer.toString("utf8"));

console.log(parsed);

/*
 * ============================================================
 * 26. Encoding and binary files
 * ============================================================
 *
 * DO NOT convert arbitrary binary files to UTF-8 strings.
 *
 *
 * Example:
 *
 *     image.png
 *
 *
 * should generally remain:
 *
 *     Buffer
 *
 *
 * rather than:
 *
 *     Buffer → UTF-8 string → Buffer
 *
 *
 * because arbitrary binary data is not necessarily valid text.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Encoding and streams
 * ============================================================
 *
 * Streams can convert Buffer chunks into strings.
 *
 *
 *     stream.setEncoding("utf8");
 *
 *
 * Example:
 *
 *     readable.setEncoding(
 *       "utf8"
 *     );
 *
 *
 * The readable stream then emits strings instead of Buffer
 * chunks.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. setEncoding()
 * ============================================================
 */

const { Readable } = require("node:stream");

const readable = Readable.from(["Hello ", "Node.js ", "Encoding"]);

readable.setEncoding("utf8");

readable.on("data", (chunk) => {
  console.log("Chunk:", chunk);
});

/*
 * ============================================================
 * 29. Encoding errors
 * ============================================================
 *
 * Invalid or incorrectly decoded data can produce unexpected
 * results.
 *
 *
 * Always know:
 *
 *     What encoding produced the bytes?
 *
 *
 * Example:
 *
 *     UTF-8 bytes
 *          ↓
 *     decode as UTF-8
 *
 *
 * not:
 *
 *     UTF-8 bytes
 *          ↓
 *     decode as unrelated encoding
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Important concept
 * ============================================================
 *
 *
 * Encoding:
 *
 *     String → Bytes
 *
 *
 * Decoding:
 *
 *     Bytes → String
 *
 *
 * Example:
 *
 *
 * Encoding:
 *
 *     "Hello"
 *        ↓
 *     Buffer.from()
 *        ↓
 *     bytes
 *
 *
 * Decoding:
 *
 *     bytes
 *        ↓
 *     buffer.toString()
 *        ↓
 *     "Hello"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Encoding pipeline
 * ============================================================
 *
 *
 *         String
 *            │
 *            │ encode
 *            ↓
 *          Buffer
 *            │
 *            │ decode
 *            ↓
 *         String
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Encoding vs encryption
 * ============================================================
 *
 *
 * Encoding:
 *
 *     Changes representation.
 *
 *     Easily reversible.
 *
 *
 * Encryption:
 *
 *     Protects confidentiality.
 *
 *     Requires cryptographic algorithms and keys.
 *
 *
 * Example:
 *
 *     Base64
 *
 * is NOT encryption.
 *
 *
 * Anyone can decode Base64.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Encoding vs hashing
 * ============================================================
 *
 *
 * Encoding:
 *
 *     reversible
 *
 *
 * Hashing:
 *
 *     one-way by design
 *
 *
 * Example:
 *
 *     Base64 → reversible
 *
 *     SHA-256 → cryptographic hash
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Common Node.js encodings
 * ============================================================
 *
 *
 * utf8
 *
 *     Standard Unicode text encoding.
 *
 *
 * ascii
 *
 *     ASCII-compatible encoding.
 *
 *
 * latin1
 *
 *     8-bit byte-oriented text encoding.
 *
 *
 * base64
 *
 *     Binary → printable text.
 *
 *
 * base64url
 *
 *     URL-safe Base64 representation.
 *
 *
 * hex
 *
 *     Binary → hexadecimal text.
 *
 *
 * utf16le
 *
 *     Little-endian UTF-16.
 *
 *
 * ucs2 / ucs-2
 *
 *     Alias for utf16le.
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * String → Buffer:
 *
 *     Buffer.from(
 *       "Hello",
 *       "utf8"
 *     );
 *
 *
 * Buffer → String:
 *
 *     buffer.toString(
 *       "utf8"
 *     );
 *
 *
 * UTF-8 → Hex:
 *
 *     buffer.toString(
 *       "hex"
 *     );
 *
 *
 * Hex → Buffer:
 *
 *     Buffer.from(
 *       hex,
 *       "hex"
 *     );
 *
 *
 * Buffer → Base64:
 *
 *     buffer.toString(
 *       "base64"
 *     );
 *
 *
 * Base64 → Buffer:
 *
 *     Buffer.from(
 *       base64,
 *       "base64"
 *     );
 *
 *
 * Buffer → Base64URL:
 *
 *     buffer.toString(
 *       "base64url"
 *     );
 *
 *
 * Base64URL → Buffer:
 *
 *     Buffer.from(
 *       value,
 *       "base64url"
 *     );
 *
 *
 * Byte length:
 *
 *     Buffer.byteLength(
 *       text,
 *       "utf8"
 *     );
 *
 *
 * Check encoding:
 *
 *     Buffer.isEncoding(
 *       "utf8"
 *     );
 *
 *
 * Stream encoding:
 *
 *     readable.setEncoding(
 *       "utf8"
 *     );
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * ENCODING
 *
 *     Human-readable text
 *             ↓
 *         Encoding
 *             ↓
 *          Bytes
 *
 *
 * DECODING
 *
 *          Bytes
 *             ↓
 *         Encoding
 *             ↓
 *     Human-readable text
 *
 * ============================================================
 */

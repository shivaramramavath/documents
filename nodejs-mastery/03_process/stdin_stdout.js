/**
 * ============================================================
 * Node.js Process - stdin, stdout, stderr
 * ============================================================
 *
 * File: stdin_stdout.js
 *
 * Topics:
 *
 *     process.stdin
 *     process.stdout
 *     process.stderr
 *
 * ============================================================
 *
 * Node.js provides three standard streams:
 *
 *     stdin   -> input
 *     stdout  -> normal output
 *     stderr  -> error output
 *
 *
 * Think of it like:
 *
 *
 *             TERMINAL
 *                │
 *          ┌─────┴─────┐
 *          ▼           ▼
 *       stdin        stdout
 *       input        output
 *
 *                     +
 *
 *                   stderr
 *                 error output
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. process.stdout
 * ============================================================
 *
 * `process.stdout` represents standard output.
 *
 * It is a writable stream.
 *
 * You can write directly to it:
 */

process.stdout.write("Hello from stdout!\n");

/*
 * `\n` means newline.
 *
 *
 * Compare:
 *
 *     console.log("Hello");
 *
 * with:
 *
 *     process.stdout.write("Hello\n");
 *
 *
 * Both produce output, but process.stdout.write() gives you
 * lower-level control over the output stream.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. console.log vs process.stdout.write
 * ============================================================
 */

console.log("Hello using console.log");

process.stdout.write("Hello using stdout\n");

/*
 * `console.log()` automatically adds a newline.
 *
 * `process.stdout.write()` does NOT automatically add one.
 *
 *
 * Example:
 *
 *
 *     process.stdout.write("A");
 *     process.stdout.write("B");
 *
 *
 * Output:
 *
 *
 *     AB
 *
 *
 * Whereas:
 *
 *
 *     console.log("A");
 *     console.log("B");
 *
 *
 * Output:
 *
 *
 *     A
 *     B
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. process.stderr
 * ============================================================
 *
 * `process.stderr` is the standard error stream.
 *
 * Use it for errors and diagnostic output.
 * ============================================================
 */

process.stderr.write("This is an error message.\n");

/*
 * Equivalent higher-level API:
 *
 *
 *     console.error("This is an error");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. stdout vs stderr
 * ============================================================
 *
 *
 * stdout
 *
 *     Normal program output.
 *
 *
 * stderr
 *
 *     Errors, warnings, diagnostics.
 *
 *
 * Keeping them separate is useful because operating systems
 * and shell tools can redirect them independently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. process.stdin
 * ============================================================
 *
 * `process.stdin` represents standard input.
 *
 * It is a readable stream.
 *
 * It allows Node.js programs to receive data from:
 *
 *     - Keyboard
 *     - Piped commands
 *     - Other processes
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Reading stdin
 * ============================================================
 *
 * The simplest way to read stdin is using the "data" event.
 *
 *
 * IMPORTANT:
 *
 * Uncomment the following example when you want to test it.
 *
 * ============================================================
 */

/*
process.stdin.on(
  "data",
  (data) => {

    console.log(
      "Received:",
      data.toString(),
    );

  },
);
*/

/*
 * Run:
 *
 *
 *     node stdin_stdout.js
 *
 *
 * Then type:
 *
 *
 *     Hello
 *
 *
 * and press Enter.
 *
 *
 * Node receives the input as a Buffer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Buffer to string
 * ============================================================
 *
 * stdin data commonly arrives as a Buffer.
 *
 *
 * Example:
 *
 *
 *     data.toString()
 *
 *
 * converts it to a string.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. The "data" event
 * ============================================================
 *
 * stdin is a stream.
 *
 * Streams can receive data in chunks.
 *
 *
 * Therefore:
 *
 *
 *     "data"
 *
 *
 * does NOT necessarily mean:
 *
 *
 *     one complete user message
 *
 *
 * It means:
 *
 *
 *     a chunk of data is available.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. The "end" event
 * ============================================================
 *
 * A readable stream can emit:
 *
 *
 *     end
 *
 *
 * when there is no more input.
 *
 *
 * Example:
 *
 *
 * process.stdin.on(
 *   "end",
 *   () => {
 *     console.log("Input ended.");
 *   },
 * );
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. stdin.setEncoding()
 * ============================================================
 *
 * Instead of receiving Buffers, you can configure stdin to
 * provide strings.
 *
 *
 * Example:
 *
 *
 * process.stdin.setEncoding("utf8");
 *
 *
 * Then:
 *
 *
 * process.stdin.on(
 *   "data",
 *   (data) => {
 *     console.log(data);
 *   },
 * );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Basic interactive program
 * ============================================================
 *
 * Here is a simple example:
 *
 *
 * Uncomment this block to run it.
 *
 * ============================================================
 */

/*
process.stdout.write(
  "Enter your name: ",
);


process.stdin.setEncoding(
  "utf8",
);


process.stdin.once(
  "data",
  (data) => {

    const name =
      data.trim();

    process.stdout.write(
      `Hello, ${name}!\n`,
    );

    process.stdin.pause();

  },
);
*/

/*
 * Why `.once()`?
 *
 * We only want to process the first input.
 *
 *
 * Why `.trim()`?
 *
 * When you press Enter, the input normally contains a newline.
 *
 * For example:
 *
 *
 *     "Shiva\n"
 *
 *
 * `.trim()` produces:
 *
 *
 *     "Shiva"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. stdin.pause()
 * ============================================================
 *
 * `pause()` tells the readable stream to stop flowing data.
 *
 * This is useful when your program has finished reading input.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. stdin.resume()
 * ============================================================
 *
 * `resume()` allows the stream to continue flowing.
 *
 * It can be used when you explicitly want stdin to remain active.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Interactive question function
 * ============================================================
 *
 * Let's build a small reusable function.
 *
 * ============================================================
 */

/*
function question(message) {

  return new Promise(
    (resolve) => {

      process.stdout.write(
        message,
      );

      process.stdin.once(
        "data",
        (data) => {

          resolve(
            data
              .toString()
              .trim(),
          );

        },
      );

    },
  );

}
*/

/*
 * You could then use it with async/await:
 *
 *
 * async function main() {
 *
 *   const name =
 *     await question(
 *       "Name: ",
 *     );
 *
 *   console.log(
 *     `Hello ${name}`,
 *   );
 *
 * }
 *
 *
 * main();
 *
 *
 * This is the foundation of simple CLI programs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. readline module
 * ============================================================
 *
 * Node.js provides a higher-level API for terminal input:
 *
 *
 *     node:readline
 *
 *
 * It is much easier than manually handling stdin events.
 *
 * ============================================================
 */

/*
 * Import readline:
 *
 *
 *     const readline =
 *       require("node:readline");
 *
 *
 * If your project uses ESM:
 *
 *
 *     import readline from "node:readline";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. readline interface
 * ============================================================
 *
 * Example:
 *
 *
 *     const readline =
 *       require("node:readline");
 *
 *
 *     const rl =
 *       readline.createInterface({
 *
 *         input:
 *           process.stdin,
 *
 *         output:
 *           process.stdout,
 *
 *       });
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. readline.question()
 * ============================================================
 *
 * Example:
 *
 *
 *     rl.question(
 *
 *       "What is your name? ",
 *
 *       (answer) => {
 *
 *         console.log(
 *           `Hello ${answer}`,
 *         );
 *
 *         rl.close();
 *
 *       },
 *
 *     );
 *
 *
 * `rl.close()` closes the readline interface.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Complete readline example
 * ============================================================
 *
 * This is the recommended beginner approach for interactive
 * terminal programs.
 *
 * ============================================================
 */

/*
const readline =
  require("node:readline");


const rl =
  readline.createInterface({

    input:
      process.stdin,

    output:
      process.stdout,

  });


rl.question(
  "Enter your name: ",
  (name) => {

    console.log(
      `Hello, ${name}!`,
    );

    rl.close();

  },
);
*/

/*
 * Run:
 *
 *
 *     node stdin_stdout.js
 *
 *
 * Then enter:
 *
 *
 *     Shiva
 *
 *
 * Output:
 *
 *
 *     Hello, Shiva!
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Multiple questions
 * ============================================================
 *
 * Example:
 *
 *
 * const readline =
 *   require("node:readline");
 *
 *
 * const rl =
 *   readline.createInterface({
 *     input: process.stdin,
 *     output: process.stdout,
 *   });
 *
 *
 * rl.question(
 *   "Name: ",
 *   (name) => {
 *
 *     rl.question(
 *       "Age: ",
 *       (age) => {
 *
 *         console.log({
 *           name,
 *           age,
 *         });
 *
 *         rl.close();
 *
 *       },
 *     );
 *
 *   },
 * );
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. stdout.write() and backpressure
 * ============================================================
 *
 * stdout is a writable stream.
 *
 * `.write()` returns a boolean.
 *
 *
 * Example:
 *
 *
 *     const canContinue =
 *       process.stdout.write(
 *         "Hello\n",
 *       );
 *
 *
 * If `write()` returns false, the writable stream is asking
 * the producer to slow down because its internal buffer is full.
 *
 * This concept is called:
 *
 *
 *     BACKPRESSURE
 *
 *
 * We will study backpressure deeply in:
 *
 *
 *     10_streams/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Piping stdin to stdout
 * ============================================================
 *
 * Because stdin and stdout are streams, they can be connected.
 *
 *
 * Example:
 *
 *
 *     process.stdin.pipe(
 *       process.stdout,
 *     );
 *
 *
 * This means:
 *
 *
 *     stdin
 *       │
 *       ▼
 *     stdout
 *
 *
 * Whatever comes into stdin is written to stdout.
 *
 *
 * Try:
 *
 *
 *     node stdin_stdout.js
 *
 *
 * after uncommenting the pipe example.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Pipe example
 * ============================================================
 */

/*
process.stdin.pipe(
  process.stdout,
);
*/

/*
 * This is a very important Node.js concept.
 *
 * Streams allow data to flow without requiring the entire
 * dataset to be loaded into memory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Shell piping
 * ============================================================
 *
 * Operating systems also allow processes to communicate using
 * pipes.
 *
 *
 * Example:
 *
 *
 *     echo hello | node stdin_stdout.js
 *
 *
 * Conceptually:
 *
 *
 *     echo
 *       │
 *       │ stdout
 *       ▼
 *     node
 *       │
 *       │ stdin
 *       ▼
 *     JavaScript program
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. stderr example
 * ============================================================
 */

function reportError(message) {
  process.stderr.write(`ERROR: ${message}\n`);
}

reportError("Something went wrong.");

/*
 * ============================================================
 * 25. stdout and stderr redirection
 * ============================================================
 *
 * Shells can redirect streams separately.
 *
 *
 * Conceptually:
 *
 *
 *     stdout -> normal output
 *     stderr -> errors
 *
 *
 * This allows production systems to process logs differently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Checking whether stdin is a terminal
 * ============================================================
 *
 * `isTTY` can tell you whether a stream is attached to a
 * terminal.
 *
 *
 * Example:
 */

console.log("stdin is TTY:", process.stdin.isTTY);

/*
 * If stdin comes from a pipe/file, this may be false or
 * undefined depending on the environment.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. stdout isTTY
 * ============================================================
 */

console.log("stdout is TTY:", process.stdout.isTTY);

/*
 * CLI applications sometimes use this to determine whether
 * they are running interactively.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Standard streams architecture
 * ============================================================
 *
 *
 *                    Node.js Process
 *
 *              ┌─────────┼─────────┐
 *              │         │         │
 *              ▼         ▼         ▼
 *           stdin     stdout     stderr
 *              │         │         │
 *              ▼         ▼         ▼
 *            Input     Output     Errors
 *
 *
 * stdin:
 *     Readable stream
 *
 * stdout:
 *     Writable stream
 *
 * stderr:
 *     Writable stream
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Real-world backend usage
 * ============================================================
 *
 * stdin/stdout/stderr are used heavily in:
 *
 *     - CLI applications
 *     - Docker containers
 *     - CI/CD pipelines
 *     - Linux services
 *     - Process managers
 *     - Shell scripts
 *     - Child processes
 *
 *
 * For example, Dockerized Node applications commonly write
 * application logs to stdout/stderr so the container platform
 * can collect them.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. console.log internally uses streams
 * ============================================================
 *
 * The Node.js console system ultimately writes output through
 * the process output streams.
 *
 *
 * Therefore:
 *
 *
 *     console.log()
 *
 *
 * is a convenient high-level API, while:
 *
 *
 *     process.stdout.write()
 *
 *
 * gives more direct control.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Important distinction: input is streamed
 * ============================================================
 *
 * Do NOT assume:
 *
 *
 *     one "data" event = one line
 *
 *
 * Streams deal with chunks.
 *
 *
 * If you need:
 *
 *
 *     line-by-line terminal input
 *
 *
 * use:
 *
 *
 *     node:readline
 *
 *
 * If you need:
 *
 *
 *     raw streaming data
 *
 *
 * use:
 *
 *
 *     process.stdin
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Common mistakes
 * ============================================================
 *
 *
 * ❌ Mistake 1:
 *
 *     process.stdin.on("data", ...)
 *
 *     assuming every chunk is a complete message.
 *
 *
 * ❌ Mistake 2:
 *
 *     Forgetting `.trim()` when processing terminal lines.
 *
 *
 * ❌ Mistake 3:
 *
 *     Forgetting to close readline.
 *
 *
 * ❌ Mistake 4:
 *
 *     Writing huge amounts of data without understanding
 *     backpressure.
 *
 *
 * ❌ Mistake 5:
 *
 *     Logging sensitive information to stdout/stderr.
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * INPUT:
 *
 *     process.stdin
 *
 *
 * OUTPUT:
 *
 *     process.stdout
 *
 *
 * ERRORS:
 *
 *     process.stderr
 *
 *
 * WRITE:
 *
 *     process.stdout.write("Hello\n");
 *
 *
 * ERROR:
 *
 *     process.stderr.write("Error\n");
 *
 *
 * READ:
 *
 *     process.stdin.on("data", callback);
 *
 *
 * END:
 *
 *     process.stdin.on("end", callback);
 *
 *
 * PIPE:
 *
 *     process.stdin.pipe(process.stdout);
 *
 *
 * TERMINAL:
 *
 *     process.stdin.isTTY
 *
 *     process.stdout.isTTY
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     stdin  = input stream
 *     stdout = normal output stream
 *     stderr = error output stream
 *
 * ============================================================
 */

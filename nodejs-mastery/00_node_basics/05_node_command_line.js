/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 05_node_command_line.js
 *
 * Topic:
 * Node.js Command Line
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. What is the Command Line?
 * ============================================================
 *
 * The command line is a text-based interface where we can
 * execute programs by typing commands.
 *
 * In Windows, we commonly use:
 *
 *     PowerShell
 *     Command Prompt (CMD)
 *     VS Code Terminal
 *
 *
 * Example:
 *
 *     node app.js
 *
 * Here:
 *
 *     node   → Node.js executable
 *     app.js → JavaScript file
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Running a Node.js file
 * ============================================================
 *
 * Example:
 *
 *     node app.js
 *
 * We can also provide additional arguments:
 *
 *     node app.js Shiva 20
 *
 *
 * These additional values can be accessed using:
 *
 *     process.argv
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. process.argv
 * ============================================================
 *
 * `process.argv` is an array containing command-line
 * arguments passed to the Node.js process.
 *
 * Example command:
 *
 *     node app.js Shiva 20
 *
 * Conceptually:
 *
 *     process.argv
 *
 *     [
 *       "path-to-node",
 *       "path-to-app.js",
 *       "Shiva",
 *       "20"
 *     ]
 *
 *
 * The first two entries are normally:
 *
 *     [0] → Node.js executable path
 *     [1] → JavaScript file path
 *
 * User-provided arguments start from:
 *
 *     [2]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Print process.argv
 * ============================================================
 */

console.log("Command-line arguments:");
console.log(process.argv);

/*
 * ============================================================
 * 5. Access individual arguments
 * ============================================================
 *
 * Example command:
 *
 *     node .\05_node_command_line.js Shiva 20
 *
 * Then:
 *
 *     process.argv[2] → Shiva
 *     process.argv[3] → 20
 *
 * ============================================================
 */

const name = process.argv[2];
const age = process.argv[3];

console.log("Name:", name);
console.log("Age:", age);

/*
 * ============================================================
 * 6. Command-line arguments are strings
 * ============================================================
 *
 * Important:
 *
 * Values received through process.argv are strings.
 *
 * Example:
 *
 *     node app.js 20
 *
 * `process.argv[2]` is:
 *
 *     "20"
 *
 * NOT:
 *
 *     20
 *
 * ============================================================
 */

console.log("Type of age:", typeof age);

/*
 * ============================================================
 * 7. Convert command-line arguments
 * ============================================================
 *
 * If we want a number, we must convert it.
 *
 * Common methods:
 *
 *     Number()
 *     parseInt()
 *     parseFloat()
 *
 * ============================================================
 */

const numericAge = Number(age);

console.log("Numeric age:", numericAge);
console.log("Type:", typeof numericAge);

/*
 * ============================================================
 * 8. Example calculation
 * ============================================================
 *
 * Run:
 *
 *     node app.js 10 20
 *
 * Then:
 *
 *     process.argv[2] → "10"
 *     process.argv[3] → "20"
 *
 * Convert them into numbers before doing arithmetic.
 *
 * ============================================================
 */

const firstNumber = Number(process.argv[2]);
const secondNumber = Number(process.argv[3]);

console.log("Sum:", firstNumber + secondNumber);

/*
 * ============================================================
 * 9. Why conversion matters
 * ============================================================
 *
 * Without conversion:
 *
 *     "10" + "20"
 *
 * produces:
 *
 *     "1020"
 *
 *
 * With Number():
 *
 *     Number("10") + Number("20")
 *
 * produces:
 *
 *     30
 *
 * ============================================================
 */

console.log("String addition:", "10" + "20");
console.log("Number addition:", Number("10") + Number("20"));

/*
 * ============================================================
 * 10. process.stdout
 * ============================================================
 *
 * `process.stdout` represents standard output.
 *
 * `console.log()` ultimately writes output to stdout,
 * although console handling has additional behavior.
 *
 * Example:
 */

process.stdout.write("Hello from stdout\n");

/*
 * IMPORTANT:
 *
 * `process.stdout.write()` does NOT automatically add
 * a newline.
 *
 * Therefore:
 *
 *     process.stdout.write("Hello");
 *     process.stdout.write("World");
 *
 * produces:
 *
 *     HelloWorld
 *
 * We can manually add:
 *
 *     \n
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. process.stdin
 * ============================================================
 *
 * `process.stdin` represents standard input.
 *
 * It allows a Node.js program to receive input from
 * the terminal.
 *
 * Example:
 *
 *     process.stdin.on("data", (data) => {
 *         console.log("Input:", data.toString());
 *     });
 *
 *
 * `data` is received as a Buffer by default.
 *
 * We can convert it to a string:
 *
 *     data.toString()
 *
 * ============================================================
 *
 * We are not running the stdin example automatically here
 * because it would keep this learning file waiting for input.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Simple stdin example
 * ============================================================
 *
 * Example:
 *
 *     process.stdin.on("data", (data) => {
 *       const input = data.toString().trim();
 *
 *       console.log("You entered:", input);
 *       process.exit(0);
 *     });
 *
 *
 * Run the program:
 *
 *     node app.js
 *
 * Type:
 *
 *     Hello
 *
 * Press Enter.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. process.exit()
 * ============================================================
 *
 * `process.exit()` immediately terminates the Node.js process.
 *
 * Example:
 *
 *     process.exit(0);
 *
 *
 * Exit code:
 *
 *     0 → Success
 *
 * Non-zero:
 *
 *     1, 2, etc. → Some kind of failure
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Exit codes
 * ============================================================
 *
 * A program can communicate its result to the operating
 * system using an exit code.
 *
 *
 * Success:
 *
 *     process.exitCode = 0;
 *
 *
 * Failure:
 *
 *     process.exitCode = 1;
 *
 *
 * Prefer setting `process.exitCode` when you want the process
 * to finish naturally rather than terminating immediately.
 *
 * Example:
 */

if (false) {
  process.exitCode = 1;
}

/*
 * ============================================================
 * 15. process.exitCode
 * ============================================================
 *
 * Instead of:
 *
 *     process.exit(1);
 *
 * you can often use:
 *
 *     process.exitCode = 1;
 *
 *
 * This allows Node.js to finish pending operations normally.
 *
 * This distinction becomes important in production programs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Practical CLI example
 * ============================================================
 *
 * Let's create a simple calculator.
 *
 * Run:
 *
 *     node app.js add 10 20
 *
 * Output:
 *
 *     Result: 30
 *
 * ============================================================
 */

const operation = process.argv[2];
const value1 = Number(process.argv[3]);
const value2 = Number(process.argv[4]);

if (operation === "add") {
  console.log("Result:", value1 + value2);
} else if (operation === "subtract") {
  console.log("Result:", value1 - value2);
} else if (operation === "multiply") {
  console.log("Result:", value1 * value2);
} else if (operation === "divide") {
  if (value2 === 0) {
    console.error("Cannot divide by zero.");
    process.exitCode = 1;
  } else {
    console.log("Result:", value1 / value2);
  }
} else {
  console.log("Usage:");
  console.log("node app.js add 10 20");
  console.log("node app.js subtract 20 10");
  console.log("node app.js multiply 10 20");
  console.log("node app.js divide 20 10");
}

/*
 * ============================================================
 * 17. process.env
 * ============================================================
 *
 * Node.js also provides environment variables through:
 *
 *     process.env
 *
 * Example:
 */

console.log("Current NODE_ENV:", process.env.NODE_ENV);

/*
 * Environment variables are commonly used for:
 *
 *     PORT
 *     DATABASE_URL
 *     JWT_SECRET
 *     NODE_ENV
 *     API_KEY
 *
 * Example:
 *
 *     process.env.PORT
 *
 * We will learn environment variables in detail later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Useful process properties
 * ============================================================
 *
 * Some commonly used properties:
 *
 *     process.argv
 *         Command-line arguments
 *
 *     process.env
 *         Environment variables
 *
 *     process.cwd()
 *         Current working directory
 *
 *     process.pid
 *         Current process ID
 *
 *     process.platform
 *         Operating system platform
 *
 *     process.version
 *         Node.js version
 *
 *     process.exitCode
 *         Process exit status
 *
 * ============================================================
 */

console.log("Current working directory:", process.cwd());
console.log("Process ID:", process.pid);
console.log("Platform:", process.platform);
console.log("Node.js version:", process.version);

/*
 * ============================================================
 * 19. Command-line architecture
 * ============================================================
 *
 *
 *      Windows Terminal
 *             │
 *             │
 *             ▼
 *      node app.js 10 20
 *             │
 *             ▼
 *       Node.js Process
 *             │
 *             ├── process.argv
 *             │
 *             ├── process.stdin
 *             │
 *             ├── process.stdout
 *             │
 *             ├── process.stderr
 *             │
 *             └── process.env
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. stdout vs stderr
 * ============================================================
 *
 * Node.js provides:
 *
 *     process.stdout
 *         Normal output
 *
 *     process.stderr
 *         Error output
 *
 * `console.log()` is commonly used for normal output.
 *
 * `console.error()` is commonly used for errors.
 *
 * Example:
 */

console.log("Normal output");
console.error("Error output");

/*
 * ============================================================
 * 21. Important CLI concepts
 * ============================================================
 *
 * Command-line programs commonly use:
 *
 *     Arguments
 *     stdin
 *     stdout
 *     stderr
 *     exit codes
 *     environment variables
 *
 *
 * These concepts are fundamental when building:
 *
 *     - CLI tools
 *     - Automation scripts
 *     - DevOps tools
 *     - Build tools
 *     - Database utilities
 *     - Node.js development tools
 *
 * ============================================================
 */

/*
 * ============================================================
 * Key Takeaways
 * ============================================================
 *
 * 1. `process.argv` contains command-line arguments.
 *
 * 2. User arguments normally start at index 2.
 *
 * 3. Command-line arguments are strings.
 *
 * 4. Use Number(), parseInt(), or parseFloat() when necessary.
 *
 * 5. `process.stdin` represents standard input.
 *
 * 6. `process.stdout` represents standard output.
 *
 * 7. `process.stderr` represents error output.
 *
 * 8. `process.exit()` terminates the process immediately.
 *
 * 9. `process.exitCode` sets the exit status while allowing
 *    the process to finish naturally.
 *
 * 10. `process.env` provides environment variables.
 *
 * 11. Node.js can be used to build powerful CLI applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Try these commands
 * ============================================================
 *
 * From the project root:
 *
 *     node .\00_node_basics\05_node_command_line.js
 *
 *
 * With arguments:
 *
 *     node .\00_node_basics\05_node_command_line.js Shiva 21
 *
 *
 * Calculator:
 *
 *     node .\00_node_basics\05_node_command_line.js add 10 20
 *
 *     node .\00_node_basics\05_node_command_line.js subtract 20 10
 *
 *     node .\00_node_basics\05_node_command_line.js multiply 10 20
 *
 *     node .\00_node_basics\05_node_command_line.js divide 20 10
 *
 * ============================================================
 */

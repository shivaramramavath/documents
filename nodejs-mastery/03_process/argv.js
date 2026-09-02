/**
 * ============================================================
 * Node.js Process - Command Line Arguments
 * ============================================================
 *
 * File: argv.js
 *
 * Topic:
 *     process.argv
 *
 * ============================================================
 *
 * `process.argv` is an array containing the command-line
 * arguments passed to the Node.js process.
 *
 * Example:
 *
 *     node argv.js hello 123
 *
 * Node receives:
 *
 *     node
 *     argv.js
 *     hello
 *     123
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Print process.argv
 * ============================================================
 */

console.log(process.argv);

/*
 * Run:
 *
 *     node argv.js hello 123
 *
 *
 * You will get something similar to:
 *
 *
 *     [
 *       'C:\\Program Files\\nodejs\\node.exe',
 *       'C:\\project\\argv.js',
 *       'hello',
 *       '123'
 *     ]
 *
 *
 * The exact paths depend on your computer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Understanding the indexes
 * ============================================================
 *
 * process.argv[0]
 *
 *     Path to the Node.js executable.
 *
 *
 * process.argv[1]
 *
 *     Path to the JavaScript file being executed.
 *
 *
 * process.argv[2]
 *
 *     First argument provided by YOU.
 *
 *
 * process.argv[3]
 *
 *     Second argument provided by YOU.
 *
 * ============================================================
 */

console.log("Node executable:", process.argv[0]);

console.log("JavaScript file:", process.argv[1]);

console.log("First user argument:", process.argv[2]);

console.log("Second user argument:", process.argv[3]);

/*
 * ============================================================
 * 3. Basic example
 * ============================================================
 *
 * Run:
 *
 *     node argv.js Shiva
 *
 *
 * Then:
 *
 *     process.argv[2]
 *
 * contains:
 *
 *     "Shiva"
 *
 * ============================================================
 */

const name = process.argv[2];

console.log(`Hello ${name}`);

/*
 * ============================================================
 * 4. Multiple arguments
 * ============================================================
 *
 * Run:
 *
 *     node argv.js Shiva 21 student
 *
 *
 * Arguments:
 *
 *     process.argv[2] -> Shiva
 *     process.argv[3] -> 21
 *     process.argv[4] -> student
 *
 * ============================================================
 */

const userName = process.argv[2];

const age = process.argv[3];

const role = process.argv[4];

console.log({
  userName,
  age,
  role,
});

/*
 * ============================================================
 * 5. IMPORTANT: Arguments are strings
 * ============================================================
 *
 * Even if you pass:
 *
 *     21
 *
 * Node receives:
 *
 *     "21"
 *
 * NOT:
 *
 *     21
 *
 * ============================================================
 */

console.log(typeof age);

/*
 * Output:
 *
 *     string
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Convert an argument to a number
 * ============================================================
 *
 * Use Number():
 */

const numericAge = Number(age);

console.log(numericAge);

console.log(typeof numericAge);

/*
 * ============================================================
 * 7. Simple calculator
 * ============================================================
 *
 * Run:
 *
 *     node argv.js 10 20
 *
 * ============================================================
 */

const first = Number(process.argv[2]);

const second = Number(process.argv[3]);

console.log("Sum:", first + second);

/*
 * ============================================================
 * 8. Validate numeric input
 * ============================================================
 */

if (Number.isNaN(first) || Number.isNaN(second)) {
  console.log("Please provide two valid numbers.");
}

/*
 * ============================================================
 * 9. Getting all user arguments
 * ============================================================
 *
 * Since indexes 0 and 1 belong to Node and the script,
 * we normally remove them using slice().
 *
 * ============================================================
 */

const args = process.argv.slice(2);

console.log("User arguments:", args);

/*
 * Example:
 *
 *     node argv.js one two three
 *
 *
 * args becomes:
 *
 *
 *     [
 *       "one",
 *       "two",
 *       "three"
 *     ]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Loop through arguments
 * ============================================================
 */

for (const argument of args) {
  console.log("Argument:", argument);
}

/*
 * ============================================================
 * 11. Rest syntax
 * ============================================================
 *
 * We can also use:
 */

const [...userArguments] = process.argv.slice(2);

console.log(userArguments);

/*
 * ============================================================
 * 12. Build a simple greeting CLI
 * ============================================================
 *
 * Run:
 *
 *     node argv.js Shiva
 *
 * ============================================================
 */

const person = process.argv[2];

if (!person) {
  console.log("Usage: node argv.js <name>");
} else {
  console.log(`Welcome, ${person}!`);
}

/*
 * ============================================================
 * 13. Simple calculator CLI
 * ============================================================
 *
 * Run:
 *
 *     node argv.js 10 + 20
 *
 *
 * process.argv:
 *
 *
 *     [
 *       node,
 *       argv.js,
 *       "10",
 *       "+",
 *       "20"
 *     ]
 *
 * ============================================================
 */

const left = Number(process.argv[2]);

const operator = process.argv[3];

const right = Number(process.argv[4]);

if (!Number.isNaN(left) && !Number.isNaN(right)) {
  if (operator === "+") {
    console.log(left + right);
  } else if (operator === "-") {
    console.log(left - right);
  } else if (operator === "*") {
    console.log(left * right);
  } else if (operator === "/") {
    if (right === 0) {
      console.log("Cannot divide by zero.");
    } else {
      console.log(left / right);
    }
  } else {
    console.log("Supported operators: + - * /");
  }
}

/*
 * ============================================================
 * 14. Flags
 * ============================================================
 *
 * CLI applications commonly use flags.
 *
 * Example:
 *
 *     node argv.js --name Shiva
 *
 *
 * process.argv becomes approximately:
 *
 *
 *     [
 *       node,
 *       argv.js,
 *       "--name",
 *       "Shiva"
 *     ]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Check whether a flag exists
 * ============================================================
 */

const hasHelp = process.argv.includes("--help");

if (hasHelp) {
  console.log("Usage: node argv.js [options]");
}

/*
 * ============================================================
 * 16. Multiple flags
 * ============================================================
 *
 * Example:
 *
 *
 *     node argv.js --verbose --debug
 *
 * ============================================================
 */

const verbose = process.argv.includes("--verbose");

const debug = process.argv.includes("--debug");

console.log({
  verbose,
  debug,
});

/*
 * ============================================================
 * 17. Finding a specific argument
 * ============================================================
 *
 * indexOf() can find where an argument appears.
 * ============================================================
 */

const nameIndex = process.argv.indexOf("--name");

console.log("Name flag index:", nameIndex);

/*
 * ============================================================
 * 18. Read the value after a flag
 * ============================================================
 *
 * Example:
 *
 *     node argv.js --name Shiva
 *
 * ============================================================
 */

const flagIndex = process.argv.indexOf("--name");

if (flagIndex !== -1) {
  const flagValue = process.argv[flagIndex + 1];

  console.log("Name:", flagValue);
}

/*
 * ============================================================
 * 19. Simple flag parser
 * ============================================================
 *
 * This is a basic learning implementation.
 *
 * Production applications often use libraries such as:
 *
 *     commander
 *     yargs
 *     minimist
 *
 * But understanding process.argv first is important.
 *
 * ============================================================
 */

function getArgument(flag) {
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

const cliName = getArgument("--name");

console.log("CLI name:", cliName);

/*
 * ============================================================
 * 20. Boolean flags
 * ============================================================
 *
 * A flag without a value is usually treated as boolean.
 *
 *
 * Example:
 *
 *     --verbose
 *
 * ============================================================
 */

function hasFlag(flag) {
  return process.argv.includes(flag);
}

console.log({
  verbose: hasFlag("--verbose"),

  debug: hasFlag("--debug"),

  help: hasFlag("--help"),
});

/*
 * ============================================================
 * 21. Example command
 * ============================================================
 *
 *     node argv.js --name Shiva --age 21 --verbose
 *
 *
 * Values:
 *
 *     --name
 *         Shiva
 *
 *     --age
 *         21
 *
 *     --verbose
 *         true
 *
 * ============================================================
 */

const inputName = getArgument("--name");

const inputAge = Number(getArgument("--age"));

const isVerbose = hasFlag("--verbose");

console.log({
  inputName,
  inputAge,
  isVerbose,
});

/*
 * ============================================================
 * 22. Handling missing values
 * ============================================================
 *
 * This command:
 *
 *     node argv.js --name
 *
 *
 * contains the flag but no value.
 *
 * A robust CLI should validate this.
 * ============================================================
 */

function requireArgument(flag) {
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  const value = process.argv[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}`);
  }

  return value;
}

/*
 * We don't call requireArgument("--name") here because the
 * current command may not contain --name.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Why process.argv matters
 * ============================================================
 *
 * `process.argv` is the foundation of Node.js CLI programs.
 *
 * It allows you to build:
 *
 *     - File management tools
 *     - Database CLI tools
 *     - Build tools
 *     - Migration tools
 *     - Code generators
 *     - Deployment tools
 *     - DevOps utilities
 *     - Project scaffolding tools
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Real-world example
 * ============================================================
 *
 * Imagine:
 *
 *
 *     node migrate.js --environment production
 *
 *
 * Your application can read:
 *
 *
 *     process.argv
 *
 *
 * and determine:
 *
 *
 *     environment = "production"
 *
 *
 * It can then load production database configuration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. process.argv vs process.env
 * ============================================================
 *
 *
 * process.argv
 *
 *     Values supplied when starting the process.
 *
 *
 * Example:
 *
 *     node app.js --port 5000
 *
 *
 * process.env
 *
 *     Environment variables provided by the OS/runtime.
 *
 *
 * Example:
 *
 *     PORT=5000
 *
 *
 * Both are useful for configuration, but they serve different
 * purposes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Important mental model
 * ============================================================
 *
 *
 * Terminal
 *    │
 *    │
 *    ▼
 *
 * node app.js --name Shiva
 *
 *    │
 *    ▼
 *
 * Node.js Process
 *    │
 *    ▼
 *
 * process.argv
 *    │
 *    ├── [0] Node executable
 *    ├── [1] Script path
 *    ├── [2] --name
 *    └── [3] Shiva
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Print everything:
 *
 *     console.log(process.argv);
 *
 *
 * Node executable:
 *
 *     process.argv[0]
 *
 *
 * Script path:
 *
 *     process.argv[1]
 *
 *
 * First user argument:
 *
 *     process.argv[2]
 *
 *
 * All user arguments:
 *
 *     process.argv.slice(2)
 *
 *
 * Check flag:
 *
 *     process.argv.includes("--help")
 *
 *
 * Find flag:
 *
 *     process.argv.indexOf("--name")
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     process.argv = command-line input to your Node process.
 *
 * ============================================================
 */

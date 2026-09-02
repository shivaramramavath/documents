/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 04_node_repl.js
 *
 * Topic:
 * Node.js REPL
 *
 * ============================================================
 */


/*
 * ============================================================
 * 1. What is REPL?
 * ============================================================
 *
 * REPL stands for:
 *
 *     R → Read
 *     E → Evaluate
 *     P → Print
 *     L → Loop
 *
 * It is an interactive environment where you can write
 * JavaScript code and immediately see the result.
 *
 *
 * Example:
 *
 *     > 10 + 20
 *     30
 *
 *     > "Hello " + "Node.js"
 *     'Hello Node.js'
 *
 *
 * The REPL is useful for:
 *
 *     - Learning JavaScript
 *     - Testing small pieces of code
 *     - Testing Node.js APIs
 *     - Debugging
 *     - Experimenting with modules
 *
 * ============================================================
 */


/*
 * ============================================================
 * 2. Start the Node.js REPL
 * ============================================================
 *
 * Open your VS Code terminal and run:
 *
 *     node
 *
 * You should see something similar to:
 *
 *     Welcome to Node.js
 *     Type ".help" for more information.
 *
 *     >
 *
 * The `>` means Node.js is waiting for your input.
 *
 * ============================================================
 */


/*
 * ============================================================
 * 3. REPL Read
 * ============================================================
 *
 * The REPL first READS the code you enter.
 *
 * Example:
 *
 *     > 10 + 20
 *
 * Node.js reads:
 *
 *     10 + 20
 *
 * ============================================================
 */


/*
 * ============================================================
 * 4. REPL Evaluate
 * ============================================================
 *
 * Node.js then EVALUATES the JavaScript expression.
 *
 * Example:
 *
 *     > 10 + 20
 *
 * JavaScript evaluates the expression:
 *
 *     10 + 20
 *
 * Result:
 *
 *     30
 *
 * ============================================================
 */


/*
 * ============================================================
 * 5. REPL Print
 * ============================================================
 *
 * Node.js PRINTS the result.
 *
 * Example:
 *
 *     > 10 + 20
 *     30
 *
 * ============================================================
 */


/*
 * ============================================================
 * 6. REPL Loop
 * ============================================================
 *
 * After printing the result, Node.js waits for your next
 * command.
 *
 * Therefore:
 *
 *     Read
 *       ↓
 *     Evaluate
 *       ↓
 *     Print
 *       ↓
 *     Loop
 *       ↓
 *     Read again
 *
 * ============================================================
 */


/*
 * ============================================================
 * 7. Simple REPL examples
 * ============================================================
 *
 * Start REPL:
 *
 *     node
 *
 * Then try:
 *
 *     > 10 + 20
 *     > 100 / 5
 *     > 10 * 10
 *     > "Node.js".toUpperCase()
 *     > [1, 2, 3].length
 *
 *
 * Example:
 *
 *     > 10 + 20
 *     30
 *
 * ============================================================
 */


/*
 * ============================================================
 * 8. Variables inside REPL
 * ============================================================
 *
 * You can create variables:
 *
 *     > const name = "Shiva"
 *     > name
 *     'Shiva'
 *
 *
 * Another example:
 *
 *     > const age = 20
 *     > age + 5
 *     25
 *
 * ============================================================
 */


/*
 * ============================================================
 * 9. Functions inside REPL
 * ============================================================
 *
 * You can define functions:
 *
 *     > function add(a, b) {
 *     ...   return a + b;
 *     ... }
 *
 * Then:
 *
 *     > add(10, 20)
 *     30
 *
 *
 * The `...` means the REPL expects more code.
 *
 * ============================================================
 */


/*
 * ============================================================
 * 10. Node.js APIs inside REPL
 * ============================================================
 *
 * You can experiment with Node.js modules directly.
 *
 * Example:
 *
 *     > const os = require("os")
 *
 *     > os.platform()
 *
 *     > os.cpus().length
 *
 *     > os.totalmem()
 *
 * This is extremely useful when learning Node.js APIs.
 *
 * ============================================================
 */


/*
 * ============================================================
 * 11. Useful REPL commands
 * ============================================================
 *
 * Node.js REPL provides special commands called
 * "dot commands".
 *
 * These commands start with `.`.
 *
 *
 * ------------------------------------------------------------
 * .help
 * ------------------------------------------------------------
 *
 * Shows available REPL commands.
 *
 *     > .help
 *
 *
 * ------------------------------------------------------------
 * .exit
 * ------------------------------------------------------------
 *
 * Exits the REPL.
 *
 *     > .exit
 *
 *
 * You can also press:
 *
 *     Ctrl + C twice
 *
 *
 * ------------------------------------------------------------
 * .clear
 * ------------------------------------------------------------
 *
 * Clears the current REPL context.
 *
 *
 * ------------------------------------------------------------
 * .break
 * ------------------------------------------------------------
 *
 * Stops the current multi-line expression.
 *
 *
 * ------------------------------------------------------------
 * .save
 * ------------------------------------------------------------
 *
 * Saves the current REPL session to a file.
 *
 * Example:
 *
 *     > .save repl-session.js
 *
 *
 * ------------------------------------------------------------
 * .load
 * ------------------------------------------------------------
 *
 * Loads JavaScript code from a file.
 *
 * Example:
 *
 *     > .load example.js
 *
 *
 * ------------------------------------------------------------
 * .editor
 * ------------------------------------------------------------
 *
 * Opens editor mode for writing multi-line JavaScript.
 *
 * ============================================================
 */


/*
 * ============================================================
 * 12. Important REPL commands summary
 * ============================================================
 *
 *     node
 *         Start REPL
 *
 *     .help
 *         Show help
 *
 *     .exit
 *         Exit REPL
 *
 *     .clear
 *         Clear context
 *
 *     .break
 *         Stop current expression
 *
 *     .save file.js
 *         Save session
 *
 *     .load file.js
 *         Load JavaScript file
 *
 *     .editor
 *         Enter editor mode
 *
 * ============================================================
 */


/*
 * ============================================================
 * 13. REPL special variables
 * ============================================================
 *
 * Node.js REPL also provides special variables.
 *
 * One commonly useful variable is:
 *
 *     _
 *
 * `_` contains the result of the previous expression.
 *
 *
 * Example:
 *
 *     > 10 + 20
 *     30
 *
 *     > _
 *     30
 *
 *     > _ + 10
 *     40
 *
 *
 * Note:
 *
 * The exact REPL behavior can vary depending on the Node.js
 * version and how the REPL is being used.
 *
 * ============================================================
 */


/*
 * ============================================================
 * 14. REPL vs JavaScript file
 * ============================================================
 *
 * REPL:
 *
 *     node
 *
 *     > console.log("Hello")
 *
 * Good for:
 *
 *     - Quick experiments
 *     - Testing
 *     - Learning
 *     - Debugging small expressions
 *
 *
 * JavaScript file:
 *
 *     node app.js
 *
 * Good for:
 *
 *     - Applications
 *     - Projects
 *     - APIs
 *     - Servers
 *     - Reusable code
 *
 *
 * ============================================================
 */


/*
 * ============================================================
 * 15. REPL is NOT a separate programming language
 * ============================================================
 *
 * The REPL executes JavaScript using the Node.js runtime.
 *
 *
 *     JavaScript code
 *           ↓
 *       Node.js REPL
 *           ↓
 *          V8
 *           ↓
 *       Execution
 *
 *
 * REPL is simply an interactive interface for executing
 * JavaScript.
 *
 * ============================================================
 */


/*
 * ============================================================
 * 16. Practical experiment
 * ============================================================
 *
 * Start the REPL:
 *
 *     node
 *
 * Then execute:
 *
 *     > const os = require("os")
 *
 *     > os.platform()
 *
 *     > os.arch()
 *
 *     > os.cpus().length
 *
 *     > process.version
 *
 *     > process.platform
 *
 *     > process.memoryUsage()
 *
 *     > .exit
 *
 *
 * These commands allow you to inspect your Node.js runtime.
 *
 * ============================================================
 */


/*
 * ============================================================
 * 17. Running this file
 * ============================================================
 *
 * This file contains explanations and examples in comments.
 *
 * Run:
 *
 *     node .\00_node_basics\04_node_repl.js
 *
 *
 * IMPORTANT:
 *
 * The REPL itself is started using:
 *
 *     node
 *
 * not by running this file.
 *
 * ============================================================
 */


/*
 * ============================================================
 * Key Takeaways
 * ============================================================
 *
 * 1. REPL means Read-Eval-Print Loop.
 *
 * 2. Node.js provides an interactive JavaScript REPL.
 *
 * 3. Start it by typing:
 *
 *        node
 *
 * 4. You can execute JavaScript immediately.
 *
 * 5. You can test Node.js APIs from the REPL.
 *
 * 6. Dot commands such as `.help` and `.exit` are special
 *    REPL commands.
 *
 * 7. REPL is useful for learning, experimentation and
 *    debugging.
 *
 * 8. REPL is an interface to the Node.js runtime, not a
 *    separate programming language.
 *
 * ============================================================
 */
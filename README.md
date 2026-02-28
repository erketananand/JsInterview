## Index (Table of Contents)

- [Execution Context & Scope](#execution-context--scope)
  - [1. What is an Execution Context?](#1-what-is-an-execution-context-coralogix)
  - [2. How many Execution Contexts can exist?](#2-how-many-execution-contexts-can-exist-developermozilla-anuradhahashnode)
  - [3. Three types of Execution Contexts](#3-three-types-of-execution-contexts-coralogix)
  - [4. What happens in the Creation Phase?](#4-what-happens-in-the-creation-phase-coralogix-developermozilla)
  - [5. What is the Call Stack?](#5-what-is-the-call-stack-developermozilla-geeksforgeeks)
  - [6. What lives inside a Lexical Environment?](#6-what-lives-inside-a-lexical-environment-dev)
  - [7. How does a Lexical Environment form the Scope Chain?](#7-how-does-a-lexical-environment-form-the-scope-chain-dev-anuradhahashnode)
  - [8. What if JS cannot find a variable?](#8-what-if-js-cannot-find-a-variable-anuradhahashnode-developermozilla)
  - [9. Scope vs Execution Context](#9-scope-vs-execution-context-anuradhahashnode-coralogix)
  - [10. How is `this` decided in a Function Execution Context?](#10-how-is-this-decided-in-a-function-execution-context-developermozilla)
  - [11. Why do `let` and `const` throw before initialization?](#11-why-do-let-and-const-throw-before-initialization-ccbp-geeksforgeeks)
  - [13. Why is Execution Context the foundation of Closures?](#13-why-is-execution-context-the-foundation-of-closures-developermozilla)
- [Event Loop Fundamentals](#event-loop-fundamentals)
  - [14. Why event loop, sync-only, execution model?](#14-why-event-loop-sync-only-execution-model-geeksforgeeks-developermozilla)
  - [16. Why Web APIs and how they interact?](#16-why-web-apis-and-how-they-interact-geeksforgeeks-developermozilla)
  - [17. Callback queues, macrotask vs microtask](#17-callback-queues-macrotask-vs-microtask-javascript-developermozilla-nodejs)
  - [18. What is the event loop and its algorithm?](#18-what-is-the-event-loop-and-its-algorithm-developermozillaorgcach3-javascript-nodejs)
  - [19. Why are promises faster than setTimeout, and skipping macrotasks?](#19-why-are-promises-faster-than-settimeout-and-skipping-macrotasks-javascript-developermozilla)
  - [20. Why isn't `setTimeout(0)` immediate? Starvation & microtask starvation](#20-why-isnt-settimeout0-immediate-starvation--microtask-starvation-javascript-developermozilla)
  - [21. What is `process.nextTick()` in Node.js?](#21-what-is-processnexttick-in-nodejs-nodejs)
  - [22. Non-blocking single thread and why `fetch` uses microtasks](#22-non-blocking-single-thread-and-why-fetch-uses-microtasks-geeksforgeeks-javascript)
  - [28. What is a macrotask and a microtask?](#28-what-is-a-macrotask-and-a-microtask-javascript-developermozilla)
- [Node.js Specifics](#nodejs-specifics)
  - [35. Why is JavaScript non-blocking despite being single-threaded?](#35-why-is-javascript-non-blocking-despite-being-single-threaded-geeksforgeeks-developermozillaorgcach3)
  - [36. Node process model, why Node is fast, single thread, libuv, event loop](#36-node-process-model-why-node-is-fast-single-thread-libuv-event-loop-nodejs-shiftasia)
  - [37. Companies using Node and why](#37-companies-using-node-and-why-rapidops)
  - [38. Async patterns: callbacks, promises, async/await](#38-async-patterns-callbacks-promises-asyncawait-nodejs-developermozilla)
  - [39. `async` library, `async.series`, `async.parallel`](#39-async-library-asyncseries-asyncparallel-w3docs)
  - [40. `Promise.all`, `Promise.allSettled`, `Promise.any`](#40-promiseall-promiseallsettled-promiseany-developermozilla)
  - [41. Node globals: `global`, `process`, no `window`](#41-node-globals-global-process-no-window-w3schools)
  - [42. Checking npm package safety](#42-checking-npm-package-safety-w3docs)
  - [43. How do you debug Node?](#43-how-do-you-debug-node-w3schools-geeksforgeeks)
  - [44. Express basics: app, routing, middleware, response middleware](#44-express-basics-app-routing-middleware-response-middleware-geeksforgeeks-w3schools)

## Execution Context & Scope

### 1. What is an Execution Context? [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)
- An execution context is an **internal data structure** the JS engine uses to run code: it stores **variables, function declarations, parameters, the current value of `this`, and a link to the outer lexical environment**.
- It is created **just before** a piece of code starts running: **once** when the program first loads (**global context**) and **again on every function call** (**function context**), and for `eval` calls in some engines.

**Example (global + function context)**:
```js
// Global execution context is created here
const x = 1;
function add(y) {      // New function execution context when called
  const result = x + y;
  return result;
}
add(5); // creates a function execution context
```

### 2. How many Execution Contexts can exist? [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) [anuradha.hashnode](https://anuradha.hashnode.dev/scope-chain-and-lexical-environment-in-javascript)
- **Only one execution context is actively running at a time** (JavaScript is **single-threaded** by design in the main thread).
- However, **many contexts can exist in memory at once**: the current one plus any **suspended ones captured by closures** or **stored frames** that the engine keeps reachable.

**Example**: nested calls stack up multiple contexts (see call stack below).

### 3. Three types of Execution Contexts [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)
- **Global execution context**: created **once** when the script starts; holds **global variables/functions** and sets up the **global object** (`window` in browsers, `global` in Node.js) and default `this`.
- **Function execution context**: created **each time a function is called**; holds **parameters, local variables, and its own lexical environment** and `arguments` object.
- **Eval execution context**: created when `eval()` runs code, so that evaluated code executes in its own environment (**in practice `eval` is rarely recommended**).

### 4. What happens in the Creation Phase? [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
When a new execution context is created, engines conceptually do **two phases**: **creation**, then **execution**.

**In the creation phase**:
- A **new lexical environment** is created and **linked to its outer environment**; **hoisted function declarations** and **`var` variables** are allocated (**functions get their bodies**; **`var` variables get `undefined`**).
- The value of **`this` is determined** (global object in non-strict mode for global code, `undefined` in modules/strict mode, or set by how the function is called such as `obj.method()`).

**Example**:
```js
console.log(a);   // undefined (var is hoisted)
greet();          // works (function is hoisted)

var a = 10;
function greet() {
  console.log('hi');
}
```
*During creation, `a` exists but is `undefined`, and `greet` already refers to the function, which is why the calls before the declarations work.*

### 5. What is the Call Stack? [developer.mozilla](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack) [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)
- The **call stack** is a **LIFO (last-in, first-out) stack** where the JS engine keeps track of **active execution contexts**.
- When a function is called, its execution context is **pushed** onto the stack; when it **returns**, that context is **popped**, and execution **resumes in the previous context**.
- **vs Event/Task Queue**: **Stack = sync/LIFO** (currently executing); **Queue = async/FIFO** (waiting callbacks from timers/events/network).

**Example**:
```js
function first() { second(); }
function second() { third(); }
function third() { console.log('end'); }
first();
```
*The stack evolves as: `Global → first → second → third`, then unwinds as `third` returns, then `second`, then `first`, ending back in the global context.*

**Simple queue example**:
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');
// Order: A, C, then B (queue waits for stack to empty)
```

### 6. What lives inside a Lexical Environment? [dev](https://dev.to/antonzo/lexical-scope-lexical-environment-execution-context-closure-in-javascript-5bn6)
- A **lexical environment** is an **internal object** that **maps identifiers (variable and function names) to their values** and also stores a **reference to its outer lexical environment**.
- It typically has an **environment record** (bindings for `let`, `const`, `var`, function parameters, and inner function declarations) and an **`outer` pointer** to the environment where this code was defined.

**Example**:
```js
function outer() {
  let a = 1;
  function inner() {
    let b = 2;
    console.log(a, b);
  }
  inner();
}
outer();
```
*`inner`'s lexical environment holds `b` and a reference to `outer`'s environment (which holds `a`), plus a reference further outward to the global environment.*

### 7. How does a Lexical Environment form the Scope Chain? [dev](https://dev.to/antonzo/lexical-scope-lexical-environment-execution-context-closure-in-javascript-5bn6) [anuradha.hashnode](https://anuradha.hashnode.dev/scope-chain-and-lexical-environment-in-javascript)
- Each lexical environment **points to its parent (outer) environment**, forming a **linked list called the scope chain**.
- When code looks up a variable, the engine **first searches the current environment**; if not found, it **walks up the outer links** until it finds the variable or reaches the **global environment**.

**Example**:
```js
let x = 0;
function a() {
  let y = 1;
  function b() {
    let z = 2;
    console.log(x, y, z); // finds z in b, y in a, x in global
  }
  b();
}
a();
```
*Here the scope chain for `b` is: `b → a → global`; that chain decides which variables are visible inside `b`.*

### 8. What if JS cannot find a variable? [anuradha.hashnode](https://anuradha.hashnode.dev/scope-chain-and-lexical-environment-in-javascript) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- If JavaScript cannot find a variable in the current lexical environment, it **walks up the scope chain**; if the name is **not found anywhere up to the global environment**, it throws a **`ReferenceError`**.
- In **sloppy mode (non-strict)** in older code, assigning to an undeclared variable might **accidentally create a global property**, but **modern best practice uses strict mode and modules**, where undeclared access fails.

**Example**:
```js
"use strict";
function demo() {
  console.log(notDefined); // ReferenceError
}
demo();
```
*Because `notDefined` is not found in any environment, the engine throws an error.*

### 9. Scope vs Execution Context [anuradha.hashnode](https://anuradha.hashnode.dev/scope-chain-and-lexical-environment-in-javascript) [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)
- **Scope** describes **where a variable is visible** in source code; it is a **static, compile-time concept** based on where things are written (**lexical scope**).
- **Execution context** is the **runtime container** created while code is actually running; it **uses lexical environments and the scope chain** to perform variable lookups.

**Example**:
```js
function f() {
  let x = 1;   // x is in the scope of f
}
```
*The scope of `x` is the body of `f` (this does **not** change). Every time `f()` runs, a **new execution context** is created, with a **fresh lexical environment** containing its own `x`.*

### 10. How is `this` decided in a Function Execution Context? [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- Inside a function execution context, **`this` is set based on how the function is called**, **not where it is defined**.
- In **non-strict functions**, `this` becomes:
  - the **object before the dot** (`obj.method()`)
  - the **value passed to `call`/`apply`/`bind`**
  - the **global object** if the function is called "bare"
- In **strict mode**, bare calls set `this` to **`undefined`**.

**Example**:
```js
function show() {
  console.log(this.name);
}
const user = { name: 'Alice', show };

show();            // 'undefined' or global name (depending on mode)
user.show();       // 'Alice' (because this === user)
show.call({ name: 'Bob' }); // 'Bob'
```
*Each call creates a **new function execution context** with its **own `this` binding*.*

### 11. Why do `let` and `const` throw before initialization? [ccbp](https://www.ccbp.in/blog/articles/temporal-dead-zone-in-javascript) [geeksforgeeks](https://www.geeksforgeeks.org/javascript/temporal-dead-zone-in-javascript/)
- **`let` and `const` declarations are hoisted** (their names are known at the top of the block), **but they are not initialized** until the declaration line is evaluated.
- From the **start of the block until that line**, the binding is in the **Temporal Dead Zone (TDZ)**.
- Accessing a `let`/`const` variable while it is in the **TDZ causes a `ReferenceError: Cannot access 'x' before initialization`**, which **prevents accidental use of uninitialized values**.

**Example**:
```js
console.log(count); // ReferenceError (TDZ)
let count = 10;
```
*Here the name `count` exists but is **not yet initialized**, so reading it is illegal.*

**TDZ detailed**:
```js
{
  // TDZ for a starts here
  // console.log(a); // ReferenceError
  let a = 5;        // TDZ for a ends here
  console.log(a);   // 5
}
```
*This behavior encourages writing code where variables are used **only after they are clearly defined**.*

### 13. Why is Execution Context the foundation of Closures? [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- A **closure** is a **function bundled with references to its surrounding lexical environment**, meaning it can use variables from **outer scopes even after those outer functions have finished running**.
- When a function **returns another function**, the **inner function's execution context finishes**, but its **lexical environment is kept alive** because the returned function still **references it**, forming a closure.

**Example**:
```js
function makeCounter() {
  let count = 0;          // lives in makeCounter's lexical environment
  return function () {
    count++;
    console.log(count);
  };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
```
*Although `makeCounter`'s execution context has been **removed from the call stack**, the **closure keeps its lexical environment (and `count`) in memory**.*

***

## Event Loop Fundamentals

### 14. Why event loop, sync-only, execution model? [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- The **event loop exists** so JavaScript can stay **single-threaded** but still handle **slow tasks** (timers, network, disk, UI) **without blocking the main thread**. It **coordinates the call stack, Web/Node APIs, and task queues** to run work in a **predictable order**.
- **If everything were synchronous**, a long task like a **big `for` loop** or **`fetch`ing a large file** would **freeze the page or Node.js process** until it finished, so **clicks, animations, and other requests would not respond**.
- JavaScript's **execution model** is: **run all synchronous code on a single call stack**, **delegate async operations to the host (browser/Node APIs)**, **enqueue callbacks when they are ready**, then the **event loop moves callbacks back to the stack when it is empty**. *This creates the illusion of concurrency without multiple JS threads.*

**Example**:
```js
console.log('start');
setTimeout(() => { console.log('timer done'); }, 1000);
console.log('end');
// Output: start, end, then timer done later
```

### 16. Why Web APIs and how they interact? [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)
- **JavaScript itself cannot do networking, timers, or DOM**; the **browser or Node.js provides Web APIs / Node APIs** for these operations.
- When you call `setTimeout`, `fetch`, `addEventListener`, `fs.readFile`, etc., you are **asking the host to do work outside the JS engine**.
- The **JS engine calls an API, then returns to the stack**; once the operation completes (timer expires, data arrives, user clicks), the **host puts the corresponding callback into the appropriate task queue**. The **event loop later moves that callback onto the stack** so it can run.

**Example**:
```js
button.addEventListener('click', () => {
  console.log('clicked');
});
```
*The browser stores the listener in its event system; when a click happens, it enqueues the callback into the task queue.*

### 17. Callback queues, macrotask vs microtask [javascript](https://javascript.info/event-loop) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

| **Queue Type** | **Priority** | **Contents** | **Examples** |
|----------------|--------------|--------------|--------------|
| **Macrotask (Task/Callback Queue)** | Lowest | Big async units: initial script, `setTimeout`, `setInterval`, DOM events, some network, Node timers/IO phases | `setTimeout`, `fs.readFile` callback, DOM `click` |
| **Microtask Queue** | Higher | Small jobs after current task but before next macrotask | Promise `.then/.catch/.finally`, `queueMicrotask`, MutationObserver |
| **nextTick Queue (Node only)** | Highest | Runs after current stack, before microtasks | `process.nextTick()` |

**Key Rule**: After each **macrotask finishes**, event loop **drains ENTIRE microtask queue** before next macrotask.

**Example**:
```js
console.log('script start');
setTimeout(() => console.log('timeout'), 0);   // macrotask
Promise.resolve().then(() => console.log('promise')); // microtask
console.log('script end');
// Order: script start, script end, promise, timeout
```

### 18. What is the event loop and its algorithm? [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop) [javascript](https://javascript.info/event-loop) [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

**Simplified Browser Algorithm**:
```
1. Run initial script (global code)
2. While true:
   ├─ If stack empty → take next MACROtask from task queue → run it
   ├─ After macro finishes → drain ALL MICROtasks
   └─ Update UI (paint)? → repeat
```

**Node.js Phases**: timers → pending callbacks → idle/prepare → poll (IO) → check (`setImmediate`) → close → microtasks between phases.

### 19. Why are promises faster than setTimeout, and skipping macrotasks? [javascript](https://javascript.info/event-loop) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- **Promises feel "faster"** because their callbacks run as **microtasks**, processed **before next macrotask** (like `setTimeout(0)`).
- **"Skipping macrotask when microtask exists"**: Event loop **always drains microtask queue completely** before picking next macrotask.
- **Microtask starvation risk**: If microtasks keep queuing more microtasks, they **block macrotasks indefinitely** (timers, UI events delayed).

**Example**:
```js
setTimeout(() => console.log('timeout 0'), 0);
Promise.resolve().then(() => console.log('promise 1'))
                .then(() => console.log('promise 2'));
// Order: promise 1, promise 2, timeout 0
```

### 20. Why isn't `setTimeout(0)` immediate? Starvation & microtask starvation [javascript](https://javascript.info/event-loop) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

- **`setTimeout(fn, 0)`** means "run `fn` after **at least 0 ms, in the timer macrotask queue**", but the callback **cannot run until**:
  1. **Current call stack is empty**
  2. **ALL pending microtasks finish** 
  3. **Event loop reaches the timers phase**
- **Browsers enforce minimum delays** for nested timers and background tabs, so `0` is a **minimum wait**, not "run now".

- **Starvation**: Some tasks **never get CPU time** because higher-priority work keeps running first.
- **Microtask starvation**: Microtasks **continuously schedule more microtasks** (e.g., recursive `queueMicrotask` loop), so the loop **never returns to macrotasks** (timers, UI events, rendering blocked).

**Example `setTimeout(0)` delay**:
```js
setTimeout(() => console.log('timeout'), 0);
for (let i = 0; i < 1e8; i++) {}  // heavy loop
console.log('done loop');
// timeout prints only AFTER loop completes
```

**Microtask starvation example**:
```js
function loop() {
  queueMicrotask(loop);  // keeps microtask queue busy
}
loop();  // timers never fire, UI never renders
```

### 21. What is `process.nextTick()` in Node.js? [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

- In Node.js, **`process.nextTick(callback)`** schedules `callback` in a **special next-tick queue** that runs:
  1. **After current function/stack completes**
  2. **Before regular microtasks** (Promises)
  3. **Before other event loop phases**

- **Use case**: Libraries use it for **cleanup/follow-up logic** immediately after current operation.
- **Danger**: **Overuse can starve** the event loop (nextTick callbacks run **repeatedly** before timers/IO).

**Execution order in Node**:
```js
console.log('start');
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
setTimeout(() => console.log('timeout'), 0);
console.log('end');
// Order: start, end, nextTick, promise, timeout
```

### 22. Non-blocking single thread and why `fetch` uses microtasks [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) [javascript](https://javascript.info/event-loop)

- **JavaScript is non-blocking** because **slow operations** are **offloaded to host's I/O system or worker threads**, while the **main JS thread quickly returns to call stack** and continues other code. **Callbacks only come back through queues when results are ready**.

- In browsers, **`fetch` returns a Promise** whose **resolution callbacks run in microtask queue**, ensuring:
  - **Predictable, high-priority ordering** of `.then` handlers relative to timers/other tasks
  - **Consistent behavior** in promise chains

**Example**:
```js
console.log('start');
fetch('/data.json').then(() => console.log('fetch then'));
setTimeout(() => console.log('timeout'), 0);
console.log('end');
// Typical: start, end, fetch then, timeout (microtask before macrotask)
```

### 28. What is a macrotask and a microtask? [javascript](https://javascript.info/event-loop) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

- **Macrotasks (tasks)**: **"Big" units** scheduled by `setTimeout`, `setInterval`, `setImmediate` (Node), DOM events, many async APIs. **Each runs start-to-finish** before next.

- **Microtasks**: **"Small" jobs** that run **after current script/task but before next macrotask**:
  - Promise `.then/.catch/.finally` handlers
  - `queueMicrotask` callbacks
  - **Node**: `process.nextTick` (separate queue, higher priority than Promises)

**Why microtasks run before macrotasks**: After each **macrotask finishes**, event loop **drains entire microtask queue** before picking next macrotask. Ensures **promise chains run quickly/predictably**.

**Example**:
```js
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => console.log('microtask'));
// Output: microtask, macrotask
```

***

## Node.js Specifics

### 35. Why is JavaScript non-blocking despite being single-threaded? [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop)

- **Non-blocking behavior**: **Offload operations to host environment's I/O and worker threads** while **main JS thread keeps running other code**. **Callbacks return through queues when results ready**.

- **One thread orchestrates many concurrent operations** because **event loop only runs callbacks when stack is free**.

**Async server pattern**:
```js
const http = require('http');
http.createServer((req, res) => {
  setTimeout(() => res.end('hello'), 100);  // Non-blocking I/O
}).listen(3000);
```

### 36. Node process model, why Node is fast, single thread, libuv, event loop [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick) [shiftasia]

- **Node architecture**: **Single JS thread + event loop + libuv thread pool** (default 4 threads).
- **libuv thread pool handles** (blocking operations):
  | **Uses Pool** | **Doesn't Use Pool** |
  |---------------|---------------------|
  | File I/O (`fs.readFile`), DNS (`dns.lookup`), Crypto (`crypto.pbkdf2`), Compression (`zlib`), Native addons | Sockets, Timers, Pipes, TTY (OS async interfaces) |

- **Why fast for I/O**: **No thread-per-request blocking** like traditional servers. **Single JS thread = no locking complexity**.

**File I/O example**:
```js
// Async (libuv pool) - PREFERRED
fs.readFile('file.txt', 'utf8', (err, data) => {
  console.log('Async', data);
});
// Sync - BLOCKS event loop
const data = fs.readFileSync('file.txt', 'utf8');
```

### 37. Companies using Node and why [rapidops](https://www.rapidops.com/blog/event-loop-with-javascript/)
- **Netflix, PayPal, LinkedIn, Walmart, Uber**: API gateways, real-time systems, high-throughput web services.
- **Reasons**: **Single JS language** (frontend+backend), **excellent concurrent I/O**, **rich npm ecosystem**, **fast microservices iteration**.

### 38. Async patterns: callbacks, promises, async/await [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick) [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

**Three patterns**:
```js
// Callback: (err, result)
fs.readFile('a.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Promise
readFile('a.txt').then(data => console.log(data)).catch(console.error);

// async/await (syntactic sugar over Promises)
async function main() {
  try {
    const data = await readFile('a.txt');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### 39. `async` library, `async.series`, `async.parallel` [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)
```js
const async = require('async');

// Sequential
async.series([
  cb => fs.readFile('a.txt', cb),
  cb => fs.readFile('b.txt', cb)
], (err, results) => { /* results[0], results [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/107590478/5f0098e8-63cb-4f12-9b77-528a718b4aa7/README.md) */ });

// Concurrent
async.parallel({
  a: cb => fs.readFile('a.txt', cb),
  b: cb => fs.readFile('b.txt', cb)
}, (err, results) => { /* results.a, results.b */ });
```

### 40. `Promise.all`, `Promise.allSettled`, `Promise.any` [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
| **Method** | **Behavior** |
|------------|--------------|
| `Promise.all()` | All resolve → resolve; **Any reject → immediate reject** |
| `Promise.allSettled()` | **Always resolves** w/ `[{status, value/reason}]` array |
| `Promise.any()` | **First resolve → resolve**; All reject → `AggregateError` |

### 41. Node globals: `global`, `process`, no `window` [w3schools](https://www.w3schools.com/nodejs/nodejs_event_loop.asp)
- **`global`** (not `window`), **`process`** (PID, env, streams), **`__dirname`**, **`Buffer`**, **`require`**.

### 42. Checking npm package safety [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)
- **`npm audit`**, check **downloads/maintainers/last publish**, review source for critical deps.

### 43. How do you debug Node? [w3schools](https://www.w3schools.com/nodejs/nodejs_event_loop.asp) [geeksforgeeks](https://www.geeksforgeeks.org/node-js/node-js-event-loop/)
- **`node --inspect`**, **structured logging** (pino/winston), **profilers** (clinic.js, 0x).

### 44. Express basics: app, routing, middleware, response middleware [geeksforgeeks](https://www.geeksforgeeks.org/express-js/) [w3schools](https://www.w3schools.com/nodejs/nodejs_express.asp)
```js
const express = require('express');
const app = express();

// Routing
app.get('/users/:id', (req, res) => res.json({ id: req.params.id }));

// Middleware: req, res, next
app.use((req, res, next) => {
  res.success = data => res.json({ ok: true, data });
  next();
});
app.get('/ping', (req, res) => res.success('pong'));
```

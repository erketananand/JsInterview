## 1. What is an Execution Context?

- An execution context is an internal data structure the JS engine uses to run code: it stores variables, function declarations, parameters, the current value of `this`, and a link to the outer lexical environment. [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)  
- It is created just before a piece of code starts running: once when the program first loads (global context) and again on every function call (function context), and for `eval` calls in some engines. [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)  

Example (global + function context):

```js
// Global execution context is created here
const x = 1;

function add(y) {      // New function execution context when called
  const result = x + y;
  return result;
}

add(5); // creates a function execution context
```

## 2. How many Execution Contexts can exist?

- Only one execution context is **actively running** at a time (JavaScript is single‑threaded by design in the main thread). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  
- However, many contexts can exist in memory at once: the current one plus any suspended ones captured by closures or stored frames that the engine keeps reachable. [anuradha.hashnode](https://anuradha.hashnode.dev/scope-chain-and-lexical-environment-in-javascript)  

Example: nested calls stack up multiple contexts (see call stack in question 5).


## 3. Three types of Execution Contexts

- Global execution context: created once when the script starts; holds global variables/functions and sets up the global object (`window` in browsers, `global` in Node.js) and default `this`. [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)  
- Function execution context: created each time a function is called; holds parameters, local variables, and its own lexical environment and `arguments` object. [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)  
- Eval execution context: created when `eval()` runs code, so that evaluated code executes in its own environment (in practice `eval` is rarely recommended). [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)  


## 4. What happens in the Creation Phase?

When a new execution context is created, engines conceptually do two phases: creation, then execution. [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/) In the **creation phase**:

- A new lexical environment is created and linked to its outer environment; hoisted function declarations and `var` variables are allocated (functions get their bodies; `var` variables get `undefined`). [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)  
- The value of `this` is determined (global object in non‑strict mode for global code, `undefined` in modules/strict mode, or set by how the function is called such as `obj.method()`). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  

Example:

```js
console.log(a);   // undefined (var is hoisted)
greet();          // works (function is hoisted)

var a = 10;
function greet() {
  console.log('hi');
}
```

During creation, `a` exists but is `undefined`, and `greet` already refers to the function, which is why the calls before the declarations work.

## 5. What is the Call Stack?

- The call stack is a LIFO (last‑in, first‑out) stack where the JS engine keeps track of active execution contexts. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack)  
- When a function is called, its execution context is **pushed** onto the stack; when it returns, that context is **popped**, and execution resumes in the previous context. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack)  

Example:

```js
function first() {
  second();
}
function second() {
  third();
}
function third() {
  console.log('end');
}

first();
```

The stack evolves as: `Global → first → second → third`, then unwinds as `third` returns, then `second`, then `first`, ending back in the global context. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack)

## 6. What lives inside a Lexical Environment?

- A lexical environment is an internal object that maps identifiers (variable and function names) to their values and also stores a reference to its outer lexical environment. [dev](https://dev.to/antonzo/lexical-scope-lexical-environment-execution-context-closure-in-javascript-5bn6)  
- It typically has an environment record (bindings for `let`, `const`, `var`, function parameters, and inner function declarations) and an `outer` pointer to the environment where this code was defined. [dev](https://dev.to/antonzo/lexical-scope-lexical-environment-execution-context-closure-in-javascript-5bn6)  

Example:

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

`inner`’s lexical environment holds `b` and a reference to `outer`’s environment (which holds `a`), plus a reference further outward to the global environment. [dev](https://dev.to/antonzo/lexical-scope-lexical-environment-execution-context-closure-in-javascript-5bn6)

## 7. How does a Lexical Environment form the Scope Chain?

- Each lexical environment points to its parent (outer) environment, forming a linked list called the **scope chain**. [dev](https://dev.to/antonzo/lexical-scope-lexical-environment-execution-context-closure-in-javascript-5bn6)  
- When code looks up a variable, the engine first searches the current environment; if not found, it walks up the outer links until it finds the variable or reaches the global environment. [anuradha.hashnode](https://anuradha.hashnode.dev/scope-chain-and-lexical-environment-in-javascript)  

Example:

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

Here the scope chain for `b` is: `b` → `a` → global; that chain decides which variables are visible inside `b`. [dev](https://dev.to/antonzo/lexical-scope-lexical-environment-execution-context-closure-in-javascript-5bn6)

## 8. What if JS cannot find a variable?

- If JavaScript cannot find a variable in the current lexical environment, it walks up the scope chain; if the name is not found anywhere up to the global environment, it throws a `ReferenceError`. [anuradha.hashnode](https://anuradha.hashnode.dev/scope-chain-and-lexical-environment-in-javascript)  
- In sloppy mode (non‑strict) in older code, assigning to an undeclared variable might accidentally create a global property, but modern best practice uses strict mode and modules, where undeclared access fails. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  

Example:

```js
"use strict";

function demo() {
  console.log(notDefined); // ReferenceError
}
demo();
```

Because `notDefined` is not found in any environment, the engine throws an error.

## 9. Scope vs Execution Context

- **Scope** describes *where a variable is visible* in source code; it is a static, compile‑time concept based on where things are written (lexical scope). [anuradha.hashnode](https://anuradha.hashnode.dev/scope-chain-and-lexical-environment-in-javascript)  
- **Execution context** is the *runtime container* created while code is actually running; it uses lexical environments and the scope chain to perform variable lookups. [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)  

Example:

```js
function f() {
  let x = 1;   // x is in the scope of f
}
```

The scope of `x` is the body of `f` (this does not change). Every time `f()` runs, a **new execution context** is created, with a fresh lexical environment containing its own `x`. [coralogix](https://coralogix.com/blog/understanding-the-execution-context-in-javascript/)

## 10. How is `this` decided in a Function Execution Context?

- Inside a function execution context, `this` is set based on *how the function is called*, not where it is defined. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  
- In non‑strict functions, `this` becomes the object before the dot (`obj.method()`), the value passed to `call`/`apply`/`bind`, or the global object if the function is called “bare”; in strict mode, bare calls set `this` to `undefined`. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  

Example:

```js
function show() {
  console.log(this.name);
}

const user = { name: 'Alice', show };

show();            // 'undefined' or global name depending on mode
user.show();       // 'Alice' because this === user
show.call({ name: 'Bob' }); // 'Bob'
```

Each call creates a new function execution context with its own `this` binding. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

## 11. Why do `let` and `const` throw before initialization?

- `let` and `const` declarations are hoisted (their names are known at the top of the block), but they are not initialized until the declaration line is evaluated; from the start of the block until that line, the binding is in the **Temporal Dead Zone (TDZ)**. [ccbp](https://www.ccbp.in/blog/articles/temporal-dead-zone-in-javascript)  
- Accessing a `let`/`const` variable while it is in the TDZ causes a `ReferenceError: Cannot access 'x' before initialization`, which prevents accidental use of uninitialized values. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/temporal-dead-zone-in-javascript/)  

Example:

```js
console.log(count); // ReferenceError (TDZ)
let count = 10;
```

Here the name `count` exists but is not yet initialized, so reading it is illegal. [ccbp](https://www.ccbp.in/blog/articles/temporal-dead-zone-in-javascript)

## 12. What is the Temporal Dead Zone?

- The Temporal Dead Zone is the time between when a `let` or `const` variable is hoisted (creation of its binding) and when its declaration line runs and initializes it. [ccbp](https://www.ccbp.in/blog/articles/temporal-dead-zone-in-javascript)  
- The TDZ starts at the beginning of the block or function where the variable is declared and ends when the declaration is executed; only after that can the variable be safely read. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/temporal-dead-zone-in-javascript/)  

Example:

```js
{
  // TDZ for a starts here
  // console.log(a); // ReferenceError
  let a = 5;        // TDZ for a ends here
  console.log(a);   // 5
}
```

This behavior encourages writing code where variables are used only after they are clearly defined. [ccbp](https://www.ccbp.in/blog/articles/temporal-dead-zone-in-javascript)

## 13. Why is Execution Context the foundation of Closures?

- A closure is a function bundled with references to its surrounding lexical environment, meaning it can use variables from outer scopes even after those outer functions have finished running. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)  
- When a function returns another function, the inner function’s execution context finishes, but its lexical environment is kept alive because the returned function still references it, forming a closure. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)  

Example:

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

Although `makeCounter`’s execution context has been removed from the call stack, the closure keeps its lexical environment (and `count`) in memory, which is possible because of how execution contexts and lexical environments

## 14. Why event loop, sync‑only, execution model?

- The event loop exists so JavaScript can stay single‑threaded but still handle slow tasks (timers, network, disk, UI) without blocking the main thread. It coordinates the call stack, Web/Node APIs, and task queues to run work in a predictable order. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)
- If everything were synchronous, a long task like a big `for` loop or `fetch`ing a large file would freeze the page or Node.js process until it finished, so clicks, animations, and other requests would not respond. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) The event loop solves this by letting slow work happen via APIs while the call stack keeps processing other code.  
- JavaScript’s execution model is: run all synchronous code on a single call stack, delegate async operations to the host (browser/Node APIs), enqueue callbacks when they are ready, then the event loop moves callbacks back to the stack when it is empty. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) This creates the illusion of concurrency without multiple JS threads.  

Example:

```js
console.log('start');

setTimeout(() => {
  console.log('timer done');
}, 1000);

console.log('end');
```

Output is `start`, `end`, then `timer done` later, because the timer callback runs only after the main script has finished and the event loop pulls it from the queue. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)

## 15. Call stack and event queue difference

- The **call stack** is where JavaScript runs functions in a strict LIFO order: last function called runs first, and a function must finish (or throw) before control returns to its caller. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) This LIFO behavior keeps function execution simple and predictable.  
- The **event (task/callback) queue** stores callbacks from timers, DOM events, network requests, etc., waiting for the stack to become empty. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) The event loop repeatedly checks: if the stack is empty, it takes the next task from the queue and pushes its function onto the stack.  

Example mental model: stack = “what is executing right now”; queues = “what will run later when there is free time”. [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop)

## 16. Why Web APIs and how they interact?

- JavaScript itself cannot do networking, timers, or DOM; the browser or Node.js provides **Web APIs / Node APIs** for these operations. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) When you call `setTimeout`, `fetch`, `addEventListener`, `fs.readFile`, etc., you are asking the host to do work outside the JS engine.  
- The JS engine calls an API, then returns to the stack; once the operation completes (timer expires, data arrives, user clicks), the host puts the corresponding callback into the appropriate task queue. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) The event loop later moves that callback onto the stack so it can run.  

Example:

```js
button.addEventListener('click', () => {
  console.log('clicked');
});
```

The browser stores the listener in its event system; when a click happens, it enqueues the callback into the task queue. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)

## 17. Callback queues, macrotask vs microtask

- There are typically at least two important queues: the **macrotask queue** (often just called “task” or “callback” queue) and the **microtask queue**. [javascript](https://javascript.info/event-loop) Macrotasks include things like `setTimeout`, `setInterval`, DOM events, and certain network callbacks.  
- Microtasks are higher‑priority, small tasks used mainly for promises (`.then/.catch/.finally`), `queueMicrotask`, and MutationObserver callbacks. [javascript](https://javascript.info/event-loop) After each macrotask, the event loop drains the **entire** microtask queue before handling the next macrotask, which is why microtasks “run before” macrotasks.  

Example:

```js
console.log('script start');

setTimeout(() => console.log('timeout'), 0);   // macrotask
Promise.resolve().then(() => console.log('promise')); // microtask

console.log('script end');
```

Order: `script start`, `script end`, `promise`, `timeout`, because synchronous code runs first, then all microtasks, then macrotasks. [javascript](https://javascript.info/event-loop)

## 18. What is the event loop and its algorithm?

- The event loop is a loop in the runtime that repeatedly: checks the call stack and task queues, moves tasks to the stack when it is free, and lets rendering/update phases happen in between. [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop)  
- A simplified browser algorithm is:  
  1) Run the initial script (global code).  
  2) While true:  
     - If the stack is empty, take the next **task** from the task queue and run it.  
     - After that task finishes, run **all** microtasks in the microtask queue.  
     - Optionally update the UI (paint), then repeat. [javascript](https://javascript.info/event-loop)  

Node.js has a similar loop but with multiple phases (timers, I/O callbacks, `check` for `setImmediate`, `close` events) plus its own microtask processing. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 19. Why are promises “faster” than setTimeout, and skipping macrotasks?

- Promises feel “faster” because their callbacks run as microtasks, which the event loop processes **before** the next macrotask (like a `setTimeout` callback), even if the timeout is `0` ms. [javascript](https://javascript.info/event-loop) This gives promise handlers priority and more predictable ordering after synchronous code.  
- “Skipping macrotask when microtask exists” means that after any piece of JS finishes, the event loop drains all microtasks before picking another macrotask; if microtasks keep queuing more microtasks, they can prevent macrotasks from running for a while (this can cause microtask starvation). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

Example of observable order:

```js
setTimeout(() => console.log('timeout 0'), 0);
Promise.resolve().then(() => console.log('promise 1'))
                 .then(() => console.log('promise 2'));
```

The logs from promises appear before `timeout 0` even though the timer delay is zero. [javascript](https://javascript.info/event-loop)

## 20. Why isn’t setTimeout(0) immediate? Starvation & microtask starvation

- `setTimeout(fn, 0)` means “run `fn` after at least 0 ms, in the timer macrotask queue”, but the callback cannot run until the current stack and all pending microtasks finish, and until the event loop reaches the timers phase. [javascript](https://javascript.info/event-loop) So it is never truly “immediate”.  
- **Starvation** occurs when some tasks never get a chance to run because other tasks keep taking priority. [tr.javascript](https://tr.javascript.info/microtask-queue) **Microtask starvation** happens if microtasks continuously queue more microtasks (for example, a recursive `queueMicrotask` loop), so macrotasks like UI updates, timers, or user events are delayed indefinitely.  

Example microtask starvation:

```js
function loop() {
  queueMicrotask(loop);
}
loop();           // keeps microtask queue busy; timers never fire
```

This blocks timers and UI work even though JS is “asynchronous”. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

## 21. What is process.nextTick() in Node.js?

- In Node.js, `process.nextTick(callback)` schedules `callback` in a **special next‑tick queue** that runs **before** the regular microtask and other event loop phases. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  
- It is mainly used inside libraries to run cleanup or follow‑up logic immediately after the current function, but overusing it can also starve the rest of the loop because next‑tick callbacks run with very high priority. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

Example:

```js
console.log('start');

process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));

console.log('end');
```

Order in Node: `start`, `end`, `nextTick`, `promise` (nextTick before promise microtask). [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 22. Non‑blocking single thread and why fetch uses microtasks

- JavaScript is non‑blocking because slow operations are offloaded to the host’s I/O system or worker threads, while the main JS thread quickly returns to the call stack and continues running other code; callbacks only come back through queues when results are ready. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/) This lets one thread orchestrate many concurrent operations.  
- In browsers, `fetch` returns a Promise whose resolution callbacks run in the microtask queue, which ensures predictable, high‑priority ordering of `.then` handlers relative to timers and other tasks. [javascript](https://javascript.info/event-loop) Often, the low‑level network completion is scheduled in a task queue, and then, once data is ready, the promise resolution is queued as a microtask, giving promise chains consistent behavior. [tr.javascript](https://tr.javascript.info/microtask-queue)  

Example:

```js
console.log('start');

fetch('/data.json')
  .then(() => console.log('fetch then'));

setTimeout(() => console.log('timeout'), 0);

console.log('end');
```

Typical order in a browser after the network finishes: `start`, `end`, `fetch then`, `timeout`, because the promise microtask runs before the timer macrotask. [javascript](https://javascript.info/event-loop)

## 23. Why does the event loop exist? What if JS were only synchronous?

- JavaScript runs on a single main thread, so only one thing can execute at a time. [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop) The event loop exists so slow tasks (network, timers, disk, UI) can happen in the background without freezing that thread.  
- If JavaScript handled everything synchronously, any long operation would block the whole page or server: the UI would freeze and a Node process could not accept new requests until the current one finished. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  

Example of blocking code:

```js
// Bad: blocks for a long time
function block() {
  const start = Date.now();
  while (Date.now() - start < 5000) {} // busy 5 seconds
}

console.log('start');
block();                 // UI / server frozen here
console.log('end');
```

With async APIs, the heavy work is offloaded and a callback runs later, so the thread stays responsive. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)

## 24. What is the JavaScript execution model?

- The model is **single‑threaded** with an **event loop**: run all synchronous code on the call stack; delegate async work to host APIs; enqueue callbacks; then the event loop pulls them back when the stack is free. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  
- Runtimes (browser, Node.js) provide queues (macrotask/callback queue and microtask queue) plus APIs like timers and networking, and the event loop orchestrates everything. [javascript](https://javascript.info/event-loop)  

## 25. What is the call stack and how is it different from the event queue?

- The **call stack** is a LIFO stack that tracks which function is currently running; when a function is called it’s pushed, when it returns it’s popped. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  
- The **event (task/callback) queue** is a FIFO queue of callbacks from timers, events, and async operations waiting to run when the stack is empty. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  

Simple example:

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

console.log('C');
```

Order is `A`, `C`, then `B`: the timeout callback waits in the event queue until the stack (global code) is done, and then the event loop pushes it to the stack. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)

## 26. Why do we need Web APIs, and how do they interact with JS?

- JavaScript engines do not directly know how to talk to the network, disk, or DOM; the browser or Node.js exposes **Web APIs / Node APIs** for those tasks. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  
- When you call `setTimeout`, `fetch`, `addEventListener`, or Node’s `fs.readFile`, JS hands the work to these APIs; when they finish, they enqueue callbacks into the appropriate queue so the event loop can schedule them back on the stack. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  

Example:

```js
button.addEventListener('click', () => {
  console.log('clicked');
});
```

The browser’s event system stores the handler; when the user clicks, the browser puts the callback into the task queue, and the event loop eventually runs it. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)

## 27. What are the types of callback queue?

- At minimum there is a **macrotask (task/callback) queue** for timers, DOM events, and some I/O callbacks. [javascript](https://javascript.info/event-loop)  
- There is also a **microtask queue** for promise callbacks, `queueMicrotask`, and MutationObserver; many runtimes may have more specialized queues/phases (Node timers, check, close, etc.) but conceptually they fall under these two priorities. [javascript](https://javascript.info/event-loop)  

## 28. What is a macrotask and a microtask?

- **Macrotasks** (tasks) are “big” units scheduled by things like `setTimeout`, `setInterval`, `setImmediate` (Node), message events, and many other async APIs. [javascript](https://javascript.info/event-loop) Each macrotask runs from start to finish before the next task.  
- **Microtasks** are “small” jobs that run **after** the current script or task but **before** the event loop continues to the next macrotask; they include promise `.then/.catch/.finally` handlers and `queueMicrotask` callbacks. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

Example:

```js
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => console.log('microtask'));
```

Output: `microtask` then `macrotask`. [javascript](https://javascript.info/event-loop)

## 29. Why do microtasks run before macrotasks?

- After each script or macrotask finishes, the event loop is specified to drain **all pending microtasks** before moving on to the next macrotask. [javascript](https://javascript.info/event-loop)  
- This ensures promise chains run quickly and in a predictable order relative to other async operations, which is especially important when promises are used to model a series of steps. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

## 30. What is the event loop and its algorithm?

- The event loop is a mechanism in the runtime that continually checks the call stack and the queues to decide what to execute next. [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop)  
- A simplified browser algorithm:  
  1) Run initial script.  
  2) When the call stack is empty, take the next macrotask from the task queue and run it.  
  3) After that task completes, run all microtasks.  
  4) Possibly update the UI (render).  
  5) Repeat forever. [javascript](https://javascript.info/event-loop)  

Node’s loop has documented phases (timers, pending callbacks, poll, check, close) plus microtask processing between phases, but conceptually it is still an event loop that pulls callbacks when the stack is free. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 31. Why are promises “faster” than setTimeout, and why skip macrotask when microtask exists?

- Promises feel faster because their callbacks go into the microtask queue, which is processed before the next macrotask; a `setTimeout(fn, 0)` callback must wait for a full turn of the loop, but `.then(fn)` runs at the end of the current turn. [javascript](https://javascript.info/event-loop)  
- “Skipping macrotask when microtask exists” describes the rule that the event loop always drains the microtask queue **completely** before picking the next macrotask; if microtasks keep adding more microtasks, macrotasks (like timers and UI events) are delayed. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

## 32. Why is setTimeout(0) not immediate?

- `setTimeout(fn, 0)` schedules `fn` as a timer macrotask that cannot run until the current call stack is empty and all microtasks are processed, and until the loop’s timers phase is reached. [javascript](https://javascript.info/event-loop)  
- Browsers also enforce minimum delays for nested timers, so `0` is a *minimum* wait, not “run now”. [javascript](https://javascript.info/event-loop)  

Example:

```js
setTimeout(() => console.log('timeout'), 0);
for (let i = 0; i < 1e8; i++) {}  // heavy loop
console.log('done loop');
```

`timeout` prints only after the loop completes, even though the delay was 0. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)

## 33. What is starvation and microtask starvation?

- **Starvation** means some work never gets CPU time because higher‑priority work keeps running first. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)  
- **Microtask starvation** happens when microtasks continuously schedule more microtasks (e.g., a recursive `queueMicrotask` pattern), so the loop never gets back to macrotasks like timers or repainting the UI. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

Example:

```js
function loop() {
  queueMicrotask(loop);
}
loop(); // Starves timers & rendering
```

This keeps the microtask queue non‑empty, blocking macrotasks. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

## 34. What is process.nextTick()?

- In Node.js, `process.nextTick(cb)` schedules `cb` to run **after the current function** but **before** the event loop continues to the next phase, even before regular microtasks. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  
- It is often used by libraries to finish internal work or emit events after setting things up, but overuse can block the loop because `nextTick` callbacks can run repeatedly before timers or I/O. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

Example order in Node:

```js
console.log('start');

process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
setTimeout(() => console.log('timeout'), 0);

console.log('end');
```

Order: `start`, `end`, `nextTick`, `promise`, `timeout`. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 35. Why is JavaScript non‑blocking despite being single‑threaded?

- Non‑blocking behavior comes from offloading operations to the host environment’s I/O and worker threads while the main JS thread keeps running other code; callbacks only return to JS when results are ready through queues. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  
- Because the event loop only runs callbacks when the stack is free, one thread can orchestrate many concurrent operations without having multiple JS threads. [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop)  

Typical async server pattern in Node:

```js
const http = require('http');

http.createServer((req, res) => {
  // Non-blocking I/O
  setTimeout(() => {
    res.end('hello');
  }, 100);
}).listen(3000);
```

The single thread can handle many clients because timers and I/O

Here is a concise, accurate answer key for all questions extracted from the interview description. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/107590478/d353defb-bf72-48dd-bb45-86af3a12ae59/1000113784.jpg)

## 36. Node process model, why Node is fast, single thread, libuv, event loop

- Node uses a **single JavaScript thread** with an **event loop** plus a background thread pool (from **libuv**) for I/O and some CPU tasks. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick) This avoids the heavy OS thread-per-request model used by many traditional servers.  
- Node is often faster for I/O‑heavy workloads because non‑blocking I/O lets one process handle many connections concurrently instead of blocking a thread per request. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

Short explanation points:  
- Single JS thread: no locking between JS threads; simpler concurrency. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  
- libuv thread pool: handles file I/O, DNS, some crypto, compression. [nodejs](https://nodejs.org/ja/learn/asynchronous-work/event-loop-timers-and-nexttick)  
- Event loop: picks callbacks when operations complete; keeps Node responsive under high load. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

## 37. Companies using Node and why

- Large companies like Netflix, PayPal, LinkedIn, Walmart, and Uber use Node for API gateways, real‑time systems, and high‑throughput web services. [rapidops](https://www.rapidops.com/blog/event-loop-with-javascript/)  
- Typical reasons: single language (JS) on front‑end and back‑end, excellent handling of many concurrent I/O‑bound requests, rich npm ecosystem, and fast iteration for microservices. [rapidops](https://www.rapidops.com/blog/event-loop-with-javascript/)  

## 38. Async patterns: callbacks, promises, async/await

- Node is asynchronous by default; to “execute code synchronously” you either:  
  - Use the synchronous versions of some APIs (e.g. `fs.readFileSync`) only in scripts or bootstrapping, or  
  - Chain async work via callbacks, promises, or `async/await` so logical steps appear sequential while I/O stays non‑blocking. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

Key patterns:  
- **Callback**: function passed as argument and called later with `(err, result)`.

  ```js
  fs.readFile('a.txt', 'utf8', (err, data) => {
    if (err) return console.error(err);
    console.log(data);
  });
  ```
- **Promise**: object representing future result.

  ```js
  readFile('a.txt')       // returns a Promise
    .then(data => console.log(data))
    .catch(console.error);
  ```
- **async/await**: syntax over promises.

  ```js
  async function main() {
    try {
      const data = await readFile('a.txt');
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }
  ```

- Async/await vs promises: promises are the underlying primitive; async/await makes promise chains look synchronous and easier to read, but error handling still uses try/catch around awaited calls. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)  

## 39. `async` library, `async.series`, `async.parallel`

- The `async` npm package provides utilities for composing callback‑style async functions (especially before promises became common). [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)  
- `async.series(tasks, cb)` runs an array/object of async functions **one after another**, passing each result to the final callback.  
- `async.parallel(tasks, cb)` starts all tasks at once and calls the final callback when they are all complete or one fails.  

Example:

```js
const async = require('async');

async.series([
  cb => fs.readFile('a.txt', cb),
  cb => fs.readFile('b.txt', cb),
], (err, results) => { /* results[0], results [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/107590478/d353defb-bf72-48dd-bb45-86af3a12ae59/1000113784.jpg) */ });

async.parallel({
  a: cb => fs.readFile('a.txt', cb),
  b: cb => fs.readFile('b.txt', cb),
}, (err, results) => { /* results.a, results.b */ });
```

***

## 40. `Promise.all`, `Promise.allSettled`, `Promise.any`

- `Promise.all(iterable)` resolves when **all** promises resolve, or rejects immediately if **any** promise rejects; useful when all results are required. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)  
- `Promise.allSettled(iterable)` always resolves, giving an array of `{status, value|reason}` objects for each promise; ideal when each task’s outcome matters independently. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)  
- `Promise.any(iterable)` resolves as soon as **the first promise fulfills**, and rejects only if all promises reject (with `AggregateError`). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)  

## 41. Node globals: `global`, `process`, no `window`

- In Node the main global object is `global`, not `window` (which is browser‑specific). [w3schools](https://www.w3schools.com/nodejs/nodejs_event_loop.asp)  
- Key Node globals: `global`, `process`, `__dirname`, `__filename`, `setTimeout`, `setInterval`, `Buffer`, `console`, `require`, `module`, etc. [geeksforgeeks](https://www.geeksforgeeks.org/node-js/node-js-event-loop/)  
- `process` holds info about the running process (PID, env, argv) and provides methods like `exit`, `on('uncaughtException')`, `nextTick`, and streams `stdin`, `stdout`, `stderr`. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

## 42. Checking npm package safety

Practical steps:

- Check package metadata: weekly downloads, number of maintainers, last publish date, and repository activity. [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)  
- Use tools:  
  - `npm audit` or `npm audit --production` to scan for known vulnerabilities. [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)  
  - `npm view <pkg> versions` to ensure you are not pulling a suspicious new version.  
- Review source for small or critical packages (e.g. auth middleware) and avoid packages with obfuscated/minified source in the repo.  

## 43. How do you debug Node?

Useful techniques:

- Run with the built‑in inspector: `node --inspect index.js`, then attach Chrome DevTools or VS Code to set breakpoints and step through code. [w3schools](https://www.w3schools.com/nodejs/nodejs_event_loop.asp)  
- Use `console.log`/`console.error` for quick checks, but prefer structured logging (e.g. `pino`, `winston`) with correlation IDs for real services. [geeksforgeeks](https://www.geeksforgeeks.org/node-js/node-js-event-loop/)  
- For production debugging, enable proper logging, capture stack traces, and use APM/profilers (e.g. `clinic`, `0x`) when needed.  

## 44. Express basics: app, routing, middleware, response middleware

- Express is a minimal web framework for Node that wraps the HTTP server and provides routing and middleware support. [geeksforgeeks](https://www.geeksforgeeks.org/node-js/node-js-event-loop/)  
- Routing: order matters; you define handlers for HTTP methods and paths.

  ```js
  const express = require('express');
  const app = express();

  app.get('/users/:id', (req, res) => {
    res.json({ id: req.params.id });
  });
  ```
- Middleware is a function with signature `(req, res, next)` that can read/modify request, response, or end the response. [w3schools](https://www.w3schools.com/nodejs/nodejs_event_loop.asp)  
- You can use “middleware on response” by either writing middleware that **ends** the response (e.g. error handler, compression) or by adding custom methods on `res` before the route handlers.

  ```js
  app.use((req, res, next) => {
    res.success = data => res.json({ ok: true, data });
    next();
  });

  app.get('/ping', (req, res) => res.success('pong'));
  ```

## 45. Event‑driven development, `EventEmitter`, exception handling

- Node embraces **event‑driven** design: many core APIs emit events instead of returning values once. [geeksforgeeks](https://www.geeksforgeeks.org/node-js/node-js-event-loop/)  
- `EventEmitter` is a core class (`require('events')`) used for custom events.

  ```js
  const EventEmitter = require('events');
  const bus = new EventEmitter();

  bus.on('user:created', user => console.log('user', user));
  bus.emit('user:created', { id: 1 });
  ```
- For exceptions:  
  - Catch expected errors with try/catch or promise `.catch`.  
  - Listen to `process.on('uncaughtException')` and `process.on('unhandledRejection')` only to log and perform a **graceful shutdown**; do not continue normal operation after such errors. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

## 46. APIs using methods other than GET and POST

- RESTful APIs often use:  
  - `PUT` to completely replace a resource.  
  - `PATCH` to partially update.  
  - `DELETE` to remove resources.  
- In Express:

  ```js
  app.put('/users/:id', updateUser);
  app.patch('/users/:id', patchUser);
  app.delete('/users/:id', deleteUser);
  ```

These methods are supported by browsers via `fetch`/XHR and widely used for clean API design. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)

## 47. npm vs Yarn

- Both are JavaScript package managers; npm is the default with Node; Yarn was initially faster and had better lockfile behavior; npm later added similar features (`package-lock.json`, workspaces). [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)  
- Most modern projects can use either; the key is to stick to one consistently and commit the lockfile for reproducible installs. [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)  

## 48. `package.json`, dev vs prod dependencies, environment detection

- `package.json` describes your Node project: name, version, scripts, dependencies, devDependencies, engines, main/module entry, etc. [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)  
- `dependencies` are needed at runtime; `devDependencies` only for development/testing (e.g. Jest, ESLint).  
- Node typically uses `process.env.NODE_ENV` to distinguish environments (`development`, `production`, `test`); bundlers and frameworks read this to enable optimizations or debug features. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

Example script:

```json
"scripts": {
  "start": "NODE_ENV=production node server.js",
  "dev": "NODE_ENV=development nodemon server.js"
}
```

## 49. LTS meaning

- LTS stands for **Long‑Term Support**: Node LTS releases receive security and bug‑fix support for a longer period and are recommended for production deployments. [github](https://github.com/nodejs/nodejs.org/blob/main/apps/site/pages/en/learn/asynchronous-work/event-loop-timers-and-nexttick.md)  

## 50. Localization and subprocesses in Node

- Localization is usually done with libraries like `i18next`, `node-polyglot`, or `intl-messageformat`; you load translations per locale and format messages/dates/numbers accordingly. [w3docs](https://www.w3docs.com/learn-javascript/event-loop-microtasks-and-macrotasks.html)  
- Subprocesses: Node’s `child_process` module lets you spawn external binaries and capture their output.

  ```js
  const { execFile } = require('child_process');

  execFile('mybinary', ['--flag'], (err, stdout, stderr) => {
    if (err) return console.error(err);
    console.log(stdout);
  });
  ```

For heavy CPU work you can also use `worker_threads` to avoid blocking the main event loop. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 51. Why does the Event Loop exist?

The event loop exists so JavaScript can stay **single‑threaded** but still handle many slow operations (network, timers, disk, UI) without blocking the main thread. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model) It connects three things: the call stack (running code), the Web/Node APIs (do real work), and queues (store callbacks), so JS can respond to new events while old operations are still in progress. [greatfrontend](https://www.greatfrontend.com/questions/quiz/what-is-event-loop-what-is-the-difference-between-call-stack-and-task-queue)

## 52. What if JavaScript handled everything synchronously only?

If every operation were synchronous:

- A long loop or a slow network request would block the entire thread until it finished; the browser UI would freeze and a Node.js server could not accept new requests. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  
- Users would see “page not responding”, and throughput on the server would be terrible because each request would monopolize the thread. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  

Example of blocking:

```js
function block5s() {
  const start = Date.now();
  while (Date.now() - start < 5000) {} // busy wait
}

console.log('start');
block5s();           // everything is frozen here
console.log('end');
```

The async model plus the event loop avoids this by letting slow work happen in Web/Node APIs while JS keeps running other code. [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop)

## 53. What is JavaScript execution model (foundation)?

The JavaScript execution model is:

- Single call stack executing one piece of JS at a time, in order. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  
- Asynchronous operations are delegated to the environment (browser/Node APIs).  
- When those operations complete, the environment queues callbacks in **task/microtask queues**.  
- The event loop pulls items from these queues and pushes them onto the stack when it is empty. [javascript](https://javascript.info/event-loop)  

So JavaScript itself is single‑threaded, but the host can use multiple threads internally and feed results back via the event loop. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 54. What is Call Stack and why does it run only on LIFO?

The call stack is a stack data structure where the engine tracks which functions are currently executing. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  

- When a function is called, its frame is **pushed** onto the stack.  
- When it returns or throws, the frame is **popped** off. [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop)  

It uses LIFO (Last In, First Out) so that:

- A function must finish before its caller continues, which matches how nested function calls work in code. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  
- The engine can easily know “where to go back” after each function returns.  

Example:

```js
function a() { b(); }
function b() { c(); }
function c() { console.log('done'); }

a();
```

Stack: `global → a → b → c`, then unwinds `c → b → a → global` again.

## 55. What is the difference between Call Stack and Event Queue?

- **Call Stack**  
  - Holds currently executing functions.  
  - Runs synchronously; only one frame at the top executes at any time. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)  

- **Event / Task Queue**  
  - Holds callbacks from timers, DOM events, network, etc., that are ready to run but waiting for the stack to be empty. [greatfrontend](https://www.greatfrontend.com/questions/quiz/what-is-event-loop-what-is-the-difference-between-call-stack-and-task-queue)  
  - The event loop moves one task at a time from the queue to the stack.  

Example:

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

console.log('C');
```

Order: `A`, `C`, then `B`. The timeout callback sits in the queue until the stack is empty; then the event loop pushes it onto the stack. [javascript](https://javascript.info/event-loop)

## 56. Why do we need Web APIs?

Web APIs (or Node APIs) do things the JS engine itself cannot:

- Talking to the network (`fetch`, XHR, sockets), scheduling timers (`setTimeout`), working with DOM events, etc. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)  
- They perform these operations asynchronously, and when done they schedule callbacks into the relevant queue so JS can react later. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  

Without Web/Node APIs, JavaScript would only be able to compute in memory and could not interact with the outside world.

## 57. How do Web APIs interact with JavaScript code?

1. Your JS code calls an API:

   ```js
   setTimeout(() => console.log('timer'), 1000);
   ```

2. The browser’s timer system starts a 1‑second timer **outside** the JS engine. [geeksforgeeks](https://www.geeksforgeeks.org/javascript/what-is-an-event-loop-in-javascript/)  
3. After 1 second, the timer system puts the callback into the **task (macrotask) queue**. [javascript](https://javascript.info/event-loop)  
4. When the call stack is empty, the event loop takes the callback from the queue and pushes it onto the stack; only then does your callback execute. [javascript](https://javascript.info/event-loop)  

This pattern is similar for `fetch`, DOM events, Node I/O, etc.

## 58. What are the types of callback queue?

In practice you mainly deal with two:

- **Macrotask (Task / Callback) Queue**  
  - For tasks such as: initial script execution, `setTimeout`, `setInterval`, DOM events, some network events, and in Node, timers and some I/O phases. [javascript](https://javascript.info/event-loop)  

- **Microtask Queue**  
  - For promise `.then/.catch/.finally` callbacks and `queueMicrotask` and MutationObserver callbacks. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

Node.js also has a special **next‑tick queue** (`process.nextTick`), which runs even before other microtasks, but conceptually it is another high‑priority microtask queue. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 59. What is a macrotask and what is a microtask?

- **Macrotask**  
  - A complete unit of work like “run this script” or “run this timer callback”.  
  - Added by things like `setTimeout`, `setInterval`, message events, I/O events. [javascript](https://javascript.info/event-loop)  
  - Only **one** macrotask is processed per event‑loop tick before checking microtasks again. [programfarmer](https://www.programfarmer.com/en-US/articles/2021/javascript-browser-event-loop)  

- **Microtask**  
  - A smaller follow‑up job that should run **before** the event loop moves to the next macrotask.  
  - Added by promise reactions and `queueMicrotask`. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

Example:

```js
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => console.log('microtask'));
```

Output: `microtask` then `macrotask`, because microtasks run after the current script but before the next macrotask. [javascript](https://javascript.info/event-loop)

## 60. Why does microtask run before macrotask?

The event‑loop algorithm says:

- After a script or a macrotask finishes, **run all microtasks in the microtask queue** before picking the next macrotask. [javascript](https://javascript.info/event-loop)  
- If a microtask schedules more microtasks (e.g. inside `.then` you create another `.then`), those new ones also run before leaving microtask processing. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

This priority:

- Makes promise chains predictable and fast.  
- Ensures any code that depends on a promise finishing can run immediately afterward without waiting for unrelated timers or events.

## 61. What is the Event Loop?

The event loop is the coordinator that:

- Watches the call stack and the queues.  
- Whenever the stack is empty, it chooses work:  
  - First, it takes a **macrotask** from the task queue and executes it.  
  - Then, it drains the **microtask queue**.  
  - Then, it may let the browser render before repeating. [javascript](https://javascript.info/event-loop)  

In Node.js, the loop has documented phases (timers, pending callbacks, poll, check, close) but the idea is the same: drive callbacks when the stack is free. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 62. What is the actual Event Loop algorithm (simplified)?

For browsers, a commonly used simplified model is: [javascript](https://javascript.info/event-loop)

1. Take the next macrotask from the task queue (for example, the initial `<script>` or a timer callback).  
2. Run it to completion on the call stack.  
3. **While the microtask queue is not empty:**  
   - Dequeue the next microtask and run it.  
4. If needed, perform rendering/paint.  
5. If there is another macrotask, go to step 1; otherwise wait until one appears.  

Node.js additionally:

- Processes the `process.nextTick` queue after each callback, then microtasks, inside and between phases. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 63. Why are promises faster than `setTimeout`?

“Faster” here means “their callbacks run sooner”:

- Promise callbacks go into the **microtask queue**, which is processed right after the current script/macro task ends. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  
- `setTimeout(fn, 0)` puts `fn` into the **macrotask queue** for a future tick; it must wait for all microtasks to finish and for the event loop to reach the timers phase. [javascript](https://javascript.info/event-loop)  

Example:

```js
setTimeout(() => console.log('timeout 0'), 0);

Promise.resolve()
  .then(() => console.log('promise then'));
```

Output: `promise then` then `timeout 0`. [javascript](https://javascript.info/event-loop)

## 64. Why does JavaScript skip macrotask when microtask exists?

JavaScript does not exactly “skip” macrotasks, but it **always finishes all microtasks first**:

- After each macrotask, the runtime checks the microtask queue and keeps running microtasks until the queue is empty. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  
- Only then does it take the next macrotask. If microtasks continuously schedule more microtasks, normal tasks (like timers and user events) are delayed; this is called microtask starvation. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

So macrotasks are never skipped; they are just postponed until there are no pending microtasks.

## 65. Why is `setTimeout(0)` not immediate?

`setTimeout(fn, 0)` means “run `fn` **after at least 0 ms**, in the timer macrotask queue”, but:

- The callback cannot run until the current stack is empty and all microtasks have been processed. [javascript](https://javascript.info/event-loop)  
- Browsers also enforce minimum timer resolutions, especially for nested timers and background tabs. [javascript](https://javascript.info/event-loop)  

So `setTimeout(0)` always runs **later**, on the next event‑loop tick at the earliest.

## 66. What is starvation and microtask starvation?

- **Starvation**: some tasks never get CPU time because other tasks keep being preferred or re‑queued ahead of them. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)  
- **Microtask starvation**: microtasks repeatedly schedule more microtasks so the loop never returns to macrotasks (timers, UI events, rendering). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

Example of microtask starvation:

```js
function loop() {
  queueMicrotask(loop);
}
loop(); // blocks timers & paints
```

Because the microtask queue is never empty, macrotasks cannot run.

## 67. What is `process.nextTick()`?

In Node.js:

- `process.nextTick(callback)` schedules `callback` in a special **next‑tick queue** that runs **after the current JavaScript call stack completes but before any other microtasks or event‑loop phases**. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  
- This is useful for quick follow‑up logic (e.g. emitting events after a constructor finishes), but overuse can starve the event loop similar to microtasks. [blog.logrocket](https://blog.logrocket.com/complete-guide-node-js-event-loop/)  

Example order in Node:

```js
console.log('start');

process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
setTimeout(() => console.log('timeout'), 0);

console.log('end');
```

Typical output: `start`, `end`, `nextTick`, `promise`, `timeout`. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 68. Why is JavaScript non‑blocking despite being single‑threaded?

JavaScript appears non‑blocking because:

- Slow operations are handled by the host’s I/O system or worker threads (libuv thread pool in Node, browser subsystems) while JS quickly returns to the event loop. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  
- The event loop runs callbacks only when results are ready and the stack is free, allowing one thread to orchestrate many concurrent operations. [developer.mozilla.org.cach3](https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/EventLoop)  

So concurrency comes from the environment and event loop, not from multiple JavaScript threads.

## 69. Why does `fetch()` use the microtask queue?

In browsers:

- `fetch()` returns a **Promise**; when the network response arrives and is processed, the promise is fulfilled or rejected. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)  
- Promise handlers (`.then/.catch/.finally`) are queued as **microtasks**, so they run quickly after the current script/macro task, before timers and other tasks. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  

This gives `fetch` chains:

- A predictable ordering (promise callbacks before unrelated timers).  
- Low latency between the moment data is ready and the moment your `.then` code runs.

Example:

```js
console.log('start');

fetch('/data.json')
  .then(() => console.log('fetch then'));

setTimeout(() => console.log('timeout'), 0);

console.log('end');
```

After the response completes, typical order: `start`, `end`, `fetch then`, `timeout`. [javascript](https://javascript.info/event-loop)

## 70. Is file I/O async or sync in Node?

- The `fs` module has both forms:  
  - Async: `fs.readFile`, `fs.writeFile`, `fs.open`, etc. (take a callback or return a Promise). [nodejs](https://nodejs.org/api/fs.html)  
  - Sync: `fs.readFileSync`, `fs.writeFileSync`, etc. (block the event loop until done). [nodejs](https://nodejs.org/api/fs.html)  
- In real apps you almost always use the async versions so the main thread stays free to handle other requests while disk work happens in the libuv thread pool. [shiftasia](https://shiftasia.com/community/understanding-the-thread-pool-and-libuv-in-node-js/)  

Example:

```js
// Async – preferred
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log('Async:', data);
});

// Sync – blocks the event loop
const data = fs.readFileSync('file.txt', 'utf8');
console.log('Sync:', data);
```

Async version returns immediately and your callback runs later; sync version freezes the event loop until the OS finishes the read.

## 71. Does async file I/O run in Node APIs and go back via a queue?

Yes.

- When you call an async `fs` function, Node passes the operation to **libuv**, which queues it to the shared thread pool. [shiftasia](https://shiftasia.com/community/understanding-the-thread-pool-and-libuv-in-node-js/)  
- A worker thread performs the blocking OS file call in the background; when it finishes, libuv posts the completion back into the event loop. [shiftasia](https://shiftasia.com/community/understanding-the-thread-pool-and-libuv-in-node-js/)  
- At the appropriate event‑loop phase (poll / I/O callbacks), Node pushes your file‑I/O callback onto the call stack as a **macrotask**. [blog.logrocket](https://blog.logrocket.com/complete-guide-node-js-event-loop/)  

So the path is: JS call → Node API → libuv thread pool → result → event‑loop I/O phase → callback enqueued (macrotask) → executed on main thread. [shiftasia](https://shiftasia.com/community/understanding-the-thread-pool-and-libuv-in-node-js/)

## 72. Which async callbacks go to microtask queue vs macrotask queue?

#### Microtask queue (higher priority)

These run **after the current macrotask** but **before** the next one:

- Promise reactions: `.then`, `.catch`, `.finally` (both browser and Node). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  
- `queueMicrotask` callbacks (browser / Node 11+). [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)  
- In Node, the “microtask domain” also includes:  
  - `process.nextTick` (actually a separate next‑tick queue that is drained before promise microtasks, but conceptually the same priority band). [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)  

Example:

```js
Promise.resolve().then(() => console.log('promise microtask'));
queueMicrotask(() => console.log('queueMicrotask'));
```

Both log messages run before any pending timers or I/O callbacks.

#### Macrotasks (a.k.a. tasks / callback queue)

These are processed one per event‑loop tick, then microtasks are drained:

- Timers: `setTimeout`, `setInterval`. [stackoverflow](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)  
- In Node: `setImmediate`, many I/O callbacks (like `fs.readFile` completion), and some other stages (timers, poll, check, close callbacks). [ollayor](https://www.ollayor.uz/blog/node-js-event-loop-microtasks-vs-macrotasks-explained-with-fun)  
- In browsers: DOM events, `message` events, some network events, etc. [stackoverflow](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)  

Example demonstrating order:

```js
const fs = require('fs');

setTimeout(() => console.log('timeout (macrotask)'), 0);

fs.readFile(__filename, () => {
  console.log('fs.readFile callback (macrotask)');
});

Promise.resolve().then(() => console.log('promise (microtask)'));
process.nextTick(() => console.log('nextTick (microtask-like)'));
```

Typical Node order:

1) `nextTick` (next‑tick queue)  
2) `promise` (microtask queue)  
3) one of the macrotasks (e.g., timers / I/O), depending on which phase is ready next. [nodejs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

So:

- **Async file I/O callbacks** → macrotask (I/O phase).  
- **Timer callbacks** → macrotask (timers/check phases).  
- **Promise / `queueMicrotask` / `process.nextTick` callbacks** → microtasks (with `nextTick` slightly higher priority than promises in Node). [stackoverflow](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)

## 73. Does network I/O use the libuv thread pool?

- For TCP/UDP/HTTP sockets, libuv usually talks directly to the OS’s async network APIs, so no extra worker thread is needed. [stackoverflow](https://stackoverflow.com/a/56537297)  
- The OS manages the NIC and buffers; when data arrives or a socket becomes writable, the kernel wakes the event loop thread, which then queues the corresponding callbacks (e.g., your `'data'` handler) as macrotasks in the I/O phase. [github](https://github.com/nodejs/node/issues/22468)  

The main exception is **DNS lookups via `dns.lookup`**, which often *do* use the thread pool because many platforms only expose blocking DNS APIs. [github](https://github.com/nodejs/node/issues/22468)

## 74. What does the libuv thread pool actually execute?

According to libuv docs and Node maintainers, the shared thread pool (default 4 threads) is used for these kinds of work: [docs.libuv](https://docs.libuv.org/en/latest/threadpool.html)

- File system operations (most of `fs.*` async methods: `fs.readFile`, `fs.writeFile`, `fs.stat`, etc.). [nodejs](https://nodejs.org/api/fs.html)  
- DNS helper functions like `dns.lookup` / `getaddrinfo` / `getnameinfo` when the OS doesn’t provide fully async versions. [docs.rajandangi.com](https://docs.rajandangi.com.np/nodejs/thread-pool-in-libuv/)  
- CPU‑heavy or blocking operations from core modules, for example:  
  - Cryptography (`crypto.pbkdf2`, `crypto.scrypt`, `crypto.randomBytes` when large). [github](https://github.com/nodejs/node/issues/22468)  
  - Compression/decompression (`zlib.gzip`, `zlib.deflate`, etc.). [shiftasia](https://shiftasia.com/community/understanding-the-thread-pool-and-libuv-in-node-js/)  
- User code scheduled via `uv_queue_work` (and, in Node, native addons that offload custom work to the pool). [docs.libuv](https://docs.libuv.org/en/latest/threadpool.html)  

Everything else that is I/O but has a proper async kernel interface (sockets, pipes, TTY, some timers) is handled directly by the event loop thread without using the pool. [github](https://github.com/nodejs/node/issues/22468)

#### Mental model

- **Network sockets** → OS async I/O → libuv event loop waits for readiness → callbacks scheduled as macrotasks (no thread‑pool worker). [stackoverflow](https://stackoverflow.com/a/56537297)  
- **File, DNS, crypto, zlib, addon work** → libuv thread pool → worker thread does the blocking call → completion posted back to event loop → callbacks scheduled as macrotasks in the appropriate phase. [shiftasia](https://shiftasia.com/community/understanding-the-thread-pool-and-libuv-in-node-js/)

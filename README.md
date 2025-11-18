# JavaScript Notes

## Primitive Types

- **Number:** 64-bit floating point values.
- **String:** Text, enclosed in `""` or `''` (no difference).
- **Boolean:** `true` or `false`.
- **undefined:** Default value for unassigned variables.
- **null:** Represents empty value, explicitly assigned.
- **BigInt:** Introduced in ES2020 for numbers larger than `2^53 - 1`; limited by heap size.
- **Symbol:** Unique, immutable value, often used for object property keys.

## Non-Primitive Types

- **Object:** Key-value collections.
- **Array:** Ordered list of values (special type of object).
- **Function:** First-class objects, can be passed around and invoked.

---

## Variable Declarations: `var`, `let`, `const`

| Feature             | `var`              | `let`          | `const`         |
|---------------------|--------------------|----------------|-----------------|
| Re-declaration      | Allowed            | Not allowed    | Not allowed     |
| Scope               | Function           | Block          | Block           |
| Hoisting            | Yes (initialized as `undefined`) | Yes (TDZ) | Yes (TDZ)      |
| Temporal Dead Zone  | No                 | Yes            | Yes             |
| Reassignment        | Yes                | Yes            | No              |

- **TDZ:** Variables declared with `let`/`const` cannot be accessed before their declaration.
- **`const`:** Can’t reassign, but object or array contents can be mutated.

---

## Type Checking

- **`typeof`:** Returns string with data type.
- **`instanceof`:** Checks if an object is an instance of a constructor/class.

---

## Spread Operator & Rest Parameter

- **Spread `...`:** Spreads iterable (array/object) into individual elements. Used in function calls, array/object literals, etc.
    ```js
    const arr1 = [1, 2];
    const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]
    const obj1 = {a:1};
    const obj2 = {...obj1, b:2}; // {a:1, b:2}
    ```
- **Rest `...`:** Collects remaining function arguments into an array.
    ```js
    function foo(a, ...rest) {
      return rest;
    }
    foo(1, 2, 3); // [2,3]
    ```

---

## Destructuring Assignment

- Allows unpacking properties from objects/arrays into distinct variables.
    ```js
    // Array destructuring
    const [a, b] = [1, 2];
    // Object destructuring
    const {x, y} = {x: 10, y: 20};
    // Nested destructuring and defaults
    const [first, , third = 5] = [1, 2];
    ```

- Can destructure function parameters:
    ```js
    function greet({name, age}) { return `Hi ${name}, age ${age}` }
    ```

---

## Functions, Higher-order Functions, Closures

- **Higher-Order Function:** Takes or returns another function.
- **Closure:** Inner functions remember their lexical scope even after the outer function has finished.

---

## Asynchronous Patterns

### 1. Callbacks

- Functions as arguments to async operations.
- **Problems:** Callback hell (nested), inversion of control, difficult debugging.

### 2. Promises

- Represent an eventual value (async).
- Resolve or reject; chaining with `.then()`, `.catch()`.
- **Issues solved:** Chaining, flatter code structure, explicit error handling, microtask queue execution.

### 3. Async/Await

- Syntactic sugar over promises.
- Code appears synchronous; improved readability.
- Await can only be used inside `async` functions.

---

## Event Loop, Microtask, and Callback Queue

- **CallStack:** Runs synchronous JS code.
- **Node APIs/Browsers:** Handle async tasks (I/O, timers, etc.).
- **Callback Queue:** Callbacks from timers, DOM events, etc.
- **Microtask Queue:** Jobs from promises, mutation observers; has priority over callback queue.
- **Event Loop:** Checks for empty callStack, pushes tasks from queues as appropriate.
- **Execution Priority:** Microtask queue → Callback queue → Rendering tasks.

- **Microtasks run after each task, before UI render or pending callbacks.**
- Promises and mutation observers use microtasks, setTimeout/callbacks use callback/task queue.

---

## `this` Context

- **Global context:** `this` refers to global object (browser: `window`, Node: `global`).
- **Object method:** `this` refers to the object the method was called on.
- **Function (non-arrow):** In strict mode, `this` is `undefined`; outside, it is global.
- **Arrow functions:** Inherit `this` from parent scope at the time of definition, not invocation.
- **Event listeners:** `this` refers to the DOM element.
- **Manual binding:** Use `.call`, `.apply`, `.bind` to set `this`.

    ```js
    function normal() { return this; }
    const arrow = () => this;
    ```

---

## Advanced Questions & Answers

### Q1. **How do spread and rest differ in syntax and use?**
- **A:** Both use `...`, but spread expands elements (e.g., `[...arr]`, `{...obj}`), while rest collects remaining function arguments into an array (`function f(...args)`).

### Q2. **What problem does destructuring solve, and how is it used?**
- **A:** Destructuring extracts values from arrays/objects directly into variables, making code concise and readable, especially for function parameters and multiple assignments.

### Q3. **Describe how Promises and async/await improve async handling over callbacks.**
- **A:** Promises allow chaining and flattening of code structure, explicit error propagation and microtask prioritization. Async/await further simplifies syntax by making asynchronous code resemble synchronous flow, handling errors via try/catch.

### Q4. **What is the difference between microtask and callback queues in the event loop?**
- **A:** Microtasks (promise callbacks, mutation observers) run immediately after the current task, before any render or callback queue tasks. Callback/task queues (setTimeout, DOM events) run after microtasks.

### Q5. **How does `this` behave in arrow vs normal functions?**
- **A:** Arrow functions capture `this` from their lexical scope at declaration time; normal functions set `this` at invocation (object, DOM, global, etc.).

### Q6. **What are strategies for handling lost `this` context?**
- **A:** Use `.bind`, `.call`, or `.apply` to explicitly set context, or define functions as arrow functions to preserve lexical scope.

### Q7. **Give an example of destructuring nested objects with default values.**
- **A:**
    ```js
    const obj = { foo: { bar: 42 } };
    const { foo: { bar, baz = 'default' } } = obj; // bar=42, baz='default'
    ```

### Q8. **Why do promises execute their callbacks before setTimeout callbacks?**
- **A:** Promise resolution callbacks go into the microtask queue, which is processed before the callback/task queue, thus ensures earlier execution after stack is clear.

### Q9. **What are the rules for using rest parameters in functions?**
- **A:** Only one rest parameter allowed, must be the last parameter, and collects remaining arguments into an array.

### Q10. **How can event loop issues cause race conditions or deadlocks in JS?**
- **A:** Poorly handled async flow (multiple callbacks, microtasks, long synchronous code) can delay or block execution, miss events, or produce unpredictable results if not carefully managed, especially when mixing async patterns.

---

## Further Reading

- [Spread Operator & Rest Parameter](https://medium.com/free-code-camp/spread-operator-and-rest-parameter-in-javascript-es6-4416a9f47e5e)
- [Destructuring Assignment](https://javascript.info/destructuring-assignment)
- [Callbacks, Promises, and Async/Await](https://medium.com/front-end-weekly/callbacks-promises-and-async-await-ad4756e01d90)
- [Event Loop & Microtasks](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [Understanding this in JavaScript](https://www.freecodecamp.org/news/what-to-do-when-this-loses-context-f09664af076f/)
- [Arrow Functions and this](https://www.codementor.io/@dariogarciamoya/understanding-this-in-javascript-with-arrow-functions-gcpjwfyuc)